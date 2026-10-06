import React, { useState, useEffect, useRef, useCallback } from 'react';
import { apiClient } from '../../api/client';
import { useAuth } from '../../contexts/AuthContext';
import {
  Clock,
  AlertTriangle,
  CheckCircle2,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Send,
  RotateCcw,
  Shield,
  HelpCircle,
  Eye,
  Check,
  Award,
  AlertCircle
} from 'lucide-react';
import { Button } from '../../components/Button';
import { Modal } from '../../components/Modal';
import { Badge } from '../../components/Badge';

export const ExamPortal = ({ examId, onExamCompleted, onExit }) => {
  const { user } = useAuth();
  const [sessionData, setSessionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  // Live answers state: { [questionId]: { selected_option: 'A', is_marked_for_review: false, is_visited: true } }
  const [answers, setAnswers] = useState({});
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [tabWarnings, setTabWarnings] = useState(0);
  const [tabLimit, setTabLimit] = useState(3);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState('All changes saved');

  // Timers
  const timerRef = useRef(null);
  const autoSaveTimeoutRef = useRef(null);

  // 1. Initialize Exam Session
  useEffect(() => {
    let mounted = true;

    const startSession = async () => {
      try {
        setLoading(true);
        const res = await apiClient.post(`/exam-engine/${examId}/start`);
        if (res.success && res.data) {
          if (!mounted) return;
          setSessionData(res.data);
          setAnswers(res.data.answers || {});
          const durSecs = (Number(res.data.remaining_seconds) > 0)
            ? Number(res.data.remaining_seconds)
            : (Number(res.data.exam?.duration_minutes) || 60) * 60;
          setRemainingSeconds(durSecs);
          setTabWarnings(res.data.tab_switch_count || 0);
          setTabLimit(res.data.exam.tab_switch_limit || 3);
        }
      } catch (err) {
        if (!mounted) return;
        setError(err.message || 'Failed to start examination session.');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    startSession();

    return () => {
      mounted = false;
      if (timerRef.current) clearInterval(timerRef.current);
      if (autoSaveTimeoutRef.current) clearTimeout(autoSaveTimeoutRef.current);
    };
  }, [examId]);

  // 2. Countdown Timer
  useEffect(() => {
    if (remainingSeconds <= 0 || !sessionData) return;

    timerRef.current = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleAutoSubmit('time_expired');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [remainingSeconds, sessionData]);

  // 3. Tab Switch / Security Monitoring
  const handleSecurityEvent = useCallback(async (eventType, eventData) => {
    if (!sessionData?.attempt_id) return;
    try {
      const res = await apiClient.post('/exam-engine/security-event', {
        attempt_id: sessionData.attempt_id,
        event_type: eventType,
        event_data: eventData
      });

      if (res.success && res.data) {
        setTabWarnings(res.data.tab_switch_count);
        if (res.data.terminated) {
          alert('Security Limit Exceeded: You switched tabs too many times. Your examination has been automatically submitted and terminated.');
          onExamCompleted(sessionData.attempt_id);
        } else {
          setShowWarningModal(true);
        }
      }
    } catch (e) {
      console.error('Security log error:', e);
    }
  }, [sessionData, onExamCompleted]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        handleSecurityEvent('tab_switch', 'User switched browser tab or minimized window');
      }
    };

    const handleWindowBlur = () => {
      // Window blur detected
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
    };
  }, [handleSecurityEvent]);

  // Format HH:MM:SS
  const formatTime = (secs) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return [
      h > 0 ? String(h).padStart(2, '0') : null,
      String(m).padStart(2, '0'),
      String(s).padStart(2, '0')
    ].filter(Boolean).join(':');
  };

  const questions = sessionData?.questions || [];
  const currentQuestion = questions[currentIndex] || null;

  // Auto-Save Answer
  const saveAnswerToServer = async (qId, selectedOpt, isMarked, isVisited = true) => {
    if (!sessionData?.attempt_id || !qId) return;
    setAutoSaveStatus('Saving response...');

    try {
      await apiClient.post('/exam-engine/save-answer', {
        attempt_id: sessionData.attempt_id,
        question_id: qId,
        selected_option: selectedOpt,
        is_marked_for_review: isMarked ? 1 : 0,
        is_visited: isVisited ? 1 : 0
      });
      setAutoSaveStatus('Response saved');
    } catch (err) {
      setAutoSaveStatus('Saved locally');
    }
  };

  const handleSelectOption = (optionKey) => {
    if (!currentQuestion) return;
    const qId = currentQuestion.id;
    const current = answers[qId] || {};
    const newSelected = current.selected_option === optionKey ? null : optionKey;

    const updated = {
      ...answers,
      [qId]: {
        ...current,
        selected_option: newSelected,
        is_visited: true
      }
    };
    setAnswers(updated);
    saveAnswerToServer(qId, newSelected, current.is_marked_for_review, true);
  };

  const handleClearResponse = () => {
    if (!currentQuestion) return;
    const qId = currentQuestion.id;
    const current = answers[qId] || {};

    const updated = {
      ...answers,
      [qId]: {
        ...current,
        selected_option: null,
        is_visited: true
      }
    };
    setAnswers(updated);
    saveAnswerToServer(qId, null, current.is_marked_for_review, true);
  };

  const handleToggleMarkReview = () => {
    if (!currentQuestion) return;
    const qId = currentQuestion.id;
    const current = answers[qId] || {};
    const newMarked = !current.is_marked_for_review;

    const updated = {
      ...answers,
      [qId]: {
        ...current,
        is_marked_for_review: newMarked,
        is_visited: true
      }
    };
    setAnswers(updated);
    saveAnswerToServer(qId, current.selected_option, newMarked, true);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      const nextQ = questions[currentIndex + 1];
      markVisited(nextQ.id);
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      const prevQ = questions[currentIndex - 1];
      markVisited(prevQ.id);
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleJumpToQuestion = (idx) => {
    if (questions[idx]) {
      markVisited(questions[idx].id);
      setCurrentIndex(idx);
    }
  };

  const markVisited = (qId) => {
    setAnswers((prev) => {
      if (!prev[qId]) {
        saveAnswerToServer(qId, null, false, true);
        return {
          ...prev,
          [qId]: { selected_option: null, is_marked_for_review: false, is_visited: true }
        };
      } else if (!prev[qId].is_visited) {
        saveAnswerToServer(qId, prev[qId].selected_option, prev[qId].is_marked_for_review, true);
        return {
          ...prev,
          [qId]: { ...prev[qId], is_visited: true }
        };
      }
      return prev;
    });
  };

  const cacheAttemptLocally = (attemptId, serverRes) => {
    try {
      const qList = (sessionData?.questions || []).map((q, idx) => {
        const userAns = answers[q.id];
        const selectedOpt = userAns?.selected_option || null;
        const correctOpt = q.correct_option || 'A';
        const isCorrect = (selectedOpt && selectedOpt === correctOpt);
        return {
          ...q,
          id: q.id || idx + 1,
          question_text: q.question_text || `Question ${idx + 1}`,
          option_a: q.option_a,
          option_b: q.option_b,
          option_c: q.option_c,
          option_d: q.option_d,
          options: [q.option_a, q.option_b, q.option_c, q.option_d],
          selected_option: selectedOpt,
          correct_option: correctOpt,
          is_correct: isCorrect,
          marks: q.marks || 1,
          explanation: q.explanation || 'Refer to the standard Olympiad step-by-step logic.'
        };
      });

      const answeredCount = Object.values(answers).filter(a => a?.selected_option).length;
      const correctCount = qList.filter(q => q.is_correct).length;
      const wrongCount = answeredCount - correctCount;
      const unansweredCount = qList.length - answeredCount;
      const totalMarks = qList.reduce((sum, q) => sum + (Number(q.marks) || 1), 0);
      const earnedScore = serverRes?.data?.score !== undefined ? Number(serverRes.data.score) : correctCount;
      const pct = (totalMarks > 0) ? Number(((earnedScore / totalMarks) * 100).toFixed(1)) : 0;
      const isPassed = pct >= 40;

      const record = {
        id: attemptId,
        attempt_id: attemptId,
        exam_id: examId,
        exam_title: sessionData?.exam?.title || 'Olympiad Exam',
        title: sessionData?.exam?.title || 'Olympiad Exam',
        paper_title: sessionData?.exam?.title || 'Olympiad Exam',
        subject: sessionData?.exam?.subject_name || sessionData?.exam?.subject || sessionData?.exam?.subject_code || 'Olympiad',
        subject_name: sessionData?.exam?.subject_name || sessionData?.exam?.subject || sessionData?.exam?.subject_code || 'Olympiad',
        subject_code: sessionData?.exam?.subject_code || 'IMO',
        class_name: user?.class_name || sessionData?.exam?.class_name || 'Class 6',
        student_id: user?.id || sessionData?.student?.id || 1,
        student_name: user?.full_name || user?.name || sessionData?.student?.full_name || 'Student Candidate',
        student_login_id: user?.login_id || sessionData?.student?.login_id || 'STU-001',
        student_email: user?.email || '',
        student_school: user?.school_name || user?.school || user?.schoolName || 'Delhi Public School',
        school_name: user?.school_name || user?.school || user?.schoolName || 'Delhi Public School',
        total_questions: qList.length,
        total_marks: totalMarks,
        score: earnedScore,
        cutoff_marks: Math.round(totalMarks * 0.4),
        correct_count: correctCount,
        wrong_count: Math.max(0, wrongCount),
        unanswered_count: Math.max(0, unansweredCount),
        percentage: pct,
        passed: isPassed,
        status: 'completed',
        time_spent_seconds: Math.max(1, ((sessionData?.exam?.duration_minutes || 60) * 60) - remainingSeconds),
        time_taken_seconds: Math.max(1, ((sessionData?.exam?.duration_minutes || 60) * 60) - remainingSeconds),
        duration_minutes: sessionData?.exam?.duration_minutes || 60,
        submitted_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
        questions: qList
      };

      const existing = JSON.parse(localStorage.getItem('olympiadhub_student_attempts') || '[]');
      localStorage.setItem('olympiadhub_student_attempts', JSON.stringify([record, ...existing.filter(e => String(e.id || e.attempt_id) !== String(attemptId))]));
      
      const existingResults = JSON.parse(localStorage.getItem('olympiadhub_db_results') || '[]');
      localStorage.setItem('olympiadhub_db_results', JSON.stringify([record, ...existingResults.filter(e => String(e.id || e.attempt_id) !== String(attemptId))]));
      
      localStorage.setItem('olympiadhub_last_submitted_exam', JSON.stringify(record));

      // Backup persist to server /test-generator/submit endpoint to ensure MySQL sync
      apiClient.post('/test-generator/submit', {
        student_id: record.student_id,
        student_name: record.student_name,
        student_login_id: record.student_login_id,
        student_email: record.student_email,
        student_school: record.school_name,
        exam_id: record.exam_id,
        title: record.exam_title,
        subject: record.subject_name,
        grade: record.class_name,
        score: record.score,
        totalMarks: record.total_marks,
        totalQuestions: record.total_questions,
        correctCount: record.correct_count,
        wrongCount: record.wrong_count,
        unansweredCount: record.unanswered_count,
        timeSpentSeconds: record.time_taken_seconds,
        durationMinutes: record.duration_minutes,
        questions: qList
      }).catch(() => {});

      window.dispatchEvent(new CustomEvent('olympiad-exam-submitted', { detail: record }));
      window.dispatchEvent(new Event('exam-submitted'));
      return record;
    } catch (e) {
      console.warn('Could not cache exam locally:', e);
      return null;
    }
  };

  const handleAutoSubmit = async (reason) => {
    if (submitting) return;
    setSubmitting(true);
    try {
      const res = await apiClient.post('/exam-engine/submit', {
        attempt_id: sessionData.attempt_id
      });
      const rec = cacheAttemptLocally(sessionData.attempt_id, res);
      window.dispatchEvent(new CustomEvent('olympiad-exam-submitted', { detail: rec || res }));
      window.dispatchEvent(new Event('exam-submitted'));
      onExamCompleted(sessionData.attempt_id);
    } catch (err) {
      const rec = cacheAttemptLocally(sessionData.attempt_id, null);
      window.dispatchEvent(new CustomEvent('olympiad-exam-submitted', { detail: rec }));
      window.dispatchEvent(new Event('exam-submitted'));
      onExamCompleted(sessionData.attempt_id);
    }
  };

  const handleSubmitConfirmed = async () => {
    setSubmitting(true);
    try {
      const res = await apiClient.post('/exam-engine/submit', {
        attempt_id: sessionData.attempt_id
      });
      const rec = cacheAttemptLocally(sessionData.attempt_id, res);
      setShowSubmitModal(false);
      window.dispatchEvent(new CustomEvent('olympiad-exam-submitted', { detail: rec || res }));
      window.dispatchEvent(new Event('exam-submitted'));
      onExamCompleted(sessionData.attempt_id);
    } catch (err) {
      const rec = cacheAttemptLocally(sessionData.attempt_id, null);
      setShowSubmitModal(false);
      window.dispatchEvent(new CustomEvent('olympiad-exam-submitted', { detail: rec }));
      window.dispatchEvent(new Event('exam-submitted'));
      onExamCompleted(sessionData.attempt_id);
    }
  };

  // Status calculation for Palette
  const getQuestionStatus = (qId, index) => {
    const ans = answers[qId];
    if (!ans || !ans.is_visited) return 'not_visited';
    if (ans.selected_option && ans.is_marked_for_review) return 'answered_and_marked';
    if (ans.selected_option) return 'answered';
    if (ans.is_marked_for_review) return 'marked_for_review';
    return 'not_answered';
  };

  // Summary counts
  let answeredCount = 0;
  let notAnsweredCount = 0;
  let markedCount = 0;
  let markedAnsweredCount = 0;
  let notVisitedCount = 0;

  questions.forEach((q, idx) => {
    const status = getQuestionStatus(q.id, idx);
    if (status === 'answered') answeredCount++;
    else if (status === 'not_answered') notAnsweredCount++;
    else if (status === 'marked_for_review') markedCount++;
    else if (status === 'answered_and_marked') {
      markedAnsweredCount++;
      answeredCount++;
    } else notVisitedCount++;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white">
        <div className="w-12 h-12 rounded-full border-4 border-brand-500 border-t-transparent animate-spin mb-4" />
        <p className="text-sm font-semibold tracking-wide text-slate-300">
          Loading Distraction-Free Exam Engine...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4">
        <div className="max-w-md bg-white rounded-2xl p-8 text-center shadow-2xl">
          <AlertCircle className="w-12 h-12 text-rose-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-900 mb-2">Unable to Start Exam</h3>
          <p className="text-sm text-slate-600 mb-6">{error}</p>
          <Button variant="primary" onClick={onExit} className="w-full">
            Return to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const curAns = currentQuestion ? answers[currentQuestion.id] : null;
  const isSelected = (opt) => curAns?.selected_option === opt;
  const isTimeCritical = remainingSeconds < 300; // < 5 mins

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col select-none overflow-x-hidden">
      {/* 1. TOP BAR */}
      <header className="bg-white border-b border-slate-200 shadow-xs sticky top-0 z-30">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo & Title */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center text-white font-black text-lg">
                Ω
              </div>
              <div>
                <h1 className="text-sm font-bold text-slate-900 truncate max-w-xs sm:max-w-md">
                  {sessionData?.exam?.title}
                </h1>
                <div className="flex items-center gap-2 text-[11px] text-slate-500 font-mono">
                  <span>Code: {sessionData?.exam?.exam_code || sessionData?.exam?.short_code || sessionData?.exam?.subject_code || 'OLY-2026'}</span>
                  {sessionData?.exam?.author_name && (
                    <>
                      <span>•</span>
                      <span className="text-[#7c3aed] font-bold">Faculty: {sessionData.exam.author_name}</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Candidate & Timer & Submit */}
            <div className="flex items-center gap-4">
              {/* Candidate Info */}
              <div className="hidden md:block text-right">
                <p className="text-xs font-bold text-slate-800">
                  {sessionData?.student?.full_name}
                </p>
                <p className="text-[11px] text-slate-500 font-mono">
                  {sessionData?.student?.login_id}
                </p>
              </div>

              {/* Countdown Timer Card */}
              <div
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border font-mono font-bold text-sm shadow-xs ${
                  isTimeCritical
                    ? 'bg-rose-50 border-rose-300 text-rose-700 animate-pulse'
                    : 'bg-slate-900 border-slate-800 text-white'
                }`}
              >
                <Clock className={`w-4 h-4 ${isTimeCritical ? 'text-rose-600' : 'text-amber-400'}`} />
                <span>{formatTime(remainingSeconds)}</span>
              </div>

              {/* Submit Test Button */}
              <button
                type="button"
                onClick={() => setShowSubmitModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#fff0f3] hover:bg-[#ffe3e8] text-[#c2185b] border border-[#f8bbd0] font-bold text-xs sm:text-sm shadow-xs transition-all active:scale-95 cursor-pointer"
              >
                <Send className="w-4 h-4 text-[#c2185b]" />
                <span>Submit Test</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 2. MAIN EXAM BODY */}
      <div className="flex-1 flex flex-col lg:flex-row p-4 sm:p-6 gap-6 max-w-7xl mx-auto w-full">
        {/* LEFT/CENTER QUESTION CONTAINER */}
        <div className="flex-1 flex flex-col bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
          {/* Question Header */}
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/60 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="text-sm font-bold text-brand-700 bg-brand-50 px-3 py-1 rounded-lg border border-brand-200">
                Question {currentIndex + 1} of {questions.length}
              </span>
              {currentQuestion?.subject_name && (
                <span className="text-xs text-slate-600 font-semibold bg-slate-200/70 px-2.5 py-1 rounded-lg">
                  {currentQuestion.subject_name}
                </span>
              )}
              <Badge variant={currentQuestion?.difficulty} size="sm">
                {currentQuestion?.difficulty?.toUpperCase()}
              </Badge>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                +{parseFloat(currentQuestion?.marks || 1).toFixed(1)} Marks
              </span>
              {sessionData?.exam?.negative_marking && parseFloat(currentQuestion?.negative_marks) > 0 && (
                <span className="text-xs font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                  -{parseFloat(currentQuestion?.negative_marks).toFixed(2)} Neg
                </span>
              )}
            </div>
          </div>

          {/* Question Text Area */}
          <div className="flex-1 p-6 sm:p-8 overflow-y-auto">
            {currentQuestion ? (
              <div className="space-y-6">
                <div className="text-base sm:text-lg font-medium text-slate-900 leading-relaxed">
                  {currentQuestion.question_text || currentQuestion.q || currentQuestion.question || currentQuestion.title || 'Question Statement'}
                </div>

                {currentQuestion.question_image && (
                  <div className="my-4">
                    <img
                      src={currentQuestion.question_image}
                      alt="Question Diagram"
                      className="max-h-60 rounded-xl border border-slate-200 shadow-sm object-contain"
                    />
                  </div>
                )}

                {/* 4 MCQ OPTIONS */}
                <div className="space-y-3 pt-2">
                  {['A', 'B', 'C', 'D'].map((optKey, optIdx) => {
                    const optLower = (optKey || '').toString().toLowerCase();
                    const optText = currentQuestion
                      ? currentQuestion[`option_${optLower}`] ||
                        currentQuestion[optLower] ||
                        (Array.isArray(currentQuestion.options) ? currentQuestion.options[optIdx] : '') ||
                        (currentQuestion.options && currentQuestion.options[optKey]) ||
                        `Option ${optKey}`
                      : `Option ${optKey}`;
                    const active = isSelected(optKey);

                    return (
                      <button
                        key={optKey}
                        type="button"
                        onClick={() => handleSelectOption(optKey)}
                        className={`w-full text-left p-4 rounded-xl border transition-all flex items-start gap-4 ${
                          active
                            ? 'border-brand-600 bg-brand-50/70 ring-2 ring-brand-500/20 text-brand-900 shadow-xs'
                            : 'border-slate-200/90 bg-white hover:border-slate-300 hover:bg-slate-50/80 text-slate-800'
                        }`}
                      >
                        <span
                          className={`w-7 h-7 rounded-lg flex items-center justify-center font-black text-xs shrink-0 transition-all ${
                            optKey === 'A'
                              ? active
                                ? 'bg-red-100 border-2 border-red-400 text-red-700 ring-2 ring-red-200 shadow-xs'
                                : 'bg-red-50 border border-red-200 text-red-700 hover:bg-red-100'
                              : optKey === 'B'
                              ? active
                                ? 'bg-emerald-100 border-2 border-emerald-400 text-emerald-700 ring-2 ring-emerald-200 shadow-xs'
                                : 'bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100'
                              : optKey === 'C'
                              ? active
                                ? 'bg-amber-100 border-2 border-amber-400 text-amber-800 ring-2 ring-amber-200 shadow-xs'
                                : 'bg-amber-50 border border-amber-200 text-amber-800 hover:bg-amber-100'
                              : optKey === 'D'
                              ? active
                                ? 'bg-orange-100 border-2 border-orange-400 text-orange-800 ring-2 ring-orange-200 shadow-xs'
                                : 'bg-orange-50 border border-orange-200 text-orange-800 hover:bg-orange-100'
                              : active
                              ? 'bg-brand-50 border-2 border-brand-400 text-brand-700'
                              : 'bg-slate-50 text-slate-700 border border-slate-200'
                          }`}
                        >
                          {optKey}
                        </span>
                        <span className="text-sm font-medium pt-0.5 flex-1">
                          {optText}
                        </span>
                        {active && (
                          <Check className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <p className="text-slate-400">No question selected.</p>
            )}
          </div>

          {/* Bottom Action Controls */}
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                icon={ChevronLeft}
                onClick={handlePrevious}
                disabled={currentIndex === 0}
              >
                Previous
              </Button>

              <Button
                variant="secondary"
                size="sm"
                icon={RotateCcw}
                onClick={handleClearResponse}
                disabled={!curAns?.selected_option}
              >
                Clear Response
              </Button>

              <Button
                variant={curAns?.is_marked_for_review ? 'purple' : 'secondary'}
                size="sm"
                icon={Bookmark}
                onClick={handleToggleMarkReview}
              >
                {curAns?.is_marked_for_review ? 'Marked for Review' : 'Mark for Review'}
              </Button>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
                {autoSaveStatus}
              </span>

              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  if (currentIndex < questions.length - 1) {
                    handleNext();
                  } else {
                    setShowSubmitModal(true);
                  }
                }}
              >
                <span>{currentIndex === questions.length - 1 ? 'Save & Review' : 'Save & Next'}</span>
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        </div>

        {/* RIGHT QUESTION PALETTE */}
        <div className="w-full lg:w-80 flex flex-col space-y-4">
          {/* Palette Status Legend */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
              Question Palette Status
            </h3>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-2 p-1.5 bg-emerald-50/60 rounded-lg">
                <span className="w-5 h-5 rounded-md bg-emerald-600 text-white font-bold text-[10px] flex items-center justify-center">
                  {answeredCount}
                </span>
                <span className="text-slate-700 font-medium text-[11px]">Answered</span>
              </div>

              <div className="flex items-center gap-2 p-1.5 bg-amber-50/60 rounded-lg">
                <span className="w-5 h-5 rounded-md bg-amber-500 text-white font-bold text-[10px] flex items-center justify-center">
                  {notAnsweredCount}
                </span>
                <span className="text-slate-700 font-medium text-[11px]">Not Answered</span>
              </div>

              <div className="flex items-center gap-2 p-1.5 bg-purple-50/60 rounded-lg">
                <span className="w-5 h-5 rounded-md bg-purple-600 text-white font-bold text-[10px] flex items-center justify-center">
                  {markedCount}
                </span>
                <span className="text-slate-700 font-medium text-[11px]">Marked</span>
              </div>

              <div className="flex items-center gap-2 p-1.5 bg-slate-100 rounded-lg">
                <span className="w-5 h-5 rounded-md bg-slate-300 text-slate-700 font-bold text-[10px] flex items-center justify-center">
                  {notVisitedCount}
                </span>
                <span className="text-slate-700 font-medium text-[11px]">Not Visited</span>
              </div>
            </div>

            {/* Question Numbers Grid */}
            <div className="mt-5 pt-4 border-t border-slate-100">
              <p className="text-[11px] font-bold text-slate-500 mb-2.5">
                Click question number to navigate:
              </p>
              <div className="grid grid-cols-5 gap-2 max-h-56 overflow-y-auto p-1">
                {questions.map((q, idx) => {
                  const status = getQuestionStatus(q.id, idx);
                  const isCurrent = idx === currentIndex;

                  let colorClass = 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-300';
                  if (status === 'answered') {
                    colorClass = 'bg-emerald-600 text-white border-emerald-700';
                  } else if (status === 'not_answered') {
                    colorClass = 'bg-amber-500 text-white border-amber-600';
                  } else if (status === 'marked_for_review') {
                    colorClass = 'bg-purple-600 text-white border-purple-700';
                  } else if (status === 'answered_and_marked') {
                    colorClass = 'bg-purple-700 text-white border-purple-800 ring-2 ring-emerald-400';
                  }

                  return (
                    <button
                      key={q.id}
                      type="button"
                      onClick={() => handleJumpToQuestion(idx)}
                      className={`h-9 rounded-xl font-bold text-xs flex items-center justify-center border transition-all ${colorClass} ${
                        isCurrent ? 'ring-2 ring-brand-500 ring-offset-2 scale-105 shadow-md' : ''
                      }`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Security Proctoring Status Box */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-bold text-slate-800">Proctoring Security</span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-600">
              <span>Tab Switch Warnings:</span>
              <span className={`font-bold font-mono px-2 py-0.5 rounded ${tabWarnings > 0 ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'}`}>
                {tabWarnings} / {tabLimit}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* PROCTORING TAB SWITCH WARNING MODAL */}
      <Modal
        isOpen={showWarningModal}
        onClose={() => setShowWarningModal(false)}
        title="Security Alert: Tab Switch Detected"
        maxWidth="max-w-md"
        footer={
          <Button variant="danger" size="sm" onClick={() => setShowWarningModal(false)}>
            I Understand & Resume Test
          </Button>
        }
      >
        <div className="text-center py-2">
          <div className="w-14 h-14 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4 animate-bounce">
            <AlertTriangle className="w-7 h-7" />
          </div>
          <h4 className="text-base font-bold text-slate-900 mb-2">
            Warning #{tabWarnings} of {tabLimit}
          </h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            You are not allowed to navigate away from the examination window or switch applications.
            If you exceed <span className="font-bold text-rose-600">{tabLimit} warnings</span>, your test will be automatically submitted and flagged.
          </p>
        </div>
      </Modal>

      {/* SUBMIT TEST CONFIRMATION MODAL (Matching exact design from user screenshot) */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-300 max-w-lg w-full p-6 sm:p-7 relative space-y-6 animate-in zoom-in-95">
            {/* Top Close 'x' button */}
            <button
              type="button"
              onClick={() => setShowSubmitModal(false)}
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
                disabled={submitting}
                onClick={handleSubmitConfirmed}
                className="px-6 py-2 rounded bg-[#0284c7] hover:bg-[#0369a1] text-white font-black text-xs uppercase tracking-wider shadow-sm active:scale-95 transition-all cursor-pointer disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : 'YES'}
              </button>
              <button
                type="button"
                onClick={() => setShowSubmitModal(false)}
                className="px-6 py-2 rounded bg-[#dc2626] hover:bg-[#b91c1c] text-white font-black text-xs uppercase tracking-wider shadow-sm active:scale-95 transition-all cursor-pointer"
              >
                NO
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
