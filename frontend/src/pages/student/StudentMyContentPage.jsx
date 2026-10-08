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
  Rocket
} from 'lucide-react';
import { DownloadPaperPdfModal } from '../../components/common/DownloadPaperPdfModal';

export const StudentMyContentPage = ({
  activeSubjectCode = null, // e.g. 'content_igko', 'content_imo', 'my_content'
  onNavigateTab,
  onStartExam
}) => {
  const { user } = useAuth();
  const studentClass = user?.class || user?.grade || 'Class 6';

  const [examPapers, setExamPapers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Active selected subject filter: 'ALL' or 'IGKO', 'IMO', 'ISO', etc.
  const [selectedSubject, setSelectedSubject] = useState(() => {
    if (activeSubjectCode && activeSubjectCode.startsWith('content_')) {
      return activeSubjectCode.replace('content_', '').toUpperCase();
    }
    return 'ALL';
  });

  // Level 2: Which subject's mock tests are open (null = showing covers, 'IGKO' = showing mock tests)
  const [openedMockSeries, setOpenedMockSeries] = useState(null);

  const [selectedPaperForInstructions, setSelectedPaperForInstructions] = useState(null);
  const [pdfModalPaper, setPdfModalPaper] = useState(null);
  const [hasAgreedToRules, setHasAgreedToRules] = useState(true);
  const [myTestResults, setMyTestResults] = useState([]);

  // Fetch real exam papers and results
  const fetchMyContentData = async () => {
    try {
      setLoading(true);
      const [papersRes, resultsRes] = await Promise.all([
        apiClient.get('/exam-papers').catch(() => ({ success: false })),
        apiClient.get('/results', { scope: 'all' }).catch(() => ({ success: false }))
      ]);

      let allPapers = [];
      if (papersRes && papersRes.success && Array.isArray(papersRes.data)) {
        allPapers = [...papersRes.data];
      }

      // Also include any mock tests authored in admin generator or local storage
      const localAdminPapers = JSON.parse(localStorage.getItem('admin_generator_papers') || '[]');
      if (Array.isArray(localAdminPapers)) {
        localAdminPapers.forEach((lp) => {
          if (!allPapers.some(p => p.id === lp.id || (p.title === lp.title && p.class_name === (lp.class_name || lp.class)))) {
            allPapers.push({
              id: lp.id,
              title: lp.title,
              short_code: lp.shortCode || lp.short_code || `${lp.subject_code || 'OLY'} - Mock`,
              subject_code: (lp.subject_code || lp.subject || '').toUpperCase(),
              class_name: lp.class_name || lp.class,
              category: lp.paper_category || 'mock_test',
              duration_minutes: lp.duration_minutes || 60,
              total_marks: lp.total_marks || 60,
              cutoff_marks: 42,
              status: 'published'
            });
          }
        });
      }

      setExamPapers(allPapers);
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
  }, [user]);

  // When activeSubjectCode changes from the sidebar (e.g. student clicks IGKO or ISO)
  // We ALWAYS show the Subject Cover first (openedMockSeries = null) as requested!
  useEffect(() => {
    if (activeSubjectCode && activeSubjectCode.startsWith('content_')) {
      const code = activeSubjectCode.replace('content_', '').toUpperCase();
      setSelectedSubject(code);
      setOpenedMockSeries(null); // Show the Cover first!
    } else if (activeSubjectCode === 'my_content') {
      setSelectedSubject('ALL');
      setOpenedMockSeries(null);
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

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-500">
                    Switch Subject:
                  </span>
                  <select
                    value={openedMockSeries}
                    onChange={(e) => {
                      const val = e.target.value;
                      setOpenedMockSeries(val);
                      setSelectedSubject(val);
                      if (onNavigateTab) onNavigateTab(`content_${val.toLowerCase()}`);
                    }}
                    className="text-xs font-bold bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-slate-700 focus:outline-none focus:border-indigo-500 cursor-pointer"
                  >
                    {ALL_SUBJECT_COVERS.map(s => (
                      <option key={s.code} value={s.code}>{s.code} - {s.title}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Mock Tests Cards Grid (Colorful 2-3 Mix Pastel Theme) */}
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
            </div>
          );
        })()
      ) : (
        /* ========================================================================= */
        /* LEVEL 1: SUBJECT COVER(S) VIEW (Shown First when clicking subject)        */
        /* ========================================================================= */
        <div className="space-y-5 animate-in fade-in duration-150">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
                <BookOpen className="w-6 h-6 text-indigo-600" />
                <span>
                  {selectedSubject !== 'ALL'
                    ? `${selectedSubject} Subject Cover & Mock Test Series`
                    : 'Olympiad Subject Series & Mock Tests'}
                </span>
              </h2>
              <p className="text-xs text-slate-500 font-semibold mt-0.5">
                {selectedSubject !== 'ALL'
                  ? `Click "Start Mock Test" below to view all official mock test papers for ${selectedSubject}.`
                  : 'Select any Olympiad subject cover below to view all official mock tests, previous year papers & sample tests.'}
              </p>
            </div>

            {selectedSubject !== 'ALL' && (
              <button
                type="button"
                onClick={() => {
                  setSelectedSubject('ALL');
                  if (onNavigateTab) onNavigateTab('my_content');
                }}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-indigo-600 px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 shadow-2xs hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <Layers className="w-4 h-4 text-indigo-600" />
                <span>View All Subject Covers</span>
              </button>
            )}
          </div>

          {/* Grid of Subject Covers (Vibrant 2-3 Mix Pastel Gradient Cards) */}
          <div className={`grid gap-6 w-full ${
            visibleCovers.length === 1
              ? 'grid-cols-1 max-w-[440px]'
              : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
          }`}>
            {visibleCovers.map((sub) => {
              const subPapers = getSubjectPapers(sub.code, sub.altCode);
              const SubIcon = sub.icon;

              return (
                <div
                  key={sub.code}
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

                      <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full ${sub.countBg} text-xs font-bold shrink-0`}>
                        <FileText className="w-3.5 h-3.5" />
                        <span>{subPapers.length} Mock Tests</span>
                      </div>
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
