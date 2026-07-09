import type { ReactNode } from "react";
import { X } from "lucide-react";
import { Button } from "./Button";

type DialogProps = {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel?: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  children?: ReactNode;
};

export function Dialog({
  open,
  title,
  description,
  confirmLabel,
  cancelLabel = "Cancel",
  danger,
  onConfirm,
  onCancel,
  children
}: DialogProps) {
  if (!open) return null;

  return (
    <div className="ios-modal-shell fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45">
      <section
        aria-describedby="dialog-description"
        aria-labelledby="dialog-title"
        aria-modal="true"
        className="relative w-full max-w-md rounded-lg bg-white p-5 shadow-xl"
        role="dialog"
      >
        <div className="pr-12">
          <h2 className="min-w-0 break-words text-lg font-semibold text-slate-950" id="dialog-title">
            {title}
          </h2>
        </div>
        <button
          aria-label="Close dialog"
          className="absolute right-3 top-3 inline-grid h-10 w-10 place-items-center rounded-md border border-slate-300 bg-white text-slate-900 shadow-sm transition hover:border-slate-400 hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700"
          onClick={onCancel}
          type="button"
        >
          <X aria-hidden className="h-5 w-5 stroke-[2.5]" />
        </button>
        <p className="mt-2 text-sm text-slate-700" id="dialog-description">
          {description}
        </p>
        {children ? <div className="mt-4">{children}</div> : null}
        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button onClick={onCancel} variant="secondary">
            {cancelLabel}
          </Button>
          <Button onClick={onConfirm} variant={danger ? "danger" : "primary"}>
            {confirmLabel}
          </Button>
        </div>
      </section>
    </div>
  );
}
