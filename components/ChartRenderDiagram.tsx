/**
 * Before/after picture for the chart rendering case:
 * one component per data point versus one path per series.
 */

const SERIES = [
  { color: 'var(--accent)', points: [58, 40, 52, 30, 44, 22, 36, 28, 18, 26] },
  { color: 'var(--muted)', points: [78, 70, 74, 60, 66, 52, 60, 48, 50, 40] },
  { color: 'var(--fg)', points: [98, 92, 96, 86, 90, 80, 84, 74, 76, 68] },
];

const X0 = 24;
const STEP = 22;

function Panel({ x, title, count, perPoint }: { x: number; title: string; count: string; perPoint: boolean }) {
  return (
    <g transform={`translate(${x} 0)`}>
      <text x="0" y="16" className="diagram-title">
        {title}
      </text>
      <rect x="0" y="28" width="260" height="112" rx="8" fill="none" stroke="var(--line)" />
      {SERIES.map((series) =>
        perPoint ? (
          series.points.map((y, i) => (
            <rect
              key={`${series.color}-${i}`}
              x={X0 + i * STEP - 5}
              y={28 + y - 5}
              width="10"
              height="10"
              rx="2"
              fill="none"
              stroke={series.color}
              strokeWidth="1.5"
            />
          ))
        ) : (
          <polyline
            key={series.color}
            points={series.points.map((y, i) => `${X0 + i * STEP},${28 + y}`).join(' ')}
            fill="none"
            stroke={series.color}
            strokeWidth="2"
            strokeLinejoin="round"
          />
        ),
      )}
      <text x="0" y="160" className="diagram-count">
        {count}
      </text>
    </g>
  );
}

export function ChartRenderDiagram() {
  return (
    <figure className="diagram">
      <svg viewBox="0 0 580 170" role="img" aria-label="데이터 포인트마다 컴포넌트를 만들던 구조와 계열마다 path 하나로 그리는 구조 비교">
        <Panel x={0} title="변경 전 · 포인트마다 컴포넌트" count="100×100 차트 = 컴포넌트 10,000개" perPoint />
        <Panel x={320} title="변경 후 · 계열마다 path 하나" count="100×100 차트 = 컴포넌트 100개" perPoint={false} />
        <path d="M274 84h30m-8-7 8 7-8 7" fill="none" stroke="var(--muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <figcaption>네모 하나가 컴포넌트 하나입니다. 변경 후에는 계열 하나가 선 하나로 그려집니다.</figcaption>
    </figure>
  );
}
