import {
  angleFocus,
  createContentStyle,
  createSeededRandom,
  ctaButtonByAngle,
  emphasisCopy,
  mannerFocus,
  meaningUnitCopy,
  readerCopy,
  type ContentStyleProfile,
  type RandomSource,
} from "./content-style";
import {
  caseTitles,
  ctaOptions,
  groupIntentMap,
  processPool,
  semanticUnits,
} from "./content-variants";
import { analyzeSubject, makeSpaceAliases, type ServiceGroup } from "./subject-utils";

export type SeoPage = {
  slug: string;
  subject: string;
  title: string;
  description: string;
  H1: string;
};

export type DetailContent = {
  breadcrumb: string;
  summary: string;
  actions: string[];
  trustCards: Array<{ badge: string; title: string; description: string }>;
  why: { eyebrow: string; h2: string; paragraphs: string[] };
  support: {
    eyebrow: string;
    h2: string;
    paragraphs: string[];
    noticeTitle: string;
    noticeText: string;
  };
  cases: {
    eyebrow: string;
    h2: string;
    cards: Array<{ title: string; description: string }>;
  };
  process: { eyebrow: string; h2: string; steps: string[] };
  faqs: {
    eyebrow: string;
    h2: string;
    items: Array<{ question: string; answer: string }>;
  };
  cta: { eyebrow: string; h2: string; text: string; button: string };
};

function pick<T>(items: readonly T[], random: RandomSource) {
  return items[Math.floor(random() * items.length)]!;
}

function shuffle<T>(items: readonly T[], random: RandomSource) {
  const copied = [...items];
  for (let index = copied.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [copied[index], copied[swapIndex]] = [copied[swapIndex]!, copied[index]!];
  }
  return copied;
}

function takeUnique<T>(items: readonly T[], count: number, random: RandomSource) {
  return shuffle(items, random).slice(0, count);
}

function space(random: RandomSource, aliases: string[]) {
  return pick(aliases, random);
}

function primarySpace(aliases: string[]) {
  return aliases[0] ?? "매장";
}

function readableServiceName(serviceName: string) {
  if (serviceName === "폐업 정리") return "폐업 마무리";
  if (serviceName === "폐업 철거") return "영업 종료 후 철거";
  if (serviceName === "폐업지원금") return "폐업지원금 확인";
  if (serviceName === "철거지원금") return "철거지원금 확인";
  return serviceName;
}

function topicLabel(page: SeoPage, aliases: string[]) {
  const { serviceName } = analyzeSubject(page.subject);
  const display = primarySpace(aliases);
  return serviceName ? `${display} ${readableServiceName(serviceName)}` : display;
}

function serviceTopic(page: SeoPage) {
  const { serviceName } = analyzeSubject(page.subject);
  return readableServiceName(serviceName) || "폐업 철거 상담";
}

function serviceFocus(page: SeoPage) {
  const { serviceGroup, restorationTerm } = analyzeSubject(page.subject);
  if (serviceGroup.includes("Support") || serviceGroup === "closureSupport" || serviceGroup === "hopePackage") {
    return "지원 대상 여부와 철거 준비";
  }
  if (serviceGroup.includes("Cost")) return "견적 범위와 비용 부담";
  if (serviceGroup.includes("Restoration") || serviceGroup === "restorationWork") {
    return `${restorationTerm} 기준과 임대차 마무리`;
  }
  if (serviceGroup === "demolitionCompany") return "업체 선택과 현장 작업 범위";
  if (serviceGroup === "demolitionWork") return "실제 철거 공정과 마무리 상태";
  if (serviceGroup === "closureCleanup") return "정리 순서와 일정";
  return "철거 범위와 원상복구 기준";
}

function unit<K extends keyof typeof semanticUnits>(key: K, random: RandomSource) {
  return pick(semanticUnits[key], random);
}

function styleUnit(style: ContentStyleProfile, random: RandomSource, offset = 0) {
  const key = style.meaningUnits[offset % style.meaningUnits.length]!;
  return meaningUnitCopy[key];
}

