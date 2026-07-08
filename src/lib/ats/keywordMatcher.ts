import type { KeywordMatchResult, KeywordStat, ResumeData } from "@/types/resume";
import { getResumePlainText } from "@/lib/resume/text";
import { trimText } from "@/lib/resume/format";

const STOP_WORDS = new Set([
  "about",
  "after",
  "also",
  "and",
  "are",
  "as",
  "at",
  "be",
  "by",
  "for",
  "from",
  "has",
  "have",
  "in",
  "into",
  "is",
  "it",
  "of",
  "on",
  "or",
  "our",
  "that",
  "the",
  "their",
  "this",
  "to",
  "with",
  "you",
  "your"
]);

const TECH_PHRASES = [
  "react native",
  "next.js",
  "node.js",
  "c#",
  "c++",
  "full stack",
  "front end",
  "back end",
  "machine learning",
  "project management"
];

export function extractKeywordStats(text: string): KeywordStat[] {
  const counts = new Map<string, number>();
  const normalized = normalizeForKeywords(text);

  for (const phrase of TECH_PHRASES) {
    const count = countPhrase(normalized, normalizeForKeywords(phrase));
    if (count > 0) counts.set(phrase, count);
  }

  for (const token of tokenize(normalized)) {
    if (isUsefulToken(token)) {
      counts.set(token, (counts.get(token) ?? 0) + 1);
    }
  }

  return Array.from(counts.entries())
    .map(([term, count]) => ({ term, count }))
    .sort((a, b) => b.count - a.count || a.term.localeCompare(b.term));
}

export function matchJobDescription(resume: ResumeData, jobDescription: string): KeywordMatchResult {
  const resumeKeywords = extractKeywordStats(getResumePlainText(resume));
  const jobKeywords = extractKeywordStats(jobDescription);
  const resumeTerms = new Set(resumeKeywords.map((keyword) => keyword.term));
  const matched = jobKeywords.filter((keyword) => resumeTerms.has(keyword.term));
  const missing = jobKeywords.filter((keyword) => !resumeTerms.has(keyword.term)).slice(0, 40);
  const matchScore = jobKeywords.length ? Math.round((matched.length / jobKeywords.length) * 100) : 0;

  return { matchScore, matched, missing, resumeKeywords, jobKeywords };
}

export function normalizeForKeywords(text: string): string {
  return trimText(text)
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[‐-‒–—―]/g, "-")
    .replace(/\bnext\s*\.?\s*js\b/g, "next.js")
    .replace(/\bnode\s*\.?\s*js\b/g, "node.js")
    .replace(/[^\p{L}\p{N}#+.\-\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenize(text: string): string[] {
  return text
    .replace(/\./g, ".")
    .split(/\s+/)
    .flatMap((token) => {
      const clean = token.replace(/^[^\p{L}\p{N}#+]+|[^\p{L}\p{N}#+]+$/gu, "");
      if (!clean) return [];
      return clean.includes("-") ? [clean, ...clean.split("-")] : [clean];
    });
}

function isUsefulToken(token: string): boolean {
  if (token === "c#" || token === "c++") return true;
  if (token.length < 3) return false;
  return !STOP_WORDS.has(token);
}

function countPhrase(text: string, phrase: string): number {
  if (!phrase) return 0;
  const escaped = phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return text.match(new RegExp(`(^|\\s)${escaped}(?=\\s|$)`, "g"))?.length ?? 0;
}
