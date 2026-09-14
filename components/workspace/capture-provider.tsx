"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import { CaptureDialog } from "@/components/workspace/capture-dialog";

type CaptureContext = {
  open: () => void;
  close: () => void;
  isOpen: boolean;
};

const Context = createContext<CaptureContext | null>(null);

export function useCapture() {
  const ctx = useContext(Context);
  if (!ctx) throw new Error("useCapture must be used inside <CaptureProvider>");
  return ctx;
}

export function CaptureProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setIsOpen((current) => !current);
      }
      if (event.key === "Escape") setIsOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const value = useMemo(() => ({ open, close, isOpen }), [open, close, isOpen]);

  return (
    <Context.Provider value={value}>
      {children}
      {isOpen ? <CaptureDialog onClose={close} /> : null}
    </Context.Provider>
  );
}
