"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { useCallback, useState } from "react";
import { BuilderHeader, type PrivacyStatus } from "./BuilderHeader";
import { BuilderWorkspace } from "./BuilderWorkspace";
import { ConfirmResumeDialog, type ConfirmAction } from "./ConfirmResumeDialog";
import { MobilePanelDrawer } from "./MobilePanelDrawer";
import type { MobileMode } from "./MobileBuilderTabs";
import { downloadTextFile } from "@/lib/download";
import { createBlankResumeData } from "@/lib/resume/defaults";
import { getJsonExportFilename } from "@/lib/resume/filename";
import { parseResumeJson, serializeResumeJson } from "@/lib/resume/json";
import { resumeDataSchema } from "@/schemas/resumeSchema";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import type { ResumeData, SectionSetting } from "@/types/resume";
import type { ActivePanel } from "./builderPanelConfig";

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
  const [mobileDrawerPanel, setMobileDrawerPanel] = useState<ActivePanel | null>(null);
  const [confirmAction, setConfirmAction] = useState<ConfirmAction>(null);
  const [pendingImport, setPendingImport] = useState<ResumeData | null>(null);
  const isMobileLayout = useMediaQuery("(max-width: 1279px)");
  const [status, setStatus] = useState<PrivacyStatus>({
    message: "No autosave is active. Closing or refreshing this page clears current edits.",
    tone: "neutral"
  });

  const closeMobileDrawer = useCallback(() => setMobileDrawerPanel(null), []);

  function publishStatus(message: string, tone: "neutral" | "success" | "error") {
    setStatus({ message, tone });
  }

  function handleMobileModeChange(mode: MobileMode) {
    setMobileMode(mode);
    if (mode === "preview") setMobileDrawerPanel(null);
  }

  const handleActivePanelChange = useCallback(
    (panel: ActivePanel) => {
      setActivePanel(panel);
      if (isMobileLayout) setMobileDrawerPanel(panel);
    },
    [isMobileLayout]
  );

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
      setMobileDrawerPanel(null);
    }
    if (confirmAction === "import" && pendingImport) {
      methods.reset(pendingImport);
      publishStatus("Import successful", "success");
      setPendingImport(null);
      setActivePanel("personal");
      setMobileDrawerPanel(null);
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
        <BuilderWorkspace
          activePanel={activePanel}
          data={resume}
          isMobileLayout={isMobileLayout}
          mobileMode={mobileMode}
          onActivePanelChange={handleActivePanelChange}
          onMobileModeChange={handleMobileModeChange}
          onSettingsChange={setSectionSettings}
        />
        <ConfirmResumeDialog
          action={confirmAction}
          onCancel={() => setConfirmAction(null)}
          onConfirm={confirm}
        />
        <MobilePanelDrawer
          activePanel={mobileDrawerPanel}
          data={resume}
          onClose={closeMobileDrawer}
          open={isMobileLayout && mobileMode === "edit"}
        />
      </div>
    </FormProvider>
  );
}
