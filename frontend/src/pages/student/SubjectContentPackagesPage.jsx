import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import {
  Laptop,
  Rocket,
  Calculator,
  BookOpen,
  Globe,
  Brain,
  CheckCircle2,
  Download,
  Play,
  FileText,
  Sparkles,
  Zap,
  ShoppingCart,
  Check,
  ChevronRight,
  ChevronLeft,
  X,
  ExternalLink,
  ShieldCheck,
  Award,
  Layers,
  CreditCard,
  Printer,
  Flame,
  Info,
  ArrowLeft
} from 'lucide-react';

const SUBJECT_CONFIGS = {
  icso: {
    code: 'ICSO',
    name: 'International Cyber Olympiad',
    shortTitle: 'ICSO (Cyber)',
    badgeColor: 'bg-sky-600',
    borderColor: 'border-sky-500',
    lightBg: 'bg-sky-50',
    icon: Laptop,
    accent: '#0284c7',
    logoLetters: ['I', 'C', 'S', 'O'],
    subjectsIncluded: 'ICSO, IMO & ISO',
    synopsisSubjects: 'ICSO, IMO & ISO',
    worksheetsSubjects: 'ICSO & ISO',
    chapters: [
      { id: 1, title: 'Hardware & Peripheral Devices', questions: 25, hasVideo: true, hasPdf: true },
      { id: 2, title: 'Operating Systems & File Management', questions: 20, hasVideo: true, hasPdf: true },
      { id: 3, title: 'Algorithms, Flowcharts & Pseudo-code', questions: 30, hasVideo: true, hasPdf: true },
      { id: 4, title: 'Networking, Internet & Cyber Security', questions: 25, hasVideo: true, hasPdf: true },
      { id: 5, title: 'MS Office & Modern Cloud Tools', questions: 20, hasVideo: true, hasPdf: true },
      { id: 6, title: 'Artificial Intelligence & Robotics Basics', questions: 25, hasVideo: true, hasPdf: true },
      { id: 7, title: 'Achievers Higher Order Thinking (HOTS)', questions: 15, hasVideo: true, hasPdf: true }
    ]
  },
  iso: {
    code: 'ISO',
    name: 'International Science Olympiad',
    shortTitle: 'ISO (NSO)',
    badgeColor: 'bg-emerald-600',
    borderColor: 'border-emerald-500',
    lightBg: 'bg-emerald-50',
    icon: Rocket,
    accent: '#059669',
    logoLetters: ['I', 'S', 'O'],
    subjectsIncluded: 'ISO, IMO & IEO',
    synopsisSubjects: 'ISO, IMO & ICSO',
    worksheetsSubjects: 'ISO & IMO',
    chapters: [
      { id: 1, title: 'Living and Non-Living Things', questions: 30, hasVideo: true, hasPdf: true },
      { id: 2, title: 'Human Body, Nutrition & Health', questions: 25, hasVideo: true, hasPdf: true },
      { id: 3, title: 'Matter, Materials & Chemical Changes', questions: 30, hasVideo: true, hasPdf: true },
      { id: 4, title: 'Force, Motion, Work and Energy', questions: 35, hasVideo: true, hasPdf: true },
      { id: 5, title: 'Light, Shadows, Sound & Heat', questions: 25, hasVideo: true, hasPdf: true },
      { id: 6, title: 'Our Environment & Natural Resources', questions: 20, hasVideo: true, hasPdf: true },
      { id: 7, title: 'Achievers Scientific HOTS Section', questions: 15, hasVideo: true, hasPdf: true }
    ]
  },
  imo: {
    code: 'IMO',
    name: 'International Mathematics Olympiad',
    shortTitle: 'IMO (Maths)',
    badgeColor: 'bg-amber-500',
    borderColor: 'border-amber-400',
    lightBg: 'bg-amber-50',
    icon: Calculator,
    accent: '#d97706',
    logoLetters: ['I', 'M', 'O'],
    subjectsIncluded: 'IMO, ISO & IEO',
    synopsisSubjects: 'IMO, ISO & ICSO',
    worksheetsSubjects: 'IMO & ISO',
    chapters: [
      { id: 1, title: 'Number Sense, Roman Numerals & Place Value', questions: 30, hasVideo: true, hasPdf: true },
      { id: 2, title: 'Computation Operations & Speed Arithmetic', questions: 35, hasVideo: true, hasPdf: true },
      { id: 3, title: 'Fractions, Decimals & Percentages', questions: 30, hasVideo: true, hasPdf: true },
      { id: 4, title: 'Geometry, Lines, Angles & Symmetry', questions: 25, hasVideo: true, hasPdf: true },
      { id: 5, title: 'Perimeter, Area and Measurement', questions: 30, hasVideo: true, hasPdf: true },
      { id: 6, title: 'Data Handling, Pictographs & Bar Graphs', questions: 20, hasVideo: true, hasPdf: true },
      { id: 7, title: 'Achievers HOTS Mathematical Problems', questions: 15, hasVideo: true, hasPdf: true }
    ]
  },
  ieo: {
    code: 'IEO',
    name: 'International English Olympiad',
    shortTitle: 'IEO (English)',
    badgeColor: 'bg-orange-500',
    borderColor: 'border-orange-400',
    lightBg: 'bg-orange-50',
    icon: BookOpen,
    accent: '#ea580c',
    logoLetters: ['I', 'E', 'O'],
    subjectsIncluded: 'IEO, IMO & ISO',
    synopsisSubjects: 'IEO, IMO & ISO',
    worksheetsSubjects: 'IEO & IMO',
    chapters: [
      { id: 1, title: 'Nouns, Pronouns, Adjectives & Adverbs', questions: 30, hasVideo: true, hasPdf: true },
      { id: 2, title: 'Verbs, Modals, Tenses & Voice', questions: 30, hasVideo: true, hasPdf: true },
      { id: 3, title: 'Prepositions, Conjunctions & Articles', questions: 25, hasVideo: true, hasPdf: true },
      { id: 4, title: 'Vocabulary, Antonyms, Synonyms & Idioms', questions: 35, hasVideo: true, hasPdf: true },
      { id: 5, title: 'Reading Comprehension Passages', questions: 20, hasVideo: true, hasPdf: true },
      { id: 6, title: 'Spoken and Written Expression', questions: 20, hasVideo: true, hasPdf: true },
      { id: 7, title: 'Achievers Verbal HOTS Section', questions: 15, hasVideo: true, hasPdf: true }
    ]
  },
  igko: {
    code: 'IGKO',
    name: 'International General Knowledge Olympiad',
    shortTitle: 'IGKO (GK)',
    badgeColor: 'bg-sky-500',
    borderColor: 'border-sky-400',
    lightBg: 'bg-sky-50',
    icon: Globe,
    accent: '#0284c7',
    logoLetters: ['I', 'G', 'K', 'O'],
    subjectsIncluded: 'IGKO, IMO & ISO',
    synopsisSubjects: 'IGKO, IMO & ISO',
    worksheetsSubjects: 'IGKO & ISO',
    chapters: [
      { id: 1, title: 'Our Surroundings, Plants & Animals', questions: 25, hasVideo: true, hasPdf: true },
      { id: 2, title: 'India and the World: Capitals & Currencies', questions: 30, hasVideo: true, hasPdf: true },
      { id: 3, title: 'Science, Space & Inventions', questions: 25, hasVideo: true, hasPdf: true },
      { id: 4, title: 'Sports, Entertainment & National Awards', questions: 20, hasVideo: true, hasPdf: true },
      { id: 5, title: 'Current Affairs & Global Leaders', questions: 25, hasVideo: true, hasPdf: true },
      { id: 6, title: 'Life Skills, Values & Quantitative Aptitude', questions: 20, hasVideo: true, hasPdf: true },
      { id: 7, title: 'Achievers HOTS General Knowledge', questions: 15, hasVideo: true, hasPdf: true }
    ]
  },
  isso: {
    code: 'ISSO',
    name: 'International Social Studies & Reasoning Olympiad',
    shortTitle: 'ISSO (Reasoning)',
    badgeColor: 'bg-purple-600',
    borderColor: 'border-purple-500',
    lightBg: 'bg-purple-50',
    icon: Brain,
    accent: '#7c3aed',
    logoLetters: ['I', 'S', 'S', 'O'],
    subjectsIncluded: 'ISSO, IMO & ISO',
    synopsisSubjects: 'ISSO, IMO & ISO',
    worksheetsSubjects: 'ISSO & IMO',
    chapters: [
      { id: 1, title: 'Patterns, Number & Alpha-Numeric Series', questions: 30, hasVideo: true, hasPdf: true },
      { id: 2, title: 'Analogy and Classification', questions: 25, hasVideo: true, hasPdf: true },
      { id: 3, title: 'Coding - Decoding & Blood Relations', questions: 30, hasVideo: true, hasPdf: true },
      { id: 4, title: 'Direction Sense Test & Ranking Order', questions: 25, hasVideo: true, hasPdf: true },
      { id: 5, title: 'Mirror & Water Images, Paper Folding', questions: 20, hasVideo: true, hasPdf: true },
      { id: 6, title: 'Cubes, Dice & Embedded Figures', questions: 25, hasVideo: true, hasPdf: true },
      { id: 7, title: 'Achievers Logical Reasoning HOTS', questions: 15, hasVideo: true, hasPdf: true }
    ]
  }
};

