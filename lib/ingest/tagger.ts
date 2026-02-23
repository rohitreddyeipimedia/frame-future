export type Tag = 'LEGAL' | 'MODELS' | 'TOOLS' | 'BUSINESS' | 'CREATOR' | 'FILMMAKING' | 'RESEARCH';

const tagKeywords: Record<Tag, string[]> = {
  LEGAL: [
    'regulation', 'regulatory', 'law', 'legal', 'compliance', 'policy', 'governance',
    'eu ai act', 'copyright', 'lawsuit', 'legislation', 'ethical', 'safety',
    'oversight', 'audit', 'liability', 'privacy', 'gdpr', 'ban', 'restrict'
  ],
  MODELS: [
    'gpt', 'llm', 'language model', 'foundation model', 'transformer', 'neural network',
    'deep learning', 'machine learning', 'model', 'training', 'fine-tuning',
    'parameters', 'inference', 'benchmark', 'performance', 'accuracy',
    'claude', 'gemini', 'llama', 'mistral', 'anthropic', 'openai'
  ],
  TOOLS: [
    'tool', 'platform', 'software', 'api', 'sdk', 'integration', 'plugin',
    'extension', 'automation', 'workflow', 'product', 'feature', 'release',
    'launch', 'update', 'version', 'github', 'open source', 'library'
  ],
  BUSINESS: [
    'funding', 'investment', 'valuation', 'revenue', 'profit', 'ipo', 'acquisition',
    'merger', 'partnership', 'collaboration', 'enterprise', 'startup', 'unicorn',
    'market', 'industry', 'commercial', 'business', 'strategy', 'growth',
    'microsoft', 'google', 'amazon', 'meta', 'apple', 'nvidia'
  ],
  CREATOR: [
    'artist', 'designer', 'creator', 'content', 'creative', 'art', 'illustration',
    'graphic design', 'music', 'audio', 'voice', 'podcast', 'writing',
    'copywriting', 'marketing', 'social media', 'influencer', 'brand'
  ],
  FILMMAKING: [
    'video', 'film', 'movie', 'cinema', 'animation', 'motion', 'visual effects',
    'vfx', 'cgi', 'rendering', '3d', 'camera', 'editing', 'production',
    'director', 'scene', 'frame', 'shot', 'storyboard', 'generative video'
  ],
  RESEARCH: [
    'research', 'paper', 'study', 'experiment', 'arxiv', 'publication',
    'journal', 'conference', 'neurips', 'icml', 'cvpr', 'acl', 'breakthrough',
    'discovery', 'innovation', 'novel', 'method', 'algorithm', 'architecture',
    'university', 'lab', 'scientist', 'phd', 'academic'
  ]
};

export function inferTags(title: string, content: string, defaultTags: string[] = []): Tag[] {
  const text = `${title} ${content}`.toLowerCase();
  const scores: Record<Tag, number> = {
    LEGAL: 0, MODELS: 0, TOOLS: 0, BUSINESS: 0,
    CREATOR: 0, FILMMAKING: 0, RESEARCH: 0
  };

  // Count keyword matches for each tag
  (Object.keys(tagKeywords) as Tag[]).forEach((tag) => {
    tagKeywords[tag].forEach((keyword) => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      const matches = text.match(regex);
      if (matches) {
        scores[tag] += matches.length;
      }
    });
  });

  // Boost scores for default tags
  defaultTags.forEach((tag) => {
    const upperTag = tag.toUpperCase() as Tag;
    if (scores[upperTag] !== undefined) {
      scores[upperTag] += 2;
    }
  });

  // Get top 2 tags with highest scores
  const sortedTags = (Object.keys(scores) as Tag[])
    .filter(tag => scores[tag] > 0)
    .sort((a, b) => scores[b] - scores[a])
    .slice(0, 2);

  // If no tags matched, use default tags or RESEARCH as fallback
  if (sortedTags.length === 0) {
    if (defaultTags.length > 0) {
      return defaultTags.slice(0, 2).map(t => t.toUpperCase() as Tag);
    }
    return ['RESEARCH'];
  }

  return sortedTags;
}
