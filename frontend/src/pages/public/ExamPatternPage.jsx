import React, { useState } from 'react';
import { OLYMPIAD_CATEGORIES } from '../../data/olympiadHubData';
import { FileSpreadsheet, Clock, HelpCircle, Award, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';

export const ExamPatternPage = ({ onNavigatePublic, onOpenRegister }) => {
  const [selectedCatId, setSelectedCatId] = useState(OLYMPIAD_CATEGORIES[0].id);
  const activeOlympiad = OLYMPIAD_CATEGORIES.find((c) => c.id === selectedCatId) || OLYMPIAD_CATEGORIES[0];

  return (
    <div className="bg-[#fff9f2] min-h-screen pb-20">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-[#1e1b4b] via-[#3b0764] to-[#1e3a8a] text-white py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#e7b84b]/20 border border-[#e7b84b]/40 text-[#e7b84b] text-xs font-bold uppercase tracking-wider mb-4">
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Official Examination Blueprint</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
            Exam Pattern, Marking Scheme &amp; Section Weightage
          </h1>
          <p className="text-sm sm:text-base text-[#deb8de] mt-3 max-w-3xl leading-relaxed">
            Understand the question types, difficulty levels, duration, and scoring rules for all SkillRise Olympiad exams.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
        {/* Category Filter Pills */}
        <div className="bg-white rounded-2xl p-3 border border-[#edd6ed] shadow-md flex items-center gap-2 overflow-x-auto">
          {OLYMPIAD_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCatId(cat.id)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCatId === cat.id
                  ? 'bg-gradient-to-r from-[#2563eb] via-[#7c3aed] to-[#db2777] text-white shadow-md shadow-[#6d3a68]/20'
                  : 'bg-[#faf5fa] text-[#5c3158] hover:bg-[#f4ebf4]'
              }`}
            >
              {cat.shortName}
            </button>
          ))}
        </div>

        {/* Pattern Overview Grid (Compact & Adjusted) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-6">
          <div className="bg-white rounded-xl p-3.5 sm:p-4 border border-[#edd6ed] shadow-xs hover:shadow-sm hover:border-[#8c4e8b]/40 transition-all flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#faf5fa] border border-[#edd6ed] flex items-center justify-center text-[#6d3a68] shrink-0">
              <Clock className="w-5 h-5 text-[#d9775b]" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider truncate">Exam Duration</p>
              <h3 className="text-sm sm:text-base font-black text-[#4e2a4a] truncate">{activeOlympiad.durationMinutes} Minutes</h3>
            </div>
          </div>

          <div className="bg-white rounded-xl p-3.5 sm:p-4 border border-[#edd6ed] shadow-xs hover:shadow-sm hover:border-[#8c4e8b]/40 transition-all flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#faf5fa] border border-[#edd6ed] flex items-center justify-center text-[#6d3a68] shrink-0">
              <HelpCircle className="w-5 h-5 text-[#e7b84b]" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider truncate">Total Questions</p>
              <h3 className="text-sm sm:text-base font-black text-[#4e2a4a] truncate">{activeOlympiad.totalQuestions} MCQs</h3>
            </div>
          </div>

          <div className="bg-white rounded-xl p-3.5 sm:p-4 border border-[#edd6ed] shadow-xs hover:shadow-sm hover:border-[#8c4e8b]/40 transition-all flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#faf5fa] border border-[#edd6ed] flex items-center justify-center text-[#6d3a68] shrink-0">
              <Award className="w-5 h-5 text-[#6d3a68]" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider truncate">Maximum Marks</p>
              <h3 className="text-sm sm:text-base font-black text-[#4e2a4a] truncate">{activeOlympiad.totalMarks} Marks</h3>
            </div>
          </div>

          <div className="bg-white rounded-xl p-3.5 sm:p-4 border border-[#edd6ed] shadow-xs hover:shadow-sm hover:border-[#8c4e8b]/40 transition-all flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#faf5fa] border border-[#edd6ed] flex items-center justify-center text-[#6d3a68] shrink-0">
              <CheckCircle2 className="w-5 h-5 text-[#d9775b]" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider truncate">Competition Format</p>
              <h3 className="text-sm sm:text-base font-black text-[#4e2a4a] truncate">{activeOlympiad.levels} Levels (Online)</h3>
            </div>
          </div>
        </div>

        {/* Detailed Sections Table */}
        <div className="bg-white rounded-2xl p-8 border border-[#edd6ed] shadow-sm mt-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#f4ebf4]">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-[#4e2a4a]">
                {activeOlympiad.name} - Detailed Sectional Scheme
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Standardized breakdown across Junior (Classes 1-4), Middle (Classes 5-8), and Senior (Classes 9-12) cohorts.
              </p>
            </div>
            <button
              onClick={onOpenRegister}
              className="px-5 py-2.5 bg-gradient-to-r from-[#2563eb] via-[#7c3aed] to-[#db2777] hover:from-[#1d4ed8] hover:via-[#6d28d9] hover:to-[#be123c] text-white rounded-xl text-xs font-bold shadow-sm cursor-pointer whitespace-nowrap self-start sm:self-auto"
            >
              Enroll for This Exam →
            </button>
          </div>

          <div className="overflow-x-auto mt-6">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#faf5fa] text-[#6d3a68] border-b border-[#edd6ed] uppercase text-[11px] font-black tracking-wider">
                  <th className="py-3.5 px-4 rounded-l-xl">Section Name</th>
                  <th className="py-3.5 px-4">Focus Area</th>
                  <th className="py-3.5 px-4 text-center">No. of Questions</th>
                  <th className="py-3.5 px-4 text-center">Marks per Question</th>
                  <th className="py-3.5 px-4 text-center">Section Total</th>
                  <th className="py-3.5 px-4 text-center rounded-r-xl">Negative Marking</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f4ebf4]">
                {activeOlympiad.pattern && activeOlympiad.pattern.sections.map((sec, idx) => (
                  <tr key={idx} className="hover:bg-[#fff9f2] transition-colors">
                    <td className="py-4 px-4 font-bold text-[#4e2a4a]">{sec.name}</td>
                    <td className="py-4 px-4 text-slate-600">{sec.desc}</td>
                    <td className="py-4 px-4 text-center font-bold text-[#6d3a68]">{sec.questions}</td>
                    <td className="py-4 px-4 text-center font-bold text-[#d9775b]">{sec.marksPerQ}</td>
                    <td className="py-4 px-4 text-center font-black text-[#4e2a4a]">{sec.questions * sec.marksPerQ} Marks</td>
                    <td className="py-4 px-4 text-center text-slate-500">
                      {sec.negative > 0 ? `-${sec.negative} per wrong` : 'None'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Guidelines & Proctoring Note */}
          <div className="mt-8 bg-[#FAF4E0] border border-[#e7b84b]/40 rounded-2xl p-5 flex items-start gap-3.5">
            <AlertCircle className="w-5 h-5 text-[#d9775b] shrink-0 mt-0.5" />
            <div className="space-y-1 text-xs text-[#5c3158]">
              <p className="font-bold">Automated Proctoring &amp; Live Timer Environment</p>
              <p className="text-slate-600 leading-relaxed">
                All exams feature browser fullscreen lock, periodic AI photo verification, tab-switch monitoring, and question shuffle. Practice online tests allow mock simulations with identical user interfaces.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
