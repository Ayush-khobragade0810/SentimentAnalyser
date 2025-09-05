import { SentimentScore } from '../types';

// Lexicon-based sentiment analysis
const positiveWords = [
  'good', 'excellent', 'great', 'positive', 'beneficial', 'support', 'approve', 'agree', 
  'helpful', 'effective', 'useful', 'valuable', 'important', 'necessary', 'welcome',
  'appreciate', 'commend', 'endorse', 'favor', 'recommend', 'enhance', 'improve'
];

const negativeWords = [
  'bad', 'poor', 'negative', 'harmful', 'oppose', 'disagree', 'reject', 'problematic',
  'ineffective', 'useless', 'unnecessary', 'concern', 'issue', 'problem', 'difficult',
  'complicated', 'burden', 'unfair', 'inadequate', 'insufficient', 'flawed', 'wrong'
];

export function analyzeSentiment(text: string): SentimentScore {
  const words = text.toLowerCase().split(/\W+/);
  let positiveCount = 0;
  let negativeCount = 0;

  words.forEach(word => {
    if (positiveWords.includes(word)) positiveCount++;
    if (negativeWords.includes(word)) negativeCount++;
  });

  const totalSentimentWords = positiveCount + negativeCount;
  
  if (totalSentimentWords === 0) {
    return {
      positive: 0.33,
      negative: 0.33,
      neutral: 0.34,
      overall: 'neutral'
    };
  }

  const positive = positiveCount / totalSentimentWords;
  const negative = negativeCount / totalSentimentWords;
  const neutral = Math.max(0, 1 - positive - negative);

  let overall: 'positive' | 'negative' | 'neutral';
  if (positive > negative && positive > 0.4) overall = 'positive';
  else if (negative > positive && negative > 0.4) overall = 'negative';
  else overall = 'neutral';

  return { positive, negative, neutral, overall };
}

export function generateSummary(text: string): string {
  // Simple extractive summary - take first sentence and key points
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 10);
  
  if (sentences.length <= 2) {
    return text.slice(0, 150) + (text.length > 150 ? '...' : '');
  }
  
  // Extract key sentences (first and those with important keywords)
  const keySentences = sentences.filter((sentence, index) => {
    const lowerSentence = sentence.toLowerCase();
    return index === 0 || 
           lowerSentence.includes('suggest') ||
           lowerSentence.includes('recommend') ||
           lowerSentence.includes('propose') ||
           lowerSentence.includes('should') ||
           lowerSentence.includes('must') ||
           lowerSentence.includes('important');
  }).slice(0, 2);

  return keySentences.join('. ').trim() + '.';
}

export function extractKeywords(text: string): string[] {
  // Stop words to filter out
  const stopWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with',
    'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does',
    'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'can', 'this',
    'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him',
    'her', 'us', 'them', 'my', 'your', 'his', 'its', 'our', 'their'
  ]);

  const words = text.toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 3 && !stopWords.has(word));

  // Count word frequency
  const wordCount = new Map<string, number>();
  words.forEach(word => {
    wordCount.set(word, (wordCount.get(word) || 0) + 1);
  });

  // Return top keywords sorted by frequency
  return Array.from(wordCount.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([word]) => word);
}

export function getWordFrequency(results: any[]): { word: string; count: number; relevance: number }[] {
  const allKeywords = results.flatMap(result => result.keywords);
  const wordCount = new Map<string, number>();

  allKeywords.forEach(word => {
    wordCount.set(word, (wordCount.get(word) || 0) + 1);
  });

  return Array.from(wordCount.entries())
    .map(([word, count]) => ({
      word,
      count,
      relevance: count / allKeywords.length
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 50);
}