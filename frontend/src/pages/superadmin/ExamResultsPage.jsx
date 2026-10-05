import React, { useState, useEffect, useMemo } from 'react';
import { apiClient } from '../../api/client';
import {
  FileCheck2,
  Search,
  Award,
  CheckCircle2,
  XCircle,
  Eye,
  Clock,
  BarChart3,
  ArrowLeft,
  User,
  Check,
  X,
  Printer,
  ChevronLeft,
  ChevronRight,
  Filter,
  Layers,
  HelpCircle,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge';

export const ExamResultsPage = () => {
  const [results, setResults] = useState([]);
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Search & Filter in list view
  const [search, setSearch] = useState('');
  const [filterExam, setFilterExam] = useState('');
  const [filterClass, setFilterClass] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // View state: 'list' | 'scorecard'
  const [viewMode, setViewMode] = useState('list');
  const [selectedResult, setSelectedResult] = useState(null);
  const [solutions, setSolutions] = useState([]);
  const [solutionFilter, setSolutionFilter] = useState('all'); // 'all' | 'correct' | 'wrong' | 'unanswered'

  const fetchResults = async () => {
    try {
      setLoading(true);
      const [resRes, exRes] = await Promise.all([
        apiClient.get('/results').catch(() => ({ success: false, data: [] })),
        apiClient.get('/exams').catch(() => ({ success: false, data: [] }))
      ]);

      let apiResults = [];
      if (resRes.success && Array.isArray(resRes.data)) {
        apiResults = resRes.data;
      }

      // Merge client saved attempts
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

      const combined = [...localList, ...apiResults];
      const seen = new Set();
      const unique = [];
      combined.forEach((r) => {
        if (!r) return;
        const uid = r.id || r.attempt_id || `${r.student_login_id || r.student_name}_${r.exam_title}_${r.submitted_at}`;
        if (!seen.has(uid)) {
          seen.add(uid);
          unique.push(r);
        }
      });

      unique.sort((a, b) => new Date(b.submitted_at || 0) - new Date(a.submitted_at || 0));
      setResults(unique);

      if (exRes.success && Array.isArray(exRes.data)) {
        setExams(exRes.data);
      }
    } catch (err) {
      console.error('Failed to load exam results:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();

    const handleExamSubmitted = () => {
      fetchResults();
    };

    window.addEventListener('exam-submitted', handleExamSubmitted);
    window.addEventListener('olympiad-exam-submitted', handleExamSubmitted);

    const interval = setInterval(() => {
      fetchResults();
    }, 4000);

    return () => {
      clearInterval(interval);
      window.removeEventListener('exam-submitted', handleExamSubmitted);
      window.removeEventListener('olympiad-exam-submitted', handleExamSubmitted);
    };
  }, []);

  const handleViewScorecard = async (attemptId) => {
    try {
      setActionLoading(true);
      const [rRes, sRes] = await Promise.all([
        apiClient.get(`/results/${attemptId}`),
        apiClient.get(`/results/${attemptId}/solutions`)
      ]);
      if (rRes.success) setSelectedResult(rRes.data);
      if (sRes.success) setSolutions(sRes.data || []);
      setViewMode('scorecard');
      setSolutionFilter('all');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      alert(err.message || 'Failed to load candidate scorecard.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleBackToList = () => {
    setViewMode('list');
    setSelectedResult(null);
    setSolutions([]);
  };

  // Filtered results
  const filteredResults = useMemo(() => {
    return (results || []).filter((r) => {
      if (!r) return false;
      const q = (search || '').trim().toLowerCase();
      const matchSearch =
        !q ||
        (r.student_name && (r.student_name || '').toLowerCase().includes(q)) ||
        (r.student_login_id && (r.student_login_id || '').toLowerCase().includes(q)) ||
        (r.exam_title && (r.exam_title || '').toLowerCase().includes(q)) ||
        (r.class_name && (r.class_name || '').toLowerCase().includes(q));

      const matchExam = !filterExam || String(r.exam_id) === String(filterExam) || r.exam_title === filterExam;
      const matchClass = !filterClass || (r.class_name && r.class_name.toLowerCase().includes(filterClass.toLowerCase()));
      const matchStatus =
        !filterStatus ||
        (filterStatus === 'passed' && (Number(r.passed) === 1 || r.passed === true)) ||
        (filterStatus === 'failed' && (Number(r.passed) === 0 || r.passed === false));

      return matchSearch && matchExam && matchClass && matchStatus;
    });
  }, [results, search, filterExam, filterClass, filterStatus]);

  const totalPages = Math.max(1, Math.ceil(filteredResults.length / pageSize));
  const paginatedResults = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredResults.slice(start, start + pageSize);
  }, [filteredResults, currentPage, pageSize]);

  // Solutions stats for the scorecard view
  const stats = useMemo(() => {
    if (!solutions || solutions.length === 0) {
      return { total: 0, correct: 0, wrong: 0, unanswered: 0 };
    }
    const correct = solutions.filter((s) => s.is_correct).length;
    const wrong = solutions.filter((s) => !s.is_correct && s.selected_option).length;
    const unanswered = solutions.filter((s) => !s.selected_option).length;
    return {
      total: solutions.length,
      correct,
      wrong,
      unanswered
    };
  }, [solutions]);

  const filteredSolutions = useMemo(() => {
    if (solutionFilter === 'correct') return solutions.filter((s) => s.is_correct);
    if (solutionFilter === 'wrong') return solutions.filter((s) => !s.is_correct && s.selected_option);
    if (solutionFilter === 'unanswered') return solutions.filter((s) => !s.selected_option);
    return solutions;
  }, [solutions, solutionFilter]);

  // ==========================================
  // VIEW 1: FULL-PAGE SCORECARD VIEW
  // ==========================================
  if (viewMode === 'scorecard' && selectedResult) {
    const isPassed = Number(selectedResult.passed) === 1;
    const scoreVal = parseFloat(selectedResult.score || 0).toFixed(1);
    const percentageVal = parseFloat(selectedResult.percentage || 0).toFixed(1);
    const accuracyVal = selectedResult.accuracy || 0;
    const rankVal = selectedResult.rank_exam ? `#${selectedResult.rank_exam}` : '#1';

    return (
      <div className="space-y-6 pb-12 animate-in fade-in duration-200">
        {/* Top Navigation & Breadcrumbs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleBackToList}
              className="p-2 bg-white hover:bg-slate-100 text-slate-700 rounded-xl border border-slate-200 shadow-2xs transition-all cursor-pointer inline-flex items-center gap-1.5 text-xs font-bold"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Results</span>
            </button>
            <div className="h-5 w-px bg-slate-200" />
            <div>
              <p className="text-[11px] font-semibold text-slate-400">
                Examination Results &gt; Candidate Scorecard
              </p>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                Candidate Performance Scorecard
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              type="button"
              onClick={() => window.print()}
              className="px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold shadow-2xs transition-all inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-slate-500" />
              <span>Print Scorecard</span>
            </button>
            <Button variant="secondary" size="sm" onClick={handleBackToList}>
              Close Full View
            </Button>
          </div>
        </div>

        {/* Candidate Profile Hero Banner */}
        <div className="bg-white rounded-3xl border border-[#edd6ed] p-6 shadow-xs">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex items-start sm:items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#4e2a4a] to-[#6d3a68] text-white flex items-center justify-center font-black text-2xl shadow-md shadow-[#4e2a4a]/20 shrink-0">
                {selectedResult.student_name ? selectedResult.student_name.charAt(0).toUpperCase() : 'S'}
              </div>
              <div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h3 className="text-xl font-black text-[#4e2a4a] leading-tight">
                    {selectedResult.student_name}
                  </h3>
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold ${
                      isPassed
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${isPassed ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                    {isPassed ? 'PASSED' : 'FAILED'}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-500 font-medium mt-1.5 flex-wrap">
                  <span className="font-mono text-[#6d3a68] font-bold bg-[#f4ebf4] px-2 py-0.5 rounded-md border border-[#edd6ed]">
                    ID: {selectedResult.student_login_id}
                  </span>
                  <span className="text-slate-300">•</span>
                  <span>School: <strong className="text-slate-800">{selectedResult.school_name || 'Independent Candidate'}</strong></span>
                  <span className="text-slate-300">•</span>
                  <span>Exam: <strong className="text-slate-800">{selectedResult.exam_title}</strong></span>
                  <span className="text-slate-300">•</span>
                  <span>Faculty: <strong className="text-[#6d3a68]">{selectedResult.teacher_author_name || 'Super Admin'}</strong></span>
                  <span className="text-slate-300">•</span>
                  <span>Submitted: <strong className="text-slate-700">{selectedResult.submitted_at}</strong></span>
                </div>
              </div>
            </div>

            {/* Overall Score Badge */}
            <div className="flex items-center gap-3 bg-[#faf5fa] p-3 rounded-2xl border border-[#edd6ed] self-start lg:self-auto">
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-[#6d3a68] block tracking-wider">Result Grade</span>
                <span className={`text-base font-black ${isPassed ? 'text-emerald-700' : 'text-rose-700'}`}>
                  {isPassed ? 'Qualified Merit' : 'Needs Improvement'}
                </span>
              </div>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-lg ${
                isPassed ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
              }`}>
                {isPassed ? '✓' : '✕'}
              </div>
            </div>
          </div>

          {/* 5 Quick Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mt-6 pt-6 border-t border-slate-100">
            {/* 1. Final Score */}
            <div className="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">
                Final Score
              </span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-2xl font-black text-slate-900 font-mono">{scoreVal}</span>
                <span className="text-xs text-slate-400 font-semibold">/ {selectedResult.total_marks || 100}</span>
              </div>
            </div>

            {/* 2. Percentage */}
            <div className={`p-3.5 rounded-2xl border ${
              isPassed ? 'bg-emerald-50/60 border-emerald-100' : 'bg-rose-50/60 border-rose-100'
            }`}>
              <span className={`text-[10px] font-bold block uppercase tracking-wider ${
                isPassed ? 'text-emerald-700' : 'text-rose-700'
              }`}>
                Percentage
              </span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className={`text-2xl font-black font-mono ${isPassed ? 'text-emerald-700' : 'text-rose-700'}`}>
                  {percentageVal}%
                </span>
              </div>
            </div>

            {/* 3. Accuracy */}
            <div className="p-3.5 bg-indigo-50/60 rounded-2xl border border-indigo-100">
              <span className="text-[10px] font-bold text-indigo-700 block uppercase tracking-wider">
                Accuracy Rate
              </span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-2xl font-black text-indigo-700 font-mono">{accuracyVal}%</span>
              </div>
            </div>

            {/* 4. Olympiad Rank */}
            <div className="p-3.5 bg-amber-50/60 rounded-2xl border border-amber-100">
              <span className="text-[10px] font-bold text-amber-700 block uppercase tracking-wider">
                Olympiad Rank
              </span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-2xl font-black text-amber-700 font-mono">{rankVal}</span>
              </div>
            </div>

            {/* 5. Question Breakdown */}
            <div className="p-3.5 bg-teal-50/60 rounded-2xl border border-teal-100 col-span-2 sm:col-span-1">
              <span className="text-[10px] font-bold text-teal-700 block uppercase tracking-wider">
                Questions Stats
              </span>
              <div className="text-xs font-bold text-slate-700 mt-1 flex flex-col gap-0.5">
                <span className="text-emerald-700">{stats.correct} Correct</span>
                <span className="text-rose-600">{stats.wrong} Wrong • {stats.unanswered} Left</span>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Question-by-Question Evaluation Header & Filters */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-lg font-black text-slate-900 tracking-tight">
                Question-by-Question Detailed Evaluation
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Review candidate selections, verified answer keys, and step-by-step explanatory notes.
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 bg-slate-100/80 p-1 rounded-xl">
              {[
                { id: 'all', label: `All (${solutions.length})` },
                { id: 'correct', label: `Correct (${stats.correct})` },
                { id: 'wrong', label: `Wrong (${stats.wrong})` },
                { id: 'unanswered', label: `Unanswered (${stats.unanswered})` }
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSolutionFilter(tab.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    solutionFilter === tab.id
                      ? 'bg-white text-slate-900 shadow-2xs font-extrabold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Solutions List */}
          {filteredSolutions.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              No questions found for the selected filter category.
            </div>
          ) : (
            <div className="space-y-4">
              {filteredSolutions.map((sol, idx) => {
                const isCorrect = sol.is_correct;
                const isUnanswered = !sol.selected_option;
                const isWrong = !isCorrect && !isUnanswered;

                return (
                  <div
                    key={sol.question_id || idx}
                    className={`p-5 rounded-2xl border transition-all ${
                      isCorrect
                        ? 'bg-emerald-50/20 border-emerald-200/80'
                        : isWrong
                        ? 'bg-rose-50/20 border-rose-200/80'
                        : 'bg-slate-50/50 border-slate-200'
                    }`}
                  >
                    {/* Question Header */}
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-slate-900 text-white font-black text-xs flex items-center justify-center font-mono">
                          {idx + 1}
                        </span>
                        <span className="text-xs font-bold text-slate-500">
                          Question #{sol.question_id || idx + 1}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                            isCorrect
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              : isWrong
                              ? 'bg-rose-100 text-rose-800 border border-rose-200'
                              : 'bg-slate-200 text-slate-700'
                          }`}
                        >
                          {isCorrect ? '✓ CORRECT' : isWrong ? '✕ WRONG' : '○ UNANSWERED'}
                        </span>
                      </div>
                    </div>

                    {/* Problem Statement */}
                    <h4 className="text-sm font-bold text-slate-900 leading-relaxed">
                      {sol.question_text}
                    </h4>

                    {/* Side-by-Side Answers Comparison */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 text-xs">
                      {/* Candidate Selection */}
                      <div
                        className={`p-3 rounded-xl border flex items-center justify-between ${
                          isCorrect
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                            : isWrong
                            ? 'bg-rose-50 border-rose-200 text-rose-900'
                            : 'bg-slate-50 border-slate-200 text-slate-600'
                        }`}
                      >
                        <div>
                          <span className="text-[10px] font-bold uppercase block opacity-75">
                            Candidate Selected
                          </span>
                          <p className="font-extrabold text-sm mt-0.5">
                            {sol.selected_option ? `Option ${sol.selected_option}` : 'Not Answered (Skipped)'}
                          </p>
                        </div>
                        <span className="font-bold text-lg">
                          {isCorrect ? '✓' : isWrong ? '✕' : '—'}
                        </span>
                      </div>

                      {/* Correct Option */}
                      <div className="p-3 bg-emerald-50/80 border border-emerald-300 rounded-xl text-emerald-950 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] font-bold text-emerald-700 uppercase block tracking-wider">
                            Verified Correct Answer
                          </span>
                          <p className="font-extrabold text-sm text-emerald-900 mt-0.5">
                            Option {sol.correct_option}
                          </p>
                        </div>
                        <span className="font-bold text-lg text-emerald-600">✓</span>
                      </div>
                    </div>

                    {/* Explanation / Solution Note */}
                    {sol.explanation && (
                      <div className="mt-3.5 p-3.5 bg-amber-50/60 border border-amber-200/80 rounded-xl text-xs text-amber-950">
                        <span className="text-[10px] font-black uppercase text-amber-800 tracking-wider block mb-1">
                          💡 Solution Explanation & Rationale:
                        </span>
                        <p className="leading-relaxed font-medium">{sol.explanation}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Bottom Back Button */}
          <div className="flex justify-end pt-4 border-t border-slate-100">
            <Button variant="secondary" size="sm" icon={ArrowLeft} onClick={handleBackToList}>
              Back to All Exam Results
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW 2: ALL EXAM RESULTS LIST TABLE
  // ==========================================
  return (
    <div className="space-y-6 font-sans">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-[#4e2a4a]">
            Examination Results &amp; Scorecards
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Detailed candidate performance evaluation, question-wise breakdown, and ranking analytics.
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#edd6ed] shadow-2xs space-y-3">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search by student name, roll number, or exam title..."
            className="w-full pl-10 pr-10 py-2.5 bg-[#faf5fa] hover:bg-white border border-[#edd6ed] rounded-xl text-xs text-[#4e2a4a] placeholder-slate-400 focus:outline-none focus:border-[#6d3a68] focus:bg-white transition-all font-medium"
          />
          {search && (
            <button
              type="button"
              onClick={() => {
                setSearch('');
                setCurrentPage(1);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 rounded-md"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs items-end">
          <div>
            <label className="text-[10px] font-bold text-[#6d3a68] uppercase tracking-wider block mb-1.5">
              Filter by Exam
            </label>
            <select
              value={filterExam}
              onChange={(e) => {
                setFilterExam(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full h-9 px-3 bg-[#faf5fa] border border-[#edd6ed] rounded-xl text-xs font-semibold text-[#4e2a4a] focus:outline-none focus:border-[#6d3a68] transition-all cursor-pointer"
            >
              <option value="">All Olympiad Exams</option>
              {exams.map((ex) => (
                <option key={ex.id} value={ex.id}>{ex.title}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold text-[#6d3a68] uppercase tracking-wider block mb-1.5">
              Filter by Class
            </label>
            <select
              value={filterClass}
              onChange={(e) => {
                setFilterClass(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full h-9 px-3 bg-[#faf5fa] border border-[#edd6ed] rounded-xl text-xs font-semibold text-[#4e2a4a] focus:outline-none focus:border-[#6d3a68] transition-all cursor-pointer"
            >
              <option value="">All Classes</option>
              {Array.from({ length: 12 }, (_, i) => `Class ${i + 1}`).map((cls) => (
                <option key={cls} value={cls}>{cls}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold text-[#6d3a68] uppercase tracking-wider block mb-1.5">
              Result Status
            </label>
            <select
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full h-9 px-3 bg-[#faf5fa] border border-[#edd6ed] rounded-xl text-xs font-semibold text-[#4e2a4a] focus:outline-none focus:border-[#6d3a68] transition-all cursor-pointer"
            >
              <option value="">All Statuses</option>
              <option value="passed">Passed Candidates Only</option>
              <option value="failed">Failed Candidates Only</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold text-transparent select-none uppercase tracking-wider block mb-1.5">
              Reset
            </label>
            <button
              type="button"
              onClick={() => {
                setSearch('');
                setFilterExam('');
                setFilterClass('');
                setFilterStatus('');
                setCurrentPage(1);
              }}
              className="w-full h-9 px-3 bg-[#faf5fa] hover:bg-[#f4ebf4] text-[#6d3a68] rounded-xl text-xs font-bold transition-all cursor-pointer inline-flex items-center justify-center gap-1.5 border border-[#edd6ed] shadow-2xs active:scale-[0.98]"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#6d3a68]" />
              <span>Clear Filters</span>
            </button>
          </div>
        </div>
      </div>

      {/* Results Table */}
      <div className="bg-white rounded-2xl border border-[#edd6ed] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#faf5fa] border-b border-[#edd6ed] text-[#6d3a68] text-[10px] uppercase font-bold tracking-wider">
              <tr>
                <th className="py-3.5 px-3 w-10 text-center">#</th>
                <th className="py-3.5 px-4">Candidate Name</th>
                <th className="py-3.5 px-4">School</th>
                <th className="py-3.5 px-3">Class</th>
                <th className="py-3.5 px-4">Exam Title &amp; Subject</th>
                <th className="py-3.5 px-4">Score</th>
                <th className="py-3.5 px-4">Percentage</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Submitted At</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#fdf2f8]">
              {loading ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-slate-400">
                    Loading candidate results...
                  </td>
                </tr>
              ) : paginatedResults.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-slate-400">
                    No exam results match your filter criteria.
                  </td>
                </tr>
              ) : (
                paginatedResults.map((r, idx) => {
                  const indexNumber = (currentPage - 1) * pageSize + idx + 1;
                  return (
                    <tr key={r.id} className="hover:bg-[#faf5fa] transition-colors">
                      <td className="py-3.5 px-3 text-center font-mono font-bold text-slate-400 text-xs">
                        {indexNumber}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-[#6d3a68] text-white flex items-center justify-center font-bold text-xs shadow-2xs">
                            {r.student_name ? r.student_name.charAt(0).toUpperCase() : 'S'}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">{r.student_name}</p>
                            <p className="text-[11px] font-mono text-slate-400">{r.student_login_id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-slate-700 block max-w-[180px] truncate" title={r.school_name || 'Independent Candidate'}>
                          {r.school_name || 'Independent Candidate'}
                        </span>
                      </td>
                      <td className="py-3.5 px-3">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold bg-[#f4ebf4] text-[#6d3a68] border border-[#edd6ed]">
                          {r.class_name || 'Class 6'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-800">
                        <p className="font-bold text-slate-900">{r.exam_title}</p>
                        <div className="flex items-center gap-2 text-[10px] text-slate-500 font-medium mt-0.5">
                          {r.subject_name && (
                            <span className="text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-100">
                              {r.subject_name}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-[#4e2a4a] font-mono">
                        {parseFloat(r.score).toFixed(1)} / {r.total_marks || r.exam_total_marks || 2}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-[#6d3a68] font-mono">
                        {parseFloat(r.percentage).toFixed(1)}%
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                            Number(r.passed) === 1
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${Number(r.passed) === 1 ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                          {Number(r.passed) === 1 ? 'Passed' : 'Failed'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 font-medium text-[11px]">
                        {r.submitted_at}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => handleViewScorecard(r.id)}
                          className="px-3 py-1.5 bg-[#f4ebf4] hover:bg-[#edd6ed] text-[#6d3a68] rounded-xl text-xs font-bold transition-all inline-flex items-center gap-1 shadow-2xs cursor-pointer active:scale-95"
                        >
                          <Eye className="w-3.5 h-3.5 text-[#6d3a68]" />
                          <span>Scorecard</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {!loading && filteredResults.length > 0 && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 py-4 border-t border-slate-100 bg-slate-50/60">
            <div className="text-xs font-semibold text-slate-500">
              Showing <span className="font-bold text-slate-900">{(currentPage - 1) * pageSize + 1}</span> to{' '}
              <span className="font-bold text-slate-900">{Math.min(currentPage * pageSize, filteredResults.length)}</span> of{' '}
              <span className="font-bold text-slate-900">{filteredResults.length}</span> results
            </div>

            {totalPages > 1 && (
              <div className="flex items-center gap-1.5 self-end sm:self-auto">
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 hover:text-indigo-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer shadow-2xs"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Previous</span>
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                    <button
                      key={pageNum}
                      type="button"
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-8 h-8 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        pageNum === currentPage
                          ? 'bg-indigo-600 text-white shadow-xs shadow-indigo-600/30 font-extrabold'
                          : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-indigo-600'
                      }`}
                    >
                      {pageNum}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 hover:text-indigo-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer shadow-2xs"
                >
                  <span>Next</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
