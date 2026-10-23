import type { Metadata } from "next";
import "./globals.css";
import "./playground.css";

const siteOrigin = process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? "https://" + process.env.VERCEL_PROJECT_PRODUCTION_URL
    : "https://joel-spatial-portfolio.neonokapi16.chatgpt.site");

export const metadata: Metadata = {
  metadataBase: new URL(siteOrigin),
  title: "Joel Soyemi — Frontend Developer",
  description:
    "Frontend developer and Computer Science student in Lagos. Explore my projects, playful interactions, and approach to building for the web.",
  openGraph: {
    title: "Joel Soyemi — Code with logic. Design with feeling.",
    description:
      "Thoughtful interfaces. A different perspective. Selected work by Joel Soyemi.",
    type: "website",
    images: [
      {
        url: "/social.png",
        width: 1200,
        height: 630,
        alt: "Joel Soyemi — frontend developer",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
