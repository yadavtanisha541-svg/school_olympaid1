import React, { useState, useEffect } from 'react';
import { Image as ImageIcon, ZoomIn, X, Trash2, Upload, RefreshCw } from 'lucide-react';
import { getExtractedImages } from './universalDocumentParser';
import { getCachedImageSync, saveImageToStore, normalizeTextKey } from './imageStore';

/**
 * Extracts the primary image / diagram from a question object.
 * Checks all known field names across Super Admin, Question Bank, and Document Parsers.
 */
export const getQuestionImage = (q) => {
  if (!q) return null;

  const qTextRaw = (q.q || q.question_text || q.question || q.title || '').trim();

  // 0. Fast In-Memory / IndexedDB Cache Check by Question ID or Text
  try {
    if (q.id) {
      const byId = getCachedImageSync(String(q.id));
      if (byId) return byId;
    }
    if (qTextRaw) {
      const byText = getCachedImageSync(normalizeTextKey(qTextRaw));
      if (byText) return byText;
    }
  } catch (_) {}

  // 1. Direct explicit fields
  const candidates = [
    q.question_image,
    q.image_url,
    q.diagram,
    q.diagram_url,
    q.image,
    q.figure,
    q.photo,
    q.img,
    q.picture,
    ...(Array.isArray(q.images) ? q.images : []),
    ...(Array.isArray(q.diagrams) ? q.diagrams : []),
    ...(Array.isArray(q.media) ? q.media : [])
  ];

  for (let c of candidates) {
    if (c && typeof c === 'object') {
      c = c.src || c.url || c.data || (c.base64 ? `data:image/png;base64,${c.base64}` : null);
    }
    if (typeof c === 'string' && c.trim().length > 0) {
      const clean = c.trim();
      // If it has __IMG__ placeholder, resolve key
      if (clean.includes('__IMG__')) {
        const keyMatch = clean.match(/__IMG__(\S+?)__/);
        const key = keyMatch ? keyMatch[1] : clean.replace(/__IMG__/g, '').trim();
        const store = q._imgStore || (typeof window !== 'undefined' && window._olympiadhub_img_cache) || {};
        const extracted = getExtractedImages() || {};
        const resolved = store[key] || extracted[key] || getCachedImageSync(key);
        if (resolved) {
          try {
            if (q.id) saveImageToStore(String(q.id), resolved);
            if (qTextRaw) saveImageToStore(normalizeTextKey(qTextRaw), resolved);
          } catch (_) {}
          return resolved;
        }
        if (clean.startsWith('data:image') || clean.startsWith('http')) return clean;
      }

      // Any valid image source (Data URL, URL, relative path, or filename)
      if (
        clean.startsWith('data:image') ||
        clean.startsWith('data:application') ||
        clean.startsWith('http://') ||
        clean.startsWith('https://') ||
        clean.startsWith('blob:') ||
        clean.startsWith('/') ||
        clean.startsWith('./') ||
        clean.startsWith('../') ||
        /\.(png|jpe?g|gif|webp|svg|bmp)(\?.*)?$/i.test(clean) ||
        clean.length > 50 // Base64 strings without header or large encoded strings
      ) {
        const validSrc = (clean.length > 50 && !clean.startsWith('data:') && !clean.startsWith('http') && !clean.startsWith('/') && !clean.includes(' '))
          ? `data:image/png;base64,${clean}`
          : clean;

        try {
          if (q.id) saveImageToStore(String(q.id), validSrc);
          const qTextRaw = q.q || q.question_text || q.question || q.title || '';
          if (qTextRaw) saveImageToStore(normalizeTextKey(qTextRaw), validSrc);
        } catch (_) {}

        return validSrc;
      }
    }
  }

  // 2. Image keys with store
  if (Array.isArray(q.question_image_keys) && q.question_image_keys.length > 0) {
    const key = q.question_image_keys[0];
    const store = q._imgStore || (typeof window !== 'undefined' && window._olympiadhub_img_cache) || {};
    const extracted = getExtractedImages() || {};
    const resolved = store[key] || extracted[key] || getCachedImageSync(key);
    if (resolved) {
      try {
        if (q.id) saveImageToStore(String(q.id), resolved);
        const qTextRaw = q.q || q.question_text || q.question || q.title || '';
        if (qTextRaw) saveImageToStore(normalizeTextKey(qTextRaw), resolved);
      } catch (_) {}
      return resolved;
    }
  }

  // 3. Embedded in question text (Markdown, HTML img, or __IMG__ token)
  const text = q.q || q.question_text || q.question || q.title || '';
  if (typeof text === 'string' && text.length > 0) {
    // Custom Token: __IMG__<key>__
    const tokenMatch = text.match(/['"]?__IMG__(\S+?)__['"]?/);
    if (tokenMatch && tokenMatch[1]) {
      const key = tokenMatch[1];
      const store = q._imgStore || (typeof window !== 'undefined' && window._olympiadhub_img_cache) || {};
      const extracted = getExtractedImages() || {};
      if (store[key]) return store[key];
      if (extracted[key]) return extracted[key];
      if (key.startsWith('data:image') || key.startsWith('http')) return key;
    }

    // Markdown: ![alt](url)
    const mdMatch = text.match(/!\[.*?\]\((data:image\/[a-zA-Z0-9+.-]+;base64,[^\s\)]+|https?:\/\/[^\s\)]+|blob:[^\s\)]+)\)/);
    if (mdMatch && mdMatch[1]) return mdMatch[1];

    // HTML: <img ... src="..." ...>
    const htmlMatch = text.match(/<img[^>]+src=["'](data:image\/[a-zA-Z0-9+.-]+;base64,[^"']+|https?:\/\/[^"']+|blob:[^"']+)["']/i);
    if (htmlMatch && htmlMatch[1]) return htmlMatch[1];

    // Raw Base64 string directly in text
    const rawDataMatch = text.match(/(data:image\/[a-zA-Z0-9+.-]+;base64,[A-Za-z0-9+/=]+)/);
    if (rawDataMatch && rawDataMatch[1] && rawDataMatch[1].length > 40) return rawDataMatch[1];
  }

  // 4. Global fallback lookup in localStorage by question statement or ID
  try {
    if (typeof window !== 'undefined') {
      const qRaw = (q.q || q.question_text || '').trim();
      const normText = (txt) => (txt || '').replace(/^(\d+[\.\)\s]+)/, '').replace(/\s+/g, ' ').trim().toLowerCase();
      const cleanTarget = normText(qRaw);

      const checkPaperQuestions = (papersList) => {
        if (!Array.isArray(papersList)) return null;
        for (const p of papersList) {
          if (Array.isArray(p.questions)) {
            for (const pq of p.questions) {
              const pImg = pq.question_image || pq.image_url || pq.diagram || pq.image || pq.figure || pq.photo;
              if (pImg && typeof pImg === 'string' && pImg.trim()) {
                if (q.id && pq.id && String(q.id) === String(pq.id)) return pImg.trim();
                if (cleanTarget.length > 5 && normText(pq.q || pq.question_text) === cleanTarget) {
                  return pImg.trim();
                }
              }
            }
          }
        }
        return null;
      };

      // Check Question Bank
      const qBank = JSON.parse(localStorage.getItem('olympiadhub_db_questions') || '[]');
      if (Array.isArray(qBank)) {
        for (const bq of qBank) {
          const bImg = bq.question_image || bq.image_url || bq.diagram || bq.image || bq.figure;
          if (bImg && typeof bImg === 'string' && bImg.trim()) {
            if (q.id && bq.id && String(q.id) === String(bq.id)) return bImg.trim();
            if (cleanTarget.length > 5 && normText(bq.question_text || bq.q) === cleanTarget) {
              return bImg.trim();
            }
          }
        }
      }

      // Check all paper databases
      const foundInAdmin = checkPaperQuestions(JSON.parse(localStorage.getItem('admin_generator_papers') || '[]'));
      if (foundInAdmin) return foundInAdmin;

      const foundInDb = checkPaperQuestions(JSON.parse(localStorage.getItem('olympiadhub_db_exam_papers') || '[]'));
      if (foundInDb) return foundInDb;

      const foundInMock = checkPaperQuestions(JSON.parse(localStorage.getItem('mock_db_exam_papers') || '[]'));
      if (foundInMock) return foundInMock;

      const foundInExams = checkPaperQuestions(JSON.parse(localStorage.getItem('olympiadhub_db_exams') || '[]'));
      if (foundInExams) return foundInExams;
    }
  } catch (e) {}

  return null;
};

