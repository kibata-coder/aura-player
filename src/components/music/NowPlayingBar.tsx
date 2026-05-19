import {
  Shuffle,
  SkipBack,
  Play,
  Pause,
  SkipForward,
  Repeat,
  Volume2,
  ListMusic,
  Heart,
  Mic2,
  Maximize2,
} from "lucide-react";
import { useEffect, useState } from "react";
import albumHero from "@/assets/album-hero.jpg";

export function NowPlayingBar() {
  const [playing, setPlaying] = useState(true);
  const [progress, setProgress] = useState(34);
  const [volume, setVolume] = useState(72);

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => {
      setProgress((p) => (p >= 100 ? 0 : p + 0.3));
    }, 500);
    return () => clearInterval(id);
  }, [playing]);

  const total = 4 * 60 + 12;
  const cur = Math.floor((progress / 100) * total);
  const fmt = (s: number) =>
    `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  return (
    <footer className="shrink-0 border-t border-border bg-panel/95 backdrop-blur-xl px-4 py-3">
      <div className="grid grid-cols-3 items-center gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <img
            src={albumHero}
            alt="Now playing cover"
            width={56}
            height={56}
            className="h-14 w-14 rounded-md object-cover shadow-[var(--shadow-glow)]"
          />
          <div className="min-w-0">
            <p className="text-sm font-semibold truncate">Aurora Drift</p>
            <p className="text-xs text-muted-foreground truncate">
              Aurora Sound · Nebula Frequencies
            </p>
          </div>
          <button className="ml-2 text-muted-foreground hover:text-primary transition-colors">
            <Heart className="h-4 w-4" />
          </button>
        </div>

        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-5">
            <button className="text-muted-foreground hover:text-foreground" aria-label="Shuffle">
              <Shuffle className="h-4 w-4" />
            </button>
            <button className="text-muted-foreground hover:text-foreground" aria-label="Previous">
              <SkipBack className="h-5 w-5" fill="currentColor" />
            </button>
            <button
              onClick={() => setPlaying((p) => !p)}
              className="h-10 w-10 grid place-items-center rounded-full bg-foreground text-background hover:scale-105 transition-transform shadow-[var(--shadow-glow)]"
              aria-label={playing ? "Pause" : "Play"}
            >
              {playing ? (
                <Pause className="h-4 w-4" fill="currentColor" />
              ) : (
                <Play className="h-4 w-4 translate-x-[1px]" fill="currentColor" />
              )}
            </button>
            <button className="text-muted-foreground hover:text-foreground" aria-label="Next">
              <SkipForward className="h-5 w-5" fill="currentColor" />
            </button>
            <button className="text-primary" aria-label="Repeat">
              <Repeat className="h-4 w-4" />
            </button>
          </div>

          <div className="w-full max-w-xl flex items-center gap-3">
            <span className="text-[10px] text-muted-foreground tabular-nums w-9 text-right">
              {fmt(cur)}
            </span>
            <div className="group relative flex-1 h-1 rounded-full bg-elevated cursor-pointer">
              <div
                className="absolute inset-y-0 left-0 rounded-full bg-[image:var(--gradient-accent)]"
                style={{ width: `${progress}%` }}
              />
              <div
                className="absolute top-1/2 -translate-y-1/2 h-3 w-3 rounded-full bg-foreground shadow opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ left: `calc(${progress}% - 6px)` }}
              />
            </div>
            <span className="text-[10px] text-muted-foreground tabular-nums w-9">
              {fmt(total)}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3">
          <div className="hidden lg:flex items-center gap-2 rounded-full border border-hi-res/40 bg-hi-res/10 px-3 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-hi-res animate-pulse" />
            <span className="text-[11px] font-semibold text-hi-res tracking-wide">
              FLAC · 1411 kbps · 24/96
            </span>
          </div>
          <button className="text-muted-foreground hover:text-foreground" aria-label="Lyrics">
            <Mic2 className="h-4 w-4" />
          </button>
          <button className="text-muted-foreground hover:text-foreground" aria-label="Queue">
            <ListMusic className="h-4 w-4" />
          </button>
          <div className="hidden sm:flex items-center gap-2">
            <Volume2 className="h-4 w-4 text-muted-foreground" />
            <div
              className="relative h-1 w-24 rounded-full bg-elevated cursor-pointer"
              onClick={(e) => {
                const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
                setVolume(Math.round(((e.clientX - rect.left) / rect.width) * 100));
              }}
            >
              <div
                className="absolute inset-y-0 left-0 rounded-full bg-foreground"
                style={{ width: `${volume}%` }}
              />
            </div>
          </div>
          <button className="text-muted-foreground hover:text-foreground" aria-label="Fullscreen">
            <Maximize2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </footer>
  );
}