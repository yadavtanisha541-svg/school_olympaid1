import React, { useState, useEffect } from 'react';
import { OLYMPIAD_CATEGORIES } from '../../data/olympiadHubData';
import {
  Sparkles,
  Clock,
  CheckCircle,
  HelpCircle,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Award,
  BookOpen,
  Target,
  BarChart2,
  Bookmark
} from 'lucide-react';

const PRACTICE_QUESTIONS_POOL = [
  {
    id: 1,
    subject: 'math',
    question: 'If 3x + 7 = 28, what is the value of 5x - 4?',
    options: ['31', '35', '29', '42'],
    correct: 0,
    explanation: '3x = 28 - 7 = 21 => x = 7. Then 5(7) - 4 = 35 - 4 = 31.'
  },
  {
    id: 2,
    subject: 'math',
    question: 'A circle has a radius of 14 cm. What is its approximate circumference? (Take π = 22/7)',
    options: ['44 cm', '88 cm', '154 cm', '616 cm'],
    correct: 1,
    explanation: 'Circumference = 2 * π * r = 2 * (22/7) * 14 = 88 cm.'
  },
  {
    id: 3,
    subject: 'science',
    question: 'Which component of blood is primarily responsible for immune defense against pathogens?',
    options: ['Red Blood Cells (Erythrocytes)', 'Platelets (Thrombocytes)', 'White Blood Cells (Leukocytes)', 'Plasma'],
    correct: 2,
    explanation: 'White blood cells (leukocytes) synthesize antibodies and neutralize foreign infectious pathogens.'
  },
  {
    id: 4,
    subject: 'english',
    question: 'Choose the sentence with the correct subjunctive mood usage:',
    options: [
      'If he was here, he would agree.',
      'If he were here, he would agree.',
      'If he is here, he would agree.',
      'If he will be here, he would agree.'
    ],
    correct: 1,
    explanation: 'In hypothetical conditional clauses, "were" is the correct subjunctive form regardless of subject number.'
  },
  {
    id: 5,
    subject: 'reasoning',
    question: 'Find the next number in the series: 3, 7, 15, 31, 63, ?',
    options: ['125', '127', '129', '131'],
    correct: 1,
    explanation: 'Each term is multiplied by 2 and increased by 1: 63 * 2 + 1 = 127.'
  }
];

