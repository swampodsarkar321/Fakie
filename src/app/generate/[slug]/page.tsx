"use client";
import { use, useEffect, useRef, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { toPng } from "html-to-image";
import { getGenerator } from "@/lib/generators";
import AuthButton, { saveUser } from "@/components/AuthButton";
import AdSlot from "@/components/AdSlot";
import ProModal from "@/components/ProModal";
import { auth, db } from "@/lib/firebase";
import { ref as dbRef, set } from "firebase/database";

type Msg = { me: boolean; text: string; time: string };

// ---------- SVG icon set (no emoji anywhere in preview) ----------
const S = (p: any) => p;
const I = {
  signal: S(<svg width="17" height="11" viewBox="0 0 17 11" fill="currentColor"><rect x="0" y="7" width="3" height="4" rx="0.5"/><rect x="4.5" y="5" width="3" height="6" rx="0.5"/><rect x="9" y="2.5" width="3" height="8.5" rx="0.5"/><rect x="13.5" y="0" width="3" height="11" rx="0.5"/></svg>),
  wifi: S(<svg width="16" height="11" viewBox="0 0 16 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M1 4a10 10 0 0 1 14 0"/><path d="M3.5 7a6.5 6.5 0 0 1 9 0"/><circle cx="8" cy="10" r="1.3" fill="currentColor" stroke="none"/></svg>),
  battery: S(<svg width="25" height="12" viewBox="0 0 25 12" fill="none"><rect x="0.5" y="0.5" width="21" height="11" rx="3" stroke="currentColor" opacity="0.4"/><rect x="2" y="2" width="16" height="8" rx="1.5" fill="currentColor"/><path d="M23.5 4v4a2 2 0 0 0 0-4z" fill="currentColor" opacity="0.4"/></svg>),
  phone: (c = "#0084ff") => <svg width="20" height="20" viewBox="0 0 24 24" fill={c}><path d="M6.6 10.8a15.6 15.6 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.24 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 5a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1 11.4 11.4 0 0 0 .57 3.6 1 1 0 0 1-.25 1z"/></svg>,
  video: (c = "#0084ff") => <svg width="24" height="20" viewBox="0 0 28 20" fill={c}><rect x="1" y="2" width="17" height="13" rx="3"/><path d="M18 7l8-4v12l-8-4z"/></svg>,
  back: (c = "#0084ff") => <svg width="11" height="19" viewBox="0 0 12 20" fill="none" stroke={c} strokeWidth="2.2" strokeLinecap="round"><path d="M10 2L3 10l7 8"/></svg>,
  dots: (c = "currentColor") => <svg width="20" height="6" viewBox="0 0 20 6" fill={c}><circle cx="3" cy="3" r="1.6"/><circle cx="10" cy="3" r="1.6"/><circle cx="17" cy="3" r="1.6"/></svg>,
  lock: <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg>,
  check2: <svg width="18" height="12" viewBox="0 0 20 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M1 6.5L4.5 10 11 2M8 6.5l3.5 3.5L18 2"/></svg>,
  micWa: <svg width="18" height="20" viewBox="0 0 20 24" fill="#fff"><rect x="7" y="2" width="6" height="11" rx="3"/><path d="M4 11a6 6 0 0 0 12 0M10 17v4" stroke="#fff" strokeWidth="1.8" fill="none"/></svg>,
  clip: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21 11l-8.5 8.5a5.5 5.5 0 0 1-7.8-7.8L13 3.5a3.7 3.7 0 0 1 5.2 5.2l-8.2 8.2a1.85 1.85 0 0 1-2.6-2.6L15 6.5"/></svg>,
  heart: (f = "none", c = "currentColor") => <svg width="22" height="22" viewBox="0 0 24 24" fill={f} stroke={c} strokeWidth="1.8"><path d="M12 21C7 16.5 3 13 3 8.8A4.8 4.8 0 0 1 7.8 4c1.7 0 3.2.9 4.2 2.3A4.8 4.8 0 0 1 16.2 4 4.8 4.8 0 0 1 21 8.8c0 4.2-4 7.7-9 12.2z"/></svg>,
  comment: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21 12a8 8 0 0 1-8 8H4l2-3a8 8 0 1 1 15-5z"/></svg>,
  share: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7M12 3v13M7 8l5-5 5 5"/></svg>,
  repost: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M17 2l4 4-4 4M3 11V9a3 3 0 0 1 3-3h15M7 22l-4-4 4-4M21 13v2a3 3 0 0 1-3 3H3"/></svg>,
  chart: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/></svg>,
  play: <svg width="28" height="28" viewBox="0 0 24 24" fill="#fff"><circle cx="12" cy="12" r="10" opacity="0.35"/><path d="M10 8.5l6 3.5-6 3.5z"/></svg>,
  thumbUp: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M7 11v9H4a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1h3zm2 9h8.6a2 2 0 0 0 2-1.6l1.4-6A2 2 0 0 0 19 10h-5l1-4.6a1.5 1.5 0 0 0-2.9-.7L9 11z"/></svg>,
  globe: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3.5 3 14 0 18M12 3c-3 3.5-3 14 0 18"/></svg>,
  reply: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M9 14l-5-5 5-5M4 9h9a7 7 0 0 1 7 7v1"/></svg>,
  sendUp: <svg width="30" height="30" viewBox="0 0 30 30"><circle cx="15" cy="15" r="14" fill="#0a84ff"/><path d="M15 21V9M10 14l5-5 5 5" stroke="#fff" strokeWidth="2.2" fill="none" strokeLinecap="round"/></svg>,
  x: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M5 5l14 14M19 5L5 19"/></svg>,
};

function StatusBar({ dark = true, notch = true }: { dark?: boolean; notch?: boolean }) {
  return (
    <div className={`flex items-center justify-between px-6 pt-3 pb-1 text-[12px] font-semibold ${dark ? "text-white" : "text-black"}`}>
      <span>09:41</span>
      {notch && <div className="w-24 h-[22px] bg-black rounded-full border border-white/10" />}
      <span className="flex items-center gap-1.5">{I.signal}{I.wifi}{I.battery}</span>
    </div>
  );
}
const Avatar = ({ name, size = "w-9 h-9", img }: { name: string; size?: string; img?: string | null }) => (
  img ? <img src={img} className={`${size} rounded-full object-cover shrink-0`} alt="" /> :
  <div className={`${size} rounded-full bg-gradient-to-br from-slate-300 to-slate-400 text-slate-700 flex items-center justify-center font-semibold shrink-0`}>{name[0]?.toUpperCase()}</div>
);
const Verified = ({ size = 15 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="#1d9bf0"><path d="M22.25 12c0-1.03-.63-2.46-1.36-3.34-.24-.29-.34-.78-.17-1.3.2-.6.2-1.7-.24-2.5-.44-.8-1.3-1.5-2.1-1.6-.72-.1-1.02-.42-1.3-.75-.9-.97-2.05-1.51-3.08-1.51s-2.18.54-3.08 1.51c-.28.33-.58.65-1.3.75-.8.1-1.66.8-2.1 1.6-.44.8-.44 1.9-.24 2.5.17.52.07 1.01-.17 1.3-.73.88-1.36 2.31-1.36 3.34 0 1.03.63 2.46 1.36 3.34.24.29.34.78.17 1.3-.2.6-.2 1.7.24 2.5.44.8 1.3 1.5 2.1 1.6.72.1 1.02.42 1.3.75.9.97 2.05 1.51 3.08 1.51s2.18-.54 3.08-1.51c.28-.33.58-.65 1.3-.75.8-.1 1.66-.8 2.1-1.6.44-.8.44-1.9.24-2.5-.17-.52-.07-1.01.17-1.3.73-.88 1.36-2.31 1.36-3.34zM10.9 15.9l-3.4-3.4 1.4-1.4 2 2 5.6-5.6 1.4 1.4z" /><path d="M10.9 15.9l-3.4-3.4 1.4-1.4 2 2 5.6-5.6 1.4 1.4z" fill="#fff" /></svg>
);

// ---------- CHAT ----------
function ChatView({ slug, name, msgs, self, other, dark, img, avatar, verified }: any) {
  const wa = slug.includes("whatsapp"), im = slug.includes("imessage"), dc = slug.includes("discord"), tg = slug.includes("telegram"), ms = slug.includes("messenger"), ig = slug.includes("instagram"), fv = slug.includes("fiverr");
  if (fv) {
    return (
      <div className="bg-white text-[#222325] font-[Helvetica,Arial,sans-serif]">
        <div className="flex items-center gap-3 px-4 py-3 border-b border-black/10">
          <svg width="22" height="22" viewBox="0 0 24 24" stroke="#222325" strokeWidth="2.4" fill="none" strokeLinecap="round"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
          <span className="text-[26px] font-extrabold tracking-tight">fiverr<span className="text-[#1dbf73]">.</span></span>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 border-b border-black/10">
          <span className="text-xl">←</span>
          <div className="flex-1 text-center leading-tight">
            <div className="font-semibold text-[17px] underline underline-offset-2">{name}</div>
            <div className="text-[13px] text-zinc-500">4:51 AM local time</div>
          </div>
          <span className="text-lg tracking-widest">···</span>
        </div>
        <div className="flex justify-end pr-3 text-zinc-500"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M21 13A9 9 0 1 1 11 3a7 7 0 0 0 10 10z"/></svg></div>
        <div className="flex text-[16px] font-bold border-b border-black/10">
          <div className="flex-1 text-center py-2 border-b-[3px] border-black">Messages</div>
          <div className="flex-1 text-center py-2 text-zinc-400 font-semibold">Saved</div>
        </div>
        <div className="px-4 py-3 space-y-5 min-h-[380px]">
          {msgs.map((m: Msg, i: number) => (
            <div key={i} className="flex gap-2.5">
              <div className="w-9 h-9 rounded-full bg-[#d8dadf] shrink-0 flex items-center justify-center font-bold text-zinc-500 overflow-hidden">{m.me ? "Me"[0] : name[0]}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2"><b className="text-[15px]">{m.me ? "Me" : name}</b><span className="ml-auto text-[13px] text-zinc-500">Sep 20, {m.time} PM</span><span className="text-zinc-400">···</span></div>
                <p className="text-[15px] leading-[1.45] mt-1 text-[#222325]">{m.text}</p>
              </div>
            </div>
          ))}
          {img && <img src={img} className="rounded-lg max-w-full object-cover" />}
        </div>
        <div className="p-3">
          <div className="border border-black/20 rounded-lg px-4 py-3 text-[15px] text-zinc-400">Type a message...</div>
          <div className="flex items-center gap-4 mt-3">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#62666b" strokeWidth="1.8"><path d="M9 3v6H5l7 12v-6h4z"/></svg>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#62666b"><path d="M13 2L4 14h6l-1 8 9-12h-6z"/></svg>
            <span className="border-[1.5px] border-black rounded-lg px-5 py-1.5 font-bold text-[15px]">Create an offer</span>
            <span className="ml-auto w-11 h-11 rounded-full border-[3px] border-[#00c2ff] flex items-center justify-center"><svg width="20" height="20" viewBox="0 0 24 24" fill="#222325"><circle cx="12" cy="5" r="2.2"/><path d="M4 8h16v2h-6v3l4 8h-2.5L12 14l-3.5 7H6l4-8v-3H4z"/></svg></span>
          </div>
        </div>
      </div>
    );
  }
  if (ms || ig) {
    return (
      <div className="bg-white text-[#050505]">
        <div className="flex items-center justify-between px-6 pt-3 pb-1 text-[13px] font-semibold text-black"><span>09:13</span><span className="flex items-center gap-1.5">{I.signal}{I.wifi}{I.battery}</span></div>
        <div className="flex items-center gap-2 px-2 py-2 border-b border-black/10">{I.back("#0084ff")}
          <div className="relative"><Avatar name={name} img={avatar} /><div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" /></div>
          <div className="leading-tight"><div className="font-semibold text-[16px] flex items-center gap-1">{name}{verified && <Verified />}</div><div className="text-[12px] text-zinc-500">Active now</div></div>
          <div className="ml-auto flex items-center gap-3 pr-2">{I.phone()}{I.video()}</div>
        </div>
        <div className="px-4 py-3 space-y-2 min-h-[460px]">
          <div className="text-center text-[12px] text-zinc-500">September 26, 2026 at 9:16 AM</div>
          {msgs.map((m: Msg, i: number) => m.me ? (
            <div key={i} className="flex justify-end"><div className="text-white text-[15px] px-3 py-2 rounded-[18px] max-w-[75%]" style={{ background: ms ? "linear-gradient(90deg,#a334fa,#0084ff)" : "#3797f0" }}>{m.text}</div></div>
          ) : (
            <div key={i} className="flex items-end gap-1.5">{avatar ? <img src={avatar} className="w-6 h-6 rounded-full object-cover shrink-0" alt="" /> : <div className="w-6 h-6 rounded-full bg-[#e4e6eb] text-[10px] flex items-center justify-center font-bold text-zinc-500 shrink-0">{name[0]}</div>}<div className="bg-[#e4e6eb] text-[15px] px-3 py-2 rounded-[18px] max-w-[75%]">{m.text}</div></div>
          ))}
          {img && <div className="flex justify-end"><img src={img} className="rounded-[18px] max-w-[75%] object-cover" /></div>}
        </div>
        <div className="flex items-center gap-2.5 px-2 py-2.5 border-t border-black/5 text-[#0084ff]"><span className="font-bold text-lg">›</span>{I.comment}{I.clip}{I.sendUp}<div className="flex-1" /></div>
      </div>
    );
  }
  if (wa) return (
    <div className="bg-[#0b141a] text-white">
      <StatusBar notch={false} /><div className="flex items-center gap-2 px-3 py-2 bg-[#1f2c34]/80 backdrop-blur-xl" style={{ background: "rgba(31,44,52,0.75)" }}>{I.back("#aebac1")}<Avatar name={name} img={avatar} /><div className="flex-1 leading-tight"><div className="text-[15px] flex items-center gap-1">{name}{verified && <Verified size={13} />}</div><div className="text-[12px] text-[#8696a0]">online</div></div><div className="flex gap-4 text-[#aebac1]">{I.video("#aebac1")}{I.phone("#aebac1")}</div></div>
      <div className="p-3 space-y-1.5 min-h-[430px]" style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)", backgroundSize: "18px 18px" }}>
        <div className="flex justify-center"><span className="bg-[#182229] text-[11px] px-3 py-1 rounded-full text-[#ffd279] flex items-center gap-1">{I.lock} end-to-end encrypted</span></div>
        {msgs.map((m: Msg, i: number) => (
          <div key={i} className={`flex ${m.me ? "justify-end" : "justify-start"}`}><div className={`${m.me ? "bg-[#005c4b]" : "bg-[#1f2c34]"} rounded-[22px] px-3 py-2 max-w-[80%] text-[14.5px] relative shadow-sm`}><p className="pr-12">{m.text}</p><span className="absolute bottom-1.5 right-3 text-[11px] text-[#8696a0] flex items-center gap-0.5">{m.time}{m.me && <span className="text-[#53bdeb]">{I.check2}</span>}</span></div></div>
        ))}
        {img && <div className="flex justify-end"><img src={img} className="rounded-[22px] max-w-[80%] object-cover" /></div>}
      </div>
      <div className="px-3 pb-4 pt-1"><div className="flex gap-2 items-center rounded-full px-2 py-1.5" style={{ background: "rgba(31,44,52,0.7)", backdropFilter: "blur(20px)" }}><div className="w-9 h-9 rounded-full bg-[#1f2c34] flex items-center justify-center text-[#aebac1] text-xl">+</div><div className="flex-1 text-[15px] text-[#8696a0]">Message</div><div className="w-10 h-10 rounded-full bg-[#00a884] flex items-center justify-center shrink-0">{I.micWa}</div></div></div>
    </div>
  );
  if (im) return (
    <div className="bg-white text-black"><StatusBar dark={false} /><div className="px-4 py-2 text-center text-[12px] text-zinc-400">Text Message • RCS • Today 09:41</div>
      <div className="flex items-center gap-2 px-3 py-2" style={{ background: "rgba(255,255,255,0.7)", backdropFilter: "blur(20px)" }}>{I.back("#0a84ff")}<div className="flex-1 text-center"><div className="font-semibold text-[15px]">{name}</div><div className="text-[11px] text-zinc-400">3 people typing…</div></div><div className="w-[11px]" /></div>
      <div className="px-3 py-3 space-y-1.5 min-h-[420px] bg-white">{msgs.map((m: Msg, i: number) => (<div key={i} className={`flex ${m.me ? "justify-end" : "justify-start"}`}><div className={`${m.me ? "bg-[#0a84ff] text-white" : "bg-[#e9e9eb] text-black"} px-3.5 py-2 rounded-[22px] max-w-[75%] text-[16px]`}>{m.text}</div></div>))}
        <div className="bg-[#f2f2f7] rounded-2xl p-3 max-w-[85%]"><div className="font-semibold text-[14px]">Poll: Dinner tonight?</div><div className="mt-2 space-y-1.5 text-[13px]"><div className="bg-white rounded-lg px-2.5 py-1.5 border border-black/10">Pizza — 2 votes</div><div className="bg-white rounded-lg px-2.5 py-1.5 border border-black/10">Sushi — 1 vote</div></div></div>
        <div className="text-[11px] text-zinc-400 text-right font-medium">Delivered • Translated</div></div>
      <div className="p-3 flex gap-2 items-center"><div className="text-2xl text-zinc-400">+</div><div className="flex-1 rounded-full px-4 py-2 text-[15px] text-zinc-400" style={{ background: "rgba(242,242,247,0.8)", backdropFilter: "blur(20px)" }}>iMessage</div>{I.sendUp}</div>
    </div>
  );
  if (dc) return (
    <div className="bg-[#313338] text-zinc-100"><div className="px-4 py-3 font-bold border-b border-black/40 text-[15px]"># general</div>
      <div className="p-4 space-y-4 min-h-[430px]">{msgs.map((m: Msg, i: number) => (<div key={i} className="flex gap-3"><Avatar name={m.me ? "You" : name} size="w-10 h-10" img={m.me ? null : avatar} /><div><div className="text-[14px]"><b>{m.me ? "you" : name}</b> <span className="text-[11px] text-zinc-400">Today at {m.time}</span></div><p className="text-[15px] text-zinc-200">{m.text}</p></div></div>))}</div>
      <div className="p-3"><div className="bg-[#383a40] rounded-lg px-4 py-2.5 text-[14px] text-zinc-400">Message #general</div></div>
    </div>
  );
  if (tg) return (
    <div className="bg-[#7ea8c9]"><StatusBar notch={false} /><div className="px-3 py-2 bg-white flex gap-2 items-center"><Avatar name={name} img={avatar} /><div><div className="font-semibold text-[15px] text-black flex items-center gap-1">{name}{verified && <Verified size={13} />}</div><div className="text-[13px] text-[#3d9add]">online</div></div><div className="ml-auto text-[#3d9add]">{I.dots()}</div></div>
      <div className="p-3 space-y-1.5 min-h-[430px]">{msgs.map((m: Msg, i: number) => (<div key={i} className={`flex ${m.me ? "justify-end" : "justify-start"}`}><div className="bg-white text-black px-2.5 py-1.5 rounded-lg max-w-[80%] text-[15px] shadow-sm relative"><p className="pr-12">{m.text}</p><span className="absolute bottom-1 right-2 text-[11px] text-[#3d9add]">{m.time} ✓✓</span></div></div>))}</div>
      <div className="bg-white px-4 py-3 flex gap-3 items-center text-[#8a8a8e] text-[15px]">{I.clip} Message {I.micWa}</div>
    </div>
  );
  // ---- 2026 dedicated: X / TikTok / Snapchat / Signal / Slack / Reddit ----
  if (slug.includes("fake-x-messages")) return (
    <div className="bg-black text-white">
      <StatusBar /><div className="px-4 py-2.5 flex items-center gap-3"><Avatar name={name} img={avatar} /><div className="flex-1"><b className="text-[15px] flex items-center gap-1">{name}{verified && <Verified />}</b><div className="text-[13px] text-zinc-500">@{name.toLowerCase().replace(/ /g, "")}</div></div><span className="text-zinc-400">{I.dots()}</span></div>
      <div className="p-3.5 space-y-2 min-h-[430px] border-t border-white/10">
        <div className="text-center text-[12px] text-zinc-500">This is the beginning of your message history with @{name.toLowerCase().replace(/ /g, "")}</div>
        {msgs.map((m: Msg, i: number) => (<div key={i} className={`flex ${m.me ? "justify-end" : "justify-start"}`}><div className={`${m.me ? "bg-[#1d9bf0]" : "bg-[#2f3336]"} px-4 py-2.5 rounded-[20px] max-w-[80%] text-[15px]`}>{m.text}</div></div>))}
        {img && <div className="flex justify-end"><img src={img} className="rounded-[20px] max-w-[80%] object-cover" /></div>}
      </div>
      <div className="p-3 flex gap-2 items-center border-t border-white/10"><div className="flex-1 bg-[#202327] rounded-full px-4 py-2.5 text-[14px] text-zinc-500">Start a new message</div><span className="text-[#1d9bf0]">{I.sendUp}</span></div>
    </div>
  );
  if (slug.includes("tiktok-messages")) return (
    <div className="bg-white text-black">
      <StatusBar dark={false} notch={false} /><div className="px-3.5 py-2.5 flex items-center gap-2.5 border-b border-black/10">{I.back("#000")}<Avatar name={name} /><b className="text-[16px]">{name}</b><span className="ml-auto text-xl">⚑</span></div>
      <div className="p-3.5 space-y-2 min-h-[430px] bg-white">
        <div className="text-center text-[11px] text-zinc-400 bg-zinc-100 rounded-full px-3 py-1 w-fit mx-auto">Today</div>
        {msgs.map((m: Msg, i: number) => (<div key={i} className={`flex ${m.me ? "justify-end" : "justify-start"}`}><div className={`${m.me ? "bg-[#fe2c55] text-white" : "bg-[#f1f1f2] text-black"} px-3.5 py-2.5 rounded-[18px] max-w-[78%] text-[15px]`}>{m.text}</div></div>))}
        {img && <div className="flex justify-end"><img src={img} className="rounded-[18px] max-w-[78%] object-cover" /></div>}
      </div>
      <div className="p-3 flex gap-2 items-center border-t border-black/10"><div className="flex-1 bg-[#f1f1f2] rounded-full px-4 py-2.5 text-[14px] text-zinc-500">Send message…</div><div className="w-9 h-9 rounded-full bg-[#fe2c55] text-white flex items-center justify-center font-bold">↑</div></div>
    </div>
  );
  if (slug.includes("snapchat")) return (
    <div className="bg-white text-black">
      <StatusBar dark={false} notch={false} /><div className="px-3.5 py-2.5 flex items-center gap-2.5 bg-[#fffc00]">{I.back("#000")}<Avatar name={name} /><div className="flex-1 leading-tight"><b className="text-[16px]">{name}</b><div className="text-[12px] flex items-center gap-1">🔥 128 streak • Best friends</div></div></div>
      <div className="p-3.5 space-y-2.5 min-h-[420px]">
        {msgs.map((m: Msg, i: number) => (<div key={i} className={`flex ${m.me ? "justify-end" : "justify-start"}`}><div className={`${m.me ? "bg-[#fffc00]" : "bg-[#f0f0f0]"} px-3.5 py-2 rounded-[18px] max-w-[78%] text-[15px] border ${m.me ? "border-black/10" : "border-black/5"}`}>{m.text}</div></div>))}
        <div className="border border-dashed border-black/20 rounded-2xl p-3 text-center text-[13px] text-zinc-500">Saved in chat • Screenshots notify</div>
        {img && <div className="flex justify-end"><img src={img} className="rounded-[18px] max-w-[78%] object-cover border border-black/10" /></div>}
      </div>
      <div className="p-3 flex gap-2 items-center border-t border-black/10"><div className="flex-1 border border-black/15 rounded-full px-4 py-2.5 text-[14px] text-zinc-400">Send a chat</div></div>
    </div>
  );
  if (slug.includes("signal")) return (
    <div className="bg-white text-black">
      <StatusBar dark={false} notch={false} /><div className="px-3.5 py-2.5 flex items-center gap-2.5 bg-[#3a76f0] text-white">{I.back("#fff")}<Avatar name={name} /><div className="flex-1 leading-tight"><b className="text-[16px]">{name}</b><div className="text-[12px] opacity-80">Active now • Disappearing: 1 week</div></div></div>
      <div className="p-3.5 space-y-2 min-h-[430px] bg-[#e9e9eb]/40">
        <div className="text-center text-[11px] text-zinc-500 bg-white rounded-lg px-3 py-1.5 w-fit mx-auto shadow-sm">🔒 End-to-end encrypted • Safety numbers verified</div>
        {msgs.map((m: Msg, i: number) => (<div key={i} className={`flex ${m.me ? "justify-end" : "justify-start"}`}><div className={`${m.me ? "bg-[#3a76f0] text-white" : "bg-white text-black shadow-sm"} px-3.5 py-2.5 rounded-[18px] max-w-[78%] text-[15px]`}>{m.text}<span className="text-[10px] opacity-60 ml-1.5">{m.time}</span></div></div>))}
        {img && <div className="flex justify-end"><img src={img} className="rounded-[18px] max-w-[78%] object-cover" /></div>}
      </div>
      <div className="p-3 bg-white flex gap-2 items-center"><div className="flex-1 bg-zinc-100 rounded-full px-4 py-2.5 text-[14px] text-zinc-500">Signal message</div></div>
    </div>
  );
  if (slug.includes("slack")) return (
    <div className="bg-white text-black">
      <div className="px-4 py-3 bg-[#3f0e40] text-white flex items-center gap-2"><b className="text-[16px]">{name}&apos;s workspace ▾</b><span className="ml-auto w-8 h-8 rounded-lg bg-white/20" /></div>
      <div className="px-4 py-2 border-b border-black/10 font-bold text-[15px]"># general <span className="font-normal text-zinc-500 text-[13px]">• 248 members</span></div>
      <div className="p-4 space-y-4 min-h-[400px]">
        {msgs.map((m: Msg, i: number) => (<div key={i} className="flex gap-2.5"><Avatar name={m.me ? "You" : name} size="w-9 h-9" /><div><div className="text-[14px]"><b>{m.me ? "You" : name}</b> <span className="text-[12px] text-zinc-500">{m.time}</span></div><p className="text-[15px]">{m.text}</p><div className="text-[13px] text-zinc-500 mt-0.5">💬 3 replies • 👍 5</div></div></div>))}
      </div>
      <div className="p-3 border border-black/15 rounded-xl m-3 text-[14px] text-zinc-400">Message #general • **bold** supported</div>
    </div>
  );
  if (slug.includes("reddit") && slug.includes("message") && !slug.includes("comment")) return (
    <div className="bg-white text-black">
      <StatusBar dark={false} notch={false} /><div className="px-3.5 py-2.5 flex items-center gap-2.5 border-b border-black/10"><Avatar name={name} /><div className="flex-1 leading-tight"><b className="text-[15px]">u/{name.toLowerCase().replace(/ /g, "")}</b><div className="text-[12px] text-green-600">● Online now</div></div></div>
      <div className="p-3.5 space-y-2 min-h-[430px] bg-[#f6f7f8]">
        {msgs.map((m: Msg, i: number) => (<div key={i} className={`flex ${m.me ? "justify-end" : "justify-start"}`}><div className={`${m.me ? "bg-[#0079d3] text-white" : "bg-white text-black shadow-sm"} px-3.5 py-2.5 rounded-[18px] max-w-[78%] text-[15px]`}>{m.text}</div></div>))}
      </div>
      <div className="p-3 bg-white flex gap-2 items-center"><div className="flex-1 bg-[#f6f7f8] rounded-full px-4 py-2.5 text-[14px] text-zinc-500">Message</div></div>
    </div>
  );
  // Per-app branded fallback — every remaining chat gets its own real colors
  const APP: Record<string, { bg: string; head: string; sub: string; me: string; them: string; tc: string; tmc: string; label: string }> = {
    bumble: { bg: "#fff", head: "#fff", sub: "Match • Active", me: "#ffc800", them: "#f5f5f5", tc: "#000", tmc: "#000", label: "Bumble" },
    tinder: { bg: "#fff", head: "#fff", sub: "Recently Active", me: "#fd267d", them: "#f0f2f4", tc: "#fff", tmc: "#111", label: "Tinder" },
    signal: { bg: "#fff", head: "#3a76f0", sub: "Signal • online", me: "#3a76f0", them: "#e9e9eb", tc: "#fff", tmc: "#111", label: "Signal" },
    slack: { bg: "#fff", head: "#3f0e40", sub: "#general", me: "#e8f5e9", them: "#fff", tc: "#111", tmc: "#111", label: "Slack" },
    snapchat: { bg: "#fff", head: "#fffc00", sub: "Chat", me: "#fffc00", them: "#f0f0f0", tc: "#000", tmc: "#000", label: "Snapchat" },
    line: { bg: "#849ebf", head: "#06c755", sub: "LINE", me: "#06c755", them: "#fff", tc: "#fff", tmc: "#111", label: "LINE" },
    linkedin: { bg: "#f4f2ee", head: "#fff", sub: "LinkedIn • Active", me: "#0a66c2", them: "#fff", tc: "#fff", tmc: "#111", label: "LinkedIn" },
    reddit: { bg: "#dae0e6", head: "#fff", sub: "u/chat • online", me: "#0079d3", them: "#fff", tc: "#fff", tmc: "#111", label: "Reddit" },
    wechat: { bg: "#ededed", head: "#ededed", sub: "WeChat", me: "#95ec69", them: "#fff", tc: "#000", tmc: "#000", label: "WeChat" },
    x: { bg: "#000", head: "#000", sub: "@handle", me: "#1d9bf0", them: "#2f3336", tc: "#fff", tmc: "#fff", label: "X" },
    tiktok: { bg: "#000", head: "#000", sub: "TikTok • online", me: "#fe2c55", them: "#161823", tc: "#fff", tmc: "#fff", label: "TikTok" },
    bluesky: { bg: "#fff", head: "#fff", sub: "Bluesky", me: "#0085ff", them: "#f0f3f5", tc: "#fff", tmc: "#111", label: "Bluesky" },
    onlyfans: { bg: "#fff", head: "#fff", sub: "OnlyFans", me: "#00aff0", them: "#f2f2f2", tc: "#fff", tmc: "#111", label: "OnlyFans" },
    msn: { bg: "#d7e8f7", head: "#0a246a", sub: "MSN • online", me: "#fff", them: "#fff", tc: "#000", tmc: "#000", label: "MSN" },
    microsoftteams: { bg: "#f5f5f5", head: "#4b53bc", sub: "Teams Chat", me: "#4b53bc", them: "#fff", tc: "#fff", tmc: "#111", label: "Teams" },
  };
  const key = Object.keys(APP).find((k) => slug.includes(k)) ?? "";
  if (key) {
    const a = APP[key];
    return (
      <div style={{ background: a.bg, color: a.bg === "#fff" || a.bg === "#ededed" || a.bg === "#dae0e6" || a.bg === "#f4f2ee" || a.bg === "#d7e8f7" || a.bg === "#f5f5f5" ? "#111" : "#fff" }}>
        <StatusBar dark={!(a.bg === "#fff" || a.bg === "#ededed" || a.bg === "#f4f2ee")} notch={false} />
        <div style={{ background: a.head }} className="px-3.5 py-2.5 flex gap-2.5 items-center border-b border-black/10">
          <Avatar name={name} img={avatar} /><div className="flex-1 leading-tight"><div className="font-semibold text-[15px] flex items-center gap-1">{name}{verified && <Verified size={13} />}</div><div className="text-[12px] opacity-60">{a.sub}</div></div>
          <div className="flex gap-3 opacity-70">{I.phone("#888")}{I.video("#888")}</div>
        </div>
        <div className="p-3 space-y-2 min-h-[430px]">
          <div className="text-center text-[11px] opacity-50">Today {a.label} • end-to-end encrypted</div>
          {msgs.map((m: Msg, i: number) => (
            <div key={i} className={`flex items-end gap-1.5 ${m.me ? "justify-end" : "justify-start"}`}>
              {!m.me && <Avatar name={name} size="w-7 h-7" img={avatar} />}
              <div style={{ background: m.me ? a.me : a.them, color: m.me ? a.tc : a.tmc }} className="px-3 py-2 rounded-2xl max-w-[75%] text-[14.5px] shadow-sm">{m.text}<span className="text-[10px] opacity-60 ml-1.5">{m.time}</span></div>
            </div>))}
          {img && <div className="flex justify-end"><img src={img} className="rounded-2xl max-w-[70%] object-cover" /></div>}
        </div>
        <div className="px-3.5 py-3 flex items-center gap-2.5 border-t border-black/10"><div className="flex-1 rounded-full px-4 py-2 text-[14px] border border-black/10 opacity-60">Message {name}...</div>{I.sendUp}</div>
      </div>
    );
  }
  return (
    <div style={{ background: dark ? "#000" : "#fff", color: dark ? "#fff" : "#111" }}><StatusBar dark={dark} /><div className="px-4 py-2.5 font-semibold flex gap-2 items-center border-b border-white/10"><Avatar name={name} />{name}</div>
      <div className="p-3 space-y-2 min-h-[430px]">{msgs.map((m: Msg, i: number) => (<div key={i} className={`flex ${m.me ? "justify-end" : "justify-start"}`}><div style={{ background: m.me ? self : other, color: "#fff" }} className="px-3 py-2 rounded-2xl max-w-[75%] text-[14px]">{m.text}</div></div>))}</div>
    </div>
  );
}

function AIView({ slug, msgs }: any) {
  const isClaude = slug.includes("claude"), isGem = slug.includes("gemini"), isGrok = slug.includes("grok"), isPerp = slug.includes("perplexity");
  // Gemini 2026 — Neural Expressive, blue-white gradient, floating Ask pill
  if (isGem) return (
    <div className="bg-white text-[#1f1f1f]" style={{ background: "linear-gradient(180deg,#fff 60%,#e8f0fe 100%)" }}>
      <div className="px-4 py-3 flex items-center gap-2"><span className="text-[15px] font-medium">Gemini <span className="text-zinc-400">▾</span></span><span className="ml-auto text-[11px] bg-[#e8f0fe] text-[#0b57d0] font-semibold px-2.5 py-1 rounded-full">3.5 Flash</span></div>
      <div className="px-4 pt-6 pb-2"><div className="text-[26px] font-medium" style={{ background: "linear-gradient(90deg,#0b57d0,#9b72cb,#d96570)", WebkitBackgroundClip: "text", color: "transparent" }}>Hello, {`there`}</div></div>
      <div className="p-4 space-y-4 min-h-[340px]">
        {msgs.map((m: Msg, i: number) => m.me ? (
          <div key={i} className="flex justify-end"><div className="bg-[#e9eef6] px-4 py-2.5 rounded-[20px] max-w-[85%] text-[15px]">{m.text}</div></div>
        ) : (
          <div key={i} className="text-[15px] leading-relaxed"><span className="font-bold">Key answer: </span>{m.text}<div className="mt-2 h-20 rounded-2xl bg-gradient-to-r from-[#e8f0fe] via-[#f3e8fd] to-[#fce8e6]" /></div>
        ))}
      </div>
      <div className="p-3"><div className="rounded-full border border-black/10 bg-white shadow-lg px-4 py-3 text-[14px] text-zinc-400 flex items-center gap-2">+ Ask Gemini<span className="ml-auto flex gap-2"><span className="w-8 h-8 rounded-full bg-[#e8f0fe] flex items-center justify-center">🎙</span><span className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center">✦</span></span></div></div>
    </div>
  );
  // Claude 2026 — warm cream + coral, sessions sidebar feel
  if (isClaude) return (
    <div className="bg-[#f0eee6] text-[#2b2620]">
      <div className="px-4 py-3 flex items-center gap-2 border-b border-black/10"><div className="w-6 h-6 rounded-md bg-[#d97757] text-white text-[13px] flex items-center justify-center font-bold">✳</div><b className="text-[15px]">Claude</b><span className="text-[12px] text-zinc-500">Sonnet 5 ▾</span></div>
      <div className="p-4 space-y-5 min-h-[420px]">
        {msgs.map((m: Msg, i: number) => m.me ? (
          <div key={i} className="bg-white rounded-2xl px-4 py-3 text-[15px] shadow-sm ml-8">{m.text}</div>
        ) : (
          <div key={i} className="flex gap-2.5"><div className="w-7 h-7 rounded-md bg-[#d97757] text-white text-[12px] flex items-center justify-center shrink-0 font-bold">✳</div><p className="text-[15px] leading-relaxed">{m.text}</p></div>
        ))}
      </div>
      <div className="p-3"><div className="bg-white border border-black/10 rounded-2xl px-4 py-3 text-[14px] text-zinc-400 shadow-sm">Reply to Claude…</div></div>
    </div>
  );
  // Grok 2026 — black + 𝕏
  if (isGrok) return (
    <div className="bg-black text-white">
      <div className="px-4 py-3 flex items-center gap-2 border-b border-white/10"><b className="text-[17px]">𝕏 Grok</b><span className="text-[11px] bg-white/10 px-2 py-0.5 rounded-full">4.6</span><span className="ml-auto text-[12px] text-zinc-400">Fun mode</span></div>
      <div className="p-4 space-y-4 min-h-[430px]">
        {msgs.map((m: Msg, i: number) => m.me ? (
          <div key={i} className="flex justify-end"><div className="bg-[#1d9bf0] px-4 py-2.5 rounded-[20px] max-w-[85%] text-[15px]">{m.text}</div></div>
        ) : (
          <div key={i} className="flex gap-2.5"><div className="w-7 h-7 rounded-full bg-white text-black text-[13px] flex items-center justify-center shrink-0 font-bold">𝕏</div><p className="text-[15px] leading-relaxed text-zinc-100">{m.text}</p></div>
        ))}
      </div>
      <div className="p-3"><div className="bg-[#202327] rounded-full px-4 py-3 text-[14px] text-zinc-500">Ask anything…</div></div>
    </div>
  );
  // Perplexity 2026 — white + sources
  if (isPerp) return (
    <div className="bg-white text-[#0f172a]">
      <div className="px-4 py-3 flex items-center gap-2 border-b border-black/10"><div className="w-6 h-6 rounded-md bg-[#0f172a] text-white text-[11px] flex items-center justify-center font-bold">P</div><b className="text-[15px]">Perplexity</b><span className="text-[12px] text-zinc-400">Pro</span></div>
      <div className="p-4 space-y-4 min-h-[430px]">
        {msgs.map((m: Msg, i: number) => m.me ? (
          <div key={i} className="text-[16px] font-semibold">{m.text}</div>
        ) : (
          <div key={i}><div className="flex gap-1.5 mb-2">{[1, 2, 3].map((s) => (<span key={s} className="text-[11px] bg-zinc-100 border border-black/10 rounded-full px-2 py-0.5">[{s}] source</span>))}</div><p className="text-[15px] leading-relaxed">{m.text}</p></div>
        ))}
      </div>
      <div className="p-3"><div className="border border-black/15 rounded-full px-4 py-3 text-[14px] text-zinc-400">Ask anything…</div></div>
    </div>
  );
  // ChatGPT 2026 — GPT-5.5 Instant default, sidebar + model pill
  return (
    <div className="bg-[#212121] text-zinc-100">
      <div className="px-4 py-3 flex items-center gap-2 border-b border-white/10"><span className="text-lg">☰</span><b className="text-[15px]">ChatGPT</b><span className="text-[12px] text-zinc-400">5.5 Instant ▾</span><span className="ml-auto text-[11px] border border-white/20 rounded-full px-2 py-0.5">Plus</span></div>
      <div className="p-4 space-y-5 min-h-[430px]">
        {msgs.map((m: Msg, i: number) => m.me ? (
          <div key={i} className="flex justify-end"><div className="bg-[#2f2f2f] px-4 py-2.5 rounded-[20px] max-w-[85%] text-[15px]">{m.text}</div></div>
        ) : (
          <div key={i} className="flex gap-2.5"><div className="w-7 h-7 rounded-full bg-white text-black text-[12px] flex items-center justify-center shrink-0 font-bold">✦</div><p className="text-[15px] leading-relaxed">{m.text}</p></div>
        ))}
      </div>
      <div className="p-3"><div className="bg-[#2f2f2f] rounded-full px-4 py-3 text-[14px] text-zinc-400 flex items-center gap-2">+ Message ChatGPT<span className="ml-auto">🎙</span></div></div>
    </div>
  );
}

function PostView({ slug, name, msgs, img, avatar, verified }: any) {
  const x = slug.includes("-x-");
  const txt = msgs[0]?.text || "Just figuring out Mockly!";
  const uname = name.toLowerCase().replace(/ /g, "");
  const Pic = ({ h = "h-48" }: { h?: string }) => img ? <img src={img} className={`${h} w-full mt-2.5 rounded-2xl object-cover`} /> : <div className={`${h} mt-2.5 rounded-2xl bg-[#1d1d1f]`} />;
  if (x) return (<div className="bg-black text-white p-4"><div className="flex gap-2.5"><Avatar name={name} size="w-10 h-10" img={avatar} /><div className="flex-1"><div className="flex items-center gap-1"><b className="text-[15px]">{name}</b>{verified && <Verified />}<span className="text-zinc-500 text-[14px]"> @{uname} · 2h</span></div><p className="text-[15px] mt-0.5">{txt}</p><Pic /><div className="flex justify-between text-zinc-500 mt-3 max-w-[300px]"><span className="flex items-center gap-1">{I.comment}<span className="text-[13px]">342</span></span><span className="flex items-center gap-1">{I.repost}<span className="text-[13px]">1.2K</span></span><span className="flex items-center gap-1">{I.heart()}<span className="text-[13px]">12K</span></span><span className="flex items-center gap-1">{I.chart}<span className="text-[13px]">2M</span></span></div></div></div></div>);
  if (slug.includes("instagram-post")) return (
    <div className="bg-white text-black">
      <div className="flex items-center gap-2.5 px-3 py-2.5"><div className="p-[2px] rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600"><div className="w-9 h-9 rounded-full bg-white p-[2px] overflow-hidden">{avatar ? <img src={avatar} className="w-full h-full rounded-full object-cover" /> : <div className="w-full h-full rounded-full bg-[#e4e6eb] flex items-center justify-center font-bold text-zinc-500">{name[0]}</div>}</div></div>
      <b className="text-[14px] flex items-center gap-1">{uname}{verified && <Verified size={13} />} <span className="text-zinc-400 font-normal">• 2h</span></b><span className="ml-auto text-lg tracking-widest">···</span></div>
      <div className="aspect-square bg-[#efefef] flex items-center justify-center"><div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-300" /></div>
      <div className="flex items-center gap-4 px-3 pt-2.5">{I.heart()}<span className="[&>svg]:w-[22px]">{I.comment}</span><span>{I.share}</span><span className="ml-auto text-xl">▢</span></div>
      <div className="px-3 pt-1.5 pb-3 text-[14px]"><b>12,483 likes</b><div><b>{uname}</b> {txt}</div><div className="text-zinc-500">View all 342 comments</div></div>
    </div>);
  if (slug.includes("threads")) return (
    <div className="bg-white text-black p-4"><div className="flex gap-2.5"><Avatar name={name} size="w-10 h-10" img={avatar} /><div className="flex-1"><div className="flex items-center gap-1"><b className="text-[15px]">{name}</b>{verified && <Verified size={13} />}<span className="text-zinc-500 text-[14px]">@{uname} · 2h</span><span className="ml-auto">···</span></div><p className="text-[15px] mt-0.5">{txt}</p><div className="flex gap-4 mt-2.5 text-[22px] text-black"><span>{I.heart()}</span><span>{I.comment}</span><span>{I.repost}</span><span>{I.share}</span></div><div className="text-[13px] text-zinc-500 mt-1.5">342 replies · 12K likes</div></div></div></div>);
  if (slug.includes("linkedin")) return (
    <div className="bg-[#f4f2ee] p-2.5"><div className="bg-white rounded-lg p-3 text-[#191919]">
      <div className="flex gap-2"><Avatar name={name} size="w-12 h-12" img={avatar} /><div><b className="text-[15px] flex items-center gap-1">{name}{verified && <Verified size={13} />}</b><div className="text-[12px] text-zinc-500">Product Manager @ Tech • 2h</div></div><span className="ml-auto">···</span></div>
      <p className="text-[14px] mt-2">{txt}</p>
      <div className="h-44 mt-2 rounded bg-[#e4e6eb]" />
      <div className="flex justify-between text-[13px] text-zinc-500 py-2"><span className="flex items-center gap-1"><span className="w-4 h-4 rounded-full bg-[#0a66c2] text-white text-[10px] flex items-center justify-center">✓</span><span className="w-4 h-4 rounded-full bg-[#cc1016] text-white text-[10px] flex items-center justify-center">♥</span> 1,240</span><span>180 comments · 45 reposts</span></div>
      <div className="flex justify-around border-t border-black/10 pt-2 text-[13px] font-semibold text-zinc-600"><span className="flex items-center gap-1.5">{I.thumbUp} Like</span><span className="flex items-center gap-1.5">{I.comment} Comment</span><span className="flex items-center gap-1.5">{I.repost} Repost</span><span className="flex items-center gap-1.5">{I.share} Send</span></div>
    </div></div>);
  if (slug.includes("tiktok-post")) return (
    <div className="bg-black text-white"><div className="aspect-[9/12] bg-[#161823] relative flex items-end"><div className="absolute right-2 bottom-20 space-y-4 text-center text-[11px]"><div><div className="w-11 h-11 rounded-full mx-auto overflow-hidden">{avatar ? <img src={avatar} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-zinc-600" />}</div>+</div><div>{I.heart("none", "#fff")}<br />245K</div><div>{I.comment}<br />3.2K</div><div>{I.share}<br />Share</div></div><div className="p-3"><b className="flex items-center gap-1">@{uname}{verified && <Verified size={13} />}</b><p className="text-[14px] mt-1">{txt}</p><div className="text-[13px] mt-1">♫ original sound - {uname}</div></div></div></div>);
  if (slug.includes("bluesky")) return (
    <div className="bg-white text-black p-4"><div className="flex gap-2.5"><Avatar name={name} size="w-11 h-11" img={avatar} /><div><b className="text-[15px] flex items-center gap-1">{name}{verified && <Verified size={13} />}</b><div className="text-[14px] text-zinc-500">@{uname}.bsky.social · 2h</div><p className="text-[15px] mt-1">{txt}</p><div className="flex justify-between max-w-[280px] mt-2.5 text-zinc-500"><span className="flex items-center gap-1 text-[13px]">{I.comment} 45</span><span className="flex items-center gap-1 text-[13px]">{I.repost} 120</span><span className="flex items-center gap-1 text-[13px]">{I.heart()} 890</span></div></div></div></div>);
  if (slug.includes("pinterest")) return (
    <div className="bg-white text-black p-3"><div className="rounded-2xl overflow-hidden"><div className="h-72 bg-gradient-to-b from-red-100 to-red-300" /></div><div className="flex items-center gap-2 mt-2.5"><Avatar name={name} size="w-8 h-8" img={avatar} /><b className="text-[14px] flex items-center gap-1">{name}{verified && <Verified size={12} />}</b><span className="ml-auto bg-[#e60023] text-white text-[14px] font-semibold px-4 py-2 rounded-full">Save</span></div><div className="font-semibold text-[15px] mt-2">{txt}</div><div className="text-[13px] text-zinc-500">1.2k saves · 45 comments</div></div>);
  return (<div className="bg-white text-[#050505] font-[Helvetica,Arial,sans-serif]">
    <div className="flex gap-2.5 px-3 pt-3 items-start">
      {avatar ? <img src={avatar} className="w-10 h-10 rounded-full object-cover shrink-0" alt="" /> : <div className="w-10 h-10 rounded-full bg-[#d8dadf] flex items-center justify-center font-bold text-zinc-600 shrink-0">{name[0]?.toUpperCase()}</div>}
      <div className="leading-tight flex-1">
        <div className="flex items-center gap-1"><b className="text-[15px] font-semibold">{name}</b>{verified ? <Verified size={14} /> : <svg width="14" height="14" viewBox="0 0 24 24" fill="#0084ff"><circle cx="12" cy="12" r="10"/><path d="M10 14.5l-2.5-2.5 1.4-1.4 1.1 1.1 4.1-4.1 1.4 1.4z" fill="#fff"/></svg>}</div>
        <div className="text-[13px] text-[#65676b] flex items-center gap-1">2 hrs · <svg width="13" height="13" viewBox="0 0 24 24" fill="#65676b"><circle cx="12" cy="12" r="9" fill="none" stroke="#65676b" strokeWidth="1.8"/><path d="M3 12h18M12 3c3 3.5 3 14 0 18M12 3c-3 3.5-3 14 0 18" stroke="#65676b" strokeWidth="1.5" fill="none"/></svg></div>
      </div>
      <div className="flex items-center gap-4 text-[#65676b] pr-1"><span className="text-xl leading-none">···</span><span className="text-xl leading-none">✕</span></div>
    </div>
    <p className="px-3 pt-2 pb-2.5 text-[15px] leading-[1.35]">{msgs[0]?.text || "Just figuring out Mockly!"}</p>
    <div className="bg-[#e4e6eb] h-[300px] w-full flex items-center justify-center overflow-hidden"><div className="w-full h-full bg-gradient-to-br from-slate-200 to-slate-300" /></div>
    <div className="flex justify-between items-center px-3 py-2.5 text-[14px] text-[#65676b]">
      <span className="flex items-center gap-1.5"><span className="flex -space-x-1"><span className="w-[18px] h-[18px] rounded-full bg-[#0084ff] border-2 border-white flex items-center justify-center"><svg width="10" height="10" viewBox="0 0 24 24" fill="#fff"><path d="M7 11v9H4a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1h3zm2 9h8.6a2 2 0 0 0 2-1.6l1.4-6A2 2 0 0 0 19 10h-5l1-4.6a1.5 1.5 0 0 0-2.9-.7L9 11z"/></svg></span><span className="w-[18px] h-[18px] rounded-full bg-[#ff3040] border-2 border-white flex items-center justify-center"><svg width="10" height="10" viewBox="0 0 24 24" fill="#fff"><path d="M12 21C7 16.5 3 13 3 8.8A4.8 4.8 0 0 1 7.8 4c1.7 0 3.2.9 4.2 2.3A4.8 4.8 0 0 1 16.2 4 4.8 4.8 0 0 1 21 8.8c0 4.2-4 7.7-9 12.2z"/></svg></span></span> 4.2K</span>
      <span>380 comments · 120 shares</span>
    </div>
    <div className="mx-3 border-t border-black/10" />
    <div className="flex justify-around py-1.5 text-[14px] font-semibold text-[#65676b]">
      <span className="flex items-center gap-2 py-1.5 px-4">{I.thumbUp} Like</span>
      <span className="flex items-center gap-2 py-1.5 px-4">{I.comment} Comment</span>
      <span className="flex items-center gap-2 py-1.5 px-4">{I.share} Share</span>
    </div>
  </div>);
}

function CommentsView({ slug, msgs }: any) {
  const yt = slug.includes("youtube");
  if (slug.includes("reddit")) return (<div className="bg-[#dae0e6] p-3"><div className="bg-white rounded p-3 text-[14px]"><b>r/funny • Posted by u/op • 5h ago</b><p className="mt-1">This is the post title here</p></div><div className="space-y-2 mt-2">{msgs.map((m: Msg, i: number) => (<div key={i} className="bg-white rounded p-3 flex gap-2"><div className="flex flex-col items-center text-zinc-400 text-xs">▲<b className="text-black">{120 + i * 37}</b>▼</div><div><div className="text-[12px] text-zinc-500">u/user{i} • {i + 2}h ago</div><p className="text-[14px]">{m.text}</p><div className="text-[12px] text-zinc-500 mt-1 font-semibold">Reply Share Award</div></div></div>))}</div></div>);
  if (slug.includes("instagram-comments") || slug.includes("threads-comments")) return (<div className="bg-white text-black p-4"><div className="space-y-4">{msgs.map((m: Msg, i: number) => (<div key={i} className="flex gap-2.5"><Avatar name={"u" + i} size="w-9 h-9" /><div className="flex-1 text-[14px]"><b>user{i}</b> {m.text}<div className="text-[12px] text-zinc-500 mt-1 flex gap-3">2h <span>Reply</span></div></div><div className="text-zinc-300">{I.heart()}</div></div>))}</div></div>);
  if (slug.includes("x-comments")) return (<div className="bg-black text-white p-4 space-y-4">{msgs.map((m: Msg, i: number) => (<div key={i} className="flex gap-2.5 border-b border-white/10 pb-3"><Avatar name={"u" + i} size="w-9 h-9" /><div><div className="text-[14px]"><b>User{i}</b> <span className="text-zinc-500">@user{i} · 2h</span></div><p className="text-[15px]">{m.text}</p><div className="flex gap-6 text-zinc-500 text-[13px] mt-2"><span className="flex items-center gap-1">{I.comment} 12</span><span className="flex items-center gap-1">{I.repost} 4</span><span className="flex items-center gap-1">{I.heart()} 89</span></div></div></div>))}</div>);
  if (slug.includes("facebook-comments")) return (<div className="bg-white text-black p-4 space-y-4">{msgs.map((m: Msg, i: number) => (<div key={i} className="flex gap-2.5"><Avatar name={"u" + i} size="w-9 h-9" /><div className="flex-1"><div className="bg-[#f0f2f5] rounded-2xl px-3 py-2"><b className="text-[13px]">User {i}</b><p className="text-[14px]">{m.text}</p></div><div className="text-[12px] text-zinc-500 mt-1 ml-3 flex gap-3 font-semibold"><span>Like</span><span>Reply</span><span>2h</span></div></div></div>))}</div>);
  if (slug.includes("linkedin-comments")) return (<div className="bg-[#f4f2ee] p-3 space-y-2">{msgs.map((m: Msg, i: number) => (<div key={i} className="bg-white rounded-lg p-3 flex gap-2.5"><Avatar name={"u" + i} size="w-11 h-11" /><div><b className="text-[14px]">Professional {i}</b><div className="text-[12px] text-zinc-500">CEO @ Company • 2h</div><p className="text-[14px] mt-1">{m.text}</p><div className="text-[13px] text-zinc-500 mt-1.5 font-semibold">Like • 💬 {5 + i} • Repost</div></div></div>))}</div>);
  if (slug.includes("tiktok-comments")) return (<div className="bg-white text-black p-4"><div className="font-bold text-[15px] mb-1">{(320 + msgs.length * 17)} comments</div><div className="space-y-4 mt-3">{msgs.map((m: Msg, i: number) => (<div key={i} className="flex gap-2.5"><Avatar name={"u" + i} size="w-10 h-10" /><div className="flex-1"><b className="text-[14px]">user{i} • 2h</b><p className="text-[14px]">{m.text}</p><div className="text-[12px] text-zinc-500 mt-1 flex gap-4"><span>Reply</span><span>View replies ({3 + i})</span></div></div><div className="text-center text-zinc-400 text-[11px]">{I.heart()}<br />{120 + i * 37}</div></div>))}</div></div>);
  if (slug.includes("threads-comments")) return (<div className="bg-white text-black p-4 space-y-4">{msgs.map((m: Msg, i: number) => (<div key={i} className="flex gap-2.5"><Avatar name={"u" + i} size="w-9 h-9" /><div className="flex-1 text-[14px]"><b>user{i}</b> <span className="text-zinc-500">2h</span><p>{m.text}</p><div className="flex gap-4 mt-1.5 text-zinc-500"><span>{I.heart()}</span><span>{I.comment}</span><span>{I.repost}</span></div></div></div>))}</div>);
  return (<div className={yt ? "bg-[#0f0f0f] text-white p-4" : "bg-white text-black p-4"}>
    {yt && <div><div className="h-44 rounded-xl bg-gradient-to-br from-[#212121] to-black mb-2 flex items-center justify-center relative">{I.play}<span className="absolute bottom-2 right-2 bg-black text-white text-[11px] px-1.5 py-0.5 rounded">12:48</span></div><div className="font-bold text-[14px]">I Tested 2026's Best Fake Apps…</div><div className="text-[12px] opacity-60 mb-3">2.1M views • 3 days ago</div></div>}
    <div className="font-bold mb-3 text-[14px] flex items-center gap-4">{msgs.length} Comments <span className="font-normal opacity-60">Sort by</span></div>
    <div className="space-y-4">{msgs.map((m: Msg, i: number) => (<div key={i} className="flex gap-2.5"><Avatar name={"u" + i} size="w-8 h-8" /><div><div className="text-[12px] opacity-60">@user{i} · 3h ago</div><p className="text-[14px] mt-0.5">{m.text}</p><div className="flex items-center gap-2 text-[12px] opacity-60 mt-1.5">{I.thumbUp} {120 + i * 37} {I.reply} Reply</div></div></div>))}</div>
  </div>);
}

function StoryView({ name, msgs, slug }: any) {
  const snap = (slug || "").includes("snapchat");
  if (snap) return (<div className="relative h-[600px] bg-black text-white"><div className="h-[420px] bg-[#2a2a2a] flex items-center justify-center text-center px-6 text-[20px] font-semibold">{msgs[0]?.text}</div><div className="flex items-center gap-2 px-3 py-2.5"><Avatar name={name} size="w-9 h-9" /><b className="text-[14px]">{name}</b><span className="text-[12px] opacity-60">• 2h ago</span></div><div className="border-t border-white/10 flex justify-around py-3 text-[13px]"><span>Chat</span><span>Story</span></div></div>);
  return (<div className="relative h-[600px] bg-gradient-to-b from-[#4a3aff] via-[#b04ac8] to-[#ff8a5c] text-white"><div className="flex gap-1 p-2.5">{[0, 1, 2, 3].map((i) => (<div key={i} className="h-[2.5px] flex-1 bg-white/30 rounded-full"><div className={`h-full rounded-full ${i === 0 ? "w-full bg-white" : ""}`} /></div>))}</div><div className="flex items-center gap-2 px-3"><div className="p-[2px] rounded-full bg-white/80"><Avatar name={name} size="w-8 h-8" /></div><b className="text-[14px]">{name}</b><span className="text-[13px] opacity-70">2h • 📍 Dhaka</span><span className="ml-auto">{I.x}</span></div><p className="absolute bottom-28 w-full text-center text-[24px] font-bold px-6 drop-shadow-lg">{msgs[0]?.text}</p><div className="absolute bottom-4 w-full px-4 flex items-center gap-3"><div className="flex-1 border border-white rounded-full py-2.5 px-4 text-[14px]">Send message</div><span className="text-white">{I.heart("none", "#fff")}</span><span>{I.share}</span></div></div>);
}

function EmailView({ slug, name, msgs }: any) {
  if (slug.includes("apple")) return (<div className="bg-white text-black"><div className="px-4 py-3 border-b border-black/10 flex items-center gap-2"><span className="text-[#007aff]">‹ Mailboxes</span><b className="mx-auto">Inbox</b></div><div className="p-4"><b className="text-[17px]">{name}</b><div className="text-[13px] text-zinc-500">Today 09:41 • To: me</div><div className="text-[16px] font-semibold mt-2">Meeting confirmed — let's catch up!</div><p className="text-[15px] mt-2">{msgs.map((m: Msg) => m.text).join(" ")}</p></div></div>);
  if (slug.includes("leaked")) return (<div className="bg-[#1a1a1a] text-white p-5"><div className="bg-red-600 text-[12px] font-bold inline-block px-2 py-0.5 rounded">LEAKED</div><div className="font-bold mt-2">From: <span className="bg-black px-2">████████</span></div><div className="text-sm text-zinc-400">To: <span className="bg-black px-2">████████</span></div><p className="text-[14px] mt-3">{msgs.map((m: Msg) => m.text).join(" ")} <span className="bg-black px-1">██████</span> confidential.</p></div>);
  const out = slug.includes("outlook");
  if (!out) return (<div className="bg-white text-black"><div className="px-4 pt-3 pb-2 flex items-center gap-3"><div className="flex-1 bg-[#f1f3f4] rounded-full px-4 py-2.5 text-[14px] text-zinc-500">Search in mail</div><Avatar name={"Y"} size="w-8 h-8" /></div><div className="px-4 py-1 flex gap-4 text-[13px] font-semibold"><span className="text-[#0b57d0] border-b-2 border-[#0b57d0] pb-1.5">Primary</span><span className="text-zinc-500">Promotions</span><span className="text-zinc-500">Social</span></div><div className="p-4 border-t border-black/5"><div className="flex items-center gap-2.5"><Avatar name={name} size="w-10 h-10" /><div className="flex-1 text-[14px]"><b>{name}</b><div className="text-[13px] text-zinc-500">Subject: Meeting confirmed — let&apos;s catch up!</div></div><span className="text-[12px] text-zinc-500">09:41</span></div><p className="text-[14px] mt-3 leading-relaxed">Hi there,<br /><br />{msgs.map((m: Msg) => m.text).join(" ")}<br /><br />Best,<br />{name}</p><div className="flex gap-2 mt-4"><span className="border border-black/15 rounded-full px-4 py-1.5 text-[13px] font-semibold">Reply</span><span className="border border-black/15 rounded-full px-4 py-1.5 text-[13px] font-semibold">Forward</span></div></div><div className="flex justify-around border-t border-black/10 py-2.5 text-[11px] text-zinc-500"><span>Mail</span><span>Chat</span><span>Spaces</span><span>Meet</span></div></div>);
  return (<div className="bg-white text-black"><div className="px-4 py-3 bg-[#0f6cbd] text-white flex items-center gap-2"><b className="text-[16px]">Outlook</b><span className="bg-white/20 text-[11px] px-2 py-0.5 rounded-full">New</span></div><div className="px-4 py-2 flex gap-5 text-[14px] font-semibold border-b border-black/10"><span className="text-[#0f6cbd] border-b-2 border-[#0f6cbd] pb-1.5">Focused</span><span className="text-zinc-500">Other</span></div><div className="p-4"><div className="text-[16px] font-semibold">Meeting confirmed — let&apos;s catch up!</div><div className="flex items-center gap-2.5 mt-3"><Avatar name={name} size="w-10 h-10" /><div className="text-[14px]"><b>{name}</b> <span className="text-zinc-500 text-[13px]">&lt;hello@outlook.com&gt;</span><div className="text-zinc-500 text-[12px]">To: Me • Today 09:41</div></div></div><p className="text-[14px] mt-3 leading-relaxed">Hi there,<br /><br />{msgs.map((m: Msg) => m.text).join(" ")}<br /><br />Best regards,<br />{name}</p><div className="flex gap-2 mt-4"><span className="bg-[#0f6cbd] text-white rounded px-4 py-1.5 text-[13px] font-semibold">Reply</span><span className="border border-black/15 rounded px-4 py-1.5 text-[13px] font-semibold">Reply all</span><span className="border border-black/15 rounded px-4 py-1.5 text-[13px] font-semibold">Forward</span></div></div></div>);
}

function NotifView({ name, msgs }: any) {
  return (<div className="relative h-[600px] text-white overflow-hidden" style={{ background: "linear-gradient(180deg,#3b3b6d 0%,#1a1a2e 55%,#000 100%)" }}><StatusBar notch={false} /><div className="text-center mt-4"><div className="text-[11px] opacity-70">Tuesday, September 26</div><div className="text-[68px] font-bold leading-none tracking-tight">09:41</div></div><div className="px-3 space-y-2 mt-3">{msgs.slice(0, 3).map((m: Msg, i: number) => (<div key={i} className="rounded-[24px] p-3.5 flex gap-2.5" style={{ background: "rgba(255,255,255,0.22)", backdropFilter: "blur(30px)" }}><div className="w-10 h-10 rounded-[11px] bg-gradient-to-br from-green-400 to-green-600 shrink-0 flex items-center justify-center font-bold">M</div><div className="text-[13.5px] flex-1"><div className="flex justify-between text-[11.5px] opacity-70"><span className="uppercase font-semibold">Messages</span><span>now</span></div><b>{name}</b><br /><span className="opacity-90">{m.text}</span></div></div>))}<div className="rounded-[24px] p-3.5 flex gap-2.5 items-center" style={{ background: "rgba(255,255,255,0.22)", backdropFilter: "blur(30px)" }}><div className="w-10 h-10 rounded-[11px] bg-gradient-to-br from-red-400 to-red-600 shrink-0" /><div className="text-[13px]"><b>+2 more notifications</b></div></div></div><div className="absolute bottom-2 w-full flex justify-center"><div className="w-32 h-1 rounded-full bg-white/80" /></div></div>);
}

function ToolView({ slug, name }: any) {
  const isGH = slug.includes("github"), isMRR = slug.includes("mrr");
  if (isGH) {
    const weeks = 26, days = 7;
    const cells: number[] = Array.from({ length: weeks * days }, (_, i) => (i * 7 + 3) % 5);
    const green = ["#ebedf0", "#9be9a8", "#40c463", "#30a14e", "#216e39"];
    const total = cells.reduce((a, c) => a + c * 3, 0);
    return (<div className="bg-white text-black p-5 w-full">
      <div className="flex items-center gap-2.5"><div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center font-bold text-white">{name[0]}</div><div><b className="text-[15px]">{name}</b><div className="text-[12px] text-zinc-500">github.com/{name.toLowerCase().replace(/ /g, "")}</div></div><span className="ml-auto text-[12px] border border-black/15 rounded-full px-3 py-1.5 font-semibold">Follow</span></div>
      <div className="border border-black/10 rounded-xl p-4 mt-4">
        <div className="flex justify-between items-center"><b className="text-[14px]">{total.toLocaleString()} contributions</b><span className="text-[12px] text-zinc-500">Last year ▾</span></div>
        <div className="flex gap-[3px] mt-3 overflow-hidden">
          <div className="flex flex-col gap-[3px] text-[9px] text-zinc-400 mr-0.5"><span className="h-[11px]">M</span><span className="h-[11px]">W</span><span className="h-[11px]">F</span></div>
          {Array.from({ length: weeks }, (_, w) => (<div key={w} className="flex flex-col gap-[3px]">{Array.from({ length: days }, (_, d) => (<div key={d} style={{ background: green[cells[w * days + d]] }} className="w-[11px] h-[11px] rounded-[3px] border border-black/5" />))}</div>))}
        </div>
        <div className="flex justify-between items-center text-[11px] text-zinc-500 mt-2.5"><span>Learn how we count contributions</span><span className="flex items-center gap-1">Less <span className="flex gap-[2px]">{green.map((g) => <span key={g} style={{ background: g }} className="w-[10px] h-[10px] rounded-[2px] inline-block border border-black/5" />)}</span> More</span></div>
      </div>
      <div className="grid grid-cols-3 gap-2 mt-3">{[["Stars", "1.2k"], ["Followers", "845"], ["Repos", "48"]].map(([k, v]) => (<div key={k} className="border border-black/10 rounded-xl p-2.5 text-center"><b className="text-[15px]">{v}</b><div className="text-[11px] text-zinc-500">{k}</div></div>))}</div>
    </div>);
  }
  const brand = "#635bff";
  const title = isMRR ? "Monthly recurring revenue" : "Gross volume";
  const pts = [12, 28, 22, 45, 38, 60, 55, 78, 72, 95, 90, 110];
  const path = pts.map((p, i) => `${(i / (pts.length - 1)) * 320},${130 - p}`).join(" L");
  return (<div className="bg-white text-black w-full">
    <div className="px-5 py-3.5 flex items-center gap-2 border-b border-black/10"><b className="text-[17px]" style={{ color: brand }}>{isMRR ? "baremetrics" : "stripe"}</b><span className="text-[13px] text-zinc-500">{isMRR ? "Dashboard" : "Payments"}</span><span className="ml-auto text-[12px] text-zinc-400">Last 12 months ▾</span></div>
    <div className="p-5">
      <div className="text-[13px] text-zinc-500">{title}</div>
      <div className="flex items-end gap-2"><span className="text-[30px] font-extrabold tracking-tight">$48,290</span><span className="text-[12px] text-white bg-green-500 font-bold px-2 py-0.5 rounded-full mb-2">↑ 24.5%</span></div>
      <div className="grid grid-cols-3 gap-2 mt-3">{[["New", "+$4.2k"], ["Churn", "-$890"], ["Active", "1,240"]].map(([k, v]) => (<div key={k} className="bg-zinc-50 border border-black/5 rounded-xl p-2"><div className="text-[11px] text-zinc-500">{k}</div><b className="text-[14px]">{v}</b></div>))}</div>
      <svg viewBox="0 0 320 140" className="w-full mt-4"><path d={`M0,${130 - pts[0]} L${path}`} fill="none" stroke={brand} strokeWidth="3" strokeLinecap="round" /><path d={`M0,${130 - pts[0]} L${path} L320,140 L0,140 Z`} fill={brand} opacity="0.12" /></svg>
      <div className="flex justify-between text-[11px] text-zinc-400 mt-1"><span>Sep</span><span>Nov</span><span>Jan</span><span>Mar</span><span>May</span><span>Jul</span><span>Aug</span></div>
    </div>
  </div>);
}

export default function GeneratePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const gen = getGenerator(slug);
  const ref = useRef<HTMLDivElement>(null);
  const [name, setName] = useState("Alex Morgan");
  const [dark, setDark] = useState(true);
  const [frameless, setFrameless] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([
    { me: false, text: "Hey, what are you doing?", time: "09:41" },
    { me: true, text: "Just figuring out Mockly!", time: "09:42" },
  ]);
  const [draft, setDraft] = useState("");
  const [asMe, setAsMe] = useState(false);
  const [img, setImg] = useState<string | null>(null);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [verified, setVerified] = useState(false);
  const onAvatar = (f: File | undefined) => {
    if (!f) return;
    const r = new FileReader();
    r.onload = () => setAvatar(r.result as string);
    r.readAsDataURL(f);
  };
  const [proOpen, setProOpen] = useState(false);
  const [adGate, setAdGate] = useState(false);
  const [adStep, setAdStep] = useState(1);
  const [gateMode, setGateMode] = useState<"sd" | "hd">("hd");
  const [adClicked, setAdClicked] = useState(false);
  const [count, setCount] = useState(10);
  const [tabWarn, setTabWarn] = useState(false);
  const [isPro, setIsPro] = useState(false);
  useEffect(() => {
    const un = onAuthStateChanged(auth, (u) => {
      if (!u) return setIsPro(false);
      import("firebase/database").then(({ ref: r, get }) =>
        get(r(db, `users/${u.uid}/pro/status`)).then((s) => setIsPro(s.val() === "active")).catch(() => {})
      );
    });
    return () => un();
  }, []);
  const onFile = (f: File | undefined) => {
    if (!f) return;
    const r = new FileReader();
    r.onload = () => setImg(r.result as string);
    r.readAsDataURL(f);
  };
  if (!gen) return <div className="p-10 text-white">Not found</div>;
  const add = () => { if (!draft.trim()) return; setMsgs([...msgs, { me: asMe, text: draft, time: "09:44" }]); setDraft(""); };
  useEffect(() => {
    if (!adGate) return;
    setAdStep(1);
    setAdClicked(false);
    setCount(10);
    setTabWarn(false);
  }, [adGate, gateMode]);
  useEffect(() => {
    if (!adGate || !adClicked || count <= 0) return;
    if (document.hidden) { setTabWarn(true); return; }
    const t = setTimeout(() => setCount((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [adGate, adClicked, count]);
  useEffect(() => {
    const onVis = () => { if (adGate && adClicked && document.hidden) setTabWarn(true); };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, [adGate, adClicked]);
  const SMARTLINK = "https://www.profitableratecpmnetwork.com/kx4e786uky?key=c4ecf6dfa0afd701bd35e01f02d0e4e9";
  const openAd = () => {
    window.open(SMARTLINK, "_blank", "noopener");
    setAdClicked(true);
    setTabWarn(false);
    import("firebase/database").then(({ ref: r, push }) => {
      const u = auth.currentUser;
      push(r(db, `adViews`), { uid: u?.uid ?? "anon", slug, step: adStep, at: Date.now() }).catch(() => {});
    });
  };
  const nextAd = () => {
    if (gateMode === "hd" && adStep === 1) { setAdStep(2); setAdClicked(false); setCount(10); setTabWarn(false); }
    else { setAdGate(false); doDownloadHD(); }
  };
  const need = gateMode === "hd" ? 2 : 1;
  const doDownloadHD = async () => {
    if (!ref.current || dlBusy) return;
    setDlBusy(true);
    try {
      const imgs = Array.from(ref.current.querySelectorAll("img"));
      await Promise.all(imgs.map((im) => (im.complete ? null : new Promise((res) => { im.onload = res; im.onerror = res; }))));
      await document.fonts?.ready;
      const url = await toPng(ref.current, { pixelRatio: gateMode === "hd" ? 3 : 1 });
      const a = document.createElement("a"); a.download = `${gen.slug}-${gateMode}.png`; a.href = url;
      document.body.appendChild(a); a.click(); a.remove();
    } catch (e) {
      alert("Download failed — please turn off AdBlock and try again.");
    } finally {
      setDlBusy(false);
    }
  };
  const [dlBusy, setDlBusy] = useState(false);
  const doDownload = async () => {
    if (!ref.current || dlBusy) return;
    setDlBusy(true);
    try {
      // uploaded image fully load howa porjonto wait
      const imgs = Array.from(ref.current.querySelectorAll("img"));
      await Promise.all(imgs.map((im) => (im.complete ? null : new Promise((res) => { im.onload = res; im.onerror = res; }))));
      await document.fonts?.ready;
      const url = await toPng(ref.current, { pixelRatio: isPro ? 3 : 2 });
      const a = document.createElement("a"); a.download = `${gen.slug}${isPro ? "-hd" : ""}.png`; a.href = url;
      document.body.appendChild(a); a.click(); a.remove();
      const u = auth.currentUser;
      if (u) set(dbRef(db, `users/${u.uid}/designs/${Date.now()}`), { slug, name, msgs, createdAt: Date.now() }).catch(() => {});
    } catch (e) {
      alert("Download failed — please turn off AdBlock and try again.");
    } finally {
      setDlBusy(false);
    }
  };
  const exportPng = async () => {
    setGateMode("hd");
    setAdGate(true);
  };
  const exportSD = async () => {
    setGateMode("sd");
    setAdGate(true);
  };
  return (
    <div className="min-h-screen bg-[#f4f4f5] text-black">
      <header className="bg-white border-b border-black/10 sticky top-0 z-10">
        <div className="max-w-[1200px] mx-auto flex items-center gap-3 px-4 py-2.5">
          <a href="/" className="flex items-center gap-2 text-[14px] font-semibold text-zinc-600 hover:text-black"><span className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center">←</span> Back</a>
          <span className="text-zinc-300">|</span>
          <b className="text-[15px] tracking-tight truncate">{gen.title}</b>
          <span className="ml-auto flex items-center gap-2"><AuthButton /></span>
        </div>
      </header>
      <ProModal open={proOpen} onClose={() => setProOpen(false)} />
      <div className="max-w-[1200px] mx-auto flex flex-col lg:flex-row gap-4 p-4">
      <div className="w-full lg:w-[340px] p-5 space-y-3.5 bg-white border border-black/10 rounded-2xl h-fit shrink-0 shadow-sm">
        <div className="text-[11px] font-bold uppercase tracking-widest text-zinc-400">fakie. editor</div>
        <label className="block text-[13px] font-semibold">Contact name<input value={name} onChange={(e) => setName(e.target.value)} className="mt-1.5 w-full bg-[#f4f4f5] border border-black/10 rounded-xl px-3.5 py-2.5 text-black outline-none focus:border-black font-normal" /></label>
        <div className="flex items-center gap-2.5">
          <label className="flex items-center gap-2 cursor-pointer">{avatar ? <img src={avatar} className="w-10 h-10 rounded-full object-cover" /> : <span className="w-10 h-10 rounded-full bg-zinc-100 border-[1.5px] border-dashed border-black/20 flex items-center justify-center text-lg text-zinc-400">+</span>}<span className="text-[12px] font-semibold text-zinc-600">Profile pic<input type="file" accept="image/*" className="hidden" onChange={(e) => onAvatar(e.target.files?.[0])} /></span></label>
          {avatar && <button onClick={() => setAvatar(null)} className="text-[11px] text-zinc-400">Remove</button>}
          <button onClick={() => setVerified(!verified)} className={`ml-auto text-[12px] font-bold px-3 py-1.5 rounded-full border ${verified ? "bg-[#1d9bf0] text-white border-[#1d9bf0]" : "border-black/15 text-zinc-500"}`}>{verified ? "✓ Verified" : "Verify?"}</button>
        </div>
        <div className="bg-[#f4f4f5] rounded-xl p-1 flex gap-1 text-[13px] font-semibold">
          <button onClick={() => setAsMe(false)} className={`flex-1 py-2 rounded-lg ${!asMe ? "bg-white shadow-sm" : "text-zinc-500"}`}>Them</button>
          <button onClick={() => setAsMe(true)} className={`flex-1 py-2 rounded-lg ${asMe ? "bg-white shadow-sm" : "text-zinc-500"}`}>Me</button>
        </div>
        <div className="flex gap-2">
          <input value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => e.key === "Enter" && add()} placeholder="Type a message…" className="flex-1 bg-white border border-black/15 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-black" />
          <button onClick={add} className="bg-black text-white w-11 rounded-xl font-bold text-lg hover:bg-zinc-800">+</button>
        </div>
        <label className="flex items-center justify-center gap-2 text-[13px] bg-white border-[1.5px] border-dashed border-black/20 rounded-xl p-3 cursor-pointer font-semibold text-zinc-600 hover:border-black hover:text-black">Add image
          <input type="file" accept="image/*" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />
        </label>
        {img && <div className="relative"><img src={img} className="rounded-xl w-full h-28 object-cover" /><button onClick={() => setImg(null)} className="absolute top-1.5 right-1.5 bg-black text-white text-[11px] font-semibold px-2.5 py-1 rounded-full">Remove</button></div>}
        <div className="space-y-1.5 max-h-52 overflow-auto">
          {msgs.map((m, i) => (<div key={i} className="group flex items-center gap-2 bg-[#f4f4f5] rounded-xl px-3 py-2 text-[13px]"><span className={`w-1.5 h-1.5 rounded-full shrink-0 ${m.me ? "bg-green-500" : "bg-zinc-400"}`} /><span className="truncate flex-1">{m.text}</span><button onClick={() => setMsgs(msgs.filter((_, j) => j !== i))} className="opacity-0 group-hover:opacity-100 text-zinc-400 hover:text-red-500 text-sm">✕</button></div>))}
        </div>
        <div className="flex items-center justify-between text-[13px] font-medium text-zinc-500"><span>Device frame</span><button onClick={() => setFrameless(!frameless)} className={`w-10 h-[22px] rounded-full p-0.5 transition ${frameless ? "bg-zinc-300" : "bg-green-500"}`}><span className={`block w-5 h-5 bg-white rounded-full shadow transition ${frameless ? "" : "ml-auto"}`} /></button></div>
        <div className="space-y-2">
          <button onClick={exportPng} disabled={dlBusy} className="w-full text-white font-bold py-3.5 px-4 rounded-2xl disabled:opacity-60 flex items-center justify-center gap-2.5 shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 hover:-translate-y-px transition-all" style={{ background: "linear-gradient(135deg,#4f46e5,#7c3aed)" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M12 3v12m0 0l-4.5-4.5M12 15l4.5-4.5M4 20h16" /></svg>
            {dlBusy ? "Saving…" : "Download HD"}
            <span className="text-[10px] font-extrabold bg-white/20 px-2 py-0.5 rounded-full">2 ADS</span>
          </button>
          <button onClick={exportSD} disabled={dlBusy} className="w-full bg-white font-semibold py-2.5 rounded-2xl hover:bg-zinc-50 disabled:opacity-60 text-[13.5px] text-zinc-600 border border-black/10 flex items-center justify-center gap-2 transition-all">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 3v12m0 0l-4.5-4.5M12 15l4.5-4.5M4 20h16" /></svg>
            Standard quality <span className="text-zinc-400">• 1 ad</span>
          </button>
        </div>
        <p className="text-center text-[12px] text-zinc-400">Free forever • HD after 2 short ads</p>
        {!isPro && <AdSlot slot="editor-sidebar" />}
      </div>
      <div className="flex-1 flex items-start justify-center p-6 bg-white border border-black/10 rounded-2xl shadow-sm" style={{ backgroundImage: "radial-gradient(#d4d4d8 1px, transparent 1px)", backgroundSize: "20px 20px" }}>
        <div>
        <div ref={ref} className={`${frameless ? "rounded-xl" : "rounded-[3rem] border-[12px] border-black shadow-[0_0_0_2px_#e5e5e5]"} w-[375px] overflow-hidden relative`}>
          {gen.kind === "ai-chat" ? <AIView slug={slug} msgs={msgs} />
            : gen.kind === "post" ? <PostView slug={slug} name={name} msgs={msgs} img={img} avatar={avatar} verified={verified} />
            : gen.kind === "comments" ? <CommentsView slug={slug} msgs={msgs} />
            : gen.kind === "story" ? <StoryView name={name} msgs={msgs} slug={slug} />
            : gen.kind === "email" ? <EmailView slug={slug} name={name} msgs={msgs} />
            : gen.kind === "notification" ? <NotifView name={name} msgs={msgs} />
            : gen.kind === "tool" ? <ToolView slug={slug} name={name} />
            : <ChatView slug={slug} name={name} msgs={msgs} self={gen.bubbleSelf} other={gen.bubbleOther} dark={dark} img={img} avatar={avatar} verified={verified} />}
        </div>
        <p className="text-center text-[12px] text-zinc-400 mt-3">HD export • Watch 2 short ads</p>
        {!isPro && <AdSlot slot="preview-bottom" />}
        </div>
      </div>
      {adGate && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-[340px] text-center">
            <b className="text-[17px]">{gateMode === "hd" ? "Watch 2 ads for HD download" : "Watch 1 ad for Standard download"}</b>
            <p className="text-[13px] text-zinc-500 mt-1">Ad {adStep} of {need} • Stay on this tab until verified</p>
            <div className="flex gap-1.5 mt-3">{Array.from({ length: need }, (_, k) => k + 1).map((s) => (<div key={s} className={`h-1.5 flex-1 rounded-full ${s < adStep || (s === adStep && adClicked && count <= 0) ? "bg-green-500" : s === adStep ? "bg-black" : "bg-zinc-200"}`} />))}</div>
            {tabWarn && <div className="text-[13px] font-bold text-red-600 mt-3">You left the tab — timer paused. Stay here to verify.</div>}
            {!adClicked ? (
              <button onClick={openAd} className="w-full bg-[#0b57d0] text-white font-bold py-3 rounded-xl mt-4">Open Sponsor Ad {adStep}/2 ↗</button>
            ) : count > 0 ? (
              <div className="mt-4"><div className="text-[14px] font-bold text-green-600">✓ Ad opened — verifying… {count}s</div><div className="h-2 bg-zinc-100 rounded-full mt-2 overflow-hidden"><div className="h-full bg-green-500 transition-all" style={{ width: `${(10 - count) * 10}%` }} /></div></div>
            ) : (
              <button onClick={nextAd} disabled={dlBusy} className="w-full bg-black text-white font-bold py-3 rounded-xl mt-4 disabled:opacity-60">{gateMode === "hd" && adStep === 1 ? "✓ Ad 1 verified — Continue to Ad 2" : dlBusy ? "Saving…" : `✓ Verified — Download ${gateMode === "hd" ? "HD" : "Standard"} PNG`}</button>
            )}
            <button onClick={() => setAdGate(false)} className="text-[12px] text-zinc-400 mt-2.5">Maybe later</button>
          </div>
        </div>
      )}
    </div>
    </div>
  );
}
