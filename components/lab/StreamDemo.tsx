'use client';

import { memo, useEffect, useRef, useState, type ReactNode } from 'react';
import { Segmented, Stat } from './LabPage';

type Mode = 'before' | 'after';
type Message = { id: number; role: 'user' | 'assistant'; text: string };

const QUESTIONS = [
  '삼성전자 지금 들어가도 될까요?',
  '배당주 위주로 포트폴리오를 짜고 싶어요.',
  'ETF와 개별 종목 비중은 어떻게 나누면 좋을까요?',
  '환율이 오르면 제 미국 주식은 어떻게 되나요?',
  '금리 인하가 채권 가격에 주는 영향이 궁금해요.',
];
const ANSWERS = [
  '**결론부터** 말씀드리면 한 번에 들어가기보다 나눠서 사는 편이 좋습니다.\n- 최근 3개월 변동폭이 큽니다\n- 실적 발표가 `다음 달`에 있습니다\n- 목표 비중을 먼저 정해 두세요',
  '배당 포트폴리오는 **배당 성장**과 **배당 수익률**을 나눠서 봅니다.\n- 수익률만 높은 종목은 배당 삭감 위험이 있습니다\n- 5년 이상 배당을 늘려 온 기업을 먼저 보세요\n- 예시 비중: `성장 60 / 고배당 40`',
  '정답은 없지만 **핵심은 ETF, 나머지는 개별 종목**으로 두는 방식이 많이 쓰입니다.\n- 핵심 70%: 지수 ETF\n- 위성 30%: 확신이 있는 종목\n- 분기마다 비중을 다시 맞춥니다',
  '원화로 본 평가액은 **환율이 오르면 늘어납니다**.\n- 달러 자산은 그대로여도 원화 환산액이 커집니다\n- 반대로 환율이 내리면 수익이 줄어듭니다\n- 환헤지 상품은 `(H)` 표시를 확인하세요',
  '금리가 내리면 **이미 발행된 채권의 가격은 오릅니다**.\n- 만기가 길수록 가격이 더 크게 움직입니다\n- 이 민감도를 `듀레이션`이라고 합니다\n- 단기채는 변동이 작습니다',
];
const STREAMED =
  '답변이 스트리밍되는 동안에는 **토큰이 도착할 때마다** 화면이 바뀝니다.\n' +
  '- 고치기 전에는 토큰 하나에 대화 전체가 다시 그려졌습니다\n' +
  '- 이미 끝난 메시지는 내용이 바뀌지 않으니 다시 그릴 이유가 없습니다\n' +
  '- 그래서 메시지를 `id`와 `text`로 비교해 **마지막 메시지만** 다시 그리게 했습니다\n' +
  '- 토큰은 잠깐 모았다가 한 번에 반영합니다\n' +
  '채팅 화면만의 문제는 아니었습니다. 대화 목록 구독이 화면 전체에 걸려 있어서 **다른 대화**가 스트리밍 중일 때도 보고 있는 화면이 다시 그려졌습니다.\n' +
  '- 대화 목록 구독은 그 목록을 쓰는 사이드바로 옮겼습니다\n' +
  '- 보이지 않는 화면은 상태만 유지하고 렌더링을 멈췄습니다\n' +
  '위쪽 메시지의 **다시 그린 횟수**와 테두리를 보면 차이가 보입니다. ' +
  '대화가 길수록, 답변이 길수록 차이가 커집니다. ' +
  '지금 보고 있는 숫자는 이 기기에서 실제로 잰 값입니다.';

function conversation(pairs: number): Message[] {
  const list: Message[] = [];
  for (let i = 0; i < pairs; i++) {
    list.push({ id: i * 2, role: 'user', text: QUESTIONS[i % QUESTIONS.length] });
    list.push({ id: i * 2 + 1, role: 'assistant', text: ANSWERS[i % ANSWERS.length] });
  }
  return list;
}

/** Turns **bold** and `code` into elements. Runs on every render of a message, like a markdown renderer would. */
function inline(text: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**') && part.length > 4) return <strong key={i}>{part.slice(2, -2)}</strong>;
    if (part.startsWith('`') && part.endsWith('`') && part.length > 2) return <code key={i}>{part.slice(1, -1)}</code>;
    return part;
  });
}

