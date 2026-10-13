import React, { useState, useRef } from 'react';
import {
  Upload,
  FileText,
  FileCode,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  X,
  Sparkles,
  HelpCircle,
  ArrowRight,
  RefreshCw,
  Eye,
  Check
} from 'lucide-react';
import { extractTextFromFile, parseQuestionsFromText } from '../../utils/universalDocumentParser';
import { syncManager } from '../../utils/syncManager';

export const UniversalQuestionImportModal = ({
  isOpen,
  onClose,
  title = 'Import Questions (Word / PDF / CSV)',
  subtitle = 'Upload your question paper file or paste text to automatically extract questions.',
  onQuestionsImported,
  targetClassId,
  targetSubjectId
}) => {
  const [activeTab, setActiveTab] = useState('upload'); // 'upload' | 'paste'
  const [file, setFile] = useState(null);
  const [rawText, setRawText] = useState('');
  const [isParsing, setIsParsing] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [parsedQuestions, setParsedQuestions] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleFileSelect = async (e) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    setFile(selected);
    setErrorMsg('');
    setSuccessMsg('');
    setIsParsing(true);

    try {
      const text = await extractTextFromFile(selected);
      setRawText(text);
      const questions = parseQuestionsFromText(text);

      if (questions.length === 0) {
        setErrorMsg('No structured questions could be detected. Please check the file formatting or use the Paste Text option.');
      } else {
        setParsedQuestions(questions);
        setSuccessMsg(`Extracted ${questions.length} questions successfully!`);
      }
    } catch (err) {
      console.error('File parsing error:', err);
      setErrorMsg(err.message || 'Failed to read file. Please verify file format.');
    } finally {
      setIsParsing(false);
    }
  };

  const handleParsePastedText = () => {
    if (!rawText.trim()) {
      setErrorMsg('Please paste some text from your Word or PDF file.');
      return;
    }
    setErrorMsg('');
    setSuccessMsg('');
    setIsParsing(true);

    try {
      const questions = parseQuestionsFromText(rawText);
      if (questions.length === 0) {
        setErrorMsg('No questions detected in the pasted text. Ensure questions have numbers (1., Q1.) and options (A, B, C, D).');
      } else {
        setParsedQuestions(questions);
        setSuccessMsg(`Extracted ${questions.length} questions successfully!`);
      }
    } catch (err) {
      setErrorMsg('Parsing error: ' + err.message);
    } finally {
      setIsParsing(false);
    }
  };

  const handleConfirmImport = async () => {
    if (parsedQuestions.length === 0) {
      setErrorMsg('No questions to import. Please upload a file or paste question text.');
      return;
    }

    setIsImporting(true);
    try {
      // Attach target class/subject if provided
      const formatted = parsedQuestions.map(q => ({
        ...q,
        class_id: targetClassId || q.class_id,
        subject_id: targetSubjectId || q.subject_id
      }));

      // Call parent import handler
      if (onQuestionsImported) {
        await onQuestionsImported(formatted);
      }

      // Sync across Vercel and Localhost
      syncManager.pushToVercel({
        last_imported_questions: Date.now()
      });

      setSuccessMsg(`Successfully imported ${formatted.length} questions!`);
      setTimeout(() => {
        onClose();
        setParsedQuestions([]);
        setFile(null);
        setRawText('');
      }, 1200);
    } catch (err) {
      setErrorMsg('Import error: ' + (err.message || 'Failed to save questions.'));
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300 shrink-0">
              <Upload className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                {title}
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 uppercase tracking-wider">
                  AI Auto-Parser
                </span>
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                {subtitle}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="px-6 pt-4 pb-2 border-b border-slate-100 flex items-center justify-between gap-4 bg-slate-50/50">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('upload')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'upload'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Upload Word / PDF / CSV</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('paste')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'paste'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <FileCode className="w-4 h-4" />
              <span>Paste Document Text</span>
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-medium text-slate-500">
            <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-bold border border-blue-200/60">.docx</span>
            <span className="px-2 py-0.5 rounded-md bg-red-50 text-red-700 font-bold border border-red-200/60">.pdf</span>
            <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-bold border border-emerald-200/60">.csv</span>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-4">
          
          {/* Status Banners */}
          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span className="font-medium">{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2.5 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span className="font-bold">{successMsg}</span>
            </div>
          )}

          {/* TAB 1: FILE UPLOAD DROPZONE */}
          {activeTab === 'upload' && (
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".docx,.doc,.pdf,.csv,.txt,.tsv"
                onChange={handleFileSelect}
                className="hidden"
              />
              <div
                onClick={() => fileInputRef.current?.click()}
                className={`p-8 rounded-3xl border-2 border-dashed transition-all cursor-pointer text-center flex flex-col items-center justify-center gap-3 ${
                  file
                    ? 'border-indigo-400 bg-indigo-50/30'
                    : 'border-slate-300 hover:border-indigo-400 bg-slate-50/60 hover:bg-indigo-50/10'
                }`}
              >
                <div className="w-14 h-14 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center shadow-xs">
                  <Upload className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">
                    {file ? file.name : 'Click to Upload Word (.docx), PDF (.pdf), or CSV'}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Drag and drop your file here, or click to browse files
                  </p>
                </div>
                {file && (
                  <span className="text-[11px] font-bold text-indigo-700 bg-indigo-100/80 px-3 py-1 rounded-full">
                    {(file.size / 1024).toFixed(1)} KB &bull; Click to choose another file
                  </span>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: PASTE TEXT */}
          {activeTab === 'paste' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-600">
                <span className="font-semibold">Copy and paste text from your Word / PDF file:</span>
                <button
                  type="button"
                  onClick={handleParsePastedText}
                  disabled={isParsing || !rawText.trim()}
                  className="px-3 py-1.5 bg-indigo-600 text-white rounded-xl font-bold text-xs hover:bg-indigo-700 transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isParsing ? 'Parsing...' : 'Extract Questions Now'}
                </button>
              </div>
              <textarea
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                placeholder="Example:&#10;1. What is the value of 3/4 + 1/2?&#10;A) 1/4&#10;B) 5/4&#10;C) 3/8&#10;D) 7/4&#10;Answer: B&#10;Explanation: 3/4 + 2/4 = 5/4&#10;&#10;Q2. Name the planet closest to the Sun:&#10;A) Venus&#10;B) Mars&#10;C) Mercury&#10;D) Jupiter&#10;Ans: C"
                rows={9}
                className="w-full p-4 rounded-2xl border border-slate-200 text-xs font-mono text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-50"
              />
            </div>
          )}

          {/* PARSED PREVIEW SECTION */}
          {parsedQuestions.length > 0 && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <Eye className="w-4 h-4 text-indigo-600" />
                  <span>Preview Extracted Questions ({parsedQuestions.length})</span>
                </h4>
                <span className="text-[11px] text-emerald-700 font-bold bg-emerald-100 px-2.5 py-0.5 rounded-full">
                  All Questions Formatted
                </span>
              </div>

              <div className="max-h-56 overflow-y-auto divide-y divide-slate-100 rounded-2xl border border-slate-200 bg-slate-50/40 p-2">
                {parsedQuestions.map((q, idx) => (
                  <div key={q.id || idx} className="p-3 text-xs space-y-1.5">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-bold text-slate-900">
                        <span className="text-indigo-600 mr-1.5">Q{idx + 1}.</span>
                        {q.question_text}
                      </p>
                      <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-extrabold text-[10px] shrink-0">
                        Correct: {q.correct_option}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-1.5 text-[11px] text-slate-600 pl-4">
                      <div className={q.correct_option === 'A' ? 'font-bold text-emerald-700' : ''}>A: {q.option_a}</div>
                      <div className={q.correct_option === 'B' ? 'font-bold text-emerald-700' : ''}>B: {q.option_b}</div>
                      <div className={q.correct_option === 'C' ? 'font-bold text-emerald-700' : ''}>C: {q.option_c}</div>
                      <div className={q.correct_option === 'D' ? 'font-bold text-emerald-700' : ''}>D: {q.option_d}</div>
                    </div>

                    {q.explanation && (
                      <p className="text-[10px] text-slate-400 italic pl-4">
                        💡 {q.explanation}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Buttons */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-slate-500 font-medium hidden sm:block">
            {parsedQuestions.length > 0
              ? `Ready to save ${parsedQuestions.length} questions into repository.`
              : 'Supports Word documents, PDF papers, and CSV templates.'}
          </div>

          <div className="flex items-center gap-2.5 ml-auto">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleConfirmImport}
              disabled={isImporting || parsedQuestions.length === 0}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold text-white transition-all cursor-pointer flex items-center gap-2 ${
                parsedQuestions.length > 0
                  ? 'bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-600/20 active:scale-95'
                  : 'bg-slate-300 text-slate-500 cursor-not-allowed'
              }`}
            >
              {isImporting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Importing Questions...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Confirm &amp; Import ({parsedQuestions.length})</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default UniversalQuestionImportModal;
