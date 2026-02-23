import SwipeDeckClient from '@/components/SwipeDeckClient';
import { dummyArticles } from '@/lib/dummyFeed';

// Force dynamic rendering to always fetch fresh data
export const dynamic = 'force-dynamic';

async function getArticles() {
  try {
    // In production, this would fetch from the actual API
    // For now, we'll use the dummy data
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : 'http://localhost:3000';
    
    const response = await fetch(`${baseUrl}/api/feed?window=24h&limit=50`, {
      next: { revalidate: 60 }, // Revalidate every minute
    });

    if (!response.ok) {
      console.log('API not available, using dummy data');
      return dummyArticles;
    }

    const data = await response.json();
    return data.articles.length > 0 ? data.articles : dummyArticles;
  } catch (error) {
    console.log('Error fetching articles, using dummy data:', error);
    return dummyArticles;
  }
}

export default async function Home() {
  const articles = await getArticles();

  return (
    <main className="min-h-screen bg-black">
      <SwipeDeckClient initialArticles={articles} />
    </main>
  );
}
