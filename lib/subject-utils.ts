export type ServiceGroup =
  | "demolitionCompany"
  | "demolitionCost"
  | "restorationCompany"
  | "restorationCost"
  | "closureSupport"
  | "demolitionSupport"
  | "hopePackage"
  | "closureDemolition"
  | "closureDemolitionSupport"
  | "fullDemolition"
  | "demolitionRestoration"
  | "closureCleanup"
  | "restorationWork"
  | "demolitionWork"
  | "general";

export type SubjectAnalysis = {
  businessName: string;
  serviceName: string;
  serviceGroup: ServiceGroup;
  restorationTerm: "원상복구" | "원상회복";
  displayName: string;
};

export const SERVICE_NAMES = [
  "폐업 철거비 지원",
  "철거 원상복구",
  "철거 원상회복",
  "원상복구 공사",
  "원상회복 공사",
  "원상복구 업체",
  "원상회복 업체",
  "원상복구 비용",
  "원상회복 비용",
  "희망리턴패키지",
  "철거비 지원",
  "철거지원금",
  "폐업지원금",
  "폐업 철거",
  "폐업 정리",
  "전체 철거",
  "철거 업체",
  "철거 비용",
  "철거 공사",
].sort((a, b) => b.length - a.length);

const fallbackSpaces = ["매장", "점포", "사업장", "현장", "임대 공간", "영업 공간"];

export function normalizeText(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

export function dedupeWords(value: string) {
  const words = normalizeText(value).split(" ");
  return words.filter((word, index) => index === 0 || word !== words[index - 1]).join(" ");
}

export function analyzeSubject(subject: string): SubjectAnalysis {
  const cleanSubject = dedupeWords(normalizeText(subject));
  const serviceName = SERVICE_NAMES.find((candidate) => cleanSubject.endsWith(candidate)) ?? "";
  const rawBusiness = serviceName
    ? cleanSubject.slice(0, -serviceName.length).trim()
    : cleanSubject;
  const businessName = normalizeText(rawBusiness || cleanSubject);
  const restorationTerm = cleanSubject.includes("원상회복") ? "원상회복" : "원상복구";

  return {
    businessName,
    serviceName,
    serviceGroup: classifyService(serviceName || cleanSubject),
    restorationTerm,
    displayName: businessName || fallbackSpaces[0],
  };
}

export function classifyService(serviceName: string): ServiceGroup {
  if (serviceName === "폐업 철거비 지원") return "closureDemolitionSupport";
  if (serviceName === "철거 원상복구" || serviceName === "철거 원상회복") {
    return "demolitionRestoration";
  }
  if (serviceName === "원상복구 공사" || serviceName === "원상회복 공사") {
    return "restorationWork";
  }
  if (serviceName === "원상복구 업체" || serviceName === "원상회복 업체") {
    return "restorationCompany";
  }
  if (serviceName === "원상복구 비용" || serviceName === "원상회복 비용") {
    return "restorationCost";
  }
  if (serviceName === "희망리턴패키지") return "hopePackage";
  if (serviceName === "철거비 지원" || serviceName === "철거지원금") {
    return "demolitionSupport";
  }
  if (serviceName === "폐업지원금") return "closureSupport";
  if (serviceName === "폐업 철거") return "closureDemolition";
  if (serviceName === "폐업 정리") return "closureCleanup";
  if (serviceName === "전체 철거") return "fullDemolition";
  if (serviceName === "철거 업체") return "demolitionCompany";
  if (serviceName === "철거 비용") return "demolitionCost";
  if (serviceName === "철거 공사") return "demolitionWork";
  return "general";
}

export function makeSpaceAliases(businessName: string) {
  const specific = businessName ? [`${businessName} 매장`] : [];
  return [...specific, ...fallbackSpaces];
}
