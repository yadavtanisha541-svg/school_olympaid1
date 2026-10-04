import React, { useState, useEffect, useMemo } from 'react';
import { apiClient } from '../../api/client';
import {
  CheckCircle2,
  XCircle,
  ArrowLeft,
  BookOpen,
  Check,
  Award,
  Clock,
  FileText,
  Globe,
  ListOrdered,
  Filter,
  CheckCircle,
  RotateCcw,
  Target
} from 'lucide-react';
import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge';

export const DetailedSolutionsPage = ({
  attemptId,
  initialSolutions = null,
  initialAttemptMeta = null,
  onBack,
  onViewAnalysis,
  onNavigateTab
}) => {
  const [solutions, setSolutions] = useState(initialSolutions || []);
  const [attemptMeta, setAttemptMeta] = useState(initialAttemptMeta || null);
  const [loading, setLoading] = useState(initialSolutions ? false : true);
  const [filterType, setFilterType] = useState('all'); // 'all' | 'correct' | 'wrong' | 'unattempted'

  const fetchSolutions = async () => {
    if (initialSolutions && initialSolutions.length > 0) {
      setLoading(false);
      return;
    }
    if (!attemptId) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const res = await apiClient.get(`/results/${attemptId}/solutions`);
      if (res.success) {
        if (Array.isArray(res.data)) {
          setSolutions(res.data);
        } else if (res.data?.questions) {
          setSolutions(res.data.questions);
        }
        if (res.attempt || res.data?.attempt) {
          setAttemptMeta(res.attempt || res.data.attempt);
        }
        if (res.exam || res.data?.exam) {
          setAttemptMeta((prev) => ({ ...(prev || {}), ...(res.exam || res.data.exam) }));
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialSolutions) {
      setSolutions(initialSolutions);
      if (initialAttemptMeta) setAttemptMeta(initialAttemptMeta);
      setLoading(false);
    } else {
      fetchSolutions();
    }
  }, [attemptId, initialSolutions, initialAttemptMeta]);

  // Derived stats
  const totalQuestions = solutions.length || 2;
  const correctQuestions = solutions.filter((s) => s.is_correct || s.selected_option === s.correct_option);
  const wrongQuestions = solutions.filter((s) => s.selected_option && s.selected_option !== s.correct_option);
  const unattemptedQuestions = solutions.filter((s) => !s.selected_option);

  const correctCount = correctQuestions.length;
  const wrongCount = wrongQuestions.length;
  const unattemptedCount = unattemptedQuestions.length;

  const totalMarks = attemptMeta?.total_marks || attemptMeta?.exam_total_marks || (totalQuestions * 1) || 60;
  const scoreObtained = attemptMeta?.score !== undefined ? attemptMeta.score : (correctCount * 1);
  const cutoffMarks = attemptMeta?.cutoff_marks || 42;
  const timeTakenSecs = attemptMeta?.time_taken_seconds || attemptMeta?.time_spent_seconds || 617; // 10m 17s default
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
  const examTitle = attemptMeta?.exam_title || attemptMeta?.title || 'Level-1 Mock Test 1 Class 6';

  // Filtered solutions
  const filteredSolutions = useMemo(() => {
    if (filterType === 'correct') return correctQuestions;
    if (filterType === 'wrong') return wrongQuestions;
    if (filterType === 'unattempted') return unattemptedQuestions;
    return solutions;
  }, [filterType, solutions, correctQuestions, wrongQuestions, unattemptedQuestions]);

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-500 font-sans">
        <div className="w-10 h-10 border-3 border-[#859900] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm font-semibold">Loading step-by-step solutions...</p>
      </div>
    );
  }

  return (
    <div className="space-y-5 max-w-5xl mx-auto font-sans pb-16">
      {/* 1. TOP TITLE & ACTION BUTTONS HEADER BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-black text-sm shrink-0">
            Ω
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
              {examTitle}
            </h1>
            <p className="text-[11px] text-slate-400 font-medium">Detailed Solutions &amp; Performance Review</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => {
              if (onViewAnalysis) onViewAnalysis(attemptId);
              else if (onNavigateTab) onNavigateTab('performance');
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-bold transition-colors cursor-pointer shadow-2xs"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>View Analysis</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (onNavigateTab) onNavigateTab('my_content');
              else if (onBack) onBack();
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-purple-200 bg-purple-50 text-purple-700 hover:bg-purple-100 text-xs font-bold transition-colors cursor-pointer shadow-2xs"
          >
            <ListOrdered className="w-3.5 h-3.5" />
            <span>Go to Test List</span>
          </button>
        </div>
      </div>

      {/* 2. STATS & FILTER BAR (MATCHING USER IMAGE 2) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-center divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
          {/* Metric 1: Time Taken */}
          <div className="flex items-center gap-3.5 pt-2 sm:pt-0 sm:px-3 first:px-0">
            <div className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Time Taken
              </span>
              <p className="text-sm font-black text-slate-800 font-mono mt-0.5">
                {timeFormatted}
              </p>
            </div>
          </div>

          {/* Metric 2: Marks Obtained */}
          <div className="flex items-center gap-3.5 pt-2 sm:pt-0 sm:px-3">
            <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Marks Obtained
              </span>
              <p className="text-sm font-black text-blue-700 font-mono mt-0.5">
                {scoreObtained} / {totalMarks}
              </p>
            </div>
          </div>

          {/* Metric 3: Last Year Cutoff Marks */}
          <div className="flex items-center gap-3.5 pt-2 sm:pt-0 sm:px-3">
            <div className="w-10 h-10 rounded-full bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center shrink-0">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Last Year Cutoff Marks
              </span>
              <p className="text-sm font-black text-slate-800 font-mono mt-0.5">
                {cutoffMarks} / {totalMarks}
              </p>
            </div>
          </div>

          {/* Metric 4: Filter Radios (All, Correct, Wrong, Unattempted) */}
          <div className="pt-3 sm:pt-0 sm:pl-4 flex flex-col justify-center gap-1.5">
            <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs">
              <label className="flex items-center gap-1.5 cursor-pointer font-bold text-slate-700 select-none">
                <input
                  type="radio"
                  name="solutionFilter"
                  value="all"
                  checked={filterType === 'all'}
                  onChange={() => setFilterType('all')}
                  className="w-3.5 h-3.5 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                <span>All ({totalQuestions})</span>
              </label>

              <label className="flex items-center gap-1.5 cursor-pointer font-bold text-emerald-700 select-none">
                <input
                  type="radio"
                  name="solutionFilter"
                  value="correct"
                  checked={filterType === 'correct'}
                  onChange={() => setFilterType('correct')}
                  className="w-3.5 h-3.5 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
                <span>Correct ({correctCount})</span>
              </label>

              <label className="flex items-center gap-1.5 cursor-pointer font-bold text-rose-700 select-none">
                <input
                  type="radio"
                  name="solutionFilter"
                  value="wrong"
                  checked={filterType === 'wrong'}
                  onChange={() => setFilterType('wrong')}
                  className="w-3.5 h-3.5 text-rose-600 focus:ring-rose-500 cursor-pointer"
                />
                <span>Wrong ({wrongCount})</span>
              </label>

              <label className="flex items-center gap-1.5 cursor-pointer font-bold text-amber-700 select-none">
                <input
                  type="radio"
                  name="solutionFilter"
                  value="unattempted"
                  checked={filterType === 'unattempted'}
                  onChange={() => setFilterType('unattempted')}
                  className="w-3.5 h-3.5 text-amber-600 focus:ring-amber-500 cursor-pointer"
                />
                <span>Unattempted ({unattemptedCount})</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* 3. QUESTIONS & SOLUTIONS LIST */}
      <div className="space-y-5 pt-2">
        {filteredSolutions.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center text-slate-500">
            <p className="text-sm font-bold">No questions found for the selected filter: <span className="uppercase text-blue-600">{filterType}</span></p>
            <button
              type="button"
              onClick={() => setFilterType('all')}
              className="mt-3 px-4 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
            >
              Reset to All Questions
            </button>
          </div>
        ) : (
          filteredSolutions.map((item, idx) => {
            const isCorrect = !!item.is_correct || item.selected_option === item.correct_option;
            const userSelected = item.selected_option;
            const correctOpt = item.correct_option || 'A';

            return (
              <div
                key={item.id || idx}
                className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-2xs space-y-4"
              >
                {/* Question Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-brand-700 bg-brand-50 px-2.5 py-1 rounded-lg border border-brand-200">
                      Question {idx + 1}
                    </span>
                    {item.difficulty && (
                      <Badge variant={item.difficulty} size="sm">
                        {item.difficulty.toUpperCase()}
                      </Badge>
                    )}
                    {item.subject_name && (
                      <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                        {item.subject_name}
                      </span>
                    )}
                  </div>

                  <div>
                    <Badge variant={isCorrect ? 'success' : userSelected ? 'danger' : 'default'} size="sm">
                      {isCorrect ? 'CORRECT (+1.0)' : userSelected ? 'INCORRECT' : 'NOT ANSWERED (0.0)'}
                    </Badge>
                  </div>
                </div>

                {/* Question Text */}
                <h3 className="text-base font-bold text-slate-900 leading-relaxed">
                  {item.question_text || item.q || item.question || item.title || 'Question Statement'}
                </h3>

                {/* 4 MCQ Options */}
                <div className="space-y-2.5">
                  {['A', 'B', 'C', 'D'].map((opt, optIdx) => {
                    const optLower = (opt || '').toString().toLowerCase();
                    const text = item
                      ? item[`option_${optLower}`] ||
                        item[optLower] ||
                        (Array.isArray(item.options) ? item.options[optIdx] : '') ||
                        (item.options && item.options[opt]) ||
                        `Option ${opt}`
                      : `Option ${opt}`;
                    const isUserPick = userSelected === opt;
                    const isThisCorrect = correctOpt === opt;

                    let cardStyle = 'border-slate-200 bg-white text-slate-800';
                    if (isThisCorrect) {
                      cardStyle = 'border-emerald-500 bg-emerald-50/80 text-emerald-950 font-bold ring-2 ring-emerald-500/20';
                    } else if (isUserPick && !isThisCorrect) {
                      cardStyle = 'border-rose-400 bg-rose-50/70 text-rose-950 font-bold';
                    }

                    return (
                      <div
                        key={opt}
                        className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 text-xs transition-all ${cardStyle}`}
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={`w-6 h-6 rounded-lg font-bold flex items-center justify-center text-xs shrink-0 ${
                              isThisCorrect
                                ? 'bg-emerald-600 text-white'
                                : isUserPick
                                ? 'bg-rose-600 text-white'
                                : 'bg-slate-100 text-slate-600 border border-slate-200'
                            }`}
                          >
                            {opt}
                          </span>
                          <span className="font-medium text-slate-900">{text}</span>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {isThisCorrect && (
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/90 px-2 py-0.5 rounded-md flex items-center gap-1 border border-emerald-200">
                              <Check className="w-3 h-3" /> Correct Answer
                            </span>
                          )}
                          {isUserPick && !isThisCorrect && (
                            <span className="text-[10px] font-bold text-rose-700 bg-rose-100/90 px-2 py-0.5 rounded-md border border-rose-200">
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
                  <div className="p-4 bg-amber-50/80 border border-amber-200 rounded-2xl text-xs space-y-1 mt-2">
                    <span className="font-bold text-amber-900 block uppercase tracking-wider text-[10px]">
                      Step-by-Step Mathematical &amp; Conceptual Solution:
                    </span>
                    <p className="text-slate-800 leading-relaxed font-medium">
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
