import React, { useState, useEffect } from 'react';
import { Upload, FileText, BarChart3, Cloud, Eye } from 'lucide-react';
import CommentInput from './components/CommentInput';
import SentimentAnalysis from './components/SentimentAnalysis';
import SummaryGenerator from './components/SummaryGenerator';
import WordCloud from './components/WordCloud';
import Dashboard from './components/Dashboard';
import { analyzeSentiment, generateSummary, extractKeywords } from './utils/analysis';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  /** @type {import("./types").Comment[]} */
  const [comments, setComments] = useState([]);

  /** @type {import("./types").AnalysisResult[]} */
  const [analysisResults, setAnalysisResults] = useState([]);

  const [activeTab, setActiveTab] = useState('input');
  const [isProcessing, setIsProcessing] = useState(false);

  // Fetch comments from backend on page load
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await fetch('http://localhost:5000/comments');
        const data = await res.json();

        const loadedComments = data.map(c => ({
          id: c.id,
          content: c.comment,
          stakeholder: c.stakeholder_name,
          section: c.section_reference,
          timestamp: new Date(c.created_at)
        }));

        setComments(loadedComments);

        // Run AI analysis for loaded comments
        const results = loadedComments.map((comment, index) => ({
          id: `result-${index}`,
          commentId: comment.id,
          sentiment: analyzeSentiment(comment.content),
          summary: generateSummary(comment.content),
          keywords: extractKeywords(comment.content),
          confidence: Math.random() * 0.3 + 0.7,
          timestamp: new Date()
        }));

        setAnalysisResults(results);
      } catch (err) {
        toast.error("Failed to load comments from server");
        console.error('Error loading comments:', err);
      }
    };

    fetchComments();
  }, []);

  const processComments = async (newComments) => {
    setIsProcessing(true);

    const savedComments = [];
    for (const comment of newComments) {
      try {
        const res = await fetch('http://localhost:5000/comments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            stakeholderName: comment.stakeholder,
            sectionReference: comment.section,
            comment: comment.content
          })
        });
        if (!res.ok) throw new Error('Failed to save comment');
        const saved = await res.json();
        savedComments.push({
          id: saved.id,
          content: saved.comment,
          stakeholder: saved.stakeholder_name,
          section: saved.section_reference,
          timestamp: new Date(saved.created_at)
        });
      } catch (err) {
        toast.error("Error saving comment");
        console.error('Error saving comment:', err);
      }
    }

    if (savedComments.length > 0) {
      // Run AI analysis
      const results = savedComments.map((comment, index) => ({
        id: `result-${Date.now()}-${index}`,
        commentId: comment.id,
        sentiment: analyzeSentiment(comment.content),
        summary: generateSummary(comment.content),
        keywords: extractKeywords(comment.content),
        confidence: Math.random() * 0.3 + 0.7,
        timestamp: new Date()
      }));

      setComments(prev => [...prev, ...savedComments]);
      setAnalysisResults(prev => [...prev, ...results]);
      toast.success("Comment submitted successfully!");
      setActiveTab('dashboard');
    }

    setIsProcessing(false);
  };

  const handleClearData = () => {
    setComments([]);
    setAnalysisResults([]);
    setActiveTab('input');
    toast.info("🗑️ Data cleared");
  };

  const tabs = [
    { id: 'input', label: 'Comment Input', icon: Upload },
    { id: 'analysis', label: 'Sentiment Analysis', icon: BarChart3 },
    { id: 'summary', label: 'Summary Generator', icon: FileText },
    { id: 'wordcloud', label: 'Word Cloud', icon: Cloud },
    { id: 'dashboard', label: 'Dashboard', icon: Eye }
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-[Segoe_UI] text-slate-800">
      {/* Toastify Container */}
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Header */}
      <header className="bg-gradient-to-r from-[#1a4b8c] to-[#2a5a9a] text-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-[#3a7bd5] to-[#00d2ff] rounded-xl flex items-center justify-center shadow-md transform transition-transform hover:rotate-6">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-bold">eConsultation Analysis Platform</h1>
              <p className="text-xs md:text-sm text-slate-100 opacity-90 max-w-xs">
                Ministry of Corporate Affairs - AI-Powered Feedback Analysis
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 flex overflow-x-auto">
          <div className="flex space-x-6 md:space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                    isActive
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {isProcessing && (
          <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-700"></div>
              <span className="text-blue-800 font-medium">
                Processing comments with AI analysis...
              </span>
            </div>
          </div>
        )}

        {activeTab === "input" && (
          <CommentInput
            onCommentsSubmit={processComments}
            isProcessing={isProcessing}
          />
        )}

        {activeTab === "analysis" && (
          <SentimentAnalysis comments={comments} results={analysisResults} />
        )}

        {activeTab === "summary" && (
          <SummaryGenerator comments={comments} results={analysisResults} />
        )}

        {activeTab === "wordcloud" && <WordCloud results={analysisResults} />}

        {activeTab === "dashboard" && (
          <Dashboard comments={comments} results={analysisResults} onClear={handleClearData} />
        )}
      </main>
    </div>
  );
}

export default App;
