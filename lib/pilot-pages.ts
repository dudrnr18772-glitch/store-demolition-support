import pilotData from "../data/pilot-pages.json";

export type PilotSection = {
  heading: string;
  paragraphs: string[];
  checklist: string[];
};

export type PilotFaq = {
  question: string;
  answer: string;
};

export type PilotPage = {
  slug: string;
  title: string;
  description: string;
  h1: string;
  lead: string;
  sections: PilotSection[];
  faq: PilotFaq[];
  relatedSlugs: string[];
  updatedAt: string;
  notice?: string;
  sourceUrl?: string;
};

export const pilotPages: PilotPage[] = pilotData as PilotPage[];
const pilotPageMap = new Map(pilotPages.map((item) => [item.slug, item]));

export function getPilotPage(slug: string): PilotPage | undefined {
  return pilotPageMap.get(slug);
}
