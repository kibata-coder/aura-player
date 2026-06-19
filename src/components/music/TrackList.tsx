import { Play, Clock, Download, Loader2, Check, AlertCircle } from "lucide-react";
import { useMusic } from "@/lib/MusicContext";
import { CleanTrack } from "@/lib/music-api";

export function TrackList() {
  const { searchResults, currentTrack, setCurrentTrack, setIsPlaying, downloads, requestDownload } = useMusic();

  const handlePlay = (track: CleanTrack) => {
    setCurrentTrack(track);
    setIsPlaying(true);
  };

  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return "0:00";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (searchResults.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-12 text-center h-64">
        <div className="w-16 h-16 bg-elevated rounded-full flex items-center justify-center mb-4">
          <Clock className="w-6 h-6 text-muted-foreground" />
        </div>
        <h2 className="text-xl font-semibold text-foreground mb-2">Listen to anything</h2>
        <p className="text-sm text-muted-foreground max-w-md">
          Search for an artist, album, or track in the top bar to pull direct streams from the proxy network.
        </p>
      </div>
    );
  }

  return (
    <div className="px-6 pb-24">
      {/* Table Header */}
      <div className="grid grid-cols-[16px_1fr_1fr_minmax(120px,1fr)_48px] items-center gap-4 px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider border-b border-border mb-2">
        <div className="text-center">#</div>
        <div>Title</div>
        <div className="hidden sm:block">Artist</div>
        <div className="hidden md:block">Album</div>
        <div className="text-right flex justify-end">
          <Clock className="h-4 w-4" />
        </div>
      </div>

      {/* Track Rows */}
      <div className="flex flex-col gap-1">
        {searchResults.map((track, index) => {
          const isCurrentlyPlaying = currentTrack?.id === track.id;

          return (
            <div
              key={track.id}
              onClick={() => handlePlay(track)}
              className={`group grid grid-cols-[16px_1fr_1fr_minmax(120px,1fr)_48px] items-center gap-4 rounded-md px-4 py-2 hover:bg-white/5 transition-colors cursor-pointer ${
                isCurrentlyPlaying ? "bg-white/5" : ""
              }`}
            >
              <div className="text-center relative flex items-center justify-center">
                <span className={`text-sm ${isCurrentlyPlaying ? "text-primary hidden group-hover:hidden" : "text-muted-foreground group-hover:hidden"}`}>
                  {index + 1}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePlay(track);
                  }}
                  className={`absolute opacity-0 group-hover:opacity-100 transition-opacity ${isCurrentlyPlaying ? "opacity-100" : ""}`}
                >
                  <Play className={`h-4 w-4 ${isCurrentlyPlaying ? "text-primary" : "text-foreground"}`} fill="currentColor" />
                </button>
              </div>
              
              <div className="flex items-center gap-3 overflow-hidden">
                <img
                  src={track.coverUrl}
                  alt={track.title}
                  className="h-10 w-10 flex-shrink-0 rounded bg-elevated object-cover"
                />
                <div className="flex flex-col truncate">
                  <span className={`truncate text-sm font-medium ${isCurrentlyPlaying ? "text-primary" : "text-foreground"}`}>
                    {track.title}
                  </span>
                  {/* Show artist here on mobile since column is hidden */}
                  <span className="sm:hidden truncate text-xs text-muted-foreground">
                    {track.artist}
                  </span>
                </div>
              </div>

              <div className="hidden sm:block truncate text-sm text-muted-foreground">
                {track.artist}
              </div>
              
              <div className="hidden md:block truncate text-sm text-muted-foreground">
                {track.album}
              </div>

              <div className="flex items-center justify-end gap-3 text-sm text-muted-foreground">
                {(() => {
                  const dl = downloads.find((d) => d.track_id === track.id);
                  if (dl?.status === "downloading" || dl?.status === "pending") {
                    return (
                      <div className="flex items-center gap-1 text-primary">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="text-xs tabular-nums w-8 text-right">
                          {Math.round(dl.progress)}%
                        </span>
                      </div>
                    );
                  }
                  if (dl?.status === "completed") {
                    return (
                      <div className="text-primary" title="Downloaded">
                        <Check className="h-4 w-4" />
                      </div>
                    );
                  }
                  if (dl?.status === "failed") {
                    return (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          requestDownload(track);
                        }}
                        className="text-destructive hover:opacity-80 transition-opacity"
                        title="Download failed — retry"
                      >
                        <AlertCircle className="h-4 w-4" />
                      </button>
                    );
                  }
                  return (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        requestDownload(track);
                      }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity hover:text-primary"
                      title="Download"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                  );
                })()}
                <span>{formatTime(track.duration)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
