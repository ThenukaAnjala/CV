import { RESUME_SECTION_SETTINGS, SCHEMA_VERSION } from "@/constants/resume";
import type {
  ActivityEntry,
  CertificationEntry,
  EducationEntry,
  ExperienceEntry,
  ProjectEntry,
  ResumeBullet,
  ResumeData,
  ResumeLink,
  SkillGroup
} from "@/types/resume";
import { createId } from "./id";

export function createBlankLink(): ResumeLink {
  return { id: createId("link"), label: "", url: "" };
}

export function createBlankBullet(): ResumeBullet {
  return { id: createId("bullet"), text: "" };
}

export function createBlankEducation(): EducationEntry {
  return {
    id: createId("education"),
    institution: "",
    qualification: "",
    location: "",
    startDate: "",
    endDate: "",
    details: [],
    hidden: false
  };
}

export function createBlankExperience(): ExperienceEntry {
  return {
    id: createId("experience"),
    company: "",
    position: "",
    location: "",
    startDate: "",
    endDate: "",
    isCurrent: false,
    bullets: [],
    hidden: false
  };
}

export function createBlankProject(): ProjectEntry {
  return {
    id: createId("project"),
    name: "",
    role: "",
    startDate: "",
    endDate: "",
    description: "",
    links: [],
    bullets: [],
    hidden: false
  };
}

export function createBlankSkillGroup(): SkillGroup {
  return { id: createId("skill"), label: "", values: [""], hidden: false };
}

export function createBlankCertification(): CertificationEntry {
  return {
    id: createId("certification"),
    name: "",
    issuer: "",
    year: "",
    links: [],
    hidden: false
  };
}

export function createBlankActivity(): ActivityEntry {
  return {
    id: createId("activity"),
    role: "",
    organization: "",
    year: "",
    bullets: [],
    hidden: false
  };
}

export function createBlankResumeData(): ResumeData {
  return {
    schemaVersion: SCHEMA_VERSION,
    personal: {
      fullName: "",
      headline: "",
      email: "",
      phone: "",
      location: "",
      website: "",
      links: []
    },
    summary: "",
    education: [],
    experience: [],
    projects: [],
    skillGroups: [],
    certifications: [],
    activities: [],
    sectionSettings: RESUME_SECTION_SETTINGS.map((section) => ({ ...section })),
    updatedAt: new Date().toISOString()
  };
}