function supportCheckPoint(style: ContentStyleProfile) {
  if (style.emphasisAxis === "documents") return "제출 자료";
  if (style.emphasisAxis === "schedule") return "폐업 일정";
  if (style.emphasisAxis === "lease_contract") return "임대차 계약 내용";
  if (style.emphasisAxis === "restoration_scope") return "원상복구 범위";
  if (style.emphasisAxis === "demolition_scope") return "철거 범위";
  if (style.emphasisAxis === "site_check") return "현장 상태";
  if (style.emphasisAxis === "deposit_return") return "보증금 반환 전 확인 사항";
  return "사업장 조건";
}

function sentenceCloser(style: ContentStyleProfile) {
  if (style.tone === "cautious" || style.manner === "risk_notice") {
    return "서둘러 확정하기보다 조건을 나눠 확인하는 것이 좋습니다.";
  }
  if (style.manner === "checklist") return "상담 전 체크할 항목을 나눠 정리합니다.";
  if (style.manner === "step_by_step") return "먼저 확인할 것과 현장에서 볼 것을 순서대로 정리합니다.";
  if (style.contentAngle === "comparison_based") return "견적을 비교할 때 같은 기준으로 볼 수 있게 정리합니다.";
  return "현장 상황에 맞는 진행 방향을 차분히 안내합니다.";
}

function amountSentence(style: ContentStyleProfile) {
  const conditionLead =
    style.tone === "objective"
      ? "대상 조건에 맞는 경우"
      : style.tone === "cautious"
        ? "요건을 확인해 대상에 해당한다면"
        : "지원 대상에 해당하는 경우";
  const amountPart =
    style.contentAngle === "practical_based"
      ? "현재 기준 최대 600만원 범위에서"
      : style.contentAngle === "comparison_based"
        ? "일반 견적과 별도로 현재 기준 최대 600만원까지"
        : "현재 기준 최대 600만원까지";
  const actionPart =
    style.manner === "checklist"
      ? "확인할 수 있는 항목을 정리합니다."
      : style.manner === "consultation_style"
        ? "가능성을 상담 과정에서 함께 살펴봅니다."
        : "점포 철거비 지원 가능성을 검토할 수 있습니다.";
  return `${conditionLead} ${amountPart} ${actionPart}`;
}

function supportOpening(
  topic: string,
  display: string,
  checkPoint: string,
  style: ContentStyleProfile,
) {
  if (style.contentAngle === "comparison_based") {
    return `${topic} 상담에서는 ${asObject(checkPoint)} 정리한 뒤 지원 가능성과 일반 견적 범위를 나란히 봅니다.`;
  }
  if (style.contentAngle === "risk_based") {
    return `${asObject(topic)} 서두르기 전에 ${asSubject(checkPoint)} 확인되어 있는지 먼저 살펴봅니다.`;
  }
  if (style.sectionFlow === "checklist_first") {
    return `${display} 사진, 계약 내용, ${checkPoint}을 차례로 맞춰 보며 지원 대상 여부를 검토합니다.`;
  }
  if (style.readerSituation === "first_time_preparing") {
    return `${topic}을 처음 준비한다면 ${withAnd(checkPoint)} 제출 자료를 함께 정리하는 것이 우선입니다.`;
  }
  return `${topic} 상담에서는 ${withAnd(checkPoint)} 지원 대상 여부를 같은 흐름에서 살펴봅니다.`;
}

function sectionEyebrow(section: "why" | "support" | "cases" | "process" | "faq", style: ContentStyleProfile) {
  const checkPoint = supportCheckPoint(style);
  if (section === "why") {
    if (style.contentAngle === "risk_based") return `${checkPoint} 사전 확인`;
    if (style.contentAngle === "comparison_based") return "철거 범위 비교";
    return "폐업 전 기준 정리";
  }
  if (section === "support") {
    if (style.faqAngle === "documents") return "지원 자료 확인";
    if (style.faqAngle === "timing") return "신청 전 시점 확인";
    return "점포 철거비 지원 검토";
  }
  if (section === "cases") {
    if (style.readerSituation === "landlord_requested_restoration") return "임대인 요청 대응";
    if (style.readerSituation === "comparing_quotes") return "견적 비교 상황";
    return `${checkPoint} 상담 상황`;
  }
  if (section === "process") {
    if (style.manner === "step_by_step") return "단계별 진행";
    if (style.manner === "checklist") return "확인 순서";
    return "상담부터 마무리까지";
  }
  if (style.faqAngle === "quote_comparison") return "견적 비교 질문";
  if (style.faqAngle === "restoration_scope") return "원상복구 질문";
  return "상담 전 확인 질문";
}

