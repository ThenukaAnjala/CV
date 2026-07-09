import { ResumeHeader } from "./ResumeHeader";
import { ResumeSection } from "./ResumeSection";
import { EntryHeader } from "./EntryHeader";
import { BulletList } from "./BulletList";
import { SkillsRows } from "./SkillsRows";
import type { ResumeData, SectionKey } from "@/types/resume";
import { getResumeLinkDisplayItems } from "@/lib/resume/displayLinks";
import { formatDateRange, getOrderedSections, hasText, joinNonEmpty } from "@/lib/resume/format";
import { normalizeResumeData } from "@/lib/resume/normalizers";
import { cn } from "@/lib/ui/cn";

export function ResumePage({
  data,
  displayMode = "document"
}: {
  data: ResumeData;
  displayMode?: "document" | "mobile";
}) {
  const resume = normalizeResumeData(data);
  const hasContent = hasText(resume.personal.fullName) || getOrderedSections(resume).some((section) => section.visible && sectionHasContent(resume, section.key));

  return (
    <article
      className={cn(
        "bg-white text-slate-950",
        displayMode === "mobile"
          ? "min-h-[calc(100svh-14rem)] w-full px-4 py-5"
          : "min-h-[297mm] w-[210mm] px-[17mm] py-[15mm]"
      )}
    >
      {!hasContent ? (
        <div
          className={cn(
            "flex items-center justify-center text-center text-sm text-slate-500",
            displayMode === "mobile" ? "min-h-[60svh]" : "min-h-[250mm]"
          )}
        >
          Start with personal information to build your resume preview.
        </div>
      ) : (
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
      )}
    </article>
  );
}

function renderSection(resume: ResumeData, key: SectionKey) {
  if (key === "summary") return <p className="break-words text-[10pt] leading-snug">{resume.summary}</p>;
  if (key === "education") {
    return resume.education.filter((item) => !item.hidden).map((item) => (
      <div key={item.id}>
        <EntryHeader date={formatDateRange(item.startDate, item.endDate)} meta={item.location} primary={item.qualification} secondary={item.institution} />
        <BulletList bullets={item.details} />
      </div>
    ));
  }
  if (key === "experience") {
    return resume.experience.filter((item) => !item.hidden).map((item) => (
      <div key={item.id}>
        <EntryHeader date={formatDateRange(item.startDate, item.endDate, item.isCurrent)} meta={item.location} primary={item.position} secondary={item.company} />
        <BulletList bullets={item.bullets} />
      </div>
    ));
  }
  if (key === "projects") {
    return resume.projects.filter((item) => !item.hidden).map((item) => {
      const links = getResumeLinkDisplayItems(item.links);

      return (
        <div key={item.id}>
          <EntryHeader date={formatDateRange(item.startDate, item.endDate)} primary={item.name} secondary={item.role} />
          {item.description ? <p className="mt-1 break-words text-[10pt] leading-snug">{item.description}</p> : null}
          {links.length > 0 ? (
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
          ) : null}
          <BulletList bullets={item.bullets} />
        </div>
      );
    });
  }
  if (key === "skills") return <SkillsRows groups={resume.skillGroups.filter((group) => !group.hidden)} />;
  if (key === "certifications") {
    return resume.certifications.filter((item) => !item.hidden).map((item) => (
      <EntryHeader date={item.year} key={item.id} primary={joinNonEmpty([item.name, item.issuer], ", ")} secondary={item.credentialUrl} />
    ));
  }
  return resume.activities.filter((item) => !item.hidden).map((item) => (
    <div key={item.id}>
      <EntryHeader date={item.year} primary={item.role} secondary={item.organization} />
      <BulletList bullets={item.bullets} />
    </div>
  ));
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
