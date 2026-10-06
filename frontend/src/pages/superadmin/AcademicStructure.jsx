import React, { useState, useEffect } from 'react';
import { apiClient } from '../../api/client';
import {
  Layers,
  BookOpen,
  Plus,
  Edit2,
  Trash2,
  FolderTree,
  Tag,
  Hash,
  Check,
  Calculator,
  Atom,
  Brain,
  Cpu,
  Sparkles,
  Globe,
  Palette,
  Trophy,
  Search,
  RefreshCw,
  Eye,
  FileText,
  Clock,
  HelpCircle,
  Award,
  Filter,
  Save,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  ListPlus,
  Calendar,
  DollarSign,
  ShieldCheck,
  Sparkle,
  ArrowLeft
} from 'lucide-react';
import { Button } from '../../components/Button';
import { Modal } from '../../components/Modal';
import {
  ALL_CLASSES,
  OLYMPIAD_SUBJECT_METADATA,
  getClassSyllabus,
  getClassBenefits,
  getClassFAQs
} from '../../data/olympiadClassData';

export const buildDefaultSubjectClassContent = (slug = 'math', clsName = 'Class 1') => {
  const meta = OLYMPIAD_SUBJECT_METADATA[slug] || OLYMPIAD_SUBJECT_METADATA.english;
  const defaultSyllabus = getClassSyllabus(slug, clsName);
  const defaultBenefits = getClassBenefits(meta.shortName, clsName);
  const defaultFaqs = getClassFAQs(meta.shortName, clsName);
  const defaultAge = meta.ageMap?.[clsName] || 'School Age Equivalent';

  return {
    custom_title: `${meta.shortName} Olympiad for ${clsName}`,
    headings: {
      nav_overview: '1. Header & Overview',
      nav_eligibility: '2. Eligibility Criteria',
      nav_benefits: '3. Benefits of Subject',
      nav_how_to_apply: '4. How to Register & Apply',
      nav_syllabus: '5. Class Syllabus Modules',
      nav_dates_fee: '6. Exam Dates & Fees',
      nav_prepare: '7. How to Prepare Guide',
      nav_awards: '8. Awards & Recognition',
      nav_faqs: '9. FAQs (Q&A Pairs)',
      overview: '1. Hero Header Quote & Overview Text',
      eligibility: `Eligibility Criteria for ${clsName} International ${meta.shortName} Olympiad`,
      benefits: `Benefits of ${meta.shortName} Olympiad for ${clsName}`,
      how_to_apply: `How to Register for ${clsName} ${meta.shortName} Olympiad?`,
      syllabus: `${clsName} ${meta.shortName} Olympiad Syllabus`,
      dates_fee: `Dates and Fee for ${clsName} ${meta.shortName} Olympiad`,
      prepare: `How to prepare for ${clsName} ${meta.shortName} Olympiad?`,
      cutoff_keys: `Cut-off & Answer Key for ${clsName} ${meta.shortName} Olympiad`,
      results: `Results of ${clsName} ${meta.shortName} Olympiad`,
      awards: `Awards for ${meta.shortName} Olympiad`,
      faqs: `${meta.shortName} Olympiads FAQs`
    },
    quote: meta.quote || 'Inspiring excellence and critical thinking in students worldwide.',
    intro_text: `Think about how empowering it will be for your child to excel in ${meta.shortName} right from early childhood days. SkillRise ${meta.fullName} for ${clsName} has been introduced to help your child develop strong conceptual skills by providing interactive picture-based and multiple-choice questions. The exciting rewards keep them motivated and make learning fun while laying solid foundations.`,
    eligibility: [
      `Students intended for taking the ${meta.fullName} test for ${clsName} can do the registration either through their schools or on their own.`,
      `Candidates from all around the world and from all recognized educational boards (CBSE, ICSE, Cambridge, IB, State Boards) are welcome to apply for the exam.`,
      `The test for ${clsName} is performed in 2 levels (or single foundation tier).`,
      `Participants qualifying the first level will be eligible to take part in the second level.`,
      `Participants must meet the age requirement for ${clsName} (typically ${defaultAge}).`
    ],
    benefits: defaultBenefits || [],
    how_to_apply: {
      school_text: `${meta.fullName} registration for ${clsName} can be done by schools. The registration can be coordinated within working hours through the school exam coordinator.`,
      individual_text: `Students can also register separately from school & want to appear for the ${meta.shortName} Olympiad for ${clsName} online test can follow simple registration steps.`,
      steps: [
        'Click on Individual Student Registration',
        'The registration form opens up with student details',
        'Fill in student name, class grade, and school affiliation',
        'Select the Olympiad subject(s) you wish to appear in',
        'Read exam instructions carefully',
        'Complete the secure exam fee payment',
        'Instant confirmation and candidate roll number generated'
      ],
      notes: [
        `${meta.shortName} Olympiad individual registrations by students are accepted globally.`,
        `Students who have done direct registration can take online exams from home using desktop or tablet.`
      ]
    },
    syllabus_modules: (defaultSyllabus || []).map(s => ({
      topic: s.topic,
      description: s.description,
      questions: s.questions || 15
    })),
    dates_fees: {
      level1Dates: meta.examDates2026_2027?.level1Dates || '18th December 2026 & 22nd January 2027',
      level2Dates: meta.examDates2026_2027?.level2Dates || '28th January 2027 & 12th February 2027',
      lastDateReg: meta.examDates2026_2027?.lastDateReg || '30th November 2026',
      level1AnswerKey: meta.examDates2026_2027?.level1AnswerKey || '20th - 22nd December 2026',
      level2AnswerKey: meta.examDates2026_2027?.level2AnswerKey || '14th - 16th February 2027',
      level1Result: meta.examDates2026_2027?.level1Result || 'Announced within 25 days of the Level 1 final answer key',
      level2Result: meta.examDates2026_2027?.level2Result || 'Announced within 30 days after the Level 2 exam',
      feeIndia: meta.examDates2026_2027?.feeIndia || 'INR ₹250 per student',
      feeInternational: meta.examDates2026_2027?.feeInternational || 'USD $15 per student'
    },
    how_to_prepare: {
      strategy_text: `Comprehensive Olympiad preparation requires conceptual clarity, periodic timed mock test drills, and systematic topic-wise revision. Students of ${clsName} are advised to complete chapter-wise worksheets and previous year question papers.`,
      blueprint_notes: `Each test contains objective Multiple Choice Questions (MCQs) mapped directly to foundational syllabus guidelines.`
    },
    awards: {
      scholarship_info: 'Top rankers receive cash awards up to ₹50,000, merit scholarships, and global recognition.',
      medals_info: 'Gold, Silver, and Bronze Medals of Excellence awarded to top 3 school, zonal, and international rankers.',
      certificate_info: 'Digital & Physical Certificate of Merit + Detailed Student Performance Report (SPR) for every participant.'
    },
    faqs: defaultFaqs || []
  };
};