function buildCasesH2(display: string, topic: string, restorationTerm: string, style: ContentStyleProfile) {
  const checkPoint = supportCheckPoint(style);
  if (style.readerSituation === "worried_about_cost") {
    return `${display} 철거비 부담이 커 보일 때 확인할 상황`;
  }
  if (style.readerSituation === "landlord_requested_restoration") {
    return `임대인 요청과 ${restorationTerm} 기준이 다를 때 살펴볼 부분`;
  }
  if (style.contentAngle === "risk_based") {
    return `${topic} 진행 전 놓치기 쉬운 ${checkPoint} 상황`;
  }
  if (style.contentAngle === "comparison_based") {
    return `${topic} 견적을 비교하기 전에 나눠 볼 상황`;
  }
  if (style.manner === "checklist") {
    return `${display} 폐업 전에 체크할 상담 상황`;
  }
  return `${topic} 상담이 필요한 대표 상황`;
}

function buildProcessH2(display: string, topic: string, style: ContentStyleProfile) {
  const checkPoint = supportCheckPoint(style);
  const focus = serviceFocus({ subject: topic, slug: "", title: "", description: "", H1: "" });
  if (style.sectionFlow === "process_first" || style.manner === "step_by_step") {
    return `${asSubject(topic)} 상담 접수 후 ${asObject(checkPoint)} 기준으로 범위를 좁혀 갑니다`;
  }
  if (style.readerSituation === "urgent_schedule" || style.readerSituation === "lease_end_near") {
    return `${display} 일정에 맞춰 ${withAnd(checkPoint)} 현장 확인을 함께 진행합니다`;
  }
  if (style.emphasisAxis === "documents") {
    return `${topic} 자료 확인부터 철거 완료까지 필요한 순서를 정리합니다`;
  }
  if (style.contentAngle === "comparison_based") {
    return `${withAnd(checkPoint)} 견적 기준을 맞춘 뒤 작업 범위를 안내합니다`;
  }
  return `${display} 현장 확인 후 ${asObject(focus)} 중심으로 진행합니다`;
}

function buildFaqH2(display: string, topic: string, restorationTerm: string, style: ContentStyleProfile) {
  const checkPoint = supportCheckPoint(style);
  if (style.faqAngle === "eligibility" || style.emphasisAxis === "subsidy_eligibility") {
    return `${topic} 지원 대상 여부를 묻기 전에 확인할 질문`;
  }
  if (style.faqAngle === "restoration_scope") {
    return `${display} ${restorationTerm} 범위가 헷갈릴 때 보는 질문`;
  }
  if (style.faqAngle === "quote_comparison") {
    return `${topic} 견적 비교 전에 자주 묻는 질문`;
  }
  if (style.faqAngle === "documents") {
    return `${checkPoint} 준비 전에 확인하면 좋은 질문`;
  }
  return `${topic} 상담 전 ${checkPoint}까지 확인하세요`;
}

function hasFinalConsonant(value: string) {
  const last = value.trim().charCodeAt(value.trim().length - 1);
  return last >= 0xac00 && last <= 0xd7a3 ? (last - 0xac00) % 28 > 0 : false;
}

function asObject(value: string) {
  return `${value}${hasFinalConsonant(value) ? "을" : "를"}`;
}

function asSubject(value: string) {
  return `${value}${hasFinalConsonant(value) ? "은" : "는"}`;
}

function withAnd(value: string) {
  return `${value}${hasFinalConsonant(value) ? "과" : "와"}`;
}

function groupLabel(group: ServiceGroup) {
  if (group.includes("Support") || group === "closureSupport" || group === "hopePackage") {
    return "지원 확인";
  }
  if (group.includes("Cost")) return "비용 기준";
  if (group.includes("Restoration") || group === "restorationWork") return "복구 기준";
  if (group === "closureCleanup") return "폐업 정리";
  return "철거 범위";
}

