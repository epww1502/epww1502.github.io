'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Stat } from './LabPage';

/** Same size as an Excel sheet: 17,179,869,184 cells. */
const ROWS = 1_048_576;
const COLS = 16_384;
const ROW_H = 24;
const COL_W = 104;
const HEAD_W = 72;
const HEAD_H = 26;
const TOTAL_W = COLS * COL_W + HEAD_W;
const TOTAL_H = ROWS * ROW_H + HEAD_H;
/** Browsers cap how tall an element can be, so the scrollbar is shorter than the sheet and mapped onto it. */
const MAX_SCROLL = 6_000_000;
const SPACER_W = Math.min(TOTAL_W, MAX_SCROLL);
const SPACER_H = Math.min(TOTAL_H, MAX_SCROLL);
/** Ranges up to this many cells are walked in one go; larger ones in slices so the tab stays usable. */
const SLICE_LIMIT = 2_000_000;
const SLICE_MS = 12;

type Value = string | number;
type Range = { r1: number; c1: number; r2: number; c2: number };
type Sheet = {
  /** Only cells that hold a value, keyed by row * COLS + col. */
  cells: Map<number, Value>;
  merges: Range[];
  /** The smallest range that holds every value: rows 0..rows-1, cols 0..cols-1. */
  dim: { rows: number; cols: number };
};
type Backup = { range: Range; values: [number, Value][]; merges: Range[] };

const key = (row: number, col: number) => row * COLS + col;
const cellCount = (r: Range) => (r.r2 - r.r1 + 1) * (r.c2 - r.c1 + 1);
const contains = (r: Range, row: number, col: number) => row >= r.r1 && row <= r.r2 && col >= r.c1 && col <= r.c2;
const overlaps = (a: Range, b: Range) => a.r1 <= b.r2 && a.r2 >= b.r1 && a.c1 <= b.c2 && a.c2 >= b.c1;

/** 0 → A, 25 → Z, 26 → AA, 16383 → XFD */
function colName(col: number) {
  let name = '';
  for (let n = col + 1; n > 0; n = Math.floor((n - 1) / 26)) name = String.fromCharCode(65 + ((n - 1) % 26)) + name;
  return name;
}
const rangeName = (r: Range) =>
  r.r1 === r.r2 && r.c1 === r.c2 ? `${colName(r.c1)}${r.r1 + 1}` : `${colName(r.c1)}${r.r1 + 1}:${colName(r.c2)}${r.r2 + 1}`;

const DATA_ROWS = 3000;
const HEADERS = ['날짜', '지점', '품목', '수량', '단가', '금액', '담당', '비고'];
const BRANCHES = ['강남', '성수', '판교', '해운대', '제주'];
const ITEMS = ['노트북', '모니터', '키보드', '마우스', '독', '케이블'];
const OWNERS = ['김', '이', '박', '최', '정'];

/** A sales table in the top-left corner; the rest of the sheet is empty, as in most real documents. */
function sampleSheet(): Sheet {
  const cells = new Map<number, Value>();
  HEADERS.forEach((text, col) => cells.set(key(0, col), text));
  for (let row = 1; row <= DATA_ROWS; row++) {
    const amount = 1 + ((row * 7) % 12);
    const price = 12_000 + ((row * 37) % 90) * 1_000;
    const values: Value[] = [
      `2026-${String(1 + (row % 12)).padStart(2, '0')}-${String(1 + (row % 28)).padStart(2, '0')}`,
      BRANCHES[row % BRANCHES.length],
      ITEMS[(row * 3) % ITEMS.length],
      amount,
      price,
      amount * price,
      OWNERS[(row * 5) % OWNERS.length],
      row % 9 === 0 ? '재주문' : '',
    ];
    values.forEach((value, col) => {
      if (value !== '') cells.set(key(row, col), value);
    });
  }
  return { cells, merges: [], dim: { rows: DATA_ROWS + 1, cols: HEADERS.length } };
}

type Palette = { fg: string; muted: string; line: string; soft: string; accent: string; bg: string };
function readPalette(): Palette {
  const style = getComputedStyle(document.documentElement);
  const get = (name: string) => style.getPropertyValue(name).trim();
  return { fg: get('--fg'), muted: get('--muted'), line: get('--line'), soft: get('--soft'), accent: get('--accent'), bg: get('--bg') };
}

type Job = { done: number; total: number; startedAt: number };
type Result = { label: string; ms: number; draws: number; visited: number };

const big = (n: number) => n.toLocaleString('ko-KR');
function duration(seconds: number) {
  if (seconds < 90) return `약 ${Math.max(1, Math.round(seconds))}초`;
  if (seconds < 5400) return `약 ${Math.round(seconds / 60)}분`;
  return `약 ${(seconds / 3600).toFixed(1)}시간`;
}

