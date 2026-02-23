import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import Parser from 'rss-parser';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const ingestSecret = process.env.INGEST_SECRET || '';

const supabase = createClient(supabaseUrl, supabaseServiceKey);
const parser = new Parser();

// RSS Sources
const sources = [
  { name: 'OpenAI Blog', rss: 'https://openai.com/blog/rss.xml', tags: ['MODELS', 'RESEARCH'] },
  { name: 'Anthropic', rss: 'https://www.anthropic.com/rss.xml', tags: ['MODELS', 'RESEARCH'] },
  { name: 'Google AI', rss: 'https://ai.googleblog.com/feeds/posts/default', tags: ['RESEARCH', 'MODELS'] },
  { name: 'DeepMind', rss: 'https://deepmind.google/blog/rss.xml', tags: ['RESEARCH', 'MODELS'] },
  { name: 'TechCrunch AI', rss: 'https://techcrunch.com/category/artificial-intelligence/feed/', tags: ['BUSINESS', 'TOOLS'] },
  { name: 'VentureBeat AI', rss: 'https://venturebeat.com/category/ai/feed/', tags: ['BUSINESS', 'MODELS'] },
  { name: 'The Verge AI', rss: 'https://www.theverge.com/ai-artificial-intelligence/rss/index.xml', tags: ['BUSINESS', 'TOOLS'] },
  { name: 'Wired AI', rss: 'https://www.wired.com/tag/artificial-intelligence/rss', tags: ['BUSINESS', 'RESEARCH'] },
  { name: 'MIT Tech Review', rss: 'https://www.technologyreview.com/topic/artificial-intelligence/feed', tags: ['RESEARCH', 'MODELS'] },
  { name: 'Hugging Face', rss: 'https://huggingface.co/blog/feed.xml', tags: ['TOOLS', 'MODELS'] },
  { name: 'NVIDIA Blog', rss: 'https://blogs.nvidia.com/blog/feed/', tags: ['BUSINESS', 'RESEARCH'] },
  { name: 'Stability AI', rss: 'https://stability.ai/blog/rss.xml', tags: ['TOOLS', 'CREATOR'] },
  { name: 'AI News', rss: 'https://www.artificialintelligence-news.com/feed/', tags: ['BUSINESS', 'TOOLS'] },
  { name: 'Import AI', rss: 'https://importai.substack.com/feed', tags: ['RESEARCH', 'BUSINESS'] },
  { name: 'The Batch', rss: 'https://read.deeplearning.ai/rss/', tags: ['RESEARCH', 'BUSINESS'] },
  { name: 'MarkTechPost', rss: 'https://www.marktechpost.com/feed/', tags: ['RESEARCH', 'MODELS'] },
  { name: 'Unite.AI', rss: 'https://www.unite.ai/feed/', tags: ['TOOLS', 'BUSINESS'] },
  { name: 'Topbots', rss: 'https://www.topbots.com/feed/', tags: ['BUSINESS', 'MODELS'] },
  { name: 'AI Trends', rss: 'https://www.aitrends.com/feed/', tags: ['BUSINESS', 'RESEARCH'] },
  { name: 'AssemblyAI', rss: 'https://www.assemblyai.com/blog/rss.xml', tags: ['TOOLS', 'MODELS'] },
];

function generateHash(title: string, url: string): string {
  const crypto = require('crypto');
  try {
    const urlObj = new URL(url);
    const domain = urlObj.hostname;
    const normalizedTitle = title.toLowerCase().trim().replace(/\s+/g, ' ');
    const data = `${normalizedTitle}|${domain}`;
    return crypto.createHash('sha256').update(data).digest('hex').substring(0, 32);
  } catch {
    const normalizedTitle = title.toLowerCase().trim().replace(/\s+/g, ' ');
    return crypto.createHash('sha256').update(normalizedTitle).digest('hex').substring(0, 32);
  }
}

function createSummary(content: string, title: string): string {
  if (!content || content.trim().length === 0) {
    return `${title}. This article discusses recent developments in artificial intelligence and technology.`;
  }
  const cleanContent = content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  const sentences = cleanContent.replace(/([.!?])\s+/g, '$1|').split('|').filter(s => s.trim().length > 20);
  if (sentences.length === 0) {
    return `${title}. Read the full article for more details.`;
  }
  const summarySentences = sentences.slice(0, Math.min(3, sentences.length));
  let summary = summarySentences.join('. ').trim();
  if (!summary.endsWith('.') && !summary.endsWith('!') && !summary.endsWith('?')) {
    summary += '.';
  }
  if (summary.length > 250) {
    const truncated = summary.substring(0, 250);
    const lastPeriod = truncated.lastIndexOf('.');
    if (lastPeriod > 100) {
      summary = truncated.substring(0, lastPeriod + 1);
    } else {
      summary = truncated + '...';
    }
  }
  return summary;
}

