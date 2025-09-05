import { TrendingUp, TrendingDown, Minus, CheckCircle } from 'lucide-react';
import { Comment, AnalysisResult } from '../types';

interface SentimentAnalysisProps {
  comments: Comment[];
  results: AnalysisResult[];
}

export default function SentimentAnalysis({ comments, results }: SentimentAnalysisProps) {
  if (results.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <TrendingUp className="w-8 h-8 text-slate-400" />
        </div>
        <h3 className="text-lg font-medium text-slate-900 mb-2">No Analysis Available</h3>
        <p className="text-slate-600">Submit comments to see sentiment analysis results</p>
      </div>
    );
  }

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return <TrendingUp className="w-5 h-5 text-emerald-600" />;
      case 'negative': return <TrendingDown className="w-5 h-5 text-red-600" />;
      default: return <Minus className="w-5 h-5 text-amber-600" />;
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'bg-emerald-50 border-emerald-200 text-emerald-800';
      case 'negative': return 'bg-red-50 border-red-200 text-red-800';
      default: return 'bg-amber-50 border-amber-200 text-amber-800';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-emerald-600';
    if (confidence >= 0.6) return 'text-amber-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-slate-900 mb-3">Sentiment Analysis Results</h2>
        <p className="text-lg text-slate-600">
          AI-powered sentiment analysis of {results.length} stakeholder comments
        </p>
      </div>

      {/* Overall Statistics */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center space-x-2">
          <CheckCircle className="w-5 h-5 text-blue-700" />
          <span>Overall Sentiment Distribution</span>
        </h3>
        
        <div className="grid md:grid-cols-3 gap-4">
          {['positive', 'negative', 'neutral'].map(sentiment => {
            const count = results.filter(r => r.sentiment.overall === sentiment).length;
            const percentage = (count / results.length * 100).toFixed(1);
            
            return (
              <div key={sentiment} className={`p-4 rounded-lg border ${getSentimentColor(sentiment)}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {getSentimentIcon(sentiment)}
                    <span className="font-medium capitalize">{sentiment}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold">{count}</div>
                    <div className="text-sm opacity-75">{percentage}%</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Individual Results */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-900">Individual Comment Analysis</h3>
        
        {results.map((result) => {
          const comment = comments.find(c => c.id === result.commentId);
          if (!comment) return null;

          return (
            <div key={result.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-medium text-slate-900">{comment.stakeholder}</span>
                    {comment.section && (
                      <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">
                        {comment.section}
                      </span>
                    )}
                  </div>
                  <span className="text-sm text-slate-500">
                    {comment.timestamp.toLocaleDateString()} at {comment.timestamp.toLocaleTimeString()}
                  </span>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className={`px-3 py-1 rounded-full border text-sm font-medium ${getSentimentColor(result.sentiment.overall)}`}>
                    <div className="flex items-center space-x-1">
                      {getSentimentIcon(result.sentiment.overall)}
                      <span className="capitalize">{result.sentiment.overall}</span>
                    </div>
                  </div>
                  <div className="text-sm">
                    <span className="text-slate-500">Confidence: </span>
                    <span className={`font-medium ${getConfidenceColor(result.confidence)}`}>
                      {(result.confidence * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-slate-700 leading-relaxed">{comment.content}</p>
              </div>

              {/* Sentiment Breakdown */}
              <div className="bg-slate-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-slate-700 mb-3">Sentiment Breakdown</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-emerald-700 flex items-center space-x-1">
                      <TrendingUp className="w-3 h-3" />
                      <span>Positive</span>
                    </span>
                    <div className="flex-1 mx-3 bg-slate-200 rounded-full h-2">
                      <div 
                        className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${result.sentiment.positive * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-slate-600 w-12 text-right">
                      {(result.sentiment.positive * 100).toFixed(1)}%
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-red-700 flex items-center space-x-1">
                      <TrendingDown className="w-3 h-3" />
                      <span>Negative</span>
                    </span>
                    <div className="flex-1 mx-3 bg-slate-200 rounded-full h-2">
                      <div 
                        className="bg-red-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${result.sentiment.negative * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-slate-600 w-12 text-right">
                      {(result.sentiment.negative * 100).toFixed(1)}%
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-amber-700 flex items-center space-x-1">
                      <Minus className="w-3 h-3" />
                      <span>Neutral</span>
                    </span>
                    <div className="flex-1 mx-3 bg-slate-200 rounded-full h-2">
                      <div 
                        className="bg-amber-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${result.sentiment.neutral * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-slate-600 w-12 text-right">
                      {(result.sentiment.neutral * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}