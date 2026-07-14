import { ResumePreview } from "@/components/preview/ResumePreview";
import type { ResumePaperSizeKey } from "@/constants/paper";
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
  onPaperSizeChange,
  onSettingsChange,
  paperSizeKey
}: {
  activePanel: ActivePanel;
  data: ResumeData;
  isMobileLayout: boolean;
  mobileMode: MobileMode;
  onActivePanelChange: (panel: ActivePanel) => void;
  onMobileModeChange: (mode: MobileMode) => void;
  onPaperSizeChange: (paperSize: ResumePaperSizeKey) => void;
  onSettingsChange: (settings: SectionSetting[]) => void;
  paperSizeKey: ResumePaperSizeKey;
}) {
  const sectionSettings = data.sectionSettings ?? [];

  return (
    <main className="mx-auto flex w-full max-w-[1800px] flex-1 flex-col space-y-3 p-2 pb-6 sm:space-y-4 sm:p-4 xl:min-h-0 xl:overflow-hidden xl:pb-4">
      <MobileBuilderTabs mode={mobileMode} onModeChange={onMobileModeChange} />
      <div className="grid flex-1 gap-3 sm:gap-4 xl:min-h-0 xl:grid-cols-[minmax(360px,42%)_minmax(0,58%)]">
        <div className={mobileMode === "edit" ? "block xl:min-h-0 xl:overflow-hidden" : "hidden xl:block xl:min-h-0 xl:overflow-hidden"}>
          {isMobileLayout ? (
            <MobileSectionLauncher
              activePanel={activePanel}
              onOpenPanel={onActivePanelChange}
              onSettingsChange={onSettingsChange}
              settings={sectionSettings}
            />
          ) : (
            <div className="grid gap-3 sm:gap-4 xl:h-full xl:min-h-0 xl:grid-cols-[240px_minmax(0,1fr)]">
              <BuilderNavigation
                activePanel={activePanel}
                onActivePanelChange={onActivePanelChange}
                onSettingsChange={onSettingsChange}
                settings={sectionSettings}
              />
              <div className="scroll-area min-w-0 space-y-4 xl:min-h-0 xl:overflow-auto xl:pr-1">
                <BuilderPanel activePanel={activePanel} data={data} />
              </div>
            </div>
          )}
        </div>
        <div className={mobileMode === "preview" ? "block xl:min-h-0" : "hidden xl:block xl:min-h-0"}>
          <div className="xl:h-full xl:min-h-0">
            <ResumePreview data={data} onPaperSizeChange={onPaperSizeChange} paperSizeKey={paperSizeKey} />
          </div>
        </div>
      </div>
    </main>
  );
}
