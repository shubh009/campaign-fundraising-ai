-- Campaign Fundraising AI: Database Schema for Supabase

-- 1. Table for logging queries and generated strategies
CREATE TABLE IF NOT EXISTS campaign_queries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
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

-- 3. Table for chat threads (ChatGPT-style session management)
CREATE TABLE IF NOT EXISTS chat_threads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    category TEXT DEFAULT 'general',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Table for individual messages inside a thread
CREATE TABLE IF NOT EXISTS chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    thread_id UUID REFERENCES chat_threads(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role TEXT CHECK (role IN ('user', 'assistant')) NOT NULL,
    content TEXT NOT NULL,
    strategy_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Indexes
CREATE INDEX IF NOT EXISTS idx_campaign_queries_session ON campaign_queries(session_id);
CREATE INDEX IF NOT EXISTS idx_campaign_queries_user ON campaign_queries(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_threads_user ON chat_threads(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_thread ON chat_messages(thread_id);

-- 6. Enable Row Level Security (RLS)
ALTER TABLE campaign_queries ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- 7. Policies
CREATE POLICY "Public insert queries" ON campaign_queries FOR INSERT WITH CHECK (true);
CREATE POLICY "Public select queries" ON campaign_queries FOR SELECT USING (true);
CREATE POLICY "Public insert feedback" ON campaign_feedback FOR INSERT WITH CHECK (true);

-- User scoped policies for threads
CREATE POLICY "Users can manage own threads" ON chat_threads
    FOR ALL USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- User scoped policies for messages
CREATE POLICY "Users can manage own messages" ON chat_messages
    FOR ALL USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);
