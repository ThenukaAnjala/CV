import { RESUME_SECTION_SETTINGS, SCHEMA_VERSION, SECTION_LABELS } from "@/constants/resume";
import type {
  ActivityEntry,
  CertificationEntry,
  EducationEntry,
  ExperienceEntry,
  ProjectEntry,
  ResumeBullet,
  ResumeData,
  ResumeLink,
  SectionKey,
  SkillGroup
} from "@/types/resume";
import type { ResumeImportInput } from "@/schemas/resumeSchema";
import { createId } from "./id";
import { trimMultiline, trimText } from "./format";

type CertificationImportLike = Partial<CertificationEntry> & { credentialUrl?: string };

function isPresent<T>(value: T | null): value is T {
  return value !== null;
}

function ensureId(value: string | undefined, prefix: string): string {
  return trimText(value) || createId(prefix);
}

function arrayOf<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

function normalizeLink(link: Partial<ResumeLink> | undefined): ResumeLink | null {
  const label = trimText(link?.label);
  const url = trimText(link?.url);
  if (!label && !url) return null;
  return { id: ensureId(link?.id, "link"), label, url };
}

function normalizeBullet(bullet: Partial<ResumeBullet> | undefined): ResumeBullet | null {
  const text = trimText(bullet?.text);
  if (!text) return null;
  return { id: ensureId(bullet?.id, "bullet"), text };
}

function normalizeEducation(entry: Partial<EducationEntry> | undefined): EducationEntry {
  return {
    id: ensureId(entry?.id, "education"),
    institution: trimText(entry?.institution),
    qualification: trimText(entry?.qualification),
    location: trimText(entry?.location),
    startDate: trimText(entry?.startDate),
    endDate: trimText(entry?.endDate),
    details: arrayOf<Partial<ResumeBullet>>(entry?.details).map(normalizeBullet).filter(isPresent),
    hidden: entry?.hidden ?? false
  };
}

function normalizeExperience(entry: Partial<ExperienceEntry> | undefined): ExperienceEntry {
  return {
    id: ensureId(entry?.id, "experience"),
    company: trimText(entry?.company),
    position: trimText(entry?.position),
    location: trimText(entry?.location),
    startDate: trimText(entry?.startDate),
    endDate: entry?.isCurrent ? "" : trimText(entry?.endDate),
    isCurrent: entry?.isCurrent ?? false,
    bullets: arrayOf<Partial<ResumeBullet>>(entry?.bullets).map(normalizeBullet).filter(isPresent),
    hidden: entry?.hidden ?? false
  };
}

function normalizeProject(entry: Partial<ProjectEntry> | undefined): ProjectEntry {
  return {
    id: ensureId(entry?.id, "project"),
    name: trimText(entry?.name),
    role: trimText(entry?.role),
    startDate: trimText(entry?.startDate),
    endDate: trimText(entry?.endDate),
    description: trimMultiline(entry?.description),
    links: arrayOf<Partial<ResumeLink>>(entry?.links).map(normalizeLink).filter(isPresent),
    bullets: arrayOf<Partial<ResumeBullet>>(entry?.bullets).map(normalizeBullet).filter(isPresent),
    hidden: entry?.hidden ?? false
  };
}

function normalizeSkillGroup(group: Partial<SkillGroup> | undefined): SkillGroup {
  return {
    id: ensureId(group?.id, "skill"),
    label: trimText(group?.label),
    values: Array.from(new Set(arrayOf<string>(group?.values).map(trimText).filter(Boolean))),
    hidden: group?.hidden ?? false
  };
}

function normalizeCertification(entry: CertificationImportLike | undefined): CertificationEntry {
  const links = arrayOf<Partial<ResumeLink>>(entry?.links).map(normalizeLink).filter(isPresent);
  const legacyCredentialLink = normalizeLegacyCredentialLink(entry);

  return {
    id: ensureId(entry?.id, "certification"),
    name: trimText(entry?.name),
    issuer: trimText(entry?.issuer),
    year: trimText(entry?.year),
    links: legacyCredentialLink && !links.some((link) => link.url === legacyCredentialLink.url) ? [...links, legacyCredentialLink] : links,
    hidden: entry?.hidden ?? false
  };
}

function normalizeLegacyCredentialLink(entry: CertificationImportLike | undefined): ResumeLink | null {
  const credentialUrl = trimText(entry?.credentialUrl);
  if (!credentialUrl) return null;

  return normalizeLink({ id: createId("link"), label: "Credential", url: credentialUrl });
}

function normalizeActivity(entry: Partial<ActivityEntry> | undefined): ActivityEntry {
  return {
    id: ensureId(entry?.id, "activity"),
    role: trimText(entry?.role),
    organization: trimText(entry?.organization),
    year: trimText(entry?.year),
    bullets: arrayOf<Partial<ResumeBullet>>(entry?.bullets).map(normalizeBullet).filter(isPresent),
    hidden: entry?.hidden ?? false
  };
}

export function normalizeResumeData(input: Partial<ResumeData> | ResumeImportInput): ResumeData {
  const sectionSettings = normalizeSectionSettings(input.sectionSettings ?? RESUME_SECTION_SETTINGS);

  return {
    schemaVersion: SCHEMA_VERSION,
    personal: {
      fullName: trimText(input.personal?.fullName),
      headline: trimText(input.personal?.headline),
      email: trimText(input.personal?.email),
      phone: trimText(input.personal?.phone),
      location: trimText(input.personal?.location),
      website: "",
      links: arrayOf<Partial<ResumeLink>>(input.personal?.links).map(normalizeLink).filter(isPresent)
    },
    summary: trimMultiline(input.summary),
    education: arrayOf<Partial<EducationEntry>>(input.education).map(normalizeEducation),
    experience: arrayOf<Partial<ExperienceEntry>>(input.experience).map(normalizeExperience),
    projects: arrayOf<Partial<ProjectEntry>>(input.projects).map(normalizeProject),
    skillGroups: arrayOf<Partial<SkillGroup>>(input.skillGroups).map(normalizeSkillGroup),
    certifications: arrayOf<CertificationImportLike>(input.certifications).map(normalizeCertification),
    activities: arrayOf<Partial<ActivityEntry>>(input.activities).map(normalizeActivity),
    sectionSettings,
    updatedAt: new Date().toISOString()
  };
}

function normalizeSectionSettings(settings: unknown): ResumeData["sectionSettings"] {
  const seen = new Set<SectionKey>();
  const normalized = arrayOf<ResumeData["sectionSettings"][number]>(settings).flatMap((section) => {
    if (!(section.key in SECTION_LABELS) || seen.has(section.key)) return [];
    seen.add(section.key);
    return [{ key: section.key, title: SECTION_LABELS[section.key], visible: section.visible }];
  });

  const missing = RESUME_SECTION_SETTINGS.filter((section) => !seen.has(section.key));
  return [...normalized, ...missing.map((section) => ({ ...section }))];
}
