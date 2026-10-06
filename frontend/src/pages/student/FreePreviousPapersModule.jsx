import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { apiClient } from '../../api/client';
import { DownloadPaperPdfModal } from '../../components/common/DownloadPaperPdfModal';
import { DetailedSolutionsPage } from './DetailedSolutionsPage';
import {
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Download,
  Play,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Check,
  Bookmark,
  Award,
  BookOpen,
  Laptop,
  Rocket,
  Calculator,
  Globe,
  Brain,
  Eye,
  X,
  FileCheck2,
  MessageSquare,
  AlertTriangle,
  AlertCircle,
  Trophy,
  ShieldCheck,
  Printer,
  Send,
  Lightbulb,
  PlusCircle,
  Layers
} from 'lucide-react';

const YEARS_OPTIONS = ['2025', '2024', '2023', '2022', '2021', '2020', '2019', '2018'];
const SAMPLE_SETS_OPTIONS = ['Set 1', 'Set 2', 'Set 3'];
const CLASSES_OPTIONS = [
  'Class 1',
  'Class 2',
  'Class 3',
  'Class 4',
  'Class 5',
  'Class 6',
  'Class 7',
  'Class 8',
  'Class 9',
  'Class 10',
  'Class 11',
  'Class 12'
];

const SUBJECTS_CONFIG = {
  english: { name: 'IEO (English)', code: 'IEO', color: '#ea580c', letter: 'E', icon: BookOpen },
  math: { name: 'IMO (Maths)', code: 'IMO', color: '#eab308', letter: 'M', icon: Calculator },
  science: { name: 'ISO (Science)', code: 'ISO', color: '#16a34a', letter: 'S', icon: Rocket },
  cyber: { name: 'ICSO (Cyber)', code: 'ICSO', color: '#0284c7', letter: 'C', icon: Laptop },
  gk: { name: 'IGKO (GK)', code: 'IGKO', color: '#e7b84b', letter: 'G', icon: Globe },
  reasoning: { name: 'ISSO (Reasoning)', code: 'ISSO', color: '#7c3aed', letter: 'R', icon: Brain }
};

