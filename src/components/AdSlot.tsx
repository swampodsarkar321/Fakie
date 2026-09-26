"use client";
export default function AdSlot({ slot = "free-top" }: { slot?: string }) {
  return (
    <div className="w-full flex justify-center my-3">
      <div className="w-full max-w-[728px] min-h-[90px] bg-zinc-100 border border-dashed border-black/15 rounded-xl flex flex-col items-center justify-center text-[12px] text-zinc-400 gap-1">
        <span className="text-[10px] uppercase tracking-widest font-bold">Advertisement</span>
        <span>Monetag / Adsterra banner — {slot}</span>
        {/* Monetag: <script src="https://..."></script> | Adsterra: paste banner code here */}
      </div>
    </div>
  );
}