function rich(text: string) {
  const blocks: ReactNode[] = [];
  let items: ReactNode[] = [];
  const flush = () => {
    if (items.length) blocks.push(<ul key={`l${blocks.length}`}>{items}</ul>);
    items = [];
  };
  text.split('\n').forEach((line, i) => {
    if (line.startsWith('- ')) items.push(<li key={i}>{inline(line.slice(2))}</li>);
    else {
      flush();
      blocks.push(<p key={i}>{inline(line)}</p>);
    }
  });
  flush();
  return blocks;
}

/** Counts every render of every message since the last reset; read by the readouts, never stored in state. */
const counter = { renders: 0 };

function MessageView({ message }: { message: Message }) {
  const node = useRef<HTMLDivElement>(null);
  const badge = useRef<HTMLSpanElement>(null);
  const renders = useRef(0);

  // No dependency list: runs after every render of this message, so it can show that the render happened.
  useEffect(() => {
    renders.current += 1;
    if (renders.current === 1) return;
    counter.renders += 1;
    if (badge.current) badge.current.textContent = `다시 그림 ${renders.current - 1}회`;
    node.current?.animate([{ outlineColor: 'var(--flash)' }, { outlineColor: 'transparent' }], { duration: 500 });
  });

  return (
    <div className={`bubble ${message.role}`} ref={node}>
      {rich(message.text)}
      <span className="bubble-count" ref={badge} />
    </div>
  );
}

/** After: a message is drawn again only when its own text changes. */
const MemoMessage = memo(MessageView, (prev, next) => prev.message.id === next.message.id && prev.message.text === next.message.text);

/** The answer cut into small pieces, the way a model sends it. */
function tokens(text: string) {
  return text.match(/[\s\S]{1,2}/g) ?? [];
}

const LENGTHS = { short: 10, long: 60 } as const;
type Length = keyof typeof LENGTHS;
const FLUSH_MS = 50;
const TOKEN_MS = 16;

