import fs from "node:fs";
import { createContentStyle } from "../lib/content-style.ts";
import { getDetailContent, getFaqJsonLd } from "../lib/detail-content.ts";
import { analyzeSubject } from "../lib/subject-utils.ts";

const pages = JSON.parse(fs.readFileSync("data/pages.json", "utf8"));

const forbiddenPhrases = [
  "프로그래매틱 SEO",
  "자동 생성",
  "템플릿",
  "생성 로직",
  "subject",
  "이 섹션",
  "검색엔진",
  "콘텐츠 생성",
  "작성자",
  "개발자",
  "CSV",
  "스프레드시트",
  "컬럼",
  "랜덤",
  "데이터 기반",
  "업종명은",
  "서비스명은",
  "분석 결과",
];

const riskyClaims = [
  "무조건 지원 가능",
  "100% 환급",
  "전액 지원 보장",
  "최저가 보장",
  "당일 무조건 해결",
  "정부 공식 대행",
  "확정 지원",
  "누구나 받을 수 있음",
  "신청만 하면 받을 수 있음",
];

function fail(message) {
  console.error(message);
  process.exitCode = 1;
}

function countOccurrences(text, needle) {
  if (!needle) return 0;
  return text.split(needle).length - 1;
}

function visibleText(page, detail) {
  return [
    page.H1,
    detail.breadcrumb,
    detail.summary,
    ...detail.actions,
    ...detail.trustCards.flatMap((card) => [card.badge, card.title, card.description]),
    detail.why.eyebrow,
    detail.why.h2,
    ...detail.why.paragraphs,
    detail.support.eyebrow,
    detail.support.h2,
    ...detail.support.paragraphs,
    detail.support.noticeTitle,
    detail.support.noticeText,
    detail.cases.eyebrow,
    detail.cases.h2,
    ...detail.cases.cards.flatMap((card) => [card.title, card.description]),
    detail.process.eyebrow,
    detail.process.h2,
    ...detail.process.steps,
    detail.faqs.eyebrow,
    detail.faqs.h2,
    ...detail.faqs.items.flatMap((faq) => [faq.question, faq.answer]),
    detail.cta.eyebrow,
    detail.cta.h2,
    detail.cta.text,
    detail.cta.button,
  ].join("\n");
}

function generatedBodyText(detail) {
  return [
    detail.breadcrumb,
    detail.summary,
    ...detail.actions,
    ...detail.trustCards.flatMap((card) => [card.badge, card.title, card.description]),
    detail.why.eyebrow,
    detail.why.h2,
    ...detail.why.paragraphs,
    detail.support.eyebrow,
    detail.support.h2,
    ...detail.support.paragraphs,
    detail.support.noticeTitle,
    detail.support.noticeText,
    detail.cases.eyebrow,
    detail.cases.h2,
    ...detail.cases.cards.flatMap((card) => [card.title, card.description]),
    detail.process.eyebrow,
    detail.process.h2,
    ...detail.process.steps,
    detail.faqs.eyebrow,
    detail.faqs.h2,
    ...detail.faqs.items.flatMap((faq) => [faq.question, faq.answer]),
    detail.cta.eyebrow,
    detail.cta.h2,
    detail.cta.text,
    detail.cta.button,
  ].join("\n");
}

function duplicateRate(values) {
  const total = values.length;
  const unique = new Set(values).size;
  return total ? 1 - unique / total : 0;
}

const summaries = [];
const caseDescriptions = [];
const faqQuestions = [];
const ctas = [];
const h2Combos = [];
const processCombos = [];
const first300 = [];
const styleCombos = [];
const supportBlocks = [];

