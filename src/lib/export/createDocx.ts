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
import type { ISectionOptions, ParagraphChild } from "docx";
import type { ResumeBullet, ResumeData, SectionKey } from "@/types/resume";
import { DEFAULT_RESUME_PAPER_SIZE_KEY, RESUME_PAGE_MARGIN_MM, getResumePaperSize, type ResumePaperSize, type ResumePaperSizeKey } from "@/constants/paper";
import { getPersonalContactItems, getResumeLinkDisplayItems } from "@/lib/resume/displayLinks";
import type { ResumeDisplayItem } from "@/lib/resume/displayLinks";
import { formatDateRange, getOrderedSections, hasText, joinNonEmpty } from "@/lib/resume/format";
import { normalizeResumeData } from "@/lib/resume/normalizers";

const TWIPS_PER_MM = 1440 / 25.4;
const LINE_SNUG_TWIPS = 275;

type DocxPaperLayout = {
  contentRightTab: number;
  height: number;
  marginHorizontal: number;
  marginVertical: number;
  width: number;
};

export async function createResumeDocxBlob(data: ResumeData, paperSizeKey: ResumePaperSizeKey = DEFAULT_RESUME_PAPER_SIZE_KEY): Promise<Blob> {
  const resume = normalizeResumeData(data);
  const layout = getDocxPaperLayout(getResumePaperSize(paperSizeKey));
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
              style: { paragraph: { indent: { left: 300, hanging: 180 }, spacing: { after: 0, before: 30, line: LINE_SNUG_TWIPS } } }
            }
          ]
        }
      ]
    },
    styles: {
      default: {
        document: {
          run: { font: "Arial", size: 20 },
          paragraph: { spacing: { after: 0, line: LINE_SNUG_TWIPS } }
        }
      }
    },
    sections: [createSection(resume, layout)]
  });

  return Packer.toBlob(doc);
}

function getDocxPaperLayout(paperSize: ResumePaperSize): DocxPaperLayout {
  const width = toTwips(paperSize.widthMm);
  const marginHorizontal = toTwips(RESUME_PAGE_MARGIN_MM.horizontal);

  return {
    contentRightTab: width - marginHorizontal * 2,
    height: toTwips(paperSize.heightMm),
    marginHorizontal,
    marginVertical: toTwips(RESUME_PAGE_MARGIN_MM.vertical),
    width
  };
}

function toTwips(mm: number): number {
  return Math.round(mm * TWIPS_PER_MM);
}

function createSection(data: ResumeData, layout: DocxPaperLayout): ISectionOptions {
  return {
    properties: {
      page: {
        size: { orientation: PageOrientation.PORTRAIT, width: layout.width, height: layout.height },
        margin: { top: layout.marginVertical, right: layout.marginHorizontal, bottom: layout.marginVertical, left: layout.marginHorizontal }
      }
    },
    children: [...headerParagraphs(data), ...sectionParagraphs(data, layout)]
  };
}

function headerParagraphs(data: ResumeData): Paragraph[] {
  const contacts = getPersonalContactItems(data.personal);

  return [
    ...(data.personal.fullName
      ? [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: data.personal.fullName.toUpperCase(), bold: true, size: 36 })], spacing: { after: 0, line: 450 } })]
      : []),
    ...(data.personal.headline
      ? [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: data.personal.headline, bold: true, size: 22 })], spacing: { after: 0, before: 30, line: LINE_SNUG_TWIPS } })]
      : []),
    ...(contacts.length > 0 ? [new Paragraph({ alignment: AlignmentType.CENTER, children: inlineLinkChildren(contacts, 19), spacing: { after: 0, before: 60, line: LINE_SNUG_TWIPS } })] : [])
  ];
}

function sectionParagraphs(data: ResumeData, layout: DocxPaperLayout): Paragraph[] {
  return getOrderedSections(data).flatMap((section) => {
    if (!section.visible || !sectionHasContent(data, section.key)) return [];
    return [sectionHeading(section.title), ...renderSection(data, section.key, layout)];
  });
}

function sectionHeading(title: string): Paragraph {
  return new Paragraph({
    spacing: { before: 180, after: 90, line: LINE_SNUG_TWIPS },
    border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: "111827" } },
    children: [new TextRun({ text: title.toUpperCase(), bold: true, size: 20 })]
  });
}

