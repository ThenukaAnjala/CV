export type SectionKey =
  | "summary"
  | "education"
  | "experience"
  | "projects"
  | "skills"
  | "certifications"
  | "activities";

export type ResumeLink = {
  id: string;
  label: string;
  url: string;
};

export type ResumeBullet = {
  id: string;
  text: string;
};

export type PersonalInfo = {
  fullName: string;
  headline: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  links: ResumeLink[];
};

export type EducationEntry = {
  id: string;
  institution: string;
  qualification: string;
  location: string;
  startDate: string;
  endDate: string;
  details: ResumeBullet[];
  hidden: boolean;
};

export type ExperienceEntry = {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  bullets: ResumeBullet[];
  hidden: boolean;
};

export type ProjectEntry = {
  id: string;
  name: string;
  role: string;
  startDate: string;
  endDate: string;
  description: string;
  links: ResumeLink[];
  bullets: ResumeBullet[];
  hidden: boolean;
};

export type SkillGroup = {
  id: string;
  label: string;
  values: string[];
  hidden: boolean;
};

export type CertificationEntry = {
  id: string;
  name: string;
  issuer: string;
  year: string;
  links: ResumeLink[];
  hidden: boolean;
};

export type ActivityEntry = {
  id: string;
  role: string;
  organization: string;
  year: string;
  bullets: ResumeBullet[];
  hidden: boolean;
};

export type SectionSetting = {
  key: SectionKey;
  title: string;
  visible: boolean;
};

export type ResumeData = {
  schemaVersion: 1;
  personal: PersonalInfo;
  summary: string;
  education: EducationEntry[];
  experience: ExperienceEntry[];
  projects: ProjectEntry[];
  skillGroups: SkillGroup[];
  certifications: CertificationEntry[];
  activities: ActivityEntry[];
  sectionSettings: SectionSetting[];
  updatedAt: string;
};

export type AtsIssue = {
  id: string;
  severity: "info" | "warning" | "error";
  title: string;
  description: string;
  section?: string;
};

export type AtsAnalysis = {
  score: number;
  issues: AtsIssue[];
};

export type KeywordStat = {
  term: string;
  count: number;
};

export type KeywordMatchResult = {
  matchScore: number;
  matched: KeywordStat[];
  missing: KeywordStat[];
  resumeKeywords: KeywordStat[];
  jobKeywords: KeywordStat[];
};
