import type { PersonalInfo, ResumeLink } from "@/types/resume";
import { isValidHttpUrl, trimText } from "./format";

export type ResumeDisplayItem =
  | {
      id: string;
      kind: "text";
      label: string;
    }
  | {
      id: string;
      kind: "link";
      label: string;
      href: string;
    };

export function getPersonalContactItems(personal: PersonalInfo): ResumeDisplayItem[] {
  return [
    textItem("email", personal.email),
    textItem("phone", personal.phone),
    textItem("location", personal.location),
    ...getResumeLinkDisplayItems(personal.links)
  ].filter(isDisplayItem);
}

export function getResumeLinkDisplayItems(links: readonly ResumeLink[]): ResumeDisplayItem[] {
  return links.map(getResumeLinkDisplayItem).filter(isDisplayItem);
}

export function getResumeLinkDisplayItem(link: ResumeLink): ResumeDisplayItem | null {
  const label = trimText(link.label);
  const href = trimText(link.url);

  if (!label) return null;
  if (href && isValidHttpUrl(href)) return { id: link.id, kind: "link", label, href };

  return { id: link.id, kind: "text", label };
}

function textItem(id: string, value: string): ResumeDisplayItem | null {
  const label = trimText(value);
  return label ? { id, kind: "text", label } : null;
}

function isDisplayItem(item: ResumeDisplayItem | null): item is ResumeDisplayItem {
  return item !== null;
}
