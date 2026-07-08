import type { SectionKey, SectionSetting } from "@/types/resume";

export const SCHEMA_VERSION = 1 as const;

export const RESUME_SECTION_SETTINGS: SectionSetting[] = [
  { key: "summary", title: "Professional Summary", visible: true },
  { key: "education", title: "Education", visible: true },
  { key: "experience", title: "Experience", visible: true },
  { key: "projects", title: "Projects", visible: true },
  { key: "skills", title: "Technical Skills", visible: true },
  { key: "certifications", title: "Certifications", visible: true },
  { key: "activities", title: "Leadership & Activities", visible: true }
];

export const SECTION_LABELS: Record<SectionKey, string> = {
  summary: "Professional Summary",
  education: "Education",
  experience: "Experience",
  projects: "Projects",
  skills: "Technical Skills",
  certifications: "Certifications",
  activities: "Leadership & Activities"
};

export const SECTION_NAVIGATION: Array<{ key: SectionKey | "personal"; label: string }> = [
  { key: "personal", label: "Personal Information" },
  { key: "summary", label: "Summary" },
  { key: "education", label: "Education" },
  { key: "experience", label: "Experience" },
  { key: "projects", label: "Projects" },
  { key: "skills", label: "Skills" },
  { key: "certifications", label: "Certifications" },
  { key: "activities", label: "Activities" }
];