function buildSummary(
  page: SeoPage,
  random: RandomSource,
  aliases: string[],
  style: ContentStyleProfile,
) {
  const display = primarySpace(aliases);
  const topic = topicLabel(page, aliases);
  const subjectIntro = pick(
    [
      `${readerCopy[style.readerSituation]} ${display} 철거와 원상복구는 ${angleFocus[style.contentAngle]} 살펴보는 것이 좋습니다.`,
      `${topic} 상담은 현재 상태와 ${asObject(emphasisCopy[style.emphasisAxis])} 함께 보는 것에서 시작합니다.`,
      `철거 비용만 보기보다 ${display}의 작업 범위와 마무리 확인까지 함께 살펴야 합니다.`,
    ],
    random,
  );
  const second = pick(
    [
      `${unit("criteria", random)} ${unit("support", random)}`,
      `${unit("cost", random)} ${unit("schedule", random)}`,
      `${unit("materials", random)} ${unit("finish", random)}`,
      `${styleUnit(style, random, 0)} ${mannerFocus[style.manner]}`,
    ],
    random,
  );
  return `${subjectIntro} ${second}`;
}

function buildTrustCards(
  page: SeoPage,
  random: RandomSource,
  aliases: string[],
  style: ContentStyleProfile,
) {
  const intents = takeUnique(groupIntentMap[analyzeSubject(page.subject).serviceGroup], 3, random);
  const emphasis = emphasisCopy[style.emphasisAxis];
  const display = primarySpace(aliases);
  return intents.map((intent, index) => {
    const descriptions = [
      `${display}의 실제 상태를 기준으로 필요한 작업과 제외할 작업을 나눠 확인합니다.`,
      `견적 전 ${intent}을 먼저 정리해 일정 지연과 추가 비용 가능성을 줄입니다.`,
      `임대차 마무리 과정에서 확인해야 할 ${intent}을 현장 기준으로 살펴봅니다.`,
      `폐업 일정에 맞춰 ${intent}과 마무리 확인 항목을 함께 안내합니다.`,
      `${withAnd(emphasis)} ${intent}을 함께 보면 상담 전에 필요한 범위를 더 분명히 정리할 수 있습니다.`,
    ];
    return {
      badge: ["범위", "계약", "일정", "견적", "지원"][index] ?? "확인",
      title: intent,
      description: pick(descriptions, random),
    };
  });
}

function buildWhy(
  page: SeoPage,
  random: RandomSource,
  aliases: string[],
  restorationTerm: string,
  style: ContentStyleProfile,
) {
  const display = primarySpace(aliases);
  const topic = topicLabel(page, aliases);
  const focus = serviceFocus(page);
  const checkPoint = supportCheckPoint(style);
  const subjectH2 =
    style.contentAngle === "risk_based"
      ? `${topic}에서 놓치기 쉬운 ${checkPoint}을 먼저 봅니다`
      : style.contentAngle === "comparison_based"
        ? `${topic}은 철거와 ${restorationTerm} 기준을 나눠 비교해야 합니다`
        : `${display} 폐업 마무리는 ${focus}에서 시작됩니다`;
  const firstUnits =
    style.sectionFlow === "criteria_first"
      ? `${styleUnit(style, random, 1)} ${unit("criteria", random)}`
      : style.sectionFlow === "risk_first"
        ? `${styleUnit(style, random, 2)} ${unit("problem", random)}`
        : `${unit("problem", random)} ${unit("criteria", random)}`;
  return {
    eyebrow: sectionEyebrow("why", style),
    h2: subjectH2,
    paragraphs: [
      `${asObject(display)} 비우는 일은 집기 정리로 끝나지 않고, 남길 시설과 철거할 시설을 구분하는 과정까지 이어집니다. ${firstUnits}`,
      `${styleUnit(style, random, 3)} ${topic} 상담에서는 ${withAnd(checkPoint)} ${restorationTerm} 기준을 함께 보며 필요한 작업 범위를 현실적으로 정리합니다.`,
    ],
  };
}