export const AcademicStructure = ({ defaultTab = 'subjects', onNavigateTab }) => {
  const [activeTab, setActiveTab] = useState(defaultTab); // 'page_content' | 'subjects' | 'classes' | 'chapters' | 'topics'

  useEffect(() => {
    if (defaultTab) {
      setActiveTab(defaultTab);
    }
  }, [defaultTab]);

  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Page Content Editor State (Subject + Class specific)
  const [editorSubjectSlug, setEditorSubjectSlug] = useState('math');
  const [editorClassName, setEditorClassName] = useState('Class 1');
  const [editorSection, setEditorSection] = useState('overview'); // 'overview' | 'eligibility' | 'benefits' | 'how-to-apply' | 'syllabus' | 'dates-fee' | 'prepare' | 'awards' | 'faqs'
  const [contentLoading, setContentLoading] = useState(false);
  const [contentSaving, setContentSaving] = useState(false);
  const [saveSuccessMessage, setSaveSuccessMessage] = useState('');
  const [editNavMode, setEditNavMode] = useState(false);

  // Content Form Data pre-populated with complete website content
  const [contentForm, setContentForm] = useState(() => buildDefaultSubjectClassContent('math', 'Class 1'));

  // Filters for chapters/topics
  const [selectedClassId, setSelectedClassId] = useState('');
  const [selectedSubjectId, setSelectedSubjectId] = useState('');
  const [selectedChapterId, setSelectedChapterId] = useState('');

  // Modals
  const [showClassModal, setShowClassModal] = useState(false);
  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const [showChapterModal, setShowChapterModal] = useState(false);
  const [showTopicModal, setShowTopicModal] = useState(false);

  // Editing state
  const [editingItem, setEditingItem] = useState(null);

  // Form states
  const [classForm, setClassForm] = useState({
    name: '',
    code: '',
    order_no: 1,
    category: 'Primary',
    description: '',
    age_group: '',
    status: 'active'
  });

  const [subjectForm, setSubjectForm] = useState({
    name: '',
    full_name: '',
    code: '',
    slug: '',
    icon: 'Calculator',
    color: '#4e2a4a',
    category: 'Mathematics',
    tagline: 'Classes 1 to 12 • 50 Questions',
    description: '',
    quote: '',
    questions_count: 50,
    duration_minutes: 60,
    syllabus_overview: '',
    topics: [
      { name: 'Number Sense & Numeration', description: 'Place values, operations, patterns and word problems' },
      { name: 'Computation Operations & Algebra', description: 'Addition, subtraction, multiplication, fractions and equations' },
      { name: 'Geometry & Spatial Measurement', description: '2D/3D shapes, perimeter, area, symmetry and visual geometry' },
      { name: 'Applied Mathematics & Data Handling', description: 'Pictographs, bar graphs, money, time, calendar and logic puzzles' }
    ],
    status: 'active'
  });

  const [newTopicName, setNewTopicName] = useState('');

  const handleAddSubjectTopic = () => {
    if (!newTopicName.trim()) return;
    const current = Array.isArray(subjectForm.topics) ? subjectForm.topics : [];
    setSubjectForm({
      ...subjectForm,
      topics: [
        ...current,
        { name: newTopicName.trim(), description: 'Foundational Olympiad concepts and problem-solving drills' }
      ]
    });
    setNewTopicName('');
  };

  const handleRemoveSubjectTopic = (idx) => {
    const current = Array.isArray(subjectForm.topics) ? subjectForm.topics : [];
    setSubjectForm({
      ...subjectForm,
      topics: current.filter((_, i) => i !== idx)
    });
  };

  const handleUpdateSubjectTopicName = (idx, newName) => {
    const current = Array.isArray(subjectForm.topics) ? [...subjectForm.topics] : [];
    if (typeof current[idx] === 'object' && current[idx] !== null) {
      current[idx].name = newName;
    } else {
      current[idx] = { name: newName, description: '' };
    }
    setSubjectForm({ ...subjectForm, topics: current });
  };

  const handleUpdateSubjectTopicDesc = (idx, newDesc) => {
    const current = Array.isArray(subjectForm.topics) ? [...subjectForm.topics] : [];
    if (typeof current[idx] === 'object' && current[idx] !== null) {
      current[idx].description = newDesc;
    } else {
      current[idx] = { name: String(current[idx] || ''), description: newDesc };
    }
    setSubjectForm({ ...subjectForm, topics: current });
  };

  const [chapterForm, setChapterForm] = useState({
    class_id: '',
    subject_id: '',
    name: '',
    code: '',
    order_no: 1
  });

  const [topicForm, setTopicForm] = useState({
    chapter_id: '',
    name: '',
    description: '',
    order_no: 1
  });

  const [actionLoading, setActionLoading] = useState(false);

  const fetchClasses = async () => {
    try {
      const res = await apiClient.get('/academic/classes');
      if (res.success) setClasses(res.data || []);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchSubjects = async () => {
    try {
      const res = await apiClient.get('/academic/subjects');
      if (res.success) setSubjects(res.data || []);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchChapters = async () => {
    try {
      const res = await apiClient.get('/academic/chapters', {
        class_id: selectedClassId,
        subject_id: selectedSubjectId
      });
      if (res.success) setChapters(res.data || []);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchTopics = async () => {
    try {
      const res = await apiClient.get('/academic/topics', {
        chapter_id: selectedChapterId
      });
      if (res.success) setTopics(res.data || []);
    } catch (e) {
      console.error(e);
    }
  };

  const loadAll = async () => {
    try {
      setLoading(true);
      await Promise.all([fetchClasses(), fetchSubjects()]);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  // Load Content for Subject + Class in Content Editor
  const loadSubjectClassContent = async (slug, clsName) => {
    setContentLoading(true);
    setSaveSuccessMessage('');

    // 1. Immediately load full default website content so all fields are pre-populated
    const defaults = buildDefaultSubjectClassContent(slug, clsName);
    setContentForm(defaults);

    try {
      const res = await apiClient.get('/academic/subject-class-content', {
        subject_slug: slug,
        class_name: clsName
      });

      if (res && res.success && res.data) {
        const d = res.data;
        const savedHeadings = d.headings || {};

        setContentForm({
          custom_title: d.custom_title || defaults.custom_title,
          headings: {
            ...defaults.headings,
            ...savedHeadings
          },
          quote: d.quote || defaults.quote,
          intro_text: d.intro_text || defaults.intro_text,
          eligibility: Array.isArray(d.eligibility) && d.eligibility.length > 0 ? d.eligibility : defaults.eligibility,
          benefits: Array.isArray(d.benefits) && d.benefits.length > 0 ? d.benefits : defaults.benefits,
          how_to_apply: d.how_to_apply && Array.isArray(d.how_to_apply.steps) && d.how_to_apply.steps.length > 0 ? d.how_to_apply : defaults.how_to_apply,
          syllabus_modules: Array.isArray(d.syllabus_modules) && d.syllabus_modules.length > 0 ? d.syllabus_modules : defaults.syllabus_modules,
          dates_fees: d.dates_fees && d.dates_fees.level1Dates ? d.dates_fees : defaults.dates_fees,
          how_to_prepare: d.how_to_prepare && d.how_to_prepare.strategy_text ? d.how_to_prepare : defaults.how_to_prepare,
          awards: d.awards && d.awards.scholarship_info ? d.awards : defaults.awards,
          faqs: Array.isArray(d.faqs) && d.faqs.length > 0 ? d.faqs : defaults.faqs
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setContentLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'page_content') {
      loadSubjectClassContent(editorSubjectSlug, editorClassName);
    }
  }, [activeTab, editorSubjectSlug, editorClassName]);

  const handleSavePageContent = async () => {
    setContentSaving(true);
    setSaveSuccessMessage('');
    try {
      await apiClient.post('/academic/subject-class-content', {
        subject_slug: editorSubjectSlug,
        class_name: editorClassName,
        custom_title: contentForm.custom_title,
        headings: contentForm.headings,
        quote: contentForm.quote,
        intro_text: contentForm.intro_text,
        eligibility: contentForm.eligibility,
        benefits: contentForm.benefits,
        how_to_apply: contentForm.how_to_apply,
        syllabus_modules: contentForm.syllabus_modules,
        dates_fees: contentForm.dates_fees,
        how_to_prepare: contentForm.how_to_prepare,
        awards: contentForm.awards,
        faqs: contentForm.faqs
      });
      setSaveSuccessMessage(`Content & Headings for ${editorSubjectSlug.toUpperCase()} - ${editorClassName} saved to MySQL database successfully!`);
      setTimeout(() => setSaveSuccessMessage(''), 5000);
    } catch (err) {
      alert('Error saving content: ' + err.message);
    } finally {
      setContentSaving(false);
    }
  };

  // Classes Handlers
  const handleSaveClass = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      if (editingItem) {
        await apiClient.put(`/academic/classes/${editingItem.id}`, classForm);
      } else {
        await apiClient.post('/academic/classes', classForm);
      }
      setShowClassModal(false);
      fetchClasses();
    } catch (err) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteClass = async (id) => {
    try {
      await apiClient.delete(`/academic/classes/${id}`);
      fetchClasses();
    } catch (err) {
      console.warn(err);
    }
  };

  // Subject Handlers
  const handleSaveSubject = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      if (editingItem) {
        await apiClient.put(`/academic/subjects/${editingItem.id}`, subjectForm);
      } else {
        await apiClient.post('/academic/subjects', subjectForm);
      }
      setShowSubjectModal(false);
      fetchSubjects();
    } catch (err) {
      console.warn(err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteSubject = async (id) => {
    try {
      await apiClient.delete(`/academic/subjects/${id}`);
      fetchSubjects();
    } catch (err) {
      console.warn(err);
    }
  };

  // Chapter Handlers
  const handleSaveChapter = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      if (editingItem) {
        await apiClient.put(`/academic/chapters/${editingItem.id}`, chapterForm);
      } else {
        await apiClient.post('/academic/chapters', chapterForm);
      }
      setShowChapterModal(false);
      fetchChapters();
    } catch (err) {
      console.warn(err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteChapter = async (id) => {
    try {
      await apiClient.delete(`/academic/chapters/${id}`);
      fetchChapters();
    } catch (err) {
      console.warn(err);
    }
  };

  // Topic Handlers
  const handleSaveTopic = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      await apiClient.post('/academic/topics', topicForm);
      setShowTopicModal(false);
      fetchTopics();
    } catch (err) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const filteredSubjects = (subjects || []).filter((sub) => {
    if (!sub) return false;
    const q = (searchQuery || '').trim().toLowerCase();
    if (!q) return true;
    return (
      (sub.name && (sub.name || '').toLowerCase().includes(q)) ||
      (sub.full_name && (sub.full_name || '').toLowerCase().includes(q)) ||
      (sub.code && (sub.code || '').toLowerCase().includes(q)) ||
      (sub.category && (sub.category || '').toLowerCase().includes(q))
    );
  });

  const filteredClasses = (classes || []).filter((cls) => {
    if (!cls) return false;
    const q = (searchQuery || '').trim().toLowerCase();
    if (!q) return true;
    return (
      (cls.name && (cls.name || '').toLowerCase().includes(q)) ||
      (cls.code && (cls.code || '').toLowerCase().includes(q)) ||
      (cls.category && (cls.category || '').toLowerCase().includes(q))
    );
  });

  if (showSubjectModal) {
    return (
      <div className="space-y-6 pb-20 font-sans animate-in fade-in duration-150">
        {/* Page Header Bar (Slim & Clean) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-3.5 sm:p-4 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 min-w-0">
            <button
              type="button"
              onClick={() => setShowSubjectModal(false)}
              className="px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 transition-all cursor-pointer shrink-0 flex items-center gap-1.5 text-xs font-bold shadow-2xs hover:shadow-xs active:scale-95"
              title="Back to All Disciplines"
            >
              <ArrowLeft className="w-4 h-4 text-slate-600" />
              <span>Back to Disciplines</span>
            </button>

            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-xs shadow-2xs shrink-0"
              style={{ backgroundColor: subjectForm.color || '#6d3a68' }}
            >
              {subjectForm.code || 'OLY'}
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span
                  className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase text-white shadow-2xs"
                  style={{ backgroundColor: subjectForm.color || '#6d3a68' }}
                >
                  {subjectForm.code || 'OLYMPIAD'}
                </span>
                <span className="text-slate-300 font-bold text-xs">•</span>
                <span className="text-[11px] text-slate-500 font-bold">
                  {editingItem ? 'Editing Discipline' : 'New Discipline Authoring'}
                </span>
              </div>
              <h1 className="text-base sm:text-lg font-black text-slate-900 tracking-tight leading-snug truncate mt-0.5">
                {editingItem ? `Edit Discipline: ${subjectForm.name}` : 'Add New Olympiad Discipline'}
              </h1>
              <p className="text-[11px] text-slate-500 font-medium truncate mt-0.5">
                Configure subject details, duration, question count, and class topics covered.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => setShowSubjectModal(false)}
              className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSaveSubject}
              disabled={actionLoading}
              className="px-4 py-2 rounded-xl text-xs font-black text-white bg-[#00b074] hover:bg-[#009260] transition-all shadow-sm active:scale-95 cursor-pointer flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{actionLoading ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </div>

        {/* Full-Page Form Cards */}
        <form onSubmit={handleSaveSubject} className="space-y-6">
          {/* 1. Basic Discipline Identification */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-black text-slate-900">1. Discipline Information &amp; Parameters</h3>
                <p className="text-xs text-slate-500">Official title, short code, category, and exam specifications.</p>
              </div>
              <span className="text-xs font-bold text-[#6d3a68] bg-[#faf5fa] px-2.5 py-1 rounded-lg border border-[#edd6ed]">
                {subjectForm.category || 'General'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Discipline Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mathematics Olympiad"
                  value={subjectForm.name}
                  onChange={(e) => setSubjectForm({ ...subjectForm, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#6d3a68] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Official Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. International Mathematics Olympiad (IMO)"
                  value={subjectForm.full_name}
                  onChange={(e) => setSubjectForm({ ...subjectForm, full_name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#6d3a68] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Olympiad Short Code *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. IMO, NSO, IEO"
                  value={subjectForm.code}
                  onChange={(e) => setSubjectForm({ ...subjectForm, code: e.target.value.toUpperCase() })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-black uppercase text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#6d3a68] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">URL Identifier Slug *</label>
                <input
                  type="text"
                  placeholder="e.g. math, science, english"
                  value={subjectForm.slug}
                  onChange={(e) => setSubjectForm({ ...subjectForm, slug: e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, '') })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#6d3a68] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                <select
                  value={subjectForm.category || 'Mathematics'}
                  onChange={(e) => setSubjectForm({ ...subjectForm, category: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:bg-white outline-none cursor-pointer"
                >
                  <option value="Mathematics">Mathematics</option>
                  <option value="Science">Science</option>
                  <option value="Languages">Languages &amp; English</option>
                  <option value="Reasoning">Logical Reasoning</option>
                  <option value="Computer Science">Computer Science &amp; AI</option>
                  <option value="General Knowledge">General Knowledge</option>
                  <option value="Social Studies">Social Studies</option>
                  <option value="Arts">Creative Arts</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Status</label>
                <select
                  value={subjectForm.status || 'active'}
                  onChange={(e) => setSubjectForm({ ...subjectForm, status: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:bg-white outline-none cursor-pointer"
                >
                  <option value="active">Active (Visible)</option>
                  <option value="inactive">Inactive (Hidden)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Total Exam Questions</label>
                <input
                  type="number"
                  value={subjectForm.questions_count || 50}
                  onChange={(e) => setSubjectForm({ ...subjectForm, questions_count: parseInt(e.target.value) || 50 })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:bg-white outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Exam Duration (Minutes)</label>
                <input
                  type="number"
                  value={subjectForm.duration_minutes || 60}
                  onChange={(e) => setSubjectForm({ ...subjectForm, duration_minutes: parseInt(e.target.value) || 60 })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:bg-white outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Discipline Theme Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={subjectForm.color || '#4e2a4a'}
                    onChange={(e) => setSubjectForm({ ...subjectForm, color: e.target.value })}
                    className="w-10 h-10 rounded-xl border border-slate-300 p-0.5 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={subjectForm.color || '#4e2a4a'}
                    onChange={(e) => setSubjectForm({ ...subjectForm, color: e.target.value })}
                    className="flex-1 px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-bold"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Tagline &amp; Quote</label>
              <input
                type="text"
                placeholder="e.g. Children must be taught how to think, not what to think."
                value={subjectForm.quote || subjectForm.tagline || ''}
                onChange={(e) => setSubjectForm({ ...subjectForm, quote: e.target.value, tagline: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:bg-white outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Discipline Overview Description</label>
              <textarea
                rows={3}
                placeholder="Detailed explanation of the Olympiad curriculum and analytical focus..."
                value={subjectForm.description || ''}
                onChange={(e) => setSubjectForm({ ...subjectForm, description: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:bg-white outline-none"
              />
            </div>
          </div>

          {/* 2. Topics & Concepts Covered Section ("kis subject m kitne topic h") */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-black text-slate-900">2. Subject Topics &amp; Core Concepts</h3>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-purple-100 text-purple-800 border border-purple-200">
                    {subjectForm.topics?.length || 0} Topics Configured
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Manage curriculum topics and chapters covered under {subjectForm.name || 'this discipline'}.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200">
                  ✓ {subjectForm.topics?.length || 0} Total Topics
                </span>
              </div>
            </div>

            {/* Quick Add Topic Input */}
            <div className="p-4 bg-[#faf5fa] rounded-2xl border border-[#edd6ed] flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                placeholder="Enter new topic name (e.g. Fractions & Decimals, Organic Compounds, Verbal Reasoning)..."
                value={newTopicName}
                onChange={(e) => setNewTopicName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSubjectTopic();
                  }
                }}
                className="flex-1 px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800 outline-none"
              />
              <button
                type="button"
                onClick={handleAddSubjectTopic}
                className="px-4 py-2 bg-[#6d3a68] hover:bg-[#582d54] text-white rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 shrink-0 shadow-2xs"
              >
                <Plus className="w-4 h-4 text-[#e7b84b]" />
                <span>Add Topic</span>
              </button>
            </div>

            {/* Topics List Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {(subjectForm.topics || []).map((t, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:border-[#6d3a68]/40 transition-all flex items-start justify-between gap-3"
                >
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    <span className="w-6 h-6 rounded-lg bg-[#faf5fa] text-[#6d3a68] font-black text-xs flex items-center justify-center border border-[#edd6ed] shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <div className="min-w-0 flex-1 space-y-1">
                      <input
                        type="text"
                        value={typeof t === 'string' ? t : t.name}
                        onChange={(e) => handleUpdateSubjectTopicName(idx, e.target.value)}
                        className="w-full px-2.5 py-1 font-bold text-xs text-slate-900 border border-transparent hover:border-slate-300 focus:border-[#6d3a68] rounded-lg outline-none bg-transparent focus:bg-slate-50"
                        placeholder="Topic Title"
                      />
                      <input
                        type="text"
                        value={typeof t === 'string' ? '' : (t.description || '')}
                        onChange={(e) => handleUpdateSubjectTopicDesc(idx, e.target.value)}
                        className="w-full px-2.5 py-0.5 text-[11px] text-slate-500 border border-transparent hover:border-slate-300 focus:border-[#6d3a68] rounded-lg outline-none bg-transparent focus:bg-slate-50"
                        placeholder="Optional concepts details / sub-skills..."
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveSubjectTopic(idx)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer shrink-0"
                    title="Remove Topic"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Action Bar */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-2xs flex items-center justify-between">
            <button
              type="button"
              onClick={() => setShowSubjectModal(false)}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Disciplines</span>
            </button>

            <button
              type="submit"
              disabled={actionLoading}
              className="px-6 py-2.5 rounded-xl text-xs font-black text-white bg-[#00b074] hover:bg-[#009260] transition-all shadow-md active:scale-95 cursor-pointer flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{actionLoading ? 'Saving...' : 'Save Discipline & Topics'}</span>
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-sans">
      {/* Title & Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#4e2a4a]">
            {defaultTab === 'page_content'
              ? (activeTab === 'chapters'
                  ? 'Class Chapters Management'
                  : activeTab === 'topics'
                  ? 'Topics & Concepts Management'
                  : 'Subject & Class Content Management')
              : (activeTab === 'classes'
                  ? 'Classes & Grades (Nursery–12)'
                  : 'Olympiad Disciplines & Subjects')}
          </h1>
          <p className="text-sm text-slate-600 font-medium mt-1">
            {defaultTab === 'page_content'
              ? (activeTab === 'chapters'
                  ? 'Organize chapter modules across subjects and classes.'
                  : activeTab === 'topics'
                  ? 'Map granular sub-topics and conceptual skills to chapters.'
                  : 'Author class-wise syllabus, benefits, FAQs, and public page content.')
              : (activeTab === 'classes'
                  ? 'Manage class grade levels (Nursery–12), sequence order, age groups, and student cohorts.'
                  : 'Create, author, and manage Olympiad disciplines, subject codes, categories, exam parameters, and topics.')}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {activeTab === 'subjects' && (
            <button
              type="button"
              onClick={() => {
                setEditingItem(null);
                setSubjectForm({
                  name: '',
                  full_name: '',
                  code: '',
                  slug: '',
                  icon: 'Calculator',
                  color: '#4e2a4a',
                  category: 'Mathematics',
                  tagline: 'Classes 1 to 12 • 50 Questions',
                  description: '',
                  quote: '',
                  questions_count: 50,
                  duration_minutes: 60,
                  syllabus_overview: '',
                  status: 'active'
                });
                setShowSubjectModal(true);
              }}
              className="px-4 py-2.5 bg-gradient-to-r from-[#2563eb] via-[#7c3aed] to-[#db2777] hover:from-[#1d4ed8] hover:via-[#6d28d9] hover:to-[#be123c] text-white rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer flex items-center gap-2 shadow-xs"
            >
              <Plus className="w-4 h-4 text-[#e7b84b]" />
              <span>+ Add New Discipline</span>
            </button>
          )}

          {activeTab === 'classes' && (
            <button
              type="button"
              onClick={() => {
                setEditingItem(null);
                setClassForm({
                  name: '',
                  code: '',
                  order_no: classes.length + 1,
                  category: 'Primary',
                  description: '',
                  age_group: '',
                  status: 'active'
                });
                setShowClassModal(true);
              }}
              className="px-4 py-2.5 bg-gradient-to-r from-[#2563eb] via-[#7c3aed] to-[#db2777] hover:from-[#1d4ed8] hover:via-[#6d28d9] hover:to-[#be123c] text-white rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer flex items-center gap-2 shadow-xs"
            >
              <Plus className="w-4 h-4 text-[#e7b84b]" />
              <span>+ Add New Class</span>
            </button>
          )}

          {activeTab === 'chapters' && (
            <button
              type="button"
              onClick={() => {
                setEditingItem(null);
                setChapterForm({
                  name: '',
                  code: '',
                  subject_id: subjects[0]?.id || '',
                  class_id: classes[0]?.id || '',
                  order_no: chapters.length + 1,
                  description: '',
                  status: 'active'
                });
                setShowChapterModal(true);
              }}
              className="px-4 py-2.5 bg-gradient-to-r from-[#2563eb] via-[#7c3aed] to-[#db2777] hover:from-[#1d4ed8] hover:via-[#6d28d9] hover:to-[#be123c] text-white rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer flex items-center gap-2 shadow-xs"
            >
              <Plus className="w-4 h-4 text-[#e7b84b]" />
              <span>+ Add New Chapter</span>
            </button>
          )}

          {activeTab === 'topics' && (
            <button
              type="button"
              onClick={() => {
                setEditingItem(null);
                setTopicForm({
                  name: '',
                  code: '',
                  chapter_id: chapters[0]?.id || '',
                  order_no: topics.length + 1,
                  description: '',
                  status: 'active'
                });
                setShowTopicModal(true);
              }}
              className="px-4 py-2.5 bg-gradient-to-r from-[#2563eb] via-[#7c3aed] to-[#db2777] hover:from-[#1d4ed8] hover:via-[#6d28d9] hover:to-[#be123c] text-white rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer flex items-center gap-2 shadow-xs"
            >
              <Plus className="w-4 h-4 text-[#e7b84b]" />
              <span>+ Add New Topic</span>
            </button>
          )}
        </div>
      </div>

      {/* Mode 1: Disciplines & Subjects Navigation Tabs */}
      {defaultTab === 'subjects' && (
        <div className="w-full bg-white p-2 rounded-2xl border border-[#edd6ed] shadow-xs flex items-center gap-2.5 overflow-x-auto">
          {[
            { id: 'subjects', label: '🌟 Disciplines & Subjects', icon: BookOpen, count: subjects.length },
            { id: 'classes', label: '🏫 Classes & Grades (Nursery–12)', icon: Layers, count: classes.length },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveTab(tab.id);
                  setSearchQuery('');
                }}
                className={`py-2.5 px-4 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-2.5 cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-gradient-to-r from-[#2563eb] via-[#7c3aed] to-[#db2777] text-white shadow-xs'
                    : 'text-slate-600 hover:bg-[#faf5fa] hover:text-[#6d3a68]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#e7b84b]' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className={`text-xs px-2.5 py-0.5 rounded-full font-black ${isActive ? 'bg-white/20 text-white' : 'bg-[#faf5fa] border border-[#edd6ed] text-[#6d3a68]'}`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Mode 2: Subject & Class Content Navigation Tabs */}
      {defaultTab === 'page_content' && (
        <div className="w-full bg-white p-1.5 rounded-2xl border border-[#edd6ed] shadow-xs flex items-center gap-2 overflow-x-auto">
          {[
            { id: 'page_content', label: '📄 Class-wise Syllabus & Page Content', icon: BookOpen },
            { id: 'chapters', label: '📚 Class Chapters', icon: FolderTree, count: chapters.length },
            { id: 'topics', label: '🏷️ Topics & Concepts', icon: Tag, count: topics.length },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveTab(tab.id);
                  setSearchQuery('');
                }}
                className={`py-2 px-3.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-gradient-to-r from-[#2563eb] via-[#7c3aed] to-[#db2777] text-white shadow-xs'
                    : 'text-slate-600 hover:bg-[#faf5fa] hover:text-[#6d3a68]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#e7b84b]' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold ${isActive ? 'bg-white/20 text-white' : 'bg-[#faf5fa] border border-[#edd6ed] text-[#6d3a68]'}`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* =========================================================================
          TAB 1: SUBJECT & CLASS CONTENT EDITOR
         ========================================================================= */}
      {activeTab === 'page_content' && (
        <div className="space-y-6">
          {/* Top Selection Strip: Subject Selector + Class Selector + Action Shortcuts */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#edd6ed] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-4">
              <div>
                <label className="block text-[11px] font-black uppercase tracking-wider text-[#6d3a68] mb-1.5">
                  1. Select Discipline / Subject:
                </label>
                <select
                  value={editorSubjectSlug}
                  onChange={(e) => setEditorSubjectSlug(e.target.value)}
                  className="px-3.5 py-2.5 bg-[#faf5fa] border border-[#edd6ed] rounded-xl text-xs font-black text-[#4e2a4a] focus:outline-none focus:border-[#6d3a68] cursor-pointer min-w-[230px]"
                >
                  <option value="math">Mathematics Olympiad (IMO)</option>
                  <option value="science">Science Olympiad (NSO)</option>
                  <option value="english">English Olympiad (IEO)</option>
                  <option value="reasoning">Reasoning Olympiad (LRO / IRO)</option>
                  <option value="cyber">Cyber &amp; AI Olympiad (ICO)</option>
                  <option value="vocab">Vocabulary Championship (VC)</option>
                  <option value="environment">Environment Olympiad (EGO)</option>
                  <option value="arts">Creative Arts Olympiad (CAO)</option>
                  <option value="gk">General Knowledge Olympiad (IGKO)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-black uppercase tracking-wider text-[#6d3a68] mb-1.5">
                  2. Select Grade Level:
                </label>
                <select
                  value={editorClassName}
                  onChange={(e) => setEditorClassName(e.target.value)}
                  className="px-3.5 py-2.5 bg-[#faf5fa] border border-[#edd6ed] rounded-xl text-xs font-black text-[#4e2a4a] focus:outline-none focus:border-[#6d3a68] cursor-pointer min-w-[130px]"
                >
                  {ALL_CLASSES.map((cls) => (
                    <option key={cls} value={cls}>{cls}</option>
                  ))}
                </select>
              </div>

              {contentLoading && (
                <div className="flex items-center gap-1.5 text-xs text-[#6d3a68] font-bold self-end pb-2.5">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#d9775b]" />
                  <span>Loading database content...</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3 pt-2 md:pt-0">
              <a
                href={`/#/olympiad-detail?id=${editorSubjectSlug}&class=${encodeURIComponent(editorClassName)}`}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2.5 bg-[#faf5fa] hover:bg-[#f4ebf4] text-[#6d3a68] border border-[#edd6ed] rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-2xs hover:shadow-xs"
              >
                <ExternalLink className="w-4 h-4 text-[#d9775b]" />
                <span>Preview Public Page</span>
              </a>

              <button
                type="button"
                onClick={handleSavePageContent}
                disabled={contentSaving}
                className="px-5 py-2.5 bg-gradient-to-r from-[#059669] to-[#047857] hover:from-[#047857] hover:to-[#065f46] text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shadow-xs hover:shadow-md disabled:opacity-50 active:scale-95"
              >
                <Save className={`w-4 h-4 text-[#e7b84b] ${contentSaving ? 'animate-spin' : ''}`} />
                <span>{contentSaving ? 'Saving to MySQL...' : 'Save to MySQL Database'}</span>
              </button>
            </div>
          </div>

          {/* Success Notification Alert */}
          {saveSuccessMessage && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2 shadow-2xs animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{saveSuccessMessage}</span>
            </div>
          )}

          {/* Editor Layout: Section Sidebar + Active Section Form */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left Nav: Section Switcher & Editable Headings */}
            <div className="lg:col-span-3 bg-white p-3.5 rounded-2xl border border-[#edd6ed] shadow-2xs space-y-2">
              <div className="flex items-center justify-between px-1 pb-2 border-b border-[#edd6ed]">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                    Page Sections
                  </p>
                  <p className="text-[10px] text-slate-500 font-medium">Click to edit or customize</p>
                </div>
                <button
                  type="button"
                  onClick={() => setEditNavMode(!editNavMode)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-black transition-all flex items-center gap-1 cursor-pointer ${
                    editNavMode
                      ? 'bg-[#059669] text-white shadow-2xs'
                      : 'bg-[#faf5fa] text-[#6d3a68] hover:bg-[#f4ebf4] border border-[#edd6ed]'
                  }`}
                >
                  <Edit2 className="w-3 h-3" />
                  <span>{editNavMode ? 'Done' : 'Edit Names'}</span>
                </button>
              </div>

              {editNavMode && (
                <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200 text-[11px] font-semibold text-amber-900 leading-snug">
                  ✏️ Edit section titles below. Changes will reflect in sidebar and public website:
                </div>
              )}

              <div className="space-y-1.5">
                {[
                  { id: 'overview', label: '1. Header & Overview', icon: FileText },
                  { id: 'eligibility', label: '2. Eligibility Criteria', icon: ShieldCheck },
                  { id: 'benefits', label: '3. Benefits of Subject', icon: Award },
                  { id: 'how-to-apply', label: '4. How to Register & Apply', icon: CheckCircle2 },
                  { id: 'syllabus', label: '5. Class Syllabus Modules', icon: BookOpen },
                  { id: 'dates-fee', label: '6. Exam Dates & Fees', icon: Calendar },
                  { id: 'prepare', label: '7. How to Prepare Guide', icon: Sparkles },
                  { id: 'awards', label: '8. Awards & Recognition', icon: Trophy },
                  { id: 'faqs', label: '9. FAQs (Q&A Pairs)', icon: HelpCircle },
                ].map((sec) => {
                  const Icon = sec.icon;
                  const isActive = editorSection === sec.id;
                  const currentTitle = contentForm.headings?.[`nav_${sec.id}`] !== undefined 
                    ? contentForm.headings[`nav_${sec.id}`] 
                    : sec.label;

                  if (editNavMode) {
                    return (
                      <div key={sec.id} className="p-1.5 bg-[#faf5fa] rounded-xl border border-[#edd6ed] space-y-1">
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500">
                          <Icon className="w-3 h-3 text-[#6d3a68]" />
                          <span>Original: {sec.label}</span>
                        </div>
                        <input
                          type="text"
                          value={currentTitle}
                          onChange={(e) => {
                            setContentForm({
                              ...contentForm,
                              headings: {
                                ...contentForm.headings,
                                [`nav_${sec.id}`]: e.target.value
                              }
                            });
                          }}
                          placeholder={sec.label}
                          className="w-full px-2.5 py-1.5 bg-white border border-[#edd6ed] rounded-lg text-xs font-bold text-[#4e2a4a] focus:outline-none focus:border-[#6d3a68]"
                        />
                      </div>
                    );
                  }

                  return (
                    <button
                      key={sec.id}
                      type="button"
                      onClick={() => setEditorSection(sec.id)}
                      className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                        isActive
                          ? 'bg-gradient-to-r from-[#f4ebf4] to-[#FAF4E0] text-[#6d3a68] border border-[#edd6ed] shadow-2xs'
                          : 'text-slate-600 hover:bg-[#faf5fa] hover:text-[#6d3a68]'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#6d3a68]' : 'text-slate-400'}`} />
                        <span className="truncate">{currentTitle}</span>
                      </div>
                      <ChevronRight className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-[#6d3a68]' : 'opacity-0'}`} />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Form: Active Section Fields */}
            <div className="lg:col-span-9 bg-white p-5 sm:p-6 rounded-2xl border border-[#edd6ed] shadow-xs space-y-6">
              
              {/* 1. OVERVIEW & QUOTE */}
              {editorSection === 'overview' && (
                <div className="space-y-4">
                  <div className="border-b border-[#fdf2f8] pb-3">
                    <h3 className="text-base font-black text-[#4e2a4a]">1. Hero Header, Page Title &amp; Overview</h3>
                    <p className="text-xs text-slate-500">Edit the main page title (H1), quote, and introductory narrative for {editorSubjectSlug.toUpperCase()} ({editorClassName}).</p>
                  </div>

                  <div className="p-4 bg-gradient-to-r from-[#FAF4E0]/60 to-[#fdf2f8]/60 rounded-xl border border-[#edd6ed] space-y-3">
                    <div>
                      <label className="block font-black text-[#6d3a68] mb-1 text-xs">
                        🏷️ Main Page Heading / Title (H1)
                      </label>
                      <input
                        type="text"
                        value={contentForm.custom_title || ''}
                        onChange={(e) => setContentForm({ ...contentForm, custom_title: e.target.value })}
                        placeholder="e.g. Mathematics Olympiad for Class 1"
                        className="w-full px-3.5 py-2.5 bg-white border border-[#edd6ed] rounded-xl text-sm font-black text-[#4e2a4a] focus:outline-none focus:border-[#6d3a68] shadow-2xs"
                      />
                      <p className="text-[11px] text-slate-500 mt-1">This appears as the prominent main heading on the public Olympiad detail page.</p>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1 text-xs">
                        Section Label / Internal Title
                      </label>
                      <input
                        type="text"
                        value={contentForm.headings?.overview || ''}
                        onChange={(e) => setContentForm({
                          ...contentForm,
                          headings: { ...contentForm.headings, overview: e.target.value }
                        })}
                        placeholder="1. Hero Header Quote & Overview Text"
                        className="w-full px-3 py-2 bg-white border border-[#edd6ed] rounded-xl text-xs font-semibold text-[#4e2a4a] focus:outline-none focus:border-[#6d3a68]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1 text-xs">Hero Inspirational Quote</label>
                    <input
                      type="text"
                      value={contentForm.quote}
                      onChange={(e) => setContentForm({ ...contentForm, quote: e.target.value })}
                      placeholder="e.g. Mathematics is the language with which God has written the universe."
                      className="w-full px-3.5 py-2.5 bg-[#faf5fa] border border-[#edd6ed] rounded-xl text-xs font-semibold text-[#4e2a4a] focus:outline-none focus:border-[#6d3a68]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1 text-xs">Main Introductory Paragraph</label>
                    <textarea
                      rows={5}
                      value={contentForm.intro_text}
                      onChange={(e) => setContentForm({ ...contentForm, intro_text: e.target.value })}
                      placeholder="Think about how empowering it will be for your child to excel..."
                      className="w-full px-3.5 py-2.5 bg-[#faf5fa] border border-[#edd6ed] rounded-xl text-xs font-medium text-[#4e2a4a] leading-relaxed focus:outline-none focus:border-[#6d3a68]"
                    />
                  </div>
                </div>
              )}

              {/* 2. ELIGIBILITY CRITERIA */}
              {editorSection === 'eligibility' && (
                <div className="space-y-4">
                  <div className="border-b border-[#fdf2f8] pb-3 flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-black text-[#4e2a4a]">2. Eligibility Criteria</h3>
                      <p className="text-xs text-slate-500">Edit section heading and bullet points (a, b, c, d, e).</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setContentForm({ ...contentForm, eligibility: [...contentForm.eligibility, ''] })}
                      className="px-3 py-1.5 bg-[#faf5fa] hover:bg-[#f4ebf4] text-[#6d3a68] border border-[#edd6ed] rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Point</span>
                    </button>
                  </div>

                  <div className="p-3.5 bg-[#FAF4E0]/40 rounded-xl border border-[#edd6ed]">
                    <label className="block font-black text-[#6d3a68] mb-1 text-xs">
                      ✏️ Section Heading on Public Page (H2)
                    </label>
                    <input
                      type="text"
                      value={contentForm.headings?.eligibility || ''}
                      onChange={(e) => setContentForm({
                        ...contentForm,
                        headings: { ...contentForm.headings, eligibility: e.target.value }
                      })}
                      placeholder="e.g. Eligibility Criteria for Class 1 International Mathematics Olympiad"
                      className="w-full px-3 py-2 bg-white border border-[#edd6ed] rounded-xl text-xs font-bold text-[#4e2a4a] focus:outline-none focus:border-[#6d3a68]"
                    />
                  </div>

                  <div className="space-y-3">
                    {contentForm.eligibility.map((point, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <span className="w-6 h-8 flex items-center justify-center font-bold text-slate-400 font-mono text-xs">
                          {String.fromCharCode(97 + idx)}.
                        </span>
                        <input
                          type="text"
                          value={point}
                          onChange={(e) => {
                            const updated = [...contentForm.eligibility];
                            updated[idx] = e.target.value;
                            setContentForm({ ...contentForm, eligibility: updated });
                          }}
                          className="flex-1 px-3 py-2 bg-[#faf5fa] border border-[#edd6ed] rounded-xl text-xs font-medium text-[#4e2a4a] focus:outline-none focus:border-[#6d3a68]"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const updated = contentForm.eligibility.filter((_, i) => i !== idx);
                            setContentForm({ ...contentForm, eligibility: updated });
                          }}
                          className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 3. BENEFITS */}
              {editorSection === 'benefits' && (
                <div className="space-y-4">
                  <div className="border-b border-[#fdf2f8] pb-3 flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-black text-[#4e2a4a]">3. Benefits of Olympiad for {editorClassName}</h3>
                      <p className="text-xs text-slate-500">Edit section heading and key advantages for students.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setContentForm({ ...contentForm, benefits: [...contentForm.benefits, ''] })}
                      className="px-3 py-1.5 bg-[#faf5fa] hover:bg-[#f4ebf4] text-[#6d3a68] border border-[#edd6ed] rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Benefit</span>
                    </button>
                  </div>

                  <div className="p-3.5 bg-[#FAF4E0]/40 rounded-xl border border-[#edd6ed]">
                    <label className="block font-black text-[#6d3a68] mb-1 text-xs">
                      ✏️ Section Heading on Public Page (H2)
                    </label>
                    <input
                      type="text"
                      value={contentForm.headings?.benefits || ''}
                      onChange={(e) => setContentForm({
                        ...contentForm,
                        headings: { ...contentForm.headings, benefits: e.target.value }
                      })}
                      placeholder="e.g. Benefits of Mathematics Olympiad for Class 1"
                      className="w-full px-3 py-2 bg-white border border-[#edd6ed] rounded-xl text-xs font-bold text-[#4e2a4a] focus:outline-none focus:border-[#6d3a68]"
                    />
                  </div>

                  <div className="space-y-3">
                    {contentForm.benefits.map((b, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <span className="w-6 h-8 flex items-center justify-center font-bold text-slate-400 font-mono text-xs">
                          {idx + 1}.
                        </span>
                        <input
                          type="text"
                          value={b}
                          onChange={(e) => {
                            const updated = [...contentForm.benefits];
                            updated[idx] = e.target.value;
                            setContentForm({ ...contentForm, benefits: updated });
                          }}
                          className="flex-1 px-3 py-2 bg-[#faf5fa] border border-[#edd6ed] rounded-xl text-xs font-medium text-[#4e2a4a] focus:outline-none focus:border-[#6d3a68]"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const updated = contentForm.benefits.filter((_, i) => i !== idx);
                            setContentForm({ ...contentForm, benefits: updated });
                          }}
                          className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 4. HOW TO REGISTER / APPLY */}
              {editorSection === 'how-to-apply' && (
                <div className="space-y-4">
                  <div className="border-b border-[#fdf2f8] pb-3">
                    <h3 className="text-base font-black text-[#4e2a4a]">4. How to Register &amp; Apply</h3>
                    <p className="text-xs text-slate-500">Edit section heading, School Coordination rules, and Direct Student Registration steps.</p>
                  </div>

                  <div className="p-3.5 bg-[#FAF4E0]/40 rounded-xl border border-[#edd6ed]">
                    <label className="block font-black text-[#6d3a68] mb-1 text-xs">
                      ✏️ Section Heading on Public Page (H2)
                    </label>
                    <input
                      type="text"
                      value={contentForm.headings?.how_to_apply || ''}
                      onChange={(e) => setContentForm({
                        ...contentForm,
                        headings: { ...contentForm.headings, how_to_apply: e.target.value }
                      })}
                      placeholder="e.g. How to Register for Class 1 Mathematics Olympiad?"
                      className="w-full px-3 py-2 bg-white border border-[#edd6ed] rounded-xl text-xs font-bold text-[#4e2a4a] focus:outline-none focus:border-[#6d3a68]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1 text-xs">Option 1: School Registration Instructions</label>
                    <textarea
                      rows={2}
                      value={contentForm.how_to_apply?.school_text || ''}
                      onChange={(e) => setContentForm({
                        ...contentForm,
                        how_to_apply: { ...contentForm.how_to_apply, school_text: e.target.value }
                      })}
                      className="w-full px-3.5 py-2 bg-[#faf5fa] border border-[#edd6ed] rounded-xl text-xs font-medium text-[#4e2a4a]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1 text-xs">Option 2: Direct Individual Student Intro</label>
                    <textarea
                      rows={2}
                      value={contentForm.how_to_apply?.individual_text || ''}
                      onChange={(e) => setContentForm({
                        ...contentForm,
                        how_to_apply: { ...contentForm.how_to_apply, individual_text: e.target.value }
                      })}
                      className="w-full px-3.5 py-2 bg-[#faf5fa] border border-[#edd6ed] rounded-xl text-xs font-medium text-[#4e2a4a]"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="font-bold text-slate-700 text-xs">Step-by-Step Registration Guide</label>
                      <button
                        type="button"
                        onClick={() => {
                          const steps = contentForm.how_to_apply?.steps || [];
                          setContentForm({
                            ...contentForm,
                            how_to_apply: { ...contentForm.how_to_apply, steps: [...steps, ''] }
                          });
                        }}
                        className="text-xs text-[#6d3a68] font-bold hover:underline"
                      >
                        + Add Step
                      </button>
                    </div>
                    <div className="space-y-2">
                      {(contentForm.how_to_apply?.steps || []).map((step, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-slate-400 w-5">#{idx + 1}</span>
                          <input
                            type="text"
                            value={step}
                            onChange={(e) => {
                              const steps = [...(contentForm.how_to_apply?.steps || [])];
                              steps[idx] = e.target.value;
                              setContentForm({
                                ...contentForm,
                                how_to_apply: { ...contentForm.how_to_apply, steps }
                              });
                            }}
                            className="flex-1 px-3 py-1.5 bg-[#faf5fa] border border-[#edd6ed] rounded-lg text-xs"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const steps = (contentForm.how_to_apply?.steps || []).filter((_, i) => i !== idx);
                              setContentForm({
                                ...contentForm,
                                how_to_apply: { ...contentForm.how_to_apply, steps }
                              });
                            }}
                            className="p-1 text-rose-500 hover:bg-rose-50 rounded"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* 5. CLASS SYLLABUS MODULES */}
              {editorSection === 'syllabus' && (
                <div className="space-y-4">
                  <div className="border-b border-[#fdf2f8] pb-3 flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-black text-[#4e2a4a]">5. Class Syllabus Modules &amp; Weightage</h3>
                      <p className="text-xs text-slate-500">Edit section heading and curriculum modules shown to students and parents.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setContentForm({
                        ...contentForm,
                        syllabus_modules: [
                          ...contentForm.syllabus_modules,
                          { topic: 'New Module Title', description: 'Detailed sub-topics list...', questions: 15 }
                        ]
                      })}
                      className="px-3 py-1.5 bg-[#faf5fa] hover:bg-[#f4ebf4] text-[#6d3a68] border border-[#edd6ed] rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Module</span>
                    </button>
                  </div>

                  <div className="p-3.5 bg-[#FAF4E0]/40 rounded-xl border border-[#edd6ed]">
                    <label className="block font-black text-[#6d3a68] mb-1 text-xs">
                      ✏️ Section Heading on Public Page (H2)
                    </label>
                    <input
                      type="text"
                      value={contentForm.headings?.syllabus || ''}
                      onChange={(e) => setContentForm({
                        ...contentForm,
                        headings: { ...contentForm.headings, syllabus: e.target.value }
                      })}
                      placeholder="e.g. Class 1 Mathematics Olympiad Syllabus"
                      className="w-full px-3 py-2 bg-white border border-[#edd6ed] rounded-xl text-xs font-bold text-[#4e2a4a] focus:outline-none focus:border-[#6d3a68]"
                    />
                  </div>

                  <div className="space-y-3.5">
                    {contentForm.syllabus_modules.map((mod, idx) => (
                      <div key={idx} className="p-3.5 bg-[#faf5fa] rounded-xl border border-[#edd6ed] space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-gradient-to-r from-[#2563eb] via-[#7c3aed] to-[#db2777] text-white">
                            Module {idx + 1}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-slate-500 font-bold">Questions:</span>
                            <input
                              type="number"
                              min="1"
                              max="50"
                              value={mod.questions || 15}
                              onChange={(e) => {
                                const updated = [...contentForm.syllabus_modules];
                                updated[idx].questions = parseInt(e.target.value) || 15;
                                setContentForm({ ...contentForm, syllabus_modules: updated });
                              }}
                              className="w-16 px-2 py-1 bg-white border border-[#edd6ed] rounded text-xs font-bold text-[#4e2a4a]"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const updated = contentForm.syllabus_modules.filter((_, i) => i !== idx);
                                setContentForm({ ...contentForm, syllabus_modules: updated });
                              }}
                              className="p-1 text-rose-500 hover:bg-rose-50 rounded"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Topic / Module Heading</label>
                          <input
                            type="text"
                            value={mod.topic}
                            onChange={(e) => {
                              const updated = [...contentForm.syllabus_modules];
                              updated[idx].topic = e.target.value;
                              setContentForm({ ...contentForm, syllabus_modules: updated });
                            }}
                            className="w-full px-3 py-1.5 bg-white border border-[#edd6ed] rounded-lg text-xs font-bold text-[#4e2a4a]"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Sub-topics &amp; Conceptual Scope</label>
                          <textarea
                            rows={2}
                            value={mod.description}
                            onChange={(e) => {
                              const updated = [...contentForm.syllabus_modules];
                              updated[idx].description = e.target.value;
                              setContentForm({ ...contentForm, syllabus_modules: updated });
                            }}
                            className="w-full px-3 py-1.5 bg-white border border-[#edd6ed] rounded-lg text-xs font-medium text-slate-700"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 6. DATES & FEES */}
              {editorSection === 'dates-fee' && (
                <div className="space-y-4">
                  <div className="border-b border-[#fdf2f8] pb-3">
                    <h3 className="text-base font-black text-[#4e2a4a]">6. Exam Dates Schedule &amp; Fee Structure (2026-2027)</h3>
                    <p className="text-xs text-slate-500">Edit section heading, exam timelines, and fees.</p>
                  </div>

                  <div className="p-3.5 bg-[#FAF4E0]/40 rounded-xl border border-[#edd6ed]">
                    <label className="block font-black text-[#6d3a68] mb-1 text-xs">
                      ✏️ Section Heading on Public Page (H2)
                    </label>
                    <input
                      type="text"
                      value={contentForm.headings?.dates_fee || ''}
                      onChange={(e) => setContentForm({
                        ...contentForm,
                        headings: { ...contentForm.headings, dates_fee: e.target.value }
                      })}
                      placeholder="e.g. Dates and Fee for Class 1 Mathematics Olympiad"
                      className="w-full px-3 py-2 bg-white border border-[#edd6ed] rounded-xl text-xs font-bold text-[#4e2a4a] focus:outline-none focus:border-[#6d3a68]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1 text-xs">Level 1 Exam Dates</label>
                      <input
                        type="text"
                        value={contentForm.dates_fees?.level1Dates || ''}
                        onChange={(e) => setContentForm({
                          ...contentForm,
                          dates_fees: { ...contentForm.dates_fees, level1Dates: e.target.value }
                        })}
                        className="w-full px-3 py-2 bg-[#faf5fa] border border-[#edd6ed] rounded-xl text-xs font-semibold text-[#4e2a4a]"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1 text-xs">Level 2 Exam Dates</label>
                      <input
                        type="text"
                        value={contentForm.dates_fees?.level2Dates || ''}
                        onChange={(e) => setContentForm({
                          ...contentForm,
                          dates_fees: { ...contentForm.dates_fees, level2Dates: e.target.value }
                        })}
                        className="w-full px-3 py-2 bg-[#faf5fa] border border-[#edd6ed] rounded-xl text-xs font-semibold text-[#4e2a4a]"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1 text-xs">Last Date of Registration</label>
                      <input
                        type="text"
                        value={contentForm.dates_fees?.lastDateReg || ''}
                        onChange={(e) => setContentForm({
                          ...contentForm,
                          dates_fees: { ...contentForm.dates_fees, lastDateReg: e.target.value }
                        })}
                        className="w-full px-3 py-2 bg-[#faf5fa] border border-[#edd6ed] rounded-xl text-xs font-semibold text-[#4e2a4a]"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1 text-xs">Level 1 Answer Key Schedule</label>
                      <input
                        type="text"
                        value={contentForm.dates_fees?.level1AnswerKey || ''}
                        onChange={(e) => setContentForm({
                          ...contentForm,
                          dates_fees: { ...contentForm.dates_fees, level1AnswerKey: e.target.value }
                        })}
                        className="w-full px-3 py-2 bg-[#faf5fa] border border-[#edd6ed] rounded-xl text-xs font-semibold text-[#4e2a4a]"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1 text-xs">Level 1 Result Declaration</label>
                      <input
                        type="text"
                        value={contentForm.dates_fees?.level1Result || ''}
                        onChange={(e) => setContentForm({
                          ...contentForm,
                          dates_fees: { ...contentForm.dates_fees, level1Result: e.target.value }
                        })}
                        className="w-full px-3 py-2 bg-[#faf5fa] border border-[#edd6ed] rounded-xl text-xs font-semibold text-[#4e2a4a]"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1 text-xs">Level 2 Result Declaration</label>
                      <input
                        type="text"
                        value={contentForm.dates_fees?.level2Result || ''}
                        onChange={(e) => setContentForm({
                          ...contentForm,
                          dates_fees: { ...contentForm.dates_fees, level2Result: e.target.value }
                        })}
                        className="w-full px-3 py-2 bg-[#faf5fa] border border-[#edd6ed] rounded-xl text-xs font-semibold text-[#4e2a4a]"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1 text-xs">Fee for Indian Students (INR ₹)</label>
                      <input
                        type="text"
                        value={contentForm.dates_fees?.feeIndia || ''}
                        onChange={(e) => setContentForm({
                          ...contentForm,
                          dates_fees: { ...contentForm.dates_fees, feeIndia: e.target.value }
                        })}
                        className="w-full px-3 py-2 bg-[#faf5fa] border border-[#edd6ed] rounded-xl text-xs font-semibold text-[#4e2a4a]"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1 text-xs">Fee for International Students (USD $)</label>
                      <input
                        type="text"
                        value={contentForm.dates_fees?.feeInternational || ''}
                        onChange={(e) => setContentForm({
                          ...contentForm,
                          dates_fees: { ...contentForm.dates_fees, feeInternational: e.target.value }
                        })}
                        className="w-full px-3 py-2 bg-[#faf5fa] border border-[#edd6ed] rounded-xl text-xs font-semibold text-[#4e2a4a]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* 7. HOW TO PREPARE */}
              {editorSection === 'prepare' && (
                <div className="space-y-4">
                  <div className="border-b border-[#fdf2f8] pb-3">
                    <h3 className="text-base font-black text-[#4e2a4a]">7. How to Prepare Guide</h3>
                    <p className="text-xs text-slate-500">Edit section heading and practice strategies for students taking {editorSubjectSlug.toUpperCase()}.</p>
                  </div>

                  <div className="p-3.5 bg-[#FAF4E0]/40 rounded-xl border border-[#edd6ed]">
                    <label className="block font-black text-[#6d3a68] mb-1 text-xs">
                      ✏️ Section Heading on Public Page (H2)
                    </label>
                    <input
                      type="text"
                      value={contentForm.headings?.prepare || ''}
                      onChange={(e) => setContentForm({
                        ...contentForm,
                        headings: { ...contentForm.headings, prepare: e.target.value }
                      })}
                      placeholder="e.g. How to prepare for Class 1 Mathematics Olympiad?"
                      className="w-full px-3 py-2 bg-white border border-[#edd6ed] rounded-xl text-xs font-bold text-[#4e2a4a] focus:outline-none focus:border-[#6d3a68]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1 text-xs">Preparation Strategy &amp; Study Routine</label>
                    <textarea
                      rows={4}
                      value={contentForm.how_to_prepare?.strategy_text || ''}
                      onChange={(e) => setContentForm({
                        ...contentForm,
                        how_to_prepare: { ...contentForm.how_to_prepare, strategy_text: e.target.value }
                      })}
                      className="w-full px-3.5 py-2.5 bg-[#faf5fa] border border-[#edd6ed] rounded-xl text-xs font-medium text-[#4e2a4a]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1 text-xs">Exam Blueprint &amp; Mock Test Advice</label>
                    <textarea
                      rows={3}
                      value={contentForm.how_to_prepare?.blueprint_notes || ''}
                      onChange={(e) => setContentForm({
                        ...contentForm,
                        how_to_prepare: { ...contentForm.how_to_prepare, blueprint_notes: e.target.value }
                      })}
                      className="w-full px-3.5 py-2.5 bg-[#faf5fa] border border-[#edd6ed] rounded-xl text-xs font-medium text-[#4e2a4a]"
                    />
                  </div>
                </div>
              )}

              {/* 8. AWARDS & RECOGNITION */}
              {editorSection === 'awards' && (
                <div className="space-y-4">
                  <div className="border-b border-[#fdf2f8] pb-3">
                    <h3 className="text-base font-black text-[#4e2a4a]">8. Awards &amp; Recognition</h3>
                    <p className="text-xs text-slate-500">Edit section heading, cash scholarships, medals, and merit certificate criteria.</p>
                  </div>

                  <div className="p-3.5 bg-[#FAF4E0]/40 rounded-xl border border-[#edd6ed]">
                    <label className="block font-black text-[#6d3a68] mb-1 text-xs">
                      ✏️ Section Heading on Public Page (H2)
                    </label>
                    <input
                      type="text"
                      value={contentForm.headings?.awards || ''}
                      onChange={(e) => setContentForm({
                        ...contentForm,
                        headings: { ...contentForm.headings, awards: e.target.value }
                      })}
                      placeholder="e.g. Awards for Mathematics Olympiad"
                      className="w-full px-3 py-2 bg-white border border-[#edd6ed] rounded-xl text-xs font-bold text-[#4e2a4a] focus:outline-none focus:border-[#6d3a68]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1 text-xs">Scholarship &amp; Cash Prizes</label>
                    <textarea
                      rows={2}
                      value={contentForm.awards?.scholarship_info || ''}
                      onChange={(e) => setContentForm({
                        ...contentForm,
                        awards: { ...contentForm.awards, scholarship_info: e.target.value }
                      })}
                      className="w-full px-3.5 py-2 bg-[#faf5fa] border border-[#edd6ed] rounded-xl text-xs font-medium text-[#4e2a4a]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1 text-xs">Medals &amp; Trophies</label>
                    <textarea
                      rows={2}
                      value={contentForm.awards?.medals_info || ''}
                      onChange={(e) => setContentForm({
                        ...contentForm,
                        awards: { ...contentForm.awards, medals_info: e.target.value }
                      })}
                      className="w-full px-3.5 py-2 bg-[#faf5fa] border border-[#edd6ed] rounded-xl text-xs font-medium text-[#4e2a4a]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1 text-xs">Certificates &amp; Student Performance Report (SPR)</label>
                    <textarea
                      rows={2}
                      value={contentForm.awards?.certificate_info || ''}
                      onChange={(e) => setContentForm({
                        ...contentForm,
                        awards: { ...contentForm.awards, certificate_info: e.target.value }
                      })}
                      className="w-full px-3.5 py-2 bg-[#faf5fa] border border-[#edd6ed] rounded-xl text-xs font-medium text-[#4e2a4a]"
                    />
                  </div>
                </div>
              )}

              {/* 9. FAQS */}
              {editorSection === 'faqs' && (
                <div className="space-y-4">
                  <div className="border-b border-[#fdf2f8] pb-3 flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-black text-[#4e2a4a]">9. Frequently Asked Questions (FAQs)</h3>
                      <p className="text-xs text-slate-500">Edit section heading and custom Q&amp;A pairs specifically for {editorSubjectSlug.toUpperCase()} ({editorClassName}).</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setContentForm({
                        ...contentForm,
                        faqs: [...contentForm.faqs, { q: 'New Question?', a: 'Detailed answer response...' }]
                      })}
                      className="px-3 py-1.5 bg-[#faf5fa] hover:bg-[#f4ebf4] text-[#6d3a68] border border-[#edd6ed] rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add FAQ</span>
                    </button>
                  </div>

                  <div className="p-3.5 bg-[#FAF4E0]/40 rounded-xl border border-[#edd6ed]">
                    <label className="block font-black text-[#6d3a68] mb-1 text-xs">
                      ✏️ Section Heading on Public Page (H2)
                    </label>
                    <input
                      type="text"
                      value={contentForm.headings?.faqs || ''}
                      onChange={(e) => setContentForm({
                        ...contentForm,
                        headings: { ...contentForm.headings, faqs: e.target.value }
                      })}
                      placeholder="e.g. Mathematics Olympiads FAQs"
                      className="w-full px-3 py-2 bg-white border border-[#edd6ed] rounded-xl text-xs font-bold text-[#4e2a4a] focus:outline-none focus:border-[#6d3a68]"
                    />
                  </div>

                  <div className="space-y-4">
                    {contentForm.faqs.map((faq, idx) => (
                      <div key={idx} className="p-3.5 bg-[#faf5fa] rounded-xl border border-[#edd6ed] space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-extrabold text-[#6d3a68] uppercase">Question #{idx + 1}</span>
                          <button
                            type="button"
                            onClick={() => {
                              const updated = contentForm.faqs.filter((_, i) => i !== idx);
                              setContentForm({ ...contentForm, faqs: updated });
                            }}
                            className="p-1 text-rose-500 hover:bg-rose-50 rounded"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <input
                          type="text"
                          value={faq.q}
                          onChange={(e) => {
                            const updated = [...contentForm.faqs];
                            updated[idx].q = e.target.value;
                            setContentForm({ ...contentForm, faqs: updated });
                          }}
                          placeholder="e.g. How can I register for this exam?"
                          className="w-full px-3 py-1.5 bg-white border border-[#edd6ed] rounded-lg text-xs font-bold text-[#4e2a4a]"
                        />
                        <textarea
                          rows={2}
                          value={faq.a}
                          onChange={(e) => {
                            const updated = [...contentForm.faqs];
                            updated[idx].a = e.target.value;
                            setContentForm({ ...contentForm, faqs: updated });
                          }}
                          placeholder="Answer details..."
                          className="w-full px-3 py-1.5 bg-white border border-[#edd6ed] rounded-lg text-xs font-medium text-slate-700"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Bottom Quick Save Strip */}
              <div className="pt-4 border-t border-[#f4ebf4] flex items-center justify-between">
                <span className="text-xs text-slate-400 font-semibold">
                  Editing: <strong className="text-[#6d3a68]">{editorSubjectSlug.toUpperCase()}</strong> &bull; <strong className="text-[#d9775b]">{editorClassName}</strong>
                </span>

                <button
                  type="button"
                  onClick={handleSavePageContent}
                  disabled={contentSaving}
                  className="px-5 py-2.5 bg-gradient-to-r from-[#059669] to-[#047857] hover:from-[#047857] hover:to-[#065f46] text-white rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 shadow-xs disabled:opacity-50 active:scale-95"
                >
                  <Save className={`w-4 h-4 text-[#e7b84b] ${contentSaving ? 'animate-spin' : ''}`} />
                  <span>{contentSaving ? 'Saving Changes...' : 'Save All Changes to MySQL'}</span>
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 2: DISCIPLINES & OLYMPIADS LIST
         ========================================================================= */}
      {activeTab === 'subjects' && (
        <div className="space-y-5">
          <div className="bg-white p-4 rounded-2xl border border-[#edd6ed] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search disciplines by name, IMO/NSO/IEO code, or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#faf5fa] border border-[#edd6ed] rounded-xl text-xs sm:text-sm font-semibold text-[#4e2a4a] placeholder:text-slate-400 focus:outline-none focus:border-[#6d3a68] focus:bg-white transition-all"
              />
            </div>
            <span className="text-xs sm:text-sm font-black text-[#6d3a68] bg-[#faf5fa] px-3.5 py-1.5 rounded-xl border border-[#edd6ed] self-end sm:self-auto">
              {filteredSubjects.length} Active Olympiad Disciplines
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSubjects.map((sub) => (
              <div
                key={sub.id}
                className="bg-white rounded-3xl border-2 border-[#edd6ed] p-6 shadow-xs hover:shadow-md hover:border-[#6d3a68] transition-all duration-200 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-4">
                  {/* Top Bar: Code, Category, and Active Badge */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-11 h-11 rounded-2xl flex items-center justify-center text-white font-black text-sm shadow-xs shrink-0 tracking-tight"
                        style={{ backgroundColor: sub.color || '#6d3a68' }}
                      >
                        {sub.code || 'OLY'}
                      </div>
                      <span className="text-xs font-black uppercase tracking-wider px-3 py-1 rounded-xl bg-[#faf5fa] text-[#6d3a68] border border-[#edd6ed]">
                        {sub.category || 'General'}
                      </span>
                    </div>

                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-black capitalize ${
                        sub.status === 'active'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                          : 'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}
                    >
                      {sub.status || 'active'}
                    </span>
                  </div>

                  {/* Title & Official Subtitle */}
                  <div>
                    <h3 className="text-xl sm:text-2xl font-black text-[#4e2a4a] leading-tight">
                      {sub.name}
                    </h3>
                    {sub.full_name && sub.full_name !== sub.name && (
                      <p className="text-xs sm:text-sm font-bold text-[#d9775b] mt-0.5">
                        {sub.full_name}
                      </p>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed font-normal">
                    {sub.description || sub.tagline || 'Comprehensive Olympiad testing conceptual mastery and analytical depth.'}
                  </p>

                  {/* Meta Stats Badges */}
                  <div className="pt-2 flex flex-wrap items-center gap-2.5 text-xs font-black text-slate-700">
                    <span className="bg-[#faf5fa] border border-[#edd6ed] px-3 py-1.5 rounded-xl text-[#6d3a68] flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-[#d9775b]" />
                      {sub.questions_count || 50} Questions
                    </span>
                    <span className="bg-[#faf5fa] border border-[#edd6ed] px-3 py-1.5 rounded-xl text-[#6d3a68] flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-[#d9775b]" />
                      {sub.duration_minutes || 60} Mins
                    </span>
                  </div>
                </div>

                {/* Bottom Action Bar */}
                <div className="pt-4 border-t border-[#f4ebf4] flex items-center justify-between">
                  <span className="text-xs font-mono text-slate-500 font-bold">
                    Slug: #{sub?.slug || sub?.code?.toLowerCase() || 'general'}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      title="Edit Subject Details"
                      onClick={() => {
                        setEditingItem(sub);
                        setSubjectForm({
                          name: sub.name || '',
                          full_name: sub.full_name || '',
                          code: sub.code || '',
                          slug: sub.slug || '',
                          icon: sub.icon || 'Calculator',
                          color: sub.color || '#4e2a4a',
                          category: sub.category || 'Mathematics',
                          tagline: sub.tagline || '',
                          description: sub.description || '',
                          quote: sub.quote || '',
                          questions_count: sub.questions_count || 50,
                          duration_minutes: sub.duration_minutes || 60,
                          syllabus_overview: sub.syllabus_overview || '',
                          status: sub.status || 'active'
                        });
                        setShowSubjectModal(true);
                      }}
                      className="px-3.5 py-2 bg-[#f4ebf4] hover:bg-[#edd6ed] text-[#6d3a68] rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 text-xs sm:text-sm font-black shadow-2xs active:scale-95"
                    >
                      <Edit2 className="w-4 h-4" />
                      <span>Edit Subject</span>
                    </button>

                    <button
                      type="button"
                      title="Delete Discipline"
                      onClick={() => handleDeleteSubject(sub.id)}
                      className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 3: CLASSES & GRADES LIST
         ========================================================================= */}
      {activeTab === 'classes' && (
        <div className="space-y-5">
          <div className="bg-white p-4 rounded-2xl border border-[#edd6ed] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search classes by name, Nursery, LKG, UKG, or code..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#faf5fa] border border-[#edd6ed] rounded-xl text-xs sm:text-sm font-semibold text-[#4e2a4a] placeholder:text-slate-400 focus:outline-none focus:border-[#6d3a68] focus:bg-white transition-all"
              />
            </div>
            <span className="text-xs sm:text-sm font-black text-[#6d3a68] bg-[#faf5fa] px-3.5 py-1.5 rounded-xl border border-[#edd6ed] self-end sm:self-auto">
              {filteredClasses.length} Active Classes
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {filteredClasses.map((cls) => (
              <div
                key={cls.id}
                className="bg-white rounded-3xl border-2 border-[#edd6ed] p-5 shadow-xs hover:shadow-md hover:border-[#6d3a68] transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-2.5">
                    <span className="text-xs font-black font-mono px-2.5 py-1 rounded-lg bg-[#f4ebf4] text-[#6d3a68] border border-[#edd6ed]">
                      {cls.code}
                    </span>
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-black capitalize ${
                        cls.status === 'active'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                          : 'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}
                    >
                      {cls.status || 'active'}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-black text-[#4e2a4a] leading-tight">
                    {cls.name}
                  </h3>

                  <p className="text-xs text-slate-600 mt-1.5 line-clamp-2 leading-relaxed">
                    {cls.description || 'Curriculum framework with Olympiad practice sets.'}
                  </p>

                  <div className="mt-3 flex items-center gap-2 text-xs text-slate-500 font-bold">
                    <span>Order #{cls.order_no}</span>
                    <span>&bull;</span>
                    <span>{cls.student_count || 0} Students</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#fdf2f8] flex items-center justify-end gap-1.5">
                  <button
                    type="button"
                    title="Edit Class"
                    onClick={() => {
                      setEditingItem(cls);
                      setClassForm({
                        name: cls.name,
                        code: cls.code,
                        order_no: cls.order_no,
                        category: cls.category || 'Primary',
                        description: cls.description || '',
                        age_group: cls.age_group || '',
                        status: cls.status || 'active'
                      });
                      setShowClassModal(true);
                    }}
                    className="p-2 text-[#6d3a68] hover:bg-[#f4ebf4] rounded-xl transition-colors cursor-pointer"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    title="Delete Class"
                    onClick={() => handleDeleteClass(cls.id)}
                    className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 4: CHAPTERS
         ========================================================================= */}
      {activeTab === 'chapters' && (
        <div className="space-y-4">
          <div className="bg-white p-3.5 rounded-2xl border border-[#edd6ed] shadow-2xs flex flex-col md:flex-row items-center gap-3">
            <div className="flex items-center gap-2 w-full md:w-auto">
              <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" /> Filter by:
              </span>
              <select
                value={selectedSubjectId}
                onChange={(e) => setSelectedSubjectId(e.target.value)}
                className="px-2.5 py-1.5 bg-[#faf5fa] border border-[#edd6ed] rounded-xl text-xs font-bold text-[#4e2a4a] focus:outline-none focus:border-[#6d3a68]"
              >
                <option value="">All Disciplines</option>
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
                ))}
              </select>

              <select
                value={selectedClassId}
                onChange={(e) => setSelectedClassId(e.target.value)}
                className="px-2.5 py-1.5 bg-[#faf5fa] border border-[#edd6ed] rounded-xl text-xs font-bold text-[#4e2a4a] focus:outline-none focus:border-[#6d3a68]"
              >
                <option value="">All Classes</option>
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#edd6ed] shadow-xs overflow-hidden">
            <table className="w-full text-left text-xs text-[#2a1b29]">
              <thead className="bg-[#faf5fa] text-[#4e2a4a] font-bold uppercase tracking-wider text-[10px] border-b border-[#edd6ed]">
                <tr>
                  <th className="py-3 px-4">Order</th>
                  <th className="py-3 px-4">Discipline</th>
                  <th className="py-3 px-4">Class</th>
                  <th className="py-3 px-4">Chapter Name</th>
                  <th className="py-3 px-4">Code</th>
                  <th className="py-3 px-4">Topics Count</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#fdf2f8]">
                {chapters.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-400">
                      No chapters found for the selected filter. Click "Add Chapter" to create one.
                    </td>
                  </tr>
                ) : (
                  chapters.map((ch) => (
                    <tr key={ch.id} className="hover:bg-[#faf5fa] transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-slate-500">#{ch.order_no}</td>
                      <td className="py-3 px-4 font-bold text-[#6d3a68]">{ch.subject_name}</td>
                      <td className="py-3 px-4 font-semibold text-slate-700">{ch.class_name}</td>
                      <td className="py-3 px-4 font-bold text-[#4e2a4a]">{ch.name}</td>
                      <td className="py-3 px-4 font-mono text-slate-500">{ch.code || 'N/A'}</td>
                      <td className="py-3 px-4 font-semibold text-slate-600">{ch.topic_count || 0} Topics</td>
                      <td className="py-3 px-4 text-right space-x-1">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingItem(ch);
                            setChapterForm({
                              class_id: ch.class_id,
                              subject_id: ch.subject_id,
                              name: ch.name,
                              code: ch.code || '',
                              order_no: ch.order_no || 1
                            });
                            setShowChapterModal(true);
                          }}
                          className="p-1.5 text-[#6d3a68] hover:bg-[#f4ebf4] rounded-lg transition-colors cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteChapter(ch.id)}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 5: TOPICS
         ========================================================================= */}
      {activeTab === 'topics' && (
        <div className="space-y-4">
          <div className="bg-white p-3.5 rounded-2xl border border-[#edd6ed] shadow-2xs flex flex-col md:flex-row items-center gap-3">
            <span className="text-xs font-bold text-slate-500">Select Chapter:</span>
            <select
              value={selectedChapterId}
              onChange={(e) => setSelectedChapterId(e.target.value)}
              className="px-2.5 py-1.5 bg-[#faf5fa] border border-[#edd6ed] rounded-xl text-xs font-bold text-[#4e2a4a] focus:outline-none focus:border-[#6d3a68]"
            >
              <option value="">All Chapters</option>
              {chapters.map((ch) => (
                <option key={ch.id} value={ch.id}>
                  {ch.class_name} &bull; {ch.subject_name} &bull; {ch.name}
                </option>
              ))}
            </select>
          </div>

          <div className="bg-white rounded-2xl border border-[#edd6ed] shadow-xs overflow-hidden">
            <table className="w-full text-left text-xs text-[#2a1b29]">
              <thead className="bg-[#faf5fa] text-[#4e2a4a] font-bold uppercase tracking-wider text-[10px] border-b border-[#edd6ed]">
                <tr>
                  <th className="py-3 px-4">Order</th>
                  <th className="py-3 px-4">Topic / Concept Name</th>
                  <th className="py-3 px-4">Chapter</th>
                  <th className="py-3 px-4">Description / Key Notes</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#fdf2f8]">
                {topics.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-400">
                      No topics found. Click "Add Topic" to add specific concepts under chapters.
                    </td>
                  </tr>
                ) : (
                  topics.map((t) => (
                    <tr key={t.id} className="hover:bg-[#faf5fa] transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-slate-500">#{t.order_no}</td>
                      <td className="py-3 px-4 font-bold text-[#4e2a4a]">{t.name}</td>
                      <td className="py-3 px-4 font-semibold text-slate-600">{t.chapter_name || 'General'}</td>
                      <td className="py-3 px-4 text-slate-500 max-w-xs truncate">{t.description || '—'}</td>
                      <td className="py-3 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => {
                            apiClient.delete(`/academic/topics/${t.id}`).then(() => fetchTopics());
                          }}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CLASS MODAL */}
      <Modal
        isOpen={showClassModal}
        onClose={() => setShowClassModal(false)}
        title={editingItem ? `Edit Class: ${editingItem.name}` : 'Add New Class / Grade'}
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleSaveClass} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Class Display Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Nursery, LKG, Class 5"
                value={classForm.name}
                onChange={(e) => setClassForm({ ...classForm, name: e.target.value })}
                className="w-full px-3 py-2 bg-[#faf5fa] border border-[#edd6ed] rounded-xl text-xs font-semibold text-[#4e2a4a]"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Class Code *</label>
              <input
                type="text"
                required
                placeholder="e.g. NURSERY, CLASS-5"
                value={classForm.code}
                onChange={(e) => setClassForm({ ...classForm, code: e.target.value })}
                className="w-full px-3 py-2 bg-[#faf5fa] border border-[#edd6ed] rounded-xl text-xs font-semibold text-[#4e2a4a]"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#edd6ed]">
            <button
              type="button"
              onClick={() => setShowClassModal(false)}
              className="px-4 py-2 bg-white border border-[#edd6ed] text-slate-700 rounded-xl font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={actionLoading}
              className="px-4 py-2 bg-gradient-to-r from-[#2563eb] via-[#7c3aed] to-[#db2777] text-white rounded-xl font-bold shadow-xs"
            >
              {actionLoading ? 'Saving...' : editingItem ? 'Save Changes' : 'Create Class'}
            </button>
          </div>
        </form>
      </Modal>

      {/* CHAPTER MODAL */}
      <Modal
        isOpen={showChapterModal}
        onClose={() => setShowChapterModal(false)}
        title={editingItem ? `Edit Chapter: ${editingItem.name}` : 'Add New Chapter'}
        maxWidth="max-w-md"
      >
        <form onSubmit={handleSaveChapter} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Discipline *</label>
            <select
              required
              value={chapterForm.subject_id}
              onChange={(e) => setChapterForm({ ...chapterForm, subject_id: e.target.value })}
              className="w-full px-3 py-2 bg-[#faf5fa] border border-[#edd6ed] rounded-xl text-xs font-semibold text-[#4e2a4a]"
            >
              <option value="">Select Discipline</option>
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Class / Grade *</label>
            <select
              required
              value={chapterForm.class_id}
              onChange={(e) => setChapterForm({ ...chapterForm, class_id: e.target.value })}
              className="w-full px-3 py-2 bg-[#faf5fa] border border-[#edd6ed] rounded-xl text-xs font-semibold text-[#4e2a4a]"
            >
              <option value="">Select Class</option>
              {classes.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Chapter Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Real Numbers &amp; Number Systems"
              value={chapterForm.name}
              onChange={(e) => setChapterForm({ ...chapterForm, name: e.target.value })}
              className="w-full px-3 py-2 bg-[#faf5fa] border border-[#edd6ed] rounded-xl text-xs font-semibold text-[#4e2a4a]"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#edd6ed]">
            <button
              type="button"
              onClick={() => setShowChapterModal(false)}
              className="px-4 py-2 bg-white border border-[#edd6ed] text-slate-700 rounded-xl font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={actionLoading}
              className="px-4 py-2 bg-gradient-to-r from-[#2563eb] via-[#7c3aed] to-[#db2777] text-white rounded-xl font-bold shadow-xs"
            >
              {actionLoading ? 'Saving...' : 'Save Chapter'}
            </button>
          </div>
        </form>
      </Modal>

      {/* TOPIC MODAL */}
      <Modal
        isOpen={showTopicModal}
        onClose={() => setShowTopicModal(false)}
        title="Add Topic / Concept"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleSaveTopic} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Parent Chapter *</label>
            <select
              required
              value={topicForm.chapter_id}
              onChange={(e) => setTopicForm({ ...topicForm, chapter_id: e.target.value })}
              className="w-full px-3 py-2 bg-[#faf5fa] border border-[#edd6ed] rounded-xl text-xs font-semibold text-[#4e2a4a]"
            >
              <option value="">Select Chapter</option>
              {chapters.map((ch) => (
                <option key={ch.id} value={ch.id}>
                  {ch.class_name} &bull; {ch.subject_name} &bull; {ch.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Topic Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Euclid Division Lemma &amp; HCF"
              value={topicForm.name}
              onChange={(e) => setTopicForm({ ...topicForm, name: e.target.value })}
              className="w-full px-3 py-2 bg-[#faf5fa] border border-[#edd6ed] rounded-xl text-xs font-semibold text-[#4e2a4a]"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#edd6ed]">
            <button
              type="button"
              onClick={() => setShowTopicModal(false)}
              className="px-4 py-2 bg-white border border-[#edd6ed] text-slate-700 rounded-xl font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={actionLoading}
              className="px-4 py-2 bg-gradient-to-r from-[#2563eb] via-[#7c3aed] to-[#db2777] text-white rounded-xl font-bold shadow-xs"
            >
              {actionLoading ? 'Saving...' : 'Save Topic'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
