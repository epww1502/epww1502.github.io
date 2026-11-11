# epww1502.github.io

이력서, 포트폴리오, 경력기술서 사이트입니다. Next.js 정적 빌드로 만들고 GitHub Pages에 배포합니다.

- 이력서: `app/page.tsx`
- 경력기술서: `app/career/page.tsx`
- 포트폴리오 사례: `content/cases/*.mdx`

## 사례 추가

`content/cases`에 MDX 파일을 추가하면 목록, 사례 페이지, PDF에 함께 들어갑니다. 파일 맨 위에 `meta`를 내보냅니다.

```mdx
export const meta = {
  title: '프로젝트 이름',
  tag: '회사 · 기간',
  summary: '한두 문장 요약',
  order: 8,
  stack: 'React, TypeScript',
};

<Case title="문제 제목">
  <Step label="문제">...</Step>
  <Step label="해결">...</Step>
  <Step label="결과" result>...</Step>
</Case>
```

본문에서 쓸 수 있는 컴포넌트는 `components/CaseParts.tsx`에 있습니다.

## 개발과 배포

```bash
npm install
npm run dev     # 개발 서버
npm run pdf     # 빌드 후 PDF·Word 다운로드 파일 다시 만들기
```

`main`에 push하면 GitHub Actions가 빌드해서 배포합니다. 다운로드 파일(`public/pdf`)은 `npm run pdf`로 만들어 함께 커밋합니다.
