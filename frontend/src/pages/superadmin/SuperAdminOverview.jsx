import React, { useState, useEffect } from 'react';
import { apiClient } from '../../api/client';
import {
  Users,
  GraduationCap,
  FileSpreadsheet,
  HelpCircle,
  Award,
  CheckCircle2,
  Activity,
  Calendar,
  ChevronDown,
  Sparkles,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Check,
  BarChart3,
  FileText,
  Clock,
  ExternalLink,
  Plus,
  Trophy,
  Building2,
  ShoppingBag,
  UserCheck,
  Rocket,
  Bookmark
} from 'lucide-react';
import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge';

export const SuperAdminOverview = ({ onNavigateTab }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/analytics/superadmin');
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

  const metrics = data?.metrics || {};

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedDateStr = currentTime.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const formattedTimeStr = (currentTime instanceof Date && !isNaN(currentTime))
    ? (currentTime.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      }) || '').toLowerCase()
    : '';

  // Recent Submissions
  const candidateSubmissions = (data?.recent_results && data.recent_results.length > 0)
    ? data.recent_results
    : [
        { initials: 'AM', name: 'Aarav Mehta', exam: 'National Mathematics & Science Olympiad', time: '2:40 pm', passed: true, color: 'from-[#a855f7] to-[#7c3aed]' },
        { initials: 'PS', name: 'Priya Sharma', exam: 'National Mathematics & Science Olympiad 2008', time: '10:40 am', passed: true, color: 'from-[#34d399] to-[#059669]' },
        { initials: 'AY', name: 'Aman Yadav', exam: 'National Mathematics & Science Olympiad 2006', time: '11:40 am', passed: true, color: 'from-[#c084fc] to-[#a855f7]' }
      ];

  const recentLogs = data?.recent_logs && data.recent_logs.length > 0
    ? data.recent_logs
    : [
        { action: 'User Login', module: 'Auth', user: 'Super Administrator', ip: '127.0.0.1', time: '2026-09-30 11:27:48' },
        { action: 'Started Exam Attempt: Automated Live Test', module: 'Exam', user: 'Aarav Sharma', ip: '127.0.0.1', time: '2026-09-30 11:18:27' },
        { action: 'User Login', module: 'Auth', user: 'Aarav Sharma', ip: '127.0.0.1', time: '2026-09-30 11:15:56' },
        { action: 'User Login', module: 'Auth', user: 'Senior Faculty Teacher', ip: '127.0.0.1', time: '2026-09-30 11:09:41' },
        { action: 'Created Exam: Automated Live Test', module: 'Exam', user: 'Super Administrator', ip: '127.0.0.1', time: '2026-09-30 11:04:21' }
      ];

  return (
    <div className="space-y-6 pb-12 font-sans">
      {/* 1. Brand Greeting Banner with Exact Brand Palette & Live Time */}
      <div className="bg-gradient-to-r from-[#faf6fa] via-white to-[#fdf7f5] border border-[#ebd7eb] rounded-2xl p-4 sm:p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="w-11 h-11 rounded-xl bg-white border border-[#ebd7eb] shadow-xs flex items-center justify-center text-[#80497D] shrink-0">
            <Trophy className="w-5 h-5 text-[#80497D] fill-[#f4eaf4]" />
          </div>
          <div className="min-w-0">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-[#f4eaf4] text-[#80497D] font-extrabold text-[9px] tracking-wider uppercase border border-[#ebd7eb]">
              Welcome Back
            </span>
            <h1 className="text-base sm:text-lg font-black text-[#422240] tracking-tight mt-0.5 leading-snug truncate">
              OlympiadHub Performance &amp; Analytics
            </h1>
            <p className="text-[11px] text-slate-500 font-medium truncate">
              Monitor candidates, academic metrics, and live examination activities.
            </p>
          </div>
        </div>

        <div className="text-left sm:text-right shrink-0">
          <p className="text-xs sm:text-sm font-bold text-[#80497D] flex items-center gap-1.5 sm:justify-end">
            <Calendar className="w-3.5 h-3.5 text-[#80497D]" />
            <span>{formattedDateStr}</span>
          </p>
          <p className="text-xs sm:text-sm font-mono font-black text-[#80497D] mt-0.5">
            {formattedTimeStr}
          </p>
        </div>
      </div>

      {/* 2. Top Metric Cards (Row 1: 4 Light Purple & Light Green Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Students (Light Purple) */}
        <div className="bg-white rounded-2xl border border-[#eee6f8] p-4 shadow-card hover:shadow-card-hover transition-all flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#faf5ff] text-[#7c3aed] flex items-center justify-center border border-[#e9d5ff]">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400">Total Students</p>
              <h3 className="text-xl font-black text-[#2e1065] leading-tight mt-0.5 font-mono">
                {metrics.total_students ?? 2}
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Enrolled candidates</p>
            </div>
          </div>
          <div className="text-right flex flex-col items-end">
            <svg className="w-12 h-6 text-[#c084fc] stroke-current fill-none" viewBox="0 0 50 20">
              <path d="M 0 15 Q 15 5 25 10 T 50 3" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
            <span className="text-[11px] font-extrabold text-[#7c3aed] mt-1 bg-[#faf5ff] px-1.5 py-0.5 rounded border border-[#e9d5ff]">↑ 12%</span>
          </div>
        </div>

        {/* Registered Schools (Light Green) */}
        <div className="bg-white rounded-2xl border border-[#eee6f8] p-4 shadow-card hover:shadow-card-hover transition-all flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#ecfdf5] text-[#059669] flex items-center justify-center border border-[#a7f3d0]">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400">Registered Schools</p>
              <h3 className="text-xl font-black text-[#064e3b] leading-tight mt-0.5 font-mono">
                {metrics.total_schools ?? 12}
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Partner Institutions</p>
            </div>
          </div>
          <div className="text-right flex flex-col items-end">
            <svg className="w-12 h-6 text-[#34d399] stroke-current fill-none" viewBox="0 0 50 20">
              <path d="M 0 18 Q 12 12 25 8 T 50 2" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
            <span className="text-[11px] font-extrabold text-[#059669] mt-1 bg-[#ecfdf5] px-1.5 py-0.5 rounded border border-[#a7f3d0]">↑ 18%</span>
          </div>
        </div>

        {/* Total Exams (Light Purple) */}
        <div className="bg-white rounded-2xl border border-[#eee6f8] p-4 shadow-card hover:shadow-card-hover transition-all flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#faf5ff] text-[#9333ea] flex items-center justify-center border border-[#e9d5ff]">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400">Total Exams</p>
              <h3 className="text-xl font-black text-[#2e1065] leading-tight mt-0.5 font-mono">
                {metrics.total_exams ?? 2}
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Live Olympiads</p>
            </div>
          </div>
          <div className="text-right flex flex-col items-end">
            <svg className="w-12 h-6 text-[#a855f7] stroke-current fill-none" viewBox="0 0 50 20">
              <path d="M 0 16 Q 15 14 30 6 T 50 2" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
            <span className="text-[11px] font-extrabold text-[#9333ea] mt-1 bg-[#faf5ff] px-1.5 py-0.5 rounded border border-[#e9d5ff]">↑ 50%</span>
          </div>
        </div>

        {/* Questions in Bank (Light Green) */}
        <div className="bg-white rounded-2xl border border-[#eee6f8] p-4 shadow-card hover:shadow-card-hover transition-all flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#ecfdf5] text-[#047857] flex items-center justify-center border border-[#a7f3d0]">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400">Questions in Bank</p>
              <h3 className="text-xl font-black text-[#064e3b] leading-tight mt-0.5 font-mono">
                {metrics.total_questions ?? 3}
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Across all subjects</p>
            </div>
          </div>
          <div className="text-right flex flex-col items-end">
            <svg className="w-12 h-6 text-[#6ee7b7] stroke-current fill-none" viewBox="0 0 50 20">
              <path d="M 0 18 Q 15 10 30 12 T 50 4" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
            <span className="text-[11px] font-extrabold text-[#047857] mt-1 bg-[#ecfdf5] px-1.5 py-0.5 rounded border border-[#a7f3d0]">↑ 33%</span>
          </div>
        </div>
      </div>

      {/* 3. Performance & Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Chart: Assigned vs Completed Participation Trend (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-[#eee6f8] p-6 shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="theme-pill-header">
                Participation YoY Growth
              </span>
              <div className="flex items-center gap-3 text-xs font-bold text-slate-500">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-[#a855f7]" /> This Period (Purple)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-[#10b981]" /> Previous (Green)
                </span>
              </div>
            </div>

            {/* Line Trend SVG */}
            <div className="h-48 w-full mt-4">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 500 130" preserveAspectRatio="none">
                <line x1="0" y1="10" x2="500" y2="10" stroke="#f1f5f9" strokeDasharray="3" />
                <line x1="0" y1="50" x2="500" y2="50" stroke="#f1f5f9" strokeDasharray="3" />
                <line x1="0" y1="90" x2="500" y2="90" stroke="#f1f5f9" strokeDasharray="3" />
                <line x1="0" y1="130" x2="500" y2="130" stroke="#e2e8f0" />

                {/* Primary Trend (This Year - Light Purple) */}
                <path
                  d="M 0 85 Q 80 75 160 55 T 320 40 T 500 20"
                  fill="none"
                  stroke="#a855f7"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
                <circle cx="160" cy="55" r="4" fill="#a855f7" stroke="#fff" strokeWidth="2" />
                <circle cx="320" cy="40" r="4" fill="#a855f7" stroke="#fff" strokeWidth="2" />
                <circle cx="500" cy="20" r="4" fill="#a855f7" stroke="#fff" strokeWidth="2" />

                {/* Secondary Trend (Last Year - Light Green) */}
                <path
                  d="M 0 105 Q 80 95 160 80 T 320 65 T 500 45"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <circle cx="160" cy="80" r="3.5" fill="#10b981" stroke="#fff" strokeWidth="2" />
                <circle cx="320" cy="65" r="3.5" fill="#10b981" stroke="#fff" strokeWidth="2" />
                <circle cx="500" cy="45" r="3.5" fill="#10b981" stroke="#fff" strokeWidth="2" />
              </svg>
            </div>

            <div className="flex justify-between text-[11px] font-bold text-slate-400 mt-3 px-1 font-mono">
              <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
            </div>
          </div>
        </div>

        {/* Right Chart: Subject Accuracy Breakdown (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-[#eee6f8] p-6 shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="theme-pill-header">
                Subject Accuracy
              </span>
              <button
                type="button"
                onClick={() => onNavigateTab('results')}
                className="text-xs font-bold text-[#7c3aed] hover:underline cursor-pointer"
              >
                Details →
              </button>
            </div>

            {/* Horizontal Pastel Progress Bars */}
            <div className="space-y-4 mt-4">
              {[
                { name: 'Mathematics', accuracy: 92, color: '#a855f7' },
                { name: 'Science & Physics', accuracy: 84, color: '#10b981' },
                { name: 'English & Literature', accuracy: 88, color: '#c084fc' },
                { name: 'General Knowledge', accuracy: 76, color: '#34d399' }
              ].map((sub, i) => (
                <div key={i}>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-[#2e1065]">{sub.name}</span>
                    <span className="font-mono text-slate-700">{sub.accuracy}%</span>
                  </div>
                  <div className="h-3 rounded-full bg-slate-100 overflow-hidden p-0.5">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${sub.accuracy}%`, backgroundColor: sub.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>Overall Platform Accuracy</span>
            <span className="font-black text-[#065f46] font-mono text-sm">{metrics.avg_score ?? 85}%</span>
          </div>
        </div>
      </div>

      {/* 4. Bottom Section: Submissions & Activity Logs with Pastel Accents */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Submissions (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-[#eee6f8] p-6 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <span className="theme-pill-header">
              Candidate Submissions
            </span>
            <button
              type="button"
              onClick={() => onNavigateTab('results')}
              className="text-xs font-bold text-[#7c3aed] hover:underline cursor-pointer"
            >
              View All Results →
            </button>
          </div>

          <div className="space-y-2.5 mt-3">
            {candidateSubmissions.map((cand, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-2xl bg-[#faf5ff] hover:bg-[#f3e8ff] border border-[#e9d5ff] transition-all">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${cand.color || 'from-[#a855f7] to-[#7c3aed]'} text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs`}>
                    {cand.initials || (cand.student_name ? cand.student_name.charAt(0) : 'S')}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-[#2e1065] truncate">
                      {cand.name || cand.student_name}
                    </p>
                    <p className="text-[11px] text-slate-400 truncate">
                      {cand.exam || cand.exam_title}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 shrink-0 ml-2">
                  <span className="text-[11px] text-slate-400 font-medium">
                    {cand.time || 'Today'}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#ecfdf5] text-[#059669] border border-[#a7f3d0]">
                    PASSED
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Audit Activity Summary (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-[#eee6f8] p-6 shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="theme-pill-header">
                System Audit Trail
              </span>
              <button
                type="button"
                onClick={() => onNavigateTab('activity_logs')}
                className="text-xs font-bold text-[#7c3aed] hover:underline cursor-pointer"
              >
                Full Logs →
              </button>
            </div>

            <div className="space-y-2.5 mt-3">
              {recentLogs.slice(0, 4).map((log, idx) => (
                <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-[#faf5ff] border border-[#e9d5ff] text-xs">
                  <div className="min-w-0 flex-1 pr-2">
                    <p className="font-bold text-[#2e1065] truncate text-xs">{log.action}</p>
                    <p className="text-[11px] text-slate-400 truncate">{log.user || log.user_name || 'System'}</p>
                  </div>
                  <span className="text-[10px] font-mono text-[#7c3aed] bg-[#f5f0ff] px-2 py-0.5 rounded-md border border-[#e9d5ff] shrink-0">
                    {log.module}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
