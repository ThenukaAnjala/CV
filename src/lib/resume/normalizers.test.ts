import { normalizeResumeData } from "./normalizers";
import { createCompleteResume } from "@/test/resumeFactory";
import type { ResumeData } from "@/types/resume";

describe("normalizeResumeData", () => {
  it("repairs missing arrays and IDs", () => {
    const normalized = normalizeResumeData({
      schemaVersion: 1,
      personal: { fullName: " Example Candidate " },
      education: [{ institution: "Example University", qualification: "Course" }]
    } as Partial<ResumeData>);
    expect(normalized.personal.fullName).toBe("Example Candidate");
    expect(normalized.education[0].id).toMatch(/^education-/);
    expect(normalized.experience).toEqual([]);
  });

  it("trims empty strings and removes empty links", () => {
    const resume = createCompleteResume();
    resume.personal.links.push({ id: "empty-link", label: " ", url: " " });
    resume.summary = " line one \n\n line two ";
    const normalized = normalizeResumeData(resume);
    expect(normalized.personal.links.some((link) => link.id === "empty-link")).toBe(false);
    expect(normalized.summary).toBe("line one\nline two");
  });

  it("removes empty skill values", () => {
    const resume = createCompleteResume();
    resume.skillGroups[0].values.push(" ", "React");
    expect(normalizeResumeData(resume).skillGroups[0].values).toEqual(["TypeScript", "React", "Next.js"]);
  });

  it("preserves hidden records", () => {
    const resume = createCompleteResume();
    resume.projects[0].hidden = true;
    expect(normalizeResumeData(resume).projects[0].hidden).toBe(true);
  });

  it("repairs invalid section order", () => {
    const resume = createCompleteResume();
    resume.sectionSettings = [
      { key: "skills", title: "Wrong", visible: false },
      { key: "skills", title: "Duplicate", visible: true }
    ];
    const normalized = normalizeResumeData(resume);
    expect(normalized.sectionSettings[0]).toEqual({ key: "skills", title: "Technical Skills", visible: false });
    expect(new Set(normalized.sectionSettings.map((section) => section.key)).size).toBe(7);
  });
});
