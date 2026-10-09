import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { apiClient } from '../../api/client';
import {
  BookOpen,
  ArrowLeft,
  ArrowRight,
  ChevronRight,
  Shield,
  Play,
  Globe,
  Atom,
  Calculator,
  Laptop,
  Brain,
  Sparkles,
  Palette,
  Layers,
  Download,
  Check,
  CheckCircle2,
  BarChart2,
  Trophy,
  FileText,
  Languages,
  Rocket,
  GraduationCap,
  Lock,
  QrCode,
  CreditCard,
  Copy,
  Package,
  Eye,
  RefreshCw
} from 'lucide-react';
import { DownloadPaperPdfModal } from '../../components/common/DownloadPaperPdfModal';
import { isSubjectPurchased, savePurchasedSubject, lockSubject, getPurchasedTests, getTestPricing } from '../../utils/purchaseUtils';

const CLASS_OPTIONS = [
  'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 
  'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 
  'Class 11', 'Class 12'
];

export const StudentMyContentPage = ({
  activeSubjectCode = null, // e.g. 'content_igko', 'content_imo', 'my_content'
  onNavigateTab,
  onStartExam
}) => {
  const { user } = useAuth();
  const [selectedClass, setSelectedClass] = useState(() => {
    return user?.class || user?.grade || 'Class 6';
  });
  const studentClass = selectedClass;

  const [examPapers, setExamPapers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Purchased Tests & Unlock State
  const [purchasedTests, setPurchasedTests] = useState(() => getPurchasedTests());
  const [purchasingSubject, setPurchasingSubject] = useState(null);
  const [paymentStep, setPaymentStep] = useState('method'); // 'method' | 'success'
  const [selectedPayMethod, setSelectedPayMethod] = useState('upi_qr');
  const [utrNumber, setUtrNumber] = useState('');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [bankSettings, setBankSettings] = useState(() => {
    const p = getTestPricing();
    const effectivePrice = p.mock_test_price || p.test_pack_price || 99;
    return {
      upi_id: 'olympiadhub@icici',
      merchant_name: 'Olympiad Foundation India',
      bank_name: 'ICICI Bank',
      account_number: '1029384756',
      ifsc: 'ICIC0001029',
      qr_code_url: '',
      test_pack_price: effectivePrice,
      mock_test_price: p.mock_test_price || 99,
      practice_test_price: p.practice_test_price || 99,
      original_price: p.original_price || 299
    };
  });

  // Packages list loaded from API / Super Admin
  const [packagesList, setPackagesList] = useState([]);
  // View mode on Level 1: 'smart' (Locked = Study Package [Image 1], Unlocked = Subject Cover [Image 2]) | 'packages' | 'covers'
  const [viewMode, setViewMode] = useState('smart');
  const [previewCoverSubject, setPreviewCoverSubject] = useState(null);

  // Helper to normalize subject codes and aliases
  const normalizeCode = (raw) => {
    if (!raw) return 'ALL';
    const s = String(raw).replace('content_', '').toUpperCase().trim();
    if (s === 'IMO' || s === 'IEOM' || s === 'MATH' || s === 'MATHEMATICS') return 'IMO';
    if (s === 'ISO' || s === 'IEOS' || s === 'NSO' || s === 'SCIENCE') return 'ISO';
    if (s === 'IDLO' || s === 'IEOD' || s === 'ICSO' || s === 'CYBER' || s === 'DIGITAL') return 'IDLO';
    if (s === 'IEO' || s === 'IEOE' || s === 'ENGLISH') return 'IEO';
    if (s === 'IGKO' || s === 'IEOG' || s === 'GK' || s === 'GENERAL KNOWLEDGE') return 'IGKO';
    if (s === 'IHO' || s === 'IEOH' || s === 'HINDI') return 'IHO';
    if (s === 'MY_CONTENT' || s === 'ALL') return 'ALL';
    return s;
  };

  // Active selected subject filter: 'ALL' or 'IGKO', 'IMO', 'ISO', etc.
  const [selectedSubject, setSelectedSubject] = useState(() => {
    if (activeSubjectCode) {
      return normalizeCode(activeSubjectCode);
    }
    return 'ALL';
  });

  // Level 2: Which subject's mock tests are open (null = showing covers/packages, 'IMO' = showing mock tests)
  const [openedMockSeries, setOpenedMockSeries] = useState(null);

  const [selectedPaperForInstructions, setSelectedPaperForInstructions] = useState(null);
  const [pdfModalPaper, setPdfModalPaper] = useState(null);
  const [hasAgreedToRules, setHasAgreedToRules] = useState(true);
  const [myTestResults, setMyTestResults] = useState([]);

  // Fetch real exam papers, packages, and results
  const fetchMyContentData = async () => {
    try {
      setLoading(true);
      const [papersRes, resultsRes, pkgsRes] = await Promise.all([
        apiClient.get('/exam-papers').catch(() => ({ success: false })),
        apiClient.get('/results', { scope: 'all' }).catch(() => ({ success: false })),
        apiClient.get('/packages').catch(() => ({ success: false }))
      ]);

      let allPapers = [];
      if (papersRes && papersRes.success && Array.isArray(papersRes.data)) {
        allPapers = [...papersRes.data];
      }

      // Also include any mock tests authored in admin generator or local storage
      const localAdminPapers = JSON.parse(localStorage.getItem('admin_generator_papers') || '[]');
      const mockDbPapers = JSON.parse(localStorage.getItem('mock_db_exam_papers') || '[]');
      const olympiadDbPapers = JSON.parse(localStorage.getItem('olympiadhub_db_exam_papers') || '[]');
      const combinedLocal = [...localAdminPapers, ...mockDbPapers, ...olympiadDbPapers];

      if (Array.isArray(combinedLocal)) {
        combinedLocal.forEach((lp) => {
          if (lp && !allPapers.some(p => String(p.id) === String(lp.id) || (p.title === lp.title && p.class_name === (lp.class_name || lp.class)))) {
            allPapers.push({
              id: lp.id,
              title: lp.title,
              short_code: lp.shortCode || lp.short_code || `${lp.subject_code || 'OLY'} - Mock`,
              subject_code: (lp.subject_code || lp.subject || '').toUpperCase(),
              class_name: lp.class_name || lp.class,
              category: lp.paper_category || 'mock_test',
              duration_minutes: lp.duration_minutes || 60,
              total_marks: lp.total_marks || 60,
              cutoff_marks: lp.cutoff_marks || 42,
              status: 'published',
              questions: lp.questions || []
            });
          }
        });
      }

      setExamPapers(allPapers);

      // Packages
      let allPkgs = [];
      if (pkgsRes && pkgsRes.success && Array.isArray(pkgsRes.data)) {
        allPkgs = [...pkgsRes.data];
      }
      const localPkgs = JSON.parse(localStorage.getItem('olympiadhub_db_packages') || '[]');
      if (Array.isArray(localPkgs)) {
        localPkgs.forEach(lp => {
          if (!allPkgs.some(p => String(p.id) === String(lp.id))) {
            allPkgs.push(lp);
          }
        });
      }
      setPackagesList(allPkgs);

      if (resultsRes && resultsRes.success && Array.isArray(resultsRes.data)) {
        const filtered = resultsRes.data.filter(
          r => r.student_id === user?.id || (r.student_login_id && r.student_login_id === user?.login_id)
        );
        setMyTestResults(filtered);
      }
    } catch (err) {
      console.error('Error fetching my content data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyContentData();
    const handleSync = () => {
      fetchMyContentData();
    };
    window.addEventListener('olympiadhub-admin-papers-updated', handleSync);
    window.addEventListener('olympiadhub-package-updated', handleSync);
    window.addEventListener('storage', handleSync);
    return () => {
      window.removeEventListener('olympiadhub-admin-papers-updated', handleSync);
      window.removeEventListener('olympiadhub-package-updated', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, [user]);

  useEffect(() => {
    apiClient.get('/payment/bank-settings').then(res => {
      if (res && res.data) {
        setBankSettings(prev => ({
          ...prev,
          ...res.data,
          test_pack_price: res.data.mock_test_price || res.data.test_pack_price || prev.test_pack_price || 99
        }));
      }
    }).catch(() => {});

    const handlePricingUpdate = (e) => {
      const p = e?.detail || getTestPricing();
      const effectivePrice = p.mock_test_price || p.test_pack_price || 99;
      setBankSettings(prev => ({
        ...prev,
        test_pack_price: effectivePrice,
        mock_test_price: p.mock_test_price || 99,
        practice_test_price: p.practice_test_price || 99,
        original_price: p.original_price || 299
      }));
    };

    window.addEventListener('olympiadhub-pricing-updated', handlePricingUpdate);
    window.addEventListener('storage', handlePricingUpdate);
    return () => {
      window.removeEventListener('olympiadhub-pricing-updated', handlePricingUpdate);
      window.removeEventListener('storage', handlePricingUpdate);
    };
  }, []);

  useEffect(() => {
    const handleSyncPurchases = () => {
      setPurchasedTests(getPurchasedTests());
    };
    window.addEventListener('olympiadhub-package-purchased', handleSyncPurchases);
    window.addEventListener('storage', handleSyncPurchases);
    return () => {
      window.removeEventListener('olympiadhub-package-purchased', handleSyncPurchases);
      window.removeEventListener('storage', handleSyncPurchases);
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

  const handleOpenPayment = (sub, pkg = null) => {
    const pkgPrice = pkg ? (pkg.price || bankSettings.test_pack_price || 99) : (bankSettings.test_pack_price || 99);
    setPurchasingSubject({
      ...sub,
      packageId: pkg?.id,
      packageTitle: pkg?.title,
      price: pkgPrice
    });
    setPaymentStep('method');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCompleteMockPurchase = async () => {
    if (!purchasingSubject) return;
    setIsProcessingPayment(true);
    try {
      const payAmount = purchasingSubject.price || bankSettings.test_pack_price || 99;
      const updated = savePurchasedSubject(
        purchasingSubject.code,
        purchasingSubject.altCode,
        studentClass,
        {
          order_id: `ORD-MOCK-${Date.now().toString().slice(-6)}`,
          subject_name: purchasingSubject.title,
          package_title: purchasingSubject.packageTitle || purchasingSubject.title,
          amount: payAmount,
          payment_method: selectedPayMethod,
          utr_number: utrNumber || `UPI-TXN-${Date.now().toString().slice(-8)}`
        }
      );
      setPurchasedTests(updated);
      setPaymentStep('success');

      setTimeout(() => {
        const boughtCode = purchasingSubject.code;
        setPaymentStep('method');
        setPurchasingSubject(null);
        setSelectedSubject(boughtCode);
        // After purchase, show the unlocked Subject Cover card first ("uske baad y cover phir test")
        setOpenedMockSeries(null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 1200);
    } catch (err) {
      alert('Payment processing failed. Please try again.');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  // When activeSubjectCode changes from the sidebar (e.g. student clicks IGKO or ISO)
  useEffect(() => {
    if (activeSubjectCode) {
      const code = normalizeCode(activeSubjectCode);
      setSelectedSubject(code);
      setOpenedMockSeries(null); // Return to Level 1
    }
  }, [activeSubjectCode]);

  const ALL_SUBJECT_COVERS = useMemo(() => [
    {
      code: 'IMO',
      altCode: 'IEOM',
      title: 'IEOM (Mathematics)',
      subtitle: 'Mathematics & Logical Analysis',
      description: 'Sharpen mathematical problem-solving, arithmetic speed, geometry, number systems and analytical reasoning.',
      icon: Calculator,
      cardBg: 'bg-gradient-to-br from-pink-200/95 via-rose-200/85 to-amber-200/85 border-2 border-pink-400/90 hover:border-pink-500 shadow-sm',
      iconBg: 'bg-gradient-to-tr from-pink-500 via-rose-500 to-amber-500 text-white shadow-pink-300 shadow-md',
      tagBg: 'bg-pink-300/90 text-pink-900 border border-pink-400',
      countBg: 'bg-rose-300/90 text-rose-950 border border-rose-400',
      btnBg: 'bg-gradient-to-r from-pink-600 via-rose-600 to-amber-600 hover:from-pink-700 hover:via-rose-700 hover:to-amber-700 text-white shadow-sm border border-pink-600',
      seriesTitle: `${studentClass}-All India IEOM Mock Test Series`
    },
    {
      code: 'ISO',
      altCode: 'IEOS',
      title: 'IEOS (Science)',
      subtitle: 'Science & Practical Discovery',
      description: 'Master scientific principles, experimental observation, physics, chemistry, biology concepts and logic.',
      icon: Rocket,
      cardBg: 'bg-gradient-to-br from-purple-200/95 via-indigo-200/85 to-sky-200/85 border-2 border-purple-400/90 hover:border-purple-500 shadow-sm',
      iconBg: 'bg-gradient-to-tr from-purple-500 via-indigo-500 to-sky-500 text-white shadow-purple-300 shadow-md',
      tagBg: 'bg-purple-300/90 text-purple-900 border border-purple-400',
      countBg: 'bg-indigo-300/90 text-indigo-950 border border-indigo-400',
      btnBg: 'bg-gradient-to-r from-purple-600 via-indigo-600 to-sky-600 hover:from-purple-700 hover:via-indigo-700 hover:to-sky-700 text-white shadow-sm border border-purple-600',
      seriesTitle: `${studentClass}-All India IEOS Mock Test Series`
    },
    {
      code: 'IDLO',
      altCode: 'IEOD',
      title: 'IEOD (Digital Literacy)',
      subtitle: 'Digital Tools, Computing & Safety',
      description: 'Learn computer fundamentals, internet safety, software tools, digital citizenship and technology foundations.',
      icon: Laptop,
      cardBg: 'bg-gradient-to-br from-cyan-200/95 via-blue-200/85 to-indigo-200/85 border-2 border-blue-400/90 hover:border-blue-500 shadow-sm',
      iconBg: 'bg-gradient-to-tr from-cyan-500 via-blue-500 to-indigo-500 text-white shadow-blue-300 shadow-md',
      tagBg: 'bg-blue-300/90 text-blue-900 border border-blue-400',
      countBg: 'bg-cyan-300/90 text-cyan-950 border border-cyan-400',
      btnBg: 'bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-700 hover:via-blue-700 hover:to-indigo-700 text-white shadow-sm border border-blue-600',
      seriesTitle: `${studentClass}-All India IEOD Mock Test Series`
    },
    {
      code: 'IEO',
      altCode: 'IEOE',
      title: 'IEOE (English)',
      subtitle: 'English Grammar & Vocabulary',
      description: 'Enhance English grammar proficiency, comprehension reading, vocabulary power and verbal communication.',
      icon: BookOpen,
      cardBg: 'bg-gradient-to-br from-emerald-200/95 via-teal-200/85 to-cyan-200/85 border-2 border-teal-400/90 hover:border-teal-500 shadow-sm',
      iconBg: 'bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 text-white shadow-teal-300 shadow-md',
      tagBg: 'bg-teal-300/90 text-teal-900 border border-teal-400',
      countBg: 'bg-emerald-300/90 text-emerald-950 border border-emerald-400',
      btnBg: 'bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-700 hover:via-teal-700 hover:to-cyan-700 text-white shadow-sm border border-teal-600',
      seriesTitle: `${studentClass}-All India IEOE Mock Test Series`
    },
    {
      code: 'IGKO',
      altCode: 'IEOG',
      title: 'IEOG (General Knowledge)',
      subtitle: 'General Knowledge & Current Affairs',
      description: 'Build your general knowledge, stay updated with current affairs and improve your reasoning skills.',
      icon: Globe,
      cardBg: 'bg-gradient-to-br from-amber-200/95 via-orange-200/85 to-rose-200/85 border-2 border-amber-400/90 hover:border-amber-500 shadow-sm',
      iconBg: 'bg-gradient-to-tr from-amber-500 via-orange-500 to-rose-500 text-white shadow-amber-300 shadow-md',
      tagBg: 'bg-amber-300/90 text-amber-900 border border-amber-400',
      countBg: 'bg-orange-300/90 text-orange-950 border border-orange-400',
      btnBg: 'bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:from-amber-600 hover:via-orange-600 hover:to-rose-600 text-white shadow-sm border border-amber-500',
      seriesTitle: `${studentClass}-All India IEOG Mock Test Series`
    },
    {
      code: 'IHO',
      altCode: 'IEOH',
      title: 'IEOH (Hindi)',
      subtitle: 'Hindi Vyakaran & Sahitya',
      description: 'हिंदी व्याकरण, वर्तनी शुद्धि, मुहावरे, भाषा बोध और शब्द ज्ञान का संपूर्ण अभ्यास करें।',
      icon: Languages,
      cardBg: 'bg-gradient-to-br from-lime-200/95 via-emerald-200/85 to-teal-200/85 border-2 border-emerald-400/90 hover:border-emerald-500 shadow-sm',
      iconBg: 'bg-gradient-to-tr from-lime-500 via-emerald-500 to-teal-600 text-white shadow-emerald-300 shadow-md',
      tagBg: 'bg-emerald-300/90 text-emerald-900 border border-emerald-400',
      countBg: 'bg-lime-300/90 text-lime-950 border border-lime-400',
      btnBg: 'bg-gradient-to-r from-lime-600 via-emerald-600 to-teal-600 hover:from-lime-700 hover:via-emerald-700 hover:to-teal-700 text-white shadow-sm border border-emerald-600',
      seriesTitle: `${studentClass}-All India IEOH Mock Test Series`
    }
  ], [studentClass]);

  const getSubjectPapers = (subCode, altCode) => {
    const matching = examPapers.filter((p) => {
      const pSub = (p.subject_code || p.subject || '').toUpperCase();
      const codeMatches = pSub === subCode || (altCode && pSub === altCode) || (subCode === 'IDLO' && (pSub === 'ICSO' || pSub === 'CYBER' || pSub === 'IEOD')) || (subCode === 'IHO' && (pSub === 'IEOH' || pSub === 'HINDI'));
      
      const pCls = (p.class_name || p.class || '').toLowerCase();
      const sCls = (studentClass || '').toLowerCase();
      const matchP = pCls.match(/\d+/);
      const matchS = sCls.match(/\d+/);
      const classMatches = (matchP && matchS) ? matchP[0] === matchS[0] : (pCls === sCls || !pCls || pCls === 'all');
      
      // Strict exclusion: NEVER show Previous Year Papers or Sample Papers in My Content
      const titleLower = (p.title || '').toLowerCase();
      const catLower = (p.category || p.paper_category || p.paper_type || '').toLowerCase();
      
      const isPreviousYear = catLower.includes('previous') || catLower.includes('pyq') || catLower.includes('past') || titleLower.includes('previous year') || titleLower.includes('pyq');
      const isSamplePaper = catLower.includes('sample') || titleLower.includes('sample paper');
      
      if (isPreviousYear || isSamplePaper) {
        return false;
      }

      return codeMatches && classMatches;
    });

    if (matching.length > 0) return matching;

    // Pure mock tests fallback (4 mocks per subject, 5 for IMO)
    const basePapers = [
      {
        id: `mock_${subCode.toLowerCase()}_1`,
        title: `${altCode || subCode} Level-1 Mock Test 1 ${studentClass}`,
        short_code: `${altCode || subCode} - Mock 1`,
        subject_code: subCode,
        class_name: studentClass,
        duration_minutes: 60,
        total_marks: 60,
        cutoff_marks: 42,
        status: 'published'
      },
      {
        id: `mock_${subCode.toLowerCase()}_2`,
        title: `${altCode || subCode} Level-1 Mock Test 2 ${studentClass}`,
        short_code: `${altCode || subCode} - Mock 2`,
        subject_code: subCode,
        class_name: studentClass,
        duration_minutes: 60,
        total_marks: 60,
        cutoff_marks: 45,
        status: 'published'
      },
      {
        id: `mock_${subCode.toLowerCase()}_3`,
        title: `${altCode || subCode} Level-1 Mock Test 3 ${studentClass}`,
        short_code: `${altCode || subCode} - Mock 3`,
        subject_code: subCode,
        class_name: studentClass,
        duration_minutes: 60,
        total_marks: 60,
        cutoff_marks: 45,
        status: 'published'
      },
      {
        id: `mock_${subCode.toLowerCase()}_4`,
        title: `${altCode || subCode} Level-1 Mock Test 4 ${studentClass}`,
        short_code: `${altCode || subCode} - Mock 4`,
        subject_code: subCode,
        class_name: studentClass,
        duration_minutes: 60,
        total_marks: 60,
        cutoff_marks: 45,
        status: 'published'
      }
    ];

    if (subCode === 'IMO') {
      basePapers.push({
        id: `mock_${subCode.toLowerCase()}_5`,
        title: `${altCode || subCode} Level-1 Mock Test 5 ${studentClass}`,
        short_code: `${altCode || subCode} - Mock 5`,
        subject_code: subCode,
        class_name: studentClass,
        duration_minutes: 60,
        total_marks: 60,
        cutoff_marks: 46,
        status: 'published'
      });
    }

    return basePapers;
  };

  // Filter covers according to selected subject (MUST BE DECLARED BEFORE ANY EARLY RETURN)
  const visibleCovers = useMemo(() => {
    if (selectedSubject && selectedSubject !== 'ALL') {
      const match = ALL_SUBJECT_COVERS.filter(s => s.code === selectedSubject || s.altCode === selectedSubject);
      if (match.length > 0) return match;
    }
    return ALL_SUBJECT_COVERS;
  }, [selectedSubject, ALL_SUBJECT_COVERS]);

  // Default subject study packages (Image 1 style) for all 6 subjects
  const DEFAULT_SUBJECT_PACKAGES = useMemo(() => ({
    IMO: [
      {
        id: 'def_pkg_imo',
        title: `Olympiads Level-2 Champs Package - IMO ${studentClass}`,
        class_name: studentClass,
        subject_code: 'IMO',
        subject_name: 'International Mathematics Olympiad',
        price: bankSettings.mock_test_price || bankSettings.test_pack_price || 99,
        original_price: bankSettings.original_price || 299,
        header_color: '#d97706',
        points: [
          '5 Grand Level-1 & Level-2 National Math Mock Tests',
          'Speed Arithmetic & Mental Shortcuts Guide',
          'Step-by-Step Problem Solving Breakdown',
          'Achievers HOTS Math Section with Master Answers',
          'Unlimited Test Retake Attempts & Instant Scorecards'
        ]
      }
    ],
    ISO: [
      {
        id: 'def_pkg_iso',
        title: `Olympiads Level-2 Champs Package - ISO Science ${studentClass}`,
        class_name: studentClass,
        subject_code: 'ISO',
        subject_name: 'International Science Olympiad',
        price: bankSettings.mock_test_price || bankSettings.test_pack_price || 99,
        original_price: bankSettings.original_price || 299,
        header_color: '#8b5cf6',
        points: [
          '5 NSO / ISO Science Olympiad Mock Papers',
          'Concepts, Diagram Analysis & Practical Reasoning',
          'Previous Solved Papers with Explanations',
          'Rank Booster High-Yield Questions',
          'Step-by-Step Concept Breakdown & Solutions'
        ]
      }
    ],
    IDLO: [
      {
        id: 'def_pkg_idlo',
        title: `Olympiads Level-2 Champs Package - ${studentClass}`,
        class_name: studentClass,
        subject_code: 'ICSO',
        subject_name: 'International Cyber Olympiad',
        price: bankSettings.mock_test_price || bankSettings.test_pack_price || 99,
        original_price: bankSettings.original_price || 299,
        header_color: '#4895d9',
        points: [
          '5 Grand Level-2 National Mock Tests',
          'Advanced HOTS & Tie-Breaker Problem Sets',
          'Detailed Video Solutions & Step-by-Step Analysis',
          'National Benchmark Percentile & AIR Ranking',
          'Unlimited Test Retake Attempts for 365 Days'
        ]
      }
    ],
    IEO: [
      {
        id: 'def_pkg_ieo',
        title: `Olympiads Level-2 Champs Package - IEO English ${studentClass}`,
        class_name: studentClass,
        subject_code: 'IEO',
        subject_name: 'International English Olympiad',
        price: bankSettings.mock_test_price || bankSettings.test_pack_price || 99,
        original_price: bankSettings.original_price || 299,
        header_color: '#06b6d4',
        points: [
          '5 Complete IEO Model Test Papers with Solutions',
          'Grammar, Vocabulary & Reading Comprehension Booster',
          'Idioms, Proverbs & Sentence Structure Mastery',
          'National Percentile & Real Examination Simulation',
          'Detailed Explanations & Error Diagnostic Report'
        ]
      }
    ],
    IGKO: [
      {
        id: 'def_pkg_igko',
        title: `Olympiads Level-2 Champs Package - IGKO ${studentClass}`,
        class_name: studentClass,
        subject_code: 'IGKO',
        subject_name: 'International General Knowledge Olympiad',
        price: bankSettings.mock_test_price || bankSettings.test_pack_price || 99,
        original_price: bankSettings.original_price || 299,
        header_color: '#f59e0b',
        points: [
          '5 Full-Length IGKO Grand Mock Test Papers',
          'Current Affairs Digest & Global News Summaries',
          'India & World Factbook with Life Skills Guide',
          'Instant Scoring & Section-wise Performance Heatmap',
          'Comprehensive Answer Keys & Explanations'
        ]
      }
    ],
    IHO: [
      {
        id: 'def_pkg_iho',
        title: `Olympiads Level-2 Champs Package - IHO Hindi ${studentClass}`,
        class_name: studentClass,
        subject_code: 'IHO',
        subject_name: 'International Hindi Olympiad',
        price: bankSettings.mock_test_price || bankSettings.test_pack_price || 99,
        original_price: bankSettings.original_price || 299,
        header_color: '#10b981',
        points: [
          '5 Full-Length IHO Hindi Mock Test Papers',
          'हिंदी व्याकरण, मुहावरे और लोकोक्तियाँ अभ्यास सेट',
          'पठन कौशल, शब्द भंडार और वर्तनी शुद्धि',
          'परीक्षा पैटर्न अनुसार तुरंत परिणाम और विश्लेषण',
          'संपूर्ण उत्तर कुंजी एवं विस्तृत समाधान'
        ]
      }
    ]
  }), [studentClass, bankSettings]);

  const getPackagesForSubject = (subCode) => {
    const norm = normalizeCode(subCode);
    const matched = packagesList.filter(p => {
      const pNorm = normalizeCode(p.subject_code || p.subject || '');
      return pNorm === norm;
    });
    if (matched.length > 0) return matched;
    return DEFAULT_SUBJECT_PACKAGES[norm] || [];
  };

  // Dedicated Step 2: Payment & QR Checkout Screen for Mock Test Series
  if (purchasingSubject) {
    const sub = purchasingSubject;
    const upiAmount = purchasingSubject.price || bankSettings.test_pack_price || 99;
    const upiPayUrl = `upi://pay?pa=${bankSettings.upi_id || 'olympiadhub@icici'}&pn=${encodeURIComponent(bankSettings.merchant_name || 'Olympiad Foundation')}&am=${upiAmount}&cu=INR&tn=${encodeURIComponent(`${studentClass} ${sub.code} Mock Series`)}`;
    const qrImageSrc = bankSettings.qr_code_url || `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiPayUrl)}`;

    return (
      <div className="space-y-6 pb-16 font-sans max-w-5xl mx-auto animate-in fade-in duration-200">
        {/* Navigation & Header */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              setPurchasingSubject(null);
              setPaymentStep('method');
            }}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-indigo-600 px-3.5 py-2 rounded-xl bg-white border border-slate-200 shadow-2xs hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-indigo-600" />
            <span>← Back to Mock Test Series</span>
          </button>
          <span className="text-xs font-bold text-slate-400">Step 2 of 2: Payment Checkout</span>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 rounded-full text-xs font-black bg-indigo-50 text-indigo-700 border border-indigo-200 uppercase tracking-wider">
                  {studentClass} • {sub.code}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5" />
                  Premium Test Series
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Unlock {sub.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                Scan QR Code with any UPI app to unlock all 5 timed mock tests, CBT interface, and detailed step-by-step solutions.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3.5 py-1.5 rounded-full text-xs font-black bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5 shrink-0">
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
                {studentClass} ({sub.title}) Mock Test Series has been unlocked. Opening mock test papers...
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
                          src={qrImageSrc}
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

                    {/* UTR Input */}
                    <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-2">
                      <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                        <span>12-Digit UPI / Bank Reference No (UTR)</span>
                        <span className="text-[10px] text-slate-400 font-normal">(Optional for Instant Unlock)</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 429182746192"
                        value={utrNumber}
                        onChange={(e) => setUtrNumber(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-mono focus:ring-2 focus:ring-[#6d3a68] outline-none"
                      />
                    </div>
                  </div>
                ) : (
                  /* Direct Bank Transfer */
                  <div className="space-y-4 p-5 rounded-2xl bg-white border border-slate-200 text-xs">
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

                    <div className="space-y-1.5 pt-2 border-t border-slate-100">
                      <label className="text-xs font-bold text-slate-700">
                        Transfer Reference / Transaction ID
                      </label>
                      <input
                        type="text"
                        placeholder="Enter IMPS / NEFT / Txn Reference No."
                        value={utrNumber}
                        onChange={(e) => setUtrNumber(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-mono focus:ring-2 focus:ring-[#6d3a68] outline-none"
                      />
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
                      <span className="text-slate-500 font-semibold">Target Class</span>
                      <span className="font-black text-slate-800">{studentClass}</span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-slate-500 font-semibold">Olympiad Test Series</span>
                      <span className="font-black text-slate-800">{sub.title}</span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-slate-500 font-semibold">Papers Included</span>
                      <span className="font-black text-slate-800">5 Full Mock Tests</span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-slate-500 font-semibold">Questions / Duration</span>
                      <span className="font-black text-slate-800">60 MCQs / 60 Mins each</span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-slate-500 font-semibold">Detailed Solutions</span>
                      <span className="font-black text-emerald-600">Included (Step-by-Step)</span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-slate-500 font-semibold">All India Rank &amp; Analysis</span>
                      <span className="font-black text-emerald-600">Instant Report</span>
                    </div>
                  </div>

                  {/* Price Box */}
                  <div className="p-4 rounded-2xl bg-[#faf5fa] border border-[#edd6ed] flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">Total Payable</p>
                      <p className="text-xs text-emerald-700 font-bold">Special Offer 67% OFF</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs line-through text-slate-400 font-bold mr-1.5">
                        ₹{bankSettings.original_price || 299}
                      </span>
                      <span className="text-3xl font-black text-[#6d3a68]">
                        ₹{upiAmount}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 text-[11px] text-slate-500 font-medium">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>One-time unlock for all mock tests in this subject</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Instant access: open papers immediately after payment</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2.5 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    disabled={isProcessingPayment}
                    onClick={handleCompleteMockPurchase}
                    className="w-full py-3.5 rounded-2xl bg-[#00b074] hover:bg-[#009260] text-white text-sm font-black uppercase tracking-wider transition-all shadow-lg hover:shadow-xl active:scale-98 cursor-pointer flex items-center justify-center gap-2"
                  >
                    {isProcessingPayment ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Verifying Payment...</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4 stroke-[3]" />
                        <span>I Have Paid ₹{upiAmount} - Unlock Now</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setPurchasingSubject(null);
                      setPaymentStep('method');
                    }}
                    className="w-full py-2.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                  >
                    Cancel &amp; Return to Covers
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Pre-exam instruction screen (Seamless view with website theme styling)
  if (selectedPaperForInstructions) {
    const paper = selectedPaperForInstructions;
    return (
      <div className="space-y-6 pb-16 font-sans max-w-4xl mx-auto animate-in fade-in duration-200">
        {/* Top Navigation */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setSelectedPaperForInstructions(null)}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-indigo-600 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-indigo-600" />
            <span>← Back to Mock Tests</span>
          </button>
          <span className="text-xs font-semibold text-slate-400">Pre-Examination Verification</span>
        </div>

        {/* 1. Header & Title Area (Seamless Background) */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[10px] font-black text-indigo-700 bg-indigo-100 border border-indigo-200 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  {paper.subject_code || 'OLYMPIAD'}
                </span>
                <span className="font-mono text-xs font-semibold text-slate-600 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md">
                  {paper.short_code || paper.subject_code}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {paper.title}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                All India National Ranking Mock Test with Instant Analysis &amp; Answer Keys.
              </p>
            </div>

            <div className="shrink-0">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Live Mock Test Ready
              </span>
            </div>
          </div>

          {/* 4 Metric Stats (Card Grid) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200 text-center shadow-2xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Duration</span>
              <h4 className="text-base sm:text-lg font-black text-slate-900 mt-0.5">{paper.duration_minutes || 60} Minutes</h4>
              <p className="text-[10px] text-slate-400">Automated timer</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-white border border-slate-200 text-center shadow-2xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Questions</span>
              <h4 className="text-base sm:text-lg font-black text-indigo-600 mt-0.5">{paper.questions?.length || 5} MCQs</h4>
              <p className="text-[10px] text-slate-400">Single correct</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-white border border-slate-200 text-center shadow-2xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Marks</span>
              <h4 className="text-base sm:text-lg font-black text-slate-900 mt-0.5">{paper.total_marks || 60}</h4>
              <p className="text-[10px] text-slate-400">Max Score</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-white border border-slate-200 text-center shadow-2xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Target Cutoff</span>
              <h4 className="text-base sm:text-lg font-black text-emerald-600 mt-0.5">{paper.cutoff_marks || 42} Marks</h4>
              <p className="text-[10px] text-slate-400">Benchmark cutoff</p>
            </div>
          </div>
        </div>

        {/* 2. Guidelines (Seamless Background) */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Important Examination Rules</h3>
              <p className="text-[11px] text-slate-400">Please review carefully before starting your timer</p>
            </div>
          </div>

          <div className="space-y-2 text-xs text-slate-600 pl-1">
            <p className="flex items-start gap-2">
              <span className="font-bold text-indigo-600">1.</span>
              <span>The timer will begin immediately when you click <strong>Start Mock Test Now</strong>.</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="font-bold text-indigo-600">2.</span>
              <span>Each correct answer awards 1 mark. There is no negative marking for unattempted questions.</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="font-bold text-indigo-600">3.</span>
              <span>You can mark questions for review and navigate freely between questions.</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="font-bold text-indigo-600">4.</span>
              <span>Upon submission, your score, accuracy %, percentile rank, and detailed answers will be generated instantly.</span>
            </p>
          </div>

          <div className="pt-2 flex items-center gap-2.5">
            <input
              type="checkbox"
              id="agreeCheckContent"
              checked={hasAgreedToRules}
              onChange={(e) => setHasAgreedToRules(e.target.checked)}
              className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500 cursor-pointer"
            />
            <label htmlFor="agreeCheckContent" className="text-xs font-bold text-slate-800 cursor-pointer select-none">
              I have read and understood all the mock test instructions.
            </label>
          </div>
        </div>

        {/* 3. Action Buttons (Seamless) */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200 flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setSelectedPaperForInstructions(null)}
            className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer transition-all active:scale-95"
          >
            Cancel
          </button>
          
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setPdfModalPaper(paper)}
              className="px-5 py-3 rounded-2xl bg-white border-2 border-indigo-200 hover:border-indigo-300 hover:bg-indigo-50/50 text-indigo-700 font-bold text-xs sm:text-sm shadow-xs cursor-pointer flex items-center gap-2 active:scale-95 transition-all"
            >
              <Download className="w-4 h-4 text-indigo-600" />
              <span>Download PDF</span>
            </button>

            <button
              type="button"
              disabled={!hasAgreedToRules}
              onClick={() => {
                const pId = paper.id;
                setSelectedPaperForInstructions(null);
                if (onStartExam) {
                  onStartExam(pId);
                }
              }}
              className="px-7 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white font-black text-xs sm:text-sm shadow-md hover:shadow-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 active:scale-95 transition-all border border-indigo-600"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Start Mock Test Now →</span>
            </button>
          </div>
        </div>

        {/* Terms & Conditions PDF Modal */}
        <DownloadPaperPdfModal
          isOpen={!!pdfModalPaper}
          onClose={() => setPdfModalPaper(null)}
          paper={pdfModalPaper}
          onStartExamAfterDownload={(pId) => {
            setSelectedPaperForInstructions(null);
            if (onStartExam) onStartExam(pId);
          }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-14 font-sans w-full max-w-full overflow-x-hidden">
      {openedMockSeries ? (
        /* ========================================================================= */
        /* LEVEL 2: SPECIFIC SUBJECT MOCK TEST SERIES (Opens ONLY after clicking Open) */
        /* ========================================================================= */
        (() => {
          const currentSub = ALL_SUBJECT_COVERS.find(s => s.code === openedMockSeries) || ALL_SUBJECT_COVERS[0];
          const isSubUnlocked = isSubjectPurchased(currentSub.code, studentClass, purchasedTests);
          const subjectPapers = getSubjectPapers(currentSub.code, currentSub.altCode);

          return (
            <div className="space-y-5 animate-in fade-in duration-200">
              {/* Back to Subject Cover Navigation */}
              <div className="flex items-center justify-between flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => setOpenedMockSeries(null)}
                  className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-indigo-600 px-4 py-2 rounded-xl bg-white border border-slate-200 shadow-2xs hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4 text-indigo-600" />
                  <span>← Back to Subject Cover</span>
                </button>

                <div className="flex items-center gap-2.5 flex-wrap">
                  {/* Class Dropdown */}
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white border border-slate-200 shadow-2xs">
                    <GraduationCap className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                    <span className="text-xs font-bold text-slate-500">Class:</span>
                    <select
                      value={selectedClass}
                      onChange={(e) => setSelectedClass(e.target.value)}
                      aria-label="Select Class"
                      className="text-xs font-black text-slate-800 bg-transparent focus:outline-none cursor-pointer"
                    >
                      {CLASS_OPTIONS.map((cls) => (
                        <option key={cls} value={cls}>
                          {cls}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Switch Subject */}
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white border border-slate-200 shadow-2xs">
                    <span className="text-xs font-bold text-slate-500">
                      Subject:
                    </span>
                    <select
                      value={openedMockSeries}
                      onChange={(e) => {
                        const val = e.target.value;
                        setOpenedMockSeries(val);
                        setSelectedSubject(val);
                        if (onNavigateTab) onNavigateTab(`content_${val.toLowerCase()}`);
                      }}
                      className="text-xs font-black text-slate-800 bg-transparent focus:outline-none cursor-pointer"
                    >
                      {ALL_SUBJECT_COVERS.map(s => (
                        <option key={s.code} value={s.code}>{s.code} - {s.title}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {!isSubUnlocked ? (
                /* Locked Test Series Notice */
                <div className="bg-white rounded-3xl p-8 sm:p-10 border-2 border-amber-300 shadow-sm text-center space-y-4 max-w-xl mx-auto my-8 animate-in fade-in">
                  <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto shadow-xs">
                    <Lock className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                      🔒 {currentSub.title} Mock Series is Locked
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1.5 max-w-md mx-auto leading-relaxed">
                      Purchase the complete {studentClass} test series to unlock all 5 timed mock papers, CBT exam timer, instant scorecards, and step-by-step solutions.
                    </p>
                  </div>
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => setPurchasingSubject(currentSub)}
                      className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-sm shadow-md hover:shadow-lg active:scale-95 transition-all cursor-pointer inline-flex items-center gap-2"
                    >
                      <Lock className="w-4 h-4" />
                      <span>Unlock &amp; Pay ₹{bankSettings.test_pack_price || 99} Now</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* Mock Tests Cards Grid (Colorful 2-3 Mix Pastel Theme) */
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {subjectPapers.map((paper) => {
                    const result = myTestResults.find(
                      r => (r.exam_id && (r.exam_id === paper.id || String(r.exam_id) === String(paper.id))) ||
                           (r.exam_title && r.exam_title.toLowerCase() === paper.title.toLowerCase())
                    );
                    const isCompleted = !!result;

                    return (
                      <div
                        key={paper.id}
                        className={`${currentSub.cardBg || 'bg-gradient-to-br from-purple-50 via-indigo-50 to-sky-50 border-2 border-purple-200'} rounded-3xl p-6 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between space-y-5 group relative overflow-hidden text-slate-900`}
                      >
                        {/* Top: Icon + Title + Class */}
                        <div className="space-y-3">
                          <div className={`w-12 h-12 rounded-2xl ${currentSub.iconBg || 'bg-gradient-to-tr from-purple-500 via-indigo-500 to-sky-500 text-white'} flex items-center justify-center shadow-md group-hover:scale-105 transition-transform shrink-0 border border-white/40`}>
                            <FileText className="w-6 h-6 stroke-[2.2]" />
                          </div>

                          <div>
                            <h4 className="font-black text-slate-900 text-base sm:text-lg tracking-tight leading-snug">
                              {paper.title}
                            </h4>
                            <p className="text-xs sm:text-sm font-bold text-slate-500 mt-0.5">
                              {paper.class_name || studentClass}
                            </p>
                          </div>
                        </div>

                        {/* Middle: Status & Score Containers */}
                        <div className="space-y-2.5">
                          {/* Row 1: Status Box */}
                          <div className="bg-white/85 border border-black/5 p-2.5 px-3.5 rounded-2xl flex items-center justify-between shadow-2xs backdrop-blur-xs">
                            <div className="flex items-center gap-2">
                              <span className="w-2.5 h-2.5 rounded-full bg-pink-500 shrink-0" />
                              <span className="text-xs font-bold text-slate-700">Status:</span>
                            </div>
                            {isCompleted ? (
                              <span className="px-3 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 text-[11px] font-black uppercase tracking-wider">
                                COMPLETED
                              </span>
                            ) : (
                              <span className="px-3 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200 text-[11px] font-black uppercase tracking-wider">
                                UNATTEMPTED
                              </span>
                            )}
                          </div>

                          {/* Row 2: Last Score Box */}
                          <div className="bg-white/85 border border-black/5 p-2.5 px-3.5 rounded-2xl flex items-center justify-between shadow-2xs backdrop-blur-xs">
                            <div className="flex items-center gap-2">
                              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 shrink-0" />
                              <span className="text-xs font-bold text-slate-700">Last Score:</span>
                            </div>
                            {isCompleted ? (
                              <span className="px-3 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 text-[11px] font-black">
                                {result.score} / {result.total_marks || paper.total_marks || 60} ({Math.round(result.percentage || 0)}%)
                              </span>
                            ) : (
                              <span className="px-3 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 text-[11px] font-black">
                                none
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Card Footer: Open Test Button */}
                        <div className="pt-2 flex justify-end">
                          <button
                            type="button"
                            onClick={() => setSelectedPaperForInstructions(paper)}
                            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl ${currentSub.btnBg || 'bg-gradient-to-r from-purple-600 via-indigo-600 to-sky-500 text-white'} font-black text-xs sm:text-sm shadow-sm hover:shadow-md transition-all cursor-pointer active:scale-95`}
                          >
                            <span>Open Test</span>
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })()
      ) : (
        /* ========================================================================= */
        /* LEVEL 1: STUDY PACKAGES (LOCKED) & SUBJECT COVERS (UNLOCKED)              */
        /* ========================================================================= */
        <div className="space-y-6 animate-in fade-in duration-150">
          {/* Header Row: Title + Class Dropdown */}
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
                <BookOpen className="w-6 h-6 text-indigo-600" />
                <span>
                  {selectedSubject !== 'ALL'
                    ? `${selectedSubject} Mock Test Series`
                    : 'Olympiad Mock Test Series'}
                </span>
              </h2>
              <p className="text-xs text-slate-500 font-semibold mt-1">
                {selectedSubject !== 'ALL'
                  ? `Click "Unlock & Buy Test Series" below to unlock and start mock tests for ${selectedSubject}.`
                  : 'Select any Olympiad subject below to view official mock tests, papers & practice.'}
              </p>
            </div>

            {/* Class Dropdown */}
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-slate-200 shadow-2xs hover:border-indigo-300 transition-colors">
              <GraduationCap className="w-4 h-4 text-indigo-600 shrink-0" />
              <span className="text-xs font-bold text-slate-500">Class:</span>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                aria-label="Select Class"
                className="text-xs font-black text-slate-800 bg-transparent focus:outline-none cursor-pointer pr-1"
              >
                {CLASS_OPTIONS.map((cls) => (
                  <option key={cls} value={cls}>
                    {cls}
                  </option>
                ))}
              </select>
            </div>
          </div>



          {/* Grid of Cards */}
          <div className={`grid gap-6 w-full ${
            visibleCovers.length === 1
              ? 'grid-cols-1 max-w-[480px]'
              : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
          }`}>
            {visibleCovers.map((sub) => {
              const isUnlocked = isSubjectPurchased(sub.code, studentClass, purchasedTests);
              const subjectPkgs = getPackagesForSubject(sub.code);
              const primaryPkg = subjectPkgs[0] || {
                id: `pkg_${sub.code.toLowerCase()}`,
                title: `Olympiads Level-2 Champs Package - ${studentClass}`,
                class_name: studentClass,
                subject_code: sub.code,
                price: bankSettings.mock_test_price || bankSettings.test_pack_price || 99,
                original_price: bankSettings.original_price || 299,
                header_color: '#4895d9',
                points: [
                  '5 Grand Level-1 & Level-2 National Mock Tests',
                  'Detailed Step-by-Step Solutions & Explanations',
                  'All India Rank & Benchmark Percentile',
                  'Timed CBT Online Exam Simulator',
                  'Unlimited Re-attempts for Academic Year'
                ]
              };
              const SubIcon = sub.icon;
              const effectivePrice = primaryPkg.price || bankSettings.mock_test_price || bankSettings.test_pack_price || 99;
              const origPrice = primaryPkg.original_price || bankSettings.original_price || 299;

              // Decide whether to render the Package Card (Image 1) or Cover Card (Image 2)
              const renderAsPackage = viewMode === 'packages' || (viewMode === 'smart' && !isUnlocked);

              if (renderAsPackage) {
                /* ================================================================= */
                /* IMAGE 1: ALL-IN-ONE STUDY PACKAGE CARD                            */
                /* ================================================================= */
                return (
                  <div
                    key={`pkg_card_${sub.code}`}
                    className="bg-white rounded-2xl border-2 border-sky-300 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 relative overflow-hidden text-slate-900"
                  >
                    <div>
                      {/* Colored Header Banner (Image 1 Style) */}
                      <div
                        className="text-white text-center py-2.5 px-3 rounded-t-xl -mt-5 -mx-5 font-black text-xs sm:text-sm shadow-xs mb-3 truncate"
                        style={{ backgroundColor: primaryPkg.header_color || '#4895d9' }}
                      >
                        {primaryPkg.title}
                      </div>

                      {/* Class & Features Badges */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold text-[10px]">
                          {primaryPkg.class_name || studentClass} &bull; {primaryPkg.subject_code || sub.code}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[10px]">
                          {(primaryPkg.points || []).length} Key Features
                        </span>
                      </div>

                      {/* Key Features Checklist with Green Checkmarks */}
                      <div className="space-y-2 text-xs text-slate-700 min-h-[140px]">
                        {(primaryPkg.points || []).map((pt, pIdx) => (
                          <div key={pIdx} className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-[#00b074] shrink-0 mt-0.5" />
                            <span className="leading-snug text-[11px] font-medium text-slate-800">{pt}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Price & Action Row */}
                    <div className="pt-3 border-t border-slate-100 space-y-3">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                        <div>
                          <span>Price: </span>
                          <span className="font-black text-base text-[#6d3a68]">
                            ₹{parseFloat(effectivePrice).toFixed(2)}
                          </span>
                          {origPrice && (
                            <span className="ml-2 text-slate-400 line-through text-[11px]">
                              ₹{parseFloat(origPrice).toFixed(2)}
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Live
                        </span>
                      </div>

                      {/* Action Button */}
                      {isUnlocked ? (
                        <button
                          type="button"
                          onClick={() => {
                            setOpenedMockSeries(sub.code);
                            setSelectedSubject(sub.code);
                          }}
                          className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-700 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md cursor-pointer active:scale-98 transition-all"
                        >
                          <Check className="w-4 h-4 stroke-[3]" />
                          <span>✓ UNLOCKED - Open Mock Tests &rarr;</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleOpenPayment(sub, primaryPkg)}
                          className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md active:scale-98 transition-all cursor-pointer border border-emerald-600"
                        >
                          <Lock className="w-4 h-4" />
                          <span>🔒 Unlock &amp; Buy Test Series (₹{parseFloat(effectivePrice).toFixed(2)})</span>
                        </button>
                      )}


                    </div>
                  </div>
                );
              }

              /* ================================================================= */
              /* IMAGE 2: SUBJECT COVER CARD (Revealed when Unlocked / Bought)     */
              /* ================================================================= */
              return (
                <div
                  key={`cover_card_${sub.code}`}
                  className={`${sub.cardBg} rounded-3xl p-6 sm:p-7 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between group relative overflow-hidden aspect-square min-h-[380px] sm:min-h-[400px] w-full text-slate-900 hover:-translate-y-1`}
                >
                  <div className="space-y-3.5">
                    {/* Top Header Row */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-12 h-12 rounded-2xl ${sub.iconBg} flex items-center justify-center border border-white/40 group-hover:scale-105 transition-transform shrink-0`}>
                          <SubIcon className="w-6 h-6" />
                        </div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className={`px-2.5 py-0.5 rounded-full ${sub.tagBg} text-[11px] font-extrabold uppercase tracking-wide`}>
                            {studentClass}
                          </span>
                          <span className={`px-2.5 py-0.5 rounded-full ${sub.tagBg} text-[11px] font-bold`}>
                            {sub.code}
                          </span>
                        </div>
                      </div>

                      {/* Status indicator: Unlocked vs Locked */}
                      {isUnlocked ? (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            lockSubject(sub.code, studentClass);
                            setPurchasedTests(getPurchasedTests());
                          }}
                          title="Click to lock this subject again for testing"
                          className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 hover:bg-rose-100 text-emerald-900 hover:text-rose-900 border border-emerald-300 hover:border-rose-300 text-xs font-black shrink-0 shadow-2xs transition-all cursor-pointer group/lock"
                        >
                          <Check className="w-3.5 h-3.5 stroke-[3] group-hover/lock:hidden" />
                          <Lock className="w-3.5 h-3.5 hidden group-hover/lock:inline text-rose-600" />
                          <span className="group-hover/lock:hidden">UNLOCKED</span>
                          <span className="hidden group-hover/lock:inline text-rose-700">LOCK</span>
                        </button>
                      ) : (
                        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-xs font-black shrink-0 shadow-2xs">
                          <Lock className="w-3.5 h-3.5" />
                          <span>LOCKED</span>
                        </div>
                      )}
                    </div>

                    {/* Title, Subtitle & Description */}
                    <div className="space-y-1 pt-1">
                      <h3 className="font-black text-slate-900 text-lg sm:text-xl tracking-tight leading-snug">
                        {sub.title}
                      </h3>
                      <p className="text-xs font-bold text-slate-600">
                        {sub.subtitle}
                      </p>
                      <p className="text-xs text-slate-600 font-normal leading-relaxed pt-1.5 line-clamp-3">
                        {sub.description || 'Practice authentic Olympiad questions, improve speed and accuracy, and boost your rank.'}
                      </p>
                    </div>
                  </div>

                  {/* Bottom Action Bar & Highlights (Colorful Pill Tags) */}
                  <div className="pt-4 border-t border-black/5 space-y-3">
                    {isUnlocked ? (
                      <button
                        type="button"
                        onClick={() => {
                          setOpenedMockSeries(sub.code);
                          setSelectedSubject(sub.code);
                        }}
                        className={`w-full py-3 rounded-xl ${sub.btnBg} font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs active:scale-98 transition-all cursor-pointer`}
                      >
                        <span>Start Mock Test</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleOpenPayment(sub, primaryPkg)}
                        className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md active:scale-98 transition-all cursor-pointer border border-emerald-600"
                      >
                        <Lock className="w-4 h-4" />
                        <span>Unlock &amp; Buy Test Series (₹{effectivePrice})</span>
                      </button>
                    )}

                    <div className="flex items-center justify-between gap-1.5 flex-wrap">
                      <div className="flex items-center gap-1 text-[10px] sm:text-[11px] font-semibold text-slate-700 bg-white/90 border border-black/5 px-2 py-0.5 rounded-full shadow-2xs">
                        <div className="w-3.5 h-3.5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                          <Check className="w-2 h-2 stroke-[3]" />
                        </div>
                        <span>Updated Syllabus</span>
                      </div>

                      <div className="flex items-center gap-1 text-[10px] sm:text-[11px] font-semibold text-slate-700 bg-white/90 border border-black/5 px-2 py-0.5 rounded-full shadow-2xs">
                        <div className="w-3.5 h-3.5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                          <BarChart2 className="w-2 h-2" />
                        </div>
                        <span>Real Exam Pattern</span>
                      </div>

                      <div className="flex items-center gap-1 text-[10px] sm:text-[11px] font-semibold text-slate-700 bg-white/90 border border-black/5 px-2 py-0.5 rounded-full shadow-2xs">
                        <div className="w-3.5 h-3.5 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                          <Trophy className="w-2 h-2" />
                        </div>
                        <span>Improve Score</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
