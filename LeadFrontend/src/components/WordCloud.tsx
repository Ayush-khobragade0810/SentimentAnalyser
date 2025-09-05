import { useMemo } from 'react';
import { Cloud, Download, Filter } from 'lucide-react';
import { AnalysisResult } from '../types/index.ts';
import { getWordFrequency } from '../utils/analysis.ts';

interface WordCloudProps {
  results: AnalysisResult[];
}

export default function WordCloud({ results }: WordCloudProps) {
  const wordFrequencies = useMemo(() => getWordFrequency(results), [results]);

  if (results.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Cloud className="w-8 h-8 text-slate-400" />
        </div>
        <h3 className="text-lg font-medium text-slate-900 mb-2">No Word Cloud Available</h3>
        <p className="text-slate-600">Submit comments to generate word cloud visualization</p>
      </div>
    );
  }

  const maxCount = Math.max(...wordFrequencies.map((w: { word: string; count: number; relevance: number }) => w.count));
  const minCount = Math.min(...wordFrequencies.map((w: { word: string; count: number; relevance: number }) => w.count));

  const getFontSize = (count: number) => {
    const normalized = (count - minCount) / (maxCount - minCount);
    return 12 + normalized * 32; // Font size between 12px and 44px
  };

  const getColor = (index: number) => {
    const colors = [
      '#1e40af', '#059669', '#d97706', '#dc2626', '#7c3aed',
      '#db2777', '#0891b2', '#ea580c', '#65a30d', '#4338ca'
    ];
    return colors[index % colors.length];
  };

  type WordFrequency = {
    word: string;
    count: number;
    relevance: number;
  };

  const generateWordCloudLayout = () => {
    return wordFrequencies.slice(0, 30).map((word: WordFrequency, index: number) => ({
      ...word,
      x: 50 + (index % 8) * 120 + Math.random() * 40,
      y: 50 + Math.floor(index / 8) * 60 + Math.random() * 20,
      fontSize: getFontSize(word.count),
      color: getColor(index)
    }));
  };

  const layoutWords = useMemo(generateWordCloudLayout, [wordFrequencies]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-slate-900 mb-3">Word Cloud Analysis</h2>
        <p className="text-lg text-slate-600">
          Visual representation of key terms used across {results.length} stakeholder submissions
        </p>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-slate-600" />
              <span className="text-sm font-medium text-slate-700">Showing top {layoutWords.length} keywords</span>
            </div>
            <div className="text-sm text-slate-600">
              Total unique words: {wordFrequencies.length}
            </div>
          </div>
          
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors">
            <Download className="w-4 h-4" />
            <span>Export Visualization</span>
          </button>
        </div>
      </div>

      {/* Word Cloud Visualization */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-slate-900">Interactive Word Cloud</h3>
          <p className="text-sm text-slate-600">
            Word size reflects frequency of usage across all stakeholder comments
          </p>
        </div>

        <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-lg p-8 min-h-96 relative overflow-hidden">
          <svg width="100%" height="400" className="absolute inset-0">
            {layoutWords.map((word: {
              word: string;
              count: number;
              relevance: number;
              x: number;
              y: number;
              fontSize: number;
              color: string;
            }) => (
              <text
                key={word.word}
                x={word.x}
                y={word.y}
                fontSize={word.fontSize}
                fill={word.color}
                fontWeight="600"
                className="cursor-pointer hover:opacity-75 transition-opacity"
              >
                <title>{`"${word.word}" appears ${word.count} times`}</title>
                {word.word}
              </text>
            ))}
          </svg>
        </div>

        <div className="mt-4 text-xs text-slate-500 text-center">
          Hover over words to see frequency • Larger words indicate higher usage frequency
        </div>
      </div>

      {/* Word Frequency Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-900">Word Frequency Analysis</h3>
          <button className="flex items-center space-x-2 px-3 py-1 text-sm bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors">
            <Download className="w-3 h-3" />
            <span>Export CSV</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-4 font-medium text-slate-700">Rank</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Keyword</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Frequency</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Relevance</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Usage</th>
              </tr>
            </thead>
            <tbody>
              {wordFrequencies.slice(0, 15).map((word: { word: string; count: number; relevance: number }, index: number) => (
                <tr key={word.word} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="py-3 px-4 text-slate-900 font-medium">#{index + 1}</td>
                  <td className="py-3 px-4">
                    <span className="font-medium text-slate-900">{word.word}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-slate-700">{word.count}</span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-slate-200 rounded-full h-2 max-w-20">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${word.relevance * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-slate-600 w-10 text-right">
                        {(word.relevance * 100).toFixed(1)}%
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">
                      {word.count === 1 ? '1 comment' : `${word.count} comments`}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}