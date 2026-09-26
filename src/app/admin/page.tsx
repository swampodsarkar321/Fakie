"use client";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { ref as dbRef, onValue, set, push } from "firebase/database";

interface Pay { id: string; uid: string; name: string; email: string; plan: string; price: number; method: string; trx: string; at: number; status: string; }

export default function AdminPage() {
  const [key, setKey] = useState("");
  const [ok, setOk] = useState(false);
  const [pays, setPays] = useState<Pay[]>([]);

  useEffect(() => {
    if (!ok) return;
    return onValue(dbRef(db, "payments"), (s) => {
      const v = s.val() || {};
      setPays(Object.entries(v).map(([id, p]: any) => ({ id, ...p })).sort((a, b) => b.at - a.at));
    });
  }, [ok]);

  const decide = async (p: Pay, active: boolean) => {
    await set(dbRef(db, `payments/${p.id}/status`), active ? "approved" : "rejected");
    if (active && p.uid !== "anon") {
      await set(dbRef(db, `users/${p.uid}/pro`), { plan: p.plan, price: p.price, status: "active", method: p.method, trx: p.trx, createdAt: Date.now() });
    }
  };

  if (!ok) return (
    <div className="min-h-screen flex items-center justify-center bg-[#f4f4f5] p-4">
      <div className="bg-white rounded-3xl p-8 w-full max-w-[340px] text-center shadow-xl">
        <b className="text-xl">Fakie Admin</b>
        <input type="password" value={key} onChange={(e) => setKey(e.target.value)} placeholder="Admin key" className="mt-4 w-full border border-black/15 rounded-xl px-4 py-2.5 outline-none" />
        <button onClick={() => key === (process.env.NEXT_PUBLIC_ADMIN_KEY || "fakie123") && setOk(true)} className="w-full bg-black text-white font-bold py-2.5 rounded-xl mt-3">Unlock</button>
      </div>
    </div>
  );

  const pend = pays.filter((p) => p.status === "pending");
  return (
    <div className="min-h-screen bg-[#f4f4f5] p-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-extrabold">Payments <span className="text-sm font-medium text-zinc-500">({pend.length} pending)</span></h1>
        <div className="space-y-2.5 mt-4">
          {pays.map((p) => (
            <div key={p.id} className="bg-white rounded-2xl p-4 border border-black/10 flex flex-wrap items-center gap-3">
              <div className="flex-1 min-w-[200px]">
                <b>{p.name}</b> <span className="text-xs text-zinc-500">{p.email}</span>
                <div className="text-[13px] mt-0.5">{p.plan} • ${p.price} • {p.method} • Trx: <b>{p.trx}</b></div>
                <div className="text-[11px] text-zinc-400">{new Date(p.at).toLocaleString()}</div>
              </div>
              <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${p.status === "pending" ? "bg-amber-100 text-amber-700" : p.status === "approved" ? "bg-green-100 text-green-700" : "bg-zinc-100 text-zinc-500"}`}>{p.status}</span>
              {p.status === "pending" && (
                <div className="flex gap-2">
                  <button onClick={() => decide(p, true)} className="bg-green-600 text-white text-[13px] font-bold px-4 py-2 rounded-full">Approve</button>
                  <button onClick={() => decide(p, false)} className="bg-zinc-200 text-[13px] font-bold px-4 py-2 rounded-full">Reject</button>
                </div>
              )}
            </div>
          ))}
          {pays.length === 0 && <p className="text-zinc-500 text-sm">No payments yet.</p>}
        </div>
      </div>
    </div>
  );
}
