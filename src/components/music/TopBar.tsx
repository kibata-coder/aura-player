import { ChevronLeft, ChevronRight, Bell, Search, Loader2 } from "lucide-react";
import { useState } from "react";
import { musicApi } from "@/lib/music-api";
import { useMusic } from "@/lib/MusicContext";

export function TopBar() {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { setSearchResults } = useMusic();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setIsLoading(true);
    const results = await musicApi.searchTracks(query);
    setSearchResults(results);
    setIsLoading(false);
  };

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between gap-4 px-6 py-3 bg-background/70 backdrop-blur-xl border-b border-border">
      <div className="flex items-center gap-2 w-full max-w-xl">
        <button className="h-8 w-8 grid place-items-center rounded-full bg-elevated text-muted-foreground hover:text-foreground shrink-0">
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button className="h-8 w-8 grid place-items-center rounded-full bg-elevated text-muted-foreground hover:text-foreground shrink-0">
          <ChevronRight className="h-4 w-4" />
        </button>
        
        {/* Working Search Form */}
        <form onSubmit={handleSearch} className="ml-3 hidden sm:flex items-center gap-2 h-9 w-80 max-w-full rounded-full bg-elevated px-3 border border-transparent focus-within:border-primary/40 transition-colors">
          {isLoading ? (
            <Loader2 className="h-4 w-4 text-muted-foreground animate-spin shrink-0" />
          ) : (
            <Search className="h-4 w-4 text-muted-foreground shrink-0" />
          )}
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search artists, albums, tracks…"
            className="bg-transparent outline-none text-sm flex-1 placeholder:text-muted-foreground min-w-0"
          />
        </form>
      </div>
      
      <div className="flex items-center gap-3 shrink-0">
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