for (const page of pages) {
  if (!page.title || !page.description || !page.H1) {
    fail(`Missing required SEO fields: ${page.slug}`);
    continue;
  }

  const detail = getDetailContent(page);
  const style = createContentStyle(page.slug, page.subject);
  const text = visibleText(page, detail);
  const bodyText = generatedBodyText(detail);
  const analysis = analyzeSubject(page.subject);
  const faqJsonLd = getFaqJsonLd(detail.faqs.items);
  const jsonQuestions = faqJsonLd.mainEntity.map((item) => item.name).join("|");
  const screenQuestions = detail.faqs.items.map((item) => item.question).join("|");

  if (!detail.summary || detail.why.paragraphs.length === 0) {
    fail(`Missing generated body: ${page.slug}`);
  }
  if (jsonQuestions !== screenQuestions) {
    fail(`FAQ JSON-LD mismatch: ${page.slug}`);
  }

  for (const phrase of [...forbiddenPhrases, ...riskyClaims]) {
    if (text.includes(phrase)) {
      fail(`Blocked phrase exposed in ${page.slug}: ${phrase}`);
    }
  }

  if (countOccurrences(bodyText, page.subject) > 18) {
    fail(`Subject repeated too often: ${page.slug}`);
  }
  if (analysis.businessName.length > 1 && countOccurrences(bodyText, analysis.businessName) > 28) {
    fail(`Business name repeated too often: ${page.slug}`);
  }
  if (analysis.serviceName && countOccurrences(bodyText, analysis.serviceName) > 22) {
    fail(`Service name repeated too often: ${page.slug}`);
  }

  const localCaseDescriptions = detail.cases.cards.map((card) => card.description);
  if (new Set(localCaseDescriptions).size !== localCaseDescriptions.length) {
    fail(`Duplicate case card descriptions: ${page.slug}`);
  }

  summaries.push(detail.summary);
  caseDescriptions.push(...localCaseDescriptions);
  faqQuestions.push(...detail.faqs.items.map((faq) => faq.question));
  ctas.push(detail.cta.button);
  h2Combos.push([detail.why.h2, detail.support.h2, detail.cases.h2, detail.process.h2].join("|"));
  processCombos.push(detail.process.steps.join("|"));
  first300.push(text.slice(0, 300));
  supportBlocks.push([detail.support.h2, ...detail.support.paragraphs].join("|"));
  styleCombos.push([
    style.contentAngle,
    style.tone,
    style.manner,
    style.emphasisAxis,
    style.readerSituation,
    style.sectionFlow,
    style.faqAngle,
    style.ctaAngle,
  ].join("|"));
}

const sourceText = [
  ...fs.readdirSync("lib").map((file) => fs.readFileSync(`lib/${file}`, "utf8")),
  ...fs.readdirSync("app", { recursive: true })
    .filter((file) => String(file).endsWith(".tsx"))
    .map((file) => fs.readFileSync(`app/${file}`, "utf8")),
].join("\n");

if (sourceText.includes("Math.random")) fail("Math.random usage found");
if (sourceText.includes("Date.now")) fail("Date.now usage found");
if (sourceText.includes("force-dynamic")) fail("force-dynamic usage found");
if (sourceText.includes("dynamicParams = true")) fail("dynamicParams true usage found");
if (sourceText.includes("unstable_cache")) fail("unstable_cache usage found");
if (sourceText.includes("revalidatePath")) fail("revalidatePath usage found");
if (sourceText.includes("revalidateTag")) fail("revalidateTag usage found");
if (sourceText.includes("cookies(")) fail("cookies() usage found");
if (sourceText.includes("headers(")) fail("headers() usage found");
if (sourceText.includes("fetch(")) fail("runtime fetch usage found in app/lib");

const detailRoute = fs.readFileSync("app/[slug]/page.tsx", "utf8");
if (!detailRoute.includes('dynamic = "force-static"')) fail("detail route is not explicitly force-static");
if (!detailRoute.includes("dynamicParams = false")) fail("detail route dynamicParams must be false");
if (!detailRoute.includes("revalidate = false")) fail("detail route revalidate must be false");
if (!detailRoute.includes("generateStaticParams")) fail("detail route must use generateStaticParams");

const checks = [
  ["detail-summary duplicate rate", duplicateRate(summaries), 0.02],
  ["support section duplicate rate", duplicateRate(supportBlocks), 0.03],
  ["CTA button duplicate rate", duplicateRate(ctas), 0.9],
  ["first 300 chars duplicate rate", duplicateRate(first300), 0.02],
  ["H2 combination duplicate rate", duplicateRate(h2Combos), 0.55],
  ["process combination duplicate rate", duplicateRate(processCombos), 0.12],
  ["style combination duplicate rate", duplicateRate(styleCombos), 0.5],
];

for (const [label, rate, max] of checks) {
  if (rate > max) {
    fail(`${label} too high: ${(rate * 100).toFixed(2)}%`);
  }
}

if (!process.exitCode) {
  console.log(`Content check passed for ${pages.length} pages`);
}
