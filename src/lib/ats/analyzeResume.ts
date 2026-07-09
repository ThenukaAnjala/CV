import type { AtsAnalysis, AtsIssue, ResumeData } from "@/types/resume";
import { SECTION_LABELS } from "@/constants/resume";
import { extractKeywordStats } from "./keywordMatcher";
import { formatDateRange, getOrderedSections, hasText, isValidHttpUrl, wordCount } from "@/lib/resume/format";
import { getResumePlainText } from "@/lib/resume/text";
import { normalizeResumeData } from "@/lib/resume/normalizers";

export function analyzeResume(data: ResumeData): AtsAnalysis {
  const resume = normalizeResumeData(data);
  const issues: AtsIssue[] = [];
  emptyBulletIssues(data, issues);
  const score =
    identityScore(resume, issues) +
    summaryScore(resume, issues) +
    educationScore(resume, issues) +
    evidenceScore(resume, issues) +
    bulletScore(resume, issues) +
    skillsScore(resume, issues) +
    dateAndLinkScore(resume, issues) +
    structureScore(resume, issues);

  duplicateKeywordIssues(resume, issues);
  repetitionIssues(resume, issues);

  return { score: Math.max(0, Math.min(100, score)), issues };
}

function emptyBulletIssues(resume: ResumeData, issues: AtsIssue[]): void {
  const rawBullets = [
    ...resume.education.flatMap((entry) => entry.details),
    ...resume.experience.flatMap((entry) => entry.bullets),
    ...resume.projects.flatMap((entry) => entry.bullets),
    ...resume.activities.flatMap((entry) => entry.bullets)
  ];

  if (rawBullets.some((bullet) => !hasText(bullet.text))) {
    addIssue(issues, {
      severity: "warning",
      title: "Remove empty bullets",
      description: "Whitespace-only bullets should be deleted or replaced with truthful content.",
      section: "Bullets"
    });
  }
}

function addIssue(issues: AtsIssue[], issue: Omit<AtsIssue, "id">): void {
  issues.push({ id: `ats-${issues.length + 1}`, ...issue });
}

function identityScore(resume: ResumeData, issues: AtsIssue[]): number {
  let score = 0;
  if (hasText(resume.personal.fullName)) score += 5;
  else addIssue(issues, { severity: "error", title: "Add your full name", description: "A full name helps recruiters and parsers identify the resume owner.", section: "Personal Information" });

  if (hasText(resume.personal.email) || hasText(resume.personal.phone) || resume.personal.links.length > 0) score += 5;
  else addIssue(issues, { severity: "warning", title: "Add contact information", description: "Include at least one email, phone, or profile link.", section: "Personal Information" });

  return score;
}

function summaryScore(resume: ResumeData, issues: AtsIssue[]): number {
  let score = hasText(resume.personal.headline) ? 4 : 0;
  const count = wordCount(resume.summary);

  if (!hasText(resume.summary)) {
    addIssue(issues, { severity: "warning", title: "Add a professional summary", description: "A concise summary helps frame your resume for the target role.", section: "Summary" });
    return score;
  }

  if (count >= 40 && count <= 100) score += 6;
  else {
    score += 3;
    addIssue(issues, { severity: "info", title: "Review summary length", description: "Keep the professional summary between approximately 40 and 100 words.", section: "Summary" });
  }

  return score;
}

function educationScore(resume: ResumeData, issues: AtsIssue[]): number {
  const visible = resume.education.filter((entry) => !entry.hidden);
  if (visible.length === 0) {
    addIssue(issues, { severity: "info", title: "Education section is empty", description: "Add education if it is relevant to the role.", section: "Education" });
    return 0;
  }

  const complete = visible.filter((entry) => hasText(entry.institution) && hasText(entry.qualification));
  if (complete.length < visible.length) {
    addIssue(issues, { severity: "warning", title: "Complete education entries", description: "Education entries should include an institution and qualification.", section: "Education" });
  }

  return Math.round((complete.length / visible.length) * 15);
}

function evidenceScore(resume: ResumeData, issues: AtsIssue[]): number {
  const experience = resume.experience.filter((entry) => !entry.hidden);
  const projects = resume.projects.filter((entry) => !entry.hidden);
  const completeExperience = experience.filter((entry) => hasText(entry.position) && hasText(entry.company) && entry.bullets.length > 0);
  const completeProjects = projects.filter((entry) => hasText(entry.name) && (hasText(entry.description) || entry.bullets.length > 0));

  if (completeExperience.length === 0 && completeProjects.length === 0) {
    addIssue(issues, { severity: "error", title: "Add experience or project evidence", description: "Add at least one experience or project entry.", section: "Experience" });
    return 0;
  }

  return Math.min(20, completeExperience.length * 8 + completeProjects.length * 6);
}

