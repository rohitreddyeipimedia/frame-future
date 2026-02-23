import SwipeDeckClient from '@/components/SwipeDeckClient';
import { dummyArticles } from '@/lib/dummyFeed';

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getArticles() {
  try {
    // Use absolute URL for server-side fetch
    const response = await fetch('https://frame-future.vercel.app/api/feed?window=all&limit=50', {
      cache: 'no-store',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      console.log('API error:', response.status, await response.text());
      return dummyArticles;
    }

    const data = await response.json();
    return data.articles?.length > 0 ? data.articles : dummyArticles;
  } catch (error) {
    console.log('Fetch error:', error);
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
