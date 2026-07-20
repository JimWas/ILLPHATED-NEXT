"use client";

import Script from "next/script";

declare global {
  interface Window {
    Rumble?: (action: string, options: { video: string; div: string }) => void;
  }
}

const videoId = "v7asn2s";
const playerId = `rumble_${videoId}`;

export default function RumbleEmbed() {
  const initializePlayer = () => {
    window.Rumble?.("play", { video: videoId, div: playerId });
  };

  return (
    <section
      className="mt-8 border-2 border-nasa-blue bg-gray-950 p-2 shadow-[10px_10px_0px_0px_rgba(239,51,64,0.2)]"
      aria-label="Featured Rumble video"
    >
      <div id={playerId} className="aspect-video w-full" />
      <Script
        id="rumble-embed-loader"
        src={`https://rumble.com/embedJS/u4.${videoId}/`}
        strategy="afterInteractive"
        onLoad={initializePlayer}
        onReady={initializePlayer}
      />
    </section>
  );
}
