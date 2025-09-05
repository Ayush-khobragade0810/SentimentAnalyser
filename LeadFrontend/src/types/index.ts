export interface Comment {
  id: string;
  content: string;
  stakeholder: string;
  timestamp: Date;
  section?: string; // Specific provision/section the comment refers to
}

export interface SentimentScore {
  positive: number;
  negative: number;
  neutral: number;
  overall: 'positive' | 'negative' | 'neutral';
}

// export interface AnalysisResult {
//   id: string;
//   commentId: string;
//   sentiment: SentimentScore;
//   summary: string;
//   keywords: string[];
//   confidence: number;
//   timestamp: Date;
// }

// types/index.ts
export type AnalysisResult = {
  id: string;
  commentId: string;
  sentiment: SentimentScore;
  summary: string;
  keywords: string[];
  confidence: number;
  timestamp: Date;
};

// Optionally export a default structure (runtime object)
export const defaultAnalysisResult: AnalysisResult = {
  id: "",
  commentId: "",
  sentiment: { positive: 0, negative: 0, neutral: 0, overall: "neutral" },
  summary: "",
  keywords: [],
  confidence: 0,
  timestamp: new Date(),
};

export interface WordFrequency {
  word: string;
  count: number;
  relevance: number;
}