export const PreparationHubPage = ({ onNavigatePublic, onOpenRegister }) => {
  const [selectedSubject, setSelectedSubject] = useState('math');
  const [activeMode, setActiveMode] = useState('landing'); // 'landing' | 'testing' | 'result'
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [markedForReview, setMarkedForReview] = useState({});
  const [secondsRemaining, setSecondsRemaining] = useState(300); // 5 mins for mini test

  // Timer effect
  useEffect(() => {
    let timer;
    if (activeMode === 'testing' && secondsRemaining > 0) {
      timer = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setActiveMode('result');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [activeMode, secondsRemaining]);

  const handleStartPractice = () => {
    setSelectedAnswers({});
    setMarkedForReview({});
    setCurrentQIndex(0);
    setSecondsRemaining(300);
    setActiveMode('testing');
  };

  const handleSelectOption = (optIdx) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQIndex]: optIdx
    }));
  };

  const handleToggleReview = () => {
    setMarkedForReview((prev) => ({
      ...prev,
      [currentQIndex]: !prev[currentQIndex]
    }));
  };

  const handleClearAnswer = () => {
    setSelectedAnswers((prev) => {
      const copy = { ...prev };
      delete copy[currentQIndex];
      return copy;
    });
  };

  const calculateScore = () => {
    let correct = 0;
    let incorrect = 0;
    PRACTICE_QUESTIONS_POOL.forEach((q, idx) => {
      if (selectedAnswers[idx] !== undefined) {
        if (selectedAnswers[idx] === q.correct) {
          correct++;
        } else {
          incorrect++;
        }
      }
    });
    const attempted = Object.keys(selectedAnswers).length;
    const skipped = PRACTICE_QUESTIONS_POOL.length - attempted;
    const score = correct * 4 - incorrect * 1;
    return { correct, incorrect, skipped, attempted, score };
  };

  const formatTimer = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="bg-[#fff9f2] min-h-screen pb-20">
      {/* 1. LANDING MODE */}
      {activeMode === 'landing' && (
        <>
          <div className="bg-gradient-to-br from-[#4e2a4a] via-[#6d3a68] to-[#8c4e8b] text-white py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            <div className="max-w-7xl mx-auto relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#e7b84b]/20 border border-[#e7b84b]/40 text-[#e7b84b] text-xs font-bold uppercase tracking-wider mb-4">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Interactive Practice Engine</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
                Online Practice Hub &amp; Mock Testing Simulator
              </h1>
              <p className="text-sm sm:text-base text-[#deb8de] mt-3 max-w-3xl leading-relaxed">
                Experience real Olympiad exam conditions. Practice timed questions, navigate sections, check step-by-step solutions, and benchmark your speed.
              </p>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
            {/* Quick Feature Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-2xl p-6 border border-[#edd6ed] shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-[#faf5fa] flex items-center justify-center text-[#6d3a68] mb-3">
                  <Clock className="w-5 h-5 text-[#d9775b]" />
                </div>
                <h3 className="text-sm font-black text-[#4e2a4a]">Timed Mock Tests</h3>
                <p className="text-xs text-slate-500 mt-1">Live countdown timer with auto-submit and pacing analytics.</p>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-[#edd6ed] shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-[#faf5fa] flex items-center justify-center text-[#6d3a68] mb-3">
                  <Target className="w-5 h-5 text-[#e7b84b]" />
                </div>
                <h3 className="text-sm font-black text-[#4e2a4a]">HOTS &amp; Achievers Drills</h3>
                <p className="text-xs text-slate-500 mt-1">Special higher-order analytical questions designed to build ranker mastery.</p>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-[#edd6ed] shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-[#faf5fa] flex items-center justify-center text-[#6d3a68] mb-3">
                  <BarChart2 className="w-5 h-5 text-[#6d3a68]" />
                </div>
                <h3 className="text-sm font-black text-[#4e2a4a]">Instant Performance Audit</h3>
                <p className="text-xs text-slate-500 mt-1">Detailed accuracy reports, concept diagnostics, and percentile comparisons.</p>
              </div>
            </div>

            {/* Launch Practice Simulator Card */}
            <div className="bg-white rounded-3xl p-8 sm:p-10 border border-[#edd6ed] shadow-lg mt-8 text-center max-w-3xl mx-auto">
              <div className="w-16 h-16 rounded-3xl bg-[#f4ebf4] flex items-center justify-center mx-auto text-[#6d3a68] mb-4">
                <Sparkles className="w-8 h-8 text-[#d9775b]" />
              </div>
              <h2 className="text-2xl font-black text-[#4e2a4a]">
                Take a Free Mini Olympiad Mock Exam
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-xl mx-auto leading-relaxed">
                Test your skills with 5 multi-disciplinary sample questions under simulated proctored exam conditions.
              </p>

              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <button
                  onClick={handleStartPractice}
                  className="px-8 py-3.5 bg-gradient-to-r from-[#d9775b] to-[#c85e42] hover:from-[#c85e42] hover:to-[#a74a32] text-white rounded-xl text-xs font-black shadow-lg shadow-[#d9775b]/30 cursor-pointer transition-all active:scale-95"
                >
                  Start Practice Test (5 Mins) →
                </button>
                <button
                  onClick={onOpenRegister}
                  className="px-6 py-3.5 bg-[#faf5fa] hover:bg-[#f4ebf4] text-[#6d3a68] border border-[#edd6ed] rounded-xl text-xs font-bold cursor-pointer transition-all"
                >
                  Register for Full Olympiads
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* 2. LIVE TESTING MODE */}
      {activeMode === 'testing' && (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-8">
          {/* Top Bar with Timer & Actions */}
          <div className="bg-white rounded-2xl p-4 border border-[#edd6ed] shadow-md flex items-center justify-between gap-4 mb-6">
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">SkillRise Practice Exam</span>
              <h3 className="text-sm font-black text-[#4e2a4a]">Question {currentQIndex + 1} of {PRACTICE_QUESTIONS_POOL.length}</h3>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#faf4e0] border border-[#e7b84b]/40 text-[#6d3a68] font-black text-xs">
                <Clock className="w-4 h-4 text-[#d9775b]" />
                <span>Time Left: {formatTimer(secondsRemaining)}</span>
              </div>
              <button
                onClick={() => setActiveMode('result')}
                className="px-4 py-2 bg-[#6d3a68] hover:bg-[#5c3158] text-white text-xs font-black rounded-xl shadow-sm cursor-pointer"
              >
                Submit Test
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Question Workspace */}
            <div className="lg:col-span-3 space-y-6">
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#edd6ed] shadow-sm space-y-6">
                <div className="text-base sm:text-lg font-black text-[#4e2a4a] leading-relaxed">
                  {PRACTICE_QUESTIONS_POOL[currentQIndex].question}
                </div>

                {/* Options List */}
                <div className="space-y-3">
                  {PRACTICE_QUESTIONS_POOL[currentQIndex].options.map((opt, oIdx) => {
                    const isSelected = selectedAnswers[currentQIndex] === oIdx;
                    return (
                      <button
                        key={oIdx}
                        onClick={() => handleSelectOption(oIdx)}
                        className={`w-full text-left p-4 rounded-2xl border text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-3.5 ${
                          isSelected
                            ? 'bg-[#f4ebf4] border-[#6d3a68] text-[#6d3a68] shadow-sm font-bold'
                            : 'bg-[#faf5fa] border-[#edd6ed] text-slate-700 hover:bg-[#f4ebf4]'
                        }`}
                      >
                        <span
                          className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black shrink-0 ${
                            isSelected ? 'bg-[#6d3a68] text-white' : 'bg-white border border-[#edd6ed] text-slate-500'
                          }`}
                        >
                          {String.fromCharCode(65 + oIdx)}
                        </span>
                        <span>{opt}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Question Actions */}
                <div className="pt-4 border-t border-[#f4ebf4] flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex gap-2">
                    <button
                      onClick={handleToggleReview}
                      className={`px-3 py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer flex items-center gap-1.5 ${
                        markedForReview[currentQIndex]
                          ? 'bg-[#FAF4E0] border-[#e7b84b] text-[#8c4e8b]'
                          : 'bg-[#faf5fa] border-[#edd6ed] text-slate-600 hover:bg-[#f4ebf4]'
                      }`}
                    >
                      <Bookmark className="w-3.5 h-3.5 text-[#e7b84b]" />
                      <span>{markedForReview[currentQIndex] ? 'Marked for Review' : 'Mark for Review'}</span>
                    </button>
                    {selectedAnswers[currentQIndex] !== undefined && (
                      <button
                        onClick={handleClearAnswer}
                        className="px-3 py-2 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-800 cursor-pointer"
                      >
                        Clear Answer
                      </button>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button
                      disabled={currentQIndex === 0}
                      onClick={() => setCurrentQIndex((prev) => prev - 1)}
                      className="px-4 py-2 bg-[#faf5fa] disabled:opacity-40 text-[#6d3a68] border border-[#edd6ed] rounded-xl text-xs font-bold cursor-pointer flex items-center gap-1"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Previous</span>
                    </button>
                    {currentQIndex < PRACTICE_QUESTIONS_POOL.length - 1 ? (
                      <button
                        onClick={() => setCurrentQIndex((prev) => prev + 1)}
                        className="px-4 py-2 bg-[#6d3a68] text-white rounded-xl text-xs font-bold cursor-pointer flex items-center gap-1 hover:bg-[#5c3158]"
                      >
                        <span>Next</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <button
                        onClick={() => setActiveMode('result')}
                        className="px-5 py-2 bg-[#d9775b] text-white rounded-xl text-xs font-black cursor-pointer hover:bg-[#c85e42]"
                      >
                        Submit Test
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Question Navigator Grid */}
            <div className="space-y-4">
              <div className="bg-white rounded-2xl p-5 border border-[#edd6ed] shadow-sm">
                <h4 className="text-xs font-black text-[#4e2a4a] uppercase tracking-wider mb-4">Question Navigator</h4>
                <div className="grid grid-cols-5 gap-2">
                  {PRACTICE_QUESTIONS_POOL.map((_, idx) => {
                    const isAnswered = selectedAnswers[idx] !== undefined;
                    const isReview = markedForReview[idx];
                    const isCurrent = currentQIndex === idx;

                    let bgClass = 'bg-[#faf5fa] text-slate-600 border-[#edd6ed]';
                    if (isAnswered) bgClass = 'bg-[#6d3a68] text-white border-[#6d3a68]';
                    if (isReview) bgClass = 'bg-[#e7b84b] text-[#321630] border-[#e7b84b] font-black';

                    return (
                      <button
                        key={idx}
                        onClick={() => setCurrentQIndex(idx)}
                        className={`h-9 rounded-xl border text-xs font-bold flex items-center justify-center cursor-pointer transition-all ${bgClass} ${
                          isCurrent ? 'ring-2 ring-[#d9775b] ring-offset-2' : ''
                        }`}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>

                <div className="mt-5 pt-4 border-t border-[#f4ebf4] space-y-2 text-[11px] text-slate-500">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-md bg-[#6d3a68]" />
                    <span>Answered</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-md bg-[#e7b84b]" />
                    <span>Marked for Review</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-md bg-[#faf5fa] border border-[#edd6ed]" />
                    <span>Unanswered</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. RESULT & SOLUTIONS MODE */}
      {activeMode === 'result' && (() => {
        const stats = calculateScore();
        return (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-8 space-y-8">
            <div className="bg-white rounded-3xl p-8 sm:p-10 border border-[#edd6ed] shadow-lg text-center space-y-6">
              <div className="w-16 h-16 rounded-3xl bg-[#faf4e0] flex items-center justify-center mx-auto text-[#e7b84b]">
                <Award className="w-8 h-8 text-[#d9775b]" />
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-[#4e2a4a]">Practice Test Completed!</h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Here is your diagnostic summary and step-by-step answer key.
                </p>
              </div>

              {/* Scorecard grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto text-left">
                <div className="bg-[#faf5fa] p-4 rounded-2xl border border-[#edd6ed]">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Total Score</span>
                  <p className="text-xl font-black text-[#6d3a68]">{stats.score} / 20</p>
                </div>
                <div className="bg-[#faf5fa] p-4 rounded-2xl border border-[#edd6ed]">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Correct</span>
                  <p className="text-xl font-black text-[#d9775b]">{stats.correct}</p>
                </div>
                <div className="bg-[#faf5fa] p-4 rounded-2xl border border-[#edd6ed]">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Incorrect</span>
                  <p className="text-xl font-black text-rose-500">{stats.incorrect}</p>
                </div>
                <div className="bg-[#faf5fa] p-4 rounded-2xl border border-[#edd6ed]">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Skipped</span>
                  <p className="text-xl font-black text-slate-500">{stats.skipped}</p>
                </div>
              </div>

              <div className="flex justify-center gap-3">
                <button
                  onClick={handleStartPractice}
                  className="px-6 py-3 bg-[#faf5fa] hover:bg-[#f4ebf4] text-[#6d3a68] border border-[#edd6ed] rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Retake Test</span>
                </button>
                <button
                  onClick={onOpenRegister}
                  className="px-6 py-3 bg-gradient-to-r from-[#d9775b] to-[#c85e42] text-white rounded-xl text-xs font-black shadow-md cursor-pointer"
                >
                  Enroll for Official Olympiad →
                </button>
              </div>
            </div>

            {/* Detailed Explanations */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#edd6ed] shadow-sm space-y-6">
              <h3 className="text-base font-black text-[#4e2a4a]">Question-by-Question Solution Breakdown</h3>
              <div className="space-y-4">
                {PRACTICE_QUESTIONS_POOL.map((q, idx) => {
                  const userAns = selectedAnswers[idx];
                  const isCorrect = userAns === q.correct;
                  return (
                    <div key={idx} className="p-5 rounded-2xl bg-[#faf5fa] border border-[#edd6ed] space-y-2">
                      <div className="flex items-start justify-between gap-4">
                        <span className="text-xs font-black text-[#4e2a4a]">
                          Q{idx + 1}. {q.question}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                            userAns === undefined
                              ? 'bg-slate-200 text-slate-600'
                              : isCorrect
                              ? 'bg-[#e7b84b]/20 text-[#6d3a68]'
                              : 'bg-rose-100 text-rose-700'
                          }`}
                        >
                          {userAns === undefined ? 'Skipped' : isCorrect ? 'Correct (+4)' : 'Incorrect (-1)'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600">
                        <strong className="text-[#6d3a68]">Correct Answer:</strong> {q.options[q.correct]}
                      </p>
                      <p className="text-xs text-slate-500 pt-1 border-t border-[#edd6ed]/60">
                        <strong>Explanation:</strong> {q.explanation}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};
