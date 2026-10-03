import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { getDynamicFaqsList } from '../../data/keyInfoMasterData';

export const FAQPage = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const [faqs, setFaqs] = useState(() => getDynamicFaqsList());

  useEffect(() => {
    setFaqs(getDynamicFaqsList());
  }, []);

  return (
    <div className="bg-[#fff9f2] min-h-screen pb-24 font-sans text-[#2a1b29]">
      
      {/* Top Header */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-10 pb-6">
        <h1 className="text-2xl sm:text-3xl font-normal text-[#2a1b29] tracking-tight">
          Frequently Asked Questions
        </h1>
      </div>

      {/* Clean FAQ List */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-2.5">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="bg-white border border-[#edd6ed] rounded-sm transition-all overflow-hidden shadow-2xs hover:border-[#6d3a68]/40"
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full text-left px-5 py-3.5 flex items-center justify-between gap-4 cursor-pointer hover:bg-[#faf5fa] transition-colors"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="text-xs sm:text-[13px] font-normal text-[#6d3a68] whitespace-nowrap">
                    {`Q.${idx + 1} >`}
                  </span>
                  <span className="text-xs sm:text-[13px] font-normal text-[#2a1b29] leading-relaxed">
                    {faq.q}
                  </span>
                </div>

                <div className="text-slate-400 shrink-0">
                  {isOpen ? (
                    <ChevronDown className="w-4 h-4 text-[#6d3a68]" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  )}
                </div>
              </button>

              {isOpen && (
                <div className="px-5 pb-5 pt-2 text-xs sm:text-[13px] text-slate-700 leading-relaxed border-t border-[#f4ebf4] bg-[#fffdfa] pl-10">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
};
