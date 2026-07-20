const rumblePlayerUrl =
  "https://rumble.com/embed/v7asn2s/?pub=u4&autoplay=2";

export default function RumbleEmbed() {
  return (
    <section
      className="mt-8 border-2 border-nasa-blue bg-gray-950 p-2 shadow-[10px_10px_0px_0px_rgba(239,51,64,0.2)]"
      aria-label="Featured Rumble video"
    >
      <iframe
        src={rumblePlayerUrl}
        title="Featured Illphated video on Rumble"
        className="aspect-video w-full"
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
      />
    </section>
  );
}
