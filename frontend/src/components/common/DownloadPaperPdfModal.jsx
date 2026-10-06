import React, { useState } from 'react';
import { Download, X, FileText, Check } from 'lucide-react';

export const generateAndPrintPaperPdf = (paper, includeAnswers = true) => {
  if (!paper) return;
  const subCode = paper.subject_code || paper.subject || 'IMO';
  const qList = Array.isArray(paper.questions) && paper.questions.length > 0
    ? paper.questions
    : [
        {
          q: 'Why do electric wires have plastic or rubber covering on their outer surface?',
          options: [
            'Plastic is an insulator of electricity and prevents electric shock',
            'Plastic makes the wire heavier',
            'Plastic conducts electricity faster',
            'Plastic reduces copper cost'
          ],
          correct: 0,
          marks: 1,
          explanation: 'Rubber and plastic are bad conductors / insulators of electricity.'
        },
        {
          q: 'Which of the following is a prime number between 20 and 30?',
          options: ['21', '23', '25', '27'],
          correct: 1,
          marks: 1,
          explanation: '23 has only two factors: 1 and 23 itself.'
        }
      ];

  const totalMarks = paper.total_marks || qList.reduce((acc, q) => acc + (parseInt(q.marks) || 1), 0);

  const htmlContent = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8"/>
    <title>${paper.title || 'Olympiad Exam Paper'} - Official PDF</title>
    <style>
      @page { size: A4; margin: 12mm 12mm; }
      body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #0f172a; line-height: 1.45; padding: 20px; margin: 0; background: #fff; }
      .header { border-bottom: 2.5px solid #859900; padding-bottom: 12px; margin-bottom: 14px; display: flex; justify-content: space-between; align-items: flex-start; }
      .brand-title { font-size: 18px; font-weight: 900; color: #859900; text-transform: uppercase; letter-spacing: 0.5px; }
      .paper-title { font-size: 16px; font-weight: 800; color: #1e293b; margin-top: 3px; }
      .meta-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; font-size: 11px; margin: 10px 0 14px; background: #f8fafc; padding: 8px 12px; border-radius: 8px; border: 1px solid #e2e8f0; font-weight: 700; color: #334155; }
      .student-box { border: 1px dashed #94a3b8; border-radius: 8px; padding: 8px 12px; margin-bottom: 14px; display: grid; grid-template-columns: 2fr 1.2fr 1.5fr; gap: 10px; font-size: 11px; }
      .student-box div { border-bottom: 1px solid #cbd5e1; padding-bottom: 3px; }
      .instructions { font-size: 11px; color: #475569; margin-bottom: 16px; background: #f0fdf4; padding: 8px 12px; border-left: 3.5px solid #859900; border-radius: 0 6px 6px 0; }
      .question-card { margin-bottom: 14px; padding-bottom: 10px; border-bottom: 1px solid #f1f5f9; page-break-inside: avoid; }
      .q-title { font-size: 12.5px; font-weight: 700; margin-bottom: 6px; display: flex; justify-content: space-between; gap: 8px; color: #0f172a; }
      .options-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; font-size: 11.5px; margin-left: 8px; }
      .opt-item { display: flex; align-items: center; gap: 6px; padding: 3px 6px; }
      .opt-circle { width: 12px; height: 12px; border: 1.5px solid #64748b; border-radius: 50%; display: inline-block; }
      .ans-key-section { page-break-before: always; margin-top: 30px; border-top: 2.5px double #859900; padding-top: 15px; }
      .ans-table { width: 100%; border-collapse: collapse; font-size: 11px; margin-top: 10px; }
      .ans-table th, .ans-table td { border: 1px solid #cbd5e1; padding: 6px 8px; text-align: left; }
      .ans-table th { background: #f8fafc; color: #1e293b; font-weight: 800; }
      @media print { body { padding: 0; } .no-print { display: none; } }
    </style>
  </head>
  <body>
    <div class="header">
      <div>
        <div class="brand-title">SkillRise Olympiad &bull; Official Examination Paper</div>
        <div class="paper-title">${paper.title || 'Level-1 Olympiad Paper'}</div>
      </div>
      <div style="text-align:right;font-size:11px;color:#64748b;">
        <div><strong>Code:</strong> ${paper.exam_code || paper.short_code || `PPR-${paper.id || '2026'}`}</div>
        <div><strong>Year:</strong> ${paper.exam_year || '2026'}</div>
      </div>
    </div>
    <div class="meta-grid">
      <div><strong>Class:</strong> ${paper.class_name || paper.class || 'Class 6'}</div>
      <div><strong>Subject:</strong> ${subCode}</div>
      <div><strong>Time Allowed:</strong> ${paper.duration_minutes || 60} Mins</div>
      <div><strong>Maximum Marks:</strong> ${totalMarks} Marks</div>
    </div>
    <div class="student-box">
      <div>Candidate Name: __________________________</div>
      <div>Roll Number: ____________</div>
      <div>School: ____________________</div>
    </div>
    <div class="instructions">
      <strong>Instructions for Candidates:</strong>
      1. This question paper contains ${qList.length} multiple choice questions.
      2. Each question has four choices (A, B, C, D) with exactly one correct answer.
      3. Darken/tick the appropriate bubble corresponding to your chosen answer.
    </div>
    <div class="questions-container">
      ${qList.map((q, idx) => {
        const qText = q.question_text || q.q || q.question || `Question ${idx + 1}`;
        const opts = Array.isArray(q.options) && q.options.length >= 2
          ? q.options
          : [q.option_a || 'Option A', q.option_b || 'Option B', q.option_c || 'Option C', q.option_d || 'Option D'];
        return `
          <div class="question-card">
            <div class="q-title">
              <span><strong>Q${idx + 1}.</strong> ${qText}</span>
              <span style="font-size:10.5px;color:#64748b;white-space:nowrap;">[${q.marks || 1} Mark]</span>
            </div>
            <div class="options-grid">
              ${opts.map((opt, oIdx) => `
                <div class="opt-item">
                  <span class="opt-circle"></span>
                  <span><strong>(${String.fromCharCode(65 + oIdx)})</strong> ${opt}</span>
                </div>
              `).join('')}
            </div>
          </div>
        `;
      }).join('')}
    </div>
    ${includeAnswers ? `
      <div class="ans-key-section">
        <h2 style="font-size:15px;font-weight:800;color:#0f172a;margin-bottom:4px;">Official Master Answer Key &amp; Explanations</h2>
        <p style="font-size:11px;color:#64748b;margin-bottom:10px;">Reference Solutions for ${paper.title || 'Exam Paper'}</p>
        <table class="ans-table">
          <thead><tr>
            <th style="width:35px;text-align:center;">#</th>
            <th style="width:70px;text-align:center;">Correct</th>
            <th style="width:180px;">Option Text</th>
            <th>Step-by-Step Explanation</th>
            <th style="width:45px;text-align:center;">Marks</th>
          </tr></thead>
          <tbody>
            ${qList.map((q, idx) => {
              let correctIdx = 0;
              if (typeof q.correct === 'number') correctIdx = q.correct;
              else if (q.correct_option === 'B') correctIdx = 1;
              else if (q.correct_option === 'C') correctIdx = 2;
              else if (q.correct_option === 'D') correctIdx = 3;
              const correctLetter = String.fromCharCode(65 + correctIdx);
              const opts = Array.isArray(q.options) ? q.options : [q.option_a, q.option_b, q.option_c, q.option_d];
              const correctText = opts[correctIdx] || '';
              return `<tr>
                <td style="text-align:center;font-weight:bold;">Q${idx + 1}</td>
                <td style="text-align:center;font-weight:900;color:#059669;font-size:12px;">(${correctLetter})</td>
                <td style="font-weight:600;">${correctText}</td>
                <td style="color:#334155;font-size:10.5px;">${q.explanation || 'Standard conceptual solution.'}</td>
                <td style="text-align:center;font-weight:bold;">${q.marks || 1}</td>
              </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>
    ` : ''}
    <script>
      window.onload = function(){
        setTimeout(function(){ window.print(); }, 250);
      };
    <\/script>
  </body>
</html>`;

  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  } else {
    // Fallback direct blob download
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const safeName = (paper.title || 'Exam_Paper').replace(/[^a-zA-Z0-9_-]/g, '_');
    link.download = `${safeName}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

export const DownloadPaperPdfModal = ({
  isOpen,
  onClose,
  paper,
  onStartExamAfterDownload
}) => {
  const [agreed, setAgreed] = useState(true);
  const [downloaded, setDownloaded] = useState(false);

  if (!isOpen || !paper) return null;

  const handleDownload = () => {
    if (!agreed) {
      alert('Please accept the Terms & Conditions before downloading the PDF.');
      return;
    }
    generateAndPrintPaperPdf(paper, true);
    setDownloaded(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden p-6 sm:p-7 relative space-y-4">
        {/* Top Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Text */}
        <div className="text-left space-y-2">
          <p className="text-xs sm:text-[13px] text-slate-700 leading-relaxed font-normal">
            The content provided in this PDF is intended for personal use only. Unauthorized downloading, duplication, or distribution of this PDF for commercial purposes is strictly prohibited. Reproduction of this material without permission is strictly prohibited. Please respect intellectual property rights and ensure compliance with copyright laws. For any commercial use, explicit written permission must be obtained from SOF Olympiad Trainer.
          </p>

          <div className="pt-2 flex items-center gap-2.5">
            <input
              type="checkbox"
              id="pdfTermsAgreeCheck"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
            />
            <label
              htmlFor="pdfTermsAgreeCheck"
              className="text-xs sm:text-sm font-semibold text-slate-800 cursor-pointer select-none"
            >
              I agree to Terms &amp; Conditions
            </label>
          </div>
        </div>

        {/* Middle Action: Download PDF button */}
        <div className="pt-2 flex justify-center">
          <button
            type="button"
            disabled={!agreed}
            onClick={handleDownload}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#0088cc] hover:bg-[#0077b5] active:scale-95 text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="w-4 h-4" />
            <span>Download PDF</span>
          </button>
        </div>

        {/* Bottom Actions */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          {downloaded && onStartExamAfterDownload && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onStartExamAfterDownload(paper.id);
              }}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white font-bold text-xs cursor-pointer shadow-xs transition-all border border-indigo-600"
            >
              ✓ PDF Ready! Start Test Now →
            </button>
          )}
          <div className="ml-auto">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs cursor-pointer transition-all"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
