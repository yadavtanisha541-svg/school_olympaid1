import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { apiClient } from '../../api/client';
import {
  ShoppingBag,
  Package,
  Plus,
  Search,
  Filter,
  Eye,
  Trash2,
  Edit,
  CheckCircle2,
  DollarSign,
  TrendingUp,
  Calendar,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  Check,
  X,
  CreditCard,
  User,
  BookOpen,
  Sparkles,
  Download,
  Printer,
  Flame,
  Percent,
  Tag,
  HelpCircle,
  Info,
  Clock,
  RotateCcw,
  FileText,
  Play,
  FileCheck2,
  Trophy,
  ArrowLeft,
  Award,
  Bookmark
} from 'lucide-react';

const CLASSES_LIST = [
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

const SUBJECTS_LIST = [
  { code: 'ALL', label: 'All Subjects', name: 'All Olympiads Combined' },
  { code: 'IMO', label: 'IMO (Maths)', name: 'IMO (Mathematics Olympiad)' },
  { code: 'ISO', label: 'ISO (Science)', name: 'ISO (Science Olympiad)' },
  { code: 'ICSO', label: 'ICSO (Cyber)', name: 'ICSO (Cyber & AI Olympiad)' },
  { code: 'IEO', label: 'IEO (English)', name: 'IEO (English Olympiad)' },
  { code: 'IGKO', label: 'IGKO (GK)', name: 'IGKO (General Knowledge)' },
  { code: 'ISSO', label: 'ISSO (Reasoning)', name: 'ISSO (Social Studies & Reasoning)' }
];

const PAPER_CATEGORIES = [
  { id: 'all', label: 'All Papers' },
  { id: 'previous_year', label: '🏆 Free Previous Year Papers' },
  { id: 'sample_paper', label: '📄 Free Sample Papers' },
  { id: 'mock_test', label: '📝 Mock Test Series' },
  { id: 'test_generator', label: '⚡ Test Generator Pro' }
];

export const SuperAdminPackagesManager = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('exam_papers'); // 'exam_papers' | 'packages' | 'orders'

  // Common Filters
  const [packageClassFilter, setPackageClassFilter] = useState('All');
  const [packageSubjectFilter, setPackageSubjectFilter] = useState('ALL');
  const [paperCategoryFilter, setPaperCategoryFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // ==========================================
  // 1. EXAM PAPERS & MOCK TESTS STATE
  // ==========================================
  const [examPapers, setExamPapers] = useState([]);
  const [loadingExamPapers, setLoadingExamPapers] = useState(false);
  const [isAuthoringPaper, setIsAuthoringPaper] = useState(false); // Full-page studio state
  const [editingPaper, setEditingPaper] = useState(null);
  const [paperModalTab, setPaperModalTab] = useState('details'); // 'details' | 'questions' | 'bulk'

  // Exam Paper Form Fields
  const [paperTitle, setPaperTitle] = useState('');
  const [paperShortCode, setPaperShortCode] = useState('');
  const [paperClass, setPaperClass] = useState('Class 6');
  const [paperSubjectCode, setPaperSubjectCode] = useState('IGKO');
  const [paperCategory, setPaperCategory] = useState('previous_year');
  const [paperYear, setPaperYear] = useState('2019');
  const [paperDuration, setPaperDuration] = useState('60');
  const [paperTotalMarks, setPaperTotalMarks] = useState('60');
  const [paperCutoffMarks, setPaperCutoffMarks] = useState('42');
  const [paperSections, setPaperSections] = useState(['General Awareness', 'Current Affairs', 'Life Skills', 'Achievers Section']);
  const [paperQuestions, setPaperQuestions] = useState([]);
  const [bulkQuestionsInput, setBulkQuestionsInput] = useState('');
  const [newSectionInput, setNewSectionInput] = useState('');

  // Fetch Exam Papers
  const fetchExamPapers = async () => {
    setLoadingExamPapers(true);
    try {
      const res = await apiClient.get('/exam-papers', {
        class: packageClassFilter,
        subject: packageSubjectFilter,
        category: 'all'
      });
      if (res && res.success && Array.isArray(res.data)) {
        setExamPapers(res.data);
      } else {
        setExamPapers([]);
      }
    } catch (e) {
      console.warn('Error fetching exam papers:', e);
      setExamPapers([]);
    } finally {
      setLoadingExamPapers(false);
    }
  };

  // Open Create Exam Paper (Full-Page View)
  const handleOpenCreatePaper = () => {
    setEditingPaper(null);
    setPaperModalTab('details');
    const defaultSub = packageSubjectFilter !== 'ALL' ? packageSubjectFilter : 'IGKO';
    const defaultCls = packageClassFilter !== 'All' ? packageClassFilter : 'Class 6';

    setPaperTitle(`${defaultCls} ${defaultSub} Previous Year Paper 2019`);
    setPaperShortCode(`${defaultSub} - 2019`);
    setPaperClass(defaultCls);
    setPaperSubjectCode(defaultSub);
    setPaperCategory('previous_year');
    setPaperYear('2019');
    setPaperDuration('60');
    setPaperTotalMarks('60');
    setPaperCutoffMarks('42');
    setPaperSections(['General Awareness', 'Current Affairs', 'Life Skills', 'Achievers Section']);
    setPaperQuestions([
      {
        id: 1,
        section: 'General Awareness',
        q: "World's first human to human heart transplant operation was conducted by _______.",
        options: ['Christiaan Barnard', 'Robert Koch', 'Antonie van Leeuwenhoek', 'Hans Christian Gram'],
        correct: 0,
        marks: 1,
        explanation: 'Dr. Christiaan Barnard performed the first human heart transplant in 1967 at Groote Schuur Hospital in Cape Town.'
      },
      {
        id: 2,
        section: 'General Awareness',
        q: 'Which strait separates India and Sri Lanka?',
        options: ['Palk Strait', 'Malacca Strait', 'Bering Strait', 'Gibraltar Strait'],
        correct: 0,
        marks: 1,
        explanation: 'The Palk Strait lies between Tamil Nadu state of India and Jaffna district in Sri Lanka.'
      }
    ]);
    setBulkQuestionsInput('');
    setIsAuthoringPaper(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Open Edit Exam Paper (Full-Page View)
  const handleOpenEditPaper = (p) => {
    setEditingPaper(p);
    setPaperModalTab('details');
    setPaperTitle(p.title || '');
    setPaperShortCode(p.short_code || '');
    setPaperClass(p.class_name || 'Class 6');
    setPaperSubjectCode(p.subject_code || 'IGKO');
    setPaperCategory(p.paper_category || 'previous_year');
    setPaperYear(p.exam_year || '2019');
    setPaperDuration(String(p.duration_minutes || 60));
    setPaperTotalMarks(String(p.total_marks || 60));
    setPaperCutoffMarks(String(p.cutoff_marks || 42));
    setPaperSections(Array.isArray(p.sections) && p.sections.length > 0 ? p.sections : ['General Awareness', 'Current Affairs', 'Achievers Section']);
    setPaperQuestions(Array.isArray(p.questions) ? p.questions : []);
    setBulkQuestionsInput('');
    setIsAuthoringPaper(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Toast Notification State
  const [toast, setToast] = useState(null);
  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Save Exam Paper
  const handleSavePaper = async (e) => {
    e?.preventDefault();
    if (!paperTitle.trim()) {
      showToast('Please enter a Paper Title', 'error');
      return;
    }
    try {
      const payload = {
        title: paperTitle,
        short_code: paperShortCode || `${paperSubjectCode} - ${paperYear}`,
        subject_code: paperSubjectCode,
        class_name: paperClass,
        paper_category: paperCategory,
        exam_year: paperYear,
        duration_minutes: Number(paperDuration) || 60,
        total_marks: Number(paperTotalMarks) || 60,
        cutoff_marks: Number(paperCutoffMarks) || 42,
        sections: paperSections,
        questions: paperQuestions
      };

      if (editingPaper) {
        await apiClient.put(`/exam-papers/${editingPaper.id}`, payload);
        showToast('✓ Model Test Exam Paper updated successfully!');
      } else {
        await apiClient.post('/exam-papers', payload);
        showToast('✓ New Model Test Exam Paper published to Student Dashboard!');
      }
      setIsAuthoringPaper(false);
      fetchExamPapers();
    } catch (err) {
      console.warn('Save paper error:', err);
      showToast('Failed to save paper. Please try again.', 'error');
    }
  };

  // Delete Exam Paper
  const handleDeletePaper = async (id) => {
    try {
      await apiClient.delete(`/exam-papers/${id}`);
      fetchExamPapers();
      showToast('✓ Exam Paper deleted successfully.', 'info');
    } catch (err) {
      console.warn('Delete error:', err);
      showToast('Failed to delete paper.', 'error');
    }
  };

  // Bulk Parse Helper
  const handleParseBulkQuestions = () => {
    if (!bulkQuestionsInput.trim()) return;
    const blocks = bulkQuestionsInput.split(/\n(?=Q\d+[\.:\s])/i);
    const parsed = [];
    blocks.forEach((blk, idx) => {
      const lines = blk.trim().split('\n');
      if (lines.length < 2) return;
      const qLine = lines[0].replace(/^Q\d+[\.:\s]*/i, '').trim();
      let optA = '', optB = '', optC = '', optD = '';
      let correct = 0;
      let exp = '';
      let marks = 1;
      let section = paperSections[0] || 'General Awareness';

      lines.slice(1).forEach((l) => {
        const tr = l.trim();
        if (/^A[\)\.:\s]/i.test(tr)) optA = tr.replace(/^A[\)\.:\s]*/i, '').trim();
        else if (/^B[\)\.:\s]/i.test(tr)) optB = tr.replace(/^B[\)\.:\s]*/i, '').trim();
        else if (/^C[\)\.:\s]/i.test(tr)) optC = tr.replace(/^C[\)\.:\s]*/i, '').trim();
        else if (/^D[\)\.:\s]/i.test(tr)) optD = tr.replace(/^D[\)\.:\s]*/i, '').trim();
        else if (/^Correct[\:\s]*/i.test(tr)) {
          const ans = tr.replace(/^Correct[\:\s]*/i, '').trim().toUpperCase();
          if (ans.includes('B')) correct = 1;
          else if (ans.includes('C')) correct = 2;
          else if (ans.includes('D')) correct = 3;
          else correct = 0;
        } else if (/^Explanation[\:\s]*/i.test(tr)) {
          exp = tr.replace(/^Explanation[\:\s]*/i, '').trim();
        } else if (/^Marks[\:\s]*/i.test(tr)) {
          marks = Number(tr.replace(/^Marks[\:\s]*/i, '').trim()) || 1;
        } else if (/^Section[\:\s]*/i.test(tr)) {
          section = tr.replace(/^Section[\:\s]*/i, '').trim();
        }
      });

      parsed.push({
        id: (paperQuestions.length || 0) + idx + 1,
        section: section || paperSections[0] || 'General Awareness',
        q: qLine,
        options: [optA || 'Option A', optB || 'Option B', optC || 'Option C', optD || 'Option D'],
        correct,
        marks,
        explanation: exp
      });
    });

    if (parsed.length > 0) {
      setPaperQuestions([...paperQuestions, ...parsed]);
      setBulkQuestionsInput('');
      setPaperModalTab('questions');
      showToast(`✓ Successfully added ${parsed.length} questions from template!`);
    } else {
      showToast('Could not parse questions. Please check the template format.', 'error');
    }
  };

  // Add Question to Paper
  const handleAddBlankQuestion = () => {
    const newQ = {
      id: paperQuestions.length + 1,
      section: paperSections[0] || 'General Awareness',
      q: 'New Question Text Here',
      options: ['Option A', 'Option B', 'Option C', 'Option D'],
      correct: 0,
      marks: 1,
      explanation: ''
    };
    setPaperQuestions([...paperQuestions, newQ]);
  };

  const handleUpdateQuestion = (idx, field, val) => {
    const updated = [...paperQuestions];
    updated[idx] = { ...updated[idx], [field]: val };
    setPaperQuestions(updated);
  };

  const handleUpdateQuestionOption = (qIdx, optIdx, val) => {
    const updated = [...paperQuestions];
    const opts = [...(updated[qIdx].options || ['', '', '', ''])];
    opts[optIdx] = val;
    updated[qIdx] = { ...updated[qIdx], options: opts };
    setPaperQuestions(updated);
  };

  const handleRemoveQuestion = (idx) => {
    setPaperQuestions(paperQuestions.filter((_, i) => i !== idx));
  };

  // ==========================================
  // 2. PACKAGES & ORDERS STATE
  // ==========================================
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [orderSearch, setOrderSearch] = useState('');
  const [orderClassFilter, setOrderClassFilter] = useState('All');

  const [packages, setPackages] = useState([]);
  const [loadingPackages, setLoadingPackages] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);

  const fetchPackages = async () => {
    setLoadingPackages(true);
    try {
      const res = await apiClient.get('/packages', {
        class: packageClassFilter,
        subject: packageSubjectFilter
      });
      if (res && res.success && Array.isArray(res.data)) {
        setPackages(res.data);
      } else {
        setPackages([]);
      }
    } catch (e) {
      console.warn('Error fetching packages:', e);
      setPackages([]);
    } finally {
      setLoadingPackages(false);
    }
  };

  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const res = await apiClient.get('/payment/orders', {
        search: orderSearch,
        class: orderClassFilter
      });
      if (res && res.success && res.data) {
        setOrders(res.data.orders || (Array.isArray(res.data) ? res.data : []));
      }
    } catch (e) {
      console.warn('Error fetching orders:', e);
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'exam_papers') {
      fetchExamPapers();
    } else if (activeTab === 'packages') {
      fetchPackages();
    } else if (activeTab === 'orders') {
      fetchOrders();
    }
  }, [activeTab, packageClassFilter, packageSubjectFilter, paperCategoryFilter, orderClassFilter, orderSearch]);

  // Helper to quickly create next Mock Test in a Subject Series
  const handleAddMockTestToSeries = (subjCode, clsName, currentCount = 0) => {
    setEditingPaper(null);
    setPaperModalTab('details');
    const nextNum = currentCount + 1;
    const sub = subjCode || (packageSubjectFilter !== 'ALL' ? packageSubjectFilter : 'IMO');
    const cls = clsName || (packageClassFilter !== 'All' ? packageClassFilter : 'Class 6');

    setPaperTitle(`${sub} Level-1 Mock Test ${nextNum} ${cls}`);
    setPaperShortCode(`${sub} - Mock ${nextNum}`);
    setPaperClass(cls);
    setPaperSubjectCode(sub);
    setPaperCategory('mock_test');
    setPaperYear('2026');
    setPaperDuration('60');
    setPaperTotalMarks('60');
    setPaperCutoffMarks('42');
    setPaperSections(['Logical Reasoning', 'Subject Knowledge', 'Achievers Section']);
    setPaperQuestions([
      {
        id: 1,
        section: 'Subject Knowledge',
        q: `${sub} Olympiad Mock Test ${nextNum} Sample Question`,
        options: ['Option A (Correct)', 'Option B', 'Option C', 'Option D'],
        correct: 0,
        marks: 1,
        explanation: 'Detailed step-by-step solution for students.'
      }
    ]);
    setBulkQuestionsInput('');
    setIsAuthoringPaper(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Group papers by Subject and Series Cover (All hooks MUST be declared before any conditional return!)
  const groupedSeries = useMemo(() => {
    const groups = {};
    const filtered = examPapers.filter((paper) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        paper.title?.toLowerCase().includes(q) ||
        paper.short_code?.toLowerCase().includes(q) ||
        paper.subject_code?.toLowerCase().includes(q) ||
        paper.class_name?.toLowerCase().includes(q)
      );
    });

    filtered.forEach((paper) => {
      const key = `${paper.class_name || 'Class 6'} - ${paper.subject_code || 'IMO'}`;
      if (!groups[key]) {
        groups[key] = {
          className: paper.class_name || 'Class 6',
          subjectCode: paper.subject_code || 'IMO',
          seriesTitle: `${paper.class_name || 'Class 6'} - All India ${paper.subject_code || 'IMO'} Mock Test Series`,
          papers: []
        };
      }
      groups[key].papers.push(paper);
    });
    return Object.values(groups);
  }, [examPapers, searchQuery]);

  // =========================================================================
  // VIEW: FULL-PAGE PAPER AUTHORING STUDIO (Opened as a Full Page)
  // =========================================================================
  if (isAuthoringPaper) {
    return (
      <div className="min-h-screen bg-slate-50 font-sans pb-24 animate-in fade-in duration-150 space-y-6 relative">
        {/* Floating Toast Notification */}
        {toast && (
          <div className="fixed top-5 right-5 z-50 animate-in fade-in slide-in-from-top duration-200">
            <div
              className={`px-5 py-3 rounded-2xl shadow-xl font-black text-xs flex items-center gap-2 border ${
                toast.type === 'error'
                  ? 'bg-rose-600 text-white border-rose-700 shadow-rose-200'
                  : toast.type === 'info'
                  ? 'bg-slate-800 text-white border-slate-900 shadow-slate-200'
                  : 'bg-emerald-600 text-white border-emerald-700 shadow-emerald-200'
              }`}
            >
              <span>{toast.msg}</span>
            </div>
          </div>
        )}

        {/* Top Sticky Header */}
        <div className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-2xs">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsAuthoringPaper(false)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer shadow-2xs"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Model Papers List</span>
              </button>
              <div className="h-5 w-px bg-slate-200 hidden sm:block" />
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-[#6d3a68] block">
                  Subject Model Test Studio
                </span>
                <h1 className="text-base sm:text-xl font-black text-slate-900 leading-tight">
                  {editingPaper ? `Edit: ${paperTitle || 'Model Test Paper'}` : 'Create Subject Model Test Exam Paper'}
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => setIsAuthoringPaper(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSavePaper}
                className="px-6 py-2 rounded-xl bg-[#00b074] hover:bg-[#009260] text-white font-black text-xs shadow-md active:scale-95 cursor-pointer flex items-center gap-1.5 transition-all"
              >
                <Check className="w-4 h-4" />
                <span>Publish Paper to Student Dashboard</span>
              </button>
            </div>
          </div>
        </div>

        {/* Studio Body Container */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
          {/* Sub-Tabs Bar */}
          <div className="bg-white rounded-2xl p-2 border border-slate-200 shadow-2xs flex items-center gap-2 overflow-x-auto">
            {[
              { id: 'details', label: '1. Paper Info & Timing' },
              { id: 'questions', label: `2. Questions & Options (${paperQuestions.length})` },
              { id: 'bulk', label: '3. Bulk Paste Questions 📋' }
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setPaperModalTab(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
                  paperModalTab === tab.id
                    ? 'bg-[#4e2a4a] text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* TAB 1: BASIC PAPER DETAILS */}
          {paperModalTab === 'details' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-sm font-black text-slate-900">Paper Basic Information &amp; Configuration</h3>
                <p className="text-xs text-slate-500">Configure grade, subject, duration, and section header tags.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-black text-slate-700 mb-1.5">
                    Paper Full Title * (Shown on Yellow Top Banner in Student Card)
                  </label>
                  <input
                    type="text"
                    value={paperTitle}
                    onChange={(e) => setPaperTitle(e.target.value)}
                    placeholder="e.g. Class 6 IGKO Previous Year Paper 2019"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-[#6d3a68] outline-none shadow-2xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 mb-1.5">
                    Short Code (Shown in Green Pill Badge on Card)
                  </label>
                  <input
                    type="text"
                    value={paperShortCode}
                    onChange={(e) => setPaperShortCode(e.target.value)}
                    placeholder="e.g. IGKO - 2019"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-800 outline-none shadow-2xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 mb-1.5">Subject Olympiad *</label>
                  <select
                    value={paperSubjectCode}
                    onChange={(e) => setPaperSubjectCode(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-800 bg-white cursor-pointer shadow-2xs"
                  >
                    {SUBJECTS_LIST.filter((s) => s.code !== 'ALL').map((s) => (
                      <option key={s.code} value={s.code}>
                        {s.code} - {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 mb-1.5">Grade Level / Class *</label>
                  <select
                    value={paperClass}
                    onChange={(e) => setPaperClass(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-800 bg-white cursor-pointer shadow-2xs"
                  >
                    {CLASSES_LIST.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 mb-1.5">Paper Category *</label>
                  <select
                    value={paperCategory}
                    onChange={(e) => setPaperCategory(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-800 bg-white cursor-pointer shadow-2xs"
                  >
                    <option value="previous_year">🏆 Free Previous Year Paper (PYQ)</option>
                    <option value="sample_paper">📄 Free Official Sample Paper</option>
                    <option value="mock_test">📝 Full-Length Mock Test Series</option>
                    <option value="test_generator">⚡ Test Generator Pro</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 mb-1.5">Exam Duration (Minutes)</label>
                  <input
                    type="number"
                    value={paperDuration}
                    onChange={(e) => setPaperDuration(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-800 outline-none shadow-2xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 mb-1.5">Total Marks</label>
                  <input
                    type="number"
                    value={paperTotalMarks}
                    onChange={(e) => setPaperTotalMarks(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-800 outline-none shadow-2xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 mb-1.5">Last Year Cutoff Marks (Scorecard Box 3)</label>
                  <input
                    type="number"
                    value={paperCutoffMarks}
                    onChange={(e) => setPaperCutoffMarks(e.target.value)}
                    placeholder="e.g. 42"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-800 outline-none shadow-2xs"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-black text-slate-700 mb-1.5">
                    Exam Sections (Shown on Top Header of Exam Screen)
                  </label>
                  <div className="flex flex-wrap gap-2 items-center p-3 rounded-2xl bg-slate-50 border border-slate-200">
                    {paperSections.map((sec, sIdx) => (
                      <span
                        key={sIdx}
                        className="px-3 py-1.5 rounded-xl bg-purple-100 text-[#4e2a4a] border border-purple-300 text-xs font-black flex items-center gap-2"
                      >
                        {sec}
                        <button
                          type="button"
                          onClick={() => setPaperSections(paperSections.filter((_, i) => i !== sIdx))}
                          className="text-slate-400 hover:text-red-600 cursor-pointer font-black"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                    <div className="flex items-center gap-1.5">
                      <input
                        type="text"
                        placeholder="+ Add new section"
                        value={newSectionInput}
                        onChange={(e) => setNewSectionInput(e.target.value)}
                        className="px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-semibold outline-none w-44 bg-white"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (!newSectionInput.trim()) return;
                          setPaperSections([...paperSections, newSectionInput.trim()]);
                          setNewSectionInput('');
                        }}
                        className="px-3 py-1.5 bg-[#4e2a4a] text-white rounded-xl text-xs font-bold cursor-pointer hover:bg-[#3d203a]"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: QUESTIONS & OPTIONS EDITOR */}
          {paperModalTab === 'questions' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
              <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-sm font-black text-slate-900">Questions List ({paperQuestions.length})</h3>
                  <p className="text-xs text-slate-500">Each question supports 4 choices with colored indicators.</p>
                </div>
                <button
                  type="button"
                  onClick={handleAddBlankQuestion}
                  className="px-4 py-2 rounded-xl bg-[#00b074] hover:bg-[#009260] text-white text-xs font-black cursor-pointer flex items-center gap-1.5 shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Question</span>
                </button>
              </div>

              <div className="space-y-4">
                {paperQuestions.map((q, qIdx) => (
                  <div key={qIdx} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 shadow-2xs">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <span className="w-7 h-7 rounded-xl bg-[#4e2a4a] text-white text-xs font-black flex items-center justify-center">
                          {qIdx + 1}
                        </span>
                        <span className="text-xs font-bold text-slate-500">Section:</span>
                        <select
                          value={q.section || paperSections[0]}
                          onChange={(e) => handleUpdateQuestion(qIdx, 'section', e.target.value)}
                          className="px-2.5 py-1 rounded-lg border border-slate-300 text-xs font-bold bg-white cursor-pointer"
                        >
                          {paperSections.map((sec) => (
                            <option key={sec} value={sec}>
                              {sec}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-slate-500">Marks:</span>
                          <input
                            type="number"
                            value={q.marks || 1}
                            onChange={(e) => handleUpdateQuestion(qIdx, 'marks', Number(e.target.value) || 1)}
                            className="w-16 px-2 py-1 rounded-lg border border-slate-300 text-xs font-bold text-center bg-white"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveQuestion(qIdx)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 cursor-pointer"
                          title="Delete Question"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Question Text:</label>
                      <textarea
                        rows={2}
                        value={q.q || ''}
                        onChange={(e) => handleUpdateQuestion(qIdx, 'q', e.target.value)}
                        className="w-full p-3 rounded-xl border border-slate-300 text-xs font-semibold outline-none bg-white focus:ring-2 focus:ring-[#6d3a68]"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {['A', 'B', 'C', 'D'].map((optLabel, optIdx) => (
                        <div key={optIdx} className="flex items-center gap-2 bg-white p-2 rounded-xl border border-slate-200">
                          <label className="flex items-center gap-2 text-xs font-black shrink-0 cursor-pointer">
                            <input
                              type="radio"
                              name={`correct_q_${qIdx}`}
                              checked={Number(q.correct) === optIdx}
                              onChange={() => handleUpdateQuestion(qIdx, 'correct', optIdx)}
                              className="w-4 h-4 accent-emerald-600 cursor-pointer"
                            />
                            <span className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-black ${
                              optIdx === 0 ? 'bg-[#e84393] text-white' :
                              optIdx === 1 ? 'bg-[#e67e22] text-white' :
                              optIdx === 2 ? 'bg-[#00cec9] text-white' :
                              'bg-[#9b59b6] text-white'
                            }`}>
                              {optLabel}
                            </span>
                          </label>
                          <input
                            type="text"
                            value={(q.options && q.options[optIdx]) || ''}
                            onChange={(e) => handleUpdateQuestionOption(qIdx, optIdx, e.target.value)}
                            placeholder={`Option ${optLabel}`}
                            className="w-full px-2 py-1 text-xs font-medium outline-none bg-transparent"
                          />
                        </div>
                      ))}
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 mb-1">Explanation / Solution:</label>
                      <input
                        type="text"
                        value={q.explanation || ''}
                        onChange={(e) => handleUpdateQuestion(qIdx, 'explanation', e.target.value)}
                        placeholder="Detailed explanation for answer key"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-700 bg-white outline-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: BULK QUESTIONS PASTE */}
          {paperModalTab === 'bulk' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-slate-100">
                <div>
                  <h3 className="text-sm font-black text-slate-900">Paste Questions in Bulk</h3>
                  <p className="text-xs text-slate-500">Quickly import 10-50 questions by copying and pasting standard formatted text.</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setBulkQuestionsInput(`Q1. What is the value of Roman numeral CLXVIII?
A) 168
B) 148
C) 178
D) 158
Correct: A
Explanation: C=100, L=50, X=10, VIII=8 => 168
Marks: 1
Section: General Awareness

Q2. Which planet is known as the Red Planet?
A) Venus
B) Mars
C) Jupiter
D) Saturn
Correct: B
Explanation: Mars has iron oxide on surface.
Marks: 1
Section: General Awareness`);
                  }}
                  className="px-3.5 py-1.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-xl text-xs font-black hover:bg-blue-100 cursor-pointer"
                >
                  Load Sample Template
                </button>
              </div>

              <textarea
                rows={14}
                value={bulkQuestionsInput}
                onChange={(e) => setBulkQuestionsInput(e.target.value)}
                placeholder="Q1. Question text here...&#10;A) Option 1&#10;B) Option 2&#10;C) Option 3&#10;D) Option 4&#10;Correct: A&#10;Explanation: ...&#10;Marks: 1"
                className="w-full p-4 rounded-2xl border border-slate-300 font-mono text-xs text-slate-800 outline-none focus:ring-2 focus:ring-[#6d3a68] bg-slate-50"
              />

              <button
                type="button"
                onClick={handleParseBulkQuestions}
                className="w-full py-3 rounded-xl bg-[#6d3a68] hover:bg-[#582d54] text-white font-black text-xs shadow-md cursor-pointer flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Parse &amp; Append Questions to Paper</span>
              </button>
            </div>
          )}
        </div>

        {/* Bottom Fixed Footer Bar */}
        <div className="bg-white border-t border-slate-200 fixed bottom-0 left-0 right-0 z-30 shadow-lg p-3 sm:p-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <span className="text-xs font-bold text-slate-600">
              <strong className="text-slate-900 font-black">{paperQuestions.length} Questions</strong> configured • Total Marks: <strong className="text-slate-900 font-black">{paperTotalMarks}</strong>
            </span>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsAuthoringPaper(false)}
                className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSavePaper}
                className="px-6 py-2.5 rounded-xl bg-[#00b074] hover:bg-[#009260] text-white font-black text-xs shadow-md active:scale-95 cursor-pointer flex items-center gap-1.5 transition-all"
              >
                <Check className="w-4 h-4" />
                <span>Publish Paper to Student Dashboard</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW: MAIN PAPERS & PACKAGES STUDIO LIST
  // =========================================================================
  return (
    <div className="space-y-6 animate-in fade-in duration-150 font-sans pb-16 relative">
      {/* Floating Toast Notification */}
      {toast && (
        <div className="fixed top-5 right-5 z-50 animate-in fade-in slide-in-from-top duration-200">
          <div
            className={`px-5 py-3 rounded-2xl shadow-xl font-black text-xs flex items-center gap-2 border ${
              toast.type === 'error'
                ? 'bg-rose-600 text-white border-rose-700 shadow-rose-200'
                : toast.type === 'info'
                ? 'bg-slate-800 text-white border-slate-900 shadow-slate-200'
                : 'bg-emerald-600 text-white border-emerald-700 shadow-emerald-200'
            }`}
          >
            <span>{toast.msg}</span>
          </div>
        </div>
      )}

      {/* Top Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
        <div className="flex items-center gap-4 min-w-0">
          <div className="w-14 h-14 rounded-2xl bg-[#80497D]/10 text-[#80497D] flex items-center justify-center font-bold border border-[#ebd7eb] shrink-0 shadow-xs">
            <BookOpen className="w-7 h-7 text-[#80497D]" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#422240] tracking-tight">
              Subject-wise Mock Test Series Covers &amp; Papers Studio
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
              Create and manage Subject Mock Test Series Covers with multiple Mock Tests (Test 1, 2, 3...) that sync immediately to the Student Dashboard.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0 flex-wrap sm:flex-nowrap">
          <button
            type="button"
            onClick={handleOpenCreatePaper}
            className="px-5 py-2.5 rounded-xl bg-[#00b074] hover:bg-[#009260] text-white font-black text-sm transition-all shadow-md active:scale-95 cursor-pointer flex items-center gap-2"
          >
            <Plus className="w-4.5 h-4.5" />
            <span>Create Mock Test Paper</span>
          </button>
        </div>
      </div>

      {/* 2. Rich Top Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Mock Series Covers */}
        <div className="bg-white p-5 rounded-2xl border border-[#ebd7eb] shadow-2xs hover:shadow-xs transition-all flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#f4eaf4] text-[#80497D] flex items-center justify-center border border-[#ebd7eb] shrink-0">
            <Sparkles className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Series Covers</p>
            <h3 className="text-2xl font-black text-[#80497D] mt-0.5 font-mono">{examPapers.length}</h3>
            <p className="text-[11px] text-slate-400 mt-0.5 truncate">Subject test series</p>
          </div>
        </div>

        {/* Study Packages */}
        <div className="bg-white p-5 rounded-2xl border border-[#ebd7eb] shadow-2xs hover:shadow-xs transition-all flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-orange-50 text-[#C35B3F] flex items-center justify-center border border-orange-100 shrink-0">
            <Package className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Study Bundles</p>
            <h3 className="text-2xl font-black text-[#C35B3F] mt-0.5 font-mono">{packages.length}</h3>
            <p className="text-[11px] text-slate-400 mt-0.5 truncate">All-in-one packages</p>
          </div>
        </div>

        {/* Subjects Covered */}
        <div className="bg-white p-5 rounded-2xl border border-[#ebd7eb] shadow-2xs hover:shadow-xs transition-all flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Subjects Covered</p>
            <h3 className="text-2xl font-black text-emerald-600 mt-0.5 font-mono">6 Majors</h3>
            <p className="text-[11px] text-slate-400 mt-0.5 truncate">IMO, NSO, IEO, ICSO, IGKO</p>
          </div>
        </div>

        {/* Student Orders */}
        <div className="bg-white p-5 rounded-2xl border border-[#ebd7eb] shadow-2xs hover:shadow-xs transition-all flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shrink-0">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Student Orders</p>
            <h3 className="text-2xl font-black text-blue-600 mt-0.5 font-mono">{orders.length}</h3>
            <p className="text-[11px] text-slate-400 mt-0.5 truncate">Verified enrollments</p>
          </div>
        </div>
      </div>

      {/* 3. Sub-Navigation Tabs */}
      <div className="flex items-center gap-2.5 border-b border-[#ebd7eb] pb-3 overflow-x-auto">
        {[
          { id: 'exam_papers', label: 'Subject Mock Test Series Covers & Tests', icon: Sparkles, count: examPapers.length },
          { id: 'packages', label: 'Study Packages & Bundles', icon: Package, count: packages.length },
          { id: 'orders', label: 'Student Purchases & Orders', icon: ShoppingBag, count: orders.length }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-[#80497D] text-white shadow-md shadow-[#80497D]/20'
                  : 'bg-white text-slate-600 border border-[#ebd7eb] hover:bg-[#faf6fa] hover:text-[#80497D]'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                  isActive ? 'bg-white/20 text-white' : 'bg-[#f4eaf4] text-[#80497D]'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* 4. Controls Bar: Unified Responsive Filter & Search Toolbar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#ebd7eb] shadow-2xs flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1 flex-wrap">
          {/* Search Box */}
          <div className="relative flex-1 sm:min-w-[240px] max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder={activeTab === 'exam_papers' ? 'Search mock tests, papers, subjects...' : 'Search study packages...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#80497D] focus:bg-white transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Subject Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 hidden xl:inline">Subject:</span>
            <select
              value={packageSubjectFilter}
              onChange={(e) => setPackageSubjectFilter(e.target.value)}
              className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-[#6d3a68] focus:outline-none focus:ring-2 focus:ring-[#80497D] cursor-pointer"
            >
              {SUBJECTS_LIST.map((subj) => (
                <option key={subj.code} value={subj.code}>
                  {subj.code === 'ALL' ? '🌟 All Subjects' : subj.label}
                </option>
              ))}
            </select>
          </div>

          {/* Class Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 hidden xl:inline">Class:</span>
            <select
              value={packageClassFilter}
              onChange={(e) => setPackageClassFilter(e.target.value)}
              className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#80497D] cursor-pointer"
            >
              <option value="All">All Classes (Grade 1 - 12)</option>
              {CLASSES_LIST.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Right side: Items counter badge + Action button */}
        <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100">
          <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg">
            Showing <span className="text-[#80497D] font-black">{activeTab === 'exam_papers' ? examPapers.length : packages.length}</span> {activeTab === 'exam_papers' ? 'Mock Tests' : 'Packages'}
          </span>

          {activeTab === 'exam_papers' ? (
            <button
              type="button"
              onClick={handleOpenCreatePaper}
              className="px-4 py-2.5 rounded-xl bg-[#00b074] hover:bg-[#009260] text-white font-black text-xs sm:text-sm transition-all shadow-sm active:scale-95 cursor-pointer flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Create Mock Test</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                setEditingPackage(null);
                setShowModal(true);
              }}
              className="px-4 py-2.5 rounded-xl bg-[#00b074] hover:bg-[#009260] text-white font-black text-xs sm:text-sm transition-all shadow-sm active:scale-95 cursor-pointer flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add Study Package</span>
            </button>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: SUBJECT MOCK TEST SERIES COVERS & PAPERS STUDIO                   */}
      {/* ========================================================================= */}
      {activeTab === 'exam_papers' && (
        <div className="space-y-6 animate-in fade-in">
          {examPapers.length === 0 ? (
            <div className="bg-white rounded-3xl p-10 border border-[#edd6ed] text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 mx-auto flex items-center justify-center">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-base font-black text-slate-800">No Mock Test Papers Found</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                No papers found for {packageSubjectFilter} ({packageClassFilter}). Click the button below to create one.
              </p>
              <button
                type="button"
                onClick={handleOpenCreatePaper}
                className="px-5 py-2.5 rounded-xl bg-[#00b074] hover:bg-[#009260] text-white font-black text-xs shadow-md cursor-pointer inline-flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Create First Mock Test Paper</span>
              </button>
            </div>
          ) : (
            <div className="space-y-8">
              {groupedSeries.map((seriesGroup, gIdx) => (
                <div key={gIdx} className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-5">
                  {/* Subject Series Cover Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-[#859900]/10 text-[#859900] border border-[#859900]/30 flex items-center justify-center font-black">
                        <Award className="w-5 h-5" />
                      </div>
                      <div>
                        <h2 className="text-base sm:text-lg font-black text-slate-900">
                          {seriesGroup.seriesTitle}
                        </h2>
                        <p className="text-xs text-slate-500 font-medium">
                          {seriesGroup.className} • {seriesGroup.subjectCode} Olympiad • {seriesGroup.papers.length} Mock Tests Configured
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleAddMockTestToSeries(seriesGroup.subjectCode, seriesGroup.className, seriesGroup.papers.length)}
                        className="px-3.5 py-1.5 rounded-xl bg-[#859900] hover:bg-[#728400] text-white font-bold text-xs shadow-2xs active:scale-95 cursor-pointer flex items-center gap-1.5 transition-all"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>+ Add Mock Test to {seriesGroup.subjectCode}</span>
                      </button>
                    </div>
                  </div>

                  {/* Grid of Mock Test Cards in this Series Cover */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {seriesGroup.papers.map((paper) => (
                      <div
                        key={paper.id}
                        className="bg-white rounded-lg border-2 border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden relative"
                      >
                        {/* Top Olive Green Banner Header (Exact Image 1 format) */}
                        <div>
                          <div className="bg-[#859900] text-white text-left py-2.5 px-4 font-black text-xs sm:text-sm shadow-xs tracking-tight">
                            {paper.title}
                          </div>

                          {/* Card Body (Image 1 format) */}
                          <div className="p-4 space-y-3 bg-white">
                            {/* Row 1: Status */}
                            <div className="flex items-center justify-between text-xs py-1 border-b border-slate-100">
                              <div className="flex items-center gap-2 text-slate-700 font-bold">
                                <FileText className="w-4 h-4 text-slate-500" />
                                <span>Status</span>
                              </div>
                              <span className="px-2.5 py-0.5 rounded-sm bg-[#d9534f] text-white font-black text-[10px] uppercase shadow-2xs">
                                Unattempted
                              </span>
                            </div>

                            {/* Row 2: Last Score */}
                            <div className="flex items-center justify-between text-xs py-1">
                              <div className="flex items-center gap-2 text-slate-700 font-bold">
                                <Bookmark className="w-4 h-4 text-slate-500" />
                                <span>Last Score</span>
                              </div>
                              <span className="px-3 py-0.5 rounded-full bg-[#8cb82b] text-white font-black text-[10px] shadow-2xs">
                                none
                              </span>
                            </div>

                            {/* Info Details */}
                            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-bold">
                              <span>Cutoff: {paper.cutoff_marks || 42} Marks</span>
                              <span>{paper.questions?.length || 0} Questions</span>
                            </div>
                          </div>
                        </div>

                        {/* Card Bottom Controls: Super Admin Actions */}
                        <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleOpenEditPaper(paper)}
                              className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-bold transition-all cursor-pointer flex items-center gap-1 shadow-2xs"
                            >
                              <Edit className="w-3.5 h-3.5 text-blue-600" />
                              <span>Edit</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeletePaper(paper.id)}
                              className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-400 hover:text-red-600 hover:bg-red-50 text-xs transition-all cursor-pointer"
                              title="Delete Mock Test"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-200 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Live in Student Panel
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: STUDY PACKAGES & BUNDLES                                            */}
      {/* ========================================================================= */}
      {activeTab === 'packages' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                className="bg-white rounded-2xl border-2 border-sky-300 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4 relative"
              >
                <div>
                  <div
                    className="text-white text-center py-2.5 px-3 rounded-t-xl -mt-5 -mx-5 font-black text-xs sm:text-sm shadow-xs mb-3"
                    style={{ backgroundColor: pkg.header_color || '#4895d9' }}
                  >
                    {pkg.title}
                  </div>

                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold text-[10px]">
                      {pkg.class_name} • {pkg.subject_code}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[10px]">
                      {Array.isArray(pkg.sub_items) ? pkg.sub_items.length : 6} Items
                    </span>
                  </div>

                  <div className="space-y-2 text-xs text-slate-700 min-h-[140px]">
                    {(pkg.points || []).map((pt, pIdx) => (
                      <div key={pIdx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#00b074] shrink-0 mt-0.5" />
                        <span className="leading-snug text-[11px] font-medium text-slate-800">{pt}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 space-y-2">
                  <div className="text-center text-xs font-bold text-slate-500">
                    Price: <span className="font-black text-[#6d3a68]">₹{parseFloat(pkg.price).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: STUDENT PURCHASES & ORDERS                                         */}
      {/* ========================================================================= */}
      {activeTab === 'orders' && (
        <div className="space-y-4 animate-in fade-in bg-white rounded-3xl p-5 border border-[#edd6ed] shadow-sm">
          <h3 className="text-sm font-black text-slate-800">Student Purchases ({orders.length})</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#faf5fa] text-[#6d3a68] border-b border-[#edd6ed] uppercase text-[10px] font-black">
                  <th className="py-3 px-4">Order ID</th>
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">Class</th>
                  <th className="py-3 px-4">Package</th>
                  <th className="py-3 px-4">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.map((o) => (
                  <tr key={o.id}>
                    <td className="py-3 px-4 font-mono font-bold text-[#6d3a68]">{o.order_id}</td>
                    <td className="py-3 px-4 font-bold">{o.student_name}</td>
                    <td className="py-3 px-4">{o.student_class}</td>
                    <td className="py-3 px-4">{o.package_title}</td>
                    <td className="py-3 px-4 font-black text-emerald-700">₹{o.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
