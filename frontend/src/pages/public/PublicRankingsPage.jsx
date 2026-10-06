import React, { useState } from 'react';
import { PUBLIC_LEADERBOARD, OLYMPIAD_CATEGORIES } from '../../data/olympiadHubData';
import {
  OLYMPIAD_SUBJECT_METADATA,
  getClassWiseCutOffData,
  ALL_CLASSES
} from '../../data/olympiadClassData';
import {
  Award,
  Trophy,
  Medal,
  Search,
  CheckCircle2,
  Star,
  Sparkles,
  BookOpen,
  Calculator,
  Atom,
  Brain,
  Cpu,
  Layers,
  TreePine,
  Palette,
  Globe,
  ArrowLeft,
  ArrowRight,
  FileText,
  Calendar,
  TrendingUp,
  ShieldCheck,
  ChevronRight,
  GraduationCap,
  Info
} from 'lucide-react';

const SUBJECT_ICON_COMPONENTS = {
  english: BookOpen,
  math: Calculator,
  science: Atom,
  reasoning: Brain,
  cyber: Cpu,
  vocabulary: Layers,
  environment: TreePine,
  arts: Palette,
  gk: Globe
};

export const PublicRankingsPage = ({ onNavigatePublic, onOpenRegister }) => {
  const [activeTab, setActiveTab] = useState('leaderboard'); // 'leaderboard' | 'cutoffs'
  const [selectedOlympiad, setSelectedOlympiad] = useState('all');
  const [selectedClass, setSelectedClass] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Selected subject inside Cut-Off tab: null = view all subjects grid, string = view class-wise details
  const [selectedCutoffSubject, setSelectedCutoffSubject] = useState(null);

  const classes = ['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'];

  const filteredRankings = (PUBLIC_LEADERBOARD || []).filter((row) => {
    if (!row) return false;
    if (selectedOlympiad !== 'all' && !(row.olympiad || '').toLowerCase().includes((selectedOlympiad || '').toLowerCase())) return false;
    if (selectedClass !== 'all' && row.className !== selectedClass) return false;
    if (searchQuery && searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      const matchName = (row.studentName || '').toLowerCase().includes(q);
      const matchSchool = (row.school || '').toLowerCase().includes(q);
      const matchCity = (row.city || '').toLowerCase().includes(q);
      if (!matchName && !matchSchool && !matchCity) return false;
    }
    return true;
  });

  const subjectList = Object.values(OLYMPIAD_SUBJECT_METADATA);
  const activeSubjectMeta = selectedCutoffSubject ? (OLYMPIAD_SUBJECT_METADATA[selectedCutoffSubject] || OLYMPIAD_SUBJECT_METADATA.math) : null;
  const activeSubjectCutoffs = selectedCutoffSubject ? getClassWiseCutOffData(selectedCutoffSubject) : [];

  return (
    <div className="bg-[#fff9f2] min-h-screen pb-20">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-[#1e1b4b] via-[#3b0764] to-[#1e3a8a] text-white py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#e7b84b]/20 border border-[#e7b84b]/40 text-[#e7b84b] text-xs font-bold uppercase tracking-wider mb-4">
            <Trophy className="w-3.5 h-3.5" />
            <span>National &amp; Global Honors &amp; Benchmarks</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
            National Rankings, Leaderboards &amp; Qualifying Cut-Offs
          </h1>
          <p className="text-sm sm:text-base text-[#deb8de] mt-3 max-w-3xl leading-relaxed">
            Explore national leaderboards, official subject-wise qualifying cut-off marks, and Level 2 advancement benchmarks across all grades (Nursery to Class 12).
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
        {/* Toggle between Leaderboard & Cutoffs */}
        <div className="bg-white rounded-2xl p-2 border border-[#edd6ed] shadow-md flex flex-wrap items-center justify-between gap-4">
          <div className="flex gap-2">
            <button
              onClick={() => {
                setActiveTab('leaderboard');
              }}
              className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                activeTab === 'leaderboard'
                  ? 'bg-gradient-to-r from-[#2563eb] via-[#7c3aed] to-[#db2777] text-white shadow-md shadow-[#6d3a68]/20'
                  : 'bg-[#faf5fa] text-[#5c3158] hover:bg-[#f4ebf4]'
              }`}
            >
              National Leaderboard (Top Rankers)
            </button>
            <button
              onClick={() => {
                setActiveTab('cutoffs');
              }}
              className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                activeTab === 'cutoffs'
                  ? 'bg-gradient-to-r from-[#2563eb] via-[#7c3aed] to-[#db2777] text-white shadow-md shadow-[#6d3a68]/20'
                  : 'bg-[#faf5fa] text-[#5c3158] hover:bg-[#f4ebf4]'
              }`}
            >
              Qualifying Cut-Off Marks
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigatePublic && onNavigatePublic('results-finder')}
              className="text-xs font-bold text-[#d9775b] hover:underline cursor-pointer hidden sm:block pr-2"
            >
              Check Individual Roll No Result →
            </button>
          </div>
        </div>

        {/* 1. LEADERBOARD VIEW */}
        {activeTab === 'leaderboard' && (
          <div className="mt-8 space-y-6">
            {/* Filter & Search Bar */}
            <div className="bg-white rounded-2xl p-6 border border-[#edd6ed] shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-[#6d3a68] uppercase tracking-wider mb-1.5">
                  Search Student or School
                </label>
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    placeholder="Search by name, city, school..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2 rounded-xl border border-[#edd6ed] bg-[#faf5fa] text-xs font-semibold text-[#4e2a4a] focus:outline-none focus:ring-2 focus:ring-[#6d3a68]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#6d3a68] uppercase tracking-wider mb-1.5">
                  Olympiad Discipline
                </label>
                <select
                  value={selectedOlympiad}
                  onChange={(e) => setSelectedOlympiad(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#edd6ed] bg-[#faf5fa] text-xs font-bold text-[#4e2a4a]"
                >
                  <option value="all">All Olympiad Categories</option>
                  {OLYMPIAD_CATEGORIES.map((c) => (
                    <option key={c.id} value={c.shortName}>
                      {c.shortName} Olympiad
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#6d3a68] uppercase tracking-wider mb-1.5">
                  Class Cohort
                </label>
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#edd6ed] bg-[#faf5fa] text-xs font-bold text-[#4e2a4a]"
                >
                  <option value="all">All Classes</option>
                  {classes.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Leaderboard Table */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#edd6ed] shadow-sm overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-[#faf5fa] text-[#6d3a68] border-b border-[#edd6ed] uppercase text-[11px] font-black tracking-wider">
                    <th className="py-3.5 px-4 rounded-l-xl text-center">Rank</th>
                    <th className="py-3.5 px-4">Student Name</th>
                    <th className="py-3.5 px-4">Olympiad &amp; Class</th>
                    <th className="py-3.5 px-4">School &amp; City</th>
                    <th className="py-3.5 px-4 text-center">Score</th>
                    <th className="py-3.5 px-4 text-center">Percentile</th>
                    <th className="py-3.5 px-4 text-center rounded-r-xl">Medal / Honor</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f4ebf4]">
                  {filteredRankings.map((row, idx) => {
                    let rankBadge = null;
                    if (row.rank === 1) {
                      rankBadge = <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#e7b84b] text-[#321630] font-black text-xs shadow-sm">1</span>;
                    } else if (row.rank === 2) {
                      rankBadge = <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-slate-300 text-[#321630] font-black text-xs shadow-sm">2</span>;
                    } else if (row.rank === 3) {
                      rankBadge = <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-gradient-to-r from-[#2563eb] via-[#7c3aed] to-[#db2777] text-white font-black text-xs shadow-sm">3</span>;
                    } else {
                      rankBadge = <span className="text-xs font-bold text-slate-500">{row.rank}</span>;
                    }

                    return (
                      <tr key={idx} className="hover:bg-[#fff9f2] transition-colors">
                        <td className="py-4 px-4 text-center">{rankBadge}</td>
                        <td className="py-4 px-4 font-black text-[#4e2a4a]">{row.studentName}</td>
                        <td className="py-4 px-4">
                          <p className="font-bold text-[#6d3a68]">{row.olympiad}</p>
                          <p className="text-[10px] text-slate-400">{row.className}</p>
                        </td>
                        <td className="py-4 px-4">
                          <p className="text-slate-700 font-medium">{row.school}</p>
                          <p className="text-[10px] text-slate-400">{row.city}, {row.country || 'India'}</p>
                        </td>
                        <td className="py-4 px-4 text-center font-black text-[#4e2a4a]">{row.score}</td>
                        <td className="py-4 px-4 text-center font-bold text-[#d9775b]">{row.percentile}%</td>
                        <td className="py-4 px-4 text-center">
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-[#faf4e0] text-[#8c4e8b] border border-[#e7b84b]/40">
                            {row.award}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 2. QUALIFYING CUT-OFFS VIEW */}
        {activeTab === 'cutoffs' && (
          <div className="mt-8 space-y-8">
            {/* VIEW A: ALL SUBJECTS TABLE (Exact format matching user reference screenshot) */}
            {!selectedCutoffSubject && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-[#0b5478] text-white text-xs sm:text-sm font-bold">
                          <th className="py-3.5 px-6 w-24 text-center">Serial No</th>
                          <th className="py-3.5 px-6">Subject Name</th>
                          <th className="py-3.5 px-6 text-center w-36">Subject Link</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                        {subjectList.map((subject, index) => {
                          const serialNo = index + 1;
                          const displayName = `${subject.fullName} (${subject.code})`;
                          const linkCode = subject.code;

                          return (
                            <tr
                              key={subject.id}
                              onClick={() => setSelectedCutoffSubject(subject.id)}
                              className="hover:bg-[#f0f7fa] transition-colors cursor-pointer group"
                            >
                              <td className="py-4 px-6 text-center font-semibold text-slate-600">
                                {serialNo}
                              </td>
                              <td className="py-4 px-6">
                                <span className="font-semibold text-[#006699] group-hover:text-[#004466] group-hover:underline cursor-pointer">
                                  {displayName}
                                </span>
                              </td>
                              <td className="py-4 px-6 text-center">
                                <span className="font-bold text-[#006699] group-hover:text-[#004466] group-hover:underline cursor-pointer">
                                  {linkCode}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* VIEW B: DETAILED CLASS-WISE CUT-OFF VIEW (When a subject is selected) */}
            {selectedCutoffSubject && activeSubjectMeta && (
              <div className="space-y-6">
                {/* Back to All Subjects Navigation & Switcher Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-[#edd6ed] shadow-sm">
                  <button
                    onClick={() => setSelectedCutoffSubject(null)}
                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold text-[#6d3a68] bg-[#faf5fa] hover:bg-[#f4ebf4] border border-[#edd6ed] transition-colors cursor-pointer w-fit"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to All Olympiad Subjects</span>
                  </button>

                  {/* Horizontal Subject Switcher Pills */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-thin">
                    {subjectList.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => setSelectedCutoffSubject(s.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                          selectedCutoffSubject === s.id
                            ? 'bg-gradient-to-r from-[#2563eb] via-[#7c3aed] to-[#db2777] text-white shadow-sm'
                            : 'bg-[#faf5fa] text-slate-600 hover:bg-[#f4ebf4]'
                        }`}
                      >
                        {s.code}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Subject Banner Overview Card */}
                <div
                  className="rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-lg"
                  style={{
                    background: `linear-gradient(135deg, ${activeSubjectMeta.colorHex || '#4e2a4a'} 0%, #6d3a68 50%, #8c4e8b 100%)`
                  }}
                >
                  <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="max-w-2xl">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-black uppercase tracking-wider mb-3">
                        <GraduationCap className="w-3.5 h-3.5 text-[#e7b84b]" />
                        <span>{activeSubjectMeta.code} Class-Wise Qualifying Benchmark</span>
                      </div>
                      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight">
                        {activeSubjectMeta.fullName}
                      </h2>
                      <p className="text-xs sm:text-sm text-pink-100 mt-2 italic">
                        "{activeSubjectMeta.quote}"
                      </p>
                      <p className="text-xs text-white/80 mt-2">
                        {activeSubjectMeta.tagline}
                      </p>
                    </div>

                    <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl text-xs space-y-2 shrink-0">
                      <div>
                        <span className="text-white/60 block text-[10px] uppercase font-bold">Level 1 Exam Date</span>
                        <span className="font-bold text-white">{activeSubjectMeta.examDates2026_2027?.level1Dates}</span>
                      </div>
                      <div className="pt-2 border-t border-white/10">
                        <span className="text-white/60 block text-[10px] uppercase font-bold">Level 2 Finale Date</span>
                        <span className="font-bold text-[#e7b84b]">{activeSubjectMeta.examDates2026_2027?.level2Dates}</span>
                      </div>
                      <div className="pt-2 border-t border-white/10">
                        <span className="text-white/60 block text-[10px] uppercase font-bold">Total Classes Covered</span>
                        <span className="font-bold text-white">All 15 Grades (Nursery to 12th)</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Class-wise Cut-Off Master Table */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#edd6ed] shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                    <div>
                      <h3 className="text-lg font-black text-[#4e2a4a]">
                        Official Class-Wise Cut-Off Marks Table ({activeSubjectMeta.code} 2026-27)
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Minimum marks required across each grade cohort to qualify for Level 2 &amp; achieve Merit Honors.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold bg-[#faf4e0] text-[#8c4e8b] border border-[#e7b84b]/30">
                        <Star className="w-3 h-3 text-[#e7b84b]" />
                        Official 2026-27 Benchmarks
                      </span>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="bg-[#faf5fa] text-[#6d3a68] border-b border-[#edd6ed] uppercase text-[11px] font-black tracking-wider">
                          <th className="py-3.5 px-4 rounded-l-xl">Class / Grade</th>
                          <th className="py-3.5 px-4 text-center">Total Marks</th>
                          <th className="py-3.5 px-4 text-center bg-[#faf4e0]/60 text-[#4e2a4a]">
                            Level 1 Qualifying Cut-Off
                          </th>
                          <th className="py-3.5 px-4 text-center">Benchmark Percentile</th>
                          <th className="py-3.5 px-4 text-center">Top 5% National Merit</th>
                          <th className="py-3.5 px-4 text-center">Zonal Top 10</th>
                          <th className="py-3.5 px-4 text-center">Sec 1 (Core) Min</th>
                          <th className="py-3.5 px-4 text-center">Sec 2 (HOTS) Min</th>
                          <th className="py-3.5 px-4 text-center rounded-r-xl">Level 2 Exam Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#f4ebf4]">
                        {activeSubjectCutoffs.map((row, idx) => (
                          <tr key={idx} className="hover:bg-[#fff9f2] transition-colors">
                            <td className="py-4 px-4 font-black text-[#4e2a4a]">
                              <div className="flex items-center gap-2">
                                <span className="w-6 h-6 rounded-full bg-[#f4ebf4] text-[#6d3a68] inline-flex items-center justify-center font-bold text-[11px]">
                                  {idx + 1}
                                </span>
                                <span>{row.className}</span>
                              </div>
                            </td>
                            <td className="py-4 px-4 text-center font-bold text-slate-600">
                              {row.totalMarks}
                            </td>
                            <td className="py-4 px-4 text-center bg-[#faf4e0]/40">
                              <span className="px-3 py-1 rounded-lg font-black text-xs bg-gradient-to-r from-[#2563eb] via-[#7c3aed] to-[#db2777] text-white shadow-xs">
                                {row.level1CutOff} / {row.totalMarks}
                              </span>
                            </td>
                            <td className="py-4 px-4 text-center font-bold text-[#d9775b]">
                              ≥ {row.percentile}
                            </td>
                            <td className="py-4 px-4 text-center font-bold text-[#4e2a4a]">
                              <span className="px-2 py-0.5 rounded bg-[#f4ebf4] text-[#6d3a68] font-black">
                                {row.top5PercentScore} / {row.totalMarks}
                              </span>
                            </td>
                            <td className="py-4 px-4 text-center font-bold text-slate-700">
                              {row.zonalTop10Score} / {row.totalMarks}
                            </td>
                            <td className="py-4 px-4 text-center font-semibold text-slate-600">
                              {row.section1Min}
                            </td>
                            <td className="py-4 px-4 text-center font-semibold text-slate-600">
                              {row.section2Min}
                            </td>
                            <td className="py-4 px-4 text-center font-medium text-slate-600 text-[11px]">
                              {row.level2Date.split('&')[0]}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* 3-Year Historical Cut-Off Trends Table */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#edd6ed] shadow-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="w-5 h-5 text-[#d9775b]" />
                    <h3 className="text-base font-black text-[#4e2a4a]">
                      3-Year Comparative Cut-Off Trends (2026 Expected vs 2025 vs 2024)
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500 mb-6">
                    Historical comparison of Level 1 qualifying cut-offs across all grades for {activeSubjectMeta.fullName}.
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                    {activeSubjectCutoffs.map((row, idx) => (
                      <div key={idx} className="bg-[#faf5fa] p-3.5 rounded-2xl border border-[#edd6ed]">
                        <p className="text-xs font-black text-[#6d3a68] mb-1.5">{row.className}</p>
                        <div className="space-y-1 text-[11px]">
                          <div className="flex justify-between">
                            <span className="text-slate-400">2026 Exp:</span>
                            <span className="font-black text-[#4e2a4a]">{row.historicalTrends.y2026}/{row.totalMarks}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">2025:</span>
                            <span className="font-semibold text-slate-600">{row.historicalTrends.y2025}/{row.totalMarks}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">2024:</span>
                            <span className="font-semibold text-slate-600">{row.historicalTrends.y2024}/{row.totalMarks}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Level 2 Qualification Criteria & Tie-Breaker Guidelines */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#edd6ed] shadow-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <Info className="w-5 h-5 text-[#6d3a68]" />
                    <h3 className="text-base font-black text-[#4e2a4a]">
                      Official Criteria for Selection to Level 2 Olympiad Finale
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div className="bg-[#fff9f2] p-4 rounded-2xl border border-[#edd6ed]">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-r from-[#2563eb] via-[#7c3aed] to-[#db2777] text-white flex items-center justify-center font-black text-xs mb-2">
                        1
                      </div>
                      <h4 className="font-bold text-[#4e2a4a] mb-1">Top 5% National/International</h4>
                      <p className="text-slate-600 text-[11px] leading-relaxed">
                        Top 5% candidates internationally/nationally in each class who appear in the Level 1 examination qualify directly for Level 2.
                      </p>
                    </div>

                    <div className="bg-[#fff9f2] p-4 rounded-2xl border border-[#edd6ed]">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-r from-[#2563eb] via-[#7c3aed] to-[#db2777] text-white flex items-center justify-center font-black text-xs mb-2">
                        2
                      </div>
                      <h4 className="font-bold text-[#4e2a4a] mb-1">Top 25 Zonal Rank Holders</h4>
                      <p className="text-slate-600 text-[11px] leading-relaxed">
                        Top 25 rank holders from each educational zone in each class cohort advance to Level 2.
                      </p>
                    </div>

                    <div className="bg-[#fff9f2] p-4 rounded-2xl border border-[#edd6ed]">
                      <div className="w-7 h-7 rounded-full bg-[#e7b84b] text-[#4e2a4a] flex items-center justify-center font-black text-xs mb-2">
                        3
                      </div>
                      <h4 className="font-bold text-[#4e2a4a] mb-1">Class Topper per School</h4>
                      <p className="text-slate-600 text-[11px] leading-relaxed">
                        Class topper from each participating school where at least 10 candidates participated and scored at least 50% qualifying marks.
                      </p>
                    </div>
                  </div>

                  {/* Tie-breaking protocol */}
                  <div className="mt-4 p-4 rounded-2xl bg-[#faf5fa] border border-[#edd6ed] text-xs">
                    <p className="font-bold text-[#6d3a68] mb-1">Tie-Breaker Rule Priority:</p>
                    <p className="text-slate-600 text-[11px] leading-relaxed">
                      In the event of two or more students scoring equal marks, priority is given in the following sequence:
                      (1) Marks scored in Section 2 (Achievers / HOTS Section), (2) Marks scored in Section 1 (Core Subject Fundamentals), (3) Lesser number of incorrect attempts, (4) Time taken to complete the examination.
                    </p>
                  </div>
                </div>

                {/* Bottom Action Cards */}
                <div className="bg-gradient-to-r from-[#faf5fa] to-[#fff9f2] rounded-3xl p-6 border border-[#edd6ed] flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <h4 className="font-black text-[#4e2a4a] text-sm">
                      Ready to excel in {activeSubjectMeta.fullName}?
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Practice with official class-wise sample papers or register for the upcoming 2026-27 Olympiad.
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <button
                      onClick={() => onNavigatePublic && onNavigatePublic('sample-papers')}
                      className="px-4 py-2.5 rounded-xl text-xs font-bold bg-white text-[#6d3a68] border border-[#edd6ed] hover:bg-[#faf5fa] transition-colors cursor-pointer shadow-xs"
                    >
                      Practice Mock Tests →
                    </button>
                    <button
                      onClick={() => onOpenRegister ? onOpenRegister() : (onNavigatePublic && onNavigatePublic('direct-enrollment'))}
                      className="px-5 py-2.5 rounded-xl text-xs font-black bg-gradient-to-r from-[#2563eb] via-[#7c3aed] to-[#db2777] text-white hover:bg-[#5c3158] transition-colors cursor-pointer shadow-md shadow-[#6d3a68]/20"
                    >
                      Register for Olympiad
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