function inferTags(title: string, content: string, defaultTags: string[] = []): string[] {
  const text = `${title} ${content}`.toLowerCase();
  const tagKeywords: Record<string, string[]> = {
    LEGAL: ['regulation', 'regulatory', 'law', 'legal', 'compliance', 'policy', 'governance', 'eu ai act', 'copyright', 'lawsuit'],
    MODELS: ['gpt', 'llm', 'language model', 'foundation model', 'transformer', 'neural network', 'deep learning', 'claude', 'gemini', 'llama'],
    TOOLS: ['tool', 'platform', 'software', 'api', 'sdk', 'integration', 'plugin', 'automation'],
    BUSINESS: ['funding', 'investment', 'valuation', 'revenue', 'ipo', 'acquisition', 'startup', 'enterprise'],
    CREATOR: ['artist', 'designer', 'creator', 'content', 'creative', 'art', 'illustration', 'music'],
    FILMMAKING: ['video', 'film', 'movie', 'cinema', 'animation', 'motion', 'visual effects', 'vfx'],
    RESEARCH: ['research', 'paper', 'study', 'experiment', 'arxiv', 'publication', 'breakthrough'],
  };
  
  const scores: Record<string, number> = { LEGAL: 0, MODELS: 0, TOOLS: 0, BUSINESS: 0, CREATOR: 0, FILMMAKING: 0, RESEARCH: 0 };
  
  Object.keys(tagKeywords).forEach((tag) => {
    tagKeywords[tag].forEach((keyword) => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      const matches = text.match(regex);
      if (matches) scores[tag] += matches.length;
    });
  });
  
  defaultTags.forEach((tag) => {
    const upperTag = tag.toUpperCase();
    if (scores[upperTag] !== undefined) scores[upperTag] += 2;
  });
  
  const sortedTags = Object.keys(scores).filter(tag => scores[tag] > 0).sort((a, b) => scores[b] - scores[a]).slice(0, 2);
  if (sortedTags.length === 0) return defaultTags.length > 0 ? defaultTags.slice(0, 2) : ['RESEARCH'];
  return sortedTags;
}

function extractImageUrl(item: any): string | undefined {
  if (item.enclosure?.url && item.enclosure.type?.startsWith('image/')) return item.enclosure.url;
  if (item['media:content']?.$?.url) return item['media:content'].$.url;
  const content = item['content:encoded'] || item.content;
  if (content) {
    const imgMatch = content.match(/<img[^>]+src=["']([^"']+)["'][^>]*>/i);
    if (imgMatch) return imgMatch[1];
  }
  return undefined;
}

export async function POST(request: NextRequest) {
  try {
    const secretHeader = request.headers.get('x-ingest-secret');
    if (secretHeader !== ingestSecret) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const backfillDays = parseInt(searchParams.get('backfill_days') || '7', 10);
    const maxPerSource = parseInt(searchParams.get('max_per_source') || '20', 10);

    const cutoffDate = new Date(Date.now() - backfillDays * 24 * 60 * 60 * 1000);
    let totalInserted = 0;
    let totalSkipped = 0;
    const results: any[] = [];

    for (const source of sources) {
      try {
        const feed = await parser.parseURL(source.rss);
        const items = feed.items || [];
        let inserted = 0;
        let skipped = 0;

        for (const item of items.slice(0, maxPerSource)) {
          try {
            const pubDate = item.pubDate ? new Date(item.pubDate) : new Date();
            if (pubDate < cutoffDate) continue;

            const title = item.title || 'Untitled';
            const link = item.link || '';
            if (!link) continue;

            const hash = generateHash(title, link);
            const { data: existing } = await supabase.from('articles').select('id').eq('hash', hash).maybeSingle();
            if (existing) { skipped++; continue; }

            const { data: existingUrl } = await supabase.from('articles').select('id').eq('source_url', link).maybeSingle();
            if (existingUrl) { skipped++; continue; }

            const summary = createSummary(item.contentSnippet || item.content || '', title);
            const tags = inferTags(title, item.contentSnippet || '', source.tags);
            const imageUrl = extractImageUrl(item);

            const { error: insertError } = await supabase.from('articles').insert({
              title,
              summary,
              source_name: source.name,
              source_url: link,
              image_url: imageUrl || null,
              published_at: pubDate.toISOString(),
              tags,
              hash,
            });

            if (insertError) {
              console.error(`Insert error for ${title}:`, insertError);
            } else {
              inserted++;
            }
          } catch (itemError) {
            console.error(`Item error:`, itemError);
          }
        }

        totalInserted += inserted;
        totalSkipped += skipped;
        results.push({ source: source.name, inserted, skipped });
      } catch (sourceError) {
        console.error(`Source error ${source.name}:`, sourceError);
        results.push({ source: source.name, inserted: 0, skipped: 0, error: 'Failed to fetch' });
      }
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      backfill_days: backfillDays,
      total_inserted: totalInserted,
      total_skipped: totalSkipped,
      results,
    });
  } catch (error) {
    console.error('Ingest API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  return POST(request);
}
