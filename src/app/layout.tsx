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
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://fakie.app"),
  title: { default: "Fakie — Fake Chat & Screenshot Generator", template: "%s — Fakie" },
  description: "Make realistic fake chats, posts, comments, stories, emails and notification screenshots. Free, no signup.",
  keywords: ["fake chat generator", "fake whatsapp chat", "fake instagram post", "chat screenshot generator", "fake dm generator"],
  openGraph: { type: "website", siteName: "Fakie", title: "Fakie — Fake Chat & Screenshot Generator", description: "Make realistic fake screenshots for any app. Free, no signup." },
  twitter: { card: "summary_large_image", title: "Fakie — Fake Chat & Screenshot Generator", description: "Make realistic fake screenshots for any app. Free, no signup." },
  robots: { index: true, follow: true },
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
