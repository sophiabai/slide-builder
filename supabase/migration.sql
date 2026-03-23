-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Decks table
CREATE TABLE public.decks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL DEFAULT 'Untitled Deck',
  theme jsonb NOT NULL DEFAULT '{"mode": "dark", "accentColor": "#6366F1", "fontFamily": "Inter"}'::jsonb,
  ai_generation_metadata jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Pages table
CREATE TABLE public.pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  deck_id uuid REFERENCES public.decks(id) ON DELETE CASCADE NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  layout text NOT NULL CHECK (layout IN ('text', 'text-block', 'block')),
  eyebrow text DEFAULT '',
  title text DEFAULT '',
  body_text text DEFAULT '',
  block jsonb,
  ai_generated boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Indexes
CREATE INDEX idx_pages_deck_id ON public.pages(deck_id);
CREATE INDEX idx_pages_sort_order ON public.pages(deck_id, sort_order);
CREATE INDEX idx_decks_user_id ON public.decks(user_id);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER decks_updated_at
  BEFORE UPDATE ON public.decks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER pages_updated_at
  BEFORE UPDATE ON public.pages
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- RLS Policies
ALTER TABLE public.decks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;

-- Deck policies: owner full access
CREATE POLICY "Users can CRUD own decks"
  ON public.decks FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Public read for presentation mode
CREATE POLICY "Public can read decks for presentation"
  ON public.decks FOR SELECT
  USING (true);

-- Page policies: owner full access via deck ownership
CREATE POLICY "Users can CRUD own pages"
  ON public.pages FOR ALL
  USING (deck_id IN (SELECT id FROM public.decks WHERE user_id = auth.uid()))
  WITH CHECK (deck_id IN (SELECT id FROM public.decks WHERE user_id = auth.uid()));

-- Public read for presentation mode
CREATE POLICY "Public can read pages for presentation"
  ON public.pages FOR SELECT
  USING (true);

-- Reorder pages RPC
CREATE OR REPLACE FUNCTION reorder_pages(deck_id uuid, page_ids uuid[])
RETURNS void AS $$
BEGIN
  FOR i IN 1..array_length(page_ids, 1) LOOP
    UPDATE public.pages
    SET sort_order = i - 1
    WHERE id = page_ids[i] AND pages.deck_id = reorder_pages.deck_id;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Storage bucket for uploads
-- Run via Supabase dashboard or management API:
-- Create bucket: "slide-assets" (public read, authenticated upload)
