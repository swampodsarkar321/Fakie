import Link from "next/link";
import { GENERATORS } from "@/lib/generators";

const chat = GENERATORS.filter((g) => g.kind === "chat");
const ai = GENERATORS.filter((g) => g.kind === "ai-chat");
const post = GENERATORS.filter((g) => g.kind === "post");
const comments = GENERATORS.filter((g) => g.kind === "comments");
const stories = GENERATORS.filter((g) => g.kind === "story");
const email = GENERATORS.filter((g) => g.kind === "email");
const notif = GENERATORS.filter((g) => g.kind === "notification");
const tools = GENERATORS.filter((g) => g.kind === "tool");

const Check = () => (<svg width="18" height="18" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="9" fill="#000"/><path d="M6.5 10.2l2.4 2.4 4.6-5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>);

function Group({ title, items, icon, id }: { title: string; items: typeof chat; icon: React.ReactNode; id?: string }) {
  return (
    <section id={id} className="max-w-6xl mx-auto px-6 py-7 scroll-mt-20">
      <h2 className="text-[19px] font-bold mb-4 flex items-center gap-2.5"><span className="w-9 h-9 rounded-xl bg-black text-white flex items-center justify-center">{icon}</span>{title}</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
        {items.map((g) => (
          <Link key={g.slug} href={`/generate/${g.slug}`} className="group border border-black/10 rounded-2xl px-4 py-3.5 text-[14px] font-semibold hover:border-black hover:shadow-md bg-white transition flex items-center justify-between">{g.title}<span className="opacity-0 group-hover:opacity-100 transition text-lg leading-none">→</span></Link>
        ))}
      </div>
    </section>
  );
}

export default function Home() {
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      { "@type": "Question", name: "How do I make a fake WhatsApp chat screenshot?", acceptedAnswer: { "@type": "Answer", text: "Open the Fake WhatsApp Messages generator, type your messages, set the contact name, time and date, then download the screenshot as PNG. Free, no signup needed." } },
      { "@type": "Question", name: "Is Fakie free to use?", acceptedAnswer: { "@type": "Answer", text: "Yes. Standard quality downloads are free with no ads. HD downloads without watermark unlock after 2 short ads." } },
      { "@type": "Question", name: "Do I need to sign up to download screenshots?", acceptedAnswer: { "@type": "Answer", text: "No. Fakie works fully without an account — everything runs in your browser." } },
      { "@type": "Question", name: "Which apps can I create fake screenshots for?", acceptedAnswer: { "@type": "Answer", text: "WhatsApp, Instagram, iMessage, Messenger, Telegram, TikTok, X, Snapchat, Discord, Facebook, ChatGPT, Gmail and 40+ more apps." } },
    ],
  };
  const faqs = [
    ["How do I make a fake WhatsApp chat screenshot?", "Open the Fake WhatsApp Messages generator, type your messages, set the contact name, time and date, then download the screenshot as PNG. Free, no signup needed."],
    ["Is Fakie free to use?", "Yes. Standard quality downloads are free with no ads. HD downloads without watermark unlock after 2 short ads."],
    ["Do I need to sign up to download screenshots?", "No. Fakie works fully without an account — everything runs in your browser and your images never leave your device."],
    ["Which apps can I create fake screenshots for?", "WhatsApp, Instagram, iMessage, Messenger, Telegram, TikTok, X, Snapchat, Discord, Facebook, ChatGPT, Gmail and 40+ more apps."],
  ];
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Fakie — Fake Chat & Screenshot Generator",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://fakie.app",
    applicationCategory: "DesignApplication",
    operatingSystem: "Any",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    description: "Make realistic fake chats, posts, comments, stories, emails and notification screenshots. Free, no signup.",
  };
  return (
    <div className="min-h-screen bg-white text-black">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <header className="border-b border-black/10 sticky top-0 bg-white/90 backdrop-blur z-10">
        <div className="max-w-6xl mx-auto flex items-center gap-6 px-6 py-3.5">
          <Link href="/" className="text-[22px] font-extrabold tracking-tight">fakie<span className="text-green-500">.</span></Link>
          <nav className="hidden md:flex gap-5 text-[14px] font-medium text-zinc-700">
            <a href="#chat" className="hover:text-black">Fake WhatsApp chat</a><a href="#post" className="hover:text-black">Fake Posts</a><a href="#comments" className="hover:text-black">Fake Comments & Stories</a><a href="#email" className="hover:text-black">Fake Email & Notifications</a><a href="#tools" className="hover:text-black">Free tools</a>
          </nav>
          <Link href="/generate/fake-whatsapp-messages" className="ml-auto bg-black text-white text-[14px] font-semibold px-4 py-2 rounded-full">Start editing</Link>
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-6 pt-14 pb-10 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-zinc-100 border border-black/10 rounded-full px-3.5 py-1.5 text-[12.5px] font-semibold"><span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />50+ generators • Free, no signup</div>
          <h1 className="text-[48px] leading-[1.02] font-extrabold tracking-[-0.03em] mt-4">Fake chat<br />generator</h1>
          <p className="mt-4 text-[17px] leading-relaxed text-zinc-600">Make realistic chat, post, comment, story, email and notification screenshots for any app.</p>
          <ul className="mt-5 space-y-2.5 text-[15px] font-medium">
            <li className="flex items-center gap-2.5"><Check />Pixel-accurate layouts for every app</li>
            <li className="flex items-center gap-2.5"><Check />Dark mode, device frames, HD export</li>
            <li className="flex items-center gap-2.5"><Check />Export as PNG in one click</li>
          </ul>
          <div className="flex items-center gap-3 mt-7">
            <Link href="/generate/fake-whatsapp-messages" className="bg-black text-white font-bold px-7 py-3.5 rounded-full hover:bg-zinc-800 transition text-[15px]">Start editing →</Link>
            <Link href="/generate/fake-iphone-notifications" className="font-bold px-5 py-3.5 rounded-full border border-black/15 hover:border-black transition text-[15px]">View demo</Link>
          </div>
          <div className="flex items-center gap-1.5 mt-4 text-[13px] text-zinc-500"><span className="text-amber-400 tracking-tight">★★★★★</span> Loved by 120,000+ creators</div>
        </div>
        <Link href="/generate/fake-whatsapp-messages" className="mx-auto w-[340px] rounded-[3rem] border-[12px] border-black shadow-2xl overflow-hidden bg-[#0b141a] text-white block">
          <div className="flex justify-between items-center px-6 pt-3 text-[12px] font-semibold"><span>09:41</span><span className="flex items-center gap-1"><svg width="16" height="11" viewBox="0 0 17 11" fill="currentColor"><rect x="0" y="7" width="3" height="4" rx="0.5"/><rect x="4.5" y="5" width="3" height="6" rx="0.5"/><rect x="9" y="2.5" width="3" height="8.5" rx="0.5"/><rect x="13.5" y="0" width="3" height="11" rx="0.5"/></svg><span className="text-[10px]">5G</span><svg width="24" height="12" viewBox="0 0 25 12" fill="none"><rect x="0.5" y="0.5" width="21" height="11" rx="3" stroke="currentColor" opacity="0.4"/><rect x="2" y="2" width="16" height="8" rx="1.5" fill="currentColor"/><path d="M23.5 4v4a2 2 0 0 0 0-4z" fill="currentColor" opacity="0.4"/></svg></span></div>
          <div className="mt-1 mx-3 mb-0 rounded-2xl bg-[#1f2c34]/80 px-3 py-2.5 flex gap-2.5 items-center"><div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center font-bold">F</div><div className="text-[15px] font-medium leading-tight">Friend<span className="block text-[12px] font-normal text-[#00a884]">Online • typing…</span></div><span className="ml-auto text-lg">⋮</span></div>
          <div className="p-3.5 space-y-2 text-[14px] min-h-[360px]" style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)", backgroundSize: "16px 16px" }}>
            <div className="flex justify-center"><span className="bg-[#182229] text-[10px] px-3 py-1 rounded-full text-[#ffd279]">🔒 end-to-end encrypted</span></div>
            <div className="flex justify-center"><span className="bg-[#182229] text-[10px] px-3 py-1 rounded-full text-zinc-300">Today</span></div>
            <div className="bg-[#1f2c34] rounded-[20px] px-3 py-2 max-w-[84%]">Hey, what are you doing? 👀<span className="text-[10px] opacity-60 ml-2">09:41</span></div>
            <div className="flex justify-end"><div className="bg-[#005c4b] rounded-[20px] px-3 py-2 max-w-[84%]">Just figuring out Fakie! 🔥<span className="text-[10px] opacity-60 ml-2">09:42 ✓✓</span></div></div>
            <div className="bg-[#1f2c34] rounded-[20px] px-3 py-2 max-w-[84%]">Send me the HD screenshot ✅<span className="text-[10px] opacity-60 ml-2">09:43</span></div>
            <div className="flex gap-2 items-center pt-1.5"><div className="flex-1 rounded-full px-4 py-2.5 text-zinc-400 text-[13.5px]" style={{ background: "rgba(31,44,52,0.75)", backdropFilter: "blur(20px)" }}>Type a message</div><div className="w-11 h-11 rounded-full bg-[#00a884] flex items-center justify-center text-white font-bold">🎙</div></div>
          </div>
          <div className="text-center text-[11px] py-2 bg-black/40">Made with <b>fakie.</b></div>
        </Link>
      </section>

      <Group id="chat" title="Fake chat messages" items={chat} icon={<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a8 8 0 0 1-8 8H4l2-3a8 8 0 1 1 15-5z"/></svg>} />
      <Group title="AI Chats" items={ai} icon={<svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.4 7.2H22l-6 4.6 2.3 7.2-6.3-4.5-6.3 4.5L8 13.8 2 9.2h7.6z"/></svg>} />
      <Group id="post" title="Fake Posts" items={post} icon={<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>} />
      <Group id="comments" title="Fake Comments & Stories" items={[...comments, ...stories]} icon={<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 21C7 16.5 3 13 3 8.8A4.8 4.8 0 0 1 7.8 4c1.7 0 3.2.9 4.2 2.3A4.8 4.8 0 0 1 16.2 4 4.8 4.8 0 0 1 21 8.8c0 4.2-4 7.7-9 12.2z"/></svg>} />
      <Group id="email" title="Fake Email & Notifications" items={[...email, ...notif]} icon={<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>} />
      <Group id="tools" title="Free tools" items={tools} icon={<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4L14.5 12 12 9.5z"/></svg>} />

      <section className="max-w-6xl mx-auto px-6 py-10">
        <h2 className="text-[24px] font-extrabold tracking-tight">How to make a fake chat screenshot</h2>
        <ol className="mt-4 space-y-3 text-[15px] text-zinc-700 list-decimal list-inside">
          <li><b>Pick a generator</b> — fake WhatsApp chat, Instagram post, iMessage, TikTok comments and 50+ more.</li>
          <li><b>Type your messages</b> — set names, profile photos, tick marks, time and date for every bubble.</li>
          <li><b>Download as PNG</b> — standard quality is free with no ads; HD without watermark after 2 short ads.</li>
        </ol>
        <p className="mt-4 text-[15px] text-zinc-600">Fakie is a free fake chat generator for pranks, memes, YouTube videos, storytelling and product mockups. Everything runs in your browser — no signup, no watermark on HD, your photos never leave your device.</p>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-6">
        <h2 className="text-[24px] font-extrabold tracking-tight">Frequently asked questions</h2>
        <div className="mt-4 space-y-3">
          {faqs.map(([q, a]) => (
            <div key={q} className="border border-black/10 rounded-2xl px-5 py-4 bg-white">
              <h3 className="font-bold text-[15px]">{q}</h3>
              <p className="text-[14px] text-zinc-600 mt-1">{a}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-black/10 mt-8">
        <div className="max-w-6xl mx-auto px-6 py-10 grid md:grid-cols-3 gap-8 text-[14px]">
          <div><b>Resources</b><div className="mt-2 space-y-1 text-zinc-600"><div>Chat Screenshot Generator</div><div>Fake Chat Generator</div><div>Fake DM Generator</div><div>Blog</div><div>FAQ</div></div></div>
          <div><b>Legal</b><div className="mt-2 space-y-1 text-zinc-600"><Link href="/terms" className="block hover:text-black">Terms of Service</Link><Link href="/privacy" className="block hover:text-black">Privacy Policy</Link><div>Cookie settings</div></div></div>
          <div><b className="text-[20px]">fakie.</b><div className="mt-2 text-zinc-500">© 2026 Fakie. All rights reserved.</div></div>
        </div>
      </footer>
    </div>
  );
}
