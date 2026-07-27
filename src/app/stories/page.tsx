import Link from "next/link";
import { getPublishedStories } from "@/lib/stories";

export const dynamic = "force-dynamic";
export const metadata = { title: "SHORT STORIES | ILLPHATED.COM" };

export default async function StoriesPage() {
  const stories = await getPublishedStories();
  return (
    <div className="min-h-screen command-grid">
      <header className="flex items-center justify-between border-b-4 border-nasa-red bg-nasa-blue px-6 py-4 text-white md:px-12">
        <Link href="/"><h1 className="text-xl md:text-2xl">ILLPHATED // STORY ARCHIVE</h1></Link>
        <Link href="/" className="border border-white px-3 py-2 text-xs nasalization hover:bg-white hover:text-nasa-blue">RETURN TO BASE</Link>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-12">
        <div className="mb-12 border-l-8 border-nasa-red bg-white p-6">
          <p className="font-mono text-xs text-nasa-red">FICTION TRANSMISSIONS // AUDIO READY</p>
          <h2 className="mt-2 text-4xl text-nasa-blue">SHORT STORIES</h2>
          <p className="mt-3 max-w-2xl text-gray-600">Original fiction, field recordings from impossible places, and voices carried across the void.</p>
        </div>
        {stories.length ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {stories.map((story) => (
              <Link href={`/stories/${story.slug}`} key={story.id} className="story-card group">
                <div className="story-card-image">
                  {story.cover_url ? <img src={story.cover_url} alt="" /> : <span>NO VISUAL SIGNAL</span>}
                  {story.audio_url && <b>● AUDIOBOOK</b>}
                </div>
                <div className="p-6">
                  <p className="font-mono text-[10px] text-nasa-red">{new Date(story.created_at).toLocaleDateString()}</p>
                  <h3 className="mt-2 text-xl text-nasa-blue">{story.title}</h3>
                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-gray-600">{story.excerpt}</p>
                  <span className="mt-6 block text-xs font-bold text-nasa-blue">OPEN TRANSMISSION →</span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="border-2 border-dashed border-gray-300 bg-white p-12 text-center">
            <h3 className="text-2xl text-nasa-blue">AWAITING FIRST TRANSMISSION</h3>
            <p className="mt-3 text-gray-500">The first story is being prepared for uplink.</p>
          </div>
        )}
      </main>
    </div>
  );
}
