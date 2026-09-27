import type { Metadata } from "next";
import { getGenerator, GENERATORS } from "@/lib/generators";

const BASE = process.env.NEXT_PUBLIC_SITE_URL || "https://fakie-three.vercel.app";

export function generateStaticParams() {
  return GENERATORS.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const gen = getGenerator(slug);
  if (!gen) return { title: "Not found" };
  const title = `${gen.title} Generator — Free, No Signup`;
  const description = `Create a realistic ${gen.title.toLowerCase()} screenshot in seconds. Edit messages, photos, names, time and date, then download HD. Free fake ${gen.kind} generator, no signup needed.`;
  return {
    title,
    description,
    keywords: [gen.title.toLowerCase(), `free ${gen.title.toLowerCase()}`, `${gen.title.toLowerCase()} screenshot`, "fake chat generator"],
    alternates: { canonical: `${BASE}/generate/${slug}` },
    openGraph: { title, description, url: `${BASE}/generate/${slug}`, type: "website", siteName: "Fakie" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function SlugLayout({ children, params }: { children: React.ReactNode; params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const gen = getGenerator(slug);
  const title = gen?.title ?? "Fake screenshot";
  const kind = gen?.kind ?? "chat";
  const kindWord = kind === "chat" || kind === "ai-chat" ? "chat conversation" : kind === "post" ? "post" : kind === "comments" ? "comment section" : kind === "story" ? "story" : kind === "email" ? "email" : kind === "notification" ? "notification" : "graphic";
  const howLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: `How to make a fake ${title.toLowerCase()} screenshot`,
    step: [
      { "@type": "HowToStep", text: `Type your ${kindWord} text in the editor` },
      { "@type": "HowToStep", text: "Customize names, photos, time and date" },
      { "@type": "HowToStep", text: "Download the screenshot as PNG" },
    ],
  };
  return (
    <>
      {children}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howLd) }} />
      <section className="max-w-3xl mx-auto px-6 py-10 text-zinc-600">
        <h2 className="text-[20px] font-extrabold text-black">How to make a fake {title.toLowerCase()} screenshot</h2>
        <p className="mt-3 text-[15px] leading-relaxed">Use the free {title} generator to create a realistic {kindWord} screenshot in seconds. Type your {kindWord} text, set the display name, upload a profile photo, adjust the status-bar time and chat date, then download as PNG — standard quality is free with no ads, and HD without watermark unlocks after 2 short ads.</p>
        <p className="mt-3 text-[15px] leading-relaxed">Fakie works fully in your browser with no signup. Your photos never leave your device, and every layout is pixel-matched to the real app so screenshots look believable for pranks, memes, videos and storytelling.</p>
      </section>
    </>
  );
}
