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
    class_name: 'Class 1',
    subject: 'Mathematics (IMO)',
    subject_code: 'IMO',
    question_text: '',
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
      class_name: selectedClass !== 'All' ? selectedClass : 'Class 1',
      subject: selectedSubject !== 'All' ? selectedSubject : 'Mathematics (IMO)',
      subject_code: selectedSubject !== 'All' ? (SUBJECT_OPTIONS.find(s => s.name === selectedSubject)?.code || 'IMO') : 'IMO',
      question_text: '',
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
    setFormData({
      class_name: item.class_name || 'Class 1',
      subject: item.subject || 'Mathematics (IMO)',
      subject_code: item.subject_code || 'IMO',
      question_text: item.question_text || '',
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
      alert('Please enter question text');
      return;
    }
    if (!formData.correct_answer.trim()) {
      alert('Please enter the correct answer');
      return;
    }

    try {
      setSaving(true);
      if (modalMode === 'create') {
        const res = await apiClient.post('/revision-vault', formData);
        if (res.success) {
          setSuccessMsg('Revision question created successfully!');
          setIsModalOpen(false);
          fetchItems();
        }
      } else if (modalMode === 'edit' && currentItem?.id) {
        const res = await apiClient.request(`/revision-vault/${currentItem.id}`, {
          method: 'PUT',
          body: JSON.stringify(formData)
        });
        if (res.success) {
          setSuccessMsg('Revision question updated successfully!');
          setIsModalOpen(false);
          fetchItems();
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
    if (!window.confirm('Are you sure you want to delete this revision question?')) {
      return;
    }
    try {
      const res = await apiClient.request(`/revision-vault/${id}`, {
        method: 'DELETE'
      });
      if (res.success) {
        setSuccessMsg('Item deleted successfully!');
        fetchItems();
      }
    } catch (err) {
      console.error('Error deleting revision item:', err);
      alert(err.message || 'Failed to delete item');
    } finally {
      setTimeout(() => setSuccessMsg(''), 4000);
    }
  };

  const handleResetDefaults = async () => {
    if (!window.confirm('Reset all Revision Vault questions to initial default curriculum questions?')) {
      return;
    }
    try {
      setLoading(true);
      const res = await apiClient.post('/revision-vault/seed', {});
      if (res.success) {
        setSuccessMsg('Default Revision Vault questions re-seeded successfully!');
        fetchItems();
      }
    } catch (err) {
      alert(err.message || 'Failed to reset seed items');
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
      <div className="bg-gradient-to-r from-[#6d3a68] to-[#8c4e8b] rounded-3xl p-6 sm:p-8 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/10 backdrop-blur-xs text-xs font-bold text-pink-200">
            <Bookmark className="w-3.5 h-3.5" />
            <span>Academic Curriculum Content Manager</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Revision Vault &amp; Bookmarks Manager
          </h1>
          <p className="text-xs sm:text-sm text-pink-100 max-w-2xl">
            Add, edit, and curate tricky questions, high-yield formulas, and AI-identified bookmarks for all classes (Class 1 to 12).
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer backdrop-blur-xs border border-white/20 shadow-xs"
            title="Reset Default Questions"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Seed Defaults</span>
          </button>
          <button
            type="button"
            onClick={handleOpenCreateModal}
            className="px-5 py-2.5 rounded-xl bg-[#e7b84b] hover:bg-[#d4a236] text-[#321630] font-black text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-md active:scale-95 cursor-pointer"
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
          <span className="text-[11px] text-emerald-600 font-semibold">In Database</span>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-[#edd6ed] shadow-xs space-y-1">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Active Published</p>
          <p className="text-2xl font-black text-emerald-600">{activeCount}</p>
          <span className="text-[11px] text-slate-500 font-medium">Visible to Students</span>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-[#edd6ed] shadow-xs space-y-1">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Classes Covered</p>
          <p className="text-2xl font-black text-indigo-600">{distinctClasses} Classes</p>
          <span className="text-[11px] text-slate-500 font-medium">Class 1 to 12</span>
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

        {/* Search Input Form */}
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 w-full md:w-80">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search question, answer, tag..."
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

      {/* Main Revision Cards List (Matching Screenshot Design) */}
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
            {items.map((item, idx) => (
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
                      {item.class_name}
                    </span>
                    {item.tags && (
                      <span className="px-2 py-0.5 rounded-md bg-pink-50 border border-pink-200 text-[10px] font-bold text-pink-700">
                        {item.tags}
                      </span>
                    )}
                    {item.status === 'inactive' && (
                      <span className="px-2 py-0.5 rounded-md bg-slate-200 text-[10px] font-bold text-slate-600">
                        Draft / Inactive
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
                  {item.question_text}
                </p>

                {/* Green Solution Box */}
                <div className="p-3.5 rounded-xl bg-emerald-50/90 border border-emerald-200 text-xs text-emerald-950 font-semibold space-y-0.5">
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-black text-emerald-900">Correct Answer:</span>
                    <span className="font-bold">{item.correct_answer}</span>
                  </div>
                  {item.explanation && (
                    <p className="text-[11px] text-emerald-800 font-normal leading-relaxed pt-0.5">
                      — {item.explanation}
                    </p>
                  )}
                </div>
              </div>
            ))}
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
                    Save to Revision Vault database &amp; sync with student dashboard
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
                  placeholder="e.g. If 3 apples cost ₹45, what is the cost of 7 apples?"
                  value={formData.question_text}
                  onChange={(e) => setFormData({ ...formData, question_text: e.target.value })}
                  required
                  className="w-full p-3 rounded-xl border border-slate-300 text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-[#6d3a68]"
                />
              </div>

              {/* Correct Answer */}
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Correct Answer *
                </label>
                <input
                  type="text"
                  placeholder="e.g. ₹105 or Heart or 35 tens"
                  value={formData.correct_answer}
                  onChange={(e) => setFormData({ ...formData, correct_answer: e.target.value })}
                  required
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-[#6d3a68]"
                />
              </div>

              {/* Step-by-Step Explanation */}
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Step-by-Step Explanation / Formula Hint
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Unit price = 45 / 3 = ₹15. For 7 apples = 7 × 15 = ₹105."
                  value={formData.explanation}
                  onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
                  className="w-full p-3 rounded-xl border border-slate-300 text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-[#6d3a68]"
                />
              </div>

              {/* Tags & Difficulty */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Category / Tag</label>
                  <input
                    type="text"
                    placeholder="e.g. Tricky, Unitary Method"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-[#6d3a68]"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Difficulty</label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-[#6d3a68] bg-slate-50"
                  >
                    <option value="Foundation">Foundation</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced (HOTS)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-[#6d3a68] bg-slate-50"
                  >
                    <option value="active">Active (Visible)</option>
                    <option value="inactive">Inactive (Draft)</option>
                  </select>
                </div>
              </div>

              {/* Action Buttons */}
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