export function StreamDemo() {
  const [mode, setMode] = useState<Mode>('after');
  const [length, setLength] = useState<Length>('long');
  const [messages, setMessages] = useState<Message[]>(() => conversation(LENGTHS.long));
  const [streaming, setStreaming] = useState(false);
  /** Bumped on reset so every message mounts fresh and its render count starts from zero. */
  const [epoch, setEpoch] = useState(0);
  const list = useRef<HTMLDivElement>(null);
  const readout = useRef<{ tokens: HTMLElement | null; renders: HTMLElement | null; worst: HTMLElement | null }>({
    tokens: null,
    renders: null,
    worst: null,
  });
  const stop = useRef<(() => void) | null>(null);

  const reset = (nextMode: Mode, nextLength: Length) => {
    stop.current?.();
    counter.renders = 0;
    setMode(nextMode);
    setLength(nextLength);
    setMessages(conversation(LENGTHS[nextLength]));
    setEpoch((n) => n + 1);
    for (const key of ['tokens', 'renders', 'worst'] as const) {
      const el = readout.current[key];
      if (el) el.textContent = '–';
    }
  };

  useEffect(() => () => stop.current?.(), []);
  // Keep the newest text in view while it streams, unless the visitor has scrolled up to look around.
  const follow = useRef(true);
  useEffect(() => {
    if (streaming && follow.current && list.current) list.current.scrollTop = list.current.scrollHeight;
  }, [messages, streaming]);

  const start = () => {
    stop.current?.();
    counter.renders = 0;
    const queue = tokens(STREAMED);
    let sent = 0;
    let buffered = '';
    let worst = 0;
    let last = performance.now();
    let frame = 0;

    const base = conversation(LENGTHS[length]);
    setMessages([
      ...base,
      { id: base.length, role: 'user', text: '채팅 화면이 왜 느렸고 어떻게 고쳤나요?' },
      { id: base.length + 1, role: 'assistant', text: '' },
    ]);
    setEpoch((n) => n + 1);
    follow.current = true;
    setStreaming(true);

    const append = (text: string) =>
      setMessages((prev) => {
        const lastMessage = prev[prev.length - 1];
        return [...prev.slice(0, -1), { ...lastMessage, text: lastMessage.text + text }];
      });

    // The readouts are written straight to the page: putting them in state would redraw the chat and skew the count.
    const show = () => {
      const { tokens: t, renders: r, worst: w } = readout.current;
      if (t) t.textContent = `${sent} / ${queue.length}`;
      if (r) r.textContent = counter.renders.toLocaleString();
      if (w) w.textContent = `${Math.round(worst)}ms`;
    };
    // The longest gap between two frames: how long the page stood still at its worst.
    const watch = () => {
      const now = performance.now();
      worst = Math.max(worst, now - last);
      last = now;
      show();
      frame = requestAnimationFrame(watch);
    };
    frame = requestAnimationFrame(watch);

    const tokenTimer = setInterval(() => {
      if (sent >= queue.length) {
        finish();
        return;
      }
      const token = queue[sent++];
      // Before: every token goes straight into the list. After: tokens wait and go in together.
      if (mode === 'before') append(token);
      else buffered += token;
    }, TOKEN_MS);
    const flushTimer = setInterval(() => {
      if (!buffered) return;
      append(buffered);
      buffered = '';
    }, FLUSH_MS);

    const finish = () => {
      clearInterval(tokenTimer);
      clearInterval(flushTimer);
      if (buffered) append(buffered);
      buffered = '';
      // wait a moment so the last render is counted before the numbers stop
      const done = setTimeout(() => {
        cancelAnimationFrame(frame);
        show();
        setStreaming(false);
        stop.current = null;
      }, 120);
      stop.current = () => {
        clearTimeout(done);
        cancelAnimationFrame(frame);
        setStreaming(false);
        stop.current = null;
      };
    };
    stop.current = () => {
      clearInterval(tokenTimer);
      clearInterval(flushTimer);
      cancelAnimationFrame(frame);
      setStreaming(false);
      stop.current = null;
    };
  };

  const Item = mode === 'after' ? MemoMessage : MessageView;

  return (
    <section className="lab-demo">
      <div className="lab-controls">
        <Segmented
          label="그리는 방식"
          value={mode}
          disabled={streaming}
          onChange={(value) => reset(value, length)}
          options={[
            { value: 'before', label: '고치기 전 · 전체 다시 그리기' },
            { value: 'after', label: '고친 뒤 · 마지막 메시지만' },
          ]}
        />
        <Segmented
          label="대화 길이"
          value={length}
          disabled={streaming}
          onChange={(value) => reset(mode, value)}
          options={[
            { value: 'short', label: '메시지 20개' },
            { value: 'long', label: '메시지 120개' },
          ]}
        />
        <button className="btn primary" type="button" disabled={streaming} onClick={start}>
          {streaming ? '답변 받는 중…' : '답변 받기'}
        </button>
      </div>

      <div className="stats">
        <div className="stat accent">
          <b ref={(el) => void (readout.current.renders = el)}>–</b>
          <span>메시지를 다시 그린 횟수</span>
        </div>
        <div className="stat">
          <b ref={(el) => void (readout.current.tokens = el)}>–</b>
          <span>받은 토큰</span>
        </div>
        <div className="stat">
          <b ref={(el) => void (readout.current.worst = el)}>–</b>
          <span>가장 길게 멈춘 순간</span>
        </div>
        <Stat label="화면에 있는 메시지" value={messages.length} />
      </div>

      <div
        className="lab-stage chat-stage"
        ref={list}
        onScroll={(event) => {
          const el = event.currentTarget;
          follow.current = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
        }}
      >
        {messages.map((message) => (
          <Item key={`${epoch}-${message.id}`} message={message} />
        ))}
      </div>
      <p className="lab-result">
        메시지가 다시 그려지면 테두리가 잠깐 켜지고 횟수가 붙습니다. 답변을 받는 동안 위로 스크롤해 보세요.
      </p>
    </section>
  );
}
