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
  Sparkles
} from 'lucide-react';
import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge';
import { Modal } from '../../components/Modal';

export const QuestionBankPage = () => {
  const [questions, setQuestions] = useState([]);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, total_pages: 1 });
  const [loading, setLoading] = useState(true);

  // Filters
  const [filterClass, setFilterClass] = useState('');
  const [filterSubject, setFilterSubject] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState('');
  const [search, setSearch] = useState('');

  // Modals
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);

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
    setShowQuestionModal(true);
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
      correct_option: q.correct_option,
      difficulty: q.difficulty,
      marks: q.marks,
      negative_marks: q.negative_marks,
      explanation: q.explanation || '',
      status: q.status
    });
    setShowQuestionModal(true);
  };

  const handleSaveQuestion = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      if (editingQuestion) {
        await apiClient.put(`/questions/${editingQuestion.id}`, qForm);
      } else {
        await apiClient.post('/questions', qForm);
      }
      setShowQuestionModal(false);
      fetchQuestions(pagination.page);
    } catch (err) {
      alert(err.message || 'Failed to save question');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteQuestion = async (id) => {
    if (!confirm('Are you sure you want to delete this question?')) return;
    try {
      await apiClient.delete(`/questions/${id}`);
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
    reader.onload = (event) => {
      setImportCsvText(event.target.result);
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-slate-900">
            Question Bank Management
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Organized hierarchically: Class → Subject → Chapter → Difficulty with exact 4-option MCQ standard.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" icon={Download} onClick={handleDownloadTemplate}>
            CSV Template
          </Button>
          <Button variant="secondary" size="sm" icon={Upload} onClick={() => { setImportResult(null); setImportCsvText(''); setShowImportModal(true); }}>
            Import CSV
          </Button>
          <Button variant="primary" size="sm" icon={Plus} onClick={handleOpenCreate}>
            Add Question
          </Button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5">
          <select
            value={filterClass}
            onChange={(e) => setFilterClass(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-brand-500"
          >
            <option value="">All Classes</option>
            {classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>

          <select
            value={filterSubject}
            onChange={(e) => setFilterSubject(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-brand-500"
          >
            <option value="">All Subjects</option>
            {subjects.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>

          <select
            value={filterDifficulty}
            onChange={(e) => setFilterDifficulty(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-brand-500"
          >
            <option value="">All Difficulties</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search questions..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-brand-500"
          />
        </div>
      </div>

      {/* Question List Cards */}
      <div className="space-y-4">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => <div key={i} className="h-28 bg-slate-200 rounded-2xl animate-pulse" />)}
          </div>
        ) : questions.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400">
            <HelpCircle className="w-10 h-10 mx-auto mb-2 text-slate-300" />
            <p className="text-sm font-semibold text-slate-600">No questions found</p>
            <p className="text-xs text-slate-400 mt-1">Try adjusting your filters or click "Add Question" to create one.</p>
          </div>
        ) : (
          questions.map((q, idx) => (
            <div
              key={q.id}
              className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:shadow-card-hover transition-all"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="text-xs font-bold text-slate-500">#{q.id}</span>
                    <span className="text-xs font-bold text-brand-700 bg-brand-50 px-2.5 py-0.5 rounded-md border border-brand-200">
                      {q.class_name} • {q.subject_name}
                    </span>
                    {q.chapter_name && (
                      <span className="text-[11px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                        {q.chapter_name}
                      </span>
                    )}
                    <Badge variant={q.difficulty} size="sm">
                      {q.difficulty?.toUpperCase()}
                    </Badge>
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                      +{parseFloat(q.marks).toFixed(1)} / -{parseFloat(q.negative_marks).toFixed(2)}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 leading-relaxed">
                    {q.question_text}
                  </h3>

                  {/* 4 Options Grid Preview */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3 text-xs">
                    {['A', 'B', 'C', 'D'].map((opt) => {
                      const text = q[`option_${opt.toLowerCase()}`];
                      const isCorrect = q.correct_option === opt;
                      return (
                        <div
                          key={opt}
                          className={`p-2 rounded-xl border flex items-center gap-2 ${
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
                          <span className="truncate">{text}</span>
                        </div>
                      );
                    })}
                  </div>

                  {q.explanation && (
                    <div className="mt-3 p-2.5 bg-amber-50/50 border border-amber-200/60 rounded-xl text-xs text-amber-900">
                      <span className="font-bold">Explanation: </span>
                      {q.explanation}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(q)}
                    className="p-2 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-xl transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteQuestion(q.id)}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
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
        <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-xs text-xs">
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

      {/* ADD / EDIT QUESTION MODAL */}
      <Modal
        isOpen={showQuestionModal}
        onClose={() => setShowQuestionModal(false)}
        title={editingQuestion ? 'Edit Question' : 'Add MCQ Question'}
        subtitle="Standard 4-option single correct MCQ format"
        maxWidth="max-w-2xl"
        footer={
          <div className="flex items-center justify-end gap-3 w-full">
            <Button variant="secondary" onClick={() => setShowQuestionModal(false)}>Cancel</Button>
            <Button variant="primary" loading={actionLoading} onClick={handleSaveQuestion}>Save Question</Button>
          </div>
        }
      >
        <form onSubmit={handleSaveQuestion} className="space-y-4 text-xs">
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Class *</label>
              <select
                required
                value={qForm.class_id}
                onChange={(e) => setQForm({ ...qForm, class_id: e.target.value })}
                className="w-full px-3 py-2 border rounded-xl"
              >
                <option value="">Select Class</option>
                {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Subject *</label>
              <select
                required
                value={qForm.subject_id}
                onChange={(e) => setQForm({ ...qForm, subject_id: e.target.value })}
                className="w-full px-3 py-2 border rounded-xl"
              >
                <option value="">Select Subject</option>
                {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Difficulty</label>
              <select
                value={qForm.difficulty}
                onChange={(e) => setQForm({ ...qForm, difficulty: e.target.value })}
                className="w-full px-3 py-2 border rounded-xl"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase mb-1">Question Text *</label>
            <textarea
              required
              rows={3}
              value={qForm.question_text}
              onChange={(e) => setQForm({ ...qForm, question_text: e.target.value })}
              placeholder="Enter the complete question problem statement..."
              className="w-full px-3 py-2 border rounded-xl"
            />
          </div>

          {/* 4 Options */}
          <div className="space-y-2">
            <label className="block font-bold text-slate-700 uppercase">Four Options (A, B, C, D) *</label>
            {['A', 'B', 'C', 'D'].map((opt) => (
              <div key={opt} className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-slate-100 border border-slate-300 flex items-center justify-center font-bold text-xs shrink-0">
                  {opt}
                </span>
                <input
                  type="text"
                  required
                  value={qForm[`option_${opt.toLowerCase()}`]}
                  onChange={(e) => setQForm({ ...qForm, [`option_${opt.toLowerCase()}`]: e.target.value })}
                  placeholder={`Option ${opt} text`}
                  className="flex-1 px-3 py-2 border rounded-xl"
                />
              </div>
            ))}
          </div>

          {/* Correct Option & Marks */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Correct Answer *</label>
              <select
                value={qForm.correct_option}
                onChange={(e) => setQForm({ ...qForm, correct_option: e.target.value })}
                className="w-full px-3 py-2 border rounded-xl font-bold text-emerald-700 bg-emerald-50/60"
              >
                <option value="A">Option A</option>
                <option value="B">Option B</option>
                <option value="C">Option C</option>
                <option value="D">Option D</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Marks (+)</label>
              <input
                type="number"
                step="0.25"
                value={qForm.marks}
                onChange={(e) => setQForm({ ...qForm, marks: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 border rounded-xl"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Negative Marks (-)</label>
              <input
                type="number"
                step="0.25"
                value={qForm.negative_marks}
                onChange={(e) => setQForm({ ...qForm, negative_marks: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 border rounded-xl"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase mb-1">Explanation / Solution</label>
            <textarea
              rows={2}
              value={qForm.explanation}
              onChange={(e) => setQForm({ ...qForm, explanation: e.target.value })}
              placeholder="Step-by-step solution shown after result publication..."
              className="w-full px-3 py-2 border rounded-xl"
            />
          </div>
        </form>
      </Modal>

      {/* BULK CSV IMPORT MODAL */}
      <Modal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        title="Bulk Import Questions via CSV"
        subtitle="Validate and import questions without corrupting database integrity"
        maxWidth="max-w-2xl"
        footer={
          <div className="flex items-center justify-end gap-3 w-full">
            <Button variant="secondary" onClick={() => setShowImportModal(false)}>Close</Button>
            <Button variant="primary" loading={importLoading} onClick={handleImportSubmit}>
              Upload & Validate CSV
            </Button>
          </div>
        }
      >
        <div className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 uppercase mb-1.5">Choose CSV File</label>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase mb-1.5">Or Paste Raw CSV Data</label>
            <textarea
              rows={6}
              value={importCsvText}
              onChange={(e) => setImportCsvText(e.target.value)}
              placeholder="class_id,subject_id,question_text,option_a,option_b,option_c,option_d,correct_option,difficulty,marks,negative_marks,explanation..."
              className="w-full px-3 py-2 font-mono text-[11px] border rounded-xl bg-slate-50"
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
                  <span className="text-rose-600 block text-[10px]">Invalid/Skipped</span>
                  <span className="font-bold text-rose-600">{importResult.invalid_questions}</span>
                </div>
              </div>

              {importResult.errors && importResult.errors.length > 0 && (
                <div className="max-h-36 overflow-y-auto space-y-1 pt-2">
                  <p className="font-bold text-rose-700 text-[11px]">Row Error Diagnostics:</p>
                  {importResult.errors.map((err, i) => (
                    <p key={i} className="text-[11px] text-rose-600 bg-rose-50 p-1.5 rounded-md">
                      Line {err.row}: {err.error}
                    </p>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};
