"use client";
import { useEffect, useRef } from "react";

export default function AdSlot({ slot = "free-top" }: { slot?: string }) {
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!box.current || box.current.dataset.loaded) return;
    box.current.dataset.loaded = "1";
    const w = window as any;
    w.atOptions = { key: "7609a23067dbbb1fa63c563dcc5e40e1", format: "iframe", height: 300, width: 160, params: {} };
    const s = document.createElement("script");
    s.src = "https://www.highrevenueformat.com/7609a23067dbbb1fa63c563dcc5e40e1/invoke.js";
    s.async = true;
    box.current.appendChild(s);
  }, []);

  return (
    <div className="w-full flex justify-center my-3">
      <div className="flex flex-col items-center gap-1">
        <span className="text-[10px] uppercase tracking-widest font-bold text-zinc-400">Advertisement</span>
        <div ref={box} className="w-[160px] min-h-[300px] bg-zinc-100 border border-black/10 rounded-xl overflow-hidden flex items-center justify-center" />
      </div>
    </div>
  );
}