function entryHeader(left: string, date: string | undefined, layout: DocxPaperLayout, spacingAfter?: number): Paragraph {
  return new Paragraph({
    spacing: { after: spacingAfter ?? 0, line: LINE_SNUG_TWIPS },
    tabStops: [{ type: TabStopType.RIGHT, position: layout.contentRightTab }],
    children: [new TextRun({ text: left, bold: true, size: 21 }), ...(date ? [new TextRun({ text: `\t${date}`, size: 21 })] : [])]
  });
}

function twoLineEntryHeader(primary: string, subline: string, date: string | undefined, layout: DocxPaperLayout): Paragraph[] {
  const secondaryLine = joinNonEmpty([subline], ", ");

  return [
    entryHeader(primary, date, layout),
    ...(secondaryLine ? [new Paragraph({ children: [new TextRun({ text: secondaryLine, size: 20 })], spacing: { after: 0, line: LINE_SNUG_TWIPS } })] : [])
  ];
}

function bulletParagraphs(bullets: ResumeBullet[]): Paragraph[] {
  return bullets.map((bullet) =>
    new Paragraph({
      numbering: { reference: "resume-bullets", level: 0 },
      children: [new TextRun({ text: bullet.text, size: 20 })],
      spacing: { after: 0, before: 30, line: LINE_SNUG_TWIPS }
    })
  );
}

function inlineDisplayItemsParagraph(items: readonly ResumeDisplayItem[]): Paragraph[] {
  if (items.length === 0) return [];
  return [new Paragraph({ children: inlineLinkChildren(items, 19), spacing: { after: 0, before: 60, line: LINE_SNUG_TWIPS } })];
}

function inlineLinkChildren(items: readonly ResumeDisplayItem[], size?: number): ParagraphChild[] {
  return items.flatMap((item, index) => [
    ...(index > 0 ? [new TextRun({ text: " | ", size })] : []),
    inlineLinkChild(item, size)
  ]);
}

function inlineLinkChild(item: ResumeDisplayItem, size?: number): ParagraphChild {
  if (item.kind === "link") {
    return new ExternalHyperlink({
      children: [new TextRun({ text: item.label, style: "Hyperlink", size })],
      link: item.href
    });
  }

  return new TextRun({ text: item.label, size });
}

function renderSection(data: ResumeData, key: SectionKey, layout: DocxPaperLayout): Paragraph[] {
  if (key === "summary") return [new Paragraph({ children: [new TextRun({ text: data.summary, size: 20 })], spacing: { after: 0, line: LINE_SNUG_TWIPS } })];
  if (key === "education") {
    return data.education.filter((item) => !item.hidden).flatMap((item) => [
      ...twoLineEntryHeader(item.qualification, joinNonEmpty([item.institution, item.location], ", "), formatDateRange(item.startDate, item.endDate), layout),
      ...bulletParagraphs(item.details)
    ]);
  }
  if (key === "experience") {
    return data.experience.filter((item) => !item.hidden).flatMap((item) => [
      ...twoLineEntryHeader(item.position, joinNonEmpty([item.company, item.location], ", "), formatDateRange(item.startDate, item.endDate, item.isCurrent), layout),
      ...bulletParagraphs(item.bullets)
    ]);
  }
  if (key === "projects") {
    return data.projects.filter((item) => !item.hidden).flatMap((item) => [
      entryHeader(joinNonEmpty([item.name, item.role], ", "), formatDateRange(item.startDate, item.endDate), layout),
      ...(item.description ? [new Paragraph({ children: [new TextRun({ text: item.description, size: 20 })], spacing: { after: 0, before: 60, line: LINE_SNUG_TWIPS } })] : []),
      ...inlineDisplayItemsParagraph(getResumeLinkDisplayItems(item.links)),
      ...bulletParagraphs(item.bullets)
    ]);
  }
  if (key === "skills") {
    return data.skillGroups.filter((group) => !group.hidden).map((group) =>
      new Paragraph({
        spacing: { after: 60, line: LINE_SNUG_TWIPS },
        tabStops: [{ type: TabStopType.RIGHT, position: layout.contentRightTab }],
        children: [new TextRun({ text: `${group.label}:`, bold: true, size: 20 }), new TextRun({ text: `\t${joinNonEmpty(group.values, ", ")}`, size: 20 })]
      })
    );
  }
  if (key === "certifications") {
    return data.certifications.filter((item) => !item.hidden).flatMap((item) => [
      entryHeader(joinNonEmpty([item.name, item.issuer], ", "), item.year, layout),
      ...inlineDisplayItemsParagraph(getResumeLinkDisplayItems(item.links))
    ]);
  }
  return data.activities.filter((item) => !item.hidden).flatMap((item) => [
    entryHeader(joinNonEmpty([item.role, item.organization], ", "), item.year, layout),
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
