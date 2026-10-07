import React, { useState, useEffect } from 'react';
import { apiClient } from '../../api/client';
import {
  FileSpreadsheet,
  Plus,
  Search,
  Clock,
  Award,
  Shield,
  Edit2,
  Trash2,
  CheckCircle,
  HelpCircle,
  Users,
  Check,
  ArrowLeft,
  Save,
  X,
  BookOpen,
  Sparkles,
  Sliders,
  Layers,
  User,
  Download,
  Upload
} from 'lucide-react';
import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge';
import { useAuth } from '../../contexts/AuthContext';

export const ExamManagementPage = () => {
  const { user } = useAuth();
  const [exams, setExams] = useState([]);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [allQuestions, setAllQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('');
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  // View Mode: 'list' | 'create' | 'edit'
  const [viewMode, setViewMode] = useState('list');
  const [editingExam, setEditingExam] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Form State
  const [examForm, setExamForm] = useState({
    title: '',
    exam_code: '',
    exam_type: 'mock',
    description: '',
    instructions: '1. Each question has 4 options with exactly one correct answer.\n2. Do not switch browser tabs during the examination.',
    class_id: '',
    subject_id: '',
    duration_minutes: 60,
    passing_percentage: 40.0,
    negative_marking: 1,
    default_negative_marks: 0.25,
    attempt_limit: 3,
    start_datetime: '',
    end_datetime: '',
    result_visibility: 'immediate',
    solution_visibility: 'after_result',
    certificate_eligibility: 1,
    min_certificate_percentage: 60.0,
    randomize_questions: 1,
    shuffle_options: 1,
    tab_switch_limit: 3,
    status: 'published',
    question_ids: []
  });

  // Import / Export State
  const [showImportModal, setShowImportModal] = useState(false);
  const [importText, setImportText] = useState('');
  const [importLoading, setImportLoading] = useState(false);

  const handleDownloadExamsTemplate = () => {
    const headers = ['title', 'exam_code', 'exam_type', 'duration_minutes', 'passing_percentage', 'instructions', 'status'];
    const sample = [
      'National Mathematics Olympiad (NMO) 2026', 'NMO-2026', 'mock', '60', '40.0', '1. Each question has 4 options.\n2. Do not switch tabs.', 'published'
    ];
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), sample.map(s => `"${s}"`).join(',')].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'exams_management_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportExamsCSV = () => {
    if (!exams || exams.length === 0) {
      alert('No exams available to export.');
      return;
    }
    const headers = ['ID', 'Exam Title', 'Exam Code', 'Class', 'Subject', 'Exam Type', 'Duration (Mins)', 'Passing %', 'Status', 'Questions Count'];
    const rows = exams.map(e => [
      e.id || '',
      `"${(e.title || '').toString().replace(/"/g, '""')}"`,
      `"${(e.exam_code || '').toString().replace(/"/g, '""')}"`,
      `"${(e.class_name || '').toString().replace(/"/g, '""')}"`,
      `"${(e.subject_name || '').toString().replace(/"/g, '""')}"`,
      e.exam_type || 'mock',
      e.duration_minutes || 60,
      e.passing_percentage || 40,
      e.status || 'published',
      e.total_questions || e.question_ids?.length || 0
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `exams_management_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setFeedback({ type: 'success', message: `Successfully exported ${exams.length} examinations to CSV!` });
  };

  const handleImportExamsSubmit = async () => {
    if (!importText.trim()) {
      alert('Please paste CSV or JSON exam data to import.');
      return;
    }
    setImportLoading(true);
    try {
      let imported = [];
      const trimmed = importText.trim();
      if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
        const parsed = JSON.parse(trimmed);
        imported = Array.isArray(parsed) ? parsed : [parsed];
      } else {
        const lines = trimmed.split('\n').map(l => l.trim()).filter(Boolean);
        if (lines.length < 2) throw new Error('CSV must contain a header row and at least 1 record.');
        const headers = lines[0].split(',').map(h => h.replace(/^["']|["']$/g, '').trim().toLowerCase());
        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(',').map(v => v.replace(/^["']|["']$/g, '').trim());
          const obj = {};
          headers.forEach((h, idx) => {
            obj[h] = values[idx] || '';
          });
          imported.push({
            title: obj.title || 'Imported Olympiad Examination',
            exam_code: obj.exam_code || `EX-${Date.now()}-${i}`,
            exam_type: obj.exam_type || 'mock',
            duration_minutes: Number(obj.duration_minutes) || 60,
            passing_percentage: parseFloat(obj.passing_percentage) || 40.0,
            instructions: obj.instructions || 'Standard Olympiad examination guidelines apply.',
            status: obj.status || 'published',
            class_id: classes[0]?.id || 1,
            subject_id: subjects[0]?.id || 1,
            question_ids: []
          });
        }
      }

      for (const ex of imported) {
        await apiClient.post('/exams', ex).catch(() => {});
      }

      setShowImportModal(false);
      setImportText('');
      fetchExams();
      setFeedback({ type: 'success', message: `Successfully imported ${imported.length} exams!` });
    } catch (err) {
      alert(err.message || 'Failed to parse import data.');
    } finally {
      setImportLoading(false);
    }
  };

  const fetchExams = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/exams', { search, exam_type: filterType });
      if (res.success) setExams(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadMetadata = async () => {
    const [cRes, sRes, qRes] = await Promise.all([
      apiClient.get('/academic/classes'),
      apiClient.get('/academic/subjects'),
      apiClient.get('/questions', { limit: 100 })
    ]);
    if (cRes.success) setClasses(cRes.data || []);
    if (sRes.success) setSubjects(sRes.data || []);
    if (qRes.success && qRes.data) setAllQuestions(qRes.data.questions || []);
  };

  useEffect(() => {
    loadMetadata();
  }, []);

  useEffect(() => {
    fetchExams();
  }, [search, filterType]);

  const handleOpenCreate = () => {
    setEditingExam(null);
    setExamForm({
      title: '',
      exam_code: 'OLY-2026-' + Math.floor(1000 + Math.random() * 9000),
      exam_type: 'mock',
      description: '',
      instructions: '1. Each question has 4 options with exactly one correct answer.\n2. Do not switch browser tabs during the examination.',
      class_id: classes[0]?.id || '',
      subject_id: subjects[0]?.id || '',
      duration_minutes: 60,
      passing_percentage: 40.0,
      negative_marking: 1,
      default_negative_marks: 0.25,
      attempt_limit: 3,
      start_datetime: '',
      end_datetime: '',
      result_visibility: 'immediate',
      solution_visibility: 'after_result',
      certificate_eligibility: 1,
      min_certificate_percentage: 60.0,
      randomize_questions: 1,
      shuffle_options: 1,
      tab_switch_limit: 3,
      status: 'published',
      question_ids: allQuestions.map(q => q.id)
    });
    setViewMode('create');
  };

  const handleOpenEdit = async (exam) => {
    setEditingExam(exam);
    try {
      const res = await apiClient.get(`/exams/${exam.id}`);
      if (res.success && res.data) {
        const d = res.data;
        setExamForm({
          title: d.title,
          exam_code: d.exam_code,
          exam_type: d.exam_type,
          description: d.description || '',
          instructions: d.instructions || '',
          class_id: d.class_id || '',
          subject_id: d.subject_id || '',
          duration_minutes: d.duration_minutes,
          passing_percentage: d.passing_percentage,
          negative_marking: d.negative_marking ? 1 : 0,
          default_negative_marks: d.default_negative_marks,
          attempt_limit: d.attempt_limit,
          start_datetime: d.start_datetime ? d.start_datetime.replace(' ', 'T') : '',
          end_datetime: d.end_datetime ? d.end_datetime.replace(' ', 'T') : '',
          result_visibility: d.result_visibility,
          solution_visibility: d.solution_visibility,
          certificate_eligibility: d.certificate_eligibility ? 1 : 0,
          min_certificate_percentage: d.min_certificate_percentage,
          randomize_questions: d.randomize_questions ? 1 : 0,
          shuffle_options: d.shuffle_options ? 1 : 0,
          tab_switch_limit: d.tab_switch_limit,
          status: d.status,
          question_ids: (d.questions || []).map(q => q.question_id)
        });
        setViewMode('edit');
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const toggleQuestionSelection = (qId) => {
    if (examForm.question_ids.includes(qId)) {
      setExamForm({
        ...examForm,
        question_ids: examForm.question_ids.filter(id => id !== qId)
      });
    } else {
      setExamForm({
        ...examForm,
        question_ids: [...examForm.question_ids, qId]
      });
    }
  };

  const handleSaveExam = async (e) => {
    if (e) e.preventDefault();
    if (!examForm.title.trim()) {
      alert('Please enter exam title');
      return;
    }

    setActionLoading(true);
    try {
      if (editingExam) {
        await apiClient.put(`/exams/${editingExam.id}`, examForm);
        setFeedback({ type: 'success', message: 'Exam updated and published!' });
      } else {
        await apiClient.post('/exams', examForm);
        setFeedback({ type: 'success', message: 'New Olympiad Exam published successfully for students!' });
      }
      setViewMode('list');
      fetchExams();
    } catch (err) {
      alert(err.message || 'Failed to save exam');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteExam = async (id) => {
    try {
      await apiClient.delete(`/exams/${id}`);
      setFeedback({ type: 'success', message: 'Exam deleted successfully.' });
      fetchExams();
    } catch (err) {
      alert(err.message);
    }
  };

  // =========================================================================
  // VIEW MODE: FULL-PAGE CREATE / EDIT EXAM FORM (No Modals!)
  // =========================================================================
  if (viewMode === 'create' || viewMode === 'edit') {
    const isEditing = viewMode === 'edit';

    return (
      <div className="space-y-6 pb-16 font-sans max-w-4xl mx-auto animate-in fade-in duration-200">
        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-indigo-600 px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>← Back to Exams</span>
            </button>
            <div>
              <h2 className="text-xl font-black text-slate-900 leading-tight">
                {isEditing ? `Edit Exam: ${editingExam?.title}` : 'Create New Olympiad Exam'}
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Configure timing, questions, anti-cheat limits, and instant publishing.
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
              onClick={handleSaveExam}
            >
              {isEditing ? 'Save Changes' : 'Publish Exam'}
            </Button>
          </div>
        </div>

        <form onSubmit={handleSaveExam} className="space-y-6">
          {/* SECTION 1: Basic Information & Academic Mapping */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs">
            <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-slate-100">
              <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs">
                1
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Exam Details &amp; Academic Scope</h3>
                <p className="text-[11px] text-slate-400">Title, unique code, target class and subject</p>
              </div>
            </div>

            {/* Author Teacher / Faculty Name Banner */}
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
                    {isEditing ? (editingExam?.author_name || user?.full_name || 'Faculty Member') : (user?.full_name || 'Faculty Member')}
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

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div className="sm:col-span-2">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Exam Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={examForm.title}
                  onChange={(e) => setExamForm({ ...examForm, title: e.target.value })}
                  placeholder="e.g. National Mathematics Olympiad 2026"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Exam Code
                </label>
                <input
                  type="text"
                  value={examForm.exam_code}
                  onChange={(e) => setExamForm({ ...examForm, exam_code: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Exam Type
                </label>
                <select
                  value={examForm.exam_type}
                  onChange={(e) => setExamForm({ ...examForm, exam_type: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="mock">Mock Olympiad</option>
                  <option value="practice">Practice Test</option>
                  <option value="free_trial">Free Trial</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Target Class <span className="text-rose-500">*</span>
                </label>
                <select
                  required
                  value={examForm.class_id}
                  onChange={(e) => setExamForm({ ...examForm, class_id: e.target.value })}
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
                  value={examForm.subject_id}
                  onChange={(e) => setExamForm({ ...examForm, subject_id: e.target.value })}
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
                  Status
                </label>
                <select
                  value={examForm.status}
                  onChange={(e) => setExamForm({ ...examForm, status: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-emerald-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="published">● Published (Live for Students)</option>
                  <option value="draft">Draft (Hidden)</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>
          </div>

          {/* SECTION 2: Timing, Passing & Security */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs">
            <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-slate-100">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
                2
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Timing, Passing &amp; Security Controls</h3>
                <p className="text-[11px] text-slate-400">Duration, passing threshold and anti-cheat limit</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Duration (Minutes) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  value={examForm.duration_minutes}
                  onChange={(e) => setExamForm({ ...examForm, duration_minutes: parseInt(e.target.value) || 0 })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Passing Percentage (%)
                </label>
                <input
                  type="number"
                  value={examForm.passing_percentage}
                  onChange={(e) => setExamForm({ ...examForm, passing_percentage: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Attempt Limit per Student
                </label>
                <input
                  type="number"
                  value={examForm.attempt_limit}
                  onChange={(e) => setExamForm({ ...examForm, attempt_limit: parseInt(e.target.value) || 0 })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Tab Switch Limit
                </label>
                <input
                  type="number"
                  value={examForm.tab_switch_limit}
                  onChange={(e) => setExamForm({ ...examForm, tab_switch_limit: parseInt(e.target.value) || 0 })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Toggles */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-slate-50/70 border border-slate-200 rounded-2xl mt-4 text-xs font-semibold text-slate-700">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={!!examForm.negative_marking}
                  onChange={(e) => setExamForm({ ...examForm, negative_marking: e.target.checked ? 1 : 0 })}
                  className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                />
                <span>Enable Negative Marking</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={!!examForm.randomize_questions}
                  onChange={(e) => setExamForm({ ...examForm, randomize_questions: e.target.checked ? 1 : 0 })}
                  className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                />
                <span>Shuffle Questions</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={!!examForm.certificate_eligibility}
                  onChange={(e) => setExamForm({ ...examForm, certificate_eligibility: e.target.checked ? 1 : 0 })}
                  className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                />
                <span>Issue Merit Certificate</span>
              </label>
            </div>
          </div>

          {/* SECTION 3: Select Questions from Question Bank */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-xs">
                  3
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Select Questions from Question Bank</h3>
                  <p className="text-[11px] text-slate-400">Choose which MCQs to include in this exam</p>
                </div>
              </div>

              <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-xl border border-indigo-100">
                {examForm.question_ids.length} Questions Selected
              </span>
            </div>

            {allQuestions.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                No questions found in Question Bank.
              </div>
            ) : (
              <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                {allQuestions.map((q) => {
                  const isSelected = examForm.question_ids.includes(q.id);

                  return (
                    <label
                      key={q.id}
                      className={`flex items-start gap-3 p-3.5 rounded-2xl border transition-all cursor-pointer text-xs ${
                        isSelected
                          ? 'bg-indigo-50/50 border-indigo-300 ring-2 ring-indigo-500/10'
                          : 'bg-slate-50/60 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleQuestionSelection(q.id)}
                        className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-slate-500 text-[10px]">#{q.id}</span>
                          <span className="px-2 py-0.5 rounded bg-white border border-slate-200 text-[10px] font-bold text-slate-700">
                            {q.class_name} • {q.subject_name}
                          </span>
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                            +{q.marks} Marks
                          </span>
                        </div>
                        <p className="font-semibold text-slate-900 line-clamp-2 leading-relaxed">
                          {q.question_text}
                        </p>
                      </div>
                    </label>
                  );
                })}
              </div>
            )}
          </div>

          {/* SECTION 4: Instructions for Candidates */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs">
            <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-slate-100">
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-xs">
                4
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Instructions for Candidates</h3>
                <p className="text-[11px] text-slate-400">Rules displayed before student clicks Start Exam</p>
              </div>
            </div>

            <textarea
              rows={3}
              value={examForm.instructions}
              onChange={(e) => setExamForm({ ...examForm, instructions: e.target.value })}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed"
            />
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
              {isEditing ? 'Save Changes' : 'Publish Exam'}
            </Button>
          </div>
        </form>
      </div>
    );
  }

  // =========================================================================
  // VIEW MODE: MAIN EXAM MANAGEMENT TABLE / GRID
  // =========================================================================
  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2.5">
            <FileSpreadsheet className="w-7 h-7 text-indigo-600" />
            <span>Olympiad &amp; Examination Management</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Author, schedule, configure proctoring, and publish live national Olympiads.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <Button
            variant="secondary"
            size="sm"
            icon={Download}
            onClick={handleDownloadExamsTemplate}
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
            variant="secondary"
            size="sm"
            icon={Download}
            onClick={handleExportExamsCSV}
          >
            Export CSV
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={Plus}
            onClick={handleOpenCreate}
          >
            + Create New Exam
          </Button>
        </div>
      </div>

      {feedback.message && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-2xl flex items-center justify-between shadow-xs">
          <span>{feedback.message}</span>
          <button onClick={() => setFeedback({ type: '', message: '' })} className="font-bold ml-4">✕</button>
        </div>
      )}

      {/* Filter & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {['', 'mock', 'practice', 'free_trial'].map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setFilterType(type)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                filterType === type
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200'
              }`}
            >
              {type === '' ? 'All Types' : type.replace('_', ' ').toUpperCase()}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search exams by title or code..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Exams Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading ? (
          [1, 2, 3].map(i => <div key={i} className="h-48 bg-slate-200 rounded-3xl animate-pulse" />)
        ) : exams.length === 0 ? (
          <div className="col-span-full bg-white rounded-3xl border border-slate-200 p-12 text-center text-slate-400 text-xs">
            <FileSpreadsheet className="w-12 h-12 mx-auto mb-2 text-slate-300" />
            <p className="font-semibold text-slate-600">No exams configured yet.</p>
            <p className="mt-1">Click "+ Create New Exam" above to publish your first Olympiad.</p>
          </div>
        ) : (
          exams.map((exam) => (
            <div
              key={exam.id}
              className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100 uppercase tracking-wider">
                    {exam.exam_type?.replace('_', ' ')}
                  </span>
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    exam.status === 'published' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-600'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${exam.status === 'published' ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                    {exam.status?.toUpperCase()}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 leading-snug">{exam.title}</h3>
                <div className="flex items-center gap-2 flex-wrap mt-1">
                  <p className="text-[11px] font-mono text-indigo-600 font-bold">{exam.exam_code}</p>
                  {exam.class_name && (
                    <span className="text-[10px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                      {exam.class_name} {exam.subject_name ? `• ${exam.subject_name}` : ''}
                    </span>
                  )}
                </div>

                {/* Teacher / Author Name Badge */}
                <div className="flex items-center gap-1.5 mt-2 text-[11px] font-bold text-[#6b21a8] bg-[#faf5ff] px-2.5 py-1 rounded-xl border border-[#e9d5ff] w-fit shadow-2xs">
                  <User className="w-3.5 h-3.5 text-[#9333ea] shrink-0" />
                  <span>Teacher: {exam.author_name || 'Super Admin'}</span>
                </div>

                <p className="text-xs text-slate-500 mt-2 line-clamp-2">
                  {exam.description || 'National competitive test format.'}
                </p>

                {/* Meta details */}
                <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-100 text-center text-xs">
                  <div className="p-2 bg-slate-50 rounded-2xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 block font-bold">Questions</span>
                    <span className="font-bold text-slate-800">{exam.total_questions || 1}</span>
                  </div>
                  <div className="p-2 bg-slate-50 rounded-2xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 block font-bold">Duration</span>
                    <span className="font-bold text-slate-800">{exam.duration_minutes}m</span>
                  </div>
                  <div className="p-2 bg-slate-50 rounded-2xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 block font-bold">Attempts</span>
                    <span className="font-bold text-emerald-600">{exam.total_attempts_count || 0}</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] font-medium text-slate-400">
                  Pass: {parseFloat(exam.passing_percentage)}%
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(exam)}
                    title="Edit Exam"
                    className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteExam(exam.id)}
                    title="Delete Exam"
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Bulk Exams Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-slate-200 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Upload className="w-5 h-5 text-indigo-600" />
                <span>Import Examinations (CSV / JSON)</span>
              </h3>
              <button onClick={() => setShowImportModal(false)} className="text-slate-400 hover:text-slate-600 font-bold cursor-pointer">✕</button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1.5">Choose CSV File</label>
                <input
                  type="file"
                  accept=".csv,.json"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = (evt) => setImportText(evt.target.result);
                    reader.readAsText(file);
                  }}
                  className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1.5">Or Paste Raw CSV / JSON Data</label>
                <textarea
                  rows={5}
                  value={importText}
                  onChange={(e) => setImportText(e.target.value)}
                  placeholder="title,exam_code,exam_type,duration_minutes,passing_percentage,instructions,status&#10;National Science Olympiad,NSO-2026,mock,60,40.0,Follow rules.,published"
                  className="w-full px-3 py-2 font-mono text-[11px] border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button variant="secondary" size="sm" onClick={() => setShowImportModal(false)}>Cancel</Button>
                <Button variant="primary" size="sm" loading={importLoading} onClick={handleImportExamsSubmit}>
                  Upload &amp; Save Exams
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
