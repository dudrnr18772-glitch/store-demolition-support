export type RandomSource = () => number;

export type ContentAngle =
  | "experience_based"
  | "expertise_based"
  | "trust_based"
  | "risk_based"
  | "comparison_based"
  | "practical_based";

export type Tone =
  | "professional"
  | "friendly"
  | "objective"
  | "persuasive"
  | "cautious"
  | "practical"
  | "beginner_friendly";

export type Manner =
  | "formal"
  | "conversational"
  | "step_by_step"
  | "checklist"
  | "field_advice"
  | "comparison_explainer"
  | "risk_notice"
  | "consultation_style";

export type EmphasisAxis =
  | "cost"
  | "schedule"
  | "lease_contract"
  | "restoration_scope"
  | "demolition_scope"
  | "subsidy_eligibility"
  | "documents"
  | "vendor_selection"
  | "waste_disposal"
  | "deposit_return"
  | "before_after_condition"
  | "site_check";

export type ReaderSituation =
  | "before_closure"
  | "closure_date_fixed"
  | "lease_end_near"
  | "landlord_requested_restoration"
  | "comparing_quotes"
  | "worried_about_cost"
  | "unsure_about_support"
  | "already_closed"
  | "urgent_schedule"
  | "first_time_preparing";

export type SectionFlow =
  | "problem_first"
  | "criteria_first"
  | "process_first"
  | "risk_first"
  | "cost_first"
  | "checklist_first"
  | "comparison_first"
  | "consultation_first";

export type SentenceStyle =
  | "short_clear"
  | "balanced_explanatory"
  | "detailed_practical"
  | "question_answer_flow"
  | "checklist_mixed"
  | "cautious_explanatory";

export type FaqAngle =
  | "eligibility"
  | "cost"
  | "process"
  | "documents"
  | "timing"
  | "restoration_scope"
  | "quote_comparison"
  | "landlord_request"
  | "support_before_demolition";

export type CtaAngle =
  | "check_eligibility"
  | "clarify_scope"
  | "compare_before_quote"
  | "prepare_before_closure"
  | "avoid_extra_cost"
  | "align_schedule"
  | "review_contract"
  | "consult_before_work";

export type MeaningUnit =
  | "problem_context"
  | "decision_criteria"
  | "required_documents"
  | "cost_factors"
  | "schedule_factors"
  | "lease_contract_terms"
  | "site_condition"
  | "subsidy_eligibility"
  | "quote_comparison"
  | "preparation_checklist"
  | "mistake_prevention"
  | "final_confirmation"
  | "landlord_request"
  | "deposit_return"
  | "demolition_scope"
  | "restoration_scope"
  | "waste_disposal"
  | "before_after_condition"
  | "consultation_preparation";

export type ContentStyleProfile = {
  contentAngle: ContentAngle;
  tone: Tone;
  manner: Manner;
  emphasisAxis: EmphasisAxis;
  readerSituation: ReaderSituation;
  sectionFlow: SectionFlow;
  sentenceStyle: SentenceStyle;
  faqAngle: FaqAngle;
  ctaAngle: CtaAngle;
  meaningUnits: MeaningUnit[];
};

const contentAngles: ContentAngle[] = [
  "experience_based",
  "expertise_based",
  "trust_based",
  "risk_based",
  "comparison_based",
  "practical_based",
];

const tones: Tone[] = [
  "professional",
  "friendly",
  "objective",
  "persuasive",
  "cautious",
  "practical",
  "beginner_friendly",
];

const manners: Manner[] = [
  "formal",
  "conversational",
  "step_by_step",
  "checklist",
  "field_advice",
  "comparison_explainer",
  "risk_notice",
  "consultation_style",
];

const emphasisAxes: EmphasisAxis[] = [
  "cost",
  "schedule",
  "lease_contract",
  "restoration_scope",
  "demolition_scope",
  "subsidy_eligibility",
  "documents",
  "vendor_selection",
  "waste_disposal",
  "deposit_return",
  "before_after_condition",
  "site_check",
];

const readerSituations: ReaderSituation[] = [
  "before_closure",
  "closure_date_fixed",
  "lease_end_near",
  "landlord_requested_restoration",
  "comparing_quotes",
  "worried_about_cost",
  "unsure_about_support",
  "already_closed",
  "urgent_schedule",
  "first_time_preparing",
];

