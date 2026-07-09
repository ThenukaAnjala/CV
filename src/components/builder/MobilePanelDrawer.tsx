import { BottomDrawer } from "@/components/ui/BottomDrawer";
import type { ResumeData } from "@/types/resume";
import { BuilderPanel } from "./BuilderPanel";
import { getPanelItem, type ActivePanel } from "./builderPanelConfig";

export function MobilePanelDrawer({
  activePanel,
  data,
  open,
  onClose
}: {
  activePanel: ActivePanel | null;
  data: ResumeData;
  open: boolean;
  onClose: () => void;
}) {
  if (!activePanel) return null;

  const panelItem = getPanelItem(activePanel);

  return (
    <BottomDrawer
      closeLabel={`Close ${panelItem.label} editor`}
      description={panelItem.description}
      onClose={onClose}
      open={open}
      title={panelItem.title}
    >
      <BuilderPanel activePanel={activePanel} data={data} />
    </BottomDrawer>
  );
}
