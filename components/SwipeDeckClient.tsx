'use client';

import { useState, useEffect } from 'react';
import SwipeDeck from './SwipeDeck';
import { Article } from '@/lib/dummyFeed';

interface SwipeDeckClientProps {
  initialArticles: Article[];
}

export default function SwipeDeckClient({ initialArticles }: SwipeDeckClientProps) {
  const [articles, setArticles] = useState<Article[]>(initialArticles);
  const [isLoading, setIsLoading] = useState(false);

  // Refresh articles periodically
  useEffect(() => {
    const refreshInterval = setInterval(async () => {
      try {
        const response = await fetch('/api/feed?window=24h&limit=50');
        if (response.ok) {
          const data = await response.json();
          if (data.articles && data.articles.length > 0) {
            setArticles(data.articles);
          }
        }
      } catch (error) {
        console.error('Failed to refresh articles:', error);
      }
    }, 60000); // Refresh every minute

    return () => clearInterval(refreshInterval);
  }, []);

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  return <SwipeDeck articles={articles} />;
}
