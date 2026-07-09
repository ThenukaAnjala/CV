import { FileText, Pencil } from "lucide-react";
import { Button } from "@/components/ui/Button";

export type MobileMode = "edit" | "preview";

export function MobileBuilderTabs({ mode, onModeChange }: { mode: MobileMode; onModeChange: (mode: MobileMode) => void }) {
  return (
    <div aria-label="Mobile editor mode" className="sticky top-0 z-20 grid grid-cols-2 gap-2 rounded-lg border border-slate-200 bg-white/95 p-2 shadow-sm backdrop-blur xl:hidden">
      <Button className="w-full" icon={<Pencil aria-hidden size={16} />} onClick={() => onModeChange("edit")} variant={mode === "edit" ? "primary" : "secondary"}>
        Edit
      </Button>
      <Button className="w-full" icon={<FileText aria-hidden size={16} />} onClick={() => onModeChange("preview")} variant={mode === "preview" ? "primary" : "secondary"}>
        Preview
      </Button>
    </div>
  );
}
