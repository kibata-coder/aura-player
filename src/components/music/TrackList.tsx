import { Play, Download, Clock, Plus, MoreHorizontal } from "lucide-react";
import { useState } from "react";

export type Track = {
  id: number;
  title: string;
  artist: string;
  album: string;
  cover: string;
  quality: "Hi-Res FLAC" | "24-bit" | "FLAC" | "MQA";
  bitrate: string;
  duration: string;
};

function QualityBadge({ quality }: { quality: Track["quality"] }) {
  const isHiRes = quality === "Hi-Res FLAC" || quality === "24-bit";
  return (
    <span
      className={`inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-semibold tracking-wide ${
        isHiRes
          ? "bg-hi-res/15 text-hi-res border border-hi-res/30"
          : "bg-primary/10 text-primary border border-primary/25"
      }`}
    >
      {quality}
    </span>
  );
}

function DownloadButton() {
  const [progress, setProgress] = useState<number | null>(null);

  const start = () => {
    if (progress !== null) return;
    setProgress(0);
    const id = setInterval(() => {
      setProgress((p) => {
        if (p === null) return null;
        if (p >= 100) {
          clearInterval(id);
          setTimeout(() => setProgress(null), 900);
          return 100;
        }
        return p + 8;
      });
    }, 120);
  };

  if (progress !== null) {
    const r = 9;
    const c = 2 * Math.PI * r;
    return (
      <div className="relative h-7 w-7 grid place-items-center">
        <svg className="absolute inset-0 -rotate-90" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r={r} stroke="currentColor" strokeOpacity="0.15" strokeWidth="2" fill="none" />
          <circle
            cx="12"
            cy="12"
            r={r}
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            strokeDasharray={c}
            strokeDashoffset={c - (c * Math.min(progress, 100)) / 100}
            className="text-primary transition-[stroke-dashoffset] duration-150"
            strokeLinecap="round"
          />
        </svg>
        <span className="text-[9px] text-primary font-medium">{Math.min(progress, 100)}</span>
      </div>
    );
  }

  return (
    <button
      onClick={start}
      className="h-7 w-7 grid place-items-center rounded-full text-muted-foreground hover:text-primary hover:bg-elevated transition-colors"
      aria-label="Download lossless"
    >
      <Download className="h-4 w-4" />
    </button>
  );
}

export function TrackList({ tracks }: { tracks: Track[] }) {
  return (
    <div className="rounded-xl border border-border bg-card/60 backdrop-blur">
      <div className="grid grid-cols-[40px_minmax(0,1fr)_140px_110px_60px_90px] items-center gap-4 px-5 py-3 text-[11px] uppercase tracking-[0.15em] text-muted-foreground border-b border-border">
        <span className="text-center">#</span>
        <span>Title</span>
        <span className="hidden md:block">Quality</span>
        <span className="hidden md:block">Bitrate</span>
        <span className="grid place-items-center"><Clock className="h-3.5 w-3.5" /></span>
        <span />
      </div>

      <ul>
        {tracks.map((t, i) => (
          <li
            key={t.id}
            className="group grid grid-cols-[40px_minmax(0,1fr)_140px_110px_60px_90px] items-center gap-4 px-5 py-2.5 hover:bg-elevated/60 transition-colors border-b border-border/40 last:border-b-0"
          >
            <div className="relative h-7 grid place-items-center text-muted-foreground tabular-nums text-sm">
              <span className="group-hover:opacity-0 transition-opacity">
                {String(i + 1).padStart(2, "0")}
              </span>
              <button
                className="absolute inset-0 grid place-items-center opacity-0 group-hover:opacity-100 transition-opacity text-foreground"
                aria-label="Play"
              >
                <Play className="h-3.5 w-3.5" fill="currentColor" />
              </button>
            </div>

            <div className="flex items-center gap-3 min-w-0">
              <img
                src={t.cover}
                alt={`${t.album} cover`}
                width={40}
                height={40}
                loading="lazy"
                className="h-10 w-10 rounded object-cover"
              />
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">{t.title}</p>
                <p className="text-xs text-muted-foreground truncate">{t.artist}</p>
              </div>
            </div>

            <div className="hidden md:flex"><QualityBadge quality={t.quality} /></div>
            <div className="hidden md:block text-xs text-muted-foreground tabular-nums">
              {t.bitrate}
            </div>
            <div className="text-xs text-muted-foreground tabular-nums text-center">
              {t.duration}
            </div>

            <div className="flex items-center justify-end gap-1">
              <button
                className="h-7 w-7 grid place-items-center rounded-full text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Add to queue"
                title="+ Add to Queue"
              >
                <Plus className="h-4 w-4" />
              </button>
              <DownloadButton />
              <button
                className="h-7 w-7 grid place-items-center rounded-full text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="More"
              >
                <MoreHorizontal className="h-4 w-4" />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}