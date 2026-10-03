import React from 'react';
import { Award, Globe, ShieldCheck, Users, Sparkles, BookOpen, Target, Heart } from 'lucide-react';
import { TRUST_STATS } from '../../data/olympiadHubData';

export const AboutUsPage = ({ onNavigatePublic, onOpenRegister }) => {
  return (
    <div className="bg-[#fff9f2] min-h-screen pb-20">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-[#4e2a4a] via-[#6d3a68] to-[#8c4e8b] text-white py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#e7b84b]/20 border border-[#e7b84b]/40 text-[#e7b84b] text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Academic Mission &amp; Vision</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
            Empowering Young Minds to Compete and Excel
          </h1>
          <p className="text-sm sm:text-base text-[#deb8de] mt-3 max-w-2xl mx-auto leading-relaxed">
            SkillRise Olympiad is dedicated to identifying and nurturing exceptional talent across Mathematics, Science, Linguistics, AI, Reasoning, and Creative problem-solving.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
        {/* Trust Stats Bar */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#edd6ed] shadow-lg grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {TRUST_STATS.map((stat, idx) => (
            <div key={idx} className="space-y-1">
              <p className="text-3xl sm:text-4xl font-black text-[#6d3a68]">{stat.value}</p>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Mission & Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          <div className="bg-white rounded-3xl p-8 border border-[#edd6ed] shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#faf5fa] flex items-center justify-center text-[#6d3a68] mb-2">
              <Target className="w-6 h-6 text-[#d9775b]" />
            </div>
            <h3 className="text-lg font-black text-[#4e2a4a]">Conceptual Rigor</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              We design our examination blueprints to transcend rote memorization. Questions test underlying principles, application depth, and higher-order deduction.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-[#edd6ed] shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#FAF4E0] flex items-center justify-center text-[#8c4e8b] mb-2">
              <ShieldCheck className="w-6 h-6 text-[#e7b84b]" />
            </div>
            <h3 className="text-lg font-black text-[#4e2a4a]">Uncompromising Integrity</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Our browser-based testing engine employs state-of-the-art proctoring, randomized question stems, and cryptographic certificate verification to ensure fair competition.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-[#edd6ed] shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#faf5fa] flex items-center justify-center text-[#6d3a68] mb-2">
              <Globe className="w-6 h-6 text-[#6d3a68]" />
            </div>
            <h3 className="text-lg font-black text-[#4e2a4a]">Global Inclusivity</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Accessible from any computer or tablet worldwide with affordable fee structures, multilingual practice banks, and special institutional grants for participating schools.
            </p>
          </div>
        </div>

        {/* CTA Card */}
        <div className="mt-12 bg-gradient-to-r from-[#4e2a4a] to-[#6d3a68] rounded-3xl p-8 sm:p-12 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div>
            <h3 className="text-2xl font-black text-white">Join the SkillRise Olympiad Ecosystem</h3>
            <p className="text-xs text-[#deb8de] mt-1 max-w-xl">
              Register individual students or affiliate your school to begin your journey toward national honors and scholarship awards.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={onOpenRegister}
              className="px-6 py-3 bg-[#d9775b] hover:bg-[#c85e42] text-white rounded-xl text-xs font-black shadow-md cursor-pointer whitespace-nowrap"
            >
              Register Student Now →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
