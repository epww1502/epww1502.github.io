import { PageHeader } from '@/components/PageHeader';
import { Company, Fields, Project, Section } from '@/components/Resume';
import { TopBar } from '@/components/TopBar';

export default function ResumePage() {
  return (
    <main className="page">
      <TopBar
        links={['portfolio', 'career', 'lab']}
        switchTo={{ href: '/en', label: 'EN', name: 'English' }}
        downloads={[{ href: '/pdf/resume.pdf', filename: '이영주_이력서.pdf', kind: 'pdf' }]}
      />
      <PageHeader
        title="이영주"
        lead="대용량 렌더링 최적화와 앱 출시·운영 경험을 가진 5년차 프론트엔드 개발자입니다."
        links={['portfolio', 'career', 'lab']}
      />

      <Section title="경력">
        <Company
          name="관악연구소 · AI 핀테크 스타트업"
          when="2025.01 – 현재 · 프론트엔드 (2026.05부터 파트장)"
        >
          <Project
            title="GLAB · AI 디지털 PB 앱"
            period="2025.12 – 현재"
            summary="개인 투자자용 AI 투자 상담 앱(2026.07 출시). 프론트엔드의 기획부터 빌드·배포·운영까지 맡고, 2026.05부터 파트장으로 배포 일정과 팀원 2명의 업무 관리. 팀 기능 PR의 절반(278개) 작성, 동료 PR 149건 리뷰."
            stack="Expo · React Native · TypeScript · TanStack Query · Zustand · NativeWind · Firebase Auth"
            detail="glab"
          >
            <ul>
              <li>디자인 산출물 없이 시작해 공통 컴포넌트와 테마·컬러 토큰부터 만들고 홈·AI 채팅·탐색·포트폴리오 화면 구성</li>
              <li>AI 채팅 스트리밍 중 토큰마다 일어나던 화면 전체 리렌더링을 마지막 메시지로 한정</li>
              <li>실시간 랭킹이 로딩에 멈추던 경쟁 조건 수정, 시세 숫자 애니메이션은 자리당 29행 → 바뀌는 구간(최소 3행)만 렌더링</li>
              <li>Kakao·Google·Apple 로그인과 탈퇴(계정 연결 해제) 구현, Android의 Apple 탈퇴는 웹 브릿지로 해결</li>
              <li>한 코드베이스로 iOS·Android·웹(PWA) 출시, 4개월간 정식 릴리스 5회. OTA는 네이티브 버전이 다른 앱을 제외해 구버전 크래시 방지</li>
              <li>S3·CloudFront 웹 인프라 구성, GitHub Actions로 환경 3개의 웹 배포와 OTA 발행 자동화</li>
              <li>운영 관리자 웹 21개 화면 설계·구현 및 API 연동 (공지 예약, 약관·앱 버전 관리, 개인정보 마스킹)</li>
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
              <li>토큰 만료 시 동시에 발생한 401로 갱신이 중복되고 요청이 유실되던 문제를, 갱신은 한 번만 하고 대기 요청을 다시 보내도록 해결</li>
              <li>사용 현황·크레딧 발급·계정·그룹·공지·정책 등 ADMIN 전 화면과 역할 4종별 접근 제어를 테스트 일정 안에 구현</li>
              <li>크레딧 발급에 권한 제한, 발급량 검증, 확인 단계를 넣어 운영 실수 방지</li>
              <li>커밋·push 전 lint·타입 검사와 S3·CloudFront 배포 자동화 도입</li>
              <li>
                AI 페스타에서 공개되어 <a href="https://www.dt.co.kr/article/11674174">언론에 보도</a>, 산돌구름 AI Studio 베타로 오픈(이용자 약 2천 명)
              </li>
            </ul>
          </Project>
        </Company>

        <Company name="티맥스가이아" when="2022.01 – 2025.01 · 웹오피스 프론트엔드">
          <Project
            title="GAIA OFFICE Chart"
            period="2022.01 – 2025.01"
            summary="웹오피스 차트 개발. 2022.09 팀 개편 이후 차트 기능 전체의 개발·유지보수를 책임지고 신규 입사자 멘토링."
            stack="React · TypeScript · MobX · Victory"
            detail="chart"
          >
            <ul>
              <li>
                데이터 포인트마다 그리던 렌더링을 계열 단위로 바꿔 컴포넌트 수를 1/100로 줄이고{' '}
                <b>대용량 차트 렌더링 10,000ms → 100ms</b>, 30×30 차트 삽입 11초 → 2초
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
              <li>시트 전체(약 170억 셀) 병합 시 멈추던 문제를 실제 데이터 범위만 복사하도록 바꿔 2초 안에 처리 (넓은 범위 평균 10초 → 1.5초)</li>
              <li>명령마다 반복되던 Canvas 렌더링을 명령이 끝날 때 한 번으로 모아 렌더 호출 5회 → 1회</li>
              <li>표시 형식 기능에서 라이브러리가 지원하지 않는 한국 날짜·경과 시간·통화·소수점 규칙 구현</li>
              <li>2년간 이슈 약 555건 처리(약 35%는 담당 기능 밖), 문서 자동 완성 TFT에서 구역 관리 구조와 DB 설계</li>
            </ul>
          </Project>
        </Company>
      </Section>

      <Section title="개인 프로젝트">
        <Project
          title="DoIt2 · 함께 쓰는 버킷리스트 앱"
          period="2026.10 – 현재 · iOS 출시, Android 출시 예정"
          summary="기획부터 앱·Supabase 백엔드·소개/공유 웹 페이지, App Store 심사 대응과 출시까지 진행."
          stack="Expo SDK 58 · Supabase · Zustand · Claude API · Jest"
          detail="doit"
          links={[
            { href: 'https://apps.apple.com/kr/app/id6826993862', label: 'App Store' },
            { href: 'https://doit2app.github.io', label: '소개 사이트' },
            { href: 'https://github.com/epww1502/DoIt2', label: 'GitHub' },
          ]}
        >
          <ul>
            <li>동시에 고쳐도 유실되지 않고 두 번 전송돼도 결과가 같은 변경 단위 동기화를 설계하고 Jest로 검증</li>
            <li>RLS 정책 61개로 권한 설계. AI 추천(Claude API)을 평가 세트 24개로 측정(요청에 맞음 97.9%, 첫 추천 8.9초)</li>
          </ul>
        </Project>
        <Project
          title="Month · 복약 알림 앱"
          period="2026.10 – 현재 · 개발 중"
          summary="앱을 열지 않아도 홈 화면 위젯이 날짜에 맞게 갱신되도록 Android 네이티브 모듈(Kotlin) 구현. Jest 테스트 66개와 CI로 검증."
          stack="Expo SDK 58 · expo-widgets · Kotlin · SQLite · Jest · GitHub Actions"
          detail="month"
        />
      </Section>

      <Section title="기술">
        <Fields
          rows={[
            ['주력', 'TypeScript, React, React Native(Expo), TanStack Query, Zustand, Tailwind/NativeWind'],
            [
              '경험',
              'Next.js, MobX, Canvas, Firebase Auth, Supabase, EAS Build/Update, GitHub Actions, AWS S3·CloudFront, PostHog, Zod, React Hook Form, Jest, React Testing Library, Kotlin, Java·SQL',
            ],
          ]}
        />
      </Section>

      <Section title="학력 · 기타">
        <Fields
          rows={[
            ['Oregon State University', 'Computer Science (Security) · 학점 3.89/4.0, Summa Cum Laude(최우등 졸업) · 2017.09 – 2021.06'],
            ['한국기술교육대학교', '컴퓨터공학 · 2013.02 – 2018.07 (OSU 편입으로 제적)'],
            ['어학 · 병역', '영어 일상 회화 가능 (어학연수·유학 5년) · 공군 만기전역'],
          ]}
        />
      </Section>

      <Section title="수상 · 학교 프로젝트">
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
        <Project
          title="iOS Gesture Alphabet · OSU 졸업 프로젝트"
          period="2021"
          summary="기기를 움직이는 제스처를 알파벳으로 바꿔 입력하는 접근성 앱."
          stack="Swift"
        />
      </Section>
    </main>
  );
}
