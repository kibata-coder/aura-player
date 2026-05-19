import { Play, Download, Share2, Heart } from "lucide-react";
import albumHero from "@/assets/album-hero.jpg";

export function Hero() {
  return (
    <section className="relative overflow-hidden rounded-2xl border border-border bg-card">
      <div
        className="absolute inset-0 opacity-60"
        style={{ background: "var(--gradient-hero)" }}
      />
      <div className="relative grid md:grid-cols-[320px_1fr] gap-8 p-6 md:p-10">
        <div className="relative">
          <div className="absolute -inset-6 rounded-3xl bg-primary/10 blur-3xl" />
          <img
            src={albumHero}
            alt="Nebula Frequencies album cover"
            width={1024}
            height={1024}
            className="relative w-full aspect-square object-cover rounded-xl shadow-[var(--shadow-glow)]"
          />
        </div>

        <div className="flex flex-col justify-end">
          <span className="text-[11px] uppercase tracking-[0.2em] text-primary">
            Featured Album · New Release
          </span>
          <h1 className="mt-3 text-4xl md:text-6xl font-bold tracking-tight leading-[1.05]">
            Nebula Frequencies
          </h1>
          <p className="mt-2 text-muted-foreground">
            Aurora Sound · 12 tracks · 2026
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-hi-res/40 bg-hi-res/10 px-2.5 py-1 text-[11px] font-medium text-hi-res">
              <span className="h-1.5 w-1.5 rounded-full bg-hi-res" />
              Hi-Res FLAC · 24-bit / 192 kHz
            </span>
            <span className="inline-flex items-center rounded-full border border-border bg-elevated px-2.5 py-1 text-[11px] text-muted-foreground">
              MQA Studio
            </span>
            <span className="inline-flex items-center rounded-full border border-border bg-elevated px-2.5 py-1 text-[11px] text-muted-foreground">
              Dolby Atmos
            </span>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button className="inline-flex items-center gap-2 rounded-full bg-[image:var(--gradient-accent)] px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow)] hover:scale-[1.02] transition-transform">
              <Play className="h-4 w-4" fill="currentColor" />
              Play
            </button>
            <button className="inline-flex items-center gap-2 rounded-full border border-border bg-elevated px-5 py-3 text-sm font-medium hover:bg-elevated/70 transition-colors">
              <Download className="h-4 w-4" />
              Download Lossless
            </button>
            <button className="h-11 w-11 grid place-items-center rounded-full border border-border bg-elevated hover:text-primary transition-colors">
              <Heart className="h-4 w-4" />
            </button>
            <button className="h-11 w-11 grid place-items-center rounded-full border border-border bg-elevated hover:text-primary transition-colors">
              <Share2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}