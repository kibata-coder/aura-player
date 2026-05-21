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
  searchResults: CleanTrack[];
  setSearchResults: (tracks: CleanTrack[]) => void;
  currentTrack: CleanTrack | null;
  setCurrentTrack: (track: CleanTrack | null) => void;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  downloads: DownloadItem[];
  requestDownload: (track: CleanTrack) => Promise<void>;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL as string | undefined;
const DOWNLOADS_ENDPOINT = `${BACKEND_URL ?? ''}/api/downloads`;

export function MusicProvider({ children }: { children: React.ReactNode }) {
  const [searchResults, setSearchResults] = useState<CleanTrack[]>([]);
  const [currentTrack, setCurrentTrack] = useState<CleanTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [downloads, setDownloads] = useState<DownloadItem[]>([]);

  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

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

  // Run polling while there are pending/downloading jobs; stop when idle.
  useEffect(() => {
    const hasActive = downloads.some(
      (d) => d.status === 'pending' || d.status === 'downloading'
    );
    if (hasActive) startPolling();
    else stopPolling();
    return () => stopPolling();
  }, [downloads, startPolling, stopPolling]);

  // Initial fetch on mount to pick up any in-flight jobs.
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

      // Optimistic entry so the UI reacts immediately
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
      }}
    >
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