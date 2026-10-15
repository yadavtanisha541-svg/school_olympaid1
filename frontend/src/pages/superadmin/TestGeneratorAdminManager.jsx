import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Plus,
  Search,
  Filter,
  Trash2,
  Eye,
  BookOpen,
  CheckCircle2,
  Clock,
  Award,
  Layers,
  HelpCircle,
  Play,
  RotateCcw,
  Check,
  X,
  FileText,
  Laptop,
  Globe,
  Brain,
  Calculator,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  ArrowLeft,
  FileSpreadsheet,
  Calendar,
  Tag,
  Download,
  Upload,
  Printer,
  FileDown,
  Copy,
  CheckCircle,
  DollarSign,
  Lock,
  ArrowRight,
  Send
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { apiClient } from '../../api/client';
import { getTestPricing, saveTestPricing } from '../../utils/purchaseUtils';
import { extractTextFromFile } from '../../utils/universalDocumentParser';
import { UniversalQuestionImportModal } from '../../components/common/UniversalQuestionImportModal';
import { getTopicsForSubject } from '../../data/subjectTopics';
import { syncManager } from '../../utils/syncManager';
import { getQuestionImage, getCleanQuestionText, QuestionDiagram } from '../../utils/questionMediaHelper';
import { saveImageToStore } from '../../utils/imageStore';

const SUBJECT_OPTIONS = [
  { id: 'math', name: 'IMO (Mathematics)', code: 'IMO', color: '#d97706', icon: '📐' },
  { id: 'science', name: 'ISO (Science)', code: 'ISO', color: '#059669', icon: '🔬' },
  { id: 'digital', name: 'IDLO (Digital Literacy)', code: 'IDLO', color: '#0284c7', icon: '💻' },
  { id: 'english', name: 'IEO (English)', code: 'IEO', color: '#ea580c', icon: '📖' },
  { id: 'gk', name: 'IGKO (General Knowledge)', code: 'IGKO', color: '#e7b84b', icon: '🌍' },
  { id: 'hindi', name: 'IHO (Hindi)', code: 'IHO', color: '#dc2626', icon: '🇮🇳' }
];

const GRADE_OPTIONS = [
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

const cleanPaperTitle = (title = '', fallbackSub = '', fallbackClass = '') => {
  if (!title) return [fallbackClass, fallbackSub, 'Practice Test'].filter(Boolean).join(' ');
  return title
    .replace(/Previous\s*Year\s*Paper/gi, 'Practice Test')
    .replace(/Previous\s*Year/gi, 'Practice Test')
    .replace(/\bPYQs?\b/gi, 'Practice Test')
    .replace(/\b(201[5-9]|202[0-9])\b/g, '')
    .replace(/Level-\d+\s*Practice\s*Test/gi, 'Practice Test')
    .replace(/\(\s*\)/g, '')
    .replace(/\[\s*\]/g, '')
    .replace(/\s*-\s*-\s*/g, ' - ')
    .replace(/\s+/g, ' ')
    .trim();
};

// Clean blank question template for Super Admin
const createBlankQuestion = () => ({
  q: '',
  options: ['', '', '', ''],
  correct: 0,
  explanation: '',
  marks: 1,
  chapter: ''
});

// Sample Bulk Template for easy copy-paste / instant loading
const SAMPLE_BULK_TEXT = `Q1. Which geometric shape has 3 sides and the sum of its interior angles is always 180°?
A) Square
B) Triangle
C) Hexagon
D) Circle
Correct: B
Explanation: A triangle is a 3-sided polygon whose interior angles always sum to 180°.
Marks: 1

Q2. If 15 + x = 32, what is the value of x?
A) 15
B) 16
C) 17
D) 18
Correct: C
Explanation: Subtracting 15 from 32 gives x = 32 - 15 = 17.
Marks: 1

Q3. Which planet in our Solar System is widely known as the "Red Planet"?
A) Venus
B) Mars
C) Jupiter
D) Saturn
Correct: B
Explanation: Mars appears reddish due to iron oxide minerals covering its rocky surface.
Marks: 1

Q4. What is the correct superlative form of the adjective "GOOD"?
A) Better
B) Gooder
C) Best
D) Most Good
Correct: C
Explanation: The degrees of comparison for good are good (positive), better (comparative), best (superlative).
Marks: 1

Q5. Which computer component executes programs and is called the primary "Brain" of the CPU?
A) RAM
B) Monitor
C) Central Processing Unit (ALU & CU)
D) Hard Disk Drive
Correct: C
Explanation: The CPU interprets, computes, and processes all software instructions.
Marks: 1`;

// Universal multi-format intelligent question parser (Handles Plain text, Q1..Qn, JSON, and CSV)
const parseBulkQuestions = (rawText) => {
  if (!rawText || !rawText.trim()) return [];
  const text = rawText.trim();

  // 1. JSON Array or Object
  if ((text.startsWith('[') && text.endsWith(']')) || (text.startsWith('{') && text.endsWith('}'))) {
    try {
      const parsed = JSON.parse(text);
      const arr = Array.isArray(parsed) ? parsed : (parsed.questions || parsed.data || [parsed]);
      if (Array.isArray(arr) && arr.length > 0) {
        return arr.map((item, idx) => {
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

          let corr = 0;
          if (typeof item.correct === 'number') {
            corr = Math.max(0, Math.min(3, item.correct));
          } else {
            const cStr = String(item.correct_option || item.correct || item.answer || item.ans || 'A').toUpperCase().trim();
            const idxMatch = ['A', 'B', 'C', 'D'].indexOf(cStr);
            if (idxMatch >= 0) corr = idxMatch;
            else if (!isNaN(parseInt(cStr))) corr = Math.max(0, Math.min(3, parseInt(cStr) - 1));
          }

          return {
            q: String(item.q || item.question || item.question_text || item.title || `Question ${idx + 1}`).trim(),
            options: opts,
            correct: corr,
            explanation: String(item.explanation || item.solution || item.hint || '').trim(),
            marks: parseInt(item.marks || item.points || 1) || 1,
            question_image: item.question_image || item.image_url || '',
            image_url: item.image_url || item.question_image || ''
          };
        }).filter(q => q.q.length > 0);
      }
    } catch (e) {
      // Fallback
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

  // 3. Line by line text / question block parser
  let rawBlocks = text.split(/(?:\r?\n\s*\r?\n)|(?=(?:^|\n)\s*(?:Q\d*[\.:\)]|Question\s*\d*[\.:\)]|\d+[\.\)]\s+[A-Z]))/im);
  rawBlocks = rawBlocks.map(b => b.trim()).filter(Boolean);

  if (rawBlocks.length === 0) {
    rawBlocks = [text];
  }

  const questions = [];

  for (const block of rawBlocks) {
    const lines = block.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    if (lines.length === 0) continue;

    let questionStatement = '';
    const options = ['', '', '', ''];
    let correct = 0;
    let explanation = '';
    let marks = 1;

    const remainingLines = [];

    for (const line of lines) {
      const optMatch = line.match(/^(?:[\(\[]?([A-Da-d1-4])[\.\)\]\:\-]|Option\s+([A-Da-d1-4])[\:\.\-]?)\s*(.+)$/i);
      const ansMatch = line.match(/^(?:Answer|Ans|Correct(?:\s*Option)?|Key|Right\s*Answer)[\:\s\-]+([A-Da-d1-4]|.+)/i);
      const expMatch = line.match(/^(?:Explanation|Solution|Hint|Reason|Note)[\:\s\-]+(.+)$/i);
      const marksMatch = line.match(/^(?:Marks|Mark|Points|Score)[\:\s\-]+(\d+)/i);

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
        marks = parseInt(marksMatch[1]) || 1;
      } else if (optMatch) {
        const optLetter = (optMatch[1] || optMatch[2]).toUpperCase();
        const optText = optMatch[3].trim();
        let targetIdx = -1;
        if (['A', 'B', 'C', 'D'].includes(optLetter)) targetIdx = ['A', 'B', 'C', 'D'].indexOf(optLetter);
        else if (['1', '2', '3', '4'].includes(optLetter)) targetIdx = parseInt(optLetter) - 1;
        if (targetIdx >= 0) options[targetIdx] = optText;
      } else {
        remainingLines.push(line);
      }
    }

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

    const finalOptions = options.map((opt, i) => opt ? opt.trim() : `Option ${String.fromCharCode(65 + i)}`);

    if (questionStatement.trim()) {
      questions.push({
        q: questionStatement.trim(),
        options: finalOptions,
        correct,
        explanation: explanation.trim(),
        marks
      });
    }
  }

  return questions;
};

// Safe helper to prune heavy base64 strings if localStorage quota is tight
const isLargeDataUrl = (s) => typeof s === 'string' && (s.length > 500 && (s.startsWith('data:') || s.length > 1000));

const pruneQuestionsForStorage = (qs) => (qs || []).map((q, idx) => {
  const token = `__IMG__${q.id || idx + 1}__`;
  return {
    ...q,
    question_image: isLargeDataUrl(q.question_image) ? token : q.question_image,
    diagram: isLargeDataUrl(q.diagram) ? token : q.diagram,
    image_url: isLargeDataUrl(q.image_url) ? token : q.image_url,
    image: isLargeDataUrl(q.image) ? token : q.image,
    figure: isLargeDataUrl(q.figure) ? token : q.figure
  };
});

const safeSavePaperToStorage = (key, paperObj) => {
  if (!key || !paperObj) return;
  try {
    const existing = JSON.parse(localStorage.getItem(key) || '[]');
    const updated = [paperObj, ...(Array.isArray(existing) ? existing.filter(p => String(p.id) !== String(paperObj.id)) : [])];
    localStorage.setItem(key, JSON.stringify(updated));
  } catch (quotaErr) {
    console.warn(`[SafeSavePaper] Quota exceeded on "${key}". Pruning diagrams for localStorage (persisted in IndexedDB):`, quotaErr);
    try {
      const existing = JSON.parse(localStorage.getItem(key) || '[]');
      const prunedExisting = (Array.isArray(existing) ? existing : []).map(p => ({
        ...p,
        questions: pruneQuestionsForStorage(p.questions)
      }));
      const compactPaper = {
        ...paperObj,
        questions: pruneQuestionsForStorage(paperObj.questions)
      };
      const updatedPruned = [compactPaper, ...prunedExisting.filter(p => String(p.id) !== String(paperObj.id))];
      localStorage.setItem(key, JSON.stringify(updatedPruned));
    } catch (innerErr) {
      console.warn(`[SafeSavePaper] Critical storage quota warning for "${key}":`, innerErr);
    }
  }
};

const safeUpsertPaperList = (key, updatedPaper) => {
  if (!key || !updatedPaper) return;
  try {
    const existing = JSON.parse(localStorage.getItem(key) || '[]');
    let found = false;
    const res = (Array.isArray(existing) ? existing : []).map(p => {
      if (String(p.id) === String(updatedPaper.id)) {
        found = true;
        return updatedPaper;
      }
      return p;
    });
    if (!found) res.unshift(updatedPaper);
    localStorage.setItem(key, JSON.stringify(res));
  } catch (quotaErr) {
    console.warn(`[SafeUpsert] Quota exceeded on "${key}":`, quotaErr);
    try {
      const existing = JSON.parse(localStorage.getItem(key) || '[]');
      let found = false;
      const res = (Array.isArray(existing) ? existing : []).map(p => {
        const pruned = { ...p, questions: pruneQuestionsForStorage(p.questions) };
        if (String(p.id) === String(updatedPaper.id)) {
          found = true;
          return { ...updatedPaper, questions: pruneQuestionsForStorage(updatedPaper.questions) };
        }
        return pruned;
      });
      if (!found) res.unshift({ ...updatedPaper, questions: pruneQuestionsForStorage(updatedPaper.questions) });
      localStorage.setItem(key, JSON.stringify(res));
    } catch (e2) {}
  }
};

