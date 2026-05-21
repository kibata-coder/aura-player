// src/lib/MusicContext.tsx
import React, { createContext, useContext, useState } from 'react';
import { CleanTrack } from './music-api';

interface MusicContextType {
  searchResults: CleanTrack[];
  setSearchResults: (tracks: CleanTrack[]) => void;
  currentTrack: CleanTrack | null;
  setCurrentTrack: (track: CleanTrack | null) => void;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export function MusicProvider({ children }: { children: React.ReactNode }) {
  const [searchResults, setSearchResults] = useState<CleanTrack[]>([]);
  const [currentTrack, setCurrentTrack] = useState<CleanTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <MusicContext.Provider value={{
      searchResults, setSearchResults,
      currentTrack, setCurrentTrack,
      isPlaying, setIsPlaying
    }}>
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
