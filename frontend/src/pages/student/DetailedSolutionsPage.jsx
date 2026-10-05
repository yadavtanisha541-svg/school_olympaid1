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
  FileText
} from 'lucide-react';
import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge';

export const DetailedSolutionsPage = ({ attemptId, onBack, initialSolutions, initialAttemptMeta }) => {
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

  const totalMarks = attemptMeta?.total_marks || attemptMeta?.exam_total_marks || (totalQuestionsCount > 0 ? totalQuestionsCount : 60);
  const scoreObtained = attemptMeta?.score !== undefined ? attemptMeta.score : correctCount;
  const cutoffMarks = attemptMeta?.cutoff_marks || Math.round(totalMarks * 0.7);
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

  // Filtered solutions to render based on current radio selection
  const filteredSolutions = useMemo(() => {
    if (filterType === 'correct') return correctQuestions;
    if (filterType === 'wrong') return wrongQuestions;
    if (filterType === 'unattempted') return unattemptedQuestions;
    return normalizedSolutions;
  }, [filterType, normalizedSolutions, correctQuestions, wrongQuestions, unattemptedQuestions]);

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-500 font-sans">
        <div className="w-10 h-10 border-3 border-[#6d3a68] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm font-semibold">Loading step-by-step solutions &amp; analysis...</p>
      </div>
    );
  }

  return (
    <div className="space-y-5 max-w-6xl mx-auto font-sans pb-16 animate-in fade-in duration-200">
      {/* 1. TOP TITLE & ACTION BUTTONS HEADER BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-purple-100 text-[#6d3a68] border border-purple-200 flex items-center justify-center font-black text-sm shrink-0 shadow-2xs">
            Ω
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
              {examTitle}
            </h1>
            <p className="text-[11px] text-slate-400 font-medium">Detailed Solutions &amp; Performance Review</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs shadow-2xs transition-all cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          )}
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#6d3a68] hover:bg-[#582e54] text-white font-bold text-xs shadow-2xs transition-all cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Solutions</span>
          </button>
        </div>
      </div>

      {/* 2. SUMMARY METRICS CARD WITH 4 FILTER RADIOS */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
          {/* Metric 1: Total Marks & Score */}
          <div className="pb-3 sm:pb-0 sm:pr-4">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Marks Scored</p>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-2xl sm:text-3xl font-black text-[#6d3a68]">{scoreObtained}</span>
              <span className="text-xs font-bold text-slate-400">/ {totalMarks}</span>
            </div>
            <p className="text-[10px] text-emerald-600 font-semibold mt-0.5">
              {correctCount} of {totalQuestionsCount} questions correct
            </p>
          </div>

          {/* Metric 2: Time Taken / Total Duration */}
          <div className="pt-3 sm:pt-0 sm:px-4">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Time Taken / Total</p>
            <p className="text-lg sm:text-xl font-black text-slate-800 font-mono mt-1">
              {timeFormatted}
            </p>
            <p className="text-[10px] text-slate-400 font-medium mt-0.5">Automated timer recording</p>
          </div>

          {/* Metric 3: Cutoff / Total Marks */}
          <div className="pt-3 sm:pt-0 sm:px-4">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Cutoff / Total Marks</p>
            <p className="text-lg sm:text-xl font-black text-slate-800 font-mono mt-1">
              {cutoffMarks} / {totalMarks}
            </p>
            <p className="text-[10px] text-purple-700 font-semibold mt-0.5">
              {scoreObtained >= cutoffMarks ? '✓ Qualified Merit Benchmark' : 'Practice Target Benchmark'}
            </p>
          </div>

          {/* Metric 4: Filter Radios (All, Correct, Wrong, Unattempted) */}
          <div className="pt-3 sm:pt-0 sm:pl-4 flex flex-col justify-center gap-1.5">
            <div className="grid grid-cols-2 gap-x-3 gap-y-2 text-xs">
              {/* All */}
              <label className="flex items-center gap-1.5 cursor-pointer font-bold text-slate-800 select-none group">
                <input
                  type="radio"
                  name="solutionFilter"
                  value="all"
                  checked={filterType === 'all'}
                  onChange={() => setFilterType('all')}
                  className="w-3.5 h-3.5 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                <span className={filterType === 'all' ? 'text-blue-600 font-black' : ''}>
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
                  className="w-3.5 h-3.5 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
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
                  className="w-3.5 h-3.5 text-rose-600 focus:ring-rose-500 cursor-pointer"
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
                  className="w-3.5 h-3.5 text-amber-600 focus:ring-amber-500 cursor-pointer"
                />
                <span className={filterType === 'unattempted' ? 'text-amber-700 font-black underline' : ''}>
                  Unattempted ({unattemptedCount})
                </span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* 3. QUESTIONS & SOLUTIONS LIST */}
      <div className="space-y-5 pt-1">
        {filteredSolutions.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center text-slate-500 space-y-3">
            <p className="text-sm font-bold">
              No questions found for the selected filter: <span className="uppercase text-blue-600">{filterType}</span> ({filterType === 'correct' ? correctCount : (filterType === 'wrong' ? wrongCount : unattemptedCount)})
            </p>
            <button
              type="button"
              onClick={() => setFilterType('all')}
              className="px-4 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer shadow-2xs transition-colors"
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
                className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-7 shadow-xs space-y-4 animate-in fade-in duration-150"
              >
                {/* Question Header: Question pill on left, STATUS on right */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#6d3a68] bg-[#faf5fa] px-3 py-1 rounded-lg border border-[#edd6ed]">
                      Question {idx + 1}
                    </span>
                  </div>

                  <div>
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-xs font-bold border ${
                        isCorrect
                          ? 'bg-[#ecfdf5] text-[#059669] border-[#a7f3d0]'
                          : isWrong
                          ? 'bg-[#fdf2f2] text-[#e02424] border-[#fbd5d5]'
                          : 'bg-[#fffbeb] text-[#b45309] border-[#fde68a]'
                      }`}
                    >
                      {isCorrect ? '✓ CORRECT (+1.0)' : isWrong ? '✗ INCORRECT (0.0)' : '○ UNATTEMPTED (0.0)'}
                    </span>
                  </div>
                </div>

                {/* Question Text */}
                <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                  {item.question_text}
                </h3>

                {/* 4 MCQ Options */}
                <div className="space-y-2.5">
                  {['A', 'B', 'C', 'D'].map((opt, optIdx) => {
                    const text = item.options?.[optIdx] || item[`option_${opt.toLowerCase()}`] || `Option ${opt}`;
                    const isUserPick = userSelected === opt;
                    const isThisCorrect = correctOpt === opt;

                    let cardStyle = 'border-slate-200 bg-white text-slate-800';
                    if (isThisCorrect) {
                      cardStyle = 'border-emerald-500 bg-emerald-50/60 text-emerald-950 font-bold';
                    } else if (isUserPick && !isThisCorrect) {
                      cardStyle = 'border-rose-400 bg-rose-50/70 text-rose-950 font-bold';
                    }

                    return (
                      <div
                        key={opt}
                        className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 text-xs sm:text-sm transition-all ${cardStyle}`}
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={`w-7 h-7 rounded-lg font-bold flex items-center justify-center text-xs shrink-0 ${
                              isThisCorrect
                                ? 'bg-emerald-600 text-white'
                                : isUserPick
                                ? 'bg-rose-600 text-white'
                                : 'bg-slate-100 text-slate-700 border border-slate-200'
                            }`}
                          >
                            {opt}
                          </span>
                          <span className="font-semibold text-slate-900">{text}</span>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {isThisCorrect && (
                            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100/90 px-2.5 py-1 rounded-md flex items-center gap-1 border border-emerald-200">
                              <Check className="w-3.5 h-3.5" /> Correct Answer
                            </span>
                          )}
                          {isUserPick && !isThisCorrect && (
                            <span className="text-[11px] font-bold text-rose-700 bg-rose-100/90 px-2.5 py-1 rounded-md border border-rose-200">
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
                  <div className="p-4 bg-amber-50/70 border border-amber-200/80 rounded-2xl text-xs space-y-1 mt-2">
                    <span className="font-bold text-amber-900 block uppercase tracking-wider text-[10px]">
                      Step-by-Step Mathematical &amp; Conceptual Solution:
                    </span>
                    <p className="text-slate-800 leading-relaxed font-medium text-xs sm:text-[13px]">
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
