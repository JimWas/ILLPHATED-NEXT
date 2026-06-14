import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen command-grid">
      {/* Top Navigation Bar (Command Strip) */}
      <header className="bg-nasa-blue text-white py-4 px-6 md:px-12 flex justify-between items-center shadow-lg border-b-4 border-nasa-red">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center p-1">
             {/* NASA-style placeholder icon */}
             <div className="w-full h-full border-4 border-nasa-blue rounded-full flex items-center justify-center font-bold text-nasa-blue text-xs">NASA</div>
          </div>
          <h1 className="text-2xl md:text-4xl tracking-widest nasalization">ILLPHATED.COM</h1>
        </div>
        <nav className="hidden md:flex gap-8 text-sm tracking-widest nasalization">
          <Link href="/archive" className="hover:text-nasa-red transition-colors">ARCHIVES</Link>
          <Link href="/boards" className="hover:text-nasa-red transition-colors">BOARDS</Link>
          <Link href="/mission" className="hover:text-nasa-red transition-colors">MISSION</Link>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-4xl w-full bg-white/90 backdrop-blur-sm border-2 border-nasa-blue p-8 md:p-16 shadow-[20px_20px_0px_0px_rgba(0,51,160,0.1)]">
          <div className="inline-block px-3 py-1 bg-nasa-red text-white text-xs font-bold mb-6 tracking-widest nasalization">
            EST. 2024 // SYSTEM STATUS: NOMINAL
          </div>
          <h2 className="text-4xl md:text-6xl text-nasa-blue mb-8 leading-tight">
            THE NEXT GENERATION OF <br />
            <span className="text-nasa-red">DIGITAL EXPLORATION</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-700 mb-12 max-w-2xl mx-auto leading-relaxed">
            Illphated is a hybrid intelligence platform merging archival digital records with real-time, high-speed human interaction.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link 
              href="/archive"
              className="group relative block p-8 border-2 border-nasa-blue hover:bg-nasa-blue hover:text-white transition-all overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-30">
                <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg>
              </div>
              <h3 className="text-2xl nasalization mb-2">ACCESS ARCHIVES</h3>
              <p className="text-sm opacity-80 uppercase tracking-tighter font-bold">1,000+ Records Decrypted</p>
            </Link>

            <Link 
              href="/boards"
              className="group relative block p-8 border-2 border-nasa-red hover:bg-nasa-red hover:text-white transition-all overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-30">
                <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 12h-2v-2h2v2zm0-4h-2V6h2v4z"/></svg>
              </div>
              <h3 className="text-2xl nasalization mb-2">OPERATIONS BOARD</h3>
              <p className="text-sm opacity-80 uppercase tracking-tighter font-bold">Real-time Feed Active</p>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer Status Bar */}
      <footer className="bg-gray-100 border-t-2 border-gray-300 py-3 px-6 flex justify-between items-center text-[10px] md:text-xs font-mono tracking-widest text-gray-500 uppercase">
        <div className="flex gap-6">
          <span>LAT: 38.8895° N // LONG: 77.0353° W</span>
          <span className="hidden sm:inline">UPLINK: ACTIVE [GITHUB-VERCEL]</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span>ALL SYSTEMS GO</span>
        </div>
      </footer>
    </div>
  );
}