function bulletScore(resume: ResumeData, issues: AtsIssue[]): number {
  const bullets = [
    ...resume.education.flatMap((entry) => entry.details),
    ...resume.experience.flatMap((entry) => entry.bullets),
    ...resume.projects.flatMap((entry) => entry.bullets),
    ...resume.activities.flatMap((entry) => entry.bullets)
  ];

  if (bullets.length === 0) {
    addIssue(issues, { severity: "warning", title: "Add achievement bullets", description: "Use concise bullets to describe evidence and outcomes.", section: "Experience" });
    return 4;
  }

  for (const bullet of bullets) {
    if (wordCount(bullet.text) > 45) {
      addIssue(issues, { severity: "info", title: "Shorten a long bullet", description: "This bullet may be difficult to scan because it contains more than 45 words.", section: "Bullets" });
    }
  }

  if (!bullets.some((bullet) => /\d|%|\$/.test(bullet.text))) {
    addIssue(issues, { severity: "info", title: "Add truthful measurable results when available", description: "Add measurable results only when they are truthful and available.", section: "Bullets" });
  }

  return Math.max(6, 15 - issues.filter((issue) => issue.section === "Bullets").length * 2);
}

function skillsScore(resume: ResumeData, issues: AtsIssue[]): number {
  const groups = resume.skillGroups.filter((group) => !group.hidden);
  if (groups.length === 0) {
    addIssue(issues, { severity: "warning", title: "Add skill groups", description: "Group relevant skills into simple text rows.", section: "Technical Skills" });
    return 0;
  }

  const complete = groups.filter((group) => hasText(group.label) && group.values.length > 0);
  if (complete.length < groups.length) {
    addIssue(issues, { severity: "warning", title: "Complete skill groups", description: "Remove empty skills from this group or add truthful skill values.", section: "Technical Skills" });
  }

  return Math.round((complete.length / groups.length) * 15);
}

function dateAndLinkScore(resume: ResumeData, issues: AtsIssue[]): number {
  let penalty = 0;
  for (const entry of [...resume.experience, ...resume.projects]) {
    if (!entry.hidden && !formatDateRange(entry.startDate, entry.endDate, "isCurrent" in entry ? entry.isCurrent : false)) {
      penalty += 2;
      addIssue(issues, { severity: "warning", title: "Add missing date", description: "A visible experience or project entry is missing a date.", section: "Dates" });
    }
  }

  const urls = [
    ...resume.personal.links.map((link) => link.url),
    ...resume.projects.flatMap((project) => project.links.map((link) => link.url)),
    ...resume.certifications.map((certification) => certification.credentialUrl)
  ];

  if (urls.some((url) => !isValidHttpUrl(url))) {
    penalty += 4;
    addIssue(issues, { severity: "error", title: "Fix invalid URLs", description: "Links must use valid http or https URLs.", section: "Links" });
  }

  return Math.max(0, 10 - penalty);
}

function structureScore(resume: ResumeData, issues: AtsIssue[]): number {
  const visibleEmpty = getOrderedSections(resume).filter((section) => section.visible && isEmptySection(resume, section.key));
  for (const section of visibleEmpty) {
    addIssue(issues, { severity: "info", title: `${section.title} is visible but empty`, description: "Hide empty optional sections or add truthful content.", section: section.title });
  }

  const words = wordCount(getResumePlainText(resume));
  if (words < 120) {
    addIssue(issues, { severity: "info", title: "Resume content is light", description: "Add relevant detail where truthful so the resume has enough parseable evidence." });
  }

  return Math.max(0, 5 - visibleEmpty.length);
}

function duplicateKeywordIssues(resume: ResumeData, issues: AtsIssue[]): void {
  const values = resume.skillGroups.flatMap((group) => group.values.map((value) => value.toLowerCase()));
  const duplicates = values.filter((value, index) => values.indexOf(value) !== index);
  if (duplicates.length > 0) {
    addIssue(issues, { severity: "info", title: "Review duplicate skills", description: "Duplicate skill keywords can make a resume look repetitive.", section: "Technical Skills" });
  }
}

function repetitionIssues(resume: ResumeData, issues: AtsIssue[]): void {
  const repeated = extractKeywordStats(getResumePlainText(resume)).filter((keyword) => keyword.count >= 12);
  if (repeated.length > 0) {
    addIssue(issues, { severity: "info", title: "Review repeated keywords", description: "Avoid excessive keyword repetition; keep wording natural and accurate." });
  }
}

function isEmptySection(resume: ResumeData, key: keyof typeof SECTION_LABELS): boolean {
  if (key === "summary") return !hasText(resume.summary);
  if (key === "education") return resume.education.filter((entry) => !entry.hidden).length === 0;
  if (key === "experience") return resume.experience.filter((entry) => !entry.hidden).length === 0;
  if (key === "projects") return resume.projects.filter((entry) => !entry.hidden).length === 0;
  if (key === "skills") return resume.skillGroups.filter((group) => !group.hidden).length === 0;
  if (key === "certifications") return resume.certifications.filter((entry) => !entry.hidden).length === 0;
  return resume.activities.filter((entry) => !entry.hidden).length === 0;
}
