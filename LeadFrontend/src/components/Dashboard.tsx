import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Users, 
  FileText, 
  Calendar,
  Download,
  AlertCircle,
  CheckCircle,
  Clock,
  Target
} from 'lucide-react';
import { Comment, AnalysisResult } from '../types';

interface DashboardProps {
  comments: Comment[];
  results: AnalysisResult[];
}

export default function Dashboard({ comments, results }: DashboardProps) {
  if (results.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <BarChart3 className="w-8 h-8 text-slate-400" />
        </div>
        <h3 className="text-lg font-medium text-slate-900 mb-2">No Data to Display</h3>
        <p className="text-slate-600">Submit stakeholder comments to view comprehensive analysis dashboard</p>
      </div>
    );
  }

  // Calculate metrics
  const totalComments = results.length;
  const sentimentCounts = {
    positive: results.filter(r => r.sentiment.overall === 'positive').length,
    negative: results.filter(r => r.sentiment.overall === 'negative').length,
    neutral: results.filter(r => r.sentiment.overall === 'neutral').length
  };

  const averageConfidence = results.reduce((sum, r) => sum + r.confidence, 0) / results.length;
  const uniqueStakeholders = new Set(comments.map(c => c.stakeholder)).size;
  const sectionsReferenced = new Set(comments.filter(c => c.section).map(c => c.section)).size;

  // Get top keywords
  const allKeywords = results.flatMap(r => r.keywords);
  const keywordCounts = new Map<string, number>();
  allKeywords.forEach(keyword => {
    keywordCounts.set(keyword, (keywordCounts.get(keyword) || 0) + 1);
  });
  const topKeywords = Array.from(keywordCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);

  // Section analysis
  const sectionAnalysis = comments
    .filter(c => c.section)
    .reduce((acc, comment) => {
      const result = results.find(r => r.commentId === comment.id);
      if (result) {
        if (!acc[comment.section!]) {
          acc[comment.section!] = { positive: 0, negative: 0, neutral: 0, total: 0 };
        }
        acc[comment.section!][result.sentiment.overall]++;
        acc[comment.section!].total++;
      }
      return acc;
    }, {} as Record<string, { positive: number; negative: number; neutral: number; total: number }>);

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return <TrendingUp className="w-5 h-5 text-emerald-600" />;
      case 'negative': return <TrendingDown className="w-5 h-5 text-red-600" />;
      default: return <Minus className="w-5 h-5 text-amber-600" />;
    }
  };

  const getSentimentPercentage = (count: number) => ((count / totalComments) * 100).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-slate-900 mb-3">Consultation Analysis Dashboard</h2>
        <p className="text-lg text-slate-600">
          Comprehensive overview of stakeholder feedback and AI-powered insights
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-700" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900">{totalComments}</div>
              <div className="text-sm text-slate-600">Total Comments</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-emerald-700" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900">{uniqueStakeholders}</div>
              <div className="text-sm text-slate-600">Unique Stakeholders</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
              <Target className="w-5 h-5 text-amber-700" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900">{sectionsReferenced}</div>
              <div className="text-sm text-slate-600">Sections Referenced</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-purple-700" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900">{(averageConfidence * 100).toFixed(1)}%</div>
              <div className="text-sm text-slate-600">Avg Confidence</div>
            </div>
          </div>
        </div>
      </div>

      {/* Sentiment Overview */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-blue-700" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Sentiment Distribution</h3>
              <p className="text-sm text-slate-600">Overall stakeholder sentiment analysis</p>
            </div>
          </div>
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors">
            <Download className="w-4 h-4" />
            <span>Export Report</span>
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-6">
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
                <span className="font-medium text-emerald-800">Positive</span>
              </div>
              <span className="text-2xl font-bold text-emerald-800">{sentimentCounts.positive}</span>
            </div>
            <div className="text-sm text-emerald-700">{getSentimentPercentage(sentimentCounts.positive)}% of total</div>
            <div className="mt-2 bg-emerald-200 rounded-full h-2">
              <div 
                className="bg-emerald-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${(sentimentCounts.positive / totalComments) * 100}%` }}
              />
            </div>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <TrendingDown className="w-5 h-5 text-red-600" />
                <span className="font-medium text-red-800">Negative</span>
              </div>
              <span className="text-2xl font-bold text-red-800">{sentimentCounts.negative}</span>
            </div>
            <div className="text-sm text-red-700">{getSentimentPercentage(sentimentCounts.negative)}% of total</div>
            <div className="mt-2 bg-red-200 rounded-full h-2">
              <div 
                className="bg-red-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${(sentimentCounts.negative / totalComments) * 100}%` }}
              />
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Minus className="w-5 h-5 text-amber-600" />
                <span className="font-medium text-amber-800">Neutral</span>
              </div>
              <span className="text-2xl font-bold text-amber-800">{sentimentCounts.neutral}</span>
            </div>
            <div className="text-sm text-amber-700">{getSentimentPercentage(sentimentCounts.neutral)}% of total</div>
            <div className="mt-2 bg-amber-200 rounded-full h-2">
              <div 
                className="bg-amber-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${(sentimentCounts.neutral / totalComments) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Key Insights */}
        <div className="bg-slate-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-slate-700 mb-3">Key Insights</h4>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-start space-x-2">
              {sentimentCounts.positive >= sentimentCounts.negative ? (
                <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5" />
              )}
              <span className="text-slate-700">
                {sentimentCounts.positive >= sentimentCounts.negative 
                  ? 'Majority of stakeholders show positive sentiment toward the proposed amendments'
                  : 'Stakeholder concerns require careful consideration and potential amendments'
                }
              </span>
            </div>
            <div className="flex items-start space-x-2">
              <Clock className="w-4 h-4 text-blue-600 mt-0.5" />
              <span className="text-slate-700">
                Analysis confidence level: {(averageConfidence * 100).toFixed(1)}% average across all submissions
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Top Keywords */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
            <Target className="w-5 h-5 text-purple-700" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Most Discussed Topics</h3>
            <p className="text-sm text-slate-600">Key themes emerging from stakeholder feedback</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {topKeywords.map(([keyword, count]) => (
            <div key={keyword} className="bg-slate-50 rounded-lg p-4 text-center">
              <div className="text-lg font-bold text-slate-900">{count}</div>
              <div className="text-sm text-slate-600 capitalize">{keyword}</div>
              <div className="text-xs text-slate-500 mt-1">mentions</div>
            </div>
          ))}
        </div>
      </div>

      {/* Section-wise Analysis */}
      {Object.keys(sectionAnalysis).length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-indigo-700" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Section-wise Feedback Analysis</h3>
              <p className="text-sm text-slate-600">Sentiment breakdown by specific legislative sections</p>
            </div>
          </div>

          <div className="space-y-4">
            {Object.entries(sectionAnalysis)
              .sort((a, b) => b[1].total - a[1].total)
              .map(([section, data]) => (
                <div key={section} className="border border-slate-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <span className="font-medium text-slate-900">{section}</span>
                      <span className="text-sm text-slate-600 ml-2">
                        ({data.total} {data.total === 1 ? 'comment' : 'comments'})
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      {data.positive > 0 && (
                        <span className="px-2 py-1 bg-emerald-100 text-emerald-800 text-xs rounded-full">
                          +{data.positive}
                        </span>
                      )}
                      {data.negative > 0 && (
                        <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                          -{data.negative}
                        </span>
                      )}
                      {data.neutral > 0 && (
                        <span className="px-2 py-1 bg-amber-100 text-amber-800 text-xs rounded-full">
                          ±{data.neutral}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex rounded-full h-3 bg-slate-200 overflow-hidden">
                    {data.positive > 0 && (
                      <div 
                        className="bg-emerald-500 transition-all duration-500"
                        style={{ width: `${(data.positive / data.total) * 100}%` }}
                      />
                    )}
                    {data.negative > 0 && (
                      <div 
                        className="bg-red-500 transition-all duration-500"
                        style={{ width: `${(data.negative / data.total) * 100}%` }}
                      />
                    )}
                    {data.neutral > 0 && (
                      <div 
                        className="bg-amber-500 transition-all duration-500"
                        style={{ width: `${(data.neutral / data.total) * 100}%` }}
                      />
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Timeline Analysis */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
            <Calendar className="w-5 h-5 text-green-700" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Submission Timeline</h3>
            <p className="text-sm text-slate-600">Comment submission patterns over time</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-medium text-slate-700 mb-3">Recent Activity</h4>
            <div className="space-y-3">
              {comments
                .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
                .slice(0, 5)
                .map((comment) => {
                  const result = results.find(r => r.commentId === comment.id);
                  return (
                    <div key={comment.id} className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        {result && getSentimentIcon(result.sentiment.overall)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-slate-900 truncate">
                          {comment.stakeholder}
                        </div>
                        <div className="text-xs text-slate-600">
                          {comment.timestamp.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-slate-700 mb-3">Participation Statistics</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-slate-100">
                <span className="text-sm text-slate-600">First Submission</span>
                <span className="text-sm font-medium text-slate-900">
                  {comments.length > 0 ? 
                    comments.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())[0].timestamp.toLocaleDateString()
                    : 'N/A'
                  }
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-slate-100">
                <span className="text-sm text-slate-600">Latest Submission</span>
                <span className="text-sm font-medium text-slate-900">
                  {comments.length > 0 ? 
                    comments.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())[0].timestamp.toLocaleDateString()
                    : 'N/A'
                  }
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-slate-100">
                <span className="text-sm text-slate-600">Avg. Comment Length</span>
                <span className="text-sm font-medium text-slate-900">
                  {Math.round(comments.reduce((sum, c) => sum + c.content.length, 0) / comments.length)} chars
                </span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-slate-600">High Confidence Results</span>
                <span className="text-sm font-medium text-slate-900">
                  {results.filter(r => r.confidence >= 0.8).length} / {totalComments}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-700 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold mb-2">Analysis Complete</h3>
            <p className="text-blue-100">
              Ready to export comprehensive report for legislative review and decision-making
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <button className="bg-white text-blue-700 px-4 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Export Full Report</span>
            </button>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-500 transition-colors flex items-center space-x-2">
              <FileText className="w-4 h-4" />
              <span>Generate Summary</span>
            </button>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
            <AlertCircle className="w-5 h-5 text-orange-700" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900">AI Recommendations</h3>
            <p className="text-sm text-slate-600">Automated insights for policy consideration</p>
          </div>
        </div>

        <div className="space-y-3">
          {sentimentCounts.negative > sentimentCounts.positive && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5" />
                <div>
                  <div className="font-medium text-amber-800">Review Required</div>
                  <div className="text-sm text-amber-700">
                    Higher negative sentiment detected. Consider addressing key concerns in stakeholder feedback.
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {averageConfidence < 0.7 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5" />
                <div>
                  <div className="font-medium text-blue-800">Manual Review Suggested</div>
                  <div className="text-sm text-blue-700">
                    Lower confidence scores indicate complex feedback that may benefit from human review.
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-start space-x-2">
              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
              <div>
                <div className="font-medium text-green-800">Analysis Complete</div>
                <div className="text-sm text-green-700">
                  All {totalComments} stakeholder submissions have been processed and categorized for review.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}