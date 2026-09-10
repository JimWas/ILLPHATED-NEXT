import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Creator Tools & Automation Software | ILLPHATED",
  description: "Explore Illphated's Mac utilities, creator automation software, interview tools, and streaming utilities. Secure checkout through Ko-fi.",
  alternates: { canonical: "/shop" },
};

const shopUrl = "https://ko-fi.com/illphated57469/shop";

const products = [
  { name: "Twitch Viewbot Proxy", price: "$6.99", category: "STREAMING LAB", code: "TWP-10", image: "/shop/twitch-viewbot.png", description: "A headed or headless browser utility with SOCKS5 and HTTP proxy support for Twitch viewer-simulation experiments.", href: "https://ko-fi.com/s/c02a1dc55c", proof: "49 SOLD" },
  { name: "Bodycam Pro — Complete iOS App + Source Code", price: "$4,984+", category: "iOS SOURCE CODE", code: "BCP-11", image: "/shop/bodycam-pro.png", description: "Own the complete foundation behind a real App Store body-camera app, including continuous recording, GPS route tracking, Evidence Mode, iCloud backup, widgets, and full Xcode project files.", href: "https://ko-fi.com/s/448a7d7a63", proof: "ONLY 1 LEFT" },
  { name: "JimWas Disk Space Matrix for macOS", price: "$9.99", category: "MAC UTILITY", code: "DSK-01", image: "/shop/disk-space.png", description: "See what is actually filling your Mac with a root-level storage scanner built to surface space-hungry folders fast.", href: "https://ko-fi.com/s/58c4113271" },
  { name: "Bunkr Album Downloader", price: "$6.69", category: "DOWNLOADER", code: "BNK-02", image: "/shop/bunkr-downloader.png", description: "Save complete Bunkr albums on macOS without manually downloading every image or relying on fragile one-off scripts.", href: "https://ko-fi.com/s/08b68741ee" },
  { name: "JimWas PyClicker Pro", price: "$6.96", category: "AUTOMATION", code: "VIS-03", image: "/shop/pyclicker.png", description: "Vision-based desktop automation for repetitive clicking and scrolling workflows that need a simple, visual approach.", href: "https://ko-fi.com/s/57548890f0" },
  { name: "X.com Video Uploader with AI Captions", price: "$14.44", category: "CREATOR TOOL", code: "XAI-04", image: "/shop/x-uploader.png", description: "Batch-post videos to X with a Python and Selenium workflow that generates captions with AI and cuts repetitive publishing work.", href: "https://ko-fi.com/s/8237fa4d87" },
  { name: "Suno MP3 to MP4 Video Converter", price: "$4.99", category: "CREATOR TOOL", code: "SUN-05", image: "/shop/suno-converter.png", description: "Turn Suno tracks into ready-to-post MP4 videos for YouTube, Instagram, X, TikTok, and other video-first platforms.", href: "https://ko-fi.com/s/aa6d78f614" },
  { name: "TikTok Selenium Uploader with AI Captions", price: "$17.76", category: "CREATOR TOOL", code: "TTK-06", image: "/shop/tiktok-uploader.png", description: "Speed up TikTok publishing with batch-oriented Selenium automation and AI-generated captions.", href: "https://ko-fi.com/s/283930e2bf" },
  { name: "JimWas Interview Assessment Assister", price: "$98", category: "AI ASSISTANT", code: "INT-07", image: "/shop/interview-assister.png", description: "Use Gemini AI to analyze practice-assessment screenshots and turn them into focused interview preparation insights.", href: "https://ko-fi.com/s/79bd61384a", proof: "1 SOLD" },
  { name: "Kick Proxyless View Simulator", price: "$6.69", category: "STREAMING LAB", code: "KPV-08", image: "/shop/kick-simulator.png", description: "A Python and Docker utility for controlled real-time viewer simulation and streaming workflow experiments.", href: "https://ko-fi.com/s/a61547e0b9", proof: "12 SOLD" },
  { name: "Kick Chatbot Undetected", price: "$4.99", category: "STREAMING LAB", code: "KCK-09", image: "/shop/kick-chatbot.png", description: "Automate multiple Kick chat sessions for testing and managing high-volume live chat workflows.", href: "https://ko-fi.com/s/08786a9d5e", proof: "8 SOLD" },
] as const;

