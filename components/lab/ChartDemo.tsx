'use client';

import { memo, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Segmented, Stat } from './LabPage';

type Mode = 'point' | 'series';
type Size = '30' | '100' | '200' | '300' | '500';
/** From this many points on, the slow way holds the page for seconds, so the demo says so first. */
const HEAVY_POINTS = 90_000;

const WIDTH = 800;
const HEIGHT = 360;
const PAD = 12;

/** Small seeded generator so every visit draws the same chart. */
function seeded(seed: number) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Point = { x: number; y: number };
type Series = { id: number; color: string; points: Point[] };

/** `count` series of `count` points each, already in SVG coordinates. */
function buildSeries(count: number): Series[] {
  const random = seeded(count);
  const step = (WIDTH - PAD * 2) / (count - 1);
  return Array.from({ length: count }, (_, s) => {
    const base = PAD + ((s + 0.5) / count) * (HEIGHT - PAD * 2);
    let drift = 0;
    const points = Array.from({ length: count }, (_, i) => {
      drift = drift * 0.9 + (random() - 0.5) * 14;
      const y = Math.min(HEIGHT - PAD, Math.max(PAD, base + drift));
      return { x: PAD + i * step, y };
    });
    return { id: s, color: `hsl(${Math.round(205 + (s / count) * 60)} 68% ${42 + (s % 5) * 5}%)`, points };
  });
}

const fixed = (n: number) => n.toFixed(1);

/** Before: every data point is its own component, drawing its marker and the line from the previous point. */
function DataPoint({ point, previous, color }: { point: Point; previous?: Point; color: string }) {
  return (
    <g>
      {previous && (
        <line x1={fixed(previous.x)} y1={fixed(previous.y)} x2={fixed(point.x)} y2={fixed(point.y)} stroke={color} strokeWidth="1" />
      )}
      <circle cx={fixed(point.x)} cy={fixed(point.y)} r="1.5" fill={color} />
    </g>
  );
}

function PointSeries({ series }: { series: Series }) {
  return (
    <g>
      {series.points.map((point, i) => (
        <DataPoint key={i} point={point} previous={series.points[i - 1]} color={series.color} />
      ))}
    </g>
  );
}

/** After: one path for the whole line, one more for all the markers of the series. */
function PathSeries({ series }: { series: Series }) {
  const line = series.points.map((p, i) => `${i ? 'L' : 'M'}${fixed(p.x)} ${fixed(p.y)}`).join('');
  // A zero-length segment with round caps draws a dot, so one path holds every marker.
  const markers = series.points.map((p) => `M${fixed(p.x)} ${fixed(p.y)}h0`).join('');
  return (
    <g stroke={series.color} fill="none">
      <path d={line} strokeWidth="1" />
      <path d={markers} strokeWidth="3" strokeLinecap="round" />
    </g>
  );
}

/** Memoized so that showing the measured time does not draw the chart a second time. */
const Chart = memo(function Chart({ series, mode }: { series: Series[]; mode: Mode }) {
  return (
    <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} role="img" aria-label="꺾은선 차트">
      {series.map((item) => (mode === 'point' ? <PointSeries key={item.id} series={item} /> : <PathSeries key={item.id} series={item} />))}
    </svg>
  );
});

const MODE_LABEL: Record<Mode, string> = { point: '포인트마다 그리기', series: '계열 단위로 그리기' };
const ms = (value: number) => `${value < 10 ? value.toFixed(1) : Math.round(value).toLocaleString()}ms`;

