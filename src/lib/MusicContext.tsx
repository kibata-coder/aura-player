// src/lib/MusicContext.tsx
import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import { CleanTrack } from './music-api';

export type DownloadStatus = 'pending' | 'downloading' | 'completed' | 'failed';

export interface DownloadItem {
  id: string;
  track_id: string;
  title: string;
  artist: string;
  status: DownloadStatus;
  progress: number;
}

interface MusicContextType {
  // Search & Track State
  searchResults: CleanTrack[];
  setSearchResults: (tracks: CleanTrack[]) => void;
  currentTrack: CleanTrack | null;
  setCurrentTrack: (track: CleanTrack | null) => void;
  
  // Playback & Audio Controls
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  currentTime: number;
  duration: number;
  volume: number;
  setVolume: (volume: number) => void;
  seek: (time: number) => void;
  togglePlay: () => void;

  // Downloads State
  downloads: DownloadItem[];
  requestDownload: (track: CleanTrack) => Promise<void>;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL as string | undefined;
const DOWNLOADS_ENDPOINT = `${BACKEND_URL ?? ''}/api/downloads`;

export function MusicProvider({ children }: { children: React.ReactNode }) {
  // 1. Data State
  const [searchResults, setSearchResults] = useState<CleanTrack[]>([]);
  const [currentTrack, setCurrentTrack] = useState<CleanTrack | null>(null);
  const [downloads, setDownloads] = useState<DownloadItem[]>([]);

  // 2. Audio Player State
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(1); // 1 = 100% volume

  // 3. Refs
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // --- AUDIO LIFECYCLE ENGINE ---

  // When a new track is selected, automatically play it
  useEffect(() => {
    if (audioRef.current && currentTrack) {
      setCurrentTime(0); // Reset time for new song
      audioRef.current.src = currentTrack.streamUrl;
      audioRef.current.load();
      
      // Auto-play the audio. We catch the error in case the browser blocks auto-play
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(err => console.error("Playback blocked or failed:", err));
    }
  }, [currentTrack]);

  // Safely toggle play/pause via UI controls
  const togglePlay = useCallback(() => {
    if (!audioRef.current || !currentTrack) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(err => console.error("Playback failed:", err));
    }
  }, [isPlaying, currentTrack]);

  // Scrub/Seek to a specific time in the song
  const seek = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  }, []);

  // Adjust volume (clamped between 0 and 1)
  const setVolume = useCallback((newVolume: number) => {
    const clamped = Math.max(0, Math.min(1, newVolume));
    setVolumeState(clamped);
    if (audioRef.current) {
      audioRef.current.volume = clamped;
    }
  }, []);


  // --- DOWNLOAD MANAGER ENGINE ---
  const fetchQueue = useCallback(async () => {
    if (!BACKEND_URL) return;
    try {
      const res = await fetch(DOWNLOADS_ENDPOINT);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: DownloadItem[] = await res.json();
      setDownloads(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch download queue:', err);
    }
  }, []);

  const stopPolling = useCallback(() => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  }, []);

  const startPolling = useCallback(() => {
    if (pollRef.current || !BACKEND_URL) return;
    pollRef.current = setInterval(fetchQueue, 2000);
  }, [fetchQueue]);

  useEffect(() => {
    const hasActive = downloads.some(
      (d) => d.status === 'pending' || d.status === 'downloading'
    );
    if (hasActive) startPolling();
    else stopPolling();
    return () => stopPolling();
  }, [downloads, startPolling, stopPolling]);

  useEffect(() => {
    fetchQueue();
    return () => stopPolling();
  }, [fetchQueue, stopPolling]);

  const requestDownload = useCallback(
    async (track: CleanTrack) => {
      if (!BACKEND_URL) {
        console.error('VITE_BACKEND_URL is not configured');
        return;
      }

      const optimistic: DownloadItem = {
        id: `tmp-${track.id}`,
        track_id: track.id,
        title: track.title,
        artist: track.artist,
        status: 'pending',
        progress: 0,
      };
      setDownloads((prev) =>
        prev.some((d) => d.track_id === track.id) ? prev : [...prev, optimistic]
      );
      startPolling();

      try {
        const res = await fetch(DOWNLOADS_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            track_id: track.id,
            title: track.title,
            artist: track.artist,
            stream_url: track.streamUrl,
          }),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        await fetchQueue();
      } catch (err) {
        console.error('Failed to request download:', err);
        setDownloads((prev) =>
          prev.map((d) =>
            d.track_id === track.id ? { ...d, status: 'failed' } : d
          )
        );
      }
    },
    [fetchQueue, startPolling]
  );

  return (
    <MusicContext.Provider
      value={{
        searchResults,
        setSearchResults,
        currentTrack,
        setCurrentTrack,
        isPlaying,
        setIsPlaying,
        downloads,
        requestDownload,
        currentTime,
        duration,
        volume,
        setVolume,
        seek,
        togglePlay,
      }}
    >
      {/* Hidden Native Audio Element */}
      <audio
        ref={audioRef}
        onTimeUpdate={() => setCurrentTime(audioRef.current?.currentTime || 0)}
        onLoadedMetadata={() => setDuration(audioRef.current?.duration || 0)}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
      />
      {children}
    </MusicContext.Provider>
  );
}

export function useMusic() {
  const context = useContext(MusicContext);
  if (context === undefined) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  return context;
}
