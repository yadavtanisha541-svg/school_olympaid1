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
      {/* 1. Brand Greeting Banner with Pastel Purple-Green Gradient & Live Time (Slim & Compact) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Greeting Card */}
        <div className="lg:col-span-8 bg-gradient-to-r from-[#faf5ff] via-[#f5f3ff] to-[#ecfdf5] border border-[#e9d5ff] rounded-2xl p-4 sm:p-4.5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-11 h-11 rounded-xl bg-white border border-[#e9d5ff] shadow-xs flex items-center justify-center text-[#7c3aed] shrink-0">
              <Trophy className="w-5 h-5 text-[#7c3aed] fill-[#f5f0ff]" />
            </div>
            <div className="min-w-0">
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-[#f5f0ff] text-[#581c87] font-extrabold text-[9px] tracking-wider uppercase border border-[#e9d5ff]">
                Faculty Portal
              </span>
              <h1 className="text-base sm:text-lg font-black text-[#2e1065] tracking-tight mt-0.5 leading-snug truncate">
                Welcome to Faculty Dashboard
              </h1>
              <p className="text-[11px] text-slate-500 font-medium truncate">
                Author questions, create olympiad tests, and monitor candidate performance.
              </p>
            </div>
          </div>

          <div className="text-left sm:text-right shrink-0">
            <p className="text-xs sm:text-sm font-bold text-[#581c87] flex items-center gap-1.5 sm:justify-end">
              <Calendar className="w-3.5 h-3.5 text-[#7c3aed]" />
              <span>{formattedDateStr}</span>
            </p>
            <p className="text-xs sm:text-sm font-mono font-black text-[#7c3aed] mt-0.5">
              {formattedTimeStr}
            </p>
          </div>
        </div>

        {/* Right Quick Actions Card (Slim & Compact) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-[#eee6f8] p-3.5 sm:p-4 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-1.5">
            <span className="theme-pill-header text-[11px] py-1 px-2.5">
              Faculty Shortcuts
            </span>
          </div>

          <div className="grid grid-cols-2 gap-1.5">
            <button
              type="button"
              onClick={() => onNavigateTab('question_bank')}
              className="px-2.5 py-1.5 rounded-xl bg-[#faf5ff] hover:bg-[#f3e8ff] border border-[#e9d5ff] text-[#581c87] text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs active:scale-95"
            >
              <HelpCircle className="w-3.5 h-3.5 text-[#7c3aed] shrink-0" />
              <span className="truncate">Add Question</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigateTab('exams')}
              className="px-2.5 py-1.5 rounded-xl bg-[#ecfdf5] hover:bg-[#d1fae5] border border-[#a7f3d0] text-[#065f46] text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs active:scale-95"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-[#059669] shrink-0" />
              <span className="truncate">Create Exam</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigateTab('students')}
              className="px-2.5 py-1.5 rounded-xl bg-[#faf5ff] hover:bg-[#f3e8ff] border border-[#e9d5ff] text-[#581c87] text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs active:scale-95"
            >
              <Users className="w-3.5 h-3.5 text-[#7c3aed] shrink-0" />
              <span className="truncate">Students</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigateTab('results')}
              className="px-2.5 py-1.5 rounded-xl bg-[#ecfdf5] hover:bg-[#d1fae5] border border-[#a7f3d0] text-[#065f46] text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs active:scale-95"
            >
              <BarChart3 className="w-3.5 h-3.5 text-[#059669] shrink-0" />
              <span className="truncate">Reports</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Four Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 (Light Purple) */}
        <div className="bg-white rounded-2xl border border-[#eee6f8] p-4 shadow-card hover:shadow-card-hover transition-all flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#faf5ff] text-[#7c3aed] flex items-center justify-center border border-[#e9d5ff]">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400">Total Students</p>
              <h3 className="text-xl font-black text-[#2e1065] leading-tight mt-0.5 font-mono">
                {metrics.total_students || 2}
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Enrolled pupils</p>
            </div>
          </div>
        </div>

        {/* Metric 2 (Light Green) */}
        <div className="bg-white rounded-2xl border border-[#eee6f8] p-4 shadow-card hover:shadow-card-hover transition-all flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#ecfdf5] text-[#059669] flex items-center justify-center border border-[#a7f3d0]">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400">Created Exams</p>
              <h3 className="text-xl font-black text-[#064e3b] leading-tight mt-0.5 font-mono">
                {metrics.total_exams || 0}
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">{metrics.active_exams || 0} published</p>
            </div>
          </div>
        </div>

        {/* Metric 3 (Light Purple) */}
        <div className="bg-white rounded-2xl border border-[#eee6f8] p-4 shadow-card hover:shadow-card-hover transition-all flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#faf5ff] text-[#9333ea] flex items-center justify-center border border-[#e9d5ff]">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400">Live Exams</p>
              <h3 className="text-xl font-black text-[#2e1065] leading-tight mt-0.5 font-mono">
                {metrics.active_exams || 0}
              </h3>
              <p className="text-[11px] text-[#7c3aed] font-semibold mt-0.5">Ready for attempts</p>
            </div>
          </div>
        </div>

        {/* Metric 4 (Light Green) */}
        <div className="bg-white rounded-2xl border border-[#eee6f8] p-4 shadow-card hover:shadow-card-hover transition-all flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#ecfdf5] text-[#047857] flex items-center justify-center border border-[#a7f3d0]">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400">Question Bank</p>
              <h3 className="text-xl font-black text-[#064e3b] leading-tight mt-0.5 font-mono">
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
        <div className="bg-white rounded-3xl border border-[#eee6f8] p-6 shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="theme-pill-header">
                Recent Exams Created
              </span>
              <button
                type="button"
                onClick={() => onNavigateTab('exams')}
                className="text-xs font-bold text-[#7c3aed] hover:underline cursor-pointer"
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
                  <div key={exam.id} className="p-3.5 bg-[#faf5ff] border border-[#e9d5ff] rounded-2xl flex items-center justify-between hover:bg-[#f3e8ff] transition-all">
                    <div>
                      <p className="text-xs font-bold text-[#2e1065]">{exam.title}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5 font-medium">
                        {exam.class_name} • {exam.duration_minutes} mins {exam.author_name ? `• By ${exam.author_name}` : ''}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-[#7c3aed] font-mono">{exam.attempts_count || 0} attempts</span>
                      <span className={`block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        exam.status === 'published' ? 'bg-[#ecfdf5] text-[#059669] border border-[#a7f3d0]' : 'bg-slate-100 text-slate-600'
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
        <div className="bg-white rounded-3xl border border-[#eee6f8] p-6 shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="theme-pill-green">
                <TrendingUp className="w-3.5 h-3.5 text-[#059669]" />
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
                      <span className="font-bold text-[#2e1065]">{sub.subject_name}</span>
                      <span className="font-bold text-[#7c3aed] font-mono">{sub.accuracy || 0}% accuracy</span>
                    </div>
                    <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden p-0.5">
                      <div
                        className="h-full rounded-full transition-all duration-500 bg-gradient-to-r from-[#a855f7] to-[#10b981]"
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
