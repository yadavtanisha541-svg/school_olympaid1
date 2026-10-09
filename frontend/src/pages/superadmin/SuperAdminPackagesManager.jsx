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
  Upload,
  FileSpreadsheet,
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
  Bookmark,
  ChevronRight,
  FolderTree,
  ListPlus,
  Copy,
  Hash,
  Calculator,
  Atom,
  Brain,
  Cpu,
  Globe,
  Palette,
  Languages
} from 'lucide-react';

const CLASSES_LIST = [
  'All',
  'Nursery',
  'LKG',
  'UKG',
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
  { code: 'ALL', label: 'All Subjects', name: 'All Olympiads Combined', color: '#6d3a68', icon: Sparkles },
  { code: 'IMO', label: 'IMO (Mathematics)', name: 'International Mathematics Olympiad', color: '#ec4899', icon: Calculator },
  { code: 'ISO', label: 'ISO / NSO (Science)', name: 'International Science Olympiad', color: '#8b5cf6', icon: Atom },
  { code: 'IDLO', label: 'IDLO (Digital Literacy)', name: 'International Digital Literacy Olympiad', color: '#3b82f6', icon: Cpu },
  { code: 'IEO', label: 'IEO (English)', name: 'International English Olympiad', color: '#06b6d4', icon: BookOpen },
  { code: 'IGKO', label: 'IGKO (General Knowledge)', name: 'International General Knowledge Olympiad', color: '#f59e0b', icon: Globe },
  { code: 'IHO', label: 'IHO (Hindi)', name: 'International Hindi Olympiad', color: '#10b981', icon: Languages }
];

const PAPER_CATEGORIES = [
  { id: 'all', label: 'All Papers' },
  { id: 'previous_year', label: '🏆 Free Previous Year Papers' },
  { id: 'sample_paper', label: '📄 Free Sample Papers' },
  { id: 'mock_test', label: '📝 Mock Test Series' },
  { id: 'test_generator', label: '⚡ Test Generator Pro' }
];

// Sample questions format template for 1-click loading in Super Admin
export const SAMPLE_MOCK_TEST_QUESTIONS = `Q1. If 3x + 15 = 45, what is the value of 2x - 5?
A) 15
B) 20
C) 25
D) 30
Correct: A
Marks: 1
Section: General Awareness
Explanation: 3x + 15 = 45 => 3x = 30 => x = 10. Then 2(10) - 5 = 20 - 5 = 15.

Q2. What is the official national currency of Japan?
A) Yuan
B) Yen
C) Won
D) Ringgit
Correct: B
Marks: 1
Section: General Awareness
Explanation: The Japanese Yen is the official currency of Japan.

Q3. Who is celebrated as the inventor of the World Wide Web (WWW) in 1989?
A) Sir Tim Berners-Lee
B) Bill Gates
C) Steve Jobs
D) Alan Turing
Correct: A
Marks: 1
Section: Achievers Section
Explanation: Sir Tim Berners-Lee invented the World Wide Web while at CERN in 1989.

Q4. Which planet is famously known as the "Red Planet" due to iron oxide on its surface?
A) Venus
B) Mars
C) Jupiter
D) Mercury
Correct: B
Marks: 1
Section: General Awareness
Explanation: Mars appears reddish because of pervasive iron oxide minerals on its terrain.`;

// Universal multi-format intelligent question parser (Handles Plain text, Q1..Qn, JSON, and CSV)
export const parseAnyQuestionsInput = (rawInput, defaultSection = 'General Awareness') => {
  if (!rawInput || !rawInput.trim()) return [];
  const text = rawInput.trim();

  // 1. JSON Array or Object
  if ((text.startsWith('[') && text.endsWith(']')) || (text.startsWith('{') && text.endsWith('}'))) {
    try {
      const parsed = JSON.parse(text);
      const list = Array.isArray(parsed) ? parsed : (parsed.questions || parsed.data || [parsed]);
      if (Array.isArray(list) && list.length > 0) {
        return list.map((item, idx) => {
          let opts = ['', '', '', ''];
          if (Array.isArray(item.options)) {
            opts = [item.options[0] || '', item.options[1] || '', item.options[2] || '', item.options[3] || ''];
          } else {
            opts = [
              item.option_a || item.a || item.optA || '',
              item.option_b || item.b || item.optB || '',
              item.option_c || item.c || item.optC || '',
              item.option_d || item.d || item.optD || ''
            ];
          }
          opts = opts.map((o, oIdx) => o ? String(o).trim() : `Option ${String.fromCharCode(65 + oIdx)}`);

          let correct = 0;
          if (typeof item.correct === 'number') {
            correct = Math.max(0, Math.min(3, item.correct));
          } else {
            const cStr = String(item.correct_option || item.correct || item.answer || item.ans || 'A').toUpperCase().trim();
            const idxMatch = ['A', 'B', 'C', 'D'].indexOf(cStr);
            if (idxMatch >= 0) correct = idxMatch;
            else if (!isNaN(parseInt(cStr))) correct = Math.max(0, Math.min(3, parseInt(cStr) - 1));
          }

          return {
            id: Date.now() + idx,
            section: item.section || defaultSection,
            q: String(item.q || item.question || item.question_text || item.title || `Question ${idx + 1}`).trim(),
            options: opts,
            correct,
            marks: Number(item.marks || item.points || 1) || 1,
            explanation: String(item.explanation || item.solution || item.hint || '').trim()
          };
        }).filter(q => q.q.length > 0);
      }
    } catch (e) {
      // Fall through to text/csv parser
    }
  }

  // 2. CSV format
  const rawLines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  if (rawLines.length > 1 && rawLines[0].includes(',') && (rawLines[0].toLowerCase().includes('question') || rawLines[0].toLowerCase().includes('option') || rawLines[0].toLowerCase().includes('class'))) {
    try {
      const parseCSVLine = (line) => {
        const result = [];
        let curr = '';
        let inQuotes = false;
        for (let i = 0; i < line.length; i++) {
          const char = line[i];
          if (char === '"' && line[i + 1] === '"') {
            curr += '"';
            i++;
          } else if (char === '"') {
            inQuotes = !inQuotes;
          } else if (char === ',' && !inQuotes) {
            result.push(curr.trim());
            curr = '';
          } else {
            curr += char;
          }
        }
        result.push(curr.trim());
        return result;
      };

      const parsedCsv = [];
      for (let i = 1; i < rawLines.length; i++) {
        const parts = parseCSVLine(rawLines[i]);
        if (parts.length >= 2) {
          const qText = parts[0] || parts[3] || parts[4] || '';
          const optA = parts[1] || parts[5] || 'Option A';
          const optB = parts[2] || parts[6] || 'Option B';
          const optC = parts[3] || parts[7] || 'Option C';
          const optD = parts[4] || parts[8] || 'Option D';
          let corr = 0;
          const corrStr = String(parts[5] || parts[9] || '0').toUpperCase().trim();
          if (['A', 'B', 'C', 'D'].includes(corrStr)) corr = ['A', 'B', 'C', 'D'].indexOf(corrStr);
          else if (!isNaN(parseInt(corrStr))) corr = Math.max(0, Math.min(3, parseInt(corrStr)));

          if (qText) {
            parsedCsv.push({
              id: Date.now() + i,
              section: parts[10] || defaultSection,
              q: qText,
              options: [optA, optB, optC, optD],
              correct: corr,
              marks: Number(parts[11]) || 1,
              explanation: parts[12] || ''
            });
          }
        }
      }
      if (parsedCsv.length > 0) return parsedCsv;
    } catch (err) {
      // Fallback
    }
  }

  // 3. Robust Text Parser (Supports Q1., 1., double-newlines, inline options, and plain single/multi-line questions)
  let rawBlocks = text.split(/(?:\r?\n\s*\r?\n)|(?=(?:^|\n)\s*(?:Q\d*[\.:\)]|Question\s*\d*[\.:\)]|\d+[\.\)]\s+[A-Z]))/im);
  rawBlocks = rawBlocks.map(b => b.trim()).filter(Boolean);

  if (rawBlocks.length === 0) {
    rawBlocks = [text];
  }

  const results = [];

  rawBlocks.forEach((blk, idx) => {
    const bLines = blk.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    if (bLines.length === 0) return;

    let questionStatement = '';
    const options = ['', '', '', ''];
    let correct = 0;
    let explanation = '';
    let marks = 1;
    let section = defaultSection;

    const remainingLines = [];

    bLines.forEach((l) => {
      const optMatch = l.match(/^(?:[\(\[]?([A-Da-d1-4])[\.\)\]\:\-]|Option\s+([A-Da-d1-4])[\:\.\-]?)\s*(.+)$/i);
      const ansMatch = l.match(/^(?:Answer|Ans|Correct(?:\s*Option)?|Key|Right\s*Answer)[\:\s\-]+([A-Da-d1-4]|.+)/i);
      const expMatch = l.match(/^(?:Explanation|Solution|Hint|Reason|Note)[\:\s\-]+(.+)$/i);
      const marksMatch = l.match(/^(?:Marks|Mark|Points|Score)[\:\s\-]+(\d+)/i);
      const secMatch = l.match(/^(?:Section|Sec|Topic|Category)[\:\s\-]+(.+)$/i);

      if (ansMatch) {
        const val = ansMatch[1].toUpperCase().trim();
        if (['A', 'B', 'C', 'D'].includes(val)) {
          correct = ['A', 'B', 'C', 'D'].indexOf(val);
        } else if (['1', '2', '3', '4'].includes(val)) {
          correct = parseInt(val) - 1;
        } else {
          if (val.includes('B')) correct = 1;
          else if (val.includes('C')) correct = 2;
          else if (val.includes('D')) correct = 3;
          else correct = 0;
        }
      } else if (expMatch) {
        explanation = expMatch[1].trim();
      } else if (marksMatch) {
        marks = Number(marksMatch[1]) || 1;
      } else if (secMatch) {
        section = secMatch[1].trim();
      } else if (optMatch) {
        const optLetter = (optMatch[1] || optMatch[2]).toUpperCase();
        const optText = optMatch[3].trim();
        let targetIdx = -1;
        if (['A', 'B', 'C', 'D'].includes(optLetter)) targetIdx = ['A', 'B', 'C', 'D'].indexOf(optLetter);
        else if (['1', '2', '3', '4'].includes(optLetter)) targetIdx = parseInt(optLetter) - 1;
        if (targetIdx >= 0) options[targetIdx] = optText;
      } else {
        remainingLines.push(l);
      }
    });

    if (remainingLines.length > 0) {
      let firstLine = remainingLines[0].replace(/^(?:Q\d*[\.:\)]|Question\s*\d*[\.:\)]|\d+[\.\)]|Problem\s*\d*[\.:\)])\s*/i, '').trim();
      questionStatement = firstLine || remainingLines[0];

      const isOptionsEmpty = options.every(o => !o);
      if (isOptionsEmpty && remainingLines.length >= 5) {
        options[0] = remainingLines[1];
        options[1] = remainingLines[2];
        options[2] = remainingLines[3];
        options[3] = remainingLines[4];
        if (remainingLines.length > 5 && !explanation) {
          explanation = remainingLines.slice(5).join(' ');
        }
      } else if (remainingLines.length > 1) {
        if (!options.some(o => o.length > 0)) {
          questionStatement += ' ' + remainingLines.slice(1).join(' ');
        }
      }
    }

    // Check for inline options (e.g. "A) 15 B) 20 C) 25 D) 30")
    if (options.every(o => !o)) {
      const inlineMatches = [...questionStatement.matchAll(/(?:^|\s)(?:[\(\[]?([A-D])[\.\)\]\:\-])\s*([^A-D\n\(\[]+)/gi)];
      if (inlineMatches.length >= 2) {
        inlineMatches.forEach(m => {
          const letter = m[1].toUpperCase();
          const textVal = m[2].trim();
          const optIdx = ['A', 'B', 'C', 'D'].indexOf(letter);
          if (optIdx >= 0) options[optIdx] = textVal;
        });
        const firstOptIndex = questionStatement.search(/(?:^|\s)(?:[\(\[]?[A-D][\.\)\]\:\-])/i);
        if (firstOptIndex > 0) {
          questionStatement = questionStatement.substring(0, firstOptIndex).trim();
        }
      }
    }

    // Assign fallback labels for missing options
    const finalOptions = options.map((opt, oIdx) => opt ? opt.trim() : `Option ${String.fromCharCode(65 + oIdx)}`);

    if (questionStatement.trim().length > 0) {
      results.push({
        id: Date.now() + idx,
        section: section || defaultSection,
        q: questionStatement.trim(),
        options: finalOptions,
        correct,
        marks,
        explanation: explanation.trim()
      });
    }
  });

  return results;
};

