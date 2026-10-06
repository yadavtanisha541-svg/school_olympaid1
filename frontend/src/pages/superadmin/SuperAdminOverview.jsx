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
        { initials: 'AM', name: 'Aarav Mehta', exam: 'International Mathematics & Science Olympiad', time: '2:40 pm', passed: true },
        { initials: 'PS', name: 'Priya Sharma', exam: 'International Science Olympiad 2026', time: '10:40 am', passed: true },
        { initials: 'AY', name: 'Aman Yadav', exam: 'International Digital Literacy Olympiad', time: '11:40 am', passed: true }
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
      {/* 1. Hero Greeting Banner (3-Mix Pastel Gradient Card) */}
      <div className="bg-gradient-to-r from-blue-200/90 via-indigo-200/80 to-pink-200/90 border-2 border-indigo-300 rounded-3xl p-5 sm:p-6 shadow-sm relative overflow-hidden text-slate-900">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div className="flex items-center gap-4 min-w-0">
            <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-tr from-amber-400 via-orange-400 to-amber-300 text-slate-900 shadow-xs flex items-center justify-center shrink-0 border border-white/40">
              <Trophy className="w-7 h-7 fill-slate-900 text-slate-900" />
            </div>
            <div className="min-w-0">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/90 text-indigo-950 font-black text-[11px] tracking-wider uppercase border border-indigo-200 shadow-2xs">
                WELCOME BACK, SUPER ADMIN
              </span>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 tracking-tight mt-1 leading-snug truncate">
                OlympiadHub Performance &amp; Analytics
              </h1>
              <p className="text-xs sm:text-sm text-slate-700 font-semibold truncate mt-0.5">
                Monitor candidates, academic metrics, and live examination activities.
              </p>
            </div>
          </div>

          <div className="text-left sm:text-right shrink-0">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/90 border border-indigo-200 rounded-xl text-xs font-bold text-indigo-950 shadow-2xs">
              <Calendar className="w-3.5 h-3.5 text-indigo-600" />
              <span>{formattedDateStr}</span>
            </div>
            <p className="text-sm sm:text-base font-mono font-black text-slate-900 mt-1">
              {formattedTimeStr}
            </p>
          </div>
        </div>

        {/* Decorative ambient glows */}
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-pink-300/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-blue-300/30 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* 2. Top Metric Cards (4 Vibrant 2-3 Mix Pastel Gradient Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Total Students */}
        <div className="bg-gradient-to-br from-pink-200/95 via-rose-200/85 to-amber-200/85 rounded-3xl border-2 border-pink-400/90 hover:border-pink-500 p-5 sm:p-6 shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-between text-slate-900 group hover:-translate-y-1">
          <div className="flex items-center gap-3.5">
            <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-pink-500 via-rose-500 to-amber-500 text-white shadow-pink-300 shadow-sm border border-white/40 flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
              <Users className="w-6.5 h-6.5" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-pink-950">Total Students</p>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight mt-0.5 font-mono">
                {metrics.total_students ?? 2}
              </h3>
              <p className="text-xs text-slate-700 font-semibold mt-0.5">Enrolled candidates</p>
            </div>
          </div>
          <div className="text-right flex flex-col items-end">
            <svg className="w-14 h-7 text-pink-600 stroke-current fill-none" viewBox="0 0 50 20">
              <path d="M 0 15 Q 15 5 25 10 T 50 3" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
            <span className="text-[11px] font-black text-pink-900 mt-1 bg-white/90 px-2 py-0.5 rounded-lg border border-pink-300 shadow-2xs">↑ 12%</span>
          </div>
        </div>

        {/* Registered Schools */}
        <div className="bg-gradient-to-br from-cyan-200/95 via-blue-200/85 to-indigo-200/85 rounded-3xl border-2 border-blue-400/90 hover:border-blue-500 p-5 sm:p-6 shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-between text-slate-900 group hover:-translate-y-1">
          <div className="flex items-center gap-3.5">
            <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-500 to-indigo-500 text-white shadow-blue-300 shadow-sm border border-white/40 flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
              <Building2 className="w-6.5 h-6.5" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-blue-950">Registered Schools</p>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight mt-0.5 font-mono">
                {metrics.total_schools ?? 12}
              </h3>
              <p className="text-xs text-slate-700 font-semibold mt-0.5">Partner Institutions</p>
            </div>
          </div>
          <div className="text-right flex flex-col items-end">
            <svg className="w-14 h-7 text-blue-600 stroke-current fill-none" viewBox="0 0 50 20">
              <path d="M 0 18 Q 12 12 25 8 T 50 2" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
            <span className="text-[11px] font-black text-blue-900 mt-1 bg-white/90 px-2 py-0.5 rounded-lg border border-blue-300 shadow-2xs">↑ 18%</span>
          </div>
        </div>

        {/* Total Exams */}
        <div className="bg-gradient-to-br from-purple-200/95 via-indigo-200/85 to-sky-200/85 rounded-3xl border-2 border-purple-400/90 hover:border-purple-500 p-5 sm:p-6 shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-between text-slate-900 group hover:-translate-y-1">
          <div className="flex items-center gap-3.5">
            <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-purple-500 via-indigo-500 to-sky-500 text-white shadow-purple-300 shadow-sm border border-white/40 flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
              <FileSpreadsheet className="w-6.5 h-6.5" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-purple-950">Total Exams</p>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight mt-0.5 font-mono">
                {metrics.total_exams ?? 2}
              </h3>
              <p className="text-xs text-slate-700 font-semibold mt-0.5">Live Olympiads</p>
            </div>
          </div>
          <div className="text-right flex flex-col items-end">
            <svg className="w-14 h-7 text-purple-600 stroke-current fill-none" viewBox="0 0 50 20">
              <path d="M 0 16 Q 15 14 30 6 T 50 2" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
            <span className="text-[11px] font-black text-purple-900 mt-1 bg-white/90 px-2 py-0.5 rounded-lg border border-purple-300 shadow-2xs">↑ 50%</span>
          </div>
        </div>

        {/* Questions in Bank */}
        <div className="bg-gradient-to-br from-emerald-200/95 via-teal-200/85 to-cyan-200/85 rounded-3xl border-2 border-emerald-400/90 hover:border-emerald-500 p-5 sm:p-6 shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-between text-slate-900 group hover:-translate-y-1">
          <div className="flex items-center gap-3.5">
            <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 text-white shadow-emerald-300 shadow-sm border border-white/40 flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
              <FileText className="w-6.5 h-6.5" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-emerald-950">Questions in Bank</p>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight mt-0.5 font-mono">
                {metrics.total_questions ?? 6}
              </h3>
              <p className="text-xs text-slate-700 font-semibold mt-0.5">Across 6 subjects</p>
            </div>
          </div>
          <div className="text-right flex flex-col items-end">
            <svg className="w-14 h-7 text-emerald-600 stroke-current fill-none" viewBox="0 0 50 20">
              <path d="M 0 18 Q 15 10 30 12 T 50 4" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
            <span className="text-[11px] font-black text-emerald-900 mt-1 bg-white/90 px-2 py-0.5 rounded-lg border border-emerald-300 shadow-2xs">↑ 33%</span>
          </div>
        </div>
      </div>

      {/* 3. Performance & Analytics Section (Colorful Pastel Cards) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Chart: Assigned vs Completed Participation Trend (7 Cols) */}
        <div className="lg:col-span-7 bg-gradient-to-br from-blue-100/90 via-indigo-100/80 to-purple-100/90 rounded-3xl border-2 border-indigo-300/90 p-6 shadow-sm text-slate-900 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/90 text-indigo-950 border border-indigo-200 font-black text-xs uppercase tracking-wider shadow-2xs">
                Participation YoY Growth
              </span>
              <div className="flex items-center gap-3 text-xs sm:text-sm font-bold text-slate-700">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-pink-500 shadow-2xs" /> This Period (Current)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-sky-500 shadow-2xs" /> Previous Year
                </span>
              </div>
            </div>

            {/* Line Trend SVG */}
            <div className="h-48 w-full mt-4 bg-white/70 backdrop-blur-xs rounded-2xl p-3 border border-indigo-200/80">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 500 130" preserveAspectRatio="none">
                <line x1="0" y1="10" x2="500" y2="10" stroke="#e2e8f0" strokeDasharray="3" />
                <line x1="0" y1="50" x2="500" y2="50" stroke="#e2e8f0" strokeDasharray="3" />
                <line x1="0" y1="90" x2="500" y2="90" stroke="#e2e8f0" strokeDasharray="3" />
                <line x1="0" y1="130" x2="500" y2="130" stroke="#cbd5e1" />

                {/* Primary Trend (This Year - Pink) */}
                <path
                  d="M 0 85 Q 80 75 160 55 T 320 40 T 500 20"
                  fill="none"
                  stroke="#ec4899"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
                <circle cx="160" cy="55" r="4.5" fill="#ec4899" stroke="#ffffff" strokeWidth="1.5" />
                <circle cx="320" cy="40" r="4.5" fill="#ec4899" stroke="#ffffff" strokeWidth="1.5" />
                <circle cx="500" cy="20" r="4.5" fill="#ec4899" stroke="#ffffff" strokeWidth="1.5" />

                {/* Secondary Trend (Last Year - Blue) */}
                <path
                  d="M 0 105 Q 80 95 160 80 T 320 65 T 500 45"
                  fill="none"
                  stroke="#0284c7"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <circle cx="160" cy="80" r="4" fill="#0284c7" stroke="#ffffff" strokeWidth="1.5" />
                <circle cx="320" cy="65" r="4" fill="#0284c7" stroke="#ffffff" strokeWidth="1.5" />
                <circle cx="500" cy="45" r="4" fill="#0284c7" stroke="#ffffff" strokeWidth="1.5" />
              </svg>
            </div>

            <div className="flex justify-between text-xs font-bold text-slate-600 mt-3 px-1 font-mono">
              <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
            </div>
          </div>
        </div>

        {/* Right Chart: Subject Accuracy Breakdown (5 Cols) */}
        <div className="lg:col-span-5 bg-gradient-to-br from-amber-100/90 via-orange-100/80 to-rose-100/90 rounded-3xl border-2 border-amber-300/90 p-6 shadow-sm text-slate-900 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/90 text-amber-950 border border-amber-200 font-black text-xs uppercase tracking-wider shadow-2xs">
                Subject Accuracy
              </span>
              <button
                type="button"
                onClick={() => onNavigateTab('results')}
                className="text-xs sm:text-sm font-bold text-amber-950 hover:text-black hover:underline cursor-pointer bg-white/90 hover:bg-white px-3 py-1 rounded-xl border border-amber-300 shadow-2xs transition-colors"
              >
                Details →
              </button>
            </div>

            {/* Horizontal Progress Bars */}
            <div className="space-y-3.5 mt-4">
              {[
                { name: 'Mathematics', accuracy: 92, color: 'bg-gradient-to-r from-pink-500 to-rose-500' },
                { name: 'Science', accuracy: 84, color: 'bg-gradient-to-r from-purple-500 to-indigo-500' },
                { name: 'Digital Literacy', accuracy: 88, color: 'bg-gradient-to-r from-cyan-500 to-blue-500' },
                { name: 'English', accuracy: 82, color: 'bg-gradient-to-r from-emerald-500 to-teal-500' },
                { name: 'General Knowledge', accuracy: 79, color: 'bg-gradient-to-r from-amber-500 to-orange-500' },
                { name: 'Hindi', accuracy: 86, color: 'bg-gradient-to-r from-lime-500 to-emerald-500' }
              ].map((sub, i) => (
                <div key={i}>
                  <div className="flex justify-between text-xs sm:text-sm font-bold mb-1">
                    <span className="text-slate-800 font-bold">{sub.name}</span>
                    <span className="font-mono text-slate-900 font-black">{sub.accuracy}%</span>
                  </div>
                  <div className="h-2.5 rounded-full bg-white/80 overflow-hidden p-0.5 border border-amber-200 shadow-2xs">
                    <div
                      className={`h-full rounded-full transition-all duration-500 shadow-2xs ${sub.color}`}
                      style={{ width: `${sub.accuracy}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-amber-200/80 flex items-center justify-between text-xs sm:text-sm font-bold text-slate-700">
            <span>Overall Platform Accuracy</span>
            <span className="font-black text-slate-950 font-mono text-base">{metrics.avg_score ?? 85}%</span>
          </div>
        </div>
      </div>

      {/* 4. Bottom Section: Submissions & Activity Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Submissions (7 Cols) */}
        <div className="lg:col-span-7 bg-gradient-to-br from-pink-100/90 via-rose-100/80 to-purple-100/90 rounded-3xl border-2 border-pink-300/90 p-6 shadow-sm text-slate-900">
          <div className="flex items-center justify-between mb-4">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/90 text-pink-950 border border-pink-200 font-black text-xs uppercase tracking-wider shadow-2xs">
              Candidate Submissions
            </span>
            <button
              type="button"
              onClick={() => onNavigateTab('results')}
              className="text-xs font-bold text-pink-950 hover:text-black hover:underline cursor-pointer bg-white/90 hover:bg-white px-3 py-1 rounded-xl border border-pink-300 shadow-2xs transition-colors"
            >
              View All Results →
            </button>
          </div>

          <div className="space-y-2.5 mt-3">
            {candidateSubmissions.map((cand, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-2xl bg-white/90 hover:bg-white border border-pink-200/90 shadow-2xs transition-all">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-pink-500 via-rose-500 to-purple-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs border border-white/40">
                    {cand.initials || (cand.student_name ? cand.student_name.charAt(0) : 'S')}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 truncate">
                      {cand.name || cand.student_name}
                    </p>
                    <p className="text-[11px] text-slate-600 truncate font-medium">
                      {cand.exam || cand.exam_title}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 shrink-0 ml-2">
                  <span className="text-[11px] text-slate-500 font-semibold">
                    {cand.time || 'Today'}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                    PASSED
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Audit Activity Summary (5 Cols) */}
        <div className="lg:col-span-5 bg-gradient-to-br from-emerald-100/90 via-teal-100/80 to-cyan-100/90 rounded-3xl border-2 border-emerald-300/90 p-6 shadow-sm text-slate-900 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/90 text-emerald-950 border border-emerald-200 font-black text-xs uppercase tracking-wider shadow-2xs">
                System Audit Trail
              </span>
              <button
                type="button"
                onClick={() => onNavigateTab('activity_logs')}
                className="text-xs font-bold text-emerald-950 hover:text-black hover:underline cursor-pointer bg-white/90 hover:bg-white px-3 py-1 rounded-xl border border-emerald-300 shadow-2xs transition-colors"
              >
                Full Logs →
              </button>
            </div>

            <div className="space-y-2.5 mt-3">
              {recentLogs.slice(0, 4).map((log, idx) => (
                <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-white/90 hover:bg-white border border-teal-200/90 shadow-2xs text-xs transition-all">
                  <div className="min-w-0 flex-1 pr-2">
                    <p className="font-bold text-slate-900 truncate text-xs">{log.action}</p>
                    <p className="text-[11px] text-slate-600 truncate font-medium">{log.user || log.user_name || 'System'}</p>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-emerald-900 bg-emerald-100 px-2 py-0.5 rounded-md border border-emerald-300 shrink-0">
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
