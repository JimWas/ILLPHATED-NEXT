import ForumBoardView from "@/components/ForumBoard";
import ForumHeader from "@/components/ForumHeader";

export default async function BoardPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;

  return (
    <div className="flex flex-col min-h-screen command-grid">
      <ForumHeader context={`/${slug}/`} />

      <main className="flex-1 p-6 md:p-12">
        <div className="max-w-6xl mx-auto">
          <ForumBoardView boardSlug={slug} />
        </div>
      </main>
    </div>
  );
}
