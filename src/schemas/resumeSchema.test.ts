import { resumeDataSchema } from "./resumeSchema";
import { createBlankEducation, createBlankResumeData } from "@/lib/resume/defaults";
import { createCompleteResume } from "@/test/resumeFactory";

describe("resumeDataSchema", () => {
  it("accepts a blank in-memory resume", () => {
    expect(resumeDataSchema.safeParse(createBlankResumeData()).success).toBe(true);
  });

  it("accepts a complete resume", () => {
    expect(resumeDataSchema.safeParse(createCompleteResume()).success).toBe(true);
  });

  it("requires companion fields only after an entry has been started", () => {
    const resume = createBlankResumeData();
    resume.education = [{ ...createBlankEducation(), institution: "Institution Name" }];

    const result = resumeDataSchema.safeParse(resume);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            message: "Add a qualification for this education entry.",
            path: ["education", 0, "qualification"]
          })
        ])
      );
    }
  });

  it("rejects reversed month and year date ranges", () => {
    const resume = createCompleteResume();
    resume.projects[0].startDate = "Dec 2026";
    resume.projects[0].endDate = "Jan 2026";

    const result = resumeDataSchema.safeParse(resume);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            message: "End date must be the same as or after the start date.",
            path: ["projects", 0, "endDate"]
          })
        ])
      );
    }
  });
});
