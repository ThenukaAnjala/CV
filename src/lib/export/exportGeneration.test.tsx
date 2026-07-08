import { createCompleteResume } from "@/test/resumeFactory";
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
});
