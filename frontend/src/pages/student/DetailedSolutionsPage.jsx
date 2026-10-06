import React, { useState, useEffect, useMemo } from 'react';
import { apiClient } from '../../api/client';
import {
  CheckCircle2,
  XCircle,
  Clock,
  Award,
  ArrowLeft,
  ChevronRight,
  Download,
  Printer,
  Sparkles,
  RotateCcw,
  Check,
  X,
  HelpCircle,
  FileText,
  Globe,
  Calendar,
  BarChart2
} from 'lucide-react';
import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge';

export const DetailedSolutionsPage = ({
  attemptId,
  onBack,
  onViewAnalysis,
  onGoToList,
  onNavigateTab,
  initialSolutions,
  initialAttemptMeta
}) => {
  const [solutions, setSolutions] = useState(initialSolutions || []);
  const [attemptMeta, setAttemptMeta] = useState(initialAttemptMeta || null);
  const [loading, setLoading] = useState(!initialSolutions || initialSolutions.length === 0);
  const [filterType, setFilterType] = useState('all'); // 'all' | 'correct' | 'wrong' | 'unattempted'

  const fetchSolutions = async () => {
    if (initialSolutions && initialSolutions.length > 0) {
      setSolutions(initialSolutions);
      if (initialAttemptMeta) setAttemptMeta(initialAttemptMeta);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      let loaded = false;

      // 1. If attemptId is present, fetch from API first
      if (attemptId) {
        try {
          const res = await apiClient.get(`/results/${attemptId}/solutions`);
          if (res.success && res.data) {
            let qs = [];
            let meta = null;
            if (Array.isArray(res.data)) {
              qs = res.data;
            } else if (Array.isArray(res.data.solutions)) {
              qs = res.data.solutions;
              meta = res.data.attempt;
            } else if (Array.isArray(res.data.questions)) {
              qs = res.data.questions;
              meta = res.data.attempt;
            }
            if (res.attempt) meta = res.attempt;

            if (qs.length > 0) {
              setSolutions(qs);
              if (meta) setAttemptMeta(meta);
              loaded = true;
            }
          }
        } catch (apiErr) {
          console.warn('Could not fetch solutions from API:', apiErr);
        }
      }

      // 2. If not loaded from API, check localStorage for matching or recent attempt
      if (!loaded) {
        const localKeys = [
          'olympiadhub_last_submitted_exam',
          'olympiadhub_student_attempts',
          'student_test_attempts',
          'test_generator_attempts',
          'olympiadhub_db_results'
        ];

        let foundAttempt = null;
        for (const key of localKeys) {
          try {
            const raw = localStorage.getItem(key);
            if (raw) {
              const parsed = JSON.parse(raw);
              if (Array.isArray(parsed) && parsed.length > 0) {
                if (attemptId) {
                  foundAttempt = parsed.find((a) => String(a.id || a.attempt_id) === String(attemptId));
                }
                if (!foundAttempt && !attemptId) {
                  foundAttempt = parsed[0];
                }
              } else if (parsed && typeof parsed === 'object') {
                if (attemptId) {
                  if (String(parsed.id || parsed.attempt_id) === String(attemptId)) {
                    foundAttempt = parsed;
                  }
                } else {
                  foundAttempt = parsed;
                }
              }
            }
            if (foundAttempt && Array.isArray(foundAttempt.questions) && foundAttempt.questions.length > 0) {
              break;
            }
          } catch (e) {}
        }

        if (foundAttempt && Array.isArray(foundAttempt.questions) && foundAttempt.questions.length > 0) {
          setSolutions(foundAttempt.questions);
          setAttemptMeta(foundAttempt);
          loaded = true;
        }
      }
    } catch (err) {
      console.error('Error in fetching solutions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialSolutions && initialSolutions.length > 0) {
      setSolutions(initialSolutions);
      if (initialAttemptMeta) setAttemptMeta(initialAttemptMeta);
      setLoading(false);
    } else {
      fetchSolutions();
    }
  }, [attemptId, initialSolutions, initialAttemptMeta]);

  // Normalize each solution question item reliably
  const normalizedSolutions = useMemo(() => {
    const letters = ['A', 'B', 'C', 'D'];

    return (solutions || []).map((item, idx) => {
      if (!item) return null;

      // 1. Resolve User Selection ('A', 'B', 'C', 'D' or null)
      let userOpt = null;
      if (item.selected_option !== undefined && item.selected_option !== null && item.selected_option !== '') {
        userOpt = typeof item.selected_option === 'number' ? letters[item.selected_option] : String(item.selected_option).trim().toUpperCase();
      } else if (item.userSelected !== undefined && item.userSelected !== null && item.userSelected !== '') {
        userOpt = typeof item.userSelected === 'number' ? letters[item.userSelected] : String(item.userSelected).trim().toUpperCase();
      } else if (item.user_answer !== undefined && item.user_answer !== null && item.user_answer !== '') {
        userOpt = typeof item.user_answer === 'number' ? letters[item.user_answer] : String(item.user_answer).trim().toUpperCase();
      }

      // 2. Resolve Correct Option ('A', 'B', 'C', 'D')
      let correctOpt = 'A';
      if (item.correct_option !== undefined && item.correct_option !== null && item.correct_option !== '') {
        correctOpt = typeof item.correct_option === 'number' ? letters[item.correct_option] : String(item.correct_option).trim().toUpperCase();
      } else if (item.correct !== undefined && item.correct !== null && item.correct !== '') {
        correctOpt = typeof item.correct === 'number' ? letters[item.correct] : String(item.correct).trim().toUpperCase();
      } else if (item.answer !== undefined && item.answer !== null && item.answer !== '') {
        correctOpt = typeof item.answer === 'number' ? letters[item.answer] : String(item.answer).trim().toUpperCase();
      }

      // 3. Determine status
      const isAttempted = userOpt !== null && userOpt !== '' && userOpt !== 'NULL' && userOpt !== 'UNDEFINED';
      let isCorrect = false;

      if (item.is_correct !== undefined && item.is_correct !== null) {
        isCorrect = item.is_correct === true || item.is_correct === 1 || String(item.is_correct) === '1';
      } else if (isAttempted) {
        isCorrect = userOpt === correctOpt;
      }

      const isWrong = isAttempted && !isCorrect;
      const isUnattempted = !isAttempted;

      // 4. Resolve Options Array
      let optionsArray = [];
      if (Array.isArray(item.options)) {
        optionsArray = item.options;
      } else {
        optionsArray = [
          item.option_a || item.optionA || item.A || 'Option A',
          item.option_b || item.optionB || item.B || 'Option B',
          item.option_c || item.optionC || item.C || 'Option C',
          item.option_d || item.optionD || item.D || 'Option D'
        ];
      }

      return {
        ...item,
        id: item.id || idx + 1,
        question_text: item.question_text || item.q || item.question || item.title || `Question ${idx + 1}`,
        options: optionsArray,
        option_a: optionsArray[0] || 'Option A',
        option_b: optionsArray[1] || 'Option B',
        option_c: optionsArray[2] || 'Option C',
        option_d: optionsArray[3] || 'Option D',
        selected_option: userOpt,
        correct_option: correctOpt,
        is_attempted: isAttempted,
        is_correct: isCorrect,
        is_wrong: isWrong,
        is_unattempted: isUnattempted,
        explanation: item.explanation || item.solution || item.step_by_step_explanation || 'Refer to the official Olympiad conceptual steps.'
      };
    }).filter(Boolean);
  }, [solutions]);

  // Derived filtered lists
  const correctQuestions = useMemo(() => normalizedSolutions.filter((s) => s.is_correct), [normalizedSolutions]);
  const wrongQuestions = useMemo(() => normalizedSolutions.filter((s) => s.is_wrong), [normalizedSolutions]);
  const unattemptedQuestions = useMemo(() => normalizedSolutions.filter((s) => s.is_unattempted), [normalizedSolutions]);

  const totalQuestionsCount = normalizedSolutions.length;
  const correctCount = correctQuestions.length;
  const wrongCount = wrongQuestions.length;
  const unattemptedCount = unattemptedQuestions.length;

  const calculatedMaxMarks = normalizedSolutions.reduce((sum, q) => sum + (Number(q.marks) || 1), 0);
  const totalMarks = Number(attemptMeta?.total_marks) || Number(attemptMeta?.exam_total_marks) || calculatedMaxMarks || (totalQuestionsCount > 0 ? totalQuestionsCount : 10);
  
  let scoreObtained = correctCount;
  if (attemptMeta?.score !== undefined && !isNaN(Number(attemptMeta.score))) {
    const rawScore = Number(attemptMeta.score);
    scoreObtained = (rawScore <= totalMarks) ? rawScore : correctCount;
  }
  const cutoffMarks = attemptMeta?.cutoff_marks || Math.round(totalMarks * 0.4) || 1;
  const timeTakenSecs = attemptMeta?.time_taken_seconds || attemptMeta?.time_spent_seconds || 1800;
  const totalDurationSecs = (attemptMeta?.duration_minutes || 60) * 60;

  // Format seconds to H:MM:SS
  const formatTimeFull = (secs) => {
    const s = Math.max(0, Number(secs) || 0);
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${h}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  const timeFormatted = `${formatTimeFull(timeTakenSecs)} / ${formatTimeFull(totalDurationSecs)}`;
  const examTitle = attemptMeta?.exam_title || attemptMeta?.title || 'Olympiad Exam';

  const handleViewAnalysis = () => {
    if (onViewAnalysis) {
      onViewAnalysis();
    } else if (onNavigateTab) {
      onNavigateTab('performance');
    }
  };

  const handleGoToList = () => {
    if (onGoToList) {
      onGoToList();
    } else if (onBack) {
      onBack();
    } else if (onNavigateTab) {
      onNavigateTab('available_exams');
    }
  };

  // Filtered solutions to render based on current radio selection
  const filteredSolutions = useMemo(() => {
    if (filterType === 'correct') return correctQuestions;
    if (filterType === 'wrong') return wrongQuestions;
    if (filterType === 'unattempted') return unattemptedQuestions;
    return normalizedSolutions;
  }, [filterType, normalizedSolutions, correctQuestions, wrongQuestions, unattemptedQuestions]);

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-400 font-sans">
        <div className="w-10 h-10 border-3 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm font-semibold text-purple-300">Loading step-by-step solutions &amp; analysis...</p>
      </div>
    );
  }

  return (
    <div className="space-y-5 max-w-6xl mx-auto font-sans pb-16 animate-in fade-in duration-200">
      {/* 1. TOP TITLE & ACTION BUTTONS HEADER BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-[#ebd7eb]">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-white border border-[#ebd7eb] shadow-xs flex items-center justify-center text-[#80497D] font-black text-lg shrink-0">
            Ω
          </div>
          <div>
            <h1 className="text-lg sm:text-2xl font-black text-[#422240] tracking-tight leading-snug">
              {examTitle}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">Detailed Solutions &amp; Performance Review</p>
          </div>
        </div>

        <div className="flex items-center flex-wrap gap-2 sm:gap-2.5">
          {/* View Analysis Button */}
          <button
            type="button"
            onClick={handleViewAnalysis}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-blue-200 bg-white hover:bg-blue-50/50 text-[#16327a] font-bold text-xs shadow-2xs transition-all cursor-pointer active:scale-95"
          >
            <Globe className="w-3.5 h-3.5 text-blue-600" />
            <span>View Analysis</span>
          </button>

          {/* Go to Test List Button */}
          <button
            type="button"
            onClick={handleGoToList}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs shadow-2xs transition-all cursor-pointer active:scale-95"
          >
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            <span>Go to Test List</span>
          </button>

          {/* Back Button */}
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs shadow-2xs transition-all cursor-pointer active:scale-95"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          )}

          {/* Print Solutions Button */}
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#5b3da8] to-[#16327a] text-white font-bold text-xs shadow-md shadow-purple-950/20 border border-[#7854d6]/40 transition-all cursor-pointer active:scale-95"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Solutions</span>
          </button>
        </div>
      </div>

      {/* 2. SUMMARY METRICS CARD WITH 4 FILTER RADIOS */}
      <div className="bg-white rounded-3xl border border-[#eee6f8] p-5 sm:p-6 shadow-card">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
          {/* Metric 1: Total Marks & Score */}
          <div className="pb-3 sm:pb-0 sm:pr-4">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Marks Scored</p>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-2xl sm:text-3xl font-black text-[#2e1065]">{scoreObtained}</span>
              <span className="text-xs font-bold text-slate-400">/ {totalMarks}</span>
            </div>
            <p className="text-[11px] text-emerald-600 font-bold mt-0.5">
              {correctCount} of {totalQuestionsCount} questions correct
            </p>
          </div>

          {/* Metric 2: Time Taken / Total Duration */}
          <div className="pt-3 sm:pt-0 sm:px-4">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Time Taken / Total</p>
            <p className="text-lg sm:text-xl font-black text-[#16327a] font-mono mt-1">
              {timeFormatted}
            </p>
            <p className="text-[11px] text-slate-400 font-medium mt-0.5">Automated timer recording</p>
          </div>

          {/* Metric 3: Cutoff / Total Marks */}
          <div className="pt-3 sm:pt-0 sm:px-4">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Cutoff / Total Marks</p>
            <p className="text-lg sm:text-xl font-black text-slate-800 font-mono mt-1">
              {cutoffMarks} / {totalMarks}
            </p>
            <p className="text-[11px] text-[#7c3aed] font-bold mt-0.5">
              {scoreObtained >= cutoffMarks ? '✓ Qualified Merit Benchmark' : 'Practice Target Benchmark'}
            </p>
          </div>

          {/* Metric 4: Filter Radios (All, Correct, Wrong, Unattempted) */}
          <div className="pt-3 sm:pt-0 sm:pl-4 flex flex-col justify-center gap-1.5">
            <div className="grid grid-cols-2 gap-x-3 gap-y-2 text-xs">
              {/* All */}
              <label className="flex items-center gap-1.5 cursor-pointer font-bold text-slate-700 select-none group">
                <input
                  type="radio"
                  name="solutionFilter"
                  value="all"
                  checked={filterType === 'all'}
                  onChange={() => setFilterType('all')}
                  className="w-3.5 h-3.5 text-blue-600 border-slate-300 focus:ring-blue-500 cursor-pointer"
                />
                <span className={filterType === 'all' ? 'text-blue-700 font-black' : ''}>
                  All ({totalQuestionsCount})
                </span>
              </label>

              {/* Correct */}
              <label className="flex items-center gap-1.5 cursor-pointer font-bold text-emerald-700 select-none group">
                <input
                  type="radio"
                  name="solutionFilter"
                  value="correct"
                  checked={filterType === 'correct'}
                  onChange={() => setFilterType('correct')}
                  className="w-3.5 h-3.5 text-emerald-600 border-slate-300 focus:ring-emerald-500 cursor-pointer"
                />
                <span className={filterType === 'correct' ? 'text-emerald-700 font-black underline' : ''}>
                  Correct ({correctCount})
                </span>
              </label>

              {/* Wrong */}
              <label className="flex items-center gap-1.5 cursor-pointer font-bold text-rose-700 select-none group">
                <input
                  type="radio"
                  name="solutionFilter"
                  value="wrong"
                  checked={filterType === 'wrong'}
                  onChange={() => setFilterType('wrong')}
                  className="w-3.5 h-3.5 text-rose-600 border-slate-300 focus:ring-rose-500 cursor-pointer"
                />
                <span className={filterType === 'wrong' ? 'text-rose-700 font-black underline' : ''}>
                  Wrong ({wrongCount})
                </span>
              </label>

              {/* Unattempted */}
              <label className="flex items-center gap-1.5 cursor-pointer font-bold text-amber-700 select-none group">
                <input
                  type="radio"
                  name="solutionFilter"
                  value="unattempted"
                  checked={filterType === 'unattempted'}
                  onChange={() => setFilterType('unattempted')}
                  className="w-3.5 h-3.5 text-amber-600 border-slate-300 focus:ring-amber-500 cursor-pointer"
                />
                <span className={filterType === 'unattempted' ? 'text-amber-800 font-black underline' : ''}>
                  Unattempted ({unattemptedCount})
                </span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* 3. QUESTIONS & SOLUTIONS LIST */}
      <div className="space-y-4 pt-1">
        {filteredSolutions.length === 0 ? (
          <div className="bg-white rounded-3xl border border-[#eee6f8] p-8 text-center text-slate-500 space-y-3 shadow-card">
            <p className="text-sm font-bold text-slate-700">
              No questions found for the selected filter: <span className="uppercase text-blue-600 font-bold">{filterType}</span> ({filterType === 'correct' ? correctCount : (filterType === 'wrong' ? wrongCount : unattemptedCount)})
            </p>
            <button
              type="button"
              onClick={() => setFilterType('all')}
              className="px-4 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-[#5b3da8] border border-purple-200 font-bold text-xs cursor-pointer shadow-xs transition-colors"
            >
              Show All Questions ({totalQuestionsCount})
            </button>
          </div>
        ) : (
          filteredSolutions.map((item, idx) => {
            const isCorrect = item.is_correct;
            const isWrong = item.is_wrong;
            const isUnattempted = item.is_unattempted;
            const userSelected = item.selected_option;
            const correctOpt = item.correct_option || 'A';

            return (
              <div
                key={item.id || idx}
                className="bg-white rounded-3xl border border-[#eee6f8] p-5 sm:p-7 shadow-card space-y-4 animate-in fade-in duration-150 hover:border-purple-300 transition-all"
              >
                {/* Question Header: Question pill on left, STATUS on right */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-[#6d3a68] bg-[#faf5fa] px-3.5 py-1 rounded-xl border border-[#ebd7eb]">
                      Question {idx + 1}
                    </span>
                  </div>

                  <div>
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-extrabold border ${
                        isCorrect
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : isWrong
                          ? 'bg-rose-50 text-rose-700 border-rose-200'
                          : 'bg-amber-50 text-amber-800 border-amber-200'
                      }`}
                    >
                      {isCorrect ? '✓ CORRECT (+1.0)' : isWrong ? '✗ INCORRECT (0.0)' : '○ UNATTEMPTED (0.0)'}
                    </span>
                  </div>
                </div>

                {/* Question Text */}
                <h3 className="text-base sm:text-lg font-black text-[#2e1065] leading-snug">
                  {item.question_text}
                </h3>

                {/* 4 MCQ Options */}
                <div className="space-y-2.5">
                  {['A', 'B', 'C', 'D'].map((opt, optIdx) => {
                    const text = item.options?.[optIdx] || item[`option_${opt.toLowerCase()}`] || `Option ${opt}`;
                    const isUserPick = userSelected === opt;
                    const isThisCorrect = correctOpt === opt;

                    let cardStyle = 'border-slate-200 bg-slate-50/70 text-slate-700 hover:bg-slate-100/80';
                    if (isThisCorrect) {
                      cardStyle = 'border-2 border-emerald-500 bg-emerald-50/90 text-emerald-950 font-bold shadow-xs';
                    } else if (isUserPick && !isThisCorrect) {
                      cardStyle = 'border-2 border-rose-500 bg-rose-50/90 text-rose-950 font-bold shadow-xs';
                    }

                    return (
                      <div
                        key={opt}
                        className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 text-xs sm:text-sm transition-all ${cardStyle}`}
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={`w-7 h-7 rounded-xl font-black flex items-center justify-center text-xs shrink-0 transition-all ${
                              isThisCorrect
                                ? 'bg-emerald-100 border-2 border-emerald-400 text-emerald-800 ring-2 ring-emerald-200 shadow-xs'
                                : isUserPick
                                ? 'bg-rose-100 border-2 border-rose-400 text-rose-800 ring-2 ring-rose-200 shadow-xs'
                                : opt === 'A'
                                ? 'bg-red-50 border border-red-200 text-red-700'
                                : opt === 'B'
                                ? 'bg-emerald-50 border border-emerald-200 text-emerald-700'
                                : opt === 'C'
                                ? 'bg-amber-50 border border-amber-200 text-amber-800'
                                : opt === 'D'
                                ? 'bg-orange-50 border border-orange-200 text-orange-800'
                                : 'bg-slate-50 text-slate-700 border border-slate-200'
                            }`}
                          >
                            {opt}
                          </span>
                          <span className="font-semibold">{text}</span>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {isThisCorrect && (
                            <span className="text-[11px] font-extrabold text-emerald-700 bg-emerald-100/90 px-2.5 py-1 rounded-lg flex items-center gap-1 border border-emerald-300 shadow-2xs">
                              <Check className="w-3.5 h-3.5" /> Correct Answer
                            </span>
                          )}
                          {isUserPick && !isThisCorrect && (
                            <span className="text-[11px] font-extrabold text-rose-700 bg-rose-100/90 px-2.5 py-1 rounded-lg border border-rose-300 shadow-2xs">
                              Your Selection
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Step-by-Step Explanation */}
                {item.explanation && (
                  <div className="p-4 sm:p-5 bg-gradient-to-r from-[#faf6fa] via-white to-[#fdf7f5] border border-[#ebd7eb] rounded-2xl text-xs space-y-1 mt-3">
                    <span className="font-black text-[#80497D] block uppercase tracking-wider text-[11px]">
                      Step-by-Step Mathematical &amp; Conceptual Solution:
                    </span>
                    <p className="text-slate-700 leading-relaxed font-medium text-xs sm:text-[13px]">
                      {item.explanation}
                    </p>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
