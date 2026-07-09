import { parseResumeJson, serializeResumeJson } from "./json";
import { createCompleteResume } from "@/test/resumeFactory";

describe("resume JSON import", () => {
  it("accepts a valid current version", () => {
    const result = parseResumeJson(serializeResumeJson(createCompleteResume()));
    expect(result.ok).toBe(true);
  });

  it("rejects invalid JSON", () => {
    expect(parseResumeJson("{").ok).toBe(false);
  });

  it("rejects unsupported versions", () => {
    expect(parseResumeJson(JSON.stringify({ schemaVersion: 999 })).ok).toBe(false);
  });

  it("rejects missing required structure", () => {
    expect(parseResumeJson(JSON.stringify({})).ok).toBe(false);
  });

  it("rejects unexpected properties", () => {
    expect(parseResumeJson(JSON.stringify({ schemaVersion: 1, unexpected: true })).ok).toBe(false);
  });

  it("treats malicious-looking strings as text", () => {
    const result = parseResumeJson(JSON.stringify({ schemaVersion: 1, summary: "<script>alert('x')</script>" }));
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.data.summary).toBe("<script>alert('x')</script>");
  });

  it("migrates legacy certification credential URLs into labeled links", () => {
    const result = parseResumeJson(
      JSON.stringify({
        schemaVersion: 1,
        certifications: [
          {
            name: "Example Certificate",
            issuer: "Example Issuer",
            year: "Jul 2026",
            credentialUrl: "https://certificate.example.com",
            hidden: false
          }
        ]
      })
    );

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.certifications[0].links).toEqual([
        expect.objectContaining({ label: "Credential", url: "https://certificate.example.com" })
      ]);
    }
  });

  it("rejects empty files", () => {
    expect(parseResumeJson(" ").ok).toBe(false);
  });
});