function buildSupport(
  page: SeoPage,
  random: RandomSource,
  aliases: string[],
  style: ContentStyleProfile,
) {
  const display = primarySpace(aliases);
  const topic = topicLabel(page, aliases);
  const focus = serviceFocus(page);
  const checkPoint = supportCheckPoint(style);
  const h2Lead =
    style.sectionFlow === "cost_first"
      ? `${display} 철거비 부담을 보기 전에`
      : style.sectionFlow === "process_first"
        ? `${topic} 진행 전에`
        : style.readerSituation === "lease_end_near"
          ? `임대차 종료가 가까운 ${display}이라면`
          : `${topic} 상담에서`;
  const h2Tail =
    style.contentAngle === "risk_based"
      ? `${checkPoint}부터 확인해야 합니다`
      : style.contentAngle === "comparison_based"
        ? `${asObject(focus)} 같은 기준으로 비교하세요`
        : `${asObject(focus)} 함께 정리하세요`;
  const firstSentence = supportOpening(topic, display, checkPoint, style);
  const secondSentence = amountSentence(style);
  const thirdSentence =
    style.sectionFlow === "checklist_first"
      ? `${display} 사진, 계약서, 임대인 요청 내용처럼 상담 전에 확인할 자료를 먼저 나누어 봅니다.`
      : style.sectionFlow === "risk_first"
        ? `${styleUnit(style, random, 4)} 자료가 부족하거나 철거가 먼저 진행되면 확인 범위가 줄어들 수 있습니다.`
        : `${styleUnit(style, random, 4)} ${asSubject(display)} ${checkPoint}에 따라 실제 가능 여부가 달라질 수 있습니다.`;
  const fourthSentence =
    style.readerSituation === "urgent_schedule" || style.readerSituation === "lease_end_near"
      ? `일정이 촉박할수록 견적, 자료 준비, 현장 확인을 동시에 맞춰야 하므로 작업 전 검토가 필요합니다.`
      : sentenceCloser(style);
  const noticeSubject =
    style.faqAngle === "documents"
      ? "제출 자료"
      : style.faqAngle === "timing"
        ? "확인 시점"
        : style.faqAngle === "restoration_scope"
          ? "복구 범위"
          : checkPoint;
  const noticeTitle = `${noticeSubject} 확인이 지원 가능성 판단의 기준이 됩니다`;
  const noticeText = `${asSubject(display)} 폐업 시점, 임대차 조건, 현장 상태에 따라 검토 결과가 달라질 수 있습니다. 상담에서는 확정 안내보다 조건과 준비 방향을 먼저 정리합니다.`;
  return {
    eyebrow: sectionEyebrow("support", style),
    h2: `${h2Lead} ${h2Tail}`,
    paragraphs: [`${firstSentence} ${secondSentence}`, `${thirdSentence} ${fourthSentence}`],
    noticeTitle,
    noticeText,
  };
}

function caseDescription(
  title: string,
  random: RandomSource,
  aliases: string[],
  restorationTerm: string,
  display: string,
  topic: string,
  style: ContentStyleProfile,
) {
  const service = topic.includes(display) ? topic.replace(`${display} `, "") : topic;
  const checkPoint = supportCheckPoint(style);
  const focus = serviceFocus({ subject: topic, slug: "", title: "", description: "", H1: "" });
  const situation = readerCopy[style.readerSituation];
  if (title.includes("임대인")) {
    return `${service} 상담에서는 요구 범위가 넓게 전달된 경우 ${withAnd(checkPoint)} 현장 상태를 함께 보며 ${restorationTerm} 기준을 나누는 과정이 필요합니다.`;
  }
  if (title.includes("폐업 일정")) {
    return `${situation} ${service} 견적, 폐기물 반출, 마무리 확인 일정을 동시에 조율해야 합니다.`;
  }
  if (title.includes("철거 범위")) {
    return `${service} 상담에서는 ${asSubject(checkPoint)} 남길 시설과 철거할 시설을 가르는 기준이 되므로 처음부터 범위를 나눠 봅니다.`;
  }
  if (title.includes("원상")) {
    return `${asObject(service)} 검토할 때는 ${checkPoint} 기준으로 기존 상태와 추가 인테리어를 나눠 확인해야 ${asObject(focus)} 판단하기 쉽습니다.`;
  }
  if (title.includes("부담")) {
    return `${service} 상담에서 ${withAnd(checkPoint)} 지원 가능성을 함께 확인하면 실제 부담해야 할 비용을 더 현실적으로 판단할 수 있습니다.`;
  }
  if (title.includes("지원")) {
    return `${service} 상담에서는 ${withAnd(checkPoint)} 제출 자료를 먼저 살펴야 철거 전 준비 방향을 놓치지 않을 수 있습니다.`;
  }
  if (title.includes("견적")) {
    return `${service} 견적은 금액만 비교하기보다 ${checkPoint}, 폐기물 처리, 추가 비용 가능성을 함께 확인해야 합니다.`;
  }
  return `${service} 상담은 건물 운영 시간과 이동 동선을 먼저 봅니다. ${styleUnit(style, random, 6)}`;
}

