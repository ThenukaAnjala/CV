import { extractKeywordStats, matchJobDescription } from "./keywordMatcher";
import { createBlankResumeData } from "@/lib/resume/defaults";
import { createCompleteResume } from "@/test/resumeFactory";

describe("keywordMatcher", () => {
  it("matches keywords case-insensitively and removes punctuation", () => {
    const resume = createCompleteResume();
    const result = matchJobDescription(resume, "typescript, REACT! testing.");
    expect(result.matched.map((keyword) => keyword.term)).toEqual(expect.arrayContaining(["typescript", "react"]));
  });

  it("removes common stop words", () => {
    const stats = extractKeywordStats("the and of with React");
    expect(stats.map((keyword) => keyword.term)).toEqual(["react"]);
  });

  it("counts duplicate keywords", () => {
    const stats = extractKeywordStats("React react React");
    expect(stats.find((keyword) => keyword.term === "react")?.count).toBe(3);
  });

  it("handles empty job descriptions and resumes", () => {
    expect(matchJobDescription(createCompleteResume(), "").matchScore).toBe(0);
    expect(matchJobDescription(createBlankResumeData(), "React").matched).toHaveLength(0);
  });

  it("extracts technical terms", () => {
    const terms = extractKeywordStats("Next.js Node.js C# React Native").map((keyword) => keyword.term);
    expect(terms).toEqual(expect.arrayContaining(["next.js", "node.js", "c#", "react native"]));
  });

  it("keeps useful hyphenated terms", () => {
    const terms = extractKeywordStats("front-end back-end full-stack").map((keyword) => keyword.term);
    expect(terms).toEqual(expect.arrayContaining(["front-end", "back-end", "full-stack"]));
  });

  it("extracts multi-word phrases where practical", () => {
    const terms = extractKeywordStats("Project management and machine learning").map((keyword) => keyword.term);
    expect(terms).toEqual(expect.arrayContaining(["project management", "machine learning"]));
  });
});
