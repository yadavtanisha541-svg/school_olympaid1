import React, { useState, useEffect, useMemo } from 'react';
import { apiClient } from '../../api/client';
import {
  Bookmark,
  Plus,
  Edit2,
  Trash2,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Sparkles,
  BookOpen,
  HelpCircle,
  Check,
  X,
  Layers,
  ArrowRight,
  ShieldCheck
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

export const SuperAdminRevisionVaultManager = ({ onNavigateTab }) => {
  const [items, setItems] = useState([]);
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
  const [currentItem, setCurrentItem] = useState(null);
  const [saving, setSaving] = useState(false);

  // Form fields
  const [formData, setFormData] = useState({
    class_name: 'Class 6',
    subject: 'Mathematics (IMO)',
    subject_code: 'IMO',
    question_text: '',
    option_a: '',
    option_b: '',
    option_c: '',
    option_d: '',
    correct_option: 'A',
    correct_answer: '',
    explanation: '',
    tags: 'Tricky Question',
    difficulty: 'Intermediate',
    status: 'active'
  });

  const fetchItems = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await apiClient.get('/revision-vault', {
        class: selectedClass,
        subject: selectedSubject,
        search: searchQuery
      });
      if (res.success && Array.isArray(res.data)) {
        setItems(res.data);
      } else {
        setItems([]);
      }
    } catch (err) {
      console.error('Error fetching revision vault items:', err);
      setError('Failed to load Revision Vault items.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [selectedClass, selectedSubject]);

  // Search debounce / instant trigger
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchItems();
  };

  const handleOpenCreateModal = () => {
    setModalMode('create');
    setCurrentItem(null);
    setFormData({
      class_name: selectedClass !== 'All' ? selectedClass : 'Class 6',
      subject: selectedSubject !== 'All' ? selectedSubject : 'Mathematics (IMO)',
      subject_code: selectedSubject !== 'All' ? (SUBJECT_OPTIONS.find(s => s.name === selectedSubject)?.code || 'IMO') : 'IMO',
      question_text: '',
      option_a: '',
      option_b: '',
      option_c: '',
      option_d: '',
      correct_option: 'A',
      correct_answer: '',
      explanation: '',
      tags: 'Tricky Question',
      difficulty: 'Intermediate',
      status: 'active'
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item) => {
    setModalMode('edit');
    setCurrentItem(item);
    const opts = Array.isArray(item.options) ? item.options : [];
    setFormData({
      class_name: item.class_name || item.class || 'Class 6',
      subject: item.subject || 'Mathematics (IMO)',
      subject_code: item.subject_code || 'IMO',
      question_text: item.question_text || '',
      option_a: item.option_a || opts[0] || '',
      option_b: item.option_b || opts[1] || '',
      option_c: item.option_c || opts[2] || '',
      option_d: item.option_d || opts[3] || '',
      correct_option: item.correct_option || 'A',
      correct_answer: item.correct_answer || '',
      explanation: item.explanation || '',
      tags: item.tags || 'Tricky Question',
      difficulty: item.difficulty || 'Intermediate',
      status: item.status || 'active'
    });
    setIsModalOpen(true);
  };

  const handleSaveItem = async (e) => {
    e.preventDefault();
    if (!formData.question_text.trim()) {
      alert('Please enter question statement / text');
      return;
    }

    const optA = formData.option_a.trim() || 'Option A';
    const optB = formData.option_b.trim() || 'Option B';
    const optC = formData.option_c.trim() || 'Option C';
    const optD = formData.option_d.trim() || 'Option D';
    const optionsArray = [optA, optB, optC, optD];

    const corrOpt = (formData.correct_option || 'A').toUpperCase();
    const corrMap = { A: optA, B: optB, C: optC, D: optD };
    const computedAnswer = formData.correct_answer.trim() || `Option ${corrOpt}: ${corrMap[corrOpt] || ''}`;

    const payload = {
      ...formData,
      options: optionsArray,
      option_a: optA,
      option_b: optB,
      option_c: optC,
      option_d: optD,
      correct_option: corrOpt,
      correct_answer: computedAnswer
    };

    try {
      setSaving(true);
      if (modalMode === 'create') {
        const res = await apiClient.post('/revision-vault', payload);
        if (res.success) {
          setSuccessMsg('Revision question created and synced successfully!');
          setIsModalOpen(false);
          fetchItems();
          window.dispatchEvent(new CustomEvent('revision-vault-updated'));
        }
      } else if (modalMode === 'edit' && currentItem?.id) {
        const res = await apiClient.request(`/revision-vault/${currentItem.id}`, {
          method: 'PUT',
          body: JSON.stringify(payload)
        });
        if (res.success) {
          setSuccessMsg('Revision question updated and synced successfully!');
          setIsModalOpen(false);
          fetchItems();
          window.dispatchEvent(new CustomEvent('revision-vault-updated'));
        }
      }
    } catch (err) {
      console.error('Error saving revision item:', err);
      alert(err.message || 'Failed to save item');
    } finally {
      setSaving(false);
      setTimeout(() => setSuccessMsg(''), 4000);
    }
  };

  const handleDeleteItem = async (id) => {
    if (!window.confirm('Are you sure you want to delete this revision question?')) return;
    try {
      const res = await apiClient.request(`/revision-vault/${id}`, {
        method: 'DELETE'
      });
      if (res.success) {
        setSuccessMsg('Revision question deleted successfully!');
        fetchItems();
        window.dispatchEvent(new CustomEvent('revision-vault-updated'));
      }
    } catch (err) {
      console.error('Error deleting revision item:', err);
    } finally {
      setTimeout(() => setSuccessMsg(''), 4000);
    }
  };

  const handleResetDefaults = async () => {
    try {
      setLoading(true);
      const res = await apiClient.post('/revision-vault/seed', {});
      if (res.success) {
        setSuccessMsg('Default Revision Vault questions re-seeded successfully!');
        fetchItems();
        window.dispatchEvent(new CustomEvent('revision-vault-updated'));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setTimeout(() => setSuccessMsg(''), 4000);
    }
  };

  // Stats
  const totalCount = items.length;
  const activeCount = items.filter(i => i.status === 'active').length;
  const distinctClasses = useMemo(() => new Set(items.map(i => i.class_name)).size, [items]);
  const distinctSubjects = useMemo(() => new Set(items.map(i => i.subject)).size, [items]);

  return (
    <div className="space-y-6 font-sans pb-16">
      {/* Top Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-1">
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="w-12 h-12 rounded-xl bg-[#80497D]/10 text-[#80497D] flex items-center justify-center font-bold border border-[#ebd7eb] shrink-0 shadow-2xs">
            <Bookmark className="w-6 h-6 text-[#80497D]" />
          </div>
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-[#422240] tracking-tight truncate">
              Revision Vault &amp; Bookmarks Manager
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5 truncate">
              Add, edit, and curate tricky questions, 4 options, and step-by-step solutions that sync live with the Student Dashboard.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0 flex-wrap">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="px-4 py-2.5 rounded-xl bg-white hover:bg-[#faf6fa] text-slate-700 font-bold text-sm flex items-center gap-1.5 transition-all cursor-pointer border border-[#ebd7eb] shadow-2xs"
            title="Reset Default Questions"
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
            <span>Add Revision Question</span>
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
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Questions</p>
          <p className="text-2xl font-black text-[#4e2a4a]">{totalCount}</p>
          <span className="text-[11px] text-emerald-600 font-semibold">Active in Database</span>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-[#edd6ed] shadow-xs space-y-1">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Published</p>
          <p className="text-2xl font-black text-[#059669]">{activeCount}</p>
          <span className="text-[11px] text-slate-500 font-medium">Visible to Students</span>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-[#edd6ed] shadow-xs space-y-1">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Covered Classes</p>
          <p className="text-2xl font-black text-[#6d3a68]">{distinctClasses || 12}</p>
          <span className="text-[11px] text-slate-500 font-medium">Class 1 to 12</span>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-[#edd6ed] shadow-xs space-y-1">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Subjects</p>
          <p className="text-2xl font-black text-[#d9775b]">{distinctSubjects || 6}</p>
          <span className="text-[11px] text-slate-500 font-medium">IMO, NSO, IEO, ICSO, IGKO</span>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white rounded-2xl p-4 border border-[#edd6ed] shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full md:w-auto flex-wrap">
          {/* Class Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-600">Class:</span>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-800 bg-slate-50 focus:outline-hidden focus:ring-2 focus:ring-[#80497D]"
            >
              {CLASS_OPTIONS.map(c => (
                <option key={c} value={c}>{c === 'All' ? 'All Classes' : c}</option>
              ))}
            </select>
          </div>

          {/* Subject Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-600">Subject:</span>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-800 bg-slate-50 focus:outline-hidden focus:ring-2 focus:ring-[#80497D]"
            >
              <option value="All">All Subjects</option>
              {SUBJECT_OPTIONS.map(s => (
                <option key={s.code} value={s.name}>{s.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search questions or keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-16 py-1.5 rounded-xl border border-slate-300 text-xs focus:outline-hidden focus:ring-2 focus:ring-[#80497D] bg-slate-50"
          />
          <button
            type="submit"
            className="absolute right-1 top-1/2 -translate-y-1/2 px-2.5 py-1 bg-[#80497D] text-white rounded-lg text-[10px] font-bold hover:bg-[#6b3a69] transition-colors"
          >
            Search
          </button>
        </form>
      </div>

      {/* Main Revision Cards List */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#edd6ed] shadow-sm space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-[#f4ebf4]">
          <div className="flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-[#d9775b]" />
            <h3 className="text-base font-black text-[#4e2a4a]">
              Bookmarked Tricky Questions ({items.length} Saved)
            </h3>
          </div>
          <span className="text-xs font-bold text-[#6d3a68] bg-[#faf5fa] px-3.5 py-1 rounded-full border border-[#edd6ed]">
            {selectedClass === 'All' ? 'All Classes' : `${selectedClass} Revision`}
          </span>
        </div>

        {loading ? (
          <div className="py-12 text-center text-slate-400 space-y-2">
            <div className="w-8 h-8 border-4 border-[#6d3a68] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs font-semibold">Loading revision vault questions...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="py-12 text-center text-slate-500 space-y-3">
            <div className="w-14 h-14 rounded-3xl bg-[#faf5fa] text-[#6d3a68] flex items-center justify-center mx-auto">
              <BookOpen className="w-7 h-7" />
            </div>
            <p className="text-sm font-bold text-slate-800">No revision questions found</p>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Try changing the Class or Subject filter above, or click &quot;Add Revision Question&quot; to create one.
            </p>
            <button
              type="button"
              onClick={handleOpenCreateModal}
              className="mt-2 px-4 py-2 bg-[#6d3a68] text-white rounded-xl text-xs font-bold hover:bg-[#5c3158] transition-colors cursor-pointer"
            >
              + Add New Question
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item, idx) => {
              const opts = Array.isArray(item.options) && item.options.length >= 2
                ? item.options
                : [item.option_a || 'Option A', item.option_b || 'Option B', item.option_c || 'Option C', item.option_d || 'Option D'];
              const corrOpt = (item.correct_option || 'A').toUpperCase();

              return (
                <div
                  key={item.id}
                  className="p-5 rounded-2xl bg-[#faf5fa] border border-[#edd6ed] space-y-3 hover:border-[#6d3a68]/40 transition-all shadow-2xs group"
                >
                  {/* Header Row */}
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-xs text-[#6d3a68]">
                        {item.subject}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-white border border-[#edd6ed] text-[10px] font-bold text-slate-600">
                        {item.class_name || item.class}
                      </span>
                      {item.tags && (
                        <span className="px-2 py-0.5 rounded-md bg-pink-50 border border-pink-200 text-[10px] font-bold text-pink-700">
                          {item.tags}
                        </span>
                      )}
                      {item.difficulty && (
                        <span className="px-2 py-0.5 rounded-md bg-purple-50 border border-purple-200 text-[10px] font-bold text-purple-700">
                          {item.difficulty}
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
                          onClick={() => handleOpenEditModal(item)}
                          className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-[#6d3a68] hover:text-white hover:border-[#6d3a68] transition-colors cursor-pointer shadow-2xs"
                          title="Edit Question"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteItem(item.id)}
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
                    {item.question_text || item.title}
                  </p>

                  {/* 4 Options Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    {['A', 'B', 'C', 'D'].map((letter, optIdx) => {
                      const text = opts[optIdx] || item[`option_${letter.toLowerCase()}`] || `Option ${letter}`;
                      const isCorrect = corrOpt === letter || item.correct_answer?.includes(`Option ${letter}`);

                      return (
                        <div
                          key={letter}
                          className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 text-xs transition-colors ${
                            isCorrect
                              ? 'bg-emerald-50 border-emerald-400 text-emerald-950 font-bold ring-1 ring-emerald-300'
                              : 'bg-white border-slate-200 text-slate-700'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span
                              className={`w-5 h-5 rounded-md font-bold flex items-center justify-center text-[10px] ${
                                isCorrect ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'
                              }`}
                            >
                              {letter}
                            </span>
                            <span>{text}</span>
                          </div>
                          {isCorrect && (
                            <span className="text-[10px] font-bold text-emerald-700 flex items-center gap-0.5">
                              <Check className="w-3 h-3" /> Correct
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Green Solution Box */}
                  <div className="p-3.5 rounded-xl bg-emerald-50/90 border border-emerald-200 text-xs text-emerald-950 font-semibold space-y-1">
                    <div className="flex items-baseline gap-1.5 flex-wrap">
                      <span className="font-black text-emerald-900">Correct Answer:</span>
                      <span className="font-bold">{item.correct_answer || `Option ${corrOpt}`}</span>
                    </div>
                    {item.explanation && (
                      <p className="text-[11px] text-emerald-800 font-normal leading-relaxed pt-0.5">
                        <strong className="font-bold">Explanation / Solution:</strong> {item.explanation}
                      </p>
                    )}
                  </div>
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
                  <Bookmark className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    {modalMode === 'create' ? 'Add Revision Question' : 'Edit Revision Question'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Save question, 4 options, and solution to sync live with Student Dashboard
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

            <form onSubmit={handleSaveItem} className="space-y-4 text-xs">
              {/* Class & Subject Selector */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Grade / Class *</label>
                  <select
                    value={formData.class_name}
                    onChange={(e) => setFormData({ ...formData, class_name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-[#6d3a68] bg-slate-50"
                  >
                    {CLASS_OPTIONS.filter(c => c !== 'All').map(c => (
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
                  placeholder="e.g. Find the sum of all prime numbers between 20 and 35."
                  value={formData.question_text}
                  onChange={(e) => setFormData({ ...formData, question_text: e.target.value })}
                  required
                  className="w-full p-3 rounded-xl border border-slate-300 text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-[#6d3a68]"
                />
              </div>

              {/* 4 Options */}
              <div className="space-y-2 pt-1">
                <label className="block text-slate-700 font-bold">4 Multiple Choice Options *</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <span className="text-[11px] font-bold text-slate-600 block mb-0.5">Option A *</span>
                    <input
                      type="text"
                      placeholder="e.g. 83"
                      value={formData.option_a}
                      onChange={(e) => setFormData({ ...formData, option_a: e.target.value })}
                      required
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#6d3a68]"
                    />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-slate-600 block mb-0.5">Option B *</span>
                    <input
                      type="text"
                      placeholder="e.g. 87"
                      value={formData.option_b}
                      onChange={(e) => setFormData({ ...formData, option_b: e.target.value })}
                      required
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#6d3a68]"
                    />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-slate-600 block mb-0.5">Option C *</span>
                    <input
                      type="text"
                      placeholder="e.g. 79"
                      value={formData.option_c}
                      onChange={(e) => setFormData({ ...formData, option_c: e.target.value })}
                      required
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#6d3a68]"
                    />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-slate-600 block mb-0.5">Option D *</span>
                    <input
                      type="text"
                      placeholder="e.g. 89"
                      value={formData.option_d}
                      onChange={(e) => setFormData({ ...formData, option_d: e.target.value })}
                      required
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#6d3a68]"
                    />
                  </div>
                </div>
              </div>

              {/* Correct Option Selector */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Select Correct Option *
                  </label>
                  <select
                    value={formData.correct_option}
                    onChange={(e) => setFormData({ ...formData, correct_option: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold text-emerald-700 bg-emerald-50 focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="A">Option A is Correct</option>
                    <option value="B">Option B is Correct</option>
                    <option value="C">Option C is Correct</option>
                    <option value="D">Option D is Correct</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Category Tag
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Tricky Question, Formula Rule"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#6d3a68]"
                  />
                </div>
              </div>

              {/* Step-by-Step Explanation */}
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Step-by-Step Mathematical / Conceptual Explanation *
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. The prime numbers between 20 and 35 are 23, 29, and 31. Sum = 23 + 29 + 31 = 83."
                  value={formData.explanation}
                  onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
                  required
                  className="w-full p-3 rounded-xl border border-slate-300 text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-[#6d3a68]"
                />
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 font-bold hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 rounded-xl bg-[#6d3a68] hover:bg-[#5c3158] text-white font-bold transition-all shadow-sm cursor-pointer disabled:opacity-50"
                >
                  {saving ? 'Saving...' : modalMode === 'create' ? 'Create Question' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
