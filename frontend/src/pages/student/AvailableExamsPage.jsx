import React, { useState, useEffect } from 'react';
import { apiClient } from '../../api/client';
import {
  BookOpen,
  Clock,
  Award,
  Shield,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Lock,
  ArrowLeft,
  CheckCircle,
  HelpCircle,
  FileText,
  Sparkles,
  User
} from 'lucide-react';
import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge';

export const AvailableExamsPage = ({ onStartExam }) => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(''); // '' (All) | 'free_trial' | 'practice' | 'mock' | 'paid'

  // Full-Screen Instructions Page State (No modals!)
  const [selectedExamForInstructions, setSelectedExamForInstructions] = useState(null);
  const [hasAgreedToRules, setHasAgreedToRules] = useState(true);

  const fetchExams = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/exams', { exam_type: activeTab });
      if (res.success) setExams(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExams();
  }, [activeTab]);

  const handleLaunchClick = (exam) => {
    setSelectedExamForInstructions(exam);
    setHasAgreedToRules(true);
  };

  const handleStartExamNow = () => {
    if (!hasAgreedToRules) {
      alert('Please agree to the examination instructions to proceed.');
      return;
    }
    const examId = selectedExamForInstructions.id;
    setSelectedExamForInstructions(null);
    onStartExam(examId);
  };

  // =========================================================================
  // VIEW MODE: DEDICATED FULL-SCREEN PRE-EXAM INSTRUCTIONS & LAUNCH HALL
  // =========================================================================
  if (selectedExamForInstructions) {
    const exam = selectedExamForInstructions;
    const hasActiveAttempt = !!exam.active_attempt_id;

    return (
      <div className="space-y-6 pb-16 font-sans max-w-4xl mx-auto animate-in fade-in duration-200">
        {/* Top Navigation */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setSelectedExamForInstructions(null)}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-indigo-600 px-3.5 py-2 rounded-xl bg-white border border-slate-200/80 shadow-2xs hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>← Back to Available Olympiads</span>
          </button>
          <span className="text-xs font-bold text-slate-400">Pre-Examination Verification</span>
        </div>

        {/* 1. Exam Hero Overview Card */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 pb-6 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2.5 mb-2">
                <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100 uppercase tracking-wider">
                  {exam.exam_type?.replace('_', ' ')}
                </span>
                <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-md">
                  {exam.exam_code}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {exam.title}
              </h1>
              {exam.author_name && !['Super Admin', 'Super Administrator'].includes(exam.author_name) && (
                <div className="flex items-center gap-1.5 mt-1.5 text-xs font-bold text-[#6d3a68] bg-[#f4ebf4] px-2.5 py-1 rounded-xl border border-[#edd6ed] w-fit shadow-2xs">
                  <User className="w-3.5 h-3.5 text-[#6d3a68] shrink-0" />
                  <span>Faculty: {exam.author_name}</span>
                </div>
              )}
              <p className="text-xs text-slate-500 mt-2">
                {exam.description || 'National online competitive examination standard with automated grading.'}
              </p>
            </div>

            <div className="shrink-0 text-left sm:text-right">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Live Olympiad Ready
              </span>
            </div>
          </div>

          {/* 4 Metric Highlights Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 pt-6 text-center text-xs">
            <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">Duration</span>
              <h4 className="text-lg font-black text-slate-900 mt-1">{exam.duration_minutes} Minutes</h4>
              <p className="text-[10px] text-slate-400 mt-0.5">Automated timer</p>
            </div>

            <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">Questions</span>
              <h4 className="text-lg font-black text-indigo-600 mt-1">{exam.total_questions || 1} MCQs</h4>
              <p className="text-[10px] text-slate-400 mt-0.5">Single correct</p>
            </div>

            <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">Total Marks</span>
              <h4 className="text-lg font-black text-slate-900 mt-1">{parseFloat(exam.total_marks || 1).toFixed(1)}</h4>
              <p className="text-[10px] text-slate-400 mt-0.5">Max Score</p>
            </div>

            <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">Pass Benchmark</span>
              <h4 className="text-lg font-black text-emerald-600 mt-1">{parseFloat(exam.passing_percentage || 40)}%</h4>
              <p className="text-[10px] text-slate-400 mt-0.5">Minimum to qualify</p>
            </div>
          </div>
        </div>

        {/* 2. Important Guidelines & Examination Rules Card */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-xs">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Important Examination Rules &amp; Proctoring</h3>
              <p className="text-[11px] text-slate-400">Please read carefully before initiating the live assessment</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200/70 space-y-1">
              <p className="font-bold text-amber-900 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                Live Automated Timer
              </p>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                The timer will begin as soon as you click <b>Start Examination Now</b>. The exam will automatically auto-submit when the countdown reaches 00:00.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-indigo-50/60 border border-indigo-200/70 space-y-1">
              <p className="font-bold text-indigo-900 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-indigo-600" />
                Tab Switching &amp; Anti-Cheat
              </p>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Navigating away from the exam tab or opening other applications will log a security infraction. Exceeding <b>{exam.tab_switch_limit || 3} warnings</b> may invalidate the attempt.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200/70 space-y-1">
              <p className="font-bold text-emerald-900 flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                Real-Time Auto-Save
              </p>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Every answer choice you select is instantly synchronized and saved to the server. If your connection briefly drops, your progress remains safe.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-purple-50/60 border border-purple-200/70 space-y-1">
              <p className="font-bold text-purple-900 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-purple-600" />
                Certificate &amp; Rankings
              </p>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Upon submission, your scorecard and national leaderboard ranking will be generated instantly. Qualifying students can download verified merit certificates.
              </p>
            </div>
          </div>

          {exam.instructions && (
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
              <p className="font-bold text-slate-800 mb-1">Specific Candidate Instructions:</p>
              <p className="text-slate-600 whitespace-pre-line leading-relaxed">{exam.instructions}</p>
            </div>
          )}
        </div>

        {/* 3. Candidate Readiness Confirmation & Start Button */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <label className="flex items-start sm:items-center gap-3 cursor-pointer text-xs font-semibold text-slate-800">
            <input
              type="checkbox"
              checked={hasAgreedToRules}
              onChange={(e) => setHasAgreedToRules(e.target.checked)}
              className="mt-0.5 sm:mt-0 rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
            />
            <span>
              I have read and understood all examination rules and am ready to start my attempt.
            </span>
          </label>

          <div className="flex items-center gap-2.5 shrink-0 self-end sm:self-center">
            <Button
              variant="secondary"
              size="md"
              onClick={() => setSelectedExamForInstructions(null)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="md"
              icon={hasActiveAttempt ? RotateCcw : Play}
              onClick={handleStartExamNow}
              className="font-bold shadow-md shadow-indigo-500/20"
            >
              {hasActiveAttempt ? 'Resume Examination' : 'Start Examination Now'}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW MODE: MAIN AVAILABLE EXAMS GRID
  // =========================================================================
  return (
    <div className="space-y-6 font-sans">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-slate-900">
          Available Olympiads &amp; Examinations
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Select an Olympiad challenge to test your academic mastery. Live proctoring and timers will begin upon test initiation.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 bg-white p-2 rounded-2xl border border-slate-200/80 shadow-xs max-w-xl">
        {[
          { id: '', label: 'All Exams' },
          { id: 'mock', label: 'Mock Olympiads' },
          { id: 'practice', label: 'Practice Tests' },
          { id: 'free_trial', label: 'Free Trial' }
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all text-center cursor-pointer ${
                isActive ? 'bg-indigo-600 text-white shadow-2xs' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Exams Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          [1, 2, 3].map((i) => <div key={i} className="h-56 bg-slate-200 rounded-3xl animate-pulse" />)
        ) : exams.length === 0 ? (
          <div className="col-span-full bg-white rounded-3xl border border-slate-200 p-12 text-center text-slate-400 text-xs">
            <BookOpen className="w-12 h-12 mx-auto mb-2 text-slate-300" />
            <p className="text-sm font-semibold text-slate-600">No examinations available in this category</p>
            <p className="mt-1">Check back later or switch category filters above.</p>
          </div>
        ) : (
          exams.map((exam) => {
            const hasActiveAttempt = !!exam.active_attempt_id;
            const attemptCount = parseInt(exam.user_attempt_count || 0);
            const limit = parseInt(exam.attempt_limit || 1);
            const isLimitReached = attemptCount >= limit && !hasActiveAttempt;

            return (
              <div
                key={exam.id}
                className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3 gap-2 flex-wrap">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100 uppercase tracking-wider">
                        {exam.exam_type?.replace('_', ' ')}
                      </span>
                      {exam.class_name && (
                        <span className="text-[10px] font-bold text-[#065f46] bg-[#ecfdf5] px-2 py-0.5 rounded-full border border-[#a7f3d0]">
                          {exam.class_name}
                        </span>
                      )}
                    </div>
                    <span className="text-xs font-mono font-bold text-slate-400">
                      {exam.exam_code}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 leading-snug">
                    {exam.title}
                  </h3>

                  {/* Teacher Name */}
                  {exam.author_name && !['Super Admin', 'Super Administrator'].includes(exam.author_name) && (
                    <div className="flex items-center gap-1.5 mt-2 text-[11px] font-bold text-[#6d3a68] bg-[#f4ebf4] px-2.5 py-1 rounded-xl border border-[#edd6ed] w-fit shadow-2xs">
                      <User className="w-3.5 h-3.5 text-[#6d3a68] shrink-0" />
                      <span>Faculty: {exam.author_name}</span>
                    </div>
                  )}

                  <p className="text-xs text-slate-500 mt-2 line-clamp-2">
                    {exam.description || 'Comprehensive national examination curriculum standard.'}
                  </p>

                  {/* Highlights Grid */}
                  <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-slate-100 text-center text-xs">
                    <div className="p-2.5 bg-slate-50 rounded-2xl border border-slate-100">
                      <span className="text-[10px] font-bold text-slate-400 block uppercase">Questions</span>
                      <span className="font-bold text-slate-800">{exam.total_questions || 1}</span>
                    </div>
                    <div className="p-2.5 bg-slate-50 rounded-2xl border border-slate-100">
                      <span className="text-[10px] font-bold text-slate-400 block uppercase">Duration</span>
                      <span className="font-bold text-slate-800">{exam.duration_minutes}m</span>
                    </div>
                    <div className="p-2.5 bg-slate-50 rounded-2xl border border-slate-100">
                      <span className="text-[10px] font-bold text-slate-400 block uppercase">Marks</span>
                      <span className="font-bold text-indigo-600">{parseFloat(exam.total_marks || 1).toFixed(1)}</span>
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="flex flex-wrap items-center gap-2 mt-4 text-[11px]">
                    {exam.negative_marking ? (
                      <span className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 font-semibold border border-rose-200">
                        Negative Marking
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">
                        No Negative Mark
                      </span>
                    )}

                    {exam.certificate_eligibility ? (
                      <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 font-semibold border border-amber-200 flex items-center gap-1">
                        <Award className="w-3 h-3 text-amber-600" />
                        Certificate Eligible
                      </span>
                    ) : null}
                  </div>
                </div>

                {/* Bottom Action */}
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-medium">
                    Attempts: {attemptCount} / {limit}
                  </span>

                  {hasActiveAttempt ? (
                    <Button
                      variant="warning"
                      size="sm"
                      icon={RotateCcw}
                      onClick={() => handleLaunchClick(exam)}
                      className="font-bold animate-pulse"
                    >
                      Resume Test
                    </Button>
                  ) : isLimitReached ? (
                    <Button variant="secondary" size="sm" disabled>
                      Attempt Limit Reached
                    </Button>
                  ) : (
                    <Button
                      variant="primary"
                      size="sm"
                      icon={Play}
                      onClick={() => handleLaunchClick(exam)}
                      className="font-bold shadow-md shadow-indigo-500/20"
                    >
                      Start Olympiad
                    </Button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
