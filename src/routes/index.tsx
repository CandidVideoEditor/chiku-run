import { createFileRoute } from "@tanstack/react-router";
import { RunChikuGame } from "@/components/game/RunChikuGame";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Run Chiku Run — Candy Endless Runner Game" },
      {
        name: "description",
        content:
          "Play Run Chiku Run: jump, slide and dash through candy worlds, grab coins, dodge elemental monsters and unleash Super Chiku power-ups.",
      },
      { property: "og:title", content: "Run Chiku Run — Candy Endless Runner Game" },
      {
        property: "og:description",
        content:
          "Jump, slide and dash through candy worlds. Collect coins, dodge monsters and go Super Chiku in this browser endless runner.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;700;800&family=Nunito:wght@400;700&display=swap",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="min-h-screen bg-plum px-3 py-5 sm:px-6 sm:py-8">
      <h1 className="sr-only">Run Chiku Run — candy endless runner game</h1>
      <RunChikuGame />
      <p className="mx-auto mt-4 max-w-[1200px] text-center text-sm text-cream/70">
        Space / ↑ / tap to jump · double tap for double jump · ↓ or swipe down to slide · P to pause
      </p>
    </main>
  );
}