export const TestGeneratorAdminManager = () => {
  const { user } = useAuth();
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Category tabs: 'all' | 'practice_test' | 'generator'
  const [activeCategoryTab, setActiveCategoryTab] = useState('all');
  const [selectedClassFilter, setSelectedClassFilter] = useState('All');
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState('All');
  const [selectedYearFilter, setSelectedYearFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // =========================================================================
  // PRACTICE TEST PRICING & UNLOCK CONFIGURATION STATE
  // =========================================================================
  const [testPricing, setTestPricing] = useState(() => getTestPricing());
  const [practicePriceInput, setPracticePriceInput] = useState(() => {
    const p = getTestPricing();
    return p.practice_test_price || 99;
  });
  const [originalPriceInput, setOriginalPriceInput] = useState(() => {
    const p = getTestPricing();
    return p.original_price || 299;
  });
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [isSavingPricing, setIsSavingPricing] = useState(false);
  const [pricingSavedToast, setPricingSavedToast] = useState(false);

  useEffect(() => {
    const handlePricingSync = (e) => {
      const p = e?.detail || getTestPricing();
      setTestPricing(p);
      setPracticePriceInput(p.practice_test_price || 99);
      setOriginalPriceInput(p.original_price || 299);
    };
    window.addEventListener('olympiadhub-pricing-updated', handlePricingSync);
    window.addEventListener('storage', handlePricingSync);
    return () => {
      window.removeEventListener('olympiadhub-pricing-updated', handlePricingSync);
      window.removeEventListener('storage', handlePricingSync);
    };
  }, []);

  const handleSavePracticePricing = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setIsSavingPricing(true);
    try {
      const current = getTestPricing();
      const updated = saveTestPricing({
        ...current,
        practice_test_price: Number(practicePriceInput) || 99,
        original_price: Number(originalPriceInput) || 299
      });
      setTestPricing(updated);
      setPracticePriceInput(updated.practice_test_price);
      setOriginalPriceInput(updated.original_price);

      try {
        await apiClient.post('/pricing/tests', updated);
      } catch (err) {}

      setPricingSavedToast(true);
      setTimeout(() => setPricingSavedToast(false), 4500);
      setShowPricingModal(false);
    } catch (err) {
      alert('Failed to save practice test pricing: ' + err.message);
    } finally {
      setIsSavingPricing(false);
    }
  };

  // Modal / Creator State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [previewPaper, setPreviewPaper] = useState(null);
  const [paperSavedToast, setPaperSavedToast] = useState('');
  const [isPublishingPaper, setIsPublishingPaper] = useState(false);

  // Bulk Importer Modal State
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [bulkInputText, setBulkInputText] = useState('');
  const [bulkParsedCount, setBulkParsedCount] = useState(0);

  // Universal Word/PDF/CSV Importer Modal State
  const [showUniversalImportModal, setShowUniversalImportModal] = useState(false);
  const [showPaperImportModal, setShowPaperImportModal] = useState(false);

  // Form State
  const [paperCategory, setPaperCategory] = useState('practice_test'); // 'practice_test' | 'generator'
  const [examYear, setExamYear] = useState('2024');
  const [paperTitle, setPaperTitle] = useState('');
  const [paperClass, setPaperClass] = useState('Class 6');
  const [paperSubject, setPaperSubject] = useState('math');
  const [paperDuration, setPaperDuration] = useState(60);
  const [paperDifficulty, setPaperDifficulty] = useState('Standard');
  const [selectedPaperChapters, setSelectedPaperChapters] = useState(() => getTopicsForSubject('math'));
  const [isTopicsDropdownOpen, setIsTopicsDropdownOpen] = useState(false);
  const [topicsSearchQuery, setTopicsSearchQuery] = useState('');
  const topicsDropdownRef = useRef(null);
  const [bulkTargetTopic, setBulkTargetTopic] = useState('');
  const [questionsList, setQuestionsList] = useState([]);

  const sanitizePaperList = (list) => {
    return (list || []).map((p) => ({
      ...p,
      title: cleanPaperTitle(p.title, p.subject_code, p.class_name),
      exam_year: '',
      short_code: (p.short_code || '').replace(/\s*-\s*(201[5-9]|202[0-9]|PYQ)/gi, '').trim()
    }));
  };

  const isFetchingPapersRef = useRef(false);

  // Load published papers directly from API & Local Storage (Robust bi-directional sync)
  const fetchPapers = async () => {
    if (isFetchingPapersRef.current) return;
    isFetchingPapersRef.current = true;
    setLoading(true);
    try {
      let combined = [];

      const addPaperUnique = (p) => {
        if (!p || (!p.id && !p.exam_code)) return;
        const idStr = p.id ? String(p.id) : '';
        const codeStr = p.exam_code ? String(p.exam_code) : '';
        const exists = combined.some((cp) => 
          (idStr && String(cp.id) === idStr) ||
          (codeStr && cp.exam_code && String(cp.exam_code) === codeStr)
        );
        if (!exists) {
          combined.push(p);
        }
      };

      // 1. Gather all local papers from admin_generator_papers
      try {
        const local = JSON.parse(localStorage.getItem('admin_generator_papers') || '[]');
        if (Array.isArray(local)) local.forEach(addPaperUnique);
      } catch (e) {}

      // 2. Gather from olympiadhub_db_exam_papers
      try {
        const dbP = JSON.parse(localStorage.getItem('olympiadhub_db_exam_papers') || '[]');
        if (Array.isArray(dbP)) dbP.forEach(addPaperUnique);
      } catch (e) {}

      // 3. Gather from mock_db_exam_papers
      try {
        const mDb = JSON.parse(localStorage.getItem('mock_db_exam_papers') || '[]');
        if (Array.isArray(mDb)) mDb.forEach(addPaperUnique);
      } catch (e) {}

      // 4. Gather practice tests from olympiadhub_db_exams
      try {
        const exDb = JSON.parse(localStorage.getItem('olympiadhub_db_exams') || '[]');
        if (Array.isArray(exDb)) {
          exDb.filter(e => (e.exam_type || '').includes('practice') || (e.paper_category || '').includes('practice')).forEach(addPaperUnique);
        }
      } catch (e) {}

      // 5. Fetch from API (/test-generator/admin-papers)
      try {
        const res = await apiClient.get('/test-generator/admin-papers');
        if (res && res.success && Array.isArray(res.data)) {
          res.data.forEach(addPaperUnique);
        }
      } catch (e) {
        console.warn('apiClient fetch error, using local papers:', e);
      }

      // 6. Fallback check from /exam-papers
      try {
        const epRes = await apiClient.get('/exam-papers');
        if (epRes && epRes.success && Array.isArray(epRes.data)) {
          epRes.data.forEach(addPaperUnique);
        }
      } catch (err) {}

      const cleaned = sanitizePaperList(combined);
      setPapers(cleaned);
      try {
        localStorage.setItem('admin_generator_papers', JSON.stringify(cleaned));
      } catch (e) {
        console.warn('Quota limit reached in fetchPapers caching:', e);
      }
    } finally {
      setLoading(false);
      isFetchingPapersRef.current = false;
    }
  };

  useEffect(() => {
    fetchPapers();
  }, []);

  // Close topics dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (topicsDropdownRef.current && !topicsDropdownRef.current.contains(event.target)) {
        setIsTopicsDropdownOpen(false);
      }
    };
    if (isTopicsDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isTopicsDropdownOpen]);

  // Helper to generate dynamic title (Class & Subject only)
  const generateTitle = (cat, grade, subKey) => {
    const subObj = SUBJECT_OPTIONS.find((s) => s.id === subKey);
    const subCode = subObj ? subObj.code : (subKey || 'IMO').toUpperCase();
    if (cat === 'generator') {
      return `${grade} ${subCode} Intelligent Generator Practice Paper`;
    } else {
      return `${grade} ${subCode} Practice Mock Test`;
    }
  };

  // Open Create Modal & populate 1 clean blank question for authoring
  const handleOpenCreateModal = (presetCategory = 'practice_test') => {
    const cat = presetCategory === 'all' ? 'practice_test' : presetCategory;
    setPaperCategory(cat);
    setExamYear('');
    setPaperClass('Class 6');
    setPaperSubject('math');
    setSelectedPaperChapters(getTopicsForSubject('math'));
    setIsTopicsDropdownOpen(false);
    setTopicsSearchQuery('');
    setPaperDuration(cat === 'generator' ? 15 : 60);
    setPaperDifficulty('Standard');
    setPaperTitle(generateTitle(cat, 'Class 6', 'math'));
    const initialBlank = createBlankQuestion();
    initialBlank.chapter = getTopicsForSubject('math')[0] || '';
    setQuestionsList([initialBlank]);
    setShowCreateModal(true);
  };

  // Change category in modal
  const handleCategoryChangeInModal = (cat) => {
    setPaperCategory(cat);
    setPaperDuration(cat === 'generator' ? 15 : 60);
    setPaperTitle(generateTitle(cat, paperClass, paperSubject));
  };

  // Change subject in modal
  const handleSubjectChangeInModal = (subKey) => {
    setPaperSubject(subKey);
    const newTopics = getTopicsForSubject(subKey);
    setSelectedPaperChapters(newTopics);
    setPaperTitle(generateTitle(paperCategory, paperClass, subKey));
  };

  // Change class in modal
  const handleClassChangeInModal = (cls) => {
    setPaperClass(cls);
    setPaperTitle(generateTitle(paperCategory, cls, paperSubject));
  };

  // Change year in modal
  const handleYearChangeInModal = (yr) => {
    setExamYear(yr);
  };

  // Add blank question
  const handleAddQuestion = () => {
    const newQ = createBlankQuestion();
    newQ.chapter = selectedPaperChapters[0] || getTopicsForSubject(paperSubject)[0] || '';
    setQuestionsList([
      ...questionsList,
      newQ
    ]);
  };

  // Update question field
  const handleUpdateQuestion = (idx, field, value) => {
    const updated = [...questionsList];
    updated[idx] = { ...updated[idx], [field]: value };
    setQuestionsList(updated);
  };

  // Update question option
  const handleUpdateOption = (qIdx, optIdx, val) => {
    const updated = [...questionsList];
    const opts = [...(updated[qIdx].options || ['', '', '', ''])];
    opts[optIdx] = val;
    updated[qIdx].options = opts;
    setQuestionsList(updated);
  };

  // Remove question
  const handleRemoveQuestion = (idx) => {
    setQuestionsList(questionsList.filter((_, i) => i !== idx));
  };

  // Direct Export & Download current paper as PDF / Print
  const handleExportCurrentPaperPdf = (includeAnswers = true) => {
    if (questionsList.length === 0) {
      alert('Please add at least one question before exporting.');
      return;
    }
    const subObj = SUBJECT_OPTIONS.find((s) => s.id === paperSubject);
    const currentPaperData = {
      title: paperTitle || `${paperClass} ${subObj?.name || 'Olympiad'} Question Paper`,
      paper_category: paperCategory,
      exam_year: examYear || '',
      subject_code: subObj?.code || 'IMO',
      class_name: paperClass,
      duration_minutes: paperDuration,
      questions: questionsList,
      exam_code: `PPR-${paperCategory.slice(0, 3).toUpperCase()}-${Date.now().toString().slice(-4)}`
    };
    handlePrintPaper(currentPaperData, includeAnswers);
  };

  // Direct Download current paper as CSV
  const handleDownloadCurrentPaperCsv = () => {
    if (questionsList.length === 0) {
      alert('Please add at least one question before exporting.');
      return;
    }
    const currentPaperData = {
      title: paperTitle || `${paperClass} Question Paper`,
      questions: questionsList
    };
    handleDownloadPaperCsv(currentPaperData);
  };

  // Submit and Publish Paper (100% Reliable Sync & Persistence)
  const handleSavePaper = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (isPublishingPaper) return;

    let finalTitle = (paperTitle || '').trim();
    if (!finalTitle) {
      finalTitle = generateTitle(paperCategory, paperClass, paperSubject);
      setPaperTitle(finalTitle);
    }

    if (!questionsList || questionsList.length === 0) {
      alert('Please add at least one question to this paper before publishing.');
      return;
    }

    setIsPublishingPaper(true);

    try {
      const totalMarks = questionsList.reduce((acc, q) => acc + (parseFloat(q.marks) || 1), 0);
      const subObj = SUBJECT_OPTIONS.find((s) => s.id === paperSubject);
      const paperId = Date.now();
      const prefix = paperCategory === 'generator' ? 'TGP' : 'PRAC';
      const subCode = subObj?.code || 'GEN';
      const examCode = `${prefix}-${subCode}-${Math.floor(1000 + Math.random() * 9000)}`;

      const normalizedQuestions = questionsList.map((q, idx) => {
        const qText = (q.q || q.question_text || '').trim() || `Question ${idx + 1}`;
        const rawOpts = Array.isArray(q.options) && q.options.length >= 2
          ? q.options
          : [q.option_a, q.option_b, q.option_c, q.option_d];
        const opts = rawOpts.map((opt, oIdx) => (opt && String(opt).trim()) ? String(opt).trim() : `Option ${['A', 'B', 'C', 'D'][oIdx] || String.fromCharCode(65 + oIdx)}`);
        let corr = 0;
        if (typeof q.correct === 'number') corr = q.correct;
        else if (q.correct_option === 'B' || q.correct === 'B') corr = 1;
        else if (q.correct_option === 'C' || q.correct === 'C') corr = 2;
        else if (q.correct_option === 'D' || q.correct === 'D') corr = 3;
        const qDiagImg = getQuestionImage(q) || q.question_image || q.image_url || q.diagram || q.image || q.figure || '';
        const finalQId = q.id || (paperId + '_' + (idx + 1));
        if (qDiagImg && typeof qDiagImg === 'string' && qDiagImg.trim()) {
          try {
            saveImageToStore(String(finalQId), qDiagImg.trim());
            saveImageToStore(qText, qDiagImg.trim());
          } catch (_) {}
        }
        return {
          ...q,
          id: finalQId,
          q: qText,
          question_text: qText,
          options: opts,
          option_a: opts[0] || 'Option A',
          option_b: opts[1] || 'Option B',
          option_c: opts[2] || 'Option C',
          option_d: opts[3] || 'Option D',
          correct: corr,
          correct_option: ['A', 'B', 'C', 'D'][corr] || 'A',
          marks: parseFloat(q.marks) || 1,
          explanation: q.explanation || '',
          question_image: qDiagImg,
          image_url: qDiagImg,
          diagram: qDiagImg,
          image: qDiagImg,
          figure: qDiagImg
        };
      });

      const completePaper = {
        id: paperId,
        exam_code: examCode,
        title: cleanPaperTitle(finalTitle, subObj?.code, paperClass),
        paper_category: paperCategory || 'practice_test',
        category: paperCategory || 'practice_test',
        exam_type: paperCategory === 'generator' ? 'generated' : 'practice',
        exam_year: '',
        subject: paperSubject,
        subject_name: subObj?.name || 'Mathematics',
        subject_code: subObj?.code || 'IMO',
        class: paperClass,
        class_name: paperClass,
        grade: paperClass,
        duration_minutes: parseInt(paperDuration) || 60,
        total_questions: normalizedQuestions.length,
        total_marks: totalMarks,
        difficulty: paperDifficulty || 'Standard',
        status: 'published',
        is_published: true,
        chapters: selectedPaperChapters || [],
        topics: selectedPaperChapters || [],
        questions: normalizedQuestions,
        created_at: new Date().toISOString()
      };

      // 1. Immediately update UI state synchronously
      setPapers((prev) => [completePaper, ...prev.filter(p => String(p.id) !== String(completePaper.id))]);
      setSelectedClassFilter('All');
      setSelectedSubjectFilter('All');
      setSearchQuery('');
      setPaperSavedToast(`Practice Paper "${completePaper.title}" published successfully! Synchronized across Super Admin & Student Dashboard.`);
      setTimeout(() => setPaperSavedToast(''), 6000);

      // 2. Persist safely in local storages with quota protection
      safeSavePaperToStorage('admin_generator_papers', completePaper);
      safeSavePaperToStorage('olympiadhub_db_exam_papers', completePaper);
      safeSavePaperToStorage('mock_db_exam_papers', completePaper);
      safeSavePaperToStorage('olympiadhub_db_exams', completePaper);

      // 3. API call to mockEngine
      try {
        await apiClient.post('/test-generator/admin-papers', completePaper);
      } catch (err) {
        console.warn('API error, persisting locally:', err);
      }

      // 4. Dispatch sync events
      try {
        window.dispatchEvent(new CustomEvent('olympiadhub-admin-papers-updated', { detail: completePaper }));
        window.dispatchEvent(new CustomEvent('olympiadhub-exams-updated', { detail: completePaper }));
        window.dispatchEvent(new CustomEvent('olympiadhub-data-updated', { detail: { table: 'exam_papers', data: [completePaper] } }));
        window.dispatchEvent(new Event('storage'));
      } catch (_) {}

      // 5. Immediate push to central sync
      try {
        if (typeof window !== 'undefined' && window.syncManager?.schedulePush) {
          window.syncManager.schedulePush();
        }
      } catch (_) {}

      // 6. Close modal and refresh paper list
      setShowCreateModal(false);
      fetchPapers();
    } catch (publishErr) {
      console.error('Failed to publish paper:', publishErr);
      alert('Failed to publish paper: ' + (publishErr?.message || publishErr));
    } finally {
      setIsPublishingPaper(false);
    }
  };

  // Delete Paper directly
  const handleDeletePaper = async (paperId) => {
    setPapers((prev) => prev.filter((p) => p.id !== paperId));

    try {
      await apiClient.delete(`/test-generator/admin-papers/${paperId}`);
    } catch (e) {
      console.warn('Delete error', e);
    }

    try {
      const local = JSON.parse(localStorage.getItem('admin_generator_papers') || '[]');
      const updated = local.filter((p) => p.id !== paperId);
      localStorage.setItem('admin_generator_papers', JSON.stringify(updated));
    } catch (e) {}

    try {
      const mockDb = JSON.parse(localStorage.getItem('mock_db_exam_papers') || '[]');
      localStorage.setItem('mock_db_exam_papers', JSON.stringify(mockDb.filter((p) => p.id !== paperId)));
    } catch (e) {}

    window.dispatchEvent(new CustomEvent('olympiadhub-admin-papers-updated', { detail: { deletedId: paperId } }));
    fetchPapers();
  };

  // Delete individual question from paper preview
  const handleDeleteQuestionFromPreview = async (qIdx) => {
    if (!previewPaper) return;
    const currentQuestions = Array.isArray(previewPaper.questions) ? [...previewPaper.questions] : [];
    if (qIdx < 0 || qIdx >= currentQuestions.length) return;

    if (!window.confirm(`Are you sure you want to delete Question #${qIdx + 1}?`)) {
      return;
    }

    const updatedQuestions = currentQuestions.filter((_, i) => i !== qIdx);
    const updatedPaper = {
      ...previewPaper,
      questions: updatedQuestions,
      total_questions: updatedQuestions.length,
      total_marks: updatedQuestions.reduce((acc, q) => acc + (parseFloat(q.marks) || 1), 0)
    };

    setPreviewPaper(updatedPaper);
    setPapers((prev) => prev.map((p) => (p.id === updatedPaper.id ? updatedPaper : p)));

    // Save to localStorage
    safeUpsertPaperList('admin_generator_papers', updatedPaper);
    safeUpsertPaperList('olympiadhub_db_exam_papers', updatedPaper);
    safeUpsertPaperList('mock_db_exam_papers', updatedPaper);
    safeUpsertPaperList('olympiadhub_db_exams', updatedPaper);

    try {
      await apiClient.put(`/test-generator/admin-papers/${updatedPaper.id}`, updatedPaper).catch(() => null);
      await apiClient.put(`/exam-papers/${updatedPaper.id}`, updatedPaper).catch(() => null);
    } catch (e) {}

    window.dispatchEvent(new CustomEvent('olympiadhub-admin-papers-updated', { detail: updatedLocal }));
    window.dispatchEvent(new Event('olympiad-paper-published'));
  };

  // Helper to upsert a paper into array matching by String ID
  const upsertPaperList = (list, updatedPaper) => {
    let found = false;
    const res = (list || []).map((p) => {
      if (String(p.id) === String(updatedPaper.id)) {
        found = true;
        return updatedPaper;
      }
      return p;
    });
    if (!found) res.unshift(updatedPaper);
    return res;
  };

  // Upload or set diagram image for an existing question in previewPaper
  const handleUploadQuestionDiagram = (qIdx, file) => {
    if (!file || !previewPaper) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result;
      const updatedQuestions = (previewPaper.questions || []).map((q, i) => {
        if (i === qIdx) {
          return {
            ...q,
            question_image: dataUrl,
            image_url: dataUrl,
            diagram: dataUrl,
            image: dataUrl,
            figure: dataUrl
          };
        }
        return q;
      });
      const updatedPaper = { ...previewPaper, questions: updatedQuestions };
      setPreviewPaper(updatedPaper);
      setPapers((prev) => prev.map((p) => (String(p.id) === String(updatedPaper.id) ? updatedPaper : p)));

      try {
        const targetQ = updatedQuestions[qIdx];
        const qRawText = (targetQ.q || targetQ.question_text || '').trim();

        // 1. Save directly into persistent imageStore (IndexedDB & memory cache)
        if (targetQ.id) saveImageToStore(String(targetQ.id), dataUrl);
        if (qRawText) saveImageToStore(qRawText, dataUrl);

        // 2. Persist in local storage
        safeUpsertPaperList('admin_generator_papers', updatedPaper);
        safeUpsertPaperList('olympiadhub_db_exam_papers', updatedPaper);
        safeUpsertPaperList('mock_db_exam_papers', updatedPaper);
        safeUpsertPaperList('olympiadhub_db_exams', updatedPaper);

        // 3. Sync to olympiadhub_db_questions so question bank fallback also finds this diagram immediately
        if (qRawText) {
          const qBank = JSON.parse(localStorage.getItem('olympiadhub_db_questions') || '[]');
          let bankFound = false;
          const updatedQBank = qBank.map((bq) => {
            if ((bq.question_text || bq.q || '').trim() === qRawText) {
              bankFound = true;
              return {
                ...bq,
                question_image: dataUrl,
                image_url: dataUrl,
                diagram: dataUrl,
                image: dataUrl,
                figure: dataUrl
              };
            }
            return bq;
          });
          if (!bankFound) {
            updatedQBank.unshift({
              id: 'Q-' + Date.now(),
              question_text: qRawText,
              q: qRawText,
              options: targetQ.options,
              correct: targetQ.correct,
              question_image: dataUrl,
              image_url: dataUrl,
              diagram: dataUrl,
              image: dataUrl,
              figure: dataUrl
            });
          }
          localStorage.setItem('olympiadhub_db_questions', JSON.stringify(updatedQBank));
        }

        // 4. Update backend API & MySQL database
        apiClient.put(`/test-generator/admin-papers/${updatedPaper.id}`, updatedPaper).catch(() => null);
        apiClient.put(`/exam-papers/${updatedPaper.id}`, updatedPaper).catch(() => null);
      } catch (e) {}

      window.dispatchEvent(new CustomEvent('olympiadhub-admin-papers-updated', { detail: updatedPaper }));
      window.dispatchEvent(new CustomEvent('olympiadhub-data-updated'));
      window.dispatchEvent(new Event('storage'));
    };
    reader.readAsDataURL(file);
  };

  const handleSetQuestionDiagramUrl = (qIdx, url) => {
    if (!url || !previewPaper) return;
    const cleanUrl = url.trim();
    const updatedQuestions = (previewPaper.questions || []).map((q, i) => {
      if (i === qIdx) {
        return {
          ...q,
          question_image: cleanUrl,
          image_url: cleanUrl,
          diagram: cleanUrl,
          image: cleanUrl,
          figure: cleanUrl
        };
      }
      return q;
    });
    const updatedPaper = { ...previewPaper, questions: updatedQuestions };
    setPreviewPaper(updatedPaper);
    setPapers((prev) => prev.map((p) => (String(p.id) === String(updatedPaper.id) ? updatedPaper : p)));

    try {
      const targetQ = updatedQuestions[qIdx];
      const qRawText = (targetQ.q || targetQ.question_text || '').trim();

      // 1. Save directly into persistent imageStore
      if (targetQ.id) saveImageToStore(String(targetQ.id), cleanUrl);
      if (qRawText) saveImageToStore(qRawText, cleanUrl);

      // 2. Persist in local storage
      safeUpsertPaperList('admin_generator_papers', updatedPaper);
      safeUpsertPaperList('olympiadhub_db_exam_papers', updatedPaper);
      safeUpsertPaperList('mock_db_exam_papers', updatedPaper);
      safeUpsertPaperList('olympiadhub_db_exams', updatedPaper);

      // 3. Question bank sync
      if (qRawText) {
        const qBank = JSON.parse(localStorage.getItem('olympiadhub_db_questions') || '[]');
        let bankFound = false;
        const updatedQBank = qBank.map((bq) => {
          if ((bq.question_text || bq.q || '').trim() === qRawText) {
            bankFound = true;
            return {
              ...bq,
              question_image: cleanUrl,
              image_url: cleanUrl,
              diagram: cleanUrl,
              image: cleanUrl,
              figure: cleanUrl
            };
          }
          return bq;
        });
        if (!bankFound) {
          updatedQBank.unshift({
            id: 'Q-' + Date.now(),
            question_text: qRawText,
            q: qRawText,
            options: targetQ.options,
            correct: targetQ.correct,
            question_image: cleanUrl,
            image_url: cleanUrl,
            diagram: cleanUrl,
            image: cleanUrl,
            figure: cleanUrl
          });
        }
        localStorage.setItem('olympiadhub_db_questions', JSON.stringify(updatedQBank));
      }

      // 4. Update backend API & MySQL database
      apiClient.put(`/test-generator/admin-papers/${updatedPaper.id}`, updatedPaper).catch(() => null);
      apiClient.put(`/exam-papers/${updatedPaper.id}`, updatedPaper).catch(() => null);
    } catch (e) {}

    window.dispatchEvent(new CustomEvent('olympiadhub-admin-papers-updated', { detail: updatedPaper }));
    window.dispatchEvent(new CustomEvent('olympiadhub-data-updated'));
    window.dispatchEvent(new Event('storage'));
  };

  const handleRemoveQuestionDiagram = (qIdx) => {
    if (!previewPaper) return;
    const updatedQuestions = (previewPaper.questions || []).map((q, i) => {
      if (i === qIdx) {
        return {
          ...q,
          question_image: '',
          image_url: '',
          diagram: '',
          image: '',
          figure: ''
        };
      }
      return q;
    });
    const updatedPaper = { ...previewPaper, questions: updatedQuestions };
    setPreviewPaper(updatedPaper);
    setPapers((prev) => prev.map((p) => (String(p.id) === String(updatedPaper.id) ? updatedPaper : p)));

    try {
      safeUpsertPaperList('admin_generator_papers', updatedPaper);
      safeUpsertPaperList('olympiadhub_db_exam_papers', updatedPaper);
      safeUpsertPaperList('mock_db_exam_papers', updatedPaper);
      safeUpsertPaperList('olympiadhub_db_exams', updatedPaper);

      apiClient.put(`/test-generator/admin-papers/${updatedPaper.id}`, updatedPaper).catch(() => null);
      apiClient.put(`/exam-papers/${updatedPaper.id}`, updatedPaper).catch(() => null);
    } catch (e) {}

    window.dispatchEvent(new CustomEvent('olympiadhub-admin-papers-updated', { detail: updatedPaper }));
    window.dispatchEvent(new CustomEvent('olympiadhub-data-updated'));
    window.dispatchEvent(new Event('storage'));
  };

  // Toggle Publish / Unpublish paper from preview
  const handleTogglePublishPreviewPaper = async () => {
    if (!previewPaper) return;
    const isCurrentlyPublished = previewPaper.status === 'published';
    
    if (isCurrentlyPublished) {
      const confirmUnpublish = window.confirm(
        '⚠️ Yeh exam paper pehle se hi Live & Published hai.\n\nKya aap sach me ise Unpublish karke Draft me move karna chahte hain? (Draft karne se students ko yeh exam nahi dikhega)'
      );
      if (!confirmUnpublish) {
        return;
      }
    }

    const newStatus = isCurrentlyPublished ? 'draft' : 'published';

    const updatedPaper = {
      ...previewPaper,
      status: newStatus,
      is_published: newStatus === 'published'
    };

    setPreviewPaper(updatedPaper);
    setPapers((prev) => prev.map((p) => (p.id === updatedPaper.id ? updatedPaper : p)));

    safeUpsertPaperList('admin_generator_papers', updatedPaper);
    safeUpsertPaperList('olympiadhub_db_exam_papers', updatedPaper);
    safeUpsertPaperList('mock_db_exam_papers', updatedPaper);
    safeUpsertPaperList('olympiadhub_db_exams', updatedPaper);

    try {
      await apiClient.put(`/test-generator/admin-papers/${updatedPaper.id}`, updatedPaper).catch(() => null);
      await apiClient.put(`/exam-papers/${updatedPaper.id}`, updatedPaper).catch(() => null);
    } catch (e) {}

    window.dispatchEvent(new CustomEvent('olympiadhub-admin-papers-updated', { detail: updatedLocal }));
    window.dispatchEvent(new CustomEvent('olympiad-paper-published', { detail: updatedPaper }));
    window.dispatchEvent(new Event('olympiad-paper-published'));

    if (newStatus === 'published') {
      alert(`🎉 Exam Paper Published Successfully!\n\nYeh paper ab LIVE hai aur Student Panel me sabhi students ko Practice Tests me turant dikhai dega.`);
    } else {
      alert(`ℹ️ Exam Paper unpublished (Draft set ho gaya hai). Students ko yeh tab tak nahi dikhega jab tak aap dobara Publish na karein.`);
    }
  };

  // Handle Bulk Modal Actions
  const handleOpenBulkModal = () => {
    setBulkInputText('');
    setBulkParsedCount(0);
    setShowBulkModal(true);
  };

  const handleBulkTextChange = (txt) => {
    setBulkInputText(txt);
    const parsed = parseBulkQuestions(txt);
    setBulkParsedCount(parsed.length);
  };

  const handleLoadSampleBulk = () => {
    handleBulkTextChange(SAMPLE_BULK_TEXT);
  };

  const handleBulkFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const content = await extractTextFromFile(file);
      handleBulkTextChange(content);
    } catch (err) {
      alert(err.message || 'Error parsing document. Please check the file.');
    }
  };

  const handleApplyBulkImport = (mode = 'append') => {
    let parsed = parseBulkQuestions(bulkInputText);
    if (parsed.length === 0) {
      alert('No valid questions could be detected. Please check format or load sample template.');
      return;
    }

    if (bulkTargetTopic) {
      parsed = parsed.map(q => ({
        ...q,
        chapter: q.chapter || bulkTargetTopic
      }));
    }

    if (mode === 'replace') {
      setQuestionsList(parsed);
    } else {
      // Filter out clean single blank question if it is empty
      const existing = (questionsList.length === 1 && !questionsList[0].q.trim()) ? [] : questionsList;
      setQuestionsList([...existing, ...parsed]);
    }

    setShowBulkModal(false);
    setBulkInputText('');
    setBulkTargetTopic('');
  };

  // Universal Word / PDF / CSV Importer Handler
  const handleUniversalQuestionsImported = (imported) => {
    if (!Array.isArray(imported) || imported.length === 0) return;

    const formatted = imported.map((item, idx) => {
      const qText = item.question_text || item.q || item.title || `Question ${idx + 1}`;
      const opts = [
        item.option_a || item.options?.[0] || 'Option A',
        item.option_b || item.options?.[1] || 'Option B',
        item.option_c || item.options?.[2] || 'Option C',
        item.option_d || item.options?.[3] || 'Option D'
      ];
      let corr = 0;
      if (typeof item.correct === 'number') {
        corr = Math.max(0, Math.min(3, item.correct));
      } else {
        const letter = String(item.correct_option || item.answer || item.correct || 'A').toUpperCase().trim();
        const idxLetter = ['A', 'B', 'C', 'D'].indexOf(letter);
        if (idxLetter >= 0) corr = idxLetter;
        else if (!isNaN(parseInt(letter))) corr = Math.max(0, Math.min(3, parseInt(letter) - 1));
      }
      const qDiagImg = getQuestionImage(item) || item.question_image || item.image_url || item.diagram || item.image || item.figure || '';
      const finalQId = item.id || `imp-${Date.now()}-${idx}`;
      if (qDiagImg) {
        saveImageToStore(String(finalQId), qDiagImg);
        saveImageToStore(qText, qDiagImg);
      }
      return {
        id: finalQId,
        q: qText,
        options: opts,
        correct: corr,
        explanation: item.explanation || item.solution || '',
        marks: Number(item.marks) || 1,
        question_image: qDiagImg,
        image_url: qDiagImg,
        diagram: qDiagImg,
        image: qDiagImg,
        figure: qDiagImg,
        _imgStore: item._imgStore,
        question_image_keys: item.question_image_keys
      };
    });

    if (!showCreateModal) {
      handleOpenCreateModal(activeCategoryTab);
      setQuestionsList(formatted);
    } else {
      const existing = (questionsList.length === 1 && !questionsList[0].q.trim()) ? [] : questionsList;
      setQuestionsList([...existing, ...formatted]);
    }

    setShowUniversalImportModal(false);
  };

  // Import Questions directly into currently viewed paper (previewPaper)
  const handleImportQuestionsIntoPreviewPaper = (imported) => {
    if (!Array.isArray(imported) || imported.length === 0 || !previewPaper) return;

    const formatted = imported.map((item, idx) => {
      const qText = item.question_text || item.q || item.title || `Question ${idx + 1}`;
      const opts = [
        item.option_a || item.options?.[0] || 'Option A',
        item.option_b || item.options?.[1] || 'Option B',
        item.option_c || item.options?.[2] || 'Option C',
        item.option_d || item.options?.[3] || 'Option D'
      ];
      let corr = 0;
      if (typeof item.correct === 'number') {
        corr = Math.max(0, Math.min(3, item.correct));
      } else {
        const letter = String(item.correct_option || item.answer || item.correct || 'A').toUpperCase().trim();
        const idxLetter = ['A', 'B', 'C', 'D'].indexOf(letter);
        if (idxLetter >= 0) corr = idxLetter;
        else if (!isNaN(parseInt(letter))) corr = Math.max(0, Math.min(3, parseInt(letter) - 1));
      }
      const qDiagImg = getQuestionImage(item) || item.question_image || item.image_url || item.diagram || item.image || item.figure || '';
      const finalQId = item.id || Date.now() + idx;
      if (qDiagImg) {
        saveImageToStore(String(finalQId), qDiagImg);
        saveImageToStore(qText, qDiagImg);
      }
      return {
        id: finalQId,
        q: qText,
        options: opts,
        correct: corr,
        correct_option: ['A', 'B', 'C', 'D'][corr] || 'A',
        explanation: item.explanation || item.solution || '',
        marks: Number(item.marks) || 1,
        question_image: qDiagImg,
        image_url: qDiagImg,
        diagram: qDiagImg,
        image: qDiagImg,
        figure: qDiagImg,
        _imgStore: item._imgStore,
        question_image_keys: item.question_image_keys
      };
    });

    const existingQuestions = Array.isArray(previewPaper.questions) ? previewPaper.questions : [];
    const combinedQuestions = [...existingQuestions, ...formatted];

    const updatedPaper = {
      ...previewPaper,
      questions: combinedQuestions,
      total_questions: combinedQuestions.length,
      total_marks: combinedQuestions.reduce((acc, q) => acc + (parseFloat(q.marks) || 1), 0)
    };

    // 1. Update preview state
    setPreviewPaper(updatedPaper);

    // 2. Update papers list state
    setPapers((prev) => prev.map((p) => (p.id === updatedPaper.id ? updatedPaper : p)));

    // 3. Persist in localStorage
    try {
      const localAdmin = JSON.parse(localStorage.getItem('admin_generator_papers') || '[]');
      const updatedAdmin = localAdmin.map((p) => (p.id === updatedPaper.id ? updatedPaper : p));
      localStorage.setItem('admin_generator_papers', JSON.stringify(updatedAdmin));

      const mockDb = JSON.parse(localStorage.getItem('mock_db_exam_papers') || '[]');
      const updatedMock = mockDb.map((p) => (p.id === updatedPaper.id ? updatedPaper : p));
      localStorage.setItem('mock_db_exam_papers', JSON.stringify(updatedMock));

      const olympExams = JSON.parse(localStorage.getItem('olympiadhub_db_exams') || '[]');
      const updatedOlymp = olympExams.map((p) => (p.id === updatedPaper.id ? updatedPaper : p));
      localStorage.setItem('olympiadhub_db_exams', JSON.stringify(updatedOlymp));

      // Also save questions to Question Bank
      const existingQs = JSON.parse(localStorage.getItem('olympiadhub_db_questions') || '[]');
      const newBankQs = formatted.map((fq) => ({
        id: fq.id,
        question_text: fq.q,
        option_a: fq.options[0],
        option_b: fq.options[1],
        option_c: fq.options[2],
        option_d: fq.options[3],
        correct_option: fq.correct_option,
        marks: fq.marks,
        explanation: fq.explanation,
        status: 'active',
        question_image: fq.question_image || fq.image_url || fq.diagram || '',
        image_url: fq.image_url || fq.question_image || fq.diagram || '',
        diagram: fq.diagram || fq.question_image || ''
      }));
      localStorage.setItem('olympiadhub_db_questions', JSON.stringify([...existingQs, ...newBankQs]));

      // 4. Update backend API & MySQL database
      apiClient.put(`/test-generator/admin-papers/${updatedPaper.id}`, updatedPaper).catch(() => null);
      apiClient.put(`/exam-papers/${updatedPaper.id}`, updatedPaper).catch(() => null);
    } catch (e) {
      console.warn('Storage sync error:', e);
    }

    // 5. Dispatch events & Trigger Central Sync
    window.dispatchEvent(new CustomEvent('olympiadhub-admin-papers-updated', { detail: updatedPaper }));
    window.dispatchEvent(new CustomEvent('olympiadhub-data-updated'));
    try {
      if (typeof syncManager !== 'undefined' && syncManager?.schedulePush) {
        syncManager.schedulePush();
      } else if (typeof window !== 'undefined' && window.syncManager?.schedulePush) {
        window.syncManager.schedulePush();
      }
    } catch (_) {}

    // Close modal
    setShowPaperImportModal(false);
  };

  // =========================================================================
  // PRINT & EXPORT UTILITIES (PDF, CSV, JSON)
  // =========================================================================
  const handlePrintPaper = (paper, includeAnswers = true) => {
    const subCode = paper.subject_code || paper.subject || 'IMO';
    const qList = Array.isArray(paper.questions) ? paper.questions : [];
    const totalMarks = qList.reduce((acc, q) => acc + (parseInt(q.marks) || 1), 0);

    const htmlContent = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8"/>
    <title>${paper.title} - SkillRise Olympiad</title>
    <style>
      @page { size: A4; margin: 15mm 15mm; }
      body { font-family: 'Segoe UI', Arial, sans-serif; color: #0f172a; line-height: 1.45; padding: 15px; margin: 0; }
      .header { border-bottom: 2.5px solid #80497D; padding-bottom: 12px; margin-bottom: 14px; display: flex; justify-content: space-between; align-items: flex-start; }
      .brand-title { font-size: 20px; font-weight: 900; color: #80497D; text-transform: uppercase; letter-spacing: 0.5px; }
      .paper-title { font-size: 15px; font-weight: 800; color: #1e293b; margin-top: 3px; }
      .meta-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; font-size: 11px; margin: 10px 0 14px; background: #faf5fa; padding: 8px 12px; border-radius: 6px; border: 1px solid #edd6ed; font-weight: 700; color: #4e2a4a; }
      .student-box { border: 1px dashed #94a3b8; border-radius: 6px; padding: 8px 12px; margin-bottom: 14px; display: grid; grid-template-columns: 2fr 1.2fr 1.5fr; gap: 10px; font-size: 11px; }
      .student-box div { border-bottom: 1px solid #cbd5e1; padding-bottom: 3px; }
      .instructions { font-size: 11px; color: #475569; margin-bottom: 16px; background: #fff9f2; padding: 8px 12px; border-left: 3.5px solid #C35B3F; border-radius: 0 4px 4px 0; }
      .question-card { margin-bottom: 14px; padding-bottom: 10px; border-bottom: 1px solid #f1f5f9; page-break-inside: avoid; }
      .q-title { font-size: 12.5px; font-weight: 700; margin-bottom: 6px; display: flex; justify-content: space-between; gap: 8px; }
      .options-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; font-size: 11.5px; margin-left: 12px; }
      .opt-item { display: flex; align-items: center; gap: 6px; padding: 3px 6px; }
      .opt-circle { width: 13px; height: 13px; border: 1.5px solid #64748b; border-radius: 50%; display: inline-block; }
      .ans-key-section { page-break-before: always; margin-top: 30px; border-top: 3px double #80497D; padding-top: 15px; }
      .ans-table { width: 100%; border-collapse: collapse; font-size: 11px; margin-top: 10px; }
      .ans-table th, .ans-table td { border: 1px solid #cbd5e1; padding: 6px 8px; text-align: left; }
      .ans-table th { background: #faf5fa; color: #4e2a4a; font-weight: 800; }
      @media print { body { padding: 0; } .no-print { display: none; } }
    </style>
  </head>
  <body>
    <div class="header">
      <div>
        <div class="brand-title">SkillRise Olympiad &bull; Official Examination Paper</div>
        <div class="paper-title">${cleanPaperTitle(paper.title)}</div>
      </div>
      <div style="text-align:right;font-size:11px;color:#64748b;">
        <div><strong>Code:</strong> ${paper.exam_code || `PPR-${paper.id}`}</div>
      </div>
    </div>
    <div class="meta-grid">
      <div><strong>Class:</strong> ${paper.class_name || paper.class || 'All'}</div>
      <div><strong>Subject:</strong> ${subCode}</div>
      <div><strong>Time Allowed:</strong> ${paper.duration_minutes || 60} Mins</div>
      <div><strong>Maximum Marks:</strong> ${totalMarks} Marks</div>
    </div>
    <div class="student-box">
      <div>Candidate Name: __________________________</div>
      <div>Roll Number: ____________</div>
      <div>School: ____________________</div>
    </div>
    <div class="instructions">
      <strong>Instructions for Candidates:</strong>
      1. This question paper contains ${qList.length} multiple choice questions.
      2. Each question has four choices (A, B, C, D) with one correct answer.
      3. Darken/tick the appropriate bubble corresponding to your chosen answer.
    </div>
    <div class="questions-container">
      ${qList.map((q, idx) => `
        <div class="question-card">
          <div class="q-title">
            <span><strong>Q${idx + 1}.</strong> ${q.q}</span>
            <span style="font-size:10.5px;color:#64748b;white-space:nowrap;">[${q.marks || 1} Mark]</span>
          </div>
          ${(() => {
            const qImg = getQuestionImage(q) || q.question_image || q.image_url || q.diagram || q.image || '';
            return qImg ? `
              <div style="margin: 10px 0; text-align: center;">
                <img src="${qImg}" style="max-height: 220px; max-width: 90%; object-fit: contain; border: 1.5px solid #cbd5e1; border-radius: 8px; background: #ffffff; padding: 4px;" alt="Question Diagram" />
              </div>
            ` : '';
          })()}
          <div class="options-grid">
            ${(q.options || []).map((opt, oIdx) => `
              <div class="opt-item">
                <span class="opt-circle"></span>
                <span><strong>(${String.fromCharCode(65 + oIdx)})</strong> ${opt}</span>
              </div>
            `).join('')}
          </div>
        </div>
      `).join('')}
    </div>
    ${includeAnswers ? `
      <div class="ans-key-section">
        <h2 style="font-size:15px;font-weight:800;color:#4e2a4a;margin-bottom:4px;">Official Master Answer Key &amp; Detailed Explanations</h2>
        <p style="font-size:11px;color:#64748b;margin-bottom:10px;">Reference Key for ${paper.title} (Paper Code: ${paper.exam_code || `PPR-${paper.id}`})</p>
        <table class="ans-table">
          <thead><tr>
            <th style="width:35px;text-align:center;">#</th>
            <th style="width:70px;text-align:center;">Correct</th>
            <th style="width:200px;">Correct Answer Option</th>
            <th>Detailed Step-by-Step Explanation</th>
            <th style="width:45px;text-align:center;">Marks</th>
          </tr></thead>
          <tbody>
            ${qList.map((q, idx) => {
              const correctIdx = typeof q.correct === 'number' ? q.correct : 0;
              const correctLetter = String.fromCharCode(65 + correctIdx);
              const correctText = (q.options && q.options[correctIdx]) ? q.options[correctIdx] : '';
              return `<tr>
                <td style="text-align:center;font-weight:bold;">Q${idx + 1}</td>
                <td style="text-align:center;font-weight:900;color:#059669;font-size:12px;">(${correctLetter})</td>
                <td style="font-weight:600;">${correctText}</td>
                <td style="color:#334155;font-size:10.5px;">${q.explanation || 'Standard conceptual solution.'}</td>
                <td style="text-align:center;font-weight:bold;">${q.marks || 1}</td>
              </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>
    ` : ''}
    <script>window.onload = function(){ window.print(); };<\/script>
  </body>
</html>`;

    // Download as .html file (opens clean in browser, Ctrl+P → Save as PDF)
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const safeName = (paper.title || 'Exam_Paper').replace(/[^a-zA-Z0-9_-]/g, '_');
    link.download = `${safeName}_${includeAnswers ? 'WithAnswerKey' : 'StudentCopy'}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadPaperJson = (paper) => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(paper, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    const filename = `${(paper.title || 'Exam_Paper').replace(/[^a-zA-Z0-9_-]/g, '_')}_with_Answers.json`;
    downloadAnchor.setAttribute("download", filename);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleDownloadPaperCsv = (paper) => {
    const qList = Array.isArray(paper.questions) ? paper.questions : [];
    const rows = [
      ["Question Number", "Question Statement", "Option A", "Option B", "Option C", "Option D", "Correct Option", "Correct Answer Text", "Explanation", "Marks"]
    ];

    qList.forEach((q, idx) => {
      const correctIdx = typeof q.correct === 'number' ? q.correct : 0;
      const correctLetter = String.fromCharCode(65 + correctIdx);
      const correctText = q.options?.[correctIdx] || '';
      rows.push([
        `Q${idx + 1}`,
        `"${(q.q || '').replace(/"/g, '""')}"`,
        `"${(q.options?.[0] || '').replace(/"/g, '""')}"`,
        `"${(q.options?.[1] || '').replace(/"/g, '""')}"`,
        `"${(q.options?.[2] || '').replace(/"/g, '""')}"`,
        `"${(q.options?.[3] || '').replace(/"/g, '""')}"`,
        correctLetter,
        `"${correctText.replace(/"/g, '""')}"`,
        `"${(q.explanation || '').replace(/"/g, '""')}"`,
        q.marks || 1
      ]);
    });

    const csvContent = "data:text/csv;charset=utf-8," + rows.map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${(paper.title || 'Exam_Paper').replace(/[^a-zA-Z0-9_-]/g, '_')}_Questions_and_Answers.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const handleExportAllFilteredPapers = () => {
    if (filteredPapers.length === 0) {
      alert('No papers available to export in current filter.');
      return;
    }
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(filteredPapers, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    const filename = `OlympiadHub_All_Papers_Export_${new Date().toISOString().slice(0, 10)}.json`;
    downloadAnchor.setAttribute("download", filename);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Filtered papers list
  const filteredPapers = papers.filter((p) => {
    const pClass = p.class_name || p.class || '';
    const pSubCode = p.subject_code || p.subject || '';
    const pCategory = p.paper_category || (p.title?.toLowerCase().includes('sample') ? 'practice_test' : p.title?.toLowerCase().includes('previous') || p.title?.toLowerCase().includes('past') ? 'practice_test' : (p.exam_type === 'generated' || p.paper_category === 'generator' ? 'generator' : 'practice_test'));
    const matchesCategory =
      activeCategoryTab === 'all' ||
      pCategory === activeCategoryTab ||
      (activeCategoryTab === 'practice_test' && pCategory !== 'generator') ||
      (activeCategoryTab === 'generator' && (pCategory === 'generator' || p.exam_type === 'generated'));

    const matchesClass = selectedClassFilter === 'All' || pClass.toLowerCase().includes(selectedClassFilter.toLowerCase());
    const matchesSubject = selectedSubjectFilter === 'All' || pSubCode.toLowerCase().includes(selectedSubjectFilter.toLowerCase());
    const matchesSearch =
      !searchQuery ||
      (p.title && p.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.exam_code && p.exam_code.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesClass && matchesSubject && matchesSearch;
  });

  // =========================================================================
  // FULL-SCREEN VIEW 1: CREATE / AUTHOR NEW EXAM PAPER
  // =========================================================================
  if (showCreateModal) {
    const totalMarks = questionsList.reduce((acc, q) => acc + (parseFloat(q.marks) || 1), 0);

    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 pb-20 animate-in fade-in duration-150 font-sans">
        {/* Top Bar */}
        <div className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-2xs">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Papers</span>
              </button>
              <div className="h-5 w-px bg-slate-200 hidden sm:block" />
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-600 block">
                  Super Admin Exam &amp; Paper Creator
                </span>
                <h1 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                  {paperCategory === 'generator' ? 'Create Intelligent Test Generator Paper' : 'Create Practice Mock Test Paper'}
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => setShowUniversalImportModal(true)}
                className="px-3.5 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-xs font-black transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
                title="Import Questions directly from Word (.docx), PDF (.pdf), or CSV file"
              >
                <Upload className="w-4 h-4" />
                <span>Import (Word / PDF)</span>
              </button>

              <button
                type="button"
                onClick={() => handleExportCurrentPaperPdf(true)}
                className="px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
                title="Download / Save complete Question Paper with Answers & Solutions as PDF file"
              >
                <FileDown className="w-4 h-4" />
                <span>Export PDF (Q&amp;A Sheet)</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadCurrentPaperCsv}
                className="p-2 rounded-lg border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-bold cursor-pointer transition-colors"
                title="Download CSV / Excel Format"
              >
                <FileSpreadsheet className="w-4 h-4 text-sky-700" />
              </button>

              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 rounded-lg border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-bold cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSavePaper}
                disabled={isPublishingPaper}
                className={`px-5 py-2 font-black rounded-lg text-xs uppercase tracking-wider transition-all shadow-xs active:scale-98 flex items-center gap-1.5 ${
                  isPublishingPaper 
                    ? 'bg-emerald-400 text-white cursor-not-allowed opacity-80' 
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer'
                }`}
              >
                {isPublishingPaper ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Publishing...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Publish Paper</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Full Page Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
          <form onSubmit={handleSavePaper} className="space-y-6">
            
            {/* Exam Configuration & Academic Scope */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 space-y-5 shadow-2xs">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center font-black text-xs">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                </div>
                <div>
                  <h2 className="text-sm font-black text-slate-900">Practice Test Details &amp; Configuration</h2>
                  <p className="text-xs text-slate-500">Configure target class, Olympiad subject, exam year, duration, and title. Questions will appear in Student Test Generator.</p>
                </div>
              </div>

              {/* Title */}
              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-700">Exam Paper Title:</label>
                <input
                  type="text"
                  required
                  value={paperTitle}
                  onChange={(e) => setPaperTitle(e.target.value)}
                  placeholder="e.g. Class 6 IMO Previous Year Question Paper (2024)"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs sm:text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              {/* Row: Grade, Subject, Duration (Class & Subject only) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Class */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600">Class / Grade:</label>
                  <select
                    value={paperClass}
                    onChange={(e) => handleClassChangeInModal(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 cursor-pointer bg-white"
                  >
                    {GRADE_OPTIONS.map((cls) => (
                      <option key={cls} value={cls}>
                        {cls}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Subject */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600">Subject:</label>
                  <select
                    value={paperSubject}
                    onChange={(e) => handleSubjectChangeInModal(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 cursor-pointer bg-white"
                  >
                    {SUBJECT_OPTIONS.map((sub) => (
                      <option key={sub.id} value={sub.id}>
                        {sub.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Duration */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600">Duration (Minutes):</label>
                  <input
                    type="number"
                    min="5"
                    max="180"
                    value={paperDuration}
                    onChange={(e) => setPaperDuration(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Section 2.5: Subject Topics & Syllabus Chapters Dropdown */}
            <div className="bg-gradient-to-r from-purple-50/80 via-pink-50/50 to-amber-50/50 rounded-xl border-2 border-purple-200/80 p-4 sm:p-5 space-y-3.5 shadow-2xs">
              <div className="flex items-center justify-between flex-wrap gap-2.5">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#4e2a4a] text-white flex items-center justify-center font-black text-xs shadow-2xs shrink-0">
                    <BookOpen className="w-4 h-4 text-amber-300" />
                  </div>
                  <div>
                    <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                      <span>Curriculum Topics &amp; Chapters</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-900 border border-purple-300">
                        {selectedPaperChapters.length} of {getTopicsForSubject(paperSubject).length} Selected
                      </span>
                    </h3>
                    <p className="text-[11px] text-slate-500 font-medium">
                      Exact topics synchronized with Student Panel for {SUBJECT_OPTIONS.find(s => s.id === paperSubject)?.name || paperSubject}.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedPaperChapters(getTopicsForSubject(paperSubject))}
                    className="px-2.5 py-1 rounded-lg bg-white hover:bg-purple-100 text-purple-900 font-black text-[11px] border border-purple-200 shadow-2xs cursor-pointer transition-all"
                  >
                    ✓ Select All ({getTopicsForSubject(paperSubject).length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedPaperChapters([])}
                    className="px-2.5 py-1 rounded-lg bg-white hover:bg-rose-50 text-slate-500 hover:text-rose-700 font-bold text-[11px] border border-slate-200 cursor-pointer transition-all"
                  >
                    ✕ Clear
                  </button>
                </div>
              </div>

              {/* Topics Multi-Select Dropdown Container */}
              <div className="relative" ref={topicsDropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsTopicsDropdownOpen(!isTopicsDropdownOpen)}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 bg-white rounded-xl border border-purple-200 hover:border-purple-400 text-left shadow-2xs transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-400/30"
                >
                  <div className="flex items-center gap-2.5 min-w-0 pr-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-purple-600 shrink-0" />
                    <span className="text-xs sm:text-sm font-bold text-slate-800 truncate">
                      {selectedPaperChapters.length === 0
                        ? 'No topics selected (Click to choose curriculum chapters)'
                        : selectedPaperChapters.length === getTopicsForSubject(paperSubject).length
                        ? `All ${getTopicsForSubject(paperSubject).length} Topics Selected (Complete Syllabus)`
                        : `${selectedPaperChapters.length} of ${getTopicsForSubject(paperSubject).length} Topics Selected: ${selectedPaperChapters.join(', ')}`}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] sm:text-[11px] font-black text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200">
                      {isTopicsDropdownOpen ? 'Close Menu' : 'Select Topics'}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-purple-700 transition-transform duration-200 ${
                        isTopicsDropdownOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </div>
                </button>

                {/* Dropdown Menu */}
                {isTopicsDropdownOpen && (
                  <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-xl border border-purple-200 shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                    {/* Search and Quick Actions Bar */}
                    <div className="p-3 bg-purple-50/60 border-b border-purple-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
                      <div className="relative flex-1">
                        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={topicsSearchQuery}
                          onChange={(e) => setTopicsSearchQuery(e.target.value)}
                          placeholder="Search topics / chapters..."
                          className="w-full pl-8 pr-7 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-400/40"
                        />
                        {topicsSearchQuery && (
                          <button
                            type="button"
                            onClick={() => setTopicsSearchQuery('')}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        )}
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => setSelectedPaperChapters(getTopicsForSubject(paperSubject))}
                          className="flex-1 sm:flex-none px-2.5 py-1 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-black text-[11px] shadow-2xs cursor-pointer transition-all text-center"
                        >
                          ✓ Select All ({getTopicsForSubject(paperSubject).length})
                        </button>
                        <button
                          type="button"
                          onClick={() => setSelectedPaperChapters([])}
                          className="flex-1 sm:flex-none px-2.5 py-1 rounded-lg bg-white hover:bg-rose-50 text-slate-600 hover:text-rose-700 font-bold text-[11px] border border-slate-200 cursor-pointer transition-all text-center"
                        >
                          ✕ Clear
                        </button>
                      </div>
                    </div>

                    {/* Topics Checklist */}
                    <div className="max-h-64 overflow-y-auto divide-y divide-slate-100 p-2">
                      {getTopicsForSubject(paperSubject)
                        .filter((topic) => topic.toLowerCase().includes(topicsSearchQuery.toLowerCase()))
                        .map((topic) => {
                          const isSelected = selectedPaperChapters.includes(topic);
                          return (
                            <div
                              key={topic}
                              onClick={() => {
                                if (isSelected) {
                                  setSelectedPaperChapters(selectedPaperChapters.filter((t) => t !== topic));
                                } else {
                                  setSelectedPaperChapters([...selectedPaperChapters, topic]);
                                }
                              }}
                              className={`flex items-center justify-between p-2.5 rounded-lg cursor-pointer transition-colors ${
                                isSelected ? 'bg-purple-50/70 hover:bg-purple-100/60' : 'hover:bg-slate-50'
                              }`}
                            >
                              <div className="flex items-center gap-3 min-w-0 pr-2">
                                <div
                                  className={`w-4 h-4 rounded flex items-center justify-center transition-colors shrink-0 ${
                                    isSelected
                                      ? 'bg-purple-600 text-white'
                                      : 'border-2 border-slate-300 bg-white'
                                  }`}
                                >
                                  {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                                </div>
                                <span
                                  className={`text-xs sm:text-sm font-bold ${
                                    isSelected ? 'text-purple-950 font-black' : 'text-slate-700'
                                  }`}
                                >
                                  {topic}
                                </span>
                              </div>
                              {isSelected && (
                                <span className="text-[10px] font-black text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full shrink-0">
                                  Selected
                                </span>
                              )}
                            </div>
                          );
                        })}

                      {getTopicsForSubject(paperSubject).filter((topic) =>
                        topic.toLowerCase().includes(topicsSearchQuery.toLowerCase())
                      ).length === 0 && (
                        <div className="p-4 text-center text-xs font-bold text-slate-400">
                          No topics found matching "{topicsSearchQuery}"
                        </div>
                      )}
                    </div>

                    {/* Footer bar */}
                    <div className="p-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-500">
                        {selectedPaperChapters.length} of {getTopicsForSubject(paperSubject).length} topics selected
                      </span>
                      <button
                        type="button"
                        onClick={() => setIsTopicsDropdownOpen(false)}
                        className="px-3.5 py-1 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer shadow-2xs"
                      >
                        Done
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Selected Topics Compact Preview */}
              {selectedPaperChapters.length === getTopicsForSubject(paperSubject).length ? (
                <div className="flex items-center gap-2 text-xs font-bold text-purple-800 bg-purple-100/60 border border-purple-200/80 px-3 py-2 rounded-lg">
                  <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
                  <span>All {getTopicsForSubject(paperSubject).length} curriculum topics are selected and active for this question paper.</span>
                </div>
              ) : selectedPaperChapters.length > 0 ? (
                <div className="space-y-1.5 pt-0.5">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-600">
                    <span>Active Selected Topics ({selectedPaperChapters.length}):</span>
                    <span className="text-slate-400 font-normal">Click '×' on any chip to remove</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto pr-1">
                    {selectedPaperChapters.map((topic) => (
                      <span
                        key={topic}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-purple-300 text-purple-950 font-bold text-xs shadow-2xs"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-600" />
                        <span>{topic}</span>
                        <button
                          type="button"
                          onClick={() => setSelectedPaperChapters(selectedPaperChapters.filter((t) => t !== topic))}
                          className="p-0.5 rounded-full hover:bg-purple-100 text-purple-600 hover:text-rose-600 cursor-pointer transition-colors"
                          title={`Remove ${topic}`}
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 px-3 py-2 rounded-lg">
                  <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                  <span>No topics selected. Please open the dropdown above and select at least one topic.</span>
                </div>
              )}
            </div>

            {/* Section 3: Question Builder with Bulk Tool */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 space-y-6 shadow-2xs">
              <div className="flex items-center justify-between flex-wrap gap-4 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-black text-xs">
                    3
                  </div>
                  <div>
                    <h2 className="text-sm font-black text-slate-900 flex items-center gap-2">
                      <span>Exam Questions &amp; Answer Key</span>
                      <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[11px] font-bold border border-slate-200">
                        {questionsList.length} Questions
                      </span>
                    </h2>
                    <p className="text-xs text-slate-500">
                      Add MCQs manually or click "Bulk Import Q&amp;A" to paste all questions with options and answers at once.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => setShowUniversalImportModal(true)}
                    className="px-3 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-lg text-xs transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
                    title="Import Questions directly from Word (.docx), PDF (.pdf), or CSV file"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Import Word / PDF</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleAddQuestion}
                    className="px-3.5 py-2 bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold rounded-lg text-xs transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
                  >
                    <Plus className="w-4 h-4" />
                    <span>+ Add Question</span>
                  </button>
                </div>
              </div>

              {/* Question items */}
              {questionsList.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-300 space-y-3">
                  <p className="text-xs font-bold text-slate-500">No questions added yet.</p>
                  <div className="flex items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={handleAddQuestion}
                      className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-bold cursor-pointer"
                    >
                      + Add Question Manually
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowUniversalImportModal(true)}
                      className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-bold cursor-pointer flex items-center gap-1.5 shadow-2xs"
                    >
                      <Upload className="w-4 h-4" />
                      <span>Import Word / PDF File</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleOpenBulkModal}
                      className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-xs font-bold cursor-pointer"
                    >
                      ⚡ Bulk Text Paste
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {questionsList.map((qItem, qIdx) => (
                    <div
                      key={qIdx}
                      className="bg-slate-50/70 rounded-xl border border-slate-200 p-4 sm:p-5 space-y-4"
                    >
                      {/* Question Top Row */}
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2 flex-1">
                          <span className="w-6 h-6 rounded-lg bg-slate-800 text-white font-black text-xs flex items-center justify-center shrink-0">
                            {qIdx + 1}
                          </span>
                          <input
                            type="text"
                            placeholder={`Enter Question #${qIdx + 1} statement...`}
                            value={qItem.q}
                            onChange={(e) => handleUpdateQuestion(qIdx, 'q', e.target.value)}
                            className="w-full px-3 py-2 bg-white rounded-lg border border-slate-300 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveQuestion(qIdx)}
                          className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg cursor-pointer transition-colors shrink-0"
                          title="Delete Question"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Question Chapter / Topic Selector */}
                      <div className="pl-8 flex flex-col sm:flex-row sm:items-center gap-2">
                        <div className="flex items-center gap-1.5 shrink-0">
                          <Tag className="w-3.5 h-3.5 text-purple-600" />
                          <span className="text-[11px] font-black text-slate-700">Topic / Chapter:</span>
                        </div>
                        <div className="flex-1 flex items-center gap-2 flex-wrap">
                          <select
                            value={qItem.chapter || ''}
                            onChange={(e) => handleUpdateQuestion(qIdx, 'chapter', e.target.value)}
                            className="px-3 py-1.5 bg-white rounded-lg border border-slate-300 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-400 max-w-xs cursor-pointer"
                          >
                            <option value="">-- Choose Topic --</option>
                            {getTopicsForSubject(paperSubject).map((t) => (
                              <option key={t} value={t}>{t}</option>
                            ))}
                          </select>
                          <div className="flex items-center gap-1 overflow-x-auto py-0.5 max-w-full">
                            {getTopicsForSubject(paperSubject).slice(0, 3).map((t) => (
                              <button
                                key={t}
                                type="button"
                                onClick={() => handleUpdateQuestion(qIdx, 'chapter', t)}
                                className={`text-[10px] px-2 py-0.5 rounded-full border transition-all cursor-pointer whitespace-nowrap ${
                                  qItem.chapter === t
                                    ? 'bg-purple-100 text-purple-900 border-purple-400 font-bold'
                                    : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-100'
                                }`}
                              >
                                {t}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Question Diagram / Image */}
                      {getQuestionImage(qItem) ? (
                        <div className="pl-8 pt-1">
                          <QuestionDiagram
                            question={qItem}
                            title={`Question ${qIdx + 1} Diagram / Figure`}
                            maxHeight="max-h-72 sm:max-h-96"
                            editable={true}
                            onChange={(file) => {
                              const reader = new FileReader();
                              reader.onload = () => {
                                const dataUrl = reader.result;
                                handleUpdateQuestion(qIdx, 'question_image', dataUrl);
                                handleUpdateQuestion(qIdx, 'image_url', dataUrl);
                                handleUpdateQuestion(qIdx, 'diagram', dataUrl);
                                handleUpdateQuestion(qIdx, 'image', dataUrl);
                                handleUpdateQuestion(qIdx, 'figure', dataUrl);
                                if (qItem.id) saveImageToStore(String(qItem.id), dataUrl);
                                if (qItem.q) saveImageToStore(qItem.q, dataUrl);
                              };
                              reader.readAsDataURL(file);
                            }}
                            onRemove={() => {
                              handleUpdateQuestion(qIdx, 'question_image', '');
                              handleUpdateQuestion(qIdx, 'image_url', '');
                              handleUpdateQuestion(qIdx, 'diagram', '');
                              handleUpdateQuestion(qIdx, 'image', '');
                              handleUpdateQuestion(qIdx, 'figure', '');
                            }}
                          />
                        </div>
                      ) : (
                        <div className="pl-8 pt-1 flex items-center gap-2 flex-wrap">
                          <label className="cursor-pointer text-[11px] font-bold text-indigo-700 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all">
                            <span>📸 Upload Diagram Image</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const reader = new FileReader();
                                  reader.onload = () => {
                                    const dataUrl = reader.result;
                                    handleUpdateQuestion(qIdx, 'question_image', dataUrl);
                                    handleUpdateQuestion(qIdx, 'image_url', dataUrl);
                                    handleUpdateQuestion(qIdx, 'diagram', dataUrl);
                                    handleUpdateQuestion(qIdx, 'image', dataUrl);
                                    handleUpdateQuestion(qIdx, 'figure', dataUrl);
                                    if (qItem.id) saveImageToStore(String(qItem.id), dataUrl);
                                    if (qItem.q) saveImageToStore(qItem.q, dataUrl);
                                  };
                                  reader.readAsDataURL(file);
                                }
                              }}
                            />
                          </label>
                          <input
                            type="text"
                            placeholder="or paste Diagram Image URL / Data URL..."
                            className="text-xs px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-700 placeholder-slate-400 w-64 focus:outline-none focus:ring-1 focus:ring-indigo-400"
                            onBlur={(e) => {
                              const val = e.target.value.trim();
                              if (val) {
                                handleUpdateQuestion(qIdx, 'question_image', val);
                                handleUpdateQuestion(qIdx, 'image_url', val);
                                handleUpdateQuestion(qIdx, 'diagram', val);
                                handleUpdateQuestion(qIdx, 'image', val);
                                handleUpdateQuestion(qIdx, 'figure', val);
                                if (qItem.id) saveImageToStore(String(qItem.id), val);
                                if (qItem.q) saveImageToStore(qItem.q, val);
                              }
                            }}
                          />
                        </div>
                      )}

                      {/* 4 Options Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-8">
                        {['A', 'B', 'C', 'D'].map((letter, optIdx) => (
                          <div
                            key={letter}
                            className={`flex items-center gap-2.5 p-2 rounded-lg border transition-all ${
                              qItem.correct === optIdx
                                ? 'bg-emerald-50/60 border-emerald-400 ring-1 ring-emerald-400'
                                : 'bg-white border-slate-200'
                            }`}
                          >
                            <input
                              type="radio"
                              name={`correct_${qIdx}`}
                              checked={qItem.correct === optIdx}
                              onChange={() => handleUpdateQuestion(qIdx, 'correct', optIdx)}
                              title="Mark as correct answer"
                              className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 cursor-pointer ml-1"
                            />
                            <span className="text-xs font-black text-slate-700 w-5">{letter}:</span>
                            {typeof qItem.options?.[optIdx] === 'string' && (qItem.options[optIdx].startsWith('data:image') || qItem.options[optIdx].includes('__IMG__')) ? (
                              <div className="flex-1 flex items-center gap-2">
                                <img
                                  src={qItem.options[optIdx]}
                                  alt={`Option ${letter}`}
                                  className="max-h-12 max-w-full object-contain rounded-md border border-slate-200 bg-white"
                                />
                              </div>
                            ) : (
                              <input
                                type="text"
                                placeholder={`Option ${letter}`}
                                value={qItem.options?.[optIdx] || ''}
                                onChange={(e) => handleUpdateOption(qIdx, optIdx, e.target.value)}
                                className="w-full px-2 py-1 bg-transparent border-none text-xs font-medium text-slate-800 focus:outline-none"
                              />
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Explanation & Marks */}
                      <div className="pl-8 grid grid-cols-1 sm:grid-cols-12 gap-3">
                        <div className="sm:col-span-10">
                          <label className="text-[10px] font-bold text-slate-500 block mb-1">
                            Explanation / Detailed Solution:
                          </label>
                          <input
                            type="text"
                            placeholder="Detailed step-by-step reasoning or solution..."
                            value={qItem.explanation || ''}
                            onChange={(e) => handleUpdateQuestion(qIdx, 'explanation', e.target.value)}
                            className="w-full px-3 py-1.5 bg-white rounded-lg border border-slate-300 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-sky-500"
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="text-[10px] font-bold text-slate-500 block mb-1">
                            Marks:
                          </label>
                          <input
                            type="number"
                            min="1"
                            max="10"
                            placeholder="Marks"
                            value={qItem.marks || 1}
                            onChange={(e) => handleUpdateQuestion(qIdx, 'marks', e.target.value)}
                            className="w-full px-2 py-1.5 bg-white rounded-lg border border-slate-300 text-xs text-center font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-sky-500"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Bottom Actions Bar */}
            <div className="bg-white border border-slate-200 p-4 sm:p-5 rounded-xl flex items-center justify-between flex-wrap gap-4 shadow-2xs">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-600">
                  Total Questions: <strong className="text-slate-900">{questionsList.length}</strong>
                </span>
                <span className="text-slate-300">&bull;</span>
                <span className="text-xs font-bold text-slate-600">
                  Total Marks: <strong className="text-emerald-600">{totalMarks}</strong>
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => handleExportCurrentPaperPdf(true)}
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
                  title="Export complete Paper with Answers and Solutions as PDF"
                >
                  <FileDown className="w-4 h-4" />
                  <span>Export PDF (Q&amp;A)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-5 py-2 rounded-lg border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-100 cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPublishingPaper}
                  className={`px-6 py-2.5 font-black rounded-lg text-xs uppercase tracking-wider transition-all shadow-xs active:scale-98 flex items-center gap-2 ${
                    isPublishingPaper 
                      ? 'bg-emerald-400 text-white cursor-not-allowed opacity-80' 
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer'
                  }`}
                >
                  {isPublishingPaper ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Publishing Exam...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Publish Exam Paper</span>
                    </>
                  )}
                </button>
              </div>
            </div>

          </form>
        </div>

        {/* BULK IMPORT QUESTIONS MODAL */}
        {showBulkModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
              <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-amber-50/50">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-xs">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-900">Bulk Import Questions &amp; Answers</h3>
                    <p className="text-[11px] text-slate-500">Paste multiple MCQs with options, correct answers, and explanations.</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowBulkModal(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-4 overflow-y-auto flex-1">
                <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
                  <span className="font-bold text-slate-700">Paste Text, JSON, CSV or Questions:</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleLoadSampleBulk}
                      className="px-2.5 py-1 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-xs flex items-center gap-1 cursor-pointer transition-all"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                      <span>📋 Load Sample Format</span>
                    </button>
                    <label className="px-2.5 py-1 rounded-lg bg-sky-100 hover:bg-sky-200 text-sky-900 font-bold text-xs flex items-center gap-1 cursor-pointer transition-all">
                      <Upload className="w-3.5 h-3.5 text-sky-700" />
                      <span>📁 Import (Word/PDF/CSV)</span>
                      <input
                        type="file"
                        accept=".docx,.doc,.pdf,.txt,.csv,.json"
                        onChange={handleBulkFileUpload}
                        className="hidden"
                      />
                    </label>
                    {bulkInputText && (
                      <button
                        type="button"
                        onClick={() => handleBulkTextChange('')}
                        className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-rose-100 text-slate-600 hover:text-rose-700 font-bold text-xs cursor-pointer"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 text-[10px] font-bold text-slate-600 bg-amber-50/70 p-2.5 rounded-xl border border-amber-200">
                  <span className="text-amber-900 font-black mr-1">Auto-Detects:</span>
                  <span className="bg-white px-2 py-0.5 rounded border border-amber-200">✓ Q1..Qn with Options</span>
                  <span className="bg-white px-2 py-0.5 rounded border border-amber-200">✓ Plain Questions (without options)</span>
                  <span className="bg-white px-2 py-0.5 rounded border border-amber-200">✓ JSON Array</span>
                  <span className="bg-white px-2 py-0.5 rounded border border-amber-200">✓ CSV</span>
                </div>

                {/* Optional Topic Tagging for this batch */}
                <div className="p-3 rounded-xl bg-purple-50/60 border border-purple-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-purple-900">
                      🎯 Assign All Imported Questions to Topic:
                    </span>
                    {bulkTargetTopic && (
                      <button
                        type="button"
                        onClick={() => setBulkTargetTopic('')}
                        className="text-[10px] text-purple-700 hover:underline font-bold"
                      >
                        Clear Topic
                      </button>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {getTopicsForSubject(paperSubject).map((topic) => (
                      <button
                        key={topic}
                        type="button"
                        onClick={() => setBulkTargetTopic(bulkTargetTopic === topic ? '' : topic)}
                        className={`text-[11px] px-2.5 py-1 rounded-lg border font-bold transition-all cursor-pointer ${
                          bulkTargetTopic === topic
                            ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-purple-300'
                        }`}
                      >
                        {topic}
                      </button>
                    ))}
                  </div>
                </div>

                <textarea
                  rows="12"
                  value={bulkInputText}
                  onChange={(e) => handleBulkTextChange(e.target.value)}
                  placeholder="Paste your questions here...&#10;&#10;Example Format:&#10;Q1. What is 15 + 17?&#10;A) 30&#10;B) 32&#10;C) 34&#10;D) 36&#10;Correct: B&#10;Explanation: 15 + 17 = 32.&#10;&#10;Tip: Plain questions without options are also supported and will generate editable options!"
                  className="w-full p-3.5 rounded-xl border border-slate-300 font-mono text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none bg-slate-50"
                />

                <div className="p-3 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 font-bold text-slate-800">
                    <CheckCircle className={`w-4 h-4 ${bulkParsedCount > 0 ? 'text-emerald-600' : 'text-slate-400'}`} />
                    <span>Status: {bulkParsedCount > 0 ? `✓ ${bulkParsedCount} Questions Detected Ready to Import` : 'Enter or paste questions above'}</span>
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setShowBulkModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200 cursor-pointer"
                >
                  Cancel
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleApplyBulkImport('append')}
                    disabled={bulkParsedCount === 0}
                    className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 disabled:opacity-40 text-white font-bold text-xs cursor-pointer shadow-xs"
                  >
                    + Append ({bulkParsedCount})
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyBulkImport('replace')}
                    disabled={bulkParsedCount === 0}
                    className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:opacity-40 text-white font-black text-xs cursor-pointer shadow-xs"
                  >
                    Replace All ({bulkParsedCount})
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Universal Word / PDF / CSV Import Modal */}
        <UniversalQuestionImportModal
          isOpen={showUniversalImportModal}
          onClose={() => setShowUniversalImportModal(false)}
          title="Import Questions (Word / PDF / CSV)"
          subtitle="Upload your Word (.docx), PDF (.pdf), or CSV file. Questions, options, and answers will be automatically extracted."
          targetClassId={paperClass}
          targetSubjectId={paperSubject}
          onQuestionsImported={handleUniversalQuestionsImported}
        />
      </div>
    );
  }

  // =========================================================================
  // FULL-SCREEN VIEW 2: VIEW QUESTIONS & EXPORT PAPER
  // =========================================================================
  if (previewPaper) {
    const qCount = Array.isArray(previewPaper.questions) ? previewPaper.questions.length : 0;
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 pb-20 animate-in fade-in duration-150 font-sans">
        <div className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-2xs">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setPreviewPaper(null)}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Papers</span>
              </button>
              <div className="h-5 w-px bg-slate-200 hidden sm:block" />
              <div>
                <span className="text-[10px] font-black uppercase text-amber-600">
                  {previewPaper.class_name || previewPaper.class} &bull; {previewPaper.subject_code || 'IMO'}
                </span>
                <h1 className="text-base sm:text-lg font-black text-slate-900">{cleanPaperTitle(previewPaper.title)}</h1>
              </div>
            </div>

            {/* Quick Export & Actions Toolbar */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Publish / Status Controls */}
              {previewPaper.status === 'published' ? (
                <div className="flex items-center gap-1.5">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-black text-xs shadow-xs">
                    <CheckCircle2 className="w-4 h-4 text-white" />
                    <span>✓ Live for Students</span>
                  </span>
                  <button
                    type="button"
                    onClick={handleTogglePublishPreviewPaper}
                    className="px-2.5 py-1.5 rounded-lg text-[11px] font-bold text-slate-500 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 transition-colors cursor-pointer"
                    title="Move paper back to Draft"
                  >
                    Unpublish
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleTogglePublishPreviewPaper}
                  className="px-4 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 shadow-sm active:scale-95 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-amber-200 animate-pulse"
                  title="Publish paper directly to Student portal"
                >
                  <Send className="w-4 h-4 text-white" />
                  <span>🚀 Publish Paper (Make Live)</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => setShowPaperImportModal(true)}
                className="px-3.5 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-lg text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 shadow-xs active:scale-95"
                title="Import questions from Word (.docx), PDF (.pdf), CSV, or paste text into this paper"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Import (Word / PDF)</span>
              </button>

              <button
                type="button"
                onClick={() => handlePrintPaper(previewPaper, false)}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
                title="Print candidate question paper only"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Paper</span>
              </button>

              <button
                type="button"
                onClick={() => handlePrintPaper(previewPaper, true)}
                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-black transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
                title="Print / Save PDF with Questions and Complete Solutions"
              >
                <FileDown className="w-3.5 h-3.5" />
                <span>PDF + Solutions</span>
              </button>

              <button
                type="button"
                onClick={() => handleDownloadPaperCsv(previewPaper)}
                className="px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
                title="Download CSV for Excel"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>CSV</span>
              </button>

              <button
                type="button"
                onClick={() => handleDownloadPaperJson(previewPaper)}
                className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
                title="Download JSON Data"
              >
                <Download className="w-3.5 h-3.5" />
                <span>JSON</span>
              </button>

              <button
                type="button"
                onClick={() => setPreviewPaper(null)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold cursor-pointer transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs flex items-center justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-sm sm:text-base font-black text-slate-900">{previewPaper.title}</h2>
              <p className="text-xs text-slate-500 font-mono mt-0.5">Code: {previewPaper.exam_code || `PYP-${previewPaper.id}`}</p>
            </div>
            <div className="flex items-center gap-2.5 text-xs font-bold text-slate-600 flex-wrap">
              <span className="px-3 py-1 bg-slate-100 rounded-lg">{previewPaper.class_name || previewPaper.class}</span>
              <span className="px-3 py-1 bg-amber-50 text-amber-800 rounded-lg">{previewPaper.subject_code || 'IMO'}</span>
              <span className="px-3 py-1 bg-sky-50 text-sky-700 rounded-lg">{previewPaper.duration_minutes || 60} Mins</span>
              <span className="px-3 py-1 bg-emerald-50 text-emerald-800 rounded-lg">{qCount} Questions</span>
              
              {/* Publish Toggle Button */}
              <button
                type="button"
                onClick={handleTogglePublishPreviewPaper}
                className={`px-3 py-1 rounded-lg text-xs font-black cursor-pointer flex items-center gap-1.5 transition-all shadow-2xs ${
                  previewPaper.status === 'published'
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 hover:bg-emerald-200'
                    : 'bg-amber-100 text-amber-900 border border-amber-300 hover:bg-amber-200'
                }`}
                title="Click to toggle publish status"
              >
                {previewPaper.status === 'published' ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Published to Students</span>
                  </>
                ) : (
                  <>
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    <span>Draft (Click to Publish)</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setShowPaperImportModal(true)}
                className="px-3 py-1 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 rounded-lg text-xs font-black transition-colors cursor-pointer flex items-center gap-1.5"
                title="Import Word / PDF questions into this paper"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>+ Import Word / PDF</span>
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {Array.isArray(previewPaper.questions) && previewPaper.questions.length > 0 ? (
              previewPaper.questions.map((q, idx) => (
                <div key={idx} className="p-5 rounded-xl bg-white border border-slate-200 space-y-3 shadow-2xs group relative">
                  <div className="flex items-start justify-between gap-3 text-sm font-bold text-slate-900">
                    <div className="flex items-start gap-3 flex-1">
                      <span className="w-6 h-6 rounded-lg bg-slate-800 text-white flex items-center justify-center font-black text-xs shrink-0">
                        {idx + 1}
                      </span>
                      <span className="flex-1">{getCleanQuestionText(q.q || q.question_text || '') || q.q}</span>
                    </div>
                    <div className="flex items-center gap-2.5 shrink-0">
                      <span className="text-[11px] font-bold text-slate-400">[{q.marks || 1} Mark]</span>
                      {/* Delete Question Button */}
                      <button
                        type="button"
                        onClick={() => handleDeleteQuestionFromPreview(idx)}
                        className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 hover:text-rose-700 border border-rose-200 text-xs font-black transition-all cursor-pointer flex items-center gap-1 shadow-2xs active:scale-95"
                        title={`Delete Question #${idx + 1}`}
                      >
                        <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>

                  {/* Question Diagram Section */}
                  <div className="pl-9 my-2">
                    {getQuestionImage(q) ? (
                      <QuestionDiagram
                        question={q}
                        title={`Question ${idx + 1} Diagram / Figure`}
                        maxHeight="max-h-80 sm:max-h-96"
                        editable={true}
                        onChange={(file) => handleUploadQuestionDiagram(idx, file)}
                        onRemove={() => handleRemoveQuestionDiagram(idx)}
                      />
                    ) : (
                      <div className="my-2 flex items-center gap-2 flex-wrap">
                        <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-dashed border-indigo-300 bg-indigo-50/70 hover:bg-indigo-100 text-indigo-700 text-xs font-bold cursor-pointer transition-all shadow-2xs">
                          <span>📸</span>
                          <span>+ Attach Diagram / Image</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleUploadQuestionDiagram(idx, file);
                            }}
                          />
                        </label>
                        <input
                          type="text"
                          placeholder="or paste Diagram Image URL / Data URL..."
                          className="text-xs px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-700 placeholder-slate-400 w-64 focus:outline-none focus:ring-1 focus:ring-indigo-400"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && e.target.value.trim()) {
                              handleSetQuestionDiagramUrl(idx, e.target.value.trim());
                              e.target.value = '';
                            }
                          }}
                          onBlur={(e) => {
                            if (e.target.value.trim()) {
                              handleSetQuestionDiagramUrl(idx, e.target.value.trim());
                              e.target.value = '';
                            }
                          }}
                        />
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-9 text-xs">
                    {q.options?.map((opt, optIdx) => (
                      <div
                        key={optIdx}
                        className={`p-2.5 rounded-lg border flex items-center justify-between ${
                          q.correct === optIdx
                            ? 'bg-emerald-50 border-emerald-400 font-bold text-emerald-900'
                            : 'bg-slate-50 border-slate-200 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2 flex-1">
                          <span className={`w-5 h-5 rounded-md flex items-center justify-center font-black text-[10px] shrink-0 ${
                            optIdx === 0
                              ? 'bg-red-50 border border-red-200 text-red-700'
                              : optIdx === 1
                              ? 'bg-emerald-50 border border-emerald-200 text-emerald-700'
                              : optIdx === 2
                              ? 'bg-amber-50 border border-amber-200 text-amber-800'
                              : optIdx === 3
                              ? 'bg-orange-50 border border-orange-200 text-orange-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}>
                            {String.fromCharCode(65 + optIdx)}
                          </span>
                          {typeof opt === 'string' && (opt.startsWith('data:image') || opt.includes('http')) ? (
                            <img src={opt} alt={`Option ${String.fromCharCode(65 + optIdx)}`} className="max-h-12 max-w-full object-contain rounded-md border border-slate-200 bg-white" />
                          ) : (
                            <span>{opt}</span>
                          )}
                        </div>
                        {q.correct === optIdx && <span className="text-emerald-600 font-black">✓ Correct</span>}
                      </div>
                    ))}
                  </div>

                  {q.explanation && (
                    <div className="pl-9 text-xs text-slate-600 bg-amber-50/60 p-3 rounded-lg border border-amber-200/70">
                      <strong>💡 Explanation / Solution:</strong> {q.explanation}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="text-center text-xs text-slate-500 py-12 bg-white rounded-xl border border-slate-200">
                No questions found in this paper.
              </p>
            )}
          </div>
        </div>

        {/* Word / PDF / CSV Import Modal for Preview Paper */}
        <UniversalQuestionImportModal
          isOpen={showPaperImportModal}
          onClose={() => setShowPaperImportModal(false)}
          title={`Import Questions into "${previewPaper.title}"`}
          subtitle="Upload Word (.docx), PDF (.pdf), CSV, or paste question text. Questions will be extracted and added directly into this paper."
          targetClassId={previewPaper.class_name || previewPaper.class}
          targetSubjectId={previewPaper.subject_code || previewPaper.subject_id}
          onQuestionsImported={handleImportQuestionsIntoPreviewPaper}
        />
      </div>
    );
  }

  // =========================================================================
  // MAIN VIEW: PAPERS & TEST GENERATOR MANAGER
  // =========================================================================
  return (
    <div className="space-y-6 font-sans pb-16 animate-in fade-in duration-150">
      
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 pb-2">
        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
          <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-[#80497D]/10 text-[#80497D] flex items-center justify-center font-bold border border-[#ebd7eb] shrink-0 shadow-xs">
            <Award className="w-5 h-5 sm:w-7 sm:h-7 text-[#80497D]" />
          </div>
          <div className="min-w-0">
            <h1 className="text-lg sm:text-2xl md:text-3xl font-black text-[#422240] tracking-tight leading-snug sm:leading-tight">
              Practice Tests &amp; Question Papers Manager
            </h1>
            <p className="text-[11px] sm:text-xs md:text-sm text-slate-500 font-medium mt-0.5 sm:mt-1 line-clamp-2 sm:line-clamp-none">
              Create, edit, author questions, configure duration/marks, and manage practice tests for Student Dashboard.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 sm:gap-3 w-full sm:w-auto shrink-0 pt-1 md:pt-0">
          <button
            type="button"
            onClick={() => setShowUniversalImportModal(true)}
            className="flex-1 sm:flex-none px-3.5 sm:px-4 py-2 sm:py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-black rounded-xl text-xs sm:text-sm transition-all shadow-sm active:scale-95 cursor-pointer flex items-center justify-center gap-1.5 sm:gap-2 shrink-0 text-center"
            title="Import Word / PDF Questions directly to create a new paper"
          >
            <Upload className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            <span>Import Word / PDF</span>
          </button>

          <button
            type="button"
            onClick={() => handleOpenCreateModal(activeCategoryTab)}
            className="flex-1 sm:flex-none px-4 sm:px-5 py-2 sm:py-2.5 bg-[#00b074] hover:bg-[#009260] text-white font-black rounded-xl text-xs sm:text-sm transition-all shadow-sm active:scale-95 cursor-pointer flex items-center justify-center gap-1.5 sm:gap-2 shrink-0 text-center"
          >
            <Plus className="w-4 h-4 shrink-0" />
            <span>Create New Practice Test</span>
          </button>
        </div>
      </div>

      {/* Success Toast */}
      {pricingSavedToast && (
        <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-400 text-emerald-900 shadow-sm flex items-center justify-between gap-3 animate-in slide-in-from-top">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span className="font-black text-xs sm:text-sm">
              Practice Test price updated successfully to ₹{testPricing.practice_test_price}! Student Practice Test Generator unlock buttons updated live.
            </span>
          </div>
          <button
            type="button"
            onClick={() => setPricingSavedToast(false)}
            className="text-emerald-700 hover:text-emerald-900 font-black text-xs cursor-pointer p-1"
          >
            ✕
          </button>
        </div>
      )}

      {/* Paper Created & Published Success Toast */}
      {paperSavedToast && (
        <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-500 text-emerald-950 shadow-md flex items-center justify-between gap-3 animate-in slide-in-from-top duration-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black shrink-0 shadow-xs">
              <Check className="w-5 h-5 stroke-[3]" />
            </div>
            <div>
              <span className="font-black text-xs sm:text-sm block text-emerald-900">
                {paperSavedToast}
              </span>
              <span className="text-[11px] text-emerald-700 font-medium">
                The paper is immediately visible above and unlocked in Student Test Generator Pro.
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setPaperSavedToast('')}
            className="text-emerald-700 hover:text-emerald-900 font-black text-xs cursor-pointer p-1.5 rounded-lg hover:bg-emerald-100/60"
          >
            ✕
          </button>
        </div>
      )}

      {/* Dedicated Practice Test Pricing Banner Card */}
      <div className="bg-gradient-to-r from-[#2d124d] via-[#1e1b4b] to-[#3b0764] rounded-2xl p-4 sm:p-5 text-white shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-purple-800/40">
        <div className="flex items-center gap-3.5 sm:gap-4 min-w-0">
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-tr from-amber-400 to-orange-500 text-slate-900 flex items-center justify-center font-black shadow-sm shrink-0">
            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-slate-950" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] sm:text-xs uppercase font-black text-purple-300 tracking-wider bg-purple-950/70 px-2.5 py-0.5 rounded-full border border-purple-700/50">
                Live Student Generator Pricing
              </span>
              <span className="text-[10px] sm:text-xs font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/40 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Auto-Syncs to All Students</span>
              </span>
            </div>

            <div className="flex items-baseline gap-2.5 mt-1.5 flex-wrap">
              <span className="text-sm sm:text-base font-bold text-slate-200">
                Practice Tests Price:
              </span>
              <span className="text-xl sm:text-2xl font-black text-amber-300">
                ₹{testPricing.practice_test_price || 99}
              </span>
              {testPricing.original_price && Number(testPricing.original_price) > Number(testPricing.practice_test_price) && (
                <>
                  <span className="text-xs sm:text-sm text-purple-300 line-through font-bold">
                    ₹{testPricing.original_price}
                  </span>
                  <span className="text-[10px] sm:text-xs font-black uppercase px-2 py-0.5 rounded-full bg-emerald-500 text-white shadow-2xs">
                    {Math.round(((Number(testPricing.original_price) - Number(testPricing.practice_test_price)) / Number(testPricing.original_price)) * 100)}% OFF
                  </span>
                </>
              )}
            </div>

            <p className="text-[11px] sm:text-xs text-purple-200/80 font-medium mt-1">
              Amount charged to students when unlocking Practice Tests and generating custom papers in Test Generator Pro.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowPricingModal(true)}
          className="w-full sm:w-auto px-4 sm:px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-purple-950 font-black text-xs sm:text-sm transition-all shadow-md active:scale-95 cursor-pointer flex items-center justify-center gap-2 shrink-0 self-stretch sm:self-auto"
        >
          <DollarSign className="w-4 h-4 text-purple-950" />
          <span>Edit Practice Price</span>
        </button>
      </div>



      {/* Filter Toolbar */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-3.5 sm:p-4 space-y-3">
        {/* Search Box */}
        <div className="relative w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search title, exam code, subject..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
          />
        </div>

        {/* 3-Column Grid for Class & Subject Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-2.5 text-xs">
          {/* Class Filter */}
          <div>
            <label className="text-[10px] sm:text-xs font-black text-slate-500 uppercase tracking-wider block mb-1 truncate">
              Class / Grade
            </label>
            <select
              value={selectedClassFilter}
              onChange={(e) => setSelectedClassFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 sm:py-2 bg-slate-50 border border-slate-200 rounded-lg sm:rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer truncate"
            >
              <option value="All">All Grades (1-12)</option>
              {GRADE_OPTIONS.map((cls) => (
                <option key={cls} value={cls}>
                  {cls}
                </option>
              ))}
            </select>
          </div>

          {/* Subject Filter */}
          <div>
            <label className="text-[10px] sm:text-xs font-black text-slate-500 uppercase tracking-wider block mb-1 truncate">
              Subject
            </label>
            <select
              value={selectedSubjectFilter}
              onChange={(e) => setSelectedSubjectFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 sm:py-2 bg-slate-50 border border-slate-200 rounded-lg sm:rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500 cursor-pointer truncate"
            >
              <option value="All">All Subjects</option>
              {SUBJECT_OPTIONS.map((sub) => (
                <option key={sub.id} value={sub.code}>
                  {sub.name}
                </option>
              ))}
            </select>
          </div>

          {/* Clear Filters Button */}
          <div className="flex flex-col justify-end">
            <button
              type="button"
              onClick={() => {
                setSelectedClassFilter('All');
                setSelectedSubjectFilter('All');
                setSelectedYearFilter('All');
                setSearchQuery('');
              }}
              className="w-full px-2.5 py-1.5 sm:py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg sm:rounded-xl text-xs font-bold transition-colors cursor-pointer text-center"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Status Count Footer */}
        <div className="flex items-center justify-between text-xs font-bold text-slate-500 pt-1 border-t border-slate-100">
          <span>
            Showing: <strong className="text-slate-900 font-black">{filteredPapers.length} {filteredPapers.length === 1 ? 'Paper' : 'Papers'}</strong>
          </span>
          {(selectedClassFilter !== 'All' || selectedSubjectFilter !== 'All' || searchQuery) && (
            <span className="text-[11px] text-amber-600 font-bold">
              Filters active
            </span>
          )}
        </div>
      </div>

      {/* Papers Grid List */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500 font-bold text-xs">
          Loading published papers...
        </div>
      ) : filteredPapers.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto text-2xl font-black">
            📑
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-black text-slate-900">No Exam Papers Found</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Create your first question paper for this category using the button below.
            </p>
          </div>
          <button
            type="button"
            onClick={() => handleOpenCreateModal(activeCategoryTab)}
            className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-black rounded-xl text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer"
          >
            + Create Exam Paper Now
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPapers.map((paper) => {
            const subCode = paper.subject_code || paper.subject || 'IMO';
            const subObj = SUBJECT_OPTIONS.find((s) => s.code.toLowerCase() === subCode.toLowerCase()) || SUBJECT_OPTIONS[0];
            const qCount = Array.isArray(paper.questions) ? paper.questions.length : (paper.total_questions || 10);
            const pCategory = paper.paper_category || (paper.exam_type === 'generated' || paper.paper_category === 'generator' ? 'generator' : 'practice_test');

            const categoryBadge = pCategory === 'generator'
              ? { label: 'Test Generator Pro', color: 'bg-emerald-100 text-emerald-900 border-emerald-300' }
              : { label: 'Practice Mock Test', color: 'bg-indigo-100 text-indigo-900 border-indigo-300' };

            return (
              <div
                key={paper.id}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md transition-all p-5 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border ${categoryBadge.color}`}>
                      {categoryBadge.label}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-black text-slate-900 leading-snug">
                      {cleanPaperTitle(paper.title)}
                    </h3>
                    <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                      Code: {paper.exam_code || `PPR-${paper.id}`}
                    </p>
                  </div>

                  {/* Badges Row */}
                  <div className="flex items-center gap-1.5 flex-wrap text-xs">
                    <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg font-bold text-[11px]">
                      {paper.class_name || paper.class || 'Class 6'}
                    </span>
                    <span className="px-2.5 py-1 bg-amber-50 text-amber-800 rounded-lg font-bold text-[11px]">
                      {subCode}
                    </span>
                    <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 rounded-lg font-bold text-[11px]">
                      {qCount} Questions
                    </span>
                    <span className="px-2.5 py-1 bg-blue-50 text-blue-800 rounded-lg font-bold text-[11px]">
                      {paper.duration_minutes || 60}m
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setPreviewPaper(paper)}
                      className="px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer border border-slate-200 shadow-2xs"
                    >
                      <Eye className="w-3.5 h-3.5 text-slate-600" />
                      <span>View MCQs</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handlePrintPaper(paper, true)}
                      className="px-2.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer border border-emerald-200 shadow-2xs"
                      title="Download/Print PDF Paper with Answer Key"
                    >
                      <Download className="w-3.5 h-3.5 text-emerald-700" />
                      <span>PDF &amp; Key</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleDownloadPaperCsv(paper)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-sky-700 hover:bg-sky-50 transition-colors cursor-pointer"
                      title="Download CSV / Excel Format"
                    >
                      <FileSpreadsheet className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeletePaper(paper.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Delete Paper"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* PRACTICE TEST & GENERATOR PRICING MODAL */}
      {showPricingModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-purple-100 flex items-center justify-between bg-gradient-to-r from-purple-50 via-indigo-50 to-pink-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-purple-600 text-white flex items-center justify-center shadow-md">
                  <DollarSign className="w-5 h-5 text-amber-300" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    Practice Tests &amp; Test Generator Pricing
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Set the live unlocked price charged to students on Practice Tests.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowPricingModal(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSavePracticePricing} className="p-6 space-y-5 overflow-y-auto flex-1">
              {/* 1. Practice Test Price */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-purple-50 to-indigo-50 border-2 border-purple-300 space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <label className="text-xs font-black text-purple-950 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-600" />
                    <span>Practice Tests / Test Generator Pro Price</span>
                  </label>
                  <span className="text-[10px] font-bold text-purple-800 bg-purple-200/70 px-2 py-0.5 rounded-full">
                    Student Generator unlock button
                  </span>
                </div>

                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-black text-slate-500 text-base">₹</span>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    required
                    value={practicePriceInput}
                    onChange={(e) => setPracticePriceInput(e.target.value)}
                    placeholder="99"
                    className="w-full pl-8 pr-4 py-3 bg-white border border-purple-300 rounded-xl font-black text-slate-900 text-base focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-2xs"
                  />
                </div>

                <p className="text-[11px] text-slate-600 font-medium">
                  Displayed on the student Practice Test unlock button (<span className="font-bold text-purple-900 font-mono">🔒 NEXT: PAY &amp; UNLOCK TEST (₹{practicePriceInput || 99})</span>).
                </p>

                {/* 1-Click Presets */}
                <div className="flex items-center gap-1.5 flex-wrap pt-1">
                  <span className="text-[10px] font-black uppercase text-purple-900 mr-1">Quick Presets:</span>
                  {[49, 79, 99, 149, 199, 299].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setPracticePriceInput(amt)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${
                        Number(practicePriceInput) === amt
                          ? 'bg-purple-600 text-white shadow-xs'
                          : 'bg-white text-slate-700 border border-purple-200 hover:bg-purple-100'
                      }`}
                    >
                      ₹{amt}
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Original MRP Price (Strikethrough) */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <label className="text-xs font-black text-slate-800 flex items-center gap-2">
                    <Tag className="w-4 h-4 text-slate-500" />
                    <span>Original / MRP Price (Strikethrough Display)</span>
                  </label>
                  <span className="text-[10px] font-bold text-slate-500 bg-slate-200 px-2 py-0.5 rounded-full">
                    Optional strikethrough
                  </span>
                </div>

                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-black text-slate-500 text-base">₹</span>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={originalPriceInput}
                    onChange={(e) => setOriginalPriceInput(e.target.value)}
                    placeholder="299"
                    className="w-full pl-8 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl font-bold text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
                  />
                </div>

                <div className="flex items-center justify-between text-xs text-slate-600">
                  <span>
                    Discount percentage: {' '}
                    <strong className="text-emerald-700">
                      {originalPriceInput && Number(originalPriceInput) > Number(practicePriceInput)
                        ? `${Math.round(((Number(originalPriceInput) - Number(practicePriceInput)) / Number(originalPriceInput)) * 100)}% OFF`
                        : 'No discount'}
                    </strong>
                  </span>
                  <span className="line-through text-slate-400 font-bold">
                    ₹{originalPriceInput || 299}
                  </span>
                </div>
              </div>

              {/* 3. Live Student View Preview */}
              <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-2">
                <span className="text-[10px] uppercase font-black text-slate-400 tracking-wider block">
                  👁️ Live Student Preview (Unlock Button)
                </span>
                <div className="py-2.5 px-4 rounded-xl bg-[#00b074] text-white text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-xs">
                  <Lock className="w-3.5 h-3.5 text-amber-300" />
                  <span>Next: Pay &amp; Unlock Test (₹{practicePriceInput || 99})</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-300 px-1 pt-1">
                  <span>Student Checkout Fee: <strong>₹{practicePriceInput || 99}</strong></span>
                  {originalPriceInput && Number(originalPriceInput) > Number(practicePriceInput) && (
                    <span className="text-emerald-400 font-bold">
                      {Math.round(((Number(originalPriceInput) - Number(practicePriceInput)) / Number(originalPriceInput)) * 100)}% Discount Applied
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  disabled={isSavingPricing}
                  className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-sm shadow-md hover:shadow-lg active:scale-98 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  {isSavingPricing ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Saving &amp; Updating Live...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4 stroke-[3]" />
                      <span>Save &amp; Apply Live to Students</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setPracticePriceInput(99);
                    setOriginalPriceInput(299);
                  }}
                  className="px-4 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer transition-colors"
                >
                  ↺ Reset (₹99)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Universal Word / PDF / CSV Import Modal */}
      <UniversalQuestionImportModal
        isOpen={showUniversalImportModal}
        onClose={() => setShowUniversalImportModal(false)}
        title="Import Questions (Word / PDF / CSV)"
        subtitle="Upload your Word (.docx), PDF (.pdf), or CSV file. Questions, options, and answers will be automatically extracted."
        onQuestionsImported={handleUniversalQuestionsImported}
      />

    </div>
  );
};
