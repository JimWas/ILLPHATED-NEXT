import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const nasalization = localFont({
  src: "./fonts/Nasalization.otf",
  variable: "--font-nasalization",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.illphated.com"),
  title: "ILLPHATED.COM | Stories from the Edge of the Signal",
  description: "Original short fiction and audiobooks by Illphated.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${nasalization.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
