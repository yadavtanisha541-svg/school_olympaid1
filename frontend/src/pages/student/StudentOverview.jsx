import React, { useState, useEffect } from 'react';
import { apiClient } from '../../api/client';
import {
  BookOpen,
  Award,
  Trophy,
  CheckCircle2,
  TrendingUp,
  Clock,
  ArrowRight,
  Sparkles,
  Zap,
  Play
} from 'lucide-react';
import { StatCard } from '../../components/StatCard';
import { Badge } from '../../components/Badge';
import { Button } from '../../components/Button';

export const StudentOverview = ({ onNavigateTab, onStartExam, onViewResult }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/analytics/student');
      if (res.success && res.data) {
        setData(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-slate-400">Loading candidate portal...</div>;
  }

  const metrics = data?.metrics || {};

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-brand-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl">
        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/20 border border-brand-400/30 text-brand-300 text-xs font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            National Assessment Ready
          </span>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
            Welcome to Your Olympiad Examination Dashboard
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
            Test your competitive skills across Mathematics, Science, General Knowledge and Computer Logic. Instant evaluation, rankings and verifiable certificates.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Button
              variant="primary"
              size="md"
              icon={Play}
              onClick={() => onNavigateTab('available_exams')}
              className="bg-brand-500 hover:bg-brand-400 text-white font-bold shadow-lg shadow-brand-500/30"
            >
              Take Available Olympiads
            </Button>
            <Button
              variant="secondary"
              size="md"
              icon={Clock}
              onClick={() => onNavigateTab('exam_history')}
              className="bg-white/10 hover:bg-white/20 text-white border-white/20"
            >
              My Exam History
            </Button>
          </div>
        </div>
      </div>

      {/* 4 Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Available Olympiads"
          value={metrics.available_exams || 0}
          subtitle="Ready to attempt"
          icon={BookOpen}
          color="brand"
        />
        <StatCard
          title="Exams Attempted"
          value={metrics.total_attempts || 0}
          subtitle={`${metrics.total_passed || 0} exams qualified`}
          icon={CheckCircle2}
          color="emerald"
        />
        <StatCard
          title="Average Score"
          value={`${metrics.avg_score || 0}%`}
          subtitle={`Best score: ${metrics.best_score || 0}%`}
          icon={TrendingUp}
          color="purple"
        />
        <StatCard
          title="Merit Certificates"
          value={metrics.certificates_count || 0}
          subtitle={metrics.best_rank ? `Best Rank: #${metrics.best_rank}` : 'Earn credentials'}
          icon={Award}
          color="amber"
        />
      </div>

      {/* Two Column: Recent Submissions & Subject Proficiency */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Attempts */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900">Recent Exam Results</h3>
            <Button variant="ghost" size="xs" onClick={() => onNavigateTab('exam_history')}>
              View History
            </Button>
          </div>

          <div className="space-y-3">
            {(data?.recent_attempts || []).length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-xs">
                No past attempts yet. Take an Olympiad to see your score analysis!
              </div>
            ) : (
              (data?.recent_attempts || []).map((att) => (
                <div key={att.id} className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold text-slate-900">{att.exam_title}</p>
                    <p className="text-[11px] text-slate-500 font-mono mt-0.5">{att.submitted_at}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-black text-brand-600 font-mono">{parseFloat(att.percentage).toFixed(1)}%</span>
                    <Badge variant={att.passed ? 'success' : 'danger'} size="sm">
                      {att.passed ? 'PASSED' : 'FAILED'}
                    </Badge>
                    <Button variant="secondary" size="xs" onClick={() => onViewResult(att.id)}>
                      Scorecard
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Subject Progress */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900">Subject Accuracy Progress</h3>
            <TrendingUp className="w-4 h-4 text-slate-400" />
          </div>

          <div className="space-y-4">
            {(data?.subject_progress || []).length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-xs">
                Subject progress will appear after your first examination attempt.
              </div>
            ) : (
              (data?.subject_progress || []).map((sub, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800">{sub.subject_name}</span>
                    <span className="font-bold text-slate-900">{sub.accuracy || 0}% Accuracy ({sub.correct_count}/{sub.total_answered})</span>
                  </div>
                  <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${Math.min(100, Math.max(5, sub.accuracy || 0))}%`,
                        backgroundColor: sub.color || '#4F46E5'
                      }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
