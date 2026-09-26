export type GenKind = "chat" | "ai-chat" | "post" | "comments" | "story" | "email" | "notification" | "tool";

export interface Generator { slug: string; title: string; kind: GenKind; theme: string; bubbleSelf: string; bubbleOther: string; }

const C = (slug: string, title: string): Generator => ({ slug, title, kind: "chat", theme: "#0b141a", bubbleSelf: "#005c4b", bubbleOther: "#1f2c34" });

export const GENERATORS: Generator[] = [
  ...["bluesky","bumble","discord","imessage","instagram","line","linkedin","messenger","microsoftTeams","msn","onlyfans","reddit","signal","slack","snapchat","techText","telegram","tiktok","tinder","wechat","whatsapp","x"].map((a) => C(`fake-${a}-messages`, `Fake ${a === "x" ? "X" : a[0].toUpperCase() + a.slice(1)} messages`)),
  { slug: "fake-fiverr-messages", title: "Fake Fiverr Messages", kind: "chat", theme: "#ffffff", bubbleSelf: "#fff", bubbleOther: "#fff" },
  { slug: "fake-chatgpt-chat", title: "Fake ChatGPT chat", kind: "ai-chat", theme: "#212121", bubbleSelf: "#19c37d", bubbleOther: "#444654" },
  { slug: "fake-claude-chat", title: "Fake Claude chat", kind: "ai-chat", theme: "#f5f0e8", bubbleSelf: "#d97757", bubbleOther: "#fff" },
  { slug: "fake-gemini-chat", title: "Fake Gemini chat", kind: "ai-chat", theme: "#1e1f20", bubbleSelf: "#0842a0", bubbleOther: "#282a2c" },
  { slug: "fake-grok-chat", title: "Fake Grok chat", kind: "ai-chat", theme: "#000", bubbleSelf: "#fff", bubbleOther: "#333" },
  { slug: "fake-perplexity-chat", title: "Fake Perplexity chat", kind: "ai-chat", theme: "#fff", bubbleSelf: "#000", bubbleOther: "#eee" },
  { slug: "fake-bluesky-post", title: "Fake Bluesky Post", kind: "post", theme: "#fff", bubbleSelf: "#000", bubbleOther: "#000" },
  { slug: "fake-facebook-post", title: "Fake Facebook Post", kind: "post", theme: "#fff", bubbleSelf: "#000", bubbleOther: "#000" },
  { slug: "fake-instagram-post", title: "Fake Instagram Post", kind: "post", theme: "#fff", bubbleSelf: "#000", bubbleOther: "#000" },
  { slug: "fake-linkedin-post", title: "Fake LinkedIn Post", kind: "post", theme: "#fff", bubbleSelf: "#000", bubbleOther: "#000" },
  { slug: "fake-pinterest-post", title: "Fake Pinterest Post", kind: "post", theme: "#fff", bubbleSelf: "#000", bubbleOther: "#000" },
  { slug: "fake-threads-post", title: "Fake Threads Post", kind: "post", theme: "#fff", bubbleSelf: "#000", bubbleOther: "#000" },
  { slug: "fake-tiktok-post", title: "Fake TikTok Post", kind: "post", theme: "#000", bubbleSelf: "#fff", bubbleOther: "#fff" },
  { slug: "fake-x-post", title: "Fake X Post", kind: "post", theme: "#000", bubbleSelf: "#fff", bubbleOther: "#fff" },
  { slug: "fake-facebook-comments", title: "Fake Facebook Comments", kind: "comments", theme: "#fff", bubbleSelf: "#000", bubbleOther: "#555" },
  { slug: "fake-instagram-comments", title: "Fake Instagram Comments", kind: "comments", theme: "#fff", bubbleSelf: "#000", bubbleOther: "#555" },
  { slug: "fake-linkedin-comments", title: "Fake LinkedIn Comments", kind: "comments", theme: "#fff", bubbleSelf: "#000", bubbleOther: "#555" },
  { slug: "fake-reddit-comments", title: "Fake Reddit Comments", kind: "comments", theme: "#fff", bubbleSelf: "#000", bubbleOther: "#555" },
  { slug: "fake-threads-comments", title: "Fake Threads Comments", kind: "comments", theme: "#fff", bubbleSelf: "#000", bubbleOther: "#555" },
  { slug: "fake-tiktok-comments", title: "Fake TikTok Comments", kind: "comments", theme: "#fff", bubbleSelf: "#000", bubbleOther: "#555" },
  { slug: "fake-x-comments", title: "Fake X Comments", kind: "comments", theme: "#000", bubbleSelf: "#fff", bubbleOther: "#aaa" },
  { slug: "fake-youtube-comments", title: "Fake YouTube Comments", kind: "comments", theme: "#0f0f0f", bubbleSelf: "#fff", bubbleOther: "#aaa" },
  { slug: "fake-instagram-stories", title: "Fake Instagram stories", kind: "story", theme: "#000", bubbleSelf: "#fff", bubbleOther: "#fff" },
  { slug: "fake-snapchat-stories", title: "Fake Snapchat stories", kind: "story", theme: "#fffc00", bubbleSelf: "#000", bubbleOther: "#000" },
  { slug: "fake-apple-mail-email", title: "Fake Apple Mail", kind: "email", theme: "#fff", bubbleSelf: "#000", bubbleOther: "#555" },
  { slug: "fake-gmail-email", title: "Fake Gmail", kind: "email", theme: "#fff", bubbleSelf: "#000", bubbleOther: "#555" },
  { slug: "fake-leaked-email", title: "Fake Redacted Email", kind: "email", theme: "#fff", bubbleSelf: "#000", bubbleOther: "#555" },
  { slug: "fake-outlook-email", title: "Fake Outlook", kind: "email", theme: "#fff", bubbleSelf: "#000", bubbleOther: "#555" },
  { slug: "fake-iphone-notifications", title: "Fake iOS notifications", kind: "notification", theme: "#000", bubbleSelf: "#fff", bubbleOther: "#fff" },
  { slug: "fake-github-contribution-chart", title: "GitHub Contribution Chart", kind: "tool", theme: "#fff", bubbleSelf: "#000", bubbleOther: "#000" },
  { slug: "fake-mrr-chart", title: "MRR Chart Generator", kind: "tool", theme: "#fff", bubbleSelf: "#000", bubbleOther: "#000" },
  { slug: "fake-stripe-chart", title: "Stripe Chart Generator", kind: "tool", theme: "#fff", bubbleSelf: "#000", bubbleOther: "#000" },
];

export const getGenerator = (slug: string) => GENERATORS.find((g) => g.slug === slug) ?? { slug, title: slug.replace(/-/g, " "), kind: "chat" as GenKind, theme: "#0b141a", bubbleSelf: "#005c4b", bubbleOther: "#1f2c34" };
