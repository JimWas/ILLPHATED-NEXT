import Link from "next/link";

const BOARDS = [
  { id: "b", title: "RANDOM", desc: "SYSTEM_LEVEL_CHAOS" },
  { id: "tech", title: "TECHNOLOGY", desc: "HARDWARE_SOFTWARE_OPERATIONS" },
  { id: "nasa", title: "AEROSPACE", desc: "MISSION_CONTROL_AND_FLIGHT" },
  { id: "v", title: "VIDEO_GAMES", desc: "VIRTUAL_SIMULATION_LOGS" },
];

export const metadata = {
  title: "OPERATIONS BOARDS | ILLPHATED.COM",
};

export default function BoardsPage() {
  return (
    <div className="flex flex-col min-h-screen command-grid">
      <header className="bg-nasa-blue text-white py-4 px-6 md:px-12 flex justify-between items-center shadow-lg border-b-4 border-nasa-red">
        <Link href="/" className="flex items-center gap-4">
          <h1 className="text-xl md:text-2xl tracking-widest nasalization">OPERATIONS_BOARDS</h1>
        </Link>
        <Link href="/" className="text-xs nasalization border border-white px-2 py-1 hover:bg-white hover:text-nasa-blue transition-colors">RETURN TO BASE</Link>
      </header>

      <main className="flex-1 p-6 md:p-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12 border-l-8 border-nasa-red pl-6 py-2 bg-white/80 backdrop-blur-sm">
            <h2 className="text-3xl text-nasa-blue mb-2 nasalization">COMM_CHANNELS_ACTIVE</h2>
            <p className="text-sm text-gray-500 font-mono">SELECT A BOARD TO JOIN THE REAL-TIME FEED</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {BOARDS.map((board) => (
              <Link 
                key={board.id} 
                href={`/boards/${board.id}`}
                className="group block bg-white border-2 border-nasa-blue p-8 shadow-[10px_10px_0px_0px_rgba(0,51,160,0.05)] hover:shadow-[10px_10px_0px_0px_rgba(239,51,64,0.1)] transition-all"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-3xl text-nasa-blue nasalization group-hover:text-nasa-red transition-colors">/{board.id}/</h3>
                  <span className="bg-nasa-blue text-white text-[10px] px-2 py-1 nasalization">ACTIVE</span>
                </div>
                <h4 className="text-sm font-bold tracking-widest nasalization mb-2">{board.title}</h4>
                <p className="text-xs font-mono text-gray-400">{board.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
