import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getStory, isStoryVideo } from "@/lib/stories";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const story = await getStory(slug);

  if (!story) {
    return {
      title: "Story Not Found | ILLPHATED.COM",
      robots: { index: false, follow: false },
    };
  }

  const title = `${story.title} | ILLPHATED.COM`;
  const description =
    story.excerpt || `Read “${story.title},” an original short story by Illphated.`;
  const canonicalUrl = `https://www.illphated.com/stories/${encodeURIComponent(story.slug)}`;
  const featuredImage = story.cover_url || story.images?.[0] || null;
  const imageUrl = featuredImage
    ? new URL(featuredImage, "https://www.illphated.com").toString()
    : null;

  return {
    title,
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      type: "article",
      title,
      description,
      url: canonicalUrl,
      siteName: "ILLPHATED.COM",
      publishedTime: story.created_at,
      modifiedTime: story.updated_at,
      authors: ["Illphated"],
      images: imageUrl
        ? [{ url: imageUrl, alt: `Featured image for ${story.title}` }]
        : [],
    },
    twitter: {
      card: imageUrl ? "summary_large_image" : "summary",
      site: "@illphated336",
      creator: "@illphated336",
      title,
      description,
      images: imageUrl ? [imageUrl] : [],
    },
  };
}

export default async function StoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const story = await getStory(slug);
  if (!story) notFound();

  return (
    <div className="min-h-screen bg-[#080d19] text-white">
      <header className="flex items-center justify-between border-b border-white/20 px-6 py-4 md:px-12">
        <Link href="/" className="nasalization text-lg">ILLPHATED</Link>
        <Link href="/stories" className="font-mono text-xs text-white/70 hover:text-white">← STORY ARCHIVE</Link>
      </header>
      <main>
        <section className="story-reader-cover">
          {story.cover_url && <img src={story.cover_url} alt="" />}
          <div>
            <p className="story-kicker"><span /> SHORT FICTION TRANSMISSION</p>
            <h1>{story.title}</h1>
            <p>{story.excerpt}</p>
          </div>
        </section>
        <article className="mx-auto max-w-3xl px-6 py-14 md:py-20">
          {story.audio_url && (
            <section className="mb-14 border border-white/20 bg-white/5 p-5">
              <p className="mb-3 font-mono text-[10px] tracking-[.25em] text-[#ff4d57]">AUDIOBOOK // PRESS PLAY</p>
              <audio controls preload="metadata" className="w-full"><source src={story.audio_url} /></audio>
            </section>
          )}
          <div className="story-prose">
            {story.body.split(/\n\s*\n/).filter(Boolean).map((paragraph, index) => <p key={index}>{paragraph}</p>)}
          </div>
          {story.images?.length > 0 && (
            <div className="mt-16 grid gap-6">
              {story.images.map((media, index) => isStoryVideo(media) ? (
                <video key={media} controls preload="none" playsInline className="aspect-video w-full border border-white/20 bg-black">
                  <source src={media} type="video/mp4" />
                  Your browser does not support MP4 video playback.
                </video>
              ) : (
                <img key={media} src={media} alt={`${story.title} illustration ${index + 1}`} className="w-full border border-white/20" />
              ))}
            </div>
          )}
          <div className="mt-16 border-t border-white/20 pt-8 text-center">
            <p className="nasalization text-xs tracking-widest text-white/50">END OF TRANSMISSION</p>
            <Link href="/stories" className="mt-5 inline-block text-sm text-[#ff4d57]">RETURN TO STORY ARCHIVE →</Link>
          </div>
        </article>
      </main>
    </div>
  );
}
