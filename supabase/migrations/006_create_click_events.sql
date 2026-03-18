-- Click tracking table
CREATE TABLE IF NOT EXISTS click_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_slug TEXT,
  content_slug TEXT,
  destination_url TEXT NOT NULL,
  user_agent TEXT,
  referrer TEXT,
  clicked_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for analytics queries
CREATE INDEX IF NOT EXISTS idx_click_events_product ON click_events (product_slug);
CREATE INDEX IF NOT EXISTS idx_click_events_content ON click_events (content_slug);
CREATE INDEX IF NOT EXISTS idx_click_events_clicked_at ON click_events (clicked_at DESC);
