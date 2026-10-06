import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { apiClient } from '../../api/client';
import { generateIntelligentOlympiadTest } from '../../utils/olympiadQuestionBank';
import {
  Lightbulb,
  Clock,
  CheckCircle2,
  Bookmark,
  ChevronRight,
  ChevronLeft,
  RotateCcw,
  Sparkles,
  Trophy,
  Award,
  AlertCircle,
  HelpCircle,
  BarChart3,
  Calendar,
  Check,
  X,
  Play,
  Zap,
  ArrowRight,
  Eye,
  FileText,
  ShieldCheck,
  Send,
  BookOpen,
  Printer,
  ArrowLeft,
  Download
} from 'lucide-react';
import { DownloadPaperPdfModal } from '../../components/common/DownloadPaperPdfModal';
import { DetailedSolutionsPage } from './DetailedSolutionsPage';

const CHAPTERS_BY_SUBJECT = {
  reasoning: [
    'Mirror and Water Images',
    'Cubes and Dice',
    'Dot Situation',
    'Blood Relations',
    'Mathematical Operations',
    'Embedded Figures & Grouping',
    'Analogy and Classification',
    'Paper Folding and Paper Cutting',
    'Logical Venn Diagrams',
    'Clock and Calendar',
    'Series Completion and Missing Character',
    'Alpha-Numeric & Logical Sequence',
    'Analytical Reasoning',
    'Coding - Decoding & Direction Sense'
  ],
  math: [
    'Number Sense and Numeration',
    'Computation Operations (Add, Sub, Mul, Div)',
    'Fractions and Decimals',
    'Geometry and Spatial Understanding',
    'Perimeter, Area and Volume',
    'Data Handling and Graphical Representation',
    'Algebraic Expressions and Equations',
    'Ratio, Proportion and Unitary Method',
    'Everyday Mathematics Word Problems',
    'Achievers Section (HOTS Questions)'
  ],
  science: [
    'Plants and Animal Kingdom',
    'Human Body Systems and Nutrition',
    'Matter, Materials and States of Matter',
    'Force, Work, Energy and Simple Machines',
    'Light, Shadows and Reflections',
    'Electricity, Circuits and Magnetism',
    'Air, Water and Our Environment',
    'Natural Resources and Conservation',
    'Earth, Universe and Space Sciences',
    'Scientific Inquiry & HOTS'
  ],
  english: [
    'Nouns, Pronouns and Determiners',
    'Verbs, Tenses and Modal Auxiliaries',
    'Adjectives, Adverbs and Prepositions',
    'Conjunctions and Sentence Structure',
    'Active and Passive Voice',
    'Direct and Indirect Speech',
    'Vocabulary, Synonyms and Antonyms',
    'Idioms, Proverbs and Phrasal Verbs',
    'Reading Comprehension Passages',
    'Spoken and Written Expression'
  ],
  cyber: [
    'Computers and Information Technology Basics',
    'Hardware, Memory and Storage Devices',
    'Operating Systems & Application Software',
    'MS Office (Word, PowerPoint, Excel)',
    'Internet, Networking & Cyber Security',
    'Algorithms and Flowcharts',
    'Latest IT Developments & AI',
    'Achievers Section (Advanced Computing)'
  ],
  gk: [
    'Our Body and Health',
    'Plants, Animals & Environment',
    'India: States, Capitals & Culture',
    'World Geography & Landmarks',
    'Science and Technology Discoveries',
    'Current National & International Affairs',
    'Sports, Games & Awards',
    'Life Skills & Quantitative Aptitude'
  ]
};

const subjectsMap = {
  english: { name: 'IEO (English)', code: 'IEO', color: '#ea580c', letter: 'E' },
  math: { name: 'IMO (Maths)', code: 'IMO', color: '#eab308', letter: 'M' },
  science: { name: 'ISO (Science)', code: 'ISO', color: '#16a34a', letter: 'S' },
  cyber: { name: 'ICSO (Cyber)', code: 'ICSO', color: '#0284c7', letter: 'C' },
  gk: { name: 'IGKO (GK)', code: 'IGKO', color: '#e7b84b', letter: 'G' },
  reasoning: { name: 'ISSO (Reasoning)', code: 'ISSO', color: '#7c3aed', letter: 'R' }
};

