import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

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
    <html lang="en" className={`${nasalization.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
        <a
          href="https://ko-fi.com/D1D31E1CDH"
          target="_blank"
          rel="noopener noreferrer"
          className="kofi-support-button"
          aria-label="Support Illphated on Ko-fi (opens in a new tab)"
        >
          <span className="kofi-support-icon" aria-hidden="true">♥</span>
          <span>Support me on Ko-fi</span>
        </a>
      </body>
    </html>
  );
}
