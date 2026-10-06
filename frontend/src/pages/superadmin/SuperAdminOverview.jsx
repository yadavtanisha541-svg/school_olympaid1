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
        { initials: 'AM', name: 'Aarav Mehta', exam: 'National Mathematics & Science Olympiad', time: '2:40 pm', passed: true, color: 'from-[#ec4899] via-[#8b5cf6] to-[#3b82f6]' },
        { initials: 'PS', name: 'Priya Sharma', exam: 'National Mathematics & Science Olympiad 2008', time: '10:40 am', passed: true, color: 'from-[#ec4899] via-[#8b5cf6] to-[#3b82f6]' },
        { initials: 'AY', name: 'Aman Yadav', exam: 'National Mathematics & Science Olympiad 2006', time: '11:40 am', passed: true, color: 'from-[#ec4899] via-[#8b5cf6] to-[#3b82f6]' }
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
      {/* 1. Hero Greeting Banner (Pink -> Purple -> Blue Gradient Box) */}
      <div className="bg-gradient-to-r from-[#ec4899] via-[#8b5cf6] to-[#3b82f6] border border-white/30 rounded-3xl p-5 sm:p-6 shadow-xl shadow-indigo-950/20 relative overflow-hidden text-white">
        {/* Soft Decorative Glow Blobs */}
        <div className="absolute top-0 right-1/4 w-48 h-48 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-10 w-40 h-40 bg-white/15 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div className="flex items-center gap-4 min-w-0">
            <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-white/20 border border-white/30 shadow-md flex items-center justify-center text-amber-300 shrink-0 backdrop-blur-xs">
              <Trophy className="w-7 h-7 text-amber-300 fill-amber-300/40" />
            </div>
            <div className="min-w-0">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/20 text-white font-extrabold text-[11px] tracking-wider uppercase border border-white/30 backdrop-blur-xs">
                WELCOME BACK, SUPER ADMIN
              </span>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight mt-1 leading-snug truncate">
                OlympiadHub Performance &amp; Analytics
              </h1>
              <p className="text-xs sm:text-sm text-pink-100 font-medium truncate mt-0.5">
                Monitor candidates, academic metrics, and live examination activities.
              </p>
            </div>
          </div>

          <div className="text-left sm:text-right shrink-0">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-black/20 border border-white/30 rounded-xl text-xs font-bold text-white shadow-sm backdrop-blur-xs">
              <Calendar className="w-3.5 h-3.5 text-pink-200" />
              <span>{formattedDateStr}</span>
            </div>
            <p className="text-sm sm:text-base font-mono font-black text-white mt-1">
              {formattedTimeStr}
            </p>
          </div>
        </div>
      </div>

      {/* 2. Top Metric Cards (Row 1: 4 Pink -> Purple -> Blue Gradient Boxes) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Total Students */}
        <div className="bg-gradient-to-br from-[#ec4899] via-[#8b5cf6] to-[#3b82f6] rounded-3xl border border-white/25 p-5 sm:p-6 shadow-xl hover:shadow-2xl transition-all duration-200 flex items-center justify-between text-white group hover:-translate-y-1">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-white/20 text-white border border-white/30 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform shrink-0">
              <Users className="w-7 h-7" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-pink-100">Total Students</p>
              <h3 className="text-2xl sm:text-3xl font-black text-white leading-tight mt-0.5 font-mono">
                {metrics.total_students ?? 2}
              </h3>
              <p className="text-xs text-white/90 font-semibold mt-0.5">Enrolled candidates</p>
            </div>
          </div>
          <div className="text-right flex flex-col items-end">
            <svg className="w-14 h-7 text-white stroke-current fill-none" viewBox="0 0 50 20">
              <path d="M 0 15 Q 15 5 25 10 T 50 3" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
            <span className="text-xs font-black text-white mt-1 bg-white/20 px-2 py-0.5 rounded-lg border border-white/30">↑ 12%</span>
          </div>
        </div>

        {/* Registered Schools */}
        <div className="bg-gradient-to-br from-[#ec4899] via-[#8b5cf6] to-[#3b82f6] rounded-3xl border border-white/25 p-5 sm:p-6 shadow-xl hover:shadow-2xl transition-all duration-200 flex items-center justify-between text-white group hover:-translate-y-1">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-white/20 text-white border border-white/30 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform shrink-0">
              <Building2 className="w-7 h-7" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-pink-100">Registered Schools</p>
              <h3 className="text-2xl sm:text-3xl font-black text-white leading-tight mt-0.5 font-mono">
                {metrics.total_schools ?? 12}
              </h3>
              <p className="text-xs text-white/90 font-semibold mt-0.5">Partner Institutions</p>
            </div>
          </div>
          <div className="text-right flex flex-col items-end">
            <svg className="w-14 h-7 text-white stroke-current fill-none" viewBox="0 0 50 20">
              <path d="M 0 18 Q 12 12 25 8 T 50 2" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
            <span className="text-xs font-black text-white mt-1 bg-white/20 px-2 py-0.5 rounded-lg border border-white/30">↑ 18%</span>
          </div>
        </div>

        {/* Total Exams */}
        <div className="bg-gradient-to-br from-[#ec4899] via-[#8b5cf6] to-[#3b82f6] rounded-3xl border border-white/25 p-5 sm:p-6 shadow-xl hover:shadow-2xl transition-all duration-200 flex items-center justify-between text-white group hover:-translate-y-1">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-white/20 text-white border border-white/30 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform shrink-0">
              <FileSpreadsheet className="w-7 h-7" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-pink-100">Total Exams</p>
              <h3 className="text-2xl sm:text-3xl font-black text-white leading-tight mt-0.5 font-mono">
                {metrics.total_exams ?? 2}
              </h3>
              <p className="text-xs text-white/90 font-semibold mt-0.5">Live Olympiads</p>
            </div>
          </div>
          <div className="text-right flex flex-col items-end">
            <svg className="w-14 h-7 text-white stroke-current fill-none" viewBox="0 0 50 20">
              <path d="M 0 16 Q 15 14 30 6 T 50 2" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
            <span className="text-xs font-black text-white mt-1 bg-white/20 px-2 py-0.5 rounded-lg border border-white/30">↑ 50%</span>
          </div>
        </div>

        {/* Questions in Bank */}
        <div className="bg-gradient-to-br from-[#ec4899] via-[#8b5cf6] to-[#3b82f6] rounded-3xl border border-white/25 p-5 sm:p-6 shadow-xl hover:shadow-2xl transition-all duration-200 flex items-center justify-between text-white group hover:-translate-y-1">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-white/20 text-white border border-white/30 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform shrink-0">
              <FileText className="w-7 h-7" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-pink-100">Questions in Bank</p>
              <h3 className="text-2xl sm:text-3xl font-black text-white leading-tight mt-0.5 font-mono">
                {metrics.total_questions ?? 3}
              </h3>
              <p className="text-xs text-white/90 font-semibold mt-0.5">Across all subjects</p>
            </div>
          </div>
          <div className="text-right flex flex-col items-end">
            <svg className="w-14 h-7 text-white stroke-current fill-none" viewBox="0 0 50 20">
              <path d="M 0 18 Q 15 10 30 12 T 50 4" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
            <span className="text-xs font-black text-white mt-1 bg-white/20 px-2 py-0.5 rounded-lg border border-white/30">↑ 33%</span>
          </div>
        </div>
      </div>

      {/* 3. Performance & Analytics Section (Pink -> Purple -> Blue Gradient Boxes) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Chart: Assigned vs Completed Participation Trend (7 Cols) */}
        <div className="lg:col-span-7 bg-gradient-to-br from-[#ec4899] via-[#8b5cf6] to-[#3b82f6] rounded-3xl border border-white/25 p-6 shadow-xl text-white flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/20 text-white border border-white/30 font-bold text-xs uppercase tracking-wider backdrop-blur-xs">
                Participation YoY Growth
              </span>
              <div className="flex items-center gap-3 text-xs sm:text-sm font-bold text-pink-100">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-white shadow-xs" /> This Period (Current)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-blue-200 shadow-xs" /> Previous Year
                </span>
              </div>
            </div>

            {/* Line Trend SVG */}
            <div className="h-48 w-full mt-4">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 500 130" preserveAspectRatio="none">
                <line x1="0" y1="10" x2="500" y2="10" stroke="rgba(255,255,255,0.2)" strokeDasharray="3" />
                <line x1="0" y1="50" x2="500" y2="50" stroke="rgba(255,255,255,0.2)" strokeDasharray="3" />
                <line x1="0" y1="90" x2="500" y2="90" stroke="rgba(255,255,255,0.2)" strokeDasharray="3" />
                <line x1="0" y1="130" x2="500" y2="130" stroke="rgba(255,255,255,0.4)" />

                {/* Primary Trend (This Year - White) */}
                <path
                  d="M 0 85 Q 80 75 160 55 T 320 40 T 500 20"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
                <circle cx="160" cy="55" r="4" fill="#ffffff" stroke="#8b5cf6" strokeWidth="2" />
                <circle cx="320" cy="40" r="4" fill="#ffffff" stroke="#8b5cf6" strokeWidth="2" />
                <circle cx="500" cy="20" r="4" fill="#ffffff" stroke="#8b5cf6" strokeWidth="2" />

                {/* Secondary Trend (Last Year - Blue/Lavender) */}
                <path
                  d="M 0 105 Q 80 95 160 80 T 320 65 T 500 45"
                  fill="none"
                  stroke="#bfdbfe"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <circle cx="160" cy="80" r="3.5" fill="#bfdbfe" stroke="#3b82f6" strokeWidth="2" />
                <circle cx="320" cy="65" r="3.5" fill="#bfdbfe" stroke="#3b82f6" strokeWidth="2" />
                <circle cx="500" cy="45" r="3.5" fill="#bfdbfe" stroke="#3b82f6" strokeWidth="2" />
              </svg>
            </div>

            <div className="flex justify-between text-xs font-bold text-pink-100 mt-3 px-1 font-mono">
              <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
            </div>
          </div>
        </div>

        {/* Right Chart: Subject Accuracy Breakdown (5 Cols) */}
        <div className="lg:col-span-5 bg-gradient-to-br from-[#ec4899] via-[#8b5cf6] to-[#3b82f6] rounded-3xl border border-white/25 p-6 shadow-xl text-white flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/20 text-white border border-white/30 font-bold text-xs uppercase tracking-wider backdrop-blur-xs">
                Subject Accuracy
              </span>
              <button
                type="button"
                onClick={() => onNavigateTab('results')}
                className="text-xs sm:text-sm font-bold text-white hover:text-pink-100 hover:underline cursor-pointer bg-white/15 px-3 py-1 rounded-xl border border-white/25"
              >
                Details →
              </button>
            </div>

            {/* Horizontal Progress Bars */}
            <div className="space-y-4 mt-4">
              {[
                { name: 'Mathematics', accuracy: 92 },
                { name: 'Science & Physics', accuracy: 84 },
                { name: 'English & Literature', accuracy: 88 },
                { name: 'General Knowledge', accuracy: 76 }
              ].map((sub, i) => (
                <div key={i}>
                  <div className="flex justify-between text-xs sm:text-sm font-bold mb-1.5">
                    <span className="text-white font-semibold">{sub.name}</span>
                    <span className="font-mono text-white font-black">{sub.accuracy}%</span>
                  </div>
                  <div className="h-3 rounded-full bg-black/25 overflow-hidden p-0.5 border border-white/20">
                    <div
                      className="h-full rounded-full transition-all duration-500 shadow-sm bg-white"
                      style={{ width: `${sub.accuracy}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/20 flex items-center justify-between text-xs sm:text-sm font-semibold text-pink-100">
            <span>Overall Platform Accuracy</span>
            <span className="font-black text-white font-mono text-base">{metrics.avg_score ?? 85}%</span>
          </div>
        </div>
      </div>

      {/* 4. Bottom Section: Submissions & Activity Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Submissions (7 Cols) */}
        <div className="lg:col-span-7 bg-gradient-to-br from-[#ec4899] via-[#8b5cf6] to-[#3b82f6] rounded-3xl border border-white/25 p-6 shadow-xl text-white">
          <div className="flex items-center justify-between mb-4">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/20 text-white border border-white/30 font-bold text-xs uppercase tracking-wider backdrop-blur-xs">
              Candidate Submissions
            </span>
            <button
              type="button"
              onClick={() => onNavigateTab('results')}
              className="text-xs font-bold text-white hover:text-pink-100 hover:underline cursor-pointer bg-white/15 px-3 py-1 rounded-xl border border-white/25"
            >
              View All Results →
            </button>
          </div>

          <div className="space-y-2.5 mt-3">
            {candidateSubmissions.map((cand, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-2xl bg-white/15 hover:bg-white/25 border border-white/25 transition-all">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-white text-purple-700 flex items-center justify-center font-bold text-xs shrink-0 shadow-md">
                    {cand.initials || (cand.student_name ? cand.student_name.charAt(0) : 'S')}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white truncate">
                      {cand.name || cand.student_name}
                    </p>
                    <p className="text-[11px] text-pink-100 truncate">
                      {cand.exam || cand.exam_title}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 shrink-0 ml-2">
                  <span className="text-[11px] text-pink-100 font-medium">
                    {cand.time || 'Today'}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-white/25 text-white border border-white/40">
                    PASSED
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Audit Activity Summary (5 Cols) */}
        <div className="lg:col-span-5 bg-gradient-to-br from-[#ec4899] via-[#8b5cf6] to-[#3b82f6] rounded-3xl border border-white/25 p-6 shadow-xl text-white flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/20 text-white border border-white/30 font-bold text-xs uppercase tracking-wider backdrop-blur-xs">
                System Audit Trail
              </span>
              <button
                type="button"
                onClick={() => onNavigateTab('activity_logs')}
                className="text-xs font-bold text-white hover:text-pink-100 hover:underline cursor-pointer bg-white/15 px-3 py-1 rounded-xl border border-white/25"
              >
                Full Logs →
              </button>
            </div>

            <div className="space-y-2.5 mt-3">
              {recentLogs.slice(0, 4).map((log, idx) => (
                <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-white/15 border border-white/25 text-xs">
                  <div className="min-w-0 flex-1 pr-2">
                    <p className="font-bold text-white truncate text-xs">{log.action}</p>
                    <p className="text-[11px] text-pink-100 truncate">{log.user || log.user_name || 'System'}</p>
                  </div>
                  <span className="text-[10px] font-mono text-white bg-white/20 px-2 py-0.5 rounded-md border border-white/30 shrink-0">
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
