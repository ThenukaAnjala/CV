import { createCompleteResume } from "@/test/resumeFactory";
import { createBlankResumeData } from "@/lib/resume/defaults";
import { getResumeExportFilename } from "@/lib/resume/filename";
import { validateResumeForExport } from "@/lib/resume/validation";
import { createResumeDocxBlob } from "./createDocx";
import { createResumePdfBlob } from "./createPdf";

describe("resume export generation", () => {
  it("creates a searchable PDF blob", async () => {
    const blob = await createResumePdfBlob(createCompleteResume());
    expect(blob.type).toBe("application/pdf");
    expect(blob.size).toBeGreaterThan(1000);
  });

  it("creates an editable DOCX blob", async () => {
    const blob = await createResumeDocxBlob(createCompleteResume());
    expect(blob.size).toBeGreaterThan(1000);
  });

  it("creates exports for the selected preview paper size", async () => {
    const resume = createCompleteResume();

    await expect(createResumePdfBlob(resume, "letter")).resolves.toMatchObject({ type: "application/pdf" });
    await expect(createResumeDocxBlob(resume, "legal")).resolves.toBeInstanceOf(Blob);
  });

  it("allows downloads before a full name is entered", () => {
    const resume = createBlankResumeData();

    expect(validateResumeForExport(resume)).toBeNull();
    expect(getResumeExportFilename(resume, "pdf")).toBe("ATS_RESUME.pdf");
    expect(getResumeExportFilename(resume, "docx")).toBe("ATS_RESUME.docx");
  });

  it("creates export blobs for a partial resume", async () => {
    const resume = createBlankResumeData();
    resume.education = [
      {
        id: "education-partial",
        institution: "Institution Name",
        qualification: "",
        location: "",
        startDate: "",
        endDate: "",
        details: [],
        hidden: false
      }
    ];

    await expect(createResumePdfBlob(resume)).resolves.toMatchObject({ type: "application/pdf" });
    await expect(createResumeDocxBlob(resume)).resolves.toBeInstanceOf(Blob);
  });
});
