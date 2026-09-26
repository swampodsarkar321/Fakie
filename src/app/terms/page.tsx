import Link from "next/link";

export const metadata = { title: "Terms of Service — Fakie", description: "Terms of using Fakie mockup generator." };

export default function Terms() {
  return (
    <div className="min-h-screen bg-white text-black">
      <header className="border-b border-black/10"><div className="max-w-3xl mx-auto px-6 py-4"><Link href="/" className="text-[20px] font-extrabold">fakie<span className="text-green-500">.</span></Link></div></header>
      <main className="max-w-3xl mx-auto px-6 py-10 text-[15px] leading-relaxed space-y-5">
        <h1 className="text-3xl font-extrabold tracking-tight">Terms of Service</h1>
        <p className="text-zinc-500">Last updated: September 2026</p>
        <h2 className="text-lg font-bold">1. Service</h2>
        <p>Fakie provides fictional screenshot mockups. Free exports are standard quality with an ad gate. Pro ($8/mo or $60/yr) unlocks HD export, premium tools and an ad-free experience.</p>
        <h2 className="text-lg font-bold">2. Acceptable use</h2>
        <p>You agree not to use Fakie to create misleading content intended to deceive others, harass, or break the law. Accounts violating this may be suspended without refund.</p>
        <h2 className="text-lg font-bold">3. Refunds</h2>
        <p>Manual payments are verified by our team. If Pro is not activated within 24 hours of approval-eligible payment, contact support@fakie.app for a refund.</p>
        <h2 className="text-lg font-bold">4. Liability</h2>
        <p>Fakie is provided as-is. We are not liable for how generated content is used or shared.</p>
      </main>
    </div>
  );
}
