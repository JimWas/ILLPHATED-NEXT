const twitchPlayerUrl =
  "https://player.twitch.tv/?channel=strykerusa" +
  "&parent=illphated.com" +
  "&parent=www.illphated.com" +
  "&autoplay=true" +
  "&muted=true";

export default function SitewideTwitchPlayer() {
  return (
    <aside
      className="w-full border-b-4 border-nasa-red bg-black p-2"
      aria-label="StrykerUSA Twitch stream"
    >
      <iframe
        src={twitchPlayerUrl}
        title="StrykerUSA live on Twitch"
        className="mx-auto block h-[300px] w-full max-w-[960px] md:h-[540px]"
        allow="autoplay; fullscreen"
        allowFullScreen
      />
    </aside>
  );
}
