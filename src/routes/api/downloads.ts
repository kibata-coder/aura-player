import { createFileRoute } from "@tanstack/react-router";

export type DownloadStatus = "pending" | "downloading" | "completed" | "failed";

export interface DownloadItem {
  id: string;
  track_id: string;
  title: string;
  artist: string;
  stream_url?: string;
  status: DownloadStatus;
  progress: number;
}

// In-memory mock queue. Resets on cold start — fine for a mock backend.
const globalAny = globalThis as unknown as {
  __auraQueue?: DownloadItem[];
  __auraTimers?: Map<string, ReturnType<typeof setInterval>>;
};
const queue: DownloadItem[] = (globalAny.__auraQueue ??= []);
const timers: Map<string, ReturnType<typeof setInterval>> = (globalAny.__auraTimers ??=
  new Map());

function startSimulation(itemId: string) {
  if (timers.has(itemId)) return;
  const interval = setInterval(() => {
    const item = queue.find((q) => q.id === itemId);
    if (!item) {
      clearInterval(interval);
      timers.delete(itemId);
      return;
    }
    item.progress = Math.min(100, item.progress + 20);
    if (item.progress >= 100) {
      item.progress = 100;
      item.status = "completed";
      clearInterval(interval);
      timers.delete(itemId);
    }
  }, 1000);
  timers.set(itemId, interval);
}

const corsHeaders: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export const Route = createFileRoute("/api/downloads")({
  server: {
    handlers: {
      OPTIONS: async () => new Response(null, { status: 204, headers: corsHeaders }),

      GET: async () =>
        new Response(JSON.stringify(queue), {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }),

      POST: async ({ request }) => {
        let body: {
          track_id?: string;
          title?: string;
          artist?: string;
          stream_url?: string;
        };
        try {
          body = await request.json();
        } catch {
          return new Response(JSON.stringify({ error: "Invalid JSON" }), {
            status: 400,
            headers: { "Content-Type": "application/json", ...corsHeaders },
          });
        }

        const { track_id, title, artist, stream_url } = body;
        if (!track_id || !title || !artist) {
          return new Response(
            JSON.stringify({ error: "track_id, title, and artist are required" }),
            {
              status: 400,
              headers: { "Content-Type": "application/json", ...corsHeaders },
            },
          );
        }

        const existing = queue.find((q) => q.track_id === track_id);
        if (existing && existing.status !== "failed") {
          return new Response(JSON.stringify(existing), {
            status: 200,
            headers: { "Content-Type": "application/json", ...corsHeaders },
          });
        }

        const item: DownloadItem = {
          id: crypto.randomUUID(),
          track_id,
          title,
          artist,
          stream_url,
          status: "downloading",
          progress: 0,
        };

        if (existing) {
          // Retry path: replace failed entry.
          const idx = queue.indexOf(existing);
          queue.splice(idx, 1, item);
        } else {
          queue.push(item);
        }

        startSimulation(item.id);

        return new Response(JSON.stringify(item), {
          status: 201,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      },
    },
  },
});