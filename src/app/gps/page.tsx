"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import dynamic from "next/dynamic";

const Map = dynamic(() => import("@/components/Map"), { ssr: false });

interface LocationData {
  latitude: number;
  longitude: number;
  device_name: string;
  created_at: string;
}

export default function GPSPage() {
  const [latest, setLatest] = useState<LocationData | null>(null);

  useEffect(() => {
    const fetchLatest = async () => {
      const { data, error } = await supabase
        .from("location_telemetry")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (data) setLatest(data);
    };

    fetchLatest();

    // Subscribe to new telemetry
    const channel = supabase
      .channel("telemetry")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "location_telemetry" },
        (payload) => {
          setLatest(payload.new as LocationData);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
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
          
          <div className="w-full h-96 bg-gray-900 border-2 border-nasa-blue mb-6">
            {latest 
              ? (
                <Map lat={latest.latitude} lng={latest.longitude} />
              )
              : <div className="h-full flex items-center justify-center text-red-500">WAITING_FOR_UPLINK...</div>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-nasa-blue text-white p-4 font-mono text-xs">
              STATUS: {latest ? "CONNECTED" : "AWAITING_SIGNAL"}
            </div>
            <div className="bg-nasa-red text-white p-4 font-mono text-xs">
              DEVICE: {latest ? latest.device_name : "N/A"}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
