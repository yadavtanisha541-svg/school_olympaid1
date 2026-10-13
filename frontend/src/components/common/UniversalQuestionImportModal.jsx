import React, { useState, useRef } from 'react';
import {
  Upload, FileText, FileCode, CheckCircle2, AlertCircle,
  X, RefreshCw, Eye, Check, Image as ImageIcon
} from 'lucide-react';
import { extractFromFile, parseQuestionsFromText, getExtractedImages } from '../../utils/universalDocumentParser';
import { syncManager } from '../../utils/syncManager';

export const UniversalQuestionImportModal = ({
  isOpen, onClose,
  title = 'Import Questions (Word / PDF / CSV)',
  subtitle = 'Upload your question paper — questions, options A/B/C/D, answers and diagrams extracted automatically.',
  onQuestionsImported,
  targetClassId,
  targetSubjectId
}) => {
  const [activeTab, setActiveTab]       = useState('upload');
  const [file, setFile]                 = useState(null);
  const [rawText, setRawText]           = useState('');
  const [isParsing, setIsParsing]       = useState(false);
  const [isImporting, setIsImporting]   = useState(false);
  const [parsedQuestions, setParsedQuestions] = useState([]);
  const [allImages, setAllImages]       = useState({});
  const [errorMsg, setErrorMsg]         = useState('');
  const [successMsg, setSuccessMsg]     = useState('');
  const fileRef = useRef(null);

  if (!isOpen) return null;

  // ─── File upload ────────────────────────────────────────────────────────────
  const handleFileSelect = async (e) => {
    const sel = e.target.files?.[0];
    if (!sel) return;
    setFile(sel); setErrorMsg(''); setSuccessMsg('');
    setIsParsing(true); setParsedQuestions([]); setAllImages({});
    try {
      const { text, images } = await extractFromFile(sel);
      const imgMap = images || {};
      setRawText(text);
      setAllImages(imgMap);
      const qs = parseQuestionsFromText(text, imgMap);
      if (qs.length === 0) {
        setErrorMsg('No questions found. Check the file format or use "Paste Text" tab.');
      } else {
        // Attach image store reference to each question for preview
        setParsedQuestions(qs.map(q => ({
          ...q,
          _imgStore: imgMap,
          question_image: q.question_image || (q.question_image_keys?.[0] ? imgMap[q.question_image_keys[0]] : '') || ''
        })));
        const ic = Object.keys(imgMap).length;
        setSuccessMsg(`Extracted ${qs.length} question${qs.length > 1 ? 's' : ''}${ic > 0 ? ` + ${ic} diagram${ic > 1 ? 's' : ''}` : ''} ✓`);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to read the file.');
    } finally {
      setIsParsing(false);
    }
  };

  // ─── Paste text ─────────────────────────────────────────────────────────────
  const handleParsePaste = () => {
    if (!rawText.trim()) { setErrorMsg('Please paste some text first.'); return; }
    setErrorMsg(''); setSuccessMsg(''); setIsParsing(true);
    try {
      const qs = parseQuestionsFromText(rawText, allImages);
      if (qs.length === 0) {
        setErrorMsg('No questions detected. Each question must start with a number (1., Q1.) and have options A) B) C) D).');
      } else {
        setParsedQuestions(qs.map(q => ({ ...q, _imgStore: allImages })));
        setSuccessMsg(`Extracted ${qs.length} question${qs.length > 1 ? 's' : ''} ✓`);
      }
    } catch (err) {
      setErrorMsg('Parse error: ' + err.message);
    } finally {
      setIsParsing(false);
    }
  };

  // ─── Confirm import ──────────────────────────────────────────────────────────
  const handleConfirmImport = async () => {
    if (parsedQuestions.length === 0) { setErrorMsg('No questions to import.'); return; }
    setIsImporting(true);
    try {
      const formatted = parsedQuestions.map(({ _imgStore, question_image_keys, ...q }) => {
        const primaryImg = q.question_image || (question_image_keys?.[0] ? ((_imgStore || allImages)[question_image_keys[0]]) : '') || '';
        return {
          ...q,
          question_image: primaryImg,
          image_url: primaryImg,
          class_id: targetClassId || q.class_id,
          subject_id: targetSubjectId || q.subject_id,
        };
      });
      if (onQuestionsImported) await onQuestionsImported(formatted);
      try { syncManager.schedulePush?.(); } catch (_) {}
      setSuccessMsg(`Imported ${formatted.length} questions successfully!`);
      setTimeout(() => { onClose(); setParsedQuestions([]); setFile(null); setRawText(''); setAllImages({}); }, 1200);
    } catch (err) {
      setErrorMsg('Import error: ' + (err.message || 'Unknown error'));
    } finally {
      setIsImporting(false);
    }
  };

  // ─── Render question text — replace __IMG__key__ with <img> ──────────────────
  const renderQText = (qText, imgStore) => {
    if (!qText) return '';
    const re = /['"]?__IMG__(\S+?)__['"]?/g;
    const parts = [];
    let last = 0, m, hasImg = false;
    while ((m = re.exec(qText)) !== null) {
      hasImg = true;
      if (m.index > last) parts.push(<span key={`t${last}`}>{qText.slice(last, m.index)}</span>);
      const src = (imgStore || {})[m[1]] || allImages[m[1]] || getExtractedImages()[m[1]];
      parts.push(src
        ? <img key={m[1]} src={src} alt="diagram" className="block max-w-full max-h-52 my-2 rounded-xl border border-indigo-200 shadow-sm object-contain bg-white" />
        : <span key={m[1]} className="inline-flex items-center gap-1 text-[10px] font-bold bg-indigo-50 border border-indigo-200 text-indigo-600 px-2 py-0.5 rounded-md mx-0.5"><ImageIcon className="w-3 h-3" />[Diagram]</span>
      );
      last = m.index + m[0].length;
    }
    if (last < qText.length) parts.push(<span key="tail">{qText.slice(last)}</span>);
    return hasImg ? <>{parts}</> : qText;
  };

  // ─── Render option content (supports base64 image and __IMG__ markers) ───────
  const renderOptionContent = (val, imgStore) => {
    if (!val) return '—';
    if (typeof val === 'string' && val.startsWith('data:image')) {
      return (
        <img
          src={val}
          alt="Option diagram"
          className="max-h-16 max-w-full object-contain rounded-lg border border-slate-200 bg-white"
        />
      );
    }
    const re = /['"]?__IMG__(\S+?)__['"]?/g;
    if (typeof val === 'string' && re.test(val)) {
      re.lastIndex = 0;
      const parts = [];
      let last = 0, m;
      while ((m = re.exec(val)) !== null) {
        if (m.index > last) parts.push(<span key={`t${last}`}>{val.slice(last, m.index)}</span>);
        const src = (imgStore || {})[m[1]] || allImages[m[1]] || getExtractedImages()[m[1]];
        parts.push(src ? (
          <img key={m[1]} src={src} alt="Option Diagram" className="max-h-16 max-w-full object-contain inline-block my-1 rounded-md border border-indigo-200 bg-white" />
        ) : (
          <span key={m[1]} className="text-[10px] text-indigo-600 font-bold bg-indigo-50 px-1 py-0.5 rounded">[Diagram]</span>
        ));
        last = m.index + m[0].length;
      }
      if (last < val.length) parts.push(<span key="tail">{val.slice(last)}</span>);
      return <>{parts}</>;
    }
    return val;
  };

  // ─── Get diagram images for a question ───────────────────────────────────────
  const getQDiagrams = (q) => {
    const list = [];
    if (q.question_image) {
      list.push({ key: 'main_diagram', src: q.question_image });
    }
    (q.question_image_keys || []).forEach(k => {
      const src = (q._imgStore || allImages)[k] || getExtractedImages()[k];
      if (src && !list.some(item => item.src === src)) {
        list.push({ key: k, src });
      }
    });
    return list;
  };

  const totalImgs = Object.keys(allImages).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-sm">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">

        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300">
              <Upload className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                {title}
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 uppercase tracking-wider">AI Parser</span>
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">{subtitle}</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="px-6 pt-4 pb-2 border-b border-slate-100 flex items-center justify-between gap-4 bg-slate-50/50 shrink-0">
          <div className="flex gap-2">
            {[['upload', 'Upload File', FileText], ['paste', 'Paste Text', FileCode]].map(([id, label, Icon]) => (
              <button key={id} type="button" onClick={() => setActiveTab(id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                  activeTab === id ? 'bg-indigo-600 text-white shadow-sm' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <Icon className="w-4 h-4" /><span>{label}</span>
              </button>
            ))}
          </div>
          <div className="hidden sm:flex items-center gap-1">
            {[['docx','blue'],['pdf','red'],['csv','emerald']].map(([e,c]) => (
              <span key={e} className={`px-2 py-0.5 text-[11px] rounded-md bg-${c}-50 text-${c}-700 font-bold border border-${c}-200/60`}>.{e}</span>
            ))}
          </div>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-4">

          {/* Banners */}
          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span className="font-medium">{errorMsg}</span>
            </div>
          )}
          {successMsg && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span className="font-bold">{successMsg}</span>
            </div>
          )}

          {/* Upload tab */}
          {activeTab === 'upload' && (
            <div className="space-y-3">
              <input ref={fileRef} type="file" accept=".docx,.doc,.pdf,.csv,.txt,.tsv" onChange={handleFileSelect} className="hidden" />
              <div
                onClick={() => fileRef.current?.click()}
                className={`p-8 rounded-3xl border-2 border-dashed transition-all cursor-pointer text-center flex flex-col items-center gap-3 ${
                  file ? 'border-indigo-400 bg-indigo-50/30' : 'border-slate-300 hover:border-indigo-400 bg-slate-50/60 hover:bg-indigo-50/10'
                }`}
              >
                <div className="w-14 h-14 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center shadow-sm">
                  <Upload className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">{file ? file.name : 'Click to upload Word (.docx), PDF (.pdf), or CSV'}</p>
                  <p className="text-xs text-slate-400 mt-1">Questions, options A/B/C/D, answers and diagrams will all be extracted</p>
                </div>
                {file && <span className="text-[11px] font-bold text-indigo-700 bg-indigo-100/80 px-3 py-1 rounded-full">{(file.size/1024).toFixed(1)} KB · Click to change</span>}
              </div>

              {isParsing && (
                <div className="flex items-center justify-center gap-2 py-3 text-xs text-indigo-700 font-bold">
                  <RefreshCw className="w-4 h-4 animate-spin" /> Extracting questions, options and diagrams…
                </div>
              )}

              {/* All extracted diagrams strip */}
              {totalImgs > 0 && parsedQuestions.length === 0 && (
                <div className="p-3 rounded-2xl border border-indigo-100 bg-indigo-50/40">
                  <p className="text-[11px] font-bold text-indigo-700 mb-2 flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5" />
                    {totalImgs} diagram{totalImgs > 1 ? 's' : ''} found in file
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    {Object.entries(allImages).map(([k,src]) => (
                      <img key={k} src={src} alt={k} className="h-20 max-w-[140px] object-contain rounded-lg border border-indigo-200 shadow-sm" />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Paste tab */}
          {activeTab === 'paste' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-600">
                <span className="font-semibold">Paste your question text below:</span>
                <button type="button" onClick={handleParsePaste} disabled={isParsing || !rawText.trim()}
                  className="px-3 py-1.5 bg-indigo-600 text-white rounded-xl font-bold text-xs hover:bg-indigo-700 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {isParsing ? 'Parsing…' : 'Extract Questions'}
                </button>
              </div>
              <textarea
                value={rawText} onChange={e => setRawText(e.target.value)}
                placeholder={`1. What is 10 less than 89?\na. 79\nb. 80\nc. 99\nd. 81\nAnswer: a\n\n2. A watermelon weighs 3 kg. How much do 4 watermelons weigh together?\na. 12 kg\nb. 9 kg\nc. 15 kg\nd. 8 kg\nAns: a`}
                rows={10}
                className="w-full p-4 rounded-2xl border border-slate-200 text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-50"
              />
            </div>
          )}

          {/* Questions preview — ONE card per question */}
          {parsedQuestions.length > 0 && (
            <div className="space-y-3 pt-1">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <Eye className="w-4 h-4 text-indigo-600" />
                  Preview — {parsedQuestions.length} Question{parsedQuestions.length > 1 ? 's' : ''}
                  {totalImgs > 0 && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 border border-purple-200 flex items-center gap-1 ml-1">
                      <ImageIcon className="w-3 h-3" />{totalImgs} Diagram{totalImgs > 1 ? 's' : ''}
                    </span>
                  )}
                </h4>
                <span className="text-[11px] text-emerald-700 font-bold bg-emerald-100 px-2.5 py-0.5 rounded-full">Ready to import</span>
              </div>

              {/* Each question in its own card */}
              <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
                {parsedQuestions.map((q, idx) => {
                  const diagrams = getQDiagrams(q);
                  return (
                    <div key={q.id || idx} className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                      {/* Question header strip */}
                      <div className="px-4 py-3 bg-slate-50 border-b border-slate-100 flex items-start gap-3">
                        <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <p className="flex-1 text-xs font-semibold text-slate-900 leading-relaxed">
                          {renderQText(q.question_text, q._imgStore)}
                        </p>
                        <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-extrabold text-[10px] shrink-0 whitespace-nowrap ml-2">
                          Ans: {q.correct_option}
                        </span>
                      </div>

                      <div className="p-4 space-y-3">
                        {/* Diagram(s) for this question */}
                        {diagrams.length > 0 && (
                          <div className="flex gap-2 flex-wrap">
                            {diagrams.map(d => (
                              <img key={d.key} src={d.src} alt="Diagram"
                                className="max-h-48 max-w-full object-contain rounded-xl border border-indigo-200 shadow-sm"
                              />
                            ))}
                          </div>
                        )}

                        {/* Options A B C D — 2×2 grid */}
                        <div className="grid grid-cols-2 gap-1.5">
                          {['A','B','C','D'].map(letter => {
                            const val = q[`option_${letter.toLowerCase()}`] || '';
                            const isCorrect = q.correct_option === letter;
                            const isEmpty   = !val;
                            return (
                              <div key={letter} className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-[11px] ${
                                isCorrect ? 'bg-emerald-50 border-emerald-300 font-bold text-emerald-800'
                                : isEmpty  ? 'bg-slate-50 border-dashed border-slate-200 text-slate-300 italic'
                                : 'bg-slate-50 border-slate-200 text-slate-700'
                              }`}>
                                <span className={`w-5 h-5 rounded-md flex items-center justify-center font-black text-[9px] shrink-0 ${
                                  isCorrect ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-600'
                                }`}>{letter}</span>
                                <div className="truncate flex-1">{isEmpty ? '—' : renderOptionContent(val, q._imgStore || allImages)}</div>
                                {isCorrect && <Check className="w-3 h-3 text-emerald-600 ml-auto shrink-0" />}
                              </div>
                            );
                          })}
                        </div>

                        {/* Explanation */}
                        {q.explanation && (
                          <p className="text-[10px] text-slate-500 italic">💡 {q.explanation}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-slate-500 font-medium hidden sm:block">
            {parsedQuestions.length > 0
              ? `${parsedQuestions.length} question${parsedQuestions.length>1?'s':''}${totalImgs>0?` + ${totalImgs} diagram${totalImgs>1?'s':''}`:''} ready to save`
              : 'Supports Word (.docx), PDF and CSV files'}
          </div>
          <div className="flex items-center gap-2.5 ml-auto">
            <button type="button" onClick={onClose} className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer">
              Cancel
            </button>
            <button
              type="button" onClick={handleConfirmImport}
              disabled={isImporting || parsedQuestions.length === 0}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold text-white transition-all cursor-pointer flex items-center gap-2 ${
                parsedQuestions.length > 0
                  ? 'bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-600/20 active:scale-95'
                  : 'bg-slate-300 text-slate-500 cursor-not-allowed'
              }`}
            >
              {isImporting
                ? <><RefreshCw className="w-4 h-4 animate-spin" /><span>Importing…</span></>
                : <><Check className="w-4 h-4" /><span>Confirm &amp; Import ({parsedQuestions.length})</span></>
              }
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default UniversalQuestionImportModal;