const ALL_CLASSES = [
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

export const SubjectContentPackagesPage = ({
  subjectCode = 'icso',
  onNavigateTab,
  onStartExam
}) => {
  const { user } = useAuth();
  const { addToCart, addMultipleToCart, openCart } = useCart();

  const normalizedSubjectKey = subjectCode.replace('content_', '').toLowerCase();
  const subject = SUBJECT_CONFIGS[normalizedSubjectKey] || SUBJECT_CONFIGS.icso;

  const [selectedClass, setSelectedClass] = useState(user?.class || 'Class 6');
  const [activeTab, setActiveTab] = useState('packages'); // 'packages' | 'study_content'
  const [selectedPackageDetail, setSelectedPackageDetail] = useState(null);
  const [selectedChapterPreview, setSelectedChapterPreview] = useState(null);

  // Dynamic Super Admin Authored Packages
  const [adminPackages, setAdminPackages] = useState([]);
  const [loadingPackages, setLoadingPackages] = useState(false);

  // Multi-Item / Sub-Package Selection Modal State (Image 1 replica)
  const [subSelectionModalPackage, setSubSelectionModalPackage] = useState(null);
  const [selectedSubItemIds, setSelectedSubItemIds] = useState([]);
  const [expandedSubItemId, setExpandedSubItemId] = useState(null);

  // Fetch dynamic packages from Super Admin
  const fetchAdminPackages = async (grade = selectedClass) => {
    setLoadingPackages(true);
    try {
      const res = await fetch(`/api/packages?class=${encodeURIComponent(grade)}`);
      const data = await res.json();
      if (data && data.success && Array.isArray(data.data) && data.data.length > 0) {
        setAdminPackages(data.data);
      } else {
        setAdminPackages([]);
      }
    } catch (e) {
      console.warn('Error fetching packages:', e);
      setAdminPackages([]);
    } finally {
      setLoadingPackages(false);
    }
  };

  useEffect(() => {
    fetchAdminPackages(selectedClass);
  }, [selectedClass]);

  // Fallback standard packages if none in DB
  const defaultFallbackPackages = [
    {
      id: 101,
      title: `Olympiads Level-2 Champs Package - ${selectedClass}`,
      price: 1999,
      original_price: 2500,
      header_color: '#4895d9',
      points: [
        '5 Grand Level-2 National Mock Tests',
        'Advanced HOTS & Tie-Breaker Problem Sets',
        'Detailed Video Solutions & Step-by-Step Analysis',
        'National Benchmark Percentile & AIR Ranking',
        'Unlimited Test Retake Attempts for 365 Days'
      ],
      bundle_offers_text: 'Offer: Save 20% on 5 or more packages, 15% on Any 4, 10% on Any 3 and 5% on Any 2',
      discount_tiers: [
        { count: 2, discount_pct: 5 },
        { count: 3, discount_pct: 10 },
        { count: 4, discount_pct: 15 },
        { count: 5, discount_pct: 20 }
      ],
      sub_items: [
        {
          id: 'mock_igko',
          title: `Mock Test Series - IGKO ${selectedClass}`,
          subject: 'IGKO',
          original_price: 600.00,
          price: 400.00,
          offer_text: 'Special Offer: 600.00 - 400.00',
          points: [
            '10 IGKO Online Mock Tests',
            'Aligned with the SOF Exam Pattern - 2026',
            'Same Test Duration as the SOF IGKO Exam',
            'Same Number of Questions and Pattern',
            'Matching Syllabus & Difficulty Level',
            'Interactive and Downloadable'
          ],
          is_default_selected: true
        },
        {
          id: 'pyp_ieo_l1',
          title: `Previous Years Papers with Solutions - Level-1 - IEO ${selectedClass}`,
          subject: 'IEO',
          original_price: 899.00,
          price: 600.00,
          offer_text: 'Special Offer: 899.00 - 600.00',
          points: [
            '6 IEO Previous Years Papers',
            'Answer keys of all questions',
            'Explanation of all questions',
            'Identify Important Topics',
            'Prepare for Different Difficulty Levels',
            'Interactive and Downloadable'
          ],
          is_default_selected: true
        },
        {
          id: 'pyp_icso',
          title: `Previous Years Papers with Solutions - ICSO ${selectedClass}`,
          subject: 'ICSO',
          original_price: 899.00,
          price: 600.00,
          offer_text: 'Special Offer: 899.00 - 600.00',
          points: [
            '6 ICSO Previous Years Papers',
            'Answer keys of all questions',
            'Explanation of all questions',
            'Identify Important Topics',
            'Prepare for Different Difficulty Levels',
            'Interactive and Downloadable'
          ],
          is_default_selected: false
        },
        {
          id: 'mock_ieo_l1',
          title: `Mock Test Series - Level-1 - IEO ${selectedClass}`,
          subject: 'IEO',
          original_price: 899.00,
          price: 600.00,
          offer_text: 'Special Offer: 899.00 - 600.00',
          points: [
            '6 IEO Online Mock Tests',
            'Aligned with the SOF Exam Pattern - 2026',
            'Same Test Duration as the SOF IEO Exam',
            'Same Number of Questions and Pattern',
            'Matching Syllabus & Difficulty Level',
            'Interactive and Downloadable'
          ],
          is_default_selected: false
        },
        {
          id: 'pyp_imo',
          title: `Previous Years Papers with Solutions - IMO ${selectedClass}`,
          subject: 'IMO',
          original_price: 899.00,
          price: 600.00,
          offer_text: 'Special Offer: 899.00 - 600.00',
          points: [
            '6 IMO Previous Years Papers',
            'Step-by-step Mathematical Explanations',
            'Answer keys of all questions',
            'Achievers HOTS Math Section Included',
            'Interactive and Downloadable'
          ],
          is_default_selected: false
        },
        {
          id: 'mock_imo',
          title: `Mock Test Series - IMO ${selectedClass}`,
          subject: 'IMO',
          original_price: 899.00,
          price: 600.00,
          offer_text: 'Special Offer: 899.00 - 600.00',
          points: [
            '10 IMO Full Length Online Mock Tests',
            'Real Exam Countdown Clock and Scoring',
            'Detailed Speed & Accuracy Analysis',
            'Interactive and Downloadable'
          ],
          is_default_selected: false
        }
      ]
    },
    {
      id: 102,
      title: `Olympiads Power Prep Package - ${selectedClass}`,
      price: 1499,
      original_price: 1999,
      header_color: '#0284c7',
      points: [
        '50+ Chapter-wise Diagnostic Tests with Instant Scoring',
        'Previous 5 Years Solved Official Papers (2020-2024)',
        '10 Full-Length Timed Model Examination Papers',
        'Performance Weakness Diagnostic Heatmap',
        'Full Validity for Academic Year 2026-27'
      ],
      bundle_offers_text: 'Offer: Save 20% on 5 or more packages, 15% on Any 4, 10% on Any 3 and 5% on Any 2',
      discount_tiers: [
        { count: 2, discount_pct: 5 },
        { count: 3, discount_pct: 10 },
        { count: 4, discount_pct: 15 },
        { count: 5, discount_pct: 20 }
      ],
      sub_items: [
        {
          id: 'mock_igko',
          title: `Mock Test Series - IGKO ${selectedClass}`,
          subject: 'IGKO',
          original_price: 600.00,
          price: 400.00,
          offer_text: 'Special Offer: 600.00 - 400.00',
          points: [
            '10 IGKO Online Mock Tests',
            'Aligned with the SOF Exam Pattern - 2026',
            'Same Test Duration as the SOF IGKO Exam',
            'Same Number of Questions and Pattern',
            'Matching Syllabus & Difficulty Level',
            'Interactive and Downloadable'
          ],
          is_default_selected: true
        },
        {
          id: 'pyp_ieo_l1',
          title: `Previous Years Papers with Solutions - Level-1 - IEO ${selectedClass}`,
          subject: 'IEO',
          original_price: 899.00,
          price: 600.00,
          offer_text: 'Special Offer: 899.00 - 600.00',
          points: [
            '6 IEO Previous Years Papers',
            'Answer keys of all questions',
            'Explanation of all questions',
            'Identify Important Topics',
            'Prepare for Different Difficulty Levels',
            'Interactive and Downloadable'
          ],
          is_default_selected: true
        },
        {
          id: 'pyp_icso',
          title: `Previous Years Papers with Solutions - ICSO ${selectedClass}`,
          subject: 'ICSO',
          original_price: 899.00,
          price: 600.00,
          offer_text: 'Special Offer: 899.00 - 600.00',
          points: [
            '6 ICSO Previous Years Papers',
            'Answer keys of all questions',
            'Explanation of all questions',
            'Identify Important Topics',
            'Prepare for Different Difficulty Levels',
            'Interactive and Downloadable'
          ],
          is_default_selected: false
        },
        {
          id: 'mock_ieo_l1',
          title: `Mock Test Series - Level-1 - IEO ${selectedClass}`,
          subject: 'IEO',
          original_price: 899.00,
          price: 600.00,
          offer_text: 'Special Offer: 899.00 - 600.00',
          points: [
            '6 IEO Online Mock Tests',
            'Aligned with the SOF Exam Pattern - 2026',
            'Same Test Duration as the SOF IEO Exam',
            'Same Number of Questions and Pattern',
            'Matching Syllabus & Difficulty Level',
            'Interactive and Downloadable'
          ],
          is_default_selected: false
        }
      ]
    },
    {
      id: 103,
      title: `Chapter-wise Synopsis & Worksheets Kit - ${selectedClass}`,
      price: 499,
      original_price: 999,
      header_color: '#059669',
      points: [
        'High-Yield Quick Revision Formula & Concept Sheets',
        'Downloadable Printable PDF Question Worksheets',
        'Key Olympiad Shortcuts & Speed Arithmetic Tips',
        'Instant Access on Web and Mobile App'
      ],
      bundle_offers_text: 'Offer: Save 20% on 5 or more packages, 15% on Any 4, 10% on Any 3 and 5% on Any 2',
      discount_tiers: [
        { count: 2, discount_pct: 5 },
        { count: 3, discount_pct: 10 },
        { count: 4, discount_pct: 15 },
        { count: 5, discount_pct: 20 }
      ],
      sub_items: [
        {
          id: 'pyp_iso',
          title: `Previous Years Papers with Solutions - ISO (NSO) ${selectedClass}`,
          subject: 'ISO',
          original_price: 899.00,
          price: 600.00,
          offer_text: 'Special Offer: 899.00 - 600.00',
          points: [
            '6 ISO (NSO) Previous Years Papers',
            'Answer keys and scientific reasoning',
            'Interactive and Downloadable'
          ],
          is_default_selected: true
        },
        {
          id: 'mock_iso',
          title: `Mock Test Series - ISO (NSO) ${selectedClass}`,
          subject: 'ISO',
          original_price: 899.00,
          price: 600.00,
          offer_text: 'Special Offer: 899.00 - 600.00',
          points: [
            '10 ISO (NSO) Online Mock Tests',
            'Aligned with the SOF Exam Pattern - 2026',
            'Interactive and Downloadable'
          ],
          is_default_selected: false
        }
      ]
    }
  ];

  const packagesList = adminPackages.length > 0 ? adminPackages : defaultFallbackPackages;

  // Handle Buy Click on any Package Card -> Opens Image 1 Multi-Item / Sub-Package Selection Modal
  const handleInitiateBuy = (pkg) => {
    const subItems = Array.isArray(pkg.sub_items) && pkg.sub_items.length > 0
      ? pkg.sub_items
      : (defaultFallbackPackages[0]?.sub_items || []);

    const defaultSelected = subItems
      .filter((item) => item.is_default_selected)
      .map((item) => item.id || item.title);

    setSelectedSubItemIds(
      defaultSelected.length > 0 ? defaultSelected : [subItems[0]?.id || subItems[0]?.title]
    );
    setSubSelectionModalPackage({ ...pkg, sub_items: subItems });
  };

  // Toggle Sub-Item Selection
  const toggleSubItemSelection = (itemId) => {
    setSelectedSubItemIds((prev) => {
      if (prev.includes(itemId)) {
        return prev.filter((id) => id !== itemId);
      } else {
        return [...prev, itemId];
      }
    });
  };

  // Calculations for Multi-Item Selection Modal
  const currentModalSubItems = useMemo(() => {
    if (!subSelectionModalPackage) return [];
    return subSelectionModalPackage.sub_items || [];
  }, [subSelectionModalPackage]);

  const selectedItemsList = useMemo(() => {
    return currentModalSubItems.filter((item) =>
      selectedSubItemIds.includes(item.id || item.title)
    );
  }, [currentModalSubItems, selectedSubItemIds]);

  const selectedCount = selectedItemsList.length;

  const totalBasePrice = useMemo(() => {
    return selectedItemsList.reduce((acc, item) => acc + (Number(item.price) || 0), 0);
  }, [selectedItemsList]);

  const totalOriginalPrice = useMemo(() => {
    return selectedItemsList.reduce(
      (acc, item) => acc + (Number(item.original_price) || Number(item.price * 1.3) || 0),
      0
    );
  }, [selectedItemsList]);

  // Volume discount tier calculation
  const discountTiers = useMemo(() => {
    if (!subSelectionModalPackage?.discount_tiers) {
      return [
        { count: 2, discount_pct: 5 },
        { count: 3, discount_pct: 10 },
        { count: 4, discount_pct: 15 },
        { count: 5, discount_pct: 20 }
      ];
    }
    return subSelectionModalPackage.discount_tiers;
  }, [subSelectionModalPackage]);

  const activeDiscountPct = useMemo(() => {
    if (selectedCount < 2) return 0;
    const matched = [...discountTiers]
      .filter((t) => selectedCount >= t.count)
      .sort((a, b) => b.discount_pct - a.discount_pct);
    return matched[0]?.discount_pct || 0;
  }, [selectedCount, discountTiers]);

  const discountAmount = Math.round((totalBasePrice * activeDiscountPct) / 100);
  const finalPayable = Math.max(0, totalBasePrice - discountAmount);

  // Add Selected Items to Cart & Open Universal 4-Step Checkout
  const handleAddSelectedToCart = () => {
    if (selectedCount === 0) {
      alert('Please select at least 1 package item to proceed.');
      return;
    }

    const itemsToCart = selectedItemsList.map((item) => {
      const discountedItemPrice = activeDiscountPct > 0
        ? Math.round((item.price || 500) * (1 - activeDiscountPct / 100))
        : Number(item.price || 500);

      return {
        id: `pkg_${subSelectionModalPackage?.id || 'std'}_${item.id || item.title}`,
        name: `${item.title}`,
        price: discountedItemPrice,
        originalPrice: Number(item.original_price || item.price * 1.3),
        category: subject.name,
        grade: selectedClass,
        subject: item.subject || subject.code,
        thumbnailText: item.subject || 'PACKAGE',
        quantity: 1
      };
    });

    addMultipleToCart(itemsToCart);
    setSubSelectionModalPackage(null);
    openCart();
  };

  return (
    <div className="space-y-6 font-sans animate-in fade-in duration-150 max-w-7xl mx-auto pb-12">
      {/* 1. TOP HEADER & BREADCRUMB & CLASS SELECTOR */}
      <div className="space-y-3 bg-white p-4 sm:p-5 rounded-2xl border border-[#edd6ed] shadow-2xs">
        {/* Breadcrumb row */}
        <div className="flex items-center justify-between flex-wrap gap-2 text-xs font-bold text-slate-400">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => onNavigateTab && onNavigateTab('overview')}
              className="hover:text-[#6d3a68] uppercase text-[11px] font-black cursor-pointer"
            >
              HOME
            </button>
            <span>&gt;</span>
            <span className="text-[#6d3a68] uppercase text-[11px] font-black">
              {subject.name}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-500 font-bold hidden sm:inline">Selected Grade:</span>
            {/* Golden Class Selector Dropdown */}
            <div className="relative">
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="px-4 py-1.5 rounded-lg text-xs font-black bg-white border-2 border-[#e7b84b] text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#e7b84b] cursor-pointer shadow-xs"
              >
                {ALL_CLASSES.map((cls) => (
                  <option key={cls} value={cls}>
                    {cls}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Subject Logo & Title Header */}
        <div className="flex items-center justify-between flex-wrap gap-4 pt-1">
          <div className="flex items-start sm:items-center gap-4">
            <div className="flex flex-col items-center gap-1.5">
              <div className="flex items-center gap-1 bg-[#f4ebf4] p-1.5 rounded-xl border border-[#edd6ed] shadow-2xs">
                {subject.logoLetters.map((letter, lIdx) => (
                  <span
                    key={lIdx}
                    className="w-7 h-7 rounded-lg bg-white border border-[#edd6ed] flex items-center justify-center font-black text-sm text-[#0284c7] shadow-2xs"
                  >
                    {letter}
                  </span>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setActiveTab(activeTab === 'packages' ? 'study_content' : 'packages')}
                className="w-full py-1 px-2.5 bg-[#f5b82e] hover:bg-[#e2a823] text-slate-950 font-black rounded-lg text-[11px] transition-all cursor-pointer shadow-xs active:scale-95 text-center flex items-center justify-center gap-1"
              >
                <BookOpen className="w-3 h-3" />
                {activeTab === 'packages' ? 'Study Content' : 'Olympiads Packages'}
              </button>
            </div>

            <div>
              <h1 className="text-base sm:text-xl font-black text-[#4e2a4a] leading-tight">
                {subject.name}
              </h1>
              <p className="text-[11px] text-slate-500 font-semibold">
                Complete {subject.code} Question Bank, Video Solutions, Synopsis &amp; Mock Tests
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. VIEW 1: OLYMPIADS PACKAGES GRID (Exact match to user's screenshot 3)    */}
      {/* ========================================================================= */}
      {activeTab === 'packages' && (
        <div className="space-y-6">
          {/* Golden Header Divider */}
          <div className="relative flex items-center justify-center py-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t-2 border-[#e7b84b]/60"></div>
            </div>
            <div className="relative bg-[#faf5fa] px-6 py-1 rounded-full border border-[#e7b84b] text-center shadow-xs">
              <h2 className="text-sm sm:text-base font-black text-[#4e2a4a] tracking-tight">
                Olympiads Packages - {subject.code} ({selectedClass})
              </h2>
            </div>
          </div>

          {/* Cards Grid: Rendered in exact format from user's image 3 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
            {packagesList.map((pkg) => (
              <div
                key={pkg.id || pkg.title}
                className="bg-white rounded-2xl border-2 border-sky-300 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 relative"
              >
                <div>
                  {/* Top Curved Colored Header Banner (Exact screenshot format) */}
                  <div
                    className="text-white text-center py-2.5 px-3 rounded-t-xl -mt-5 -mx-5 font-black text-xs sm:text-sm shadow-xs mb-4"
                    style={{ backgroundColor: pkg.header_color || '#4895d9' }}
                  >
                    {pkg.title}
                  </div>

                  {/* Bullet Points with Cyan/Blue Checkmarks */}
                  <div className="space-y-2.5 text-xs text-slate-700 min-h-[140px]">
                    {(pkg.points || []).map((pt, pIdx) => (
                      <div key={pIdx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#00b074] shrink-0 mt-0.5" />
                        <span className="leading-snug text-[11.5px] font-medium text-slate-800">{pt}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Actions: Dynamic Price, View Details, Buy */}
                <div className="pt-3 border-t border-slate-100 space-y-2">
                  <div className="text-center text-xs font-bold text-slate-500">
                    Price : <span className="font-black text-[#6d3a68]">₹{parseFloat(pkg.price).toFixed(2)}</span>
                    <span className="text-[10px] text-slate-400 line-through ml-1.5">
                      ₹{parseFloat(pkg.original_price || pkg.originalPrice || pkg.price * 1.3).toFixed(2)}
                    </span>
                  </div>

                  {/* Two Buttons: VIEW DETAILS & BUY (Exact screenshot style) */}
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedPackageDetail(pkg)}
                      className="w-full py-2 bg-[#537b99] hover:bg-[#43647d] text-white rounded-lg text-xs font-black uppercase tracking-wider transition-colors cursor-pointer shadow-xs"
                    >
                      VIEW DETAILS
                    </button>
                    <button
                      type="button"
                      onClick={() => handleInitiateBuy(pkg)}
                      className="w-full py-2 bg-[#eb4d4b] hover:bg-[#d63031] text-white rounded-lg text-xs font-black uppercase tracking-wider transition-colors cursor-pointer shadow-xs active:scale-95"
                    >
                      BUY
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. VIEW 2: STUDY CONTENT & CHAPTERS BREAKDOWN                              */}
      {/* ========================================================================= */}
      {activeTab === 'study_content' && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-3xl border border-[#edd6ed] shadow-xs space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-[#f4ebf4]">
              <div>
                <h3 className="text-base font-black text-[#4e2a4a] flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-[#6d3a68]" />
                  <span>{subject.name} Chapter-wise Study Materials</span>
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  {selectedClass} • Downloadable Worksheets, Synopsis, and Video Explanations
                </p>
              </div>

              <button
                type="button"
                onClick={() => onNavigateTab && onNavigateTab('test_generator')}
                className="px-4 py-2 bg-[#6d3a68] hover:bg-[#5c3158] text-white rounded-xl text-xs font-black flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
              >
                <Zap className="w-4 h-4 text-[#e7b84b]" />
                <span>Launch Test Generator</span>
              </button>
            </div>

            {/* Chapters List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {subject.chapters.map((ch, idx) => (
                <div
                  key={ch.id}
                  className="p-4 bg-[#faf5fa] rounded-2xl border border-[#edd6ed] hover:border-[#6d3a68] transition-all flex items-center justify-between gap-3 shadow-2xs"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-9 h-9 rounded-xl bg-white text-[#6d3a68] font-black text-xs flex items-center justify-center border border-[#edd6ed] shadow-xs shrink-0">
                      0{idx + 1}
                    </span>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-slate-900 leading-snug truncate">
                        {ch.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {ch.questions} Practice Questions • Synopsis &amp; Notes
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => setSelectedChapterPreview(ch)}
                      className="px-3 py-1.5 bg-white hover:bg-[#6d3a68] hover:text-white text-[#6d3a68] border border-[#edd6ed] rounded-lg text-xs font-bold transition-all cursor-pointer shadow-2xs"
                    >
                      Notes &amp; Video
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. FULL PAGE: MULTI-ITEM / SUB-PACKAGE SELECTION (Full Screen View)       */}
      {/* ========================================================================= */}
      {subSelectionModalPackage && (
        <div className="fixed inset-0 z-50 bg-[#fbf9fc] flex flex-col h-screen w-screen overflow-hidden animate-in fade-in duration-150">
          {/* Top Gold / Cream Header Bar with Back Button, Title, and Add to Cart Button */}
          <div className="bg-[#f5e6ce] px-4 sm:px-8 py-3.5 border-b border-[#e9d2b2] flex items-center justify-between gap-4 shrink-0 shadow-xs">
            <div className="flex items-center gap-3 min-w-0">
              <button
                type="button"
                onClick={() => setSubSelectionModalPackage(null)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/90 hover:bg-white text-slate-800 text-xs font-black transition-all shadow-2xs cursor-pointer border border-[#e2cca8] active:scale-95"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <div className="h-5 w-px bg-[#dcc099] hidden sm:block" />
              <div className="min-w-0">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#92541a] block truncate">
                  Package Customizer &amp; Bundle Builder
                </span>
                <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight truncate">
                  {subSelectionModalPackage.title}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              <button
                type="button"
                onClick={handleAddSelectedToCart}
                className="px-5 py-2 bg-[#f5b82e] hover:bg-[#e2a823] text-slate-950 rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-sm active:scale-95 cursor-pointer flex items-center gap-1.5"
              >
                <span>ADD TO CART</span>
                <ShoppingCart className="w-3.5 h-3.5 fill-current" />
              </button>
              <button
                type="button"
                onClick={() => setSubSelectionModalPackage(null)}
                className="p-2 rounded-xl text-slate-700 hover:text-slate-950 hover:bg-black/5 cursor-pointer transition-colors"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Full Screen Scrollable Body Container */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-6 max-w-7xl mx-auto w-full">
            {/* Top Offer Ribbon & Quick Toggles */}
            <div className="bg-white rounded-2xl border border-[#ecd0ec] p-4 sm:p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-[#f4eaf4] text-[#80497D] border border-[#ebd7eb]">
                    Volume Discounts
                  </span>
                  <span className="text-xs font-black text-[#2563eb]">
                    {subSelectionModalPackage.bundle_offers_text || 'Offer: Save 20% on 5 or more packages, 15% on Any 4, 10% on Any 3 and 5% on Any 2'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium">
                  Select the package series you want to practice. The more items you select, the higher the discount automatically applied.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    const allIds = currentModalSubItems.map((item) => item.id || item.title);
                    setSelectedSubItemIds(allIds);
                  }}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs"
                >
                  Select All ({currentModalSubItems.length})
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedSubItemIds([])}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs"
                >
                  Clear All
                </button>
              </div>
            </div>

            {/* 2-Column Responsive Grid of Selectable Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pb-6">
              {currentModalSubItems.map((item, idx) => {
                const itemId = item.id || item.title;
                const isChecked = selectedSubItemIds.includes(itemId);
                const isExpanded = expandedSubItemId === itemId;

                return (
                  <div
                    key={itemId || idx}
                    className={`bg-white rounded-2xl border transition-all flex flex-col justify-between overflow-hidden shadow-xs hover:shadow-md ${
                      isChecked
                        ? 'border-[#2563eb] ring-2 ring-blue-100 bg-white'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {/* Top Checkbox & Title */}
                    <div className="p-4 sm:p-5 space-y-3">
                      <label className="flex items-start gap-3 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleSubItemSelection(itemId)}
                          className="w-5 h-5 rounded border-slate-300 text-[#2563eb] focus:ring-[#2563eb] mt-0.5 cursor-pointer shrink-0"
                        />
                        <span className="font-black text-sm sm:text-base text-slate-900 leading-snug">
                          {item.title}
                        </span>
                      </label>

                      {/* Bullet Points with alternating soft backgrounds / icons */}
                      <div className="space-y-1.5 text-xs text-slate-600 pl-8">
                        {(item.points || [
                          '10 Online Mock Tests',
                          'Aligned with Exam Pattern',
                          'Same Test Duration as Exam',
                          'Matching Syllabus & Difficulty Level',
                          'Interactive and Downloadable'
                        ]).slice(0, isExpanded ? 12 : 6).map((pt, pIdx) => (
                          <div
                            key={pIdx}
                            className={`flex items-start gap-2 py-1 px-2 rounded-lg ${
                              pIdx % 2 === 0 ? 'bg-slate-50/80' : 'bg-transparent'
                            }`}
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-[#00b074] shrink-0 mt-1.5" />
                            <span className="leading-relaxed">{pt}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Special Offer Banner inside Card */}
                    <div className="mt-auto">
                      <div className="bg-[#fef3c7] px-4 py-2 border-t border-[#fde68a] flex items-center justify-between text-xs font-black">
                        <div className="flex items-center gap-1.5 text-[#b45309]">
                          <Flame className="w-4 h-4 text-amber-500 fill-amber-400" />
                          <span>Special Offer</span>
                        </div>
                        <div className="text-right">
                          <span className="text-xs text-red-500 line-through mr-2 font-bold">
                            {parseFloat(item.original_price || item.price * 1.3).toFixed(2)}
                          </span>
                          <span className="text-emerald-700 font-black text-sm">
                            {parseFloat(item.price).toFixed(2)}
                          </span>
                        </div>
                      </div>

                      {/* Yellow View Details Button (Collapsible) */}
                      <button
                        type="button"
                        onClick={() => setExpandedSubItemId(isExpanded ? null : itemId)}
                        className="w-full py-2 bg-gradient-to-r from-[#f5c344] via-[#f5b82e] to-[#e6a820] hover:brightness-105 text-slate-950 font-black text-xs text-center transition-all cursor-pointer shadow-2xs block"
                      >
                        {isExpanded ? 'Hide Details' : 'View Details'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sticky Full-Width Bottom Bar */}
          <div className="bg-[#fcf8fb] border-t border-[#ecd0ec] px-4 sm:px-8 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0 shadow-lg z-10">
            {/* Left Offer Text & Live calculation */}
            <div className="text-center sm:text-left space-y-0.5">
              <div className="text-xs sm:text-sm font-black text-[#2563eb]">
                {subSelectionModalPackage.bundle_offers_text || 'Offer: Save 20% on 5 or more packages, 15% on Any 4, 10% on Any 3 and 5% on Any 2'}
              </div>
              <div className="text-xs text-slate-600 font-bold">
                Selected: <span className="text-slate-900 font-black">{selectedCount} items</span> | Subtotal: <span className="font-black text-slate-900">₹{totalBasePrice}</span>
                {activeDiscountPct > 0 && (
                  <span className="text-emerald-700 ml-1.5 font-extrabold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    Saved {activeDiscountPct}%: -₹{discountAmount} → Total: ₹{finalPayable}
                  </span>
                )}
              </div>
            </div>

            {/* Right Action Buttons */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleAddSelectedToCart}
                className="px-6 py-2.5 bg-[#f5b82e] hover:bg-[#e2a823] text-slate-950 rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-md active:scale-95 cursor-pointer flex items-center gap-2"
              >
                <span>ADD TO CART</span>
                <ShoppingCart className="w-4 h-4 fill-current" />
              </button>
              <button
                type="button"
                onClick={() => setSubSelectionModalPackage(null)}
                className="px-5 py-2.5 bg-[#ef4444] hover:bg-[#dc2626] text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-md active:scale-95 cursor-pointer flex items-center gap-1.5"
              >
                <span>Cancel</span>
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: PACKAGE DETAILS BREAKDOWN (When VIEW DETAILS clicked on main grid) */}
      {selectedPackageDetail && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-lg w-full border border-[#edd6ed] shadow-2xl space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold text-[10px] uppercase">
                  {subject.code} • {selectedClass}
                </span>
                <h3 className="text-sm sm:text-base font-black text-slate-900">{selectedPackageDetail.title}</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPackageDetail(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-black text-[#4e2a4a] uppercase tracking-wider">What is included in this package:</h4>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {(selectedPackageDetail.points || []).map((pt, pIdx) => (
                  <div key={pIdx} className="flex items-start gap-2 text-xs text-slate-700">
                    <Check className="w-4 h-4 text-[#00b074] shrink-0 mt-0.5" />
                    <span>{pt}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <div className="text-xs font-bold text-slate-500">
                Total Price: <span className="text-base font-black text-[#6d3a68]">₹{parseFloat(selectedPackageDetail.price).toFixed(2)}</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  const pkgToBuy = selectedPackageDetail;
                  setSelectedPackageDetail(null);
                  handleInitiateBuy(pkgToBuy);
                }}
                className="px-6 py-2.5 bg-[#eb4d4b] hover:bg-[#d63031] text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-md active:scale-95 cursor-pointer"
              >
                Buy Package Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
