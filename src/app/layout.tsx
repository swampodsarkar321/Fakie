import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import Protection from "@/components/Protection";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://fakie-three.vercel.app"),
  title: { default: "Fakie — Fake Chat & Screenshot Generator", template: "%s — Fakie" },
  description: "Make realistic fake chats, posts, comments, stories, emails and notification screenshots. Free fake WhatsApp chat, Instagram post, iMessage and TikTok generator — no signup.",
  keywords: ["fake chat generator", "fake whatsapp chat", "fake whatsapp chat generator", "fake instagram post", "fake imessage generator", "chat screenshot generator", "fake dm generator", "fake tiktok comments", "fake x post generator"],
  icons: { icon: "/favicon.svg", apple: "/icon-512.png" },
  manifest: "/manifest.webmanifest",
  themeColor: "#000000",
  openGraph: { type: "website", siteName: "Fakie", title: "Fakie — Fake Chat & Screenshot Generator", description: "Make realistic fake screenshots for any app. Free fake WhatsApp, Instagram, iMessage, X and TikTok generator — no signup.", images: [{ url: "/og-cover.png", width: 1200, height: 630, alt: "Fakie — Fake chat & screenshot generator" }] },
  twitter: { card: "summary_large_image", title: "Fakie — Fake Chat & Screenshot Generator", description: "Make realistic fake screenshots for any app. Free, no signup.", images: ["/og-cover.png"] },
  robots: { index: true, follow: true },
  verification: { google: "fWxnJ6Q82zmDB9D1k1_m98hH6SrI2H253jcxt-5eTTY" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${jakarta.variable} antialiased`}
    >
      <body className="min-h-full flex flex-col font-[family-name:var(--font-jakarta)]"><Protection />{children}
        <Script src="https://pl31515711.profitableratecpmnetwork.com/a8/f0/7a/a8f07a9fe2d5d5550a7047e6d53e64b0.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
