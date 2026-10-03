import React, { useState, useEffect } from 'react';
import { apiClient } from '../../api/client';
import {
  HelpCircle,
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ArrowLeft,
  BookOpen,
  Layers,
  Save,
  X,
  Check,
  CheckCircle,
  RotateCcw,
  User
} from 'lucide-react';
import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge';
import { Modal } from '../../components/Modal';
import { useAuth } from '../../contexts/AuthContext';

export const QuestionBankPage = () => {
  const { user } = useAuth();
  const [questions, setQuestions] = useState([]);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, total_pages: 1 });
  const [loading, setLoading] = useState(true);

  // View Mode: 'list' | 'create' | 'edit'
  const [viewMode, setViewMode] = useState('list');
  const [editingQuestion, setEditingQuestion] = useState(null);

  // Filters
  const [filterClass, setFilterClass] = useState('');
  const [filterSubject, setFilterSubject] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState('');
  const [search, setSearch] = useState('');

  // Modals
  const [showImportModal, setShowImportModal] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  // Question Form State
  const [qForm, setQForm] = useState({
    class_id: '',
    subject_id: '',
    chapter_id: '',
    question_text: '',
    option_a: '',
    option_b: '',
    option_c: '',
    option_d: '',
    correct_option: 'A',
    difficulty: 'medium',
    marks: 1.00,
    negative_marks: 0.25,
    explanation: '',
    status: 'active'
  });

  // Import State
  const [importCsvText, setImportCsvText] = useState('');
  const [importResult, setImportResult] = useState(null);
  const [importLoading, setImportLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchQuestions = async (page = 1) => {
    try {
      setLoading(true);
      const res = await apiClient.get('/questions', {
        page,
        limit: 10,
        class_id: filterClass,
        subject_id: filterSubject,
        difficulty: filterDifficulty,
        search
      });

      if (res.success && res.data) {
        setQuestions(res.data.questions || []);
        setPagination(res.data.pagination || { page: 1, limit: 10, total: 0, total_pages: 1 });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadMetadata = async () => {
    const [cRes, sRes, chRes] = await Promise.all([
      apiClient.get('/academic/classes'),
      apiClient.get('/academic/subjects'),
      apiClient.get('/academic/chapters')
    ]);
    if (cRes.success) setClasses(cRes.data || []);
    if (sRes.success) setSubjects(sRes.data || []);
    if (chRes.success) setChapters(chRes.data || []);
  };

  useEffect(() => {
    loadMetadata();
  }, []);

  useEffect(() => {
    fetchQuestions(1);
  }, [filterClass, filterSubject, filterDifficulty, search]);

  const handleOpenCreate = () => {
    setEditingQuestion(null);
    setQForm({
      class_id: classes[0]?.id || '',
      subject_id: subjects[0]?.id || '',
      chapter_id: '',
      question_text: '',
      option_a: '',
      option_b: '',
      option_c: '',
      option_d: '',
      correct_option: 'A',
      difficulty: 'medium',
      marks: 1.00,
      negative_marks: 0.25,
      explanation: '',
      status: 'active'
    });
    setViewMode('create');
  };

  const handleOpenEdit = (q) => {
    setEditingQuestion(q);
    setQForm({
      class_id: q.class_id,
      subject_id: q.subject_id,
      chapter_id: q.chapter_id || '',
      question_text: q.question_text,
      option_a: q.option_a,
      option_b: q.option_b,
      option_c: q.option_c,
      option_d: q.option_d,
      correct_option: q.correct_option || 'A',
      difficulty: q.difficulty || 'medium',
      marks: parseFloat(q.marks) || 1.00,
      negative_marks: parseFloat(q.negative_marks) || 0.25,
      explanation: q.explanation || '',
      status: q.status || 'active'
    });
    setViewMode('edit');
  };

  const handleSaveQuestion = async (e) => {
    if (e) e.preventDefault();
    if (!qForm.question_text.trim()) {
      alert('Please enter question text');
      return;
    }
    if (!qForm.option_a || !qForm.option_b) {
      alert('Please provide at least Option A and Option B');
      return;
    }

    setActionLoading(true);
    try {
      if (editingQuestion) {
        await apiClient.put(`/questions/${editingQuestion.id}`, qForm);
        setFeedback({ type: 'success', message: 'Question updated successfully!' });
      } else {
        await apiClient.post('/questions', qForm);
        setFeedback({ type: 'success', message: 'Question created successfully in Question Bank!' });
      }
      setViewMode('list');
      fetchQuestions(pagination.page);
    } catch (err) {
      alert(err.message || 'Failed to save question');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteQuestion = async (id) => {
    try {
      await apiClient.delete(`/questions/${id}`);
      setFeedback({ type: 'success', message: 'Question deleted successfully.' });
      fetchQuestions(pagination.page);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDownloadTemplate = () => {
    window.location.href = '/api/questions-template';
  };

  const handleImportSubmit = async () => {
    if (!importCsvText.trim()) {
      alert('Please paste or upload CSV content.');
      return;
    }

    setImportLoading(true);
    setImportResult(null);

    try {
      const res = await apiClient.post('/questions-import', {
        csv_content: importCsvText
      });
      if (res.success && res.data) {
        setImportResult(res.data);
        fetchQuestions(1);
      }
    } catch (err) {
      alert(err.message || 'Import error');
    } finally {
      setImportLoading(false);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      setImportCsvText(evt.target.result);
    };
    reader.readAsText(file);
  };

  // =========================================================================
  // VIEW MODE: FULL-PAGE ADD / EDIT QUESTION SCREEN (No Modals!)
  // =========================================================================
  if (viewMode === 'create' || viewMode === 'edit') {
    const isEditing = viewMode === 'edit';

    return (
      <div className="space-y-6 pb-16 font-sans max-w-4xl mx-auto animate-in fade-in duration-200">
        {/* Navigation & Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-indigo-600 px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>← Back to Question Bank</span>
            </button>
            <div>
              <h2 className="text-xl font-black text-slate-900 leading-tight">
                {isEditing ? `Edit Question #${editingQuestion?.id}` : 'Add MCQ Question'}
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Standard 4-option single correct MCQ format with real-time scoring preview
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Button
              variant="secondary"
              size="sm"
              icon={X}
              onClick={() => setViewMode('list')}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={Save}
              loading={actionLoading}
              onClick={handleSaveQuestion}
            >
              {isEditing ? 'Save Changes' : 'Save Question'}
            </Button>
          </div>
        </div>

        <form onSubmit={handleSaveQuestion} className="space-y-6">
          {/* SECTION 1: Academic Association & Scoring */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs">
            <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-slate-100">
              <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs">
                1
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Academic Association &amp; Difficulty</h3>
                <p className="text-[11px] text-slate-400">Class, subject mapping and difficulty level</p>
              </div>
            </div>

            {/* Author Teacher Name Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-gradient-to-r from-[#faf5ff] to-[#f5f3ff] border border-[#e9d5ff] rounded-2xl mb-5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#7c3aed] text-white flex items-center justify-center font-bold text-sm shadow-2xs shrink-0">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                    Authoring Teacher / Faculty
                  </span>
                  <p className="font-extrabold text-[#2e1065] text-sm">
                    {isEditing ? (editingQuestion?.author_name || user?.full_name || 'Faculty Member') : (user?.full_name || 'Faculty Member')}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 self-start sm:self-auto">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-[#e9d5ff] text-[#7c3aed] font-bold rounded-xl text-xs shadow-2xs">
                  <span className="w-2 h-2 rounded-full bg-[#10b981]" />
                  <span>{user?.role === 'superadmin' ? 'Super Administrator' : 'Verified Faculty Teacher'}</span>
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 text-xs">
              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Class <span className="text-rose-500">*</span>
                </label>
                <select
                  required
                  value={qForm.class_id}
                  onChange={(e) => setQForm({ ...qForm, class_id: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Select Class</option>
                  {classes.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Subject <span className="text-rose-500">*</span>
                </label>
                <select
                  required
                  value={qForm.subject_id}
                  onChange={(e) => setQForm({ ...qForm, subject_id: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Select Subject</option>
                  {subjects.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Difficulty Level
                </label>
                <select
                  value={qForm.difficulty}
                  onChange={(e) => setQForm({ ...qForm, difficulty: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Marks (+)
                </label>
                <input
                  type="number"
                  step="0.25"
                  required
                  value={qForm.marks}
                  onChange={(e) => setQForm({ ...qForm, marks: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Negative Marks (-)
                </label>
                <input
                  type="number"
                  step="0.25"
                  required
                  value={qForm.negative_marks}
                  onChange={(e) => setQForm({ ...qForm, negative_marks: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* SECTION 2: Question Statement */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs">
            <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-slate-100">
              <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-xs">
                2
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Question Problem Statement</h3>
                <p className="text-[11px] text-slate-400">Write the complete question as seen by the candidate</p>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                Question Text <span className="text-rose-500">*</span>
              </label>
              <textarea
                required
                rows={4}
                value={qForm.question_text}
                onChange={(e) => setQForm({ ...qForm, question_text: e.target.value })}
                placeholder="Enter the complete question problem statement here..."
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed"
              />
            </div>
          </div>

          {/* SECTION 3: Four Options (A, B, C, D) & Correct Selection */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold text-xs">
                  3
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Four Options &amp; Correct Answer</h3>
                  <p className="text-[11px] text-slate-400">Fill in option texts and select the correct choice</p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="font-bold text-slate-500">Correct Answer:</span>
                <span className="font-black text-emerald-700 bg-emerald-100/80 px-2.5 py-1 rounded-lg border border-emerald-300">
                  Option {qForm.correct_option}
                </span>
              </div>
            </div>

            <div className="space-y-3.5">
              {['A', 'B', 'C', 'D'].map((opt) => {
                const isSelected = qForm.correct_option === opt;
                return (
                  <div
                    key={opt}
                    className={`p-3 rounded-2xl border transition-all flex items-center gap-3 ${
                      isSelected
                        ? 'bg-emerald-50/70 border-emerald-300 ring-2 ring-emerald-500/20'
                        : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {/* Option Badge */}
                    <span
                      className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs shrink-0 shadow-2xs ${
                        isSelected
                          ? 'bg-emerald-600 text-white'
                          : 'bg-white text-slate-700 border border-slate-200'
                      }`}
                    >
                      {opt}
                    </span>

                    {/* Input */}
                    <input
                      type="text"
                      required
                      value={qForm[`option_${(opt || '').toString().toLowerCase()}`] || ''}
                      onChange={(e) =>
                        setQForm({ ...qForm, [`option_${(opt || '').toString().toLowerCase()}`]: e.target.value })
                      }
                      placeholder={`Enter text for Option ${opt}...`}
                      className="flex-1 bg-transparent border-0 text-xs font-semibold text-slate-900 placeholder-slate-400 focus:outline-none"
                    />

                    {/* Radio Selector */}
                    <button
                      type="button"
                      onClick={() => setQForm({ ...qForm, correct_option: opt })}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
                      }`}
                    >
                      {isSelected ? '✓ Correct Answer' : 'Mark Correct'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* SECTION 4: Explanation / Solution */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs">
            <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-slate-100">
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-xs">
                4
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Explanation / Step-by-Step Solution</h3>
                <p className="text-[11px] text-slate-400">Shown to students in detailed solutions after result publication</p>
              </div>
            </div>

            <div>
              <textarea
                rows={3}
                value={qForm.explanation}
                onChange={(e) => setQForm({ ...qForm, explanation: e.target.value })}
                placeholder="Write step-by-step mathematical or logical solution for student guidance..."
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed"
              />
            </div>
          </div>

          {/* Action Footer */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              variant="secondary"
              size="md"
              type="button"
              onClick={() => setViewMode('list')}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="md"
              type="submit"
              icon={Save}
              loading={actionLoading}
            >
              {isEditing ? 'Save Changes' : 'Save Question'}
            </Button>
          </div>
        </form>
      </div>
    );
  }

  // =========================================================================
  // VIEW MODE: MAIN QUESTION BANK TABLE LIST VIEW
  // =========================================================================
  return (
    <div className="space-y-6 font-sans">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2.5">
            <HelpCircle className="w-7 h-7 text-indigo-600" />
            <span>Question Bank Management</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Organize questions by class, subject, and difficulty for automated olympiad generation.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <Button
            variant="secondary"
            size="sm"
            icon={Download}
            onClick={handleDownloadTemplate}
          >
            Template
          </Button>
          <Button
            variant="secondary"
            size="sm"
            icon={Upload}
            onClick={() => setShowImportModal(true)}
          >
            Import CSV
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={Plus}
            onClick={handleOpenCreate}
          >
            + Add MCQ Question
          </Button>
        </div>
      </div>

      {feedback.message && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-2xl flex items-center justify-between shadow-xs">
          <span>{feedback.message}</span>
          <button onClick={() => setFeedback({ type: '', message: '' })} className="font-bold ml-4">✕</button>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search questions by problem statement or keywords..."
            className="w-full pl-10 pr-10 py-2.5 bg-slate-50 hover:bg-slate-100/60 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all font-medium"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 rounded-md"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs items-end">
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
              Filter Class
            </label>
            <select
              value={filterClass}
              onChange={(e) => setFilterClass(e.target.value)}
              className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer"
            >
              <option value="">All Classes</option>
              {classes.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
              Filter Subject
            </label>
            <select
              value={filterSubject}
              onChange={(e) => setFilterSubject(e.target.value)}
              className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer"
            >
              <option value="">All Subjects</option>
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
              Difficulty
            </label>
            <select
              value={filterDifficulty}
              onChange={(e) => setFilterDifficulty(e.target.value)}
              className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer"
            >
              <option value="">All Difficulties</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold text-transparent select-none uppercase tracking-wider block mb-1.5">
              Reset
            </label>
            <button
              type="button"
              onClick={() => {
                setFilterClass('');
                setFilterSubject('');
                setFilterDifficulty('');
                setSearch('');
              }}
              className="w-full h-9 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer inline-flex items-center justify-center gap-1.5 border border-slate-200/60 shadow-2xs active:scale-[0.98]"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              <span>Clear Filters</span>
            </button>
          </div>
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-3.5">
        {loading ? (
          <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center text-slate-400 text-xs">
            Loading questions repository...
          </div>
        ) : questions.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center text-slate-400 text-xs">
            No questions found. Click "+ Add MCQ Question" to add your first question.
          </div>
        ) : (
          questions.map((q) => (
            <div
              key={q.id}
              className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs hover:border-slate-300 transition-all"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-2.5">
                    <span className="text-xs font-bold text-slate-400">#{q.id}</span>
                    <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-md border border-indigo-100">
                      {q.class_name} • {q.subject_name}
                    </span>
                    {q.chapter_name && (
                      <span className="text-[11px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                        {q.chapter_name}
                      </span>
                    )}
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                      q.difficulty === 'easy'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : q.difficulty === 'hard'
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      {q.difficulty}
                    </span>
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-150">
                      +{parseFloat(q.marks).toFixed(1)} / -{parseFloat(q.negative_marks).toFixed(2)}
                    </span>
                    {/* Teacher / Author badge */}
                    <span className="text-[11px] font-bold text-[#6b21a8] bg-[#faf5ff] px-2 py-0.5 rounded-md border border-[#e9d5ff] inline-flex items-center gap-1">
                      <User className="w-3 h-3 text-[#9333ea]" />
                      <span>By: {q.author_name || 'Super Admin'}</span>
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 leading-relaxed">
                    {q.question_text}
                  </h3>

                  {/* 4 Options Grid Preview */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3 text-xs">
                    {['A', 'B', 'C', 'D'].map((opt) => {
                      const text = q[`option_${(opt || '').toString().toLowerCase()}`];
                      const isCorrect = q.correct_option === opt;
                      return (
                        <div
                          key={opt}
                          className={`p-2.5 rounded-xl border flex items-center gap-2.5 ${
                            isCorrect
                              ? 'bg-emerald-50/80 border-emerald-300 text-emerald-900 font-bold'
                              : 'bg-slate-50/60 border-slate-200 text-slate-700'
                          }`}
                        >
                          <span
                            className={`w-5 h-5 rounded-md flex items-center justify-center font-bold text-[10px] ${
                              isCorrect ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
                            }`}
                          >
                            {opt}
                          </span>
                          <span className="truncate">{text || '—'}</span>
                        </div>
                      );
                    })}
                  </div>

                  {q.explanation && (
                    <div className="mt-3 p-3 bg-amber-50/50 border border-amber-200/60 rounded-xl text-xs text-amber-900">
                      <span className="font-bold">Explanation: </span>
                      {q.explanation}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(q)}
                    title="Edit Question"
                    className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors cursor-pointer"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteQuestion(q.id)}
                    title="Delete Question"
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination Controls */}
      {pagination.total_pages > 1 && (
        <div className="flex items-center justify-between bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs text-xs">
          <span className="text-slate-500">
            Showing {(pagination.page - 1) * pagination.limit + 1} to{' '}
            {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} questions
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="xs"
              icon={ChevronLeft}
              disabled={pagination.page <= 1}
              onClick={() => fetchQuestions(pagination.page - 1)}
            >
              Prev
            </Button>
            <span className="font-bold text-slate-700 px-2">
              {pagination.page} / {pagination.total_pages}
            </span>
            <Button
              variant="secondary"
              size="xs"
              disabled={pagination.page >= pagination.total_pages}
              onClick={() => fetchQuestions(pagination.page + 1)}
            >
              <span>Next</span>
              <ChevronRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </div>
        </div>
      )}

      {/* Bulk CSV Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-slate-200 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Upload className="w-5 h-5 text-indigo-600" />
                <span>Bulk Import Questions via CSV</span>
              </h3>
              <button onClick={() => setShowImportModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1.5">Choose CSV File</label>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1.5">Or Paste Raw CSV Data</label>
                <textarea
                  rows={5}
                  value={importCsvText}
                  onChange={(e) => setImportCsvText(e.target.value)}
                  placeholder="class_id,subject_id,question_text,option_a,option_b,option_c,option_d,correct_option,difficulty,marks,negative_marks,explanation..."
                  className="w-full px-3 py-2 font-mono text-[11px] border border-slate-200 rounded-xl bg-slate-50"
                />
              </div>

              {/* Validation & Results Summary */}
              {importResult && (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                  <h4 className="font-bold text-slate-900 text-sm">Import Validation Analysis</h4>
                  <div className="grid grid-cols-4 gap-2 text-center font-mono">
                    <div className="p-2 bg-white rounded-lg border">
                      <span className="text-slate-500 block text-[10px]">Total Rows</span>
                      <span className="font-bold text-slate-900">{importResult.total_rows}</span>
                    </div>
                    <div className="p-2 bg-white rounded-lg border border-emerald-200">
                      <span className="text-emerald-600 block text-[10px]">Imported</span>
                      <span className="font-bold text-emerald-600">{importResult.imported_questions}</span>
                    </div>
                    <div className="p-2 bg-white rounded-lg border border-amber-200">
                      <span className="text-amber-600 block text-[10px]">Valid</span>
                      <span className="font-bold text-amber-600">{importResult.valid_questions}</span>
                    </div>
                    <div className="p-2 bg-white rounded-lg border border-rose-200">
                      <span className="text-rose-600 block text-[10px]">Skipped</span>
                      <span className="font-bold text-rose-600">{importResult.invalid_questions}</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button variant="secondary" size="sm" onClick={() => setShowImportModal(false)}>Close</Button>
                <Button variant="primary" size="sm" loading={importLoading} onClick={handleImportSubmit}>
                  Upload &amp; Validate CSV
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
