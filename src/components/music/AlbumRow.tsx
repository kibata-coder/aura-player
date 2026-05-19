import { Play } from "lucide-react";

export type Album = {
  title: string;
  artist: string;
  cover: string;
  quality: string;
};

export function AlbumRow({ title, albums }: { title: string; albums: Album[] }) {
  return (
    <section className="mt-10">
      <div className="flex items-end justify-between mb-4">
        <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
        <button className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground">
          See all
        </button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {albums.map((a) => (
          <article
            key={a.title}
            className="group rounded-xl bg-card p-3 hover:bg-elevated transition-colors cursor-pointer"
          >
            <div className="relative">
              <img
                src={a.cover}
                alt={`${a.title} cover`}
                width={300}
                height={300}
                loading="lazy"
                className="w-full aspect-square object-cover rounded-lg"
              />
              <button
                className="absolute bottom-2 right-2 h-10 w-10 grid place-items-center rounded-full bg-[image:var(--gradient-accent)] text-primary-foreground shadow-[var(--shadow-glow)] opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all"
                aria-label={`Play ${a.title}`}
              >
                <Play className="h-4 w-4" fill="currentColor" />
              </button>
            </div>
            <div className="mt-3 min-w-0">
              <p className="text-sm font-medium truncate">{a.title}</p>
              <p className="text-xs text-muted-foreground truncate">{a.artist}</p>
              <span className="mt-2 inline-block text-[10px] font-semibold text-hi-res border border-hi-res/30 bg-hi-res/10 rounded px-1.5 py-0.5">
                {a.quality}
              </span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}