function buildCases(
  page: SeoPage,
  random: RandomSource,
  aliases: string[],
  restorationTerm: string,
  style: ContentStyleProfile,
) {
  const titles = takeUnique(caseTitles, 4, random);
  const selectedSpace = primarySpace(aliases);
  const topic = topicLabel(page, aliases);
  return {
    eyebrow: sectionEyebrow("cases", style),
    h2: buildCasesH2(selectedSpace, topic, restorationTerm, style),
    cards: titles.map((title) => ({
      title,
      description: caseDescription(title, random, aliases, restorationTerm, selectedSpace, topic, style),
    })),
  };
}

function buildProcess(
  page: SeoPage,
  random: RandomSource,
  aliases: string[],
  style: ContentStyleProfile,
) {
  const selectedSpace = primarySpace(aliases);
  const topic = topicLabel(page, aliases);
  const baseSupportStep =
    style.emphasisAxis === "documents" || style.faqAngle === "documents"
      ? "지원 서류와 증빙 자료 확인"
      : "지원 대상 여부 확인";
  const required = [`${topic} 상담 접수`, `${selectedSpace} 상황 확인`, "철거 범위 정리", "견적 안내", baseSupportStep, "철거 및 원상복구 진행", "마무리 상태 확인"];
  const additions = takeUnique(processPool, 2, random);
  const merged = [...required.slice(0, 2), ...additions, ...required.slice(2)];
  const steps = [...new Set(merged)].slice(0, 7);
  return {
    eyebrow: sectionEyebrow("process", style),
    h2: buildProcessH2(selectedSpace, topic, style),
    steps,
  };
}

function buildFaqs(
  page: SeoPage,
  random: RandomSource,
  aliases: string[],
  restorationTerm: string,
  style: ContentStyleProfile,
) {
  const display = primarySpace(aliases);
  const topic = topicLabel(page, aliases);
  const service = serviceTopic(page);
  const checkPoint = supportCheckPoint(style);
  const focus = serviceFocus(page);
  const situation = readerCopy[style.readerSituation];
  const faqPool = [
    {
      question: `${topic} 상담은 ${situation} 언제 시작하는 것이 좋나요?`,
      answer: `${readerCopy[style.readerSituation]} ${withAnd(focus)} ${asObject(checkPoint)} 먼저 맞춰 보는 것이 좋습니다. 일정이 정해진 뒤에는 견적과 현장 확인을 함께 조율해야 합니다.`,
    },
    {
      question: `${withAnd(checkPoint)} 지원 대상 여부는 어떻게 확인하나요?`,
      answer: `${display}의 폐업 상태, 사업장 조건, 제출 자료, 임대차 상황을 순서대로 확인합니다. 모든 사업장이 대상은 아니므로 상담에서는 가능성을 확정하지 않고 조건부터 검토합니다.`,
    },
    {
      question: `${asSubject(focus)} 어떻게 정하나요?`,
      answer: `${withAnd("임대차 계약서")} 임대인의 요청, 입점 전후 현장 상태를 함께 봅니다. ${service}에서는 철거만 필요한 부분과 복구가 필요한 부분을 나눠 확인하는 과정이 중요합니다.`,
    },
    {
      question: `견적에서 ${asObject(checkPoint)} 왜 먼저 보나요?`,
      answer: `${display} 견적에서는 ${withAnd(checkPoint)} 폐기물 처리, 반출 동선, 마무리 확인 항목이 포함되어 있는지 살펴봐야 합니다. 금액만 보면 포함 범위 차이를 놓치기 쉽습니다.`,
    },
    {
      question: `일부 정리한 뒤에는 ${checkPoint} 자료를 어떻게 보나요?`,
      answer: `이미 진행한 범위가 있으면 확인 가능한 자료가 줄어들 수 있습니다. ${display}의 사진, 계약 내용, 정리한 내역을 모아 남은 절차와 지원 가능성을 따로 살펴보는 것이 좋습니다.`,
    },
    {
      question: `폐기물 처리와 반출 동선은 어떻게 보나요?`,
      answer: `${display}에 남은 집기, 설비, 마감재의 양을 기준으로 반출 동선과 처리 범위를 확인합니다. 견적 방식에 따라 별도 비용이 생길 수 있어 상담 단계에서 구분해야 합니다.`,
    },
    {
      question: `상담 전에 ${asObject(checkPoint)} 어떻게 정리하면 좋나요?`,
      answer: `${display} 사진, 임대차 계약서, 임대인의 요청 내용, 폐업 예정일을 준비하면 좋습니다. ${sentenceCloser(style)}`,
    },
    {
      question: `견적을 비교할 때 ${withAnd(checkPoint)} ${restorationTerm} 포함 여부는 왜 중요한가요?`,
      answer: `금액보다 먼저 ${withAnd(emphasisCopy[style.emphasisAxis])} ${restorationTerm} 포함 여부를 같은 기준으로 놓고 봐야 합니다. 포함 공정이 다르면 같은 견적처럼 보여도 실제 부담이 달라질 수 있습니다.`,
    },
  ];
  return {
    eyebrow: sectionEyebrow("faq", style),
    h2: buildFaqH2(display, topic, restorationTerm, style),
    items: takeUnique(faqPool, 4, random),
  };
}

