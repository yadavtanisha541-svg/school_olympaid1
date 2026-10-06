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
      {/* 1. Hero Greeting Banner (Mixed Blue + Purple + Pink Gradient Banner) */}
      <div className="bg-gradient-to-r from-[#1e3a8a] via-[#5b21b6] to-[#9d174d] border border-indigo-300/40 rounded-3xl p-5 sm:p-6 shadow-xl shadow-indigo-950/20 relative overflow-hidden text-white">
        {/* Soft Decorative Glow Blobs */}
        <div className="absolute top-0 right-1/4 w-48 h-48 bg-pink-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-10 w-40 h-40 bg-blue-500/30 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div className="flex items-center gap-4 min-w-0">
            <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-white/10 border border-white/20 shadow-md flex items-center justify-center text-amber-300 shrink-0 backdrop-blur-xs">
              <Trophy className="w-7 h-7 text-amber-300 fill-amber-300/30" />
            </div>
            <div className="min-w-0">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/10 text-pink-200 font-extrabold text-[11px] tracking-wider uppercase border border-white/20">
                WELCOME BACK, SUPER ADMIN
              </span>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight mt-1 leading-snug truncate">
                OlympiadHub Performance &amp; Analytics
              </h1>
              <p className="text-xs sm:text-sm text-blue-100 font-medium truncate mt-0.5">
                Monitor candidates, academic metrics, and live examination activities.
              </p>
            </div>
          </div>

          <div className="text-left sm:text-right shrink-0">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-black/20 border border-white/20 rounded-xl text-xs font-bold text-blue-100 shadow-sm backdrop-blur-xs">
              <Calendar className="w-3.5 h-3.5 text-pink-300" />
              <span>{formattedDateStr}</span>
            </div>
            <p className="text-sm sm:text-base font-mono font-black text-pink-200 mt-1">
              {formattedTimeStr}
            </p>
          </div>
        </div>
      </div>

      {/* 2. Top Metric Cards (Row 1: 4 Light Mixed Gradient Theme Boxes) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Total Students */}
        <div className="bg-gradient-to-br from-blue-50/90 via-indigo-50/70 to-pink-50/90 rounded-3xl border-2 border-indigo-200/90 hover:border-pink-400 p-5 sm:p-6 shadow-md hover:shadow-xl transition-all duration-200 flex items-center justify-between text-slate-900 group hover:-translate-y-1">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-white text-pink-600 border border-pink-200 flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform shrink-0">
              <Users className="w-7 h-7" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-slate-600">Total Students</p>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight mt-0.5 font-mono">
                {metrics.total_students ?? 2}
              </h3>
              <p className="text-xs text-pink-600 font-semibold mt-0.5">Enrolled candidates</p>
            </div>
          </div>
          <div className="text-right flex flex-col items-end">
            <svg className="w-14 h-7 text-pink-600 stroke-current fill-none" viewBox="0 0 50 20">
              <path d="M 0 15 Q 15 5 25 10 T 50 3" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
            <span className="text-xs font-black text-pink-700 mt-1 bg-white px-2 py-0.5 rounded-lg border border-pink-200 shadow-2xs">↑ 12%</span>
          </div>
        </div>

        {/* Registered Schools */}
        <div className="bg-gradient-to-br from-blue-50/90 via-indigo-50/70 to-pink-50/90 rounded-3xl border-2 border-indigo-200/90 hover:border-emerald-400 p-5 sm:p-6 shadow-md hover:shadow-xl transition-all duration-200 flex items-center justify-between text-slate-900 group hover:-translate-y-1">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-white text-emerald-600 border border-emerald-200 flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform shrink-0">
              <Building2 className="w-7 h-7" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-slate-600">Registered Schools</p>
              <h3 className="text-2xl sm:text-3xl font-black text-emerald-700 leading-tight mt-0.5 font-mono">
                {metrics.total_schools ?? 12}
              </h3>
              <p className="text-xs text-emerald-600 font-semibold mt-0.5">Partner Institutions</p>
            </div>
          </div>
          <div className="text-right flex flex-col items-end">
            <svg className="w-14 h-7 text-emerald-600 stroke-current fill-none" viewBox="0 0 50 20">
              <path d="M 0 18 Q 12 12 25 8 T 50 2" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
            <span className="text-xs font-black text-emerald-700 mt-1 bg-white px-2 py-0.5 rounded-lg border border-emerald-200 shadow-2xs">↑ 18%</span>
          </div>
        </div>

        {/* Total Exams */}
        <div className="bg-gradient-to-br from-blue-50/90 via-indigo-50/70 to-pink-50/90 rounded-3xl border-2 border-indigo-200/90 hover:border-blue-400 p-5 sm:p-6 shadow-md hover:shadow-xl transition-all duration-200 flex items-center justify-between text-slate-900 group hover:-translate-y-1">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-white text-blue-600 border border-blue-200 flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform shrink-0">
              <FileSpreadsheet className="w-7 h-7" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-slate-600">Total Exams</p>
              <h3 className="text-2xl sm:text-3xl font-black text-blue-700 leading-tight mt-0.5 font-mono">
                {metrics.total_exams ?? 2}
              </h3>
              <p className="text-xs text-blue-600 font-semibold mt-0.5">Live Olympiads</p>
            </div>
          </div>
          <div className="text-right flex flex-col items-end">
            <svg className="w-14 h-7 text-blue-600 stroke-current fill-none" viewBox="0 0 50 20">
              <path d="M 0 16 Q 15 14 30 6 T 50 2" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
            <span className="text-xs font-black text-blue-700 mt-1 bg-white px-2 py-0.5 rounded-lg border border-blue-200 shadow-2xs">↑ 50%</span>
          </div>
        </div>

        {/* Questions in Bank */}
        <div className="bg-gradient-to-br from-blue-50/90 via-indigo-50/70 to-pink-50/90 rounded-3xl border-2 border-indigo-200/90 hover:border-amber-400 p-5 sm:p-6 shadow-md hover:shadow-xl transition-all duration-200 flex items-center justify-between text-slate-900 group hover:-translate-y-1">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-white text-amber-600 border border-amber-200 flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform shrink-0">
              <FileText className="w-7 h-7" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-slate-600">Questions in Bank</p>
              <h3 className="text-2xl sm:text-3xl font-black text-amber-700 leading-tight mt-0.5 font-mono">
                {metrics.total_questions ?? 3}
              </h3>
              <p className="text-xs text-amber-600 font-semibold mt-0.5">Across all subjects</p>
            </div>
          </div>
          <div className="text-right flex flex-col items-end">
            <svg className="w-14 h-7 text-amber-600 stroke-current fill-none" viewBox="0 0 50 20">
              <path d="M 0 18 Q 15 10 30 12 T 50 4" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
            <span className="text-xs font-black text-amber-700 mt-1 bg-white px-2 py-0.5 rounded-lg border border-amber-200 shadow-2xs">↑ 33%</span>
          </div>
        </div>
      </div>

      {/* 3. Performance & Analytics Section (Light Mixed Theme Boxes) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Chart: Assigned vs Completed Participation Trend (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border-2 border-indigo-100 p-6 shadow-md text-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-50 text-indigo-800 border border-indigo-200 font-bold text-xs uppercase tracking-wider">
                Participation YoY Growth
              </span>
              <div className="flex items-center gap-3 text-xs sm:text-sm font-bold text-slate-600">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-pink-500" /> This Period (Pink)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-blue-500" /> Previous (Blue)
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

                {/* Primary Trend (This Year - Pink/Purple) */}
                <path
                  d="M 0 85 Q 80 75 160 55 T 320 40 T 500 20"
                  fill="none"
                  stroke="#db2777"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
                <circle cx="160" cy="55" r="4" fill="#db2777" stroke="#ffffff" strokeWidth="2" />
                <circle cx="320" cy="40" r="4" fill="#db2777" stroke="#ffffff" strokeWidth="2" />
                <circle cx="500" cy="20" r="4" fill="#db2777" stroke="#ffffff" strokeWidth="2" />

                {/* Secondary Trend (Last Year - Blue) */}
                <path
                  d="M 0 105 Q 80 95 160 80 T 320 65 T 500 45"
                  fill="none"
                  stroke="#2563eb"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <circle cx="160" cy="80" r="3.5" fill="#2563eb" stroke="#ffffff" strokeWidth="2" />
                <circle cx="320" cy="65" r="3.5" fill="#2563eb" stroke="#ffffff" strokeWidth="2" />
                <circle cx="500" cy="45" r="3.5" fill="#2563eb" stroke="#ffffff" strokeWidth="2" />
              </svg>
            </div>

            <div className="flex justify-between text-xs font-bold text-slate-400 mt-3 px-1 font-mono">
              <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
            </div>
          </div>
        </div>

        {/* Right Chart: Subject Accuracy Breakdown (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl border-2 border-indigo-100 p-6 shadow-md text-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-50 text-indigo-800 border border-indigo-200 font-bold text-xs uppercase tracking-wider">
                Subject Accuracy
              </span>
              <button
                type="button"
                onClick={() => onNavigateTab('results')}
                className="text-xs sm:text-sm font-bold text-indigo-600 hover:text-pink-600 hover:underline cursor-pointer"
              >
                Details →
              </button>
            </div>

            {/* Horizontal Progress Bars */}
            <div className="space-y-4 mt-4">
              {[
                { name: 'Mathematics', accuracy: 92, color: '#db2777' },
                { name: 'Science & Physics', accuracy: 84, color: '#2563eb' },
                { name: 'English & Literature', accuracy: 88, color: '#7c3aed' },
                { name: 'General Knowledge', accuracy: 76, color: '#059669' }
              ].map((sub, i) => (
                <div key={i}>
                  <div className="flex justify-between text-xs sm:text-sm font-bold mb-1.5">
                    <span className="text-slate-800 font-semibold">{sub.name}</span>
                    <span className="font-mono text-indigo-900 font-black">{sub.accuracy}%</span>
                  </div>
                  <div className="h-3 rounded-full bg-slate-100 overflow-hidden p-0.5 border border-slate-200">
                    <div
                      className="h-full rounded-full transition-all duration-500 shadow-xs"
                      style={{ width: `${sub.accuracy}%`, backgroundColor: sub.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs sm:text-sm font-semibold text-slate-600">
            <span>Overall Platform Accuracy</span>
            <span className="font-black text-emerald-600 font-mono text-base">{metrics.avg_score ?? 85}%</span>
          </div>
        </div>
      </div>

      {/* 4. Bottom Section: Submissions & Activity Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Submissions (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border-2 border-indigo-100 p-6 shadow-md text-slate-800">
          <div className="flex items-center justify-between mb-4">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-50 text-indigo-800 border border-indigo-200 font-bold text-xs uppercase tracking-wider">
              Candidate Submissions
            </span>
            <button
              type="button"
              onClick={() => onNavigateTab('results')}
              className="text-xs font-bold text-indigo-600 hover:text-pink-600 hover:underline cursor-pointer"
            >
              View All Results →
            </button>
          </div>

          <div className="space-y-2.5 mt-3">
            {candidateSubmissions.map((cand, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-indigo-50/50 border border-slate-200/80 transition-all">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#2563eb] via-[#7c3aed] to-[#db2777] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                    {cand.initials || (cand.student_name ? cand.student_name.charAt(0) : 'S')}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 truncate">
                      {cand.name || cand.student_name}
                    </p>
                    <p className="text-[11px] text-slate-500 truncate">
                      {cand.exam || cand.exam_title}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 shrink-0 ml-2">
                  <span className="text-[11px] text-slate-500 font-medium">
                    {cand.time || 'Today'}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200">
                    PASSED
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Audit Activity Summary (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl border-2 border-indigo-100 p-6 shadow-md text-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-50 text-indigo-800 border border-indigo-200 font-bold text-xs uppercase tracking-wider">
                System Audit Trail
              </span>
              <button
                type="button"
                onClick={() => onNavigateTab('activity_logs')}
                className="text-xs font-bold text-indigo-600 hover:text-pink-600 hover:underline cursor-pointer"
              >
                Full Logs →
              </button>
            </div>

            <div className="space-y-2.5 mt-3">
              {recentLogs.slice(0, 4).map((log, idx) => (
                <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
                  <div className="min-w-0 flex-1 pr-2">
                    <p className="font-bold text-slate-900 truncate text-xs">{log.action}</p>
                    <p className="text-[11px] text-slate-500 truncate">{log.user || log.user_name || 'System'}</p>
                  </div>
                  <span className="text-[10px] font-mono text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200 shrink-0 font-bold">
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
