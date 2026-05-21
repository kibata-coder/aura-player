import { createFileRoute } from "@tanstack/react-router";
import { Sidebar } from "@/components/music/Sidebar";
import { TopBar } from "@/components/music/TopBar";
import { Hero } from "@/components/music/Hero";
import { TrackList } from "@/components/music/TrackList";
import { AlbumRow } from "@/components/music/AlbumRow";
import { NowPlayingBar } from "@/components/music/NowPlayingBar";
import { newReleases } from "@/components/music/data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Audire — Lossless Hi-Res Music Streaming" },
      {
        name: "description",
        content:
          "Stream and download Hi-Res FLAC, 24-bit and MQA studio masters with bit-perfect playback.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="h-screen flex flex-col bg-background text-foreground overflow-hidden">
      <div className="flex-1 flex min-h-0">
        <Sidebar />
        <main className="flex-1 flex flex-col min-w-0">
          <TopBar />
          <div className="flex-1 overflow-y-auto px-4 md:px-8 pb-12">
            <div className="mx-auto max-w-7xl pt-6">
              <Hero />
              <section className="mt-10">
                <div className="flex items-end justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-semibold tracking-tight">
                      Tracks
                    </h2>
                    <p className="text-xs text-muted-foreground mt-1">
                      Bit-perfect playback · Source: Studio Master
                    </p>
                  </div>
                  <button className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground">
                    Sort
                  </button>
                </div>
                <TrackList />
              </section>
              <AlbumRow title="New in Hi-Res" albums={newReleases} />
            </div>
          </div>
        </main>
      </div>
      <NowPlayingBar />
    </div>
  );
}
