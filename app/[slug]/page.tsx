import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllPages, getInternalLinksForPage, getPageBySlug } from "../../lib/pages";
import { getDetailContent, getFaqJsonLd } from "../../lib/detail-content";
import { CONSULT_FORM_URL, SITE_URL } from "../../lib/site";
import { getPilotPage } from "../../lib/pilot-pages";
import { PilotArticle } from "../../components/PilotArticle";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamic = "force-static";
export const dynamicParams = false;
export const revalidate = false;

export function generateStaticParams() {
  return getAllPages().map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = getPageBySlug(slug);

  if (!page) {
    return {};
  }

  const pageUrl = `${SITE_URL}/${page.slug}/`;
  const pilot = getPilotPage(slug);

  return {
    title: {
      absolute: pilot?.title ?? page.title,
    },
    description: pilot?.description ?? page.description,
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title: pilot?.title ?? page.title,
      description: pilot?.description ?? page.description,
      url: pageUrl,
      images: [
        {
          url: "/thumbnail.jpg",
          width: 1254,
          height: 1254,
          alt: pilot?.h1 ?? page.H1,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: pilot?.title ?? page.title,
      description: pilot?.description ?? page.description,
      images: ["/thumbnail.jpg"],
    },
  };
}

export default async function DetailPage({ params }: PageProps) {
  const { slug } = await params;
  const page = getPageBySlug(slug);

  if (!page) {
    notFound();
  }

  const pilot = getPilotPage(slug);
  if (pilot) {
    return <PilotArticle pilot={pilot} />;
  }

  const detail = getDetailContent(page);
  const faqJsonLd = getFaqJsonLd(detail.faqs.items);
  const internalLinks = getInternalLinksForPage(page);

  return (
    <main className="detail-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <section className="detail-hero" aria-labelledby="detail-title">
        <div className="detail-shell">
          <p className="detail-breadcrumb">{detail.breadcrumb}</p>
          <h1 id="detail-title">{page.H1}</h1>

          <figure className="landing-image-wrap">
            <img
              src="/landing.webp"
              alt="폐업 철거와 임대차 원상복구 상담 안내"
              className="landing-image"
            />
          </figure>

          <p className="detail-summary">{detail.summary}</p>
          <div className="detail-actions" aria-label="상담 신청">
            {detail.actions.map((action, index) => (
              <a
                className={index === 0 ? "button button-primary" : "button detail-button-secondary"}
                href={CONSULT_FORM_URL}
                target="_blank"
                rel="noopener noreferrer"
                key={action}
              >
                {action}
              </a>
            ))}
          </div>
          <div className="detail-trust-grid" aria-label="주요 상담 항목">
            {detail.trustCards.map((card) => (
              <div className="detail-trust-card" key={card.title}>
                <span aria-hidden="true">{card.badge}</span>
                <div>
                  <strong>{card.title}</strong>
                  <p>{card.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="detail-section" aria-labelledby="why-title">
        <div className="detail-section-header">
          <p className="eyebrow">{detail.why.eyebrow}</p>
          <h2 id="why-title">{detail.why.h2}</h2>
        </div>
        <div className="detail-content-card">
          {detail.why.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </section>

      <section className="detail-section" aria-labelledby="support-title">
        <div className="detail-support-panel">
          <div>
            <p className="eyebrow">{detail.support.eyebrow}</p>
            <h2 id="support-title">{detail.support.h2}</h2>
            {detail.support.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <div className="detail-notice-card">
            <strong>{detail.support.noticeTitle}</strong>
            <p>{detail.support.noticeText}</p>
          </div>
        </div>
      </section>

      <section className="detail-section" aria-labelledby="cases-title">
        <div className="detail-section-header">
          <p className="eyebrow">{detail.cases.eyebrow}</p>
          <h2 id="cases-title">{detail.cases.h2}</h2>
        </div>
        <div className="detail-case-grid">
          {detail.cases.cards.map((card, index) => (
            <article className="detail-case-card" key={card.title}>
              <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
              <h3>{card.title}</h3>
              <p>{card.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section
        className="detail-section"
        id="detail-process"
        aria-labelledby="process-title"
      >
        <div className="detail-section-header">
          <p className="eyebrow">{detail.process.eyebrow}</p>
          <h2 id="process-title">{detail.process.h2}</h2>
        </div>
        <ol className="detail-process-list">
          {detail.process.steps.map((step, index) => (
            <li key={`${step}-${index}`}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{step}</strong>
            </li>
          ))}
        </ol>
      </section>

      <section className="detail-section" aria-labelledby="faq-title">
        <div className="detail-section-header">
          <p className="eyebrow">{detail.faqs.eyebrow}</p>
          <h2 id="faq-title">{detail.faqs.h2}</h2>
        </div>
        <div className="faq-grid">
          {detail.faqs.items.map((faq) => (
            <article className="faq-card" key={faq.question}>
              <h3>{faq.question}</h3>
              <p>{faq.answer}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="detail-section link-section" aria-labelledby="related-title">
        <div className="detail-section-header">
          <p className="eyebrow">함께 확인할 상담 주제</p>
          <h2 id="related-title">폐업 준비에 필요한 다른 항목도 살펴보세요</h2>
          <p>
            폐업 철거, 원상복구, 지원 가능성 확인처럼 함께 비교하면 좋은 상담
            주제를 모았습니다.
          </p>
        </div>
        <div className="internal-link-grid">
          {internalLinks.map((link) => (
            <a className="internal-link-card" href={link.href} key={link.href}>
              <span aria-hidden="true">{link.badge}</span>
              <h3>{link.title}</h3>
              <p>{link.description}</p>
            </a>
          ))}
        </div>
      </section>

      <section className="detail-final-cta" id="detail-consult" aria-labelledby="cta-title">
        <div className="detail-final-inner">
          <p className="eyebrow">{detail.cta.eyebrow}</p>
          <h2 id="cta-title">{detail.cta.h2}</h2>
          <p>{detail.cta.text}</p>
          <a
            className="button button-primary"
            href={CONSULT_FORM_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            {detail.cta.button}
          </a>
        </div>
      </section>
    </main>
  );
}