function buildCta(
  page: SeoPage,
  random: RandomSource,
  aliases: string[],
  style: ContentStyleProfile,
) {
  const display = primarySpace(aliases);
  const topic = topicLabel(page, aliases);
  const ctaButtons = ctaButtonByAngle[style.ctaAngle];
  const checkPoint = supportCheckPoint(style);
  const focus = serviceFocus(page);
  const ctaLead =
    style.ctaAngle === "avoid_extra_cost"
      ? `${display}의 추가 비용 가능성이 걱정된다면`
      : style.ctaAngle === "review_contract"
        ? `임대차 기준이 애매한 ${display}이라면`
        : style.ctaAngle === "align_schedule"
          ? `폐업 일정에 맞춰 ${topic} 상담이 필요하다면`
          : `${topic} 준비가 필요하다면`;
  const ctaBody =
    style.contentAngle === "comparison_based"
      ? `${withAnd(checkPoint)} 견적 범위를 같은 기준으로 비교할 수 있게 정리합니다.`
      : style.contentAngle === "risk_based"
        ? `${checkPoint}을 놓치면 일정이나 비용이 달라질 수 있어 작업 전 확인이 필요합니다.`
        : `${withAnd(focus)} 지원 가능성을 함께 살펴보고 진행 방향을 안내합니다.`;
  return {
    eyebrow: pick(ctaOptions.eyebrow, random),
    h2: `${ctaLead} 먼저 상담해 보세요`,
    text: `${ctaBody} ${styleUnit(style, random, 5)} ${mannerFocus[style.manner]}`,
    button: pick([`${topic} 상담 신청`, `${display} 철거 상담 요청`, `${display} 지원 가능 여부 상담`, ...ctaButtons], random),
  };
}

export function getDetailContent(page: SeoPage): DetailContent {
  const analysis = analyzeSubject(page.subject);
  const random = createSeededRandom(`${page.slug}|${page.subject}`);
  const style = createContentStyle(page.slug, page.subject);
  const aliases = makeSpaceAliases(analysis.businessName);
  const label = groupLabel(analysis.serviceGroup);
  const ctaButtons = ctaButtonByAngle[style.ctaAngle];

  return {
    breadcrumb: `${label} / 폐업 철거 / ${analysis.restorationTerm}`,
    summary: buildSummary(page, random, aliases, style),
    actions: [
      pick(["철거비 지원 가능 여부 상담", "지원 대상 여부 먼저 확인", "폐업 철거 상담 요청", ctaButtons[0]], random),
      pick(["원상복구 범위 상담", "철거 견적 상담", "임대차 마무리 상담", ctaButtons[1]], random),
    ],
    trustCards: buildTrustCards(page, random, aliases, style),
    why: buildWhy(page, random, aliases, analysis.restorationTerm, style),
    support: buildSupport(page, random, aliases, style),
    cases: buildCases(page, random, aliases, analysis.restorationTerm, style),
    process: buildProcess(page, random, aliases, style),
    faqs: buildFaqs(page, random, aliases, analysis.restorationTerm, style),
    cta: buildCta(page, random, aliases, style),
  };
}

export function getFaqJsonLd(faqs: DetailContent["faqs"]["items"]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}
