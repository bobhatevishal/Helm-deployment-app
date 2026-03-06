-- ═══════════════════════════════════════════════
-- URL Shortener — Database Initialization
-- ═══════════════════════════════════════════════

-- Main URLs table
CREATE TABLE IF NOT EXISTS urls (
    id          SERIAL PRIMARY KEY,
    short_code  VARCHAR(10) UNIQUE NOT NULL,
    original_url TEXT NOT NULL,
    clicks      INTEGER DEFAULT 0,
    created_at  TIMESTAMP DEFAULT NOW()
);

-- Analytics table — tracks each click event
CREATE TABLE IF NOT EXISTS url_analytics (
    id          SERIAL PRIMARY KEY,
    short_code  VARCHAR(10) NOT NULL REFERENCES urls(short_code) ON DELETE CASCADE,
    clicked_at  TIMESTAMP DEFAULT NOW(),
    user_agent  TEXT,
    ip_address  VARCHAR(45)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_urls_short_code ON urls(short_code);
CREATE INDEX IF NOT EXISTS idx_urls_created_at ON urls(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_short_code ON url_analytics(short_code);
CREATE INDEX IF NOT EXISTS idx_analytics_clicked_at ON url_analytics(clicked_at DESC);

-- Seed data for demo
INSERT INTO urls (short_code, original_url, clicks) VALUES
    ('demo01', 'https://github.com', 42),
    ('demo02', 'https://stackoverflow.com/questions', 18),
    ('demo03', 'https://docs.docker.com/compose/', 7)
ON CONFLICT (short_code) DO NOTHING;
