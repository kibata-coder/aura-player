import React, { createContext, useContext, useState, useEffect } from 'react';
import { CleanTrack } from './music-api';

// Define what a download task looks like
export interface DownloadTask {
  track_id: string;
  status: 'pending' | 'downloading' | 'completed' | 'error';
  progress: number;
}

interface MusicContextType {
  searchResults: CleanTrack[]; 
  setSearchResults: (tracks: CleanTrack[]) => void;
  currentTrack: CleanTrack | null; 
  setCurrentTrack: (track: CleanTrack | null) => void;
  isPlaying: boolean; 
  setIsPlaying: (playing: boolean) => void;
  downloads: DownloadTask[];
  requestDownload: (track: CleanTrack) => Promise<void>;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

// This will be the URL of your Render backend. 
// We use localhost for local development!
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5030';

export function MusicProvider({ children }: { children: React.ReactNode }) {
  const [searchResults, setSearchResults] = useState<CleanTrack[]>([]);
  const [currentTrack, setCurrentTrack] = useState<CleanTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [downloads, setDownloads] = useState<DownloadTask[]>([]);

  // 1. Polling Mechanism to fetch download progress
  useEffect(() => {
    // To save network requests, we only poll if there is an active download going on
    const hasActiveDownloads = downloads.some(d => d.status === 'pending' || d.status === 'downloading');
    if (!hasActiveDownloads) return;

    // Ping the backend every 2 seconds for queue updates
    const intervalId = setInterval(async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/downloads`);
        if (res.ok) {
          const data: DownloadTask[] = await res.json();
          setDownloads(data);
        }
      } catch (error) {
        console.error("Error fetching download queue:", error);
      }
    }, 2000);

    return () => clearInterval(intervalId); // Cleanup interval on unmount
  }, [downloads]);

  // 2. Function to request a new download
  const requestDownload = async (track: CleanTrack) => {
    // Check if it's already downloading to prevent duplicate clicks
    if (downloads.some((d) => d.track_id === track.id && d.status !== 'error')) {
      return; 
    }

    // "Optimistic UI Update" - immediately show it as pending in the UI
    setDownloads(prev => [...prev, { track_id: track.id, status: 'pending', progress: 0 }]);

    try {
      // Send the request to our custom Python backend
      const res = await fetch(`${BACKEND_URL}/api/downloads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          track_id: track.id, 
          title: track.title, 
          artist: track.artist 
        })
      });
      
      if (!res.ok) throw new Error("Backend rejected request");
    } catch (error) {
      console.error("Failed to request download:", error);
      // Revert optimistic update to show an error state if the fetch failed
      setDownloads(prev => prev.map(d => 
        d.track_id === track.id ? { ...d, status: 'error' } : d
      ));
    }
  };

  return (
    <MusicContext.Provider value={{ 
      searchResults, setSearchResults, 
      currentTrack, setCurrentTrack, 
      isPlaying, setIsPlaying,
      downloads, requestDownload 
    }}>
      {children}
    </MusicContext.Provider>
  );
}

export function useMusic() {
  const context = useContext(MusicContext);
  if (context === undefined) throw new Error('useMusic must be used within a MusicProvider');
  return context;
}