const sectionFlows: SectionFlow[] = [
  "problem_first",
  "criteria_first",
  "process_first",
  "risk_first",
  "cost_first",
  "checklist_first",
  "comparison_first",
  "consultation_first",
];

const sentenceStyles: SentenceStyle[] = [
  "short_clear",
  "balanced_explanatory",
  "detailed_practical",
  "question_answer_flow",
  "checklist_mixed",
  "cautious_explanatory",
];

const faqAngles: FaqAngle[] = [
  "eligibility",
  "cost",
  "process",
  "documents",
  "timing",
  "restoration_scope",
  "quote_comparison",
  "landlord_request",
  "support_before_demolition",
];

const ctaAngles: CtaAngle[] = [
  "check_eligibility",
  "clarify_scope",
  "compare_before_quote",
  "prepare_before_closure",
  "avoid_extra_cost",
  "align_schedule",
  "review_contract",
  "consult_before_work",
];

const meaningUnits: MeaningUnit[] = [
  "problem_context",
  "decision_criteria",
  "required_documents",
  "cost_factors",
  "schedule_factors",
  "lease_contract_terms",
  "site_condition",
  "subsidy_eligibility",
  "quote_comparison",
  "preparation_checklist",
  "mistake_prevention",
  "final_confirmation",
  "landlord_request",
  "deposit_return",
  "demolition_scope",
  "restoration_scope",
  "waste_disposal",
  "before_after_condition",
  "consultation_preparation",
];

export function hashString(value: string) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export function createSeededRandom(seedText: string): RandomSource {
  let state = hashString(seedText) || 1;
  return () => {
    state = Math.imul(state ^ (state >>> 15), 1 | state);
    state ^= state + Math.imul(state ^ (state >>> 7), 61 | state);
    return ((state ^ (state >>> 14)) >>> 0) / 4294967296;
  };
}

export function pickBySeed<T>(items: readonly T[], random: RandomSource) {
  return items[Math.floor(random() * items.length)]!;
}

export function shuffleBySeed<T>(items: readonly T[], random: RandomSource) {
  const copied = [...items];
  for (let index = copied.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [copied[index], copied[swapIndex]] = [copied[swapIndex]!, copied[index]!];
  }
  return copied;
}

export function createContentStyle(slug: string, subject: string): ContentStyleProfile {
  const random = createSeededRandom(`style|${slug}|${subject}`);
  return {
    contentAngle: pickBySeed(contentAngles, random),
    tone: pickBySeed(tones, random),
    manner: pickBySeed(manners, random),
    emphasisAxis: pickBySeed(emphasisAxes, random),
    readerSituation: pickBySeed(readerSituations, random),
    sectionFlow: pickBySeed(sectionFlows, random),
    sentenceStyle: pickBySeed(sentenceStyles, random),
    faqAngle: pickBySeed(faqAngles, random),
    ctaAngle: pickBySeed(ctaAngles, random),
    meaningUnits: shuffleBySeed(meaningUnits, random).slice(0, 7),
  };
}

export const angleFocus: Record<ContentAngle, string> = {
  experience_based: "현장에서 자주 확인하는 조건을 중심으로",
  expertise_based: "계약 기준과 작업 범위를 차분히 나눠",
  trust_based: "가능한 부분과 확인이 필요한 부분을 구분해",
  risk_based: "추가 비용이나 일정 지연이 생기기 쉬운 지점을 먼저 살펴",
  comparison_based: "견적과 작업 범위를 비교하기 쉽게",
  practical_based: "상담 전에 준비할 자료와 진행 순서를 기준으로",
};

export const mannerFocus: Record<Manner, string> = {
  formal: "필요한 기준을 정리합니다.",
  conversational: "헷갈리는 부분을 상담하듯 풀어 봅니다.",
  step_by_step: "먼저 볼 항목과 다음에 확인할 항목을 순서대로 봅니다.",
  checklist: "확인할 항목을 빠뜨리지 않도록 나눠 봅니다.",
  field_advice: "현장에서 실제로 문제가 되는 부분을 함께 확인합니다.",
  comparison_explainer: "비슷해 보이는 항목의 차이를 구분해 봅니다.",
  risk_notice: "놓치기 쉬운 조건을 서두르지 않고 확인합니다.",
  consultation_style: "상황을 들은 뒤 필요한 절차와 범위를 정리합니다.",
};

