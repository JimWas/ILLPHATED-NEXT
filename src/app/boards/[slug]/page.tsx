import Link from "next/link";
import BoardFeed from "@/components/BoardFeed";

export async function generateStaticParams() {
  return [
    { slug: "b" },
    { slug: "tech" },
    { slug: "nasa" },
    { slug: "v" },
  ];
}

export default async function BoardPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;

  return (
    <div className="flex flex-col min-h-screen command-grid">
      <header className="bg-nasa-blue text-white py-4 px-6 md:px-12 flex justify-between items-center shadow-lg border-b-4 border-nasa-red">
        <Link href="/boards" className="flex items-center gap-4">
          <h1 className="text-xl md:text-2xl tracking-widest nasalization">OPERATIONS // /{slug}/</h1>
        </Link>
        <Link href="/boards" className="text-xs nasalization border border-white px-2 py-1 hover:bg-white hover:text-nasa-blue transition-colors">BACK TO LIST</Link>
      </header>

      <main className="flex-1 p-6 md:p-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 flex justify-between items-end border-b-2 border-nasa-blue pb-4">
            <div>
               <h2 className="text-2xl text-nasa-blue nasalization leading-none">REAL_TIME_FEED</h2>
               <p className="text-[10px] text-gray-400 font-mono mt-2 tracking-widest uppercase">CONNECTION_STATUS: SECURE // PACKET_LOSS: 0%</p>
            </div>
            <div className="text-right">
               <span className="text-nasa-red text-xs font-bold animate-pulse">● LIVE</span>
            </div>
          </div>

          <BoardFeed boardId={slug} />
        </div>
      </main>
    </div>
  );
}
