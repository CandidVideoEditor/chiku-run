import { useCallback, useEffect, useRef, useState } from "react";
import { CRY_VIDEO, loadSprites, UI, VIDEOS } from "@/lib/game/assets";
import { ChikuGame, type GameStatus } from "@/lib/game/engine";

const EMPTY: GameStatus = {
  score: 0,
  coins: 0,
  lives: 3,
  distance: 0,
  combo: 1,
  shield: 0,
  x3: 0,
  slow: 0,
  super: 0,
  best: 0,
};

type Screen = "loading" | "menu" | "playing" | "paused" | "over";

export function RunChikuGame() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const gameRef = useRef<ChikuGame | null>(null);
  const [screen, setScreen] = useState<Screen>("loading");
  const [status, setStatus] = useState<GameStatus>(EMPTY);
  const [result, setResult] = useState<GameStatus>(EMPTY);

  useEffect(() => {
    let disposed = false;
    void loadSprites().then((sprites) => {
      const canvas = canvasRef.current;
      if (disposed || !canvas) return;
      const game = new ChikuGame(
        canvas,
        sprites,
        (s) => setStatus(s),
        (s) => {
          setResult(s);
          setScreen("over");
        },
      );
      gameRef.current = game;
      setStatus((prev) => ({ ...prev, best: Number(localStorage.getItem("run-chiku-run:best") ?? 0) }));
      setScreen("menu");
      const onResize = () => game.resize();
      window.addEventListener("resize", onResize);
      return () => window.removeEventListener("resize", onResize);
    });
    return () => {
      disposed = true;
      gameRef.current?.destroy();
    };
  }, []);

  const start = useCallback(() => {
    gameRef.current?.resize();
    gameRef.current?.start();
    setScreen("playing");
  }, []);

  const togglePause = useCallback(() => {
    const game = gameRef.current;
    if (!game) return;
    setScreen((prev) => {
      if (prev === "playing") {
        game.pause();
        return "paused";
      }
      if (prev === "paused") {
        game.resume();
        return "playing";
      }
      return prev;
    });
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const game = gameRef.current;
      if (!game) return;
      if (e.code === "Space" || e.code === "ArrowUp" || e.code === "KeyW") {
        e.preventDefault();
        if (screen === "menu" || screen === "over") start();
        else game.jump();
      } else if (e.code === "KeyP" || e.code === "Escape") {
        togglePause();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [screen, start, togglePause]);

  // touch: tap anywhere to jump
  const onTouchStart = (e: React.TouchEvent) => {
    if (screen === "menu" || screen === "over") {
      start();
      return;
    }
    if (screen === "playing") gameRef.current?.jump();
  };

  const timerChips = [
    { on: status.shield > 0, icon: UI.shield, label: `${Math.ceil(status.shield)}s` },
    { on: status.x3 > 0, icon: UI.x3, label: `${Math.ceil(status.x3)}s` },
    { on: status.slow > 0, icon: UI.slow, label: `${Math.ceil(status.slow)}s` },
    { on: status.super > 0, icon: UI.lollypop, label: `${Math.ceil(status.super)}s` },
  ].filter((c) => c.on);

  return (
    <div
      className="fixed inset-0 h-[100dvh] w-screen overflow-hidden bg-plum"
      onTouchStart={onTouchStart}
    >
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src={VIDEOS.background}
        autoPlay
        muted
        loop
        playsInline
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-plum/40" />
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

      {/* Heading: rendered exactly once, fixed at top-center, never scrolls */}
      <img
        src={UI.heading}
        alt="Run Chiku Run"
        className="pointer-events-none absolute left-1/2 top-2 z-30 w-[46vw] max-w-[520px] min-w-[220px] -translate-x-1/2 drop-shadow-2xl sm:top-4"
      />

      {/* HUD */}
      {(screen === "playing" || screen === "paused") && (
        <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between gap-3 p-3 sm:p-5">
          <div className="flex flex-col gap-2">
            <div className="hud-panel">
              <span className="hud-label">Score</span>
              <span className="hud-value">{status.score.toLocaleString()}</span>
            </div>
            <div className="flex gap-2">
              <div className="hud-panel">
                <img src={UI.coinPaw} alt="Coins" className="h-5 w-5" />
                <span className="hud-value text-base">{status.coins}</span>
              </div>
              <div className="hud-panel">
                <span className="hud-label">{status.distance}m</span>
              </div>
              {status.combo > 1 && (
                <div className="hud-panel animate-pulse">
                  <span className="hud-label">x{status.combo} combo</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col items-end gap-2">
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <img
                  key={i}
                  src={UI.heart}
                  alt=""
                  className={`h-7 w-7 drop-shadow transition-all ${
                    i < status.lives ? "opacity-100" : "scale-75 opacity-20 grayscale"
                  }`}
                />
              ))}
            </div>
            {timerChips.length > 0 && (
              <div className="flex gap-1">
                {timerChips.map((c, i) => (
                  <div key={i} className="hud-panel px-2 py-1">
                    <img src={c.icon} alt="" className="h-5 w-5" />
                    <span className="hud-label">{c.label}</span>
                  </div>
                ))}
              </div>
            )}
            <button onClick={togglePause} className="btn-candy pointer-events-auto px-4 py-1 text-sm">
              {screen === "paused" ? "Resume" : "Pause"}
            </button>
          </div>
        </div>
      )}

      {/* Overlays */}
      {screen === "loading" && (
        <div className="overlay">
          <p className="font-display text-2xl text-cream">Unwrapping candy…</p>
        </div>
      )}

      {screen === "menu" && (
        <div className="overlay gap-5 pt-[26vh] text-center">
          <button onClick={start} className="btn-candy text-xl">
            Start Running
          </button>
          <p className="max-w-md text-sm text-cream/90">
            <b>Space / ↑ / tap</b> to jump · <b>P</b> to pause
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { icon: UI.shield, text: "Shield" },
              { icon: UI.x3, text: "3x Score" },
              { icon: UI.slow, text: "Slow 15s" },
              { icon: UI.lollypop, text: "Super Chiku 15s" },
            ].map((p) => (
              <div key={p.text} className="hud-panel">
                <img src={p.icon} alt="" className="h-6 w-6" />
                <span className="hud-label">{p.text}</span>
              </div>
            ))}
          </div>
          {status.best > 0 && <p className="font-display text-lg text-gold">Best: {status.best}</p>}
        </div>
      )}

      {screen === "paused" && (
        <div className="overlay gap-4">
          <h2 className="font-display text-4xl text-cream">Paused</h2>
          <button onClick={togglePause} className="btn-candy">
            Resume
          </button>
        </div>
      )}

      {screen === "over" && (
        <div className="overlay gap-4 pt-[22vh] text-center">
          {CRY_VIDEO ? (
            <video
              src={CRY_VIDEO}
              className="h-40 w-40 rounded-full object-cover mix-blend-screen"
              autoPlay
              muted
              loop
              playsInline
            />
          ) : (
            <img src={UI.lollypop} alt="" className="h-24 w-24 animate-bounce" />
          )}
          <h2 className="font-display text-4xl text-cream">Chiku tripped!</h2>
          <div className="flex gap-3">
            <div className="hud-panel flex-col items-center">
              <span className="hud-label">Score</span>
              <span className="hud-value">{result.score.toLocaleString()}</span>
            </div>
            <div className="hud-panel flex-col items-center">
              <span className="hud-label">Coins</span>
              <span className="hud-value">{result.coins}</span>
            </div>
            <div className="hud-panel flex-col items-center">
              <span className="hud-label">Distance</span>
              <span className="hud-value">{result.distance}m</span>
            </div>
          </div>
          <p className="font-display text-lg text-gold">Best: {result.best.toLocaleString()}</p>
          <button onClick={start} className="btn-candy text-xl">
            Run again
          </button>
        </div>
      )}
    </div>
  );
}
