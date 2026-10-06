import React, { useState, useEffect } from 'react';
import { apiClient } from '../../api/client';
import {
  Users,
  FileSpreadsheet,
  HelpCircle,
  TrendingUp,
  Award,
  BookOpen,
  ArrowRight,
  Plus,
  Trophy,
  Calendar,
  Clock,
  BarChart3,
  CheckCircle2
} from 'lucide-react';
import { Badge } from '../../components/Badge';
import { Button } from '../../components/Button';

export const TeacherOverview = ({ onNavigateTab }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Live ticking clock
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/analytics/teacher');
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

  const formattedDateStr = currentTime.toLocaleDateString('en-US', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  const formattedTimeStr = currentTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });

  if (loading) {
    return <div className="p-8 text-center text-slate-400 text-xs">Loading faculty dashboard...</div>;
  }

  const metrics = data?.metrics || {};

  return (
    <div className="space-y-6 pb-12 font-sans">
      {/* 1. Brand Greeting Banner with Exact Blue-Purple-Pink Gradient & Live Time */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Greeting Card */}
        <div className="lg:col-span-8 bg-gradient-to-r from-[#2b27cf] via-[#7e2dbf] to-[#e0469b] border border-white/20 rounded-2xl p-4 sm:p-5 shadow-xl text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-12 h-12 rounded-xl bg-white/20 border border-white/30 shadow-xs flex items-center justify-center text-amber-300 shrink-0 backdrop-blur-xs">
              <Trophy className="w-6 h-6 text-amber-300 fill-amber-300/40" />
            </div>
            <div className="min-w-0">
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-white/20 text-white font-extrabold text-[9px] tracking-wider uppercase border border-white/30 backdrop-blur-xs">
                Faculty Portal
              </span>
              <h1 className="text-lg sm:text-xl font-black text-white tracking-tight mt-0.5 leading-snug truncate">
                Welcome to Faculty Dashboard
              </h1>
              <p className="text-xs text-pink-100 font-medium truncate">
                Author questions, create olympiad tests, and monitor candidate performance.
              </p>
            </div>
          </div>

          <div className="text-left sm:text-right shrink-0">
            <p className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5 sm:justify-end">
              <Calendar className="w-3.5 h-3.5 text-pink-200" />
              <span>{formattedDateStr}</span>
            </p>
            <p className="text-xs sm:text-sm font-mono font-black text-white mt-0.5">
              {formattedTimeStr}
            </p>
          </div>
        </div>

        {/* Right Quick Actions Card */}
        <div className="lg:col-span-4 bg-[#13092c] rounded-2xl border border-[#2e1659] p-3.5 sm:p-4 shadow-xl flex flex-col justify-between text-white">
          <div className="flex items-center justify-between mb-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-[#24124a] text-pink-200 border border-[#441f7e] font-bold text-[11px] uppercase tracking-wider">
              Faculty Shortcuts
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => onNavigateTab('question_bank')}
              className="px-2.5 py-2 rounded-xl bg-[#1a0f36] hover:bg-[#25154d] border border-[#2e1659] text-pink-200 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-95"
            >
              <HelpCircle className="w-3.5 h-3.5 text-[#e0469b] shrink-0" />
              <span className="truncate">Add Question</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigateTab('exams')}
              className="px-2.5 py-2 rounded-xl bg-[#1a0f36] hover:bg-[#25154d] border border-[#2e1659] text-blue-200 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-95"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-[#38bdf8] shrink-0" />
              <span className="truncate">Create Exam</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigateTab('students')}
              className="px-2.5 py-2 rounded-xl bg-[#1a0f36] hover:bg-[#25154d] border border-[#2e1659] text-purple-200 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-95"
            >
              <Users className="w-3.5 h-3.5 text-[#a855f7] shrink-0" />
              <span className="truncate">Students</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigateTab('results')}
              className="px-2.5 py-2 rounded-xl bg-[#1a0f36] hover:bg-[#25154d] border border-[#2e1659] text-emerald-200 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-95"
            >
              <BarChart3 className="w-3.5 h-3.5 text-[#10b981] shrink-0" />
              <span className="truncate">Reports</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Four Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-[#13092c] rounded-2xl border border-[#2e1659] p-4 shadow-xl hover:border-[#7e2dbf]/60 transition-all flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#24124a] text-[#e0469b] flex items-center justify-center border border-[#441f7e]">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400">Total Students</p>
              <h3 className="text-xl font-black text-white leading-tight mt-0.5 font-mono">
                {metrics.total_students || 2}
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Enrolled pupils</p>
            </div>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-[#13092c] rounded-2xl border border-[#2e1659] p-4 shadow-xl hover:border-[#7e2dbf]/60 transition-all flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#24124a] text-[#38bdf8] flex items-center justify-center border border-[#441f7e]">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400">Created Exams</p>
              <h3 className="text-xl font-black text-white leading-tight mt-0.5 font-mono">
                {metrics.total_exams || 0}
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">{metrics.active_exams || 0} published</p>
            </div>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-[#13092c] rounded-2xl border border-[#2e1659] p-4 shadow-xl hover:border-[#7e2dbf]/60 transition-all flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#24124a] text-[#a855f7] flex items-center justify-center border border-[#441f7e]">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400">Live Exams</p>
              <h3 className="text-xl font-black text-white leading-tight mt-0.5 font-mono">
                {metrics.active_exams || 0}
              </h3>
              <p className="text-[11px] text-pink-300 font-semibold mt-0.5">Ready for attempts</p>
            </div>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-[#13092c] rounded-2xl border border-[#2e1659] p-4 shadow-xl hover:border-[#7e2dbf]/60 transition-all flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#24124a] text-[#10b981] flex items-center justify-center border border-[#441f7e]">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400">Question Bank</p>
              <h3 className="text-xl font-black text-white leading-tight mt-0.5 font-mono">
                {metrics.question_bank_count || 0}
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Authored questions</p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Two Columns: Recent Exams & Subject Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Exams Created */}
        <div className="bg-[#13092c] rounded-2xl border border-[#2e1659] p-6 shadow-xl flex flex-col justify-between text-white">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#24124a] text-pink-200 border border-[#441f7e] font-bold text-xs uppercase tracking-wider">
                Recent Exams Created
              </span>
              <button
                type="button"
                onClick={() => onNavigateTab('exams')}
                className="text-xs font-bold text-pink-300 hover:text-white hover:underline cursor-pointer"
              >
                View All →
              </button>
            </div>

            <div className="space-y-3">
              {(data?.recent_exams || []).length === 0 ? (
                <div className="py-10 text-center text-slate-400 text-xs">
                  No exams created yet. Click "Create Exam" above to publish your first Olympiad.
                </div>
              ) : (
                (data?.recent_exams || []).map((exam) => (
                  <div key={exam.id} className="p-3.5 bg-[#1a0f36] border border-[#2e1659] rounded-2xl flex items-center justify-between hover:bg-[#25154d] transition-all">
                    <div>
                      <p className="text-xs font-bold text-white">{exam.title}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5 font-medium">
                        {exam.class_name} • {exam.duration_minutes} mins {exam.author_name ? `• By ${exam.author_name}` : ''}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-pink-300 font-mono">{exam.attempts_count || 0} attempts</span>
                      <span className={`block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        exam.status === 'published' ? 'bg-[#24124a] text-[#10b981] border border-[#10b981]/40' : 'bg-slate-800 text-slate-300'
                      }`}>
                        {exam.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Subject Performance */}
        <div className="bg-[#13092c] rounded-2xl border border-[#2e1659] p-6 shadow-xl flex flex-col justify-between text-white">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#24124a] text-emerald-200 border border-[#441f7e] font-bold text-xs uppercase tracking-wider">
                <TrendingUp className="w-3.5 h-3.5 text-[#10b981]" />
                <span>Subject Accuracy &amp; Proficiency</span>
              </span>
            </div>

            <div className="space-y-4">
              {(data?.subject_performance || []).length === 0 ? (
                <div className="py-10 text-center text-slate-400 text-xs">
                  Subject analytics will appear once students complete exam attempts.
                </div>
              ) : (
                (data?.subject_performance || []).map((sub, idx) => (
                  <div key={idx} className="space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-200">{sub.subject_name}</span>
                      <span className="font-bold text-pink-300 font-mono">{sub.accuracy || 0}% accuracy</span>
                    </div>
                    <div className="h-2.5 bg-[#0a0418] rounded-full overflow-hidden p-0.5 border border-[#2e1659]">
                      <div
                        className="h-full rounded-full transition-all duration-500 bg-gradient-to-r from-[#2b27cf] via-[#7e2dbf] to-[#e0469b]"
                        style={{
                          width: `${Math.min(100, Math.max(5, sub.accuracy || 0))}%`
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
    </div>
  );
};
