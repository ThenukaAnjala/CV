import type { ReactNode } from "react";
import {
  AlignLeft,
  Award,
  BarChart3,
  BriefcaseBusiness,
  FileSearch,
  FolderKanban,
  GraduationCap,
  Handshake,
  Sparkles,
  UserRound
} from "lucide-react";
import type { SectionKey } from "@/types/resume";

export type ActivePanel = SectionKey | "personal" | "ats" | "match";

export type BuilderPanelItem = {
  key: ActivePanel;
  label: string;
  title: string;
  description: string;
  icon: ReactNode;
  group: "resume" | "tools";
};

export const BUILDER_PANEL_ITEMS: readonly BuilderPanelItem[] = [
  {
    key: "personal",
    label: "Personal Information",
    title: "Personal Information",
    description: "Name, headline, contact details, and profile links.",
    icon: <UserRound aria-hidden size={18} />,
    group: "resume"
  },
  {
    key: "summary",
    label: "Summary",
    title: "Professional Summary",
    description: "A concise overview for the target role.",
    icon: <AlignLeft aria-hidden size={18} />,
    group: "resume"
  },
  {
    key: "education",
    label: "Education",
    title: "Education",
    description: "Institutions, qualifications, dates, and details.",
    icon: <GraduationCap aria-hidden size={18} />,
    group: "resume"
  },
  {
    key: "experience",
    label: "Experience",
    title: "Experience",
    description: "Roles, companies, dates, and measurable impact.",
    icon: <BriefcaseBusiness aria-hidden size={18} />,
    group: "resume"
  },
  {
    key: "projects",
    label: "Projects",
    title: "Projects",
    description: "Relevant projects, roles, links, and outcomes.",
    icon: <FolderKanban aria-hidden size={18} />,
    group: "resume"
  },
  {
    key: "skills",
    label: "Skills",
    title: "Technical Skills",
    description: "Grouped skills that stay plain and ATS-friendly.",
    icon: <Sparkles aria-hidden size={18} />,
    group: "resume"
  },
  {
    key: "certifications",
    label: "Certifications",
    title: "Certifications",
    description: "Certifications, issuers, years, and credential links.",
    icon: <Award aria-hidden size={18} />,
    group: "resume"
  },
  {
    key: "activities",
    label: "Activities",
    title: "Leadership & Activities",
    description: "Leadership, volunteering, awards, and activities.",
    icon: <Handshake aria-hidden size={18} />,
    group: "resume"
  },
  {
    key: "ats",
    label: "ATS",
    title: "ATS Readiness",
    description: "Checks for common parsing, content, and formatting issues.",
    icon: <BarChart3 aria-hidden size={18} />,
    group: "tools"
  },
  {
    key: "match",
    label: "Match",
    title: "Job Description Match",
    description: "Compare resume language with a target job description.",
    icon: <FileSearch aria-hidden size={18} />,
    group: "tools"
  }
];

export function getPanelItem(panel: ActivePanel): BuilderPanelItem {
  return BUILDER_PANEL_ITEMS.find((item) => item.key === panel) ?? BUILDER_PANEL_ITEMS[0];
}
