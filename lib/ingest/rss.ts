import Parser from 'rss-parser';

const parser = new Parser({
  timeout: 10000,
  headers: {
    'User-Agent': 'Frame&Future News Aggregator/1.0',
  },
  customFields: {
    item: [
      ['media:content', 'mediaContent'],
      ['enclosure', 'enclosure'],
      ['content:encoded', 'contentEncoded'],
    ],
  },
});

export interface RSSItem {
  title: string;
  link: string;
  pubDate?: string;
  content?: string;
  contentSnippet?: string;
  enclosure?: {
    url?: string;
    type?: string;
  };
  mediaContent?: {
    $?: {
      url?: string;
    };
  };
  'content:encoded'?: string;
}

export interface ParsedArticle {
  title: string;
  link: string;
  publishedAt: Date;
  content?: string;
  imageUrl?: string;
}

export async function fetchRSSFeed(url: string): Promise<RSSItem[]> {
  try {
    const feed = await parser.parseURL(url);
    return feed.items as RSSItem[];
  } catch (error) {
    console.error(`Failed to fetch RSS feed ${url}:`, error);
    return [];
  }
}

export function extractImageUrl(item: RSSItem): string | undefined {
  // Try different sources for image URL
  if (item.enclosure?.url && item.enclosure.type?.startsWith('image/')) {
    return item.enclosure.url;
  }
  
  if (item.mediaContent?.$?.url) {
    return item.mediaContent.$.url;
  }

  // Try to extract from content
  const content = item['content:encoded'] || item.content;
  if (content) {
    const imgMatch = content.match(/<img[^>]+src=["']([^"']+)["'][^>]*>/i);
    if (imgMatch) {
      return imgMatch[1];
    }
  }

  return undefined;
}

export function parseRSSItems(items: RSSItem[], sourceName: string): ParsedArticle[] {
  return items.map((item) => ({
    title: item.title || 'Untitled',
    link: item.link || '',
    publishedAt: item.pubDate ? new Date(item.pubDate) : new Date(),
    content: item.contentSnippet || item.content || '',
    imageUrl: extractImageUrl(item),
  })).filter(item => item.link && item.title);
}
