import { getJsonExportFilename, getResumeExportFilename, sanitizeFileBaseName } from "./filename";
import { createBlankResumeData } from "./defaults";

describe("filename helpers", () => {
  it("uses fallback for empty names", () => {
    expect(sanitizeFileBaseName("", "RESUME")).toBe("RESUME");
  });

  it("normalizes spaces", () => {
    expect(sanitizeFileBaseName(" Example   Candidate ", "RESUME")).toBe("EXAMPLE_CANDIDATE");
  });

  it("removes unsupported filename characters", () => {
    expect(sanitizeFileBaseName("Example/Name:Test*?", "RESUME")).toBe("EXAMPLE_NAME_TEST");
  });

  it("keeps unicode names", () => {
    expect(sanitizeFileBaseName("Zoë Candidate", "RESUME")).toBe("ZOË_CANDIDATE");
  });

  it("limits very long names", () => {
    expect(sanitizeFileBaseName("a".repeat(120), "RESUME")).toHaveLength(80);
  });

  it("creates resume and JSON filenames", () => {
    const resume = createBlankResumeData();
    expect(getResumeExportFilename(resume, "pdf")).toBe("ATS_RESUME.pdf");
    resume.personal.fullName = "Example Candidate";
    expect(getResumeExportFilename(resume, "docx")).toBe("EXAMPLE_CANDIDATE_ATS_RESUME.docx");
    expect(getJsonExportFilename(resume)).toBe("EXAMPLE_CANDIDATE_RESUME_DATA.json");
  });
});
