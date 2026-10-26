import Link from "next/link";
import { getPageBySlug } from "../lib/pages";
import { CONSULT_FORM_URL, SITE_URL } from "../lib/site";
import type { PilotPage } from "../lib/pilot-pages";

type Props = { pilot: PilotPage };

export function PilotArticle({ pilot }: Props) {
  const pageUrl = `${SITE_URL}/${pilot.slug}/`;
  const relatedPages = pilot.relatedSlugs
    .map((slug) => getPageBySlug(slug))
    .filter((page) => Boolean(page));

  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: pilot.title,
      description: pilot.description,
      url: pageUrl,
      inLanguage: "ko-KR",
      dateModified: pilot.updatedAt,
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "홈", item: `${SITE_URL}/` },
        { "@type": "ListItem", position: 2, name: pilot.h1, item: pageUrl },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: pilot.faq.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.answer },
      })),
    },
  ];

  return (
    <main className="detail-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />
      <section className="detail-hero" aria-labelledby="detail-title">
        <div className="detail-shell">
          <p className="detail-breadcrumb">업종별 폐업·철거 실무 안내</p>
          <h1 id="detail-title">{pilot.h1}</h1>
          {/* Give search visitors the actual answer before showing a long conversion image. */}
          <p className="detail-summary">{pilot.lead}</p>
          {pilot.notice && (
            <div className="detail-notice-card">
              <strong>지원사업 접수 현황 · 2026년 10월 26일 기준</strong>
              <p>{pilot.notice}</p>
              {pilot.sourceUrl && (
                <p>
                  <a href={pilot.sourceUrl} target="_blank" rel="noopener noreferrer">
                    소상공인시장진흥공단 공식 공고 확인
                  </a>
                </p>
              )}
            </div>
          )}
          <div className="detail-actions">
            <a className="button button-primary" href={CONSULT_FORM_URL} target="_blank" rel="noopener noreferrer">
              민간 철거·원상복구 견적 상담
            </a>
          </div>
        </div>
      </section>
 <section className="detail-section">
        <div className="detail-shell">
          <figure className="landing-image-wrap">
            <img src="/landing.webp" alt="점포 철거와 원상복구 민간 견적 상담 안내 이미지" className="landing-image" loading="lazy" />
          </figure>
        </div>
      </section>
      {pilot.sections.map((section, index) => (
        <section className="detail-section" key={`${pilot.slug}-${index}`} aria-labelledby={`pilot-section-${index}`}>
          <div className="detail-section-header">
            <p className="eyebrow">{String(index + 1).padStart(2, "0")} · 현장 확인</p>
            <h2 id={`pilot-section-${index}`}>{section.heading}</h2>
          </div>
          <div className="detail-content-card">
            {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            <ul>
              {section.checklist.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>
        </section>
      ))}

      <section className="detail-section" aria-labelledby="pilot-faq">
        <div className="detail-section-header">
          <p className="eyebrow">업종별 질문</p>
          <h2 id="pilot-faq">자주 묻는 질문</h2>
        </div>
        <div className="faq-grid">
          {pilot.faq.map((item) => (
            <article className="faq-card" key={item.question}>
              <h3>{item.question}</h3>
              <p>{item.answer}</p>
            </article>
          ))}
        </div>
      </section>

      {relatedPages.length > 0 && (
        <section className="detail-section link-section" aria-labelledby="pilot-related">
          <div className="detail-section-header">
            <p className="eyebrow">함께 볼 내용</p>
            <h2 id="pilot-related">이어서 확인할 철거·폐업 정보</h2>
          </div>
          <div className="internal-link-grid">
            {relatedPages.map((related) => (
              <Link className="internal-link-card" href={`/${related!.slug}/`} key={related!.slug}>
                <h3>{related!.subject}</h3>
                <p>{related!.description}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

     

      <section className="detail-final-cta" id="detail-consult" aria-labelledby="pilot-cta">
        <div className="detail-final-inner">
          <p className="eyebrow">민간 공사 상담</p>
          <h2 id="pilot-cta">현재 점포 조건에 맞춰 철거 범위를 확인하세요</h2>
          <p>실제 견적은 현장 상태, 계약상 복구 의무, 폐기물 처리와 반출 조건에 따라 달라집니다. 이 상담은 정부 지원금 신청·지급을 보장하지 않습니다.</p>
          <a className="button button-primary" href={CONSULT_FORM_URL} target="_blank" rel="noopener noreferrer">
            철거·원상복구 견적 문의하기
          </a>
        </div>
      </section>
    </main>
  );
}
