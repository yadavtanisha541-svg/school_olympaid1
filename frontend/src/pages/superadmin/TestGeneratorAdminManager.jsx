import React, { useState, useEffect } from 'react';
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
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { apiClient } from '../../api/client';
import { getTestPricing, saveTestPricing } from '../../utils/purchaseUtils';

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

const YEARS_OPTIONS = ['2026', '2025', '2024', '2023', '2022', '2021', '2020', '2019', '2018'];

// Clean blank question template for Super Admin
const createBlankQuestion = () => ({
  q: '',
  options: ['', '', '', ''],
  correct: 0,
  explanation: '',
  marks: 1
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
            marks: parseInt(item.marks || item.points || 1) || 1
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

  // Bulk Importer Modal State
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [bulkInputText, setBulkInputText] = useState('');
  const [bulkParsedCount, setBulkParsedCount] = useState(0);

  // Form State
  const [paperCategory, setPaperCategory] = useState('practice_test'); // 'practice_test' | 'generator'
  const [examYear, setExamYear] = useState('2024');
  const [paperTitle, setPaperTitle] = useState('');
  const [paperClass, setPaperClass] = useState('Class 6');
  const [paperSubject, setPaperSubject] = useState('math');
  const [paperDuration, setPaperDuration] = useState(60);
  const [paperDifficulty, setPaperDifficulty] = useState('Standard');
  const [questionsList, setQuestionsList] = useState([]);

  // Load published papers directly from API / Local Storage
  const fetchPapers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/test-generator/admin-papers', {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      });
      const data = await res.json();
      if (data && data.success && Array.isArray(data.data)) {
        setPapers(data.data);
        localStorage.setItem('admin_generator_papers', JSON.stringify(data.data));
      } else {
        const local = JSON.parse(localStorage.getItem('admin_generator_papers') || '[]');
        setPapers(local);
      }
    } catch (e) {
      console.warn('API fetch error, falling back to local:', e);
      const local = JSON.parse(localStorage.getItem('admin_generator_papers') || '[]');
      setPapers(local);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPapers();
  }, []);

  // Helper to generate dynamic title
  const generateTitle = (cat, grade, subKey, yr) => {
    const subObj = SUBJECT_OPTIONS.find((s) => s.id === subKey);
    const subCode = subObj ? subObj.code : subKey.toUpperCase();
    if (cat === 'generator') {
      return `${grade} ${subCode} Intelligent Generator Practice Paper`;
    } else {
      return `${grade} ${subCode} Practice Mock Test (${yr})`;
    }
  };

  // Open Create Modal & populate 1 clean blank question for authoring
  const handleOpenCreateModal = (presetCategory = 'practice_test') => {
    const cat = presetCategory === 'all' ? 'practice_test' : presetCategory;
    setPaperCategory(cat);
    setExamYear('2024');
    setPaperClass('Class 6');
    setPaperSubject('math');
    setPaperDuration(cat === 'generator' ? 15 : 60);
    setPaperDifficulty('Standard');
    setPaperTitle(generateTitle(cat, 'Class 6', 'math', '2024'));
    setQuestionsList([createBlankQuestion()]);
    setShowCreateModal(true);
  };

  // Change category in modal
  const handleCategoryChangeInModal = (cat) => {
    setPaperCategory(cat);
    setPaperDuration(cat === 'generator' ? 15 : 60);
    setPaperTitle(generateTitle(cat, paperClass, paperSubject, examYear));
  };

  // Change subject in modal
  const handleSubjectChangeInModal = (subKey) => {
    setPaperSubject(subKey);
    setPaperTitle(generateTitle(paperCategory, paperClass, subKey, examYear));
  };

  // Change class in modal
  const handleClassChangeInModal = (cls) => {
    setPaperClass(cls);
    setPaperTitle(generateTitle(paperCategory, cls, paperSubject, examYear));
  };

  // Change year in modal
  const handleYearChangeInModal = (yr) => {
    setExamYear(yr);
    setPaperTitle(generateTitle(paperCategory, paperClass, paperSubject, yr));
  };

  // Add blank question
  const handleAddQuestion = () => {
    setQuestionsList([
      ...questionsList,
      createBlankQuestion()
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
      title: paperTitle || `${paperClass} ${subObj?.name || 'Olympiad'} Question Paper (${examYear})`,
      paper_category: paperCategory,
      exam_year: examYear,
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

  // Submit and Publish Paper
  const handleSavePaper = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!paperTitle.trim()) {
      alert('Please enter a paper title.');
      return;
    }
    if (questionsList.length === 0) {
      alert('Please add at least one question to this paper.');
      return;
    }

    const totalMarks = questionsList.reduce((acc, q) => acc + (parseFloat(q.marks) || 1), 0);
    const subObj = SUBJECT_OPTIONS.find((s) => s.id === paperSubject);

    const payload = {
      title: paperTitle,
      paper_category: paperCategory,
      exam_year: examYear,
      subject: paperSubject,
      subject_name: subObj?.name || 'Mathematics',
      subject_code: subObj?.code || 'IMO',
      class: paperClass,
      class_name: paperClass,
      duration_minutes: parseInt(paperDuration) || 60,
      total_questions: questionsList.length,
      total_marks: totalMarks,
      difficulty: paperDifficulty,
      questions: questionsList,
      created_at: new Date().toISOString()
    };

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/test-generator/admin-papers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify(payload)
      });
      await res.json();
    } catch (err) {
      console.warn('API error, persisting locally:', err);
    }

    const local = JSON.parse(localStorage.getItem('admin_generator_papers') || '[]');
    const prefix = 'PRAC';
    const newPaperLocal = {
      ...payload,
      id: Date.now(),
      exam_code: `${prefix}-${subObj?.code || 'GEN'}-${Math.floor(1000 + Math.random() * 9000)}`
    };
    const updatedLocal = [newPaperLocal, ...local.filter(p => p.id !== newPaperLocal.id)];
    localStorage.setItem('admin_generator_papers', JSON.stringify(updatedLocal));

    try {
      const mockDb = JSON.parse(localStorage.getItem('mock_db_exam_papers') || '[]');
      localStorage.setItem('mock_db_exam_papers', JSON.stringify([newPaperLocal, ...mockDb.filter(p => p.id !== newPaperLocal.id)]));
    } catch (e) {}

    window.dispatchEvent(new CustomEvent('olympiadhub-admin-papers-updated', { detail: updatedLocal }));

    setShowCreateModal(false);
    fetchPapers();
  };

  // Delete Paper directly
  const handleDeletePaper = async (paperId) => {
    setPapers((prev) => prev.filter((p) => p.id !== paperId));

    try {
      const token = localStorage.getItem('token');
      await fetch(`/api/test-generator/admin-papers/${paperId}`, {
        method: 'DELETE',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      });
    } catch (e) {
      console.warn('Delete error', e);
    }

    const local = JSON.parse(localStorage.getItem('admin_generator_papers') || '[]');
    const updated = local.filter((p) => p.id !== paperId);
    localStorage.setItem('admin_generator_papers', JSON.stringify(updated));

    try {
      const mockDb = JSON.parse(localStorage.getItem('mock_db_exam_papers') || '[]');
      localStorage.setItem('mock_db_exam_papers', JSON.stringify(mockDb.filter((p) => p.id !== paperId)));
    } catch (e) {}

    window.dispatchEvent(new CustomEvent('olympiadhub-admin-papers-updated', { detail: updated }));
    fetchPapers();
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

  const handleBulkFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const content = ev.target?.result || '';
      handleBulkTextChange(content);
    };
    reader.readAsText(file);
  };

  const handleApplyBulkImport = (mode = 'append') => {
    const parsed = parseBulkQuestions(bulkInputText);
    if (parsed.length === 0) {
      alert('No valid questions could be detected. Please check format or load sample template.');
      return;
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
        <div class="paper-title">${paper.title}</div>
      </div>
      <div style="text-align:right;font-size:11px;color:#64748b;">
        <div><strong>Code:</strong> ${paper.exam_code || `PPR-${paper.id}`}</div>
        <div><strong>Year:</strong> ${paper.exam_year || '2024'}</div>
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
    const pYear = p.exam_year || '2024';

    const matchesCategory =
      activeCategoryTab === 'all' ||
      pCategory === activeCategoryTab ||
      (activeCategoryTab === 'practice_test' && pCategory !== 'generator') ||
      (activeCategoryTab === 'generator' && (pCategory === 'generator' || p.exam_type === 'generated'));

    const matchesClass = selectedClassFilter === 'All' || pClass.toLowerCase().includes(selectedClassFilter.toLowerCase());
    const matchesSubject = selectedSubjectFilter === 'All' || pSubCode.toLowerCase().includes(selectedSubjectFilter.toLowerCase());
    const matchesYear = selectedYearFilter === 'All' || pYear === selectedYearFilter || p.title?.includes(selectedYearFilter);
    const matchesSearch =
      !searchQuery ||
      (p.title && p.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.exam_code && p.exam_code.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesClass && matchesSubject && matchesYear && matchesSearch;
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
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-lg text-xs uppercase tracking-wider transition-all shadow-xs active:scale-98 cursor-pointer flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Publish Paper</span>
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

              {/* Row: Grade, Subject, Year, Duration */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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

                {/* Exam Year */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600">Exam Year / Set:</label>
                  <select
                    value={examYear}
                    onChange={(e) => handleYearChangeInModal(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 cursor-pointer bg-white"
                  >
                    {YEARS_OPTIONS.map((yr) => (
                      <option key={yr} value={yr}>
                        Year {yr}
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
                      onClick={handleOpenBulkModal}
                      className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-bold cursor-pointer"
                    >
                      ⚡ Bulk Import Q&amp;A
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
                            required
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
                            <input
                              type="text"
                              required
                              placeholder={`Option ${letter}`}
                              value={qItem.options?.[optIdx] || ''}
                              onChange={(e) => handleUpdateOption(qIdx, optIdx, e.target.value)}
                              className="w-full px-2 py-1 bg-transparent border-none text-xs font-medium text-slate-800 focus:outline-none"
                            />
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
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-lg text-xs uppercase tracking-wider transition-all shadow-xs active:scale-98 cursor-pointer flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  <span>Publish Exam Paper</span>
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
                      <span>📁 Import File</span>
                      <input
                        type="file"
                        accept=".txt,.csv,.json"
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
                  {previewPaper.class_name || previewPaper.class} &bull; {previewPaper.subject_code || 'IMO'} &bull; {previewPaper.exam_year || '2024'}
                </span>
                <h1 className="text-base sm:text-lg font-black text-slate-900">{previewPaper.title}</h1>
              </div>
            </div>

            {/* Quick Export & Actions Toolbar */}
            <div className="flex items-center gap-2 flex-wrap">
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
            </div>
          </div>

          <div className="space-y-4">
            {Array.isArray(previewPaper.questions) && previewPaper.questions.length > 0 ? (
              previewPaper.questions.map((q, idx) => (
                <div key={idx} className="p-5 rounded-xl bg-white border border-slate-200 space-y-3 shadow-2xs">
                  <div className="flex items-start gap-3 text-sm font-bold text-slate-900">
                    <span className="w-6 h-6 rounded-lg bg-slate-800 text-white flex items-center justify-center font-black text-xs shrink-0">
                      {idx + 1}
                    </span>
                    <span className="flex-1">{q.q}</span>
                    <span className="text-[11px] font-bold text-slate-400">[{q.marks || 1} Mark]</span>
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
                        <div className="flex items-center gap-2">
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
                          <span>{opt}</span>
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

        <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center sm:gap-3 w-full md:w-auto shrink-0 pt-1 md:pt-0">
          <button
            type="button"
            onClick={() => setShowPricingModal(true)}
            className="w-full sm:w-auto px-2.5 sm:px-4 py-2 sm:py-2.5 bg-gradient-to-r from-purple-700 via-indigo-700 to-purple-800 hover:from-purple-800 hover:to-indigo-800 text-white font-bold rounded-xl text-xs sm:text-sm transition-all shadow-sm active:scale-95 cursor-pointer flex items-center justify-center gap-1.5 sm:gap-2 shrink-0 border border-purple-400/30 text-center min-w-0"
            title="Set Practice Test & Generator Pro Price"
          >
            <DollarSign className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-300 shrink-0" />
            <span className="truncate">
              <span className="sm:hidden">Price: ₹{testPricing.practice_test_price || 99}</span>
              <span className="hidden sm:inline">Practice Test Price: ₹{testPricing.practice_test_price || 99}</span>
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleOpenCreateModal(activeCategoryTab)}
            className="w-full sm:w-auto px-2.5 sm:px-5 py-2 sm:py-2.5 bg-[#00b074] hover:bg-[#009260] text-white font-black rounded-xl text-xs sm:text-sm transition-all shadow-sm active:scale-95 cursor-pointer flex items-center justify-center gap-1.5 sm:gap-2 shrink-0 text-center min-w-0"
          >
            <Plus className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5 shrink-0" />
            <span className="truncate">
              <span className="sm:hidden">Create Test</span>
              <span className="hidden sm:inline">Create New Practice Test</span>
            </span>
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

      {/* Dedicated Practice Test Pricing Banner Card */}
      <div className="bg-gradient-to-r from-[#2d124d] via-[#1e1b4b] to-[#3b0764] rounded-2xl sm:rounded-3xl p-4 sm:p-6 text-white shadow-md flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 sm:gap-5 border border-purple-800/50">
        <div className="flex items-start sm:items-center gap-3.5 sm:gap-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-amber-400 to-orange-500 text-slate-900 flex items-center justify-center font-black shadow-md shrink-0">
            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] sm:text-xs uppercase font-black text-purple-300 tracking-wider bg-purple-950/70 px-2 sm:px-2.5 py-0.5 rounded-full border border-purple-700/50">
                Live Student Generator Pricing
              </span>
              <span className="text-[10px] sm:text-xs font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/40 px-2 py-0.5 rounded-full flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span>Auto-Syncs to All Students</span>
              </span>
            </div>

            <div className="flex items-baseline gap-2 sm:gap-2.5 mt-1.5 flex-wrap">
              <span className="text-sm sm:text-lg lg:text-xl font-black text-white">
                Practice Tests Price:
              </span>
              <span className="text-xl sm:text-2xl lg:text-3xl font-black text-amber-300">
                ₹{testPricing.practice_test_price || 99}
              </span>
              {testPricing.original_price && Number(testPricing.original_price) > Number(testPricing.practice_test_price) && (
                <>
                  <span className="text-xs sm:text-sm text-purple-300 line-through font-bold">
                    ₹{testPricing.original_price}
                  </span>
                  <span className="text-[10px] sm:text-[11px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-500 text-white shadow-2xs">
                    {Math.round(((Number(testPricing.original_price) - Number(testPricing.practice_test_price)) / Number(testPricing.original_price)) * 100)}% OFF
                  </span>
                </>
              )}
            </div>

            <p className="text-[11px] sm:text-xs text-purple-200/90 font-medium mt-1">
              Amount charged to students when unlocking Practice Tests and generating custom papers in Test Generator Pro.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setShowPricingModal(true)}
            className="w-full sm:w-auto px-4 sm:px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-purple-950 font-black text-xs sm:text-sm transition-all shadow-md active:scale-95 cursor-pointer flex items-center justify-center gap-1.5 text-center"
          >
            <DollarSign className="w-4 h-4 text-purple-950" />
            <span>Edit Practice Price</span>
          </button>
        </div>
      </div>



      {/* Filter Toolbar */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-3.5 sm:p-4 space-y-3">
        {/* Search Box */}
        <div className="relative w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search title, exam code, year..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
          />
        </div>

        {/* 2-Column Mobile Grid for Filters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5 text-xs">
          {/* Class Filter */}
          <div>
            <label className="text-[10px] sm:text-xs font-black text-slate-500 uppercase tracking-wider block mb-1 truncate">
              Grade
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

          {/* Year Filter */}
          <div>
            <label className="text-[10px] sm:text-xs font-black text-slate-500 uppercase tracking-wider block mb-1 truncate">
              Year
            </label>
            <select
              value={selectedYearFilter}
              onChange={(e) => setSelectedYearFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 sm:py-2 bg-slate-50 border border-slate-200 rounded-lg sm:rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer truncate"
            >
              <option value="All">All Years</option>
              {YEARS_OPTIONS.map((yr) => (
                <option key={yr} value={yr}>
                  {yr}
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
          {(selectedClassFilter !== 'All' || selectedSubjectFilter !== 'All' || selectedYearFilter !== 'All' || searchQuery) && (
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
                    <span className="text-[10px] font-mono font-bold text-slate-400">
                      {paper.exam_year ? `Year ${paper.exam_year}` : ''}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-black text-slate-900 leading-snug">
                      {paper.title}
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

    </div>
  );
};
