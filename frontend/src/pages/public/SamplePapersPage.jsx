import React, { useState, useMemo, useEffect } from 'react';
import { OLYMPIAD_CATEGORIES } from '../../data/olympiadHubData';
import {
  ALL_CLASSES,
  OLYMPIAD_SUBJECT_METADATA,
  SAMPLE_PAPER_YEARS,
  generateSamplePapersCatalog,
  getSamplePaperQuestions
} from '../../data/olympiadClassData';
import {
  Download,
  FileText,
  Play,
  Filter,
  Sparkles,
  CheckCircle2,
  Eye,
  BookOpen,
  Printer,
  X,
  ChevronRight,
  HelpCircle,
  Award,
  Layers,
  Search,
  User,
  Phone,
  Mail,
  Building,
  GraduationCap,
  Clock,
  RotateCcw,
  Check
} from 'lucide-react';

export const SamplePapersPage = ({ onNavigatePublic, onOpenRegister }) => {
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedClass, setSelectedClass] = useState('all');
  const [selectedYear, setSelectedYear] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Registration Form Modal before opening Mock Test / Sample Paper
  const [mockFormTargetPaper, setMockFormTargetPaper] = useState(null);
  const [candidateForm, setCandidateForm] = useState({
    studentName: '',
    parentMobile: '',
    email: '',
    schoolName: '',
    city: '',
    className: '',
    subjectName: ''
  });
  const [formErrors, setFormErrors] = useState({});

  // Active Paper View Modal (Unlocked after form submission or direct preview)
  const [activePaperModal, setActivePaperModal] = useState(null);
  const [activeCandidate, setActiveCandidate] = useState(null);
  const [showSolutions, setShowSolutions] = useState(false);
  const [isTestMode, setIsTestMode] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [testSubmitted, setTestSubmitted] = useState(false);
  const [testScore, setTestScore] = useState(0);

  // Generate full master catalog
  const allPapers = useMemo(() => generateSamplePapersCatalog(), []);

  // Filter catalog
  const filteredPapers = useMemo(() => {
    return allPapers.filter((paper) => {
      if (selectedSubject !== 'all') {
        const normSelected = selectedSubject === 'spell-bee' ? 'vocab' :
                             selectedSubject === 'environmental' ? 'environment' :
                             selectedSubject === 'drawing' ? 'arts' : selectedSubject;
        if (paper.subjectId !== normSelected) return false;
      }

      if (selectedClass !== 'all' && paper.className !== selectedClass) return false;
      if (selectedYear !== 'all' && paper.year.toString() !== selectedYear.toString()) return false;

      if (searchQuery && searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase();
        const matchesTitle = (paper.title || '').toLowerCase().includes(q);
        const matchesSubj = (paper.subjectName || '').toLowerCase().includes(q);
        const matchesClass = (paper.className || '').toLowerCase().includes(q);
        const matchesCode = (paper.code || '').toLowerCase().includes(q);
        if (!matchesTitle && !matchesSubj && !matchesClass && !matchesCode) return false;
      }

      return true;
    });
  }, [allPapers, selectedSubject, selectedClass, selectedYear, searchQuery]);

  // Click on "Mock Test": Opens direct form first
  const handleInitiateMockTest = (paper) => {
    setMockFormTargetPaper(paper);
    setCandidateForm((prev) => ({
      ...prev,
      className: paper.className,
      subjectName: paper.fullName || paper.subjectName
    }));
    setFormErrors({});
  };

  // Direct preview without test mode
  const handleOpenDirectPreview = (paper) => {
    setActivePaperModal(paper);
    setActiveCandidate(activeCandidate || {
      studentName: 'Student Candidate',
      schoolName: 'Registered School',
      rollNo: `OLY-${Math.floor(100000 + Math.random() * 900000)}`
    });
    setIsTestMode(false);
    setShowSolutions(false);
    setSelectedAnswers({});
    setTestSubmitted(false);
  };

  // Submit Mock Test Registration Form
  const handleSubmitMockForm = (e) => {
    e.preventDefault();
    const errors = {};
    if (!candidateForm.studentName.trim()) errors.studentName = 'Student name is required';
    if (!candidateForm.parentMobile.trim() || candidateForm.parentMobile.trim().length < 10) {
      errors.parentMobile = 'Enter a valid 10-digit mobile number';
    }
    if (!candidateForm.schoolName.trim()) errors.schoolName = 'School name is required';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const candidateProfile = {
      studentName: candidateForm.studentName.trim(),
      parentMobile: candidateForm.parentMobile.trim(),
      email: candidateForm.email.trim(),
      schoolName: candidateForm.schoolName.trim(),
      city: candidateForm.city.trim() || 'India',
      rollNo: `OLY-${Math.floor(100000 + Math.random() * 900000)}`
    };

    // Save active candidate
    setActiveCandidate(candidateProfile);
    const targetPaper = mockFormTargetPaper;
    setMockFormTargetPaper(null);

    // Open the paper in Interactive Mock Test Mode
    setActivePaperModal(targetPaper);
    setIsTestMode(true);
    setShowSolutions(false);
    setSelectedAnswers({});
    setTestSubmitted(false);
    setTestScore(0);
  };

  // Select option in Mock Test mode
  const handleSelectOption = (qNum, optionIdx) => {
    if (testSubmitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [qNum]: optionIdx
    }));
  };

  // Submit Test & Calculate Result
  const handleFinishMockTest = () => {
    if (!activePaperModal) return;
    const questions = getSamplePaperQuestions(activePaperModal.subjectId, activePaperModal.className);
    let score = 0;
    questions.forEach((q) => {
      if (selectedAnswers[q.qNum] === q.correct) {
        score += q.section ? 2 : 1;
      }
    });
    setTestScore(score);
    setTestSubmitted(true);
    setShowSolutions(true);
  };

  // Print Question Paper
  const handlePrintPaper = () => {
    window.print();
  };

  return (
    <div className="bg-[#fff9f2] min-h-screen pb-20">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-[#1e1b4b] via-[#3b0764] to-[#1e3a8a] text-white py-14 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#e7b84b]/20 border border-[#e7b84b]/40 text-[#e7b84b] text-xs font-bold uppercase tracking-wider mb-4">
            <Download className="w-3.5 h-3.5" />
            <span>Official Question Bank Repository 2026-27</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
            Sample Papers &amp; Previous Year Question Sets
          </h1>
          <p className="text-sm sm:text-base text-[#deb8de] mt-3 max-w-3xl leading-relaxed">
            Download free official sample question papers and past exam papers from 2022 to 2026 across all 9 Olympiad disciplines and 15 classes (Nursery to Class 12). Review complete answer keys and take free interactive mock tests.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20 space-y-6">
        {/* Filter Bar */}
        <div className="bg-white rounded-2xl p-6 border border-[#edd6ed] shadow-md space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Subject Select */}
            <div>
              <label className="block text-[11px] font-bold text-[#6d3a68] uppercase tracking-wider mb-1.5">
                Olympiad Discipline
              </label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#edd6ed] bg-[#faf5fa] text-xs font-bold text-[#4e2a4a] focus:outline-none focus:ring-2 focus:ring-[#6d3a68] cursor-pointer"
              >
                <option value="all">All 9 Olympiad Disciplines</option>
                {Object.values(OLYMPIAD_SUBJECT_METADATA).map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.shortName} ({c.code})
                  </option>
                ))}
              </select>
            </div>

            {/* Class Select */}
            <div>
              <label className="block text-[11px] font-bold text-[#6d3a68] uppercase tracking-wider mb-1.5">
                Class Grade (Nursery - 12)
              </label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#edd6ed] bg-[#faf5fa] text-xs font-bold text-[#4e2a4a] focus:outline-none focus:ring-2 focus:ring-[#6d3a68] cursor-pointer"
              >
                <option value="all">All Classes (Nursery to 12)</option>
                <optgroup label="Early Childhood Years">
                  {['Nursery', 'LKG', 'UKG'].map((cls) => (
                    <option key={cls} value={cls}>{cls}</option>
                  ))}
                </optgroup>
                <optgroup label="Primary & Secondary Classes">
                  {ALL_CLASSES.filter(c => !['Nursery', 'LKG', 'UKG'].includes(c)).map((cls) => (
                    <option key={cls} value={cls}>{cls}</option>
                  ))}
                </optgroup>
              </select>
            </div>

            {/* Year Select */}
            <div>
              <label className="block text-[11px] font-bold text-[#6d3a68] uppercase tracking-wider mb-1.5">
                Examination Year
              </label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#edd6ed] bg-[#faf5fa] text-xs font-bold text-[#4e2a4a] focus:outline-none focus:ring-2 focus:ring-[#6d3a68] cursor-pointer"
              >
                <option value="all">All Years (2022 - 2026)</option>
                {SAMPLE_PAPER_YEARS.map((y) => (
                  <option key={y} value={y.toString()}>
                    {y === 2026 ? '2026 (Official Model Paper)' : `${y} (Past Exam Paper)`}
                  </option>
                ))}
              </select>
            </div>

            {/* Keyword Search */}
            <div>
              <label className="block text-[11px] font-bold text-[#6d3a68] uppercase tracking-wider mb-1.5">
                Search Papers
              </label>
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="e.g. IMO, Class 5, 2026..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-[#edd6ed] bg-[#faf5fa] text-xs font-bold text-[#4e2a4a] focus:outline-none focus:ring-2 focus:ring-[#6d3a68]"
                />
              </div>
            </div>
          </div>

          {/* Quick Subject Chips */}
          <div className="pt-2 border-t border-[#f4ebf4] flex items-center gap-2 overflow-x-auto scrollbar-thin">
            <span className="text-[11px] font-bold text-slate-400 shrink-0">Quick Filter:</span>
            <button
              onClick={() => setSelectedSubject('all')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer ${
                selectedSubject === 'all'
                  ? 'bg-gradient-to-r from-[#2563eb] via-[#7c3aed] to-[#db2777] text-white'
                  : 'bg-[#faf5fa] text-[#6d3a68] hover:bg-[#f4ebf4]'
              }`}
            >
              All Subjects
            </button>
            {Object.values(OLYMPIAD_SUBJECT_METADATA).map((s) => (
              <button
                key={s.id}
                onClick={() => setSelectedSubject(s.id)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  selectedSubject === s.id
                    ? 'bg-gradient-to-r from-[#2563eb] via-[#7c3aed] to-[#db2777] text-white shadow-xs'
                    : 'bg-[#faf5fa] text-[#5c3158] hover:bg-[#f4ebf4] border border-[#edd6ed]'
                }`}
              >
                {s.shortName}
              </button>
            ))}
          </div>
        </div>

        {/* Papers Count & Status */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-black text-[#4e2a4a]">
              Available Question Papers ({filteredPapers.length})
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Click <strong>Mock Test</strong> to fill candidate form and start practicing live, or click <strong>Preview &amp; PDF</strong> to view the full question paper.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => { setSelectedSubject('all'); setSelectedClass('all'); setSelectedYear('all'); setSearchQuery(''); }}
              className="text-xs font-bold text-[#6d3a68] hover:underline cursor-pointer"
            >
              Reset Filters
            </button>
            <button
              onClick={() => {
                if (filteredPapers.length > 0) handleInitiateMockTest(filteredPapers[0]);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-[#2563eb] via-[#7c3aed] to-[#db2777] hover:from-[#1d4ed8] hover:via-[#6d28d9] hover:to-[#be123c] text-white rounded-xl text-xs font-extrabold shadow-sm transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#e7b84b]" />
              <span>Take Free Mock Test</span>
            </button>
          </div>
        </div>

        {/* Papers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPapers.slice(0, 60).map((paper) => (
            <div
              key={paper.id}
              className="bg-white rounded-2xl border border-[#edd6ed] shadow-xs hover:shadow-md hover:border-[#8c4e8b]/50 transition-all p-5 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${
                    paper.year === 2026
                      ? 'bg-[#faf4e0] text-[#b17b25] border border-[#f5e7bf]'
                      : 'bg-[#faf5fa] text-[#6d3a68] border border-[#edd6ed]'
                  }`}>
                    {paper.year} Edition
                  </span>
                  <span className="text-xs font-extrabold text-[#d9775b] bg-[#fdf6f4] px-2 py-0.5 rounded border border-[#f7d7cc]">
                    {paper.className}
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-[11px] font-extrabold text-[#8c4e8b] uppercase tracking-wider">
                    {paper.code} • {paper.fullName}
                  </span>
                  <h3 className="text-base font-black text-[#4e2a4a] group-hover:text-[#6d3a68] transition-colors leading-snug">
                    {paper.title}
                  </h3>
                </div>

                <div className="mt-3 py-2 px-3 bg-[#faf5fa] rounded-xl border border-[#edd6ed]/60 flex items-center justify-between text-xs text-slate-600">
                  <span>⏱ {paper.duration}</span>
                  <span>📝 {paper.questionsCount} Questions</span>
                  <span>🎯 {paper.totalMarks} Marks</span>
                </div>

                <div className="mt-4 pt-3 border-t border-[#f4ebf4] space-y-1.5 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#d9775b] shrink-0" />
                    <span className="text-[11px] font-medium">Answer Key &amp; Step-by-Step Solutions</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#d9775b] shrink-0" />
                    <span className="text-[11px] font-medium">Achievers HOTS Section Included</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#d9775b] shrink-0" />
                    <span className="text-[11px] font-medium">Printable High-Res PDF Format</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 pt-3 border-t border-[#f4ebf4] flex items-center gap-2">
                <button
                  onClick={() => handleOpenDirectPreview(paper)}
                  className="flex-1 py-2.5 bg-[#faf5fa] hover:bg-[#f4ebf4] text-[#6d3a68] border border-[#6d3a68]/40 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5 text-[#d9775b]" />
                  <span>Preview &amp; PDF</span>
                </button>
                <button
                  onClick={() => handleInitiateMockTest(paper)}
                  className="flex-1 py-2.5 bg-gradient-to-r from-[#2563eb] via-[#7c3aed] to-[#db2777] hover:from-[#1d4ed8] hover:via-[#6d28d9] hover:to-[#be123c] text-white rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-colors shadow-sm cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 text-[#e7b84b]" />
                  <span>Mock Test</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* =========================================================================
          MODAL 1: MOCK TEST REGISTRATION FORM (OPENS ON "MOCK TEST" CLICK)
         ========================================================================= */}
      {mockFormTargetPaper && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-3 sm:p-6 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-[#edd6ed] shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
            
            {/* Header */}
            <div className="bg-gradient-to-r from-[#1e1b4b] via-[#3b0764] to-[#1e3a8a] text-white px-6 py-5 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-white/10 flex items-center justify-center text-[#e7b84b] shrink-0">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#e7b84b]/20 border border-[#e7b84b]/40 text-[#e7b84b] text-[10px] font-black uppercase tracking-wider mb-1">
                    <Sparkles className="w-3 h-3" />
                    <span>Free Candidate Access</span>
                  </div>
                  <h3 className="text-lg font-black leading-tight">
                    Start Free Mock Test
                  </h3>
                  <p className="text-xs text-[#deb8de] mt-0.5">
                    {mockFormTargetPaper.fullName} • {mockFormTargetPaper.className}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setMockFormTargetPaper(null)}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form Body */}
            <form onSubmit={handleSubmitMockForm} className="p-6 space-y-4">
              <div className="p-3 bg-[#faf5fa] rounded-2xl border border-[#edd6ed] text-xs text-[#5c3158] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#d9775b] shrink-0" />
                <span>Fill this quick form to unlock the official model paper and start your live mock test.</span>
              </div>

              {/* Student Name */}
              <div>
                <label className="block text-xs font-bold text-[#4e2a4a] mb-1">
                  Student Full Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Aarav Sharma"
                    value={candidateForm.studentName}
                    onChange={(e) => setCandidateForm({ ...candidateForm, studentName: e.target.value })}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#edd6ed] bg-[#faf5fa] text-xs font-bold text-[#4e2a4a] focus:outline-none focus:ring-2 focus:ring-[#6d3a68]"
                  />
                </div>
                {formErrors.studentName && (
                  <p className="text-[11px] text-rose-500 font-bold mt-1">{formErrors.studentName}</p>
                )}
              </div>

              {/* Mobile Number & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#4e2a4a] mb-1">
                    Parent / WhatsApp No <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="tel"
                      required
                      placeholder="10-digit mobile"
                      value={candidateForm.parentMobile}
                      onChange={(e) => setCandidateForm({ ...candidateForm, parentMobile: e.target.value })}
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#edd6ed] bg-[#faf5fa] text-xs font-bold text-[#4e2a4a] focus:outline-none focus:ring-2 focus:ring-[#6d3a68]"
                    />
                  </div>
                  {formErrors.parentMobile && (
                    <p className="text-[11px] text-rose-500 font-bold mt-1">{formErrors.parentMobile}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#4e2a4a] mb-1">
                    Email Address (Optional)
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="email"
                      placeholder="student@example.com"
                      value={candidateForm.email}
                      onChange={(e) => setCandidateForm({ ...candidateForm, email: e.target.value })}
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#edd6ed] bg-[#faf5fa] text-xs font-bold text-[#4e2a4a] focus:outline-none focus:ring-2 focus:ring-[#6d3a68]"
                    />
                  </div>
                </div>
              </div>

              {/* School Name */}
              <div>
                <label className="block text-xs font-bold text-[#4e2a4a] mb-1">
                  School Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Building className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Delhi Public School / Ryan International"
                    value={candidateForm.schoolName}
                    onChange={(e) => setCandidateForm({ ...candidateForm, schoolName: e.target.value })}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#edd6ed] bg-[#faf5fa] text-xs font-bold text-[#4e2a4a] focus:outline-none focus:ring-2 focus:ring-[#6d3a68]"
                  />
                </div>
                {formErrors.schoolName && (
                  <p className="text-[11px] text-rose-500 font-bold mt-1">{formErrors.schoolName}</p>
                )}
              </div>

              {/* Selected Class & Subject (Pre-locked for clarity) */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="p-2.5 rounded-xl bg-[#fff9f2] border border-[#edd6ed]">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Class Grade</span>
                  <span className="text-xs font-black text-[#d9775b]">{mockFormTargetPaper.className}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#fff9f2] border border-[#edd6ed]">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Discipline</span>
                  <span className="text-xs font-black text-[#6d3a68]">{mockFormTargetPaper.subjectName}</span>
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-3">
                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-[#2563eb] via-[#7c3aed] to-[#db2777] hover:from-[#1d4ed8] hover:via-[#6d28d9] hover:to-[#be123c] text-white rounded-xl text-xs font-black shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-98"
                >
                  <Sparkles className="w-4 h-4 text-[#e7b84b]" />
                  <span>Start Mock Test &amp; View Sample Paper →</span>
                </button>
                <p className="text-[10px] text-center text-slate-400 mt-2">
                  Instant free access • No credit card required • High resolution paper download
                </p>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 2: INTERACTIVE SAMPLE PAPER & LIVE MOCK TEST VIEWER
         ========================================================================= */}
      {activePaperModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-3 sm:p-6 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-4xl w-full border border-[#edd6ed] shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
            
            {/* Modal Header Controls */}
            <div className="bg-gradient-to-r from-[#1e1b4b] via-[#3b0764] to-[#1e3a8a] text-white px-6 py-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-[#e7b84b]">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#e7b84b] uppercase tracking-wider">
                      {activePaperModal.code} • {activePaperModal.editionType}
                    </span>
                    {isTestMode && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-black uppercase tracking-wider">
                        Live Mock Mode
                      </span>
                    )}
                  </div>
                  <h3 className="text-base sm:text-lg font-black leading-tight">
                    {activePaperModal.title}
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrintPaper}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#e7b84b] hover:bg-[#d4a339] text-[#4e2a4a] text-xs font-black shadow-sm transition-all cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print / Save PDF</span>
                </button>
                <button
                  onClick={() => setActivePaperModal(null)}
                  className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Paper Toolbar */}
            <div className="px-6 py-3 bg-[#faf5fa] border-b border-[#edd6ed] flex flex-wrap items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-4 text-xs font-bold text-slate-600">
                <span>⏱ Duration: <strong className="text-[#4e2a4a]">{activePaperModal.duration}</strong></span>
                <span>📊 Questions: <strong className="text-[#4e2a4a]">{activePaperModal.questionsCount}</strong></span>
                <span>🎯 Marks: <strong className="text-[#4e2a4a]">{activePaperModal.totalMarks}</strong></span>
                {testSubmitted && (
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 font-extrabold border border-emerald-300">
                    🏆 Your Score: {testScore} / {activePaperModal.totalMarks}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                {isTestMode && !testSubmitted && (
                  <button
                    onClick={handleFinishMockTest}
                    className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-black shadow-xs hover:from-emerald-700 hover:to-teal-700 cursor-pointer"
                  >
                    Submit Test &amp; View Result
                  </button>
                )}
                <button
                  onClick={() => setShowSolutions(!showSolutions)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
                    showSolutions
                      ? 'bg-gradient-to-r from-[#2563eb] via-[#7c3aed] to-[#db2777] text-white shadow-xs'
                      : 'bg-white border border-[#6d3a68] text-[#6d3a68] hover:bg-[#f4ebf4]'
                  }`}
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>{showSolutions ? 'Hide Answers' : 'Reveal Answers & Solutions'}</span>
                </button>
              </div>
            </div>

            {/* Paper Printable Body */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-8 print:p-0">
              
              {/* Paper Header / Student Information Box (Filled with candidate profile) */}
              <div className="border-2 border-[#4e2a4a] rounded-2xl p-5 bg-[#fff9f2] space-y-4">
                <div className="text-center pb-3 border-b border-[#edd6ed]">
                  <p className="text-xs font-extrabold text-[#d9775b] uppercase tracking-widest">
                    SkillRise Olympiad Foundation • Official Assessment Paper
                  </p>
                  <h2 className="text-xl sm:text-2xl font-black text-[#4e2a4a] mt-1">
                    {activePaperModal.fullName} ({activePaperModal.code})
                  </h2>
                  <p className="text-xs font-bold text-[#6d3a68] mt-0.5">
                    Class {activePaperModal.className} • Academic Session 2026-27
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-2.5 bg-white rounded-xl border border-[#edd6ed]">
                    <span className="text-slate-400 text-[10px] uppercase font-bold block">Candidate Name</span>
                    <span className="font-extrabold text-[#4e2a4a]">
                      {activeCandidate?.studentName || 'Student Candidate'}
                    </span>
                  </div>
                  <div className="p-2.5 bg-white rounded-xl border border-[#edd6ed]">
                    <span className="text-slate-400 text-[10px] uppercase font-bold block">Roll / OMR Number</span>
                    <span className="font-extrabold font-mono text-[#6d3a68]">
                      {activeCandidate?.rollNo || `OLY-${Math.floor(100000 + Math.random() * 900000)}`}
                    </span>
                  </div>
                  <div className="p-2.5 bg-white rounded-xl border border-[#edd6ed]">
                    <span className="text-slate-400 text-[10px] uppercase font-bold block">School &amp; Center</span>
                    <span className="font-extrabold text-slate-800 truncate block">
                      {activeCandidate?.schoolName || 'SkillRise Online Exam Center'}
                    </span>
                  </div>
                </div>

                <div className="text-[11px] text-slate-600 bg-white/80 p-3 rounded-xl border border-[#edd6ed] space-y-1 leading-relaxed">
                  <p className="font-bold text-[#4e2a4a]">Candidate Instructions:</p>
                  <p>1. The examination consists of multiple choice questions (MCQs). Only one option is correct.</p>
                  <p>2. Select your choice by clicking on the option (A, B, C, or D). You can change your choice anytime before submitting.</p>
                  <p>3. Section 2 (Achievers HOTS Section) carries 2 marks per question.</p>
                </div>
              </div>

              {/* Questions List */}
              <div className="space-y-6">
                <h4 className="text-sm font-black text-[#4e2a4a] uppercase tracking-wider pb-2 border-b border-[#edd6ed] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-[#d9775b]" />
                    <span>Section 1 &amp; Section 2: Question Paper</span>
                  </div>
                  {isTestMode && !testSubmitted && (
                    <span className="text-xs font-bold text-[#6d3a68]">
                      Attempted: {Object.keys(selectedAnswers).length} / {getSamplePaperQuestions(activePaperModal.subjectId, activePaperModal.className).length}
                    </span>
                  )}
                </h4>

                {getSamplePaperQuestions(activePaperModal.subjectId, activePaperModal.className).map((qItem) => {
                  const candidateChoice = selectedAnswers[qItem.qNum];
                  const isAnswered = candidateChoice !== undefined;
                  const isCorrectChoice = candidateChoice === qItem.correct;

                  return (
                    <div
                      key={qItem.qNum}
                      className={`p-5 rounded-2xl border transition-all ${
                        isAnswered && !testSubmitted
                          ? 'bg-[#f4ebf4]/40 border-[#8c4e8b]/40 shadow-xs'
                          : 'bg-[#faf5fa] border-[#edd6ed]'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-2.5">
                          <span className={`w-6 h-6 rounded-lg text-xs font-black flex items-center justify-center shrink-0 ${
                            isAnswered ? 'bg-gradient-to-r from-[#2563eb] via-[#7c3aed] to-[#db2777] text-white' : 'bg-gradient-to-r from-[#2563eb] via-[#7c3aed] to-[#db2777] text-white'
                          }`}>
                            {qItem.qNum}
                          </span>
                          <div>
                            {qItem.section && (
                              <span className="text-[10px] font-black uppercase text-[#d9775b] tracking-wider block mb-1">
                                ★ {qItem.section}
                              </span>
                            )}
                            <p className="text-sm font-black text-[#4e2a4a] leading-relaxed">
                              {qItem.question}
                            </p>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white text-[#6d3a68] border border-[#edd6ed] shrink-0">
                          {qItem.section ? '2 Marks' : '1 Mark'}
                        </span>
                      </div>

                      {/* Options A, B, C, D */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-8.5 mt-3">
                        {qItem.options.map((opt, oIdx) => {
                          const optionLabels = ['(A)', '(B)', '(C)', '(D)'];
                          const isOptionSelected = candidateChoice === oIdx;
                          const isOptionCorrect = oIdx === qItem.correct;

                          let optionClass = 'bg-white border-[#edd6ed] text-slate-700 hover:border-[#6d3a68]/60 cursor-pointer';
                          
                          if (testSubmitted) {
                            if (isOptionCorrect) {
                              optionClass = 'bg-emerald-50 border-emerald-400 text-emerald-900 ring-2 ring-emerald-500/20';
                            } else if (isOptionSelected && !isOptionCorrect) {
                              optionClass = 'bg-rose-50 border-rose-300 text-rose-800 line-through';
                            } else {
                              optionClass = 'bg-white border-[#edd6ed] text-slate-500 opacity-80';
                            }
                          } else if (isOptionSelected) {
                            optionClass = 'bg-gradient-to-r from-[#2563eb] via-[#7c3aed] to-[#db2777] text-white border-[#6d3a68] shadow-xs';
                          }

                          return (
                            <button
                              type="button"
                              key={oIdx}
                              onClick={() => handleSelectOption(qItem.qNum, oIdx)}
                              className={`p-3 rounded-xl border text-xs font-bold flex items-center gap-2.5 transition-all text-left ${optionClass}`}
                            >
                              <span className={isOptionSelected && !testSubmitted ? 'text-[#e7b84b] font-black' : isOptionCorrect && testSubmitted ? 'text-emerald-700 font-black' : 'text-[#6d3a68]'}>
                                {optionLabels[oIdx]}
                              </span>
                              <span className="flex-1">{opt}</span>
                              {testSubmitted && isOptionCorrect && (
                                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                              )}
                              {isOptionSelected && !testSubmitted && (
                                <Check className="w-4 h-4 text-[#e7b84b] shrink-0" />
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {/* Solution Explanation Box */}
                      {showSolutions && (
                        <div className="mt-3.5 ml-8.5 p-3.5 rounded-xl bg-[#faf4e0] border border-[#f5e7bf] text-xs space-y-1.5">
                          <div className="flex items-center gap-1.5 text-[#b17b25] font-black">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Correct Answer: Option {['A', 'B', 'C', 'D'][qItem.correct]}</span>
                            {testSubmitted && (
                              <span className={`ml-2 text-[10px] px-2 py-0.5 rounded font-black ${
                                isCorrectChoice ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                              }`}>
                                {isCorrectChoice ? '✓ Correct (+ marks)' : '✗ Incorrect / Unattempted'}
                              </span>
                            )}
                          </div>
                          <p className="text-slate-700 leading-relaxed font-medium">
                            <strong>Step-by-Step Solution:</strong> {qItem.explanation}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Bottom Actions inside modal */}
              <div className="pt-4 border-t border-[#edd6ed] flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs text-slate-500">
                  Official SkillRise Model Paper • Candidate: <strong>{activeCandidate?.studentName || 'Student'}</strong>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrintPaper}
                    className="px-4 py-2 bg-[#faf5fa] hover:bg-[#f4ebf4] text-[#6d3a68] border border-[#edd6ed] rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-[#d9775b]" />
                    <span>Download Paper PDF</span>
                  </button>
                  <button
                    onClick={() => {
                      setActivePaperModal(null);
                      if (onOpenRegister) onOpenRegister();
                    }}
                    className="px-4 py-2 bg-gradient-to-r from-[#2563eb] via-[#7c3aed] to-[#db2777] hover:from-[#1d4ed8] hover:via-[#6d28d9] hover:to-[#be123c] text-white rounded-xl text-xs font-extrabold shadow-sm flex items-center gap-1.5 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#e7b84b]" />
                    <span>Register for {activePaperModal.shortName || 'Olympiad'}</span>
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};
