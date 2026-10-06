import React, { useState, useEffect } from 'react';
import { OLYMPIAD_CATEGORIES } from '../../data/olympiadHubData';
import { Calendar, Clock, ArrowRight, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';

export const ExamSchedulePage = ({ selectedDisciplineId = 'all', onNavigatePublic, onOpenRegister }) => {
  const [selectedDiscipline, setSelectedDiscipline] = useState(selectedDisciplineId || 'all');
  const [selectedSlotModal, setSelectedSlotModal] = useState(null);

  useEffect(() => {
    if (selectedDisciplineId) {
      setSelectedDiscipline(selectedDisciplineId);
    }
  }, [selectedDisciplineId]);

  const filteredOlympiads = selectedDiscipline === 'all'
    ? OLYMPIAD_CATEGORIES
    : OLYMPIAD_CATEGORIES.filter((c) => {
        if (c.id === selectedDiscipline) return true;
        if (selectedDiscipline === 'vocab' && c.id === 'spell-bee') return true;
        if (selectedDiscipline === 'environment' && c.id === 'environmental') return true;
        if (selectedDiscipline === 'arts' && c.id === 'drawing') return true;
        return false;
      });

  return (
    <div className="bg-[#fff9f2] min-h-screen pb-20">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-[#1e1b4b] via-[#3b0764] to-[#1e3a8a] text-white py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#e7b84b]/20 border border-[#e7b84b]/40 text-[#e7b84b] text-xs font-bold uppercase tracking-wider mb-4">
            <Calendar className="w-3.5 h-3.5" />
            <span>Academic Session 2026-27</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
            Official Olympiad Exam Schedule &amp; Slot Booking
          </h1>
          <p className="text-sm sm:text-base text-[#deb8de] mt-3 max-w-3xl leading-relaxed">
            Choose your convenient online examination dates and time slots for all 9 Olympiad subjects. Both Level 1 (School/Individual) and Level 2 (National Championship) dates are detailed below.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-20 space-y-6">
        {/* Discipline Filter Tabs */}
        <div className="bg-white p-2 rounded-2xl border border-[#edd6ed] shadow-xs flex items-center gap-2 overflow-x-auto custom-scrollbar">
          <button
            type="button"
            onClick={() => setSelectedDiscipline('all')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all whitespace-nowrap cursor-pointer ${
              selectedDiscipline === 'all'
                ? 'bg-gradient-to-r from-[#ec4899] via-[#8b5cf6] to-[#3b82f6] text-white shadow-xs'
                : 'text-slate-600 hover:bg-[#faf5fa] hover:text-[#6d3a68]'
            }`}
          >
            All Disciplines ({OLYMPIAD_CATEGORIES.length})
          </button>
          {OLYMPIAD_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedDiscipline(cat.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                selectedDiscipline === cat.id
                  ? 'bg-gradient-to-r from-[#ec4899] via-[#8b5cf6] to-[#3b82f6] text-white shadow-xs'
                  : 'text-slate-600 hover:bg-[#faf5fa] hover:text-[#6d3a68]'
              }`}
            >
              {cat.shortName || cat.name}
            </button>
          ))}
        </div>

        {/* Schedule Table / Card List */}
        <div className="space-y-6">
          {filteredOlympiads.map((cat) => (
            <div
              key={cat.id}
              className="bg-white rounded-md p-6 sm:p-8 border-2 border-[#edd6ed] shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-[#f4ebf4]">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-sm bg-[#f4ebf4] text-[#6d3a68] text-[10px] font-black uppercase tracking-wider">
                      {cat.code}
                    </span>
                    <span className="text-xs font-bold text-[#d9775b]">
                      {cat.eligibleClasses}
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-[#4e2a4a]">{cat.name}</h3>
                  <p className="text-xs text-slate-500">{cat.tagline}</p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setSelectedSlotModal(cat)}
                    className="px-5 py-2.5 bg-gradient-to-r from-[#ec4899] via-[#8b5cf6] to-[#3b82f6] hover:from-[#db2777] hover:via-[#7c3aed] hover:to-[#2563eb] text-white rounded-md text-xs font-bold transition-all shadow-sm cursor-pointer whitespace-nowrap"
                  >
                    Select Exam Slot
                  </button>
                  <button
                    onClick={onOpenRegister}
                    className="px-5 py-2.5 bg-gradient-to-r from-[#ec4899] via-[#8b5cf6] to-[#3b82f6] hover:from-[#db2777] hover:via-[#7c3aed] hover:to-[#2563eb] text-white rounded-md text-xs font-extrabold transition-all shadow-md shadow-[#d9775b]/20 cursor-pointer whitespace-nowrap"
                  >
                    Register Student →
                  </button>
                </div>
              </div>

              {/* Exam Date Windows */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                {cat.examDates && cat.examDates.map((date, dIdx) => (
                  <div
                    key={dIdx}
                    className="bg-[#faf5fa] rounded-md p-4 border border-[#edd6ed] flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                          Slot Option {dIdx + 1}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-sm bg-[#e7b84b]/20 text-[#6d3a68]">
                          Online Live
                        </span>
                      </div>
                      <p className="text-base font-black text-[#4e2a4a] mt-2">{date}</p>
                      <p className="text-xs text-slate-500 mt-1">
                        Timings: 10:00 AM, 02:00 PM, 06:00 PM IST
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-[#edd6ed]/60 flex items-center justify-between text-xs">
                      <span className="text-slate-500">Duration: {cat.durationMinutes}m</span>
                      <button
                        onClick={() => setSelectedSlotModal(cat)}
                        className="font-bold text-[#d9775b] hover:underline cursor-pointer"
                      >
                        Book Slot →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Instructions Note */}
        <div className="mt-8 bg-[#FAF4E0] border border-[#e7b84b]/40 rounded-md p-6 flex items-start gap-4">
          <AlertCircle className="w-6 h-6 text-[#d9775b] shrink-0 mt-0.5" />
          <div className="space-y-1.5 text-xs text-[#5c3158]">
            <h4 className="text-sm font-black text-[#4e2a4a]">Flexible Slot Booking Policy</h4>
            <p className="text-slate-600 leading-relaxed">
              Students can select any 1 slot out of the 3 available dates for their registered Olympiad. Slot changes are permitted up to 48 hours before the scheduled exam from the Student Dashboard.
            </p>
          </div>
        </div>
      </div>

      {/* Slot Booking Modal */}
      {selectedSlotModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-md p-6 sm:p-8 max-w-md w-full border border-[#edd6ed] shadow-2xl space-y-5">
            <div className="text-center">
              <div className="w-12 h-12 rounded-md bg-[#f4ebf4] flex items-center justify-center mx-auto text-[#6d3a68] mb-2">
                <Calendar className="w-6 h-6 text-[#d9775b]" />
              </div>
              <h3 className="text-lg font-black text-[#4e2a4a]">Reserve Exam Slot</h3>
              <p className="text-xs text-slate-500 mt-0.5">{selectedSlotModal.name}</p>
            </div>

            <div className="space-y-2">
              <label className="block text-[11px] font-bold text-[#6d3a68] uppercase">Choose Date</label>
              <div className="space-y-2">
                {selectedSlotModal.examDates.map((date, idx) => (
                  <label
                    key={idx}
                    className="flex items-center gap-3 p-3 rounded-xl border border-[#edd6ed] hover:bg-[#faf5fa] cursor-pointer text-xs font-semibold text-[#4e2a4a]"
                  >
                    <input type="radio" name="slot_date" defaultChecked={idx === 0} className="text-[#6d3a68]" />
                    <span>{date} (Slot {idx + 1})</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-[11px] font-bold text-[#6d3a68] uppercase">Choose Preferred Time</label>
              <select className="w-full px-3.5 py-2.5 rounded-xl border border-[#edd6ed] bg-[#faf5fa] text-xs font-bold text-[#4e2a4a]">
                <option>Morning Slot (10:00 AM - 11:00 AM IST)</option>
                <option>Afternoon Slot (02:00 PM - 03:00 PM IST)</option>
                <option>Evening Slot (06:00 PM - 07:00 PM IST)</option>
              </select>
            </div>

            <div className="pt-2 flex gap-2">
              <button
                onClick={() => setSelectedSlotModal(null)}
                className="flex-1 py-2.5 bg-[#faf5fa] hover:bg-[#f4ebf4] text-slate-700 border border-[#edd6ed] rounded-xl text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setSelectedSlotModal(null);
                  onOpenRegister();
                }}
                className="flex-1 py-2.5 bg-gradient-to-r from-[#ec4899] via-[#8b5cf6] to-[#3b82f6] hover:from-[#db2777] hover:via-[#7c3aed] hover:to-[#2563eb] text-white rounded-xl text-xs font-bold shadow-sm cursor-pointer"
              >
                Confirm &amp; Register
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
