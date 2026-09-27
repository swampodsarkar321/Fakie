import type { Metadata } from "next";
import { getGenerator, GENERATORS } from "@/lib/generators";

const BASE = process.env.NEXT_PUBLIC_SITE_URL || "https://fakie.app";

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

export default function SlugLayout({ children }: { children: React.ReactNode }) {
  return children;
}
