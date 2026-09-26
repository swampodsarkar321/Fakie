"use client";
import { useEffect, useRef } from "react";

export default function AdSlot({ slot = "free-top" }: { slot?: string }) {
  const frame = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const f = frame.current;
    if (!f || f.dataset.loaded) return;
    f.dataset.loaded = "1";
    const doc = f.contentDocument || f.contentWindow?.document;
    if (!doc) return;
    doc.open();
    doc.write(
      `<script>atOptions={key:"7609a23067dbbb1fa63c563dcc5e40e1",format:"iframe",height:300,width:160,params:{}}<\/script><script src="https://www.highrevenueformat.com/7609a23067dbbb1fa63c563dcc5e40e1/invoke.js"><\/script><style>body{margin:0;display:flex;justify-content:center}</style>`
    );
    doc.close();
  }, []);

  return (
    <div className="w-full flex justify-center my-3">
      <div className="flex flex-col items-center gap-1">
        <span className="text-[10px] uppercase tracking-widest font-bold text-zinc-400">Advertisement</span>
        <iframe ref={frame} title={`ad-${slot}`} width={160} height={300} scrolling="no" frameBorder={0} className="rounded-xl overflow-hidden bg-zinc-100 border border-black/10" />
      </div>
    </div>
  );
}
