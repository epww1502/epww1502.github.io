/** The demos under /lab. Each one reproduces the problem and the fix of one portfolio case study. */
export type Demo = {
  slug: string;
  title: string;
  /** The case study this demo belongs to. */
  caseSlug: string;
  caseTitle: string;
  summary: string;
  /** Headline shown on the list card. */
  metric: { value: string; label: string };
  problem: string;
  fix: string;
};

export const DEMOS: Demo[] = [
  {
    slug: 'chart',
    title: '대용량 차트 렌더링',
    caseSlug: 'chart',
    caseTitle: 'GAIA OFFICE Chart',
    summary: '같은 차트를 데이터 포인트마다 컴포넌트를 만드는 방식과 계열 단위 path로 그리는 방식으로 그려 보고, 걸린 시간을 잽니다.',
    metric: { value: '10,000개 → 100개', label: '100×100 차트의 컴포넌트 수' },
    problem: '데이터 포인트마다 컴포넌트를 만들어 100×100 차트면 10,000개가 생겼습니다.',
    fix: '계열 하나를 path로 모아 그려 컴포넌트를 계열 수만큼으로 줄였습니다.',
  },
  {
    slug: 'grid',
    title: '시트 전체 병합과 Canvas 그리기',
    caseSlug: 'cell',
    caseTitle: 'GAIA OFFICE Cell',
    summary: '약 171억 칸짜리 시트를 Canvas로 그리고, 시트 전체를 병합해 봅니다. 빈 칸까지 확인하는 방식과 실제 데이터 범위만 처리하는 방식을 바꿔 볼 수 있습니다.',
    metric: { value: '171억 칸', label: '시트 전체를 병합해도 멈추지 않게' },
    problem: '병합 전 값을 백업할 때 빈 칸까지 전부 훑어서 시트 전체를 병합하면 멈췄습니다.',
    fix: '실제 데이터가 있는 범위만 처리하고, Canvas는 명령이 끝날 때 한 번만 그렸습니다.',
  },
  {
    slug: 'stream',
    title: 'AI 채팅 스트리밍 렌더링',
    caseSlug: 'glab',
    caseTitle: 'GLAB · AI 디지털 PB 앱',
    summary: '답변이 토큰 단위로 들어오는 동안 어떤 메시지가 다시 그려지는지 표시합니다. 대화 전체를 다시 그리는 방식과 마지막 메시지만 그리는 방식을 비교합니다.',
    metric: { value: '마지막 메시지만', label: '토큰마다 전체를 다시 그리던 채팅 화면' },
    problem: '토큰이 올 때마다 채팅 화면 전체가 다시 그려졌고, throttle은 실제로 동작하지 않았습니다.',
    fix: '메시지를 id와 text로 비교해 마지막 메시지만 다시 그리고, 토큰을 모아서 반영했습니다.',
  },
];

export const demoBySlug = (slug: string) => DEMOS.find((demo) => demo.slug === slug)!;
