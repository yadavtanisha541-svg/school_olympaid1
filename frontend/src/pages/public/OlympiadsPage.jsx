import React, { useState } from 'react';
import {
  Calculator,
  Atom,
  BookOpen,
  Brain,
  Cpu,
  Zap,
  Sparkles,
  Globe,
  Palette,
  Trophy,
  ArrowRight,
  Check,
  Calendar,
  Layers,
  FileSpreadsheet
} from 'lucide-react';
import { OLYMPIAD_CATEGORIES } from '../../data/olympiadHubData';
import { OlympiadCard } from '../../components/public/OlympiadCard';

export const OlympiadsPage = ({ onNavigatePublic, onOpenRegister }) => {
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedClass, setSelectedClass] = useState('all');

  const getIcon = (name) => {
    switch (name) {
      case 'Calculator': return Calculator;
      case 'Atom': return Atom;
      case 'BookOpen': return BookOpen;
      case 'Brain': return Brain;
      case 'Cpu': return Cpu;
      case 'Zap': return Zap;
      case 'Sparkles': return Sparkles;
      case 'Globe': return Globe;
      case 'Palette': return Palette;
      default: return Trophy;
    }
  };

  const filteredList = OLYMPIAD_CATEGORIES.filter((cat) => {
    const matchSubject = selectedSubject === 'all' || cat.id === selectedSubject;
    const matchClass = selectedClass === 'all' || cat.classesList.includes(`Class ${selectedClass}`);
    return matchSubject && matchClass;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 font-sans text-[#4e2a4a]">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#6d3a68] via-[#8c4e8b] to-[#d9775b] rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
        <div className="max-w-2xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#e7b84b]/20 text-[#e7b84b] border border-[#e7b84b]/40 text-xs font-bold uppercase tracking-wider">
            <span>Official 2026 Examination Catalog</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
            Discover National &amp; Global Olympiad Disciplines
          </h1>
          <p className="text-xs sm:text-sm text-[#deb8de] leading-relaxed">
            Choose from 9 rigorous competitive disciplines across STEM, linguistics, and creative arts designed to inspire young thinkers from Nursery to Class 12.
          </p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-5 rounded-2xl border border-[#edd6ed] shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider shrink-0">Subject:</span>
            <button
              type="button"
              onClick={() => setSelectedSubject('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                selectedSubject === 'all'
                  ? 'bg-[#6d3a68] text-white shadow-xs'
                  : 'bg-[#faf5fa] text-[#5c3158] hover:bg-[#edd6ed]'
              }`}
            >
              All Disciplines ({OLYMPIAD_CATEGORIES.length})
            </button>
            {OLYMPIAD_CATEGORIES.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setSelectedSubject(c.id)}
                className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer shrink-0 ${
                  selectedSubject === c.id
                    ? 'bg-[#6d3a68] text-white shadow-xs'
                    : 'bg-[#faf5fa] text-[#5c3158] hover:bg-[#edd6ed]'
                }`}
              >
                {c.shortName}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Eligible Class:</span>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="px-3 py-1.5 bg-[#faf5fa] border border-[#edd6ed] rounded-md text-xs font-bold text-[#4e2a4a] focus:outline-none focus:ring-2 focus:ring-[#6d3a68]"
            >
              <option value="all">All Classes (1-12)</option>
              {Array.from({ length: 12 }, (_, i) => i + 1).map((num) => (
                <option key={num} value={num}>Class {num}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Olympiad Directory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        {filteredList.map((cat) => (
          <OlympiadCard
            key={cat.id}
            cat={cat}
            onNavigatePublic={onNavigatePublic}
            onOpenRegister={onOpenRegister}
          />
        ))}
      </div>
    </div>
  );
};
