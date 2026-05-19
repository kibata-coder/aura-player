import { Home, Search, Library, Download, Plus, Heart, Radio } from "lucide-react";

const playlists = [
  "Liked Songs",
  "Hi-Res Discoveries",
  "Late Night Jazz",
  "Vinyl Mastered",
  "Ambient Focus",
  "Studio Sessions",
  "Acoustic Lab",
  "Bass & Sub",
  "Modern Classical",
  "Lossless Indie",
  "Synthwave Drive",
  "Daily Mix 01",
];

const nav = [
  { icon: Home, label: "Home", active: true },
  { icon: Search, label: "Search" },
  { icon: Library, label: "Local Library" },
  { icon: Download, label: "Download Queue", badge: 3 },
  { icon: Radio, label: "Radio" },
];

export function Sidebar() {
  return (
    <aside className="hidden md:flex w-64 shrink-0 flex-col bg-panel border-r border-border h-full">
      <div className="px-6 py-5 flex items-center gap-2">
        <div className="h-8 w-8 rounded-md bg-[image:var(--gradient-accent)] shadow-[var(--shadow-glow)]" />
        <span className="font-semibold tracking-tight text-lg">Audire</span>
      </div>

      <nav className="px-3 space-y-1">
        {nav.map(({ icon: Icon, label, active, badge }) => (
          <button
            key={label}
            className={`w-full group flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
              active
                ? "bg-elevated text-primary"
                : "text-muted-foreground hover:text-foreground hover:bg-elevated/60"
            }`}
          >
            <Icon className="h-4 w-4" />
            <span className="flex-1 text-left">{label}</span>
            {badge != null && (
              <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-primary/15 text-primary">
                {badge}
              </span>
            )}
          </button>
        ))}
      </nav>

      <div className="px-6 mt-6 mb-2 flex items-center justify-between">
        <span className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
          Playlists
        </span>
        <button className="text-muted-foreground hover:text-foreground transition-colors">
          <Plus className="h-4 w-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-3 pb-4 space-y-0.5">
        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm hover:bg-elevated/60 text-foreground">
          <div className="h-7 w-7 rounded bg-[image:var(--gradient-accent)] flex items-center justify-center">
            <Heart className="h-3.5 w-3.5 text-primary-foreground" fill="currentColor" />
          </div>
          <span className="truncate">Liked Songs</span>
        </button>
        {playlists.slice(1).map((p) => (
          <button
            key={p}
            className="w-full text-left px-3 py-1.5 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-elevated/60 truncate"
          >
            {p}
          </button>
        ))}
      </div>

      <div className="px-4 py-3 border-t border-border text-[11px] text-muted-foreground flex items-center justify-between">
        <span>Output</span>
        <span className="text-primary font-medium">DAC · 24/192</span>
      </div>
    </aside>
  );
}