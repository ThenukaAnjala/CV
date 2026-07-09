import { analyzeResume } from "./analyzeResume";
import { createBlankResumeData } from "@/lib/resume/defaults";
import { createCompleteResume } from "@/test/resumeFactory";

describe("analyzeResume", () => {
  it("reports major issues for an empty resume", () => {
    const result = analyzeResume(createBlankResumeData());
    expect(result.score).toBeLessThan(40);
    expect(result.issues.some((issue) => issue.title === "Add your full name")).toBe(true);
    expect(result.issues.some((issue) => issue.title === "Add experience or project evidence")).toBe(true);
  });

  it("scores a complete basic resume higher", () => {
    const result = analyzeResume(createCompleteResume());
    expect(result.score).toBeGreaterThan(75);
    expect(result.issues.some((issue) => issue.severity === "error")).toBe(false);
  });

  it("detects a missing summary", () => {
    const resume = createCompleteResume();
    resume.summary = "";
    expect(analyzeResume(resume).issues.some((issue) => issue.title === "Add a professional summary")).toBe(true);
  });

  it("detects missing dates", () => {
    const resume = createCompleteResume();
    resume.experience[0].startDate = "";
    resume.experience[0].isCurrent = false;
    expect(analyzeResume(resume).issues.some((issue) => issue.title === "Add missing date")).toBe(true);
  });

  it("detects empty and very long bullets", () => {
    const resume = createCompleteResume();
    resume.experience[0].bullets.push({ id: "empty", text: "   " });
    resume.projects[0].bullets.push({
      id: "long",
      text: Array.from({ length: 48 }, (_, index) => `word${index}`).join(" ")
    });
    const issues = analyzeResume(resume).issues.map((issue) => issue.title);
    expect(issues).toContain("Remove empty bullets");
    expect(issues).toContain("Shorten a long bullet");
  });

  it("detects invalid links", () => {
    const resume = createCompleteResume();
    resume.personal.links[0].url = "notaurl";
    expect(analyzeResume(resume).issues.some((issue) => issue.title === "Fix invalid URLs")).toBe(true);
  });

  it("detects duplicate keywords across skill groups", () => {
    const resume = createCompleteResume();
    resume.skillGroups.push({ id: "skill-3", label: "Frontend", values: ["React"], hidden: false });
    expect(analyzeResume(resume).issues.some((issue) => issue.title === "Review duplicate skills")).toBe(true);
  });

  it("detects missing skills", () => {
    const resume = createCompleteResume();
    resume.skillGroups = [];
    expect(analyzeResume(resume).issues.some((issue) => issue.title === "Add skill groups")).toBe(true);
  });
});
