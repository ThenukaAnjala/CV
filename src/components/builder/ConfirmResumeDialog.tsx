import { Dialog } from "@/components/ui/Dialog";

export type ConfirmAction = "new" | "reset" | "import" | null;

export function ConfirmResumeDialog({
  action,
  onCancel,
  onConfirm
}: {
  action: ConfirmAction;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <Dialog
      confirmLabel={action === "import" ? "Import resume" : "Confirm"}
      danger={action !== "import"}
      description={dialogDescription(action)}
      onCancel={onCancel}
      onConfirm={onConfirm}
      open={Boolean(action)}
      title={dialogTitle(action)}
    />
  );
}

function dialogTitle(action: ConfirmAction): string {
  if (action === "import") return "Replace current resume?";
  if (action === "new") return "Start a new resume?";
  if (action === "reset") return "Reset this resume?";
  return "";
}

function dialogDescription(action: ConfirmAction): string {
  if (action === "import") {
    return "The imported JSON will replace only the current in-memory editor state after validation.";
  }
  if (action === "new") return "This clears the editor and starts a blank resume.";
  if (action === "reset") return "This clears all resume fields in the editor.";
  return "";
}
