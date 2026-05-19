import album1 from "@/assets/album-1.jpg";
import album2 from "@/assets/album-2.jpg";
import album3 from "@/assets/album-3.jpg";
import album4 from "@/assets/album-4.jpg";
import album5 from "@/assets/album-5.jpg";
import album6 from "@/assets/album-6.jpg";
import albumHero from "@/assets/album-hero.jpg";
import type { Track } from "./TrackList";
import type { Album } from "./AlbumRow";

export const tracks: Track[] = [
  { id: 1, title: "Aurora Drift", artist: "Aurora Sound", album: "Nebula Frequencies", cover: albumHero, quality: "Hi-Res FLAC", bitrate: "4608 kbps", duration: "4:12" },
  { id: 2, title: "Magnetic North", artist: "Aurora Sound", album: "Nebula Frequencies", cover: albumHero, quality: "24-bit", bitrate: "2304 kbps", duration: "3:48" },
  { id: 3, title: "Solar Wind", artist: "Aurora Sound", album: "Nebula Frequencies", cover: albumHero, quality: "Hi-Res FLAC", bitrate: "4608 kbps", duration: "5:21" },
  { id: 4, title: "Velvet Static", artist: "Lina Cole", album: "Midnight Tape", cover: album3, quality: "FLAC", bitrate: "1411 kbps", duration: "3:02" },
  { id: 5, title: "Quiet Pines", artist: "Forest Etudes", album: "Ambient Vol. II", cover: album5, quality: "Hi-Res FLAC", bitrate: "3840 kbps", duration: "6:40" },
  { id: 6, title: "Carbon Bloom", artist: "Iron Vow", album: "Black Granite", cover: album4, quality: "FLAC", bitrate: "1411 kbps", duration: "4:55" },
  { id: 7, title: "Hexlight", artist: "Vapor Mode", album: "Chromacity", cover: album6, quality: "MQA", bitrate: "2304 kbps", duration: "3:33" },
  { id: 8, title: "Trace Decay", artist: "Sable & Ash", album: "Goldwave", cover: album1, quality: "24-bit", bitrate: "2304 kbps", duration: "4:08" },
  { id: 9, title: "Liquid Glass", artist: "Plume", album: "Sapphire", cover: album2, quality: "Hi-Res FLAC", bitrate: "4608 kbps", duration: "5:11" },
];

export const newReleases: Album[] = [
  { title: "Goldwave", artist: "Sable & Ash", cover: album1, quality: "24-bit" },
  { title: "Sapphire", artist: "Plume", cover: album2, quality: "Hi-Res" },
  { title: "Midnight Tape", artist: "Lina Cole", cover: album3, quality: "FLAC" },
  { title: "Black Granite", artist: "Iron Vow", cover: album4, quality: "FLAC" },
  { title: "Ambient Vol. II", artist: "Forest Etudes", cover: album5, quality: "Hi-Res" },
  { title: "Chromacity", artist: "Vapor Mode", cover: album6, quality: "MQA" },
];