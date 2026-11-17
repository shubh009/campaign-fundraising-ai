-- Campaign Fundraising AI: Database Schema for Supabase

-- 1. Table for logging queries and generated strategies
CREATE TABLE IF NOT EXISTS campaign_queries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id TEXT,
    query_text TEXT NOT NULL,
    category TEXT DEFAULT 'general',
    strategy_summary TEXT,
    strategy_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Table for storing user feedback (thumbs up/down)
CREATE TABLE IF NOT EXISTS campaign_feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    query_id UUID REFERENCES campaign_queries(id) ON DELETE CASCADE,
    rating TEXT CHECK (rating IN ('positive', 'negative')) NOT NULL,
    comments TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Indexes for fast query retrieval
CREATE INDEX IF NOT EXISTS idx_campaign_queries_session ON campaign_queries(session_id);
CREATE INDEX IF NOT EXISTS idx_campaign_queries_created_at ON campaign_queries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_campaign_feedback_query_id ON campaign_feedback(query_id);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE campaign_queries ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_feedback ENABLE ROW LEVEL SECURITY;

-- Allow public read/insert for anonymous sessions (or adjust according to Supabase policies)
CREATE POLICY "Allow public insert to queries" ON campaign_queries FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read own session queries" ON campaign_queries FOR SELECT USING (true);

CREATE POLICY "Allow public insert to feedback" ON campaign_feedback FOR INSERT WITH CHECK (true);