export const TestGeneratorPro = ({ onNavigateTab, onExitToDashboard }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('generator'); // 'generator' | 'list'

  // Super Admin Created Generator Papers State
  const [adminPapers, setAdminPapers] = useState([]);
  const [loadingAdminPapers, setLoadingAdminPapers] = useState(false);

  // Generator Configuration State
  const [selectedGrade, setSelectedGrade] = useState(user?.class || 'Class 6');
  const [selectedSubject, setSelectedSubject] = useState('math'); // 'english' | 'math' | 'science' | 'cyber' | 'gk' | 'reasoning'
  const [selectedLevel, setSelectedLevel] = useState('Level 1');
  const [selectedDifficulty, setSelectedDifficulty] = useState('Foundation');
  const [questionCount, setQuestionCount] = useState(10);
  const [testDurationMinutes, setTestDurationMinutes] = useState(15);
  const [selectedChapters, setSelectedChapters] = useState(CHAPTERS_BY_SUBJECT['math'] || []);
  const [generatorStep, setGeneratorStep] = useState('configure'); // 'configure' | 'instructions'
  const [hasAgreedInstructions, setHasAgreedInstructions] = useState(true);

  // Fetch Super Admin papers with strict Class & Subject parameters directly from API
  const fetchAdminPapers = async (grade = selectedGrade, subject = selectedSubject) => {
    setLoadingAdminPapers(true);
    try {
      const token = localStorage.getItem('token');
      let fetched = [];
      const res = await fetch(`/api/test-generator/admin-papers?class=${encodeURIComponent(grade)}&subject=${encodeURIComponent(subject)}`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      });
      const data = await res.json();
      if (data && data.success && Array.isArray(data.data)) {
        fetched = data.data;
      }
      
      // Merge with localStorage for zero-latency cross-tab sync
      const local = JSON.parse(localStorage.getItem('admin_generator_papers') || '[]');
      const combined = [...fetched];
      if (Array.isArray(local)) {
        local.forEach((lp) => {
          if (!combined.some((cp) => cp.id === lp.id || (cp.title === lp.title && (cp.class_name === lp.class_name || cp.class === lp.class)))) {
            combined.push(lp);
          }
        });
      }
      setAdminPapers(combined);
    } catch (e) {
      const local = JSON.parse(localStorage.getItem('admin_generator_papers') || '[]');
      setAdminPapers(Array.isArray(local) ? local : []);
    } finally {
      setLoadingAdminPapers(false);
    }
  };

  useEffect(() => {
    fetchAdminPapers(selectedGrade, selectedSubject);
  }, [selectedGrade, selectedSubject]);

  // Update selected chapters when subject changes
  useEffect(() => {
    if (CHAPTERS_BY_SUBJECT[selectedSubject]) {
      setSelectedChapters(CHAPTERS_BY_SUBJECT[selectedSubject]);
    }
  }, [selectedSubject]);

  // Toggle single chapter
  const handleToggleChapter = (chapterName) => {
    if (selectedChapters.includes(chapterName)) {
      setSelectedChapters(selectedChapters.filter((c) => c !== chapterName));
    } else {
      setSelectedChapters([...selectedChapters, chapterName]);
    }
  };

  // Toggle select all chapters
  const handleToggleAllChapters = () => {
    const allForSub = CHAPTERS_BY_SUBJECT[selectedSubject] || [];
    if (selectedChapters.length === allForSub.length) {
      setSelectedChapters([]);
    } else {
      setSelectedChapters(allForSub);
    }
  };

  // Helper to find matching Super Admin Paper for Class & Subject
  const getMatchingPaper = (grade = selectedGrade, subject = selectedSubject) => {
    return adminPapers.find((p) => {
      const pClass = (p.class_name || p.class || p.title || '').toLowerCase().trim();
      const selGrade = (grade || '').toLowerCase().trim();

      const pMatch = pClass.match(/\d+/);
      const selMatch = selGrade.match(/\d+/);

      if (pMatch && selMatch) {
        if (pMatch[0] !== selMatch[0]) return false;
      } else if (pClass && selGrade) {
        if (!pClass.includes(selGrade) && !selGrade.includes(pClass)) return false;
      }

      const subCode = (p.subject_code || p.subject || p.subject_name || '').toLowerCase().trim();
      const currentSub = (subject || '').toLowerCase().trim();
      const subMap = {
        math: ['imo', 'math', 'mathematics'],
        science: ['iso', 'science', 'nso'],
        cyber: ['ico', 'icso', 'cyber', 'computer', 'computers', 'ai'],
        english: ['ieo', 'english'],
        gk: ['igko', 'gk', 'general knowledge'],
        reasoning: ['lro', 'iro', 'isso', 'reasoning', 'social studies', 'aptitude']
      };
      const validCodes = subMap[currentSub] || [currentSub];
      return validCodes.some(
        (code) => subCode.includes(code) || (p.title || '').toLowerCase().includes(code)
      );
    });
  };

  const matchingPaper = getMatchingPaper(selectedGrade, selectedSubject);
  const hasMatchingPaper = !!(matchingPaper && Array.isArray(matchingPaper.questions) && matchingPaper.questions.length > 0);

  // Start exam with Super Admin created Paper
  const handleStartAdminPaper = (paper) => {
    if (!paper || !Array.isArray(paper.questions) || paper.questions.length === 0) {
      alert(`⚠️ No questions found in this exam paper. Please add questions from Super Admin panel.`);
      return;
    }
    const questionsToUse = paper.questions.map((q, idx) => ({
      id: q.id || idx + 1,
      q: q.q || q.question_text || `Question ${idx + 1}`,
      options: Array.isArray(q.options) && q.options.length >= 2 
        ? q.options 
        : [q.option_a || 'Option A', q.option_b || 'Option B', q.option_c || 'Option C', q.option_d || 'Option D'],
      correct: typeof q.correct === 'number' 
        ? q.correct 
        : (q.correct_option === 'B' ? 1 : q.correct_option === 'C' ? 2 : q.correct_option === 'D' ? 3 : 0),
      explanation: q.explanation || '',
      marks: q.marks || 1
    }));
    const dur = parseInt(paper.duration_minutes) || testDurationMinutes || 15;
    setTestQuestions(questionsToUse);
    setQuestionCount(questionsToUse.length);
    setTestDurationMinutes(dur);
    setRemainingSeconds(dur * 60);
    setCurrentIndex(0);
    setUserAnswers({});
    setMarkedForReview({});
    setVisitedQuestions({ 0: true });
    setIsSubmitted(false);
    setTestScore(null);
    setIsTestRunning(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Proceed to Instructions
  const handleProceedToInstructions = () => {
    if (selectedChapters.length === 0) {
      setSelectedChapters(CHAPTERS_BY_SUBJECT[selectedSubject] || []);
    }
    setGeneratorStep('instructions');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Back to Configure
  const handleBackToConfigure = () => {
    setGeneratorStep('configure');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // PDF Terms & Conditions Modal State
  const [pdfModalPaper, setPdfModalPaper] = useState(null);

  const handleOpenPdfForCurrentSetup = () => {
    const targetPaper = getMatchingPaper(selectedGrade, selectedSubject);
    if (targetPaper && Array.isArray(targetPaper.questions) && targetPaper.questions.length > 0) {
      setPdfModalPaper(targetPaper);
    } else {
      const generated = generateIntelligentOlympiadTest({
        subject: selectedSubject,
        grade: selectedGrade,
        level: selectedLevel,
        difficulty: selectedDifficulty,
        questionCount: questionCount || 10,
        selectedChapters: selectedChapters
      });
      setPdfModalPaper({
        title: `${selectedGrade} ${subjectsMap[selectedSubject]?.name || selectedSubject} - Olympiad Test Paper`,
        subject: selectedSubject,
        subject_code: subjectsMap[selectedSubject]?.code || selectedSubject.toUpperCase(),
        duration_minutes: testDurationMinutes || 15,
        total_marks: generated.length,
        questions: generated
      });
    }
  };

  // Active Test Session State
  const [isTestRunning, setIsTestRunning] = useState(false);
  const [testQuestions, setTestQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({}); // { [qIndex]: selectedOptionIdx }
  const [markedForReview, setMarkedForReview] = useState({}); // { [qIndex]: boolean }
  const [visitedQuestions, setVisitedQuestions] = useState({ 0: true });
  const [remainingSeconds, setRemainingSeconds] = useState(15 * 60);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [testScore, setTestScore] = useState(null);
  const [testResultSummary, setTestResultSummary] = useState(null);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [isSavingResult, setIsSavingResult] = useState(false);
  const [isSyncedWithAdmin, setIsSyncedWithAdmin] = useState(false);

  // Generated Tests History
  const [generatedTestsHistory, setGeneratedTestsHistory] = useState([]);

  // Timer Countdown Effect
  const timerRef = useRef(null);
  useEffect(() => {
    if (isTestRunning && !isSubmitted && remainingSeconds > 0) {
      timerRef.current = setInterval(() => {
        setRemainingSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            handleSubmitTest();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTestRunning, isSubmitted, remainingSeconds]);

  // Handle Start Test - Loads Super Admin authored questions or Intelligently Generates Curated Olympiad Questions
  const handleStartTest = () => {
    const targetPaper = getMatchingPaper(selectedGrade, selectedSubject);

    let questionsToUse = [];
    let dur = testDurationMinutes || 15;

    if (targetPaper && Array.isArray(targetPaper.questions) && targetPaper.questions.length > 0) {
      questionsToUse = targetPaper.questions.map((q, idx) => ({
        id: q.id || idx + 1,
        q: q.q || q.question_text || `Question ${idx + 1}`,
        options: Array.isArray(q.options) && q.options.length >= 2 
          ? q.options 
          : [q.option_a || 'Option A', q.option_b || 'Option B', q.option_c || 'Option C', q.option_d || 'Option D'],
        correct: typeof q.correct === 'number' 
          ? q.correct 
          : (q.correct_option === 'B' ? 1 : q.correct_option === 'C' ? 2 : q.correct_option === 'D' ? 3 : 0),
        explanation: q.explanation || '',
        marks: q.marks || 1
      }));
      dur = parseInt(targetPaper.duration_minutes) || testDurationMinutes || 15;
    } else {
      // Intelligently generate customized Olympiad questions for this class, subject, and chosen chapters
      questionsToUse = generateIntelligentOlympiadTest({
        subject: selectedSubject,
        grade: selectedGrade,
        level: selectedLevel,
        difficulty: selectedDifficulty,
        questionCount: questionCount || 10,
        selectedChapters: selectedChapters
      });
    }

    setTestQuestions(questionsToUse);
    setQuestionCount(questionsToUse.length);
    setTestDurationMinutes(dur);
    setCurrentIndex(0);
    setUserAnswers({});
    setMarkedForReview({});
    setVisitedQuestions({ 0: true });
    setRemainingSeconds(dur * 60);
    setIsSubmitted(false);
    setTestScore(null);
    setIsTestRunning(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Select Answer Option
  const handleSelectOption = (optIdx) => {
    setUserAnswers({
      ...userAnswers,
      [currentIndex]: optIdx
    });
  };

  // Toggle Mark For Review
  const handleToggleReview = () => {
    setMarkedForReview({
      ...markedForReview,
      [currentIndex]: !markedForReview[currentIndex]
    });
  };

  // Clear Option Response
  const handleClearResponse = () => {
    const next = { ...userAnswers };
    delete next[currentIndex];
    setUserAnswers(next);
  };

  // Jump to Question
  const handleJumpToQuestion = (idx) => {
    setCurrentIndex(idx);
    setVisitedQuestions({
      ...visitedQuestions,
      [idx]: true
    });
  };

  // Submit Test & Calculate Results
  const handleSubmitTest = () => {
    if (timerRef.current) clearInterval(timerRef.current);

    let correctCount = 0;
    testQuestions.forEach((q, idx) => {
      if (userAnswers[idx] === q.correct) {
        correctCount++;
      }
    });

    const totalQ = testQuestions.length;
    const pct = Math.round((correctCount / totalQ) * 100);
    const timeSpentSec = testDurationMinutes * 60 - remainingSeconds;
    const spentMins = Math.floor(timeSpentSec / 60);
    const spentSecs = timeSpentSec % 60;
    const timeStr = `${spentMins}m ${spentSecs < 10 ? '0' : ''}${spentSecs}s`;

    const solutionsFormatted = testQuestions.map((q, qIdx) => {
      const uAns = userAnswers[qIdx];
      const isCorrect = uAns === q.correct;
      const optLetter = uAns !== undefined ? String.fromCharCode(65 + uAns) : null;
      const correctLetter = String.fromCharCode(65 + (typeof q.correct === 'number' ? q.correct : 0));

      return {
        id: q.id || qIdx + 1,
        question_text: q.q || q.question_text || `Question ${qIdx + 1}`,
        q: q.q || q.question_text,
        options: q.options,
        option_a: q.options?.[0] || q.option_a || 'Option A',
        option_b: q.options?.[1] || q.option_b || 'Option B',
        option_c: q.options?.[2] || q.option_c || 'Option C',
        option_d: q.options?.[3] || q.option_d || 'Option D',
        selected_option: optLetter,
        correct_option: correctLetter,
        is_correct: isCorrect,
        marks: q.marks || 1,
        explanation: q.explanation || 'Refer to the official Olympiad step-by-step logic.'
      };
    });

    const targetPaperForMeta = getMatchingPaper(selectedGrade, selectedSubject);
    const metaFormatted = {
      exam_title: targetPaperForMeta?.title || `${selectedGrade} ${subjectsMap[selectedSubject]?.name || selectedSubject} Practice Test`,
      total_marks: totalQ,
      score: correctCount,
      cutoff_marks: Math.round(totalQ * 0.7),
      time_taken_seconds: timeSpentSec,
      duration_minutes: testDurationMinutes || 15
    };

    const summary = {
      correctCount,
      totalQ,
      pct,
      timeStr,
      subjectName: selectedSubject.toUpperCase(),
      grade: selectedGrade,
      level: selectedLevel,
      difficulty: selectedDifficulty,
      solutions: solutionsFormatted,
      attemptMeta: metaFormatted
    };

    setTestScore(correctCount);
    setTestResultSummary(summary);
    setIsSubmitted(true);

    // Prepare questions payload for Super Admin & Teacher portal
    const formattedQuestions = testQuestions.map((q, idx) => ({
      q: q.q,
      options: q.options,
      correct: q.correct,
      userSelected: userAnswers[idx] !== undefined ? userAnswers[idx] : null,
      explanation: q.explanation || ''
    }));

    const totalAnswered = Object.keys(userAnswers).length;
    const unansweredCount = totalQ - totalAnswered;
    const wrongCount = totalAnswered - correctCount;

    const targetPaper = getMatchingPaper(selectedGrade, selectedSubject);
    const token = apiClient.getToken();
    const payload = {
      exam_id: targetPaper?.id || null,
      student_id: user?.id || null,
      student_name: user?.full_name || user?.name || null,
      student_login_id: user?.login_id || null,
      student_email: user?.email || null,
      student_school: user?.school_name || user?.school || null,
      student_class: user?.class_name || selectedGrade,
      subject: selectedSubject,
      grade: selectedGrade,
      level: selectedLevel,
      difficulty: selectedDifficulty,
      totalQuestions: totalQ,
      durationMinutes: testDurationMinutes,
      timeSpentSeconds: timeSpentSec,
      score: correctCount,
      totalMarks: totalQ,
      percentage: pct,
      correctCount,
      wrongCount: Math.max(0, wrongCount),
      unansweredCount: Math.max(0, unansweredCount),
      questions: formattedQuestions
    };

    setIsSavingResult(true);
    const newAttemptRecord = {
      id: Date.now(),
      attempt_id: Date.now(),
      exam_id: targetPaper?.id || Date.now(),
      exam_title: `${selectedGrade} ${subjectsMap[selectedSubject]?.name || selectedSubject} Practice Test`,
      title: `${selectedGrade} ${subjectsMap[selectedSubject]?.name || selectedSubject} Practice Test`,
      paper_title: `${selectedGrade} ${subjectsMap[selectedSubject]?.name || selectedSubject} Practice Test`,
      subject: subjectsMap[selectedSubject]?.name || selectedSubject,
      subject_name: subjectsMap[selectedSubject]?.name || selectedSubject,
      subject_code: selectedSubject?.toUpperCase() || 'IMO',
      score: correctCount,
      total_marks: totalQ,
      total_questions: totalQ,
      correct_count: correctCount,
      incorrect_count: Math.max(0, wrongCount),
      unanswered_count: Math.max(0, unansweredCount),
      percentage: pct,
      accuracy: totalAnswered > 0 ? Math.round((correctCount / totalAnswered) * 100) : pct,
      passed: pct >= 40,
      time_taken_seconds: timeSpentSec,
      submitted_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
      student_id: user?.id || 1,
      student_name: user?.full_name || user?.name || 'Candidate',
      student_login_id: user?.login_id || 'STU-001',
      student_email: user?.email || '',
      student_school: user?.school_name || 'Independent Candidate',
      class_name: user?.class_name || selectedGrade,
      questions: formattedQuestions
    };

    try {
      const existing = JSON.parse(localStorage.getItem('olympiadhub_student_attempts') || '[]');
      localStorage.setItem('olympiadhub_student_attempts', JSON.stringify([newAttemptRecord, ...existing]));
      const existingResults = JSON.parse(localStorage.getItem('olympiadhub_db_results') || '[]');
      localStorage.setItem('olympiadhub_db_results', JSON.stringify([newAttemptRecord, ...existingResults]));
    } catch (e) {}

    apiClient.post('/test-generator/submit', payload)
      .then((data) => {
        setIsSyncedWithAdmin(true);
        window.dispatchEvent(new CustomEvent('olympiad-exam-submitted', { detail: newAttemptRecord }));
        window.dispatchEvent(new Event('exam-submitted'));
      })
      .catch((err) => {
        console.warn('Auto-save test to admin error:', err);
        window.dispatchEvent(new CustomEvent('olympiad-exam-submitted', { detail: newAttemptRecord }));
        window.dispatchEvent(new Event('exam-submitted'));
      })
      .finally(() => {
        setIsSavingResult(false);
      });

    // Add to history
    const newRecord = {
      id: `GEN-${Math.floor(10000 + Math.random() * 90000)}`,
      title: `${selectedSubject.toUpperCase()} ${selectedLevel} ${selectedDifficulty} Test`,
      grade: selectedGrade,
      subject: selectedSubject,
      level: selectedLevel,
      difficulty: selectedDifficulty,
      date: new Date().toISOString().split('T')[0],
      score: `${correctCount}/${totalQ} (${pct}%)`,
      status: 'Completed',
      duration: timeStr
    };
    setGeneratedTestsHistory([newRecord, ...generatedTestsHistory]);
  };

  // Format Timer Display
  const formatTimer = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // =========================================================================
  // VIEW: DETAILED SOLUTIONS & PERFORMANCE REVIEW (Matching user screenshot)
  // =========================================================================
  if (isSubmitted && testResultSummary) {
    return (
      <DetailedSolutionsPage
        initialSolutions={testResultSummary.solutions}
        initialAttemptMeta={testResultSummary.attemptMeta}
        onBack={() => {
          setIsTestRunning(false);
          setIsSubmitted(false);
          if (onExitToDashboard) onExitToDashboard();
        }}
        onGoToList={() => {
          setIsTestRunning(false);
          setIsSubmitted(false);
          if (onExitToDashboard) onExitToDashboard();
        }}
        onViewAnalysis={() => {
          if (onNavigateTab) onNavigateTab('performance');
        }}
        onNavigateTab={onNavigateTab}
      />
    );
  }

  if (false && isSubmitted && testResultSummary) {
    const isGold = testResultSummary.pct >= 80;
    const isPass = testResultSummary.pct >= 40;

    return (
      <div className="min-h-screen bg-slate-50 font-sans pb-20 animate-in fade-in duration-150">
        {/* Top Header Bar */}
        <div className="bg-white border-b border-slate-200/80 sticky top-0 z-30 shadow-2xs">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setIsTestRunning(false);
                  setIsSubmitted(false);
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
                  Examination Result &amp; Evaluation
                </span>
                <h1 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                  Performance Scorecard Report
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
                  setIsTestRunning(false);
                  setIsSubmitted(false);
                  handleStartTest();
                }}
                className="px-4 py-1.5 bg-gradient-to-r from-[#ec4899] via-[#8b5cf6] to-[#3b82f6] hover:from-[#db2777] hover:via-[#7c3aed] hover:to-[#2563eb] text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-md cursor-pointer flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retake Test ⚡</span>
              </button>
            </div>
          </div>
        </div>

        {/* Content Container */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">
          
          {/* Hero Banner Card */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs text-center space-y-4 relative overflow-hidden">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-100 to-amber-200 text-amber-600 mx-auto flex items-center justify-center shadow-md shadow-amber-500/10">
              <Trophy className="w-10 h-10" />
            </div>

            <div className="space-y-1">
              <span className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-black uppercase tracking-wider ${
                isPass ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
              }`}>
                <span className={`w-2 h-2 rounded-full ${isPass ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                {isPass ? 'QUALIFIED & PASSED' : 'NEEDS PRACTICE'}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Test Completed Successfully!
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                {testResultSummary.subjectName} • {testResultSummary.grade} • {testResultSummary.level} ({testResultSummary.difficulty})
              </p>
            </div>

            {/* Sync Confirmation Badge */}
            <div className="inline-flex items-center gap-2 py-1.5 px-4 bg-emerald-50 border border-emerald-200 rounded-full text-xs font-bold text-emerald-800">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                {isSavingResult ? 'Saving result to Super Admin Portal...' : '✓ Result Verified & Synced with Super Admin & Teacher Portals'}
              </span>
            </div>

            {/* 4 Score Highlights Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-100">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/60 text-center">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Final Score</p>
                <p className="text-2xl font-black text-slate-900 font-mono mt-1">
                  {testResultSummary.correctCount} <span className="text-xs text-slate-400 font-normal">/ {testResultSummary.totalQ}</span>
                </p>
              </div>

              <div className="p-4 bg-emerald-50/70 rounded-2xl border border-emerald-200/70 text-center">
                <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">Accuracy</p>
                <p className="text-2xl font-black text-emerald-700 font-mono mt-1">
                  {testResultSummary.pct}%
                </p>
              </div>

              <div className="p-4 bg-indigo-50/70 rounded-2xl border border-indigo-200/70 text-center">
                <p className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider">Time Spent</p>
                <p className="text-2xl font-black text-indigo-700 font-mono mt-1">
                  {testResultSummary.timeStr}
                </p>
              </div>

              <div className="p-4 bg-amber-50/70 rounded-2xl border border-amber-200/70 text-center">
                <p className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">Distinction</p>
                <p className="text-sm font-black text-amber-800 mt-2">
                  {isGold ? '🌟 Gold Merit' : isPass ? '🥈 Qualified' : '📘 Keep Practicing'}
                </p>
              </div>
            </div>
          </div>

          {/* Detailed Question-by-Question Solution Section */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  Detailed Question-by-Question Solution Key
                </h3>
                <p className="text-xs text-slate-500">
                  Review every question, your selected option, verified correct answer, and explanation.
                </p>
              </div>
              <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-lg">
                {testResultSummary.correctCount} of {testResultSummary.totalQ} Correct
              </span>
            </div>

            {/* Questions List */}
            <div className="space-y-4">
              {testQuestions.map((q, qIdx) => {
                const uAns = userAnswers[qIdx];
                const isCorrect = uAns === q.correct;
                const isUnanswered = uAns === undefined;

                return (
                  <div
                    key={qIdx}
                    className={`p-5 rounded-2xl border transition-all ${
                      isCorrect
                        ? 'bg-emerald-50/20 border-emerald-200'
                        : isUnanswered
                        ? 'bg-slate-50/60 border-slate-200'
                        : 'bg-rose-50/20 border-rose-200'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-2.5">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-slate-900 text-white font-mono font-bold text-xs flex items-center justify-center">
                          {qIdx + 1}
                        </span>
                        <span className="text-xs font-bold text-slate-500">
                          Question #{qIdx + 1}
                        </span>
                      </div>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        isCorrect
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : isUnanswered
                          ? 'bg-slate-200 text-slate-700'
                          : 'bg-rose-100 text-rose-800 border border-rose-200'
                      }`}>
                        {isCorrect ? '✓ Correct (+1 Mark)' : isUnanswered ? '○ Not Attempted' : '✕ Incorrect (0 Marks)'}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 leading-relaxed mb-3">
                      {q.q}
                    </h4>

                    {/* Options Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                      {q.options?.map((opt, optIdx) => {
                        const optLabel = String.fromCharCode(65 + optIdx);
                        const isChosen = uAns === optIdx;
                        const isRightOpt = q.correct === optIdx;

                        let optClass = 'bg-white border-slate-200 text-slate-700';
                        if (isRightOpt) {
                          optClass = 'bg-emerald-100/70 border-emerald-300 text-emerald-900 font-bold';
                        } else if (isChosen && !isRightOpt) {
                          optClass = 'bg-rose-100/70 border-rose-300 text-rose-900 font-bold line-through';
                        }

                        return (
                          <div
                            key={optIdx}
                            className={`p-2.5 rounded-xl border text-xs flex items-center gap-2.5 ${optClass}`}
                          >
                            <span className={`w-5 h-5 rounded-md flex items-center justify-center font-bold text-[10px] ${
                              isRightOpt ? 'bg-emerald-600 text-white' : isChosen ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-600'
                            }`}>
                              {optLabel}
                            </span>
                            <span className="flex-1">{opt}</span>
                            {isRightOpt && <span className="text-[10px] font-black text-emerald-800">✓ Correct</span>}
                            {isChosen && !isRightOpt && <span className="text-[10px] font-black text-rose-800">Your Pick</span>}
                          </div>
                        );
                      })}
                    </div>

                    {q.explanation && (
                      <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200/60 text-xs text-amber-900 space-y-0.5">
                        <span className="font-bold text-[11px] block text-amber-800">💡 Step-by-Step Explanation:</span>
                        <p>{q.explanation}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Bottom Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-6 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  setIsTestRunning(false);
                  setIsSubmitted(false);
                  if (onExitToDashboard) onExitToDashboard();
                }}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
              >
                Back to Dashboard
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsTestRunning(false);
                  setIsSubmitted(false);
                  handleStartTest();
                }}
                className="px-6 py-2.5 rounded-xl text-xs font-black text-white bg-gradient-to-r from-[#ec4899] via-[#8b5cf6] to-[#3b82f6] hover:from-[#db2777] hover:via-[#7c3aed] hover:to-[#2563eb] transition-all cursor-pointer shadow-md flex items-center gap-2"
              >
                <span>Generate Another Test</span>
                <Sparkles className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // RENDER: ACTIVE MCQ TEST ENGINE (When Test Is Running)
  // =========================================================================
  if (isTestRunning) {
    const currentQ = testQuestions[currentIndex] || {};
    const isAnswered = userAnswers[currentIndex] !== undefined;
    const isMarked = !!markedForReview[currentIndex];
    const totalAnswered = Object.keys(userAnswers).length;
    const totalMarked = Object.values(markedForReview).filter(Boolean).length;

    return (
      <div className="space-y-5 font-sans animate-in fade-in duration-150 max-w-7xl mx-auto pb-12">
        {/* Top Clean Test Bar (Properly spaced without overlapping) */}
        <div className="bg-white rounded-3xl border border-[#edd6ed] p-4 sm:p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#f4ebf4] text-[#6d3a68] flex items-center justify-center font-black text-sm">
              Q{currentIndex + 1}
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-black text-[#4e2a4a]">
                {subjectsMap[selectedSubject]?.name} — {selectedGrade} ({selectedLevel} {selectedDifficulty})
              </h2>
              <p className="text-xs text-slate-500 font-semibold">
                Question {currentIndex + 1} of {testQuestions.length} • Single Choice MCQ
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-center">
            {/* Countdown Timer */}
            <div className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border font-mono font-black text-sm ${
              remainingSeconds < 180
                ? 'bg-red-50 text-red-600 border-red-200 animate-pulse'
                : 'bg-[#faf5fa] text-[#6d3a68] border-[#edd6ed]'
            }`}>
              <Clock className="w-4 h-4" />
              <span>{formatTimer(remainingSeconds)}</span>
            </div>

            {/* Exit Test */}
            <button
              type="button"
              onClick={() => setShowExitConfirm(true)}
              className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
            >
              Exit
            </button>

            {/* Submit Button */}
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

        {/* Modal: Submit / Exit Confirmation (Matching exact design from user screenshot) */}
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

        {/* 2-Column Test Layout: Left (Question & Options) + Right (Question Palette 1,2,3...) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* LEFT 8 COLS: 1-by-1 MCQ Viewer */}
          <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-7 border border-[#edd6ed] shadow-sm flex flex-col justify-between min-h-[480px]">
            <div className="space-y-5">
              {/* Question Header */}
              <div className="flex items-center justify-between pb-3 border-b border-[#f4ebf4]">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#f4ebf4] text-[#6d3a68] font-black text-xs uppercase">
                    Question {currentIndex + 1}
                  </span>
                  {isMarked && (
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold text-xs flex items-center gap-1">
                      <Bookmark className="w-3 h-3 fill-amber-700" />
                      Marked for Review
                    </span>
                  )}
                </div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  +1.00 Marks
                </span>
              </div>

              {/* Question Statement */}
              <div>
                <h3 className="text-base sm:text-lg font-bold text-[#321630] leading-relaxed">
                  {currentQ.q}
                </h3>
              </div>

              {/* 4 Selectable Options (A, B, C, D) */}
              <div className="space-y-3 pt-2">
                {currentQ.options?.map((optionText, optIdx) => {
                  const isSelected = userAnswers[currentIndex] === optIdx;
                  const optionLabel = String.fromCharCode(65 + optIdx);

                  return (
                    <button
                      key={optIdx}
                      type="button"
                      onClick={() => handleSelectOption(optIdx)}
                      className={`w-full p-4 rounded-2xl border text-left text-xs sm:text-sm font-semibold transition-all flex items-center justify-between cursor-pointer group ${
                        isSelected
                          ? 'bg-[#f4ebf4] border-[#6d3a68] text-[#4e2a4a] ring-2 ring-[#6d3a68]/20 shadow-xs'
                          : 'bg-white border-[#edd6ed] text-slate-700 hover:bg-[#faf5fa] hover:border-[#6d3a68]/40'
                      }`}
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <span className={`w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs transition-all shrink-0 ${
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
                        }`}>
                          {optionLabel}
                        </span>
                        <span className="leading-snug">{optionText}</span>
                      </div>

                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-gradient-to-r from-[#ec4899] via-[#8b5cf6] to-[#3b82f6] text-white flex items-center justify-center shrink-0">
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
                  onClick={handleToggleReview}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                    isMarked
                      ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                      : 'bg-[#faf5fa] text-slate-600 hover:bg-[#f4ebf4] hover:text-[#6d3a68]'
                  }`}
                >
                  <Bookmark className={`w-3.5 h-3.5 ${isMarked ? 'fill-amber-700' : ''}`} />
                  <span>{isMarked ? 'Unmark Review' : 'Mark for Review'}</span>
                </button>

                {isAnswered && (
                  <button
                    type="button"
                    onClick={handleClearResponse}
                    className="px-3 py-2 rounded-xl text-xs font-bold text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Clear Response</span>
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleJumpToQuestion(Math.max(0, currentIndex - 1))}
                  disabled={currentIndex === 0}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 bg-[#faf5fa] hover:bg-[#f4ebf4] disabled:opacity-40 transition-colors cursor-pointer flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                {currentIndex < testQuestions.length - 1 ? (
                  <button
                    type="button"
                    onClick={() => handleJumpToQuestion(currentIndex + 1)}
                    className="px-5 py-2 rounded-xl text-xs font-black text-white bg-gradient-to-r from-[#ec4899] via-[#8b5cf6] to-[#3b82f6] hover:from-[#db2777] hover:via-[#7c3aed] hover:to-[#2563eb] transition-all cursor-pointer shadow-sm flex items-center gap-1"
                  >
                    <span>Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowExitConfirm(true)}
                    className="px-6 py-2 rounded-xl text-xs font-black text-[#c2185b] bg-[#fff0f3] hover:bg-[#ffe3e8] border border-[#f8bbd0] transition-all cursor-pointer shadow-xs flex items-center gap-2"
                  >
                    <Send className="w-3.5 h-3.5 text-[#c2185b]" />
                    <span>Submit Test</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT 4 COLS: Right-Side 1, 2, 3... Question Palette */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white rounded-3xl p-5 border border-[#edd6ed] shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#f4ebf4]">
                <h4 className="text-xs font-black text-[#4e2a4a] uppercase tracking-wider">
                  Question Palette
                </h4>
                <span className="text-[11px] font-bold text-slate-400">
                  {totalAnswered} / {testQuestions.length} Answered
                </span>
              </div>

              {/* Status Legend */}
              <div className="grid grid-cols-2 gap-2 text-[10px] font-bold text-slate-600 pb-1">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-md bg-[#00b074]" />
                  <span>Answered ({totalAnswered})</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-md bg-amber-400" />
                  <span>Review ({totalMarked})</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-md bg-[#6d3a68]" />
                  <span>Current</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-md bg-slate-200" />
                  <span>Not Visited</span>
                </div>
              </div>

              {/* Grid of 1, 2, 3... Boxes */}
              <div className="grid grid-cols-5 gap-2 pt-2">
                {testQuestions.map((_, qIdx) => {
                  const ans = userAnswers[qIdx] !== undefined;
                  const rev = markedForReview[qIdx];
                  const isCur = currentIndex === qIdx;
                  const isVis = visitedQuestions[qIdx];

                  let boxClass = 'bg-slate-100 text-slate-600 border-slate-200';
                  if (isCur) {
                    boxClass = 'bg-gradient-to-r from-[#ec4899] via-[#8b5cf6] to-[#3b82f6] text-white border-[#6d3a68] ring-2 ring-[#6d3a68]/30 font-black shadow-xs';
                  } else if (rev) {
                    boxClass = 'bg-amber-400 text-slate-900 border-amber-500 font-bold';
                  } else if (ans) {
                    boxClass = 'bg-[#00b074] text-white border-[#00b074] font-bold';
                  } else if (isVis) {
                    boxClass = 'bg-slate-200 text-slate-700 border-slate-300';
                  }

                  return (
                    <button
                      key={qIdx}
                      type="button"
                      onClick={() => handleJumpToQuestion(qIdx)}
                      className={`h-10 rounded-xl border text-xs flex items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95 ${boxClass}`}
                      title={`Go to Question ${qIdx + 1}`}
                    >
                      {qIdx + 1}
                    </button>
                  );
                })}
              </div>

              {/* Summary Stats in Palette */}
              <div className="pt-3 border-t border-[#f4ebf4] text-center">
                <p className="text-[11px] text-slate-500 font-medium">
                  Click any question number box to jump directly to it.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // RENDER: GENERATOR & SUMMARY SETUP VIEW (Matching user screenshots)
  // =========================================================================
  return (
    <div className="space-y-6 font-sans animate-in fade-in duration-150 max-w-7xl mx-auto pb-12">
      {/* Top Header Tabs: [ Test Generator ] & [ Generated Tests List ] */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setActiveTab('generator')}
          className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer shadow-2xs ${
            activeTab === 'generator'
              ? 'bg-[#e7b84b] text-[#321630] border border-[#d4a236]'
              : 'bg-white text-slate-600 border border-[#edd6ed] hover:bg-[#faf5fa]'
          }`}
        >
          Test Generator
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('list')}
          className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer shadow-2xs ${
            activeTab === 'list'
              ? 'bg-[#e7b84b] text-[#321630] border border-[#d4a236]'
              : 'bg-white text-slate-600 border border-[#edd6ed] hover:bg-[#faf5fa]'
          }`}
        >
          Generated Tests List
        </button>
      </div>

      {activeTab === 'list' ? (
        /* GENERATED TESTS LIST VIEW */
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#edd6ed] shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#f4ebf4]">
            <div>
              <h3 className="text-lg font-black text-[#4e2a4a]">Your Generated Tests History</h3>
              <p className="text-xs text-slate-500">Track and review all customized tests you have created.</p>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab('generator')}
              className="px-4 py-2 bg-gradient-to-r from-[#ec4899] via-[#8b5cf6] to-[#3b82f6] text-white rounded-xl text-xs font-bold cursor-pointer"
            >
              + Create New Test
            </button>
          </div>

          <div className="space-y-3">
            {generatedTestsHistory.map((t) => (
              <div
                key={t.id}
                className="p-4 rounded-2xl bg-[#faf5fa] border border-[#edd6ed] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-[#f4ebf4] text-[#6d3a68]">
                      {t.id}
                    </span>
                    <h4 className="font-bold text-sm text-[#4e2a4a]">{t.title}</h4>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    {t.grade} • {t.level} • {t.difficulty} • Date: {t.date} • Duration: {t.duration}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                    Score: {t.score}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedGrade(t.grade);
                      setSelectedSubject(t.subject);
                      setSelectedLevel(t.level);
                      setSelectedDifficulty(t.difficulty);
                      setActiveTab('generator');
                    }}
                    className="px-3.5 py-1.5 bg-white hover:bg-[#f4ebf4] text-[#6d3a68] border border-[#edd6ed] rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    Re-generate ⚡
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : generatorStep === 'instructions' ? (
        /* ========================================================================= */
        /* INSTRUCTIONS & EXAM GUIDELINES SCREEN (Step 2 of Flow)                     */
        /* ========================================================================= */
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-[#edd6ed] shadow-lg space-y-6 animate-in fade-in zoom-in-95">
          {/* Top Header with Back to Setup */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#f4ebf4]">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleBackToConfigure}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Back to Setup</span>
                </button>
                <span className="px-2.5 py-0.5 rounded-full bg-[#f4ebf4] text-[#6d3a68] text-[10px] font-black uppercase">
                  Step 2 of 2: Exam Instructions
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-[#4e2a4a] pt-1">
                Test Guidelines &amp; Instructions
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Please review your test summary and read all instructions carefully before starting.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={handleOpenPdfForCurrentSetup}
                className="px-4 py-2.5 rounded-xl border border-blue-400 bg-blue-50 hover:bg-blue-100 text-blue-700 font-black text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                title="Download Question Paper PDF with Terms & Conditions"
              >
                <Download className="w-4 h-4 text-blue-600" />
                <span>Download PDF</span>
              </button>
              <button
                type="button"
                onClick={handleBackToConfigure}
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Modify Selection
              </button>
              <button
                type="button"
                disabled={!hasAgreedInstructions}
                onClick={handleStartTest}
                className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-md flex items-center gap-2 cursor-pointer ${
                  hasAgreedInstructions
                    ? 'bg-[#00b074] hover:bg-[#009260] text-white active:scale-95'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <span>Start Test Now</span>
                <Play className="w-3.5 h-3.5 fill-current" />
              </button>
            </div>
          </div>

          {/* Test Engine Status Banner */}
          {hasMatchingPaper ? (
            <div className="p-4 bg-emerald-50 rounded-2xl border-2 border-emerald-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-emerald-950 uppercase tracking-wide">
                    ✓ Official Super Admin Exam Paper Found
                  </h4>
                  <p className="text-xs text-emerald-800 font-bold mt-0.5">
                    &quot;{matchingPaper.title}&quot; • {matchingPaper.questions.length} Questions authored by Super Admin
                  </p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-xl bg-emerald-200 text-emerald-900 text-[11px] font-black uppercase shrink-0 text-center">
                Ready to Attempt
              </span>
            </div>
          ) : (
            <div className="p-4 bg-emerald-50/70 rounded-2xl border-2 border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                  <Sparkles className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-emerald-950 uppercase tracking-wide">
                    ✨ AI Olympiad Question Engine Ready
                  </h4>
                  <p className="text-xs text-emerald-800 font-medium mt-0.5">
                    Generating <strong>{questionCount} curated Olympiad MCQs</strong> for <strong>{selectedGrade} ({subjectsMap[selectedSubject]?.name || selectedSubject})</strong> from selected chapters.
                  </p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-xl bg-emerald-200 text-emerald-900 text-[11px] font-black uppercase shrink-0 text-center">
                Ready to Generate &amp; Start
              </span>
            </div>
          )}

          {/* Selected Test Configuration Banner */}
          <div className="bg-[#faf5fa] rounded-2xl p-5 border border-[#edd6ed] space-y-3">
            <h4 className="text-xs font-black text-[#4e2a4a] uppercase tracking-wider">
              Selected Test Configuration:
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
              <div className="p-2.5 bg-white rounded-xl border border-[#edd6ed]/60">
                <p className="text-[10px] text-slate-400 font-bold uppercase">Grade</p>
                <p className="font-black text-slate-800 mt-0.5">{selectedGrade}</p>
              </div>
              <div className="p-2.5 bg-white rounded-xl border border-[#edd6ed]/60">
                <p className="text-[10px] text-slate-400 font-bold uppercase">Olympiad</p>
                <p className="font-black text-slate-800 mt-0.5">{subjectsMap[selectedSubject]?.name || selectedSubject}</p>
              </div>
              <div className="p-2.5 bg-white rounded-xl border border-[#edd6ed]/60">
                <p className="text-[10px] text-slate-400 font-bold uppercase">Level</p>
                <p className="font-black text-slate-800 mt-0.5">{selectedLevel}</p>
              </div>
              <div className="p-2.5 bg-white rounded-xl border border-[#edd6ed]/60">
                <p className="text-[10px] text-slate-400 font-bold uppercase">Difficulty</p>
                <p className="font-black text-slate-800 mt-0.5">{selectedDifficulty}</p>
              </div>
              <div className="p-2.5 bg-white rounded-xl border border-[#edd6ed]/60">
                <p className="text-[10px] text-slate-400 font-bold uppercase">Questions</p>
                <p className="font-black text-slate-800 mt-0.5">
                  {hasMatchingPaper ? `${matchingPaper.questions.length} MCQs` : `${questionCount} MCQs`}
                </p>
              </div>
              <div className="p-2.5 bg-white rounded-xl border border-[#edd6ed]/60">
                <p className="text-[10px] text-slate-400 font-bold uppercase">Duration</p>
                <p className="font-black text-slate-800 mt-0.5">
                  {hasMatchingPaper ? `${matchingPaper.duration_minutes || testDurationMinutes} Minutes` : `${testDurationMinutes} Minutes`}
                </p>
              </div>
            </div>

            {/* Selected Topics List */}
            <div className="pt-2 border-t border-[#edd6ed]/60">
              <p className="text-[11px] font-bold text-slate-500 mb-1.5">
                Topics Included ({selectedChapters.length}):
              </p>
              <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto">
                {selectedChapters.map((ch) => (
                  <span
                    key={ch}
                    className="px-2.5 py-0.5 rounded-lg bg-white border border-[#edd6ed] text-[11px] font-semibold text-[#6d3a68]"
                  >
                    {ch}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Detailed Guidelines Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            {/* 1. Exam Structure & Navigation */}
            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-2">
              <div className="flex items-center gap-2 text-[#6d3a68] font-black text-sm">
                <HelpCircle className="w-4 h-4" />
                <h4>1. Test Navigation</h4>
              </div>
              <ul className="space-y-1.5 text-slate-600 list-disc list-inside">
                <li>Questions appear <strong>one by one</strong> on your screen.</li>
                <li>Use <strong>Next</strong> and <strong>Previous</strong> buttons to move.</li>
                <li>Use the <strong>Right Question Palette</strong> to jump directly to any question.</li>
                <li>Click <strong>Mark for Review</strong> to flag tricky questions.</li>
              </ul>
            </div>

            {/* 2. Timing & Auto-Submit */}
            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-2">
              <div className="flex items-center gap-2 text-[#6d3a68] font-black text-sm">
                <Clock className="w-4 h-4" />
                <h4>2. Timer &amp; Submission</h4>
              </div>
              <ul className="space-y-1.5 text-slate-600 list-disc list-inside">
                <li>Countdown timer runs at the top right: <strong>{matchingPaper?.duration_minutes || testDurationMinutes}:00</strong>.</li>
                <li>The test auto-submits when time reaches <strong>00:00</strong>.</li>
                <li>You can click <strong>Submit Test</strong> anytime when finished.</li>
                <li>Do not close or refresh the tab while the test is active.</li>
              </ul>
            </div>

            {/* 3. Scoring & Solutions */}
            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-2">
              <div className="flex items-center gap-2 text-[#6d3a68] font-black text-sm">
                <Award className="w-4 h-4" />
                <h4>3. Scoring &amp; Review</h4>
              </div>
              <ul className="space-y-1.5 text-slate-600 list-disc list-inside">
                <li>Correct response: <strong>+1.00 Mark</strong>.</li>
                <li>Incorrect response: <strong>0.00</strong> (No negative marking).</li>
                <li>Instant diagnostic scorecard with score percentage.</li>
                <li>Complete step-by-step solutions available immediately.</li>
              </ul>
            </div>
          </div>

          {/* Agreement Checkbox */}
          <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 flex items-start gap-3">
            <input
              type="checkbox"
              id="agree-instructions"
              checked={hasAgreedInstructions}
              onChange={(e) => setHasAgreedInstructions(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded border-amber-400 text-[#00b074] focus:ring-[#00b074] accent-[#00b074] cursor-pointer"
            />
            <label htmlFor="agree-instructions" className="text-xs font-semibold text-slate-800 cursor-pointer select-none">
              I have read and understood all the test instructions and guidelines above. I am ready to begin the test.
            </label>
          </div>

          {/* Bottom Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={handleBackToConfigure}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back / Change Settings</span>
            </button>

            <div className="w-full sm:w-auto flex flex-col sm:flex-row items-center gap-3">
              <button
                type="button"
                onClick={handleOpenPdfForCurrentSetup}
                className="w-full sm:w-auto px-6 py-3 rounded-2xl border-2 border-blue-400 bg-blue-50 hover:bg-blue-100 text-blue-700 font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm hover:shadow active:scale-95"
              >
                <Download className="w-4 h-4 text-blue-600" />
                <span>Download PDF</span>
              </button>

              <button
                type="button"
                disabled={!hasAgreedInstructions}
                onClick={handleStartTest}
                className={`w-full sm:w-auto px-8 py-3 rounded-2xl text-sm font-black uppercase tracking-wider transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer ${
                  hasAgreedInstructions
                    ? 'bg-[#00b074] hover:bg-[#009260] text-white hover:shadow-xl active:scale-95'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <span>{hasMatchingPaper ? 'Start Test Now (Official Paper)' : 'Generate & Start Test Now ⚡'}</span>
                <Play className="w-4 h-4 fill-current" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* ========================================================================= */
        /* MAIN TEST GENERATOR VIEW (Step 1: Configure & Select Topics)              */
        /* ========================================================================= */
        <div className="space-y-6 animate-in fade-in duration-150">
          {/* Main Card: Olympiad Intelligent Test Generator Pro */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#edd6ed] shadow-sm relative">
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
                <h1 className="text-xl sm:text-2xl font-black text-[#4e2a4a] tracking-tight">
                  Olympiad Intelligent Test Generator Pro
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
                  Create Your Own Olympiad Test In Seconds
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6">
              {/* LEFT 7 COLS: Selection Steps 1, 2, 3, 4 */}
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
                    {['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'].map((g) => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => setSelectedGrade(g)}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          selectedGrade === g
                            ? 'bg-gradient-to-r from-[#ec4899] via-[#8b5cf6] to-[#3b82f6] text-white shadow-xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Step 2: Select Olympiad */}
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
                      onClick={() => setSelectedSubject('english')}
                      className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 transition-all cursor-pointer ${
                        selectedSubject === 'english'
                          ? 'bg-[#df7950] text-white border-[#df7950] shadow-sm ring-2 ring-[#df7950]/30'
                          : 'bg-[#faf5fa] text-slate-700 border-slate-200 hover:bg-[#f4ebf4]'
                      }`}
                    >
                      <input type="radio" checked={selectedSubject === 'english'} readOnly className="accent-white" />
                      <span className="font-black font-mono tracking-wider">I E O</span>
                      <Lightbulb className="w-3.5 h-3.5 text-yellow-300 fill-yellow-400" />
                    </button>

                    {/* IMO */}
                    <button
                      type="button"
                      onClick={() => setSelectedSubject('math')}
                      className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 transition-all cursor-pointer ${
                        selectedSubject === 'math'
                          ? 'bg-[#e8ac2c] text-white border-[#e8ac2c] shadow-sm ring-2 ring-[#e8ac2c]/30'
                          : 'bg-[#faf5fa] text-slate-700 border-slate-200 hover:bg-[#f4ebf4]'
                      }`}
                    >
                      <input type="radio" checked={selectedSubject === 'math'} readOnly className="accent-white" />
                      <span className="font-black font-mono tracking-wider">I M O</span>
                      <Lightbulb className="w-3.5 h-3.5 text-yellow-300 fill-yellow-400" />
                    </button>

                    {/* ISO */}
                    <button
                      type="button"
                      onClick={() => setSelectedSubject('science')}
                      className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 transition-all cursor-pointer ${
                        selectedSubject === 'science'
                          ? 'bg-[#9db83b] text-white border-[#9db83b] shadow-sm ring-2 ring-[#9db83b]/30'
                          : 'bg-[#faf5fa] text-slate-700 border-slate-200 hover:bg-[#f4ebf4]'
                      }`}
                    >
                      <input type="radio" checked={selectedSubject === 'science'} readOnly className="accent-white" />
                      <span className="font-black font-mono tracking-wider">I S O</span>
                      <Lightbulb className="w-3.5 h-3.5 text-yellow-300 fill-yellow-400" />
                    </button>

                    {/* ICSO */}
                    <button
                      type="button"
                      onClick={() => setSelectedSubject('cyber')}
                      className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 transition-all cursor-pointer ${
                        selectedSubject === 'cyber'
                          ? 'bg-[#0284c7] text-white border-[#0284c7] shadow-sm ring-2 ring-[#0284c7]/30'
                          : 'bg-[#faf5fa] text-slate-700 border-slate-200 hover:bg-[#f4ebf4]'
                      }`}
                    >
                      <input type="radio" checked={selectedSubject === 'cyber'} readOnly className="accent-white" />
                      <span className="font-black font-mono tracking-wider">I C S O</span>
                      <Lightbulb className="w-3.5 h-3.5 text-yellow-300 fill-yellow-400" />
                    </button>

                    {/* IGKO */}
                    <button
                      type="button"
                      onClick={() => setSelectedSubject('gk')}
                      className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 transition-all cursor-pointer ${
                        selectedSubject === 'gk'
                          ? 'bg-[#eab308] text-white border-[#eab308] shadow-sm ring-2 ring-[#eab308]/30'
                          : 'bg-[#faf5fa] text-slate-700 border-slate-200 hover:bg-[#f4ebf4]'
                      }`}
                    >
                      <input type="radio" checked={selectedSubject === 'gk'} readOnly className="accent-white" />
                      <span className="font-black font-mono tracking-wider">I G K O</span>
                      <Lightbulb className="w-3.5 h-3.5 text-yellow-300 fill-yellow-400" />
                    </button>

                    {/* ISSO / REASONING */}
                    <button
                      type="button"
                      onClick={() => setSelectedSubject('reasoning')}
                      className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 transition-all cursor-pointer ${
                        selectedSubject === 'reasoning'
                          ? 'bg-[#b97fa8] text-white border-[#b97fa8] shadow-sm ring-2 ring-[#b97fa8]/30'
                          : 'bg-[#faf5fa] text-slate-700 border-slate-200 hover:bg-[#f4ebf4]'
                      }`}
                    >
                      <input type="radio" checked={selectedSubject === 'reasoning'} readOnly className="accent-white" />
                      <span className="font-black text-xs uppercase tracking-wider">ISSO (Reasoning)</span>
                      <Lightbulb className="w-3.5 h-3.5 text-yellow-300 fill-yellow-400" />
                    </button>
                  </div>
                </div>

                {/* Step 3: Olympiad Level */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="flex items-center gap-2 w-44 shrink-0">
                    <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 text-[11px] font-black flex items-center justify-center">
                      3
                    </span>
                    <span className="text-xs font-black text-slate-700">Olympiad Level:</span>
                  </div>
                  <div className="flex items-center gap-2 flex-1">
                    {['Level 1', 'Level 2'].map((lvl) => (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => setSelectedLevel(lvl)}
                        className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                          selectedLevel === lvl
                            ? 'bg-gradient-to-r from-[#ec4899] via-[#8b5cf6] to-[#3b82f6] text-white border-[#d9775b] shadow-xs'
                            : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        {lvl}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Step 4: Difficulty Level */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="flex items-center gap-2 w-44 shrink-0">
                    <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 text-[11px] font-black flex items-center justify-center">
                      4
                    </span>
                    <span className="text-xs font-black text-slate-700">Difficulty Level:</span>
                  </div>
                  <div className="flex items-center gap-2 flex-1">
                    {['Foundation', 'Advance'].map((diff) => (
                      <button
                        key={diff}
                        type="button"
                        onClick={() => setSelectedDifficulty(diff)}
                        className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                          selectedDifficulty === diff
                            ? 'bg-[#00b074] text-white border-[#00b074] shadow-xs'
                            : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        {diff}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Step 5: Questions Count & Time */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-2">
                  <div className="flex items-center gap-2 w-44 shrink-0">
                    <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 text-[11px] font-black flex items-center justify-center">
                      5
                    </span>
                    <span className="text-xs font-black text-slate-700">Test Duration:</span>
                  </div>
                  <div className="flex items-center gap-2 flex-1">
                    {[
                      { q: 10, mins: 15 },
                      { q: 20, mins: 30 },
                      { q: 30, mins: 45 }
                    ].map((opt) => (
                      <button
                        key={opt.q}
                        type="button"
                        onClick={() => {
                          setQuestionCount(opt.q);
                          setTestDurationMinutes(opt.mins);
                        }}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                          questionCount === opt.q
                            ? 'bg-gradient-to-r from-[#ec4899] via-[#8b5cf6] to-[#3b82f6] text-white border-[#6d3a68] shadow-xs'
                            : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        {opt.q} Qs ({opt.mins} Mins)
                      </button>
                    ))}
                  </div>
                </div>

                {/* Step 6: Select Chapters / Topics */}
                <div className="space-y-3 pt-3 border-t border-[#f4ebf4]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 text-[11px] font-black flex items-center justify-center">
                        6
                      </span>
                      <span className="text-xs font-black text-slate-700">
                        Select Chapters ({subjectsMap[selectedSubject]?.name || selectedSubject}):
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={handleToggleAllChapters}
                      className={`px-3 py-1 rounded-full text-xs font-black transition-all border cursor-pointer ${
                        selectedChapters.length === (CHAPTERS_BY_SUBJECT[selectedSubject]?.length || 0)
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100'
                          : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      {selectedChapters.length === (CHAPTERS_BY_SUBJECT[selectedSubject]?.length || 0)
                        ? '✓ Deselect All'
                        : '+ Select All'}
                    </button>
                  </div>

                  {/* Topic Checkboxes Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-72 overflow-y-auto pr-1">
                    {(CHAPTERS_BY_SUBJECT[selectedSubject] || []).map((ch) => {
                      const isChecked = selectedChapters.includes(ch);
                      return (
                        <div
                          key={ch}
                          onClick={() => handleToggleChapter(ch)}
                          className={`flex items-start gap-2.5 p-2.5 rounded-xl border text-xs font-medium cursor-pointer transition-all select-none ${
                            isChecked
                              ? 'bg-[#faf5fa] border-[#d4b5d4] text-[#4e2a4a] shadow-2xs font-semibold'
                              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {}}
                            className="mt-0.5 rounded border-slate-300 text-[#6d3a68] focus:ring-[#6d3a68] accent-[#6d3a68] cursor-pointer"
                          />
                          <span className="leading-snug">{ch}</span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Next Step Button below Step 6 */}
                  <div className="pt-2 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500 font-medium">
                      {selectedChapters.length} of {CHAPTERS_BY_SUBJECT[selectedSubject]?.length || 0} topics selected
                    </span>
                    <button
                      type="button"
                      onClick={handleProceedToInstructions}
                      className="px-5 py-2.5 bg-[#6d3a68] hover:bg-[#582d54] text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-md active:scale-95 cursor-pointer flex items-center gap-2"
                    >
                      <span>Next: Instructions &amp; Start</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* RIGHT 5 COLS: Cute Robot Mascot + My Test Summary Card */}
              <div className="lg:col-span-5 flex flex-col items-center">
                {/* Cute Robot Mascot Illustration sitting on top */}
                <div className="relative -mb-6 z-10">
                  <svg className="w-16 h-16 drop-shadow-md" viewBox="0 0 100 100" fill="none">
                    {/* Head */}
                    <rect x="25" y="25" width="50" height="40" rx="12" fill="#e05338" />
                    {/* Screen / Face */}
                    <rect x="32" y="32" width="36" height="26" rx="8" fill="#1e293b" />
                    {/* Glowing Eyes */}
                    <circle cx="43" cy="45" r="4" fill="#fbbf24" className="animate-pulse" />
                    <circle cx="57" cy="45" r="4" fill="#fbbf24" className="animate-pulse" />
                    {/* Antenna */}
                    <line x1="50" y1="25" x2="50" y2="12" stroke="#e05338" strokeWidth="4" strokeLinecap="round" />
                    <circle cx="50" cy="10" r="4" fill="#fbbf24" />
                    {/* Body / Shoulders */}
                    <path d="M 30 72 C 30 65, 70 65, 70 72 L 75 90 C 75 95, 25 95, 25 90 Z" fill="#334155" />
                    {/* Chest light */}
                    <circle cx="50" cy="80" r="3" fill="#38bdf8" />
                  </svg>
                </div>

                {/* My Test Summary Card */}
                <div className="w-full bg-white rounded-3xl p-6 pt-9 border-2 border-[#edd6ed] shadow-lg space-y-4 text-center relative">
                  <h3 className="text-base font-black text-[#2e1065] tracking-tight">
                    My Test Summary
                  </h3>

                  <div className="grid grid-cols-2 gap-3 text-left">
                    {/* Grade */}
                    <div className="flex items-center gap-2 p-2 rounded-xl bg-[#faf5fa]">
                      <div className="w-7 h-7 rounded-lg bg-[#f4ebf4] text-[#6d3a68] flex items-center justify-center font-bold text-xs">
                        📇
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">Grade</p>
                        <p className="text-xs font-black text-slate-800">{selectedGrade}</p>
                      </div>
                    </div>

                    {/* Subject */}
                    <div className="flex items-center gap-2 p-2 rounded-xl bg-[#faf5fa]">
                      <div className="w-7 h-7 rounded-lg bg-[#f4ebf4] text-[#6d3a68] flex items-center justify-center font-bold text-xs">
                        ➕
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">Subject</p>
                        <p className="text-xs font-black text-slate-800 uppercase">{selectedSubject}</p>
                      </div>
                    </div>

                    {/* Difficulty */}
                    <div className="flex items-center gap-2 p-2 rounded-xl bg-[#faf5fa]">
                      <div className="w-7 h-7 rounded-lg bg-[#f4ebf4] text-[#6d3a68] flex items-center justify-center font-bold text-xs">
                        🎯
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">Difficulty</p>
                        <p className="text-xs font-black text-slate-800">{selectedDifficulty}</p>
                      </div>
                    </div>

                    {/* Level */}
                    <div className="flex items-center gap-2 p-2 rounded-xl bg-[#faf5fa]">
                      <div className="w-7 h-7 rounded-lg bg-[#f4ebf4] text-[#6d3a68] flex items-center justify-center font-bold text-xs">
                        🔺
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">Level</p>
                        <p className="text-xs font-black text-slate-800">{selectedLevel}</p>
                      </div>
                    </div>

                    {/* Questions */}
                    <div className="flex items-center gap-2 p-2 rounded-xl bg-[#faf5fa]">
                      <div className="w-7 h-7 rounded-lg bg-[#f4ebf4] text-[#6d3a68] flex items-center justify-center font-bold text-xs">
                        💬
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">Questions</p>
                        <p className="text-xs font-black text-slate-800">
                          {hasMatchingPaper ? `${matchingPaper.questions.length} MCQs` : `${questionCount} MCQs`}
                        </p>
                      </div>
                    </div>

                    {/* Time */}
                    <div className="flex items-center gap-2 p-2 rounded-xl bg-[#faf5fa]">
                      <div className="w-7 h-7 rounded-lg bg-[#f4ebf4] text-[#6d3a68] flex items-center justify-center font-bold text-xs">
                        ⏱️
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">Duration</p>
                        <p className="text-xs font-black text-slate-800">
                          {hasMatchingPaper ? `${matchingPaper.duration_minutes || testDurationMinutes} Mins` : `${testDurationMinutes} Mins`}
                        </p>
                      </div>
                    </div>

                    {/* Paper Status */}
                    <div className="flex items-center gap-2 p-2 rounded-xl col-span-2 border bg-emerald-50/70 border-emerald-200">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 bg-emerald-100 text-emerald-800">
                        {hasMatchingPaper ? '✓' : '✨'}
                      </div>
                      <div className="flex-1 min-w-0 text-left">
                        <p className="text-[10px] font-bold uppercase text-emerald-800">
                          {hasMatchingPaper ? 'Admin Verified Paper' : 'AI Olympiad Engine'}
                        </p>
                        <p className="text-xs font-black truncate text-emerald-950">
                          {hasMatchingPaper ? `Published (${matchingPaper.questions.length} Questions)` : `Ready (${questionCount} Curated MCQs)`}
                        </p>
                      </div>
                    </div>

                    {/* Chapters Selected */}
                    <div className="flex items-center gap-2 p-2 rounded-xl bg-[#faf5fa] col-span-2">
                      <div className="w-7 h-7 rounded-lg bg-[#f4ebf4] text-[#6d3a68] flex items-center justify-center font-bold text-xs">
                        📚
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] text-slate-400 font-bold uppercase">Chapters Selected</p>
                        <p className="text-xs font-black text-slate-800 truncate">
                          {selectedChapters.length === (CHAPTERS_BY_SUBJECT[selectedSubject]?.length || 0)
                            ? `All Topics (${selectedChapters.length})`
                            : `${selectedChapters.length} of ${CHAPTERS_BY_SUBJECT[selectedSubject]?.length || 0} Selected`}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* NEXT / PROCEED TO INSTRUCTIONS BUTTON */}
                  <button
                    type="button"
                    onClick={handleProceedToInstructions}
                    className="w-full py-3 bg-[#6d3a68] hover:bg-[#582d54] text-white rounded-2xl text-sm font-black uppercase tracking-wider transition-all shadow-lg hover:shadow-xl active:scale-95 cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>Next: View Instructions</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Summary Banner */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#edd6ed] shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#6d3a68]" />
                <h3 className="text-sm sm:text-base font-black text-[#4e2a4a]">
                  Test Engine Instructions &amp; Guidelines
                </h3>
              </div>
              <button
                type="button"
                onClick={handleProceedToInstructions}
                className="px-4 py-1.5 bg-[#f4ebf4] hover:bg-[#edd6ed] text-[#6d3a68] rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
              >
                <span>Read Full Instructions</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-slate-600">
              <div className="p-3 bg-[#faf5fa] rounded-2xl border border-[#edd6ed] space-y-1">
                <p className="font-bold text-[#6d3a68]">1. Scoring &amp; Navigation</p>
                <p>Each question carries +1.00 Mark. No negative marking. You can navigate sequentially or jump directly via the Question Palette.</p>
              </div>
              <div className="p-3 bg-[#faf5fa] rounded-2xl border border-[#edd6ed] space-y-1">
                <p className="font-bold text-[#6d3a68]">2. Auto-Timer</p>
                <p>The {testDurationMinutes}-minute countdown starts immediately. The test auto-submits when time expires, evaluating all answers.</p>
              </div>
              <div className="p-3 bg-[#faf5fa] rounded-2xl border border-[#edd6ed] space-y-1">
                <p className="font-bold text-[#6d3a68]">3. Instant Solution Review</p>
                <p>Upon submission, your scorecard and detailed step-by-step explanations for every question will be available immediately.</p>
              </div>
            </div>
          </div>

          {/* PRO PACKAGE BANNER */}
          <div className="bg-white rounded-3xl border-2 border-[#00b074] p-6 sm:p-7 shadow-sm">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-4 flex-1">
                <div>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#ecfdf5] text-[#059669] font-black text-[10px] uppercase tracking-wider border border-[#a7f3d0]">
                    PRO PACKAGE
                  </span>
                  <h3 className="text-lg sm:text-xl font-black text-slate-900 mt-1.5">
                    Olympiads Intelligent Test Generator Pro — {selectedGrade}
                  </h3>
                  <p className="text-xs text-slate-500 font-semibold">
                    Don&apos;t Just Practice. Practice Intelligently.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                  <div className="flex items-center gap-2 text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-[#00b074] shrink-0" />
                    <span>Generate 25 personalised Olympiad tests across IMO, NSO &amp; IEO</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-[#00b074] shrink-0" />
                    <span>Choose your subject, topics &amp; difficulty level</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-[#00b074] shrink-0" />
                    <span>Expert-curated question bank built by experienced Olympiad experts</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-[#00b074] shrink-0" />
                    <span>Generated tests stay in your login for future reference</span>
                  </div>
                </div>
              </div>

              {/* Pricing Box */}
              <div className="lg:w-60 p-5 rounded-2xl bg-[#faf5fa] border border-[#edd6ed] text-center space-y-3 shrink-0">
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Special Launch Price</p>
                  <p className="text-2xl font-black text-[#4e2a4a]">
                    ₹ 499 <span className="text-xs text-slate-400 font-normal">/- only</span>
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleProceedToInstructions}
                  className="w-full py-2.5 bg-[#00b074] hover:bg-[#009260] text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-md active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span>Proceed to Test</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PDF Download Terms & Conditions Modal */}
      <DownloadPaperPdfModal
        isOpen={!!pdfModalPaper}
        onClose={() => setPdfModalPaper(null)}
        paper={pdfModalPaper}
        onStartExamAfterDownload={() => handleStartTest()}
      />
    </div>
  );
};
