import type { Metadata } from 'next';
import { PageHeader } from '@/components/PageHeader';
import { Company, Fields, Label, Project, Section } from '@/components/Resume';
import { TopBar } from '@/components/TopBar';

export const metadata: Metadata = { title: '경력기술서' };

/**
 * 경력기술서: what each project was, the role, and the outcome.
 * The reasoning behind each problem lives in the portfolio case studies, so it is kept short here.
 * scripts/build-docx.py turns the exported HTML of this page into the Word download.
 */
export default function CareerPage() {
  return (
    <main className="page career">
      <TopBar
        links={['resume', 'portfolio']}
        downloads={[
          { href: '/pdf/career.docx', filename: '이영주_경력기술서.docx', kind: 'word' },
          { href: '/pdf/career.pdf', filename: '이영주_경력기술서.pdf', kind: 'pdf' },
        ]}
      />
      <PageHeader
        title="경력기술서"
        lead="이영주 · 대용량 렌더링 최적화와 앱 출시·운영 경험을 가진 5년차 프론트엔드 개발자"
        links={['resume', 'portfolio']}
      />

      <Section title="경력 요약">
        <Fields
          rows={[
            ['총 경력', '2022.01 – 현재 (5년차)'],
            ['관악연구소', '2025.01 – 현재 · 프론트엔드 (2026.05부터 파트장) · GLAB 앱·관리자 웹, LG CNS COP'],
            ['티맥스가이아', '2022.01 – 2025.01 · 연구원 · GAIA OFFICE Chart·Cell'],
            ['주력 기술', 'TypeScript, React, React Native(Expo), TanStack Query, Zustand, Tailwind/NativeWind'],
          ]}
        />
        <ul className="strengths">
          <li>
            <b>대용량 렌더링 개선</b> · 차트 렌더링 10,000ms → 100ms, 멈추던 시트 전체(약 170억 셀) 병합을 2초 안에 처리
          </li>
          <li>
            <b>앱 출시와 운영</b> · Expo 한 코드베이스로 iOS·Android·웹 출시, 빌드·OTA·웹 배포 자동화와 스토어 심사 대응
          </li>
          <li>
            <b>운영 도구와 공통 기반</b> · ADMIN·관리자 웹 설계, 인증·오류 처리 공통화, 팀 코드리뷰
          </li>
        </ul>
      </Section>

      <Section title="경력 상세">
        <Company
          name="관악연구소"
          when="2025.01 – 현재 · AIX팀 · 프론트엔드 (2026.05부터 파트장)"
          summary="웹·앱 프론트엔드 개발. LG CNS 고객사 프로젝트(COP)를 마친 뒤 자사 서비스 GLAB을 개발했고, 2026.05부터 프론트엔드 파트장을 맡음."
        >
          <Project title="GLAB · AI 디지털 PB 앱" period="2025.12 – 현재">
            <Fields
              variant="meta"
              rows={[
                ['개요', '개인 투자자에게 AI 투자 상담과 종목·포트폴리오 분석을 제공하는 앱. 2026.07 정식 출시'],
                ['역할', '프론트엔드 개발, 2026.05부터 파트장 · 기획, 빌드, 배포, 운영'],
                ['팀 구성', '프론트엔드 4명, 백엔드 2명, AI 2명'],
                [
                  '기술',
                  'Expo, React Native, TypeScript, TanStack Query, Zustand, NativeWind, Firebase Auth, EAS, AWS S3·CloudFront, GitHub Actions, PostHog',
                ],
                [
                  '서비스',
                  <>
                    <a href="https://apps.apple.com/kr/app/id6761149761">App Store</a> ·{' '}
                    <a href="https://play.google.com/store/apps/details?id=com.gwanak.glab">Google Play</a> ·{' '}
                    <a href="https://glab.gwanaklab.com">glab.gwanaklab.com</a>
                  </>,
                ],
              ]}
            />
            <Label>주요 업무</Label>
            <ul>
              <li>디자인 산출물 없이 기획과 개발을 함께 시작해 공통 컴포넌트와 테마·컬러 토큰을 먼저 만들고, 로그인 → 채팅 → 분석 결과 흐름을 기준으로 MVP 범위 정리</li>
              <li>홈 대시보드, AI 채팅, 탐색 실시간 랭킹, 포트폴리오 매매·편집·복사, 마이페이지 개발. 추천 질문을 채팅에서 홈으로 옮기는 등 화면 흐름 개편</li>
              <li>Kakao·Google·Apple 로그인과 계정 연결 해제를 포함한 탈퇴 구현. Android의 Apple 탈퇴는 웹에서 code와 id_token을 받아 딥링크로 넘기는 브릿지로 해결</li>
              <li>Expo 한 코드베이스로 iOS·Android·웹(PWA) 출시, v1.1 → v1.5까지 4개월간 정식 릴리스 5회. 운영·개발·디버그 환경 분리</li>
              <li>도메인·S3·CloudFront로 웹 인프라를 구성하고, GitHub Actions로 웹 배포와 OTA 발행 자동화</li>
              <li>코드리뷰(동료 PR 149건 머지), PR 템플릿 도입, 팀 기능 PR 약 540개 중 278개 작성</li>
            </ul>
            <Label>문제 해결</Label>
            <ul>
              <li>
                <b>AI 채팅 스트리밍 리렌더링</b> · 토큰이 올 때마다 화면 전체가 다시 그려지던 것을, store 동기화를 건너뛰고 마지막 메시지만 그리도록 수정. 보이지 않는 채팅 화면은 렌더링을 멈춤
              </li>
              <li>
                <b>OTA와 구버전 앱</b> · 네이티브 코드가 다른 옛 앱이 새 번들을 받아 종료될 수 있어, 네이티브 버전이 다른 앱은 업데이트 대상에서 제외. 업데이트는 백그라운드에서 받아 복귀할 때 적용
              </li>
              <li>
                <b>배포 후 옛 화면</b> · 해시가 붙은 파일은 길게 캐시하고 HTML과 서비스 워커는 매번 확인하도록 나누고, 배포 때 CloudFront 캐시 무효화를 자동 실행
              </li>
              <li>
                <b>실시간 랭킹 멈춤</b> · 연결 전에 보낸 구독 해지가 늦게 도착해 로딩에 멈추던 경쟁 조건을 수정하고, 1초 안에 데이터가 없으면 다시 구독
              </li>
            </ul>
            <Label>성과</Label>
            <ul>
              <li>
                2026.07 iOS·Android·웹 정식 출시,{' '}
                <a href="https://www.mt.co.kr/future/2026/10/02/2026100209504057390">머니투데이 보도</a>
              </li>
              <li>릴리스 사이의 수정은 심사 없이 OTA로 반영, push 한 번으로 웹 배포와 OTA 발행까지 처리</li>
            </ul>
          </Project>

          <Project title="GLAB 관리자 웹" period="2026.08 – 현재">
            <Fields
              variant="meta"
              rows={[
                ['개요', 'GLAB 앱 운영용 관리자 웹. 사용자, 공지, 약관, 앱 버전, 추천 질문, 고객 지원 등 21개 화면'],
                ['역할', '기획·설계·구현, API 연동'],
                ['기술', 'Vite, React 19, React Router 7, Zustand, React Hook Form, Zod, TipTap'],
              ]}
            />
            <Label>주요 업무</Label>
            <ul>
              <li>관리자 웹에서 바꾼 내용이 그대로 앱 사용자에게 나가므로, 운영 실수가 나기 쉬운 지점을 화면과 Zod 검증 규칙으로 정리</li>
              <li>공지는 지난 시각으로 예약할 수 없고, 게시된 공지는 게시일·푸시 설정을 바꿀 수 없게 제한. 사용 중인 약관 유형은 삭제 차단</li>
              <li>앱 버전을 iOS·Android·웹별로 등록하고, 지금 배포 중인 버전이 묻히지 않게 최신/이전 목록 분리</li>
              <li>TipTap 에디터 하나를 출력 형식만 바꿔 재사용(공지는 Markdown, 약관은 앱 렌더러에 맞춘 HTML)</li>
              <li>사용자·고객 지원 화면의 이메일·닉네임을 기본으로 마스킹하고 필요한 행만 열람</li>
            </ul>
          </Project>

          <Project title="LG CNS COP · 생성형 AI 이미지 편집 플랫폼" period="2025.01 – 2025.11">
            <Fields
              variant="meta"
              rows={[
                [
                  '개요',
                  '텍스트로 이미지를 만들고 배경 확장·제거, 부분 편집, 업스케일링, 이미지 속 텍스트 편집까지 하는 웹 서비스 (LG CNS 고객사 프로젝트)',
                ],
                ['역할', 'ADMIN 프론트엔드 전체 설계·구현, 서비스 프론트엔드 공통 기반과 배포 자동화'],
                ['팀 구성', '프론트엔드 3명, 백엔드 2명'],
                [
                  '기술',
                  'React, TypeScript, TanStack Query·Table, Zustand, Zod, Tailwind, husky, GitHub Actions, AWS S3·CloudFront',
                ],
              ]}
            />
            <Label>주요 업무</Label>
            <ul>
              <li>사용 현황·크레딧 발급·계정·그룹·공지·정책·퀵 프롬프트 등 ADMIN 전 화면 구현, 역할 4종에 따라 메뉴·탭·접근 경로 분리</li>
              <li>크레딧 발급은 마스터에게만 노출하고, 발급량 10~9,999 범위 검증과 확인 모달로 운영 실수 방지</li>
              <li>사용 현황 필터를 URL에 담아 새로고침·뒤로 가기에도 유지, 그룹 → 사용자 드릴다운과 엑셀 내보내기</li>
              <li>로그인과 공통 컴포넌트 설계. 서버 오류를 쿼리 캐시에서 한곳으로 모아 코드별로 안내하고, 응답은 Zod로 검증</li>
              <li>husky·lint-staged로 커밋·push 전 lint와 타입 검사, main push 시 S3 배포와 CloudFront 캐시 무효화 자동화</li>
              <li>DTO·서비스 문서를 작성해 백엔드와 API 형식 합의</li>
            </ul>
            <Label>문제 해결</Label>
            <ul>
              <li>
                <b>토큰 만료 시 동시에 발생하는 401</b> · 이미지 생성·편집 요청이 한꺼번에 401을 받으면 갱신이 중복되거나 요청이 유실됐음. 재발급은 백엔드로 옮기고, 프론트는 공통 인터셉터에서 갱신을 한 번만 실행한 뒤 대기 요청을 새 토큰으로 다시 보내도록 변경. 갱신이 실패하면 대기 요청을 비우고 로그인 만료로 전환
              </li>
            </ul>
            <Label>성과</Label>
            <ul>
              <li>
                AI 페스타에서 공개, <a href="https://www.dt.co.kr/article/11674174">디지털타임스 보도</a>.{' '}
                <a href="https://www.sandollcloud.com/aistudio">산돌구름 AI Studio</a> 베타 오픈 (2025.09 – 12, 이용자 약 2천 명)
              </li>
              <li>ADMIN 전체를 테스트 일정 안에 완료, 같은 인증·오류 처리 구조를 서비스와 ADMIN에 적용</li>
            </ul>
          </Project>
        </Company>

        <Company
          name="티맥스가이아"
          when="2022.01 – 2025.01 · 연구원"
          summary="웹오피스 GAIA OFFICE의 스프레드시트(Cell)와 차트(Chart) 프론트엔드 개발. 팀 구성 프론트엔드 6명, 백엔드 4명."
        >
          <Project title="GAIA OFFICE Chart" period="2022.01 – 2025.01">
            <Fields
              variant="meta"
              rows={[
                ['개요', '웹오피스 문서에 들어가는 차트 (Victory 기반). NTIS 국가 R&D 과제(12859502) 참여'],
                ['역할', '차트 모델·컴포넌트 설계, 2022.09 팀 개편 이후 차트 기능 전체 개발·유지보수, 신규 입사자 멘토링'],
                ['팀 구성', '차트 담당 3명'],
                ['기술', 'React, TypeScript, MobX, Victory'],
              ]}
            />
            <Label>주요 업무</Label>
            <ul>
              <li>Chart 모델·컴포넌트 트리·데이터 관리 구조 설계, OOXML 기준 Import/Export</li>
              <li>오차 막대(고정값·백분율·표준오차·표준편차): Victory가 지원하지 않는 형태는 path 값을 수정해 구현하고, 오차량 계산식을 MS Excel 2021과 같은 값으로 맞춤</li>
              <li>차트 종류 변경·행/열 전환: 모델을 복제·전치해 오차 막대·데이터 레이블·스타일을 유지하고 Undo/Redo 지원</li>
              <li>데이터 참조를 문자열에서 셀 주소 객체로 바꾸고, 여러 범위 선택(Multi-Range)과 다단계 항목(Multi-Level Category) 지원</li>
              <li>데이터 선택 다이얼로그: 범위를 바꾸면 미리보기에 바로 반영하고, 범위가 맞지 않으면 오류를 띄우고 미리보기를 멈춤</li>
              <li>미니 셀: Word·Point 문서에 차트를 넣기 위해 데이터용 셀 문서를 링크 방식으로 연결하는 구조 설계</li>
            </ul>
            <Label>문제 해결</Label>
            <ul>
              <li>
                <b>대용량 차트 렌더링 (2023.01 – 03)</b> · 데이터 포인트마다 컴포넌트를 만들어 100×100 차트에 10,000개가 생기던 구조를, 계열 하나를 path 하나로 그리도록 바꿔 100개로 축소. 서버로 보내던 메시지 수도 줄여 서버 데드락 해결
              </li>
            </ul>
            <Label>성과</Label>
            <ul>
              <li>100×100 차트 렌더링 10,000ms → 100ms, 30×30 차트 삽입 11초 → 2초</li>
            </ul>
          </Project>

          <Project title="GAIA OFFICE Cell · 웹 스프레드시트" period="2022.06 – 2025.01">
            <Fields
              variant="meta"
              rows={[
                ['개요', '웹오피스 스프레드시트. NTIS 국가 R&D 과제(12859502) 참여'],
                ['역할', '표시 형식·병합·피벗 테이블·그래픽 요소 개발과 유지보수'],
                ['기술', 'React, TypeScript, Canvas, Java, SQL'],
              ]}
            />
            <Label>주요 업무</Label>
            <ul>
              <li>표시 형식(Number Format): numfmt 기반 UI 구축, 라이브러리가 지원하지 않는 한국 날짜·경과 시간·원화·소수점 증감 규칙 구현. 회계 서식은 Canvas measureText로 간격 계산</li>
              <li>값 입력·표시 형식 적용 시 열 너비 자동 맞춤, 전체 열 선택 시에는 데이터가 있는 범위로 제한해 멈춤 방지</li>
              <li>2년간 이슈 약 555건 처리 (약 35%는 담당 기능 밖)</li>
              <li>문서 자동 완성 TFT(2023.06 – 08, 5명): Word·Point·Cell 공통 구역 관리 구조와 DB 테이블 설계, 구역·태그 CRUD와 편집 UI 구현(Spring·MyBatis·MySQL). 배달서비스공제조합에 제공</li>
            </ul>
            <Label>문제 해결</Label>
            <ul>
              <li>
                <b>시트 전체 병합 시 멈춤 (2024.03 – 05)</b> · 병합 전 값을 백업하며 빈 칸까지 전부 복사하던 것을, 실제 데이터가 있는 최소 범위만 복사하도록 변경. 셀마다 만들던 서버 메시지는 범위 단위로 묶고 Excel 2021의 병합 스타일 규칙에 맞춤
              </li>
              <li>
                <b>반복되는 Canvas 렌더링</b> · 명령마다 일어나던 렌더링을 명령이 끝날 때 한 번으로 모음
              </li>
            </ul>
            <Label>성과</Label>
            <ul>
              <li>멈추던 전체 병합을 2초 안에 처리, 넓은 범위 병합 평균 10초 → 1.5초</li>
              <li>병합·스타일 적용 시 렌더 호출 5회 → 1회</li>
            </ul>
          </Project>
        </Company>
      </Section>

      <Section title="개인 프로젝트">
        <Project title="DoIt2 · 함께 쓰는 버킷리스트 앱" period="2026.10 – 현재 · iOS 출시, Android 출시 예정">
          <Fields
            variant="meta"
            rows={[
              ['개요', '연인·친구·가족이 공간을 만들어 버킷리스트를 함께 모으고 기록하는 앱. 기획부터 App Store 심사 대응과 출시까지 진행'],
              [
                '기술',
                <>
                  Expo SDK 58, Supabase, Zustand, Jest · <a href="https://apps.apple.com/kr/app/id6826993862">App Store</a> ·{' '}
                  <a href="https://github.com/epww1502/DoIt2">GitHub</a>
                </>,
              ],
            ]}
          />
          <ul>
            <li>여러 명이 동시에 고쳐도 유실되지 않도록 변경 단위로 기록해 서버 최신 상태 위에 다시 적용, Jest로 시나리오 검증</li>
            <li>RLS 정책 63개로 공간 멤버만 접근하도록 설계, App Store 심사에서 요구한 신고·차단 기능도 RLS로 추가</li>
            <li>OTA·강제 업데이트·오류 수집, 사진 크기 축소와 저장소 경로 기준 캐시</li>
          </ul>
        </Project>
        <Project title="Month · 복약 알림 앱" period="2026.10 – 현재 · 개발 중">
          <Fields
            variant="meta"
            rows={[
              ['개요', '약과 복용 시간을 등록하면 알림과 홈 화면 위젯에서 바로 복용을 기록하는 iOS·Android 앱'],
              ['기술', 'Expo SDK 58, expo-widgets, Kotlin, SQLite, Jest, GitHub Actions'],
            ]}
          />
          <ul>
            <li>앱을 열지 않아도 날짜가 바뀌는 위젯: Android는 Kotlin 네이티브 모듈과 자정 알람, iOS는 0시 타임라인으로 처리</li>
            <li>iOS 예약 알림 64개 제한과 Android 14 정확한 알람 권한에 맞춰 7일치를 날짜별로 예약</li>
            <li>Jest 단위 테스트 66개, PR마다 GitHub Actions CI</li>
          </ul>
        </Project>
      </Section>
    </main>
  );
}
