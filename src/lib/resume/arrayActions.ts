import type {
  ActivityEntry,
  CertificationEntry,
  EducationEntry,
  ExperienceEntry,
  ProjectEntry,
  ResumeBullet,
  ResumeLink,
  SkillGroup
} from "@/types/resume";
import { createId } from "./id";

export function moveItem<T>(items: readonly T[], index: number, direction: -1 | 1): T[] {
  const target = index + direction;
  if (target < 0 || target >= items.length) return [...items];
  const next = [...items];
  [next[index], next[target]] = [next[target], next[index]];
  return next;
}

export function cloneBullet(bullet: ResumeBullet): ResumeBullet {
  return { ...bullet, id: createId("bullet") };
}

export function cloneLink(link: ResumeLink): ResumeLink {
  return { ...link, id: createId("link") };
}

export function cloneEducation(entry: EducationEntry): EducationEntry {
  return { ...entry, id: createId("education"), details: entry.details.map(cloneBullet) };
}

export function cloneExperience(entry: ExperienceEntry): ExperienceEntry {
  return { ...entry, id: createId("experience"), bullets: entry.bullets.map(cloneBullet) };
}

export function cloneProject(entry: ProjectEntry): ProjectEntry {
  return {
    ...entry,
    id: createId("project"),
    links: entry.links.map(cloneLink),
    bullets: entry.bullets.map(cloneBullet)
  };
}

export function cloneSkillGroup(group: SkillGroup): SkillGroup {
  return { ...group, id: createId("skill"), values: [...group.values] };
}

export function cloneCertification(entry: CertificationEntry): CertificationEntry {
  return { ...entry, id: createId("certification") };
}

export function cloneActivity(entry: ActivityEntry): ActivityEntry {
  return { ...entry, id: createId("activity"), bullets: entry.bullets.map(cloneBullet) };
}
