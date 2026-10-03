import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { apiClient } from '../../api/client';
import {
  Laptop,
  Rocket,
  Calculator,
  BookOpen,
  Globe,
  Brain,
  CheckCircle2,
  Download,
  Play,
  FileText,
  Sparkles,
  Zap,
  ShoppingCart,
  Check,
  ChevronRight,
  ChevronLeft,
  X,
  ExternalLink,
  ShieldCheck,
  Award,
  Layers,
  CreditCard,
  Printer,
  Flame,
  Info,
  ArrowLeft,
  Clock,
  RotateCcw,
  Trophy,
  Bookmark,
  FileCheck2,
  FileDown,
  Eye,
  HelpCircle,
  Package
} from 'lucide-react';

const SUBJECT_CONFIGS = {
  icso: {
    code: 'ICSO',
    name: 'International Cyber Olympiad',
    shortTitle: 'ICSO (Cyber)',
    badgeColor: 'bg-sky-600',
    borderColor: 'border-sky-500',
    lightBg: 'bg-sky-50',
    icon: Laptop,
    accent: '#0284c7',
    logoLetters: ['I', 'C', 'S', 'O'],
    subjectsIncluded: 'ICSO, IMO & ISO',
    synopsisSubjects: 'ICSO, IMO & ISO',
    worksheetsSubjects: 'ICSO & ISO'
  },
  iso: {
    code: 'ISO',
    name: 'International Science Olympiad',
    shortTitle: 'ISO (NSO)',
    badgeColor: 'bg-emerald-600',
    borderColor: 'border-emerald-500',
    lightBg: 'bg-emerald-50',
    icon: Rocket,
    accent: '#059669',
    logoLetters: ['I', 'S', 'O'],
    subjectsIncluded: 'ISO, IMO & IEO',
    synopsisSubjects: 'ISO, IMO & ICSO',
    worksheetsSubjects: 'ISO & IMO'
  },
  imo: {
    code: 'IMO',
    name: 'International Mathematics Olympiad',
    shortTitle: 'IMO (Maths)',
    badgeColor: 'bg-amber-500',
    borderColor: 'border-amber-400',
    lightBg: 'bg-amber-50',
    icon: Calculator,
    accent: '#d97706',
    logoLetters: ['I', 'M', 'O'],
    subjectsIncluded: 'IMO, ISO & IEO',
    synopsisSubjects: 'IMO, ISO & ICSO',
    worksheetsSubjects: 'IMO & ISO'
  },
  ieo: {
    code: 'IEO',
    name: 'International English Olympiad',
    shortTitle: 'IEO (English)',
    badgeColor: 'bg-orange-600',
    borderColor: 'border-orange-500',
    lightBg: 'bg-orange-50',
    icon: BookOpen,
    accent: '#ea580c',
    logoLetters: ['I', 'E', 'O'],
    subjectsIncluded: 'IEO, IMO & IGKO',
    synopsisSubjects: 'IEO, IMO & ISO',
    worksheetsSubjects: 'IEO & IMO'
  },
  igko: {
    code: 'IGKO',
    name: 'International General Knowledge Olympiad',
    shortTitle: 'IGKO (GK)',
    badgeColor: 'bg-yellow-500',
    borderColor: 'border-yellow-400',
    lightBg: 'bg-yellow-50',
    icon: Globe,
    accent: '#e7b84b',
    logoLetters: ['I', 'G', 'K', 'O'],
    subjectsIncluded: 'IGKO, IMO & ISO',
    synopsisSubjects: 'IGKO, IMO & IEO',
    worksheetsSubjects: 'IGKO & IMO'
  },
  isso: {
    code: 'ISSO',
    name: 'International Social Studies & Reasoning Olympiad',
    shortTitle: 'ISSO (Reasoning)',
    badgeColor: 'bg-purple-600',
    borderColor: 'border-purple-500',
    lightBg: 'bg-purple-50',
    icon: Brain,
    accent: '#7c3aed',
    logoLetters: ['I', 'S', 'S', 'O'],
    subjectsIncluded: 'ISSO, IMO & ISO',
    synopsisSubjects: 'ISSO, IMO & ISO',
    worksheetsSubjects: 'ISSO & IMO'
  }
};

