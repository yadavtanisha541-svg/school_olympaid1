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
  Check
} from 'lucide-react';
import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge';
import { Modal } from '../../components/Modal';

export const ExamManagementPage = () => {
  const [exams, setExams] = useState([]);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [allQuestions, setAllQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('');

  // Modals
  const [showExamModal, setShowExamModal] = useState(false);
  const [editingExam, setEditingExam] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Form State
  const [examForm, setExamForm] = useState({
    title: '',
    exam_code: '',
    exam_type: 'practice',
    description: '',
    instructions: 'Read all questions carefully. Choose the single best answer for each question.',
    class_id: '',
    subject_id: '',
    duration_minutes: 60,
    passing_percentage: 40.0,
    negative_marking: 0,
    default_negative_marks: 0.25,
    attempt_limit: 1,
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
      exam_code: 'EXAM-' + Math.floor(1000 + Math.random() * 9000),
      exam_type: 'practice',
      description: '',
      instructions: '1. Each question has 4 options with exactly one correct answer.\n2. Do not switch browser tabs during the examination.',
      class_id: classes[0]?.id || '',
      subject_id: subjects[0]?.id || '',
      duration_minutes: 45,
      passing_percentage: 40.0,
      negative_marking: 1,
      default_negative_marks: 0.25,
      attempt_limit: 2,
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
      question_ids: allQuestions.slice(0, 5).map(q => q.id)
    });
    setShowExamModal(true);
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
        setShowExamModal(true);
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const handleSaveExam = async (e) => {
    e.preventDefault();
    if (examForm.question_ids.length === 0) {
      alert('Please select at least one question for this examination.');
      return;
    }

    setActionLoading(true);
    try {
      if (editingExam) {
        await apiClient.put(`/exams/${editingExam.id}`, examForm);
      } else {
        await apiClient.post('/exams', examForm);
      }
      setShowExamModal(false);
      fetchExams();
    } catch (err) {
      alert(err.message || 'Error saving exam');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteExam = async (id) => {
    if (!confirm('Are you sure you want to delete this exam?')) return;
    try {
      await apiClient.delete(`/exams/${id}`);
      fetchExams();
    } catch (err) {
      alert(err.message);
    }
  };

  const toggleQuestionSelection = (qId) => {
    setExamForm((prev) => {
      const exists = prev.question_ids.includes(qId);
      return {
        ...prev,
        question_ids: exists
          ? prev.question_ids.filter(id => id !== qId)
          : [...prev.question_ids, qId]
      };
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-slate-900">
            Exam & Olympiad Management
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Configure free trials, practice tests, mocks, paid exams, proctoring security rules and timers.
          </p>
        </div>

        <Button variant="primary" size="sm" icon={Plus} onClick={handleOpenCreate}>
          Create New Exam
        </Button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {['', 'free_trial', 'practice', 'mock', 'paid'].map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setFilterType(type)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filterType === type
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-600'
              }`}
            >
              {type === '' ? 'All Types' : type.replace('_', ' ').toUpperCase()}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search exams..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-brand-500"
          />
        </div>
      </div>

      {/* Exams Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading ? (
          [1, 2, 3].map(i => <div key={i} className="h-48 bg-slate-200 rounded-2xl animate-pulse" />)
        ) : exams.length === 0 ? (
          <div className="col-span-full bg-white rounded-2xl border p-12 text-center text-slate-400">
            <FileSpreadsheet className="w-12 h-12 mx-auto mb-2 text-slate-300" />
            <p className="text-sm font-semibold text-slate-600">No exams configured</p>
          </div>
        ) : (
          exams.map((exam) => (
            <div
              key={exam.id}
              className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:shadow-card-hover transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <Badge variant={exam.exam_type} size="sm">
                    {exam.exam_type.replace('_', ' ').toUpperCase()}
                  </Badge>
                  <Badge variant={exam.status === 'published' ? 'published' : 'draft'} size="sm">
                    {exam.status.toUpperCase()}
                  </Badge>
                </div>

                <h3 className="text-base font-bold text-slate-900 leading-snug">{exam.title}</h3>
                <p className="text-xs font-mono text-brand-600 mt-0.5">{exam.exam_code}</p>

                <p className="text-xs text-slate-500 mt-2 line-clamp-2">
                  {exam.description || 'National competitive test format.'}
                </p>

                {/* Meta details */}
                <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-100 text-center text-xs">
                  <div className="p-2 bg-slate-50 rounded-xl">
                    <span className="text-[10px] text-slate-400 block font-bold">Questions</span>
                    <span className="font-bold text-slate-800">{exam.total_questions}</span>
                  </div>
                  <div className="p-2 bg-slate-50 rounded-xl">
                    <span className="text-[10px] text-slate-400 block font-bold">Duration</span>
                    <span className="font-bold text-slate-800">{exam.duration_minutes}m</span>
                  </div>
                  <div className="p-2 bg-slate-50 rounded-xl">
                    <span className="text-[10px] text-slate-400 block font-bold">Attempts</span>
                    <span className="font-bold text-emerald-600">{exam.total_attempts_count || 0}</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  Pass: {parseFloat(exam.passing_percentage)}%
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(exam)}
                    className="p-1.5 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteExam(exam.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* CREATE / EDIT EXAM MODAL */}
      <Modal
        isOpen={showExamModal}
        onClose={() => setShowExamModal(false)}
        title={editingExam ? 'Edit Examination' : 'Create New Examination'}
        subtitle="Configure duration, questions, passing threshold, proctoring security and grading"
        maxWidth="max-w-3xl"
        footer={
          <div className="flex items-center justify-end gap-3 w-full">
            <Button variant="secondary" onClick={() => setShowExamModal(false)}>Cancel</Button>
            <Button variant="primary" loading={actionLoading} onClick={handleSaveExam}>Save & Publish Exam</Button>
          </div>
        }
      >
        <form onSubmit={handleSaveExam} className="space-y-4 text-xs">
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label className="block font-bold text-slate-700 uppercase mb-1">Exam Title *</label>
              <input
                type="text"
                required
                value={examForm.title}
                onChange={(e) => setExamForm({ ...examForm, title: e.target.value })}
                placeholder="e.g. National Mathematics Olympiad 2026"
                className="w-full px-3 py-2 border rounded-xl"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Exam Type</label>
              <select
                value={examForm.exam_type}
                onChange={(e) => setExamForm({ ...examForm, exam_type: e.target.value })}
                className="w-full px-3 py-2 border rounded-xl font-bold"
              >
                <option value="practice">Practice Test</option>
                <option value="mock">Mock Test</option>
                <option value="free_trial">Free Trial</option>
                <option value="paid">Paid Exam (Modular)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-3">
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Duration (Mins) *</label>
              <input
                type="number"
                required
                value={examForm.duration_minutes}
                onChange={(e) => setExamForm({ ...examForm, duration_minutes: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border rounded-xl"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Passing %</label>
              <input
                type="number"
                value={examForm.passing_percentage}
                onChange={(e) => setExamForm({ ...examForm, passing_percentage: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 border rounded-xl"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Attempt Limit</label>
              <input
                type="number"
                value={examForm.attempt_limit}
                onChange={(e) => setExamForm({ ...examForm, attempt_limit: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border rounded-xl"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Tab Switch Limit</label>
              <input
                type="number"
                value={examForm.tab_switch_limit}
                onChange={(e) => setExamForm({ ...examForm, tab_switch_limit: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border rounded-xl"
              />
            </div>
          </div>

          {/* Toggles */}
          <div className="grid grid-cols-3 gap-3 p-3 bg-slate-50 border rounded-2xl">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={!!examForm.negative_marking}
                onChange={(e) => setExamForm({ ...examForm, negative_marking: e.target.checked ? 1 : 0 })}
                className="rounded text-brand-600"
              />
              <span className="font-semibold text-slate-700">Negative Marking</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={!!examForm.randomize_questions}
                onChange={(e) => setExamForm({ ...examForm, randomize_questions: e.target.checked ? 1 : 0 })}
                className="rounded text-brand-600"
              />
              <span className="font-semibold text-slate-700">Shuffle Questions</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={!!examForm.certificate_eligibility}
                onChange={(e) => setExamForm({ ...examForm, certificate_eligibility: e.target.checked ? 1 : 0 })}
                className="rounded text-brand-600"
              />
              <span className="font-semibold text-slate-700">Issue Certificate</span>
            </label>
          </div>

          {/* Question Selector List */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block font-bold text-slate-700 uppercase">
                Select Exam Questions ({examForm.question_ids.length} selected)
              </label>
              <span className="text-[11px] text-brand-600 font-semibold">
                Available Questions in Bank: {allQuestions.length}
              </span>
            </div>

            <div className="border border-slate-200 rounded-xl p-2 max-h-48 overflow-y-auto space-y-1.5 bg-slate-50/50">
              {allQuestions.map((q) => {
                const isSelected = examForm.question_ids.includes(q.id);
                return (
                  <label
                    key={q.id}
                    className={`flex items-start gap-2.5 p-2 rounded-lg border transition-colors cursor-pointer text-xs ${
                      isSelected ? 'bg-brand-50/80 border-brand-300' : 'bg-white border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleQuestionSelection(q.id)}
                      className="mt-0.5 rounded text-brand-600"
                    />
                    <div className="flex-1">
                      <span className="font-bold text-slate-900 line-clamp-1">{q.question_text}</span>
                      <span className="text-[10px] text-slate-500">{q.subject_name} • {q.difficulty} • +{q.marks} Marks</span>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase mb-1">Instructions for Candidates</label>
            <textarea
              rows={2}
              value={examForm.instructions}
              onChange={(e) => setExamForm({ ...examForm, instructions: e.target.value })}
              className="w-full px-3 py-2 border rounded-xl"
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};
