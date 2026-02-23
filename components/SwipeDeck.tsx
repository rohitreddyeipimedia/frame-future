'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence, PanInfo, useMotionValue, useTransform } from 'framer-motion';
import { ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';
import { Article } from '@/lib/dummyFeed';

interface SwipeDeckProps {
  articles: Article[];
}

const SWIPE_THRESHOLD = 100;

const tagColors: Record<string, string> = {
  LEGAL: 'bg-red-500/80',
  MODELS: 'bg-blue-500/80',
  TOOLS: 'bg-green-500/80',
  BUSINESS: 'bg-purple-500/80',
  CREATOR: 'bg-pink-500/80',
  FILMMAKING: 'bg-orange-500/80',
  RESEARCH: 'bg-cyan-500/80',
};

export default function SwipeDeck({ articles }: SwipeDeckProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<'left' | 'right' | null>(null);
  const [exitX, setExitX] = useState(0);

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0.5, 1, 1, 1, 0.5]);

  const currentArticle = articles[currentIndex];
  const progress = articles.length > 0 ? ((currentIndex + 1) / articles.length) * 100 : 0;

  const handleDragEnd = useCallback((event: any, info: PanInfo) => {
    if (info.offset.x > SWIPE_THRESHOLD) {
      setDirection('right');
      setExitX(300);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev > 0 ? prev - 1 : prev));
        setExitX(0);
        setDirection(null);
      }, 200);
    } else if (info.offset.x < -SWIPE_THRESHOLD) {
      setDirection('left');
      setExitX(-300);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev < articles.length - 1 ? prev + 1 : prev));
        setExitX(0);
        setDirection(null);
      }, 200);
    }
  }, [articles.length]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      setDirection('right');
      setExitX(300);
      setTimeout(() => {
        setCurrentIndex((prev) => prev - 1);
        setExitX(0);
        setDirection(null);
      }, 200);
    }
  }, [currentIndex]);

  const handleNext = useCallback(() => {
    if (currentIndex < articles.length - 1) {
      setDirection('left');
      setExitX(-300);
      setTimeout(() => {
        setCurrentIndex((prev) => prev + 1);
        setExitX(0);
        setDirection(null);
      }, 200);
    }
  }, [currentIndex, articles.length]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft') handlePrev();
    if (e.key === 'ArrowRight') handleNext();
  }, [handlePrev, handleNext]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${Math.floor(diffHours / 24)}d ago`;
  };

  const openArticle = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  if (!currentArticle) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-black text-white">
        <div className="text-center">
          <p className="text-xl text-gray-400">No articles available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full bg-black flex flex-col relative overflow-hidden">
      {/* Progress bar at top */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gray-800 z-50">
        <motion.div
          className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Header */}
      <div className="flex justify-between items-start px-6 pt-12 pb-4 z-40">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Frame&Future</h1>
          <p className="text-sm text-gray-400 mt-1">{articles.length} articles</p>
        </div>
        <div className="text-right">
          <span className="text-3xl font-bold text-white">{currentIndex + 1}</span>
          <span className="text-lg text-gray-500"> / {articles.length}</span>
        </div>
      </div>

      {/* Card container */}
      <div className="flex-1 relative px-4 pb-24">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentArticle.id}
            className="absolute inset-x-4 top-0 bottom-0"
            initial={{ x: direction === 'left' ? 300 : -300, opacity: 0, scale: 0.9 }}
            animate={{ x: 0, opacity: 1, scale: 1 }}
            exit={{ x: exitX, opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            <motion.div
              className="h-full w-full rounded-3xl overflow-hidden bg-gray-900 shadow-2xl"
              style={{ x, rotate, opacity }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.8}
              onDragEnd={handleDragEnd}
              whileTap={{ cursor: 'grabbing' }}
            >
              {/* Background image */}
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{ 
                  backgroundImage: `url(${currentArticle.image_url})`,
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
              </div>

              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-end p-6">
                {/* Category pill */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {currentArticle.tags.map((tag) => (
                    <span
                      key={tag}
                      className={`px-3 py-1 rounded-full text-xs font-semibold text-white uppercase tracking-wider ${tagColors[tag] || 'bg-gray-500/80'}`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Headline */}
                <h2 className="text-2xl sm:text-3xl font-bold text-white leading-tight mb-3">
                  {currentArticle.title}
                </h2>

                {/* Summary */}
                <p className="text-gray-300 text-base leading-relaxed mb-4 line-clamp-4">
                  {currentArticle.summary}
                </p>

                {/* Source and date */}
                <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
                  <span className="font-medium text-gray-300">{currentArticle.source_name}</span>
                  <span>•</span>
                  <span>{formatDate(currentArticle.published_at)}</span>
                </div>

                {/* CTA Button */}
                <button
                  onClick={() => openArticle(currentArticle.source_url)}
                  className="w-full py-4 px-6 bg-white text-black rounded-xl font-semibold text-lg flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors active:scale-95"
                >
                  Read Full Article
                  <ExternalLink className="w-5 h-5" />
                </button>
              </div>

              {/* Swipe hints */}
              <div className="absolute top-1/2 left-4 -translate-y-1/2 pointer-events-none">
                <motion.div
                  className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: x.get() > 50 ? 1 : 0.3, x: 0 }}
                >
                  <ChevronLeft className="w-6 h-6 text-white" />
                </motion.div>
              </div>
              <div className="absolute top-1/2 right-4 -translate-y-1/2 pointer-events-none">
                <motion.div
                  className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: x.get() < -50 ? 1 : 0.3, x: 0 }}
                >
                  <ChevronRight className="w-6 h-6 text-white" />
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

            {/* Navigation buttons - positioned higher to avoid overlap */}
      <div className="absolute bottom-24 left-0 right-0 flex justify-center gap-6 z-40 px-6">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="w-12 h-12 rounded-full bg-gray-800/90 backdrop-blur-sm flex items-center justify-center text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors shadow-lg"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={handleNext}
          disabled={currentIndex === articles.length - 1}
          className="w-12 h-12 rounded-full bg-gray-800/90 backdrop-blur-sm flex items-center justify-center text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors shadow-lg"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Swipe instruction */}
      <div className="absolute bottom-10 left-0 right-0 text-center z-40">
        <p className="text-xs text-gray-500">Swipe left/right or use arrow keys</p>
      </div>
    </div>
  );
}
