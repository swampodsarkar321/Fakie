"use client";
import { useEffect } from "react";

export default function Protection() {
  useEffect(() => {
    const noMenu = (e: MouseEvent) => e.preventDefault();
    const noKeys = (e: KeyboardEvent) => {
      if (
        e.key === "PrintScreen" ||
        ((e.ctrlKey || e.metaKey) && ["s", "p", "u", "c"].includes(e.key.toLowerCase())) ||
        (e.ctrlKey && e.shiftKey && ["i", "j"].includes(e.key.toLowerCase()))
      ) {
        e.preventDefault();
        document.body.style.filter = "blur(8px)";
        setTimeout(() => (document.body.style.filter = ""), 800);
      }
    };
    const noDrag = (e: DragEvent) => e.preventDefault();
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