export const FreePreviousPapersModule = ({ mode = 'previous_year', onNavigateTab, onStartExam, onExitToDashboard }) => {
  const { user } = useAuth();
  const isPYQ = mode === 'previous_year';
  const pageTitle = isPYQ ? 'Free Olympiad Previous Year Papers (PYQ)' : 'Free Official Olympiad Sample Papers';
  const pageSub = isPYQ
    ? 'Official Exam Papers Authored & Published by Super Admin with Solutions'
    : 'Official Sample Papers Authored & Published by Super Admin with Solutions';

  // Step state: 'configure' -> 'instructions' -> 'live_test' -> 'result'
  const [currentStep, setCurrentStep] = useState('configure');

  // Step 1 Selection State
  const [selectedClass, setSelectedClass] = useState(user?.class || 'Class 6');
  const [selectedSubjectKey, setSelectedSubjectKey] = useState('math');
  const [selectedYear, setSelectedYear] = useState('2024');
  const [selectedSampleSet, setSelectedSampleSet] = useState('Set 1');
  const [hasAgreedInstructions, setHasAgreedInstructions] = useState(true);
  const [pdfModalPaper, setPdfModalPaper] = useState(null);

  // Super Admin Papers State
  const [adminPapers, setAdminPapers] = useState([]);
  const [loadingPapers, setLoadingPapers] = useState(false);

  // Live Exam State
  const [activePaper, setActivePaper] = useState(null);
  const [examQuestions, setExamQuestions] = useState([]);
  const [activeQuestionIdx, setActiveQuestionIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [flaggedQuestions, setFlaggedQuestions] = useState({});
  const [visitedQuestions, setVisitedQuestions] = useState({ 0: true });
  const [timeRemaining, setTimeRemaining] = useState(3600); // in seconds
  const [testResult, setTestResult] = useState(null);
  const [reviewFilter, setReviewFilter] = useState('all');
  const [saveStatus, setSaveStatus] = useState('idle'); // 'idle' | 'saving' | 'saved'
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  // Fetch all real papers authored in Super Admin for this mode
  const fetchPapers = async (paperMode = mode) => {
    setLoadingPapers(true);
    try {
      const token = localStorage.getItem('token');
      const url = `/api/test-generator/admin-papers?paper_category=${encodeURIComponent(paperMode)}`;
      const [genRes, examRes] = await Promise.all([
        fetch(url, {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          }
        }).then(r => r.json()).catch(() => ({ success: false })),
        apiClient.get('/exam-papers').catch(() => ({ success: false }))
      ]);

      let fetched = [];
      if (genRes && genRes.success && Array.isArray(genRes.data)) {
        fetched = [...genRes.data];
      }

      if (examRes && examRes.success && Array.isArray(examRes.data)) {
        const matchingCategoryExams = examRes.data.filter((ep) => {
          const cat = (ep.category || ep.paper_category || ep.paper_type || '').toLowerCase();
          const t = (ep.title || '').toLowerCase();
          if (paperMode === 'previous_year') {
            return cat.includes('previous') || cat.includes('pyq') || cat.includes('past') || t.includes('previous year') || t.includes('pyq');
          } else if (paperMode === 'sample_paper') {
            return cat.includes('sample') || t.includes('sample paper');
          }
          return false;
        });
        matchingCategoryExams.forEach((me) => {
          if (!fetched.some(f => f.id === me.id || f.title === me.title)) {
            fetched.push(me);
          }
        });
      }

      // Merge with localStorage
      const local = JSON.parse(localStorage.getItem('admin_generator_papers') || '[]');
      const combined = [...fetched];
      if (Array.isArray(local)) {
        local.forEach((lp) => {
          if (
            (lp.paper_category === paperMode || (!lp.paper_category && paperMode === 'generator')) &&
            !combined.some((cp) => cp.id === lp.id || (cp.title === lp.title && (cp.class_name === lp.class_name || cp.class === lp.class)))
          ) {
            combined.push(lp);
          }
        });
      }

      const formatted = combined.map((p) => {
        const subCode = (p.subject_code || p.subject || 'IMO').toUpperCase();
        const subLower = (p.subject || p.subject_name || '').toLowerCase();
        const color =
          subLower.includes('cyber') || subLower.includes('icso') || subLower.includes('ico')
            ? '#0284c7'
            : subLower.includes('sci') || subLower.includes('iso') || subLower.includes('nso')
            ? '#16a34a'
            : subLower.includes('math') || subLower.includes('imo')
            ? '#eab308'
            : subLower.includes('eng') || subLower.includes('ieo')
            ? '#ea580c'
            : subLower.includes('gk') || subLower.includes('igko')
            ? '#e7b84b'
            : '#7c3aed';

        const qs = Array.isArray(p.questions)
          ? p.questions.map((q, idx) => ({
              id: q.id || idx + 1,
              section: q.section || 'General Section',
              q: q.q || q.question_text || `Question ${idx + 1}`,
              options:
                Array.isArray(q.options) && q.options.length >= 2
                  ? q.options
                  : [q.option_a || 'Option A', q.option_b || 'Option B', q.option_c || 'Option C', q.option_d || 'Option D'],
              correct:
                typeof q.correct === 'number'
                  ? q.correct
                  : q.correct_option === 'B'
                  ? 1
                  : q.correct_option === 'C'
                  ? 2
                  : q.correct_option === 'D'
                  ? 3
                  : 0,
              marks: q.marks || 1,
              explanation: q.explanation || ''
            }))
          : [];

        // Extract class name
        const rawClass = p.class_name || p.class || p.title || '';
        let resolvedClass = 'Class 6';
        const matchDigits = rawClass.match(/\d+/);
        if (matchDigits) {
          resolvedClass = `Class ${matchDigits[0]}`;
        }

        return {
          id: p.id,
          code: subCode,
          subject: p.subject || subCode,
          subjectName: p.subject_name || p.title || `${subCode} Olympiad`,
          title: p.title || `${resolvedClass} ${subCode} ${paperMode === 'sample_paper' ? 'Sample Paper' : `PYQ`}`,
          shortCode: paperMode === 'sample_paper' ? `${subCode} - Sample` : `${subCode} - ${p.exam_year || 'PYQ'}`,
          year: p.exam_year || '2024',
          durationMinutes: parseInt(p.duration_minutes) || 60,
          totalQuestions: qs.length,
          totalMarks: parseFloat(p.total_marks || qs.length) || qs.length || 1,
          accentColor: color,
          questions: qs,
          class: resolvedClass
        };
      });

      setAdminPapers(formatted);
    } catch (e) {
      console.warn('Error fetching admin papers:', e);
      setAdminPapers([]);
    } finally {
      setLoadingPapers(false);
    }
  };

  useEffect(() => {
    fetchPapers(mode);
  }, [mode]);

  // Papers filtered by current selected grade
  const papersForSelectedClass = adminPapers.filter((p) => {
    const pMatch = (p.class || '').match(/\d+/);
    const selMatch = (selectedClass || '').match(/\d+/);
    return pMatch && selMatch && pMatch[0] === selMatch[0];
  });

  // Helper to find matching paper for current Class + Subject
  const getMatchingPaper = (grade = selectedClass, subKey = selectedSubjectKey, yr = selectedYear) => {
    const subMap = {
      math: ['imo', 'math', 'mathematics'],
      science: ['iso', 'science', 'nso'],
      cyber: ['ico', 'icso', 'cyber', 'computer', 'computers', 'ai'],
      english: ['ieo', 'english'],
      gk: ['igko', 'gk', 'general knowledge'],
      reasoning: ['lro', 'iro', 'isso', 'reasoning', 'social studies', 'aptitude']
    };
    const validCodes = subMap[subKey] || [subKey];

    // 1. First try matching exact class + subject + year (if PYQ)
    const exact = adminPapers.find((p) => {
      const pMatch = (p.class || '').match(/\d+/);
      const selMatch = (grade || '').match(/\d+/);
      if (!pMatch || !selMatch || pMatch[0] !== selMatch[0]) return false;

      const subCode = (p.code || p.subject || p.subjectName || '').toLowerCase().trim();
      const matchSub = validCodes.some((code) => subCode.includes(code) || (p.title || '').toLowerCase().includes(code));
      if (!matchSub) return false;

      if (isPYQ && yr && p.year && String(p.year) === String(yr)) {
        return true;
      }
      return !isPYQ;
    });

    if (exact) return exact;

    // 2. Fallback to matching class + subject regardless of year
    return adminPapers.find((p) => {
      const pMatch = (p.class || '').match(/\d+/);
      const selMatch = (grade || '').match(/\d+/);
      if (!pMatch || !selMatch || pMatch[0] !== selMatch[0]) return false;

      const subCode = (p.code || p.subject || p.subjectName || '').toLowerCase().trim();
      return validCodes.some((code) => subCode.includes(code) || (p.title || '').toLowerCase().includes(code));
    });
  };

  const matchingPaper = getMatchingPaper(selectedClass, selectedSubjectKey, selectedYear);
  const hasMatchingPaper = !!(matchingPaper && Array.isArray(matchingPaper.questions) && matchingPaper.questions.length > 0);

  // Proceed to Step 2: Test Guidelines & Instructions
  const handleProceedToInstructions = (paperToUse) => {
    const paper = paperToUse || matchingPaper;
    if (!paper || !Array.isArray(paper.questions) || paper.questions.length === 0) {
      alert(`⚠️ No paper found for ${selectedClass} (${SUBJECTS_CONFIG[selectedSubjectKey]?.name}).\n\nPlease create and publish an exam paper from Super Admin panel for this class.`);
      return;
    }
    setActivePaper(paper);
    setCurrentStep('instructions');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Start Live Test (Step 3) - Directly loads Super Admin questions and starts
  const handleStartTest = (paperToUse) => {
    const paper = paperToUse || activePaper || matchingPaper;
    if (!paper || !Array.isArray(paper.questions) || paper.questions.length === 0) {
      alert(`⚠️ No questions found in this paper. Please author questions in Super Admin panel.`);
      return;
    }

    setActivePaper(paper);
    setExamQuestions(paper.questions);
    setActiveQuestionIdx(0);
    setSelectedAnswers({});
    setFlaggedQuestions({});
    setVisitedQuestions({ 0: true });
    setTimeRemaining((paper.durationMinutes || 60) * 60);
    setTestResult(null);
    setCurrentStep('live_test');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Timer countdown during live test
  useEffect(() => {
    if (currentStep !== 'live_test') return;
    if (timeRemaining <= 0) {
      handleSubmitTest();
      return;
    }
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [currentStep, timeRemaining]);

  // Option selection
  const handleSelectOption = (qIdx, optIdx) => {
    setSelectedAnswers((prev) => ({ ...prev, [qIdx]: optIdx }));
  };

  // Toggle flag / review
  const handleToggleFlag = (qIdx) => {
    setFlaggedQuestions((prev) => ({ ...prev, [qIdx]: !prev[qIdx] }));
  };

  // Clear answer
  const handleClearAnswer = (qIdx) => {
    setSelectedAnswers((prev) => {
      const next = { ...prev };
      delete next[qIdx];
      return next;
    });
  };

  // Jump question
  const handleJumpQuestion = (idx) => {
    if (idx >= 0 && idx < examQuestions.length) {
      setActiveQuestionIdx(idx);
      setVisitedQuestions((prev) => ({ ...prev, [idx]: true }));
    }
  };

  // Submit test and compute results (Step 4)
  const handleSubmitTest = () => {
    const totalQ = examQuestions.length;
    let correctCount = 0;
    let earnedMarks = 0;
    let totalMarks = 0;

    const detailedSolutions = examQuestions.map((q, idx) => {
      const chosen = selectedAnswers[idx];
      const qMarks = q.marks || 1;
      totalMarks += qMarks;

      const isCorrect = chosen !== undefined && chosen === q.correct;
      const optLetter = chosen !== undefined ? String.fromCharCode(65 + chosen) : null;
      const correctLetter = String.fromCharCode(65 + (typeof q.correct === 'number' ? q.correct : 0));

      if (isCorrect) {
        correctCount += 1;
        earnedMarks += qMarks;
      }

      return {
        id: q.id || idx + 1,
        question_text: q.q || q.question_text || `Question ${idx + 1}`,
        q: q.q || q.question_text,
        options: q.options,
        option_a: q.options?.[0] || q.option_a || 'Option A',
        option_b: q.options?.[1] || q.option_b || 'Option B',
        option_c: q.options?.[2] || q.option_c || 'Option C',
        option_d: q.options?.[3] || q.option_d || 'Option D',
        selected_option: optLetter,
        correct_option: correctLetter,
        is_correct: isCorrect,
        marks: qMarks,
        explanation: q.explanation || 'Refer to the official Olympiad step-by-step logic.'
      };
    });

    const answeredCount = Object.keys(selectedAnswers).length;
    const unansweredCount = totalQ - answeredCount;
    const pct = totalMarks > 0 ? Math.round((earnedMarks / totalMarks) * 100) : 0;
    const timeSpentSec = (activePaper?.durationMinutes || 60) * 60 - timeRemaining;
    const timeSpentMin = Math.max(1, Math.round(timeSpentSec / 60));

    const resultSummary = {
      paperId: activePaper?.id || 'pyq',
      paperTitle: activePaper?.title || `${selectedClass} ${isPYQ ? 'Previous Year Paper' : 'Sample Paper'}`,
      paperMode: mode,
      grade: selectedClass,
      subjectKey: selectedSubjectKey,
      subjectName: activePaper?.subjectName || SUBJECTS_CONFIG[selectedSubjectKey]?.name || 'Olympiad',
      year: activePaper?.year || selectedYear,
      totalQuestions: totalQ,
      answeredCount,
      unansweredCount,
      correctCount,
      wrongCount: Math.max(0, answeredCount - correctCount),
      earnedMarks,
      totalMarks,
      percentage: pct,
      timeSpentMinutes: timeSpentMin,
      timeSpentSeconds: timeSpentSec,
      passed: pct >= 40,
      solutions: detailedSolutions,
      attemptMeta: {
        exam_title: activePaper?.title || `${selectedClass} ${isPYQ ? 'Previous Year Paper' : 'Sample Paper'}`,
        total_marks: totalMarks || 60,
        score: earnedMarks,
        cutoff_marks: Math.round((totalMarks || 60) * 0.7),
        time_taken_seconds: timeSpentSec,
        duration_minutes: activePaper?.durationMinutes || 60
      }
    };

    setTestResult(resultSummary);
    setCurrentStep('result');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Auto-save to Super Admin backend
    setSaveStatus('saving');
    const payload = {
      title: activePaper?.title || `${selectedClass} ${isPYQ ? 'Previous Year Paper' : 'Sample Paper'}`,
      subject: activePaper?.subject || selectedSubjectKey,
      class: selectedClass,
      grade: selectedClass,
      level: isPYQ ? `Previous Year Paper (${selectedYear})` : 'Free Sample Paper',
      difficulty: 'Standard Olympiad',
      totalQuestions: totalQ,
      durationMinutes: activePaper?.durationMinutes || 60,
      timeSpentSeconds: timeSpentSec,
      score: earnedMarks,
      totalMarks: totalMarks,
      percentage: pct,
      correctCount,
      wrongCount: Math.max(0, answeredCount - correctCount),
      unansweredCount,
      student_id: user?.id || null,
      student_name: user?.full_name || user?.name || null,
      student_login_id: user?.login_id || null,
      student_email: user?.email || null,
      student_school: user?.school_name || user?.school || null,
      questions: detailedBreakdown
    };

    // Save attempt to client storage
    const newAttemptRecord = {
      id: Date.now(),
      attempt_id: Date.now(),
      exam_id: activePaper?.id || Date.now(),
      exam_title: payload.title,
      title: payload.title,
      paper_title: payload.title,
      subject: activePaper?.subjectName || SUBJECTS_CONFIG[selectedSubjectKey]?.name || 'Olympiad',
      subject_name: activePaper?.subjectName || SUBJECTS_CONFIG[selectedSubjectKey]?.name || 'Olympiad',
      subject_code: selectedSubjectKey?.toUpperCase() || 'IMO',
      score: earnedMarks,
      total_marks: totalMarks,
      total_questions: totalQ,
      correct_count: correctCount,
      incorrect_count: Math.max(0, answeredCount - correctCount),
      unanswered_count: unansweredCount,
      percentage: pct,
      accuracy: answeredCount > 0 ? Math.round((correctCount / answeredCount) * 100) : pct,
      passed: pct >= 40,
      time_taken_seconds: timeSpentSec,
      submitted_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
      student_id: user?.id || 1,
      student_name: user?.full_name || user?.name || 'Candidate',
      student_login_id: user?.login_id || 'STU-001',
      student_email: user?.email || '',
      student_school: user?.school_name || 'Independent Candidate',
      class_name: selectedClass,
      questions: detailedBreakdown
    };

    try {
      const existing = JSON.parse(localStorage.getItem('olympiadhub_student_attempts') || '[]');
      localStorage.setItem('olympiadhub_student_attempts', JSON.stringify([newAttemptRecord, ...existing]));
      const existingResults = JSON.parse(localStorage.getItem('olympiadhub_db_results') || '[]');
      localStorage.setItem('olympiadhub_db_results', JSON.stringify([newAttemptRecord, ...existingResults]));
    } catch (e) {}

    apiClient.post('/test-generator/submit', payload)
      .then((data) => {
        setSaveStatus('saved');
        window.dispatchEvent(new CustomEvent('olympiad-exam-submitted', { detail: newAttemptRecord }));
        window.dispatchEvent(new Event('exam-submitted'));
      })
      .catch((err) => {
        console.warn('Auto-save result error:', err);
        setSaveStatus('saved');
        window.dispatchEvent(new CustomEvent('olympiad-exam-submitted', { detail: newAttemptRecord }));
        window.dispatchEvent(new Event('exam-submitted'));
      });
  };

  // Format Timer
  const formatTimer = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // =========================================================================
  // STEP 3: LIVE EXAM QUESTION PAPER PLAYER (Interactive Exam Engine)
  // =========================================================================
  if (currentStep === 'live_test') {
    const currentQ = examQuestions[activeQuestionIdx] || {};
    const isAnswered = selectedAnswers[activeQuestionIdx] !== undefined;
    const isFlagged = !!flaggedQuestions[activeQuestionIdx];
    const totalAnswered = Object.keys(selectedAnswers).length;
    const totalFlagged = Object.values(flaggedQuestions).filter(Boolean).length;
    const totalQuestionsCount = examQuestions.length;
    const totalUnanswered = totalQuestionsCount - totalAnswered;

    return (
      <div className="space-y-5 font-sans animate-in fade-in duration-150 max-w-7xl mx-auto pb-12">
        {/* Top Clean Test Header Bar (Properly spaced without overlapping) */}
        <div className="bg-white rounded-3xl border border-[#edd6ed] p-4 sm:p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#f4ebf4] text-[#6d3a68] flex items-center justify-center font-black text-sm shrink-0 shadow-2xs">
              Q{activeQuestionIdx + 1}
            </div>
            <div className="min-w-0">
              <h2 className="text-sm sm:text-base font-black text-[#4e2a4a] truncate">
                {activePaper?.title || `${selectedClass} ${isPYQ ? 'Previous Year Paper' : 'Sample Paper'}`}
              </h2>
              <p className="text-xs text-slate-500 font-semibold truncate">
                {selectedClass} • {activePaper?.subjectName || SUBJECTS_CONFIG[selectedSubjectKey]?.name} • Question {activeQuestionIdx + 1} of {totalQuestionsCount}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
            {/* Live Countdown Timer */}
            <div
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border font-mono font-black text-sm ${
                timeRemaining < 300
                  ? 'bg-red-50 text-red-600 border-red-200 animate-pulse'
                  : 'bg-[#faf5fa] text-[#6d3a68] border-[#edd6ed]'
              }`}
            >
              <Clock className="w-4 h-4 text-[#6d3a68]" />
              <span>{formatTimer(timeRemaining)}</span>
            </div>

            {/* Exit Test */}
            <button
              type="button"
              onClick={() => setShowExitConfirm(true)}
              className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
            >
              Exit
            </button>

            {/* Submit Test Button */}
            <button
              type="button"
              onClick={() => setShowExitConfirm(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#fff0f3] hover:bg-[#ffe3e8] text-[#c2185b] border border-[#f8bbd0] font-bold text-xs sm:text-sm shadow-xs transition-all active:scale-95 cursor-pointer"
            >
              <Send className="w-4 h-4 text-[#c2185b]" />
              <span>Submit Test</span>
            </button>
          </div>
        </div>

        {/* Modal: Exit / Submit Confirmation (Exact replica of user screenshot) */}
        {showExitConfirm && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
            <div className="bg-white rounded-xl max-w-lg w-full p-6 sm:p-7 border border-slate-300 shadow-2xl space-y-6 relative animate-in zoom-in-95">
              <button
                type="button"
                onClick={() => setShowExitConfirm(false)}
                className="absolute top-3 right-3 text-slate-400 hover:text-slate-600 p-1 text-sm font-bold cursor-pointer"
                title="Close and stay in test"
              >
                ✕
              </button>

              <div className="pt-2">
                <p className="text-sm sm:text-[15px] font-normal text-slate-800 leading-relaxed">
                  Do you want to end test? Please make sure all attempted questions are marked GREEN.
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowExitConfirm(false);
                    handleSubmitTest();
                  }}
                  className="px-6 py-2 rounded bg-[#0284c7] hover:bg-[#0369a1] text-white font-black text-xs uppercase tracking-wider shadow-sm active:scale-95 transition-all cursor-pointer"
                >
                  YES
                </button>
                <button
                  type="button"
                  onClick={() => setShowExitConfirm(false)}
                  className="px-6 py-2 rounded bg-[#dc2626] hover:bg-[#b91c1c] text-white font-black text-xs uppercase tracking-wider shadow-sm active:scale-95 transition-all cursor-pointer"
                >
                  NO
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 2-Column Test Layout: Left (Question & Options) + Right (Question Palette) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* LEFT 8 COLS: 1-by-1 MCQ Viewer */}
          <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border border-[#edd6ed] shadow-sm flex flex-col justify-between min-h-[500px]">
            <div className="space-y-5">
              {/* Question Header */}
              <div className="flex items-center justify-between pb-3 border-b border-[#f4ebf4]">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-[#f4ebf4] text-[#6d3a68] font-black text-xs uppercase">
                    Question {activeQuestionIdx + 1} of {totalQuestionsCount}
                  </span>
                  {isFlagged && (
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold text-xs flex items-center gap-1">
                      <Bookmark className="w-3 h-3 fill-amber-700" />
                      Marked for Review
                    </span>
                  )}
                </div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  +{currentQ.marks || 1}.00 Marks
                </span>
              </div>

              {/* Question Statement */}
              <div>
                <h3 className="text-base sm:text-lg font-bold text-[#321630] leading-relaxed">
                  {currentQ.q || 'Question statement loading...'}
                </h3>
              </div>

              {/* 4 Selectable Options (A, B, C, D) */}
              <div className="space-y-3 pt-2">
                {currentQ.options?.map((optionText, optIdx) => {
                  const isSelected = selectedAnswers[activeQuestionIdx] === optIdx;
                  const optionLabel = String.fromCharCode(65 + optIdx);

                  return (
                    <button
                      key={optIdx}
                      type="button"
                      onClick={() => handleSelectOption(activeQuestionIdx, optIdx)}
                      className={`w-full p-4 rounded-2xl border text-left text-xs sm:text-sm font-semibold transition-all flex items-center justify-between cursor-pointer group ${
                        isSelected
                          ? 'bg-[#f4ebf4] border-[#6d3a68] text-[#4e2a4a] ring-2 ring-[#6d3a68]/20 shadow-xs'
                          : 'bg-white border-[#edd6ed] text-slate-700 hover:bg-[#faf5fa] hover:border-[#6d3a68]/40'
                      }`}
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <span
                          className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs transition-all shrink-0 ${
                            optionLabel === 'A'
                              ? isSelected
                                ? 'bg-red-100 border-2 border-red-400 text-red-700 ring-2 ring-red-200 shadow-xs'
                                : 'bg-red-50 border border-red-200 text-red-700 hover:bg-red-100'
                              : optionLabel === 'B'
                              ? isSelected
                                ? 'bg-emerald-100 border-2 border-emerald-400 text-emerald-700 ring-2 ring-emerald-200 shadow-xs'
                                : 'bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100'
                              : optionLabel === 'C'
                              ? isSelected
                                ? 'bg-amber-100 border-2 border-amber-400 text-amber-800 ring-2 ring-amber-200 shadow-xs'
                                : 'bg-amber-50 border border-amber-200 text-amber-800 hover:bg-amber-100'
                              : optionLabel === 'D'
                              ? isSelected
                                ? 'bg-orange-100 border-2 border-orange-400 text-orange-800 ring-2 ring-orange-200 shadow-xs'
                                : 'bg-orange-50 border border-orange-200 text-orange-800 hover:bg-orange-100'
                              : isSelected
                              ? 'bg-[#6d3a68]/20 text-[#6d3a68]'
                              : 'bg-[#faf5fa] text-slate-600 group-hover:bg-[#f4ebf4] group-hover:text-[#6d3a68]'
                          }`}
                        >
                          {optionLabel}
                        </span>
                        <span className="leading-snug">{optionText}</span>
                      </div>

                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-gradient-to-r from-[#2563eb] via-[#7c3aed] to-[#db2777] text-white flex items-center justify-center shrink-0">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bottom Action Controls */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-6 border-t border-[#f4ebf4] mt-6">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleToggleFlag(activeQuestionIdx)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                    isFlagged
                      ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                      : 'bg-[#faf5fa] text-slate-600 hover:bg-[#f4ebf4] hover:text-[#6d3a68]'
                  }`}
                >
                  <Bookmark className={`w-3.5 h-3.5 ${isFlagged ? 'fill-amber-700' : ''}`} />
                  <span>{isFlagged ? 'Unmark Review' : 'Mark for Review'}</span>
                </button>

                {isAnswered && (
                  <button
                    type="button"
                    onClick={() => handleClearAnswer(activeQuestionIdx)}
                    className="px-3 py-2 rounded-xl text-xs font-bold text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Clear Answer</span>
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={activeQuestionIdx === 0}
                  onClick={() => handleJumpQuestion(activeQuestionIdx - 1)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1.5 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                {activeQuestionIdx < totalQuestionsCount - 1 ? (
                  <button
                    type="button"
                    onClick={() => handleJumpQuestion(activeQuestionIdx + 1)}
                    className="px-5 py-2 rounded-xl text-xs font-black text-white bg-[#6d3a68] hover:bg-[#582d54] cursor-pointer shadow-sm flex items-center gap-1.5 transition-all"
                  >
                    <span>Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowExitConfirm(true)}
                    className="px-5 py-2 rounded-xl text-xs font-black text-white bg-[#00b074] hover:bg-[#009260] cursor-pointer shadow-md flex items-center gap-1.5 transition-all"
                  >
                    <span>Finish &amp; Submit</span>
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT 4 COLS: Question Palette & Test Summary */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#edd6ed] shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#f4ebf4]">
                <h4 className="text-xs font-black text-[#4e2a4a] uppercase tracking-wider">
                  Question Palette
                </h4>
                <span className="text-xs font-bold text-slate-500">
                  {totalAnswered} / {totalQuestionsCount} Attempted
                </span>
              </div>

              {/* Status Legend */}
              <div className="grid grid-cols-2 gap-2 text-[11px] font-semibold text-slate-600 pb-2">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-emerald-600" />
                  <span>Answered ({totalAnswered})</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-slate-200" />
                  <span>Skipped ({totalUnanswered})</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-amber-400" />
                  <span>Review ({totalFlagged})</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full border-2 border-[#6d3a68]" />
                  <span>Current Q</span>
                </div>
              </div>

              {/* Question Numbers Grid */}
              <div className="grid grid-cols-5 gap-2 max-h-[260px] overflow-y-auto custom-scrollbar p-1">
                {examQuestions.map((q, idx) => {
                  const isCur = activeQuestionIdx === idx;
                  const isAns = selectedAnswers[idx] !== undefined;
                  const isFlg = !!flaggedQuestions[idx];

                  let btnBg = 'bg-slate-100 text-slate-700 hover:bg-slate-200';
                  if (isFlg) {
                    btnBg = 'bg-amber-400 text-amber-950 font-black shadow-xs';
                  } else if (isAns) {
                    btnBg = 'bg-emerald-600 text-white font-black shadow-xs';
                  }

                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleJumpQuestion(idx)}
                      className={`h-10 rounded-xl font-bold text-xs flex items-center justify-center transition-all cursor-pointer relative ${btnBg} ${
                        isCur ? 'ring-2 ring-[#6d3a68] ring-offset-2 scale-105 z-10' : ''
                      }`}
                    >
                      <span>{idx + 1}</span>
                      {isFlg && (
                        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-600 border-2 border-white" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Submit Test Button */}
              <div className="pt-3 border-t border-[#f4ebf4]">
                <button
                  type="button"
                  onClick={() => setShowExitConfirm(true)}
                  className="w-full py-2.5 rounded-xl bg-[#fff0f3] hover:bg-[#ffe3e8] text-[#c2185b] border border-[#f8bbd0] font-bold text-xs shadow-xs transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4 text-[#c2185b]" />
                  <span>Submit Test</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // STEP 4: FULL-SCREEN SCORECARD & SOLUTION KEY (Stand-alone Full Page)
  // =========================================================================
  if (currentStep === 'result' && testResult) {
    return (
      <DetailedSolutionsPage
        initialSolutions={testResult.solutions}
        initialAttemptMeta={testResult.attemptMeta}
        onBack={() => {
          setCurrentStep('configure');
          if (onExitToDashboard) onExitToDashboard();
        }}
        onGoToList={() => {
          setCurrentStep('configure');
          if (onExitToDashboard) onExitToDashboard();
        }}
        onViewAnalysis={() => {
          if (onNavigateTab) onNavigateTab('performance');
        }}
        onNavigateTab={onNavigateTab}
      />
    );
  }

  if (false && currentStep === 'result_legacy' && testResult) {
    const isPass = testResult.percentage >= 40;
    const isGold = testResult.percentage >= 80;

    const filteredQuestions = testResult.breakdown?.filter((item) => {
      if (reviewFilter === 'correct') return item.isCorrect;
      if (reviewFilter === 'wrong') return !item.isCorrect && !item.isUnanswered;
      if (reviewFilter === 'unattempted') return item.isUnanswered;
      return true;
    }) || [];

    return (
      <div className="min-h-screen bg-slate-50 font-sans pb-24 animate-in fade-in duration-150">
        {/* Sticky Header Bar */}
        <div className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-2xs">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setCurrentStep('configure');
                  if (onExitToDashboard) onExitToDashboard();
                }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Exit to Dashboard</span>
              </button>
              <div className="h-5 w-px bg-slate-200 hidden sm:block" />
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 block">
                  {isPYQ ? 'Previous Year Paper Evaluation' : 'Sample Paper Evaluation'}
                </span>
                <h1 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                  Official Performance Scorecard
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold shadow-2xs transition-all inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5 text-slate-500" />
                <span>Print Scorecard</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setCurrentStep('configure');
                }}
                className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                Select Another Paper
              </button>
              <button
                type="button"
                onClick={() => handleStartTest(activePaper)}
                className="px-4 py-1.5 bg-gradient-to-r from-[#2563eb] via-[#7c3aed] to-[#db2777] hover:from-[#1d4ed8] hover:via-[#6d28d9] hover:to-[#be123c] text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-md cursor-pointer flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retake Test ⚡</span>
              </button>
            </div>
          </div>
        </div>

        {/* Scorecard Content Container */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">
          {/* Hero Banner Card */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs text-center space-y-4 relative overflow-hidden">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-100 to-amber-200 text-amber-600 mx-auto flex items-center justify-center shadow-md shadow-amber-500/10">
              <Trophy className="w-10 h-10" />
            </div>

            <div className="space-y-1">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-black uppercase tracking-wider ${
                  isPass ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${isPass ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                {isPass ? 'QUALIFIED & PASSED' : 'NEEDS PRACTICE'}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {isGold ? 'Outstanding Mastery & Performance!' : isPass ? 'Great Effort & Test Completed!' : 'Keep Practicing & Learn from Solutions!'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                {testResult.paperTitle} • {testResult.grade} • {testResult.subjectName}
              </p>
            </div>

            {/* Sync Status */}
            <div className="inline-flex items-center gap-2 py-1.5 px-4 bg-emerald-50 border border-emerald-200 rounded-full text-xs font-bold text-emerald-800">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                {saveStatus === 'saving'
                  ? 'Saving result to Super Admin Portal...'
                  : '✓ Result Verified & Synced with Super Admin & Teacher Portals'}
              </span>
            </div>

            {/* Metric Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3">
              <div className="p-4 rounded-2xl bg-[#faf5fa] border border-[#edd6ed] text-center">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Total Score</span>
                <p className="text-2xl sm:text-3xl font-black text-[#4e2a4a] mt-1">
                  {testResult.earnedMarks} <span className="text-sm text-slate-400 font-medium">/ {testResult.totalMarks}</span>
                </p>
                <span className="text-[10px] text-slate-500 font-bold block mt-0.5">{testResult.percentage}% Marks</span>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-center">
                <span className="text-[10px] text-emerald-600 font-bold uppercase">Correct Answers</span>
                <p className="text-2xl sm:text-3xl font-black text-emerald-700 mt-1">
                  {testResult.correctCount} <span className="text-sm text-emerald-500 font-medium">/ {testResult.totalQuestions}</span>
                </p>
                <span className="text-[10px] text-emerald-600 font-bold block mt-0.5">
                  {Math.round((testResult.correctCount / testResult.totalQuestions) * 100)}% Accuracy
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200 text-center">
                <span className="text-[10px] text-rose-600 font-bold uppercase">Incorrect</span>
                <p className="text-2xl sm:text-3xl font-black text-rose-700 mt-1">{testResult.wrongCount}</p>
                <span className="text-[10px] text-rose-500 font-bold block mt-0.5">Review Solutions</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Time Spent</span>
                <p className="text-2xl sm:text-3xl font-black text-slate-700 mt-1">{testResult.timeSpentMinutes}m</p>
                <span className="text-[10px] text-slate-500 font-bold block mt-0.5">
                  {testResult.unansweredCount} Skipped
                </span>
              </div>
            </div>
          </div>

          {/* Detailed Question Review & Solution Keys */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-900">
                  Question-by-Question Solution Keys &amp; Explanations
                </h3>
                <p className="text-xs text-slate-500">
                  Official Super Admin verified solutions and explanations for all questions.
                </p>
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => setReviewFilter('all')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    reviewFilter === 'all' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  All ({testResult.totalQuestions})
                </button>
                <button
                  type="button"
                  onClick={() => setReviewFilter('correct')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    reviewFilter === 'correct' ? 'bg-emerald-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Correct ({testResult.correctCount})
                </button>
                <button
                  type="button"
                  onClick={() => setReviewFilter('wrong')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    reviewFilter === 'wrong' ? 'bg-rose-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Incorrect ({testResult.wrongCount})
                </button>
              </div>
            </div>

            {/* Questions List */}
            <div className="space-y-4">
              {filteredQuestions.map((item) => (
                <div
                  key={item.questionNumber}
                  className={`p-5 rounded-2xl border transition-all ${
                    item.isCorrect
                      ? 'bg-emerald-50/30 border-emerald-200'
                      : item.isUnanswered
                      ? 'bg-slate-50 border-slate-200'
                      : 'bg-rose-50/30 border-rose-200'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-200/60">
                    <span className="text-xs font-black text-slate-800">Question #{item.questionNumber}</span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        item.isCorrect
                          ? 'bg-emerald-100 text-emerald-800'
                          : item.isUnanswered
                          ? 'bg-slate-200 text-slate-700'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {item.isCorrect ? '✓ Correct (+1.00)' : item.isUnanswered ? '○ Skipped (0.00)' : '✗ Incorrect (0.00)'}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm font-bold text-slate-900 mt-3 leading-relaxed">{item.questionText}</p>

                  {/* Options Display */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-3">
                    {item.options.map((opt, optIdx) => {
                      const isUserChoice = item.userAnswerIndex === optIdx;
                      const isCorrectChoice = item.correctAnswerIndex === optIdx;

                      let optClass = 'bg-white border-slate-200 text-slate-700';
                      if (isCorrectChoice) {
                        optClass = 'bg-emerald-50 border-emerald-400 text-emerald-950 font-bold ring-1 ring-emerald-400';
                      } else if (isUserChoice && !item.isCorrect) {
                        optClass = 'bg-rose-50 border-rose-400 text-rose-950 font-bold';
                      }

                      return (
                        <div
                          key={optIdx}
                          className={`p-3 rounded-xl border text-xs flex items-center justify-between gap-2 ${optClass}`}
                        >
                          <div className="flex items-center gap-2">
                            <span className={`w-5 h-5 rounded-md flex items-center justify-center font-black text-[10px] shrink-0 ${
                              optIdx === 0
                                ? 'bg-red-50 border border-red-200 text-red-700'
                                : optIdx === 1
                                ? 'bg-emerald-50 border border-emerald-200 text-emerald-700'
                                : optIdx === 2
                                ? 'bg-amber-50 border border-amber-200 text-amber-800'
                                : optIdx === 3
                                ? 'bg-orange-50 border border-orange-200 text-orange-800'
                                : 'bg-slate-100 text-slate-700'
                            }`}>
                              {String.fromCharCode(65 + optIdx)}
                            </span>
                            <span>{opt}</span>
                          </div>
                          {isCorrectChoice && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                          {isUserChoice && !isCorrectChoice && <XCircle className="w-4 h-4 text-rose-600 shrink-0" />}
                        </div>
                      );
                    })}
                  </div>

                  {/* Explanation Box */}
                  {item.explanation && (
                    <div className="mt-3 p-3.5 rounded-xl bg-amber-50/80 border border-amber-200 text-xs text-amber-950 space-y-1">
                      <div className="flex items-center gap-1.5 font-bold text-amber-900">
                        <Lightbulb className="w-3.5 h-3.5 text-amber-600 shrink-0 fill-amber-300" />
                        <span>Official Explanation &amp; Logic:</span>
                      </div>
                      <p className="leading-relaxed text-slate-700 pl-5">{item.explanation}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // STEP 2: TEST GUIDELINES & INSTRUCTIONS (Step 2 of Flow)
  // =========================================================================
  if (currentStep === 'instructions') {
    const paper = activePaper || matchingPaper;

    return (
      <div className="space-y-6 font-sans max-w-5xl mx-auto pb-12 animate-in fade-in duration-150">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-[#edd6ed] shadow-lg space-y-6">
          {/* Top Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#f4ebf4]">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCurrentStep('configure')}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Back to Selection</span>
                </button>
                <span className="px-2.5 py-0.5 rounded-full bg-[#f4ebf4] text-[#6d3a68] text-[10px] font-black uppercase">
                  Step 2 of 2: Exam Instructions
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-[#4e2a4a] pt-1">Test Guidelines &amp; Instructions</h2>
              <p className="text-xs text-slate-500 font-medium">
                Please review your selected paper summary and read all instructions carefully before starting.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setCurrentStep('configure')}
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Modify Selection
              </button>
              <button
                type="button"
                disabled={!paper || !hasAgreedInstructions}
                onClick={() => handleStartTest(paper)}
                className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-md flex items-center gap-2 cursor-pointer ${
                  paper && hasAgreedInstructions
                    ? 'bg-[#00b074] hover:bg-[#009260] text-white active:scale-95'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <span>Start Test ⚡</span>
                <Play className="w-3.5 h-3.5 fill-current" />
              </button>
            </div>
          </div>

          {/* Super Admin Paper Status Banner */}
          {paper ? (
            <div className="p-4 bg-emerald-50 rounded-2xl border-2 border-emerald-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-emerald-950 uppercase tracking-wide">
                    ✓ Official Super Admin Paper Verified
                  </h4>
                  <p className="text-xs text-emerald-800 font-bold mt-0.5">
                    &quot;{paper.title}&quot; • {paper.questions.length} Questions authored &amp; verified by Super Admin
                  </p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-xl bg-emerald-200 text-emerald-900 text-[11px] font-black uppercase shrink-0 text-center">
                Ready to Attempt
              </span>
            </div>
          ) : (
            <div className="p-4 bg-amber-50 rounded-2xl border-2 border-amber-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                  <AlertCircle className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-amber-950 uppercase tracking-wide">
                    ⚠️ No Exam Paper Created Yet by Super Admin
                  </h4>
                  <p className="text-xs text-amber-800 font-medium mt-0.5">
                    Super Admin panel me jakar <strong>{selectedClass} ({SUBJECTS_CONFIG[selectedSubjectKey]?.name})</strong> ke liye paper create karein.
                  </p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-xl bg-amber-200 text-amber-900 text-[11px] font-black uppercase shrink-0 text-center">
                Pending Creation
              </span>
            </div>
          )}

          {/* Test Configuration Summary */}
          {paper && (
            <div className="bg-[#faf5fa] rounded-2xl p-5 border border-[#edd6ed] space-y-3">
              <h4 className="text-xs font-black text-[#4e2a4a] uppercase tracking-wider">Paper Overview:</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-2.5 bg-white rounded-xl border border-[#edd6ed]/60">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Grade</p>
                  <p className="font-black text-slate-800 mt-0.5">{paper.class || selectedClass}</p>
                </div>
                <div className="p-2.5 bg-white rounded-xl border border-[#edd6ed]/60">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Olympiad</p>
                  <p className="font-black text-slate-800 mt-0.5">{paper.subjectName || SUBJECTS_CONFIG[selectedSubjectKey]?.name}</p>
                </div>
                <div className="p-2.5 bg-white rounded-xl border border-[#edd6ed]/60">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">{isPYQ ? 'Exam Year' : 'Paper Set'}</p>
                  <p className="font-black text-slate-800 mt-0.5">{isPYQ ? (paper.year || selectedYear) : 'Official Sample'}</p>
                </div>
                <div className="p-2.5 bg-white rounded-xl border border-[#edd6ed]/60">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Questions &amp; Duration</p>
                  <p className="font-black text-slate-800 mt-0.5">
                    {paper.questions?.length || 0} Questions ({paper.durationMinutes || 60} Mins)
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Guidelines Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-2">
              <div className="flex items-center gap-2 text-[#6d3a68] font-black text-sm">
                <HelpCircle className="w-4 h-4" />
                <h4>1. Test Navigation</h4>
              </div>
              <ul className="space-y-1.5 text-slate-600 list-disc list-inside">
                <li>Questions appear <strong>one by one</strong>.</li>
                <li>Use <strong>Next</strong> and <strong>Previous</strong> to move.</li>
                <li>Use the <strong>Right Question Palette</strong> to jump directly.</li>
                <li>Click <strong>Mark for Review</strong> to flag tricky questions.</li>
              </ul>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-2">
              <div className="flex items-center gap-2 text-[#6d3a68] font-black text-sm">
                <Clock className="w-4 h-4" />
                <h4>2. Timer &amp; Submission</h4>
              </div>
              <ul className="space-y-1.5 text-slate-600 list-disc list-inside">
                <li>Countdown timer runs at the top right.</li>
                <li>The test auto-submits when time reaches <strong>00:00</strong>.</li>
                <li>You can click <strong>Submit Exam</strong> anytime when finished.</li>
                <li>Do not refresh or close the browser tab.</li>
              </ul>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-2">
              <div className="flex items-center gap-2 text-[#6d3a68] font-black text-sm">
                <Award className="w-4 h-4" />
                <h4>3. Scoring &amp; Results</h4>
              </div>
              <ul className="space-y-1.5 text-slate-600 list-disc list-inside">
                <li>Correct response: <strong>+1.00 Mark</strong>.</li>
                <li>No negative marking for incorrect answers.</li>
                <li>Instant scorecard synced with Super Admin dashboard.</li>
                <li>Complete step-by-step solutions available immediately.</li>
              </ul>
            </div>
          </div>

          {/* Agreement Checkbox */}
          <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 flex items-start gap-3">
            <input
              type="checkbox"
              id="agree-instructions-pyq"
              checked={hasAgreedInstructions}
              onChange={(e) => setHasAgreedInstructions(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded border-amber-400 text-[#00b074] focus:ring-[#00b074] accent-[#00b074] cursor-pointer"
            />
            <label htmlFor="agree-instructions-pyq" className="text-xs font-semibold text-slate-800 cursor-pointer select-none">
              I have read and understood all the test guidelines above. I am ready to begin the exam.
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={() => setCurrentStep('configure')}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back / Change Selection</span>
            </button>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                disabled={!paper}
                onClick={() => setPdfModalPaper(paper)}
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-blue-50 border border-blue-200 hover:bg-blue-100 text-blue-700 font-bold text-xs sm:text-sm shadow-xs cursor-pointer flex items-center justify-center gap-2 active:scale-95 transition-all disabled:opacity-50"
              >
                <Download className="w-4 h-4 text-blue-600" />
                <span>Download PDF</span>
              </button>

              <button
                type="button"
                disabled={!paper || !hasAgreedInstructions}
                onClick={() => handleStartTest(paper)}
                className={`w-full sm:w-auto px-8 py-3 rounded-2xl text-sm font-black uppercase tracking-wider transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer ${
                  paper && hasAgreedInstructions
                    ? 'bg-[#00b074] hover:bg-[#009260] text-white hover:shadow-xl active:scale-95'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <span>{paper ? 'Start Test Now ⚡' : 'Paper Not Available'}</span>
                <Play className="w-4 h-4 fill-current" />
              </button>
            </div>
          </div>

          {/* Terms & Conditions PDF Modal */}
          <DownloadPaperPdfModal
            isOpen={!!pdfModalPaper}
            onClose={() => setPdfModalPaper(null)}
            paper={pdfModalPaper}
            onStartExamAfterDownload={() => {
              if (pdfModalPaper) handleStartTest(pdfModalPaper);
            }}
          />
        </div>
      </div>
    );
  }

  // =========================================================================
  // STEP 1: CONFIGURE & SELECT GRADE, SUBJECT, YEAR/SET
  // =========================================================================
  return (
    <div className="space-y-6 font-sans animate-in fade-in duration-150 max-w-7xl mx-auto pb-12">
      {/* Main Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#edd6ed] shadow-sm relative">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#f4ebf4]">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onExitToDashboard || (() => onNavigateTab && onNavigateTab('dashboard'))}
              className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </button>
          </div>

          <div className="text-center sm:text-right">
            <h1 className="text-xl sm:text-2xl font-black text-[#4e2a4a] tracking-tight">{pageTitle}</h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">{pageSub}</p>
          </div>
        </div>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6">
          {/* LEFT 7 COLS: Selection Steps 1, 2, 3 */}
          <div className="lg:col-span-7 space-y-6">
            {/* Step 1: Choose Your Grade */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="flex items-center gap-2 w-44 shrink-0">
                <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 text-[11px] font-black flex items-center justify-center">
                  1
                </span>
                <span className="text-xs font-black text-slate-700">Choose Your Grade:</span>
              </div>
              <div className="flex flex-wrap gap-1.5 flex-1">
                {CLASSES_OPTIONS.map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setSelectedClass(g)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                      selectedClass === g
                        ? 'bg-gradient-to-r from-[#2563eb] via-[#7c3aed] to-[#db2777] text-white border-[#d9775b] shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                    }`}
                  >
                    <span>{g}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Select Olympiad Subject */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="flex items-center gap-2 w-44 shrink-0">
                <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 text-[11px] font-black flex items-center justify-center">
                  2
                </span>
                <span className="text-xs font-black text-slate-700">Select Olympiad:</span>
              </div>
              <div className="flex flex-wrap items-center gap-2.5 flex-1">
                {/* IEO */}
                <button
                  type="button"
                  onClick={() => setSelectedSubjectKey('english')}
                  className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 transition-all cursor-pointer ${
                    selectedSubjectKey === 'english'
                      ? 'bg-[#df7950] text-white border-[#df7950] shadow-sm ring-2 ring-[#df7950]/30'
                      : 'bg-[#faf5fa] text-slate-700 border-slate-200 hover:bg-[#f4ebf4]'
                  }`}
                >
                  <input type="radio" checked={selectedSubjectKey === 'english'} readOnly className="accent-white" />
                  <span className="font-black font-mono tracking-wider">I E O</span>
                  <Lightbulb className="w-3.5 h-3.5 text-yellow-300 fill-yellow-400" />
                </button>

                {/* IMO */}
                <button
                  type="button"
                  onClick={() => setSelectedSubjectKey('math')}
                  className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 transition-all cursor-pointer ${
                    selectedSubjectKey === 'math'
                      ? 'bg-[#e8ac2c] text-white border-[#e8ac2c] shadow-sm ring-2 ring-[#e8ac2c]/30'
                      : 'bg-[#faf5fa] text-slate-700 border-slate-200 hover:bg-[#f4ebf4]'
                  }`}
                >
                  <input type="radio" checked={selectedSubjectKey === 'math'} readOnly className="accent-white" />
                  <span className="font-black font-mono tracking-wider">I M O</span>
                  <Lightbulb className="w-3.5 h-3.5 text-yellow-300 fill-yellow-400" />
                </button>

                {/* ISO */}
                <button
                  type="button"
                  onClick={() => setSelectedSubjectKey('science')}
                  className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 transition-all cursor-pointer ${
                    selectedSubjectKey === 'science'
                      ? 'bg-[#9db83b] text-white border-[#9db83b] shadow-sm ring-2 ring-[#9db83b]/30'
                      : 'bg-[#faf5fa] text-slate-700 border-slate-200 hover:bg-[#f4ebf4]'
                  }`}
                >
                  <input type="radio" checked={selectedSubjectKey === 'science'} readOnly className="accent-white" />
                  <span className="font-black font-mono tracking-wider">I S O</span>
                  <Lightbulb className="w-3.5 h-3.5 text-yellow-300 fill-yellow-400" />
                </button>

                {/* ICSO */}
                <button
                  type="button"
                  onClick={() => setSelectedSubjectKey('cyber')}
                  className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 transition-all cursor-pointer ${
                    selectedSubjectKey === 'cyber'
                      ? 'bg-[#0284c7] text-white border-[#0284c7] shadow-sm ring-2 ring-[#0284c7]/30'
                      : 'bg-[#faf5fa] text-slate-700 border-slate-200 hover:bg-[#f4ebf4]'
                  }`}
                >
                  <input type="radio" checked={selectedSubjectKey === 'cyber'} readOnly className="accent-white" />
                  <span className="font-black font-mono tracking-wider">I C S O</span>
                  <Lightbulb className="w-3.5 h-3.5 text-yellow-300 fill-yellow-400" />
                </button>

                {/* IGKO */}
                <button
                  type="button"
                  onClick={() => setSelectedSubjectKey('gk')}
                  className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 transition-all cursor-pointer ${
                    selectedSubjectKey === 'gk'
                      ? 'bg-[#eab308] text-white border-[#eab308] shadow-sm ring-2 ring-[#eab308]/30'
                      : 'bg-[#faf5fa] text-slate-700 border-slate-200 hover:bg-[#f4ebf4]'
                  }`}
                >
                  <input type="radio" checked={selectedSubjectKey === 'gk'} readOnly className="accent-white" />
                  <span className="font-black font-mono tracking-wider">I G K O</span>
                  <Lightbulb className="w-3.5 h-3.5 text-yellow-300 fill-yellow-400" />
                </button>

                {/* ISSO */}
                <button
                  type="button"
                  onClick={() => setSelectedSubjectKey('reasoning')}
                  className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 transition-all cursor-pointer ${
                    selectedSubjectKey === 'reasoning'
                      ? 'bg-[#b97fa8] text-white border-[#b97fa8] shadow-sm ring-2 ring-[#b97fa8]/30'
                      : 'bg-[#faf5fa] text-slate-700 border-slate-200 hover:bg-[#f4ebf4]'
                  }`}
                >
                  <input type="radio" checked={selectedSubjectKey === 'reasoning'} readOnly className="accent-white" />
                  <span className="font-black text-xs uppercase tracking-wider">ISSO (Reasoning)</span>
                  <Lightbulb className="w-3.5 h-3.5 text-yellow-300 fill-yellow-400" />
                </button>
              </div>
            </div>

            {/* Step 3: Select Year or Sample Set */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="flex items-center gap-2 w-44 shrink-0">
                <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 text-[11px] font-black flex items-center justify-center">
                  3
                </span>
                <span className="text-xs font-black text-slate-700">
                  {isPYQ ? 'Select Exam Year:' : 'Select Sample Set:'}
                </span>
              </div>
              <div className="flex flex-wrap gap-2 flex-1">
                {isPYQ
                  ? YEARS_OPTIONS.map((yr) => (
                      <button
                        key={yr}
                        type="button"
                        onClick={() => setSelectedYear(yr)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                          selectedYear === yr
                            ? 'bg-gradient-to-r from-[#2563eb] via-[#7c3aed] to-[#db2777] text-white border-[#6d3a68] shadow-xs'
                            : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        {yr}
                      </button>
                    ))
                  : SAMPLE_SETS_OPTIONS.map((set) => (
                      <button
                        key={set}
                        type="button"
                        onClick={() => setSelectedSampleSet(set)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                          selectedSampleSet === set
                            ? 'bg-gradient-to-r from-[#2563eb] via-[#7c3aed] to-[#db2777] text-white border-[#6d3a68] shadow-xs'
                            : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        {set}
                      </button>
                    ))}
              </div>
            </div>

            {/* Next Step Action Bar */}
            <div className="pt-4 border-t border-[#f4ebf4] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                {hasMatchingPaper ? (
                  <span className="text-xs font-bold text-emerald-700 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>✓ &quot;{matchingPaper.title}&quot; ready ({matchingPaper.questions?.length} Questions)</span>
                  </span>
                ) : (
                  <span className="text-xs font-semibold text-amber-800 flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-amber-600" />
                    <span>No paper created yet for {selectedClass} ({SUBJECTS_CONFIG[selectedSubjectKey]?.name})</span>
                  </span>
                )}
              </div>

              <button
                type="button"
                disabled={!hasMatchingPaper}
                onClick={() => handleProceedToInstructions(matchingPaper)}
                className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer ${
                  hasMatchingPaper
                    ? 'bg-[#6d3a68] hover:bg-[#582d54] text-white active:scale-95'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <span>{hasMatchingPaper ? 'Next: View Instructions →' : 'Paper Not Created Yet'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* RIGHT 5 COLS: Mascot + Paper Summary Card */}
          <div className="lg:col-span-5 flex flex-col items-center">
            {/* Robot Mascot Illustration */}
            <div className="relative -mb-6 z-10">
              <svg className="w-16 h-16 drop-shadow-md" viewBox="0 0 100 100" fill="none">
                <rect x="25" y="25" width="50" height="40" rx="12" fill="#e05338" />
                <rect x="32" y="32" width="36" height="26" rx="8" fill="#1e293b" />
                <circle cx="43" cy="45" r="4" fill="#fbbf24" className="animate-pulse" />
                <circle cx="57" cy="45" r="4" fill="#fbbf24" className="animate-pulse" />
                <line x1="50" y1="25" x2="50" y2="12" stroke="#e05338" strokeWidth="4" strokeLinecap="round" />
                <circle cx="50" cy="10" r="4" fill="#fbbf24" />
                <path d="M 30 72 C 30 65, 70 65, 70 72 L 75 90 C 75 95, 25 95, 25 90 Z" fill="#334155" />
                <circle cx="50" cy="80" r="3" fill="#38bdf8" />
              </svg>
            </div>

            {/* Paper Summary Card */}
            <div className="w-full bg-white rounded-3xl p-6 pt-9 border-2 border-[#edd6ed] shadow-lg space-y-4 text-center relative">
              <h3 className="text-base font-black text-[#2e1065] tracking-tight">Paper Overview</h3>

              <div className="grid grid-cols-2 gap-3 text-left">
                {/* Grade */}
                <div className="flex items-center gap-2 p-2 rounded-xl bg-[#faf5fa]">
                  <div className="w-7 h-7 rounded-lg bg-[#f4ebf4] text-[#6d3a68] flex items-center justify-center font-bold text-xs">
                    📇
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Grade</p>
                    <p className="text-xs font-black text-slate-800">{selectedClass}</p>
                  </div>
                </div>

                {/* Subject */}
                <div className="flex items-center gap-2 p-2 rounded-xl bg-[#faf5fa]">
                  <div className="w-7 h-7 rounded-lg bg-[#f4ebf4] text-[#6d3a68] flex items-center justify-center font-bold text-xs">
                    ➕
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Subject</p>
                    <p className="text-xs font-black text-slate-800 uppercase">{selectedSubjectKey}</p>
                  </div>
                </div>

                {/* Year / Set */}
                <div className="flex items-center gap-2 p-2 rounded-xl bg-[#faf5fa] col-span-2">
                  <div className="w-7 h-7 rounded-lg bg-[#f4ebf4] text-[#6d3a68] flex items-center justify-center font-bold text-xs">
                    📅
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">{isPYQ ? 'Year' : 'Model Set'}</p>
                    <p className="text-xs font-black text-slate-800">
                      {hasMatchingPaper ? (matchingPaper.year || selectedYear) : isPYQ ? selectedYear : selectedSampleSet}
                    </p>
                  </div>
                </div>

                {/* Super Admin Paper Status */}
                <div
                  className="flex items-center gap-2 p-2 rounded-xl col-span-2 border"
                  style={{
                    backgroundColor: hasMatchingPaper ? '#ecfdf5' : '#fffbeb',
                    borderColor: hasMatchingPaper ? '#a7f3d0' : '#fde68a'
                  }}
                >
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0"
                    style={{
                      backgroundColor: hasMatchingPaper ? '#d1fae5' : '#fef3c7',
                      color: hasMatchingPaper ? '#065f46' : '#92400e'
                    }}
                  >
                    {hasMatchingPaper ? '✓' : '⚠️'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-bold uppercase" style={{ color: hasMatchingPaper ? '#059669' : '#b45309' }}>
                      Super Admin Paper Status
                    </p>
                    <p className="text-xs font-black truncate" style={{ color: hasMatchingPaper ? '#065f46' : '#78350f' }}>
                      {hasMatchingPaper
                        ? `${matchingPaper.title} (${matchingPaper.questions?.length || 0} Qs)`
                        : 'No paper published yet for this class'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Proceed Button */}
              <button
                type="button"
                disabled={!hasMatchingPaper}
                onClick={() => handleProceedToInstructions(matchingPaper)}
                className={`w-full py-3 rounded-2xl text-xs font-black uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 ${
                  hasMatchingPaper
                    ? 'bg-[#6d3a68] hover:bg-[#582d54] text-white active:scale-95 cursor-pointer'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <span>{hasMatchingPaper ? 'Proceed to Test Instructions →' : 'Paper Not Available'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
