CREATE TABLE public.download_queue (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL DEFAULT auth.uid(),
  track_id TEXT NOT NULL,
  title TEXT NOT NULL,
  artist TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  progress NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.download_queue ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own downloads"
  ON public.download_queue FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users insert own downloads"
  ON public.download_queue FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users update own downloads"
  ON public.download_queue FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users delete own downloads"
  ON public.download_queue FOR DELETE
  USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_download_queue_updated_at
  BEFORE UPDATE ON public.download_queue
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

ALTER PUBLICATION supabase_realtime ADD TABLE public.download_queue;
ALTER TABLE public.download_queue REPLICA IDENTITY FULL;