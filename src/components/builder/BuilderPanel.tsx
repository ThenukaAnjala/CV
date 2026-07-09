import { ActivitiesForm } from "./sections/ActivitiesForm";
import { CertificationsForm } from "./sections/CertificationsForm";
import { EducationForm } from "./sections/EducationForm";
import { ExperienceForm } from "./sections/ExperienceForm";
import { PersonalInfoForm } from "./sections/PersonalInfoForm";
import { ProjectsForm } from "./sections/ProjectsForm";
import { SkillsForm } from "./sections/SkillsForm";
import { SummaryForm } from "./sections/SummaryForm";
import { AtsReadinessPanel } from "@/components/ats/AtsReadinessPanel";
import { JobDescriptionMatcher } from "@/components/ats/JobDescriptionMatcher";
import type { ResumeData } from "@/types/resume";
import type { ActivePanel } from "./builderPanelConfig";

export function BuilderPanel({ activePanel, data }: { activePanel: ActivePanel; data: ResumeData }) {
  if (activePanel === "personal") return <PersonalInfoForm />;
  if (activePanel === "summary") return <SummaryForm />;
  if (activePanel === "education") return <EducationForm />;
  if (activePanel === "experience") return <ExperienceForm />;
  if (activePanel === "projects") return <ProjectsForm />;
  if (activePanel === "skills") return <SkillsForm />;
  if (activePanel === "certifications") return <CertificationsForm />;
  if (activePanel === "activities") return <ActivitiesForm />;
  if (activePanel === "ats") return <AtsReadinessPanel data={data} />;
  return <JobDescriptionMatcher data={data} />;
}
