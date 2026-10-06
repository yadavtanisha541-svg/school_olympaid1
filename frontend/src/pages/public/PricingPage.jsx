import React from 'react';
import { Check, Sparkles, HelpCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { OLYMPIAD_CATEGORIES } from '../../data/olympiadHubData';

export const PricingPage = ({ onNavigatePublic, onOpenRegister }) => {
  return (
    <div className="bg-[#fff9f2] min-h-screen pb-20">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-[#1e1b4b] via-[#3b0764] to-[#1e3a8a] text-white py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#e7b84b]/20 border border-[#e7b84b]/40 text-[#e7b84b] text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Transparent Academic Pricing</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
            Simple, Affordable Examination &amp; Prep Fees
          </h1>
          <p className="text-sm sm:text-base text-[#deb8de] mt-3 max-w-2xl mx-auto leading-relaxed">
            No hidden costs. Every registration includes official sample papers, free mock tests, proctored live testing, and digital certificates.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
        {/* 3 Main Pricing Tier Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1: Single Olympiad */}
          <div className="bg-white rounded-3xl p-8 border border-[#edd6ed] shadow-md hover:shadow-lg transition-all flex flex-col justify-between">
            <div>
              <span className="text-[11px] font-bold text-[#6d3a68] uppercase tracking-wider bg-[#f4ebf4] px-3 py-1 rounded-full">
                Individual Subject
              </span>
              <h3 className="text-2xl font-black text-[#4e2a4a] mt-4">Single Olympiad</h3>
              <p className="text-xs text-slate-500 mt-1">For students enrolling in any 1 Olympiad discipline.</p>

              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-4xl font-black text-[#4e2a4a]">₹250</span>
                <span className="text-xs text-slate-400">/ exam per student</span>
              </div>

              <div className="mt-6 space-y-3 text-xs text-slate-600 border-t border-[#f4ebf4] pt-6">
                {[
                  '1 Official Olympiad Online Exam',
                  'Choice of 3 Exam Date Slots',
                  '5 Full Length Sample Question Papers',
                  'Live Practice Mock Test Platform',
                  'Detailed Diagnostic Scorecard',
                  'Digital Certificate of Participation / Merit'
                ].map((f, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-[#d9775b] shrink-0" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={onOpenRegister}
              className="mt-8 w-full py-3 bg-[#faf5fa] hover:bg-[#f4ebf4] text-[#6d3a68] border border-[#edd6ed] rounded-xl text-xs font-black transition-colors cursor-pointer"
            >
              Enroll for 1 Exam
            </button>
          </div>

          {/* Card 2: Multi-Olympiad Combo (Featured) */}
          <div className="bg-gradient-to-b from-[#FAF4E0] to-white rounded-3xl p-8 border-2 border-[#e7b84b] shadow-xl flex flex-col justify-between relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-[#2563eb] via-[#7c3aed] to-[#db2777] text-white text-[10px] font-black uppercase tracking-wider rounded-full shadow-md">
              Most Popular Combo (Save 20%)
            </div>

            <div>
              <span className="text-[11px] font-bold text-[#d9775b] uppercase tracking-wider bg-white px-3 py-1 rounded-full border border-[#e7b84b]/40">
                All-Rounder Bundle
              </span>
              <h3 className="text-2xl font-black text-[#4e2a4a] mt-4">Triple Scholar Pack</h3>
              <p className="text-xs text-slate-500 mt-1">Enroll in any 3 Olympiad disciplines of your choice.</p>

              <div className="mt-6 flex items-baseline gap-2">
                <span className="text-4xl font-black text-[#6d3a68]">₹600</span>
                <span className="text-xs text-slate-400 line-through">₹750</span>
                <span className="text-xs font-bold text-[#d9775b]">Save ₹150</span>
              </div>

              <div className="mt-6 space-y-3 text-xs text-slate-700 border-t border-[#edd6ed] pt-6">
                {[
                  'Any 3 Olympiad Exams (Math, Science, Cyber, etc.)',
                  'Flexible Date Selection for all 3 Exams',
                  '15+ Sample & Previous Year Papers',
                  'Unlimited Online Practice Drills',
                  'National Performance Benchmark Comparison',
                  'Medals & Physical Certificates for Qualifiers',
                  'Priority Support & Dedicated Exam Helpdesk'
                ].map((f, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-[#6d3a68] shrink-0" />
                    <span className="font-medium">{f}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={onOpenRegister}
              className="mt-8 w-full py-3.5 bg-gradient-to-r from-[#2563eb] via-[#7c3aed] to-[#db2777] hover:from-[#1d4ed8] hover:via-[#6d28d9] hover:to-[#be123c] text-white rounded-xl text-xs font-black shadow-lg shadow-[#d9775b]/30 transition-all cursor-pointer"
            >
              Enroll for Scholar Combo →
            </button>
          </div>

          {/* Card 3: School Bulk Enrolment */}
          <div className="bg-white rounded-3xl p-8 border border-[#edd6ed] shadow-md hover:shadow-lg transition-all flex flex-col justify-between">
            <div>
              <span className="text-[11px] font-bold text-[#6d3a68] uppercase tracking-wider bg-[#f4ebf4] px-3 py-1 rounded-full">
                Schools &amp; Institutions
              </span>
              <h3 className="text-2xl font-black text-[#4e2a4a] mt-4">Institutional Enrolment</h3>
              <p className="text-xs text-slate-500 mt-1">For schools enrolling 50+ students across classes.</p>

              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-4xl font-black text-[#4e2a4a]">₹180</span>
                <span className="text-xs text-slate-400">/ exam per student (Bulk)</span>
              </div>

              <div className="mt-6 space-y-3 text-xs text-slate-600 border-t border-[#f4ebf4] pt-6">
                {[
                  'Special Subsidized School Rate',
                  'Dedicated School Coordinator Dashboard',
                  'Bulk Excel / CSV Student Onboarding',
                  'School Performance Analytics Report',
                  'Institutional Trophies for Top Participating Schools',
                  'Complimentary Teacher Recognition Certificates'
                ].map((f, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-[#d9775b] shrink-0" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => onNavigatePublic('schools')}
              className="mt-8 w-full py-3 bg-gradient-to-r from-[#2563eb] via-[#7c3aed] to-[#db2777] hover:from-[#1d4ed8] hover:via-[#6d28d9] hover:to-[#be123c] text-white rounded-xl text-xs font-black transition-colors cursor-pointer"
            >
              Register School Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
