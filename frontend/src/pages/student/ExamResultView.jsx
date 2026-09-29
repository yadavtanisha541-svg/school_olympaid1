import React, { useState, useEffect } from 'react';
import { apiClient } from '../../api/client';
import {
  CheckCircle2,
  XCircle,
  Award,
  Clock,
  TrendingUp,
  ArrowLeft,
  BookOpen,
  FileText,
  AlertCircle
} from 'lucide-react';
import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge';

export const ExamResultView = ({ attemptId, onBack, onViewSolutions, onViewCertificate }) => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchResult = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get(`/results/${attemptId}`);
      if (res.success && res.data) {
        setResult(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResult();
  }, [attemptId]);

  if (loading) {
    return <div className="p-8 text-center text-slate-400">Loading evaluation scorecard...</div>;
  }

  if (!result) {
    return (
      <div className="p-8 text-center">
        <p className="text-slate-500">Result details not found.</p>
        <Button variant="secondary" onClick={onBack} className="mt-4">Back</Button>
      </div>
    );
  }

  const isPassed = !!result.passed;

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" icon={ArrowLeft} onClick={onBack}>
          Back to Dashboard
        </Button>

        <div className="flex items-center gap-3">
          {result.solution_visibility !== 'never' && (
            <Button variant="secondary" size="sm" icon={FileText} onClick={() => onViewSolutions(attemptId)}>
              View Detailed Solutions
            </Button>
          )}

          {result.certificate_id && (
            <Button variant="warning" size="sm" icon={Award} onClick={() => onViewCertificate(result.certificate_id)}>
              View Merit Certificate
            </Button>
          )}
        </div>
      </div>

      {/* Hero Result Banner */}
      <div
        className={`rounded-3xl p-8 text-center text-white shadow-xl relative overflow-hidden ${
          isPassed
            ? 'bg-gradient-to-br from-emerald-800 via-teal-900 to-slate-900'
            : 'bg-gradient-to-br from-rose-900 via-slate-900 to-slate-950'
        }`}
      >
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 backdrop-blur-md mb-4 shadow-inner">
          {isPassed ? (
            <CheckCircle2 className="w-10 h-10 text-emerald-300" />
          ) : (
            <XCircle className="w-10 h-10 text-rose-300" />
          )}
        </div>

        <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
          {isPassed ? 'Congratulations! Exam Qualified' : 'Exam Attempt Completed'}
        </h2>
        <p className="text-sm text-slate-200 mt-2 font-medium">
          {result.exam_title} ({result.exam_code})
        </p>

        {/* Big Score Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto mt-8">
          <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
            <span className="text-[11px] font-bold text-slate-300 uppercase block">Total Score</span>
            <span className="text-2xl sm:text-3xl font-black font-mono mt-1 block">
              {parseFloat(result.score).toFixed(1)} / {parseFloat(result.exam_total_marks).toFixed(1)}
            </span>
          </div>

          <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
            <span className="text-[11px] font-bold text-slate-300 uppercase block">Percentage</span>
            <span className="text-2xl sm:text-3xl font-black font-mono mt-1 block">
              {parseFloat(result.percentage).toFixed(1)}%
            </span>
          </div>

          <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
            <span className="text-[11px] font-bold text-slate-300 uppercase block">Accuracy</span>
            <span className="text-2xl sm:text-3xl font-black font-mono mt-1 block">
              {result.accuracy || 0}%
            </span>
          </div>

          <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
            <span className="text-[11px] font-bold text-slate-300 uppercase block">Olympiad Rank</span>
            <span className="text-2xl sm:text-3xl font-black font-mono mt-1 block text-amber-300">
              {result.rank_exam ? `#${result.rank_exam}` : 'Merit'}
            </span>
          </div>
        </div>
      </div>

      {/* Answer Distribution Breakdown */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm">
        <h3 className="text-base font-bold text-slate-900 mb-6">Question Response Summary</h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
            <span className="text-xs font-bold text-emerald-800 uppercase block">Correct Answers</span>
            <span className="text-2xl font-black text-emerald-700 mt-1 block">{result.correct_count}</span>
          </div>

          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200">
            <span className="text-xs font-bold text-rose-800 uppercase block">Wrong Answers</span>
            <span className="text-2xl font-black text-rose-700 mt-1 block">{result.wrong_count}</span>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200">
            <span className="text-xs font-bold text-amber-800 uppercase block">Unanswered</span>
            <span className="text-2xl font-black text-amber-700 mt-1 block">{result.unanswered_count}</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-xs font-bold text-slate-700 uppercase block">Time Spent</span>
            <span className="text-2xl font-black text-slate-800 mt-1 block font-mono">
              {Math.floor(result.time_spent_seconds / 60)}m {result.time_spent_seconds % 60}s
            </span>
          </div>
        </div>
      </div>

      {/* Subject-Wise Performance Breakdown */}
      {result.subject_breakdown && result.subject_breakdown.length > 0 && (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 mb-6">Subject-Wise Proficiency Breakdown</h3>

          <div className="space-y-4">
            {result.subject_breakdown.map((sb, idx) => {
              const acc = sb.total_questions > 0 ? Math.round((sb.correct_count / sb.total_questions) * 100) : 0;
              return (
                <div key={idx} className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{sb.subject_name}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {sb.correct_count} correct • {sb.wrong_count} incorrect • {sb.unanswered_count} unattempted
                    </p>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right font-mono">
                      <span className="text-xs text-slate-400 block font-bold">Marks</span>
                      <span className="text-sm font-black text-slate-900">{parseFloat(sb.score_obtained).toFixed(1)} / {parseFloat(sb.max_marks).toFixed(1)}</span>
                    </div>

                    <div className="w-24 text-right">
                      <span className="text-xs font-black text-brand-600 font-mono block">{acc}% Accuracy</span>
                      <div className="h-2 bg-slate-200 rounded-full mt-1 overflow-hidden">
                        <div className="h-full bg-brand-600 rounded-full" style={{ width: `${acc}%` }} />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
