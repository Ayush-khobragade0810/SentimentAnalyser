import { useState } from 'react';
import { FileText, Download, Copy, Check } from 'lucide-react';
import { Comment, AnalysisResult } from '../types';

interface SummaryGeneratorProps {
  comments: Comment[];
  results: AnalysisResult[];
}

export default function SummaryGenerator({ comments, results }: SummaryGeneratorProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (results.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <FileText className="w-8 h-8 text-slate-400" />
        </div>
        <h3 className="text-lg font-medium text-slate-900 mb-2">No Summaries Available</h3>
        <p className="text-slate-600">Submit comments to generate AI-powered summaries</p>
      </div>
    );
  }

  const handleCopy = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const generateOverallSummary = () => {
    const sentimentCounts = {
      positive: results.filter(r => r.sentiment.overall === 'positive').length,
      negative: results.filter(r => r.sentiment.overall === 'negative').length,
      neutral: results.filter(r => r.sentiment.overall === 'neutral').length
    };

    const totalComments = results.length;
    const dominantSentiment = Object.entries(sentimentCounts).sort((a, b) => b[1] - a[1])[0][0];

    const keyThemes = [...new Set(results.flatMap(r => r.keywords))]
      .slice(0, 10)
      .join(', ');

    return `Analysis of ${totalComments} stakeholder submissions reveals a ${dominantSentiment} overall sentiment (${sentimentCounts.positive} positive, ${sentimentCounts.negative} negative, ${sentimentCounts.neutral} neutral). Key themes emerging from the feedback include: ${keyThemes}. The submissions demonstrate active stakeholder engagement with the proposed amendments, providing valuable insights for policy refinement.`;
  };

  const overallSummary = generateOverallSummary();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-slate-900 mb-3">AI-Generated Summaries</h2>
        <p className="text-lg text-slate-600">
          Concise summaries of stakeholder feedback for efficient review
        </p>
      </div>

      {/* Overall Summary */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-700" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Overall Consultation Summary</h3>
              <p className="text-sm text-slate-600">Comprehensive analysis of all submissions</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleCopy(overallSummary, 'overall')}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            >
              {copiedId === 'overall' ? (
                <Check className="w-4 h-4 text-emerald-600" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
            <button className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors">
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="bg-slate-50 rounded-lg p-4">
          <p className="text-slate-700 leading-relaxed">{overallSummary}</p>
        </div>
      </div>

      {/* Individual Summaries */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-900">Individual Comment Summaries</h3>
        
        {results.map((result) => {
          const comment = comments.find(c => c.id === result.commentId);
          if (!comment) return null;

          const getSentimentBadgeColor = (sentiment: string) => {
            switch (sentiment) {
              case 'positive': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
              case 'negative': return 'bg-red-100 text-red-800 border-red-200';
              default: return 'bg-amber-100 text-amber-800 border-amber-200';
            }
          };

          return (
            <div key={result.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="font-medium text-slate-900">{comment.stakeholder}</span>
                    {comment.section && (
                      <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">
                        {comment.section}
                      </span>
                    )}
                    <span className={`text-xs px-2 py-1 rounded border font-medium ${getSentimentBadgeColor(result.sentiment.overall)}`}>
                      {result.sentiment.overall.toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm text-slate-500">
                    {comment.timestamp.toLocaleDateString()}
                  </span>
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  <span className="text-sm text-slate-500">Confidence: </span>
                  <span className="text-sm font-medium text-slate-700">
                    {(result.confidence * 100).toFixed(1)}%
                  </span>
                  <button
                    onClick={() => handleCopy(result.summary, result.id)}
                    className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    {copiedId === result.id ? (
                      <Check className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-slate-700 mb-2">Original Comment</h4>
                  <div className="bg-slate-50 rounded-lg p-3">
                    <p className="text-sm text-slate-600 leading-relaxed">{comment.content}</p>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-slate-700 mb-2">AI Summary</h4>
                  <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                    <p className="text-slate-700 leading-relaxed">{result.summary}</p>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-slate-700 mb-2">Key Topics</h4>
                  <div className="flex flex-wrap gap-2">
                    {result.keywords.slice(0, 8).map((keyword, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded-full"
                      >
                        {keyword}
                      </span>
                    ))}
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