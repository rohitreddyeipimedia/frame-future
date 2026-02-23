-- Create articles table
CREATE TABLE IF NOT EXISTS articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    summary TEXT NOT NULL,
    source_name TEXT,
    source_url TEXT NOT NULL UNIQUE,
    image_url TEXT,
    published_at TIMESTAMPTZ NOT NULL,
    tags TEXT[],
    hash TEXT UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on published_at for efficient sorting
CREATE INDEX IF NOT EXISTS idx_articles_published_at ON articles(published_at DESC);

-- Create index on tags for filtering
CREATE INDEX IF NOT EXISTS idx_articles_tags ON articles USING GIN(tags);

-- Create index on hash for deduplication
CREATE INDEX IF NOT EXISTS idx_articles_hash ON articles(hash);

-- Create index on source_url for deduplication
CREATE INDEX IF NOT EXISTS idx_articles_source_url ON articles(source_url);

-- Enable Row Level Security
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

-- Create policy for anonymous read access
CREATE POLICY "Allow anonymous read access" ON articles
    FOR SELECT USING (true);

-- Create policy for service role insert/update/delete
CREATE POLICY "Allow service role full access" ON articles
    FOR ALL USING (auth.role() = 'service_role');
