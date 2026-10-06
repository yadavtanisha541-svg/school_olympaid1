import React, { useState, useEffect, useMemo } from 'react';
import { apiClient } from '../../api/client';
import {
  HelpCircle,
  Plus,
  Edit2,
  Trash2,
  Search,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Sparkles,
  BookOpen,
  Check,
  X,
  Layers,
  Gamepad2,
  Award,
  Clock
} from 'lucide-react';

const SUBJECT_OPTIONS = [
  { name: 'Mathematics (IMO)', code: 'IMO', color: '#eab308' },
  { name: 'Science (NSO)', code: 'NSO', color: '#16a34a' },
  { name: 'English (IEO)', code: 'IEO', color: '#ea580c' },
  { name: 'Cyber & AI (ICSO)', code: 'ICSO', color: '#0284c7' },
  { name: 'General Knowledge (IGKO)', code: 'IGKO', color: '#e7b84b' },
  { name: 'Reasoning (ISSO)', code: 'ISSO', color: '#7c3aed' }
];

const CLASS_OPTIONS = [
  'All',
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

export const SuperAdminFreeQuizzesManager = ({ onNavigateTab }) => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');

  // Filters
  const [selectedClass, setSelectedClass] = useState('All');
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' | 'edit'
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [saving, setSaving] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    class_name: 'All',
    subject: 'Mathematics (IMO)',
    subject_code: 'IMO',
    question_text: '',
    option_a: '',
    option_b: '',
    option_c: '',
    option_d: '',
    correct_option: 0, // 0=A, 1=B, 2=C, 3=D
    hint: '',
    explanation: '',
    difficulty: 'Foundation',
    status: 'active'
  });

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await apiClient.get('/free-quizzes', {
        class: selectedClass,
        subject: selectedSubject,
        search: searchQuery
      });
      if (res.success && Array.isArray(res.data)) {
        setQuizzes(res.data);
      } else {
        setQuizzes([]);
      }
    } catch (err) {
      console.error('Error loading free quizzes:', err);
      setError('Failed to load Free Quiz questions.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, [selectedClass, selectedSubject]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchQuizzes();
  };

  const handleOpenCreateModal = () => {
    setModalMode('create');
    setCurrentQuiz(null);
    setFormData({
      class_name: selectedClass !== 'All' ? selectedClass : 'All',
      subject: selectedSubject !== 'All' ? selectedSubject : 'Mathematics (IMO)',
      subject_code: selectedSubject !== 'All' ? (SUBJECT_OPTIONS.find(s => s.name === selectedSubject)?.code || 'IMO') : 'IMO',
      question_text: '',
      option_a: '',
      option_b: '',
      option_c: '',
      option_d: '',
      correct_option: 0,
      hint: '',
      explanation: '',
      difficulty: 'Foundation',
      status: 'active'
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (quiz) => {
    setModalMode('edit');
    setCurrentQuiz(quiz);
    setFormData({
      class_name: quiz.class_name || 'All',
      subject: quiz.subject || 'Mathematics (IMO)',
      subject_code: quiz.subject_code || 'IMO',
      question_text: quiz.question_text || '',
      option_a: quiz.option_a || (quiz.options?.[0] || ''),
      option_b: quiz.option_b || (quiz.options?.[1] || ''),
      option_c: quiz.option_c || (quiz.options?.[2] || ''),
      option_d: quiz.option_d || (quiz.options?.[3] || ''),
      correct_option: typeof quiz.correct_option === 'number' ? quiz.correct_option : 0,
      hint: quiz.hint || '',
      explanation: quiz.explanation || '',
      difficulty: quiz.difficulty || 'Foundation',
      status: quiz.status || 'active'
    });
    setIsModalOpen(true);
  };

  const handleSaveQuiz = async (e) => {
    e.preventDefault();
    if (!formData.question_text.trim()) {
      alert('Please enter question statement');
      return;
    }
    if (!formData.option_a.trim() || !formData.option_b.trim()) {
      alert('Please enter at least Option A and Option B');
      return;
    }

    try {
      setSaving(true);
      if (modalMode === 'create') {
        const res = await apiClient.post('/free-quizzes', formData);
        if (res.success) {
          setSuccessMsg('Quiz question created successfully!');
          setIsModalOpen(false);
          fetchQuizzes();
        }
      } else if (modalMode === 'edit' && currentQuiz?.id) {
        const res = await apiClient.request(`/free-quizzes/${currentQuiz.id}`, {
          method: 'PUT',
          body: JSON.stringify(formData)
        });
        if (res.success) {
          setSuccessMsg('Quiz question updated successfully!');
          setIsModalOpen(false);
          fetchQuizzes();
        }
      }
    } catch (err) {
      console.error('Error saving quiz question:', err);
      alert(err.message || 'Failed to save question');
    } finally {
      setSaving(false);
      setTimeout(() => setSuccessMsg(''), 4000);
    }
  };

  const handleDeleteQuiz = async (id) => {
    try {
      const res = await apiClient.request(`/free-quizzes/${id}`, {
        method: 'DELETE'
      });
      if (res.success) {
        setSuccessMsg('Quiz question deleted successfully!');
        fetchQuizzes();
      }
    } catch (err) {
      console.warn(err);
    } finally {
      setTimeout(() => setSuccessMsg(''), 4000);
    }
  };

  const handleResetDefaults = async () => {
    try {
      setLoading(true);
      const res = await apiClient.post('/free-quizzes/seed', {});
      if (res.success) {
        setSuccessMsg('Default Free Quizzes reset and seeded successfully!');
        fetchQuizzes();
      }
    } catch (err) {
      console.warn(err);
    } finally {
      setLoading(false);
      setTimeout(() => setSuccessMsg(''), 4000);
    }
  };

  // Stats
  const totalCount = quizzes.length;
  const activeCount = quizzes.filter(q => q.status === 'active').length;
  const distinctClasses = useMemo(() => new Set(quizzes.map(q => q.class_name)).size, [quizzes]);
  const distinctSubjects = useMemo(() => new Set(quizzes.map(q => q.subject)).size, [quizzes]);

  return (
    <div className="space-y-6 font-sans pb-16">
      {/* Top Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-1">
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="w-12 h-12 rounded-xl bg-[#80497D]/10 text-[#80497D] flex items-center justify-center font-bold border border-[#ebd7eb] shrink-0 shadow-2xs">
            <Gamepad2 className="w-6 h-6 text-[#80497D]" />
          </div>
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-[#422240] tracking-tight truncate">
              FREE Quizzes &amp; Daily Challenges Manager
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5 truncate">
              Create, edit, and organize 5-minute daily practice quizzes and fun riddles across all classes and Olympiad subjects.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0 flex-wrap">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="px-4 py-2.5 rounded-xl bg-white hover:bg-[#faf6fa] text-slate-700 font-bold text-sm flex items-center gap-1.5 transition-all cursor-pointer border border-[#ebd7eb] shadow-2xs"
            title="Reset Seed Defaults"
          >
            <RotateCcw className="w-4 h-4 text-[#80497D]" />
            <span>Reset Defaults</span>
          </button>
          <button
            type="button"
            onClick={handleOpenCreateModal}
            className="px-5 py-2.5 rounded-xl bg-[#80497D] hover:bg-[#6b3a69] text-white font-bold text-sm flex items-center gap-2 transition-all shadow-md shadow-[#80497D]/20 active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Quiz Question</span>
          </button>
        </div>
      </div>

      {/* Success Alert Banner */}
      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center justify-between shadow-xs animate-in fade-in">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
          <button onClick={() => setSuccessMsg('')} className="text-emerald-700 hover:text-emerald-900 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 4 Summary Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white rounded-2xl border border-[#edd6ed] shadow-xs space-y-1">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Quiz Questions</p>
          <p className="text-2xl font-black text-[#4e2a4a]">{totalCount}</p>
          <span className="text-[11px] text-emerald-600 font-semibold">In Live Bank</span>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-[#edd6ed] shadow-xs space-y-1">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Active &amp; Playable</p>
          <p className="text-2xl font-black text-emerald-600">{activeCount}</p>
          <span className="text-[11px] text-slate-500 font-medium">Available to Students</span>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-[#edd6ed] shadow-xs space-y-1">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Classes Configured</p>
          <p className="text-2xl font-black text-indigo-600">{distinctClasses} Classes</p>
          <span className="text-[11px] text-slate-500 font-medium">All Grades</span>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-[#edd6ed] shadow-xs space-y-1">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Olympiad Subjects</p>
          <p className="text-2xl font-black text-[#d9775b]">{distinctSubjects} Subjects</p>
          <span className="text-[11px] text-slate-500 font-medium">IMO, NSO, IEO, ICSO...</span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-3xl p-5 border border-[#edd6ed] shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-wrap w-full md:w-auto">
          {/* Class Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500">Class:</span>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-bold text-[#4e2a4a] bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#6d3a68] cursor-pointer"
            >
              {CLASS_OPTIONS.map((c) => (
                <option key={c} value={c}>{c === 'All' ? 'All Classes' : c}</option>
              ))}
            </select>
          </div>

          {/* Subject Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500">Subject:</span>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-bold text-[#4e2a4a] bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#6d3a68] cursor-pointer"
            >
              <option value="All">All Subjects</option>
              {SUBJECT_OPTIONS.map((s) => (
                <option key={s.code} value={s.name}>{s.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 w-full md:w-80">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search questions or options..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-[#6d3a68] bg-slate-50 focus:bg-white"
            />
          </div>
          <button
            type="submit"
            className="px-3.5 py-2 rounded-xl bg-[#6d3a68] hover:bg-[#5c3158] text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
          >
            Search
          </button>
        </form>
      </div>

      {/* Main Quizzes List */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#edd6ed] shadow-sm space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-[#f4ebf4]">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-[#80497D]" />
            <h3 className="text-base font-black text-[#4e2a4a]">
              FREE 5-Minute Quiz Questions Bank ({quizzes.length} Questions)
            </h3>
          </div>
          <span className="text-xs font-bold text-[#6d3a68] bg-[#faf5fa] px-3.5 py-1 rounded-full border border-[#edd6ed]">
            {selectedClass === 'All' ? 'All Classes' : `${selectedClass}`}
          </span>
        </div>

        {loading ? (
          <div className="py-12 text-center text-slate-400 space-y-2">
            <div className="w-8 h-8 border-4 border-[#6d3a68] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs font-semibold">Loading quiz questions...</p>
          </div>
        ) : quizzes.length === 0 ? (
          <div className="py-12 text-center text-slate-500 space-y-3">
            <div className="w-14 h-14 rounded-3xl bg-[#faf5fa] text-[#6d3a68] flex items-center justify-center mx-auto">
              <Gamepad2 className="w-7 h-7" />
            </div>
            <p className="text-sm font-bold text-slate-800">No quiz questions found</p>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Click &quot;Add Quiz Question&quot; to add interactive daily MCQs or &quot;Reset Seed Defaults&quot;.
            </p>
            <button
              type="button"
              onClick={handleOpenCreateModal}
              className="mt-2 px-4 py-2 bg-[#6d3a68] text-white rounded-xl text-xs font-bold hover:bg-[#5c3158] transition-colors cursor-pointer"
            >
              + Add First Question
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {quizzes.map((quiz, idx) => {
              const optA = quiz.option_a || (Array.isArray(quiz.options) ? quiz.options[0] : '') || '';
              const optB = quiz.option_b || (Array.isArray(quiz.options) ? quiz.options[1] : '') || '';
              const optC = quiz.option_c || (Array.isArray(quiz.options) ? quiz.options[2] : '') || '';
              const optD = quiz.option_d || (Array.isArray(quiz.options) ? quiz.options[3] : '') || '';
              const options = [optA, optB, optC, optD];
              const qStatement = quiz.question_text || quiz.q || quiz.title || 'Untitled Quiz Question';
              const correctIdx = typeof quiz.correct_option === 'number' ? quiz.correct_option : (typeof quiz.correct === 'number' ? quiz.correct : 0);

              return (
                <div
                  key={quiz.id || idx}
                  className="p-5 rounded-2xl bg-[#faf5fa] border border-[#edd6ed] space-y-3 hover:border-[#6d3a68]/40 transition-all shadow-2xs group"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-xs text-[#6d3a68]">
                        {quiz.subject || 'Olympiad'}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-white border border-[#edd6ed] text-[10px] font-bold text-slate-600">
                        {quiz.class_name || quiz.class || 'All'}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-amber-50 border border-amber-200 text-[10px] font-bold text-amber-800">
                        {quiz.difficulty || 'Foundation'}
                      </span>
                      {quiz.status === 'inactive' && (
                        <span className="px-2 py-0.5 rounded-md bg-slate-200 text-[10px] font-bold text-slate-600">
                          Draft
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-slate-400 font-semibold text-xs">
                        Question #{idx + 1}
                      </span>
                      <div className="flex items-center gap-1 opacity-90 group-hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          onClick={() => handleOpenEditModal(quiz)}
                          className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-[#6d3a68] hover:text-white hover:border-[#6d3a68] transition-colors cursor-pointer shadow-2xs"
                          title="Edit Question"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteQuiz(quiz.id)}
                          className="p-1.5 rounded-lg bg-white border border-slate-200 text-red-600 hover:bg-red-600 hover:text-white hover:border-red-600 transition-colors cursor-pointer shadow-2xs"
                          title="Delete Question"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Question Statement */}
                  <p className="text-sm font-bold text-[#321630] leading-relaxed">
                    {qStatement}
                  </p>

                  {/* 4 Options Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    {options.map((opt, optIdx) => {
                      const isCorrect = correctIdx === optIdx;
                      return (
                        <div
                          key={optIdx}
                          className={`p-2.5 rounded-xl border text-xs flex items-center justify-between transition-all ${
                            isCorrect
                              ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold shadow-2xs'
                              : 'bg-white border-slate-200 text-slate-700'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-black ${
                              isCorrect ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'
                            }`}>
                              {String.fromCharCode(65 + optIdx)}
                            </span>
                            <span>{opt || `Option ${String.fromCharCode(65 + optIdx)}`}</span>
                          </div>
                          {isCorrect && (
                            <span className="text-[10px] font-black text-emerald-700 uppercase">
                              ✓ Correct Answer
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Hint & Explanation */}
                  {(quiz.hint || quiz.explanation) && (
                    <div className="p-3 bg-[#fdf7f5] rounded-xl border border-[#f6d6cc] text-xs text-[#80497D] space-y-0.5">
                      {quiz.hint && (
                        <p className="text-[11px] font-medium">
                          💡 <strong>Hint:</strong> {quiz.hint}
                        </p>
                      )}
                      {quiz.explanation && (
                        <p className="text-[11px] font-normal text-slate-600">
                          📘 <strong>Explanation:</strong> {quiz.explanation}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* CREATE / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-2xl w-full border border-slate-200 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#f4ebf4] text-[#6d3a68] flex items-center justify-center">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    {modalMode === 'create' ? 'Add Free Quiz Question' : 'Edit Free Quiz Question'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Save to Free Quiz database &amp; make it playable in Student Portal
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveQuiz} className="space-y-4 text-xs">
              {/* Class & Subject */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Grade / Class *</label>
                  <select
                    value={formData.class_name}
                    onChange={(e) => setFormData({ ...formData, class_name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-[#6d3a68] bg-slate-50"
                  >
                    {CLASS_OPTIONS.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Olympiad Subject *</label>
                  <select
                    value={formData.subject}
                    onChange={(e) => {
                      const selected = SUBJECT_OPTIONS.find(s => s.name === e.target.value);
                      setFormData({
                        ...formData,
                        subject: e.target.value,
                        subject_code: selected?.code || 'IMO'
                      });
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-[#6d3a68] bg-slate-50"
                  >
                    {SUBJECT_OPTIONS.map(s => (
                      <option key={s.code} value={s.name}>{s.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Question Statement */}
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Question Statement *
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Which geometric shape has 3 sides?"
                  value={formData.question_text}
                  onChange={(e) => setFormData({ ...formData, question_text: e.target.value })}
                  required
                  className="w-full p-3 rounded-xl border border-slate-300 text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-[#6d3a68]"
                />
              </div>

              {/* 4 Options with Radio Correct Option Selector */}
              <div className="space-y-2.5">
                <label className="block text-slate-700 font-bold">
                  Options &amp; Correct Answer Selection *
                </label>
                
                {[
                  { key: 'option_a', label: 'A', idx: 0 },
                  { key: 'option_b', label: 'B', idx: 1 },
                  { key: 'option_c', label: 'C', idx: 2 },
                  { key: 'option_d', label: 'D', idx: 3 }
                ].map((opt) => (
                  <div key={opt.key} className="flex items-center gap-2">
                    <label className="flex items-center gap-1.5 cursor-pointer shrink-0">
                      <input
                        type="radio"
                        name="correct_option"
                        checked={formData.correct_option === opt.idx}
                        onChange={() => setFormData({ ...formData, correct_option: opt.idx })}
                        className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 accent-emerald-600 cursor-pointer"
                      />
                      <span className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-black ${
                        formData.correct_option === opt.idx ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'
                      }`}>
                        {opt.label}
                      </span>
                    </label>
                    <input
                      type="text"
                      placeholder={`Enter Option ${opt.label} text`}
                      value={formData[opt.key]}
                      onChange={(e) => setFormData({ ...formData, [opt.key]: e.target.value })}
                      required={opt.idx < 2}
                      className="flex-1 px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-[#6d3a68]"
                    />
                  </div>
                ))}
              </div>

              {/* Hint & Explanation */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Hint (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Think of 3 straight sides..."
                    value={formData.hint}
                    onChange={(e) => setFormData({ ...formData, hint: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-[#6d3a68]"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Explanation (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. A triangle has 3 sides and sum of angles is 180."
                    value={formData.explanation}
                    onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-[#6d3a68]"
                  />
                </div>
              </div>

              {/* Difficulty & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Difficulty</label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-[#6d3a68] bg-slate-50"
                  >
                    <option value="Foundation">Foundation</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-[#6d3a68] bg-slate-50"
                  >
                    <option value="active">Active (Playable)</option>
                    <option value="inactive">Inactive (Draft)</option>
                  </select>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 rounded-xl bg-[#6d3a68] hover:bg-[#5c3158] text-white font-black text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 cursor-pointer disabled:opacity-50"
                >
                  {saving ? 'Saving...' : modalMode === 'create' ? 'Save & Publish' : 'Update Question'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
