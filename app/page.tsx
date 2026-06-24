import type { Metadata } from "next";
import { CONSULT_FORM_URL, SITE_URL } from "../lib/site";
import { getHomeInternalLinks } from "../lib/pages";

export const metadata: Metadata = {
  title: "소상공인 폐업지원금으로 점포 철거비 부담을 줄이는 원상복구 상담",
  description:
    "점포 철거비 지원 대상 여부 확인부터 폐업 철거, 임대차 원상복구 범위와 견적 상담까지 차분히 안내합니다.",
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: "소상공인 폐업지원금으로 점포 철거비 부담을 줄이는 원상복구 상담",
    description:
      "점포 철거비 지원 대상 여부 확인부터 폐업 철거, 임대차 원상복구 범위와 견적 상담까지 차분히 안내합니다.",
    url: SITE_URL,
    images: [
      {
        url: "/thumbnail.jpg",
        width: 1254,
        height: 1254,
        alt: "소상공인 폐업지원금 점포 철거비 상담",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "소상공인 폐업지원금으로 점포 철거비 부담을 줄이는 원상복구 상담",
    description:
      "점포 철거비 지원 대상 여부 확인부터 폐업 철거, 임대차 원상복구 범위와 견적 상담까지 차분히 안내합니다.",
    images: ["/thumbnail.jpg"],
  },
};

const trustCards = [
  {
    title: "폐업 철거",
    badge: "폐업",
    description:
      "매장 정리부터 내부 시설 철거까지 폐업 일정에 맞춰 필요한 범위를 확인합니다.",
  },
  {
    title: "임대차 원상복구",
    badge: "복구",
    description:
      "임대인이 요구한 기준과 계약 조건을 바탕으로 원상복구 방향을 정리합니다.",
  },
  {
    title: "점포 철거비 지원 확인",
    badge: "지원",
    description:
      "희망리턴패키지 점포 철거비 지원 대상 여부를 먼저 확인할 수 있도록 안내합니다.",
  },
  {
    title: "현장 확인 및 견적 상담",
    badge: "견적",
    description:
      "철거 범위, 폐기물, 일정, 현장 조건을 확인해 현실적인 견적 상담을 진행합니다.",
  },
];

const supportPoints = [
  {
    badge: "대상",
    text: "폐업 예정이거나 폐업한 소상공인이 점포 철거와 원상복구를 준비할 때 먼저 확인해야 합니다.",
  },
  {
    badge: "조건",
    text: "점포 철거비 지원은 신청 조건, 사업장 상황, 제출 서류 등에 따라 가능 여부가 달라질 수 있습니다.",
  },
  {
    badge: "준비",
    text: "제도 운영기관은 아니며, 철거 원상복구 상담 업체로서 신청 전 준비사항과 현장 진행 방향을 안내합니다.",
  },
];

const needCases = [
  "임대인이 원상복구를 요구한 경우",
  "폐업 일정이 정해졌는데 철거 견적이 부담되는 경우",
  "점포 철거비 지원 대상인지 확인이 필요한 경우",
  "철거 범위와 원상복구 기준이 헷갈리는 경우",
];

const processSteps = [
  "상담 접수",
  "지원 가능 여부 및 상황 확인",
  "현장 확인",
  "견적 및 철거 범위 안내",
  "철거 및 원상복구 진행",
  "마무리 확인",
];

const internalLinks = getHomeInternalLinks();

export default function Home() {
  return (
    <main>
      <section className="hero-section" aria-labelledby="hero-title">
        <div className="hero-shell">
          <div className="hero-grid" id="top">
            <div className="hero-copy">
              <p className="eyebrow">폐업 철거 · 임대차 원상복구 · 지원 가능 여부 확인</p>
              <h1 id="hero-title">
                <span>소상공인</span>
                <span>폐업지원금으로</span>
                <span>점포 철거비 부담을</span>
                <span>줄이는 원상복구</span>
                <span>상담</span>
              </h1>
              <p className="hero-description">
                폐업을 앞둔 매장과 상가의 철거 범위, 임대차 원상복구 기준,
                희망리턴패키지 점포 철거비 지원 가능 여부를 한 번에 확인해
                드립니다.
              </p>
              <div className="hero-actions" aria-label="상담 신청">
                <a
                  className="button button-primary"
                  href={CONSULT_FORM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  철거비 지원 가능 여부 상담하기
                </a>
                <a
                  className="button button-secondary"
                  href={CONSULT_FORM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  원상복구 상담 요청하기
                </a>
              </div>
              <p className="hero-note">
                지원 제도는 대상 조건 확인이 필요하며, 실제 지원 가능 여부는
                사업장과 신청 조건에 따라 달라질 수 있습니다.
              </p>
            </div>

            <aside className="hero-card" aria-label="상담 흐름 요약">
              <div className="status-pill">폐업 전 먼저 확인</div>
              <h2>상담 시 함께 확인하는 항목</h2>
              <ul className="check-list">
                <li>
                  <span aria-hidden="true">01</span>
                  폐업 예정일과 임대차 종료 일정
                </li>
                <li>
                  <span aria-hidden="true">02</span>
                  원상복구 요구 범위와 현장 상태
                </li>
                <li>
                  <span aria-hidden="true">03</span>
                  점포 철거비 지원 대상 조건
                </li>
                <li>
                  <span aria-hidden="true">04</span>
                  견적, 철거 일정, 마무리 확인
                </li>
              </ul>
              <div className="mini-panel">
                <strong>제도 확인부터 현장 상담까지</strong>
                <p>폐업 일정에 맞춰 필요한 절차를 함께 정리합니다.</p>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="section trust-section" aria-labelledby="trust-title">
        <div className="section-header">
          <p className="eyebrow">꼭 필요한 부분부터 차분히</p>
          <h2 id="trust-title">폐업 점포 철거와 원상복구를 한 번에 상담합니다</h2>
          <p>
            폐업 과정에서 가장 많이 막히는 비용, 범위, 일정, 지원 가능 여부를
            현장 중심으로 정리해 드립니다.
          </p>
        </div>
        <div className="card-grid four">
          {trustCards.map((card) => (
            <article className="feature-card" key={card.title}>
              <div className="icon-badge" aria-hidden="true">
                {card.badge}
              </div>
              <h3>{card.title}</h3>
              <p>{card.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section support-section" aria-labelledby="support-title">
        <div className="support-card">
          <div className="support-copy">
            <p className="eyebrow">희망리턴패키지 점포 철거비 지원 안내</p>
            <h2 id="support-title">지원 대상 여부 확인이 먼저입니다</h2>
            <p>
              폐업 철거와 철거 원상복구를 준비하는 소상공인이라면
              희망리턴패키지의 점포 철거비 지원 항목을 확인해 볼 수 있습니다.
              다만 모든 사업장이 지원 대상이 되는 것은 아니므로, 신청 전 조건과
              준비사항을 꼼꼼히 살펴보는 과정이 필요합니다.
            </p>
          </div>
          <div className="support-list" role="list">
            {supportPoints.map((point) => (
              <div className="support-item" role="listitem" key={point.text}>
                <span aria-hidden="true">{point.badge}</span>
                <p>{point.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section situations-section" aria-labelledby="situations-title">
        <div className="section-header">
          <p className="eyebrow">이런 상황이라면</p>
          <h2 id="situations-title">철거 원상복구 상담이 필요할 수 있습니다</h2>
        </div>
        <div className="situation-grid">
          {needCases.map((item) => (
            <article className="situation-card" key={item}>
              <span className="dot" aria-hidden="true" />
              <h3>{item}</h3>
              <p>
                비용과 일정이 커지기 전에 철거 범위와 지원 확인 절차를 먼저
                정리해 보세요.
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="section process-section" id="process" aria-labelledby="process-title">
        <div className="section-header">
          <p className="eyebrow">진행 절차</p>
          <h2 id="process-title">상담부터 마무리 확인까지 순서대로 진행합니다</h2>
        </div>
        <ol className="process-list">
          {processSteps.map((step, index) => (
            <li className="process-step" key={step}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{step}</strong>
            </li>
          ))}
        </ol>
      </section>

      <section className="section link-section" aria-labelledby="link-title">
        <div className="section-header">
          <p className="eyebrow">필요한 상담 주제</p>
          <h2 id="link-title">폐업 준비 상황에 맞는 내용을 확인해 보세요</h2>
          <p>
            점포 철거비 지원 확인, 폐업 철거, 철거 원상복구처럼 자주 문의하는
            내용을 상황별로 살펴볼 수 있습니다.
          </p>
        </div>
        <div className="internal-link-grid">
          {internalLinks.map((link) => (
            <a className="internal-link-card" href={link.href} key={link.title}>
              <span aria-hidden="true">{link.badge}</span>
              <h3>{link.title}</h3>
              <p>{link.description}</p>
            </a>
          ))}
        </div>
      </section>

      <section className="final-cta" id="consult" aria-labelledby="consult-title">
        <div className="final-cta-inner">
          <p className="eyebrow">폐업 일정이 가까울수록 먼저 확인하세요</p>
          <h2 id="consult-title">
            점포 철거비 지원 가능 여부와 원상복구 범위를 함께 상담해 드립니다
          </h2>
          <p>
            폐업 일정, 임대차 계약 상황, 현장 상태를 알려주시면 필요한 절차와
            철거 방향을 차분히 안내하겠습니다.
          </p>
          <a
            className="button button-primary"
            href={CONSULT_FORM_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            철거 원상복구 상담 신청
          </a>
        </div>
      </section>
    </main>
  );
}
