// src/lib/music-api.ts

export interface APIStreamResponse {
  success: boolean;
  data: {
    results: APITrack[];
  };
}

export interface APITrack {
  id: string;
  name: string;
  type: string;
  year: string;
  duration: number;
  image: { quality: string; url: string }[];
  downloadUrl: { quality: string; url: string }[];
  artists: { primary: { name: string }[] };
  album: { name: string };
}

// We map the messy API data into a clean format your UI understands
export interface CleanTrack {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number; // in seconds
  coverUrl: string;
  streamUrl: string; // The 320kbps instant stream link
}

const API_BASE_URL = "https://saavn.dev/api"; // Free, open-source music proxy

export const musicApi = {
  /**
   * Search for songs by name/artist
   */
  searchTracks: async (query: string): Promise<CleanTrack[]> => {
    if (!query) return [];
    
    try {
      const res = await fetch(`${API_BASE_URL}/search/songs?query=${encodeURIComponent(query)}`);
      if (!res.ok) throw new Error("Network response was not ok");
      
      const json: APIStreamResponse = await res.json();
      
      if (!json.data || !json.data.results) return [];

      return json.data.results.map((track) => {
        // Grab the highest quality album art (500x500 usually)
        const coverArt = track.image.find((img) => img.quality === "500x500")?.url 
                      || track.image[0]?.url 
                      || "";

        // Grab the highest quality 320kbps stream URL
        const streamLink = track.downloadUrl.find((url) => url.quality === "320kbps")?.url 
                        || track.downloadUrl[0]?.url 
                        || "";

        return {
          id: track.id,
          title: track.name,
          artist: track.artists.primary.map(a => a.name).join(", ") || "Unknown Artist",
          album: track.album.name || "Unknown Album",
          duration: track.duration,
          coverUrl: coverArt,
          streamUrl: streamLink,
        };
      });
    } catch (error) {
      console.error("Error fetching from Proxy API:", error);
      return [];
    }
  }
};
