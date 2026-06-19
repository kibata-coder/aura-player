## Aura Player — Audio Engine, UI Wiring, and Mock Download API

### Step 1 — `src/lib/MusicContext.tsx` (audio engine consolidation)
The context already has most of the engine wired. Tighten/finalize:
- Keep `currentTime`, `duration`, `volume` (default `1`) state and `audioRef`.
- Keep hidden `<audio>` above `{children}` with `onTimeUpdate`, `onLoadedMetadata`, `onPlay`, `onPause`, `onEnded` handlers.
- Keep `useEffect` on `currentTrack` that sets `src`, `load()`, resets `currentTime`, calls `play()`.
- Expose `togglePlay`, `seek(time)`, `setVolume(vol)` (clamped 0–1). These already exist — verify signatures match what `NowPlayingBar` will consume.

### Step 2 — `src/components/music/NowPlayingBar.tsx` (rewrite)
Currently the bar manages its own `<audio>` and local state. Refactor to consume context only:
- Pull `currentTrack`, `isPlaying`, `currentTime`, `duration`, `volume`, `togglePlay`, `seek`, `setVolume` from `useMusic()`.
- Remove the local `audioRef`, local `currentTime/duration/volume` state, and the in-component `<audio>` element.
- Render disabled empty state when `currentTrack` is null (instead of returning null) so the bar stays visible.
- Progress slider bound to `[currentTime]`, `max={duration || 0}`, `onValueChange={(v) => seek(v[0])}`.
- Volume slider bound to `[volume * 100]`, `onValueChange={(v) => setVolume(v[0] / 100)}`.
- Play/pause button calls `togglePlay`, icon flips on `isPlaying`.
- `formatTime` helper for `m:ss`.

### Step 3 — Clickable tracks
- `TrackList.tsx`: row already calls `handlePlay` via a hover button. Make the **entire row** clickable (`onClick` on the row → `setCurrentTrack(track)`), keep the download button's `onClick` with `stopPropagation`. Active row already highlights via `isCurrentlyPlaying` — keep.
- `AlbumRow.tsx`: not a track list (it's album cards with no track data). Per the spec it says "lists that render… static track lists" — `AlbumRow` has no `CleanTrack` items, only `Album` metadata. Leave the play button visual as-is (no-op) and add a short note in the closing message. Alternative: skip `AlbumRow` entirely. **Plan: leave `AlbumRow` unchanged** since it has no playable `CleanTrack` to bind to.

### Step 4 — Mock backend at `/api/downloads`
Create `src/routes/api/downloads.ts` as a TanStack server route:
- Module-level `queue: DownloadItem[]` and a `Map<string, NodeJS.Timeout>` for simulated progress timers (in-memory; resets on worker cold start — acceptable for mock).
- `GET` → `Response.json(queue)`.
- `POST` → validates `{ track_id, title, artist, stream_url }` with Zod, pushes `{ id: crypto.randomUUID(), track_id, title, artist, status: "downloading", progress: 0 }`, starts a `setInterval` that bumps `progress` by 20 every 1s, sets `status: "completed"` at 100 and clears the interval. Returns the created item.
- Idempotency: if a queue entry for `track_id` already exists and is `completed`/`downloading`, return that one instead of duplicating.

Note on runtime: the Worker runtime supports `setInterval` for in-request timers. Since this is a mock, the cold-start reset is fine. No DB writes; this intentionally does not use Supabase per the spec.

### Files touched
- Update `src/lib/MusicContext.tsx` (verify/tighten only)
- Rewrite `src/components/music/NowPlayingBar.tsx`
- Update `src/components/music/TrackList.tsx` (row click + stopPropagation on download button)
- Create `src/routes/api/downloads.ts`
- Leave `src/lib/music-api.ts` and `AlbumRow.tsx` untouched

### Out of scope
- No Supabase wiring for downloads (spec asks for direct backend).
- No real streamrip integration — the route simulates progress.
