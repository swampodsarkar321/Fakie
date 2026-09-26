"use client";
import { useState } from "react";
import { auth, db } from "@/lib/firebase";
import { ref as dbRef, set } from "firebase/database";

export default function ProModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [plan, setPlan] = useState<"monthly" | "yearly">("monthly");
  if (!open) return null;
  const price = plan === "monthly" ? 8 : 60;
  const buy = async () => {
    const u = auth.currentUser;
    if (!u) return alert("Age Login with Google koro");
    // Stripe/Paddle checkout link ekhane bosbe
    await set(dbRef(db, `users/${u.uid}/pro`), { plan, price, status: "pending", createdAt: Date.now() }).catch(() => {});
    alert(`Checkout: $${price} ${plan} — Stripe link connect korle payment hobe.`);
    onClose();
  };
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-3xl p-7 w-full max-w-[400px]" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-[22px] font-extrabold tracking-tight">Fakie Pro ✦</h2>
        <p className="text-[14px] text-zinc-500 mt-1">Watermark remove + HD + video export</p>
        <div className="grid grid-cols-2 gap-2 mt-5">
          <button onClick={() => setPlan("monthly")} className={`border-2 rounded-2xl p-3.5 text-left ${plan === "monthly" ? "border-black" : "border-black/10"}`}>
            <div className="font-bold">Monthly</div><div className="text-[20px] font-extrabold">$8<span className="text-[13px] font-medium text-zinc-500">/mo</span></div>
          </button>
          <button onClick={() => setPlan("yearly")} className={`border-2 rounded-2xl p-3.5 text-left relative ${plan === "yearly" ? "border-black" : "border-black/10"}`}>
            <span className="absolute -top-2.5 left-3 bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">SAVE 37%</span>
            <div className="font-bold">Yearly</div><div className="text-[20px] font-extrabold">$60<span className="text-[13px] font-medium text-zinc-500">/yr</span></div>
          </button>
        </div>
        <button onClick={buy} className="w-full bg-black text-white font-bold py-3.5 rounded-full mt-5">Buy Pro — ${price}</button>
        <button onClick={onClose} className="w-full text-[13px] text-zinc-500 mt-2.5">Maybe later</button>
      </div>
    </div>
  );
}
