import {
  AlignmentType,
  BorderStyle,
  Document,
  ExternalHyperlink,
  LevelFormat,
  Packer,
  PageOrientation,
  Paragraph,
  TabStopType,
  TextRun
} from "docx";
import type { ISectionOptions } from "docx";
import type { ResumeBullet, ResumeData, SectionKey } from "@/types/resume";
import { formatDateRange, getOrderedSections, hasText, joinNonEmpty } from "@/lib/resume/format";
import { normalizeResumeData } from "@/lib/resume/normalizers";

const PAGE_WIDTH_TWIPS = 11906;
const CONTENT_RIGHT_TAB = 9360;

export async function createResumeDocxBlob(data: ResumeData): Promise<Blob> {
  const resume = normalizeResumeData(data);
  const doc = new Document({
    numbering: {
      config: [
        {
          reference: "resume-bullets",
          levels: [
            {
              level: 0,
              format: LevelFormat.BULLET,
              text: "\u2022",
              alignment: AlignmentType.LEFT,
              style: { paragraph: { indent: { left: 360, hanging: 180 } } }
            }
          ]
        }
      ]
    },
    styles: {
      default: {
        document: {
          run: { font: "Arial", size: 20 },
          paragraph: { spacing: { after: 80 } }
        }
      }
    },
    sections: [createSection(resume)]
  });

  return Packer.toBlob(doc);
}

function createSection(data: ResumeData): ISectionOptions {
  return {
    properties: {
      page: {
        size: { orientation: PageOrientation.PORTRAIT, width: PAGE_WIDTH_TWIPS, height: 16838 },
        margin: { top: 720, right: 720, bottom: 720, left: 720 }
      }
    },
    children: [...headerParagraphs(data), ...sectionParagraphs(data)]
  };
}

function headerParagraphs(data: ResumeData): Paragraph[] {
  const contacts = [
    data.personal.email,
    data.personal.phone,
    data.personal.location,
    data.personal.website,
    ...data.personal.links.map((link) => `${link.label}: ${link.url}`)
  ].filter(Boolean);

  return [
    data.personal.fullName
      ? new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: data.personal.fullName.toUpperCase(), bold: true, size: 32 })] })
      : new Paragraph({}),
    data.personal.headline
      ? new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: data.personal.headline, bold: true, size: 22 })] })
      : new Paragraph({}),
    contacts.length > 0 ? new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: contacts.join(" | "), size: 19 })] }) : new Paragraph({})
  ];
}

function sectionParagraphs(data: ResumeData): Paragraph[] {
  return getOrderedSections(data).flatMap((section) => {
    if (!section.visible || !sectionHasContent(data, section.key)) return [];
    return [sectionHeading(section.title), ...renderSection(data, section.key)];
  });
}

function sectionHeading(title: string): Paragraph {
  return new Paragraph({
    spacing: { before: 160, after: 80 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: "111827" } },
    children: [new TextRun({ text: title.toUpperCase(), bold: true, size: 20 })]
  });
}

function entryHeader(left: string, date?: string): Paragraph {
  return new Paragraph({
    tabStops: [{ type: TabStopType.RIGHT, position: CONTENT_RIGHT_TAB }],
    children: [new TextRun({ text: left, bold: true }), ...(date ? [new TextRun({ text: `\t${date}` })] : [])]
  });
}

function bulletParagraphs(bullets: ResumeBullet[]): Paragraph[] {
  return bullets.map((bullet) =>
    new Paragraph({
      numbering: { reference: "resume-bullets", level: 0 },
      children: [new TextRun({ text: bullet.text })]
    })
  );
}

function linkParagraph(label: string, url: string): Paragraph {
  return new Paragraph({
    children: [
      new ExternalHyperlink({
        children: [new TextRun({ text: label ? `${label}: ${url}` : url, style: "Hyperlink" })],
        link: url
      })
    ]
  });
}

function renderSection(data: ResumeData, key: SectionKey): Paragraph[] {
  if (key === "summary") return [new Paragraph({ children: [new TextRun(data.summary)] })];
  if (key === "education") {
    return data.education.filter((item) => !item.hidden).flatMap((item) => [
      entryHeader(joinNonEmpty([item.qualification, item.institution, item.location], ", "), formatDateRange(item.startDate, item.endDate)),
      ...bulletParagraphs(item.details)
    ]);
  }
  if (key === "experience") {
    return data.experience.filter((item) => !item.hidden).flatMap((item) => [
      entryHeader(joinNonEmpty([item.position, item.company, item.location], ", "), formatDateRange(item.startDate, item.endDate, item.isCurrent)),
      ...bulletParagraphs(item.bullets)
    ]);
  }
  if (key === "projects") {
    return data.projects.filter((item) => !item.hidden).flatMap((item) => [
      entryHeader(joinNonEmpty([item.name, item.role], ", "), formatDateRange(item.startDate, item.endDate)),
      ...(item.description ? [new Paragraph({ children: [new TextRun(item.description)] })] : []),
      ...item.links.map((link) => linkParagraph(link.label, link.url)),
      ...bulletParagraphs(item.bullets)
    ]);
  }
  if (key === "skills") {
    return data.skillGroups.filter((group) => !group.hidden).map((group) =>
      new Paragraph({ children: [new TextRun({ text: `${group.label}: `, bold: true }), new TextRun(joinNonEmpty(group.values, ", "))] })
    );
  }
  if (key === "certifications") {
    return data.certifications.filter((item) => !item.hidden).flatMap((item) => [
      entryHeader(joinNonEmpty([item.name, item.issuer], ", "), item.year),
      ...(item.credentialUrl ? [linkParagraph("", item.credentialUrl)] : [])
    ]);
  }
  return data.activities.filter((item) => !item.hidden).flatMap((item) => [
    entryHeader(joinNonEmpty([item.role, item.organization], ", "), item.year),
    ...bulletParagraphs(item.bullets)
  ]);
}

function sectionHasContent(data: ResumeData, key: SectionKey): boolean {
  if (key === "summary") return hasText(data.summary);
  if (key === "education") return data.education.some((item) => !item.hidden && (hasText(item.institution) || hasText(item.qualification) || item.details.length > 0));
  if (key === "experience") return data.experience.some((item) => !item.hidden && (hasText(item.company) || hasText(item.position) || item.bullets.length > 0));
  if (key === "projects") return data.projects.some((item) => !item.hidden && (hasText(item.name) || hasText(item.description) || item.bullets.length > 0));
  if (key === "skills") return data.skillGroups.some((group) => !group.hidden && hasText(group.label) && group.values.length > 0);
  if (key === "certifications") return data.certifications.some((item) => !item.hidden && hasText(item.name));
  return data.activities.some((item) => !item.hidden && (hasText(item.role) || hasText(item.organization) || item.bullets.length > 0));
}
