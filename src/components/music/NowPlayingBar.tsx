import { Play, Pause, SkipBack, SkipForward, Volume2, Repeat, Shuffle, Mic2, MonitorSpeaker } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { useMusic } from "@/lib/MusicContext";

function formatTime(time: number) {
  if (!time || isNaN(time) || !isFinite(time)) return "0:00";
  const m = Math.floor(time / 60);
  const s = Math.floor(time % 60);
  return `${m}:${s < 10 ? "0" : ""}${s}`;
}

export function NowPlayingBar() {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    togglePlay,
    seek,
    setVolume,
  } = useMusic();

  const hasTrack = !!currentTrack;
  const effectiveDuration = duration || currentTrack?.duration || 0;

  return (
    <div className="fixed bottom-0 left-0 right-0 h-[90px] bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-t border-border px-4 flex items-center justify-between z-50">
      {/* Left: Track Info */}
      <div className="flex items-center gap-4 w-[30%] min-w-[180px]">
        {hasTrack ? (
          <img
            src={currentTrack!.coverUrl}
            alt={currentTrack!.title}
            className="h-14 w-14 rounded-md object-cover bg-elevated"
          />
        ) : (
          <div className="h-14 w-14 rounded-md bg-elevated" />
        )}
        <div className="flex flex-col truncate">
          <span className="text-sm font-medium text-foreground truncate">
            {currentTrack?.title ?? "Nothing playing"}
          </span>
          <span className="text-xs text-muted-foreground truncate">
            {currentTrack?.artist ?? "Select a track to start"}
          </span>
        </div>
      </div>

      {/* Center: Playback Controls & Scrubber */}
      <div className="flex flex-col items-center max-w-[45%] w-full gap-2">
        <div className="flex items-center gap-6">
          <button
            disabled={!hasTrack}
            className="text-muted-foreground hover:text-foreground transition-colors disabled:opacity-40"
          >
            <Shuffle className="h-4 w-4" />
          </button>
          <button
            disabled={!hasTrack}
            className="text-muted-foreground hover:text-foreground transition-colors disabled:opacity-40"
          >
            <SkipBack className="h-5 w-5 fill-current" />
          </button>

          <button
            onClick={togglePlay}
            disabled={!hasTrack}
            className="h-8 w-8 rounded-full bg-foreground text-background grid place-items-center hover:scale-105 transition-transform disabled:opacity-40 disabled:hover:scale-100"
          >
            {isPlaying ? (
              <Pause className="h-4 w-4 fill-current" />
            ) : (
              <Play className="h-4 w-4 fill-current translate-x-[1px]" />
            )}
          </button>

          <button
            disabled={!hasTrack}
            className="text-muted-foreground hover:text-foreground transition-colors disabled:opacity-40"
          >
            <SkipForward className="h-5 w-5 fill-current" />
          </button>
          <button
            disabled={!hasTrack}
            className="text-muted-foreground hover:text-foreground transition-colors disabled:opacity-40"
          >
            <Repeat className="h-4 w-4" />
          </button>
        </div>

        <div className="flex items-center w-full gap-2 text-xs text-muted-foreground font-medium">
          <span className="w-10 text-right tabular-nums">{formatTime(currentTime)}</span>
          <Slider
            value={[Math.min(currentTime, effectiveDuration || 0)]}
            max={effectiveDuration || 100}
            step={1}
            disabled={!hasTrack}
            onValueChange={(val) => {
              if (val[0] !== undefined) seek(val[0]);
            }}
            className="flex-1"
          />
          <span className="w-10 text-left tabular-nums">{formatTime(effectiveDuration)}</span>
        </div>
      </div>

      {/* Right: Extra Controls & Volume */}
      <div className="flex items-center justify-end gap-4 w-[30%] min-w-[180px]">
        <div className="hidden lg:flex items-center gap-1 border border-primary/30 bg-primary/10 px-2 py-0.5 rounded text-[10px] uppercase font-bold text-primary tracking-wider">
          320kbps
        </div>
        <button className="text-muted-foreground hover:text-foreground transition-colors hidden sm:block">
          <Mic2 className="h-4 w-4" />
        </button>
        <button className="text-muted-foreground hover:text-foreground transition-colors hidden sm:block">
          <MonitorSpeaker className="h-4 w-4" />
        </button>
        <div className="flex items-center gap-2 w-24">
          <Volume2 className="h-4 w-4 text-muted-foreground" />
          <Slider
            value={[Math.round(volume * 100)]}
            max={100}
            step={1}
            onValueChange={(val) => {
              if (val[0] !== undefined) setVolume(val[0] / 100);
            }}
            className="flex-1"
          />
        </div>
      </div>
    </div>
  );
}