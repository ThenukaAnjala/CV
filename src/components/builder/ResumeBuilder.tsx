"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { useState } from "react";
import { ActivitiesForm } from "./sections/ActivitiesForm";
import { BuilderHeader, type PrivacyStatus } from "./BuilderHeader";
import { BuilderNavigation } from "./BuilderNavigation";
import { CertificationsForm } from "./sections/CertificationsForm";
import { EducationForm } from "./sections/EducationForm";
import { ExperienceForm } from "./sections/ExperienceForm";
import { MobileBuilderTabs, type MobileMode } from "./MobileBuilderTabs";
import { PersonalInfoForm } from "./sections/PersonalInfoForm";
import { ProjectsForm } from "./sections/ProjectsForm";
import { SkillsForm } from "./sections/SkillsForm";
import { SummaryForm } from "./sections/SummaryForm";
import { AtsReadinessPanel } from "@/components/ats/AtsReadinessPanel";
import { JobDescriptionMatcher } from "@/components/ats/JobDescriptionMatcher";
import { ResumePreview } from "@/components/preview/ResumePreview";
import { Dialog } from "@/components/ui/Dialog";
import { downloadTextFile } from "@/lib/download";
import { createBlankResumeData } from "@/lib/resume/defaults";
import { getJsonExportFilename } from "@/lib/resume/filename";
import { parseResumeJson, serializeResumeJson } from "@/lib/resume/json";
import { resumeDataSchema } from "@/schemas/resumeSchema";
import type { ResumeData, SectionKey, SectionSetting } from "@/types/resume";

export type ActivePanel = SectionKey | "personal" | "ats" | "match";
type ConfirmAction = "new" | "reset" | "import" | null;

export function ResumeBuilder() {
  const methods = useForm<ResumeData>({
    defaultValues: createBlankResumeData(),
    mode: "onChange",
    reValidateMode: "onChange",
    resolver: zodResolver(resumeDataSchema)
  });
  const resume = useWatch({ control: methods.control }) as ResumeData;
  const [activePanel, setActivePanel] = useState<ActivePanel>("personal");
  const [mobileMode, setMobileMode] = useState<MobileMode>("edit");
  const [confirmAction, setConfirmAction] = useState<ConfirmAction>(null);
  const [pendingImport, setPendingImport] = useState<ResumeData | null>(null);
  const [status, setStatus] = useState<PrivacyStatus>({
    message: "No autosave is active. Closing or refreshing this page clears current edits.",
    tone: "neutral"
  });

  function publishStatus(message: string, tone: "neutral" | "success" | "error") {
    setStatus({ message, tone });
  }

  async function exportJson() {
    const isValid = await methods.trigger();
    if (!isValid) {
      publishStatus("Fix validation errors before exporting JSON.", "error");
      return;
    }

    downloadTextFile(serializeResumeJson(resume), getJsonExportFilename(resume));
    publishStatus("JSON file prepared by your browser. The app did not store a copy.", "success");
  }

  async function importJson(file: File) {
    try {
      const result = parseResumeJson(await file.text());
      if (!result.ok) {
        publishStatus(result.message, "error");
        return;
      }
      setPendingImport(result.data);
      setConfirmAction("import");
    } catch {
      publishStatus("This JSON file could not be read.", "error");
    }
  }

  function confirm() {
    if (confirmAction === "new" || confirmAction === "reset") {
      methods.reset(createBlankResumeData());
      publishStatus(confirmAction === "new" ? "New resume started" : "Resume reset", "success");
      setActivePanel("personal");
    }
    if (confirmAction === "import" && pendingImport) {
      methods.reset(pendingImport);
      publishStatus("Import successful", "success");
      setPendingImport(null);
      setActivePanel("personal");
    }
    setConfirmAction(null);
  }

  function setSectionSettings(settings: SectionSetting[]) {
    methods.setValue("sectionSettings", settings, { shouldDirty: true, shouldValidate: true });
  }

  return (
    <FormProvider {...methods}>
      <div className="min-h-screen bg-[#eef3f8]">
        <BuilderHeader
          data={resume}
          onExportJson={exportJson}
          onImportFile={importJson}
          onNewResume={() => setConfirmAction("new")}
          onReset={() => setConfirmAction("reset")}
          onStatus={publishStatus}
          status={status}
        />
        <main className="mx-auto max-w-[1800px] space-y-4 p-3 pb-6 sm:p-4">
          <MobileBuilderTabs mode={mobileMode} onModeChange={setMobileMode} />
          <div className="grid gap-4 lg:grid-cols-[minmax(320px,44%)_minmax(0,56%)]">
            <div className={mobileMode === "edit" ? "block" : "hidden lg:block"}>
              <div className="grid gap-4 xl:grid-cols-[230px_minmax(0,1fr)]">
                <BuilderNavigation
                  activePanel={activePanel}
                  onActivePanelChange={setActivePanel}
                  onSettingsChange={setSectionSettings}
                  settings={resume.sectionSettings ?? []}
                />
                <div className="min-w-0 space-y-4">{renderPanel(activePanel, resume)}</div>
              </div>
            </div>
            <div className={mobileMode === "preview" ? "block" : "hidden lg:block"}>
              <div className="lg:sticky lg:top-36">
                <ResumePreview data={resume} />
              </div>
            </div>
          </div>
        </main>
        <Dialog
          danger={confirmAction !== "import"}
          description={dialogDescription(confirmAction)}
          onCancel={() => setConfirmAction(null)}
          onConfirm={confirm}
          open={Boolean(confirmAction)}
          title={dialogTitle(confirmAction)}
          confirmLabel={confirmAction === "import" ? "Import resume" : "Confirm"}
        />
      </div>
    </FormProvider>
  );
}

function renderPanel(activePanel: ActivePanel, resume: ResumeData) {
  if (activePanel === "personal") return <PersonalInfoForm />;
  if (activePanel === "summary") return <SummaryForm />;
  if (activePanel === "education") return <EducationForm />;
  if (activePanel === "experience") return <ExperienceForm />;
  if (activePanel === "projects") return <ProjectsForm />;
  if (activePanel === "skills") return <SkillsForm />;
  if (activePanel === "certifications") return <CertificationsForm />;
  if (activePanel === "activities") return <ActivitiesForm />;
  if (activePanel === "ats") return <AtsReadinessPanel data={resume} />;
  return <JobDescriptionMatcher data={resume} />;
}

function dialogTitle(action: ConfirmAction): string {
  if (action === "import") return "Replace current resume?";
  if (action === "new") return "Start a new resume?";
  if (action === "reset") return "Reset this resume?";
  return "";
}

function dialogDescription(action: ConfirmAction): string {
  if (action === "import") return "The imported JSON will replace only the current in-memory editor state after validation.";
  if (action === "new") return "This clears the editor and starts a blank resume.";
  if (action === "reset") return "This clears all resume fields in the editor.";
  return "";
}
