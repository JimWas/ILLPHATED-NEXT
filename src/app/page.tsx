import Link from "next/link";
import { getFeaturedStory, getLatestStories, isStoryVideo } from "@/lib/stories";

export const dynamic = "force-dynamic";

const socialLinks = [
  { label: "YouTube", handle: "@illphated", href: "https://www.youtube.com/@illphated", mark: "YT" },
  { label: "Rumble", handle: "Illphated", href: "https://rumble.com/user/Illphated", mark: "R" },
  { label: "X", handle: "@illphated336", href: "https://x.com/illphated336", mark: "X" },
  { label: "Truth Social", handle: "@Illphated", href: "https://truthsocial.com/@Illphated", mark: "TS" },
  { label: "Instagram", handle: "@illphated", href: "https://www.instagram.com/illphated/", mark: "IG" },
  { label: "Twitch", handle: "strykerusa", href: "https://www.twitch.tv/strykerusa", mark: "TV" },
];

export default async function Home() {
  const [featured, recentStories] = await Promise.all([
    getFeaturedStory(),
    getLatestStories(4),
  ]);
  const featuredVideo = featured?.images.find(isStoryVideo) ?? null;
  const latestStories = recentStories
    .filter((story) => story.id !== featured?.id)
    .slice(0, 3);

  return (
    <div className="flex min-h-screen flex-col command-grid">
      <header className="flex items-center justify-between border-b-4 border-nasa-red bg-nasa-blue px-6 py-4 text-white shadow-lg md:px-12">
        <Link href="/" className="flex items-center gap-4">
          <div className="grid h-12 w-12 place-items-center rounded-full bg-white p-1" aria-hidden="true">
            <div className="grid h-full w-full place-items-center rounded-full border-4 border-nasa-blue text-[9px] font-bold text-nasa-blue">IP</div>
          </div>
          <h1 className="text-xl tracking-widest md:text-4xl">ILLPHATED.COM</h1>
        </Link>
        <nav className="hidden gap-8 text-sm tracking-widest md:flex nasalization" aria-label="Primary navigation">
          <Link href="/stories" className="hover:text-nasa-red">STORIES</Link>
          <Link href="/archive" className="hover:text-nasa-red">ARCHIVES</Link>
          <Link href="/boards" className="hover:text-nasa-red">BOARDS</Link>
          <Link href="/gps" className="hover:text-nasa-red">TRACKER</Link>
        </nav>
      </header>

      <main className="flex-1">
        <section className="story-hero" aria-labelledby="story-hero-title">
          {featured?.cover_url && <img src={featured.cover_url} alt="" className="story-hero-image" />}
          <div className="story-hero-overlay" />
          <div className="story-hero-content">
            <div className="story-hero-copy">
              <div className="story-kicker"><span /> NEW TRANSMISSION // SHORT FICTION</div>
              <h2 id="story-hero-title">{featured?.title ?? "STORIES FROM THE EDGE OF THE SIGNAL"}</h2>
              <p>
                {featured?.excerpt ??
                  "Original short fiction by Illphated—written to be read in the dark, and recorded for the long way home."}
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href={featured ? `/stories/${featured.slug}` : "/stories"} className="story-primary-action">
                  {featured ? "READ FEATURED STORY" : "ENTER THE STORY ARCHIVE"} <span aria-hidden="true">→</span>
                </Link>
                {featured?.audio_url && (
                  <a href="#featured-audio" className="story-secondary-action">LISTEN TO AUDIOBOOK</a>
                )}
                {featuredVideo && (
                  <a href="#featured-video" className="story-secondary-action">WATCH SHORT VIDEO</a>
                )}
              </div>
              {featured?.audio_url && (
                <audio id="featured-audio" controls preload="metadata" className="mt-6 w-full max-w-xl">
                  <source src={featured.audio_url} />
                </audio>
              )}
              {featuredVideo && (
                <video
                  id="featured-video"
                  src={featuredVideo}
                  poster={featured?.cover_url ?? undefined}
                  controls
                  preload="metadata"
                  playsInline
                  aria-label={`Video for ${featured?.title ?? "featured story"}`}
                  className="mt-6 aspect-video w-full max-w-xl bg-black object-contain"
                >
                  Your browser does not support MP4 video playback.
                </video>
              )}
            </div>

            <aside className="social-uplink" aria-labelledby="social-uplink-title">
              <div className="social-uplink-profile">
                <div className="social-uplink-photo-wrap">
                  <img src="/illphated-profile.jpg" alt="Illphated" className="social-uplink-photo" />
                  <span className="social-uplink-live">ACTIVE</span>
                </div>
                <div>
                  <p className="font-mono text-[9px] tracking-[.2em] text-white/45">CREATOR SIGNAL</p>
                  <h3 id="social-uplink-title">FIND ILLPHATED</h3>
                  <p>Follow the active transmissions.</p>
                </div>
              </div>
              <div className="social-uplink-grid">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-uplink-link"
                    aria-label={`Follow Illphated on ${social.label} (opens in a new tab)`}
                  >
                    <span className="social-uplink-mark" aria-hidden="true">{social.mark}</span>
                    <span><b>{social.label}</b><small>{social.handle}</small></span>
                    <i aria-hidden="true">↗</i>
                  </a>
                ))}
              </div>
            </aside>
          </div>
          <div className="story-hero-index" aria-hidden="true">FILE // 001</div>
        </section>

        {latestStories.length > 0 && (
          <section className="mx-auto max-w-6xl px-6 pt-16 md:px-12" aria-labelledby="latest-stories-title">
            <div className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b-2 border-nasa-red pb-4">
              <div>
                <p className="font-mono text-xs font-bold text-nasa-red">RECENT TRANSMISSIONS</p>
                <h2 id="latest-stories-title" className="mt-2 text-3xl text-nasa-blue">LATEST SHORT STORIES</h2>
              </div>
              <Link href="/stories" className="font-mono text-xs font-bold text-nasa-blue hover:text-nasa-red">VIEW ALL STORIES →</Link>
            </div>
            <div className="grid gap-5 md:grid-cols-3">
              {latestStories.map((story, index) => (
                <Link key={story.id} href={`/stories/${story.slug}`} className="group flex min-h-64 flex-col border border-gray-300 bg-white p-6 transition hover:-translate-y-1 hover:border-nasa-blue hover:shadow-xl">
                  <div className="flex items-center justify-between font-mono text-[10px] text-gray-400">
                    <span>FILE // {String(index + 2).padStart(3, "0")}</span>
                    <span>{new Date(story.created_at).toLocaleDateString()}</span>
                  </div>
                  <h3 className="mt-8 text-2xl leading-tight text-nasa-blue group-hover:text-nasa-red">{story.title}</h3>
                  <p className="mt-4 line-clamp-3 text-sm leading-6 text-gray-600">{story.excerpt}</p>
                  <span className="mt-auto pt-8 text-right text-sm font-bold text-nasa-blue group-hover:text-nasa-red">READ TRANSMISSION →</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        <section className="mx-auto max-w-6xl px-6 py-16 md:px-12">
          <div className="mb-8 flex items-end justify-between border-b-2 border-nasa-blue pb-4">
            <div>
              <p className="font-mono text-xs font-bold text-nasa-red">COMMAND DIRECTORY</p>
              <h2 className="mt-2 text-3xl text-nasa-blue">CONTINUE EXPLORATION</h2>
            </div>
            <Link href="/admin/stories" className="text-[10px] font-mono text-gray-400 hover:text-nasa-blue">AUTHOR ACCESS</Link>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              ["/stories", "SHORT STORIES", "Read and listen to original transmissions."],
              ["/archive", "MISSION ARCHIVES", "Access the complete record."],
              ["/boards", "OPERATIONS BOARD", "Enter the real-time feed."],
            ].map(([href, title, description]) => (
              <Link key={href} href={href} className="group border border-gray-300 bg-white p-6 transition hover:-translate-y-1 hover:border-nasa-blue hover:shadow-xl">
                <p className="mb-8 font-mono text-[10px] text-nasa-red">UPLINK AVAILABLE</p>
                <h3 className="text-xl text-nasa-blue">{title}</h3>
                <p className="mt-2 text-sm text-gray-600">{description}</p>
                <span className="mt-6 block text-right text-nasa-blue group-hover:text-nasa-red">→</span>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <footer className="flex items-center justify-between border-t-2 border-gray-300 bg-gray-100 px-6 py-3 font-mono text-[10px] uppercase tracking-widest text-gray-500">
        <span>ORIGINAL FICTION // AUDIO ENABLED</span>
        <span className="flex items-center gap-2"><i className="h-2 w-2 animate-pulse rounded-full bg-green-500" /> ALL SYSTEMS GO</span>
      </footer>
    </div>
  );
}
