import { useState } from 'react';
import { Plus, Loader2 } from 'lucide-react';
import { Comment } from '../types';

interface CommentInputProps {
  onCommentsSubmit?: (comments: Comment[]) => void;
  isProcessing: boolean;
}

export default function CommentInput({ onCommentsSubmit, isProcessing }: CommentInputProps) {
  const [singleComment, setSingleComment] = useState('');
  const [stakeholder, setStakeholder] = useState('');
  const [section, setSection] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSingleSubmit = async () => {
    if (!singleComment.trim() || !stakeholder.trim()) return;

    const comment: Comment = {
      id: `comment-${Date.now()}`,
      content: singleComment.trim(),
      stakeholder: stakeholder.trim(),
      section: section.trim() || undefined,
      timestamp: new Date()
    };

    try {
      setLoading(true);

      // Send to backend
      const res = await fetch("http://localhost:5000/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stakeholder_name: stakeholder,
          section_reference: section,
          comment: singleComment,
        }),
      });

      if (!res.ok) throw new Error("Failed to save comment");
      const data = await res.json();
      console.log("Saved to backend:", data);

      // Notify parent if needed
      if (onCommentsSubmit) {
        onCommentsSubmit([comment]);
      }

      // Reset fields
      setSingleComment('');
      setStakeholder('');
      setSection('');
    } catch (err) {
      console.error("Error saving comment:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-slate-900 mb-3">Submit Stakeholder Comments</h2>
        <p className="text-lg text-slate-600 max-w-3xl mx-auto">
          Input stakeholder feedback and suggestions on draft legislation for comprehensive AI-powered analysis
        </p>
      </div>

      {/* Centered Form Card */}
      <div className="flex justify-center">
        <div className="w-full max-w-2xl bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          {/* Card Header */}
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Plus className="w-5 h-5 text-blue-700" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Individual Comment</h3>
              <p className="text-sm text-slate-600">Submit a single stakeholder comment for analysis</p>
            </div>
          </div>

          {/* Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault(); // prevent full page reload
              handleSingleSubmit();
            }}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Stakeholder Name/Organization
              </label>
              <input
                type="text"
                value={stakeholder}
                onChange={(e) => setStakeholder(e.target.value)}
                placeholder="e.g., Institute of Company Secretaries"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Section Reference (Optional)
              </label>
              <input
                type="text"
                value={section}
                onChange={(e) => setSection(e.target.value)}
                placeholder="e.g., Section 134(3)"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Comment/Suggestion
              </label>
              <textarea
                value={singleComment}
                onChange={(e) => setSingleComment(e.target.value)}
                rows={10}
                placeholder="Enter detailed feedback, suggestions, or concerns regarding the draft legislation..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
              />
            </div>

            <button
              type="submit" // ✅ submit button
              disabled={!singleComment.trim() || !stakeholder.trim() || loading || isProcessing}
              className="w-full bg-blue-700 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-800 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
            >
              {loading || isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Submit Comment</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
