import type { Metadata, Viewport } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RefCapture from "@/components/RefCapture";
import { SITE_URL } from "@/lib/taxonomy";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "SMB Agents AI — Real AI agent use cases for small businesses", template: "%s | SMB Agents AI" },
  description: "A free, plain-English directory of AI agent use cases for small-business owners. Find a problem, copy the prompt, follow the steps.",
  openGraph: { type: "website", siteName: "SMB Agents AI" },
  twitter: { card: "summary_large_image" },
};
export const viewport: Viewport = { themeColor: "#FBF7F0", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (<html lang="en"><body><RefCapture /><Header /><main className="mx-auto max-w-6xl px-4">{children}</main><Footer /></body></html>);
}
