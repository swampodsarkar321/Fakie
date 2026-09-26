import Link from "next/link";

export const metadata = { title: "Privacy Policy — Fakie", description: "How Fakie collects, uses and protects your data." };

export default function Privacy() {
  return (
    <div className="min-h-screen bg-white text-black">
      <header className="border-b border-black/10"><div className="max-w-3xl mx-auto px-6 py-4"><Link href="/" className="text-[20px] font-extrabold">fakie<span className="text-green-500">.</span></Link></div></header>
      <main className="max-w-3xl mx-auto px-6 py-10 text-[15px] leading-relaxed space-y-5">
        <h1 className="text-3xl font-extrabold tracking-tight">Privacy Policy</h1>
        <p className="text-zinc-500">Last updated: September 2026</p>
        <h2 className="text-lg font-bold">1. Data we collect</h2>
        <p>When you login with Google we store your name, email and profile photo in Firebase to manage your account, designs and Pro status. Mockup content you create is stored only to provide the service.</p>
        <h2 className="text-lg font-bold">2. Payments</h2>
        <p>Manual payments (bKash/Nagad/Rocket) require a Transaction ID which we store to verify your Pro upgrade. We never see your mobile banking PIN or password.</p>
        <h2 className="text-lg font-bold">3. Ads & analytics</h2>
        <p>We use third-party ad networks (Adsterra, Monetag) and Firebase Analytics which may use cookies to serve and measure ads.</p>
        <h2 className="text-lg font-bold">4. Responsible use</h2>
        <p>Fakie creates fictional mockups for design, storytelling and entertainment. Do not use generated screenshots to deceive, defame or commit fraud. You are responsible for how you use exports.</p>
        <h2 className="text-lg font-bold">5. Contact</h2>
        <p>Email: support@fakie.app for data deletion or privacy questions.</p>
      </main>
    </div>
  );
}
