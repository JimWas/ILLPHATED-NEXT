import ForumAdmin from "@/components/ForumAdmin";
import ForumHeader from "@/components/ForumHeader";

export const metadata = { title: "FORUM CONTROL | ILLPHATED.COM" };

export default function ForumAdminPage() {
  return (
    <div className="min-h-screen command-grid">
      <ForumHeader context="ACCESS CONTROL" />
      <main className="p-6 md:p-12"><div className="max-w-6xl mx-auto"><ForumAdmin /></div></main>
    </div>
  );
}
