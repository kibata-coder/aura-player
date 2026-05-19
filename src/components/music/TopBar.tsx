import { ChevronLeft, ChevronRight, Bell, Search } from "lucide-react";

export function TopBar() {
  return (
    <header className="sticky top-0 z-10 flex items-center justify-between gap-4 px-6 py-3 bg-background/70 backdrop-blur-xl border-b border-border">
      <div className="flex items-center gap-2">
        <button className="h-8 w-8 grid place-items-center rounded-full bg-elevated text-muted-foreground hover:text-foreground">
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button className="h-8 w-8 grid place-items-center rounded-full bg-elevated text-muted-foreground hover:text-foreground">
          <ChevronRight className="h-4 w-4" />
        </button>
        <div className="ml-3 hidden sm:flex items-center gap-2 h-9 w-80 max-w-full rounded-full bg-elevated px-3 border border-transparent focus-within:border-primary/40 transition-colors">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            placeholder="Search artists, albums, FLAC tracks…"
            className="bg-transparent outline-none text-sm flex-1 placeholder:text-muted-foreground"
          />
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className="hidden md:inline text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
          Storage 12.4 / 500 GB
        </span>
        <button className="h-9 w-9 grid place-items-center rounded-full bg-elevated text-muted-foreground hover:text-foreground">
          <Bell className="h-4 w-4" />
        </button>
        <div className="h-9 w-9 rounded-full bg-[image:var(--gradient-accent)] grid place-items-center text-xs font-semibold text-primary-foreground">
          AK
        </div>
      </div>
    </header>
  );
}