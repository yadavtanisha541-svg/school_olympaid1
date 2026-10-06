import React from 'react';
import {
  Info,
  FileText,
  FileSpreadsheet,
  Coins,
  Trophy,
  Search,
  BookOpen,
  Calendar,
  ArrowRight
} from 'lucide-react';
import { SubjectBannerIllustration } from './SubjectBannerIllustration';

/**
 * OlympiadCard renders a subject Olympiad card matching the requested
 * square box layout with top subject illustration banner, colored subject title strip,
 * 2-column quick links grid with icons, and a centered "Apply now" CTA button.
 */
export const OlympiadCard = ({
  cat,
  onNavigatePublic,
  onOpenRegister
}) => {
  const shortCode = cat.code ? cat.code.split('-')[0] : 'EXAM';

  return (
    <div className="bg-white rounded-md border border-[#edd6ed] hover:border-[#8c4e8b]/60 shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col justify-between overflow-hidden group bg-gradient-to-b from-white to-[#fffcf9]">
      {/* 1. TOP SUBJECT ILLUSTRATION BANNER */}
      <div className="relative">
        <SubjectBannerIllustration subjectId={cat.id} className="w-full h-28 sm:h-32" />
      </div>

      <div className="p-3.5 sm:p-4 flex flex-col flex-1 justify-between space-y-3.5">
        {/* 2. COLORED TITLE STRIP */}
        <div className="bg-gradient-to-r from-[#122459] via-[#241e6e] to-[#5b3da8] text-white text-center py-1.5 px-2 rounded-sm font-black text-[11px] sm:text-xs uppercase tracking-tight shadow-xs">
          {cat.name} ({shortCode})
        </div>

        {/* 3. TWO-COLUMN QUICK SPECIFICATION & LINKS (8 ITEMS) */}
        <div className="grid grid-cols-2 gap-x-3 gap-y-2 text-xs py-1">
          {/* Column 1 - Left */}
          <button
            type="button"
            onClick={() => onNavigatePublic('olympiad-detail', cat.id)}
            className="flex items-center gap-1.5 text-left text-[#4e2a4a] hover:text-[#d9775b] transition-colors cursor-pointer group/link py-0.5"
          >
            <span className="w-4 h-4 rounded-sm bg-[#faf5fa] text-[#6d3a68] flex items-center justify-center text-[10px] font-bold shrink-0 border border-[#edd6ed]">
              ℹ
            </span>
            <span className="text-[11px] font-bold group-hover/link:underline truncate">About</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigatePublic('sample-papers')}
            className="flex items-center gap-1.5 text-left text-[#4e2a4a] hover:text-[#d9775b] transition-colors cursor-pointer group/link py-0.5"
          >
            <span className="w-4 h-4 rounded-sm bg-[#faf5fa] text-[#d9775b] flex items-center justify-center text-[10px] font-bold shrink-0 border border-[#edd6ed]">
              📄
            </span>
            <span className="text-[11px] font-bold group-hover/link:underline truncate">Sample Papers</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigatePublic('syllabus')}
            className="flex items-center gap-1.5 text-left text-[#4e2a4a] hover:text-[#d9775b] transition-colors cursor-pointer group/link py-0.5"
          >
            <span className="w-4 h-4 rounded-sm bg-[#faf5fa] text-[#6d3a68] flex items-center justify-center text-[10px] font-bold shrink-0 border border-[#edd6ed]">
              📝
            </span>
            <span className="text-[11px] font-bold group-hover/link:underline truncate">Syllabus</span>
          </button>

          <button
            type="button"
            onClick={onOpenRegister}
            className="flex items-center gap-1.5 text-left text-[#4e2a4a] hover:text-[#d9775b] transition-colors cursor-pointer group/link py-0.5"
          >
            <span className="w-4 h-4 rounded-sm bg-[#faf4e0] text-[#906223] flex items-center justify-center text-[10px] font-bold shrink-0 border border-[#f5e7bf]">
              ₹
            </span>
            <span className="text-[11px] font-bold group-hover/link:underline truncate">Fee</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigatePublic('rankings')}
            className="flex items-center gap-1.5 text-left text-[#4e2a4a] hover:text-[#d9775b] transition-colors cursor-pointer group/link py-0.5"
          >
            <span className="w-4 h-4 rounded-sm bg-[#faf4e0] text-[#e7b84b] flex items-center justify-center text-[10px] font-bold shrink-0 border border-[#f5e7bf]">
              🥇
            </span>
            <span className="text-[11px] font-bold group-hover/link:underline truncate">Rankers</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigatePublic('exam-pattern')}
            className="flex items-center gap-1.5 text-left text-[#4e2a4a] hover:text-[#d9775b] transition-colors cursor-pointer group/link py-0.5"
          >
            <span className="w-4 h-4 rounded-sm bg-[#faf5fa] text-[#6d3a68] flex items-center justify-center text-[10px] font-bold shrink-0 border border-[#edd6ed]">
              🔍
            </span>
            <span className="text-[11px] font-bold group-hover/link:underline truncate">Pattern / Test</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigatePublic('workbooks')}
            className="flex items-center gap-1.5 text-left text-[#4e2a4a] hover:text-[#d9775b] transition-colors cursor-pointer group/link py-0.5"
          >
            <span className="w-4 h-4 rounded-sm bg-[#faf5fa] text-[#8c4e8b] flex items-center justify-center text-[10px] font-bold shrink-0 border border-[#edd6ed]">
              📘
            </span>
            <span className="text-[11px] font-bold group-hover/link:underline truncate">Workbook</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigatePublic('schedule')}
            className="flex items-center gap-1.5 text-left text-[#4e2a4a] hover:text-[#d9775b] transition-colors cursor-pointer group/link py-0.5"
          >
            <span className="w-4 h-4 rounded-sm bg-[#fdf6f4] text-[#d9775b] flex items-center justify-center text-[10px] font-bold shrink-0 border border-[#f7d7cc]">
              📅
            </span>
            <span className="text-[11px] font-bold group-hover/link:underline truncate">Exam Date</span>
          </button>
        </div>

        {/* 4. BOTTOM CENTERED "APPLY NOW" BUTTON */}
        <div className="pt-2 border-t border-[#f4ebf4] flex justify-center">
          <button
            type="button"
            onClick={onOpenRegister}
            className="w-full sm:w-auto min-w-[140px] px-5 py-2 bg-gradient-to-r from-[#2563eb] via-[#7c3aed] to-[#db2777] hover:from-[#1d4ed8] hover:via-[#6d28d9] hover:to-[#be123c] text-white rounded-md text-xs font-black shadow-sm transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
          >
            <span>Apply now</span>
          </button>
        </div>
      </div>
    </div>
  );
};
