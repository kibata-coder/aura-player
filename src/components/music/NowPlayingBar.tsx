import { Play, Pause, SkipBack, SkipForward, Volume2, Repeat, Shuffle, Mic2, MonitorSpeaker } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { useMusic } from "@/lib/MusicContext";
import { useRef, useEffect, useState } from "react";

export function NowPlayingBar() {
  const { currentTrack, isPlaying, setIsPlaying } = useMusic();
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(80);

  // Handle Play/Pause syncing with the actual <audio> tag
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        // We use a promise catch here because browsers sometimes block autoplay
        audioRef.current.play().catch((e) => console.log("Playback prevented:", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrack]);

  // Handle Volume syncing
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  const togglePlay = () => {
    if (!currentTrack) return;
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration || currentTrack?.duration || 0);
    }
  };

  const handleSeek = (value: number[]) => {
    if (audioRef.current && value[0] !== undefined) {
      audioRef.current.currentTime = value[0];
      setCurrentTime(value[0]);
    }
  };

  const formatTime = (time: number) => {
    if (!time || isNaN(time)) return "0:00";
    const m = Math.floor(time / 60);
    const s = Math.floor(time % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (!currentTrack) {
    return null; // Don't show the bar if nothing has been selected yet
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 h-[90px] bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-t border-border px-4 flex items-center justify-between z-50">
      {/* This is the invisible HTML5 Audio Engine that was missing! 
        It streams the audio URL we got from the API.
      */}
      <audio 
        ref={audioRef} 
        src={currentTrack.streamUrl} 
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => setIsPlaying(false)}
        autoPlay={isPlaying}
      />

      {/* Left: Track Info */}
      <div className="flex items-center gap-4 w-[30%] min-w-[180px]">
        <img
          src={currentTrack.coverUrl}
          alt={currentTrack.title}
          className="h-14 w-14 rounded-md object-cover bg-elevated"
        />
        <div className="flex flex-col truncate">
          <span className="text-sm font-medium text-foreground truncate hover:underline cursor-pointer">
            {currentTrack.title}
          </span>
          <span className="text-xs text-muted-foreground truncate hover:underline cursor-pointer">
            {currentTrack.artist}
          </span>
        </div>
      </div>

      {/* Center: Playback Controls & Scrubber */}
      <div className="flex flex-col items-center max-w-[45%] w-full gap-2">
        <div className="flex items-center gap-6">
          <button className="text-muted-foreground hover:text-foreground transition-colors">
            <Shuffle className="h-4 w-4" />
          </button>
          <button className="text-muted-foreground hover:text-foreground transition-colors">
            <SkipBack className="h-5 w-5 fill-current" />
          </button>
          
          <button 
            onClick={togglePlay}
            className="h-8 w-8 rounded-full bg-foreground text-background grid place-items-center hover:scale-105 transition-transform"
          >
            {isPlaying ? (
              <Pause className="h-4 w-4 fill-current" />
            ) : (
              <Play className="h-4 w-4 fill-current translate-x-[1px]" />
            )}
          </button>
          
          <button className="text-muted-foreground hover:text-foreground transition-colors">
            <SkipForward className="h-5 w-5 fill-current" />
          </button>
          <button className="text-muted-foreground hover:text-foreground transition-colors">
            <Repeat className="h-4 w-4" />
          </button>
        </div>
        
        <div className="flex items-center w-full gap-2 text-xs text-muted-foreground font-medium">
          <span className="w-10 text-right">{formatTime(currentTime)}</span>
          <Slider
            defaultValue={[0]}
            value={[currentTime]}
            max={duration || 100}
            step={1}
            onValueChange={handleSeek}
            className="flex-1"
          />
          <span className="w-10 text-left">{formatTime(duration)}</span>
        </div>
      </div>

      {/* Right: Extra Controls & Volume */}
      <div className="flex items-center justify-end gap-4 w-[30%] min-w-[180px]">
        {/* Quality Badge */}
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
            defaultValue={[80]}
            value={[volume]}
            max={100}
            step={1}
            onValueChange={(val) => setVolume(val[0])}
            className="flex-1"
          />
        </div>
      </div>
    </div>
  );
}
