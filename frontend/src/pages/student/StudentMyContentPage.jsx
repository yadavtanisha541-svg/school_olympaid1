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
  FileText
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
      code: 'IGKO',
      title: 'IGKO (General Knowledge)',
      subtitle: 'General Knowledge & Current Affairs',
      description: 'Build your general knowledge, stay updated with current affairs and improve your reasoning skills.',
      icon: Globe,
      color: '#859900',
      iconBg: 'bg-amber-50 border-amber-200 text-amber-600',
      seriesTitle: `${studentClass}-All India IGKO Mock Test Series`
    },
    {
      code: 'ISO',
      altCode: 'NSO',
      title: 'ISO / NSO (Science)',
      subtitle: 'Science & Practical Discovery',
      description: 'Master scientific principles, experimental observation, physics, chemistry, biology concepts and logic.',
      icon: Atom,
      color: '#059669',
      iconBg: 'bg-emerald-50 border-emerald-200 text-emerald-600',
      seriesTitle: `${studentClass}-All India ISO Mock Test Series`
    },
    {
      code: 'IMO',
      title: 'IMO (Mathematics)',
      subtitle: 'Mathematics & Logical Analysis',
      description: 'Sharpen mathematical problem-solving, arithmetic speed, geometry, number systems and analytical reasoning.',
      icon: Calculator,
      color: '#d97706',
      iconBg: 'bg-blue-50 border-blue-200 text-blue-600',
      seriesTitle: `${studentClass}-All India IMO Mock Test Series`
    },
    {
      code: 'IEO',
      title: 'IEO (English)',
      subtitle: 'English Grammar & Vocabulary',
      description: 'Enhance English grammar proficiency, comprehension reading, vocabulary power and verbal communication.',
      icon: BookOpen,
      color: '#ea580c',
      iconBg: 'bg-purple-50 border-purple-200 text-purple-600',
      seriesTitle: `${studentClass}-All India IEO Mock Test Series`
    },
    {
      code: 'ICSO',
      altCode: 'ICO',
      title: 'ICSO (Cyber & AI)',
      subtitle: 'Cyber Safety, Coding & IT',
      description: 'Learn cyber safety, algorithms, coding fundamentals, artificial intelligence basics and digital logic.',
      icon: Laptop,
      color: '#0284c7',
      iconBg: 'bg-sky-50 border-sky-200 text-sky-600',
      seriesTitle: `${studentClass}-All India ICSO Mock Test Series`
    },
    {
      code: 'ISSO',
      altCode: 'LRO',
      title: 'ISSO / LRO (Reasoning)',
      subtitle: 'Logical Reasoning & Social Aptitude',
      description: 'Boost pattern identification, analogies, analytical reasoning, series completion and social aptitude.',
      icon: Brain,
      color: '#7c3aed',
      iconBg: 'bg-rose-50 border-rose-200 text-rose-600',
      seriesTitle: `${studentClass}-All India ISSO Mock Test Series`
    },
    {
      code: 'VC',
      title: 'VC (Vocabulary)',
      subtitle: 'Vocabulary Champions Olympiad',
      description: 'Master word roots, synonyms, antonyms, idioms, phrases and advance vocabulary championship skills.',
      icon: Sparkles,
      color: '#6d3a68',
      iconBg: 'bg-pink-50 border-pink-200 text-pink-600',
      seriesTitle: `${studentClass}-All India VC Mock Test Series`
    },
    {
      code: 'EGO',
      title: 'EGO (Environment)',
      subtitle: 'Environment & Green Olympiad',
      description: 'Understand ecosystems, biodiversity, natural resource management, climate conservation and green sciences.',
      icon: Atom,
      color: '#059669',
      iconBg: 'bg-teal-50 border-teal-200 text-teal-600',
      seriesTitle: `${studentClass}-All India EGO Mock Test Series`
    },
    {
      code: 'CAO',
      title: 'CAO (Creative Arts)',
      subtitle: 'Creative Arts & Aesthetic Design',
      description: 'Explore creative design thinking, visual perspectives, color theory, aesthetic sense and artistic expression.',
      icon: Palette,
      color: '#80497D',
      iconBg: 'bg-violet-50 border-violet-200 text-violet-600',
      seriesTitle: `${studentClass}-All India CAO Mock Test Series`
    }
  ], [studentClass]);

  const getSubjectPapers = (subCode, altCode) => {
    const matching = examPapers.filter((p) => {
      const pSub = (p.subject_code || p.subject || '').toUpperCase();
      const codeMatches = pSub === subCode || (altCode && pSub === altCode);
      const classMatches = !p.class_name || p.class_name === studentClass || p.class_name === 'All';
      
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
        title: `${subCode} Level-1 Mock Test 1 ${studentClass}`,
        short_code: `${subCode} - Mock 1`,
        subject_code: subCode,
        class_name: studentClass,
        duration_minutes: 60,
        total_marks: 60,
        cutoff_marks: 42,
        status: 'published'
      },
      {
        id: `mock_${subCode.toLowerCase()}_2`,
        title: `${subCode} Level-1 Mock Test 2 ${studentClass}`,
        short_code: `${subCode} - Mock 2`,
        subject_code: subCode,
        class_name: studentClass,
        duration_minutes: 60,
        total_marks: 60,
        cutoff_marks: 45,
        status: 'published'
      },
      {
        id: `mock_${subCode.toLowerCase()}_3`,
        title: `${subCode} Level-1 Mock Test 3 ${studentClass}`,
        short_code: `${subCode} - Mock 3`,
        subject_code: subCode,
        class_name: studentClass,
        duration_minutes: 60,
        total_marks: 60,
        cutoff_marks: 45,
        status: 'published'
      },
      {
        id: `mock_${subCode.toLowerCase()}_4`,
        title: `${subCode} Level-1 Mock Test 4 ${studentClass}`,
        short_code: `${subCode} - Mock 4`,
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
        title: `${subCode} Level-1 Mock Test 5 ${studentClass}`,
        short_code: `${subCode} - Mock 5`,
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

  // Pre-exam instruction screen (Seamless view without boxed cards)
  if (selectedPaperForInstructions) {
    const paper = selectedPaperForInstructions;
    return (
      <div className="space-y-6 pb-16 font-sans max-w-4xl mx-auto animate-in fade-in duration-200">
        {/* Top Navigation */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setSelectedPaperForInstructions(null)}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-[#859900] px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>← Back to Mock Tests</span>
          </button>
          <span className="text-xs font-semibold text-slate-400">Pre-Examination Verification</span>
        </div>

        {/* 1. Header & Title Area (Seamless Background) */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[10px] font-bold text-[#859900] bg-[#859900]/10 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  {paper.subject_code || 'OLYMPIAD'}
                </span>
                <span className="font-mono text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
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
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Live Mock Test Ready
              </span>
            </div>
          </div>

          {/* 4 Metric Stats (Seamless Row) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="p-3.5 rounded-2xl bg-slate-50/70 border border-slate-100 text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Duration</span>
              <h4 className="text-base sm:text-lg font-black text-slate-900 mt-0.5">{paper.duration_minutes || 60} Minutes</h4>
              <p className="text-[10px] text-slate-400">Automated timer</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50/70 border border-slate-100 text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Questions</span>
              <h4 className="text-base sm:text-lg font-black text-[#859900] mt-0.5">{paper.questions?.length || 5} MCQs</h4>
              <p className="text-[10px] text-slate-400">Single correct</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50/70 border border-slate-100 text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Marks</span>
              <h4 className="text-base sm:text-lg font-black text-slate-900 mt-0.5">{paper.total_marks || 60}</h4>
              <p className="text-[10px] text-slate-400">Max Score</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50/70 border border-slate-100 text-center">
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
              <span className="font-bold text-[#859900]">1.</span>
              <span>The timer will begin immediately when you click <strong>Start Mock Test Now</strong>.</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="font-bold text-[#859900]">2.</span>
              <span>Each correct answer awards 1 mark. There is no negative marking for unattempted questions.</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="font-bold text-[#859900]">3.</span>
              <span>You can mark questions for review and navigate freely between questions.</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="font-bold text-[#859900]">4.</span>
              <span>Upon submission, your score, accuracy %, percentile rank, and detailed answers will be generated instantly.</span>
            </p>
          </div>

          <div className="pt-2 flex items-center gap-2.5">
            <input
              type="checkbox"
              id="agreeCheckContent"
              checked={hasAgreedToRules}
              onChange={(e) => setHasAgreedToRules(e.target.checked)}
              className="w-4 h-4 text-[#859900] rounded focus:ring-[#859900] cursor-pointer"
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
            className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer transition-all"
          >
            Cancel
          </button>
          
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setPdfModalPaper(paper)}
              className="px-5 py-3 rounded-2xl bg-blue-50 border border-blue-200 hover:bg-blue-100 text-blue-700 font-bold text-xs sm:text-sm shadow-xs cursor-pointer flex items-center gap-2 active:scale-95 transition-all"
            >
              <Download className="w-4 h-4 text-blue-600" />
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
              className="px-7 py-3 rounded-2xl bg-[#859900] hover:bg-[#738400] text-white font-black text-xs sm:text-sm shadow-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 active:scale-95 transition-all"
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
                  className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-[#859900] px-4 py-2 rounded-xl bg-white border border-slate-200 shadow-2xs hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
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
                    className="text-xs font-bold bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-slate-700 focus:outline-none focus:border-[#859900] cursor-pointer"
                  >
                    {ALL_SUBJECT_COVERS.map(s => (
                      <option key={s.code} value={s.code}>{s.code} - {s.title}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Mock Tests Cards Grid (Exact modern design from Image 1) */}
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
                      className="bg-gradient-to-br from-blue-50/90 via-indigo-50/70 to-pink-50/90 rounded-3xl border-2 border-indigo-200/90 hover:border-pink-400 p-6 shadow-md hover:shadow-xl transition-all duration-200 flex flex-col justify-between space-y-5 group relative overflow-hidden text-slate-900"
                    >
                      {/* Top: Icon + Title + Class */}
                      <div className="space-y-3">
                        <div className="w-12 h-12 rounded-2xl bg-white border border-indigo-200 text-indigo-700 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform shrink-0">
                          <FileText className="w-6 h-6 stroke-[2.2]" />
                        </div>

                        <div>
                          <h4 className="font-black text-slate-900 text-base sm:text-lg tracking-tight leading-snug group-hover:text-indigo-700 transition-colors">
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
                        <div className="bg-white border border-indigo-100 p-2.5 px-3.5 rounded-2xl flex items-center justify-between shadow-2xs">
                          <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-pink-500 shrink-0" />
                            <span className="text-xs font-bold text-slate-700">Status:</span>
                          </div>
                          {isCompleted ? (
                            <span className="px-3 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 text-[11px] font-black uppercase tracking-wider">
                              COMPLETED
                            </span>
                          ) : (
                            <span className="px-3 py-0.5 rounded-full bg-rose-100 text-rose-700 border border-rose-200 text-[11px] font-black uppercase tracking-wider">
                              UNATTEMPTED
                            </span>
                          )}
                        </div>

                        {/* Row 2: Last Score Box */}
                        <div className="bg-white border border-indigo-100 p-2.5 px-3.5 rounded-2xl flex items-center justify-between shadow-2xs">
                          <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                            <span className="text-xs font-bold text-slate-700">Last Score:</span>
                          </div>
                          {isCompleted ? (
                            <span className="px-3 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 text-[11px] font-black">
                              {result.score} / {result.total_marks || paper.total_marks || 60} ({Math.round(result.percentage || 0)}%)
                            </span>
                          ) : (
                            <span className="px-3 py-0.5 rounded-full bg-blue-100 text-blue-700 border border-blue-200 text-[11px] font-black">
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
                          className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-[#2563eb] via-[#7c3aed] to-[#db2777] hover:from-[#1d4ed8] hover:via-[#6d28d9] hover:to-[#be123c] text-white font-black text-xs sm:text-sm shadow-md transition-all cursor-pointer active:scale-95"
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
                <BookOpen className="w-6 h-6 text-[#859900]" />
                <span>
                  {selectedSubject !== 'ALL'
                    ? `${selectedSubject} Subject Cover & Mock Test Series`
                    : 'Olympiad Subject Series & Mock Tests'}
                </span>
              </h2>
              <p className="text-xs text-slate-500 font-semibold mt-0.5">
                {selectedSubject !== 'ALL'
                  ? `Click "Open ${selectedSubject} Mock Tests" below to view all official mock test papers.`
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
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-[#859900] px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 shadow-2xs hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <Layers className="w-4 h-4 text-[#859900]" />
                <span>View All 9 Subject Covers</span>
              </button>
            )}
          </div>

          {/* Grid of Subject Covers (Square Box Shape) */}
          <div className={`grid gap-6 w-full ${
            visibleCovers.length === 1
              ? 'grid-cols-1 max-w-[420px]'
              : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
          }`}>
            {visibleCovers.map((sub) => {
              const subPapers = getSubjectPapers(sub.code, sub.altCode);
              const SubIcon = sub.icon;

              return (
                <div
                  key={sub.code}
                  className="bg-gradient-to-br from-blue-50/90 via-indigo-50/70 to-pink-50/90 rounded-3xl border-2 border-indigo-200/90 hover:border-pink-400 p-6 sm:p-7 shadow-md hover:shadow-xl transition-all duration-200 flex flex-col justify-between group relative overflow-hidden aspect-square min-h-[380px] sm:min-h-[400px] w-full text-slate-900"
                >
                  <div className="space-y-3.5">
                    {/* Top Header Row */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-12 h-12 rounded-2xl border ${sub.iconBg} flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform shrink-0`}>
                          <SubIcon className="w-6 h-6" />
                        </div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 text-[11px] font-extrabold uppercase tracking-wide">
                            {studentClass}
                          </span>
                          <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 border border-indigo-200 text-[11px] font-bold">
                            {sub.code}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-indigo-700 border border-indigo-200 text-xs font-bold shrink-0 shadow-2xs">
                        <FileText className="w-3.5 h-3.5" />
                        <span>{subPapers.length} Mock Tests</span>
                      </div>
                    </div>

                    {/* Title, Subtitle & Description */}
                    <div className="space-y-1">
                      <h3 className="font-black text-slate-900 text-lg sm:text-xl tracking-tight leading-snug group-hover:text-indigo-700 transition-colors">
                        {sub.title}
                      </h3>
                      <p className="text-xs text-indigo-700 font-bold">
                        {sub.subtitle}
                      </p>
                      <p className="text-xs text-slate-600 font-normal leading-relaxed pt-1.5 line-clamp-3">
                        {sub.description || 'Practice authentic Olympiad questions, improve speed and accuracy, and boost your rank.'}
                      </p>
                    </div>
                  </div>

                  {/* Bottom Action Bar & Highlights (Square Box Layout) */}
                  <div className="pt-4 border-t border-indigo-100 space-y-3">
                    <button
                      type="button"
                      onClick={() => {
                        setOpenedMockSeries(sub.code);
                        setSelectedSubject(sub.code);
                      }}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-[#2563eb] via-[#7c3aed] to-[#db2777] hover:from-[#1d4ed8] hover:via-[#6d28d9] hover:to-[#be123c] text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-indigo-950/20 active:scale-98 transition-all cursor-pointer"
                    >
                      <span>Start Mock Test</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    <div className="flex items-center justify-between gap-1.5 flex-wrap">
                      <div className="flex items-center gap-1 text-[10px] sm:text-[11px] font-semibold text-slate-700 bg-white border border-indigo-100 px-2 py-0.5 rounded-full shadow-2xs">
                        <div className="w-3.5 h-3.5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                          <Check className="w-2 h-2 stroke-[3]" />
                        </div>
                        <span>Updated Syllabus</span>
                      </div>

                      <div className="flex items-center gap-1 text-[10px] sm:text-[11px] font-semibold text-slate-700 bg-white border border-indigo-100 px-2 py-0.5 rounded-full shadow-2xs">
                        <div className="w-3.5 h-3.5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                          <BarChart2 className="w-2 h-2" />
                        </div>
                        <span>Real Exam Pattern</span>
                      </div>

                      <div className="flex items-center gap-1 text-[10px] sm:text-[11px] font-semibold text-slate-700 bg-white border border-indigo-100 px-2 py-0.5 rounded-full shadow-2xs">
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
