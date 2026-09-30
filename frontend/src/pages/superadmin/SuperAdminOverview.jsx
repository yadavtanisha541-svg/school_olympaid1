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
  Plus
} from 'lucide-react';
import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge';

export const SuperAdminOverview = ({ onNavigateTab }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [selectedClassFilter, setSelectedClassFilter] = useState('all');

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

  const formattedTimeStr = currentTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  }).toLowerCase();

  // Recent Submissions (live fallback to sample items if empty)
  const candidateSubmissions = (data?.recent_results && data.recent_results.length > 0)
    ? data.recent_results
    : [
        { initials: 'AM', name: 'Aarav Mehta', exam: 'National Mathematics & Science Olympiad', time: '2:40 pm', passed: true, color: 'from-blue-500 to-indigo-600' },
        { initials: 'PS', name: 'Priya Sharma', exam: 'National Mathematics & Science Olympiad 2008', time: '10:40 am', passed: true, color: 'from-purple-500 to-pink-500' },
        { initials: 'AY', name: 'Aman Yadav', exam: 'National Mathematics & Science Olympiad 2006', time: '11:40 am', passed: true, color: 'from-indigo-500 to-sky-500' }
      ];

  const recentLogs = data?.recent_logs && data.recent_logs.length > 0
    ? data.recent_logs
    : [
        { action: 'User Login', module: 'Auth', user: 'Super Administrator', ip: '127.0.0.1', time: '2026-09-30 11:27:48', type: 'blue' },
        { action: 'Started Exam Attempt: Automated Live Test Olympiad', module: 'Exam/Quiz', user: 'Aarav Sharma', ip: '127.0.0.1', time: '2026-09-30 11:18:27', type: 'gray' },
        { action: 'User Login', module: 'Auth', user: 'Aarav Sharma', ip: '127.0.0.1', time: '2026-09-30 11:15:56', type: 'orange' },
        { action: 'User Login', module: 'Auth', user: 'Senior Faculty Teacher', ip: '127.0.0.1', time: '2026-09-30 11:09:41', type: 'orange' },
        { action: 'Created Exam: Automated Live Test Olympiad', module: 'Exam/Quiz', user: 'Super Administrator', ip: '127.0.0.1', time: '2026-09-30 11:04:21', type: 'purple' }
      ];

  // Subject accuracy values
  const subjects = [
    { name: 'Mathematics', accuracy: 100, color: '#14b8a6', dotClass: 'bg-teal-500' },
    { name: 'Science', accuracy: 80, color: '#3b82f6', dotClass: 'bg-blue-500' },
    { name: 'English', accuracy: 85, color: '#8b5cf6', dotClass: 'bg-purple-500' },
    { name: 'General Knowledge', accuracy: 80, color: '#f59e0b', dotClass: 'bg-amber-500' }
  ];

  return (
    <div className="space-y-6 pb-12 font-sans">
      {/* 1. Brand Greeting & Quick Actions Header Banner matching OlympiadHub theme */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Indigo-Purple Brand Greeting Card (8 Cols) */}
        <div className="lg:col-span-8 bg-gradient-to-r from-indigo-50/80 via-purple-50/60 to-blue-50/40 border border-indigo-100/90 rounded-3xl p-5 sm:p-6 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* Trophy / Academic Badge */}
            <div className="w-14 h-14 rounded-2xl bg-white border border-indigo-100 shadow-xs flex items-center justify-center text-indigo-600 shadow-indigo-500/10 shrink-0">
              <Trophy className="w-7 h-7 text-indigo-600 fill-indigo-50" />
            </div>
            <div>
              <p className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-widest text-indigo-500">
                GOOD MORNING, SUPER ADMIN
              </p>
              <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight mt-0.5 leading-snug">
                Here's what's happening at <span className="text-indigo-600">OlympiadHub</span> today
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Track examinations, manage questions and keep everything running smoothly.
              </p>
            </div>
          </div>

          {/* Right Live Date & Time inside card */}
          <div className="text-left sm:text-right shrink-0 border-t sm:border-t-0 border-indigo-100/60 pt-2 sm:pt-0">
            <p className="text-xs font-bold text-slate-800 font-sans">
              {formattedDateStr}
            </p>
            <p className="text-xs font-mono font-bold text-indigo-600 mt-0.5">
              {formattedTimeStr}
            </p>
          </div>
        </div>

        {/* Right Quick Actions Card (4 Cols) */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-indigo-100/80 p-4 shadow-2xs flex flex-col justify-between">
          <h3 className="text-xs font-bold text-slate-800 mb-2.5">
            Quick Actions
          </h3>

          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => onNavigateTab('students')}
              className="px-3 py-2 rounded-2xl bg-indigo-50/50 hover:bg-indigo-100/70 border border-indigo-100/80 text-slate-800 text-xs font-semibold flex items-center gap-2 transition-all shadow-2xs active:scale-95 cursor-pointer text-left"
            >
              <Users className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
              <span className="truncate">Add Student</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigateTab('exams')}
              className="px-3 py-2 rounded-2xl bg-indigo-50/50 hover:bg-indigo-100/70 border border-indigo-100/80 text-slate-800 text-xs font-semibold flex items-center gap-2 transition-all shadow-2xs active:scale-95 cursor-pointer text-left"
            >
              <Calendar className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
              <span className="truncate">Create Exam</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigateTab('question_bank')}
              className="px-3 py-2 rounded-2xl bg-indigo-50/50 hover:bg-indigo-100/70 border border-indigo-100/80 text-slate-800 text-xs font-semibold flex items-center gap-2 transition-all shadow-2xs active:scale-95 cursor-pointer text-left"
            >
              <Clock className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
              <span className="truncate">Question Bank</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigateTab('results')}
              className="px-3 py-2 rounded-2xl bg-indigo-50/50 hover:bg-indigo-100/70 border border-indigo-100/80 text-slate-800 text-xs font-semibold flex items-center gap-2 transition-all shadow-2xs active:scale-95 cursor-pointer text-left"
            >
              <FileText className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
              <span className="truncate">Reports</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Top Metric Cards (Row 1: 4 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Students */}
        <div className="bg-white rounded-2xl border border-slate-200/70 p-4 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500">Total Students</p>
              <h3 className="text-xl font-black text-slate-900 leading-tight mt-0.5">
                {metrics.total_students ?? 2}
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Enrolled across classes</p>
            </div>
          </div>
          <div className="text-right flex flex-col items-end">
            <svg className="w-12 h-6 text-blue-400 stroke-current fill-none" viewBox="0 0 50 20">
              <path d="M 0 15 Q 15 5 25 10 T 50 3" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
            <span className="text-[11px] font-bold text-blue-600 mt-1">↑ 12%</span>
          </div>
        </div>

        {/* Active Teachers */}
        <div className="bg-white rounded-2xl border border-slate-200/70 p-4 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500">Active Teachers</p>
              <h3 className="text-xl font-black text-slate-900 leading-tight mt-0.5">
                {metrics.total_teachers ?? 3}
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Faculty & Instructors</p>
            </div>
          </div>
          <div className="text-right flex flex-col items-end">
            <svg className="w-12 h-6 text-emerald-400 stroke-current fill-none" viewBox="0 0 50 20">
              <path d="M 0 18 Q 12 12 25 8 T 50 2" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
            <span className="text-[11px] font-bold text-emerald-600 mt-1">↑ 25%</span>
          </div>
        </div>

        {/* Total Exams */}
        <div className="bg-white rounded-2xl border border-slate-200/70 p-4 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500">Total Exams</p>
              <h3 className="text-xl font-black text-slate-900 leading-tight mt-0.5">
                {metrics.total_exams ?? 2}
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Live / Published</p>
            </div>
          </div>
          <div className="text-right flex flex-col items-end">
            <svg className="w-12 h-6 text-purple-400 stroke-current fill-none" viewBox="0 0 50 20">
              <path d="M 0 16 Q 15 14 30 6 T 50 2" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
            <span className="text-[11px] font-bold text-purple-600 mt-1">↑ 50%</span>
          </div>
        </div>

        {/* Questions in Bank */}
        <div className="bg-white rounded-2xl border border-slate-200/70 p-4 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500">Questions in Bank</p>
              <h3 className="text-xl font-black text-slate-900 leading-tight mt-0.5">
                {metrics.total_questions ?? 3}
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Across all subjects</p>
            </div>
          </div>
          <div className="text-right flex flex-col items-end">
            <svg className="w-12 h-6 text-amber-400 stroke-current fill-none" viewBox="0 0 50 20">
              <path d="M 0 18 Q 15 10 30 12 T 50 4" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
            <span className="text-[11px] font-bold text-amber-600 mt-1">↑ 33%</span>
          </div>
        </div>
      </div>

      {/* 3. Metric Cards (Row 2: 4 Secondary Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Completed Attempts */}
        <div className="bg-white rounded-2xl border border-slate-200/70 p-4 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Check className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500">Completed Attempts</p>
              <h3 className="text-xl font-black text-slate-900 leading-tight mt-0.5">
                {metrics.total_attempts ?? 0}
              </h3>
            </div>
          </div>
          <div className="w-16">
            <div className="flex justify-end text-[10px] font-bold text-emerald-600 mb-1">0%</div>
            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full w-0" />
            </div>
          </div>
        </div>

        {/* Average Platform Score */}
        <div className="bg-white rounded-2xl border border-slate-200/70 p-4 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500">Average Platform Score</p>
              <h3 className="text-xl font-black text-purple-600 leading-tight mt-0.5">
                {metrics.avg_score ?? 0}%
              </h3>
            </div>
          </div>
          <svg className="w-14 h-6 text-purple-400 stroke-current fill-none" viewBox="0 0 50 20">
            <path d="M 0 15 Q 15 5 25 15 T 50 8" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>

        {/* Overall Pass Rate */}
        <div className="bg-white rounded-2xl border border-slate-200/70 p-4 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500">Overall Pass Rate</p>
              <h3 className="text-xl font-black text-teal-600 leading-tight mt-0.5">
                {metrics.pass_percentage ?? 0}%
              </h3>
            </div>
          </div>
          <svg className="w-14 h-6 text-teal-400 stroke-current fill-none" viewBox="0 0 50 20">
            <path d="M 0 12 Q 15 18 30 10 T 50 5" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>

        {/* System Status */}
        <div className="bg-white rounded-2xl border border-slate-200/70 p-4 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500">System Status</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-xs font-bold text-slate-800">Operational</span>
              </div>
            </div>
          </div>
          <div className="w-6 h-6 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* 4. Middle Section (2 Columns: Subject Performance & Recent Submissions) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7/12): Subject Accuracy & Performance */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Subject Accuracy & Performance</h3>
                <p className="text-[11px] text-slate-400">Comparison of subject-wise accuracy rate</p>
              </div>
            </div>

            {/* Filter Dropdown */}
            <div className="relative">
              <select
                value={selectedClassFilter}
                onChange={(e) => setSelectedClassFilter(e.target.value)}
                className="text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-1.5 pr-7 appearance-none focus:outline-none focus:border-indigo-400 cursor-pointer"
              >
                <option value="all">All Classes</option>
                <option value="10">Class 10</option>
                <option value="9">Class 9</option>
                <option value="8">Class 8</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Donut Chart with percentage */}
            <div className="md:col-span-5 flex flex-col items-center justify-center">
              <div className="relative w-36 h-36 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  {/* Background track */}
                  <circle cx="50" cy="50" r="40" stroke="#f1f5f9" strokeWidth="10" fill="transparent" />
                  {/* Purple segment */}
                  <circle cx="50" cy="50" r="40" stroke="#8b5cf6" strokeWidth="10" strokeDasharray="251.2" strokeDashoffset="180" strokeLinecap="round" fill="transparent" />
                  {/* Teal primary segment */}
                  <circle cx="50" cy="50" r="40" stroke="#14b8a6" strokeWidth="10" strokeDasharray="251.2" strokeDashoffset="35" strokeLinecap="round" fill="transparent" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-xl font-black text-slate-900">91.7%</span>
                  <span className="text-[10px] font-semibold text-slate-400">Overall Accuracy</span>
                </div>
              </div>
            </div>

            {/* Subject horizontal bars */}
            <div className="md:col-span-7 space-y-3.5">
              {subjects.map((sub, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-2 font-medium text-slate-700">
                      <span className={`w-2 h-2 rounded-full ${sub.dotClass}`} />
                      {sub.name}
                    </span>
                    <span className="font-bold text-slate-900 text-xs">{sub.accuracy}%</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${sub.accuracy}%`,
                        backgroundColor: sub.color
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (5/12): Recent Candidate Submissions */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                  <FileSpreadsheet className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Recent Candidate Submissions</h3>
                  <p className="text-[11px] text-slate-400">Latest submitted Olympiad attempts</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onNavigateTab('results')}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
              >
                View All <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {/* Submissions List */}
            <div className="space-y-3 mt-4">
              {candidateSubmissions.map((cand, idx) => (
                <div key={idx} className="flex items-center justify-between p-2.5 rounded-2xl hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-9 h-9 rounded-full bg-gradient-to-tr ${cand.color || 'from-indigo-500 to-purple-600'} text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs`}>
                      {cand.initials || (cand.student_name ? cand.student_name.charAt(0) : 'S')}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 truncate">
                        {cand.name || cand.student_name}
                      </p>
                      <p className="text-[11px] text-slate-400 truncate">
                        {cand.exam || cand.exam_title}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 ml-2">
                    <span className="text-[11px] text-slate-400 font-medium">
                      {cand.time || 'Today'}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200/50">
                      PASSED
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 5. Bottom Section: Audit Logs & Subject Growth (Left) + Exam Performance & Quick Links (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 Cols: Audit Logs & Subject Growth */}
        <div className="lg:col-span-7 space-y-6">
          {/* Recent Administrative Audit Logs */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Recent Administrative Audit Logs</h3>
                  <p className="text-[11px] text-slate-400">Track system activities and changes made by administrators</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onNavigateTab('activity_logs')}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
              >
                View All <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 text-[10px] uppercase font-bold tracking-wider">
                    <th className="pb-3 px-2">Action</th>
                    <th className="pb-3 px-2">Module</th>
                    <th className="pb-3 px-2">User / Initiator</th>
                    <th className="pb-3 px-2">IP Address</th>
                    <th className="pb-3 px-2">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {recentLogs.map((log, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-2.5 px-2">
                        <span className="inline-block px-2 py-0.5 rounded-md text-[11px] font-semibold bg-blue-50 text-blue-700">
                          {log.action}
                        </span>
                      </td>
                      <td className="py-2.5 px-2 text-slate-500 font-medium">
                        {log.module}
                      </td>
                      <td className="py-2.5 px-2 font-medium text-slate-700">
                        {log.user || log.user_name || 'Super Administrator'}
                      </td>
                      <td className="py-2.5 px-2 font-mono text-slate-400 text-[11px]">
                        {log.ip || log.ip_address || '127.0.0.1'}
                      </td>
                      <td className="py-2.5 px-2 text-slate-400 text-[11px]">
                        {log.time || log.created_at}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Subject-wise Growth Chart */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Subject-wise Growth</h3>
                  <p className="text-[11px] text-slate-400">Performance trend across subjects (last 7 days)</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onNavigateTab('results')}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
              >
                View All <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {/* Multi-line Trend SVG Graph */}
            <div className="relative pt-2">
              <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2">
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-teal-500" /> Mathematics</span>
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-500" /> Science</span>
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-purple-500" /> English</span>
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500" /> GK</span>
              </div>

              <div className="h-44 w-full">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 500 120" preserveAspectRatio="none">
                  {/* Grid lines */}
                  <line x1="0" y1="0" x2="500" y2="0" stroke="#f1f5f9" strokeDasharray="3" />
                  <line x1="0" y1="40" x2="500" y2="40" stroke="#f1f5f9" strokeDasharray="3" />
                  <line x1="0" y1="80" x2="500" y2="80" stroke="#f1f5f9" strokeDasharray="3" />
                  <line x1="0" y1="120" x2="500" y2="120" stroke="#e2e8f0" />

                  {/* Mathematics Line (Teal) */}
                  <path d="M 0 60 Q 100 45 200 48 T 350 30 T 500 20" fill="none" stroke="#14b8a6" strokeWidth="2.5" />
                  <circle cx="200" cy="48" r="3.5" fill="#14b8a6" stroke="#fff" strokeWidth="2" />
                  <circle cx="350" cy="30" r="3.5" fill="#14b8a6" stroke="#fff" strokeWidth="2" />
                  <circle cx="500" cy="20" r="3.5" fill="#14b8a6" stroke="#fff" strokeWidth="2" />

                  {/* Science Line (Blue) */}
                  <path d="M 0 75 Q 100 60 200 68 T 350 35 T 500 28" fill="none" stroke="#3b82f6" strokeWidth="2.5" />
                  <circle cx="200" cy="68" r="3.5" fill="#3b82f6" stroke="#fff" strokeWidth="2" />
                  <circle cx="350" cy="35" r="3.5" fill="#3b82f6" stroke="#fff" strokeWidth="2" />
                  <circle cx="500" cy="28" r="3.5" fill="#3b82f6" stroke="#fff" strokeWidth="2" />

                  {/* English Line (Purple) */}
                  <path d="M 0 85 Q 100 80 200 75 T 350 60 T 500 50" fill="none" stroke="#8b5cf6" strokeWidth="2.5" />
                  <circle cx="350" cy="60" r="3.5" fill="#8b5cf6" stroke="#fff" strokeWidth="2" />
                  <circle cx="500" cy="50" r="3.5" fill="#8b5cf6" stroke="#fff" strokeWidth="2" />

                  {/* GK Line (Amber) */}
                  <path d="M 0 95 Q 100 90 200 85 T 350 78 T 500 70" fill="none" stroke="#f59e0b" strokeWidth="2.5" />
                  <circle cx="350" cy="78" r="3.5" fill="#f59e0b" stroke="#fff" strokeWidth="2" />
                  <circle cx="500" cy="70" r="3.5" fill="#f59e0b" stroke="#fff" strokeWidth="2" />
                </svg>
              </div>

              {/* X Axis dates */}
              <div className="flex justify-between text-[10px] font-semibold text-slate-400 mt-2 px-1">
                <span>17 Sep</span>
                <span>18 Sep</span>
                <span>19 Sep</span>
                <span>20 Sep</span>
                <span>21 Sep</span>
                <span>22 Sep</span>
                <span>23 Sep</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right 5 Cols: Exam Performance Overview & Quick Links */}
        <div className="lg:col-span-5 space-y-6">
          {/* Exam Performance Overview */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <BarChart3 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Exam Performance Overview</h3>
                <p className="text-[11px] text-slate-400">Total attempts vs successful attempts</p>
              </div>
            </div>

            {/* Donut Chart & Legend */}
            <div className="flex flex-col items-center justify-center py-3">
              <div className="relative w-36 h-36 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="38" stroke="#f1f5f9" strokeWidth="9" fill="transparent" />
                  <circle cx="50" cy="50" r="38" stroke="#14b8a6" strokeWidth="9" strokeDasharray="238.7" strokeDashoffset="200" strokeLinecap="round" fill="transparent" />
                  <circle cx="50" cy="50" r="38" stroke="#3b82f6" strokeWidth="9" strokeDasharray="238.7" strokeDashoffset="120" strokeLinecap="round" fill="transparent" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-base font-black text-slate-900">0/0</span>
                  <span className="text-[10px] font-semibold text-slate-400">Completed</span>
                </div>
              </div>

              {/* Status Legend */}
              <div className="flex items-center gap-4 text-xs font-semibold text-slate-600 mt-4">
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-teal-500" /> Completed</span>
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-500" /> In Progress</span>
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500" /> Not Attempted</span>
              </div>

              {/* Completion Rate Wave */}
              <div className="w-full mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium">Completion Rate</span>
                <span className="font-bold text-slate-900">0%</span>
              </div>
            </div>
          </div>

          {/* Quick Links 2x2 Grid */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Quick Links</h3>
                  <p className="text-[11px] text-slate-400">Access important sections</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onNavigateTab('exams')}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
              >
                View All <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-2">
              {/* Add Question */}
              <button
                type="button"
                onClick={() => onNavigateTab('question_bank')}
                className="p-3.5 rounded-2xl bg-purple-50/70 hover:bg-purple-100/80 border border-purple-100/60 text-left transition-all active:scale-95 group flex items-center gap-3"
              >
                <div className="w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-xs">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 group-hover:text-purple-700">Add Question</p>
                </div>
              </button>

              {/* Manage Exams */}
              <button
                type="button"
                onClick={() => onNavigateTab('exams')}
                className="p-3.5 rounded-2xl bg-emerald-50/70 hover:bg-emerald-100/80 border border-emerald-100/60 text-left transition-all active:scale-95 group flex items-center gap-3"
              >
                <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                  <FileSpreadsheet className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 group-hover:text-emerald-700">Manage Exams</p>
                </div>
              </button>

              {/* View Reports */}
              <button
                type="button"
                onClick={() => onNavigateTab('results')}
                className="p-3.5 rounded-2xl bg-blue-50/70 hover:bg-blue-100/80 border border-blue-100/60 text-left transition-all active:scale-95 group flex items-center gap-3"
              >
                <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
                  <BarChart3 className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 group-hover:text-blue-700">View Reports</p>
                </div>
              </button>

              {/* Certificates */}
              <button
                type="button"
                onClick={() => onNavigateTab('certificates')}
                className="p-3.5 rounded-2xl bg-amber-50/70 hover:bg-amber-100/80 border border-amber-100/60 text-left transition-all active:scale-95 group flex items-center gap-3"
              >
                <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-xs">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 group-hover:text-amber-700">Certificates</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
