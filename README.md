# Frame&Future - AI News Swipe App

A mobile-first swipe news app for AI enthusiasts. Swipe through curated AI news from top sources.

## Features

- 📱 Mobile-first swipe interface (iPhone-optimized)
- 🔄 Smooth left/right swipe navigation
- 🏷️ Category tags (LEGAL, MODELS, TOOLS, BUSINESS, CREATOR, FILMMAKING, RESEARCH)
- 📊 Progress indicator
- 🔗 One-tap article opening
- ⚡ Auto-refreshing feed (last 24 hours)
- 🤖 Automated RSS ingestion from 30+ sources

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion (swipe animations)
- Supabase (database)
- Vercel (hosting + cron jobs)

## Quick Start

### 1. Clone and Install

```bash
git clone <repo-url>
cd frame-future
npm install
```

### 2. Environment Variables

Copy `.env.local.example` to `.env.local` and fill in:

```bash
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
INGEST_SECRET=your-secret-key
```

### 3. Setup Supabase

1. Create a new Supabase project
2. Run the SQL in `supabase/schema.sql` in the SQL Editor
3. Copy your project URL and keys to `.env.local`

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) on your mobile device or use responsive mode in DevTools.

## Deployment

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

### 2. Deploy to Vercel

1. Import your GitHub repo on [Vercel](https://vercel.com)
2. Add environment variables in Vercel dashboard
3. Deploy!

### 3. Backfill Articles

After deployment, run the backfill to get 300+ articles:

```bash
# Set your environment variables
export INGEST_SECRET=your-secret
export API_URL=https://your-vercel-app.vercel.app

# Run backfill
npx ts-node scripts/backfill.ts 300 120
```

Or manually trigger ingestion via curl:

```bash
curl -X POST https://your-vercel-app.vercel.app/api/ingest \
  -H "x-ingest-secret: your-secret" \
  -H "Content-Type: application/json"
```

## API Endpoints

### GET /api/feed

Fetch articles for the feed.

**Query Parameters:**
- `window` - Time window: `24h` (default), `7d`, `30d`, `all`
- `limit` - Max articles to return (default: 50)

**Example:**
```bash
curl /api/feed?window=24h&limit=50
```

### POST /api/ingest

Trigger RSS ingestion.

**Headers:**
- `x-ingest-secret` - Must match `INGEST_SECRET` env var

**Query Parameters:**
- `backfill_days` - How far back to fetch (default: 7)
- `max_per_source` - Max articles per source (default: 20)

**Example:**
```bash
curl -X POST /api/ingest?backfill_days=30 \
  -H "x-ingest-secret: your-secret"
```

## Project Structure

```
frame-future/
├── app/
│   ├── api/
│   │   ├── feed/route.ts      # Feed API
│   │   └── ingest/route.ts    # Ingestion API
│   ├── page.tsx               # Main page
│   ├── layout.tsx             # Root layout
│   └── globals.css            # Global styles
├── components/
│   ├── SwipeDeck.tsx          # Main swipe component
│   └── SwipeDeckClient.tsx    # Client wrapper
├── lib/
│   ├── dummyFeed.ts           # Dummy data for testing
│   ├── utils.ts               # Utilities
│   └── ingest/
│       ├── rss.ts             # RSS fetching
│       ├── dedupe.ts          # Deduplication
│       ├── summarize.ts       # Summary generation
│       └── tagger.ts          # Tag inference
├── sources/
│   └── sources.json           # RSS feed sources
├── supabase/
│   └── schema.sql             # Database schema
├── scripts/
│   └── backfill.ts            # Backfill script
└── vercel.json                # Cron configuration
```

## Cron Job

The app automatically ingests new articles every 3 hours via Vercel Cron:

```json
{
  "crons": [{
    "path": "/api/ingest",
    "schedule": "0 */3 * * *"
  }]
}
```

## Category Tags

- **LEGAL** - Regulations, policies, compliance, copyright
- **MODELS** - LLMs, foundation models, training, benchmarks
- **TOOLS** - APIs, platforms, software, integrations
- **BUSINESS** - Funding, startups, enterprise, market news
- **CREATOR** - Art, design, content creation, marketing
- **FILMMAKING** - Video, animation, VFX, generative video
- **RESEARCH** - Papers, studies, breakthroughs, academia

## License

MIT
