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
    urlItem("website", personal.website),
    ...getResumeLinkDisplayItems(personal.links)
  ].filter(isDisplayItem);
}

export function getResumeLinkDisplayItems(links: readonly ResumeLink[]): ResumeDisplayItem[] {
  return links.map(getResumeLinkDisplayItem).filter(isDisplayItem);
}

export function getResumeLinkDisplayItem(link: ResumeLink): ResumeDisplayItem | null {
  const label = trimText(link.label);
  const href = trimText(link.url);
  const displayLabel = label || href;

  if (!displayLabel) return null;
  if (href && isValidHttpUrl(href)) return { id: link.id, kind: "link", label: displayLabel, href };

  return { id: link.id, kind: "text", label: displayLabel };
}

function textItem(id: string, value: string): ResumeDisplayItem | null {
  const label = trimText(value);
  return label ? { id, kind: "text", label } : null;
}

function urlItem(id: string, value: string): ResumeDisplayItem | null {
  const href = trimText(value);
  if (!href) return null;
  if (isValidHttpUrl(href)) return { id, kind: "link", label: href, href };
  return { id, kind: "text", label: href };
}

function isDisplayItem(item: ResumeDisplayItem | null): item is ResumeDisplayItem {
  return item !== null;
}
