"use client";
import { useEffect } from "react";

export default function Protection() {
  useEffect(() => {
    const inside = (t: EventTarget | null) => (t as HTMLElement)?.closest?.("[data-protected]");
    const noMenu = (e: MouseEvent) => {
      if (inside(e.target)) e.preventDefault();
    };
    const noKeys = (e: KeyboardEvent) => {
      if (e.key === "PrintScreen") {
        const pv = document.querySelector("[data-protected]") as HTMLElement | null;
        if (pv) {
          pv.style.filter = "blur(12px)";
          setTimeout(() => (pv.style.filter = ""), 800);
        }
        return;
      }
      if (
        inside(e.target) &&
        (((e.ctrlKey || e.metaKey) && ["s", "p", "u", "c"].includes(e.key.toLowerCase())) ||
          (e.ctrlKey && e.shiftKey && ["i", "j"].includes(e.key.toLowerCase())))
      ) {
        e.preventDefault();
      }
    };
    const noDrag = (e: DragEvent) => {
      if (inside(e.target)) e.preventDefault();
    };
    document.addEventListener("contextmenu", noMenu);
    document.addEventListener("keydown", noKeys);
    document.addEventListener("dragstart", noDrag);
    return () => {
      document.removeEventListener("contextmenu", noMenu);
      document.removeEventListener("keydown", noKeys);
      document.removeEventListener("dragstart", noDrag);
    };
  }, []);
  return null;
}
