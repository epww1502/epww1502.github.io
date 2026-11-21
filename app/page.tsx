import { PageHeader } from '@/components/PageHeader';
import { Company, Fields, Project, Section } from '@/components/Resume';
import { TopBar } from '@/components/TopBar';

export default function ResumePage() {
  return (
    <main className="page resume">
      <TopBar
        links={['portfolio', 'career', 'lab']}
        switchTo={{ href: '/en', label: 'EN', name: 'English' }}
        downloads={[{ href: '/pdf/resume.pdf', filename: '이영주_이력서.pdf', kind: 'pdf' }]}
      />
      <PageHeader
        title="이영주"
        lead="대용량 렌더링 최적화, 앱 출시·운영, AI 기능을 제품에 넣고 측정까지 해 본 5년차 프론트엔드 개발자입니다."
        links={['portfolio', 'career', 'lab']}
      >
        <ul className="strengths">
          <li>
            <b>대용량 렌더링</b> · 100×100 차트 렌더링 약 10,000ms → 100ms, 멈추던 시트 전체(약 170억 셀) 병합을 2초 안에 처리
          </li>
          <li>
            <b>앱 출시·운영</b> · iOS·Android·웹 3개 플랫폼을 출시해 운영, 릴리스 사이 수정은 심사 없이 OTA로 반영, 빌드·배포 자동화
          </li>
          <li>
            <b>AI 기능 측정</b> · 추천 240개를 평가 세트로 채점해 요청 적합 97.9%, 장소 실재 98.4% (개인 프로젝트 DoIt2)
          </li>
        </ul>
      </PageHeader>

      <Section title="경력">
        <Company
          name="관악연구소 · AI 핀테크 스타트업"
          when="2025.01 – 현재 · 프론트엔드 (2026.05부터 파트장)"
        >
          <Project
            title="GLAB · AI 디지털 PB 앱"
            period="2025.12 – 현재"
            summary="개인 투자자용 AI 투자 상담 앱(2026.07 출시). 프론트엔드의 기획부터 빌드·배포·운영까지 맡고, 2026.05부터 파트장으로 배포 일정과 팀원 2명의 업무 관리. 팀 기능 PR 약 540개 중 274개 작성, 코드리뷰로 동료 PR 156건 머지."
            stack="Expo · React Native · TypeScript · TanStack Query · Zustand · NativeWind · Firebase Auth"
            detail="glab"
          >
            <ul>
              <li>한 코드베이스로 iOS·Android·웹(PWA) 출시, 4개월간 정식 릴리스 5회, 구버전 앱은 OTA 대상에서 제외</li>
              <li>AI 채팅 스트리밍 중 토큰마다 대화의 모든 메시지가 다시 그려지던 것을 마지막 메시지 1개로 한정</li>
              <li>실시간 랭킹이 로딩에 멈추던 경쟁 조건 수정, 시세 숫자 애니메이션은 자리당 29행 → 최소 3행만 렌더링</li>
              <li>Kakao·Google·Apple 로그인과 탈퇴(계정 연결 해제) 구현, Android의 Apple 탈퇴는 웹 브릿지로 해결</li>
              <li>S3·CloudFront 웹 인프라 구성, push 한 번으로 환경 3개 웹 배포와 OTA 발행, 새 빌드가 필요하면 OTA 생략</li>
              <li>운영 관리자 웹 21개 화면 설계·구현 및 API 연동 (공지 예약, 약관·앱 버전 관리, 개인정보 마스킹)</li>
              <li>디자인 산출물 없이 시작해 공통 컴포넌트와 테마·컬러 토큰부터 만들고 홈·AI 채팅·탐색·포트폴리오 화면 구성</li>
            </ul>
            <p className="stack">
              서비스 <a href="https://apps.apple.com/kr/app/id6761149761">App Store</a> ·{' '}
              <a href="https://play.google.com/store/apps/details?id=com.gwanak.glab">Google Play</a> ·{' '}
              <a href="https://glab.gwanaklab.com">웹사이트</a> ·{' '}
              <a href="https://www.mt.co.kr/future/2026/10/02/2026100209504057390">머니투데이 보도</a>
            </p>
          </Project>

          <Project
            title="LG CNS COP · 생성형 AI 이미지 편집 플랫폼"
            period="2025.01 – 2025.11"
            summary="LG CNS 고객사 프로젝트. ADMIN 프론트엔드 전체를 설계·구현하고, 서비스 프론트엔드의 공통 기반을 구축."
            stack="React · TypeScript · TanStack Query · Zustand · Zod · Tailwind"
            detail="cop"
          >
            <ul>
              <li>토큰 만료 시 동시에 발생한 401로 갱신이 중복되고 요청이 유실되던 문제를, 갱신 1회 후 대기 요청 재전송으로 해결</li>
              <li>사용 현황·크레딧 발급·계정·그룹·공지·정책 등 ADMIN 전 화면과 역할 4종별 접근 제어를 테스트 일정 안에 구현</li>
              <li>크레딧 발급에 권한 제한, 발급량 검증, 확인 단계를 넣어 운영 실수 방지</li>
              <li>커밋·push 전 lint·타입 검사와 S3·CloudFront 배포 자동화 도입</li>
              <li>
                AI 페스타에서 공개되어 <a href="https://www.dt.co.kr/article/11674174">언론에 보도</a>, LG CNS·산돌구름 협업으로 산돌구름 AI Studio 베타 오픈(이용자 약 2천 명)
              </li>
            </ul>
          </Project>
        </Company>

        <Company name="티맥스가이아" when="2022.01 – 2025.01 · 웹오피스 프론트엔드">
          <Project
            title="GAIA OFFICE Chart"
            period="2022.01 – 2025.01"
            summary="웹오피스 차트 개발. 2022.09 팀 개편 이후 차트 기능 전체의 개발·유지보수를 책임지고 신규 입사자 약 5명 멘토링."
            stack="React · TypeScript · MobX · Victory"
            detail="chart"
          >
            <ul>
              <li>
                계열 단위 렌더링으로 바꿔{' '}
                <b>100×100 차트 렌더링 약 10,000ms → 100ms</b>, 30×30 차트 삽입 11초 → 2초
              </li>
              <li>Chart 모델·컴포넌트 트리 설계, OOXML 기준 Import/Export, Excel과 같은 값이 나오는 오차 막대 구현</li>
              <li>차트 모델·명령(Undo/Redo)·렌더링 훅을 Jest와 React Testing Library로 테스트 (46개 파일)</li>
            </ul>
          </Project>

          <Project
            title="GAIA OFFICE Cell · 웹 스프레드시트"
            period="2022.06 – 2025.01"
            summary="웹오피스 스프레드시트의 표시 형식·병합·피벗 테이블 개발과 유지보수. NTIS 국가 R&D 과제 참여."
            stack="React · TypeScript · Canvas · Java"
            detail="cell"
          >
            <ul>
              <li>시트 전체(약 170억 셀) 병합 멈춤을 데이터 범위만 복사해 2초 안에 처리 (넓은 범위 10초 → 1.5초)</li>
              <li>명령마다 반복되던 Canvas 렌더링을 명령이 끝날 때 한 번으로 모아 렌더 호출 5회 → 1회</li>
              <li>표시 형식 기능에서 라이브러리가 지원하지 않는 한국 날짜·경과 시간·통화·소수점 규칙 구현</li>
              <li>2년간 이슈 약 555건 처리(약 35%는 담당 기능 밖), 문서 자동 완성 TFT에서 구역 관리 구조와 DB 설계</li>
            </ul>
          </Project>
        </Company>
      </Section>

      <Section title="개인 프로젝트 · 1인 개발, AI 코딩 도구 활용">
        <Project
          title="DoIt2 · 함께 쓰는 버킷리스트 앱"
          period="2026.10 – 현재 · iOS·Android 출시"
          stack="Expo SDK 58 · Supabase · Claude API · Jest"
          detail="doit"
          links={[
            { href: 'https://apps.apple.com/kr/app/id6826993862', label: 'App Store' },
            { href: 'https://play.google.com/store/apps/details?id=com.doit2.app', label: 'Google Play' },
            { href: 'https://doit2app.github.io', label: '소개 사이트' },
            { href: 'https://github.com/epww1502/DoIt2', label: 'GitHub' },
          ]}
        >
          <ul>
            <li>여러 명이 동시에 고쳐도 유실되지 않는 변경 단위 동기화를 설계해 Jest로 검증, RLS 정책 58개로 권한 설계</li>
            <li>AI 추천(Claude API)을 요청 24개 평가 세트로 규칙 검사와 다른 모델의 심사로 채점, 한 번 약 $0.001</li>
          </ul>
        </Project>
        <Project
          title="GoIt2 · AI 여행 일정 웹"
          period="2026.11 – 현재 · 운영 중"
          summary="조건 한 줄로 날짜별 동선을 지도에 그리는 AI 여행 일정 웹. DoIt2와 연동."
          stack="Next.js · Claude API · Supabase Edge Functions · Kakao API"
          detail="goit"
          links={[{ href: 'https://go-it-2.vercel.app', label: '사이트' }]}
        >
          <ul>
            <li>AI가 고른 장소는 카카오 검색에서 이름·지역이 맞는 곳만 넣어 지어낸 장소가 지도에 오르지 않게 함</li>
            <li>한 줄씩 받아 바로 확인하는 스트리밍과 병렬 조회로 1박 2일 생성 <b>26초 → 5.8초</b></li>
          </ul>
        </Project>
        <Project
          title="mochi-pet · 친구들과 함께 쓰는 데스크톱 펫"
          period="2026.11 – 현재 · macOS·Windows 배포"
          stack="Tauri v2 · Rust · React · Supabase Realtime · Vitest"
          detail="mochi"
          links={[
            { href: 'https://github.com/epww1502/mochi-pet', label: 'GitHub' },
            { href: 'https://github.com/epww1502/mochi-pet/releases/latest', label: '다운로드' },
          ]}
        >
          <ul>
            <li>화면을 덮는 투명 창에서 펫·말풍선만 클릭을 받도록 React의 영역과 Rust의 전역 커서 위치로 클릭 통과 전환</li>
            <li>태그 하나로 macOS 2종(서명·공증)·Windows 빌드와 서명된 자동 업데이트 배포, Vitest 102개</li>
          </ul>
        </Project>
      </Section>

      <Section title="기술">
        <Fields
          rows={[
            ['주력', 'TypeScript, React, React Native(Expo), TanStack Query, Zustand, Tailwind/NativeWind'],
            [
              '경험',
              'Next.js, Claude API, MobX, Canvas, Firebase Auth, Supabase, EAS Build/Update, GitHub Actions, AWS S3·CloudFront, PostHog, Zod, React Hook Form, Jest, React Testing Library, Tauri(Rust), Java·SQL',
            ],
          ]}
        />
      </Section>

      <Section title="학력 · 기타">
        <Fields
          rows={[
            ['Oregon State University', 'Computer Science (Security) · 학점 3.89/4.0, Summa Cum Laude(최우등 졸업) · 2017.09 – 2021.06'],
            ['한국기술교육대학교', '컴퓨터공학 · 2013.02 – 2018.07 · 재학 중 OSU로 편입(2017.09)'],
            ['어학 · 병역', '영어 일상 회화 가능 (어학연수·유학 5년) · 공군 만기전역'],
          ]}
        />
      </Section>

      <Section title="수상">
        <Project
          title="BeaverHacks Spring 2021 (OSU 해커톤, 주제 핀테크) 종합 3위 / 17팀"
          period="2021.04"
          summary="암호화폐 자동 매매 봇(2인). 변동성 돌파 전략과 Upbit API 연동을 맡아 자동 매수·매도하고 결과를 Slack으로 보고."
          stack="Python · Upbit API · PyQt5"
          links={[
            { href: 'https://devpost.com/software/kimchi-trading-bot', label: '수상 내역' },
            { href: 'https://github.com/epww1502/OSUHackathon-2021Sp', label: 'GitHub' },
          ]}
        />
      </Section>
    </main>
  );
}
