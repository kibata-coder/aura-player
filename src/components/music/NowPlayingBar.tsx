import { Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, Volume2 } from "lucide-react";
import { useMusic } from "@/lib/MusicContext";

export function NowPlayingBar() {
  const { currentTrack, isPlaying, setIsPlaying } = useMusic();

  return (
    <footer className="h-20 border-t border-border bg-card/80 backdrop-blur px-4 flex items-center gap-4">
      <div className="flex items-center gap-3 w-64 min-w-0">
        {currentTrack && (
          <>
            <img
              src={currentTrack.coverUrl}
              alt={currentTrack.title}
              className="h-12 w-12 rounded object-cover bg-elevated"
            />
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">{currentTrack.title}</p>
              <p className="text-xs text-muted-foreground truncate">{currentTrack.artist}</p>
            </div>
          </>
        )}
      </div>

      <div className="flex-1 flex flex-col items-center gap-1">
        <div className="flex items-center gap-4 text-muted-foreground">
          <button className="hover:text-foreground"><Shuffle className="h-4 w-4" /></button>
          <button className="hover:text-foreground"><SkipBack className="h-4 w-4" /></button>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="h-9 w-9 grid place-items-center rounded-full bg-foreground text-background hover:scale-105 transition-transform"
          >
            {isPlaying ? <Pause className="h-4 w-4" fill="currentColor" /> : <Play className="h-4 w-4" fill="currentColor" />}
          </button>
          <button className="hover:text-foreground"><SkipForward className="h-4 w-4" /></button>
          <button className="hover:text-foreground"><Repeat className="h-4 w-4" /></button>
        </div>
        <div className="w-full max-w-xl h-1 rounded-full bg-elevated overflow-hidden">
          <div className="h-full w-0 bg-primary" />
        </div>
      </div>

      <div className="w-64 flex items-center justify-end gap-3 text-muted-foreground">
        <span className="text-[10px] font-semibold text-hi-res border border-hi-res/30 bg-hi-res/10 rounded px-1.5 py-0.5">
          FLAC 1411 kbps
        </span>
        <Volume2 className="h-4 w-4" />
        <div className="w-24 h-1 rounded-full bg-elevated overflow-hidden">
          <div className="h-full w-2/3 bg-foreground/70" />
        </div>
      </div>
    </footer>
  );
}
