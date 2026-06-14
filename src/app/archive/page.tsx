import Link from "next/link";
import { getAllPostData } from "@/lib/posts";

export const metadata = {
  title: "ARCHIVES | ILLPHATED.COM",
};

export default function ArchivePage() {
  const allPosts = getAllPostData();

  return (
    <div className="flex flex-col min-h-screen command-grid">
      <header className="bg-nasa-blue text-white py-4 px-6 md:px-12 flex justify-between items-center shadow-lg border-b-4 border-nasa-red">
        <Link href="/" className="flex items-center gap-4">
          <h1 className="text-xl md:text-2xl tracking-widest nasalization">ILLPHATED // ARCHIVES</h1>
        </Link>
        <Link href="/" className="text-xs nasalization border border-white px-2 py-1 hover:bg-white hover:text-nasa-blue transition-colors">RETURN TO BASE</Link>
      </header>

      <main className="flex-1 p-6 md:p-12">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12 border-l-8 border-nasa-red pl-6 py-2 bg-white/80 backdrop-blur-sm">
            <h2 className="text-3xl text-nasa-blue mb-2 nasalization">RECORDS_DECRYPTED</h2>
            <p className="text-sm text-gray-500 font-mono">TOTAL_RECORDS: {allPosts.length} // ENCRYPTION: NONE</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allPosts.map((post) => (
              <Link 
                key={post.slug} 
                href={`/archive/${post.slug}`}
                className="group bg-white border border-gray-200 hover:border-nasa-blue hover:shadow-xl transition-all relative overflow-hidden flex flex-col"
              >
                {post.featured_image && (
                  <div className="w-full aspect-video overflow-hidden border-b border-gray-100">
                    <img 
                      src={post.featured_image} 
                      alt="" 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-gray-50 -mr-8 -mt-8 rotate-45 group-hover:bg-nasa-blue transition-colors z-10"></div>
                  
                  <div>
                    <p className="text-[10px] font-mono text-nasa-red mb-2">{post.date}</p>
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-nasa-blue mb-4 leading-tight">{post.title || post.slug}</h3>
                  </div>
                  
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-[10px] nasalization text-gray-400 group-hover:text-nasa-blue">READ_FULL_LOG</span>
                    <span className="text-nasa-blue opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
