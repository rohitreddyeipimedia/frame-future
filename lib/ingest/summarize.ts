export function createSummary(content: string, title: string): string {
  if (!content || content.trim().length === 0) {
    // If no content, create a generic summary from title
    return `${title}. This article discusses recent developments in artificial intelligence and technology.`;
  }

  // Clean the content
  const cleanContent = content
    .replace(/<[^>]*>/g, ' ') // Remove HTML tags
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();

  // Extract first 2-3 sentences (roughly 200-300 characters)
  const sentences = cleanContent
    .replace(/([.!?])\s+/g, '$1|')
    .split('|')
    .filter(s => s.trim().length > 20);

  if (sentences.length === 0) {
    return `${title}. Read the full article for more details.`;
  }

  // Take first 2-3 sentences
  const summarySentences = sentences.slice(0, Math.min(3, sentences.length));
  let summary = summarySentences.join('. ').trim();

  // Ensure it ends with a period
  if (!summary.endsWith('.') && !summary.endsWith('!') && !summary.endsWith('?')) {
    summary += '.';
  }

  // Limit to ~250 characters
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