export const emphasisCopy: Record<EmphasisAxis, string> = {
  cost: "비용 부담",
  schedule: "작업 일정",
  lease_contract: "임대차 계약 조건",
  restoration_scope: "원상복구 범위",
  demolition_scope: "철거 범위",
  subsidy_eligibility: "지원 대상 여부",
  documents: "준비 자료",
  vendor_selection: "업체 선택 기준",
  waste_disposal: "폐기물 처리",
  deposit_return: "보증금 반환 전 확인",
  before_after_condition: "입점 전후 상태",
  site_check: "현장 확인",
};

export const readerCopy: Record<ReaderSituation, string> = {
  before_closure: "폐업을 앞둔 시점이라면",
  closure_date_fixed: "폐업일이 정해졌다면",
  lease_end_near: "임대차 종료일이 가까워졌다면",
  landlord_requested_restoration: "임대인이 원상복구를 요구했다면",
  comparing_quotes: "여러 견적을 비교하고 있다면",
  worried_about_cost: "철거비 부담이 걱정된다면",
  unsure_about_support: "지원 대상인지 헷갈린다면",
  already_closed: "이미 영업을 마친 상태라면",
  urgent_schedule: "일정이 촉박하다면",
  first_time_preparing: "처음 폐업 철거를 준비한다면",
};

export const meaningUnitCopy: Record<MeaningUnit, string> = {
  problem_context: "폐업 후 공간을 어떤 상태로 돌려놓아야 하는지부터 정리해야 합니다.",
  decision_criteria: "판단 기준은 계약서, 현장 상태, 임대인의 요청을 함께 놓고 봅니다.",
  required_documents: "계약서와 현장 사진, 폐업 일정은 상담 전에 준비하면 좋습니다.",
  cost_factors: "비용은 면적, 설비, 폐기물 양, 반출 동선에 따라 달라집니다.",
  schedule_factors: "건물 운영 시간과 소음 제한은 작업 일정에 영향을 줍니다.",
  lease_contract_terms: "임대차 계약서의 원상복구 조항을 먼저 확인해야 합니다.",
  site_condition: "현장에 남은 시설과 철거할 시설을 나눠 보는 과정이 필요합니다.",
  subsidy_eligibility: "점포 철거비 지원은 대상 조건과 제출 자료 확인이 먼저입니다.",
  quote_comparison: "견적은 금액뿐 아니라 포함 공정과 제외 항목을 함께 비교해야 합니다.",
  preparation_checklist: "상담 전에는 사진, 계약 내용, 요청 사항을 정리해 두면 좋습니다.",
  mistake_prevention: "범위가 늦게 정해지면 추가 작업이나 일정 지연이 생길 수 있습니다.",
  final_confirmation: "마지막에는 철거 완료 상태와 마무리 확인 항목을 점검합니다.",
  landlord_request: "임대인의 요구가 있다면 실제 계약 기준과 맞는지 함께 확인해야 합니다.",
  deposit_return: "보증금 반환 전에는 복구 기준과 완료 상태를 분명히 남겨야 합니다.",
  demolition_scope: "철거 범위는 남길 시설과 제거할 시설을 구분하는 데서 시작합니다.",
  restoration_scope: "원상복구 범위는 기존 상태와 추가 인테리어를 나눠 정리합니다.",
  waste_disposal: "폐기물 처리와 반출 조건은 견적 차이를 만드는 주요 항목입니다.",
  before_after_condition: "입점 전후 상태를 비교하면 복구 기준을 정하기 수월합니다.",
  consultation_preparation: "현장 상황을 미리 알려주면 견적과 지원 확인을 더 정확히 볼 수 있습니다.",
};

export const ctaButtonByAngle: Record<CtaAngle, string[]> = {
  check_eligibility: ["점포 철거비 지원 가능 여부 상담", "지원 대상 여부 먼저 확인하기"],
  clarify_scope: ["철거와 원상복구 범위 상담", "임대차 마무리 기준 상담"],
  compare_before_quote: ["견적 비교 전 상담 요청", "철거 견적 범위 확인하기"],
  prepare_before_closure: ["폐업 전 철거 상담 신청", "폐업 일정 기준 상담 요청"],
  avoid_extra_cost: ["추가 비용 가능성 상담", "철거비 부담 줄이는 방법 상담"],
  align_schedule: ["철거 일정 상담 요청", "폐업 일정에 맞춰 상담하기"],
  review_contract: ["임대차 계약 기준 상담", "원상복구 요구사항 상담"],
  consult_before_work: ["철거 전 먼저 상담하기", "작업 시작 전 상담 요청"],
};
