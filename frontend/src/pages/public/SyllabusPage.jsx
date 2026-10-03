import React, { useState, useEffect } from 'react';
import { OLYMPIAD_CATEGORIES } from '../../data/olympiadHubData';
import {
  ALL_CLASSES,
  OLYMPIAD_SUBJECT_METADATA,
  getClassSyllabus
} from '../../data/olympiadClassData';
import { apiClient } from '../../api/client';
import {
  BookOpen,
  CheckCircle,
  ArrowRight,
  Download,
  Filter,
  Sparkles,
  Layers,
  Award,
  Calendar,
  GraduationCap
} from 'lucide-react';

export const SyllabusPage = ({ onNavigatePublic, onOpenRegister }) => {
  const [selectedCategory, setSelectedCategory] = useState(OLYMPIAD_CATEGORIES[0].id);
  const [selectedClass, setSelectedClass] = useState('Class 1');
  const [customContent, setCustomContent] = useState(null);
  const [loadingContent, setLoadingContent] = useState(false);

  // Normalize category ID for metadata lookup
  const normalizedCategory = selectedCategory === 'spell-bee' ? 'vocab' :
                             selectedCategory === 'environmental' ? 'environment' :
                             selectedCategory === 'drawing' ? 'arts' : selectedCategory;

  const currentOlympiad = OLYMPIAD_CATEGORIES.find((c) => c.id === selectedCategory) || OLYMPIAD_CATEGORIES[0];
  const subjectMeta = OLYMPIAD_SUBJECT_METADATA[normalizedCategory] || OLYMPIAD_SUBJECT_METADATA.english;

  // Fetch custom syllabus modules from MySQL backend if edited by Super Admin
  useEffect(() => {
    let isMounted = true;
    const fetchCustomSyllabus = async () => {
      setLoadingContent(true);
      try {
        const res = await apiClient.get('/academic/subject-class-content', {
          subject_slug: normalizedCategory,
          class_name: selectedClass
        });
        if (isMounted && res && res.success && res.data) {
          setCustomContent(res.data);
        } else if (isMounted) {
          setCustomContent(null);
        }
      } catch (err) {
        if (isMounted) setCustomContent(null);
      } finally {
        if (isMounted) setLoadingContent(false);
      }
    };

    fetchCustomSyllabus();
    return () => { isMounted = false; };
  }, [normalizedCategory, selectedClass]);

  // Parse JSON safely
  const parseJsonSafe = (raw, fallback) => {
    if (!raw) return fallback;
    if (typeof raw === 'object') return raw;
    try {
      return JSON.parse(raw);
    } catch {
      return fallback;
    }
  };

  // Determine active syllabus list
  const defaultSyllabus = getClassSyllabus(normalizedCategory, selectedClass);
  const customSyllabus = parseJsonSafe(customContent?.syllabus_modules_json, null);
  const syllabusList = (Array.isArray(customSyllabus) && customSyllabus.length > 0)
    ? customSyllabus
    : defaultSyllabus;

  const totalQuestions = syllabusList.reduce((acc, item) => acc + (parseInt(item.questionsCount || item.questions) || 15), 0);

  return (
    <div className="bg-[#fff9f2] min-h-screen pb-20">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-[#4e2a4a] via-[#6d3a68] to-[#8c4e8b] text-white py-14 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#e7b84b]/20 border border-[#e7b84b]/40 text-[#e7b84b] text-xs font-bold uppercase tracking-wider mb-4">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Academic Curriculum 2026-27</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
            Class-wise Olympiad Syllabus &amp; Learning Outcomes
          </h1>
          <p className="text-sm sm:text-base text-[#deb8de] mt-3 max-w-3xl leading-relaxed">
            Detailed curriculum maps for all 9 Olympiad disciplines across Nursery to Class 12. Review topics, learning objectives, and practice weightages carefully crafted for National and International assessments.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
        {/* Olympiad Discipline Filter Pills */}
        <div className="bg-white rounded-2xl p-3 border border-[#edd6ed] shadow-md flex items-center gap-2 overflow-x-auto scrollbar-thin">
          {OLYMPIAD_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
                selectedCategory === cat.id
                  ? 'bg-[#6d3a68] text-white shadow-md shadow-[#6d3a68]/20'
                  : 'bg-[#faf5fa] text-[#5c3158] hover:bg-[#f4ebf4]'
              }`}
            >
              <span>{cat.shortName}</span>
              {cat.code && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                  selectedCategory === cat.id ? 'bg-white/20 text-[#e7b84b]' : 'bg-[#edd6ed] text-[#6d3a68]'
                }`}>
                  {cat.code.split('-')[0]}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mt-8">
          {/* Left: Class Selection Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-5 border border-[#edd6ed] shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-[#d9775b]" />
                  <h3 className="text-xs font-black text-[#4e2a4a] uppercase tracking-wider">Select Class</h3>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 bg-[#faf5fa] border border-[#edd6ed] text-[#6d3a68] rounded-full">
                  15 Classes
                </span>
              </div>
              
              {/* Early Grades */}
              <div className="mb-3">
                <span className="text-[10px] font-extrabold text-[#8c4e8b] uppercase tracking-wider px-1 block mb-1.5">
                  Early Years
                </span>
                <div className="grid grid-cols-3 gap-1.5">
                  {['Nursery', 'LKG', 'UKG'].map((cls) => (
                    <button
                      key={cls}
                      onClick={() => setSelectedClass(cls)}
                      className={`py-2 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer text-center ${
                        selectedClass === cls
                          ? 'bg-[#d9775b] text-white shadow-sm'
                          : 'bg-[#faf5fa] text-[#5c3158] hover:bg-[#f4ebf4] border border-[#edd6ed]/60'
                      }`}
                    >
                      {cls}
                    </button>
                  ))}
                </div>
              </div>

              {/* Primary & Secondary Grades */}
              <div>
                <span className="text-[10px] font-extrabold text-[#8c4e8b] uppercase tracking-wider px-1 block mb-1.5">
                  Classes 1 to 12
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-1.5">
                  {ALL_CLASSES.filter(c => !['Nursery', 'LKG', 'UKG'].includes(c)).map((cls) => (
                    <button
                      key={cls}
                      onClick={() => setSelectedClass(cls)}
                      className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer text-center ${
                        selectedClass === cls
                          ? 'bg-[#d9775b] text-white shadow-sm'
                          : 'bg-[#faf5fa] text-[#5c3158] hover:bg-[#f4ebf4] border border-[#edd6ed]/60'
                      }`}
                    >
                      {cls}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Selected Olympiad Summary Card */}
            <div className="bg-[#faf5fa] rounded-2xl p-5 border border-[#edd6ed] space-y-4">
              <div className="flex items-center gap-2 text-[#6d3a68]">
                <Layers className="w-4 h-4 text-[#d9775b]" />
                <h4 className="text-xs font-black uppercase tracking-wider">Quick Specs</h4>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-[#edd6ed]">
                  <span className="text-slate-500">Discipline</span>
                  <span className="font-bold text-[#4e2a4a] text-right">{currentOlympiad.name}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#edd6ed]">
                  <span className="text-slate-500">Selected Grade</span>
                  <span className="font-extrabold text-[#d9775b]">{selectedClass}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#edd6ed]">
                  <span className="text-slate-500">Curriculum Modules</span>
                  <span className="font-bold text-[#4e2a4a]">{syllabusList.length} Units</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#edd6ed]">
                  <span className="text-slate-500">Total Practice Qs</span>
                  <span className="font-bold text-[#4e2a4a]">{totalQuestions} Questions</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#edd6ed]">
                  <span className="text-slate-500">Duration</span>
                  <span className="font-bold text-[#4e2a4a]">{currentOlympiad.durationMinutes} Mins</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Competition</span>
                  <span className="font-bold text-[#d9775b]">{currentOlympiad.levels} Tier Merit</span>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  onClick={() => onNavigatePublic('olympiad-detail', normalizedCategory, selectedClass)}
                  className="w-full py-2.5 bg-[#faf5fa] hover:bg-[#f4ebf4] text-[#6d3a68] border border-[#6d3a68]/40 rounded-xl text-xs font-extrabold transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <GraduationCap className="w-3.5 h-3.5 text-[#d9775b]" />
                  <span>Full Class Details &amp; Dates</span>
                </button>
                <button
                  onClick={onOpenRegister}
                  className="w-full py-2.5 bg-[#6d3a68] text-white rounded-xl text-xs font-extrabold hover:bg-[#5c3158] transition-colors shadow-sm cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#e7b84b]" />
                  <span>Register for {currentOlympiad.shortName}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right: Syllabus Topics Breakdown */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#edd6ed] shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#f4ebf4]">
                <div>
                  <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-md bg-[#faf5fa] border border-[#edd6ed] text-[#d9775b] text-[11px] font-extrabold uppercase tracking-wider">
                    <span>{selectedClass} Curriculum</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-[#4e2a4a] mt-2">
                    {currentOlympiad.name}
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    {subjectMeta.tagline || currentOlympiad.tagline}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                  <button
                    onClick={() => onNavigatePublic('sample-papers')}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#faf5fa] hover:bg-[#f4ebf4] text-[#6d3a68] border border-[#edd6ed] rounded-xl text-xs font-bold cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-[#d9775b]" />
                    <span>Download PDF</span>
                  </button>
                  <button
                    onClick={() => onNavigatePublic('practice-hub')}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#d9775b] hover:bg-[#c85e42] text-white rounded-xl text-xs font-bold shadow-sm cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#e7b84b]" />
                    <span>Practice Topics</span>
                  </button>
                </div>
              </div>

              {/* Topic Modules List */}
              <div className="mt-6 space-y-4">
                {syllabusList.map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-[#faf5fa] rounded-2xl p-5 border border-[#edd6ed] hover:border-[#8c4e8b]/50 transition-all hover:shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-2.5">
                          <span className="w-6 h-6 rounded-lg bg-[#6d3a68] text-white text-xs font-black flex items-center justify-center shrink-0">
                            {idx + 1}
                          </span>
                          <h3 className="text-sm font-black text-[#4e2a4a]">
                            {item.topic}
                          </h3>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed pl-8.5">
                          {item.description}
                        </p>
                      </div>
                      <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#e7b84b]/20 text-[#6d3a68] whitespace-nowrap shrink-0 border border-[#e7b84b]/40">
                        {item.questionsCount || item.questions || 15} Practice Qs
                      </span>
                    </div>

                    {(item.learningOutcomes || item.learningObjective) && (
                      <div className="mt-3.5 pt-3 border-t border-[#edd6ed]/60 pl-8.5 flex items-start sm:items-center gap-2 text-xs text-[#d9775b]">
                        <CheckCircle className="w-3.5 h-3.5 shrink-0 mt-0.5 sm:mt-0 text-[#d9775b]" />
                        <span className="font-bold text-[#4e2a4a] shrink-0">Learning Objective:</span>
                        <span className="text-slate-600 font-medium">
                          {item.learningOutcomes || item.learningObjective}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Exam Sections Blueprint */}
            {currentOlympiad.pattern && (
              <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#edd6ed] shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-black text-[#4e2a4a] uppercase tracking-wider flex items-center gap-2">
                    <Layers className="w-4 h-4 text-[#d9775b]" />
                    <span>Assessment Structure &amp; Marks Blueprint</span>
                  </h3>
                  <span className="text-xs font-bold text-[#6d3a68] bg-[#faf5fa] px-2.5 py-1 rounded-lg border border-[#edd6ed]">
                    {currentOlympiad.totalMarks} Total Marks
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {currentOlympiad.pattern.sections.map((sec, sIdx) => (
                    <div key={sIdx} className="bg-[#fff9f2] p-4 rounded-xl border border-[#edd6ed]">
                      <p className="text-xs font-black text-[#6d3a68]">{sec.name}</p>
                      <p className="text-[11px] text-slate-500 mt-1 min-h-[32px]">{sec.desc}</p>
                      <div className="mt-3 pt-2 border-t border-[#edd6ed] flex justify-between text-xs font-bold text-[#4e2a4a]">
                        <span>{sec.questions} Questions</span>
                        <span className="text-[#d9775b]">{sec.marksPerQ} Mark each</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

