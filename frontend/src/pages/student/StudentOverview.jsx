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

export const StudentOverview = ({ onNavigateTab, onStartExam, onViewResult, activeSubjectTab }) => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [availableExams, setAvailableExams] = useState([]);
  const [examPapers, setExamPapers] = useState([]);
  const [selectedSubjectCover, setSelectedSubjectCover] = useState(() => {
    if (activeSubjectTab && activeSubjectTab.startsWith('content_')) {
      return activeSubjectTab.replace('content_', '').toUpperCase();
    }
    return null;
  }); // null = all covers, 'IGKO' = IGKO mock tests
  const [selectedPaperForInstructions, setSelectedPaperForInstructions] = useState(null);
  const [hasAgreedToRules, setHasAgreedToRules] = useState(true);
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(() => new Date());

  // Synchronize when activeSubjectTab changes externally (e.g. from Sidebar)
  useEffect(() => {
    if (activeSubjectTab && activeSubjectTab.startsWith('content_')) {
      const code = activeSubjectTab.replace('content_', '').toUpperCase();
      setSelectedSubjectCover(code);
    } else if (activeSubjectTab === 'my_content' || activeSubjectTab === 'overview') {
      setSelectedSubjectCover(null);
    }
  }, [activeSubjectTab]);

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
      let apiList = [];
      try {
        const res = await apiClient.get('/results', { scope: 'all' });
        if (res.success && Array.isArray(res.data)) {
          apiList = res.data;
        }
      } catch (err) {}

      // Also merge local client-side saved attempts for instant live reflection
      const localKeys = ['olympiadhub_student_attempts', 'olympiadhub_db_results', 'student_test_attempts', 'test_generator_attempts'];
      let localList = [];
      localKeys.forEach((key) => {
        try {
          const raw = localStorage.getItem(key);
          if (raw) {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) localList = [...localList, ...parsed];
            else if (parsed && typeof parsed === 'object') localList.push(parsed);
          }
        } catch (e) {}
      });

      const combined = [...localList, ...apiList];
      const seen = new Set();
      const unique = [];
      combined.forEach((rawR) => {
        if (!rawR) return;
        const totalQ = Number(rawR.total_marks || rawR.total_questions || rawR.totalQuestions || 60);
        const scoreVal = Number(rawR.score || rawR.earnedScore || 0);
        let rawPctVal = rawR.percentage !== undefined && rawR.percentage !== null && !isNaN(Number(rawR.percentage))
          ? Number(rawR.percentage)
          : null;

        if (rawPctVal !== null) {
          while (rawPctVal > 100) {
            rawPctVal = rawPctVal / 100;
          }
        } else {
          rawPctVal = totalQ > 0 ? (scoreVal / totalQ) * 100 : 0;
        }
        const calcPct = Math.min(100, Math.max(0, rawPctVal)).toFixed(1);

        // Dynamically resolve student name in proper Title Case
        let cleanStudentName = (rawR.student_name || rawR.name || rawR.full_name || rawR.studentName || '').trim();
        if (!cleanStudentName || cleanStudentName.toLowerCase() === 'student candidate' || cleanStudentName.toLowerCase() === 'candidate' || cleanStudentName.toLowerCase() === (rawR.student_login_id || '').toLowerCase()) {
          try {
            const allUsers = JSON.parse(localStorage.getItem('olympiadhub_db_users') || '[]');
            const match = allUsers.find(u =>
              String(u.id) === String(rawR.student_id) ||
              String(u.login_id || '').toLowerCase() === String(rawR.student_login_id || '').toLowerCase() ||
              (u.email && rawR.student_email && u.email.toLowerCase() === rawR.student_email.toLowerCase())
            );
            if (match && (match.full_name || match.name)) {
              cleanStudentName = match.full_name || match.name;
            }
          } catch (e) {}
        }
        if (!cleanStudentName || cleanStudentName.toLowerCase() === 'student candidate' || cleanStudentName.toLowerCase() === 'candidate') {
          const base = rawR.student_login_id || rawR.student_name || 'Student Candidate';
          cleanStudentName = base.split(/[@._\s]+/).filter(Boolean).map(p => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase()).join(' ');
        } else {
          cleanStudentName = cleanStudentName.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
        }

        // Dynamically resolve the student's actual school name
        let resolvedSchool = (rawR.school_name || rawR.student_school || rawR.school || '').trim();
        if (resolvedSchool) {
          resolvedSchool = resolvedSchool.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
        }
        if (!resolvedSchool || resolvedSchool === 'Independent Candidate' || resolvedSchool === 'N/A' || resolvedSchool === 'undefined') {
          if (user && (user.id === rawR.student_id || user.login_id === rawR.student_login_id || user.name === rawR.student_name || user.full_name === rawR.student_name)) {
            resolvedSchool = (user.school_name || user.school || '').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
          }

          if (!resolvedSchool || resolvedSchool === 'Independent Candidate') {
            try {
              const allUsers = JSON.parse(localStorage.getItem('olympiadhub_db_users') || '[]');
              const match = allUsers.find(u => u.login_id === rawR.student_login_id || u.id === rawR.student_id || u.full_name === rawR.student_name || u.name === rawR.student_name);
              if (match && (match.school_name || match.school)) {
                resolvedSchool = (match.school_name || match.school).split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
              }
            } catch (e) {}
          }

          if (!resolvedSchool || resolvedSchool === 'Independent Candidate') {
            resolvedSchool = 'Gwalior Glory High School';
          }
        }

        const r = {
          ...rawR,
          id: rawR.id || rawR.attempt_id || Date.now(),
          student_name: cleanStudentName,
          student_login_id: rawR.student_login_id || rawR.login_id || rawR.studentLoginId || (rawR.student_id ? 'STU-00' + rawR.student_id : 'ID'),
          class_name: rawR.class_name || rawR.class || rawR.grade || 'Class 6',
          exam_title: rawR.exam_title || rawR.title || rawR.paper_title || rawR.examTitle || 'Olympiad Practice Test',
          subject_name: rawR.subject_name || rawR.subject || rawR.subject_code || 'Olympiad',
          school_name: resolvedSchool,
          percentage: calcPct,
          score: scoreVal,
          total_marks: totalQ,
          passed: Number(calcPct) >= 40 || Number(rawR.passed) === 1,
          status: rawR.status || 'completed',
          submitted_at: rawR.submitted_at || rawR.created_at || rawR.date || new Date().toISOString()
        };

        const uid = r.id || r.attempt_id || `${r.student_login_id}_${r.exam_title}_${r.submitted_at}`;
        if (!seen.has(uid)) {
          seen.add(uid);
          unique.push(r);
        }
      });

      // Sort newest first
      unique.sort((a, b) => new Date(b.submitted_at || 0) - new Date(a.submitted_at || 0));
      setAllStudentResults(unique);
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

  // Total Registered / Enrolled Students (Real-time live dynamic count)
  const [totalLiveStudents, setTotalLiveStudents] = useState(0);

  const calculateLiveStudents = () => {
    try {
      const users = JSON.parse(localStorage.getItem('olympiadhub_db_users') || '[]');
      const count = users.filter((u) => u.role === 'student' || (!u.role && !u.is_teacher && !u.is_superadmin)).length;
      if (count > 0) setTotalLiveStudents(count);
    } catch (e) {}
  };

  useEffect(() => {
    calculateLiveStudents();
    apiClient.get('/users/students').then((res) => {
      if (res.success && Array.isArray(res.data) && res.data.length > 0) {
        setTotalLiveStudents(res.data.length);
      }
    }).catch(() => {});

    const handleStudentsUpdated = () => {
      calculateLiveStudents();
    };

    window.addEventListener('students-updated', handleStudentsUpdated);
    window.addEventListener('olympiadhub-data-updated', handleStudentsUpdated);
    window.addEventListener('storage', handleStudentsUpdated);
    return () => {
      window.removeEventListener('students-updated', handleStudentsUpdated);
      window.removeEventListener('olympiadhub-data-updated', handleStudentsUpdated);
      window.removeEventListener('storage', handleStudentsUpdated);
    };
  }, []);

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
    return allStudentResults.filter(r => {
      const uId = user.id;
      const uLogin = (user.login_id || '').toLowerCase();
      const uEmail = (user.email || '').toLowerCase();
      return (
        (r.student_id && (r.student_id === uId || String(r.student_id) === String(uId))) ||
        (r.user_id && (r.user_id === uId || String(r.user_id) === String(uId))) ||
        (r.student_login_id && uLogin && r.student_login_id.toLowerCase() === uLogin) ||
        (r.student_email && uEmail && r.student_email.toLowerCase() === uEmail)
      );
    });
  }, [allStudentResults, user]);

  const studentClass = user?.class || user?.grade || 'Class 6';

  const ALL_SUBJECT_COVERS = useMemo(() => [
    {
      code: 'IMO',
      altCode: 'IEOM',
      title: 'IEOM (Mathematics)',
      subtitle: 'Mathematics & Logical Analysis',
      icon: Calculator,
      color: '#ec4899',
      iconBg: 'bg-pink-50 border-pink-200 text-pink-600',
      seriesTitle: `${studentClass}-All India IEOM Mock Test Series`
    },
    {
      code: 'ISO',
      altCode: 'IEOS',
      title: 'IEOS (Science)',
      subtitle: 'Science & Practical Discovery',
      icon: Atom,
      color: '#8b5cf6',
      iconBg: 'bg-purple-50 border-purple-200 text-purple-600',
      seriesTitle: `${studentClass}-All India IEOS Mock Test Series`
    },
    {
      code: 'IDLO',
      altCode: 'IEOD',
      title: 'IEOD (Digital Literacy)',
      subtitle: 'Digital Literacy, Cyber & AI',
      icon: Laptop,
      color: '#3b82f6',
      iconBg: 'bg-blue-50 border-blue-200 text-blue-600',
      seriesTitle: `${studentClass}-All India IEOD Mock Test Series`
    },
    {
      code: 'IEO',
      altCode: 'IEOE',
      title: 'IEOE (English)',
      subtitle: 'English Grammar & Vocabulary',
      icon: BookOpen,
      color: '#06b6d4',
      iconBg: 'bg-cyan-50 border-cyan-200 text-cyan-600',
      seriesTitle: `${studentClass}-All India IEOE Mock Test Series`
    },
    {
      code: 'IGKO',
      altCode: 'IEOG',
      title: 'IEOG (General Knowledge)',
      subtitle: 'General Knowledge & Current Affairs',
      icon: Globe,
      color: '#f59e0b',
      iconBg: 'bg-amber-50 border-amber-200 text-amber-600',
      seriesTitle: `${studentClass}-All India IEOG Mock Test Series`
    },
    {
      code: 'IHO',
      altCode: 'IEOH',
      title: 'IEOH (Hindi)',
      subtitle: 'हिंदी व्याकरण एवं भाषा ज्ञान',
      icon: Languages,
      color: '#10b981',
      iconBg: 'bg-emerald-50 border-emerald-200 text-emerald-600',
      seriesTitle: `${studentClass}-All India IEOH Mock Test Series`
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

    const basePapers = [
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

    if (subCode === 'IMO') {
      basePapers.push({
        id: `mock_${subCode.toLowerCase()}_3`,
        title: `${subCode} Level-1 Mock Test 3 ${studentClass}`,
        short_code: `${subCode} - Mock 3`,
        subject_code: subCode,
        class_name: studentClass,
        duration_minutes: 60,
        total_marks: 60,
        cutoff_marks: 46,
        status: 'published'
      });
    }

    return basePapers;
  };

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

  if (selectedPaperForInstructions) {
    const paper = selectedPaperForInstructions;
    return (
      <div className="space-y-6 pb-16 font-sans max-w-4xl mx-auto animate-in fade-in duration-200">
        {/* Top Navigation */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setSelectedPaperForInstructions(null)}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-indigo-600 px-3.5 py-2 rounded-xl bg-white border border-slate-200 shadow-2xs hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-indigo-600" />
            <span>← Back to Mock Tests List</span>
          </button>
          <span className="text-xs font-bold text-slate-400">Pre-Examination Verification</span>
        </div>

        {/* 1. Exam Hero Overview Card */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 pb-6 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2.5 mb-2">
                <span className="text-[10px] font-black text-indigo-700 bg-indigo-100 px-2.5 py-0.5 rounded-full border border-indigo-200 uppercase tracking-wider">
                  {paper.subject_code || 'OLYMPIAD'}
                </span>
                <span className="font-mono text-xs font-bold text-slate-600 bg-slate-100 border border-slate-200 px-2.5 py-0.5 rounded-md">
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
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs">
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
              <h4 className="text-lg font-black text-indigo-600 mt-1">{paper.questions?.length || 5} MCQs</h4>
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
              <span className="font-bold text-indigo-600">1.</span>
              <span>The timer will begin immediately when you click <strong>Start Mock Test Now</strong>.</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="font-bold text-indigo-600">2.</span>
              <span>Each correct answer awards 1 mark. There is no negative marking for unattempted questions.</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="font-bold text-indigo-600">3.</span>
              <span>You can mark questions for review and navigate freely between questions.</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="font-bold text-indigo-600">4.</span>
              <span>Upon submission, your score, accuracy %, percentile rank, and detailed answers will be generated instantly.</span>
            </p>
          </div>

          <div className="pt-2 flex items-center gap-3">
            <input
              type="checkbox"
              id="agreeCheck"
              checked={hasAgreedToRules}
              onChange={(e) => setHasAgreedToRules(e.target.checked)}
              className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500 cursor-pointer"
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
            className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer transition-all active:scale-95"
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
            className="px-7 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white font-black text-xs sm:text-sm shadow-md hover:shadow-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 active:scale-95 transition-all border border-indigo-600"
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
      {/* 1. HERO GREETING BANNER (3-Mix Pastel Gradient Card - 20% Richer)         */}
      {/* ========================================================================= */}
      <div className="bg-gradient-to-r from-blue-200/90 via-indigo-200/80 to-pink-200/90 border-2 border-indigo-300 rounded-3xl p-5 sm:p-6 md:p-7 shadow-sm relative overflow-hidden text-slate-900">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          {/* Left Content */}
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-start gap-3.5">
              {/* Waving Hand Circular Badge */}
              <div className="w-11 h-11 rounded-2xl bg-white/90 border border-indigo-100 shadow-2xs flex items-center justify-center text-2xl shrink-0 mt-0.5">
                👋
              </div>
              <div>
                <p className="text-xs sm:text-sm font-bold text-slate-500">
                  Welcome Back,
                </p>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight mt-0.5">
                  <span className="text-slate-900">{greeting}, </span>
                  <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent capitalize">{studentName}</span>!
                </h1>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 font-medium pl-0.5">
              Keep learning, keep growing. Your next big achievement is near!
            </p>

            {/* Bottom Row: Date Pill & Live Enrolled Students Counter */}
            <div className="pt-2 flex items-center flex-wrap gap-2.5">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/95 backdrop-blur-xs border border-indigo-200 rounded-xl text-xs font-bold text-indigo-950 shadow-2xs">
                <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                <span>Today: {formattedDateStr}</span>
              </div>

              <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 bg-white/95 backdrop-blur-xs border-2 border-indigo-300 rounded-xl text-xs font-bold text-slate-800 shadow-2xs" title="Total active registered candidates in OlympiadHub">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <Users className="w-4 h-4 text-indigo-600 shrink-0" />
                <span className="text-slate-700 font-bold">Total Enrolled Students:</span>
                <span className="font-black text-indigo-700 font-mono text-sm bg-indigo-50 px-2 py-0.5 rounded-lg border border-indigo-200">
                  {totalLiveStudents > 0 ? totalLiveStudents : 1}
                </span>
                <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded-md uppercase tracking-wider">
                  Live Active
                </span>
              </div>
            </div>
          </div>

          {/* Right Content: Scholar Star Badge & Illustration */}
          <div className="shrink-0 flex items-center justify-center md:justify-end gap-4">
            {/* Scholar Star Tier Badge Card */}
            <div className="hidden lg:flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-white/85 backdrop-blur-xs border border-purple-100 shadow-2xs">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-400 via-orange-400 to-amber-300 text-slate-900 flex items-center justify-center shadow-xs">
                <Trophy className="w-5 h-5 fill-slate-900 text-slate-900" />
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-black uppercase tracking-wider text-slate-900">
                  Scholar Star
                </span>
                <span className="text-[9px] text-indigo-600 font-bold">Active Tier</span>
              </div>
            </div>

            {/* Flat Vector Stacked Books & Cheerful Cup SVG Illustration */}
            <div className="relative w-36 h-28 sm:w-44 sm:h-32 shrink-0">
              <svg viewBox="0 0 200 160" className="w-full h-full drop-shadow-xs" fill="none" xmlns="http://www.w3.org/2000/svg">
                <ellipse cx="42" cy="142" rx="20" ry="6" fill="#cbd5e1" opacity="0.6" />
                <path d="M 32 120 L 52 120 L 49 142 L 35 142 Z" fill="#64748b" stroke="#475569" strokeWidth="2" />
                <path d="M 42 120 C 30 105, 22 108, 25 95 C 38 95, 42 110, 42 120 Z" fill="#2dd4bf" />
                <path d="M 42 120 C 46 100, 60 90, 62 80 C 68 95, 54 112, 42 120 Z" fill="#10b981" />
                <path d="M 42 115 C 34 85, 48 70, 52 65 C 56 80, 50 102, 42 115 Z" fill="#059669" />

                <ellipse cx="120" cy="148" rx="60" ry="8" fill="#cbd5e1" opacity="0.6" />

                <rect x="68" y="122" width="105" height="22" rx="5" fill="#64748b" />
                <rect x="74" y="124" width="97" height="18" rx="3" fill="#ffffff" />
                <path d="M 68 122 Q 65 133 68 144 L 75 144 Q 72 133 75 122 Z" fill="#475569" />
                <line x1="78" y1="129" x2="165" y2="129" stroke="#cbd5e1" strokeWidth="1.5" />
                <line x1="78" y1="134" x2="165" y2="134" stroke="#cbd5e1" strokeWidth="1.5" />
                <line x1="78" y1="139" x2="165" y2="139" stroke="#cbd5e1" strokeWidth="1.5" />

                <rect x="72" y="98" width="98" height="22" rx="5" fill="#3b82f6" />
                <rect x="78" y="100" width="90" height="18" rx="3" fill="#ffffff" />
                <path d="M 72 98 Q 69 109 72 120 L 79 120 Q 76 109 79 98 Z" fill="#1d4ed8" />
                <line x1="82" y1="105" x2="162" y2="105" stroke="#cbd5e1" strokeWidth="1.5" />
                <line x1="82" y1="110" x2="162" y2="110" stroke="#cbd5e1" strokeWidth="1.5" />
                <line x1="82" y1="115" x2="162" y2="115" stroke="#cbd5e1" strokeWidth="1.5" />

                <rect x="76" y="74" width="92" height="22" rx="5" fill="#ec4899" />
                <rect x="82" y="76" width="84" height="18" rx="3" fill="#ffffff" />
                <path d="M 76 74 Q 73 85 76 96 L 83 96 Q 80 85 83 74 Z" fill="#db2777" />
                <line x1="86" y1="81" x2="160" y2="81" stroke="#cbd5e1" strokeWidth="1.5" />
                <line x1="86" y1="86" x2="160" y2="86" stroke="#cbd5e1" strokeWidth="1.5" />
                <line x1="86" y1="91" x2="160" y2="91" stroke="#cbd5e1" strokeWidth="1.5" />

                <path d="M 108 52 C 108 68, 138 68, 138 52 L 138 50 L 108 50 Z" fill="#fbbf24" stroke="#f59e0b" strokeWidth="2" />
                <ellipse cx="123" cy="50" rx="15" ry="4" fill="#fde68a" stroke="#f59e0b" strokeWidth="1.5" />
                <ellipse cx="123" cy="50" rx="12" ry="2.5" fill="#d97706" opacity="0.6" />
                <path d="M 137 54 C 146 54, 146 64, 136 65" fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M 123 58 C 121 55, 117 56, 117 59 C 117 63, 123 66, 123 66 C 123 66, 129 63, 129 59 C 129 56, 125 55, 123 58 Z" fill="#ffffff" />

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
      {/* 2. SECTION: OLYMPIAD SUBJECTS (2-3 Mix Pastel Gradient Cards)             */}
      {/* ========================================================================= */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
              <BookOpen className="w-6 h-6 text-indigo-600" />
              <span>Olympiad Subjects</span>
            </h2>
            <p className="text-xs text-slate-500 font-semibold mt-0.5">
              Explore subject-wise preparation material, previous year papers &amp; mock test series.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigateTab && onNavigateTab('my_content')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-800 bg-white hover:bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl transition-all shadow-2xs cursor-pointer active:scale-95"
          >
            <span>View All Subject Covers</span>
            <ChevronRight className="w-4 h-4 text-slate-500" />
          </button>
        </div>

        {/* 6 Colorful 2-3 Mix Pastel Gradient Subject Cards (20% Richer) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4 sm:gap-5 w-full">
          {[
            {
              key: 'imo',
              title: 'IEOM (Maths)',
              subtitle: 'Mathematics & Logic',
              icon: Calculator,
              cardBg: 'bg-gradient-to-br from-pink-200/95 via-rose-200/85 to-amber-200/85 border-2 border-pink-400/90 hover:border-pink-500 shadow-sm',
              iconBg: 'bg-gradient-to-tr from-pink-500 via-rose-500 to-amber-500 text-white shadow-pink-300 shadow-sm',
              linkText: 'text-pink-800 group-hover:text-pink-900'
            },
            {
              key: 'iso',
              title: 'IEOS (Science)',
              subtitle: 'Science & Discovery',
              icon: Rocket,
              cardBg: 'bg-gradient-to-br from-purple-200/95 via-indigo-200/85 to-sky-200/85 border-2 border-purple-400/90 hover:border-purple-500 shadow-sm',
              iconBg: 'bg-gradient-to-tr from-purple-500 via-indigo-500 to-sky-500 text-white shadow-purple-300 shadow-sm',
              linkText: 'text-purple-800 group-hover:text-purple-900'
            },
            {
              key: 'idlo',
              title: 'IEOD (Digital)',
              subtitle: 'Digital Literacy & AI',
              icon: Laptop,
              cardBg: 'bg-gradient-to-br from-cyan-200/95 via-blue-200/85 to-indigo-200/85 border-2 border-blue-400/90 hover:border-blue-500 shadow-sm',
              iconBg: 'bg-gradient-to-tr from-cyan-500 via-blue-500 to-indigo-500 text-white shadow-blue-300 shadow-sm',
              linkText: 'text-blue-800 group-hover:text-blue-900'
            },
            {
              key: 'ieo',
              title: 'IEOE (English)',
              subtitle: 'English & Grammar',
              icon: BookOpen,
              cardBg: 'bg-gradient-to-br from-emerald-200/95 via-teal-200/85 to-cyan-200/85 border-2 border-teal-400/90 hover:border-teal-500 shadow-sm',
              iconBg: 'bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 text-white shadow-teal-300 shadow-sm',
              linkText: 'text-teal-900 group-hover:text-teal-950'
            },
            {
              key: 'igko',
              title: 'IEOG (GK)',
              subtitle: 'General Knowledge',
              icon: Globe,
              cardBg: 'bg-gradient-to-br from-amber-200/95 via-orange-200/85 to-rose-200/85 border-2 border-amber-400/90 hover:border-amber-500 shadow-sm',
              iconBg: 'bg-gradient-to-tr from-amber-500 via-orange-500 to-rose-500 text-white shadow-amber-300 shadow-sm',
              linkText: 'text-amber-900 group-hover:text-amber-950'
            },
            {
              key: 'iho',
              title: 'IEOH (Hindi)',
              subtitle: 'हिंदी व्याकरण एवं बोध',
              icon: Languages,
              cardBg: 'bg-gradient-to-br from-lime-200/95 via-emerald-200/85 to-teal-200/85 border-2 border-emerald-400/90 hover:border-emerald-500 shadow-sm',
              iconBg: 'bg-gradient-to-tr from-lime-500 via-emerald-500 to-teal-600 text-white shadow-emerald-300 shadow-sm',
              linkText: 'text-emerald-900 group-hover:text-emerald-950'
            }
          ].map((sub) => (
            <div
              key={sub.key}
              onClick={() => onNavigateTab && onNavigateTab(`content_${sub.key}`)}
              className={`${sub.cardBg} rounded-3xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col items-center justify-between text-center min-h-[200px] group hover:-translate-y-1 text-slate-900`}
            >
              {/* Square Icon Container */}
              <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl ${sub.iconBg} flex items-center justify-center border border-white/40 group-hover:scale-105 transition-transform shrink-0`}>
                <sub.icon className="w-7 h-7 sm:w-8 sm:h-8" />
              </div>

              {/* Subject Title & Subtitle */}
              <div className="space-y-1 my-auto pt-2">
                <h3 className="font-bold text-slate-900 text-sm sm:text-base tracking-tight leading-snug">
                  {sub.title}
                </h3>
                <p className="text-xs text-slate-700 font-semibold truncate">
                  {sub.subtitle}
                </p>
              </div>

              {/* Bottom Action Indicator */}
              <div className={`w-full pt-2.5 border-t border-black/10 flex items-center justify-between text-xs font-bold ${sub.linkText} transition-colors`}>
                <span>Explore Series</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. SECTION: TWO FEATURED BANNERS (10% Richer 2-3 Mix Pastel Gradient)     */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 pt-2">
        
        {/* Left Banner: Online Classes */}
        <div className="bg-gradient-to-r from-blue-200/95 via-indigo-200/90 to-purple-200/95 rounded-3xl border-2 border-indigo-400 hover:border-indigo-500 p-6 sm:p-7 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 text-slate-900">
          <div className="flex items-center gap-4 min-w-0">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-indigo-300 shadow-sm shrink-0 text-white border border-white/30">
              <div className="relative">
                <BookOpen className="w-8 h-8 text-white" />
                <Lightbulb className="w-4 h-4 text-amber-300 fill-amber-300 absolute -top-1 -right-1" />
              </div>
            </div>

            <div className="min-w-0 space-y-1.5">
              <span className="inline-block px-3 py-1 rounded-lg bg-indigo-300/90 text-indigo-900 text-[10px] font-black uppercase tracking-wider border border-indigo-400">
                FEATURED
              </span>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                Online Classes for Mathematics, Science &amp; Digital Literacy
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 font-semibold leading-relaxed">
                Get expert guidance and master competitive Olympiad problem-solving.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onNavigateTab('my_classes')}
            className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all shadow-sm hover:shadow-md active:scale-95 cursor-pointer shrink-0 flex items-center justify-center gap-2 border border-indigo-600"
          >
            <span>ENROLL NOW</span>
            <ArrowRight className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Right Banner: Olympiad Intelligent Test Generator Pro */}
        <div className="bg-gradient-to-r from-pink-200/95 via-purple-200/90 to-blue-200/95 rounded-3xl border-2 border-pink-400 hover:border-pink-500 p-6 sm:p-7 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 text-slate-900">
          <div className="flex items-center gap-4 min-w-0">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-500 via-rose-500 to-purple-600 flex items-center justify-center shadow-pink-300 shadow-sm shrink-0 text-white border border-white/30">
              <div className="relative">
                <FileSpreadsheet className="w-8 h-8 text-white" />
                <Target className="w-4 h-4 text-yellow-300 absolute -top-1 -right-1" />
              </div>
            </div>

            <div className="min-w-0 space-y-1.5">
              <span className="inline-block px-3 py-1 rounded-lg bg-pink-300/90 text-pink-900 text-[10px] font-black uppercase tracking-wider border border-pink-400">
                PRO TOOL
              </span>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                Olympiad Intelligent Test Generator Pro
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 font-semibold leading-relaxed">
                Create customized Olympiad mock tests in seconds.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onNavigateTab('test_generator')}
            className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-pink-600 via-rose-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all shadow-sm hover:shadow-md active:scale-95 cursor-pointer shrink-0 flex items-center justify-center gap-2 border border-pink-600"
          >
            <span>TRY NOW</span>
            <ArrowRight className="w-4 h-4 text-white" />
          </button>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 4. SECTION: FREE SAMPLE PAPERS & PREVIOUS YEAR PAPERS (20% Richer)        */}
      {/* ========================================================================= */}
      <div className="pt-2">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          
          {/* Card 1: Spotlight: IGKO Quiz */}
          <div className="bg-gradient-to-br from-amber-200/95 via-orange-200/85 to-rose-200/85 rounded-2xl border-2 border-amber-400/90 hover:border-amber-500 p-4 sm:p-5 shadow-sm hover:shadow-md transition-all flex items-center justify-between gap-3 text-slate-900">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 text-white flex items-center justify-center shrink-0 shadow-2xs border border-white/30">
                <FileText className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h4 className="font-bold text-slate-900 text-xs sm:text-sm truncate">
                  Spotlight: IGKO Quiz
                </h4>
                <p className="text-[10px] text-slate-700 font-semibold truncate mt-0.5">
                  Test your knowledge with latest questions.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onNavigateTab('free_quizzes')}
              className="px-4 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl text-xs font-bold transition-all shadow-2xs active:scale-95 cursor-pointer shrink-0 flex items-center gap-1 border border-amber-500"
            >
              <span>Open</span>
              <ArrowRight className="w-3 h-3 text-white" />
            </button>
          </div>

          {/* Card 2: Free Sample Papers */}
          <div className="bg-gradient-to-br from-sky-200/95 via-blue-200/85 to-indigo-200/85 rounded-2xl border-2 border-sky-400/90 hover:border-sky-500 p-4 sm:p-5 shadow-sm hover:shadow-md transition-all flex items-center justify-between gap-3 text-slate-900">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 text-white flex items-center justify-center shrink-0 shadow-2xs border border-white/30">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h4 className="font-bold text-slate-900 text-xs sm:text-sm truncate">
                  Free Sample Papers
                </h4>
                <p className="text-[10px] text-slate-700 font-semibold truncate mt-0.5">
                  Download and practice sample papers.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onNavigateTab('free_sample_papers')}
              className="px-4 py-1.5 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-2xs active:scale-95 cursor-pointer shrink-0 flex items-center gap-1 border border-sky-500"
            >
              <span>Open</span>
              <ArrowRight className="w-3 h-3 text-white" />
            </button>
          </div>

          {/* Card 3: Free Previous Year Papers */}
          <div className="bg-gradient-to-br from-emerald-200/95 via-teal-200/85 to-cyan-200/85 rounded-2xl border-2 border-emerald-400/90 hover:border-emerald-500 p-4 sm:p-5 shadow-sm hover:shadow-md transition-all flex items-center justify-between gap-3 text-slate-900">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center shrink-0 shadow-2xs border border-white/30">
                <Award className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h4 className="font-bold text-slate-900 text-xs sm:text-sm truncate">
                  Free Previous Year Papers
                </h4>
                <p className="text-[10px] text-slate-700 font-semibold truncate mt-0.5">
                  Get past year papers with solutions.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onNavigateTab('free_past_papers')}
              className="px-4 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl text-xs font-bold transition-all shadow-2xs active:scale-95 cursor-pointer shrink-0 flex items-center gap-1 border border-emerald-500"
            >
              <span>Open</span>
              <ArrowRight className="w-3 h-3 text-white" />
            </button>
          </div>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* 5. SECTION: SKILL DEVELOPMENT PROGRAMS (Vibrant 2-3 Mix Pastel Cards)      */}
      {/* ========================================================================= */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Rocket className="w-5 h-5 text-indigo-600" />
            <span>Skill Development Programs</span>
          </h2>

          <button
            type="button"
            onClick={() => onNavigateTab && onNavigateTab('prog_rsdp')}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 hover:underline flex items-center gap-1 transition-colors cursor-pointer"
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
              cardBg: 'bg-gradient-to-br from-purple-200/95 via-indigo-200/85 to-pink-200/85 border-2 border-purple-400/90 hover:border-purple-500 shadow-sm',
              iconBg: 'bg-gradient-to-br from-purple-500 via-indigo-500 to-pink-500 text-white shadow-purple-300 shadow-sm',
              btnBg: 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white border-purple-600',
              icon: Brain
            },
            {
              id: 'prog_gksdp',
              title: 'GK Skill Development',
              subtitle: 'Improve your general knowledge and current affairs.',
              cardBg: 'bg-gradient-to-br from-amber-200/95 via-orange-200/85 to-yellow-200/85 border-2 border-amber-400/90 hover:border-amber-500 shadow-sm',
              iconBg: 'bg-gradient-to-br from-amber-500 via-orange-500 to-yellow-500 text-white shadow-amber-300 shadow-sm',
              btnBg: 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white border-amber-500',
              icon: Globe
            },
            {
              id: 'prog_msdp',
              title: 'Maths Skill Development',
              subtitle: 'Sharpen your math skills with practice and theory.',
              cardBg: 'bg-gradient-to-br from-pink-200/95 via-rose-200/85 to-red-200/85 border-2 border-pink-400/90 hover:border-pink-500 shadow-sm',
              iconBg: 'bg-gradient-to-br from-pink-500 via-rose-500 to-red-500 text-white shadow-pink-300 shadow-sm',
              btnBg: 'bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white border-pink-600',
              isMath: true
            },
            {
              id: 'prog_esdp',
              title: 'English Skill Development',
              subtitle: 'Enhance your communication and language skills.',
              cardBg: 'bg-gradient-to-br from-blue-200/95 via-sky-200/85 to-indigo-200/85 border-2 border-blue-400/90 hover:border-blue-500 shadow-sm',
              iconBg: 'bg-gradient-to-br from-blue-500 via-sky-500 to-indigo-500 text-white shadow-blue-300 shadow-sm',
              btnBg: 'bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-700 hover:to-sky-700 text-white border-blue-600',
              isLang: true
            },
            {
              id: 'prog_ssdp',
              title: 'Science Skill Development',
              subtitle: 'Explore science concepts with easy learning.',
              cardBg: 'bg-gradient-to-br from-emerald-200/95 via-teal-200/85 to-lime-200/85 border-2 border-emerald-400/90 hover:border-emerald-500 shadow-sm',
              iconBg: 'bg-gradient-to-br from-emerald-500 via-teal-500 to-lime-500 text-white shadow-emerald-300 shadow-sm',
              btnBg: 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white border-emerald-600',
              icon: Rocket
            }
          ].map((prog) => {
            const Icon = prog.icon;
            return (
              <div
                key={prog.id}
                onClick={() => onNavigateTab(prog.id)}
                className={`rounded-3xl p-5 flex flex-col justify-between text-slate-900 shadow-sm hover:shadow-md transition-all duration-200 transform hover:-translate-y-1 min-h-[210px] relative overflow-hidden ${prog.cardBg} cursor-pointer group border`}
              >
                <div className="space-y-2.5 relative z-10">
                  {/* Top Circular Icon Container */}
                  <div className={`w-10 h-10 rounded-xl ${prog.iconBg} border border-white/30 flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform`}>
                    {prog.isMath ? (
                      <span className="font-black text-sm font-mono leading-none">
                        x²
                      </span>
                    ) : prog.isLang ? (
                      <span className="font-black text-xs leading-none">
                        文A
                      </span>
                    ) : (
                      <Icon className="w-5 h-5" />
                    )}
                  </div>

                  <div>
                    <h3 className="font-bold text-sm text-slate-900 leading-snug">
                      {prog.title}
                    </h3>
                    <p className="text-[11px] text-slate-600 font-medium leading-relaxed mt-1">
                      {prog.subtitle}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-black/5 mt-auto relative z-10">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onNavigateTab(prog.id);
                    }}
                    className={`w-full py-2 px-3 ${prog.btnBg} rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 shadow-2xs border`}
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
      {/* 6. SECTION: LIVE STUDENT TEST RESULTS, SCORES & LEADERBOARD (Clean Box)   */}
      {/* ========================================================================= */}
      <div className="pt-2 space-y-4">
        {/* Section Header */}
        <div className="space-y-0.5">
          <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-amber-400 via-orange-400 to-amber-300 flex items-center justify-center text-slate-900 shadow-2xs shrink-0">
              <Trophy className="w-4 h-4 fill-slate-900 text-slate-900" />
            </div>
            <span>Live Student Exam Results &amp; Percentages</span>
          </h2>
          <p className="text-[11px] text-slate-500 font-semibold pl-9.5">
            Real-time student performance feed, test scores, and subject-wise percentages.
          </p>
        </div>

        {/* LIVE STUDENTS RESULTS TABLE (Colorful Header Card) */}
        <div className="space-y-3">
          <div className="bg-white rounded-3xl border border-indigo-100/80 shadow-xs overflow-hidden text-slate-800">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white text-[10px] sm:text-[11px] uppercase font-black tracking-wider shadow-xs">
                  <tr>
                    <th className="py-3.5 px-3 w-10 text-center text-white/90">#</th>
                    <th className="py-3.5 px-4 text-white">Student</th>
                    <th className="py-3.5 px-3 text-white/90">Class</th>
                    <th className="py-3.5 px-4 text-white">Test Title &amp; Subject</th>
                    <th className="py-3.5 px-4 text-white">School</th>
                    <th className="py-3.5 px-4 text-white">Percentage</th>
                    <th className="py-3.5 px-4 text-right text-white">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {resultsLoading ? (
                    <tr>
                      <td colSpan={7} className="py-10 text-center text-slate-400">
                        <div className="flex items-center justify-center gap-2">
                          <RotateCcw className="w-4 h-4 animate-spin text-slate-500" />
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
                      const isMyRecord = user && (
                        r.student_id === user.id ||
                        String(r.student_id) === String(user.id) ||
                        (r.user_id && (r.user_id === user.id || String(r.user_id) === String(user.id))) ||
                        (r.student_login_id && user.login_id && r.student_login_id.toLowerCase() === user.login_id.toLowerCase()) ||
                        (r.student_email && user.email && r.student_email.toLowerCase() === user.email.toLowerCase())
                      );

                      return (
                        <tr
                          key={r.id || idx}
                          className={`hover:bg-slate-50 transition-colors ${
                            isMyRecord ? 'bg-indigo-50/50 font-semibold' : ''
                          }`}
                        >
                          <td className="py-3.5 px-3 text-center font-mono font-bold text-slate-400 text-xs">
                            {idx + 1}
                          </td>

                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-xl bg-slate-800 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                                {r.student_name ? r.student_name.charAt(0).toUpperCase() : 'S'}
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5">
                                  <p className="font-bold text-slate-900 truncate">
                                    {r.student_name || 'Student'}
                                  </p>
                                  {isMyRecord && (
                                    <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-indigo-100 text-indigo-700 border border-indigo-200">
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
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                              {r.class_name || 'Class 6'}
                            </span>
                          </td>

                          <td className="py-3.5 px-4">
                            <p className="font-bold text-slate-900 line-clamp-1">
                              {r.exam_title || 'Olympiad Test Paper'}
                            </p>
                            <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-medium mt-0.5">
                              {r.subject_name ? (
                                <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                  {r.subject_name}
                                </span>
                              ) : (
                                <span className="text-slate-700 font-bold bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                                  Olympiad
                                </span>
                              )}
                            </div>
                          </td>

                          <td className="py-3.5 px-4 font-semibold text-slate-600 whitespace-nowrap">
                            <div className="flex items-center gap-1.5">
                              <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <span className="font-bold text-slate-700 truncate max-w-[220px]" title={r.school_name || 'Delhi Public School'}>
                                {r.school_name || 'Delhi Public School'}
                              </span>
                            </div>
                          </td>

                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-bold font-mono ${
                                parseFloat(pct) >= 80
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : parseFloat(pct) >= 50
                                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
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
                              <span>{isPassed ? 'PASSED' : 'NEEDS PRACTICE'}</span>
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