export function ChartDemo() {
  const [size, setSize] = useState<Size>('100');
  const [mode, setMode] = useState<Mode>('series');
  /** What is on screen. Null while the previous chart is being cleared, so clearing it is not part of the measurement. */
  const [drawn, setDrawn] = useState<{ mode: Mode; count: number; run: number } | null>({ mode: 'series', count: 100, run: 0 });
  const [times, setTimes] = useState<Partial<Record<Mode, number>>>({});
  const [nodes, setNodes] = useState(0);
  const started = useRef<number | null>(null);
  const runs = useRef(0);
  const box = useRef<HTMLDivElement>(null);

  const count = Number(size);
  const series = useMemo(() => (drawn ? buildSeries(drawn.count) : []), [drawn?.count]);

  const draw = (nextMode: Mode, nextSize: Size = size) => {
    if (nextSize !== size) setTimes({});
    setSize(nextSize);
    setMode(nextMode);
    setDrawn(null);
  };

  // Once the old chart is gone and that frame has been painted, start the clock and mount the new one.
  useEffect(() => {
    if (drawn) return;
    let timer: ReturnType<typeof setTimeout>;
    const frame = requestAnimationFrame(() => {
      timer = setTimeout(() => {
        started.current = performance.now();
        setDrawn({ mode, count, run: ++runs.current });
      }, 0);
    });
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(timer);
    };
  }, [drawn, mode, count]);

  // From mounting the chart until the browser has painted it.
  useLayoutEffect(() => {
    if (!drawn) return;
    const t0 = started.current;
    started.current = null;
    if (t0 === null) {
      setNodes(box.current?.querySelectorAll('svg *').length ?? 0);
      return;
    }
    const frame = requestAnimationFrame(() => {
      setTimeout(() => {
        setTimes((prev) => ({ ...prev, [drawn.mode]: performance.now() - t0 }));
        setNodes(box.current?.querySelectorAll('svg *').length ?? 0);
      }, 0);
    });
    return () => cancelAnimationFrame(frame);
  }, [drawn]);

  const components = mode === 'point' ? count * count + count : count;
  const ratio = times.point && times.series ? times.point / times.series : null;

  return (
    <section className="lab-demo">
      <div className="lab-controls">
        <Segmented
          label="그리는 방식"
          value={mode}
          onChange={(value) => draw(value)}
          options={[
            { value: 'point', label: '고치기 전 · 포인트마다' },
            { value: 'series', label: '고친 뒤 · 계열 단위' },
          ]}
        />
        <Segmented
          label="차트 크기"
          value={size}
          onChange={(value) => draw(mode, value)}
          options={[
            { value: '30', label: '30×30' },
            { value: '100', label: '100×100' },
            { value: '200', label: '200×200' },
            { value: '300', label: '300×300' },
            { value: '500', label: '500×500' },
          ]}
        />
        <button className="btn" type="button" onClick={() => draw(mode)}>
          다시 그리기
        </button>
      </div>

      {count * count >= HEAVY_POINTS && (
        <p className="lab-result">
          {(count * count).toLocaleString()}개 포인트입니다. 고치기 전 방식은 그리는 동안 화면이 몇 초 멈출 수 있고, 휴대폰에서는 더
          오래 걸립니다.
        </p>
      )}

      <div className="stats">
        <Stat label={`${MODE_LABEL[mode]} · 그리는 데 걸린 시간`} value={times[mode] ? ms(times[mode]!) : '–'} accent />
        <Stat label="데이터 포인트" value={(count * count).toLocaleString()} />
        <Stat label="React 컴포넌트" value={components.toLocaleString()} />
        <Stat label="SVG 요소" value={nodes.toLocaleString()} />
      </div>

      <div className="lab-stage chart-stage" ref={box}>
        {drawn && <Chart key={drawn.run} series={series} mode={drawn.mode} />}
      </div>

      <table className="lab-table">
        <thead>
          <tr>
            <th>방식</th>
            <th>컴포넌트</th>
            <th>걸린 시간</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>고치기 전 · 포인트마다 컴포넌트 하나</td>
            <td>{(count * count + count).toLocaleString()}</td>
            <td>{times.point ? ms(times.point) : '아직 안 그려봤어요'}</td>
          </tr>
          <tr>
            <td>고친 뒤 · 계열 하나를 path 두 개로</td>
            <td>{count.toLocaleString()}</td>
            <td>{times.series ? ms(times.series) : '아직 안 그려봤어요'}</td>
          </tr>
        </tbody>
      </table>
      <p className="lab-result" aria-live="polite">
        {ratio
          ? `이 기기에서 계열 단위로 그리는 쪽이 약 ${ratio >= 10 ? Math.round(ratio) : ratio.toFixed(1)}배 빨랐습니다.`
          : '두 방식을 한 번씩 눌러 보면 걸린 시간을 비교해 드려요.'}
      </p>
    </section>
  );
}
