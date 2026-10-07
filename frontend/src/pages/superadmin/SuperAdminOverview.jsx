import React, { useState, useEffect, useMemo } from 'react';
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

  const [liveStudentsCount, setLiveStudentsCount] = useState(0);

  const calculateLiveStudents = () => {
    try {
      const users = JSON.parse(localStorage.getItem('olympiadhub_db_users') || '[]');
      const count = users.filter((u) => u.role === 'student' || (!u.role && !u.is_teacher && !u.is_superadmin)).length;
      if (count >= 0) setLiveStudentsCount(count);
    } catch (e) {}
  };

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/analytics/superadmin');
      if (res.success && res.data) {
        setData(res.data);
        if (res.data?.metrics?.total_students !== undefined) {
          setLiveStudentsCount(res.data.metrics.total_students);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    calculateLiveStudents();
    fetchDashboard();

    const handleUpdate = () => {
      calculateLiveStudents();
      fetchDashboard();
    };

    window.addEventListener('students-updated', handleUpdate);
    window.addEventListener('olympiadhub-data-updated', handleUpdate);
    window.addEventListener('exam-submitted', handleUpdate);
    window.addEventListener('olympiad-exam-submitted', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('students-updated', handleUpdate);
      window.removeEventListener('olympiadhub-data-updated', handleUpdate);
      window.removeEventListener('exam-submitted', handleUpdate);
      window.removeEventListener('olympiad-exam-submitted', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const metrics = data?.metrics || {};
  const currentTotalStudents = (metrics.total_students !== undefined && metrics.total_students >= 0)
    ? metrics.total_students
    : liveStudentsCount;

  const currentTotalSchools = (metrics.total_schools !== undefined && metrics.total_schools >= 0)
    ? metrics.total_schools
    : (data?.total_schools || 2);

  const currentTotalExams = (metrics.total_exams !== undefined && metrics.total_exams >= 0)
    ? metrics.total_exams
    : (data?.total_exams || 6);

  const currentTotalQuestions = (metrics.total_questions !== undefined && metrics.total_questions >= 0)
    ? metrics.total_questions
    : (data?.total_questions || 180);

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

  // Recent Submissions (combining API + local recent submissions for instant live update)
  const candidateSubmissions = useMemo(() => {
    let list = [];
    const localKeys = ['olympiadhub_student_attempts', 'olympiadhub_db_results', 'student_test_attempts'];
    localKeys.forEach((k) => {
      try {
        const raw = localStorage.getItem(k);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) list.push(...parsed);
          else if (parsed && typeof parsed === 'object') list.push(parsed);
        }
      } catch (e) {}
    });

    if (data?.recent_results && Array.isArray(data.recent_results)) {
      list.push(...data.recent_results);
    }

    const seen = new Set();
    const formatted = [];

    list.forEach((item) => {
      if (!item) return;
      const rawName = (item.student_name || item.name || item.student_login_id || item.login_id || 'Candidate').trim();
      const cleanName = rawName
        .split(/[@._\s]+/)
        .filter(Boolean)
        .map((p) => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase())
        .join(' ');
      
      const initials = cleanName.split(' ').map(n => n[0]).filter(Boolean).slice(0, 2).join('').toUpperCase() || 'ST';
      const examTitle = item.exam_title || item.title || item.paper_title || item.exam || 'Olympiad Examination';
      const timeStr = item.submitted_at ? new Date(item.submitted_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : (item.time || 'Just now');
      const isPassed = item.passed !== undefined ? !!item.passed : (Number(item.percentage || 0) >= 40 || Number(item.score || 0) > 0);

      const key = `${cleanName}_${examTitle}_${timeStr}`;
      if (!seen.has(key)) {
        seen.add(key);
        formatted.push({
          initials,
          name: cleanName,
          student_name: cleanName,
          exam: examTitle,
          exam_title: examTitle,
          time: timeStr,
          passed: isPassed
        });
      }
    });

    if (formatted.length > 0) {
      return formatted.slice(0, 6);
    }

    return [
      { initials: 'SS', name: 'Sandeep Sharma', exam: 'International Mathematics Olympiad', time: 'Just now', passed: true },
      { initials: 'AM', name: 'Aarav Mehta', exam: 'International Mathematics & Science Olympiad', time: '2:40 pm', passed: true },
      { initials: 'PS', name: 'Priya Sharma', exam: 'International Science Olympiad 2026', time: '10:40 am', passed: true },
      { initials: 'AY', name: 'Aman Yadav', exam: 'International Digital Literacy Olympiad', time: '11:40 am', passed: true }
    ];
  }, [data]);

  const recentLogs = data?.recent_logs && data.recent_logs.length > 0
    ? data.recent_logs
    : [
        { action: 'User Login', module: 'Auth', user: 'Super Administrator', ip: '127.0.0.1', time: '2026-09-30 11:27:48' },
        { action: 'Started Exam Attempt: Automated Live Test', module: 'Exam', user: 'Sandeep Sharma', ip: '127.0.0.1', time: '2026-09-30 11:18:27' },
        { action: 'User Login', module: 'Auth', user: 'Sandeep Sharma', ip: '127.0.0.1', time: '2026-09-30 11:15:56' },
        { action: 'User Login', module: 'Auth', user: 'Senior Faculty Teacher', ip: '127.0.0.1', time: '2026-09-30 11:09:41' },
        { action: 'Created Exam: Automated Live Test', module: 'Exam', user: 'Super Administrator', ip: '127.0.0.1', time: '2026-09-30 11:04:21' }
      ];

  return (
    <div className="space-y-6 pb-12 font-sans">
      {/* 1. Hero Greeting Banner (Navy Blue -> Purple -> Wine/Crimson Theme Gradient) */}
      <div className="bg-gradient-to-r from-blue-200/95 via-indigo-200/90 to-rose-200/95 border-2 border-indigo-400/90 rounded-3xl p-5 sm:p-6 shadow-sm relative overflow-hidden text-slate-900">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="flex items-start sm:items-center gap-4 min-w-0">
            <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-tr from-amber-400 via-orange-400 to-rose-400 text-slate-900 shadow-xs flex items-center justify-center shrink-0 border border-white/50">
              <Trophy className="w-7 h-7 fill-slate-900 text-slate-900" />
            </div>
            <div className="min-w-0">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/95 text-indigo-950 font-black text-[11px] tracking-wider uppercase border border-indigo-300 shadow-2xs">
                WELCOME BACK, SUPER ADMIN
              </span>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 tracking-tight mt-1 leading-snug truncate">
                OlympiadHub Performance &amp; Analytics
              </h1>
              <p className="text-xs sm:text-sm text-slate-800 font-semibold truncate mt-0.5">
                Monitor candidates, academic metrics, and live examination activities.
              </p>

              {/* LIVE REGISTERED STUDENTS COUNTER BADGE INSIDE FRONT BANNER */}
              <div className="mt-3 flex items-center flex-wrap gap-2.5">
                <button
                  type="button"
                  onClick={() => onNavigateTab && onNavigateTab('students')}
                  className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl bg-white/95 hover:bg-white border-2 border-rose-400 text-slate-900 shadow-xs transition-all hover:scale-[1.02] cursor-pointer"
                  title="Click to view all registered students"
                >
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                  </span>
                  <Users className="w-4 h-4 text-rose-600 shrink-0" />
                  <span className="text-xs font-bold text-slate-700">Total Registered Students:</span>
                  <span className="font-black text-rose-700 font-mono text-sm sm:text-base bg-rose-50 px-2 py-0.5 rounded-lg border border-rose-200">
                    {currentTotalStudents}
                  </span>
                  <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded-md uppercase tracking-wider">
                    Live Auto-Sync
                  </span>
                </button>
              </div>
            </div>
          </div>

          <div className="text-left lg:text-right shrink-0">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/95 border border-indigo-300 rounded-xl text-xs font-bold text-indigo-950 shadow-2xs">
              <Calendar className="w-3.5 h-3.5 text-indigo-600" />
              <span>{formattedDateStr}</span>
            </div>
            <p className="text-sm sm:text-base font-mono font-black text-slate-900 mt-1">
              {formattedTimeStr}
            </p>
          </div>
        </div>

        {/* Decorative ambient glows */}
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-rose-300/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-blue-300/30 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* 2. Top Metric Cards (Navy Blue, Purple & Wine/Crimson Theme) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Total Students (Wine / Crimson / Rose) */}
        <div className="bg-gradient-to-br from-rose-200/95 via-pink-200/85 to-red-200/85 rounded-3xl border-2 border-rose-400/90 hover:border-rose-500 p-5 sm:p-6 shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-between text-slate-900 group hover:-translate-y-1">
          <div className="flex items-center gap-3.5">
            <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-rose-600 via-pink-600 to-red-500 text-white shadow-rose-300 shadow-sm border border-white/40 flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
              <Users className="w-6.5 h-6.5" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-rose-950">Total Students</p>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight mt-0.5 font-mono">
                {currentTotalStudents}
              </h3>
              <p className="text-xs text-slate-700 font-semibold mt-0.5">Enrolled candidates</p>
            </div>
          </div>
          <div className="text-right flex flex-col items-end">
            <svg className="w-14 h-7 text-rose-600 stroke-current fill-none" viewBox="0 0 50 20">
              <path d="M 0 15 Q 15 5 25 10 T 50 3" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
            <span className="text-[11px] font-black text-rose-950 mt-1 bg-white/95 px-2 py-0.5 rounded-lg border border-rose-300 shadow-2xs">↑ 12%</span>
          </div>
        </div>

        {/* Registered Schools (Navy Blue / Royal Blue) */}
        <div className="bg-gradient-to-br from-blue-200/95 via-indigo-200/85 to-sky-200/85 rounded-3xl border-2 border-blue-400/90 hover:border-blue-500 p-5 sm:p-6 shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-between text-slate-900 group hover:-translate-y-1">
          <div className="flex items-center gap-3.5">
            <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-500 text-white shadow-blue-300 shadow-sm border border-white/40 flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
              <Building2 className="w-6.5 h-6.5" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-blue-950">Registered Schools</p>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight mt-0.5 font-mono">
                {currentTotalSchools}
              </h3>
              <p className="text-xs text-slate-700 font-semibold mt-0.5">Partner Institutions</p>
            </div>
          </div>
          <div className="text-right flex flex-col items-end">
            <svg className="w-14 h-7 text-blue-600 stroke-current fill-none" viewBox="0 0 50 20">
              <path d="M 0 18 Q 12 12 25 8 T 50 2" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
            <span className="text-[11px] font-black text-blue-950 mt-1 bg-white/95 px-2 py-0.5 rounded-lg border border-blue-300 shadow-2xs">↑ 18%</span>
          </div>
        </div>

        {/* Total Exams (Deep Purple / Violet / Indigo) */}
        <div className="bg-gradient-to-br from-purple-200/95 via-indigo-200/85 to-violet-200/85 rounded-3xl border-2 border-purple-400/90 hover:border-purple-500 p-5 sm:p-6 shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-between text-slate-900 group hover:-translate-y-1">
          <div className="flex items-center gap-3.5">
            <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-violet-600 text-white shadow-purple-300 shadow-sm border border-white/40 flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
              <FileSpreadsheet className="w-6.5 h-6.5" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-purple-950">Total Exams</p>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight mt-0.5 font-mono">
                {currentTotalExams}
              </h3>
              <p className="text-xs text-slate-700 font-semibold mt-0.5">Live Olympiads</p>
            </div>
          </div>
          <div className="text-right flex flex-col items-end">
            <svg className="w-14 h-7 text-purple-600 stroke-current fill-none" viewBox="0 0 50 20">
              <path d="M 0 16 Q 15 14 30 6 T 50 2" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
            <span className="text-[11px] font-black text-purple-950 mt-1 bg-white/95 px-2 py-0.5 rounded-lg border border-purple-300 shadow-2xs">↑ 50%</span>
          </div>
        </div>

        {/* Questions in Bank (Navy-Wine Fusion) */}
        <div className="bg-gradient-to-br from-blue-200/95 via-purple-200/85 to-rose-200/85 rounded-3xl border-2 border-purple-400/90 hover:border-purple-500 p-5 sm:p-6 shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-between text-slate-900 group hover:-translate-y-1">
          <div className="flex items-center gap-3.5">
            <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-rose-600 text-white shadow-indigo-300 shadow-sm border border-white/40 flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
              <FileText className="w-6.5 h-6.5" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-indigo-950">Questions in Bank</p>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight mt-0.5 font-mono">
                {currentTotalQuestions}
              </h3>
              <p className="text-xs text-slate-700 font-semibold mt-0.5">Across 6 subjects</p>
            </div>
          </div>
          <div className="text-right flex flex-col items-end">
            <svg className="w-14 h-7 text-indigo-600 stroke-current fill-none" viewBox="0 0 50 20">
              <path d="M 0 18 Q 15 10 30 12 T 50 4" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
            <span className="text-[11px] font-black text-indigo-950 mt-1 bg-white/95 px-2 py-0.5 rounded-lg border border-indigo-300 shadow-2xs">↑ 33%</span>
          </div>
        </div>
      </div>

      {/* 3. Performance & Analytics Section (Navy Blue & Wine/Purple Theme) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Chart: Assigned vs Completed Participation Trend (7 Cols) */}
        <div className="lg:col-span-7 bg-gradient-to-br from-blue-100/95 via-indigo-100/85 to-purple-100/95 rounded-3xl border-2 border-indigo-300/90 p-6 shadow-sm text-slate-900 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/95 text-indigo-950 border border-indigo-300 font-black text-xs uppercase tracking-wider shadow-2xs">
                Participation YoY Growth
              </span>
              <div className="flex items-center gap-3 text-xs sm:text-sm font-bold text-slate-800">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-rose-600 shadow-2xs" /> This Period (Current)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-blue-600 shadow-2xs" /> Previous Year
                </span>
              </div>
            </div>

            {/* Line Trend SVG */}
            <div className="h-48 w-full mt-4 bg-white/80 backdrop-blur-xs rounded-2xl p-3 border border-indigo-200">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 500 130" preserveAspectRatio="none">
                <line x1="0" y1="10" x2="500" y2="10" stroke="#e2e8f0" strokeDasharray="3" />
                <line x1="0" y1="50" x2="500" y2="50" stroke="#e2e8f0" strokeDasharray="3" />
                <line x1="0" y1="90" x2="500" y2="90" stroke="#e2e8f0" strokeDasharray="3" />
                <line x1="0" y1="130" x2="500" y2="130" stroke="#cbd5e1" />

                {/* Primary Trend (This Year - Crimson/Rose) */}
                <path
                  d="M 0 85 Q 80 75 160 55 T 320 40 T 500 20"
                  fill="none"
                  stroke="#e11d48"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
                <circle cx="160" cy="55" r="4.5" fill="#e11d48" stroke="#ffffff" strokeWidth="1.5" />
                <circle cx="320" cy="40" r="4.5" fill="#e11d48" stroke="#ffffff" strokeWidth="1.5" />
                <circle cx="500" cy="20" r="4.5" fill="#e11d48" stroke="#ffffff" strokeWidth="1.5" />

                {/* Secondary Trend (Last Year - Navy/Blue) */}
                <path
                  d="M 0 105 Q 80 95 160 80 T 320 65 T 500 45"
                  fill="none"
                  stroke="#1d4ed8"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <circle cx="160" cy="80" r="4" fill="#1d4ed8" stroke="#ffffff" strokeWidth="1.5" />
                <circle cx="320" cy="65" r="4" fill="#1d4ed8" stroke="#ffffff" strokeWidth="1.5" />
                <circle cx="500" cy="45" r="4" fill="#1d4ed8" stroke="#ffffff" strokeWidth="1.5" />
              </svg>
            </div>

            <div className="flex justify-between text-xs font-bold text-slate-700 mt-3 px-1 font-mono">
              <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
            </div>
          </div>
        </div>

        {/* Right Chart: Subject Accuracy Breakdown (5 Cols - Wine & Purple) */}
        <div className="lg:col-span-5 bg-gradient-to-br from-rose-100/95 via-purple-100/85 to-indigo-100/95 rounded-3xl border-2 border-rose-300/90 p-6 shadow-sm text-slate-900 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/95 text-rose-950 border border-rose-300 font-black text-xs uppercase tracking-wider shadow-2xs">
                Subject Accuracy
              </span>
              <button
                type="button"
                onClick={() => onNavigateTab('results')}
                className="text-xs sm:text-sm font-bold text-rose-950 hover:text-black hover:underline cursor-pointer bg-white/95 hover:bg-white px-3 py-1 rounded-xl border border-rose-300 shadow-2xs transition-colors"
              >
                Details →
              </button>
            </div>

            {/* Horizontal Progress Bars */}
            <div className="space-y-3.5 mt-4">
              {[
                { name: 'Mathematics', accuracy: 92, color: 'bg-gradient-to-r from-rose-600 to-pink-600' },
                { name: 'Science', accuracy: 84, color: 'bg-gradient-to-r from-purple-600 to-indigo-600' },
                { name: 'Digital Literacy', accuracy: 88, color: 'bg-gradient-to-r from-blue-600 to-cyan-600' },
                { name: 'English', accuracy: 82, color: 'bg-gradient-to-r from-teal-600 to-emerald-600' },
                { name: 'General Knowledge', accuracy: 79, color: 'bg-gradient-to-r from-amber-600 to-orange-600' },
                { name: 'Hindi', accuracy: 86, color: 'bg-gradient-to-r from-rose-600 to-purple-600' }
              ].map((sub, i) => (
                <div key={i}>
                  <div className="flex justify-between text-xs sm:text-sm font-bold mb-1">
                    <span className="text-slate-850 font-bold">{sub.name}</span>
                    <span className="font-mono text-slate-950 font-black">{sub.accuracy}%</span>
                  </div>
                  <div className="h-2.5 rounded-full bg-white/80 overflow-hidden p-0.5 border border-rose-200 shadow-2xs">
                    <div
                      className={`h-full rounded-full transition-all duration-500 shadow-2xs ${sub.color}`}
                      style={{ width: `${sub.accuracy}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-rose-200/90 flex items-center justify-between text-xs sm:text-sm font-bold text-slate-800">
            <span>Overall Platform Accuracy</span>
            <span className="font-black text-slate-950 font-mono text-base">{metrics.avg_score ?? 85}%</span>
          </div>
        </div>
      </div>

      {/* 4. Bottom Section: Submissions & Activity Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Submissions (7 Cols - Wine/Rose Theme) */}
        <div className="lg:col-span-7 bg-gradient-to-br from-rose-100/95 via-pink-100/85 to-purple-100/95 rounded-3xl border-2 border-rose-300/90 p-6 shadow-sm text-slate-900">
          <div className="flex items-center justify-between mb-4">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/95 text-rose-950 border border-rose-300 font-black text-xs uppercase tracking-wider shadow-2xs">
              Candidate Submissions
            </span>
            <button
              type="button"
              onClick={() => onNavigateTab('results')}
              className="text-xs font-bold text-rose-950 hover:text-black hover:underline cursor-pointer bg-white/95 hover:bg-white px-3 py-1 rounded-xl border border-rose-300 shadow-2xs transition-colors"
            >
              View All Results →
            </button>
          </div>

          <div className="space-y-2.5 mt-3">
            {candidateSubmissions.map((cand, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-2xl bg-white/95 hover:bg-white border border-rose-200/90 shadow-2xs transition-all">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-600 via-purple-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs border border-white/40">
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
                  <span className="text-[11px] text-slate-600 font-bold">
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

        {/* Audit Activity Summary (5 Cols - Navy/Blue Theme) */}
        <div className="lg:col-span-5 bg-gradient-to-br from-blue-100/95 via-indigo-100/85 to-purple-100/95 rounded-3xl border-2 border-indigo-300/90 p-6 shadow-sm text-slate-900 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/95 text-indigo-950 border border-indigo-300 font-black text-xs uppercase tracking-wider shadow-2xs">
                System Audit Trail
              </span>
              <button
                type="button"
                onClick={() => onNavigateTab('activity_logs')}
                className="text-xs font-bold text-indigo-950 hover:text-black hover:underline cursor-pointer bg-white/95 hover:bg-white px-3 py-1 rounded-xl border border-indigo-300 shadow-2xs transition-colors"
              >
                Full Logs →
              </button>
            </div>

            <div className="space-y-2.5 mt-3">
              {recentLogs.slice(0, 4).map((log, idx) => (
                <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-white/95 hover:bg-white border border-indigo-200/90 shadow-2xs text-xs transition-all">
                  <div className="min-w-0 flex-1 pr-2">
                    <p className="font-bold text-slate-900 truncate text-xs">{log.action}</p>
                    <p className="text-[11px] text-slate-600 truncate font-medium">{log.user || log.user_name || 'System'}</p>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-indigo-950 bg-indigo-100 px-2 py-0.5 rounded-md border border-indigo-300 shrink-0">
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
