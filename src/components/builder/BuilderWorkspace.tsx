import { ResumePreview } from "@/components/preview/ResumePreview";
import type { ResumeData, SectionSetting } from "@/types/resume";
import { BuilderNavigation } from "./BuilderNavigation";
import { BuilderPanel } from "./BuilderPanel";
import { MobileBuilderTabs, type MobileMode } from "./MobileBuilderTabs";
import { MobileSectionLauncher } from "./MobileSectionLauncher";
import type { ActivePanel } from "./builderPanelConfig";

export function BuilderWorkspace({
  activePanel,
  data,
  isMobileLayout,
  mobileMode,
  onActivePanelChange,
  onMobileModeChange,
  onSettingsChange
}: {
  activePanel: ActivePanel;
  data: ResumeData;
  isMobileLayout: boolean;
  mobileMode: MobileMode;
  onActivePanelChange: (panel: ActivePanel) => void;
  onMobileModeChange: (mode: MobileMode) => void;
  onSettingsChange: (settings: SectionSetting[]) => void;
}) {
  const sectionSettings = data.sectionSettings ?? [];

  return (
    <main className="mx-auto max-w-[1800px] space-y-3 p-2 pb-6 sm:space-y-4 sm:p-4">
      <MobileBuilderTabs mode={mobileMode} onModeChange={onMobileModeChange} />
      <div className="grid gap-3 sm:gap-4 xl:grid-cols-[minmax(320px,44%)_minmax(0,56%)]">
        <div className={mobileMode === "edit" ? "block" : "hidden xl:block"}>
          {isMobileLayout ? (
            <MobileSectionLauncher
              activePanel={activePanel}
              onOpenPanel={onActivePanelChange}
              onSettingsChange={onSettingsChange}
              settings={sectionSettings}
            />
          ) : (
            <div className="grid gap-3 sm:gap-4 xl:grid-cols-[230px_minmax(0,1fr)]">
              <BuilderNavigation
                activePanel={activePanel}
                onActivePanelChange={onActivePanelChange}
                onSettingsChange={onSettingsChange}
                settings={sectionSettings}
              />
              <div className="min-w-0 space-y-4">
                <BuilderPanel activePanel={activePanel} data={data} />
              </div>
            </div>
          )}
        </div>
        <div className={mobileMode === "preview" ? "block" : "hidden xl:block"}>
          <div className="xl:sticky xl:top-36">
            <ResumePreview data={data} />
          </div>
        </div>
      </div>
    </main>
  );
}
