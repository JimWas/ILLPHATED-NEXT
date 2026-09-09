import ForumHeader from "@/components/ForumHeader";
import ForumHome from "@/components/ForumHome";

export const metadata = {
  title: "OPERATIONS BOARDS | ILLPHATED.COM",
};

export default function BoardsPage() {
  return (
    <div className="flex flex-col min-h-screen command-grid">
      <ForumHeader />

      <main className="flex-1 p-6 md:p-12">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12 border-l-8 border-nasa-red pl-6 py-2 bg-white/80 backdrop-blur-sm">
            <h2 className="text-3xl text-nasa-blue mb-2 nasalization">COMM_CHANNELS_ACTIVE</h2>
            <p className="text-sm text-gray-500 font-mono">SELECT A BOARD // OPEN A TOPIC // JOIN THE DISCUSSION</p>
          </div>
          <ForumHome />
        </div>
      </main>
    </div>
  );
}
