import { createFileRoute } from "@tanstack/react-router";
import { RunChikuGame } from "@/components/game/RunChikuGame";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Run Chiku Run — Candy Endless Runner Game" },
      {
        name: "description",
        content:
          "Play Run Chiku Run: jump through candy worlds, grab coins, dodge elemental monsters and unleash the 15-second Super Chiku power-up.",
      },
      { property: "og:title", content: "Run Chiku Run — Candy Endless Runner Game" },
      {
        property: "og:description",
        content:
          "Jump through candy worlds. Collect coins, dodge monsters and go Super Chiku in this browser endless runner.",
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
    <main className="h-[100dvh] w-screen overflow-hidden bg-plum">
      <h1 className="sr-only">Run Chiku Run — candy endless runner game</h1>
      <RunChikuGame />
    </main>
  );
}