export function GridDemo() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const sheet = useRef<Sheet | null>(null);
  const selection = useRef<Range>({ r1: 0, c1: 0, r2: 0, c2: 0 });
  const backup = useRef<Backup | null>(null);
  const palette = useRef<Palette | null>(null);
  const frame = useRef(0);
  const draws = useRef(0);
  const cancelled = useRef(false);

  const [selected, setSelected] = useState<Range>(selection.current);
  /** Skip empty cells and touch only the range that holds data. */
  const [dataOnly, setDataOnly] = useState(true);
  /** Draw once when the command ends instead of after each step. */
  const [batched, setBatched] = useState(true);
  const [job, setJob] = useState<Job | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [drawMs, setDrawMs] = useState(0);
  const [position, setPosition] = useState(1);
  const [canUndo, setCanUndo] = useState(false);
  const [filled, setFilled] = useState(0);

  /** Where the sheet is scrolled to, in sheet pixels (the scrollbar itself is shorter than the sheet). */
  const offsets = () => {
    const el = scroller.current!;
    const map = (scroll: number, view: number, spacer: number, total: number) =>
      spacer <= view ? 0 : (scroll / (spacer - view)) * (total - view);
    return {
      x: map(el.scrollLeft, el.clientWidth, SPACER_W, TOTAL_W),
      y: map(el.scrollTop, el.clientHeight, SPACER_H, TOTAL_H),
      width: el.clientWidth,
      height: el.clientHeight,
    };
  };

  const draw = useCallback(() => {
    const node = canvas.current;
    const data = sheet.current;
    if (!node || !data || !scroller.current) return;
    const started = performance.now();
    const colors = (palette.current ??= readPalette());
    const { x: sx, y: sy, width, height } = offsets();
    const ratio = window.devicePixelRatio || 1;
    if (node.width !== Math.round(width * ratio) || node.height !== Math.round(height * ratio)) {
      node.width = Math.round(width * ratio);
      node.height = Math.round(height * ratio);
    }
    const ctx = node.getContext('2d')!;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    ctx.fillStyle = colors.bg;
    ctx.fillRect(0, 0, width, height);
    ctx.font = '13px Pretendard, -apple-system, sans-serif';
    ctx.textBaseline = 'middle';

    const firstRow = Math.floor(sy / ROW_H);
    const firstCol = Math.floor(sx / COL_W);
    const lastRow = Math.min(ROWS - 1, Math.floor((sy + height - HEAD_H) / ROW_H));
    const lastCol = Math.min(COLS - 1, Math.floor((sx + width - HEAD_W) / COL_W));
    const left = (col: number) => HEAD_W + col * COL_W - sx;
    const top = (row: number) => HEAD_H + row * ROW_H - sy;
    const merges = data.merges.filter((m) => overlaps(m, { r1: firstRow, c1: firstCol, r2: lastRow, c2: lastCol }));

    const text = (value: Value, x: number, y: number, w: number, h: number, center: boolean) => {
      ctx.save();
      ctx.beginPath();
      ctx.rect(x, y, w, h);
      ctx.clip();
      const numeric = typeof value === 'number';
      ctx.textAlign = center ? 'center' : numeric ? 'right' : 'left';
      ctx.fillText(numeric ? big(value) : value, center ? x + w / 2 : numeric ? x + w - 8 : x + 8, y + h / 2);
      ctx.restore();
    };

    // grid lines
    ctx.strokeStyle = colors.line;
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let row = firstRow; row <= lastRow + 1; row++) {
      const y = Math.round(top(row)) + 0.5;
      ctx.moveTo(HEAD_W, y);
      ctx.lineTo(width, y);
    }
    for (let col = firstCol; col <= lastCol + 1; col++) {
      const x = Math.round(left(col)) + 0.5;
      ctx.moveTo(x, HEAD_H);
      ctx.lineTo(x, height);
    }
    ctx.stroke();

    // values: only the cells on screen, and only where the sheet has data
    ctx.fillStyle = colors.fg;
    const rowEnd = Math.min(lastRow, data.dim.rows - 1);
    const colEnd = Math.min(lastCol, data.dim.cols - 1);
    for (let row = firstRow; row <= rowEnd; row++) {
      for (let col = firstCol; col <= colEnd; col++) {
        const value = data.cells.get(key(row, col));
        if (value === undefined || merges.some((m) => contains(m, row, col))) continue;
        if (row === 0) ctx.font = '600 13px Pretendard, -apple-system, sans-serif';
        text(value, left(col), top(row), COL_W, ROW_H, false);
        if (row === 0) ctx.font = '13px Pretendard, -apple-system, sans-serif';
      }
    }

    // merged ranges: one box, the top-left value in the middle of the part that is on screen
    for (const m of merges) {
      const x1 = Math.max(HEAD_W, left(m.c1));
      const y1 = Math.max(HEAD_H, top(m.r1));
      const x2 = Math.min(width, left(m.c2 + 1));
      const y2 = Math.min(height, top(m.r2 + 1));
      ctx.fillStyle = colors.bg;
      ctx.fillRect(x1, y1, x2 - x1, y2 - y1);
      ctx.strokeStyle = colors.line;
      ctx.strokeRect(Math.round(x1) + 0.5, Math.round(y1) + 0.5, x2 - x1, y2 - y1);
      const value = data.cells.get(key(m.r1, m.c1));
      if (value !== undefined) {
        ctx.fillStyle = colors.fg;
        text(value, x1, y1, x2 - x1, y2 - y1, true);
      }
    }

    // selection
    const sel = selection.current;
    const sx1 = Math.max(HEAD_W, left(sel.c1));
    const sy1 = Math.max(HEAD_H, top(sel.r1));
    const sx2 = Math.min(width + 2, left(sel.c2 + 1));
    const sy2 = Math.min(height + 2, top(sel.r2 + 1));
    if (sx2 > sx1 && sy2 > sy1) {
      ctx.globalAlpha = 0.1;
      ctx.fillStyle = colors.accent;
      ctx.fillRect(sx1, sy1, sx2 - sx1, sy2 - sy1);
      ctx.globalAlpha = 1;
      ctx.strokeStyle = colors.accent;
      ctx.lineWidth = 2;
      ctx.strokeRect(sx1, sy1, sx2 - sx1, sy2 - sy1);
      ctx.lineWidth = 1;
    }

    // headers
    ctx.fillStyle = colors.soft;
    ctx.fillRect(0, 0, width, HEAD_H);
    ctx.fillRect(0, 0, HEAD_W, height);
    ctx.font = '12px Pretendard, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    for (let col = firstCol; col <= lastCol; col++) {
      const active = col >= sel.c1 && col <= sel.c2;
      ctx.fillStyle = active ? colors.accent : colors.muted;
      ctx.save();
      ctx.beginPath();
      ctx.rect(HEAD_W, 0, width - HEAD_W, HEAD_H);
      ctx.clip();
      ctx.fillText(colName(col), left(col) + COL_W / 2, HEAD_H / 2);
      ctx.restore();
    }
    for (let row = firstRow; row <= lastRow; row++) {
      const active = row >= sel.r1 && row <= sel.r2;
      ctx.fillStyle = active ? colors.accent : colors.muted;
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, HEAD_H, HEAD_W, height - HEAD_H);
      ctx.clip();
      ctx.fillText(big(row + 1), HEAD_W / 2, top(row) + ROW_H / 2);
      ctx.restore();
    }
    ctx.fillStyle = colors.soft;
    ctx.fillRect(0, 0, HEAD_W, HEAD_H);
    ctx.strokeStyle = colors.line;
    ctx.beginPath();
    ctx.moveTo(0, HEAD_H + 0.5);
    ctx.lineTo(width, HEAD_H + 0.5);
    ctx.moveTo(HEAD_W + 0.5, 0);
    ctx.lineTo(HEAD_W + 0.5, height);
    ctx.stroke();

    draws.current += 1;
    setDrawMs(performance.now() - started);
    setPosition(firstRow + 1);
  }, []);

  /** Scrolling and resizing draw at most once per frame. */
  const schedule = useCallback(() => {
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(draw);
  }, [draw]);

  useEffect(() => {
    sheet.current = sampleSheet();
    setFilled(sheet.current.cells.size);
    draw();
    const repaint = () => {
      palette.current = null;
      schedule();
    };
    const resize = new ResizeObserver(schedule);
    resize.observe(scroller.current!);
    // The theme toggle sets data-theme on <html>; the device setting can change too.
    const theme = new MutationObserver(repaint);
    theme.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    media.addEventListener('change', repaint);
    void document.fonts?.ready.then(schedule);
    return () => {
      cancelled.current = true;
      cancelAnimationFrame(frame.current);
      resize.disconnect();
      theme.disconnect();
      media.removeEventListener('change', repaint);
    };
  }, [draw, schedule]);

  const select = (range: Range) => {
    selection.current = range;
    setSelected(range);
    schedule();
  };

  const cellAt = (clientX: number, clientY: number) => {
    const el = scroller.current!;
    const rect = el.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    // Presses on the scrollbars are not cells.
    if (x > el.clientWidth || y > el.clientHeight) return null;
    const { x: sx, y: sy } = offsets();
    return {
      row: y < HEAD_H ? -1 : Math.min(ROWS - 1, Math.floor((y - HEAD_H + sy) / ROW_H)),
      col: x < HEAD_W ? -1 : Math.min(COLS - 1, Math.floor((x - HEAD_W + sx) / COL_W)),
    };
  };

  /** A cell, a whole row or column from its header, or the whole sheet from the corner. */
  const rangeFrom = (a: { row: number; col: number }, b: { row: number; col: number }): Range => ({
    r1: a.row < 0 ? 0 : Math.min(a.row, Math.max(b.row, 0)),
    r2: a.row < 0 ? ROWS - 1 : Math.max(a.row, b.row),
    c1: a.col < 0 ? 0 : Math.min(a.col, Math.max(b.col, 0)),
    c2: a.col < 0 ? COLS - 1 : Math.max(a.col, b.col),
  });

  const dragFrom = useRef<{ row: number; col: number } | null>(null);
  const onPointerDown = (event: React.PointerEvent) => {
    if (job || event.pointerType !== 'mouse' || event.button !== 0) return;
    const cell = cellAt(event.clientX, event.clientY);
    if (!cell) return;
    dragFrom.current = cell;
    select(rangeFrom(cell, cell));
  };
  const onPointerMove = (event: React.PointerEvent) => {
    if (!dragFrom.current || event.buttons !== 1) return;
    const cell = cellAt(event.clientX, event.clientY);
    if (cell) select(rangeFrom(dragFrom.current, cell));
  };
  /** Touch: dragging scrolls, so a tap picks the cell. */
  const onClick = (event: React.MouseEvent) => {
    const touch = (event.nativeEvent as PointerEvent).pointerType !== 'mouse';
    if (job || !touch) return;
    const cell = cellAt(event.clientX, event.clientY);
    if (cell) select(rangeFrom(cell, cell));
  };

  /**
   * Merge the selection. The command has five steps (back up the old values, clear them, record the merge,
   * style it, move the selection). `afterStep` is where the canvas gets redrawn: after each step, or once at the end.
   */
  const merge = async () => {
    const data = sheet.current!;
    const range = selection.current;
    if (cellCount(range) < 2 || job) return;
    cancelled.current = false;
    const started = performance.now();
    const before = draws.current;
    let pending = false;
    const afterStep = () => {
      if (batched) pending = true;
      else draw();
    };

    // 1. back up the values the merge will remove
    const values: [number, Value][] = [];
    let visited = 0;
    if (dataOnly) {
      // only the part of the selection that can hold data
      const r2 = Math.min(range.r2, data.dim.rows - 1);
      const c2 = Math.min(range.c2, data.dim.cols - 1);
      for (let row = range.r1; row <= r2; row++) {
        for (let col = range.c1; col <= c2; col++) {
          visited += 1;
          const value = data.cells.get(key(row, col));
          if (value !== undefined) values.push([key(row, col), value]);
        }
      }
    } else {
      // every cell of the selection, empty or not
      const total = cellCount(range);
      const columns = range.c2 - range.c1 + 1;
      const visit = (index: number) => {
        const k = key(range.r1 + Math.floor(index / columns), range.c1 + (index % columns));
        const value = data.cells.get(k);
        if (value !== undefined) values.push([k, value]);
      };
      if (total <= SLICE_LIMIT) {
        for (let i = 0; i < total; i++) visit(i);
        visited = total;
      } else {
        const jobStart = performance.now();
        setJob({ done: 0, total, startedAt: jobStart });
        while (visited < total && !cancelled.current) {
          const until = performance.now() + SLICE_MS;
          while (visited < total && performance.now() < until) {
            const end = Math.min(total, visited + 20_000);
            for (; visited < end; visited++) visit(visited);
          }
          setJob({ done: visited, total, startedAt: jobStart });
          await new Promise((resolve) => setTimeout(resolve));
        }
        setJob(null);
        if (cancelled.current) {
          setResult({ label: `${big(visited)}칸까지 확인하다 그만뒀어요`, ms: performance.now() - started, draws: 0, visited });
          return;
        }
      }
    }
    const removed = data.merges.filter((m) => overlaps(m, range));
    backup.current = { range, values, merges: removed };
    afterStep();

    // 2. clear everything but the top-left value
    const anchor = key(range.r1, range.c1);
    for (const [k] of values) if (k !== anchor) data.cells.delete(k);
    afterStep();

    // 3. record the merge as one range, not cell by cell
    data.merges = [...data.merges.filter((m) => !overlaps(m, range)), range];
    afterStep();

    // 4. the merged cell is centered (the drawing reads that from the merge itself)
    afterStep();

    // 5. the selection stays on the merged range
    selection.current = range;
    afterStep();

    if (pending) draw();
    setCanUndo(true);
    setResult({ label: `${rangeName(range)} 병합`, ms: performance.now() - started, draws: draws.current - before, visited });
  };

  const undo = () => {
    const data = sheet.current!;
    const saved = backup.current;
    if (!saved || job) return;
    data.merges = [...data.merges.filter((m) => m !== saved.range), ...saved.merges];
    for (const [k, value] of saved.values) data.cells.set(k, value);
    backup.current = null;
    setCanUndo(false);
    setResult(null);
    schedule();
  };

  const jump = (toEnd: boolean) => {
    const el = scroller.current!;
    el.scrollTo({ top: toEnd ? el.scrollHeight : 0, left: 0 });
  };

  const total = cellCount(selected);
  const elapsed = job ? (performance.now() - job.startedAt) / 1000 : 0;
  const remaining = job && job.done > 0 ? (elapsed / job.done) * (job.total - job.done) : 0;

  return (
    <section className="lab-demo">
      <div className="lab-controls">
        <label className="check">
          <input type="checkbox" checked={dataOnly} disabled={!!job} onChange={(e) => setDataOnly(e.target.checked)} />
          실제 데이터 범위만 처리
        </label>
        <label className="check">
          <input type="checkbox" checked={batched} disabled={!!job} onChange={(e) => setBatched(e.target.checked)} />
          명령이 끝날 때 한 번만 그리기
        </label>
      </div>
      <div className="lab-controls">
        <button className="btn" type="button" disabled={!!job} onClick={() => select({ r1: 0, c1: 0, r2: ROWS - 1, c2: COLS - 1 })}>
          시트 전체 선택
        </button>
        <button className="btn primary" type="button" disabled={!!job || total < 2} onClick={() => void merge()}>
          선택 범위 병합
        </button>
        <button className="btn" type="button" disabled={!!job || !canUndo} onClick={undo}>
          병합 되돌리기
        </button>
        <button className="btn" type="button" onClick={() => jump(position < ROWS / 2)}>
          {position < ROWS / 2 ? '맨 아래로' : '맨 위로'}
        </button>
      </div>

      <div className="stats">
        <Stat label="병합에 걸린 시간" value={result ? `${result.ms < 10 ? result.ms.toFixed(1) : big(Math.round(result.ms))}ms` : '–'} accent />
        <Stat label="확인한 칸" value={result ? big(result.visited) : '–'} />
        <Stat label="이번 동작의 Canvas 그리기" value={result ? `${result.draws}회` : '–'} />
        <Stat label="화면 한 번 그리는 시간" value={`${drawMs.toFixed(1)}ms`} />
      </div>

      <div className="lab-stage grid-stage">
        <canvas ref={canvas} aria-hidden="true" />
        <div
          className="grid-scroller"
          ref={scroller}
          onScroll={schedule}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={() => (dragFrom.current = null)}
          onClick={onClick}
          role="img"
          aria-label={`스프레드시트. ${big(ROWS)}행 ${big(COLS)}열 중 ${big(position)}행부터 보고 있습니다.`}
        >
          <div style={{ width: SPACER_W, height: SPACER_H }} />
        </div>
        {job && (
          <div className="grid-job" role="status">
            <strong>빈 칸까지 하나씩 확인하는 중</strong>
            <span>
              {big(job.done)} / {big(job.total)}칸 ({((job.done / job.total) * 100).toFixed(2)}%)
            </span>
            <span>{job.done > 0 ? `이 속도면 ${duration(remaining)} 더 걸려요` : '시간을 재는 중…'}</span>
            <progress value={job.done} max={job.total} />
            <button className="btn" type="button" onClick={() => (cancelled.current = true)}>
              그만두기
            </button>
            <small>원래는 이 동안 화면이 멈춥니다. 여기서는 그만둘 수 있게 조금씩 나눠 실행합니다.</small>
          </div>
        )}
      </div>
      <p className="lab-result" aria-live="polite">
        {result ? `${result.label}. ` : ''}선택 {rangeName(selected)} · {big(total)}칸 · 지금 {big(position)}행 / {big(ROWS)}행 · 시트 전체 {big(ROWS * COLS)}칸 중 값이 있는 칸은{' '}
        {big(filled)}칸입니다.
      </p>
    </section>
  );
}
