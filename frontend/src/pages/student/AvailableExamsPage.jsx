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
  Lock
} from 'lucide-react';
import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge';
import { Modal } from '../../components/Modal';

export const AvailableExamsPage = ({ onStartExam }) => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(''); // '' (All) | 'free_trial' | 'practice' | 'mock' | 'paid'
  const [selectedExam, setSelectedExam] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

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
    setSelectedExam(exam);
    setShowConfirmModal(true);
  };

  const handleConfirmLaunch = () => {
    setShowConfirmModal(false);
    onStartExam(selectedExam.id);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-slate-900">
          Available Olympiads & Examinations
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Select an Olympiad challenge to test your academic mastery. Live proctoring and timers will begin upon test initiation.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 bg-white p-2 rounded-2xl border border-slate-200/80 shadow-xs max-w-xl">
        {[
          { id: '', label: 'All Exams' },
          { id: 'free_trial', label: 'Free Trial' },
          { id: 'practice', label: 'Practice Tests' },
          { id: 'mock', label: 'Mock Olympiads' },
          { id: 'paid', label: 'Special Exams' }
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all text-center ${
                isActive ? 'bg-brand-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'
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
          [1, 2, 3].map(i => <div key={i} className="h-56 bg-slate-200 rounded-3xl animate-pulse" />)
        ) : exams.length === 0 ? (
          <div className="col-span-full bg-white rounded-3xl border border-slate-200 p-12 text-center text-slate-400">
            <BookOpen className="w-12 h-12 mx-auto mb-2 text-slate-300" />
            <p className="text-sm font-semibold text-slate-600">No examinations available in this category</p>
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
                className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs hover:shadow-card-hover transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant={exam.exam_type} size="sm">
                      {exam.exam_type.replace('_', ' ').toUpperCase()}
                    </Badge>
                    <span className="text-xs font-mono font-bold text-slate-400">
                      {exam.exam_code}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 leading-snug">
                    {exam.title}
                  </h3>

                  <p className="text-xs text-slate-500 mt-2 line-clamp-2">
                    {exam.description || 'Comprehensive national examination curriculum standard.'}
                  </p>

                  {/* Highlights Grid */}
                  <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-slate-100 text-center text-xs">
                    <div className="p-2.5 bg-slate-50 rounded-xl">
                      <span className="text-[10px] font-bold text-slate-400 block uppercase">Questions</span>
                      <span className="font-bold text-slate-800">{exam.total_questions}</span>
                    </div>
                    <div className="p-2.5 bg-slate-50 rounded-xl">
                      <span className="text-[10px] font-bold text-slate-400 block uppercase">Duration</span>
                      <span className="font-bold text-slate-800">{exam.duration_minutes}m</span>
                    </div>
                    <div className="p-2.5 bg-slate-50 rounded-xl">
                      <span className="text-[10px] font-bold text-slate-400 block uppercase">Total Marks</span>
                      <span className="font-bold text-brand-600">{parseFloat(exam.total_marks).toFixed(1)}</span>
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
                      className="font-bold shadow-md shadow-brand-500/20"
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

      {/* CONFIRM START EXAM MODAL */}
      <Modal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        title="Ready to Begin Examination?"
        subtitle={selectedExam?.title}
        maxWidth="max-w-lg"
        footer={
          <div className="flex items-center justify-end gap-3 w-full">
            <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>Cancel</Button>
            <Button variant="primary" icon={Play} onClick={handleConfirmLaunch}>
              Start Examination Now
            </Button>
          </div>
        }
      >
        <div className="space-y-4 text-xs">
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-amber-900 space-y-2">
            <h4 className="font-bold flex items-center gap-2 text-amber-800">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              Important Examination Guidelines:
            </h4>
            <ul className="list-disc list-inside space-y-1 text-slate-700">
              <li>Duration: <b>{selectedExam?.duration_minutes} minutes</b>. Live timer will start immediately.</li>
              <li>Questions: <b>{selectedExam?.total_questions} MCQs</b> with exactly 4 options.</li>
              <li>Switching browser tabs or applications will issue a <b>security warning</b>.</li>
              <li>Your answers are automatically saved with every selection.</li>
            </ul>
          </div>
        </div>
      </Modal>
    </div>
  );
};
