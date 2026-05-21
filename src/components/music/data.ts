import album1 from "@/assets/album-1.jpg";
import album2 from "@/assets/album-2.jpg";
import album3 from "@/assets/album-3.jpg";
import album4 from "@/assets/album-4.jpg";
import album5 from "@/assets/album-5.jpg";
import album6 from "@/assets/album-6.jpg";
import type { Album } from "./AlbumRow";

export const newReleases: Album[] = [
  { title: "Goldwave", artist: "Sable & Ash", cover: album1, quality: "24-bit" },
  { title: "Sapphire", artist: "Plume", cover: album2, quality: "Hi-Res" },
  { title: "Midnight Tape", artist: "Lina Cole", cover: album3, quality: "FLAC" },
  { title: "Black Granite", artist: "Iron Vow", cover: album4, quality: "FLAC" },
  { title: "Ambient Vol. II", artist: "Forest Etudes", cover: album5, quality: "Hi-Res" },
  { title: "Chromacity", artist: "Vapor Mode", cover: album6, quality: "MQA" },
];