const heroProduct = products[0];

export default function ShopPage() {
  return (
    <div className="min-h-screen bg-[#050914] text-white">
      <header className="border-b border-white/15 bg-[#07132d]/95 px-6 py-4 md:px-12">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6">
          <Link href="/" className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-full border-2 border-white font-mono text-[9px] font-bold">IP</span>
            <span className="text-lg tracking-widest md:text-2xl nasalization">ILLPHATED.COM</span>
          </Link>
          <nav className="flex items-center gap-5 font-mono text-[10px] tracking-[.16em] text-white/65" aria-label="Shop navigation">
            <Link href="/stories" className="hidden hover:text-white sm:inline">STORIES</Link>
            <Link href="/boards" className="hidden hover:text-white sm:inline">FORUM</Link>
            <a href={shopUrl} target="_blank" rel="noopener noreferrer" className="border border-white/30 px-4 py-2 text-white hover:border-nasa-red hover:bg-nasa-red">KO-FI SHOP ↗</a>
          </nav>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden border-b border-white/10">
          <div className="absolute inset-0 opacity-20 command-grid" />
          <div className="absolute -right-24 top-12 h-96 w-96 rounded-full bg-nasa-blue/30 blur-3xl" />
          <div className="relative mx-auto grid min-h-[720px] max-w-7xl items-center gap-14 px-6 py-20 md:px-12 lg:grid-cols-[.9fr_1.1fr]">
            <div>
              <p className="font-mono text-xs font-bold tracking-[.24em] text-nasa-red">FLAGSHIP RELEASE // 49 SOLD</p>
              <h1 className="mt-7 max-w-3xl text-5xl leading-[.9] text-white sm:text-6xl lg:text-7xl">TWITCH VIEWBOT PROXY</h1>
              <p className="mt-8 max-w-xl text-lg leading-8 text-slate-300">Drive live viewers to Twitch in headed or headless browsers with an intuitive desktop tool built for SOCKS5 and HTTP proxies.</p>
              <div className="mt-7 flex items-center gap-5"><strong className="font-mono text-3xl text-white">{heroProduct.price}</strong><span className="border border-emerald-400/50 px-3 py-2 font-mono text-[10px] tracking-widest text-emerald-400">{heroProduct.proof}</span></div>
              <div className="mt-10 flex flex-wrap gap-4">
                <a href={heroProduct.href} target="_blank" rel="noopener noreferrer" className="bg-nasa-red px-6 py-4 font-mono text-xs font-bold tracking-widest hover:bg-white hover:text-[#050914]">GET TWITCH VIEWBOT PROXY ↗</a>
                <a href="#catalog" className="border border-white/35 px-6 py-4 font-mono text-xs font-bold tracking-widest hover:border-white hover:bg-white/10">VIEW ALL {products.length} TOOLS ↓</a>
              </div>
              <div className="mt-12 flex flex-wrap gap-x-9 gap-y-3 font-mono text-[10px] tracking-[.12em] text-white/50">
                <span><b className="mr-2 text-emerald-400">●</b> SECURE KO-FI CHECKOUT</span><span><b className="mr-2 text-emerald-400">●</b> DIGITAL DELIVERY</span><span><b className="mr-2 text-emerald-400">●</b> INDIE DEVELOPER</span>
              </div>
            </div>

            <div className="relative min-h-[520px] overflow-hidden border border-white/15 bg-[#091126] shadow-[24px_24px_0_rgba(0,51,160,.18)]">
              <Image src={heroProduct.image} alt="Twitch Viewbot Proxy application screenshot" fill priority sizes="(max-width: 1024px) 100vw, 55vw" className="object-contain p-5" />
              <div className="absolute left-4 top-4 bg-nasa-red px-3 py-2 font-mono text-[9px] font-bold tracking-widest">BEST SELLER // 49 SOLD</div>
            </div>
          </div>
        </section>

        <section id="catalog" className="mx-auto max-w-7xl px-6 py-24 md:px-12">
          <div className="mb-12 flex flex-wrap items-end justify-between gap-5 border-b border-white/15 pb-6">
            <div><p className="font-mono text-[10px] tracking-[.22em] text-nasa-red">COMPLETE PRODUCT INDEX</p><h2 className="mt-3 text-4xl text-white md:text-5xl">THE TOOLKIT</h2></div>
            <p className="max-w-md text-sm leading-6 text-slate-400">One-purpose tools. Straightforward pricing. Buy only what solves the problem in front of you.</p>
          </div>
          <div className="grid gap-px overflow-hidden border border-white/15 bg-white/15 md:grid-cols-2 xl:grid-cols-3">
            {products.map((product) => (
              <article key={product.href} className="group flex min-h-[520px] flex-col bg-[#081020] hover:bg-[#0b1730]">
                <a href={product.href} target="_blank" rel="noopener noreferrer" className="relative block h-56 overflow-hidden border-b border-white/10 bg-[#030713]">
                  <Image src={product.image} alt={`${product.name} product screenshot`} fill sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw" className="object-contain p-4 transition duration-300 group-hover:scale-[1.03]" />
                </a>
                <div className="flex flex-1 flex-col p-7">
                <div className="flex items-start justify-between gap-5"><div><p className="font-mono text-[9px] tracking-[.18em] text-nasa-red">{product.category}</p><p className="mt-2 font-mono text-[9px] text-white/25">SYSTEM // {product.code}</p></div><span className="border border-white/20 px-3 py-2 font-mono text-sm font-bold">{product.price}</span></div>
                <h3 className="mt-7 text-2xl leading-tight text-white group-hover:text-nasa-red">{product.name}</h3>
                <p className="mt-5 text-sm leading-7 text-slate-400">{product.description}</p>
                <div className="mt-auto flex items-end justify-between gap-4 pt-10">
                  <span className="font-mono text-[9px] tracking-widest text-emerald-400">{"proof" in product ? product.proof : "AVAILABLE NOW"}</span>
                  <a href={product.href} target="_blank" rel="noopener noreferrer" aria-label={`Buy ${product.name} on Ko-fi`} className="border border-nasa-blue bg-nasa-blue px-4 py-3 font-mono text-[10px] font-bold tracking-wider hover:border-nasa-red hover:bg-nasa-red">VIEW & BUY ↗</a>
                </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="border-y border-white/10 bg-nasa-blue">
          <div className="mx-auto grid max-w-7xl items-center gap-8 px-6 py-16 md:px-12 lg:grid-cols-[1fr_auto]">
            <div><p className="font-mono text-[10px] tracking-[.2em] text-white/60">BUILD LESS BUSYWORK</p><h2 className="mt-3 text-3xl text-white md:text-5xl">READY TO UPGRADE YOUR WORKFLOW?</h2><p className="mt-4 max-w-2xl text-sm leading-7 text-blue-100">Browse the complete catalog on Ko-fi for full product details, requirements, updates, and secure checkout.</p></div>
            <a href={shopUrl} target="_blank" rel="noopener noreferrer" className="bg-white px-7 py-5 text-center font-mono text-xs font-bold tracking-widest text-nasa-blue hover:bg-nasa-red hover:text-white">OPEN THE KO-FI SHOP ↗</a>
          </div>
        </section>
      </main>

      <footer className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-8 font-mono text-[9px] tracking-[.14em] text-white/35 md:px-12"><span>ILLPHATED SOFTWARE LAB // INDEPENDENT DIGITAL TOOLS</span><Link href="/" className="hover:text-white">RETURN TO COMMAND →</Link></footer>
    </div>
  );
}