const ALL_CLASSES = [
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

export const SubjectContentPackagesPage = ({
  subjectCode = 'icso',
  onNavigateTab,
  onStartExam
}) => {
  const { user } = useAuth();
  const { addToCart } = useCart();

  const normalizedSubjectKey = subjectCode.replace('content_', '').toLowerCase();
  const subject = SUBJECT_CONFIGS[normalizedSubjectKey] || SUBJECT_CONFIGS.icso;

  const [selectedClass, setSelectedClass] = useState(user?.class || 'Class 6');

  // Top Filter Tabs (Image 5 replica): 'all_papers' | 'previous_year' | 'sample_paper' | 'test_generator' | 'packages'
  const [activeTab, setActiveTab] = useState('all_papers');

  // Exam Papers State (Super Admin authored)
  const [examPapers, setExamPapers] = useState([]);
  const [loadingPapers, setLoadingPapers] = useState(false);

  // Student Attempts Persistence (Per-Paper Score & Status)
  const [studentAttempts, setStudentAttempts] = useState(() => {
    try {
      const raw = localStorage.getItem('olympiadhub_student_attempts');
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      return {};
    }
  });

  // Modal / View States
  const [selectedPaperForInstructions, setSelectedPaperForInstructions] = useState(null); // Screenshot 2 View
  const [liveExamPaper, setLiveExamPaper] = useState(null); // Screenshot 1 Live Exam View

  // Live Exam Portal States (Image 1 replica)
  const [activeQuestionIdx, setActiveQuestionIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [flaggedQuestions, setFlaggedQuestions] = useState({});
  const [visitedQuestions, setVisitedQuestions] = useState({ 0: true });
  const [activeSection, setActiveSection] = useState('All');
  const [timeRemaining, setTimeRemaining] = useState(3600);
  const [testResult, setTestResult] = useState(null);
  const [solutionFilter, setSolutionFilter] = useState('all'); // 'all' | 'correct' | 'wrong' | 'unattempted'
  const [showEndTestConfirmModal, setShowEndTestConfirmModal] = useState(false);

  // Packages State
  const [packages, setPackages] = useState([]);
  const [loadingPackages, setLoadingPackages] = useState(false);
  const [selectedPackageDetail, setSelectedPackageDetail] = useState(null);

  // Toast Notification State
  const [toast, setToast] = useState(null);
  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // PDF Download & Terms & Conditions Modal State (Exact Image 2 replica)
  const [showPdfTermsModal, setShowPdfTermsModal] = useState(false);
  const [pdfModalType, setPdfModalType] = useState('paper'); // 'paper' | 'solution' | 'start_test'
  const [agreedTerms, setAgreedTerms] = useState(false);

  // PDF Generator & Downloader
  const handleExecutePdfDownload = () => {
    const paper = selectedPaperForInstructions || liveExamPaper;
    if (!paper) return;

    const withAnswers = pdfModalType === 'solution';

    const printWindow = window.open('', '_blank', 'width=900,height=700');
    if (printWindow) {
      const questionsHtml = (paper.questions || [])
        .map((q, idx) => {
          const optionsHtml = (q.options || [])
            .map((opt, oIdx) => {
              const letter = ['A', 'B', 'C', 'D'][oIdx] || String(oIdx + 1);
              const isCorrect = withAnswers && q.correct === oIdx;
              return `
                <div style="margin: 4px 0; padding: 4px 8px; border-radius: 4px; ${isCorrect ? 'background-color: #d4edda; font-weight: bold; border: 1px solid #c3e6cb;' : ''}">
                  <span style="display: inline-block; width: 22px; font-weight: bold;">(${letter})</span> ${opt}
                  ${isCorrect ? '<span style="color: #155724; margin-left: 8px;">✓ Correct Answer</span>' : ''}
                </div>
              `;
            })
            .join('');

          const explanationHtml = withAnswers && q.explanation ? `
            <div style="margin-top: 6px; padding: 6px 10px; background-color: #f8f9fa; border-left: 3px solid #2980b9; font-size: 11px; color: #555;">
              <strong>Explanation:</strong> ${q.explanation}
            </div>
          ` : '';

          return `
            <div style="margin-bottom: 20px; padding-bottom: 12px; border-bottom: 1px solid #eee; page-break-inside: avoid;">
              <div style="font-weight: bold; font-size: 13px; margin-bottom: 6px;">
                Q${idx + 1}. [${q.section || 'General'}] ${q.q} <span style="float: right; font-size: 11px; color: #888;">[Marks: ${q.marks || 1}]</span>
              </div>
              <div style="margin-left: 10px; font-size: 12px;">
                ${optionsHtml}
              </div>
              ${explanationHtml}
            </div>
          `;
        })
        .join('');

      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>${paper.title} - ${withAnswers ? 'Solutions' : 'Question Paper'}</title>
          <style>
            body { font-family: 'Segoe UI', Arial, sans-serif; padding: 30px; color: #333; line-height: 1.4; }
            .header { text-align: center; border-bottom: 2px solid #2980b9; padding-bottom: 12px; margin-bottom: 20px; }
            .meta { display: flex; justify-content: space-between; font-size: 12px; font-weight: bold; background: #f0f7fb; padding: 8px 12px; border-radius: 6px; margin-bottom: 20px; }
            @media print {
              body { padding: 10px; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h2 style="margin: 0; color: #2980b9;">${paper.title}</h2>
            <div style="font-size: 13px; color: #666; margin-top: 4px;">${withAnswers ? 'Official Question Paper with Master Answer Keys &amp; Solutions' : 'Official Student Question Paper'}</div>
          </div>
          <div class="meta">
            <span>Class: ${paper.class_name || selectedClass}</span>
            <span>Subject: ${paper.subject_code || subject.code}</span>
            <span>Duration: ${paper.duration_minutes || 60} Minutes</span>
            <span>Total Marks: ${paper.total_marks || 60}</span>
          </div>
          <div>
            ${questionsHtml}
          </div>
          <div style="text-align: center; font-size: 11px; color: #aaa; margin-top: 30px; border-top: 1px solid #eee; padding-top: 10px;">
            Confidential • For Personal Use Only • OlympiadHub Examination System
          </div>
          <script>
            window.onload = function() {
              window.print();
            };
          <\/script>
        </body>
        </html>
      `);
      printWindow.document.close();
    }

    showToast(`✓ PDF generated and downloaded!`);
    setShowPdfTermsModal(false);
    setAgreedTerms(false);

    if (pdfModalType === 'start_test') {
      handleStartExam(paper);
    }
  };

  // Fetch real exam papers from Super Admin for this subject and class
  const fetchExamPapers = async () => {
    setLoadingPapers(true);
    try {
      const res = await apiClient.get('/exam-papers', {
        class: selectedClass,
        subject: subject.code,
        category: activeTab === 'all_papers' ? 'all' : activeTab
      });
      if (res && res.success && Array.isArray(res.data)) {
        setExamPapers(res.data);
      } else {
        setExamPapers([]);
      }
    } catch (e) {
      console.warn('Error fetching exam papers:', e);
      setExamPapers([]);
    } finally {
      setLoadingPapers(false);
    }
  };

  // Fetch packages from Super Admin
  const fetchPackages = async () => {
    setLoadingPackages(true);
    try {
      const res = await apiClient.get('/packages', {
        class: selectedClass,
        subject: subject.code
      });
      if (res && res.success && Array.isArray(res.data)) {
        setPackages(res.data);
      } else {
        setPackages([]);
      }
    } catch (e) {
      console.warn('Error fetching packages:', e);
      setPackages([]);
    } finally {
      setLoadingPackages(false);
    }
  };

  useEffect(() => {
    fetchExamPapers();
    fetchPackages();
  }, [selectedClass, subjectCode, activeTab]);

  // Handle Start Live Exam (Transitions to Screenshot 1 format)
  const handleStartExam = (paper) => {
    setSelectedPaperForInstructions(null);
    setLiveExamPaper(paper);
    setActiveQuestionIdx(0);
    setSelectedAnswers({});
    setFlaggedQuestions({});
    setVisitedQuestions({ 0: true });
    setTimeRemaining((paper.duration_minutes || 60) * 60);
    setTestResult(null);
    setSolutionFilter('all');

    const sections = Array.isArray(paper.sections) && paper.sections.length > 0
      ? paper.sections
      : ['General Awareness', 'Current Affairs', 'Life Skills', 'Achievers Section'];
    setActiveSection(sections[0] || 'All');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Timer countdown
  useEffect(() => {
    if (!liveExamPaper || testResult) return;
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
  }, [liveExamPaper, testResult]);

  // Question selection helper
  const handleSelectOption = (qIdx, optIdx) => {
    setSelectedAnswers((prev) => ({ ...prev, [qIdx]: optIdx }));
    setVisitedQuestions((prev) => ({ ...prev, [qIdx]: true }));
  };

  const handleToggleFlag = (qIdx) => {
    setFlaggedQuestions((prev) => ({ ...prev, [qIdx]: !prev[qIdx] }));
  };

  const handleClearAnswer = (qIdx) => {
    setSelectedAnswers((prev) => {
      const copy = { ...prev };
      delete copy[qIdx];
      return copy;
    });
  };

  const handleJumpQuestion = (idx) => {
    setActiveQuestionIdx(idx);
    setVisitedQuestions((prev) => ({ ...prev, [idx]: true }));
  };

  // Submit test and show scorecard
  const handleSubmitTest = () => {
    if (!liveExamPaper) return;
    const questions = liveExamPaper.questions || [];
    let correctCount = 0;
    let wrongCount = 0;
    let unattemptedCount = 0;
    let score = 0;
    let totalMarks = 0;

    questions.forEach((q, idx) => {
      const qMarks = Number(q.marks) || 1;
      totalMarks += qMarks;
      const userAns = selectedAnswers[idx];
      if (userAns === undefined) {
        unattemptedCount++;
      } else if (Number(userAns) === Number(q.correct)) {
        correctCount++;
        score += qMarks;
      } else {
        wrongCount++;
      }
    });

    const pct = totalMarks > 0 ? Math.round((score / totalMarks) * 100) : 0;
    const totalDurationSecs = (Number(liveExamPaper.duration_minutes) || 60) * 60;
    const timeSpentSecs = Math.max(10, totalDurationSecs - timeRemaining);

    const resultObj = {
      score,
      totalMarks,
      percentage: pct,
      correctCount,
      wrongCount,
      unattemptedCount,
      totalQuestions: questions.length,
      timeSpentSecs
    };

    setTestResult(resultObj);

    // Persist attempt to localStorage
    const updatedAttempts = {
      ...studentAttempts,
      [liveExamPaper.id]: {
        ...resultObj,
        paperTitle: liveExamPaper.title,
        completedAt: new Date().toISOString()
      }
    };
    setStudentAttempts(updatedAttempts);
    try {
      localStorage.setItem('olympiadhub_student_attempts', JSON.stringify(updatedAttempts));
    } catch (e) {
      console.warn('Failed to persist student attempt:', e);
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Format Timer mm:ss
  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // =========================================================================
  // VIEW A: LIVE ACTIVE EXAM PORTAL (Exact Replica of User's Image 1)
  // =========================================================================
  if (liveExamPaper) {
    const questions = liveExamPaper.questions || [];
    const totalQCount = questions.length || 50;
    const currentQ = questions[activeQuestionIdx] || {
      q: "World's first human to human heart transplant operation was conducted by _______.",
      options: ['Christiaan Barnard', 'Robert Koch', 'Antonie van Leeuwenhoek', 'Hans Christian Gram'],
      marks: 1,
      correct: 0,
      section: 'General Awareness'
    };

    const sectionsList = Array.isArray(liveExamPaper.sections) && liveExamPaper.sections.length > 0
      ? liveExamPaper.sections
      : ['General Awareness', 'Current Affairs', 'Life Skills', 'Achievers Section'];

    const userSelectedOpt = selectedAnswers[activeQuestionIdx];

    // =========================================================================
    // VIEW A-1: SCORECARD / RESULT ANALYSIS (Exact Replica of User's Image 2 & 3)
    // =========================================================================
    if (testResult) {
      const filteredQuestions = (questions || [])
        .map((q, originalIdx) => ({ q, originalIdx }))
        .filter(({ q, originalIdx }) => {
          const userAns = selectedAnswers[originalIdx];
          const isAttempted = userAns !== undefined;
          const isCorrect = isAttempted && Number(userAns) === Number(q.correct);
          const isWrong = isAttempted && Number(userAns) !== Number(q.correct);

          if (solutionFilter === 'correct') return isCorrect;
          if (solutionFilter === 'wrong') return isWrong;
          if (solutionFilter === 'unattempted') return !isAttempted;
          return true; // 'all'
        });

      return (
        <div className="min-h-screen bg-[#f4f7f9] font-sans p-3 sm:p-6 pb-20 animate-in fade-in">
          <div className="max-w-6xl mx-auto space-y-4">
            {/* Top Action Buttons (Exact match to Image 3) */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="px-3.5 py-1.5 bg-white text-[#2980b9] border border-slate-200 rounded-lg text-xs font-bold flex items-center gap-2 shadow-xs cursor-default"
              >
                <Globe className="w-4 h-4 text-[#2980b9]" />
                <span>View Analysis</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setLiveExamPaper(null);
                  setTestResult(null);
                }}
                className="px-3.5 py-1.5 bg-white text-[#5c6ac4] hover:text-[#434f9a] hover:bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold flex items-center gap-2 shadow-xs transition-colors cursor-pointer active:scale-95"
              >
                <Layers className="w-4 h-4 text-[#5c6ac4]" />
                <span>Go to Test List</span>
              </button>
            </div>

            {/* Combined Single Scorecard & Filter Radios Bar (Exact match to Image 2 & 3) */}
            <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200 shadow-2xs">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                {/* 1. Time Taken */}
                <div className="md:col-span-3 flex flex-col items-center justify-center text-center">
                  <div className="w-10 h-10 rounded-full bg-[#e8f8f5] text-[#27ae60] flex items-center justify-center mb-1.5 border border-[#c3e6cb]">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div className="text-xs font-bold text-slate-500">Time Taken</div>
                  <div className="text-sm sm:text-base font-black text-slate-800 tracking-tight">
                    {Math.floor(testResult.timeSpentSecs / 60)}:{(testResult.timeSpentSecs % 60).toString().padStart(2, '0')} | {(Number(liveExamPaper.duration_minutes) || 60).toFixed(1)}
                  </div>
                </div>

                {/* 2. Marks Obtained */}
                <div className="md:col-span-3 flex flex-col items-center justify-center text-center">
                  <div className="w-10 h-10 rounded-full bg-[#ebf5fb] text-[#2980b9] flex items-center justify-center mb-1.5 border border-[#b8daff]">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="text-xs font-bold text-slate-500">Marks Obtained</div>
                  <div className="text-sm sm:text-base font-black text-slate-800 tracking-tight">
                    {testResult.score} / {testResult.totalMarks}
                  </div>
                </div>

                {/* 3. Last Year Cutoff Marks */}
                <div className="md:col-span-3 flex flex-col items-center justify-center text-center">
                  <div className="text-base sm:text-xl font-black text-slate-800 tracking-tight">
                    {liveExamPaper.cutoff_marks || 42} / {testResult.totalMarks}
                  </div>
                  <div className="text-xs font-bold text-slate-500 mt-1">
                    Last Year Cutoff Marks
                  </div>
                </div>

                {/* 4. 2x2 Filter Radios Grid (Exact match to Image 3) */}
                <div className="md:col-span-3 border-t md:border-t-0 md:border-l border-slate-200 pt-3 md:pt-0 md:pl-6">
                  <div className="grid grid-cols-2 gap-y-3 gap-x-4">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700 select-none">
                      <input
                        type="radio"
                        name="solution_filter_radio"
                        value="all"
                        checked={solutionFilter === 'all'}
                        onChange={() => setSolutionFilter('all')}
                        className="w-4 h-4 accent-[#2980b9] cursor-pointer"
                      />
                      <span>All</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700 select-none">
                      <input
                        type="radio"
                        name="solution_filter_radio"
                        value="correct"
                        checked={solutionFilter === 'correct'}
                        onChange={() => setSolutionFilter('correct')}
                        className="w-4 h-4 accent-[#2980b9] cursor-pointer"
                      />
                      <span>Correct</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700 select-none">
                      <input
                        type="radio"
                        name="solution_filter_radio"
                        value="wrong"
                        checked={solutionFilter === 'wrong'}
                        onChange={() => setSolutionFilter('wrong')}
                        className="w-4 h-4 accent-[#2980b9] cursor-pointer"
                      />
                      <span>Wrong</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700 select-none">
                      <input
                        type="radio"
                        name="solution_filter_radio"
                        value="unattempted"
                        checked={solutionFilter === 'unattempted'}
                        onChange={() => setSolutionFilter('unattempted')}
                        className="w-4 h-4 accent-[#2980b9] cursor-pointer"
                      />
                      <span>Unattempted</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Solutions Question List (Exact Image 3 format) */}
            <div className="space-y-4">
              {filteredQuestions.length === 0 ? (
                <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center text-slate-500 text-xs font-bold">
                  No questions found for this category.
                </div>
              ) : (
                filteredQuestions.map(({ q, originalIdx }) => {
                  const userAns = selectedAnswers[originalIdx];
                  const isAttempted = userAns !== undefined;
                  const isUserCorrect = isAttempted && Number(userAns) === Number(q.correct);

                  return (
                    <div
                      key={originalIdx}
                      className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-3"
                    >
                      {/* Question Title & Marks */}
                      <div className="flex items-center justify-between pb-2 border-b border-slate-100 text-xs font-black text-slate-800">
                        <span>
                          Q{originalIdx + 1}. [{q.section || 'General Awareness'}] {q.q}
                        </span>
                        <span className="text-slate-500 font-bold shrink-0 ml-2">
                          [Marks: {q.marks || 1}]
                        </span>
                      </div>

                      {/* Options with correctness highlights */}
                      <div className="space-y-2 pt-1">
                        {(q.options || []).map((opt, optIdx) => {
                          const letter = String.fromCharCode(65 + optIdx);
                          const isMasterCorrect = Number(q.correct) === optIdx;
                          const isStudentSelected = isAttempted && Number(userAns) === optIdx;

                          let style = 'bg-white border-slate-200 text-slate-700';
                          let tag = null;

                          if (isMasterCorrect) {
                            style = 'bg-emerald-50 border-emerald-400 text-emerald-900 font-bold';
                            tag = <span className="text-emerald-700 font-black text-[11px]">✓ Correct Answer</span>;
                          } else if (isStudentSelected) {
                            style = 'bg-rose-50 border-rose-300 text-rose-900 font-bold';
                            tag = <span className="text-rose-700 font-black text-[11px]">✗ Your Answer</span>;
                          }

                          return (
                            <div
                              key={optIdx}
                              className={`flex items-center justify-between p-2.5 rounded-xl border text-xs transition-all ${style}`}
                            >
                              <div className="flex items-center gap-3">
                                <span className="w-6 h-6 rounded-md bg-slate-100 font-black text-slate-700 flex items-center justify-center shrink-0 text-xs">
                                  {letter}
                                </span>
                                <span>{opt}</span>
                              </div>
                              {tag}
                            </div>
                          );
                        })}
                      </div>

                      {/* Not Attempted Tag */}
                      {!isAttempted && (
                        <div className="pt-1">
                          <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
                            Unattempted
                          </span>
                        </div>
                      )}

                      {/* Explanation */}
                      {q.explanation && (
                        <div className="p-3 rounded-xl bg-slate-50 border-l-4 border-[#2980b9] text-xs text-slate-700 space-y-1 mt-2">
                          <span className="font-black text-slate-900">Explanation:</span>
                          <p className="leading-relaxed text-slate-600">{q.explanation}</p>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-center gap-3 pt-4">
              <button
                type="button"
                onClick={() => {
                  setLiveExamPaper(null);
                  setTestResult(null);
                }}
                className="px-6 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-black cursor-pointer shadow-md"
              >
                Exit to Papers List
              </button>
              <button
                type="button"
                onClick={() => handleStartExam(liveExamPaper)}
                className="px-6 py-2.5 bg-[#00b074] hover:bg-[#009260] text-white rounded-xl text-xs font-black cursor-pointer shadow-md"
              >
                Retake Test ⚡
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-slate-100 font-sans p-3 sm:p-5 flex flex-col space-y-3 animate-in fade-in">
        {/* Top Floating Control Bar (Exact Image 1 replica) */}
        <div className="bg-white rounded-2xl p-3 border border-slate-200 shadow-xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="px-3 py-1 rounded-lg bg-[#d99b26] text-white font-black text-xs shadow-2xs">
              {liveExamPaper.short_code || `${liveExamPaper.subject_code} - ${liveExamPaper.exam_year || '2019'}`}
            </span>
            <span className="text-xs sm:text-sm font-bold text-slate-800 hidden sm:inline">
              {liveExamPaper.title}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#fce4ec] text-[#c2185b] border border-pink-200 text-xs font-black">
              <Clock className="w-3.5 h-3.5 text-[#c2185b]" />
              <span>Time Left: {formatTime(timeRemaining)}</span>
            </div>
            <button
              type="button"
              onClick={() => setShowEndTestConfirmModal(true)}
              className="px-3.5 py-1 rounded-lg bg-[#d63031] hover:bg-[#c0392b] text-white text-xs font-black cursor-pointer shadow-2xs transition-all active:scale-95"
            >
              End Test
            </button>
          </div>
        </div>

        {/* Top Sections Bar (Exact match to Image 1) */}
        <div className="bg-white rounded-2xl p-2.5 border border-slate-200 shadow-2xs flex items-center gap-2 overflow-x-auto">
          <span className="text-xs font-black text-slate-800 shrink-0 mr-1">Sections :</span>
          {sectionsList.map((sec, sIdx) => (
            <button
              key={sIdx}
              type="button"
              onClick={() => setActiveSection(sec)}
              className={`px-3 py-1 rounded-lg text-xs font-bold border transition-all cursor-pointer whitespace-nowrap ${
                activeSection === sec
                  ? 'border-blue-500 text-blue-600 bg-blue-50 font-black'
                  : 'border-slate-300 text-slate-700 bg-white hover:bg-slate-50'
              }`}
            >
              {sec}
            </button>
          ))}
        </div>

        {/* Main 2-Column Split View (Exact Image 1 layout) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 flex-1">
          {/* LEFT 9 COLS: Question Display & Option Boxes */}
          <div className="lg:col-span-9 flex flex-col justify-between space-y-3">
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs flex-1 flex flex-col justify-between space-y-4">
              <div>
                {/* Question Header: Q No & Marks */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 text-xs font-black text-slate-800">
                  <span>Q No: {activeQuestionIdx + 1} / {totalQCount}</span>
                  <span>Marks: {currentQ.marks || 1}</span>
                </div>

                {/* Question Text */}
                <div className="py-4 text-sm sm:text-base font-medium text-slate-900 leading-relaxed">
                  {currentQ.q}
                </div>

                {/* Options List with Colored Letter Boxes (Image 1 style) */}
                <div className="space-y-3 pt-2">
                  {(currentQ.options || []).map((opt, optIdx) => {
                    const optLabel = String.fromCharCode(65 + optIdx);
                    const isSelected = userSelectedOpt === optIdx;

                    const colorStyles = [
                      'bg-[#e84393] text-white', // A: Pink
                      'bg-[#e67e22] text-white', // B: Orange
                      'bg-[#00cec9] text-white', // C: Cyan
                      'bg-[#9b59b6] text-white'  // D: Purple
                    ];

                    return (
                      <div
                        key={optIdx}
                        onClick={() => handleSelectOption(activeQuestionIdx, optIdx)}
                        className={`flex items-center gap-3 p-2.5 rounded-xl border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-blue-50 border-blue-500 shadow-xs ring-1 ring-blue-500'
                            : 'bg-white border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <span className={`w-7 h-7 rounded-md flex items-center justify-center font-black text-xs shrink-0 shadow-2xs ${colorStyles[optIdx % 4]}`}>
                          {optLabel}
                        </span>
                        <span className="text-xs sm:text-sm font-semibold text-slate-800">
                          {opt}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Next Button inside question area right side */}
              <div className="flex justify-end pt-3">
                <button
                  type="button"
                  onClick={() => {
                    if (activeQuestionIdx < totalQCount - 1) {
                      handleJumpQuestion(activeQuestionIdx + 1);
                    }
                  }}
                  className="px-6 py-2 rounded-xl bg-[#00b074] hover:bg-[#009260] text-white text-xs font-black cursor-pointer shadow-sm flex items-center gap-1"
                >
                  <span>Next &gt;</span>
                </button>
              </div>
            </div>

            {/* Bottom Option Radio Button Selector Row (Exact Image 1 style) */}
            <div className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-2xs flex items-center gap-8 justify-start px-6">
              {['A', 'B', 'C', 'D'].map((letter, lIdx) => (
                <label key={letter} className="flex items-center gap-2 cursor-pointer text-xs font-black text-slate-800">
                  <input
                    type="radio"
                    name={`bottom_opt_select_${activeQuestionIdx}`}
                    checked={userSelectedOpt === lIdx}
                    onChange={() => handleSelectOption(activeQuestionIdx, lIdx)}
                    className="w-4 h-4 accent-blue-600 cursor-pointer"
                  />
                  <span>{letter}</span>
                </label>
              ))}
            </div>
          </div>

          {/* RIGHT 3 COLS: Question Palette Box (Exact Image 1 layout) */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs flex flex-col justify-between h-full space-y-4">
              <div>
                <div className="text-xs font-black text-slate-800 pb-2 border-b border-slate-100">
                  Total Question: {totalQCount}
                </div>

                {/* 1..50 Circles Grid */}
                <div className="grid grid-cols-8 sm:grid-cols-8 gap-1.5 pt-3 max-h-[320px] overflow-y-auto pr-1">
                  {Array.from({ length: totalQCount }).map((_, idx) => {
                    const isAnswered = selectedAnswers[idx] !== undefined;
                    const isFlagged = !!flaggedQuestions[idx];
                    const isVisited = !!visitedQuestions[idx];
                    const isCurrent = activeQuestionIdx === idx;

                    let bgClass = 'bg-slate-400 text-white'; // Non visited
                    if (isAnswered) {
                      bgClass = 'bg-[#00b074] text-white'; // Answered green
                    } else if (isFlagged) {
                      bgClass = 'bg-[#8e44ad] text-white'; // Flagged purple
                    } else if (isVisited) {
                      bgClass = 'bg-[#f39c12] text-white'; // Skipped orange
                    }

                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleJumpQuestion(idx)}
                        className={`w-7 h-7 rounded-full text-[11px] font-black flex items-center justify-center transition-all cursor-pointer ${bgClass} ${
                          isCurrent ? 'ring-2 ring-blue-600 ring-offset-1 scale-110 shadow-xs z-10' : ''
                        }`}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>

                {/* Legend matching Image 1 */}
                <div className="grid grid-cols-2 gap-y-2 gap-x-1 pt-4 text-[10px] font-bold text-slate-700 border-t border-slate-100 mt-3">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-400 shrink-0" />
                    <span>Non Visited</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#00b074] shrink-0" />
                    <span>Answered</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#f39c12] shrink-0" />
                    <span>Skipped</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#8e44ad] shrink-0" />
                    <span>Flagged</span>
                  </div>
                </div>
              </div>

              {/* End Test Button & Controls */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowEndTestConfirmModal(true)}
                  className="w-full py-2 bg-[#d63031] hover:bg-[#c0392b] text-white rounded-xl text-xs font-black cursor-pointer shadow-xs"
                >
                  End Test
                </button>

                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleClearAnswer(activeQuestionIdx)}
                    className="py-1.5 px-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[10px] font-bold cursor-pointer text-center"
                  >
                    Clear Response
                  </button>
                  <button
                    type="button"
                    onClick={() => handleToggleFlag(activeQuestionIdx)}
                    className="py-1.5 px-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[10px] font-bold cursor-pointer text-center"
                  >
                    {flaggedQuestions[activeQuestionIdx] ? 'Unflag' : 'Flag Question'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* MODAL: END TEST CONFIRMATION (Exact replica of user screenshot) */}
        {showEndTestConfirmModal && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-slate-200 shadow-2xl space-y-6 relative animate-in zoom-in-95">
              <button
                type="button"
                onClick={() => setShowEndTestConfirmModal(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 text-sm font-bold cursor-pointer p-1"
              >
                ✕
              </button>

              <div className="pt-2">
                <p className="text-sm sm:text-base font-medium text-slate-800 leading-relaxed">
                  Do you want to end test? Please make sure all attempted questions are marked <strong className="text-emerald-600 font-bold">GREEN</strong>.
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowEndTestConfirmModal(false);
                    handleSubmitTest();
                  }}
                  className="px-5 py-2 rounded-lg bg-[#2980b9] hover:bg-[#2471a3] text-white text-xs font-black uppercase tracking-wider transition-all shadow-sm active:scale-95 cursor-pointer"
                >
                  YES
                </button>
                <button
                  type="button"
                  onClick={() => setShowEndTestConfirmModal(false)}
                  className="px-5 py-2 rounded-lg bg-[#c0392b] hover:bg-[#a93226] text-white text-xs font-black uppercase tracking-wider transition-all shadow-sm active:scale-95 cursor-pointer"
                >
                  NO
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // =========================================================================
  // VIEW B: TEST INSTRUCTIONS & TEST SYNOPSIS (Exact Replica of User's Image 2)
  // =========================================================================
  if (selectedPaperForInstructions) {
    const p = selectedPaperForInstructions;
    return (
      <div className="min-h-[85vh] bg-slate-50 font-sans p-4 sm:p-6 pb-20 animate-in fade-in">
        <div className="max-w-6xl mx-auto space-y-4">
          {/* Top Back Navigation Bar */}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setSelectedPaperForInstructions(null)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-100 cursor-pointer shadow-2xs"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Papers</span>
            </button>
            <span className="text-xs font-black text-slate-700">{p.title}</span>
          </div>

          {/* 2-Column Split: Test Instructions (Left) & Test Synopsis (Right) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            {/* LEFT PANEL: Test Instructions */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-4">
              <h2 className="text-lg font-black text-[#2980b9] pb-2 border-b border-slate-100">
                Test Instructions
              </h2>

              <div className="space-y-3.5 text-xs text-slate-700 leading-relaxed max-h-[420px] overflow-y-auto pr-2">
                <p>
                  <strong className="text-slate-900">A.</strong> This test is based on <span className="font-bold text-[#d35400]">MCQ pattern</span> There are 4 options out of which only one is correct.
                </p>
                <p>
                  <strong className="text-slate-900">B.</strong> Your test duration begins as soon as you view the first question.
                </p>
                <p>
                  <strong className="text-slate-900">C.</strong> Once you end the test or the test duration gets completed, you will not be able to edit any of the answers.
                </p>
                <p>
                  <strong className="text-slate-900">D.</strong> When you click on <span className="font-bold text-[#d35400]">&apos;Next&apos; or &apos;Previous&apos;</span>, your answers will be saved.
                </p>
                <p>
                  <strong className="text-slate-900">E.</strong> Click on <span className="font-bold text-[#d35400]">&apos;Next&apos; or &apos;Previous&apos;</span> to move from one question to another. Clicking on &apos;Next&apos; or &apos;Previous&apos; will also save your answer.
                </p>
                <p>
                  <strong className="text-slate-900">F.</strong> Click on the <span className="font-bold text-[#27ae60]">&apos;Green Flag&apos;</span> to mark a question as Important. Click on <span className="font-bold text-[#d35400]">Notes</span> in right hand top corner to take notes. These can be reviewed later after the test in <span className="font-bold text-[#d35400]">My Notes</span> section.
                </p>
                <p>
                  <strong className="text-slate-900">G.</strong> Click on <span className="font-bold text-[#d35400]">&apos;End Test&apos;</span> once you have completed a test. You will not be able to edit or review any of the questions once you have ended a test, so please make sure to review all the questions before ending it.
                </p>
                <p>
                  <strong className="text-slate-900">H.</strong> Once you complete a test, the results will be available immediately. Your result will be available to you later under the <span className="font-bold text-[#d35400]">&apos;Reports and Analysis&apos;</span> section.
                </p>
              </div>
            </div>

            {/* RIGHT PANEL: Test Synopsis */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-5">
              <h2 className="text-lg font-black text-[#2980b9] pb-2 border-b border-slate-100">
                Test Synopsis
              </h2>

              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-slate-100">
                  <span className="text-xs font-bold text-slate-600 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-emerald-600" />
                    Test Name:
                  </span>
                  <span className="px-3 py-1 rounded-lg bg-[#27ae60] text-white font-black text-xs shadow-2xs">
                    {p.short_code || `${p.subject_code} - ${p.exam_year || '2019'}`}
                  </span>
                </div>

                <div className="flex items-center justify-between py-2 border-b border-slate-100">
                  <span className="text-xs font-bold text-slate-600 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-600" />
                    Test Duration (Min):
                  </span>
                  <span className="px-3 py-1 rounded-lg bg-[#e67e22] text-white font-black text-xs shadow-2xs">
                    {p.duration_minutes || 60}
                  </span>
                </div>

                <div className="flex items-center justify-between py-2 border-b border-slate-100">
                  <span className="text-xs font-bold text-slate-600 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-blue-600" />
                    Subject:
                  </span>
                  <span className="px-3 py-1 rounded-lg bg-[#2980b9] text-white font-black text-xs shadow-2xs">
                    {p.subject_code} {selectedClass.replace('Class ', '')}
                  </span>
                </div>

                <div className="flex items-center justify-between py-2 border-b border-slate-100">
                  <span className="text-xs font-bold text-slate-600 flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-cyan-600" />
                    No of Questions:
                  </span>
                  <span className="px-3 py-1 rounded-lg bg-[#00cec9] text-white font-black text-xs shadow-2xs">
                    {p.questions?.length || 50}
                  </span>
                </div>

                <div className="flex items-center justify-between py-2 border-b border-slate-100">
                  <span className="text-xs font-bold text-slate-600 flex items-center gap-2">
                    <Award className="w-4 h-4 text-purple-600" />
                    Total Marks:
                  </span>
                  <span className="px-3 py-1 rounded-lg bg-[#8e44ad] text-white font-black text-xs shadow-2xs">
                    {parseFloat(p.total_marks || 60).toFixed(1)}
                  </span>
                </div>
              </div>

              {/* Action Buttons: Start Test, Download PDF */}
              <div className="pt-2 space-y-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setPdfModalType('start_test');
                    setAgreedTerms(false);
                    setShowPdfTermsModal(true);
                  }}
                  className="w-full py-3 bg-[#00b074] hover:bg-[#009260] text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-md active:scale-95 cursor-pointer flex items-center justify-center gap-2"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Start Test</span>
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setPdfModalType('paper');
                      setAgreedTerms(false);
                      setShowPdfTermsModal(true);
                    }}
                    className="py-2.5 px-3 bg-[#2980b9] hover:bg-[#2471a3] text-white rounded-xl text-[11px] font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download PDF</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setPdfModalType('solution');
                      setAgreedTerms(false);
                      setShowPdfTermsModal(true);
                    }}
                    className="py-2.5 px-3 bg-[#2980b9] hover:bg-[#2471a3] text-white rounded-xl text-[11px] font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download PDF with answer</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* PDF Download Terms & Conditions Modal (Exact Image 2 Replica) */}
        {showPdfTermsModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="bg-white rounded-lg shadow-2xl max-w-lg w-full p-6 sm:p-7 space-y-4 border border-slate-300 relative text-left">
              {/* Notice Text (Exact match to screenshot 2) */}
              <p className="text-xs sm:text-[13px] text-slate-700 leading-relaxed font-normal">
                The content provided in this PDF is intended for personal use only. Unauthorized downloading, duplication, or distribution of this PDF for commercial purposes is strictly prohibited. Reproduction of this material without permission is strictly prohibited. Please respect intellectual property rights and ensure compliance with copyright laws. For any commercial use, explicit written permission must be obtained from SOF Olympiad Trainer.
              </p>

              {/* Checkbox */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="termsAgreeCheckbox"
                  checked={agreedTerms}
                  onChange={(e) => setAgreedTerms(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded border-slate-400 focus:ring-blue-500 cursor-pointer"
                />
                <label htmlFor="termsAgreeCheckbox" className="text-xs sm:text-sm font-semibold text-slate-800 cursor-pointer select-none">
                  I agree to Terms &amp; Conditions
                </label>
              </div>

              {/* Download / Action Button in Center */}
              <div className="flex justify-center pt-2">
                <button
                  type="button"
                  disabled={!agreedTerms}
                  onClick={handleExecutePdfDownload}
                  className={`px-6 py-2.5 rounded text-xs font-bold transition-all shadow-sm flex items-center gap-2 ${
                    agreedTerms
                      ? 'bg-[#0088cc] hover:bg-[#0077b3] text-white cursor-pointer active:scale-95'
                      : 'bg-slate-300 text-slate-500 cursor-not-allowed opacity-70'
                  }`}
                >
                  <Download className="w-4 h-4" />
                  <span>
                    {pdfModalType === 'solution'
                      ? 'Download PDF with answer'
                      : pdfModalType === 'start_test'
                      ? 'Download PDF & Start Test'
                      : 'Download PDF'}
                  </span>
                </button>
              </div>

              {/* Close Button on Bottom Right */}
              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowPdfTermsModal(false);
                    setAgreedTerms(false);
                  }}
                  className="px-5 py-1.5 bg-[#607d8b] hover:bg-[#546e7a] text-white text-xs font-bold rounded cursor-pointer transition-colors shadow-2xs"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // =========================================================================
  // VIEW C: MAIN SUBJECT DASHBOARD & EXAM PAPERS GRID (Exact Image 5, 4, 3)
  // =========================================================================
  return (
    <div className="space-y-5 animate-in fade-in duration-150 font-sans pb-16 relative">
      {/* Floating Toast Notification */}
      {toast && (
        <div className="fixed top-5 right-5 z-50 animate-in fade-in slide-in-from-top duration-200">
          <div
            className={`px-5 py-3 rounded-2xl shadow-xl font-black text-xs flex items-center gap-2 border ${
              toast.type === 'error'
                ? 'bg-rose-600 text-white border-rose-700 shadow-rose-200'
                : toast.type === 'info'
                ? 'bg-slate-800 text-white border-slate-900 shadow-slate-200'
                : 'bg-emerald-600 text-white border-emerald-700 shadow-emerald-200'
            }`}
          >
            <span>{toast.msg}</span>
          </div>
        </div>
      )}

      {/* Subject Header & Grade Selector */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#edd6ed] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-2xl ${subject.lightBg} border ${subject.borderColor} flex items-center justify-center shadow-2xs`}>
              {React.createElement(subject.icon, { className: 'w-6 h-6', style: { color: subject.accent } })}
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-black text-[#4e2a4a]">
                {subject.name}
              </h1>
              <p className="text-xs text-slate-500 font-semibold">
                Official Model Papers, Past Papers with Solutions &amp; Packages for {selectedClass}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500">Selected Class:</span>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-800 bg-white cursor-pointer shadow-2xs"
            >
              {ALL_CLASSES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 1: MOCK TEST SERIES COVERS & CARDS (Exact match to User Image 1)  */}
      {/* ========================================================================= */}
      <div className="space-y-6">
        {examPapers.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 border border-[#edd6ed] text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 mx-auto flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-base font-black text-slate-800">No Exam Papers Published Yet</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              No papers found for {subject.name} ({selectedClass}). Any mock test published from Super Admin will immediately appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Subject Mock Test Series Cover Header (Exact match to User Image 1) */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#859900]/10 text-[#859900] border border-[#859900]/30 flex items-center justify-center font-black">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-sm sm:text-base font-black text-slate-800">
                    {selectedClass}-All India {subject.code} Mock Test Series
                  </h2>
                  <p className="text-[11px] text-slate-500 font-medium">
                    National Ranking Mock Tests with Instant Analysis &amp; Answer Keys
                  </p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-[#859900]/10 text-[#687700] text-xs font-black self-start sm:self-auto">
                {examPapers.length} Mock Tests Available
              </span>
            </div>

            {/* Grid of Mock Test Cards (Exact Replica of User's Image 1) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {examPapers.map((paper) => {
                const attempt = studentAttempts[paper.id];
                const isCompleted = !!attempt;
                const statusText = isCompleted ? 'Completed' : 'Unattempted';
                const statusBg = isCompleted ? 'bg-[#27ae60]' : 'bg-[#d9534f]';
                const scoreText = isCompleted ? `${attempt.score} / ${attempt.totalMarks}` : 'none';

                return (
                  <div
                    key={paper.id}
                    className="bg-white rounded-lg border-2 border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden relative"
                  >
                    {/* Top Olive Green Banner Header (Exact Image 1 format) */}
                    <div>
                      <div className="bg-[#859900] text-white text-left py-2.5 px-4 font-black text-xs sm:text-sm shadow-xs tracking-tight">
                        {paper.title}
                      </div>

                      {/* Card Body Rows (Exact Image 1 format) */}
                      <div className="p-4 space-y-3 bg-white">
                        {/* Row 1: Status */}
                        <div className="flex items-center justify-between text-xs py-1 border-b border-slate-100">
                          <div className="flex items-center gap-2 text-slate-700 font-bold">
                            <FileText className="w-4 h-4 text-slate-500" />
                            <span>Status</span>
                          </div>
                          <span className={`px-2.5 py-0.5 rounded-sm ${statusBg} text-white font-black text-[10px] uppercase shadow-2xs`}>
                            {statusText}
                          </span>
                        </div>

                        {/* Row 2: Last Score */}
                        <div className="flex items-center justify-between text-xs py-1">
                          <div className="flex items-center gap-2 text-slate-700 font-bold">
                            <Bookmark className="w-4 h-4 text-slate-500" />
                            <span>Last Score</span>
                          </div>
                          <span className="px-3 py-0.5 rounded-full bg-[#8cb82b] text-white font-black text-[10px] shadow-2xs">
                            {scoreText}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Olive Green Open Button (Exact match to Image 1) */}
                    <div className="p-3 bg-white border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => setSelectedPaperForInstructions(paper)}
                        className="w-full py-2.5 bg-[#859900] hover:bg-[#738400] text-white rounded text-xs font-black uppercase tracking-wider transition-all shadow-xs active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <span>Open</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* SECTION 2: STUDY PACKAGES & BUNDLES                                       */}
      {/* ========================================================================= */}
      {packages.length > 0 && (
        <div className="space-y-4 pt-6 border-t border-slate-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#faf5fa] text-[#4e2a4a] border border-[#ebd7eb] flex items-center justify-center font-black">
              <Package className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-black text-[#4e2a4a]">
                {subject.name} Preparation Packages &amp; Bundles
              </h2>
              <p className="text-[11px] text-slate-500 font-medium">
                Comprehensive chapter-wise synopsis, past papers and practice kits for {selectedClass}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                className="bg-white rounded-2xl border-2 border-sky-300 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 relative"
              >
                <div>
                  <div
                    className="text-white text-center py-2.5 px-3 rounded-t-xl -mt-5 -mx-5 font-black text-xs sm:text-sm shadow-xs mb-4"
                    style={{ backgroundColor: pkg.header_color || '#4895d9' }}
                  >
                    {pkg.title}
                  </div>

                  <div className="space-y-2.5 text-xs text-slate-700 min-h-[140px]">
                    {(pkg.points || []).map((pt, pIdx) => (
                      <div key={pIdx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#00b074] shrink-0 mt-0.5" />
                        <span className="leading-snug text-[11.5px] font-medium text-slate-800">{pt}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 space-y-2">
                  <div className="text-center text-xs font-bold text-slate-500">
                    Price : <span className="font-black text-[#6d3a68]">₹{parseFloat(pkg.price).toFixed(2)}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedPackageDetail(pkg)}
                      className="w-full py-2 bg-[#537b99] hover:bg-[#43647d] text-white rounded-lg text-xs font-black uppercase transition-colors cursor-pointer"
                    >
                      VIEW DETAILS
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        addToCart({
                          id: `pkg_${pkg.id}`,
                          name: pkg.title,
                          price: Number(pkg.price),
                          class: selectedClass,
                          subject: subject.code
                        });
                        showToast(`✓ Added "${pkg.title}" to cart!`);
                      }}
                      className="w-full py-2 bg-[#eb4d4b] hover:bg-[#d63031] text-white rounded-lg text-xs font-black uppercase transition-colors cursor-pointer"
                    >
                      BUY
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
