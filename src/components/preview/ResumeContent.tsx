import { BulletList } from "./BulletList";
import { EntryHeader } from "./EntryHeader";
import { ResumeHeader } from "./ResumeHeader";
import { ResumeSection } from "./ResumeSection";
import { SkillsRows } from "./SkillsRows";
import type { ResumeData, SectionKey } from "@/types/resume";
import { getResumeLinkDisplayItems } from "@/lib/resume/displayLinks";
import { formatDateRange, getOrderedSections, hasText, joinNonEmpty } from "@/lib/resume/format";

export function ResumeContent({ resume }: { resume: ResumeData }) {
  return (
    <>
      <ResumeHeader personal={resume.personal} />
      {getOrderedSections(resume).map((section) =>
        section.visible && sectionHasContent(resume, section.key) ? (
          <ResumeSection key={section.key} title={section.title}>
            {renderSection(resume, section.key)}
          </ResumeSection>
        ) : null
      )}
    </>
  );
}

export function resumeHasContent(resume: ResumeData): boolean {
  return hasText(resume.personal.fullName) || getOrderedSections(resume).some((section) => section.visible && sectionHasContent(resume, section.key));
}

function renderSection(resume: ResumeData, key: SectionKey) {
  if (key === "summary") return <p className="break-words text-[10pt] leading-snug">{resume.summary}</p>;
  if (key === "education") return resume.education.filter((item) => !item.hidden).map((item) => (
    <div key={item.id}>
      <EntryHeader
        date={formatDateRange(item.startDate, item.endDate)}
        primary={item.qualification}
        subline={joinNonEmpty([item.institution, item.location], ", ")}
      />
      <BulletList bullets={item.details} />
    </div>
  ));
  if (key === "experience") return resume.experience.filter((item) => !item.hidden).map((item) => (
    <div key={item.id}>
      <EntryHeader
        date={formatDateRange(item.startDate, item.endDate, item.isCurrent)}
        primary={item.position}
        subline={joinNonEmpty([item.company, item.location], ", ")}
      />
      <BulletList bullets={item.bullets} />
    </div>
  ));
  if (key === "projects") return renderProjects(resume);
  if (key === "skills") return <SkillsRows groups={resume.skillGroups.filter((group) => !group.hidden)} />;
  if (key === "certifications") return renderCertifications(resume);
  return resume.activities.filter((item) => !item.hidden).map((item) => (
    <div key={item.id}>
      <EntryHeader date={item.year} primary={item.role} secondary={item.organization} />
      <BulletList bullets={item.bullets} />
    </div>
  ));
}

function renderProjects(resume: ResumeData) {
  return resume.projects.filter((item) => !item.hidden).map((item) => {
    const links = getResumeLinkDisplayItems(item.links);

    return (
      <div key={item.id}>
        <EntryHeader date={formatDateRange(item.startDate, item.endDate)} primary={item.name} secondary={item.role} />
        {item.description ? <p className="mt-1 break-words text-[10pt] leading-snug">{item.description}</p> : null}
        <DisplayLinks links={links} />
        <BulletList bullets={item.bullets} />
      </div>
    );
  });
}

function renderCertifications(resume: ResumeData) {
  return resume.certifications.filter((item) => !item.hidden).map((item) => (
    <div key={item.id}>
      <EntryHeader date={item.year} primary={item.name} secondary={item.issuer} />
      <DisplayLinks links={getResumeLinkDisplayItems(item.links)} />
    </div>
  ));
}

function DisplayLinks({ links }: { links: ReturnType<typeof getResumeLinkDisplayItems> }) {
  if (links.length === 0) return null;

  return (
    <p className="mt-1 break-words text-[9.5pt]">
      {links.map((link, index) => (
        <span key={link.id}>
          {index > 0 ? " | " : null}
          {link.kind === "link" ? (
            <a className="text-blue-700 underline" href={link.href} rel="noreferrer" target="_blank">
              {link.label}
            </a>
          ) : (
            link.label
          )}
        </span>
      ))}
    </p>
  );
}

function sectionHasContent(resume: ResumeData, key: SectionKey): boolean {
  if (key === "summary") return hasText(resume.summary);
  if (key === "education") return resume.education.some((item) => !item.hidden && (hasText(item.institution) || hasText(item.qualification) || item.details.length > 0));
  if (key === "experience") return resume.experience.some((item) => !item.hidden && (hasText(item.company) || hasText(item.position) || item.bullets.length > 0));
  if (key === "projects") return resume.projects.some((item) => !item.hidden && (hasText(item.name) || hasText(item.description) || item.bullets.length > 0));
  if (key === "skills") return resume.skillGroups.some((group) => !group.hidden && hasText(group.label) && group.values.length > 0);
  if (key === "certifications") return resume.certifications.some((item) => !item.hidden && hasText(item.name));
  return resume.activities.some((item) => !item.hidden && (hasText(item.role) || hasText(item.organization) || item.bullets.length > 0));
}
