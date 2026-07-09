import { SECTION_LABELS } from "@/constants/resume";
import type { ResumeData, SectionKey } from "@/types/resume";
import { formatDateRange, getOrderedSections, isSectionVisible, joinNonEmpty } from "./format";
import { normalizeResumeData } from "./normalizers";

export function getResumePlainText(data: ResumeData): string {
  const resume = normalizeResumeData(data);
  const parts: string[] = [
    resume.personal.fullName,
    resume.personal.headline,
    resume.personal.email,
    resume.personal.phone,
    resume.personal.location,
    ...resume.personal.links.flatMap((link) => [link.label, link.url])
  ];

  for (const section of getOrderedSections(resume)) {
    if (!section.visible) continue;
    parts.push(section.title);
    parts.push(...sectionText(resume, section.key));
  }

  return parts.filter(Boolean).join("\n");
}

function sectionText(data: ResumeData, key: string): string[] {
  if (key === "summary") return [data.summary];
  if (key === "education") {
    return data.education.flatMap((item) =>
      item.hidden
        ? []
        : [item.qualification, item.institution, item.location, formatDateRange(item.startDate, item.endDate), ...item.details.map((b) => b.text)]
    );
  }
  if (key === "experience") {
    return data.experience.flatMap((item) =>
      item.hidden
        ? []
        : [item.position, item.company, item.location, formatDateRange(item.startDate, item.endDate, item.isCurrent), ...item.bullets.map((b) => b.text)]
    );
  }
  if (key === "projects") {
    return data.projects.flatMap((item) =>
      item.hidden
        ? []
        : [
            item.name,
            item.role,
            item.description,
            formatDateRange(item.startDate, item.endDate),
            ...item.links.flatMap((link) => [link.label, link.url]),
            ...item.bullets.map((b) => b.text)
          ]
    );
  }
  if (key === "skills") {
    return data.skillGroups.flatMap((group) =>
      group.hidden ? [] : [group.label, joinNonEmpty(group.values, ", ")]
    );
  }
  if (key === "certifications") {
    return data.certifications.flatMap((item) =>
      item.hidden ? [] : [item.name, item.issuer, item.year, ...item.links.flatMap((link) => [link.label, link.url])]
    );
  }
  if (key === "activities") {
    return data.activities.flatMap((item) =>
      item.hidden ? [] : [item.role, item.organization, item.year, ...item.bullets.map((b) => b.text)]
    );
  }
  return [];
}

export function hasVisibleSectionContent(data: ResumeData, key: string): boolean {
  if (!isKnownSectionKey(key) || !isSectionVisible(data, key)) return false;
  return sectionText(normalizeResumeData(data), key).some(Boolean);
}

function isKnownSectionKey(key: string): key is SectionKey {
  return key in SECTION_LABELS;
}
