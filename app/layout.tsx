import fs from 'node:fs';
import path from 'node:path';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.css';

const SITE = 'https://epww1502.github.io';
const DESCRIPTION =
  '대용량 렌더링 최적화와 앱 출시·운영 경험을 가진 5년차 프론트엔드 개발자 이영주의 이력서, 포트폴리오, 경력기술서';

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: { default: '이영주 · 이력서', template: '%s · 이영주' },
  description: DESCRIPTION,
  openGraph: {
    type: 'website',
    siteName: '이영주 · 프론트엔드 개발자',
    description: DESCRIPTION,
    images: ['/og.png'],
    locale: 'ko_KR',
  },
};

// The phone number lives in public/private.js, which is gitignored. It only exists on the author's
// machine, so it is included in locally printed PDFs and never in the deployed site.
const HAS_PRIVATE_SCRIPT = fs.existsSync(path.join(process.cwd(), 'public', 'private.js'));

// Runs before paint so a saved theme never flashes the wrong colors.
const THEME_INIT = `try{var t=localStorage.getItem('theme');if(t==="dark"||t==="light")document.documentElement.dataset.theme=t}catch(e){}`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"
        />
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT }} />
      </head>
      <body>
        {children}
        {HAS_PRIVATE_SCRIPT && <script src="/private.js" async />}
      </body>
    </html>
  );
}
