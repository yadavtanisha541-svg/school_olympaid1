import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { apiClient } from '../../api/client';
import {
  BookOpen,
  ArrowLeft,
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
  Layers
} from 'lucide-react';

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

      if (papersRes && papersRes.success && Array.isArray(papersRes.data)) {
        setExamPapers(papersRes.data);
      }
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
      icon: Atom,
      color: '#059669',
      iconBg: 'bg-emerald-50 border-emerald-200 text-emerald-600',
      seriesTitle: `${studentClass}-All India ISO Mock Test Series`
    },
    {
      code: 'IMO',
      title: 'IMO (Mathematics)',
      subtitle: 'Mathematics & Logical Analysis',
      icon: Calculator,
      color: '#d97706',
      iconBg: 'bg-blue-50 border-blue-200 text-blue-600',
      seriesTitle: `${studentClass}-All India IMO Mock Test Series`
    },
    {
      code: 'IEO',
      title: 'IEO (English)',
      subtitle: 'English Grammar & Vocabulary',
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
      icon: Brain,
      color: '#7c3aed',
      iconBg: 'bg-rose-50 border-rose-200 text-rose-600',
      seriesTitle: `${studentClass}-All India ISSO Mock Test Series`
    },
    {
      code: 'VC',
      title: 'VC (Vocabulary)',
      subtitle: 'Vocabulary Champions Olympiad',
      icon: Sparkles,
      color: '#6d3a68',
      iconBg: 'bg-pink-50 border-pink-200 text-pink-600',
      seriesTitle: `${studentClass}-All India VC Mock Test Series`
    },
    {
      code: 'EGO',
      title: 'EGO (Environment)',
      subtitle: 'Environment & Green Olympiad',
      icon: Atom,
      color: '#059669',
      iconBg: 'bg-teal-50 border-teal-200 text-teal-600',
      seriesTitle: `${studentClass}-All India EGO Mock Test Series`
    },
    {
      code: 'CAO',
      title: 'CAO (Creative Arts)',
      subtitle: 'Creative Arts & Aesthetic Design',
      icon: Palette,
      color: '#80497D',
      iconBg: 'bg-violet-50 border-violet-200 text-violet-600',
      seriesTitle: `${studentClass}-All India CAO Mock Test Series`
    }
  ], [studentClass]);

  const getSubjectPapers = (subCode, altCode) => {
    const matching = examPapers.filter((p) => {
      const pSub = (p.subject_code || '').toUpperCase();
      const codeMatches = pSub === subCode || (altCode && pSub === altCode);
      const classMatches = !p.class_name || p.class_name === studentClass || p.class_name === 'All';
      return codeMatches && classMatches;
    });

    if (matching.length > 0) return matching;

    const basePapers = [
      {
        id: `mock_${subCode.toLowerCase()}_prev`,
        title: `${studentClass} ${subCode} Previous Year Paper 2019`,
        short_code: `${subCode} - 2019`,
        subject_code: subCode,
        class_name: studentClass,
        duration_minutes: 60,
        total_marks: 60,
        cutoff_marks: 42,
        status: 'published'
      },
      {
        id: `mock_${subCode.toLowerCase()}_sample`,
        title: `${studentClass} ${subCode} Official Sample Paper 2026`,
        short_code: `${subCode} - Sample 2026`,
        subject_code: subCode,
        class_name: studentClass,
        duration_minutes: 60,
        total_marks: 60,
        cutoff_marks: 42,
        status: 'published'
      },
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
      }
    ];

    if (subCode === 'IMO') {
      basePapers.push({
        id: `mock_${subCode.toLowerCase()}_3`,
        title: `${subCode} Level-1 Mock Test 3 ${studentClass}`,
        short_code: `${subCode} - Mock 3`,
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

  // Pre-exam instruction screen
  if (selectedPaperForInstructions) {
    const paper = selectedPaperForInstructions;
    return (
      <div className="space-y-6 pb-16 font-sans max-w-4xl mx-auto animate-in fade-in duration-200">
        {/* Top Navigation */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setSelectedPaperForInstructions(null)}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-[#859900] px-3.5 py-2 rounded-xl bg-white border border-slate-200 shadow-2xs hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>← Back to Mock Tests List</span>
          </button>
          <span className="text-xs font-bold text-slate-400">Pre-Examination Verification</span>
        </div>

        {/* 1. Exam Hero Overview Card */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 pb-6 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2.5 mb-2">
                <span className="text-[10px] font-bold text-[#859900] bg-[#859900]/10 px-2.5 py-0.5 rounded-full border border-[#859900]/30 uppercase tracking-wider">
                  {paper.subject_code || 'OLYMPIAD'}
                </span>
                <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-md">
                  {paper.short_code || paper.subject_code}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {paper.title}
              </h1>
              <p className="text-xs text-slate-500 mt-2">
                All India National Ranking Mock Test with Instant Analysis &amp; Answer Keys.
              </p>
            </div>

            <div className="shrink-0 text-left sm:text-right">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Live Mock Test Ready
              </span>
            </div>
          </div>

          {/* 4 Metric Highlights Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 pt-6 text-center text-xs">
            <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">Duration</span>
              <h4 className="text-lg font-black text-slate-900 mt-1">{paper.duration_minutes || 60} Minutes</h4>
              <p className="text-[10px] text-slate-400 mt-0.5">Automated timer</p>
            </div>

            <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">Questions</span>
              <h4 className="text-lg font-black text-[#859900] mt-1">{paper.questions?.length || 5} MCQs</h4>
              <p className="text-[10px] text-slate-400 mt-0.5">Single correct</p>
            </div>

            <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">Total Marks</span>
              <h4 className="text-lg font-black text-slate-900 mt-1">{paper.total_marks || 60}</h4>
              <p className="text-[10px] text-slate-400 mt-0.5">Max Score</p>
            </div>

            <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">Target Cutoff</span>
              <h4 className="text-lg font-black text-emerald-600 mt-1">{paper.cutoff_marks || 42} Marks</h4>
              <p className="text-[10px] text-slate-400 mt-0.5">Benchmark cutoff</p>
            </div>
          </div>
        </div>

        {/* 2. Guidelines Card */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-black">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Important Examination Rules</h3>
              <p className="text-[11px] text-slate-400">Please review carefully before starting your timer</p>
            </div>
          </div>

          <div className="space-y-2.5 text-xs text-slate-600 bg-slate-50/80 p-4 rounded-2xl border border-slate-100">
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

          <div className="pt-2 flex items-center gap-3">
            <input
              type="checkbox"
              id="agreeCheckContent"
              checked={hasAgreedToRules}
              onChange={(e) => setHasAgreedToRules(e.target.checked)}
              className="w-4 h-4 text-[#859900] rounded focus:ring-[#859900] cursor-pointer"
            />
            <label htmlFor="agreeCheckContent" className="text-xs font-bold text-slate-700 cursor-pointer select-none">
              I have read and understood all the mock test instructions.
            </label>
          </div>
        </div>

        {/* 3. Bottom Launch Action */}
        <div className="flex items-center justify-between p-4 bg-white rounded-3xl border border-slate-200 shadow-xs">
          <button
            type="button"
            onClick={() => setSelectedPaperForInstructions(null)}
            className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer transition-all"
          >
            Cancel
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
    );
  }

  // Filter covers according to selected subject (if not 'ALL', show only that subject's cover card)
  const visibleCovers = useMemo(() => {
    if (selectedSubject && selectedSubject !== 'ALL') {
      const match = ALL_SUBJECT_COVERS.filter(s => s.code === selectedSubject || s.altCode === selectedSubject);
      if (match.length > 0) return match;
    }
    return ALL_SUBJECT_COVERS;
  }, [selectedSubject, ALL_SUBJECT_COVERS]);

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

              {/* Mock Tests Cards Grid (Exact design from user's image) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                {subjectPapers.map((paper) => {
                  const result = myTestResults.find(
                    r => (r.exam_id && (r.exam_id === paper.id || String(r.exam_id) === String(paper.id))) ||
                         (r.exam_title && r.exam_title.toLowerCase() === paper.title.toLowerCase())
                  );
                  const isCompleted = !!result;

                  return (
                    <div
                      key={paper.id}
                      className="bg-white rounded-2xl border-2 border-slate-200 shadow-sm hover:shadow-md hover:border-[#859900] transition-all overflow-hidden flex flex-col justify-between"
                    >
                      {/* Top Olive Green Header */}
                      <div className="bg-[#859900] text-white p-3.5 sm:p-4 text-center min-h-[72px] flex items-center justify-center">
                        <h4 className="font-bold text-xs sm:text-sm leading-snug">
                          {paper.title}
                        </h4>
                      </div>

                      {/* Card Body */}
                      <div className="p-4 space-y-3">
                        {/* Row 1: Status */}
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-slate-700">Status:</span>
                          {isCompleted ? (
                            <span className="px-2.5 py-0.5 rounded bg-emerald-600 text-white text-[11px] font-black uppercase tracking-wider">
                              COMPLETED
                            </span>
                          ) : (
                            <span className="px-2.5 py-0.5 rounded bg-[#d9534f] text-white text-[11px] font-black uppercase tracking-wider">
                              UNATTEMPTED
                            </span>
                          )}
                        </div>

                        {/* Row 2: Last Score */}
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-slate-700">Last Score:</span>
                          {isCompleted ? (
                            <span className="px-2.5 py-0.5 rounded bg-[#8cb82b] text-white text-[11px] font-black">
                              {result.score} / {result.total_marks || paper.total_marks || 60} ({Math.round(result.percentage || 0)}%)
                            </span>
                          ) : (
                            <span className="px-2.5 py-0.5 rounded bg-[#8cb82b] text-white text-[11px] font-black">
                              none
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Card Footer: OPEN Button */}
                      <div className="p-4 pt-0">
                        <button
                          type="button"
                          onClick={() => setSelectedPaperForInstructions(paper)}
                          className="w-full py-2.5 bg-[#859900] hover:bg-[#738400] text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-xs hover:shadow flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
                        >
                          <span>OPEN</span>
                          <ChevronRight className="w-4 h-4" />
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

          {/* Grid of Subject Covers (Shows 1 specific cover or all 9 covers) */}
          <div className={`grid gap-4 sm:gap-5 w-full ${
            visibleCovers.length === 1
              ? 'grid-cols-1 max-w-xl'
              : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
          }`}>
            {visibleCovers.map((sub) => {
              const subPapers = getSubjectPapers(sub.code, sub.altCode);
              const SubIcon = sub.icon;

              return (
                <div
                  key={sub.code}
                  className="bg-white rounded-3xl border-2 border-slate-200/90 hover:border-[#859900] p-6 shadow-xs hover:shadow-xl transition-all duration-200 flex flex-col justify-between group hover:-translate-y-1 relative overflow-hidden"
                >
                  {/* Top Header */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className={`w-14 h-14 rounded-2xl border ${sub.iconBg} flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform shrink-0`}>
                      <SubIcon className="w-7 h-7" />
                    </div>
                    <span className="px-3 py-1 rounded-full bg-[#859900]/10 text-[#5e6d00] border border-[#859900]/20 text-[11px] font-black tracking-wide">
                      {subPapers.length} Mock Tests
                    </span>
                  </div>

                  {/* Subject Details */}
                  <div className="space-y-1.5 mb-5">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-extrabold text-[#859900] uppercase tracking-wider bg-lime-50 px-2 py-0.5 rounded">
                        {studentClass}
                      </span>
                      <span className="text-[11px] font-bold text-slate-400">
                        {sub.code}
                      </span>
                    </div>
                    <h3 className="font-black text-slate-900 text-lg tracking-tight group-hover:text-[#859900] transition-colors leading-snug">
                      {sub.title}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium line-clamp-2">
                      {sub.subtitle}
                    </p>
                  </div>

                  {/* Action Button: Opens Mock Tests Series for this Subject */}
                  <button
                    type="button"
                    onClick={() => {
                      setOpenedMockSeries(sub.code);
                      setSelectedSubject(sub.code);
                    }}
                    className="w-full pt-3 pb-1 border-t border-slate-100 flex items-center justify-between text-xs font-black text-[#859900] group-hover:translate-x-0.5 transition-all cursor-pointer"
                  >
                    <span>Open {sub.code} Mock Tests</span>
                    <div className="w-8 h-8 rounded-full bg-[#859900]/10 flex items-center justify-center text-[#859900] group-hover:bg-[#859900] group-hover:text-white transition-colors">
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
