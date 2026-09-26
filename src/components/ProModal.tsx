"use client";
import { useState } from "react";
import { auth, db } from "@/lib/firebase";
import { ref as dbRef, set, push } from "firebase/database";

export default function ProModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [plan, setPlan] = useState<"monthly" | "yearly">("monthly");
  const [method, setMethod] = useState("bKash");
  const [trx, setTrx] = useState("");
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  if (!open) return null;
  const price = plan === "monthly" ? 8 : 60;
  const buy = async () => {
    setErr("");
    const u = auth.currentUser;
    if (!u) { setErr("Please login with Google first (top-right button)."); return; }
    if (!trx.trim()) { setErr("Please enter your Transaction ID."); return; }
    setBusy(true);
    try {
      await push(dbRef(db, "payments"), { uid: u.uid, name: u.displayName, email: u.email, plan, price, method, trx: trx.trim(), status: "pending", at: Date.now() });
      setSent(true);
    } catch (e: any) {
      setErr("Submit failed: " + (e?.message || "database blocked") + " — Firebase Rules check koro.");
    } finally {
      setBusy(false);
    }
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
        <button onClick={buy} disabled={busy} className="w-full bg-black text-white font-bold py-3.5 rounded-full mt-4 disabled:opacity-60">{busy ? "Submitting…" : `I Paid $${price} — Submit`}</button>
        {err && <div className="text-[13px] font-bold text-red-600 mt-2.5">{err}</div>}
        <div className="bg-zinc-50 border border-black/10 rounded-2xl p-3.5 mt-3 text-left">
          <div className="text-[13px] font-bold">Pay manually:</div>
          <div className="flex gap-2 mt-2">
            {["bKash", "Nagad", "Rocket"].map((m) => (
              <button key={m} onClick={() => setMethod(m)} className={`flex-1 text-[13px] font-bold py-2 rounded-xl border-2 ${method === m ? "border-black" : "border-black/10 text-zinc-500"}`}>{m}</button>
            ))}
          </div>
          <div className="text-[14px] mt-2.5">Send <b>${price}</b> to <b className="select-all">01XXXXXXXXX</b></div>
          <input value={trx} onChange={(e) => setTrx(e.target.value)} placeholder="Transaction ID (TrxID)" className="mt-2 w-full border border-black/15 rounded-xl px-3.5 py-2.5 text-[14px] outline-none" />
        </div>
        {sent && <div className="text-[13px] font-bold text-green-600 mt-3">✓ Received! Pro will activate after admin approval.</div>}
        <button onClick={onClose} className="w-full text-[13px] text-zinc-500 mt-2.5">Maybe later</button>
      </div>
    </div>
  );
}
