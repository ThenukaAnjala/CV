"use client";

import { X } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useRef } from "react";

type BottomDrawerProps = {
  open: boolean;
  title: string;
  description?: string;
  closeLabel: string;
  onClose: () => void;
  children: ReactNode;
};

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "textarea:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  '[tabindex]:not([tabindex="-1"])'
].join(",");

export function BottomDrawer({
  open,
  title,
  description,
  closeLabel,
  onClose,
  children
}: BottomDrawerProps) {
  const drawerRef = useRef<HTMLElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;

    previousFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab") return;

      const focusableElements = Array.from(
        drawerRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR) ?? []
      );
      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      }

      if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previousFocusRef.current?.focus();
    };
  }, [onClose, open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end bg-slate-950/50 p-0 sm:p-4 xl:hidden">
      <button
        aria-label="Close drawer backdrop"
        className="absolute inset-0 cursor-default"
        onClick={onClose}
        tabIndex={-1}
        type="button"
      />
      <section
        aria-describedby={description ? "bottom-drawer-description" : undefined}
        aria-labelledby="bottom-drawer-title"
        aria-modal="true"
        className="relative max-h-[88vh] w-full overflow-hidden rounded-t-lg bg-white shadow-2xl sm:mx-auto sm:max-w-2xl sm:rounded-lg"
        ref={drawerRef}
        role="dialog"
      >
        <div className="sticky top-0 z-10 border-b border-slate-200 bg-white p-4 pr-16">
          <div className="min-w-0">
            <h2 className="break-words text-base font-semibold text-slate-950" id="bottom-drawer-title">
              {title}
            </h2>
            {description ? (
              <p className="mt-1 text-sm leading-6 text-slate-600" id="bottom-drawer-description">
                {description}
              </p>
            ) : null}
          </div>
        </div>
        <button
          aria-label={closeLabel}
          className="absolute right-3 top-3 z-20 inline-grid h-10 w-10 place-items-center rounded-md border border-slate-300 bg-white text-slate-900 shadow-sm transition hover:border-slate-400 hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700"
          onClick={onClose}
          ref={closeButtonRef}
          type="button"
        >
          <X aria-hidden className="h-5 w-5 stroke-[2.5]" />
        </button>
        <div className="max-h-[calc(88vh-5rem)] overflow-y-auto overscroll-contain p-3 sm:p-4">
          {children}
        </div>
      </section>
    </div>
  );
}