export const SuperAdminPackagesManager = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('exam_papers'); // 'exam_papers' | 'packages' | 'orders'

  // Level 1 vs Level 2 navigation: When null, shows all Subject Covers. When set (e.g. 'IGKO'), shows that Subject's Mock Tests
  const [selectedSubjectCover, setSelectedSubjectCover] = useState(null);

  // Common Filters
  const [packageClassFilter, setPackageClassFilter] = useState('Class 6');
  const [packageSubjectFilter, setPackageSubjectFilter] = useState('ALL');
  const [paperCategoryFilter, setPaperCategoryFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // ==========================================
  // 1. EXAM PAPERS & MOCK TESTS STATE
  // ==========================================
  const [examPapers, setExamPapers] = useState([]);
  const [loadingExamPapers, setLoadingExamPapers] = useState(false);
  const [isAuthoringPaper, setIsAuthoringPaper] = useState(false); // Level 3: Full-page studio state
  const [editingPaper, setEditingPaper] = useState(null);
  const [paperModalTab, setPaperModalTab] = useState('details'); // 'details' | 'questions' | 'bulk'
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);

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

  // Helper functions for robust subject & class matching
  const matchSubjectCodes = (testSubCode, targetCode) => {
    if (!testSubCode || !targetCode) return false;
    const s1 = String(testSubCode).toUpperCase().trim();
    const s2 = String(targetCode).toUpperCase().trim();
    if (s1 === s2) return true;
    if (s2 === 'ALL') return true;

    const idloCodes = ['IDLO', 'IEOD', 'ICSO', 'ICO', 'COMPUTER', 'DIGITAL LITERACY'];
    if (idloCodes.includes(s2) && idloCodes.includes(s1)) return true;

    const ihoCodes = ['IHO', 'IEOH', 'HINDI'];
    if (ihoCodes.includes(s2) && ihoCodes.includes(s1)) return true;

    const imoCodes = ['IMO', 'IEOM', 'MATH', 'MATHEMATICS'];
    if (imoCodes.includes(s2) && imoCodes.includes(s1)) return true;

    const isoCodes = ['ISO', 'IEOS', 'NSO', 'SCIENCE'];
    if (isoCodes.includes(s2) && isoCodes.includes(s1)) return true;

    const ieoCodes = ['IEO', 'IEOE', 'ENGLISH'];
    if (ieoCodes.includes(s2) && ieoCodes.includes(s1)) return true;

    const igkoCodes = ['IGKO', 'IEOG', 'GK', 'GENERAL KNOWLEDGE'];
    if (igkoCodes.includes(s2) && igkoCodes.includes(s1)) return true;

    return s1.includes(s2) || s2.includes(s1);
  };

  const matchClassNames = (testClass, filterClass) => {
    if (!filterClass || filterClass === 'All' || filterClass === 'ALL') return true;
    if (!testClass) return false;
    const m1 = String(testClass).match(/\d+/);
    const m2 = String(filterClass).match(/\d+/);
    if (m1 && m2) return m1[0] === m2[0];
    return String(testClass).trim().toLowerCase() === String(filterClass).trim().toLowerCase();
  };

  // Fetch Exam Papers
  const fetchExamPapers = async () => {
    setLoadingExamPapers(true);
    try {
      const res = await apiClient.get('/exam-papers', {
        class: packageClassFilter,
        subject: packageSubjectFilter,
        category: 'all'
      });
      let papers = [];
      if (res && res.success && Array.isArray(res.data)) {
        papers = res.data;
      }

      // Merge with local stores if available
      try {
        const local = JSON.parse(localStorage.getItem('olympiadhub_db_exam_papers') || '[]');
        const mockDb = JSON.parse(localStorage.getItem('mock_db_exam_papers') || '[]');
        const genPapers = JSON.parse(localStorage.getItem('admin_generator_papers') || '[]');
        const combined = [...papers, ...local, ...mockDb, ...genPapers];
        const unique = [];
        const seen = new Set();
        combined.forEach(p => {
          if (p && p.id && !seen.has(String(p.id))) {
            seen.add(String(p.id));
            unique.push(p);
          }
        });
        setExamPapers(unique);
      } catch (e) {
        setExamPapers(papers);
      }
    } catch (e) {
      console.warn('Error fetching exam papers:', e);
      try {
        const local = JSON.parse(localStorage.getItem('olympiadhub_db_exam_papers') || localStorage.getItem('mock_db_exam_papers') || '[]');
        setExamPapers(local);
      } catch (err) {
        setExamPapers([]);
      }
    } finally {
      setLoadingExamPapers(false);
    }
  };

  // Open Create Exam Paper (Full-Page View)
  const handleOpenCreatePaper = (overrideSubject, overrideClass) => {
    setEditingPaper(null);
    setPaperModalTab('details');
    setActiveQuestionIndex(0);
    const defaultSub = overrideSubject || (selectedSubjectCover ? selectedSubjectCover : (packageSubjectFilter !== 'ALL' ? packageSubjectFilter : 'IGKO'));
    const defaultCls = overrideClass || (packageClassFilter !== 'All' ? packageClassFilter : 'Class 6');

    setPaperTitle(`${defaultCls} ${defaultSub} Mock Test Paper`);
    setPaperShortCode(`${defaultSub} - 2026`);
    setPaperClass(defaultCls);
    setPaperSubjectCode(defaultSub);
    setPaperCategory('mock_test');
    setPaperYear('2026');
    setPaperDuration('60');
    setPaperTotalMarks('60');
    setPaperCutoffMarks('42');
    setPaperSections(['General Awareness', 'Core Subject HOTS', 'Achievers Section']);
    setPaperQuestions([
      {
        id: 1,
        section: 'General Awareness',
        q: 'Enter your first Olympiad question here...',
        options: ['Option A (Answer choice 1)', 'Option B (Answer choice 2)', 'Option C (Answer choice 3)', 'Option D (Answer choice 4)'],
        correct: 0,
        marks: 1,
        explanation: 'Step-by-step conceptual explanation for this solution.'
      }
    ]);
    setBulkQuestionsInput('');
    setIsAuthoringPaper(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Open Edit Exam Paper (Full-Page View)
  const handleOpenEditPaper = (p, initialTab = 'details') => {
    setEditingPaper(p);
    setPaperModalTab(initialTab);
    setActiveQuestionIndex(0);
    setPaperTitle(p.title || '');
    setPaperShortCode(p.short_code || '');
    setPaperClass(p.class_name || 'Class 6');
    setPaperSubjectCode(p.subject_code || 'IGKO');
    setPaperCategory(p.paper_category || 'mock_test');
    setPaperYear(p.exam_year || '2026');
    setPaperDuration(String(p.duration_minutes || 60));
    setPaperTotalMarks(String(p.total_marks || 60));
    setPaperCutoffMarks(String(p.cutoff_marks || 42));
    setPaperSections(Array.isArray(p.sections) && p.sections.length > 0 ? p.sections : ['General Awareness', 'Current Affairs', 'Achievers Section']);
    setPaperQuestions(Array.isArray(p.questions) ? p.questions : []);
    setBulkQuestionsInput('');
    setIsAuthoringPaper(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Add a specific Mock Test to a Series
  const handleAddMockTestToSeries = (subjectCode, className, count) => {
    setEditingPaper(null);
    setPaperModalTab('details');
    setActiveQuestionIndex(0);
    const sCode = (subjectCode || 'IDLO').toUpperCase();
    const cName = className || 'Class 6';
    setPaperTitle(`${cName} ${sCode} Level-1 Mock Test ${count + 1}`);
    setPaperShortCode(`${sCode} - Mock ${count + 1}`);
    setPaperClass(cName);
    setPaperSubjectCode(sCode);
    setPaperCategory('mock_test');
    setPaperYear('2026');
    setPaperDuration('60');
    setPaperTotalMarks('60');
    setPaperCutoffMarks('42');

    let defaultSections = ['Subject Knowledge', 'Logic & Analysis', 'Achievers Section'];
    let defaultQText = 'Which of the following represents the correct statement?';
    if (sCode === 'IDLO' || sCode === 'IEOD' || sCode === 'ICSO') {
      defaultSections = ['Computer Fundamentals', 'Cyber Safety & AI', 'Achievers Section'];
      defaultQText = 'Which protocol is used for secure encrypted communication over the World Wide Web?';
    } else if (sCode === 'IHO' || sCode === 'IEOH') {
      defaultSections = ['Hindi Vyakaran', 'Bhasha Bodh', 'Achievers Section'];
      defaultQText = "निम्न में से कौन-सा शब्द 'सूर्य' का पर्यायवाची नहीं है?";
    } else if (sCode === 'IMO' || sCode === 'IEOM') {
      defaultSections = ['Logical Reasoning', 'Mathematical Reasoning', 'Achievers Section'];
      defaultQText = 'If 3x + 15 = 45, what is the value of 2x - 5?';
    } else if (sCode === 'ISO' || sCode === 'IEOS') {
      defaultSections = ['Science & Experiments', 'Applied Science', 'Achievers Section'];
      defaultQText = 'Which component of blood is primarily responsible for fighting infections?';
    }

    setPaperSections(defaultSections);
    setPaperQuestions([
      {
        id: 1,
        section: defaultSections[0],
        q: defaultQText,
        options: ['Option A', 'Option B', 'Option C', 'Option D'],
        correct: 0,
        marks: 1,
        explanation: 'Detailed step-by-step explanation.'
      }
    ]);
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
      const paperId = editingPaper ? editingPaper.id : Date.now();
      const payload = {
        id: paperId,
        title: paperTitle,
        short_code: paperShortCode || `${paperSubjectCode} - Mock`,
        series_title: `${paperClass} - All India ${paperSubjectCode} Mock Test Series`,
        subject_code: (paperSubjectCode || 'IMO').toUpperCase(),
        subject_name: paperSubjectCode === 'IDLO' ? 'IDLO (Digital Literacy)' : paperSubjectCode === 'IHO' ? 'IHO (Hindi)' : `${paperSubjectCode} Olympiad`,
        class_name: paperClass,
        paper_category: paperCategory || 'mock_test',
        exam_year: paperYear || '2026',
        duration_minutes: Number(paperDuration) || 60,
        total_marks: Number(paperTotalMarks) || 60,
        cutoff_marks: Number(paperCutoffMarks) || 42,
        status: 'published',
        header_color: '#809926',
        accent_color: '#809926',
        sections: paperSections.length > 0 ? paperSections : ['Subject Section 1', 'Achievers Section'],
        questions: paperQuestions
      };

      if (editingPaper) {
        await apiClient.put(`/exam-papers/${editingPaper.id}`, payload).catch(() => null);
      } else {
        await apiClient.post('/exam-papers', payload).catch(() => null);
      }

      // Direct Sync across all localStorage keys
      try {
        const dbKey = 'olympiadhub_db_exam_papers';
        const existingDb = JSON.parse(localStorage.getItem(dbKey) || '[]');
        const updatedDb = editingPaper 
          ? existingDb.map(p => String(p.id) === String(editingPaper.id) ? { ...p, ...payload } : p)
          : [payload, ...existingDb.filter(p => String(p.id) !== String(payload.id))];
        localStorage.setItem(dbKey, JSON.stringify(updatedDb));

        const mockKey = 'mock_db_exam_papers';
        const existingMock = JSON.parse(localStorage.getItem(mockKey) || '[]');
        const updatedMock = editingPaper
          ? existingMock.map(p => String(p.id) === String(editingPaper.id) ? { ...p, ...payload } : p)
          : [payload, ...existingMock.filter(p => String(p.id) !== String(payload.id))];
        localStorage.setItem(mockKey, JSON.stringify(updatedMock));

        const genKey = 'admin_generator_papers';
        const existingGen = JSON.parse(localStorage.getItem(genKey) || '[]');
        const updatedGen = editingPaper
          ? existingGen.map(p => String(p.id) === String(editingPaper.id) ? { ...p, ...payload } : p)
          : [payload, ...existingGen.filter(p => String(p.id) !== String(payload.id))];
        localStorage.setItem(genKey, JSON.stringify(updatedGen));
      } catch (err) {}

      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('olympiadhub-admin-papers-updated', { detail: payload }));
        window.dispatchEvent(new CustomEvent('olympiadhub-data-updated', { detail: { table: 'exam_papers', data: payload } }));
      }

      // Immediately update local state so cards appear right away
      setExamPapers(prev => {
        if (editingPaper) {
          return prev.map(p => String(p.id) === String(editingPaper.id) ? { ...p, ...payload } : p);
        }
        return [payload, ...prev.filter(p => String(p.id) !== String(payload.id))];
      });

      showToast(editingPaper ? '✓ Mock Test updated successfully!' : '✓ New Mock Test added and published successfully!');
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
      await apiClient.delete(`/exam-papers/${id}`).catch(() => null);
      try {
        const dbKey = 'olympiadhub_db_exam_papers';
        const existingDb = JSON.parse(localStorage.getItem(dbKey) || '[]');
        localStorage.setItem(dbKey, JSON.stringify(existingDb.filter(p => String(p.id) !== String(id))));

        const mockKey = 'mock_db_exam_papers';
        const existingMock = JSON.parse(localStorage.getItem(mockKey) || '[]');
        localStorage.setItem(mockKey, JSON.stringify(existingMock.filter(p => String(p.id) !== String(id))));

        const genKey = 'admin_generator_papers';
        const existingGen = JSON.parse(localStorage.getItem(genKey) || '[]');
        localStorage.setItem(genKey, JSON.stringify(existingGen.filter(p => String(p.id) !== String(id))));
      } catch (e) {}

      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('olympiadhub-admin-papers-updated', { detail: { deletedId: id } }));
      }

      setExamPapers(prev => prev.filter(p => String(p.id) !== String(id)));
      showToast('✓ Mock Test deleted successfully.', 'info');
    } catch (err) {
      console.warn('Delete error:', err);
      showToast('Failed to delete paper.', 'error');
    }
  };

  // Bulk Parse Helper with Universal Intelligent Parsing
  const handleParseBulkQuestions = () => {
    if (!bulkQuestionsInput.trim()) {
      showToast('Please paste or type your questions first.', 'info');
      return;
    }
    const defaultSec = paperSections[0] || 'General Awareness';
    const parsed = parseAnyQuestionsInput(bulkQuestionsInput, defaultSec);

    if (parsed.length > 0) {
      const startId = paperQuestions.length;
      const mapped = parsed.map((p, i) => ({
        ...p,
        id: Date.now() + i,
        section: p.section || defaultSec
      }));
      setPaperQuestions([...paperQuestions, ...mapped]);
      setBulkQuestionsInput('');
      setPaperModalTab('questions');
      setActiveQuestionIndex(startId); // Focus newly added question
      showToast(`✓ Successfully imported ${mapped.length} questions!`);
    } else {
      showToast('Could not parse questions. Click "Load Sample Format Template" to see the format.', 'error');
    }
  };

  // Bulk File Upload Helper (.txt, .csv, .json)
  const handleBulkFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const content = ev.target?.result || '';
      setBulkQuestionsInput(content);
      const detected = parseAnyQuestionsInput(content, paperSections[0] || 'General Awareness');
      if (detected.length > 0) {
        showToast(`✓ Loaded "${file.name}" (${detected.length} questions detected). Click "Parse & Add" to import.`);
      } else {
        showToast(`Loaded "${file.name}". Click "Parse & Add All Questions" below.`);
      }
    };
    reader.readAsText(file);
  };

  // Add a blank question
  const handleAddBlankQuestion = () => {
    const newQ = {
      id: Date.now(),
      section: paperSections[0] || 'General Awareness',
      q: '',
      options: ['', '', '', ''],
      correct: 0,
      marks: 1,
      explanation: ''
    };
    setPaperQuestions([...paperQuestions, newQ]);
    setActiveQuestionIndex(paperQuestions.length);
  };

  // Update question field
  const handleUpdateQuestion = (idx, field, val) => {
    const updated = [...paperQuestions];
    updated[idx] = { ...updated[idx], [field]: val };
    setPaperQuestions(updated);
  };

  // Update question option
  const handleUpdateOption = (qIdx, optIdx, val) => {
    const updated = [...paperQuestions];
    const opts = [...(updated[qIdx].options || ['', '', '', ''])];
    opts[optIdx] = val;
    updated[qIdx] = { ...updated[qIdx], options: opts };
    setPaperQuestions(updated);
  };

  // Duplicate a question
  const handleDuplicateQuestion = (idx) => {
    const original = paperQuestions[idx];
    if (!original) return;
    const duplicated = {
      ...original,
      id: Date.now(),
      q: `${original.q} (Copy)`
    };
    const updated = [...paperQuestions];
    updated.splice(idx + 1, 0, duplicated);
    setPaperQuestions(updated);
    setActiveQuestionIndex(idx + 1);
    showToast('Question duplicated');
  };

  // Delete a question
  const handleDeleteQuestion = (idx) => {
    const updated = paperQuestions.filter((_, i) => i !== idx);
    setPaperQuestions(updated);
    if (activeQuestionIndex >= updated.length) {
      setActiveQuestionIndex(Math.max(0, updated.length - 1));
    }
  };

  // ==========================================
  // 2. PACKAGES & ORDERS STATE (Existing Tabs)
  // ==========================================
  const [packages, setPackages] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loadingPackages, setLoadingPackages] = useState(false);
  const [showPackageModal, setShowPackageModal] = useState(false);
  const [isAuthoringPackage, setIsAuthoringPackage] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);
  const [packageForm, setPackageForm] = useState({
    title: '',
    class_name: 'Class 6',
    subject_code: 'IMO',
    price: '1499',
    original_price: '1999',
    header_color: '#0284c7',
    status: 'active',
    points: [
      'Comprehensive Chapter-wise Theory & Formula Booklets',
      '10 Full-Length Timed Model Examination Papers',
      'Detailed Video Solutions & Step-by-Step Analysis',
      'Instant Lifetime Digital Access Across All Devices'
    ]
  });
  const [newPackagePoint, setNewPackagePoint] = useState('');

  const fetchPackages = async () => {
    setLoadingPackages(true);
    try {
      const res = await apiClient.get('/packages');
      if (res && res.success && Array.isArray(res.data)) {
        setPackages(res.data);
      }
    } catch (e) {
      console.warn('Error fetching packages:', e);
    } finally {
      setLoadingPackages(false);
    }
  };

  const handleOpenCreatePackage = () => {
    setEditingPackage(null);
    setPackageForm({
      title: 'New Comprehensive Olympiad Study Package',
      class_name: packageClassFilter !== 'All' ? packageClassFilter : 'Class 6',
      subject_code: 'IMO',
      price: '1499',
      original_price: '1999',
      header_color: '#0284c7',
      status: 'active',
      points: [
        'Comprehensive Chapter-wise Theory & Formula Booklets',
        '10 Full-Length Timed Model Examination Papers',
        'Detailed Video Solutions & Step-by-Step Analysis',
        'Instant Lifetime Digital Access Across All Devices'
      ]
    });
    setNewPackagePoint('');
    setShowPackageModal(false);
    setIsAuthoringPackage(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenEditPackage = (pkg) => {
    setEditingPackage(pkg);
    setPackageForm({
      title: pkg.title || '',
      class_name: pkg.class_name || 'Class 6',
      subject_code: pkg.subject_code || 'IMO',
      price: String(pkg.price || '1499'),
      original_price: String(pkg.original_price || '1999'),
      header_color: pkg.header_color || '#0284c7',
      status: pkg.status || 'active',
      points: Array.isArray(pkg.points) ? [...pkg.points] : [
        'Comprehensive Chapter-wise Theory & Formula Booklets',
        '10 Full-Length Timed Model Examination Papers'
      ]
    });
    setNewPackagePoint('');
    setShowPackageModal(false);
    setIsAuthoringPackage(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSavePackage = async (e) => {
    e?.preventDefault();
    if (!packageForm.title.trim()) {
      showToast('Please enter a Package Title', 'error');
      return;
    }
    try {
      const payload = {
        title: packageForm.title,
        class_name: packageForm.class_name,
        subject_code: packageForm.subject_code,
        price: Number(packageForm.price) || 999,
        original_price: Number(packageForm.original_price) || 1499,
        header_color: packageForm.header_color || '#0284c7',
        status: packageForm.status || 'active',
        points: packageForm.points || []
      };

      if (editingPackage) {
        await apiClient.put(`/packages/${editingPackage.id}`, payload);
        showToast('✓ Study Package updated successfully in Database and Live Website!');
      } else {
        await apiClient.post('/packages', payload);
        showToast('✓ New Study Package created and live on Student Dashboard!');
      }
      setShowPackageModal(false);
      setIsAuthoringPackage(false);
      fetchPackages();
    } catch (err) {
      console.warn('Save package error:', err);
      showToast('Failed to save package.', 'error');
    }
  };

  const handleDeletePackage = async (id) => {
    try {
      await apiClient.delete(`/packages/${id}`);
      fetchPackages();
      showToast('✓ Study Package deleted successfully from Database.', 'info');
    } catch (err) {
      console.warn('Delete package error:', err);
      showToast('Failed to delete package.', 'error');
    }
  };

  const handleAddPackagePoint = () => {
    if (!newPackagePoint.trim()) return;
    setPackageForm({
      ...packageForm,
      points: [...packageForm.points, newPackagePoint.trim()]
    });
    setNewPackagePoint('');
  };

  const handleRemovePackagePoint = (idx) => {
    setPackageForm({
      ...packageForm,
      points: packageForm.points.filter((_, i) => i !== idx)
    });
  };

  const handleUpdatePackagePoint = (idx, val) => {
    const updated = [...packageForm.points];
    updated[idx] = val;
    setPackageForm({ ...packageForm, points: updated });
  };

  const fetchOrders = async () => {
    try {
      const res = await apiClient.get('/packages/orders');
      if (res && res.success && Array.isArray(res.data)) {
        setOrders(res.data);
      }
    } catch (e) {
      console.warn('Error fetching orders:', e);
    }
  };

  useEffect(() => {
    fetchExamPapers();
    fetchPackages();
    fetchOrders();
  }, [packageClassFilter, packageSubjectFilter]);

  // Group papers by Subject and Series Cover
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
      const subCode = paper.subject_code || 'IGKO';
      const clsName = paper.class_name || 'Class 6';
      const key = `${clsName} - ${subCode}`;
      if (!groups[key]) {
        groups[key] = {
          className: clsName,
          subjectCode: subCode,
          seriesTitle: `${clsName} - All India ${subCode} Mock Test Series`,
          papers: []
        };
      }
      groups[key].papers.push(paper);
    });
    return Object.values(groups);
  }, [examPapers, searchQuery]);

  // Subject Covers Directory (Level 1: Summarizes each Subject Cover)
  const subjectCoversDirectory = useMemo(() => {
    const allKnownSubjects = SUBJECTS_LIST.filter(s => s.code !== 'ALL');
    return allKnownSubjects.map(sub => {
      const matchingPapers = examPapers.filter(p => {
        const matchesSub = matchSubjectCodes(p.subject_code, sub.code);
        const matchesClass = matchClassNames(p.class_name, packageClassFilter);
        return matchesSub && matchesClass;
      });

      const totalQuestions = matchingPapers.reduce((sum, p) => sum + (p.questions?.length || 0), 0);

      return {
        ...sub,
        totalPapers: matchingPapers.length,
        totalQuestions,
        papers: matchingPapers,
        className: packageClassFilter === 'All' ? 'Class 6' : packageClassFilter,
        seriesTitle: `${packageClassFilter === 'All' ? 'Class 6' : packageClassFilter} - All India ${sub.code} Mock Test Series`
      };
    });
  }, [examPapers, packageClassFilter]);

  // Filtered papers inside a selected subject cover (Level 2)
  const activeSubjectPapers = useMemo(() => {
    if (!selectedSubjectCover) return [];
    return examPapers.filter(p => {
      const matchesSub = matchSubjectCodes(p.subject_code, selectedSubjectCover);
      const matchesClass = matchClassNames(p.class_name, packageClassFilter);
      return matchesSub && matchesClass;
    });
  }, [examPapers, selectedSubjectCover, packageClassFilter]);

  // =========================================================================
  // LEVEL 3: FULL-PAGE PAPER & QUESTION AUTHORING STUDIO
  // =========================================================================
  if (isAuthoringPaper) {
    const activeQ = paperQuestions[activeQuestionIndex] || {
      q: '',
      section: paperSections[0] || 'General Awareness',
      options: ['', '', '', ''],
      correct: 0,
      marks: 1,
      explanation: ''
    };

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
          <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 sm:py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <button
                type="button"
                onClick={() => setIsAuthoringPaper(false)}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer shadow-2xs shrink-0"
                title="Back to Subject Covers"
              >
                <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                <span className="hidden sm:inline">Back to {selectedSubjectCover ? `${selectedSubjectCover} Tests` : 'Subject Covers'}</span>
                <span className="sm:hidden text-[11px]">Back</span>
              </button>
              <div className="h-4 w-px bg-slate-200 hidden sm:block" />
              <div className="min-w-0 flex-1">
                <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-[#6d3a68] block truncate">
                  Subject Mock Test Studio &bull; {paperSubjectCode} ({paperClass})
                </span>
                <h1 className="text-sm sm:text-xl font-black text-slate-900 leading-snug">
                  {editingPaper ? `Edit: ${paperTitle || 'Mock Test Paper'}` : 'Create New Subject Mock Test Paper'}
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setIsAuthoringPaper(false)}
                className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer transition-all shrink-0"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSavePaper}
                className="flex-1 sm:flex-initial px-3 sm:px-5 py-1.5 sm:py-2 rounded-xl bg-[#00b074] hover:bg-[#009260] text-white font-black text-xs shadow-md active:scale-95 cursor-pointer flex items-center justify-center gap-1.5 transition-all"
              >
                <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                <span className="hidden min-[380px]:inline sm:hidden">Save to Database</span>
                <span className="min-[380px]:hidden">Save</span>
                <span className="hidden sm:inline">Save All Changes to Database</span>
              </button>
            </div>
          </div>

          {/* Sub Navigation Studio Tabs */}
          <div className="max-w-7xl mx-auto px-2 sm:px-6 flex items-center gap-1.5 sm:gap-2 border-t border-slate-100 overflow-x-auto py-1 sm:py-1.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <button
              type="button"
              onClick={() => setPaperModalTab('details')}
              className={`py-1.5 sm:py-2 px-2.5 sm:px-4 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 ${
                paperModalTab === 'details'
                  ? 'bg-gradient-to-r from-[#1e1b4b] via-[#3b0764] to-[#1e3a8a] text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <FileText className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden sm:inline">1. Test Details &amp; Settings</span>
              <span className="sm:hidden">1. Test Details</span>
            </button>
            <button
              type="button"
              onClick={() => setPaperModalTab('questions')}
              className={`py-1.5 sm:py-2 px-2.5 sm:px-4 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 ${
                paperModalTab === 'questions'
                  ? 'bg-gradient-to-r from-[#1e1b4b] via-[#3b0764] to-[#1e3a8a] text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden sm:inline">2. Question-by-Question Studio ({paperQuestions.length})</span>
              <span className="sm:hidden">2. Questions ({paperQuestions.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setPaperModalTab('bulk')}
              className={`py-1.5 sm:py-2 px-2.5 sm:px-4 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 ${
                paperModalTab === 'bulk'
                  ? 'bg-gradient-to-r from-[#1e1b4b] via-[#3b0764] to-[#1e3a8a] text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden sm:inline">3. Fast Bulk Import (Text)</span>
              <span className="sm:hidden">3. Bulk Import</span>
            </button>
          </div>
        </div>

        {/* Studio Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
          {/* TAB 1: DETAILS */}
          {paperModalTab === 'details' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
              <div>
                <h2 className="text-base font-black text-slate-900">Mock Test Basic Configuration</h2>
                <p className="text-xs text-slate-500">Configure title, year, marks cutoff, and sections shown to students.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-black text-slate-700 mb-1.5">
                    Mock Test Title (Card Top Header) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={paperTitle}
                    onChange={(e) => setPaperTitle(e.target.value)}
                    placeholder="e.g. Class 6 IGKO Previous Year Paper 2019 or Level-1 Mock Test 1"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-800 focus:border-[#4e2a4a] outline-none shadow-2xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 mb-1.5">Short Code / Badge</label>
                  <input
                    type="text"
                    value={paperShortCode}
                    onChange={(e) => setPaperShortCode(e.target.value)}
                    placeholder="e.g. IGKO - 2019"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-800 outline-none shadow-2xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 mb-1.5">Paper Category</label>
                  <select
                    value={paperCategory}
                    onChange={(e) => setPaperCategory(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-800 outline-none bg-white cursor-pointer shadow-2xs"
                  >
                    <option value="previous_year">🏆 Free Previous Year Paper</option>
                    <option value="sample_paper">📄 Free Official Sample Paper</option>
                    <option value="mock_test">📝 Full-Length Mock Test Series</option>
                    <option value="test_generator">⚡ Test Generator Pro</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 mb-1.5">Class / Grade</label>
                  <select
                    value={paperClass}
                    onChange={(e) => setPaperClass(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-800 outline-none bg-white cursor-pointer shadow-2xs"
                  >
                    {CLASSES_LIST.filter(c => c !== 'All').map((cls) => (
                      <option key={cls} value={cls}>
                        {cls}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 mb-1.5">Subject / Discipline</label>
                  <select
                    value={paperSubjectCode}
                    onChange={(e) => setPaperSubjectCode(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-800 outline-none bg-white cursor-pointer shadow-2xs"
                  >
                    {SUBJECTS_LIST.filter(s => s.code !== 'ALL').map((sub) => (
                      <option key={sub.code} value={sub.code}>
                        {sub.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 mb-1.5">Exam Year / Edition</label>
                  <input
                    type="text"
                    value={paperYear}
                    onChange={(e) => setPaperYear(e.target.value)}
                    placeholder="e.g. 2019 or 2026"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-800 outline-none shadow-2xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 mb-1.5">Duration (Minutes)</label>
                  <input
                    type="number"
                    value={paperDuration}
                    onChange={(e) => setPaperDuration(e.target.value)}
                    placeholder="e.g. 60"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-800 outline-none shadow-2xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 mb-1.5">Total Marks</label>
                  <input
                    type="number"
                    value={paperTotalMarks}
                    onChange={(e) => setPaperTotalMarks(e.target.value)}
                    placeholder="e.g. 60"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-800 outline-none shadow-2xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 mb-1.5">Cutoff Marks (Card Cutoff Badge)</label>
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
                    Exam Sections (Shown in Question Studio &amp; Exam Header)
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
                          &times;
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
                        className="px-3 py-1.5 bg-gradient-to-r from-[#1e1b4b] via-[#3b0764] to-[#1e3a8a] text-white rounded-xl text-xs font-bold cursor-pointer hover:bg-[#3d203a]"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button
                  type="button"
                  onClick={() => setPaperModalTab('questions')}
                  className="px-5 py-2.5 bg-[#4e2a4a] hover:bg-[#3d203a] text-white rounded-xl text-xs font-black flex items-center gap-2 cursor-pointer shadow-xs"
                >
                  <span>Proceed to Questions Studio &rarr;</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: QUESTION-BY-QUESTION STUDIO */}
          {paperModalTab === 'questions' && (
            <div className="space-y-6">
              {/* Question Quick Jump Navigation Pill Bar */}
              <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs flex items-center justify-between gap-3 overflow-x-auto">
                <div className="flex items-center gap-2 overflow-x-auto py-1">
                  <span className="text-xs font-black text-slate-700 mr-2 shrink-0">Questions:</span>
                  {paperQuestions.map((_, qIdx) => (
                    <button
                      key={qIdx}
                      type="button"
                      onClick={() => setActiveQuestionIndex(qIdx)}
                      className={`w-9 h-9 rounded-xl font-black text-xs flex items-center justify-center shrink-0 transition-all cursor-pointer ${
                        activeQuestionIndex === qIdx
                          ? 'bg-[#859900] text-white shadow-sm ring-2 ring-[#859900]/40 scale-105'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                      }`}
                    >
                      {qIdx + 1}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={handleAddBlankQuestion}
                    className="px-3 h-9 rounded-xl bg-[#00b074] hover:bg-[#009260] text-white text-xs font-black flex items-center gap-1 shrink-0 cursor-pointer shadow-2xs"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Question</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaperModalTab('bulk')}
                    className="px-3.5 h-9 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 text-xs font-black flex items-center gap-1.5 shrink-0 cursor-pointer shadow-2xs transition-all"
                    title="Bulk Import / Paste Multiple Questions"
                  >
                    <Upload className="w-3.5 h-3.5 text-purple-600" />
                    <span>⚡ Bulk Import</span>
                  </button>
                </div>

                <div className="shrink-0 text-xs font-bold text-slate-500">
                  Total: <span className="text-slate-900 font-black">{paperQuestions.length}</span> questions
                </div>
              </div>

              {paperQuestions.length === 0 ? (
                <div className="bg-white rounded-3xl p-10 border border-slate-200 text-center space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 mx-auto flex items-center justify-center">
                    <HelpCircle className="w-7 h-7" />
                  </div>
                  <h3 className="text-base font-black text-slate-800">No Questions Added Yet</h3>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    Add questions one by one manually, or use the fast bulk import tool to paste all questions at once.
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={handleAddBlankQuestion}
                      className="px-5 py-2.5 rounded-xl bg-[#00b074] hover:bg-[#009260] text-white font-black text-xs cursor-pointer shadow-md inline-flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      <span>+ Add Blank Question</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaperModalTab('bulk')}
                      className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-black text-xs cursor-pointer shadow-md inline-flex items-center gap-2"
                    >
                      <Upload className="w-4 h-4" />
                      <span>⚡ Fast Bulk Import (Paste / File)</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* Active Question Editor Card */
                <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-200 shadow-sm space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <span className="w-10 h-10 rounded-2xl bg-[#859900] text-white font-black text-sm flex items-center justify-center shadow-xs">
                        Q{activeQuestionIndex + 1}
                      </span>
                      <div>
                        <h3 className="text-base font-black text-slate-900">
                          Editing Question #{activeQuestionIndex + 1} of {paperQuestions.length}
                        </h3>
                        <p className="text-xs text-slate-500 font-medium">
                          Select the correct answer option using the radio button.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleDuplicateQuestion(activeQuestionIndex)}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                        title="Duplicate Question"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>Duplicate</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteQuestion(activeQuestionIndex)}
                        className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                        title="Delete Question"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>

                  {/* Section & Marks row */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-black text-slate-700 mb-1">Section</label>
                      <select
                        value={activeQ.section || paperSections[0]}
                        onChange={(e) => handleUpdateQuestion(activeQuestionIndex, 'section', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold bg-slate-50 cursor-pointer"
                      >
                        {paperSections.map((sec) => (
                          <option key={sec} value={sec}>
                            {sec}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-black text-slate-700 mb-1">Marks (+)</label>
                      <input
                        type="number"
                        value={activeQ.marks || 1}
                        onChange={(e) => handleUpdateQuestion(activeQuestionIndex, 'marks', Number(e.target.value) || 1)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-800"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-black text-slate-700 mb-1">Negative Marks (-)</label>
                      <input
                        type="number"
                        step="0.25"
                        defaultValue={0}
                        placeholder="0.00"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-800"
                      />
                    </div>
                  </div>

                  {/* Question Text */}
                  <div>
                    <label className="block text-xs font-black text-slate-700 mb-1.5">
                      Question Statement / Text <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      rows={3}
                      value={activeQ.q}
                      onChange={(e) => handleUpdateQuestion(activeQuestionIndex, 'q', e.target.value)}
                      placeholder="Type the full question statement here..."
                      className="w-full px-4 py-3 rounded-2xl border border-slate-300 text-xs font-semibold text-slate-900 focus:border-[#4e2a4a] outline-none shadow-2xs leading-relaxed"
                    />
                  </div>

                  {/* 4 Options */}
                  <div>
                    <label className="block text-xs font-black text-slate-700 mb-2">
                      Answer Choices (Click the Green Circle to select the Correct Answer)
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {['A', 'B', 'C', 'D'].map((lbl, optIdx) => {
                        const isCorrect = Number(activeQ.correct) === optIdx;
                        return (
                          <div
                            key={lbl}
                            className={`p-3 rounded-2xl border-2 transition-all flex items-center gap-3 ${
                              isCorrect
                                ? 'bg-emerald-50/70 border-emerald-500 shadow-2xs'
                                : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                            }`}
                          >
                            <button
                              type="button"
                              onClick={() => handleUpdateQuestion(activeQuestionIndex, 'correct', optIdx)}
                              className={`w-7 h-7 rounded-xl font-black text-xs flex items-center justify-center shrink-0 cursor-pointer transition-all ${
                                isCorrect
                                  ? 'bg-emerald-600 text-white shadow-xs'
                                  : 'bg-white border border-slate-300 text-slate-600 hover:bg-slate-200'
                              }`}
                              title={isCorrect ? 'Correct Answer' : 'Click to set as Correct Answer'}
                            >
                              {lbl}
                            </button>
                            <input
                              type="text"
                              value={activeQ.options?.[optIdx] || ''}
                              onChange={(e) => handleUpdateOption(activeQuestionIndex, optIdx, e.target.value)}
                              placeholder={`Option ${lbl} text...`}
                              className="w-full bg-transparent text-xs font-bold text-slate-800 outline-none"
                            />
                            {isCorrect && (
                              <span className="text-[10px] font-black uppercase text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md shrink-0">
                                Correct
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Explanation & Solution */}
                  <div>
                    <label className="block text-xs font-black text-slate-700 mb-1.5">
                      Detailed Explanation / Solution Step-by-Step
                    </label>
                    <textarea
                      rows={2}
                      value={activeQ.explanation || ''}
                      onChange={(e) => handleUpdateQuestion(activeQuestionIndex, 'explanation', e.target.value)}
                      placeholder="Explain why this option is correct so students learn from their test review..."
                      className="w-full px-4 py-2.5 rounded-2xl border border-slate-300 text-xs font-medium text-slate-800 outline-none bg-slate-50"
                    />
                  </div>

                  {/* Navigation Footer for Questions */}
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <button
                      type="button"
                      disabled={activeQuestionIndex === 0}
                      onClick={() => setActiveQuestionIndex(Math.max(0, activeQuestionIndex - 1))}
                      className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                    >
                      &larr; Previous Question
                    </button>

                    <button
                      type="button"
                      onClick={handleAddBlankQuestion}
                      className="px-4 py-2 rounded-xl bg-[#00b074] hover:bg-[#009260] text-white font-black text-xs cursor-pointer shadow-2xs flex items-center gap-1.5"
                    >
                      <Plus className="w-4 h-4" />
                      <span>+ Add Next Question</span>
                    </button>

                    <button
                      type="button"
                      disabled={activeQuestionIndex >= paperQuestions.length - 1}
                      onClick={() => setActiveQuestionIndex(Math.min(paperQuestions.length - 1, activeQuestionIndex + 1))}
                      className="px-4 py-2 rounded-xl bg-[#4e2a4a] hover:bg-[#3d203a] text-white font-bold text-xs disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                    >
                      Next Question &rarr;
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: BULK IMPORT */}
          {paperModalTab === 'bulk' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-[#859900]" />
                    <span>Universal Fast Bulk Questions Import</span>
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Paste plain text, Q1..Qn questions, JSON, or CSV to instantly import all questions into this test.
                  </p>
                </div>

                {/* Quick Action Toolbar */}
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={() => setBulkQuestionsInput(SAMPLE_MOCK_TEST_QUESTIONS)}
                    className="px-3.5 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-2xs transition-all"
                    title="Load 4 Sample Formatted Questions"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                    <span>📋 Load Sample Format Template</span>
                  </button>

                  <label className="px-3.5 py-1.5 rounded-xl bg-sky-100 hover:bg-sky-200 text-sky-900 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-2xs transition-all">
                    <Upload className="w-3.5 h-3.5 text-sky-700" />
                    <span>📁 Import File (.txt / .csv / .json)</span>
                    <input
                      type="file"
                      accept=".txt,.csv,.json"
                      onChange={handleBulkFileUpload}
                      className="hidden"
                    />
                  </label>

                  {bulkQuestionsInput && (
                    <button
                      type="button"
                      onClick={() => setBulkQuestionsInput('')}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-rose-100 text-slate-600 hover:text-rose-700 font-bold text-xs flex items-center gap-1 cursor-pointer transition-all"
                      title="Clear text area"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Clear</span>
                    </button>
                  )}
                </div>
              </div>


              {/* Textarea */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-black text-slate-700">Paste Questions Text Here:</label>
                  {bulkQuestionsInput.trim() && (
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      ⚡ ~{parseAnyQuestionsInput(bulkQuestionsInput, paperSections[0] || 'General Awareness').length} questions detected
                    </span>
                  )}
                </div>
                <textarea
                  rows={12}
                  value={bulkQuestionsInput}
                  onChange={(e) => setBulkQuestionsInput(e.target.value)}
                  placeholder="Paste your questions here...&#10;&#10;Example:&#10;Q1. If 3x + 15 = 45, what is the value of 2x - 5?&#10;A) 15&#10;B) 20&#10;C) 25&#10;D) 30&#10;Correct: A&#10;&#10;Tip: Even if you paste single plain questions without options, the system will automatically parse them and create editable options for you!"
                  className="w-full px-4 py-3.5 rounded-2xl border border-slate-300 text-xs font-mono text-slate-800 outline-none focus:border-[#859900] leading-relaxed shadow-2xs bg-slate-50/50"
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">
                  Currently in test: <span className="font-black text-slate-900">{paperQuestions.length}</span> questions
                </span>
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => setPaperModalTab('questions')}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer transition-all"
                  >
                    View Questions ({paperQuestions.length})
                  </button>
                  <button
                    type="button"
                    onClick={handleParseBulkQuestions}
                    className="px-6 py-2.5 bg-[#859900] hover:bg-[#728400] text-white rounded-xl text-xs font-black shadow-md cursor-pointer flex items-center gap-2 active:scale-95 transition-all"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Parse &amp; Add All Questions to Test</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // =========================================================================
  // FULL-PAGE STUDY PACKAGE AUTHORING STUDIO
  // =========================================================================
  if (isAuthoringPackage) {
    const discountPercent =
      Number(packageForm.original_price) > Number(packageForm.price)
        ? Math.round(
            ((Number(packageForm.original_price) - Number(packageForm.price)) /
              Number(packageForm.original_price)) *
              100
          )
        : 0;

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

        {/* Studio Sticky Header Bar */}
        <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs px-4 sm:px-8 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                setIsAuthoringPackage(false);
                setShowPackageModal(false);
              }}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Packages</span>
            </button>
            <div className="h-6 w-px bg-slate-200 hidden sm:block" />
            <div className="flex items-center gap-2.5">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-black text-xs shadow-2xs"
                style={{ backgroundColor: packageForm.header_color || '#0284c7' }}
              >
                <Package className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-sm sm:text-base font-black text-slate-900 leading-tight">
                  {editingPackage ? 'Edit Study Package Studio' : 'Create New Study Package Studio'}
                </h1>
                <p className="text-[11px] text-slate-500 font-semibold">
                  Changes save directly into the Database and reflect live on the Student Dashboard.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => {
                setIsAuthoringPackage(false);
                setShowPackageModal(false);
              }}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer transition-all"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSavePackage}
              className="px-5 py-2 rounded-xl bg-[#00b074] hover:bg-[#009260] text-white font-black text-xs shadow-md cursor-pointer flex items-center gap-2 active:scale-95 transition-all"
            >
              <Check className="w-4 h-4" />
              <span>{editingPackage ? 'Save Package Changes' : 'Publish Study Package'}</span>
            </button>
          </div>
        </div>

        {/* Main 2-Column Full-Page Form & Live Student Preview */}
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <form onSubmit={handleSavePackage} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Form Controls (8 Cols) */}
            <div className="lg:col-span-8 space-y-6">
              {/* SECTION 1: Package Title & Academic Mapping */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                  <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-black text-xs">
                    1
                  </div>
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">
                      Package Identity &amp; Classification
                    </h3>
                    <p className="text-[11px] text-slate-400">Title, target class, subject, and status</p>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 mb-1.5">
                    Package Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={packageForm.title}
                    onChange={(e) => setPackageForm({ ...packageForm, title: e.target.value })}
                    placeholder="e.g. Olympiads Level-2 Champs Package - Class 6"
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 outline-none focus:border-[#4e2a4a] bg-white shadow-2xs"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <label className="block text-xs font-black text-slate-700 mb-1.5">Target Class / Grade</label>
                    <select
                      value={packageForm.class_name}
                      onChange={(e) => setPackageForm({ ...packageForm, class_name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-bold text-slate-800 bg-white cursor-pointer shadow-2xs"
                    >
                      {CLASSES_LIST.filter(c => c !== 'All').map((cls) => (
                        <option key={cls} value={cls}>
                          {cls}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-slate-700 mb-1.5">Olympiad Subject</label>
                    <select
                      value={packageForm.subject_code}
                      onChange={(e) => setPackageForm({ ...packageForm, subject_code: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-bold text-slate-800 bg-white cursor-pointer shadow-2xs"
                    >
                      {SUBJECTS_LIST.filter(s => s.code !== 'ALL').map((sub) => (
                        <option key={sub.code} value={sub.code}>
                          {sub.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-slate-700 mb-1.5">Publish Status</label>
                    <select
                      value={packageForm.status}
                      onChange={(e) => setPackageForm({ ...packageForm, status: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-bold text-slate-800 bg-white cursor-pointer shadow-2xs"
                    >
                      <option value="active">Active (Visible to Students)</option>
                      <option value="inactive">Inactive / Draft</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* SECTION 2: Pricing & Commercials */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                  <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-black text-xs">
                    2
                  </div>
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">
                      Pricing &amp; Discounts
                    </h3>
                    <p className="text-[11px] text-slate-400">Offer price and strikethrough original price</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-xs font-black text-slate-700 mb-1.5">Offer Price (₹)</label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-black text-slate-400">₹</span>
                      <input
                        type="number"
                        value={packageForm.price}
                        onChange={(e) => setPackageForm({ ...packageForm, price: e.target.value })}
                        placeholder="1499"
                        className="w-full pl-8 pr-3.5 py-2.5 rounded-xl border border-slate-300 font-black text-emerald-700 bg-white shadow-2xs text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-slate-700 mb-1.5">Original Cut Price (₹)</label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-black text-slate-400">₹</span>
                      <input
                        type="number"
                        value={packageForm.original_price}
                        onChange={(e) => setPackageForm({ ...packageForm, original_price: e.target.value })}
                        placeholder="1999"
                        className="w-full pl-8 pr-3.5 py-2.5 rounded-xl border border-slate-300 font-black text-slate-500 bg-white shadow-2xs text-sm"
                      />
                    </div>
                  </div>
                </div>

                {discountPercent > 0 && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2 text-xs font-bold text-emerald-800">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    <span>Calculated Discount: <strong className="font-black text-emerald-900">{discountPercent}% OFF</strong> (Students save ₹{Number(packageForm.original_price) - Number(packageForm.price)})</span>
                  </div>
                )}
              </div>

              {/* SECTION 3: Header Banner Color Theme */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                  <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center font-black text-xs">
                    3
                  </div>
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">
                      Header Banner Color Theme
                    </h3>
                    <p className="text-[11px] text-slate-400">Select top header banner color for this package card</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  {[
                    { color: '#0284c7', label: 'Sky Blue' },
                    { color: '#059669', label: 'Emerald' },
                    { color: '#d97706', label: 'Amber' },
                    { color: '#ea580c', label: 'Orange' },
                    { color: '#7c3aed', label: 'Purple' },
                    { color: '#db2777', label: 'Pink' },
                    { color: '#1e3a8a', label: 'Navy' },
                    { color: '#859900', label: 'Olive' },
                    { color: '#4e2a4a', label: 'Plum' }
                  ].map((item) => (
                    <button
                      key={item.color}
                      type="button"
                      onClick={() => setPackageForm({ ...packageForm, header_color: item.color })}
                      className={`h-10 px-4 rounded-xl flex items-center gap-2 cursor-pointer transition-all border text-xs font-black ${
                        packageForm.header_color === item.color
                          ? 'ring-2 ring-offset-2 ring-slate-900 text-white shadow-md scale-105'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                      style={packageForm.header_color === item.color ? { backgroundColor: item.color, borderColor: item.color } : {}}
                    >
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-white/40"
                        style={{ backgroundColor: item.color }}
                      />
                      <span>{item.label}</span>
                      {packageForm.header_color === item.color && <Check className="w-3.5 h-3.5 text-white ml-1" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* SECTION 4: Package Features & Highlights */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-black text-xs">
                      4
                    </div>
                    <div>
                      <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">
                        Package Features / Bullet Points ({packageForm.points.length})
                      </h3>
                      <p className="text-[11px] text-slate-400">Highlights displayed with checkmarks on student card</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2.5">
                  {packageForm.points.map((pt, pIdx) => (
                    <div key={pIdx} className="flex items-center gap-2 group">
                      <span className="w-6 text-slate-400 font-mono font-bold text-center text-xs">{pIdx + 1}.</span>
                      <input
                        type="text"
                        value={pt}
                        onChange={(e) => handleUpdatePackagePoint(pIdx, e.target.value)}
                        className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 font-semibold text-xs text-slate-800 bg-slate-50/80 focus:bg-white focus:border-[#4e2a4a] outline-none shadow-2xs transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemovePackagePoint(pIdx)}
                        className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all cursor-pointer"
                        title="Remove bullet point"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}

                  {/* Add new point input box */}
                  <div className="flex items-center gap-2 pt-2">
                    <input
                      type="text"
                      value={newPackagePoint}
                      onChange={(e) => setNewPackagePoint(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddPackagePoint();
                        }
                      }}
                      placeholder="+ Type new package feature highlight and press Add..."
                      className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 font-semibold text-xs text-slate-800 bg-white outline-none focus:border-[#4e2a4a] shadow-2xs"
                    />
                    <button
                      type="button"
                      onClick={handleAddPackagePoint}
                      className="px-5 py-2.5 bg-[#4e2a4a] hover:bg-[#3d203a] text-white rounded-xl text-xs font-black cursor-pointer shadow-xs active:scale-95 transition-all"
                    >
                      Add Feature
                    </button>
                  </div>
                </div>
              </div>

              {/* Bottom Action Buttons */}
              <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
                <button
                  type="button"
                  onClick={() => {
                    setIsAuthoringPackage(false);
                    setShowPackageModal(false);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer transition-all"
                >
                  Cancel &amp; Discard
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#00b074] hover:bg-[#009260] text-white font-black text-xs shadow-md cursor-pointer flex items-center gap-2 active:scale-95 transition-all"
                >
                  <Check className="w-4 h-4" />
                  <span>{editingPackage ? 'Save Package Changes' : 'Publish Study Package'}</span>
                </button>
              </div>
            </div>

            {/* Right Column: Real-Time Live Preview (4 Cols) */}
            <div className="lg:col-span-4 space-y-4">
              <div className="sticky top-20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Live Student View Preview</span>
                  </span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    Auto-Updates
                  </span>
                </div>

                {/* Preview Card */}
                <div className="bg-white rounded-2xl border-2 border-slate-200 shadow-lg overflow-hidden flex flex-col justify-between">
                  <div>
                    {/* Header Banner */}
                    <div
                      className="text-white p-4 font-black shadow-sm"
                      style={{ backgroundColor: packageForm.header_color || '#0284c7' }}
                    >
                      <div className="flex items-center justify-between text-[11px] opacity-90 mb-1 font-bold">
                        <span>{packageForm.class_name || 'Class 6'}</span>
                        <span>{packageForm.subject_code || 'IMO'}</span>
                      </div>
                      <h4 className="text-sm font-black leading-snug">
                        {packageForm.title || 'Untitled Package'}
                      </h4>
                    </div>

                    {/* Pricing */}
                    <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-baseline justify-between">
                      <div>
                        <span className="text-2xl font-black text-slate-900">₹{packageForm.price || 0}</span>
                        {Number(packageForm.original_price) > Number(packageForm.price) && (
                          <span className="text-xs text-slate-400 line-through ml-2 font-bold">
                            ₹{packageForm.original_price}
                          </span>
                        )}
                      </div>
                      {discountPercent > 0 && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800">
                          {discountPercent}% OFF
                        </span>
                      )}
                    </div>

                    {/* Features List */}
                    <div className="p-4 space-y-2">
                      <p className="text-[11px] font-black uppercase tracking-wider text-slate-400 mb-2">
                        Included Features:
                      </p>
                      {packageForm.points.length === 0 ? (
                        <p className="text-xs text-slate-400 italic">No features added yet.</p>
                      ) : (
                        packageForm.points.map((pt, i) => (
                          <div key={i} className="flex items-start gap-2 text-xs text-slate-700 font-semibold">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{pt}</span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Card Bottom CTA */}
                  <div className="p-4 bg-slate-50 border-t border-slate-100">
                    <button
                      type="button"
                      disabled
                      className="w-full py-2.5 rounded-xl bg-slate-900 text-white font-black text-xs flex items-center justify-center gap-2 opacity-90 cursor-not-allowed"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>Buy Now Preview</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // =========================================================================
  // MAIN VIEW: SUPERADMIN PACKAGES & MOCK TEST SERIES COVERS
  // =========================================================================
  return (
    <div className="space-y-6 pb-24 font-sans animate-in fade-in duration-150">
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

      {/* Main Page Top Navigation & Action Bar (Seamless on background, no box) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 pt-1 pb-1">
        <div className="flex items-start sm:items-center gap-3 sm:gap-3.5 min-w-0">
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-[#859900] text-white flex items-center justify-center shadow-xs shrink-0 font-black text-xl">
            <Trophy className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center flex-wrap gap-1.5 sm:gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-black uppercase tracking-wider bg-[#859900]/15 text-[#5e6d00]">
                SuperAdmin Studio
              </span>
              <span className="text-slate-300 font-bold text-xs">&bull;</span>
              <span className="text-[11px] sm:text-xs text-slate-500 font-bold">100% Real-Time DB &amp; Live Sync</span>
            </div>
            <h1 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight leading-snug mt-1">
              Subject Mock Test Covers &amp; Questions Studio
            </h1>
            <p className="text-xs text-slate-500 font-medium leading-relaxed mt-0.5">
              Manage Subject Series Covers, Mock Tests (Test 1, 2, 3...) &amp; edit individual questions live.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 w-full md:w-auto">
          <button
            type="button"
            onClick={() => handleOpenCreatePaper()}
            className="w-full md:w-auto px-4 py-2.5 rounded-xl bg-[#859900] hover:bg-[#728400] text-white font-black text-xs sm:text-sm transition-all shadow-xs active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Plus className="w-4 h-4 shrink-0" />
            <span>Create New Mock Test</span>
          </button>
        </div>
      </div>

      {/* Top Main Navigation Tabs (Seamless on background, no box) */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {[
          { id: 'exam_papers', label: 'Subject Mock Test Series Covers & Tests', icon: Sparkles, count: examPapers.length },
          { id: 'packages', label: 'All-in-One Study Packages', icon: Package, count: packages.length },
          { id: 'orders', label: 'Student Purchases & Orders', icon: ShoppingBag, count: orders.length }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setActiveTab(tab.id);
                setSelectedSubjectCover(null);
              }}
              className={`py-2 px-3.5 sm:px-4 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap shrink-0 ${
                isActive
                  ? 'bg-gradient-to-r from-[#1e1b4b] via-[#3b0764] to-[#1e3a8a] text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-200/60 hover:text-[#4e2a4a]'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#e7b84b]' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className={`text-xs px-2 py-0.5 rounded-full font-black ${isActive ? 'bg-white/20 text-white' : 'bg-slate-200/70 text-slate-700'}`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Class & Filter Controls (Seamless on background, no box) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
        <div className="flex items-center gap-2.5 sm:gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-black text-slate-700">Class:</span>
            <select
              value={packageClassFilter}
              onChange={(e) => setPackageClassFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-bold text-[#4e2a4a] bg-white cursor-pointer shadow-2xs"
            >
              {CLASSES_LIST.map((cls) => (
                <option key={cls} value={cls}>
                  {cls}
                </option>
              ))}
            </select>
          </div>

          <div className="relative flex-1 min-w-[140px] sm:min-w-[200px] max-w-full sm:max-w-xs">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search tests or questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#859900]"
            />
          </div>
        </div>

        {selectedSubjectCover && (
          <button
            type="button"
            onClick={() => setSelectedSubjectCover(null)}
            className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs border border-slate-200 self-start sm:self-auto"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>&larr; Back to All Subject Covers</span>
          </button>
        )}
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: SUBJECT MOCK TEST SERIES COVERS & PAPERS STUDIO                   */}
      {/* ========================================================================= */}
      {activeTab === 'exam_papers' && (
        <div className="space-y-6 animate-in fade-in">
          {/* ------------------------------------------------------------------- */}
          {/* LEVEL 1: SUBJECT COVERS DIRECTORY (When selectedSubjectCover is null) */}
          {/* ------------------------------------------------------------------- */}
          {!selectedSubjectCover ? (
            <div className="space-y-6">
              {/* Grid of Subject Series Covers */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {subjectCoversDirectory.map((cover) => {
                  const Icon = cover.icon || Award;
                  return (
                    <div
                      key={cover.code}
                      onClick={() => setSelectedSubjectCover(cover.code)}
                      className="bg-white rounded-3xl border-2 border-slate-200 hover:border-[#859900] shadow-xs hover:shadow-lg transition-all flex flex-col justify-between overflow-hidden cursor-pointer group relative"
                    >
                      <div>
                        {/* Top Color Banner */}
                        <div
                          className="text-white py-3 px-5 font-black text-sm shadow-xs flex items-center justify-between"
                          style={{ backgroundColor: cover.color || '#859900' }}
                        >
                          <div className="flex items-center gap-2">
                            <Icon className="w-4 h-4 text-white" />
                            <span>{cover.code} Olympiad Series</span>
                          </div>
                          <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded bg-white/20">
                            {cover.className}
                          </span>
                        </div>

                        {/* Card Body */}
                        <div className="p-5 space-y-4 bg-white">
                          <div>
                            <h3 className="text-base font-black text-slate-900 group-hover:text-[#859900] transition-colors leading-snug">
                              {cover.seriesTitle}
                            </h3>
                            <p className="text-xs text-slate-500 font-medium mt-1">
                              {cover.name}
                            </p>
                          </div>

                          {/* Stats Badges */}
                          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-center">
                              <span className="text-[10px] text-slate-500 uppercase font-black block">Configured Tests</span>
                              <span className="text-lg font-black text-[#859900]">{cover.totalPapers}</span>
                            </div>
                            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-center">
                              <span className="text-[10px] text-slate-500 uppercase font-black block">Total Questions</span>
                              <span className="text-lg font-black text-[#4e2a4a]">{cover.totalQuestions}</span>
                            </div>
                          </div>

                          {/* Quick Preview of Tests inside */}
                          <div className="space-y-1.5 pt-1">
                            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">
                              Mock Tests in this Cover:
                            </span>
                            {cover.papers.slice(0, 3).map((p, pIdx) => (
                              <div key={pIdx} className="flex items-center gap-1.5 text-xs text-slate-700 truncate">
                                <FileCheck2 className="w-3.5 h-3.5 text-[#859900] shrink-0" />
                                <span className="truncate font-semibold">{p.title}</span>
                              </div>
                            ))}
                            {cover.papers.length > 3 && (
                              <span className="text-[11px] font-bold text-slate-400 block">
                                + {cover.papers.length - 3} more mock tests
                              </span>
                            )}
                            {cover.papers.length === 0 && (
                              <span className="text-xs italic text-slate-400">No mock tests configured yet.</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Bottom Action Bar */}
                      <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-xs font-black text-[#859900] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                          <span>Open {cover.code} Mock Tests</span>
                          <ChevronRight className="w-4 h-4" />
                        </span>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenCreatePaper(cover.code, cover.className);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-white hover:bg-[#859900] hover:text-white border border-slate-200 text-slate-700 text-xs font-bold transition-all shadow-2xs"
                        >
                          + Add Test
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* ------------------------------------------------------------------- */
            /* LEVEL 2: INSIDE SELECTED SUBJECT COVER (Exact match to User Images) */
            /* ------------------------------------------------------------------- */
            <div className="space-y-6">
              {/* Subject Series Cover Header (Exact Image 1 & 2 format) */}
              <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-[#859900]/10 text-[#859900] border border-[#859900]/30 flex items-center justify-center font-black shrink-0">
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-base sm:text-xl font-black text-slate-900 leading-tight">
                      {packageClassFilter} - All India {selectedSubjectCover} Mock Test Series
                    </h2>
                    <p className="text-xs text-slate-500 font-semibold mt-0.5">
                      {packageClassFilter} &bull; {selectedSubjectCover} Olympiad &bull; {activeSubjectPapers.length} Mock Tests Configured
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => handleAddMockTestToSeries(selectedSubjectCover, packageClassFilter, activeSubjectPapers.length)}
                    className="px-4 py-2 rounded-xl bg-[#859900] hover:bg-[#728400] text-white font-black text-xs sm:text-sm shadow-xs active:scale-95 cursor-pointer flex items-center gap-1.5 transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    <span>+ Add Mock Test to {selectedSubjectCover}</span>
                  </button>
                </div>
              </div>

              {/* Grid of Mock Test Cards in this Series Cover (Exact Image 1 & 2 format) */}
              {activeSubjectPapers.length === 0 ? (
                <div className="bg-white rounded-3xl p-10 border border-slate-200 text-center space-y-4">
                  <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 mx-auto flex items-center justify-center">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-black text-slate-800">
                    No Mock Tests in {selectedSubjectCover} ({packageClassFilter})
                  </h3>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    Click the button below to add your first mock test paper and configure questions inside it.
                  </p>
                  <button
                    type="button"
                    onClick={() => handleAddMockTestToSeries(selectedSubjectCover, packageClassFilter, 0)}
                    className="px-5 py-2.5 rounded-xl bg-[#859900] hover:bg-[#728400] text-white font-black text-xs shadow-md cursor-pointer inline-flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>+ Add First Mock Test to {selectedSubjectCover}</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {activeSubjectPapers.map((paper) => (
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
                            <span className="text-slate-700 font-black">
                              {paper.questions?.length || 0} Questions
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Card Bottom Controls: Super Admin Actions */}
                      <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenEditPaper(paper, 'details')}
                            className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-bold transition-all cursor-pointer flex items-center gap-1 shadow-2xs"
                            title="Edit Test Details"
                          >
                            <Edit className="w-3.5 h-3.5 text-blue-600" />
                            <span>Edit</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleOpenEditPaper(paper, 'questions')}
                            className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-bold transition-all cursor-pointer flex items-center gap-1 shadow-2xs"
                            title="Manage Questions in this Test"
                          >
                            <HelpCircle className="w-3.5 h-3.5 text-[#859900]" />
                            <span>Questions ({paper.questions?.length || 0})</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleOpenEditPaper(paper, 'bulk')}
                            className="px-2.5 py-1.5 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 text-xs font-bold transition-all cursor-pointer flex items-center gap-1 shadow-2xs"
                            title="⚡ Fast Bulk Import Questions into this Mock Test"
                          >
                            <Upload className="w-3.5 h-3.5 text-purple-600" />
                            <span>⚡ Import</span>
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

                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-200 flex items-center gap-1 shrink-0">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Live in Student Panel
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: STUDY PACKAGES & BUNDLES                                            */}
      {/* ========================================================================= */}
      {activeTab === 'packages' && (
        <div className="space-y-6 animate-in fade-in">
          {/* Top Bar for Packages */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900">
                All-in-One Study Packages Studio ({packages.length})
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Create, edit features, set pricing, or delete packages live from the Student Dashboard.
              </p>
            </div>

            <button
              type="button"
              onClick={handleOpenCreatePackage}
              className="px-4 py-2.5 rounded-xl bg-[#00b074] hover:bg-[#009260] text-white font-black text-xs sm:text-sm shadow-xs active:scale-95 cursor-pointer flex items-center gap-1.5 transition-all self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>+ Create New Study Package</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                className="bg-white rounded-2xl border-2 border-sky-300 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4 relative overflow-hidden"
              >
                <div>
                  <div
                    className="text-white text-center py-2.5 px-3 rounded-t-xl -mt-5 -mx-5 font-black text-xs sm:text-sm shadow-xs mb-3 truncate"
                    style={{ backgroundColor: pkg.header_color || '#4895d9' }}
                  >
                    {pkg.title}
                  </div>

                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold text-[10px]">
                      {pkg.class_name || 'Class 6'} &bull; {pkg.subject_code || 'ALL'}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[10px]">
                      {Array.isArray(pkg.points) ? pkg.points.length : (Array.isArray(pkg.sub_items) ? pkg.sub_items.length : 4)} Key Features
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

                <div className="pt-3 border-t border-slate-100 space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                    <div>
                      <span>Price: </span>
                      <span className="font-black text-base text-[#6d3a68]">₹{parseFloat(pkg.price).toFixed(2)}</span>
                      {pkg.original_price && (
                        <span className="ml-2 text-slate-400 line-through text-[11px]">
                          ₹{parseFloat(pkg.original_price).toFixed(2)}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      Live
                    </span>
                  </div>

                  {/* SuperAdmin Edit & Delete Action Buttons */}
                  <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100 bg-slate-50 -mx-5 -mb-5 p-3">
                    <button
                      type="button"
                      onClick={() => handleOpenEditPackage(pkg)}
                      className="px-3.5 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
                    >
                      <Edit className="w-3.5 h-3.5 text-blue-600" />
                      <span>Edit</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeletePackage(pkg.id)}
                      className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-400 hover:text-red-600 hover:bg-red-50 text-xs transition-all cursor-pointer flex items-center gap-1"
                      title="Delete Study Package"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                      <span className="text-xs font-bold text-rose-600">Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}


      {/* ========================================================================= */}
      {/* TAB 4: STUDENT PURCHASES & ORDERS                                         */}
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
