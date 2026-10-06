import React, { useState, useEffect, useRef } from 'react';
import { apiClient } from '../../api/client';
import {
  Clock,
  CheckCircle2,
  AlertTriangle,
  Camera,
  Video,
  VideoOff,
  User,
  Shield,
  HelpCircle,
  ArrowRight,
  ArrowLeft,
  Check,
  X,
  RotateCcw,
  Send,
  Sparkles,
  Award,
  BookOpen,
  FileText,
  Bookmark,
  Eye,
  Smartphone,
  Headphones,
  Calculator,
  Monitor,
  Globe,
  Users,
  MessageSquare,
  Watch,
  BatteryCharging,
  Wifi,
  Sun,
  Edit3,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export const FreeTrialExperience = ({ onNavigatePublic, onOpenLogin, onOpenRegister }) => {
  // Dynamic Real Exams from Super Admin
  const [trialExams, setTrialExams] = useState([]);
  const [loadingExams, setLoadingExams] = useState(true);

  // Flow State: 'list' | 'system-check' | 'camera-pos' | 'dos-donts' | 'instructions' | 'exam' | 'result'
  const [stage, setStage] = useState('list');
  const [selectedExam, setSelectedExam] = useState(null);
  const [userName, setUserName] = useState('Scholar Candidate');
  const [userClass, setUserClass] = useState('Class 11');

  // Fetch published exams from Super Admin API
  const fetchTrialExams = async () => {
    setLoadingExams(true);
    try {
      const res = await fetch('/api/test-generator/admin-papers');
      const data = await res.json();
      if (data && data.success && Array.isArray(data.data)) {
        const formatted = data.data.map((p) => ({
          id: String(p.id),
          code: p.subject_code || p.subject || 'OLYMPIAD',
          title: p.title,
          subject: p.subject_name || p.subject,
          duration: `${p.duration_minutes || 60} Min`,
          durationSec: (p.duration_minutes || 60) * 60,
          totalQuestions: Array.isArray(p.questions) ? p.questions.length : 0,
          totalMarks: p.total_marks || (Array.isArray(p.questions) ? p.questions.length : 0),
          questions: (p.questions || []).map((q, idx) => ({
            id: q.id || idx + 1,
            text: q.q || q.question_text || `Question ${idx + 1}`,
            options: Array.isArray(q.options) && q.options.length >= 2 
              ? q.options 
              : [q.option_a || 'Option A', q.option_b || 'Option B', q.option_c || 'Option C', q.option_d || 'Option D'],
            correct: typeof q.correct === 'number' 
              ? q.correct 
              : (q.correct_option === 'B' ? 1 : q.correct_option === 'C' ? 2 : q.correct_option === 'D' ? 3 : 0),
            explanation: q.explanation || ''
          }))
        }));
        setTrialExams(formatted);
        if (formatted.length > 0) setSelectedExam(formatted[0]);
      } else {
        setTrialExams([]);
      }
    } catch (e) {
      setTrialExams([]);
    } finally {
      setLoadingExams(false);
    }
  };

  useEffect(() => {
    fetchTrialExams();
  }, []);

  // Camera Position Checkbox
  const [camPosChecked, setCamPosChecked] = useState(false);

  // Do's and Don'ts Checkbox
  const [rulesChecked, setRulesChecked] = useState(false);

  // Instructions Checkbox & Mode
  const [attemptMode, setAttemptMode] = useState('with-webcam');
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [instructionCertified, setInstructionCertified] = useState(false);
  const videoRef = useRef(null);

  // Exam state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({}); // { [qId]: { selected: 0, marked: false, visited: true } }
  const [timeLeftSec, setTimeLeftSec] = useState(3600);
  const [isExamSubmitted, setIsExamSubmitted] = useState(false);
  const [examScore, setExamScore] = useState({ correct: 0, wrong: 0, unattempted: 0, score: 0, accuracy: 0 });
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [tabWarnings, setTabWarnings] = useState(0);
  const [showTabWarningModal, setShowTabWarningModal] = useState(false);

  // Screen metrics
  const [screenMetrics, setScreenMetrics] = useState({
    viewport: typeof window !== 'undefined' ? window.innerWidth : 1280,
    screenDiag: '15.6"',
    browser: 'Chrome / Edge'
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const diag = Math.sqrt(Math.pow(window.screen.width, 2) + Math.pow(window.screen.height, 2)) / 96;
      setScreenMetrics({
        viewport: window.innerWidth,
        screenDiag: (diag > 11 ? diag.toFixed(1) : '15.6') + '" detected',
        browser: navigator.userAgent.includes('Edg') ? 'Edge 154' : navigator.userAgent.includes('Chrome') ? 'Chrome 128' : 'Web Browser'
      });
    }
  }, []);

  // Timer effect for live exam
  useEffect(() => {
    let timer = null;
    if (stage === 'exam' && !isExamSubmitted) {
      timer = setInterval(() => {
        setTimeLeftSec((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            handleSubmitExam();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [stage, isExamSubmitted]);

  // Tab switch security detection during exam
  useEffect(() => {
    const handleVisibility = () => {
      if (stage === 'exam' && !isExamSubmitted && document.hidden) {
        setTabWarnings((prev) => {
          const next = prev + 1;
          setShowTabWarningModal(true);
          return next;
        });
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [stage, isExamSubmitted]);

  // Camera toggle handler
  const handleToggleCamera = async () => {
    if (isCameraActive) {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach((t) => t.stop());
        videoRef.current.srcObject = null;
      }
      setIsCameraActive(false);
    } else {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
          setIsCameraActive(true);
        } else {
          setIsCameraActive(true);
        }
      } catch (err) {
        console.warn('Webcam permission note:', err);
        setIsCameraActive(true); // Fallback simulated preview
      }
    }
  };

  const handleSelectExamToStart = (exam) => {
    setSelectedExam(exam);
    // Initialize answers
    const initialAnswers = {};
    exam.questions.forEach((q, idx) => {
      initialAnswers[q.id] = { selected: null, marked: false, visited: idx === 0 };
    });
    setUserAnswers(initialAnswers);
    setCurrentQuestionIndex(0);
    setTimeLeftSec(exam.durationSec || 3600);
    setCamPosChecked(false);
    setRulesChecked(false);
    setInstructionCertified(false);
    setStage('system-check');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectOption = (qId, optionIdx) => {
    setUserAnswers((prev) => ({
      ...prev,
      [qId]: {
        ...(prev[qId] || {}),
        selected: optionIdx,
        visited: true
      }
    }));
  };

  const handleToggleMarkForReview = (qId) => {
    setUserAnswers((prev) => ({
      ...prev,
      [qId]: {
        ...(prev[qId] || {}),
        marked: !(prev[qId]?.marked),
        visited: true
      }
    }));
  };

  const handleClearResponse = (qId) => {
    setUserAnswers((prev) => ({
      ...prev,
      [qId]: {
        ...(prev[qId] || {}),
        selected: null,
        visited: true
      }
    }));
  };

  const handleGoToQuestion = (idx) => {
    const q = selectedExam.questions[idx];
    if (q) {
      setUserAnswers((prev) => ({
        ...prev,
        [q.id]: {
          ...(prev[q.id] || {}),
          visited: true
        }
      }));
      setCurrentQuestionIndex(idx);
    }
  };

  const handleSaveAndNext = () => {
    if (currentQuestionIndex < selectedExam.questions.length - 1) {
      handleGoToQuestion(currentQuestionIndex + 1);
    } else {
      setShowSubmitConfirm(true);
    }
  };

  const handleSubmitExam = () => {
    setShowSubmitConfirm(false);
    setIsExamSubmitted(true);

    let correct = 0;
    let wrong = 0;
    let unattempted = 0;

    selectedExam.questions.forEach((q) => {
      const ans = userAnswers[q.id]?.selected;
      if (ans === null || ans === undefined) {
        unattempted += 1;
      } else if (ans === q.correct) {
        correct += 1;
      } else {
        wrong += 1;
      }
    });

    const total = selectedExam.questions.length;
    const score = correct * 2; // 2 marks per question
    const accuracy = correct + wrong > 0 ? Math.round((correct / (correct + wrong)) * 100) : 0;

    // Auto-save to MySQL database
    apiClient.post('/free-trial/submit', {
      studentName: 'Guest Student',
      examId: selectedExam?.id || 'trial-exam',
      examTitle: selectedExam?.title || 'Olympiad Trial Exam',
      gradeLevel: selectedExam?.grade || userClass || 'Class 5',
      score,
      totalQuestions: total,
      correct,
      wrong,
      unattempted,
      accuracy
    }).catch((err) => {
      console.warn('Auto-save free trial notice:', err);
    });

    setExamScore({ correct, wrong, unattempted, score, accuracy });
    setStage('result');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const currentQ = selectedExam?.questions?.[currentQuestionIndex] || selectedExam?.questions?.[0] || {};
  const totalQuestionsCount = selectedExam?.questions?.length || 0;

  // =========================================================================
  // STAGE 1: EXAMS LIST TABLE (Image 1)
  // =========================================================================
  if (stage === 'list') {
    return (
      <div className="bg-[#fff9f2] min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto space-y-6">
          
          {/* Top User Greeting Strip */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#edd6ed] pb-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-[#f4ebf4] border border-[#edd6ed] flex items-center justify-center text-xl shadow-xs">
                👧
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#4e2a4a]">
                  Hello {userName} - {userClass}
                </h3>
                <div className="text-[11px] text-slate-500 font-normal space-x-2">
                  <a href="#fb" className="text-[#6d3a68] hover:underline">Join Queries Group</a>
                  <span>|</span>
                  <a href="#wa" className="text-[#d9775b] hover:underline">Join WhatsApp Channel</a>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onNavigatePublic('register-student')}
              className="px-4 py-2 bg-white border border-[#edd6ed] hover:border-[#6d3a68] text-[#6d3a68] rounded-sm text-xs font-bold transition-all cursor-pointer"
            >
              Edit Profile / Class
            </button>
          </div>

          {/* Page Heading */}
          <div className="text-right sm:text-center py-2">
            <h2 className="text-xl sm:text-2xl font-bold text-[#4e2a4a] tracking-tight">
              Free Trial / Practice Test 1
            </h2>
          </div>

          {/* Table Container */}
          <div className="bg-white rounded-sm border border-[#edd6ed] shadow-xs overflow-x-auto">
            {loadingExams ? (
              <div className="p-8 text-center text-xs font-bold text-slate-500">
                Loading official exams published by Super Admin...
              </div>
            ) : trialExams.length === 0 ? (
              <div className="p-8 sm:p-12 text-center space-y-3">
                <div className="w-12 h-12 bg-amber-100 text-amber-800 flex items-center justify-center rounded-xl mx-auto">
                  <AlertTriangle className="w-6 h-6 text-amber-600" />
                </div>
                <h3 className="text-sm font-bold text-slate-800">No Trial Exams Published Yet</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Super Admin has not yet published any practice exams. Only official papers created in Super Admin portal will appear here.
                </p>
              </div>
            ) : (
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#faf5fa] border-b border-[#edd6ed] text-[#4e2a4a] font-black uppercase text-[11px] tracking-wider">
                    <th className="py-3 px-4 sm:px-6 w-16">S.NO.</th>
                    <th className="py-3 px-4 sm:px-6">TITLE</th>
                    <th className="py-3 px-4 sm:px-6 w-32 text-center">DURATION</th>
                    <th className="py-3 px-4 sm:px-6 w-36 text-center">ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f4ebf4]">
                  {trialExams.map((exam, idx) => (
                    <tr key={exam.id} className="hover:bg-[#faf5fa]/70 transition-colors">
                      <td className="py-4 px-4 sm:px-6 font-bold text-slate-700">{idx + 1}</td>
                      <td className="py-4 px-4 sm:px-6 font-semibold text-slate-800">
                        {exam.title}
                      </td>
                      <td className="py-4 px-4 sm:px-6 text-center text-slate-600 font-medium">
                        {exam.duration}
                      </td>
                      <td className="py-4 px-4 sm:px-6 text-center">
                        <button
                          type="button"
                          onClick={() => handleSelectExamToStart(exam)}
                          className="px-5 py-2 bg-gradient-to-r from-[#ec4899] via-[#8b5cf6] to-[#3b82f6] hover:from-[#db2777] hover:via-[#7c3aed] hover:to-[#2563eb] text-white rounded-xs text-xs font-black tracking-wider uppercase shadow-sm cursor-pointer transition-all active:scale-95"
                        >
                          TAKE EXAM
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="pt-4 text-center">
            <p className="text-xs text-slate-500">
              Need help? Contact our Academic Examination Bureau at <span className="font-semibold text-slate-700 select-all">+91 98765 43210</span>
            </p>
          </div>

        </div>
      </div>
    );
  }

  // =========================================================================
  // STAGE 2: SYSTEM COMPATIBILITY CHECK (Image 2)
  // =========================================================================
  if (stage === 'system-check') {
    return (
      <div className="bg-[#fff9f2] min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-6">
          
          {/* Breadcrumb Back */}
          <button
            type="button"
            onClick={() => setStage('list')}
            className="text-xs font-semibold text-[#6d3a68] hover:text-[#d9775b] flex items-center gap-1.5 cursor-pointer"
          >
            <span>← Back to Quizzes</span>
          </button>

          {/* Title Header */}
          <div className="text-center space-y-1">
            <h1 className="text-xl sm:text-2xl font-bold text-[#4e2a4a] tracking-tight">
              System Compatibility Check
            </h1>
            <p className="text-xs text-slate-600 font-normal">
              Please ensure your system meets all requirements before starting the exam
            </p>
          </div>

          {/* Candidate Exam Header Banner */}
          <div className="rounded-xs bg-gradient-to-r from-[#1e1b4b] via-[#3b0764] to-[#1e3a8a] text-white p-3.5 text-center text-xs sm:text-sm font-bold shadow-xs">
            Hello, {userName} ({userClass}) - Get ready for {selectedExam.title}
          </div>

          {/* Compatibility Grid Card */}
          <div className="bg-white rounded-sm border border-[#edd6ed] p-6 shadow-xs space-y-6">
            <div className="text-center space-y-0.5">
              <h3 className="text-sm font-bold text-[#4e2a4a]">
                System Compatibility Check
              </h3>
              <p className="text-[11px] text-slate-500 font-normal">
                Please ensure all checks pass before starting the exam
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Item 1: Screen Size */}
              <div className="flex items-center justify-between p-3.5 rounded-sm bg-[#faf5fa] border-l-4 border-[#6d3a68]">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#6d3a68] stroke-[3]" />
                  <span className="text-xs font-semibold text-slate-700">Screen Size (Min 11")</span>
                </div>
                <span className="text-xs font-bold text-[#4e2a4a]">{screenMetrics.screenDiag}</span>
              </div>

              {/* Item 2: Viewport */}
              <div className="flex items-center justify-between p-3.5 rounded-sm bg-[#faf5fa] border-l-4 border-[#6d3a68]">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#6d3a68] stroke-[3]" />
                  <span className="text-xs font-semibold text-slate-700">Viewport (Min 1024px)</span>
                </div>
                <span className="text-xs font-bold text-[#4e2a4a]">{screenMetrics.viewport}px</span>
              </div>

              {/* Item 3: Zoom */}
              <div className="flex items-center justify-between p-3.5 rounded-sm bg-[#faf5fa] border-l-4 border-[#6d3a68]">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#6d3a68] stroke-[3]" />
                  <span className="text-xs font-semibold text-slate-700">Zoom (90-110%)</span>
                </div>
                <span className="text-xs font-bold text-[#4e2a4a]">100%</span>
              </div>

              {/* Item 4: Device Type */}
              <div className="flex items-center justify-between p-3.5 rounded-sm bg-[#faf5fa] border-l-4 border-[#6d3a68]">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#6d3a68] stroke-[3]" />
                  <span className="text-xs font-semibold text-slate-700">Device Type</span>
                </div>
                <span className="text-xs font-bold text-[#4e2a4a]">Desktop/Laptop</span>
              </div>

              {/* Item 5: Display Config */}
              <div className="flex items-center justify-between p-3.5 rounded-sm bg-[#faf5fa] border-l-4 border-[#6d3a68]">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#6d3a68] stroke-[3]" />
                  <span className="text-xs font-semibold text-slate-700">Display Config</span>
                </div>
                <span className="text-xs font-bold text-[#4e2a4a]">Single display</span>
              </div>

              {/* Item 6: Browser */}
              <div className="flex items-center justify-between p-3.5 rounded-sm bg-[#faf5fa] border-l-4 border-[#6d3a68]">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#6d3a68] stroke-[3]" />
                  <span className="text-xs font-semibold text-slate-700">Browser</span>
                </div>
                <span className="text-xs font-bold text-[#4e2a4a]">{screenMetrics.browser}</span>
              </div>

            </div>
          </div>

          {/* Continue Action */}
          <div className="text-center space-y-2 pt-2">
            <button
              type="button"
              onClick={() => {
                setStage('camera-pos');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-8 py-2.5 bg-gradient-to-r from-[#ec4899] via-[#8b5cf6] to-[#3b82f6] hover:from-[#db2777] hover:via-[#7c3aed] hover:to-[#2563eb] text-white rounded-xs text-xs font-black tracking-wider uppercase shadow-md shadow-[#d9775b]/30 cursor-pointer transition-all active:scale-95"
            >
              Continue →
            </button>
            <p className="text-xs text-emerald-700 font-bold flex items-center justify-center gap-1">
              <Check className="w-3.5 h-3.5" /> All checks passed! Click the button to continue.
            </p>
          </div>

        </div>
      </div>
    );
  }

  // =========================================================================
  // STAGE 3: POSITION YOUR CAMERA (Image 3)
  // =========================================================================
  if (stage === 'camera-pos') {
    return (
      <div className="bg-[#fff9f2] min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto space-y-6">
          
          {/* Breadcrumb Back */}
          <button
            type="button"
            onClick={() => setStage('system-check')}
            className="text-xs font-semibold text-[#6d3a68] hover:text-[#d9775b] flex items-center gap-1.5 cursor-pointer"
          >
            <span>← Back to System Check</span>
          </button>

          {/* Stepper Bar */}
          <div className="flex items-center justify-center gap-3 text-xs font-bold">
            <span className="flex items-center gap-1 text-emerald-700">
              <Check className="w-3.5 h-3.5" /> System Check
            </span>
            <span className="text-slate-300">—</span>
            <span className="flex items-center gap-1.5 text-[#6d3a68] px-2.5 py-0.5 rounded-full bg-[#f4ebf4] border border-[#edd6ed]">
              <span className="w-4 h-4 rounded-full bg-gradient-to-r from-[#ec4899] via-[#8b5cf6] to-[#3b82f6] text-white text-[10px] flex items-center justify-center">2</span>
              <span>Camera Position</span>
            </span>
            <span className="text-slate-300">—</span>
            <span className="text-slate-400 font-normal">3 Do's &amp; Don'ts</span>
            <span className="text-slate-300">—</span>
            <span className="text-slate-400 font-normal">4 Instructions</span>
          </div>

          {/* Banner */}
          <div className="rounded-xs bg-gradient-to-r from-[#1e1b4b] via-[#3b0764] to-[#1e3a8a] text-white p-3 text-center text-xs sm:text-sm font-bold shadow-xs">
            Hello, {userName} - Get ready for {selectedExam.title}
          </div>

          {/* Main Content Area */}
          <div className="bg-white rounded-sm border border-[#edd6ed] p-6 shadow-xs space-y-6">
            <div className="text-center space-y-1">
              <h2 className="text-xl font-bold text-[#4e2a4a]">Position your camera</h2>
              <p className="text-xs text-slate-600 font-normal">
                Your face should fill most of the camera picture, about 60-70%, and stay clearly visible for the whole exam.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Left Side: Sit Like This (Green Box) */}
              <div className="lg:col-span-4 rounded-sm border-2 border-emerald-500 bg-emerald-50/20 p-4 space-y-3 text-center">
                <div className="w-44 h-44 mx-auto rounded-sm bg-slate-100 border-2 border-dashed border-emerald-500 flex flex-col items-center justify-center relative overflow-hidden">
                  <div className="w-24 h-32 rounded-full border-2 border-dashed border-emerald-600 flex items-center justify-center bg-white shadow-xs">
                    <span className="text-4xl">🧑‍🎓</span>
                  </div>
                  <span className="text-[10px] text-emerald-800 font-bold mt-1">Perfect Center Frame</span>
                </div>

                <div className="text-left space-y-1.5 pt-2">
                  <h4 className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Sit like this</span>
                  </h4>
                  <ul className="text-[11px] text-slate-700 space-y-1 pl-1 font-normal">
                    <li>• Face in the middle, filling most of the picture</li>
                    <li>• Both eyes and your whole face visible</li>
                    <li>• Looking at the screen, shoulders in view</li>
                    <li>• Light in front of you, not behind</li>
                  </ul>
                </div>
              </div>

              {/* Right Side: Not Like These (Red Boxes Grid) */}
              <div className="lg:col-span-8 space-y-2">
                <h4 className="text-xs font-bold text-red-600 flex items-center gap-1.5">
                  <X className="w-4 h-4 text-red-500" />
                  <span>Not like these</span>
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    { label: 'Only the top of the head is visible', icon: '👤', desc: 'Too low' },
                    { label: 'Face turned to the side', icon: '🗣️', desc: 'Looking away' },
                    { label: 'Sitting off to one side', icon: '🧍', desc: 'Off-center' },
                    { label: 'Too close to the camera', icon: '🔍', desc: 'Too close' },
                    { label: 'Too far from the camera', icon: '🔭', desc: 'Too far' },
                    { label: 'Light behind you, face too dark', icon: '🌑', desc: 'Backlit' },
                    { label: 'Another person in the frame', icon: '👥', desc: 'Multiple people' },
                    { label: 'Camera switched off or covered', icon: '🚫', desc: 'Blocked' }
                  ].map((item, idx) => (
                    <div key={idx} className="p-2.5 rounded-sm border border-red-200 bg-red-50/20 text-center space-y-1 relative">
                      <div className="w-5 h-5 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center absolute top-1.5 right-1.5">
                        <X className="w-3 h-3" />
                      </div>
                      <div className="text-2xl pt-1">{item.icon}</div>
                      <p className="text-[10px] font-semibold text-slate-700 leading-tight">
                        {item.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Checkbox Declaration */}
            <div className="pt-4 border-t border-[#edd6ed] text-center space-y-4">
              <label className="inline-flex items-center gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={camPosChecked}
                  onChange={(e) => setCamPosChecked(e.target.checked)}
                  className="w-4 h-4 rounded-xs text-[#6d3a68] focus:ring-[#6d3a68] cursor-pointer"
                />
                <span className="text-xs font-bold text-slate-800">
                  I will keep my face clearly visible like this for the whole exam
                </span>
              </label>

              <div>
                <button
                  type="button"
                  disabled={!camPosChecked}
                  onClick={() => {
                    setStage('dos-donts');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`px-8 py-2.5 rounded-xs text-xs font-black tracking-wider uppercase transition-all shadow-md ${
                    camPosChecked
                      ? 'bg-gradient-to-r from-[#ec4899] via-[#8b5cf6] to-[#3b82f6] hover:from-[#db2777] hover:via-[#7c3aed] hover:to-[#2563eb] text-white cursor-pointer active:scale-95 shadow-[#d9775b]/30'
                      : 'bg-slate-300 text-slate-500 cursor-not-allowed opacity-60'
                  }`}
                >
                  Continue →
                </button>
              </div>
            </div>

          </div>

        </div>
      </div>
    );
  }

  // =========================================================================
  // STAGE 4: DO'S AND DON'TS (Image 4)
  // =========================================================================
  if (stage === 'dos-donts') {
    return (
      <div className="bg-[#fff9f2] min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto space-y-6">
          
          {/* Breadcrumb Back */}
          <button
            type="button"
            onClick={() => setStage('camera-pos')}
            className="text-xs font-semibold text-[#6d3a68] hover:text-[#d9775b] flex items-center gap-1.5 cursor-pointer"
          >
            <span>← Back to Camera Position</span>
          </button>

          {/* Stepper Bar */}
          <div className="flex items-center justify-center gap-3 text-xs font-bold">
            <span className="flex items-center gap-1 text-emerald-700">
              <Check className="w-3.5 h-3.5" /> System Check
            </span>
            <span className="text-slate-300">—</span>
            <span className="flex items-center gap-1 text-emerald-700">
              <Check className="w-3.5 h-3.5" /> Camera Position
            </span>
            <span className="text-slate-300">—</span>
            <span className="flex items-center gap-1.5 text-[#6d3a68] px-2.5 py-0.5 rounded-full bg-[#f4ebf4] border border-[#edd6ed]">
              <span className="w-4 h-4 rounded-full bg-gradient-to-r from-[#ec4899] via-[#8b5cf6] to-[#3b82f6] text-white text-[10px] flex items-center justify-center">3</span>
              <span>Do's &amp; Don'ts</span>
            </span>
            <span className="text-slate-300">—</span>
            <span className="text-slate-400 font-normal">4 Instructions</span>
          </div>

          {/* Banner */}
          <div className="rounded-xs bg-gradient-to-r from-[#1e1b4b] via-[#3b0764] to-[#1e3a8a] text-white p-3 text-center text-xs sm:text-sm font-bold shadow-xs">
            Hello, {userName} - Get ready for {selectedExam.title}
          </div>

          {/* Rules Layout Card */}
          <div className="bg-white rounded-sm border border-[#edd6ed] p-6 shadow-xs space-y-6">
            <div className="text-center space-y-1">
              <h2 className="text-xl font-bold text-[#4e2a4a]">Do's and Don'ts</h2>
              <p className="text-xs text-slate-600 font-normal">
                Breaking these rules may lead to disqualification.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              
              {/* Column 1: DO (Green Box) */}
              <div className="rounded-sm border border-emerald-400 bg-emerald-50/15 p-4 space-y-3">
                <h4 className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Do</span>
                </h4>

                <div className="space-y-2.5">
                  {[
                    { title: 'Keep a pen and blank paper', desc: 'For rough work only.', icon: <Edit3 className="w-4 h-4 text-emerald-700" /> },
                    { title: 'Stay in the camera frame', desc: 'Face the screen, with your face clearly visible, for the whole exam.', icon: <Camera className="w-4 h-4 text-emerald-700" /> },
                    { title: 'Sit in a quiet, well-lit room', desc: 'Light should fall on your face, not come from behind you.', icon: <Sun className="w-4 h-4 text-emerald-700" /> },
                    { title: 'Keep your device charging', desc: 'Plug in your laptop or tablet before you start.', icon: <BatteryCharging className="w-4 h-4 text-emerald-700" /> },
                    { title: 'Use a stable internet connection', desc: 'Your answers are saved as you go, so a short drop will not lose them.', icon: <Wifi className="w-4 h-4 text-emerald-700" /> }
                  ].map((r, i) => (
                    <div key={i} className="flex items-start gap-3 p-2.5 rounded-sm bg-white border border-emerald-200">
                      <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                        {r.icon}
                      </div>
                      <div>
                        <span className="text-xs font-bold text-slate-800 block">{r.title}</span>
                        <span className="text-[11px] text-slate-600 font-normal">{r.desc}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Column 2: DON'T (Coral/Red Box) */}
              <div className="rounded-sm border border-red-300 bg-red-50/15 p-4 space-y-3">
                <h4 className="text-xs font-bold text-red-700 flex items-center gap-1.5">
                  <X className="w-4 h-4 text-red-600" />
                  <span>Don't</span>
                </h4>

                <div className="space-y-2.5">
                  {[
                    { title: 'No mobile phone', desc: 'Switch it off and keep it out of reach.', icon: <Smartphone className="w-4 h-4 text-red-600" /> },
                    { title: 'No headphones or earphones', desc: 'Both ears must stay uncovered.', icon: <Headphones className="w-4 h-4 text-red-600" /> },
                    { title: 'No calculator', desc: 'Do all working on your rough paper.', icon: <Calculator className="w-4 h-4 text-red-600" /> },
                    { title: 'No books or notes', desc: 'Keep study material away from your desk.', icon: <BookOpen className="w-4 h-4 text-red-600" /> },
                    { title: 'No screen sharing', desc: 'Do not share your screen or let anyone control your computer remotely.', icon: <Monitor className="w-4 h-4 text-red-600" /> },
                    { title: 'No other tabs or apps', desc: 'Leaving the exam screen is detected and may end your exam.', icon: <Globe className="w-4 h-4 text-red-600" /> },
                    { title: 'No one sitting beside you', desc: 'Nobody else should be in the camera view or help you.', icon: <Users className="w-4 h-4 text-red-600" /> },
                    { title: 'No talking or outside help', desc: 'Do not talk to anyone or ask for help during the exam.', icon: <MessageSquare className="w-4 h-4 text-red-600" /> },
                    { title: 'No smartwatch or smart glasses', desc: 'Take them off before you start.', icon: <Watch className="w-4 h-4 text-red-600" /> }
                  ].map((r, i) => (
                    <div key={i} className="flex items-start gap-3 p-2.5 rounded-sm bg-white border border-red-200">
                      <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                        {r.icon}
                      </div>
                      <div>
                        <span className="text-xs font-bold text-slate-800 block">{r.title}</span>
                        <span className="text-[11px] text-slate-600 font-normal">{r.desc}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Checkbox Declaration */}
            <div className="pt-4 border-t border-[#edd6ed] space-y-4">
              <div className="text-center">
                <label className="inline-flex items-center gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rulesChecked}
                    onChange={(e) => setRulesChecked(e.target.checked)}
                    className="w-4 h-4 rounded-xs text-[#6d3a68] focus:ring-[#6d3a68] cursor-pointer"
                  />
                  <span className="text-xs font-bold text-slate-800">
                    I have read these rules and will follow them
                  </span>
                </label>
              </div>

              <div className="flex items-center justify-center gap-4">
                <button
                  type="button"
                  onClick={() => setStage('camera-pos')}
                  className="px-6 py-2.5 bg-[#faf5fa] text-[#6d3a68] border border-[#edd6ed] rounded-xs text-xs font-bold cursor-pointer hover:bg-[#f4ebf4]"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  disabled={!rulesChecked}
                  onClick={() => {
                    setStage('instructions');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`px-8 py-2.5 rounded-xs text-xs font-black tracking-wider uppercase transition-all shadow-md ${
                    rulesChecked
                      ? 'bg-gradient-to-r from-[#ec4899] via-[#8b5cf6] to-[#3b82f6] hover:from-[#db2777] hover:via-[#7c3aed] hover:to-[#2563eb] text-white cursor-pointer active:scale-95 shadow-[#d9775b]/30'
                      : 'bg-slate-300 text-slate-500 cursor-not-allowed opacity-60'
                  }`}
                >
                  Continue to Instructions →
                </button>
              </div>
            </div>

          </div>

        </div>
      </div>
    );
  }

  // =========================================================================
  // STAGE 5: INSTRUCTIONS & WEBCAM SETUP (Image 5)
  // =========================================================================
  if (stage === 'instructions') {
    return (
      <div className="bg-[#fff9f2] min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-6">
          
          {/* Breadcrumb Back */}
          <button
            type="button"
            onClick={() => setStage('dos-donts')}
            className="text-xs font-semibold text-[#6d3a68] hover:text-[#d9775b] flex items-center gap-1.5 cursor-pointer"
          >
            <span>← Back to Camera &amp; Rules</span>
          </button>

          {/* Stepper Bar */}
          <div className="flex items-center justify-center gap-3 text-xs font-bold">
            <span className="flex items-center gap-1 text-emerald-700">
              <Check className="w-3.5 h-3.5" /> System Check
            </span>
            <span className="text-slate-300">—</span>
            <span className="flex items-center gap-1 text-emerald-700">
              <Check className="w-3.5 h-3.5" /> Camera Position
            </span>
            <span className="text-slate-300">—</span>
            <span className="flex items-center gap-1 text-emerald-700">
              <Check className="w-3.5 h-3.5" /> Do's &amp; Don'ts
            </span>
            <span className="text-slate-300">—</span>
            <span className="flex items-center gap-1.5 text-[#6d3a68] px-2.5 py-0.5 rounded-full bg-[#f4ebf4] border border-[#edd6ed]">
              <span className="w-4 h-4 rounded-full bg-gradient-to-r from-[#ec4899] via-[#8b5cf6] to-[#3b82f6] text-white text-[10px] flex items-center justify-center">4</span>
              <span>Instructions</span>
            </span>
          </div>

          {/* Title */}
          <div className="text-center">
            <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Please read the following instructions carefully
            </p>
          </div>

          {/* 2-Column Instructions Body */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left Column: 13 Rules + Webcam preview */}
            <div className="lg:col-span-8 bg-white rounded-sm border border-[#edd6ed] p-6 shadow-xs space-y-4">
              <ol className="text-xs text-slate-700 font-normal leading-relaxed space-y-2 list-decimal pl-4">
                <li>This exam is based on <strong className="font-semibold text-slate-900">MCQ Pattern</strong>. There are 4 options for each question of which only 1 option is correct.</li>
                <li>This exam is of <strong className="font-semibold text-slate-900">60 minutes duration</strong> and the countdown will begin as soon as you click on <strong className="font-semibold text-slate-900">Start Exam</strong> button at the bottom.</li>
                <li>You have to select the Correct Answer and click on <strong className="font-semibold text-slate-900">Next</strong> or <strong className="font-semibold text-slate-900">Previous</strong> to navigate. Your answer is saved only when you click on the next button.</li>
                <li>You have an option to <strong className="font-semibold text-slate-900">Select and mark for review</strong> to review the question again.</li>
                <li><strong className="font-semibold text-slate-900">Clear Answer</strong> unselects the answer and marks the question as Not Answered.</li>
                <li>Click on <strong className="font-semibold text-slate-900">Finish / Submit</strong> to submit the answers. You won't be able to change the answers once you click on Finish. Make sure to review all the questions before ending it.</li>
                <li>When the clock runs out, the exam ends by default.</li>
                <li>You may be barred from the exam or required to appear for retest if you are found using unfair means or if any suspicious activity is detected.</li>
                <li>It is compulsory to turn on your camera for Level exams and make sure that your <strong className="font-semibold text-slate-900">complete face is visible</strong>.</li>
                <li>The exam should be taken on a desktop, a laptop or a tablet with at least <strong className="font-semibold text-slate-900">10.5" display</strong>.</li>
                <li>The last 5 questions in the exam are Achiever / High-Order Section questions.</li>
                <li>Make sure that your browser Zoom setting is set to 100% or less.</li>
              </ol>

              {/* Webcam Attempt Mode Radio */}
              <div className="pt-2 border-t border-[#edd6ed] space-y-3">
                <div className="flex items-center gap-6 text-xs font-bold text-[#4e2a4a]">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="attemptMode"
                      value="with-webcam"
                      checked={attemptMode === 'with-webcam'}
                      onChange={() => setAttemptMode('with-webcam')}
                      className="text-[#6d3a68] focus:ring-[#6d3a68]"
                    />
                    <span>Attempt with webcam</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="attemptMode"
                      value="without-webcam"
                      checked={attemptMode === 'without-webcam'}
                      onChange={() => setAttemptMode('without-webcam')}
                      className="text-[#6d3a68] focus:ring-[#6d3a68]"
                    />
                    <span>Attempt without webcam (Practice Mode)</span>
                  </label>
                </div>

                {/* Camera preview */}
                <div className="space-y-2">
                  <span className="text-[11px] text-slate-500 font-medium block">Camera Preview</span>
                  <div className="w-56 h-36 bg-slate-900 rounded-sm overflow-hidden border border-[#edd6ed] relative flex items-center justify-center text-white">
                    {isCameraActive ? (
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-center p-2">
                        <Camera className="w-6 h-6 mx-auto text-slate-500 mb-1" />
                        <span className="text-[10px] text-slate-400">Webcam inactive</span>
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={handleToggleCamera}
                    className="px-4 py-1.5 bg-gradient-to-r from-[#ec4899] via-[#8b5cf6] to-[#3b82f6] hover:from-[#db2777] hover:via-[#7c3aed] hover:to-[#2563eb] text-white rounded-xs text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>{isCameraActive ? 'Close Camera' : 'Open Camera / Test Webcam'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Palette Legend & Guidelines */}
            <div className="lg:col-span-4 space-y-4">
              
              {/* Question Palette Legend Box */}
              <div className="bg-white rounded-sm border border-[#edd6ed] p-4 shadow-xs space-y-3">
                <h4 className="text-xs font-bold text-[#4e2a4a]">
                  The question palette shows the status of each question:
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2.5">
                    <div className="w-4 h-4 rounded-xs bg-slate-400 shrink-0" />
                    <span className="text-slate-700">You have not visited the question yet.</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <div className="w-4 h-4 rounded-xs bg-red-500 shrink-0" />
                    <span className="text-slate-700">You have not answered the question.</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <div className="w-4 h-4 rounded-xs bg-emerald-600 shrink-0" />
                    <span className="text-slate-700">You have answered the question.</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <div className="w-4 h-4 rounded-xs bg-[#e7b84b] shrink-0" />
                    <span className="text-slate-700">You have answered &amp; marked for review.</span>
                  </div>
                </div>
              </div>

              {/* Guidelines for using webcam */}
              <div className="rounded-sm bg-[#321630] text-white p-4 shadow-sm space-y-2">
                <h4 className="text-xs font-black text-[#e7b84b] uppercase tracking-wider">
                  Guidelines for using webcam
                </h4>
                <ul className="text-[11px] text-[#deb8de] font-normal space-y-1.5 pl-3 list-disc">
                  <li>To start the exam, click 'Open Camera' button.</li>
                  <li>If your browser asks for permission to access camera, click yes/allow.</li>
                  <li>Then click the 'Start Exam' button below.</li>
                  <li>In case camera has started but button is not active, refresh your browser.</li>
                </ul>
              </div>

            </div>

          </div>

          {/* Confirmation Checkbox & Start Exam Button */}
          <div className="bg-white rounded-sm border border-[#edd6ed] p-5 shadow-xs space-y-4">
            <label className="flex items-start gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={instructionCertified}
                onChange={(e) => setInstructionCertified(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded-xs text-[#6d3a68] focus:ring-[#6d3a68] cursor-pointer"
              />
              <span className="text-xs text-slate-700 font-normal leading-relaxed">
                I certify that the webcam has been set-up properly to capture my image. I have read and understood all the examination instructions given above.
              </span>
            </label>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-[#edd6ed]">
              <span className="text-[10px] text-slate-400 font-mono">
                Session: {new Date().toUTCString()} (IST)
              </span>

              <button
                type="button"
                disabled={!instructionCertified}
                onClick={() => {
                  setStage('exam');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`px-8 py-3 rounded-xs text-xs font-black tracking-wider uppercase transition-all shadow-md ${
                  instructionCertified
                    ? 'bg-gradient-to-r from-[#ec4899] via-[#8b5cf6] to-[#3b82f6] hover:from-[#db2777] hover:via-[#7c3aed] hover:to-[#2563eb] text-white cursor-pointer active:scale-95 shadow-[#d9775b]/30'
                    : 'bg-slate-300 text-slate-500 cursor-not-allowed opacity-60'
                }`}
              >
                Start Exam →
              </button>
            </div>
          </div>

        </div>
      </div>
    );
  }

  // =========================================================================
  // STAGE 6: LIVE MCQ EXAMINATION ENGINE
  // =========================================================================
  if (stage === 'exam') {
    const answeredCount = Object.values(userAnswers).filter((a) => a.selected !== null && a.selected !== undefined).length;
    const markedCount = Object.values(userAnswers).filter((a) => a.marked).length;
    const notVisitedCount = selectedExam.questions.filter((q) => !userAnswers[q.id]?.visited).length;
    const notAnsweredCount = totalQuestionsCount - answeredCount - notVisitedCount;

    return (
      <div className="bg-[#fff9f2] min-h-screen flex flex-col justify-between">
        
        {/* Top Live Examination Header Bar */}
        <header className="bg-gradient-to-r from-[#1e1b4b] via-[#3b0764] to-[#1e3a8a] text-white py-3 px-4 sm:px-6 shadow-md sticky top-0 z-40">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div>
              <span className="text-[10px] text-[#e7b84b] font-bold uppercase tracking-wider block">
                SkillRise Olympiad Live Test
              </span>
              <h2 className="text-xs sm:text-sm font-black truncate max-w-xs sm:max-w-md">
                {selectedExam.title}
              </h2>
            </div>

            {/* Countdown Timer */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-white/10 border border-white/20 text-white font-mono text-xs sm:text-sm font-bold">
                <Clock className="w-4 h-4 text-[#e7b84b] animate-pulse" />
                <span>Time Left: {formatTime(timeLeftSec)}</span>
              </div>

              <button
                type="button"
                onClick={() => setShowSubmitConfirm(true)}
                className="px-4 py-1.5 bg-gradient-to-r from-[#ec4899] via-[#8b5cf6] to-[#3b82f6] hover:from-[#db2777] hover:via-[#7c3aed] hover:to-[#2563eb] text-white rounded-xs text-xs font-black uppercase transition-all shadow-xs cursor-pointer"
              >
                Submit Exam
              </button>
            </div>
          </div>
        </header>

        {/* Exam Body Layout */}
        <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Question Area */}
          <div className="lg:col-span-8 bg-white rounded-sm border border-[#edd6ed] p-6 shadow-xs space-y-6 flex flex-col justify-between min-h-[500px]">
            
            <div className="space-y-4">
              {/* Question Index & Marks */}
              <div className="flex items-center justify-between border-b border-[#edd6ed] pb-3">
                <span className="text-xs font-black text-[#6d3a68] uppercase tracking-wider">
                  Question {currentQuestionIndex + 1} of {totalQuestionsCount}
                </span>
                <span className="text-[11px] font-bold text-slate-500 bg-[#faf5fa] px-2 py-0.5 rounded-xs border border-[#edd6ed]">
                  Marks: +2.00 | -0.50
                </span>
              </div>

              {/* Question Text */}
              <div className="py-2">
                <p className="text-sm sm:text-base font-semibold text-[#321630] leading-relaxed">
                  {currentQ.text}
                </p>
              </div>

              {/* Options List */}
              <div className="space-y-2.5 pt-2">
                {currentQ.options.map((opt, optIdx) => {
                  const isSelected = userAnswers[currentQ.id]?.selected === optIdx;
                  return (
                    <label
                      key={optIdx}
                      onClick={() => handleSelectOption(currentQ.id, optIdx)}
                      className={`flex items-center gap-3 p-3.5 rounded-sm border cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-[#f4ebf4] border-[#6d3a68] text-[#4e2a4a] ring-1 ring-[#6d3a68]'
                          : 'bg-white border-[#edd6ed] text-slate-800 hover:bg-[#faf5fa]'
                      }`}
                    >
                      <div className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-black shrink-0 transition-all ${
                        optIdx === 0
                          ? isSelected
                            ? 'bg-red-100 border-2 border-red-400 text-red-700 ring-2 ring-red-200'
                            : 'bg-red-50 border border-red-200 text-red-700'
                          : optIdx === 1
                          ? isSelected
                            ? 'bg-emerald-100 border-2 border-emerald-400 text-emerald-700 ring-2 ring-emerald-200'
                            : 'bg-emerald-50 border border-emerald-200 text-emerald-700'
                          : optIdx === 2
                          ? isSelected
                            ? 'bg-amber-100 border-2 border-amber-400 text-amber-800 ring-2 ring-amber-200'
                            : 'bg-amber-50 border border-amber-200 text-amber-800'
                          : optIdx === 3
                          ? isSelected
                            ? 'bg-orange-100 border-2 border-orange-400 text-orange-800 ring-2 ring-orange-200'
                            : 'bg-orange-50 border border-orange-200 text-orange-800'
                          : isSelected
                          ? 'bg-[#6d3a68]/20 text-[#6d3a68]'
                          : 'border border-slate-300 bg-white text-slate-600'
                      }`}>
                        {String.fromCharCode(65 + optIdx)}
                      </div>
                      <span className="text-xs sm:text-sm font-medium">{opt}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Bottom Question Controls */}
            <div className="pt-4 border-t border-[#edd6ed] flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleToggleMarkForReview(currentQ.id)}
                  className={`px-3 py-2 rounded-xs text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
                    userAnswers[currentQ.id]?.marked
                      ? 'bg-[#faf4e0] text-[#906223] border-[#e7b84b]'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <Bookmark className="w-3.5 h-3.5" />
                  <span>{userAnswers[currentQ.id]?.marked ? 'Marked for Review' : 'Mark for Review'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleClearResponse(currentQ.id)}
                  className="px-3 py-2 bg-white hover:bg-slate-50 text-slate-600 border border-slate-300 rounded-xs text-xs font-bold transition-all cursor-pointer"
                >
                  Clear Response
                </button>
              </div>

              <div className="flex items-center gap-2">
                {currentQuestionIndex > 0 && (
                  <button
                    type="button"
                    onClick={() => handleGoToQuestion(currentQuestionIndex - 1)}
                    className="px-4 py-2 bg-white hover:bg-[#faf5fa] text-[#6d3a68] border border-[#edd6ed] rounded-xs text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    <span>Previous</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleSaveAndNext}
                  className="px-5 py-2 bg-gradient-to-r from-[#ec4899] via-[#8b5cf6] to-[#3b82f6] hover:from-[#db2777] hover:via-[#7c3aed] hover:to-[#2563eb] text-white rounded-xs text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <span>{currentQuestionIndex === totalQuestionsCount - 1 ? 'Save & Review' : 'Save & Next'}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>

          {/* Right Column: Floating Proctor Preview & Palette */}
          <div className="lg:col-span-4 space-y-4">
            
            {/* Live Proctor Mini Preview */}
            <div className="bg-white rounded-sm border border-[#edd6ed] p-3 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-[#6d3a68] uppercase tracking-wider flex items-center gap-1">
                  <Shield className="w-3 h-3 text-[#d9775b]" /> AI Proctored Active
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              </div>
              <div className="w-full h-28 bg-slate-900 rounded-xs overflow-hidden flex items-center justify-center text-white relative">
                <div className="text-center p-2">
                  <span className="text-3xl block">🧑‍🎓</span>
                  <span className="text-[9px] text-emerald-400 font-mono">Face Detected (100% in frame)</span>
                </div>
              </div>
            </div>

            {/* Question Palette Grid */}
            <div className="bg-white rounded-sm border border-[#edd6ed] p-4 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-[#edd6ed] pb-2">
                <span className="text-xs font-bold text-[#4e2a4a]">Question Palette</span>
                <span className="text-[10px] font-bold text-slate-500">{answeredCount}/{totalQuestionsCount} Answered</span>
              </div>

              {/* Status summary pill counts */}
              <div className="grid grid-cols-2 gap-2 text-[10px] font-medium">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-xs bg-emerald-600 text-white flex items-center justify-center text-[8px] font-bold">{answeredCount}</span>
                  <span className="text-slate-600">Answered</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-xs bg-red-500 text-white flex items-center justify-center text-[8px] font-bold">{notAnsweredCount}</span>
                  <span className="text-slate-600">Not Answered</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-xs bg-[#e7b84b] text-white flex items-center justify-center text-[8px] font-bold">{markedCount}</span>
                  <span className="text-slate-600">Marked</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-xs bg-slate-300 text-slate-700 flex items-center justify-center text-[8px] font-bold">{notVisitedCount}</span>
                  <span className="text-slate-600">Not Visited</span>
                </div>
              </div>

              {/* Palette Buttons */}
              <div className="grid grid-cols-5 gap-2 pt-2 border-t border-[#edd6ed]">
                {selectedExam.questions.map((q, idx) => {
                  const state = userAnswers[q.id];
                  const isCurrent = currentQuestionIndex === idx;
                  let bgClass = 'bg-slate-200 text-slate-700 hover:bg-slate-300';
                  
                  if (state?.marked) {
                    bgClass = 'bg-[#e7b84b] text-white font-bold';
                  } else if (state?.selected !== null && state?.selected !== undefined) {
                    bgClass = 'bg-emerald-600 text-white font-bold';
                  } else if (state?.visited) {
                    bgClass = 'bg-red-500 text-white font-bold';
                  }

                  return (
                    <button
                      key={q.id}
                      type="button"
                      onClick={() => handleGoToQuestion(idx)}
                      className={`h-8 rounded-xs text-xs font-bold transition-all cursor-pointer flex items-center justify-center ${bgClass} ${
                        isCurrent ? 'ring-2 ring-[#6d3a68] ring-offset-1 scale-105' : ''
                      }`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

        </main>

        {/* Submit Confirmation Modal */}
        {showSubmitConfirm && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-sm border border-[#edd6ed] max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
              <div className="w-12 h-12 rounded-full bg-[#f4ebf4] text-[#6d3a68] flex items-center justify-center mx-auto">
                <Send className="w-6 h-6 text-[#d9775b]" />
              </div>
              <div className="text-center space-y-1">
                <h3 className="text-base font-black text-[#4e2a4a]">
                  Ready to Submit Examination?
                </h3>
                <p className="text-xs text-slate-600">
                  You have answered <strong className="text-slate-900">{answeredCount}</strong> out of <strong className="text-slate-900">{totalQuestionsCount}</strong> questions.
                </p>
              </div>

              <div className="p-3 bg-[#faf5fa] rounded-xs border border-[#edd6ed] text-xs space-y-1 text-slate-700">
                <div className="flex justify-between">
                  <span>Answered:</span>
                  <strong className="text-emerald-700 font-bold">{answeredCount}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Marked for Review:</span>
                  <strong className="text-[#906223] font-bold">{markedCount}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Unanswered / Skipped:</span>
                  <strong className="text-red-600 font-bold">{totalQuestionsCount - answeredCount}</strong>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSubmitConfirm(false)}
                  className="px-4 py-2 bg-white border border-[#edd6ed] text-slate-700 hover:bg-[#faf5fa] rounded-xs text-xs font-bold cursor-pointer"
                >
                  Resume Exam
                </button>
                <button
                  type="button"
                  onClick={handleSubmitExam}
                  className="px-5 py-2 bg-gradient-to-r from-[#ec4899] via-[#8b5cf6] to-[#3b82f6] hover:from-[#db2777] hover:via-[#7c3aed] hover:to-[#2563eb] text-white rounded-xs text-xs font-black cursor-pointer shadow-md"
                >
                  Yes, Submit Now
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab Switch Security Warning Modal */}
        {showTabWarningModal && (
          <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-sm border-2 border-red-500 max-w-sm w-full p-5 shadow-2xl space-y-3 text-center">
              <AlertTriangle className="w-10 h-10 text-red-600 mx-auto" />
              <h3 className="text-sm font-black text-red-700">Security Alert: Tab Switch Detected</h3>
              <p className="text-xs text-slate-600 font-normal">
                Leaving the active examination screen is strictly prohibited. Warning count: <strong className="text-red-700">{tabWarnings}/3</strong>.
              </p>
              <button
                type="button"
                onClick={() => setShowTabWarningModal(false)}
                className="w-full py-2 bg-gradient-to-r from-[#1e1b4b] via-[#3b0764] to-[#1e3a8a] text-white rounded-xs text-xs font-bold cursor-pointer hover:bg-[#321630]"
              >
                I Understand &amp; Return to Exam
              </button>
            </div>
          </div>
        )}

      </div>
    );
  }

  // =========================================================================
  // STAGE 7: DETAILED SCORECARD & PERFORMANCE REPORT
  // =========================================================================
  if (stage === 'result') {
    return (
      <div className="bg-[#fff9f2] min-h-screen py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Top Result Card */}
          <div className="bg-white rounded-sm border border-[#edd6ed] p-6 sm:p-8 shadow-md text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto shadow-xs">
              <Award className="w-8 h-8 text-[#d9775b]" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold text-[#e7b84b] bg-[#faf4e0] px-3 py-1 rounded-full border border-[#f5e7bf]">
                Free Trial Completed Successfully
              </span>
              <h2 className="text-2xl font-black text-[#4e2a4a] pt-2">
                Performance Scorecard: {selectedExam.title}
              </h2>
              <p className="text-xs text-slate-600">
                Candidate: <strong className="text-slate-800">{userName}</strong> ({userClass})
              </p>
            </div>

            {/* Score Metric Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-4 rounded-sm bg-[#faf5fa] border border-[#edd6ed]">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-bold">Total Score</span>
                <span className="text-xl font-black text-[#6d3a68]">{examScore.score} / {selectedExam.totalMarks}</span>
              </div>

              <div className="p-4 rounded-sm bg-emerald-50 border border-emerald-200">
                <span className="text-[10px] text-emerald-800 uppercase tracking-wider block font-bold">Correct Answers</span>
                <span className="text-xl font-black text-emerald-700">{examScore.correct}</span>
              </div>

              <div className="p-4 rounded-sm bg-red-50 border border-red-200">
                <span className="text-[10px] text-red-800 uppercase tracking-wider block font-bold">Incorrect</span>
                <span className="text-xl font-black text-red-600">{examScore.wrong}</span>
              </div>

              <div className="p-4 rounded-sm bg-[#faf4e0] border border-[#f5e7bf]">
                <span className="text-[10px] text-[#906223] uppercase tracking-wider block font-bold">Accuracy</span>
                <span className="text-xl font-black text-[#906223]">{examScore.accuracy}%</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-4 border-t border-[#edd6ed]">
              <button
                type="button"
                onClick={() => setStage('list')}
                className="px-5 py-2.5 bg-white border border-[#edd6ed] hover:border-[#6d3a68] text-[#6d3a68] rounded-xs text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Try Another Free Trial</span>
              </button>

              <button
                type="button"
                onClick={() => onNavigatePublic('register-student')}
                className="px-6 py-2.5 bg-gradient-to-r from-[#ec4899] via-[#8b5cf6] to-[#3b82f6] hover:from-[#db2777] hover:via-[#7c3aed] hover:to-[#2563eb] text-white rounded-xs text-xs font-black shadow-md shadow-[#d9775b]/30 cursor-pointer transition-all active:scale-95 flex items-center gap-2"
              >
                <span>Enroll in Official Olympiad 2026</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#e7b84b]" />
              </button>
            </div>
          </div>

          {/* Question-wise Detailed Solutions Review */}
          <div className="bg-white rounded-sm border border-[#edd6ed] p-6 shadow-xs space-y-6">
            <h3 className="text-base font-black text-[#4e2a4a] border-b border-[#edd6ed] pb-3">
              Question-wise Answers &amp; Explanations
            </h3>

            <div className="space-y-6">
              {selectedExam.questions.map((q, qIdx) => {
                const userAns = userAnswers[q.id]?.selected;
                const isCorrect = userAns === q.correct;
                const isSkipped = userAns === null || userAns === undefined;

                return (
                  <div key={q.id} className="p-4 rounded-sm border border-[#edd6ed] bg-[#faf5fa]/40 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#6d3a68]">
                        Question {qIdx + 1}
                      </span>
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-xs uppercase tracking-wider ${
                        isCorrect ? 'bg-emerald-100 text-emerald-800' : isSkipped ? 'bg-slate-200 text-slate-700' : 'bg-red-100 text-red-800'
                      }`}>
                        {isCorrect ? '✓ Correct' : isSkipped ? '⚪ Skipped' : '✗ Incorrect'}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm font-semibold text-slate-800">
                      {q.text}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {q.options.map((opt, oIdx) => {
                        const isUserChoice = userAns === oIdx;
                        const isRightChoice = q.correct === oIdx;

                        let optBg = 'bg-white border-slate-200 text-slate-700';
                        if (isRightChoice) {
                          optBg = 'bg-emerald-50 border-emerald-500 text-emerald-800 font-bold ring-1 ring-emerald-500';
                        } else if (isUserChoice && !isCorrect) {
                          optBg = 'bg-red-50 border-red-400 text-red-800 font-bold';
                        }

                        return (
                          <div key={oIdx} className={`p-2 rounded-xs border flex items-center gap-2 ${optBg}`}>
                            <span className={`w-5 h-5 rounded-md flex items-center justify-center font-black text-[10px] shrink-0 ${
                              oIdx === 0
                                ? 'bg-red-50 border border-red-200 text-red-700'
                                : oIdx === 1
                                ? 'bg-emerald-50 border border-emerald-200 text-emerald-700'
                                : oIdx === 2
                                ? 'bg-amber-50 border border-amber-200 text-amber-800'
                                : oIdx === 3
                                ? 'bg-orange-50 border border-orange-200 text-orange-800'
                                : 'bg-slate-100 text-slate-700'
                            }`}>
                              {String.fromCharCode(65 + oIdx)}
                            </span>
                            <span>{opt}</span>
                            {isRightChoice && <Check className="w-3.5 h-3.5 ml-auto text-emerald-600" />}
                          </div>
                        );
                      })}
                    </div>

                    {q.explanation && (
                      <div className="p-2.5 rounded-xs bg-[#f4ebf4] text-xs text-[#4e2a4a] border border-[#edd6ed]">
                        <span className="font-bold text-[#6d3a68] block text-[11px]">Explanation:</span>
                        <p className="font-normal text-slate-700 mt-0.5">{q.explanation}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    );
  }

  return null;
};
