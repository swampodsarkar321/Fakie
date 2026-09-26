"use client";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { ref as dbRef, onValue, set } from "firebase/database";

const ADMIN_EMAIL = "mdswampodsarkar007@gmail.com";
const ADMIN_PASS = "123456";

interface Pay { id: string; uid: string; name: string; email: string; plan: string; price: number; method: string; trx: string; at: number; status: string; }

export default function AdminPage() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [ok, setOk] = useState(() => typeof window !== "undefined" && sessionStorage.getItem("fakie_admin") === "1");
  const [err, setErr] = useState("");
  const [tab, setTab] = useState<"payments" | "users" | "ads">("payments");
  const [pays, setPays] = useState<Pay[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [ads, setAds] = useState<any[]>([]);

  useEffect(() => {
    if (!ok) return;
    const off1 = onValue(dbRef(db, "payments"), (s) => {
      const v = s.val() || {};
      setPays(Object.entries(v).map(([id, p]: any) => ({ id, ...p })).sort((a, b) => b.at - a.at));
    });
    const off2 = onValue(dbRef(db, "users"), (s) => {
      const v = s.val() || {};
      setUsers(Object.entries(v).map(([uid, u]: any) => ({ uid, ...u })));
    });
    const off3 = onValue(dbRef(db, "adViews"), (s) => {
      const v = s.val() || {};
      setAds(Object.entries(v).map(([id, a]: any) => ({ id, ...a })));
    });
    return () => { off1(); off2(); off3(); };
  }, [ok]);

  const login = () => {
    if (email.trim().toLowerCase() === ADMIN_EMAIL && pass === ADMIN_PASS) {
      sessionStorage.setItem("fakie_admin", "1");
      setOk(true);
    } else setErr("Only admin can access.");
  };

  const decide = async (p: Pay, active: boolean) => {
    await set(dbRef(db, `payments/${p.id}/status`), active ? "approved" : "rejected");
    if (active && p.uid && p.uid !== "anon") {
      await set(dbRef(db, `users/${p.uid}/pro`), { plan: p.plan, price: p.price, status: "active", method: p.method, trx: p.trx, createdAt: Date.now() });
    }
  };

  if (!ok) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-950 to-zinc-800 p-4">
      <div className="bg-white rounded-3xl p-8 w-full max-w-[360px] shadow-2xl">
        <div className="w-12 h-12 rounded-2xl bg-black text-white flex items-center justify-center text-xl font-extrabold">f<span className="text-green-500">.</span></div>
        <h1 className="text-xl font-extrabold mt-4">Admin Login</h1>
        <p className="text-[13px] text-zinc-500">Restricted access only.</p>
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Admin email" className="mt-4 w-full border border-black/15 rounded-xl px-4 py-2.5 text-sm outline-none" />
        <input type="password" value={pass} onChange={(e) => setPass(e.target.value)} onKeyDown={(e) => e.key === "Enter" && login()} placeholder="Password" className="mt-2 w-full border border-black/15 rounded-xl px-4 py-2.5 text-sm outline-none" />
        {err && <p className="text-red-500 text-[13px] mt-2">{err}</p>}
        <button onClick={login} className="w-full bg-black text-white font-bold py-2.5 rounded-xl mt-3">Login</button>
      </div>
    </div>
  );

  const pend = pays.filter((p) => p.status === "pending");
  const revenue = pays.filter((p) => p.status === "approved").reduce((a, p) => a + (p.price || 0), 0);
  const proUsers = users.filter((u) => u.pro?.status === "active").length;

  return (
    <div className="min-h-screen bg-[#f4f4f5] flex">
      <aside className="w-[210px] bg-black text-white p-5 shrink-0 hidden sm:flex flex-col gap-1 min-h-screen">
        <b className="text-lg px-2">fakie<span className="text-green-500">.</span> <span className="text-[11px] font-medium text-zinc-400">admin</span></b>
        <div className="mt-4 text-[11px] uppercase tracking-widest text-zinc-500 px-2">Menu</div>
        {[["payments", `Payments (${pend.length})`], ["users", `Users (${users.length})`], ["ads", `Ad views (${ads.length})`]].map(([t, l]) => (
          <button key={t} onClick={() => setTab(t as any)} className={`text-left px-3 py-2.5 rounded-xl text-[14px] font-semibold ${tab === t ? "bg-white text-black" : "text-zinc-400 hover:text-white"}`}>{l}</button>
        ))}
        <button onClick={() => { sessionStorage.removeItem("fakie_admin"); setOk(false); }} className="mt-auto text-left px-3 py-2.5 text-[14px] text-zinc-500">Logout</button>
      </aside>
      <main className="flex-1 p-4 sm:p-6 max-w-4xl">
        <div className="grid grid-cols-3 gap-3">
          {[["Revenue", `$${revenue}`], ["Pending", `${pend.length}`], ["Pro users", `${proUsers}`]].map(([k, v]) => (
            <div key={k} className="bg-white rounded-2xl p-4 border border-black/10"><div className="text-[12px] text-zinc-500 font-semibold">{k}</div><div className="text-2xl font-extrabold">{v}</div></div>
          ))}
        </div>
        {tab === "payments" && (
          <div className="space-y-2.5 mt-4">
            {pays.map((p) => (
              <div key={p.id} className="bg-white rounded-2xl p-4 border border-black/10 flex flex-wrap items-center gap-3">
                <div className="flex-1 min-w-[200px]">
                  <b>{p.name}</b> <span className="text-xs text-zinc-500">{p.email}</span>
                  <div className="text-[13px] mt-0.5">{p.plan} • ${p.price} • {p.method} • Trx: <b className="select-all">{p.trx}</b></div>
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
        )}
        {tab === "users" && (
          <div className="space-y-2 mt-4">
            {users.map((u) => (
              <div key={u.uid} className="bg-white rounded-2xl p-4 border border-black/10 flex items-center gap-3">
                {u.photo ? <img src={u.photo} className="w-9 h-9 rounded-full" alt="" /> : <div className="w-9 h-9 rounded-full bg-zinc-200" />}
                <div className="flex-1"><b className="text-[14px]">{u.name}</b><div className="text-[12px] text-zinc-500">{u.email}</div></div>
                <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${u.pro?.status === "active" ? "bg-green-100 text-green-700" : "bg-zinc-100 text-zinc-500"}`}>{u.pro?.status === "active" ? `PRO ${u.pro.plan}` : "free"}</span>
              </div>
            ))}
            {users.length === 0 && <p className="text-zinc-500 text-sm">No users yet.</p>}
          </div>
        )}
        {tab === "ads" && (
          <div className="bg-white rounded-2xl p-5 border border-black/10 mt-4">
            <b>Total ad-gate views: {ads.length}</b>
            <div className="text-[13px] text-zinc-500 mt-1">Last 10:</div>
            <div className="mt-2 space-y-1 text-[13px]">
              {ads.slice(-10).reverse().map((a: any) => (<div key={a.id} className="flex justify-between border-b border-black/5 py-1.5"><span>{a.slug}</span><span className="text-zinc-400">{new Date(a.at).toLocaleString()}</span></div>))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
