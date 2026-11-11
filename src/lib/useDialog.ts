"use client";
import { useEffect, useRef } from "react";
export function useDialog(open: boolean, onClose: () => void) {
  const ref = useRef<HTMLDivElement>(null);
  const close = useRef(onClose);
  close.current = onClose;
  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const elements = () =>
      [
        ...(ref.current?.querySelectorAll<HTMLElement>(
          'button:not([disabled]), a[href], input, select, textarea, [tabindex="0"]',
        ) || []),
      ].filter((e) => e.getClientRects().length);
    const timer = setTimeout(() => elements()[0]?.focus(), 0);
    const keydown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close.current();
      if (e.key === "Tab") {
        const items = elements();
        const first = items[0],
          last = items[items.length - 1];
        if (
          e.shiftKey &&
          (document.activeElement === first ||
            !ref.current?.contains(document.activeElement))
        ) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };
    document.addEventListener("keydown", keydown);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("keydown", keydown);
      document.body.style.overflow = overflow;
      previous?.focus();
    };
  }, [open]);
  return ref;
}
