import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { apiClient } from '../../api/client';
import {
  BookOpen,
  Award,
  Trophy,
  CheckCircle2,
  TrendingUp,
  Clock,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Zap,
  Play,
  HelpCircle,
  BarChart3,
  Calendar,
  FileText,
  Target,
  Download,
  Flame,
  Check,
  ChevronRight,
  ShieldCheck,
  Shield,
  Eye,
  AlertCircle,
  Lightbulb,
  Puzzle,
  Globe,
  Languages,
  Rocket,
  Layers,
  FileSpreadsheet,
  Atom,
  Calculator,
  Laptop,
  Brain,
  Search,
  RotateCcw,
  X,
  Filter,
  Users,
  ExternalLink,
  FileCheck2,
  Building2,
  Bookmark,
  Palette
} from 'lucide-react';

export const StudentOverview = ({ onNavigateTab, onStartExam, onViewResult }) => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [availableExams, setAvailableExams] = useState([]);
  const [examPapers, setExamPapers] = useState([]);
  const [selectedSubjectCover, setSelectedSubjectCover] = useState(null); // null = all covers, 'IGKO' = IGKO mock tests
  const [selectedPaperForInstructions, setSelectedPaperForInstructions] = useState(null);
  const [hasAgreedToRules, setHasAgreedToRules] = useState(true);
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(() => new Date());

  // Update clock once every minute to prevent constant re-renders
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const [dashRes, examsRes, certRes, papersRes] = await Promise.all([
        apiClient.get('/analytics/student').catch(() => ({ success: false })),
        apiClient.get('/exams/available').catch(() => ({ success: false })),
        apiClient.get('/certificates/my').catch(() => ({ success: false })),
        apiClient.get('/exam-papers').catch(() => ({ success: false }))
      ]);

      if (dashRes.success && dashRes.data) {
        setData(dashRes.data);
      }
      if (examsRes.success && examsRes.data) {
        setAvailableExams(examsRes.data);
      }
      if (certRes.success && certRes.data) {
        setCertificates(certRes.data);
      }
      if (papersRes && papersRes.success && Array.isArray(papersRes.data)) {
        setExamPapers(papersRes.data);
      }
    } catch (err) {
      console.error('Error fetching student dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  // Real-time All Students Test Results & Live Percentages State
  const [allStudentResults, setAllStudentResults] = useState([]);
  const [resultsLoading, setResultsLoading] = useState(false);
  const [resultsTab, setResultsTab] = useState('all_stream'); // 'all_stream' | 'weekly_leaderboard' | 'my_tests'
  const [selectedClassFilter, setSelectedClassFilter] = useState('ALL');
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState('ALL');
  const [resultSearchQuery, setResultSearchQuery] = useState('');

  const fetchResultsStream = async (showLoading = false) => {
    try {
      if (showLoading) setResultsLoading(true);
      const res = await apiClient.get('/results', {
        scope: 'all'
      });
      if (res.success && Array.isArray(res.data)) {
        setAllStudentResults(res.data);
      }
    } catch (e) {
      console.error('Error fetching student results stream:', e);
    } finally {
      if (showLoading) setResultsLoading(false);
    }
  };

  // Weekly Leaderboard State (Connected to real Admin high scores & percentages)
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [leaderboardClass, setLeaderboardClass] = useState('ALL');
  const [leaderboardSubject, setLeaderboardSubject] = useState('ALL');
  const [sortField, setSortField] = useState('percentage');
  const [sortAsc, setSortAsc] = useState(false);
  const [leaderboardLoading, setLeaderboardLoading] = useState(false);

  const fetchWeeklyLeaderboard = async (cls, subj) => {
    try {
      setLeaderboardLoading(true);
      const res = await apiClient.get('/leaderboard', {
        class_name: cls === 'ALL' ? '' : cls,
        subject: subj === 'ALL' ? '' : subj,
        limit: 20
      });
      if (res.success && Array.isArray(res.data)) {
        setLeaderboardData(res.data);
      }
    } catch (e) {
      console.error('Error fetching weekly leaderboard:', e);
    } finally {
      setLeaderboardLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
    fetchResultsStream(true);

    const handleExamSubmitted = () => {
      fetchDashboard();
      fetchResultsStream(false);
      fetchWeeklyLeaderboard(leaderboardClass, leaderboardSubject);
    };

    window.addEventListener('exam-submitted', handleExamSubmitted);
    window.addEventListener('olympiad-exam-submitted', handleExamSubmitted);

    // Silent background refresh without table flicker/collapse
    const pollInterval = setInterval(() => {
      fetchResultsStream(false);
    }, 10000);

    return () => {
      clearInterval(pollInterval);
      window.removeEventListener('exam-submitted', handleExamSubmitted);
      window.removeEventListener('olympiad-exam-submitted', handleExamSubmitted);
    };
  }, [leaderboardClass, leaderboardSubject]);

  useEffect(() => {
    fetchWeeklyLeaderboard(leaderboardClass, leaderboardSubject);
  }, [leaderboardClass, leaderboardSubject]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(field === 'name' || field === 'school');
    }
  };

  const sortedLeaderboard = useMemo(() => {
    const list = [...leaderboardData];
    list.sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];
      if (sortField === 'percentage') {
        valA = parseFloat(a.percentage_num || a.percentage || 0);
        valB = parseFloat(b.percentage_num || b.percentage || 0);
      }
      if (valA < valB) return sortAsc ? -1 : 1;
      if (valA > valB) return sortAsc ? 1 : -1;
      return 0;
    });
    return list;
  }, [leaderboardData, sortField, sortAsc]);

  // Filtered Student Results Stream
  const filteredStudentResults = useMemo(() => {
    return allStudentResults.filter((r) => {
      // 1. Class filter
      if (selectedClassFilter !== 'ALL') {
        const targetClass = selectedClassFilter.toLowerCase();
        const rClass = (r.class_name || '').toLowerCase();
        const rExam = (r.exam_title || '').toLowerCase();
        if (!rClass.includes(targetClass) && !rExam.includes(targetClass)) {
          return false;
        }
      }

      // 2. Subject filter
      if (selectedSubjectFilter !== 'ALL') {
        const targetSub = selectedSubjectFilter.toLowerCase();
        const rSub = (r.subject_name || '').toLowerCase();
        const rCode = (r.subject_code || '').toLowerCase();
        const rExam = (r.exam_title || '').toLowerCase();
        if (!rSub.includes(targetSub) && !rCode.includes(targetSub) && !rExam.includes(targetSub)) {
          return false;
        }
      }

      // 3. Search query
      if (resultSearchQuery.trim()) {
        const q = resultSearchQuery.toLowerCase();
        const matchName = (r.student_name || '').toLowerCase().includes(q);
        const matchLogin = (r.student_login_id || '').toLowerCase().includes(q);
        const matchExam = (r.exam_title || '').toLowerCase().includes(q);
        const matchSchool = (r.school_name || '').toLowerCase().includes(q);
        if (!matchName && !matchLogin && !matchExam && !matchSchool) return false;
      }

      return true;
    });
  }, [allStudentResults, selectedClassFilter, selectedSubjectFilter, resultSearchQuery]);

  const myTestResults = useMemo(() => {
    if (!user) return [];
    return allStudentResults.filter(r => r.student_id === user.id || (r.student_login_id && r.student_login_id === user.login_id));
  }, [allStudentResults, user]);

  // Time of day greeting
  const hour = currentTime.getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';

  const studentName = user?.full_name || 'Sandeep';

  const formattedDateStr = currentTime.toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-400 text-xs flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 border-3 border-[#3b82f6] border-t-transparent rounded-full animate-spin" />
        <span>Loading student learning portal...</span>
      </div>
    );
  }

  const studentClass = user?.class || user?.grade || 'Class 6';

  const ALL_SUBJECT_COVERS = useMemo(() => [
    {
      code: 'IGKO',
      title: 'IGKO (General Knowledge)',
      subtitle: 'General Knowledge & Current Affairs',
      icon: Globe,
      color: '#859900',
      iconBg: 'bg-amber-50 border-amber-200 text-amber-600',
      seriesTitle: `${studentClass}-All India IGKO Mock Test Series`
    },
    {
      code: 'ISO',
      altCode: 'NSO',
      title: 'ISO / NSO (Science)',
      subtitle: 'Science & Practical Discovery',
      icon: Atom,
      color: '#059669',
      iconBg: 'bg-emerald-50 border-emerald-200 text-emerald-600',
      seriesTitle: `${studentClass}-All India ISO Mock Test Series`
    },
    {
      code: 'IMO',
      title: 'IMO (Mathematics)',
      subtitle: 'Mathematics & Logical Analysis',
      icon: Calculator,
      color: '#d97706',
      iconBg: 'bg-blue-50 border-blue-200 text-blue-600',
      seriesTitle: `${studentClass}-All India IMO Mock Test Series`
    },
    {
      code: 'IEO',
      title: 'IEO (English)',
      subtitle: 'English Grammar & Vocabulary',
      icon: BookOpen,
      color: '#ea580c',
      iconBg: 'bg-purple-50 border-purple-200 text-purple-600',
      seriesTitle: `${studentClass}-All India IEO Mock Test Series`
    },
    {
      code: 'ICSO',
      altCode: 'ICO',
      title: 'ICSO (Cyber & AI)',
      subtitle: 'Cyber Safety, Coding & IT',
      icon: Laptop,
      color: '#0284c7',
      iconBg: 'bg-sky-50 border-sky-200 text-sky-600',
      seriesTitle: `${studentClass}-All India ICSO Mock Test Series`
    },
    {
      code: 'ISSO',
      altCode: 'LRO',
      title: 'ISSO / LRO (Reasoning)',
      subtitle: 'Logical Reasoning & Social Aptitude',
      icon: Brain,
      color: '#7c3aed',
      iconBg: 'bg-rose-50 border-rose-200 text-rose-600',
      seriesTitle: `${studentClass}-All India ISSO Mock Test Series`
    },
    {
      code: 'VC',
      title: 'VC (Vocabulary)',
      subtitle: 'Vocabulary Champions Olympiad',
      icon: Sparkles,
      color: '#6d3a68',
      iconBg: 'bg-pink-50 border-pink-200 text-pink-600',
      seriesTitle: `${studentClass}-All India VC Mock Test Series`
    },
    {
      code: 'EGO',
      title: 'EGO (Environment)',
      subtitle: 'Environment & Green Olympiad',
      icon: Atom,
      color: '#059669',
      iconBg: 'bg-teal-50 border-teal-200 text-teal-600',
      seriesTitle: `${studentClass}-All India EGO Mock Test Series`
    },
    {
      code: 'CAO',
      title: 'CAO (Creative Arts)',
      subtitle: 'Creative Arts & Aesthetic Design',
      icon: Palette,
      color: '#80497D',
      iconBg: 'bg-violet-50 border-violet-200 text-violet-600',
      seriesTitle: `${studentClass}-All India CAO Mock Test Series`
    }
  ], [studentClass]);

  const getSubjectPapers = (subCode, altCode) => {
    const matching = examPapers.filter((p) => {
      const pSub = (p.subject_code || '').toUpperCase();
      const codeMatches = pSub === subCode || (altCode && pSub === altCode);
      const classMatches = !p.class_name || p.class_name === studentClass || p.class_name === 'All';
      return codeMatches && classMatches;
    });

    if (matching.length > 0) return matching;

    return [
      {
        id: `mock_${subCode.toLowerCase()}_prev`,
        title: `${studentClass} ${subCode} Previous Year Paper 2019`,
        short_code: `${subCode} - 2019`,
        subject_code: subCode,
        class_name: studentClass,
        duration_minutes: 60,
        total_marks: 60,
        cutoff_marks: 42,
        status: 'published'
      },
      {
        id: `mock_${subCode.toLowerCase()}_sample`,
        title: `${studentClass} ${subCode} Official Sample Paper 2026`,
        short_code: `${subCode} - Sample 2026`,
        subject_code: subCode,
        class_name: studentClass,
        duration_minutes: 60,
        total_marks: 60,
        cutoff_marks: 42,
        status: 'published'
      },
      {
        id: `mock_${subCode.toLowerCase()}_1`,
        title: `${subCode} Level-1 Mock Test 1 ${studentClass}`,
        short_code: `${subCode} - Mock 1`,
        subject_code: subCode,
        class_name: studentClass,
        duration_minutes: 60,
        total_marks: 60,
        cutoff_marks: 42,
        status: 'published'
      },
      {
        id: `mock_${subCode.toLowerCase()}_2`,
        title: `${subCode} Level-1 Mock Test 2 ${studentClass}`,
        short_code: `${subCode} - Mock 2`,
        subject_code: subCode,
        class_name: studentClass,
        duration_minutes: 60,
        total_marks: 60,
        cutoff_marks: 45,
        status: 'published'
      }
    ];
  };

  if (selectedPaperForInstructions) {
    const paper = selectedPaperForInstructions;
    return (
      <div className="space-y-6 pb-16 font-sans max-w-4xl mx-auto animate-in fade-in duration-200">
        {/* Top Navigation */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setSelectedPaperForInstructions(null)}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-[#859900] px-3.5 py-2 rounded-xl bg-white border border-slate-200 shadow-2xs hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>← Back to Mock Tests List</span>
          </button>
          <span className="text-xs font-bold text-slate-400">Pre-Examination Verification</span>
        </div>

        {/* 1. Exam Hero Overview Card */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 pb-6 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2.5 mb-2">
                <span className="text-[10px] font-bold text-[#859900] bg-[#859900]/10 px-2.5 py-0.5 rounded-full border border-[#859900]/30 uppercase tracking-wider">
                  {paper.subject_code || 'OLYMPIAD'}
                </span>
                <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-md">
                  {paper.short_code || paper.subject_code}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {paper.title}
              </h1>
              <p className="text-xs text-slate-500 mt-2">
                All India National Ranking Mock Test with Instant Analysis &amp; Answer Keys.
              </p>
            </div>

            <div className="shrink-0 text-left sm:text-right">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Live Mock Test Ready
              </span>
            </div>
          </div>

          {/* 4 Metric Highlights Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 pt-6 text-center text-xs">
            <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">Duration</span>
              <h4 className="text-lg font-black text-slate-900 mt-1">{paper.duration_minutes || 60} Minutes</h4>
              <p className="text-[10px] text-slate-400 mt-0.5">Automated timer</p>
            </div>

            <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">Questions</span>
              <h4 className="text-lg font-black text-[#859900] mt-1">{paper.questions?.length || 5} MCQs</h4>
              <p className="text-[10px] text-slate-400 mt-0.5">Single correct</p>
            </div>

            <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">Total Marks</span>
              <h4 className="text-lg font-black text-slate-900 mt-1">{paper.total_marks || 60}</h4>
              <p className="text-[10px] text-slate-400 mt-0.5">Max Score</p>
            </div>

            <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">Target Cutoff</span>
              <h4 className="text-lg font-black text-emerald-600 mt-1">{paper.cutoff_marks || 42} Marks</h4>
              <p className="text-[10px] text-slate-400 mt-0.5">Benchmark cutoff</p>
            </div>
          </div>
        </div>

        {/* 2. Important Guidelines & Examination Rules Card */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-black">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Important Examination Rules</h3>
              <p className="text-[11px] text-slate-400">Please review carefully before starting your timer</p>
            </div>
          </div>

          <div className="space-y-2.5 text-xs text-slate-600 bg-slate-50/80 p-4 rounded-2xl border border-slate-100">
            <p className="flex items-start gap-2">
              <span className="font-bold text-[#859900]">1.</span>
              <span>The timer will begin immediately when you click <strong>Start Mock Test Now</strong>.</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="font-bold text-[#859900]">2.</span>
              <span>Each correct answer awards 1 mark. There is no negative marking for unattempted questions.</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="font-bold text-[#859900]">3.</span>
              <span>You can mark questions for review and navigate freely between questions.</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="font-bold text-[#859900]">4.</span>
              <span>Upon submission, your score, accuracy %, percentile rank, and detailed answers will be generated instantly.</span>
            </p>
          </div>

          <div className="pt-2 flex items-center gap-3">
            <input
              type="checkbox"
              id="agreeCheck"
              checked={hasAgreedToRules}
              onChange={(e) => setHasAgreedToRules(e.target.checked)}
              className="w-4 h-4 text-[#859900] rounded focus:ring-[#859900] cursor-pointer"
            />
            <label htmlFor="agreeCheck" className="text-xs font-bold text-slate-700 cursor-pointer select-none">
              I have read and understood all the mock test instructions.
            </label>
          </div>
        </div>

        {/* 3. Bottom Launch Action */}
        <div className="flex items-center justify-between p-4 bg-white rounded-3xl border border-slate-200 shadow-xs">
          <button
            type="button"
            onClick={() => setSelectedPaperForInstructions(null)}
            className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer transition-all"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!hasAgreedToRules}
            onClick={() => {
              const pId = paper.id;
              setSelectedPaperForInstructions(null);
              if (onStartExam) {
                onStartExam(pId);
              }
            }}
            className="px-7 py-3 rounded-2xl bg-[#859900] hover:bg-[#738400] text-white font-black text-xs sm:text-sm shadow-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 active:scale-95 transition-all"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Start Mock Test Now →</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-14 font-sans w-full max-w-full overflow-x-hidden">
      
      {/* ========================================================================= */}
      {/* 1. HERO GREETING BANNER (Exact Design with Stacked Books & Cup)           */}
      {/* ========================================================================= */}
      <div className="bg-gradient-to-r from-[#faf6fa] via-white to-[#fdf7f5] border border-[#ebd7eb] rounded-3xl p-5 sm:p-6 md:p-7 shadow-xs relative overflow-hidden">
        {/* Soft Decorative Glow Circles */}
        <div className="absolute top-0 right-1/4 w-48 h-48 bg-[#ebd7eb]/40 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-10 w-40 h-40 bg-[#f6d6cc]/40 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          {/* Left Content */}
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-start gap-3.5">
              {/* Waving Hand Circular Badge */}
              <div className="w-11 h-11 rounded-2xl bg-white/90 border border-[#ebd7eb] shadow-2xs flex items-center justify-center text-2xl shrink-0 mt-0.5">
                👋
              </div>
              <div>
                <p className="text-xs sm:text-sm font-semibold text-slate-500">
                  Welcome Back,
                </p>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 tracking-tight mt-0.5">
                  {greeting}, <span className="text-[#80497D] capitalize">{studentName}</span>!
                </h1>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 font-medium pl-0.5">
              Keep learning, keep growing. Your next big achievement is near!
            </p>

            {/* Bottom Row: Date Pill */}
            <div className="pt-1 flex items-center flex-wrap gap-3">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#f4eaf4] border border-[#ebd7eb] rounded-xl text-xs font-bold text-[#80497D] shadow-2xs">
                <Calendar className="w-3.5 h-3.5 text-[#80497D]" />
                <span>Today: {formattedDateStr}</span>
              </div>
            </div>
          </div>

          {/* Right Content: Vector Illustration of Stacked Books with Tea Cup & Plant + Scholar Star Badge */}
          <div className="shrink-0 flex items-center justify-center md:justify-end gap-4">
            {/* Scholar Star Tier Badge Card */}
            <div className="hidden lg:flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-white/95 border border-[#f6d6cc] shadow-2xs">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#C35B3F] to-[#b04c31] text-white flex items-center justify-center shadow-2xs">
                <Trophy className="w-5 h-5 fill-amber-100 text-[#fdf7f5]" />
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-black uppercase tracking-wider text-[#422240]">
                  Scholar Star
                </span>
                <span className="text-[9px] text-[#C35B3F] font-semibold">Active Tier</span>
              </div>
            </div>

            {/* Flat Vector Stacked Books & Cheerful Cup SVG Illustration */}
            <div className="relative w-36 h-28 sm:w-44 sm:h-32 shrink-0">
              <svg viewBox="0 0 200 160" className="w-full h-full drop-shadow-sm" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Small Potted Plant (Left) */}
                <ellipse cx="42" cy="142" rx="20" ry="6" fill="#cbd5e1" opacity="0.4" />
                {/* Pot */}
                <path d="M 32 120 L 52 120 L 49 142 L 35 142 Z" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="2" />
                {/* Leaves */}
                <path d="M 42 120 C 30 105, 22 108, 25 95 C 38 95, 42 110, 42 120 Z" fill="#2dd4bf" />
                <path d="M 42 120 C 46 100, 60 90, 62 80 C 68 95, 54 112, 42 120 Z" fill="#10b981" />
                <path d="M 42 115 C 34 85, 48 70, 52 65 C 56 80, 50 102, 42 115 Z" fill="#059669" />

                {/* Ground Shadow under Books */}
                <ellipse cx="120" cy="148" rx="60" ry="8" fill="#cbd5e1" opacity="0.45" />

                {/* Bottom Book (Green) */}
                <rect x="68" y="122" width="105" height="22" rx="5" fill="#059669" />
                <rect x="74" y="124" width="97" height="18" rx="3" fill="#ffffff" />
                <path d="M 68 122 Q 65 133 68 144 L 75 144 Q 72 133 75 122 Z" fill="#047857" />
                <line x1="78" y1="129" x2="165" y2="129" stroke="#e2e8f0" strokeWidth="1.5" />
                <line x1="78" y1="134" x2="165" y2="134" stroke="#e2e8f0" strokeWidth="1.5" />
                <line x1="78" y1="139" x2="165" y2="139" stroke="#e2e8f0" strokeWidth="1.5" />

                {/* Middle Book (Orange / Yellow) */}
                <rect x="72" y="98" width="98" height="22" rx="5" fill="#f59e0b" />
                <rect x="78" y="100" width="90" height="18" rx="3" fill="#ffffff" />
                <path d="M 72 98 Q 69 109 72 120 L 79 120 Q 76 109 79 98 Z" fill="#d97706" />
                <line x1="82" y1="105" x2="162" y2="105" stroke="#e2e8f0" strokeWidth="1.5" />
                <line x1="82" y1="110" x2="162" y2="110" stroke="#e2e8f0" strokeWidth="1.5" />
                <line x1="82" y1="115" x2="162" y2="115" stroke="#e2e8f0" strokeWidth="1.5" />

                {/* Top Book (Blue) */}
                <rect x="76" y="74" width="92" height="22" rx="5" fill="#2563eb" />
                <rect x="82" y="76" width="84" height="18" rx="3" fill="#ffffff" />
                <path d="M 76 74 Q 73 85 76 96 L 83 96 Q 80 85 83 74 Z" fill="#1d4ed8" />
                <line x1="86" y1="81" x2="160" y2="81" stroke="#e2e8f0" strokeWidth="1.5" />
                <line x1="86" y1="86" x2="160" y2="86" stroke="#e2e8f0" strokeWidth="1.5" />
                <line x1="86" y1="91" x2="160" y2="91" stroke="#e2e8f0" strokeWidth="1.5" />

                {/* Yellow Coffee/Tea Cup on Top */}
                <path d="M 108 52 C 108 68, 138 68, 138 52 L 138 50 L 108 50 Z" fill="#fbbf24" stroke="#f59e0b" strokeWidth="2" />
                {/* Cup Rim */}
                <ellipse cx="123" cy="50" rx="15" ry="4" fill="#fde68a" stroke="#f59e0b" strokeWidth="1.5" />
                <ellipse cx="123" cy="50" rx="12" ry="2.5" fill="#d97706" opacity="0.6" />
                {/* Cup Handle */}
                <path d="M 137 54 C 146 54, 146 64, 136 65" fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" />
                {/* Heart Symbol on Cup */}
                <path d="M 123 58 C 121 55, 117 56, 117 59 C 117 63, 123 66, 123 66 C 123 66, 129 63, 129 59 C 129 56, 125 55, 123 58 Z" fill="#ffffff" />

                {/* Steam & Sparkles */}
                <circle cx="95" cy="45" r="2.5" fill="#fde047" />
                <circle cx="152" cy="42" r="3" fill="#fde047" />
                <path d="M 112 36 Q 110 30 114 24" stroke="#fde047" strokeWidth="2" strokeLinecap="round" />
                <path d="M 124 33 Q 126 26 123 20" stroke="#fde047" strokeWidth="2" strokeLinecap="round" />
                <path d="M 134 38 Q 138 31 135 25" stroke="#fde047" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. SECTION: OLYMPIAD SUBJECT COVERS & MOCK TEST SERIES (User Design)       */}
      {/* ========================================================================= */}
      <div className="space-y-4 pt-2">
        {selectedSubjectCover ? (
          /* LEVEL 2: SPECIFIC SUBJECT MOCK TEST SERIES (Matches user uploaded image) */
          (() => {
            const currentSub = ALL_SUBJECT_COVERS.find(s => s.code === selectedSubjectCover) || ALL_SUBJECT_COVERS[0];
            const subjectPapers = getSubjectPapers(currentSub.code, currentSub.altCode);

            return (
              <div className="space-y-5 animate-in fade-in duration-200">
                {/* Back to All Covers Navigation */}
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedSubjectCover(null)}
                    className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-[#859900] px-4 py-2 rounded-xl bg-white border border-slate-200 shadow-2xs hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>← Back to All Subject Covers</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-500">
                      Switch Subject:
                    </span>
                    <select
                      value={selectedSubjectCover}
                      onChange={(e) => setSelectedSubjectCover(e.target.value)}
                      className="text-xs font-bold bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-slate-700 focus:outline-none focus:border-[#859900]"
                    >
                      {ALL_SUBJECT_COVERS.map(s => (
                        <option key={s.code} value={s.code}>{s.code} - {s.title}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Series Banner matching user image */}
                <div className="bg-[#859900] rounded-2xl p-5 sm:p-6 text-white shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-white/20 text-white text-xs font-extrabold uppercase tracking-wider backdrop-blur-xs">
                      <span>{studentClass} Mock Test Series</span>
                      <span>•</span>
                      <span>{subjectPapers.length} Mock Tests Available</span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                      {currentSub.seriesTitle}
                    </h2>
                    <p className="text-xs sm:text-sm text-lime-100 font-medium">
                      National Ranking Mock Tests with Instant Analysis, Answer Keys &amp; Detailed Solutions
                    </p>
                  </div>

                  <div className="shrink-0 bg-white/10 rounded-xl p-3 border border-white/20 hidden sm:block">
                    <currentSub.icon className="w-10 h-10 text-white" />
                  </div>
                </div>

                {/* Mock Tests Cards Grid (Exact design from user's image) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                  {subjectPapers.map((paper) => {
                    const result = myTestResults.find(
                      r => (r.exam_id && (r.exam_id === paper.id || String(r.exam_id) === String(paper.id))) ||
                           (r.exam_title && r.exam_title.toLowerCase() === paper.title.toLowerCase())
                    );
                    const isCompleted = !!result;

                    return (
                      <div
                        key={paper.id}
                        className="bg-white rounded-2xl border-2 border-slate-200 shadow-sm hover:shadow-md hover:border-[#859900] transition-all overflow-hidden flex flex-col justify-between"
                      >
                        {/* Top Olive Green Header */}
                        <div className="bg-[#859900] text-white p-3.5 sm:p-4 text-center min-h-[72px] flex items-center justify-center">
                          <h4 className="font-bold text-xs sm:text-sm leading-snug">
                            {paper.title}
                          </h4>
                        </div>

                        {/* Card Body */}
                        <div className="p-4 space-y-3">
                          {/* Row 1: Status */}
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-bold text-slate-700">Status:</span>
                            {isCompleted ? (
                              <span className="px-2.5 py-0.5 rounded bg-emerald-600 text-white text-[11px] font-black uppercase tracking-wider">
                                COMPLETED
                              </span>
                            ) : (
                              <span className="px-2.5 py-0.5 rounded bg-[#d9534f] text-white text-[11px] font-black uppercase tracking-wider">
                                UNATTEMPTED
                              </span>
                            )}
                          </div>

                          {/* Row 2: Last Score */}
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-bold text-slate-700">Last Score:</span>
                            {isCompleted ? (
                              <span className="px-2.5 py-0.5 rounded bg-[#8cb82b] text-white text-[11px] font-black">
                                {result.score} / {result.total_marks || paper.total_marks || 60} ({Math.round(result.percentage || 0)}%)
                              </span>
                            ) : (
                              <span className="px-2.5 py-0.5 rounded bg-[#8cb82b] text-white text-[11px] font-black">
                                none
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Card Footer: OPEN Button */}
                        <div className="p-4 pt-0">
                          <button
                            type="button"
                            onClick={() => setSelectedPaperForInstructions(paper)}
                            className="w-full py-2.5 bg-[#859900] hover:bg-[#738400] text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-xs hover:shadow flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
                          >
                            <span>OPEN</span>
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })()
        ) : (
          /* LEVEL 1: ALL SUBJECT COVERS (9 Olympiad Subjects with Mock Tests Count) */
          <div className="space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
                  <BookOpen className="w-6 h-6 text-[#859900]" />
                  <span>Olympiad Subject Series &amp; Mock Tests</span>
                </h2>
                <p className="text-xs text-slate-500 font-semibold mt-0.5">
                  Select any Olympiad subject cover below to view all official mock tests, previous year papers &amp; sample tests.
                </p>
              </div>
            </div>

            {/* Grid of Subject Covers */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 w-full">
              {ALL_SUBJECT_COVERS.map((sub) => {
                const subPapers = getSubjectPapers(sub.code, sub.altCode);
                const SubIcon = sub.icon;

                return (
                  <div
                    key={sub.code}
                    onClick={() => setSelectedSubjectCover(sub.code)}
                    className="bg-white rounded-3xl border-2 border-slate-200/90 hover:border-[#859900] p-5 sm:p-6 shadow-xs hover:shadow-xl transition-all duration-200 cursor-pointer flex flex-col justify-between group hover:-translate-y-1 relative overflow-hidden"
                  >
                    {/* Top Header */}
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className={`w-14 h-14 rounded-2xl border ${sub.iconBg} flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform shrink-0`}>
                        <SubIcon className="w-7 h-7" />
                      </div>
                      <span className="px-3 py-1 rounded-full bg-[#859900]/10 text-[#5e6d00] border border-[#859900]/20 text-[11px] font-black tracking-wide">
                        {subPapers.length} Mock Tests
                      </span>
                    </div>

                    {/* Subject Details */}
                    <div className="space-y-1.5 mb-5">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-extrabold text-[#859900] uppercase tracking-wider bg-lime-50 px-2 py-0.5 rounded">
                          {studentClass}
                        </span>
                        <span className="text-[11px] font-bold text-slate-400">
                          {sub.code}
                        </span>
                      </div>
                      <h3 className="font-black text-slate-900 text-base sm:text-lg tracking-tight group-hover:text-[#859900] transition-colors leading-snug">
                        {sub.title}
                      </h3>
                      <p className="text-xs text-slate-500 font-medium line-clamp-2">
                        {sub.subtitle}
                      </p>
                    </div>

                    {/* Action Button */}
                    <div className="w-full pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-black text-[#859900] group-hover:translate-x-0.5 transition-all">
                      <span>Open {sub.code} Mock Tests</span>
                      <div className="w-7 h-7 rounded-full bg-[#859900]/10 flex items-center justify-center text-[#859900] group-hover:bg-[#859900] group-hover:text-white transition-colors">
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 3. SECTION: TWO FEATURED BANNERS (Matches exact brand colors)               */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 pt-2">
        
        {/* Left Banner: Reasoning Online Classes */}
        <div className="bg-[#faf6fa] rounded-3xl border-2 border-[#ebd7eb] p-6 sm:p-7 shadow-xs hover:shadow-lg transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <div className="flex items-center gap-4 min-w-0">
            {/* Open Book with Bulb Vector Illustration */}
            <div className="w-16 h-16 rounded-2xl bg-white border border-[#ebd7eb] flex items-center justify-center shadow-xs shrink-0 text-[#80497D]">
              <div className="relative">
                <BookOpen className="w-8 h-8 text-[#80497D]" />
                <Lightbulb className="w-4 h-4 text-[#e7b84b] fill-[#e7b84b] absolute -top-1 -right-1" />
              </div>
            </div>

            <div className="min-w-0 space-y-1.5">
              <span className="inline-block px-3 py-1 rounded-lg bg-[#f4eaf4] text-[#80497D] text-[10px] font-black uppercase tracking-wider border border-[#ebd7eb]">
                FEATURED
              </span>
              <h3 className="text-sm sm:text-base font-black text-slate-900 leading-snug">
                Reasoning Online Classes for IMO, ISO(NSO) &amp; IEO
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
                Get expert guidance and improve your problem-solving skills.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onNavigateTab('my_classes')}
            className="w-full sm:w-auto px-6 py-3.5 bg-[#80497D] hover:bg-[#683965] text-white rounded-full text-xs sm:text-sm font-black uppercase tracking-wider transition-all shadow-md active:scale-95 cursor-pointer shrink-0 flex items-center justify-center gap-2"
          >
            <span>ENROLL NOW</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Right Banner: Olympiad Intelligent Test Generator Pro */}
        <div className="bg-[#fdf7f5] rounded-3xl border-2 border-[#f6d6cc] p-6 sm:p-7 shadow-xs hover:shadow-lg transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <div className="flex items-center gap-4 min-w-0">
            {/* Target & Checklist Illustration */}
            <div className="w-16 h-16 rounded-2xl bg-white border border-[#f6d6cc] flex items-center justify-center shadow-xs shrink-0 text-[#C35B3F]">
              <div className="relative">
                <FileSpreadsheet className="w-8 h-8 text-[#C35B3F]" />
                <Target className="w-4 h-4 text-[#dc2626] absolute -top-1 -right-1" />
              </div>
            </div>

            <div className="min-w-0 space-y-1.5">
              <span className="inline-block px-3 py-1 rounded-lg bg-[#fbeee9] text-[#C35B3F] text-[10px] font-black uppercase tracking-wider border border-[#f6d6cc]">
                PRO TOOL
              </span>
              <h3 className="text-sm sm:text-base font-black text-slate-900 leading-snug">
                Olympiad Intelligent Test Generator Pro
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
                Create your own Olympiad tests in seconds.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onNavigateTab('test_generator')}
            className="w-full sm:w-auto px-6 py-3.5 bg-[#C35B3F] hover:bg-[#b04c31] text-white rounded-full text-xs sm:text-sm font-black uppercase tracking-wider transition-all shadow-md active:scale-95 cursor-pointer shrink-0 flex items-center justify-center gap-2"
          >
            <span>TRY NOW</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 4. SECTION: FREE SAMPLE PAPERS & PREVIOUS YEAR PAPERS                       */}
      {/* ========================================================================= */}
      <div className="pt-2">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          
          {/* Card 1: Spotlight: IGKO Quiz */}
          <div className="bg-[#faf6fa] rounded-2xl border border-[#ebd7eb] p-4 sm:p-5 shadow-2xs hover:shadow-md transition-all flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-11 h-11 rounded-xl bg-[#f4eaf4] text-[#80497D] flex items-center justify-center shrink-0 shadow-2xs">
                <FileText className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h4 className="font-bold text-slate-900 text-xs sm:text-sm truncate">
                  Spotlight: IGKO Quiz
                </h4>
                <p className="text-[10px] text-slate-400 font-medium truncate mt-0.5">
                  Test your knowledge with latest questions.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onNavigateTab('free_quizzes')}
              className="px-4 py-1.5 bg-[#80497D] hover:bg-[#683965] text-white rounded-full text-xs font-bold transition-all shadow-xs active:scale-95 cursor-pointer shrink-0 flex items-center gap-1"
            >
              <span>Open</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* Card 2: Free Sample Papers */}
          <div className="bg-[#fdf7f5] rounded-2xl border border-[#f6d6cc] p-4 sm:p-5 shadow-2xs hover:shadow-md transition-all flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-11 h-11 rounded-xl bg-[#fbeee9] text-[#C35B3F] flex items-center justify-center shrink-0 shadow-2xs">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h4 className="font-bold text-slate-900 text-xs sm:text-sm truncate">
                  Free Sample Papers
                </h4>
                <p className="text-[10px] text-slate-400 font-medium truncate mt-0.5">
                  Download and practice sample papers.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onNavigateTab('free_sample_papers')}
              className="px-4 py-1.5 bg-[#C35B3F] hover:bg-[#b04c31] text-white rounded-full text-xs font-bold transition-all shadow-xs active:scale-95 cursor-pointer shrink-0 flex items-center gap-1"
            >
              <span>Open</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* Card 3: Free Previous Year Papers */}
          <div className="bg-[#faf6fa] rounded-2xl border border-[#ebd7eb] p-4 sm:p-5 shadow-2xs hover:shadow-md transition-all flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-11 h-11 rounded-xl bg-[#f4eaf4] text-[#80497D] flex items-center justify-center shrink-0 shadow-2xs">
                <Award className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h4 className="font-bold text-slate-900 text-xs sm:text-sm truncate">
                  Free Previous Year Papers
                </h4>
                <p className="text-[10px] text-slate-400 font-medium truncate mt-0.5">
                  Get past year papers with solutions.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onNavigateTab('free_past_papers')}
              className="px-4 py-1.5 bg-[#80497D] hover:bg-[#683965] text-white rounded-full text-xs font-bold transition-all shadow-xs active:scale-95 cursor-pointer shrink-0 flex items-center gap-1"
            >
              <span>Open</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* 5. SECTION: SKILL DEVELOPMENT PROGRAMS                                    */}
      {/* ========================================================================= */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Rocket className="w-5 h-5 text-[#f43f5e]" />
            <span>Skill Development Programs</span>
          </h2>

          <button
            type="button"
            onClick={() => onNavigateTab && onNavigateTab('prog_rsdp')}
            className="text-xs font-bold text-[#2563eb] hover:text-[#1d4ed8] hover:underline flex items-center gap-1 transition-colors cursor-pointer"
          >
            <span>View All Programs</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4 w-full">
          {[
            {
              id: 'prog_rsdp',
              title: 'Reasoning Skill Development',
              subtitle: 'Build a strong foundation with essential skills.',
              gradient: 'from-[#fb7185] via-[#f43f5e] to-[#e11d48]',
              icon: Brain
            },
            {
              id: 'prog_gksdp',
              title: 'GK Skill Development',
              subtitle: 'Improve your general knowledge and current affairs.',
              gradient: 'from-[#60a5fa] via-[#3b82f6] to-[#2563eb]',
              icon: Globe
            },
            {
              id: 'prog_msdp',
              title: 'Maths Skill Development',
              subtitle: 'Sharpen your math skills with practice and theory.',
              gradient: 'from-[#a78bfa] via-[#8b5cf6] to-[#7c3aed]',
              isMath: true
            },
            {
              id: 'prog_esdp',
              title: 'English Skill Development',
              subtitle: 'Enhance your communication and language skills.',
              gradient: 'from-[#a3e635] via-[#84cc16] to-[#65a30d]',
              isLang: true
            },
            {
              id: 'prog_ssdp',
              title: 'Science Skill Development',
              subtitle: 'Explore science concepts with easy learning.',
              gradient: 'from-[#22d3ee] via-[#06b6d4] to-[#0891b2]',
              icon: Rocket
            }
          ].map((prog) => {
            const Icon = prog.icon;
            return (
              <div
                key={prog.id}
                onClick={() => onNavigateTab(prog.id)}
                className={`rounded-3xl p-5 flex flex-col justify-between text-white shadow-xs hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1 min-h-[210px] relative overflow-hidden bg-gradient-to-b ${prog.gradient} cursor-pointer group`}
              >
                {/* Frosted subtle geometric glow */}
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/10 rounded-full blur-xl pointer-events-none" />

                <div className="space-y-2.5 relative z-10">
                  {/* Top Frosted Circular Icon Container */}
                  <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                    {prog.isMath ? (
                      <span className="font-black text-sm text-white font-mono leading-none">
                        x²
                      </span>
                    ) : prog.isLang ? (
                      <span className="font-black text-xs text-white leading-none">
                        文A
                      </span>
                    ) : (
                      <Icon className="w-5 h-5 text-white" />
                    )}
                  </div>

                  <div>
                    <h3 className="font-black text-sm text-white leading-snug">
                      {prog.title}
                    </h3>
                    <p className="text-[11px] text-white/90 font-medium leading-relaxed mt-1">
                      {prog.subtitle}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/20 mt-auto relative z-10">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onNavigateTab(prog.id);
                    }}
                    className="w-full py-2 px-3 bg-white/25 hover:bg-white/35 text-white rounded-full text-xs font-bold transition-all backdrop-blur-xs flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 shadow-2xs"
                  >
                    <span>Start Learning</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 6. SECTION: LIVE STUDENT TEST RESULTS, SCORES & LEADERBOARD               */}
      {/* ========================================================================= */}
      <div className="pt-2 space-y-4">
        {/* Section Header (Flat on background, no box) */}
        <div className="space-y-0.5">
          <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Trophy className="w-5 h-5 text-[#80497D]" />
            <span>Live Student Exam Results &amp; Percentages</span>
          </h2>
          <p className="text-[11px] text-slate-500 font-medium">
            Real-time student performance feed, test scores, and subject-wise percentages.
          </p>
        </div>

        {/* LIVE STUDENTS RESULTS TABLE */}
        <div className="space-y-3">

            {/* Results Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200/80 text-slate-500 text-[10px] uppercase font-bold tracking-wider">
                    <tr>
                      <th className="py-3 px-3 w-10 text-center">#</th>
                      <th className="py-3 px-4">Student</th>
                      <th className="py-3 px-3">Class</th>
                      <th className="py-3 px-4">Test Title &amp; Subject</th>
                      <th className="py-3 px-4">School</th>
                      <th className="py-3 px-4">Percentage</th>
                      <th className="py-3 px-4 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {resultsLoading ? (
                      <tr>
                        <td colSpan={7} className="py-10 text-center text-slate-400">
                          <div className="flex items-center justify-center gap-2">
                            <RotateCcw className="w-4 h-4 animate-spin text-indigo-600" />
                            <span>Loading live student exam results...</span>
                          </div>
                        </td>
                      </tr>
                    ) : filteredStudentResults.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-10 text-center text-slate-400">
                          No student test results match your filter criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredStudentResults.map((r, idx) => {
                        const pct = parseFloat(r.percentage || 0).toFixed(1);
                        const isPassed = Number(r.passed) === 1 || parseFloat(pct) >= 50;
                        const isMyRecord = user && (r.student_id === user.id || r.student_login_id === user.login_id);

                        return (
                          <tr
                            key={r.id || idx}
                            className={`hover:bg-slate-50/80 transition-colors ${
                              isMyRecord ? 'bg-indigo-50/30 font-semibold' : ''
                            }`}
                          >
                            <td className="py-3.5 px-3 text-center font-mono font-bold text-slate-400 text-xs">
                              {idx + 1}
                            </td>

                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-xl bg-[#80497D] text-white flex items-center justify-center font-black text-xs shrink-0 shadow-2xs">
                                  {r.student_name ? r.student_name.charAt(0).toUpperCase() : 'S'}
                                </div>
                                <div className="min-w-0">
                                  <div className="flex items-center gap-1.5">
                                    <p className="font-bold text-slate-900 truncate">
                                      {r.student_name || 'Student'}
                                    </p>
                                    {isMyRecord && (
                                      <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-[#f4eaf4] text-[#80497D]">
                                        YOU
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-[10px] font-mono text-slate-400 truncate uppercase">
                                    {r.student_login_id || 'ID'}
                                  </p>
                                </div>
                              </div>
                            </td>

                            <td className="py-3.5 px-3 whitespace-nowrap">
                              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold bg-[#f4eaf4] text-[#80497D] border border-[#ebd7eb]">
                                {r.class_name || 'Class 6'}
                              </span>
                            </td>

                            <td className="py-3.5 px-4">
                              <p className="font-bold text-slate-900 line-clamp-1">
                                {r.exam_title || 'Olympiad Test Paper'}
                              </p>
                              <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-medium mt-0.5">
                                {r.subject_name ? (
                                  <span className="text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-100">
                                    {r.subject_name}
                                  </span>
                                ) : (
                                  <span className="text-purple-700 font-bold bg-purple-50 px-1.5 py-0.2 rounded border border-purple-100">
                                    Olympiad
                                  </span>
                                )}
                              </div>
                            </td>

                            <td className="py-3.5 px-4 font-semibold text-slate-700 whitespace-nowrap">
                              <div className="flex items-center gap-1.5">
                                <Building2 className="w-3.5 h-3.5 text-[#80497D] shrink-0" />
                                <span className="font-bold text-slate-800 truncate max-w-[220px]" title={r.school_name || 'Independent Candidate'}>
                                  {r.school_name || 'Independent Candidate'}
                                </span>
                              </div>
                            </td>

                            <td className="py-3.5 px-4 whitespace-nowrap">
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-black font-mono ${
                                  parseFloat(pct) >= 80
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                    : parseFloat(pct) >= 50
                                    ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                                    : 'bg-rose-50 text-rose-700 border border-rose-200'
                                }`}
                              >
                                {pct}%
                              </span>
                            </td>

                            <td className="py-3.5 px-4 text-right whitespace-nowrap">
                              <span
                                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                                  isPassed
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                    : 'bg-rose-50 text-rose-700 border border-rose-200'
                                }`}
                              >
                                <span className={`w-1.5 h-1.5 rounded-full ${isPassed ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                                <span>{isPassed ? 'Passed' : 'Completed'}</span>
                              </span>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

