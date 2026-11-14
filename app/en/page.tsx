import type { Metadata } from 'next';
import { PageHeader } from '@/components/PageHeader';
import { Company, Fields, Project, Section } from '@/components/Resume';
import { TopBar } from '@/components/TopBar';

export const metadata: Metadata = {
  title: { absolute: 'Youngjoo Lee · Resume' },
  description:
    'Resume of Youngjoo Lee, a frontend developer with 5 years of experience in large-scale rendering optimization and shipping and operating apps.',
};

/** English version of the resume (app/page.tsx). Keep the two in step. The case studies it links to are in Korean. */
const CASE = 'Details (KR)';

export default function EnglishResumePage() {
  return (
    <main className="page" lang="en">
      <TopBar
        lang="en"
        links={['portfolio', 'career', 'lab']}
        switchTo={{ href: '/', label: '한국어', name: '한국어' }}
        downloads={[{ href: '/pdf/resume-en.pdf', filename: 'Youngjoo_Lee_Resume.pdf', kind: 'pdf' }]}
      />
      <PageHeader
        lang="en"
        title="Youngjoo Lee"
        lead="Frontend developer with 5 years of experience in large-scale rendering optimization and in shipping and operating apps."
        links={['portfolio', 'career', 'lab']}
      />

      <Section title="EXPERIENCE">
        <Company name="Gwanak Lab · AI fintech startup" when="2025.01 – Present · Frontend (frontend lead since 2026.05)">
          <Project
            title="GLAB · AI digital private banker app"
            period="2025.12 – Present"
            summary="AI investment advisory app for retail investors (launched 2026.07). Own the frontend from planning to release and operations; frontend lead since 2026.05 (release schedule, two teammates). Wrote half of the team's feature PRs (278) and reviewed 149."
            stack="Expo · React Native · TypeScript · TanStack Query · Zustand · NativeWind · Firebase Auth"
            detail="glab"
            detailLabel={CASE}
          >
            <ul>
              <li>Started without designs: built shared components and theme tokens, then Home, AI chat, Explore and Portfolio</li>
              <li>Limited the full-screen re-render on every AI chat streaming token to the last message</li>
              <li>Fixed a race condition that froze the live ranking; the price animation renders only changing rows (29 → 3+ per digit)</li>
              <li>Kakao, Google and Apple sign-in and account deletion; Apple deletion on Android solved with a web bridge</li>
              <li>Shipped iOS, Android and web (PWA) from one codebase: 5 production releases in 4 months; OTA skips apps on another native version</li>
              <li>Set up S3 and CloudFront; automated web deploys for 3 environments and OTA publishing with GitHub Actions</li>
              <li>Designed and built the 21-screen operations admin web (scheduled notices, terms, app versions, data masking)</li>
            </ul>
            <p className="stack">
              Service <a href="https://apps.apple.com/kr/app/id6761149761">App Store</a> ·{' '}
              <a href="https://play.google.com/store/apps/details?id=com.gwanak.glab">Google Play</a> ·{' '}
              <a href="https://glab.gwanaklab.com">Website</a> ·{' '}
              <a href="https://www.mt.co.kr/future/2026/10/02/2026100209504057390">Press (KR)</a>
            </p>
          </Project>

          <Project
            title="LG CNS COP · Generative AI image editing platform"
            period="2025.01 – 2025.11"
            summary="Client project for LG CNS. Designed and built the entire ADMIN frontend and the shared base of the service frontend."
            stack="React · TypeScript · TanStack Query · Zustand · Zod · Tailwind"
            detail="cop"
            detailLabel={CASE}
          >
            <ul>
              <li>Fixed duplicate token refreshes and lost requests on simultaneous 401s: refresh once, then resend the waiting requests</li>
              <li>Built every ADMIN screen (usage, credits, accounts, groups, notices, policies) and access control for 4 roles on schedule</li>
              <li>Added permission limits, amount validation and a confirmation step to credit issuance</li>
              <li>Introduced pre-commit lint and type checks and automated S3 and CloudFront deploys</li>
              <li>
                Unveiled at AI Festa (<a href="https://www.dt.co.kr/article/11674174">press</a>); opened as the Sandoll Cloud AI Studio beta (about 2,000
                users)
              </li>
            </ul>
          </Project>
        </Company>

        <Company name="TmaxGaia" when="2022.01 – 2025.01 · Web office frontend">
          <Project
            title="GAIA OFFICE Chart"
            period="2022.01 – 2025.01"
            summary="Charts for the web office suite. From 2022.09, owned the whole chart feature and mentored new hires."
            stack="React · TypeScript · MobX · Victory"
            detail="chart"
            detailLabel={CASE}
          >
            <ul>
              <li>
                Rendering per series instead of per data point cut components to 1/100: <b>large charts 10,000ms → 100ms</b>, 30×30 insert
                11s → 2s
              </li>
              <li>Designed the chart model and component tree, OOXML import/export, and error bars matching Excel's values</li>
              <li>Tested chart models, undo/redo commands and rendering hooks with Jest and React Testing Library (46 files)</li>
            </ul>
          </Project>

          <Project
            title="GAIA OFFICE Cell · Web spreadsheet"
            period="2022.06 – 2025.01"
            summary="Number formats, merging and pivot tables for the web spreadsheet. Took part in an NTIS national R&D project."
            stack="React · TypeScript · Canvas · Java"
            detail="cell"
            detailLabel={CASE}
          >
            <ul>
              <li>Whole-sheet merge (about 17 billion cells) froze the app; copying only the data range finishes within 2s (wide ranges 10s → 1.5s)</li>
              <li>Batched canvas rendering to once per command: 5 render calls → 1</li>
              <li>Implemented Korean date, elapsed time, currency and decimal rules missing from the number format library</li>
              <li>Handled about 555 issues in 2 years (35% outside my features); designed section management and DB for the auto-fill task force</li>
            </ul>
          </Project>
        </Company>
      </Section>

      <Section title="PERSONAL PROJECTS">
        <Project
          title="DoIt2 · Shared bucket list app"
          period="2026.10 – Present · iOS released, Android planned"
          summary="Planning, app, Supabase backend, intro and share web pages, App Store review and release."
          stack="Expo SDK 58 · Supabase · Zustand · Jest"
          detail="doit"
          detailLabel={CASE}
          links={[
            { href: 'https://apps.apple.com/kr/app/id6826993862', label: 'App Store' },
            { href: 'https://doit2app.github.io', label: 'Website' },
            { href: 'https://github.com/epww1502/DoIt2', label: 'GitHub' },
          ]}
        >
          <ul>
            <li>Change-based sync that survives concurrent edits and repeated sends, verified with Jest</li>
            <li>61 RLS policies restricting access to space members; OTA, forced updates and error collection</li>
          </ul>
        </Project>
        <Project
          title="Month · Medication reminder app"
          period="2026.10 – Present · In development"
          summary="Android native module (Kotlin) so the home screen widget follows the date without opening the app; 66 Jest tests and CI."
          stack="Expo SDK 58 · expo-widgets · Kotlin · SQLite · Jest · GitHub Actions"
          detail="month"
          detailLabel={CASE}
        />
      </Section>

      <Section title="SKILLS">
        <Fields
          rows={[
            ['Core', 'TypeScript, React, React Native (Expo), TanStack Query, Zustand, Tailwind/NativeWind'],
            [
              'Experience',
              'Next.js, MobX, Canvas, Firebase Auth, Supabase, EAS Build/Update, GitHub Actions, AWS S3·CloudFront, PostHog, Zod, React Hook Form, Jest, React Testing Library, Kotlin, Java·SQL',
            ],
          ]}
        />
      </Section>

      <Section title="EDUCATION · OTHER">
        <Fields
          rows={[
            ['Oregon State University', 'Computer Science (Security) · GPA 3.89/4.0, Summa Cum Laude · 2017.09 – 2021.06'],
            ['KOREATECH', 'Computer Engineering · 2013.02 – 2018.07 (left to transfer to OSU)'],
            ['Languages · Military', 'Korean (native), English (conversational, 5 years abroad) · Military service completed (ROK Air Force)'],
          ]}
        />
      </Section>

      <Section title="AWARDS · SCHOOL PROJECTS">
        <Project
          title="BeaverHacks Spring 2021 (OSU fintech hackathon) · 3rd of 17 teams"
          period="2021.04"
          summary="Crypto auto-trading bot (team of 2). Built the volatility breakout strategy and the Upbit API integration; reports trades to Slack."
          stack="Python · Upbit API · PyQt5"
          links={[
            { href: 'https://devpost.com/software/kimchi-trading-bot', label: 'Result' },
            { href: 'https://github.com/epww1502/OSUHackathon-2021Sp', label: 'GitHub' },
          ]}
        />
        <Project
          title="iOS Gesture Alphabet · OSU capstone project"
          period="2021"
          summary="Accessibility app that turns device motion gestures into letters for text input."
          stack="Swift"
        />
      </Section>
    </main>
  );
}
