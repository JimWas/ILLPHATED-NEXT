import ForumHeader from "@/components/ForumHeader";
import ForumThreadView from "@/components/ForumThread";

export default async function ForumThreadPage(props: { params: Promise<{ slug: string; thread: string }> }) {
  const { slug, thread } = await props.params;
  return (
    <div className="min-h-screen command-grid">
      <ForumHeader context={`/${slug}/ TOPIC`} />
      <main className="p-6 md:p-12">
        <div className="max-w-6xl mx-auto">
          <ForumThreadView boardSlug={slug} threadSlug={thread} />
        </div>
      </main>
    </div>
  );
}
