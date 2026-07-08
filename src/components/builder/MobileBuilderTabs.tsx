import { FileText, Pencil } from "lucide-react";
import { Button } from "@/components/ui/Button";

export type MobileMode = "edit" | "preview";

export function MobileBuilderTabs({ mode, onModeChange }: { mode: MobileMode; onModeChange: (mode: MobileMode) => void }) {
  return (
    <div className="grid grid-cols-2 gap-2 rounded-lg border border-slate-200 bg-white p-2 shadow-sm lg:hidden">
      <Button icon={<Pencil aria-hidden size={16} />} onClick={() => onModeChange("edit")} variant={mode === "edit" ? "primary" : "secondary"}>
        Edit
      </Button>
      <Button icon={<FileText aria-hidden size={16} />} onClick={() => onModeChange("preview")} variant={mode === "preview" ? "primary" : "secondary"}>
        Preview
      </Button>
    </div>
  );
}
