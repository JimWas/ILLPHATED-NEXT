import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
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
  title: "ILLPHATED.COM | NASA COMMAND CENTER",
  description: "The futuristic home of illphated, built with NASA precision.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${nasalization.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
