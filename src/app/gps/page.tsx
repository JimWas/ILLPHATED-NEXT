"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function GPSPage() {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    // In a real scenario, this would fetch from a database or API
    // that the mobile app is uploading to.
    // For now, simulating a live location update.
    const interval = setInterval(() => {
      setLocation({
        lat: 38.8895 + (Math.random() - 0.5) * 0.01,
        lng: -77.0353 + (Math.random() - 0.5) * 0.01,
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col min-h-screen command-grid">
      <header className="bg-nasa-blue text-white py-4 px-6 md:px-12 flex justify-between items-center shadow-lg border-b-4 border-nasa-red">
        <Link href="/" className="flex items-center gap-4">
          <h1 className="text-xl md:text-2xl tracking-widest nasalization">MISSION_TRACKER</h1>
        </Link>
        <Link href="/" className="text-xs nasalization border border-white px-2 py-1 hover:bg-white hover:text-nasa-blue transition-colors">RETURN TO BASE</Link>
      </header>

      <main className="flex-1 p-6 md:p-12 flex flex-col items-center">
        <div className="max-w-4xl w-full bg-white border-2 border-nasa-blue p-8 shadow-[10px_10px_0px_0px_rgba(0,51,160,0.05)]">
          <h2 className="text-2xl text-nasa-blue nasalization mb-6">LIVE_TELEMETRY</h2>
          
          <div className="w-full h-96 bg-gray-200 border-2 border-gray-300 flex items-center justify-center mb-6">
            <p className="font-mono text-gray-500">
              {location 
                ? `LAT: ${location.lat.toFixed(4)} // LNG: ${location.lng.toFixed(4)}`
                : "INITIALIZING_LINK..."}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-nasa-blue text-white p-4 font-mono text-xs">
              STATUS: CONNECTED
            </div>
            <div className="bg-nasa-red text-white p-4 font-mono text-xs">
              SIGNAL: OPTIMAL
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
