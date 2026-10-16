import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { apiClient } from '../../api/client';
import { generateIntelligentOlympiadTest } from '../../utils/olympiadQuestionBank';
import {
  Lightbulb,
  Clock,
  CheckCircle2,
  Bookmark,
  ChevronRight,
  ChevronLeft,
  RotateCcw,
  Sparkles,
  Trophy,
  Award,
  AlertCircle,
  HelpCircle,
  BarChart3,
  Calendar,
  Check,
  X,
  Play,
  Zap,
  ArrowRight,
  Eye,
  FileText,
  ShieldCheck,
  Send,
  BookOpen,
  Printer,
  ArrowLeft,
  Download,
  Lock,
  CreditCard,
  QrCode,
  Copy,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { DownloadPaperPdfModal } from '../../components/common/DownloadPaperPdfModal';
import { DetailedSolutionsPage } from './DetailedSolutionsPage';
import { getTestPricing } from '../../utils/purchaseUtils';
import { CHAPTERS_BY_SUBJECT, getTopicsForSubject } from '../../data/subjectTopics';
import {
  getQuestionImage,
  getCleanQuestionText,
  isImageString,
  getOptionImageSrc,
  QuestionDiagram
} from '../../utils/questionMediaHelper';

const subjectsMap = {
  math: { name: 'IMO (Maths)', code: 'IMO', color: '#eab308', letter: 'M' },
  science: { name: 'ISO (Science)', code: 'ISO', color: '#16a34a', letter: 'S' },
  digital: { name: 'IDLO (Digital Literacy)', code: 'IDLO', color: '#0284c7', letter: 'D' },
  english: { name: 'IEO (English)', code: 'IEO', color: '#ea580c', letter: 'E' },
  gk: { name: 'IGKO (GK)', code: 'IGKO', color: '#e7b84b', letter: 'G' },
  hindi: { name: 'IHO (Hindi)', code: 'IHO', color: '#dc2626', letter: 'H' }
};

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

export const TestGeneratorPro = ({ onNavigateTab, onExitToDashboard }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('tests'); // 'tests' | 'generator' | 'list'

  // Super Admin Created Generator Papers State
  const [adminPapers, setAdminPapers] = useState([]);
  const [loadingAdminPapers, setLoadingAdminPapers] = useState(false);

  // Practice Tests Hub Preview
  const [quickPreviewPaper, setQuickPreviewPaper] = useState(null);

  // Generator Configuration State
  const [selectedGrade, setSelectedGrade] = useState(user?.class || 'Class 6');
  const [selectedSubject, setSelectedSubject] = useState('math'); // 'english' | 'math' | 'science' | 'cyber' | 'gk' | 'reasoning'
  const [selectedLevel, setSelectedLevel] = useState('Level 1');
  const [selectedDifficulty, setSelectedDifficulty] = useState('Foundation');
  const [questionCount, setQuestionCount] = useState(10);
  const [testDurationMinutes, setTestDurationMinutes] = useState(15);
  const [selectedChapters, setSelectedChapters] = useState(CHAPTERS_BY_SUBJECT['math'] || []);
  const [generatorStep, setGeneratorStep] = useState('configure'); // 'configure' | 'instructions'
  const [hasAgreedInstructions, setHasAgreedInstructions] = useState(true);

  // Purchased / Unlocked Tests State
  const [purchasedTests, setPurchasedTests] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('olympiadhub_purchased_tests') || '[]');
    } catch (e) {
      return [];
    }
  });

  const isTestUnlocked = (grade, subject) => {
    return true; // Bypass payment: all tests unlocked directly without payment
  };

  const isCurrentTestUnlocked = true;

  // Payment Checkout State
  const [pendingAdminPaper, setPendingAdminPaper] = useState(null);
  const [paymentStep, setPaymentStep] = useState('method'); // 'method' | 'success'
  const [selectedPayMethod, setSelectedPayMethod] = useState('upi_qr'); // 'upi_qr' | 'upi_app' | 'card' | 'netbanking'
  const [utrNumber, setUtrNumber] = useState('');
  const [paymentError, setPaymentError] = useState('');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [bankSettings, setBankSettings] = useState(() => {
    const p = getTestPricing();
    const practicePrice = Number(p.practice_test_price) || 99;
    return {
      upi_id: 'olympiadhub@icici',
      merchant_name: 'Olympiad Foundation India',
      bank_name: 'ICICI Bank',
      account_number: '1029384756',
      ifsc: 'ICIC0001029',
      qr_code_url: '',
      test_pack_price: practicePrice,
      practice_test_price: practicePrice,
      mock_test_price: Number(p.mock_test_price) || 99,
      original_price: Number(p.original_price) || 299
    };
  });

  useEffect(() => {
    apiClient.get('/payment/bank-settings').then(res => {
      if (res && res.data) {
        const practicePrice = Number(res.data.practice_test_price) || 99;
        setBankSettings(prev => ({
          ...prev,
          ...res.data,
          test_pack_price: practicePrice,
          practice_test_price: practicePrice
        }));
      }
    }).catch(() => {});

    const handlePricingUpdate = (e) => {
      const p = e?.detail || getTestPricing();
      const practicePrice = Number(p.practice_test_price) || 99;
      setBankSettings(prev => ({
        ...prev,
        test_pack_price: practicePrice,
        practice_test_price: practicePrice,
        mock_test_price: Number(p.mock_test_price) || 99,
        original_price: Number(p.original_price) || 299
      }));
    };

    window.addEventListener('olympiadhub-pricing-updated', handlePricingUpdate);
    window.addEventListener('storage', handlePricingUpdate);
    return () => {
      window.removeEventListener('olympiadhub-pricing-updated', handlePricingUpdate);
      window.removeEventListener('storage', handlePricingUpdate);
    };
  }, []);

  const handleCopyUpi = () => {
    const text = bankSettings.upi_id || 'olympiadhub@icici';
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text);
    }
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handleCompletePayment = async () => {
    setPaymentError('');
    setIsProcessingPayment(true);
    try {
      const cleanUtr = String(utrNumber || `FREE-AUTO-${Date.now()}`).trim();
      const purchaseKey = `${selectedGrade}_${selectedSubject}`.toLowerCase();
      const updatedPurchases = Array.from(new Set([...purchasedTests, purchaseKey, selectedSubject.toLowerCase()]));
      setPurchasedTests(updatedPurchases);
      localStorage.setItem('olympiadhub_purchased_tests', JSON.stringify(updatedPurchases));

      // Record order
      const orderPayload = {
        order_id: `ORD-FREE-${Date.now().toString().slice(-6)}`,
        grade: selectedGrade,
        subject: selectedSubject,
        subject_name: subjectsMap[selectedSubject]?.name || selectedSubject,
        amount: 0,
        payment_method: selectedPayMethod || 'free_direct',
        utr_number: cleanUtr,
        status: 'completed',
        date: new Date().toISOString()
      };

      try {
        await apiClient.post('/payment/checkout', orderPayload);
      } catch (e) {}

      try {
        const existingOrders = JSON.parse(localStorage.getItem('olympiadhub_db_orders') || '[]');
        localStorage.setItem('olympiadhub_db_orders', JSON.stringify([orderPayload, ...existingOrders]));
        window.dispatchEvent(new CustomEvent('olympiadhub-package-purchased', { detail: orderPayload }));
      } catch (e) {}

      setPaymentStep('success');

      setTimeout(() => {
        setPaymentStep('method');
        setUtrNumber('');
        setPaymentError('');
        if (selectedChapters.length === 0) {
          setSelectedChapters(CHAPTERS_BY_SUBJECT[selectedSubject] || []);
        }
        setGeneratorStep('instructions');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 400);
    } catch (err) {
      setGeneratorStep('instructions');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const isFetchingAdminPapersRef = useRef(false);

  // Fetch Super Admin papers directly from API & all localStorage stores
  const fetchAdminPapers = async () => {
    if (isFetchingAdminPapersRef.current) return;
    isFetchingAdminPapersRef.current = true;
    setLoadingAdminPapers(true);
    try {
      let combined = [];

      const addUniquePaper = (p) => {
        if (!p) return;
        const pIdStr = String(p.id || '');
        const pCodeStr = String(p.exam_code || '');
        const exists = combined.some((cp) => 
          (pIdStr && String(cp.id) === pIdStr) || 
          (pCodeStr && cp.exam_code && cp.exam_code === pCodeStr) ||
          (cp.title && p.title && cp.title === p.title && (cp.class_name || cp.class) === (p.class_name || p.class))
        );
        if (!exists) {
          combined.push({ 
            ...p, 
            paper_category: p.paper_category || (p.exam_type === 'mock' ? 'mock_test' : 'practice_test'), 
            status: p.status || 'published' 
          });
        }
      };

      // 1. Direct admin_generator_papers check (authored in Practice Tests & Papers)
      try {
        const local = JSON.parse(localStorage.getItem('admin_generator_papers') || '[]');
        if (Array.isArray(local)) local.forEach(addUniquePaper);
      } catch (e) {}

      // 2. Direct olympiadhub_db_exam_papers check (mockEngine DB)
      try {
        const dbPapers = JSON.parse(localStorage.getItem('olympiadhub_db_exam_papers') || '[]');
        if (Array.isArray(dbPapers)) dbPapers.forEach(addUniquePaper);
      } catch (e) {}

      // 3. Direct mock_db_exam_papers check
      try {
        const mockDb = JSON.parse(localStorage.getItem('mock_db_exam_papers') || '[]');
        if (Array.isArray(mockDb)) mockDb.forEach(addUniquePaper);
      } catch (e) {}

      // 4. Direct olympiadhub_db_exams check
      try {
        const oExams = JSON.parse(localStorage.getItem('olympiadhub_db_exams') || '[]');
        if (Array.isArray(oExams)) oExams.forEach(addUniquePaper);
      } catch (e) {}

      // 5. API endpoint check: /test-generator/admin-papers
      try {
        const resAdmin = await apiClient.get('/test-generator/admin-papers').catch(() => null);
        if (resAdmin && resAdmin.success && Array.isArray(resAdmin.data)) {
          resAdmin.data.forEach(addUniquePaper);
        }
      } catch (e) {}

      // 6. API endpoint check: /exam-papers
      try {
        const res = await apiClient.get('/exam-papers').catch(() => null);
        if (res && res.success && Array.isArray(res.data)) {
          res.data.forEach(addUniquePaper);
        }
      } catch (e) {}

      const sanitized = combined.map((p) => ({
        ...p,
        title: cleanPaperTitle(p.title, p.subject_code, p.class_name),
        exam_year: '',
        short_code: (p.short_code || '').replace(/\s*-\s*(201[5-9]|202[0-9]|PYQ)/gi, '').trim()
      }));
      setAdminPapers(sanitized);
    } catch (e) {
      console.warn('Error syncing admin papers:', e);
    } finally {
      setLoadingAdminPapers(false);
      isFetchingAdminPapersRef.current = false;
    }
  };

  useEffect(() => {
    fetchAdminPapers();
    let syncTimer = null;
    const handleSync = () => {
      if (syncTimer) clearTimeout(syncTimer);
      syncTimer = setTimeout(() => {
        fetchAdminPapers();
      }, 400);
    };
    window.addEventListener('olympiadhub-admin-papers-updated', handleSync);
    window.addEventListener('olympiadhub-exams-updated', handleSync);
    return () => {
      if (syncTimer) clearTimeout(syncTimer);
      window.removeEventListener('olympiadhub-admin-papers-updated', handleSync);
      window.removeEventListener('olympiadhub-exams-updated', handleSync);
    };
  }, []);

  // Update selected chapters when subject changes
  useEffect(() => {
    const topics = getTopicsForSubject(selectedSubject);
    if (topics && topics.length > 0) {
      setSelectedChapters(topics);
    }
  }, [selectedSubject]);

  // Toggle single chapter
  const handleToggleChapter = (chapterName) => {
    if (selectedChapters.includes(chapterName)) {
      setSelectedChapters(selectedChapters.filter((c) => c !== chapterName));
    } else {
      setSelectedChapters([...selectedChapters, chapterName]);
    }
  };

  // Toggle select all chapters
  const handleToggleAllChapters = () => {
    const allForSub = getTopicsForSubject(selectedSubject) || [];
    if (selectedChapters.length === allForSub.length) {
      setSelectedChapters([]);
    } else {
      setSelectedChapters(allForSub);
    }
  };

  // Helper to check if a paper has valid questions or is published
  const paperHasQuestions = (p) => {
    if (!p) return false;
    if (Array.isArray(p.questions) && p.questions.length > 0) return true;
    if (Array.isArray(p.question_ids) && p.question_ids.length > 0) return true;
    if (Number(p.total_questions || p.questions_count) > 0) return true;
    if (p.status === 'published' || p.status === 'active') return true;
    return false;
  };

  // Helper to find matching Super Admin Paper for Class & Subject
  const getMatchingPaper = (grade = selectedGrade, subject = selectedSubject) => {
    const candidates = adminPapers.filter((p) => {
      // 0. Strict exclusion: NEVER match pure Mock Tests in Practice Tests Hub!
      const cat = (p.paper_category || p.category || p.exam_type || '').toLowerCase();
      const pTitle = (p.title || '').toLowerCase().trim();
      const isPureMock = (cat === 'mock_test' || cat === 'mock' || p.exam_type === 'mock') && !cat.includes('practice') && !pTitle.includes('practice');
      if (isPureMock) return false;

      // 1. Grade match
      const pClassRaw = p.class_name || p.class || p.grade || '';
      const pClass = (pClassRaw || p.title || '').toLowerCase().trim();
      const selGrade = (grade || '').toLowerCase().trim();

      const pMatch = (pClassRaw || '').match(/\d+/) || pClass.match(/class\s*(\d+)/i) || pClass.match(/grade\s*(\d+)/i) || pClass.match(/\d+/);
      const selMatch = selGrade.match(/\d+/);

      if (pMatch && selMatch) {
        const pNum = pMatch[1] || pMatch[0];
        const selNum = selMatch[0];
        if (pNum !== selNum) return false;
      } else if (pClass && selGrade) {
        if (!pClass.includes(selGrade) && !selGrade.includes(pClass)) return false;
      }

      // 2. Subject match
      const subCode = (p.subject_code || p.subject || p.subject_name || '').toLowerCase().trim();
      const currentSub = (subject || '').toLowerCase().trim();
      const subMap = {
        math: ['imo', 'math', 'mathematics', 'mathematic', 'maths', 'nmo', 'ieom'],
        science: ['iso', 'science', 'nso'],
        cyber: ['ico', 'icso', 'cyber', 'computer', 'computers', 'ai', 'digital', 'idlo', 'it'],
        digital: ['ico', 'icso', 'cyber', 'computer', 'computers', 'ai', 'digital', 'idlo', 'it'],
        english: ['ieo', 'english', 'eng'],
        gk: ['igko', 'gk', 'general knowledge', 'general'],
        hindi: ['iho', 'hindi'],
        reasoning: ['lro', 'iro', 'isso', 'reasoning', 'social studies', 'aptitude', 'logical']
      };
      const validCodes = subMap[currentSub] || [currentSub];
      return validCodes.some(
        (code) => subCode.includes(code) || pTitle.includes(code)
      );
    });

    return candidates.find((p) => Array.isArray(p.questions) && p.questions.length > 0) || candidates[0] || null;
  };

  // Filtered papers specifically for currently chosen Class & Subject
  const selectedClassSubjectPapers = useMemo(() => {
    return adminPapers
      .filter((p) => {
        // 0. Strict exclusion: NEVER match pure Mock Tests in Practice Tests Hub!
        const cat = (p.paper_category || p.category || p.exam_type || '').toLowerCase();
        const pTitle = (p.title || '').toLowerCase().trim();
        const isPureMock = (cat === 'mock_test' || cat === 'mock' || p.exam_type === 'mock') && !cat.includes('practice') && !pTitle.includes('practice');
        if (isPureMock) return false;

        // 1. Grade match
        const pClassRaw = p.class_name || p.class || p.grade || '';
        const pClass = (pClassRaw || p.title || '').toLowerCase().trim();
        const selGrade = (selectedGrade || '').toLowerCase().trim();

        const pMatch = (pClassRaw || '').match(/\d+/) || pClass.match(/class\s*(\d+)/i) || pClass.match(/grade\s*(\d+)/i) || pClass.match(/\d+/);
        const selMatch = selGrade.match(/\d+/);

        if (pMatch && selMatch) {
          const pNum = pMatch[1] || pMatch[0];
          const selNum = selMatch[0];
          if (pNum !== selNum) return false;
        } else if (pClass && selGrade) {
          if (!pClass.includes(selGrade) && !selGrade.includes(pClass)) return false;
        }

        // 2. Subject match
        const subCode = (p.subject_code || p.subject || p.subject_name || '').toLowerCase().trim();
        const currentSub = (selectedSubject || '').toLowerCase().trim();
        const subMap = {
          math: ['imo', 'ieom', 'math', 'mathematics', 'mathematic', 'maths', 'nmo'],
          science: ['iso', 'ieos', 'science', 'nso'],
          digital: ['idlo', 'ieod', 'digital', 'computer', 'icso', 'cyber', 'ai', 'tech', 'ico', 'it'],
          english: ['ieo', 'ieoe', 'english', 'eng'],
          gk: ['igko', 'ieog', 'gk', 'general knowledge', 'general'],
          hindi: ['iho', 'ieoh', 'hindi'],
          reasoning: ['lro', 'iro', 'isso', 'reasoning', 'social studies', 'aptitude', 'logical']
        };
        const validCodes = subMap[currentSub] || [currentSub];
        return validCodes.some((code) => subCode.includes(code) || pTitle.includes(code));
      })
      .sort((a, b) => {
        const qA = Array.isArray(a.questions) ? a.questions.length : 0;
        const qB = Array.isArray(b.questions) ? b.questions.length : 0;
        return qB - qA;
      });
  }, [adminPapers, selectedGrade, selectedSubject]);

  const matchingPaper = getMatchingPaper(selectedGrade, selectedSubject) || (selectedClassSubjectPapers.length > 0 ? selectedClassSubjectPapers[0] : null);
  const hasMatchingPaper = !!(matchingPaper && paperHasQuestions(matchingPaper));

  // Helper to check if a specific Olympiad subject has published questions for the selected grade
  const isSubjectPublished = (subKey) => {
    const p = getMatchingPaper(selectedGrade, subKey);
    return !!(p && paperHasQuestions(p));
  };

  // Helper to check if a specific Grade has any published questions
  const isGradePublished = (grade) => {
    return adminPapers.some((p) => {
      const cat = (p.paper_category || p.category || p.exam_type || '').toLowerCase();
      const pTitle = (p.title || '').toLowerCase().trim();
      const isPureMock = (cat === 'mock_test' || cat === 'mock' || p.exam_type === 'mock') && !cat.includes('practice') && !pTitle.includes('practice');
      if (isPureMock) return false;

      const pClassRaw = p.class_name || p.class || p.grade || '';
      const pClass = (pClassRaw || p.title || '').toLowerCase();
      const selGrade = (grade || '').toLowerCase();
      const pMatch = (pClassRaw || '').match(/\d+/) || pClass.match(/class\s*(\d+)/i) || pClass.match(/\d+/);
      const selMatch = selGrade.match(/\d+/);
      const isClassMatch = pMatch && selMatch ? (pMatch[1] || pMatch[0]) === selMatch[0] : pClass.includes(selGrade);
      return isClassMatch && paperHasQuestions(p);
    });
  };

  // Start exam with Super Admin created Paper
  const handleStartAdminPaper = (paper) => {
    if (!paper) {
      alert(`⚠️ No questions found in this exam paper. Please add questions from Super Admin panel.`);
      return;
    }
    const pSub = (paper.subject_code || paper.subject || selectedSubject).toLowerCase();
    const pGrade = paper.class_name || paper.grade || selectedGrade;
    if (!isTestUnlocked(pGrade, pSub)) {
      setSelectedGrade(pGrade);
      if (subjectsMap[pSub]) setSelectedSubject(pSub);
      setPendingAdminPaper(paper);
      setGeneratorStep('checkout');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Resolve questions (from questions array, question_ids, or dynamic generator)
    let rawQuestions = Array.isArray(paper.questions) && paper.questions.length > 0 ? paper.questions : [];
    if (rawQuestions.length === 0 && Array.isArray(paper.question_ids) && paper.question_ids.length > 0) {
      try {
        const qBank = JSON.parse(localStorage.getItem('olympiadhub_db_questions') || '[]');
        rawQuestions = qBank.filter(q => paper.question_ids.includes(q.id));
      } catch (e) {}
    }
    if (rawQuestions.length === 0) {
      try {
        const qBank = JSON.parse(localStorage.getItem('olympiadhub_db_questions') || '[]');
        if (Array.isArray(qBank) && qBank.length > 0) {
          const pClass = (paper.class_name || paper.class || selectedGrade || '').toLowerCase();
          const pSub = (paper.subject_code || paper.subject || selectedSubject || '').toLowerCase();
          const pNum = pClass.match(/\d+/)?.[0] || '';
          const bankMatches = qBank.filter(q => {
            const qc = (q.class_name || q.class || '').toLowerCase();
            const qs = (q.subject || q.subject_name || q.subject_code || '').toLowerCase();
            const cMatch = !pNum || qc.includes(pNum);
            const sMatch = !pSub || qs.includes(pSub) || pSub.includes(qs);
            return cMatch && sMatch;
          });
          if (bankMatches.length > 0) rawQuestions = bankMatches;
        }
      } catch (e) {}
    }
    if (rawQuestions.length === 0) {
      rawQuestions = generateIntelligentOlympiadTest({
        subject: selectedSubject,
        grade: selectedGrade,
        level: selectedLevel,
        difficulty: selectedDifficulty,
        count: Number(paper.total_questions) || questionCount,
        chapters: selectedChapters
      });
    }

    const questionsToUse = rawQuestions.map((q, idx) => {
      const rawImg = q.question_image || q.image_url || q.diagram || q.image || q.figure || '';
      const qImg = getQuestionImage(q) || rawImg;
      return {
        ...q,
        id: q.id || idx + 1,
        q: q.q || q.question_text || `Question ${idx + 1}`,
        question_image: qImg,
        image_url: qImg,
        diagram: qImg,
        image: qImg,
        figure: qImg,
        options: Array.isArray(q.options) && q.options.length >= 2 
          ? q.options 
          : [q.option_a || 'Option A', q.option_b || 'Option B', q.option_c || 'Option C', q.option_d || 'Option D'],
        correct: typeof q.correct === 'number' 
          ? q.correct 
          : (q.correct_option === 'B' ? 1 : q.correct_option === 'C' ? 2 : q.correct_option === 'D' ? 3 : 0),
        explanation: q.explanation || '',
        marks: q.marks || 1
      };
    });
    const dur = parseInt(paper.duration_minutes) || testDurationMinutes || 15;
    setTestQuestions(questionsToUse);
    setQuestionCount(questionsToUse.length);
    setTestDurationMinutes(dur);
    setRemainingSeconds(dur * 60);
    setCurrentIndex(0);
    setUserAnswers({});
    setMarkedForReview({});
    setVisitedQuestions({ 0: true });
    setIsSubmitted(false);
    setTestScore(null);
    setIsTestRunning(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Proceed to Instructions - Enters directly without payment
  const handleProceedToInstructions = () => {
    if (selectedChapters.length === 0) {
      setSelectedChapters(CHAPTERS_BY_SUBJECT[selectedSubject] || []);
    }
    setGeneratorStep('instructions');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Back to Configure
  const handleBackToConfigure = () => {
    setGeneratorStep('configure');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // PDF Terms & Conditions Modal State
  const [pdfModalPaper, setPdfModalPaper] = useState(null);

  const handleOpenPdfForCurrentSetup = () => {
    const targetPaper = getMatchingPaper(selectedGrade, selectedSubject) || (selectedClassSubjectPapers.length > 0 ? selectedClassSubjectPapers[0] : null);
    if (targetPaper && Array.isArray(targetPaper.questions) && targetPaper.questions.length > 0) {
      setPdfModalPaper(targetPaper);
    } else {
      const genQuestions = generateIntelligentOlympiadTest({
        subject: selectedSubject,
        grade: selectedGrade,
        level: selectedLevel,
        difficulty: selectedDifficulty,
        count: Number(questionCount) || 10,
        chapters: selectedChapters.length > 0 ? selectedChapters : (CHAPTERS_BY_SUBJECT[selectedSubject] || [])
      });
      setPdfModalPaper({
        id: `GEN-${Date.now()}`,
        title: `${selectedGrade} ${subjectsMap[selectedSubject]?.name || selectedSubject.toUpperCase()} Practice Paper`,
        class_name: selectedGrade,
        subject_code: selectedSubject.toUpperCase(),
        duration_minutes: testDurationMinutes || 15,
        questions: genQuestions
      });
    }
  };

  // Active Test Session State
  const [isTestRunning, setIsTestRunning] = useState(false);
  const [testQuestions, setTestQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({}); // { [qIndex]: selectedOptionIdx }
  const [markedForReview, setMarkedForReview] = useState({}); // { [qIndex]: boolean }
  const [visitedQuestions, setVisitedQuestions] = useState({ 0: true });
  const [remainingSeconds, setRemainingSeconds] = useState(15 * 60);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [testScore, setTestScore] = useState(null);
  const [testResultSummary, setTestResultSummary] = useState(null);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [isSavingResult, setIsSavingResult] = useState(false);
  const [isSyncedWithAdmin, setIsSyncedWithAdmin] = useState(false);

  // Generated Tests History
  const [generatedTestsHistory, setGeneratedTestsHistory] = useState([]);

  // Timer Countdown Effect
  const timerRef = useRef(null);
  useEffect(() => {
    if (isTestRunning && !isSubmitted && remainingSeconds > 0) {
      timerRef.current = setInterval(() => {
        setRemainingSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            handleSubmitTest();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTestRunning, isSubmitted, remainingSeconds]);

  // Handle Start Test - Uses Super Admin authored questions or generates intelligent practice questions
  const handleStartTest = (paperToStart = null) => {
    const validPapers = selectedClassSubjectPapers.filter((p) => Array.isArray(p.questions) && p.questions.length > 0);
    const targetPaper = paperToStart || (validPapers.length > 0 ? validPapers[0] : null) || getMatchingPaper(selectedGrade, selectedSubject);

    let sourceQuestions = [];
    let dur = testDurationMinutes || 15;

    if (paperToStart && Array.isArray(paperToStart.questions) && paperToStart.questions.length > 0) {
      sourceQuestions = paperToStart.questions;
      dur = parseInt(paperToStart.duration_minutes) || dur;
    } else if (validPapers.length > 1) {
      const seen = new Set();
      validPapers.forEach((vp) => {
        (vp.questions || []).forEach((q) => {
          const key = (q.q || q.question_text || '').trim();
          if (key && !seen.has(key)) {
            seen.add(key);
            sourceQuestions.push(q);
          } else if (!key) {
            sourceQuestions.push(q);
          }
        });
      });
      dur = parseInt(validPapers[0].duration_minutes) || dur;
    } else if (targetPaper && Array.isArray(targetPaper.questions) && targetPaper.questions.length > 0) {
      sourceQuestions = targetPaper.questions;
      dur = parseInt(targetPaper.duration_minutes) || dur;
    } else {
      // 1. First check if Super Admin added questions in Question Bank for this Class & Subject
      let bankQuestions = [];
      try {
        const qBank = JSON.parse(localStorage.getItem('olympiadhub_db_questions') || '[]');
        if (Array.isArray(qBank) && qBank.length > 0) {
          const selNum = (selectedGrade || '').match(/\d+/)?.[0] || '';
          const subKey = (selectedSubject || '').toLowerCase();
          const subObj = subjectsMap[selectedSubject] || {};
          const subCodes = [subKey, (subObj.code || '').toLowerCase(), (subObj.title || '').toLowerCase()];

          bankQuestions = qBank.filter(q => {
            const qClass = (q.class_name || q.class || '').toLowerCase();
            const qSub = (q.subject || q.subject_name || q.subject_code || '').toLowerCase();
            const classMatch = !selNum || qClass.includes(selNum);
            const subMatch = subCodes.some(c => c && (qSub.includes(c) || c.includes(qSub)));
            return classMatch && subMatch;
          });
        }
      } catch (e) {}

      if (bankQuestions.length > 0) {
        sourceQuestions = bankQuestions;
      } else {
        // Intelligently generate Olympiad questions for this Class & Subject
        sourceQuestions = generateIntelligentOlympiadTest({
          subject: selectedSubject,
          grade: selectedGrade,
          level: selectedLevel,
          difficulty: selectedDifficulty,
          count: Number(questionCount) || 10,
          chapters: selectedChapters.length > 0 ? selectedChapters : (CHAPTERS_BY_SUBJECT[selectedSubject] || [])
        });
      }
    }

    const questionsToUse = sourceQuestions.map((q, idx) => {
      const rawImg = q.question_image || q.image_url || q.diagram || q.image || q.figure || '';
      const qImg = getQuestionImage(q) || rawImg;
      return {
        ...q,
        id: q.id || idx + 1,
        q: q.q || q.question_text || `Question ${idx + 1}`,
        question_image: qImg,
        image_url: qImg,
        diagram: qImg,
        image: qImg,
        figure: qImg,
        options: Array.isArray(q.options) && q.options.length >= 2 
          ? q.options 
          : [q.option_a || 'Option A', q.option_b || 'Option B', q.option_c || 'Option C', q.option_d || 'Option D'],
        correct: typeof q.correct === 'number' 
          ? q.correct 
          : (q.correct_option === 'B' ? 1 : q.correct_option === 'C' ? 2 : q.correct_option === 'D' ? 3 : 0),
        explanation: q.explanation || '',
        marks: q.marks || 1
      };
    });

    setTestQuestions(questionsToUse);
    setQuestionCount(questionsToUse.length);
    setTestDurationMinutes(dur);
    setCurrentIndex(0);
    setUserAnswers({});
    setMarkedForReview({});
    setVisitedQuestions({ 0: true });
    setRemainingSeconds(dur * 60);
    setIsSubmitted(false);
    setTestScore(null);
    setIsTestRunning(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Select Answer Option
  const handleSelectOption = (optIdx) => {
    setUserAnswers({
      ...userAnswers,
      [currentIndex]: optIdx
    });
  };

  // Toggle Mark For Review
  const handleToggleReview = () => {
    setMarkedForReview({
      ...markedForReview,
      [currentIndex]: !markedForReview[currentIndex]
    });
  };

  // Clear Option Response
  const handleClearResponse = () => {
    const next = { ...userAnswers };
    delete next[currentIndex];
    setUserAnswers(next);
  };

  // Jump to Question
  const handleJumpToQuestion = (idx) => {
    setCurrentIndex(idx);
    setVisitedQuestions({
      ...visitedQuestions,
      [idx]: true
    });
  };

  // Submit Test & Calculate Results
  const handleSubmitTest = () => {
    if (timerRef.current) clearInterval(timerRef.current);

    let correctCount = 0;
    testQuestions.forEach((q, idx) => {
      if (userAnswers[idx] === q.correct) {
        correctCount++;
      }
    });

    const totalQ = testQuestions.length;
    const pct = Math.round((correctCount / totalQ) * 100);
    const timeSpentSec = testDurationMinutes * 60 - remainingSeconds;
    const spentMins = Math.floor(timeSpentSec / 60);
    const spentSecs = timeSpentSec % 60;
    const timeStr = `${spentMins}m ${spentSecs < 10 ? '0' : ''}${spentSecs}s`;

    const solutionsFormatted = testQuestions.map((q, qIdx) => {
      const uAns = userAnswers[qIdx];
      const isCorrect = uAns === q.correct;
      const optLetter = uAns !== undefined ? String.fromCharCode(65 + uAns) : null;
      const correctLetter = String.fromCharCode(65 + (typeof q.correct === 'number' ? q.correct : 0));

      const rawImg = q.question_image || q.image_url || q.diagram || q.image || q.figure || '';
      const qImg = getQuestionImage(q) || rawImg;
      return {
        ...q,
        id: q.id || qIdx + 1,
        question_text: q.q || q.question_text || `Question ${qIdx + 1}`,
        q: q.q || q.question_text,
        question_image: qImg,
        image_url: qImg,
        diagram: qImg,
        image: qImg,
        figure: qImg,
        options: q.options,
        option_a: q.options?.[0] || q.option_a || 'Option A',
        option_b: q.options?.[1] || q.option_b || 'Option B',
        option_c: q.options?.[2] || q.option_c || 'Option C',
        option_d: q.options?.[3] || q.option_d || 'Option D',
        selected_option: optLetter,
        correct_option: correctLetter,
        is_correct: isCorrect,
        marks: q.marks || 1,
        explanation: q.explanation || 'Refer to the official Olympiad step-by-step logic.'
      };
    });

    const targetPaperForMeta = getMatchingPaper(selectedGrade, selectedSubject);
    const metaFormatted = {
      exam_title: targetPaperForMeta?.title || `${selectedGrade} ${subjectsMap[selectedSubject]?.name || selectedSubject} Practice Test`,
      total_marks: totalQ,
      score: correctCount,
      cutoff_marks: Math.round(totalQ * 0.7),
      time_taken_seconds: timeSpentSec,
      duration_minutes: testDurationMinutes || 15
    };

    const summary = {
      correctCount,
      totalQ,
      pct,
      timeStr,
      subjectName: selectedSubject.toUpperCase(),
      grade: selectedGrade,
      level: selectedLevel,
      difficulty: selectedDifficulty,
      solutions: solutionsFormatted,
      attemptMeta: metaFormatted
    };

    setTestScore(correctCount);
    setTestResultSummary(summary);
    setIsSubmitted(true);

    // Prepare questions payload for Super Admin & Teacher portal
    const formattedQuestions = testQuestions.map((q, idx) => ({
      q: q.q,
      options: q.options,
      correct: q.correct,
      userSelected: userAnswers[idx] !== undefined ? userAnswers[idx] : null,
      explanation: q.explanation || ''
    }));

    const totalAnswered = Object.keys(userAnswers).length;
    const unansweredCount = totalQ - totalAnswered;
    const wrongCount = totalAnswered - correctCount;

    const targetPaper = getMatchingPaper(selectedGrade, selectedSubject);
    const token = apiClient.getToken();
    const cleanStudentName = (user?.full_name || user?.name || user?.login_id || 'Student Candidate')
      .split(/[@._\s]+/)
      .filter(Boolean)
      .map(p => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase())
      .join(' ');
    const cleanSchoolName = user?.school_name || user?.school || 'Gwalior Glory High School';
    const cleanLoginId = user?.login_id || 'STU-001';

    const payload = {
      exam_id: targetPaper?.id || null,
      student_id: user?.id || null,
      student_name: cleanStudentName,
      student_login_id: cleanLoginId,
      student_email: user?.email || null,
      student_school: cleanSchoolName,
      student_class: user?.class_name || selectedGrade,
      subject: selectedSubject,
      grade: selectedGrade,
      level: selectedLevel,
      difficulty: selectedDifficulty,
      totalQuestions: totalQ,
      durationMinutes: testDurationMinutes,
      timeSpentSeconds: timeSpentSec,
      score: correctCount,
      totalMarks: totalQ,
      percentage: pct,
      correctCount,
      wrongCount: Math.max(0, wrongCount),
      unansweredCount: Math.max(0, unansweredCount),
      questions: formattedQuestions
    };

    setIsSavingResult(true);
    const newAttemptRecord = {
      id: Date.now(),
      attempt_id: Date.now(),
      exam_id: targetPaper?.id || Date.now(),
      exam_title: `${selectedGrade} ${subjectsMap[selectedSubject]?.name || selectedSubject} Practice Test`,
      title: `${selectedGrade} ${subjectsMap[selectedSubject]?.name || selectedSubject} Practice Test`,
      paper_title: `${selectedGrade} ${subjectsMap[selectedSubject]?.name || selectedSubject} Practice Test`,
      subject: subjectsMap[selectedSubject]?.name || selectedSubject,
      subject_name: subjectsMap[selectedSubject]?.name || selectedSubject,
      subject_code: selectedSubject?.toUpperCase() || 'IMO',
      score: correctCount,
      total_marks: totalQ,
      total_questions: totalQ,
      correct_count: correctCount,
      incorrect_count: Math.max(0, wrongCount),
      unanswered_count: Math.max(0, unansweredCount),
      percentage: pct,
      accuracy: totalAnswered > 0 ? Math.round((correctCount / totalAnswered) * 100) : pct,
      passed: pct >= 40,
      time_taken_seconds: timeSpentSec,
      submitted_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
      student_id: user?.id || 1,
      student_name: cleanStudentName,
      student_login_id: cleanLoginId,
      student_email: user?.email || '',
      student_school: cleanSchoolName,
      school_name: cleanSchoolName,
      class_name: user?.class_name || selectedGrade,
      questions: formattedQuestions
    };

    try {
      const existing = JSON.parse(localStorage.getItem('olympiadhub_student_attempts') || '[]');
      localStorage.setItem('olympiadhub_student_attempts', JSON.stringify([newAttemptRecord, ...existing]));
      const existingResults = JSON.parse(localStorage.getItem('olympiadhub_db_results') || '[]');
      localStorage.setItem('olympiadhub_db_results', JSON.stringify([newAttemptRecord, ...existingResults]));
    } catch (e) {}

    apiClient.post('/test-generator/submit', payload)
      .then((data) => {
        setIsSyncedWithAdmin(true);
        window.dispatchEvent(new CustomEvent('olympiad-exam-submitted', { detail: newAttemptRecord }));
        window.dispatchEvent(new Event('exam-submitted'));
      })
      .catch((err) => {
        console.warn('Auto-save test to admin error:', err);
        window.dispatchEvent(new CustomEvent('olympiad-exam-submitted', { detail: newAttemptRecord }));
        window.dispatchEvent(new Event('exam-submitted'));
      })
      .finally(() => {
        setIsSavingResult(false);
      });

    // Add to history
    const newRecord = {
      id: `GEN-${Math.floor(10000 + Math.random() * 90000)}`,
      title: `${selectedSubject.toUpperCase()} ${selectedLevel} ${selectedDifficulty} Test`,
      grade: selectedGrade,
      subject: selectedSubject,
      level: selectedLevel,
      difficulty: selectedDifficulty,
      date: new Date().toISOString().split('T')[0],
      score: `${correctCount}/${totalQ} (${pct}%)`,
      status: 'Completed',
      duration: timeStr
    };
    setGeneratedTestsHistory([newRecord, ...generatedTestsHistory]);
  };

  // Format Timer Display
  const formatTimer = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // =========================================================================
  // VIEW: DETAILED SOLUTIONS & PERFORMANCE REVIEW (Matching user screenshot)
  // =========================================================================
  if (isSubmitted && testResultSummary) {
    return (
      <DetailedSolutionsPage
        initialSolutions={testResultSummary.solutions}
        initialAttemptMeta={testResultSummary.attemptMeta}
        onBack={() => {
          setIsTestRunning(false);
          setIsSubmitted(false);
          if (onExitToDashboard) onExitToDashboard();
        }}
        onGoToList={() => {
          setIsTestRunning(false);
          setIsSubmitted(false);
          if (onExitToDashboard) onExitToDashboard();
        }}
        onViewAnalysis={() => {
          if (onNavigateTab) onNavigateTab('performance');
        }}
        onNavigateTab={onNavigateTab}
      />
    );
  }

  if (false && isSubmitted && testResultSummary) {
    const isGold = testResultSummary.pct >= 80;
    const isPass = testResultSummary.pct >= 40;

    return (
      <div className="min-h-screen bg-slate-50 font-sans pb-20 animate-in fade-in duration-150">
        {/* Top Header Bar */}
        <div className="bg-white border-b border-slate-200/80 sticky top-0 z-30 shadow-2xs">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setIsTestRunning(false);
                  setIsSubmitted(false);
                  if (onExitToDashboard) onExitToDashboard();
                }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Exit to Dashboard</span>
              </button>
              <div className="h-5 w-px bg-slate-200 hidden sm:block" />
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 block">
                  Examination Result &amp; Evaluation
                </span>
                <h1 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                  Performance Scorecard Report
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold shadow-2xs transition-all inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5 text-slate-500" />
                <span>Print Scorecard</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsTestRunning(false);
                  setIsSubmitted(false);
                  handleStartTest();
                }}
                className="px-4 py-1.5 bg-gradient-to-r from-[#ec4899] via-[#8b5cf6] to-[#3b82f6] hover:from-[#db2777] hover:via-[#7c3aed] hover:to-[#2563eb] text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-md cursor-pointer flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retake Test ⚡</span>
              </button>
            </div>
          </div>
        </div>

        {/* Content Container */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">
          
          {/* Hero Banner Card */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs text-center space-y-4 relative overflow-hidden">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-100 to-amber-200 text-amber-600 mx-auto flex items-center justify-center shadow-md shadow-amber-500/10">
              <Trophy className="w-10 h-10" />
            </div>

            <div className="space-y-1">
              <span className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-black uppercase tracking-wider ${
                isPass ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
              }`}>
                <span className={`w-2 h-2 rounded-full ${isPass ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                {isPass ? 'QUALIFIED & PASSED' : 'NEEDS PRACTICE'}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Test Completed Successfully!
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                {testResultSummary.subjectName} • {testResultSummary.grade} • {testResultSummary.level} ({testResultSummary.difficulty})
              </p>
            </div>

            {/* Sync Confirmation Badge */}
            <div className="inline-flex items-center gap-2 py-1.5 px-4 bg-emerald-50 border border-emerald-200 rounded-full text-xs font-bold text-emerald-800">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                {isSavingResult ? 'Saving result to Super Admin Portal...' : '✓ Result Verified & Synced with Super Admin & Teacher Portals'}
              </span>
            </div>

            {/* 4 Score Highlights Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-100">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/60 text-center">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Final Score</p>
                <p className="text-2xl font-black text-slate-900 font-mono mt-1">
                  {testResultSummary.correctCount} <span className="text-xs text-slate-400 font-normal">/ {testResultSummary.totalQ}</span>
                </p>
              </div>

              <div className="p-4 bg-emerald-50/70 rounded-2xl border border-emerald-200/70 text-center">
                <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">Accuracy</p>
                <p className="text-2xl font-black text-emerald-700 font-mono mt-1">
                  {testResultSummary.pct}%
                </p>
              </div>

              <div className="p-4 bg-indigo-50/70 rounded-2xl border border-indigo-200/70 text-center">
                <p className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider">Time Spent</p>
                <p className="text-2xl font-black text-indigo-700 font-mono mt-1">
                  {testResultSummary.timeStr}
                </p>
              </div>

              <div className="p-4 bg-amber-50/70 rounded-2xl border border-amber-200/70 text-center">
                <p className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">Distinction</p>
                <p className="text-sm font-black text-amber-800 mt-2">
                  {isGold ? '🌟 Gold Merit' : isPass ? '🥈 Qualified' : '📘 Keep Practicing'}
                </p>
              </div>
            </div>
          </div>

          {/* Detailed Question-by-Question Solution Section */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  Detailed Question-by-Question Solution Key
                </h3>
                <p className="text-xs text-slate-500">
                  Review every question, your selected option, verified correct answer, and explanation.
                </p>
              </div>
              <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-lg">
                {testResultSummary.correctCount} of {testResultSummary.totalQ} Correct
              </span>
            </div>

            {/* Questions List */}
            <div className="space-y-4">
              {testQuestions.map((q, qIdx) => {
                const uAns = userAnswers[qIdx];
                const isCorrect = uAns === q.correct;
                const isUnanswered = uAns === undefined;

                return (
                  <div
                    key={qIdx}
                    className={`p-5 rounded-2xl border transition-all ${
                      isCorrect
                        ? 'bg-emerald-50/20 border-emerald-200'
                        : isUnanswered
                        ? 'bg-slate-50/60 border-slate-200'
                        : 'bg-rose-50/20 border-rose-200'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-2.5">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-slate-900 text-white font-mono font-bold text-xs flex items-center justify-center">
                          {qIdx + 1}
                        </span>
                        <span className="text-xs font-bold text-slate-500">
                          Question #{qIdx + 1}
                        </span>
                      </div>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        isCorrect
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : isUnanswered
                          ? 'bg-slate-200 text-slate-700'
                          : 'bg-rose-100 text-rose-800 border border-rose-200'
                      }`}>
                        {isCorrect ? '✓ Correct (+1 Mark)' : isUnanswered ? '○ Not Attempted' : '✕ Incorrect (0 Marks)'}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 leading-relaxed mb-3">
                      {q.q}
                    </h4>

                    {/* Options Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                      {q.options?.map((opt, optIdx) => {
                        const optLabel = String.fromCharCode(65 + optIdx);
                        const isChosen = uAns === optIdx;
                        const isRightOpt = q.correct === optIdx;

                        let optClass = 'bg-white border-slate-200 text-slate-700';
                        if (isRightOpt) {
                          optClass = 'bg-emerald-100/70 border-emerald-300 text-emerald-900 font-bold';
                        } else if (isChosen && !isRightOpt) {
                          optClass = 'bg-rose-100/70 border-rose-300 text-rose-900 font-bold line-through';
                        }

                        return (
                          <div
                            key={optIdx}
                            className={`p-2.5 rounded-xl border text-xs flex items-center gap-2.5 ${optClass}`}
                          >
                            <span className={`w-5 h-5 rounded-md flex items-center justify-center font-bold text-[10px] ${
                              isRightOpt ? 'bg-emerald-600 text-white' : isChosen ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-600'
                            }`}>
                              {optLabel}
                            </span>
                            <span className="flex-1">{opt}</span>
                            {isRightOpt && <span className="text-[10px] font-black text-emerald-800">✓ Correct</span>}
                            {isChosen && !isRightOpt && <span className="text-[10px] font-black text-rose-800">Your Pick</span>}
                          </div>
                        );
                      })}
                    </div>

                    {q.explanation && (
                      <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200/60 text-xs text-amber-900 space-y-0.5">
                        <span className="font-bold text-[11px] block text-amber-800">💡 Step-by-Step Explanation:</span>
                        <p>{q.explanation}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Bottom Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-6 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  setIsTestRunning(false);
                  setIsSubmitted(false);
                  if (onExitToDashboard) onExitToDashboard();
                }}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
              >
                Back to Dashboard
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsTestRunning(false);
                  setIsSubmitted(false);
                  handleStartTest();
                }}
                className="px-6 py-2.5 rounded-xl text-xs font-black text-white bg-gradient-to-r from-[#ec4899] via-[#8b5cf6] to-[#3b82f6] hover:from-[#db2777] hover:via-[#7c3aed] hover:to-[#2563eb] transition-all cursor-pointer shadow-md flex items-center gap-2"
              >
                <span>Generate Another Test</span>
                <Sparkles className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // RENDER: ACTIVE MCQ TEST ENGINE (When Test Is Running)
  // =========================================================================
  if (isTestRunning) {
    const currentQ = testQuestions[currentIndex] || {};
    const isAnswered = userAnswers[currentIndex] !== undefined;
    const isMarked = !!markedForReview[currentIndex];
    const totalAnswered = Object.keys(userAnswers).length;
    const totalMarked = Object.values(markedForReview).filter(Boolean).length;

    return (
      <div className="space-y-5 font-sans animate-in fade-in duration-150 max-w-7xl mx-auto pb-12">
        {/* Top Clean Test Bar (Properly spaced without overlapping) */}
        <div className="bg-white rounded-3xl border border-[#edd6ed] p-4 sm:p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#f4ebf4] text-[#6d3a68] flex items-center justify-center font-black text-sm">
              Q{currentIndex + 1}
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-black text-[#4e2a4a]">
                {subjectsMap[selectedSubject]?.name} — {selectedGrade} ({selectedLevel} {selectedDifficulty})
              </h2>
              <p className="text-xs text-slate-500 font-semibold">
                Question {currentIndex + 1} of {testQuestions.length} • Single Choice MCQ
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-center">
            {/* Countdown Timer */}
            <div className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border font-mono font-black text-sm ${
              remainingSeconds < 180
                ? 'bg-red-50 text-red-600 border-red-200 animate-pulse'
                : 'bg-[#faf5fa] text-[#6d3a68] border-[#edd6ed]'
            }`}>
              <Clock className="w-4 h-4" />
              <span>{formatTimer(remainingSeconds)}</span>
            </div>

            {/* Exit Test */}
            <button
              type="button"
              onClick={() => setShowExitConfirm(true)}
              className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
            >
              Exit
            </button>

            {/* Submit Button */}
            <button
              type="button"
              onClick={() => setShowExitConfirm(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#fff0f3] hover:bg-[#ffe3e8] text-[#c2185b] border border-[#f8bbd0] font-bold text-xs sm:text-sm shadow-xs transition-all active:scale-95 cursor-pointer"
            >
              <Send className="w-4 h-4 text-[#c2185b]" />
              <span>Submit Test</span>
            </button>
          </div>
        </div>

        {/* Modal: Submit / Exit Confirmation (Matching exact design from user screenshot) */}
        {showExitConfirm && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
            <div className="bg-white rounded-xl max-w-lg w-full p-6 sm:p-7 border border-slate-300 shadow-2xl space-y-6 relative animate-in zoom-in-95">
              <button
                type="button"
                onClick={() => setShowExitConfirm(false)}
                className="absolute top-3 right-3 text-slate-400 hover:text-slate-600 p-1 text-sm font-bold cursor-pointer"
                title="Close and stay in test"
              >
                ✕
              </button>

              <div className="pt-2">
                <p className="text-sm sm:text-[15px] font-normal text-slate-800 leading-relaxed">
                  Do you want to end test? Please make sure all attempted questions are marked GREEN.
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowExitConfirm(false);
                    handleSubmitTest();
                  }}
                  className="px-6 py-2 rounded bg-[#0284c7] hover:bg-[#0369a1] text-white font-black text-xs uppercase tracking-wider shadow-sm active:scale-95 transition-all cursor-pointer"
                >
                  YES
                </button>
                <button
                  type="button"
                  onClick={() => setShowExitConfirm(false)}
                  className="px-6 py-2 rounded bg-[#dc2626] hover:bg-[#b91c1c] text-white font-black text-xs uppercase tracking-wider shadow-sm active:scale-95 transition-all cursor-pointer"
                >
                  NO
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 2-Column Test Layout: Left (Question & Options) + Right (Question Palette 1,2,3...) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* LEFT 8 COLS: 1-by-1 MCQ Viewer */}
          <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-7 border border-[#edd6ed] shadow-sm flex flex-col justify-between min-h-[480px]">
            <div className="space-y-5">
              {/* Question Header */}
              <div className="flex items-center justify-between pb-3 border-b border-[#f4ebf4]">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#f4ebf4] text-[#6d3a68] font-black text-xs uppercase">
                    Question {currentIndex + 1}
                  </span>
                  {isMarked && (
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold text-xs flex items-center gap-1">
                      <Bookmark className="w-3 h-3 fill-amber-700" />
                      Marked for Review
                    </span>
                  )}
                </div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  +1.00 Marks
                </span>
              </div>

              {/* Question Statement */}
              <div>
                <h3 className="text-base sm:text-lg font-bold text-[#321630] leading-relaxed">
                  {getCleanQuestionText(currentQ.q || currentQ.question_text)}
                </h3>
              </div>

              {/* Question Diagram - Matches Super Admin Exactly with Zoom modal */}
              <QuestionDiagram
                question={currentQ}
                title="Question Diagram / Figure"
                maxHeight="max-h-80 sm:max-h-96"
              />

              {/* 4 Selectable Options (A, B, C, D) */}
              <div className="space-y-3 pt-2">
                {currentQ.options?.map((optionText, optIdx) => {
                  const isSelected = userAnswers[currentIndex] === optIdx;
                  const optionLabel = String.fromCharCode(65 + optIdx);
                  const isOptImg = isImageString(optionText);

                  return (
                    <button
                      key={optIdx}
                      type="button"
                      onClick={() => handleSelectOption(optIdx)}
                      className={`w-full p-4 rounded-2xl border text-left text-xs sm:text-sm font-semibold transition-all flex items-center justify-between cursor-pointer group ${
                        isSelected
                          ? 'bg-[#f4ebf4] border-[#6d3a68] text-[#4e2a4a] ring-2 ring-[#6d3a68]/20 shadow-xs'
                          : 'bg-white border-[#edd6ed] text-slate-700 hover:bg-[#faf5fa] hover:border-[#6d3a68]/40'
                      }`}
                    >
                      <div className="flex items-center gap-3.5 min-w-0 flex-1">
                        <span className={`w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs transition-all shrink-0 ${
                          optionLabel === 'A'
                            ? isSelected
                              ? 'bg-red-100 border-2 border-red-400 text-red-700 ring-2 ring-red-200 shadow-xs'
                              : 'bg-red-50 border border-red-200 text-red-700 hover:bg-red-100'
                            : optionLabel === 'B'
                            ? isSelected
                              ? 'bg-emerald-100 border-2 border-emerald-400 text-emerald-700 ring-2 ring-emerald-200 shadow-xs'
                              : 'bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100'
                            : optionLabel === 'C'
                            ? isSelected
                              ? 'bg-amber-100 border-2 border-amber-400 text-amber-800 ring-2 ring-amber-200 shadow-xs'
                              : 'bg-amber-50 border border-amber-200 text-amber-800 hover:bg-amber-100'
                            : optionLabel === 'D'
                            ? isSelected
                              ? 'bg-orange-100 border-2 border-orange-400 text-orange-800 ring-2 ring-orange-200 shadow-xs'
                              : 'bg-orange-50 border border-orange-200 text-orange-800 hover:bg-orange-100'
                            : isSelected
                            ? 'bg-[#6d3a68]/20 text-[#6d3a68]'
                            : 'bg-[#faf5fa] text-slate-600 group-hover:bg-[#f4ebf4] group-hover:text-[#6d3a68]'
                        }`}>
                          {optionLabel}
                        </span>
                        {isOptImg ? (
                          <div className="p-1 rounded-xl bg-white border border-slate-200 shadow-2xs inline-block">
                            <img
                              src={getOptionImageSrc(optionText)}
                              alt={`Option ${optionLabel}`}
                              className="max-h-20 max-w-full object-contain rounded-lg"
                            />
                          </div>
                        ) : (
                          <span className="leading-snug">{optionText}</span>
                        )}
                      </div>

                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-gradient-to-r from-[#ec4899] via-[#8b5cf6] to-[#3b82f6] text-white flex items-center justify-center shrink-0 ml-2">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bottom Action Controls */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-6 border-t border-[#f4ebf4] mt-6">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleToggleReview}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                    isMarked
                      ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                      : 'bg-[#faf5fa] text-slate-600 hover:bg-[#f4ebf4] hover:text-[#6d3a68]'
                  }`}
                >
                  <Bookmark className={`w-3.5 h-3.5 ${isMarked ? 'fill-amber-700' : ''}`} />
                  <span>{isMarked ? 'Unmark Review' : 'Mark for Review'}</span>
                </button>

                {isAnswered && (
                  <button
                    type="button"
                    onClick={handleClearResponse}
                    className="px-3 py-2 rounded-xl text-xs font-bold text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Clear Response</span>
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleJumpToQuestion(Math.max(0, currentIndex - 1))}
                  disabled={currentIndex === 0}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 bg-[#faf5fa] hover:bg-[#f4ebf4] disabled:opacity-40 transition-colors cursor-pointer flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                {currentIndex < testQuestions.length - 1 ? (
                  <button
                    type="button"
                    onClick={() => handleJumpToQuestion(currentIndex + 1)}
                    className="px-5 py-2 rounded-xl text-xs font-black text-white bg-gradient-to-r from-[#ec4899] via-[#8b5cf6] to-[#3b82f6] hover:from-[#db2777] hover:via-[#7c3aed] hover:to-[#2563eb] transition-all cursor-pointer shadow-sm flex items-center gap-1"
                  >
                    <span>Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowExitConfirm(true)}
                    className="px-6 py-2 rounded-xl text-xs font-black text-[#c2185b] bg-[#fff0f3] hover:bg-[#ffe3e8] border border-[#f8bbd0] transition-all cursor-pointer shadow-xs flex items-center gap-2"
                  >
                    <Send className="w-3.5 h-3.5 text-[#c2185b]" />
                    <span>Submit Test</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT 4 COLS: Right-Side 1, 2, 3... Question Palette */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white rounded-3xl p-5 border border-[#edd6ed] shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#f4ebf4]">
                <h4 className="text-xs font-black text-[#4e2a4a] uppercase tracking-wider">
                  Question Palette
                </h4>
                <span className="text-[11px] font-bold text-slate-400">
                  {totalAnswered} / {testQuestions.length} Answered
                </span>
              </div>

              {/* Status Legend */}
              <div className="grid grid-cols-2 gap-2 text-[10px] font-bold text-slate-600 pb-1">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-md bg-[#00b074]" />
                  <span>Answered ({totalAnswered})</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-md bg-amber-400" />
                  <span>Review ({totalMarked})</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-md bg-[#6d3a68]" />
                  <span>Current</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-md bg-slate-200" />
                  <span>Not Visited</span>
                </div>
              </div>

              {/* Grid of 1, 2, 3... Boxes */}
              <div className="grid grid-cols-5 gap-2 pt-2">
                {testQuestions.map((_, qIdx) => {
                  const ans = userAnswers[qIdx] !== undefined;
                  const rev = markedForReview[qIdx];
                  const isCur = currentIndex === qIdx;
                  const isVis = visitedQuestions[qIdx];

                  let boxClass = 'bg-slate-100 text-slate-600 border-slate-200';
                  if (isCur) {
                    boxClass = 'bg-gradient-to-r from-[#ec4899] via-[#8b5cf6] to-[#3b82f6] text-white border-[#6d3a68] ring-2 ring-[#6d3a68]/30 font-black shadow-xs';
                  } else if (rev) {
                    boxClass = 'bg-amber-400 text-slate-900 border-amber-500 font-bold';
                  } else if (ans) {
                    boxClass = 'bg-[#00b074] text-white border-[#00b074] font-bold';
                  } else if (isVis) {
                    boxClass = 'bg-slate-200 text-slate-700 border-slate-300';
                  }

                  return (
                    <button
                      key={qIdx}
                      type="button"
                      onClick={() => handleJumpToQuestion(qIdx)}
                      className={`h-10 rounded-xl border text-xs flex items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95 ${boxClass}`}
                      title={`Go to Question ${qIdx + 1}`}
                    >
                      {qIdx + 1}
                    </button>
                  );
                })}
              </div>

              {/* Summary Stats in Palette */}
              <div className="pt-3 border-t border-[#f4ebf4] text-center">
                <p className="text-[11px] text-slate-500 font-medium">
                  Click any question number box to jump directly to it.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const studentClass = user?.class || user?.class_name || user?.grade || 'Class 6';

  // =========================================================================
  // RENDER: GENERATOR & SUMMARY SETUP VIEW (Matching user screenshots)
  // =========================================================================
  return (
    <div className="space-y-6 font-sans animate-in fade-in duration-150 max-w-7xl mx-auto pb-12">
      {/* Top Header Tabs: [ 🎯 Practice Mock Tests & AI Generator ] & [ 📊 Attempt History ] */}
      <div className="flex items-center gap-2 flex-wrap">
        <button
          type="button"
          onClick={() => {
            setActiveTab('tests');
            setGeneratorStep('configure');
          }}
          className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer shadow-2xs flex items-center gap-2 ${
            activeTab === 'tests' || activeTab === 'generator'
              ? 'bg-[#00b074] text-white shadow-md'
              : 'bg-white text-slate-700 border border-[#edd6ed] hover:bg-[#faf5fa]'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Practice Mock Tests &amp; AI Generator ({selectedClassSubjectPapers.length})</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('list')}
          className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer shadow-2xs flex items-center gap-2 ${
            activeTab === 'list'
              ? 'bg-[#00b074] text-white shadow-md'
              : 'bg-white text-slate-700 border border-[#edd6ed] hover:bg-[#faf5fa]'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Attempt History ({generatedTestsHistory.length})</span>
        </button>
      </div>

      {generatorStep === 'checkout' ? (
        /* ========================================================================= */
        /* STEP 2 OF 3: FULL-PAGE PAYMENT & QR SCANNER CHECKOUT SCREEN               */
        /* ========================================================================= */
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-[#edd6ed] shadow-lg space-y-6 animate-in fade-in zoom-in-95">
          {/* Top Header with Back to Setup */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#f4ebf4]">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleBackToConfigure}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Back to Customizer</span>
                </button>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-black uppercase tracking-wider border border-amber-200">
                  Step 2 of 3: Payment &amp; Scanner
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-[#4e2a4a] pt-1">
                Unlock Practice Mock Test — {selectedGrade} ({subjectsMap[selectedSubject]?.name || selectedSubject})
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Scan QR Code with any UPI app to unlock complete mock test series, timer, and detailed step-by-step solutions.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Instant Auto-Unlock
              </span>
            </div>
          </div>

          {paymentStep === 'success' ? (
            <div className="py-12 text-center space-y-4 animate-in zoom-in-95 duration-300">
              <div className="w-20 h-20 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-lg animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-black text-slate-800">
                🎉 Payment Verified Successfully!
              </h3>
              <p className="text-sm text-slate-500 font-medium max-w-md mx-auto">
                {selectedGrade} ({subjectsMap[selectedSubject]?.name || selectedSubject}) Practice Test is unlocked. Opening Exam Guidelines...
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* LEFT 7 COLS: Big UPI QR Scanner & UPI Details */}
              <div className="lg:col-span-7 bg-[#faf5fa] rounded-3xl p-6 border border-[#edd6ed] space-y-5">
                {/* Method Tabs */}
                <div className="grid grid-cols-2 gap-2 p-1 bg-white rounded-2xl border border-slate-200">
                  <button
                    type="button"
                    onClick={() => setSelectedPayMethod('upi_qr')}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      selectedPayMethod === 'upi_qr'
                        ? 'bg-[#6d3a68] text-white shadow-sm font-black'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <QrCode className="w-4 h-4" />
                    <span>UPI QR &amp; Apps</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedPayMethod('card')}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      selectedPayMethod === 'card'
                        ? 'bg-[#6d3a68] text-white shadow-sm font-black'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Direct Bank Transfer</span>
                  </button>
                </div>

                {selectedPayMethod === 'upi_qr' ? (
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row items-center gap-5 p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
                      {/* Dynamic QR Code */}
                      <div className="p-3 bg-white rounded-2xl shadow-md border-2 border-[#edd6ed] shrink-0 text-center">
                        <img
                          src={
                            bankSettings.qr_code_url ||
                            `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
                              `upi://pay?pa=${bankSettings.upi_id || 'olympiadhub@icici'}&pn=${encodeURIComponent(
                                bankSettings.merchant_name || 'Olympiad Foundation'
                              )}&am=${bankSettings.test_pack_price || 99}&cu=INR`
                            )}`
                          }
                          alt="Scan & Pay UPI QR"
                          className="w-36 h-36 object-contain rounded-xl mx-auto"
                        />
                        <p className="text-[10px] font-black text-[#6d3a68] uppercase tracking-wider mt-2">
                          Scan to Pay ₹{bankSettings.test_pack_price || 99}
                        </p>
                      </div>

                      {/* UPI Details & Supported Apps */}
                      <div className="space-y-3 flex-1 text-center sm:text-left w-full">
                        <div>
                          <h4 className="text-sm font-black text-slate-800">
                            Scan with any UPI App:
                          </h4>
                          <div className="flex items-center justify-center sm:justify-start gap-1.5 flex-wrap mt-1.5">
                            <span className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-xs font-black text-slate-700">Google Pay</span>
                            <span className="px-2.5 py-1 rounded-lg bg-indigo-50 border border-indigo-200 text-xs font-black text-indigo-700">PhonePe</span>
                            <span className="px-2.5 py-1 rounded-lg bg-sky-50 border border-sky-200 text-xs font-black text-sky-700">Paytm</span>
                            <span className="px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-xs font-black text-emerald-700">BHIM UPI</span>
                          </div>
                        </div>

                        {/* UPI ID & Copy */}
                        <div className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                          <div className="min-w-0 text-left">
                            <p className="text-[9px] text-slate-400 font-bold uppercase">Official UPI ID</p>
                            <p className="text-xs font-mono font-bold text-slate-800 truncate">
                              {bankSettings.upi_id || 'olympiadhub@icici'}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={handleCopyUpi}
                            className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer shrink-0 border border-slate-200"
                          >
                            {copiedUpi ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                                <span className="text-emerald-700">Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>Copy</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* UTR Input (Mandatory for unlock) */}
                    <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-2.5 shadow-2xs">
                      <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                        <span className="flex items-center gap-1">
                          <span>12-Digit UPI / Bank Reference No (UTR)</span>
                          <span className="text-rose-600 font-black text-sm">*</span>
                        </span>
                        <span className="text-[10px] text-rose-600 font-black bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200 uppercase tracking-wide">
                          Mandatory to Unlock
                        </span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 429182746192 (From GPay, PhonePe, Paytm, etc.)"
                        value={utrNumber}
                        onChange={(e) => {
                          setUtrNumber(e.target.value);
                          if (paymentError) setPaymentError('');
                        }}
                        className={`w-full px-3.5 py-2.5 rounded-xl border ${
                          paymentError ? 'border-rose-500 bg-rose-50/30 ring-2 ring-rose-200' : 'border-slate-300'
                        } text-xs font-mono focus:ring-2 focus:ring-[#6d3a68] outline-none transition-all`}
                      />
                      <p className="text-[10px] text-slate-500 font-medium leading-relaxed">
                        ⚠️ <strong className="text-slate-700">Payment verification mandatory:</strong> Scan the QR code, pay ₹{bankSettings.test_pack_price || 99}, and paste the 12-digit UTR/Txn ID from your UPI app. The practice test will unlock once verified.
                      </p>
                      {paymentError && (
                        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2 animate-in fade-in">
                          <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
                          <span>{paymentError}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  /* Direct Bank Transfer */
                  <div className="space-y-4 p-5 rounded-2xl bg-white border border-slate-200 text-xs shadow-2xs">
                    <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider">
                      Official Bank Account Details
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                        <p className="text-[10px] text-slate-400 font-bold uppercase">Account Name</p>
                        <p className="font-black text-slate-800 mt-0.5">{bankSettings.merchant_name || 'Olympiad Foundation'}</p>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                        <p className="text-[10px] text-slate-400 font-bold uppercase">Bank Name</p>
                        <p className="font-black text-slate-800 mt-0.5">{bankSettings.bank_name || 'ICICI Bank'}</p>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                        <p className="text-[10px] text-slate-400 font-bold uppercase">Account Number</p>
                        <p className="font-mono font-black text-slate-800 mt-0.5">{bankSettings.account_number || '1029384756'}</p>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                        <p className="text-[10px] text-slate-400 font-bold uppercase">IFSC Code</p>
                        <p className="font-mono font-black text-slate-800 mt-0.5">{bankSettings.ifsc || 'ICIC0001029'}</p>
                      </div>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-slate-100">
                      <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                        <span className="flex items-center gap-1">
                          <span>Transfer Reference / Transaction ID</span>
                          <span className="text-rose-600 font-black text-sm">*</span>
                        </span>
                        <span className="text-[10px] text-rose-600 font-black bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200 uppercase tracking-wide">
                          Mandatory to Unlock
                        </span>
                      </label>
                      <input
                        type="text"
                        placeholder="Enter IMPS / NEFT / Txn Reference No."
                        value={utrNumber}
                        onChange={(e) => {
                          setUtrNumber(e.target.value);
                          if (paymentError) setPaymentError('');
                        }}
                        className={`w-full px-3.5 py-2.5 rounded-xl border ${
                          paymentError ? 'border-rose-500 bg-rose-50/30 ring-2 ring-rose-200' : 'border-slate-300'
                        } text-xs font-mono focus:ring-2 focus:ring-[#6d3a68] outline-none transition-all`}
                      />
                      {paymentError && (
                        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2 animate-in fade-in">
                          <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
                          <span>{paymentError}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* RIGHT 5 COLS: Order Summary & Pay Button */}
              <div className="lg:col-span-5 flex flex-col justify-between bg-white rounded-3xl p-6 border-2 border-[#edd6ed] shadow-sm space-y-6">
                <div className="space-y-4">
                  <h3 className="text-base font-black text-[#2e1065] tracking-tight border-b border-slate-100 pb-3">
                    Order Summary
                  </h3>

                  <div className="space-y-2.5 text-xs">
                    <div className="flex justify-between items-center py-1">
                      <span className="text-slate-500 font-semibold">Target Grade</span>
                      <span className="font-black text-slate-800">{selectedGrade}</span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-slate-500 font-semibold">Olympiad Subject</span>
                      <span className="font-black text-slate-800 uppercase">{subjectsMap[selectedSubject]?.name || selectedSubject}</span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-slate-500 font-semibold">Questions / Time</span>
                      <span className="font-black text-slate-800">
                        {hasMatchingPaper ? `${matchingPaper.questions.length} MCQs` : `${questionCount} MCQs`} / {matchingPaper?.duration_minutes || testDurationMinutes} Mins
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-slate-500 font-semibold">Detailed Solutions</span>
                      <span className="font-black text-emerald-600">Included (Step-by-Step)</span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-slate-500 font-semibold">National Percentile &amp; Rank</span>
                      <span className="font-black text-emerald-600">Instant Report</span>
                    </div>
                  </div>

                  {/* Price Box */}
                  <div className="p-4 rounded-2xl bg-[#faf5fa] border border-[#edd6ed] flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">Total Amount</p>
                      <p className="text-xs text-emerald-700 font-bold">Special Offer 67% OFF</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs line-through text-slate-400 font-bold mr-1.5">
                        ₹{bankSettings.original_price || 299}
                      </span>
                      <span className="text-3xl font-black text-[#6d3a68]">
                        ₹{bankSettings.test_pack_price || 99}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 text-[11px] text-slate-500 font-medium">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>One-time payment for complete practice package</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Next step: View exam guidelines &amp; start timer</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2.5 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    disabled={isProcessingPayment}
                    onClick={handleCompletePayment}
                    className="w-full py-3.5 rounded-2xl bg-[#00b074] hover:bg-[#009260] text-white shadow-lg hover:shadow-xl text-sm font-black uppercase tracking-wider transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-2"
                  >
                    {isProcessingPayment ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Unlocking Test...</span>
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4 text-amber-300 fill-current" />
                        <span>✓ Instant Unlock &amp; Start Test (Free Access)</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={handleBackToConfigure}
                    className="w-full py-2 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer text-center"
                  >
                    ← Cancel &amp; Back to Customizer
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : generatorStep === 'instructions' ? (
        /* ========================================================================= */
        /* STEP 3 OF 3: INSTRUCTIONS & EXAM GUIDELINES SCREEN                        */
        /* ========================================================================= */
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-[#edd6ed] shadow-lg space-y-6 animate-in fade-in zoom-in-95">
          {/* Top Header with Back to Setup */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#f4ebf4]">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleBackToConfigure}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Back to Setup</span>
                </button>
                <span className="px-2.5 py-0.5 rounded-full bg-[#f4ebf4] text-[#6d3a68] text-[10px] font-black uppercase">
                  Step 3 of 3: Exam Instructions
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-[#4e2a4a] pt-1">
                Test Guidelines &amp; Instructions
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Please review your test summary and read all instructions carefully before starting.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={handleOpenPdfForCurrentSetup}
                className="px-4 py-2.5 rounded-xl border border-blue-400 bg-blue-50 hover:bg-blue-100 text-blue-700 font-black text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                title="Download Question Paper PDF with Terms & Conditions"
              >
                <Download className="w-4 h-4 text-blue-600" />
                <span>Download PDF</span>
              </button>
              <button
                type="button"
                onClick={handleBackToConfigure}
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Modify Selection
              </button>
              <button
                type="button"
                disabled={!hasAgreedInstructions}
                onClick={handleStartTest}
                className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-md flex items-center gap-2 cursor-pointer ${
                  hasAgreedInstructions
                    ? 'bg-[#00b074] hover:bg-[#009260] text-white active:scale-95'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <span>Start Test Now</span>
                <Play className="w-3.5 h-3.5 fill-current" />
              </button>
            </div>
          </div>

          {/* Test Engine Status Banner */}
          <div className="p-4 bg-emerald-50 rounded-2xl border-2 border-emerald-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <h4 className="text-xs font-black text-emerald-950 uppercase tracking-wide">
                  ✓ {hasMatchingPaper ? 'Official Exam Paper Ready' : 'Intelligent Practice Test Ready'}
                </h4>
                <p className="text-xs text-emerald-800 font-bold mt-0.5">
                  {selectedGrade} ({subjectsMap[selectedSubject]?.name || selectedSubject.toUpperCase()}) practice test is ready. Click &apos;Start Test Now&apos; to begin practicing.
                </p>
              </div>
            </div>
            <span className="px-3 py-1 rounded-xl bg-emerald-200 text-emerald-900 text-[11px] font-black uppercase shrink-0 text-center">
              Ready to Start
            </span>
          </div>

          {/* Selected Test Configuration Banner */}
          <div className="bg-[#faf5fa] rounded-2xl p-5 border border-[#edd6ed] space-y-3">
            <h4 className="text-xs font-black text-[#4e2a4a] uppercase tracking-wider">
              Selected Test Configuration:
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
              <div className="p-2.5 bg-white rounded-xl border border-[#edd6ed]/60">
                <p className="text-[10px] text-slate-400 font-bold uppercase">Grade</p>
                <p className="font-black text-slate-800 mt-0.5">{selectedGrade}</p>
              </div>
              <div className="p-2.5 bg-white rounded-xl border border-[#edd6ed]/60">
                <p className="text-[10px] text-slate-400 font-bold uppercase">Olympiad</p>
                <p className="font-black text-slate-800 mt-0.5">{subjectsMap[selectedSubject]?.name || selectedSubject}</p>
              </div>
              <div className="p-2.5 bg-white rounded-xl border border-[#edd6ed]/60">
                <p className="text-[10px] text-slate-400 font-bold uppercase">Level</p>
                <p className="font-black text-slate-800 mt-0.5">{selectedLevel}</p>
              </div>
              <div className="p-2.5 bg-white rounded-xl border border-[#edd6ed]/60">
                <p className="text-[10px] text-slate-400 font-bold uppercase">Difficulty</p>
                <p className="font-black text-slate-800 mt-0.5">{selectedDifficulty}</p>
              </div>
              <div className="p-2.5 bg-white rounded-xl border border-[#edd6ed]/60">
                <p className="text-[10px] text-slate-400 font-bold uppercase">Questions</p>
                <p className="font-black text-slate-800 mt-0.5">
                  {hasMatchingPaper ? `${matchingPaper.questions.length} MCQs` : `${questionCount} MCQs`}
                </p>
              </div>
              <div className="p-2.5 bg-white rounded-xl border border-[#edd6ed]/60">
                <p className="text-[10px] text-slate-400 font-bold uppercase">Duration</p>
                <p className="font-black text-slate-800 mt-0.5">
                  {hasMatchingPaper ? `${matchingPaper.duration_minutes || testDurationMinutes} Minutes` : `${testDurationMinutes} Minutes`}
                </p>
              </div>
            </div>

            {/* Selected Topics List */}
            <div className="pt-2 border-t border-[#edd6ed]/60">
              <p className="text-[11px] font-bold text-slate-500 mb-1.5">
                Topics Included ({selectedChapters.length}):
              </p>
              <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto">
                {selectedChapters.map((ch) => (
                  <span
                    key={ch}
                    className="px-2.5 py-0.5 rounded-lg bg-white border border-[#edd6ed] text-[11px] font-semibold text-[#6d3a68]"
                  >
                    {ch}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Detailed Guidelines Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            {/* 1. Exam Structure & Navigation */}
            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-2">
              <div className="flex items-center gap-2 text-[#6d3a68] font-black text-sm">
                <HelpCircle className="w-4 h-4" />
                <h4>1. Test Navigation</h4>
              </div>
              <ul className="space-y-1.5 text-slate-600 list-disc list-inside">
                <li>Questions appear <strong>one by one</strong> on your screen.</li>
                <li>Use <strong>Next</strong> and <strong>Previous</strong> buttons to move.</li>
                <li>Use the <strong>Right Question Palette</strong> to jump directly to any question.</li>
                <li>Click <strong>Mark for Review</strong> to flag tricky questions.</li>
              </ul>
            </div>

            {/* 2. Timing & Auto-Submit */}
            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-2">
              <div className="flex items-center gap-2 text-[#6d3a68] font-black text-sm">
                <Clock className="w-4 h-4" />
                <h4>2. Timer &amp; Submission</h4>
              </div>
              <ul className="space-y-1.5 text-slate-600 list-disc list-inside">
                <li>Countdown timer runs at the top right: <strong>{matchingPaper?.duration_minutes || testDurationMinutes}:00</strong>.</li>
                <li>The test auto-submits when time reaches <strong>00:00</strong>.</li>
                <li>You can click <strong>Submit Test</strong> anytime when finished.</li>
                <li>Do not close or refresh the tab while the test is active.</li>
              </ul>
            </div>

            {/* 3. Scoring & Solutions */}
            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-2">
              <div className="flex items-center gap-2 text-[#6d3a68] font-black text-sm">
                <Award className="w-4 h-4" />
                <h4>3. Scoring &amp; Review</h4>
              </div>
              <ul className="space-y-1.5 text-slate-600 list-disc list-inside">
                <li>Correct response: <strong>+1.00 Mark</strong>.</li>
                <li>Incorrect response: <strong>0.00</strong> (No negative marking).</li>
                <li>Instant diagnostic scorecard with score percentage.</li>
                <li>Complete step-by-step solutions available immediately.</li>
              </ul>
            </div>
          </div>

          {/* Agreement Checkbox */}
          <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 flex items-start gap-3">
            <input
              type="checkbox"
              id="agree-instructions"
              checked={hasAgreedInstructions}
              onChange={(e) => setHasAgreedInstructions(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded border-amber-400 text-[#00b074] focus:ring-[#00b074] accent-[#00b074] cursor-pointer"
            />
            <label htmlFor="agree-instructions" className="text-xs font-semibold text-slate-800 cursor-pointer select-none">
              I have read and understood all the test instructions and guidelines above. I am ready to begin the test.
            </label>
          </div>

          {/* Bottom Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={handleBackToConfigure}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back / Change Settings</span>
            </button>

            <div className="w-full sm:w-auto flex flex-col sm:flex-row items-center gap-3">
              <button
                type="button"
                onClick={handleOpenPdfForCurrentSetup}
                className="w-full sm:w-auto px-6 py-3 rounded-2xl border-2 border-blue-400 bg-blue-50 hover:bg-blue-100 text-blue-700 font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm hover:shadow active:scale-95"
              >
                <Download className="w-4 h-4 text-blue-600" />
                <span>Download PDF</span>
              </button>

              <button
                type="button"
                disabled={!hasAgreedInstructions}
                onClick={handleStartTest}
                className={`w-full sm:w-auto px-8 py-3 rounded-2xl text-sm font-black uppercase tracking-wider transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer ${
                  hasAgreedInstructions
                    ? 'bg-[#00b074] hover:bg-[#009260] text-white hover:shadow-xl active:scale-95'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <span>Start Test Now</span>
                <Play className="w-4 h-4 fill-current" />
              </button>
            </div>
          </div>
        </div>
      ) : activeTab === 'list' ? (
        /* GENERATED TESTS LIST VIEW */
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#edd6ed] shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#f4ebf4]">
            <div>
              <h3 className="text-lg font-black text-[#4e2a4a]">Your Generated Tests History</h3>
              <p className="text-xs text-slate-500">Track and review all customized tests you have created.</p>
            </div>
            <button
              type="button"
              onClick={() => {
                setActiveTab('tests');
                setGeneratorStep('configure');
              }}
              className="px-4 py-2 bg-gradient-to-r from-[#ec4899] via-[#8b5cf6] to-[#3b82f6] text-white rounded-xl text-xs font-bold cursor-pointer"
            >
              + Create New Test
            </button>
          </div>

          <div className="space-y-3">
            {generatedTestsHistory.map((t) => (
              <div
                key={t.id}
                className="p-4 rounded-2xl bg-[#faf5fa] border border-[#edd6ed] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-[#f4ebf4] text-[#6d3a68]">
                      {t.id}
                    </span>
                    <h4 className="font-bold text-sm text-[#4e2a4a]">{t.title}</h4>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    {t.grade} • {t.level} • {t.difficulty} • Date: {t.date} • Duration: {t.duration}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                    Score: {t.score}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedGrade(t.grade);
                      setSelectedSubject(t.subject);
                      setSelectedLevel(t.level);
                      setSelectedDifficulty(t.difficulty);
                      setActiveTab('tests');
                      setGeneratorStep('configure');
                    }}
                    className="px-3.5 py-1.5 bg-white hover:bg-[#f4ebf4] text-[#6d3a68] border border-[#edd6ed] rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    Re-generate ⚡
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* ========================================================================= */
        /* PRACTICE MOCK TESTS & AI GENERATOR PROCESS STUDIO                         */
        /* ========================================================================= */
        <div className="space-y-8">
          {/* SECTION 1: MAIN TEST GENERATOR PROCESS STUDIO */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#edd6ed] shadow-sm relative">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#f4ebf4]">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-[10px] font-black uppercase tracking-wider">
                  ✓ {studentClass} Practice Hub
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-800 text-[10px] font-bold border border-indigo-200">
                  AI Test Generator
                </span>
              </div>

              <div className="text-left sm:text-right">
                <h1 className="text-xl sm:text-2xl font-black text-[#4e2a4a] tracking-tight">
                  Olympiad Intelligent Practice Test Generator Pro
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
                  Select subject, difficulty &amp; chapters to generate customized practice tests
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6">
              {/* LEFT 7 COLS: Selection Steps 1, 2, 3, 4 */}
              <div className="lg:col-span-7 space-y-6">
                {/* Step 1: Choose Your Grade */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="flex items-center gap-2 w-44 shrink-0">
                    <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 text-[11px] font-black flex items-center justify-center">
                      1
                    </span>
                    <span className="text-xs font-black text-slate-700">Choose Your Grade:</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 flex-1">
                    {['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'].map((g) => {
                      const isPub = isGradePublished(g);
                      return (
                        <button
                          key={g}
                          type="button"
                          onClick={() => setSelectedGrade(g)}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                            selectedGrade === g
                              ? 'bg-gradient-to-r from-[#ec4899] via-[#8b5cf6] to-[#3b82f6] text-white shadow-xs'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          <span>{g}</span>
                          {isPub && (
                            <span
                              className={`w-2 h-2 rounded-full ${selectedGrade === g ? 'bg-white' : 'bg-emerald-500'}`}
                              title="Published test available in this class"
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Step 2: Select Olympiad */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="flex items-center gap-2 w-44 shrink-0">
                    <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 text-[11px] font-black flex items-center justify-center">
                      2
                    </span>
                    <span className="text-xs font-black text-slate-700">Select Olympiad:</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2.5 flex-1">
                    {[
                      { id: 'english', code: 'I E O', name: 'IEO (English)', activeBg: 'bg-[#df7950] text-white border-[#df7950] shadow-sm ring-2 ring-[#df7950]/30' },
                      { id: 'math', code: 'I M O', name: 'IMO (Maths)', activeBg: 'bg-[#e8ac2c] text-white border-[#e8ac2c] shadow-sm ring-2 ring-[#e8ac2c]/30' },
                      { id: 'science', code: 'I S O', name: 'ISO (Science)', activeBg: 'bg-[#9db83b] text-white border-[#9db83b] shadow-sm ring-2 ring-[#9db83b]/30' },
                      { id: 'digital', code: 'I D L O', name: 'IDLO (Digital Literacy)', activeBg: 'bg-[#0284c7] text-white border-[#0284c7] shadow-sm ring-2 ring-[#0284c7]/30' },
                      { id: 'gk', code: 'I G K O', name: 'IGKO (GK)', activeBg: 'bg-[#eab308] text-white border-[#eab308] shadow-sm ring-2 ring-[#eab308]/30' },
                      { id: 'hindi', code: 'I H O', name: 'IHO (Hindi)', activeBg: 'bg-[#dc2626] text-white border-[#dc2626] shadow-sm ring-2 ring-[#dc2626]/30' }
                    ].map((sub) => {
                      const isSelected = selectedSubject === sub.id;
                      const isPub = isSubjectPublished(sub.id);
                      return (
                        <button
                          key={sub.id}
                          type="button"
                          onClick={() => {
                            setSelectedSubject(sub.id);
                            setSelectedChapters(getTopicsForSubject(sub.id) || []);
                          }}
                          className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 transition-all cursor-pointer ${
                            isSelected
                              ? sub.activeBg
                              : 'bg-[#faf5fa] text-slate-700 border-slate-200 hover:bg-[#f4ebf4]'
                          }`}
                        >
                          <input type="radio" checked={isSelected} readOnly className="accent-white" />
                          <span className="font-black font-mono tracking-wider">{sub.code}</span>
                          <Lightbulb className="w-3.5 h-3.5 text-yellow-300 fill-yellow-400" />
                          {isPub ? (
                            <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-emerald-600 text-white shadow-2xs">
                              Published
                            </span>
                          ) : (
                            <span className="text-[9px] font-bold text-slate-400">
                              Pending
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Step 3: Choose Syllabus Topics / Chapters */}
                <div className="space-y-3 pt-4 border-t border-[#f4ebf4]">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 text-[11px] font-black flex items-center justify-center">
                        3
                      </span>
                      <span className="text-xs font-black text-slate-800">
                        Select Syllabus Topics / Chapters:
                      </span>
                      <span className="text-[10px] font-bold text-[#6d3a68] bg-[#f4ebf4] px-2 py-0.5 rounded-full">
                        {selectedChapters.length} of {(getTopicsForSubject(selectedSubject) || []).length} Selected
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleToggleAllChapters}
                        className="text-[11px] font-black text-[#6d3a68] hover:text-[#582d54] px-2.5 py-1 rounded-lg bg-[#faf5fa] hover:bg-[#f4ebf4] border border-[#edd6ed] transition-all cursor-pointer flex items-center gap-1"
                      >
                        <Check className="w-3 h-3 stroke-[3]" />
                        <span>
                          {selectedChapters.length === (getTopicsForSubject(selectedSubject) || []).length
                            ? 'Deselect All'
                            : 'Select All Topics'}
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Topics Grid with Checkbox Pills */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-60 overflow-y-auto p-2.5 bg-[#faf5fa]/80 rounded-2xl border border-[#edd6ed]">
                    {(getTopicsForSubject(selectedSubject) || []).map((topic, idx) => {
                      const isSelected = selectedChapters.includes(topic);
                      return (
                        <button
                          key={topic}
                          type="button"
                          onClick={() => handleToggleChapter(topic)}
                          className={`text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-all cursor-pointer border ${
                            isSelected
                              ? 'bg-white text-slate-900 border-[#6d3a68] shadow-xs ring-1 ring-[#6d3a68]/20'
                              : 'bg-white/60 text-slate-600 border-slate-200 hover:bg-white hover:text-slate-800'
                          }`}
                        >
                          <span
                            className={`w-4 h-4 rounded-md flex items-center justify-center shrink-0 border transition-all ${
                              isSelected
                                ? 'bg-[#6d3a68] border-[#6d3a68] text-white shadow-2xs'
                                : 'bg-white border-slate-300 text-transparent'
                            }`}
                          >
                            <Check className="w-3 h-3 stroke-[3]" />
                          </span>
                          <span className="truncate flex-1 text-[11.5px] leading-snug">
                            <span className="font-mono text-[10px] text-slate-400 mr-1.5 font-bold">
                              {String(idx + 1).padStart(2, '0')}.
                            </span>
                            {topic}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Next Step Button */}
                <div className="pt-3 border-t border-[#f4ebf4] flex justify-end">
                  <button
                    type="button"
                    onClick={handleProceedToInstructions}
                    className="px-5 py-2.5 bg-[#6d3a68] hover:bg-[#582d54] text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-md active:scale-95 cursor-pointer flex items-center gap-2"
                  >
                    <span>Next: Practice Papers &amp; Instructions</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* RIGHT 5 COLS: Cute Robot Mascot + My Test Summary Card */}
              <div className="lg:col-span-5 flex flex-col items-center">
                {/* Cute Robot Mascot Illustration sitting on top */}
                <div className="relative -mb-6 z-10">
                  <svg className="w-16 h-16 drop-shadow-md" viewBox="0 0 100 100" fill="none">
                    {/* Head */}
                    <rect x="25" y="25" width="50" height="40" rx="12" fill="#e05338" />
                    {/* Screen / Face */}
                    <rect x="32" y="32" width="36" height="26" rx="8" fill="#1e293b" />
                    {/* Glowing Eyes */}
                    <circle cx="43" cy="45" r="4" fill="#fbbf24" className="animate-pulse" />
                    <circle cx="57" cy="45" r="4" fill="#fbbf24" className="animate-pulse" />
                    {/* Antenna */}
                    <line x1="50" y1="25" x2="50" y2="12" stroke="#e05338" strokeWidth="4" strokeLinecap="round" />
                    <circle cx="50" cy="10" r="4" fill="#fbbf24" />
                    {/* Body / Shoulders */}
                    <path d="M 30 72 C 30 65, 70 65, 70 72 L 75 90 C 75 95, 25 95, 25 90 Z" fill="#334155" />
                    {/* Chest light */}
                    <circle cx="50" cy="80" r="3" fill="#38bdf8" />
                  </svg>
                </div>

                {/* My Test Summary Card */}
                <div className="w-full bg-white rounded-3xl p-6 pt-9 border-2 border-[#edd6ed] shadow-lg space-y-4 text-center relative">
                  <h3 className="text-base font-black text-[#2e1065] tracking-tight">
                    My Test Summary
                  </h3>

                  <div className="grid grid-cols-2 gap-3 text-left">
                    {/* Grade */}
                    <div className="flex items-center gap-2 p-2 rounded-xl bg-[#faf5fa]">
                      <div className="w-7 h-7 rounded-lg bg-[#f4ebf4] text-[#6d3a68] flex items-center justify-center font-bold text-xs">
                        📇
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">Grade</p>
                        <p className="text-xs font-black text-slate-800">{selectedGrade}</p>
                      </div>
                    </div>

                    {/* Subject */}
                    <div className="flex items-center gap-2 p-2 rounded-xl bg-[#faf5fa]">
                      <div className="w-7 h-7 rounded-lg bg-[#f4ebf4] text-[#6d3a68] flex items-center justify-center font-bold text-xs">
                        ➕
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">Subject</p>
                        <p className="text-xs font-black text-slate-800 uppercase">{selectedSubject}</p>
                      </div>
                    </div>

                    {/* Difficulty */}
                    <div className="flex items-center gap-2 p-2 rounded-xl bg-[#faf5fa]">
                      <div className="w-7 h-7 rounded-lg bg-[#f4ebf4] text-[#6d3a68] flex items-center justify-center font-bold text-xs">
                        🎯
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">Difficulty</p>
                        <p className="text-xs font-black text-slate-800">{selectedDifficulty}</p>
                      </div>
                    </div>

                    {/* Level */}
                    <div className="flex items-center gap-2 p-2 rounded-xl bg-[#faf5fa]">
                      <div className="w-7 h-7 rounded-lg bg-[#f4ebf4] text-[#6d3a68] flex items-center justify-center font-bold text-xs">
                        🔺
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">Level</p>
                        <p className="text-xs font-black text-slate-800">{selectedLevel}</p>
                      </div>
                    </div>

                    {/* Questions */}
                    <div className="flex items-center gap-2 p-2 rounded-xl bg-[#faf5fa]">
                      <div className="w-7 h-7 rounded-lg bg-[#f4ebf4] text-[#6d3a68] flex items-center justify-center font-bold text-xs">
                        💬
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">Questions</p>
                        <p className="text-xs font-black text-slate-800">
                          {hasMatchingPaper ? `${matchingPaper.questions.length} MCQs` : `${questionCount} MCQs`}
                        </p>
                      </div>
                    </div>

                    {/* Time */}
                    <div className="flex items-center gap-2 p-2 rounded-xl bg-[#faf5fa]">
                      <div className="w-7 h-7 rounded-lg bg-[#f4ebf4] text-[#6d3a68] flex items-center justify-center font-bold text-xs">
                        ⏱️
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">Duration</p>
                        <p className="text-xs font-black text-slate-800">
                          {hasMatchingPaper ? `${matchingPaper.duration_minutes || testDurationMinutes} Mins` : `${testDurationMinutes} Mins`}
                        </p>
                      </div>
                    </div>

                    {/* Paper Status */}
                    <div className="flex items-center gap-2 p-2 rounded-xl col-span-2 border bg-emerald-50/90 border-emerald-300">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 bg-emerald-100 text-emerald-800">
                        ✓
                      </div>
                      <div className="flex-1 min-w-0 text-left">
                        <p className="text-[10px] font-bold uppercase text-emerald-800">
                          {hasMatchingPaper ? 'Official Super Admin Paper' : 'AI Intelligent Practice Test'}
                        </p>
                        <p className="text-xs font-black truncate text-emerald-950">
                          {hasMatchingPaper ? `Published (${matchingPaper.questions.length} Questions)` : `Auto-Generated Practice Test (${questionCount} MCQs)`}
                        </p>
                      </div>
                    </div>

                    {/* Chapters Selected */}
                    <div className="flex items-center gap-2 p-2 rounded-xl bg-[#faf5fa] col-span-2">
                      <div className="w-7 h-7 rounded-lg bg-[#f4ebf4] text-[#6d3a68] flex items-center justify-center font-bold text-xs">
                        📚
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] text-slate-400 font-bold uppercase">Chapters Selected</p>
                        <p className="text-xs font-black text-slate-800 truncate">
                          {selectedChapters.length === (getTopicsForSubject(selectedSubject)?.length || 0)
                            ? `All Topics (${selectedChapters.length})`
                            : `${selectedChapters.length} of ${getTopicsForSubject(selectedSubject)?.length || 0} Selected`}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* NEXT / PROCEED TO INSTRUCTIONS BUTTON */}
                  <button
                    type="button"
                    onClick={handleProceedToInstructions}
                    className="w-full py-3 rounded-2xl text-sm font-black uppercase tracking-wider transition-all shadow-lg flex items-center justify-center gap-2 bg-[#6d3a68] hover:bg-[#582d54] text-white hover:shadow-xl active:scale-95 cursor-pointer"
                  >
                    {isCurrentTestUnlocked ? (
                      <>
                        <span>Next: Practice Papers &amp; Instructions</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4 text-amber-300" />
                        <span>Next: Pay &amp; Unlock Test (₹{bankSettings.test_pack_price || 99})</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Summary Banner */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#edd6ed] shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#6d3a68]" />
                <h3 className="text-sm sm:text-base font-black text-[#4e2a4a]">
                  Test Engine Instructions &amp; Guidelines
                </h3>
              </div>
              <button
                type="button"
                onClick={handleProceedToInstructions}
                className="px-4 py-1.5 bg-[#f4ebf4] hover:bg-[#edd6ed] text-[#6d3a68] rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
              >
                <span>Read Full Instructions</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-slate-600">
              <div className="p-3 bg-[#faf5fa] rounded-2xl border border-[#edd6ed] space-y-1">
                <p className="font-bold text-[#6d3a68]">1. Scoring &amp; Navigation</p>
                <p>Each question carries +1.00 Mark. No negative marking. You can navigate sequentially or jump directly via the Question Palette.</p>
              </div>
              <div className="p-3 bg-[#faf5fa] rounded-2xl border border-[#edd6ed] space-y-1">
                <p className="font-bold text-[#6d3a68]">2. Auto-Timer</p>
                <p>The {testDurationMinutes}-minute countdown starts immediately. The test auto-submits when time expires, evaluating all answers.</p>
              </div>
              <div className="p-3 bg-[#faf5fa] rounded-2xl border border-[#edd6ed] space-y-1">
                <p className="font-bold text-[#6d3a68]">3. Instant Solution Review</p>
                <p>Upon submission, your scorecard and detailed step-by-step explanations for every question will be available immediately.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PDF Download Terms & Conditions Modal */}
      <DownloadPaperPdfModal
        isOpen={!!pdfModalPaper}
        onClose={() => setPdfModalPaper(null)}
        paper={pdfModalPaper}
        onStartExamAfterDownload={() => handleStartTest()}
      />

      {/* Quick MCQ Preview Modal for Students */}
      {quickPreviewPaper && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-[#6d3a68] block">
                  Question Paper Preview • {quickPreviewPaper.class_name || quickPreviewPaper.class}
                </span>
                <h3 className="text-base font-black text-slate-900">
                  {cleanPaperTitle(quickPreviewPaper.title, quickPreviewPaper.subject_code, quickPreviewPaper.class_name)}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setQuickPreviewPaper(null)}
                className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-700 flex items-center justify-center font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-5 divide-y divide-slate-100 flex-1">
              {Array.isArray(quickPreviewPaper.questions) && quickPreviewPaper.questions.length > 0 ? (
                quickPreviewPaper.questions.map((q, idx) => (
                  <div key={q.id || idx} className="pt-4 first:pt-0 space-y-2.5">
                    <div className="flex items-start gap-2">
                      <span className="w-6 h-6 rounded-lg bg-[#f4ebf4] text-[#6d3a68] font-black text-xs flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <div className="flex-1 space-y-2">
                        <p className="text-sm font-bold text-slate-800 leading-snug">
                          {getCleanQuestionText(q.q || q.question_text || q.title)}
                        </p>
                        <QuestionDiagram question={q} title="Question Diagram" maxHeight="max-h-56" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-8">
                      {(q.options || ['Option A', 'Option B', 'Option C', 'Option D']).map((opt, oIdx) => {
                        const isCorrect = (typeof q.correct === 'number' && q.correct === oIdx) ||
                                          (q.correct_option === ['A', 'B', 'C', 'D'][oIdx]);
                        const isOptImg = isImageString(opt);
                        return (
                          <div
                            key={oIdx}
                            className={`p-2.5 rounded-xl text-xs font-medium border flex items-center gap-2 ${
                              isCorrect
                                ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold'
                                : 'bg-slate-50 border-slate-200 text-slate-700'
                            }`}
                          >
                            <span className="w-5 h-5 rounded-md bg-white border border-slate-200 text-slate-700 font-black text-[10px] flex items-center justify-center shrink-0">
                              {['A', 'B', 'C', 'D'][oIdx]}
                            </span>
                            {isOptImg ? (
                              <img
                                src={getOptionImageSrc(opt)}
                                alt={`Option ${['A', 'B', 'C', 'D'][oIdx]}`}
                                className="max-h-14 max-w-full object-contain rounded"
                              />
                            ) : (
                              <span className="truncate">{opt}</span>
                            )}
                            {isCorrect && (
                              <span className="ml-auto text-[10px] text-emerald-700 font-black">✓ Correct</span>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {q.explanation && (
                      <div className="pl-8 pt-1 text-[11px] text-slate-500 italic">
                        <strong>Explanation:</strong> {q.explanation}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-slate-400 text-xs font-bold">
                  No questions found in this paper.
                </div>
              )}
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500">
                Total: {(quickPreviewPaper.questions || []).length} MCQs
              </span>
              <button
                type="button"
                onClick={() => {
                  const p = quickPreviewPaper;
                  setQuickPreviewPaper(null);
                  handleStartAdminPaper(p);
                }}
                className="px-5 py-2 bg-[#6d3a68] hover:bg-[#582d54] text-white font-black text-xs rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Start Practice Test Now</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
