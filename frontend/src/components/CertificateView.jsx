import React from 'react';
import { Award, CheckCircle, Download, Printer, ShieldCheck, ExternalLink } from 'lucide-react';
import { Button } from './Button';

export const CertificateView = ({ certificate, onClose = null }) => {
  if (!certificate) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-4">
      {/* Top Action Toolbar */}
      <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-200 print:hidden">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
          <span className="text-xs font-bold text-slate-800 font-mono">
            {certificate.certificate_number}
          </span>
          <span className="text-[11px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
            Verified Valid
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" icon={Printer} onClick={handlePrint}>
            Print / Save as PDF
          </Button>
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose}>
              Close
            </Button>
          )}
        </div>
      </div>

      {/* Printable Certificate Canvas */}
      <div className="relative bg-gradient-to-b from-amber-50/40 via-white to-amber-50/20 border-8 border-double border-amber-600/60 rounded-2xl p-8 sm:p-12 shadow-xl text-center overflow-hidden">
        {/* Decorative corner motifs */}
        <div className="absolute top-2 left-2 w-12 h-12 border-t-2 border-l-2 border-amber-700/80 rounded-tl-lg" />
        <div className="absolute top-2 right-2 w-12 h-12 border-t-2 border-r-2 border-amber-700/80 rounded-tr-lg" />
        <div className="absolute bottom-2 left-2 w-12 h-12 border-b-2 border-l-2 border-amber-700/80 rounded-bl-lg" />
        <div className="absolute bottom-2 right-2 w-12 h-12 border-b-2 border-r-2 border-amber-700/80 rounded-br-lg" />

        {/* Watermark Logo */}
        <div className="absolute inset-0 flex items-center justify-center opacity-4 pointer-events-none select-none">
          <span className="text-[180px] font-black tracking-widest text-slate-900">Ω</span>
        </div>

        {/* Certificate Header */}
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-10 h-10 rounded-xl bg-amber-600 flex items-center justify-center text-white font-black text-xl shadow-md">
            Ω
          </div>
          <span className="text-2xl font-black tracking-tight text-slate-900">
            Olympiad<span className="text-amber-600">Hub</span>
          </span>
        </div>

        <p className="text-xs uppercase tracking-[0.3em] font-extrabold text-amber-800/90 mb-6">
          National Academic Assessment & Olympiad Council
        </p>

        <h1 className="text-3xl sm:text-4xl font-serif font-black text-slate-900 uppercase tracking-wide mb-2">
          Certificate of Excellence
        </h1>
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-8">
          This is to certify that
        </p>

        {/* Student Name */}
        <div className="inline-block border-b-2 border-amber-600/80 px-8 pb-2 mb-6 max-w-xl">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight text-brand-700">
            {certificate.student_name}
          </h2>
        </div>

        <p className="text-sm text-slate-600 max-w-xl mx-auto leading-relaxed mb-6">
          has successfully qualified and demonstrated meritorious academic performance in the national competitive examination:
        </p>

        {/* Exam Title */}
        <div className="bg-amber-50/80 border border-amber-200/80 rounded-xl py-3 px-6 inline-block mb-8 max-w-lg shadow-2xs">
          <h3 className="text-base sm:text-lg font-bold text-slate-900">
            {certificate.exam_name}
          </h3>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-3 gap-4 max-w-md mx-auto mb-10 text-center">
          <div className="p-3 bg-white border border-slate-200/80 rounded-xl shadow-2xs">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Score Obtained</span>
            <span className="text-lg font-black text-slate-900">{parseFloat(certificate.score).toFixed(1)}</span>
          </div>
          <div className="p-3 bg-white border border-slate-200/80 rounded-xl shadow-2xs">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Percentage</span>
            <span className="text-lg font-black text-emerald-600">{parseFloat(certificate.percentage).toFixed(1)}%</span>
          </div>
          <div className="p-3 bg-white border border-slate-200/80 rounded-xl shadow-2xs">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Olympiad Rank</span>
            <span className="text-lg font-black text-amber-600">
              {certificate.rank_exam ? `#${certificate.rank_exam}` : 'Merit'}
            </span>
          </div>
        </div>

        {/* Footer: Signatures & Verification */}
        <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-6 text-left">
          {/* Issue Date & Certificate ID */}
          <div>
            <p className="text-[11px] text-slate-500">
              <span className="font-semibold text-slate-700">Certificate ID:</span>{' '}
              <span className="font-mono font-bold text-slate-900">{certificate.certificate_number}</span>
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              <span className="font-semibold text-slate-700">Date of Issue:</span>{' '}
              <span className="font-bold text-slate-900">{certificate.issue_date}</span>
            </p>
            <p className="text-[10px] text-slate-400 mt-1 font-mono">
              Hash: {certificate.verification_hash ? certificate.verification_hash.substring(0, 24) + '...' : 'SECURE_HASH'}
            </p>
          </div>

          {/* Golden Seal */}
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 rounded-full border-2 border-dashed border-amber-600 bg-amber-50 flex flex-col items-center justify-center text-amber-800 shadow-inner">
              <Award className="w-7 h-7 text-amber-600" />
              <span className="text-[8px] font-black uppercase tracking-tighter">OFFICIAL SEAL</span>
            </div>
            <div className="text-center sm:text-right">
              <div className="font-serif italic font-bold text-slate-800 text-sm border-b border-slate-300 pb-1 px-4">
                Dr. A. K. Banerjee
              </div>
              <p className="text-[10px] font-bold uppercase text-slate-500 mt-1">Director of Examinations</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