/**
 * Cleans question statement text by removing embedded image markup and large base64 strings.
 */
export const getCleanQuestionText = (text = '') => {
  if (!text || typeof text !== 'string') return '';
  return text
    .replace(/!\[.*?\]\((data:image\/[a-zA-Z0-9+.-]+;base64,[^\s\)]+|https?:\/\/[^\s\)]+|blob:[^\s\)]+)\)/g, '')
    .replace(/<img[^>]+>/gi, '')
    .replace(/['"]?__IMG__\S+?__['"]?/g, '')
    .replace(/__IMG__(data:image\/[a-zA-Z0-9+.-]+;base64,[^\s]+|https?:\/\/[^\s]+|blob:[^\s]+)/g, '')
    .replace(/data:image\/[a-zA-Z0-9+.-]+;base64,[A-Za-z0-9+/=]{40,}/g, '')
    .replace(/\s+/g, ' ')
    .trim();
};

/**
 * Checks if an option string represents an image.
 */
export const isImageString = (str) => {
  if (!str || typeof str !== 'string') return false;
  const s = str.trim();
  if (s.startsWith('data:image')) return true;
  if (s.startsWith('blob:')) return true;
  if (s.includes('__IMG__')) return true;
  if (s.startsWith('http://') || s.startsWith('https://')) {
    const lower = s.toLowerCase();
    if (
      lower.endsWith('.png') ||
      lower.endsWith('.jpg') ||
      lower.endsWith('.jpeg') ||
      lower.endsWith('.gif') ||
      lower.endsWith('.webp') ||
      lower.endsWith('.svg') ||
      lower.includes('/image/') ||
      lower.includes('cloudinary') ||
      lower.includes('imgur')
    ) {
      return true;
    }
  }
  return false;
};

/**
 * Extracts exact image src from an option string.
 */
export const getOptionImageSrc = (str, imgStore = null) => {
  if (!str || typeof str !== 'string') return '';
  const s = str.trim();
  if (s.includes('__IMG__')) {
    const keyMatch = s.match(/__IMG__(\S+?)__/);
    const key = keyMatch ? keyMatch[1] : s.replace(/__IMG__/g, '').trim();
    const store = imgStore || (typeof window !== 'undefined' && window._olympiadhub_img_cache) || {};
    const extracted = getExtractedImages() || {};
    const resolved = store[key] || extracted[key];
    if (resolved) return resolved;
    return key;
  }
  return s;
};

/**
 * Reusable Question Diagram Component — Matches Super Admin appearance with zoom lightbox
 */
export const QuestionDiagram = ({
  question,
  className = '',
  maxHeight = 'max-h-80 sm:max-h-96',
  title = 'Question Diagram / Figure',
  editable = false,
  onRemove = null,
  onChange = null
}) => {
  const [isZoomed, setIsZoomed] = useState(false);
  const [hasError, setHasError] = useState(false);

  const imgSrc = getQuestionImage(question);

  // Reset error whenever question or image changes
  useEffect(() => {
    setHasError(false);
  }, [imgSrc, question?.id, question?.q, question?.question_text]);

  if (!imgSrc || hasError) return null;

  return (
    <>
      <div className={`my-3 text-left w-full ${className}`}>
        <div className="relative inline-block border-2 border-indigo-200/90 rounded-2xl p-3 bg-white shadow-xs max-w-full group">
          <div className="flex items-center justify-between gap-3 text-xs font-bold text-indigo-700 mb-2 border-b border-indigo-100 pb-1.5">
            <span className="flex items-center gap-1.5">
              <span className="text-sm">📸</span>
              <span>{title}</span>
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setIsZoomed(true)}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-700 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-0.5 rounded-lg transition-colors cursor-pointer"
                title="Click to zoom in"
              >
                <ZoomIn className="w-3.5 h-3.5" />
                <span>Zoom</span>
              </button>
              {editable && onChange && (
                <label className="inline-flex items-center gap-1 text-[11px] font-bold text-sky-700 hover:text-sky-900 bg-sky-50 hover:bg-sky-100 px-2.5 py-0.5 rounded-lg transition-colors cursor-pointer">
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Change</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file && onChange) onChange(file);
                    }}
                  />
                </label>
              )}
              {editable && onRemove && (
                <button
                  type="button"
                  onClick={onRemove}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-600 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 px-2 py-0.5 rounded-lg transition-colors cursor-pointer"
                  title="Remove Diagram"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove</span>
                </button>
              )}
            </div>
          </div>

          <div
            className="cursor-zoom-in overflow-hidden rounded-xl bg-white flex items-center justify-center p-1"
            onClick={() => setIsZoomed(true)}
          >
            <img
              src={imgSrc}
              alt="Question Diagram"
              onError={() => setHasError(true)}
              className={`${maxHeight} max-w-full rounded-lg object-contain bg-white transition-transform duration-150 hover:scale-[1.01]`}
              loading="lazy"
            />
          </div>
        </div>
      </div>

      {/* Fullscreen Zoom Lightbox Modal */}
      {isZoomed && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={() => setIsZoomed(false)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] bg-white rounded-2xl p-4 shadow-2xl border border-slate-200 flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full flex items-center justify-between pb-3 mb-2 border-b border-slate-200">
              <span className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-indigo-600" />
                <span>{title} (Enlarged View)</span>
              </span>
              <button
                type="button"
                onClick={() => setIsZoomed(false)}
                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <img
              src={imgSrc}
              alt="Enlarged Question Diagram"
              className="max-h-[75vh] max-w-full object-contain rounded-lg"
            />
          </div>
        </div>
      )}
    </>
  );
};

