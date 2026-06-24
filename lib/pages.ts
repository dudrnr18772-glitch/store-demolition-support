import pagesData from "../data/pages.json";
import type { SeoPage } from "./detail-content";
import { analyzeSubject } from "./subject-utils";

const pages = pagesData as SeoPage[];
const pageMap = new Map(pages.map((page) => [page.slug, page]));

export type InternalLink = {
  title: string;
  badge: string;
  description: string;
  href: string;
};

export function getAllPages() {
  return pages;
}

export function getPageBySlug(slug: string) {
  return pageMap.get(slug);
}

function hashString(value: string) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function createSeededRandom(seedText: string) {
  let state = hashString(seedText) || 1;
  return () => {
    state = Math.imul(state ^ (state >>> 15), 1 | state);
    state ^= state + Math.imul(state ^ (state >>> 7), 61 | state);
    return ((state ^ (state >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle<T>(items: readonly T[], seedText: string) {
  const random = createSeededRandom(seedText);
  const copied = [...items];
  for (let index = copied.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [copied[index], copied[swapIndex]] = [copied[swapIndex]!, copied[index]!];
  }
  return copied;
}

function badgeFor(page: SeoPage) {
  const { serviceGroup } = analyzeSubject(page.subject);
  if (serviceGroup.includes("Cost")) return "비용";
  if (serviceGroup.includes("Support") || serviceGroup === "closureSupport") return "지원";
  if (serviceGroup.includes("Restoration")) return "복구";
  if (serviceGroup === "hopePackage") return "패키지";
  if (serviceGroup === "closureCleanup") return "정리";
  return "철거";
}

function descriptionFor(page: SeoPage) {
  const { businessName, serviceName, restorationTerm } = analyzeSubject(page.subject);
  const target = businessName ? `${businessName} 매장` : "폐업 매장";
  if (serviceName.includes("지원") || serviceName.includes("폐업지원금") || serviceName.includes("희망리턴패키지")) {
    return `${target}의 철거비 지원 가능성과 준비해야 할 자료를 함께 확인합니다.`;
  }
  if (serviceName.includes("비용")) {
    return `${target}의 철거 범위, 폐기물, ${restorationTerm} 포함 여부를 기준으로 비용을 살펴봅니다.`;
  }
  if (serviceName.includes("원상")) {
    return `${target}의 임대차 기준과 현장 상태를 바탕으로 ${restorationTerm} 범위를 정리합니다.`;
  }
  if (serviceName.includes("폐업")) {
    return `${target}의 폐업 일정에 맞춰 철거 순서와 마무리 확인 항목을 안내합니다.`;
  }
  return `${target}의 철거 범위와 견적 전 확인할 내용을 차분히 정리합니다.`;
}

function toInternalLink(page: SeoPage): InternalLink {
  return {
    title: page.subject,
    badge: badgeFor(page),
    description: descriptionFor(page),
    href: `/${page.slug}/`,
  };
}

export function getInternalLinksForPage(page: SeoPage): InternalLink[] {
  const current = analyzeSubject(page.subject);
  const candidates = pages.filter((candidate) => candidate.slug !== page.slug);
  const related = candidates.filter((candidate) => {
    const analysis = analyzeSubject(candidate.subject);
    return (
      analysis.businessName === current.businessName ||
      analysis.serviceGroup === current.serviceGroup
    );
  });
  const unrelated = candidates.filter((candidate) => {
    const analysis = analyzeSubject(candidate.subject);
    return (
      analysis.businessName !== current.businessName &&
      analysis.serviceGroup !== current.serviceGroup
    );
  });

  const selectedRelated = shuffle(related, `${page.slug}:related`).slice(0, 2);
  const selectedUnrelated = shuffle(unrelated, `${page.slug}:unrelated`).slice(0, 4);
  const fallback = shuffle(candidates, `${page.slug}:fallback`).filter(
    (candidate) =>
      !selectedRelated.some((item) => item.slug === candidate.slug) &&
      !selectedUnrelated.some((item) => item.slug === candidate.slug),
  );

  return [...selectedRelated, ...selectedUnrelated, ...fallback]
    .slice(0, 6)
    .map(toInternalLink);
}

export function getHomeInternalLinks(): InternalLink[] {
  const preferredSlugs = [
    "dvd-room-demolition-cost",
    "pc-bang-restoration-company",
    "study-cafe-hope-return-package",
    "cafe-closure-demolition",
    "pilates-studio-demolition-cost-support",
    "convenience-store-full-demolition",
  ];
  const preferred = preferredSlugs
    .map((slug) => getPageBySlug(slug))
    .filter((page): page is SeoPage => Boolean(page));
  const fallback = pages.filter((page) => !preferred.some((item) => item.slug === page.slug));
  return [...preferred, ...fallback].slice(0, 6).map(toInternalLink);
}
