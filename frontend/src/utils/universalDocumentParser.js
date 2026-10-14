// OlympiadHub - Universal Document & Question Parser v4.0
// Fix: Proper numbered-list parsing from Word DOCX, images per question, no merging

// ─── CDN loaders ─────────────────────────────────────────────────────────────
let pdfjsPromise = null;
export async function getPdfJs() {
  if (typeof window === 'undefined') return null;
  if (window.pdfjsLib) return window.pdfjsLib;
  if (pdfjsPromise) return pdfjsPromise;
  pdfjsPromise = new Promise((resolve) => {
    const s = document.createElement('script');
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
    s.async = true;
    s.onload = () => {
      try {
        if (window.pdfjsLib)
          window.pdfjsLib.GlobalWorkerOptions.workerSrc =
            'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
      } catch (e) {}
      resolve(window.pdfjsLib || null);
    };
    s.onerror = () => resolve(null);
    document.head.appendChild(s);
  });
  return pdfjsPromise;
}

let mammothPromise = null;
export async function getMammoth() {
  if (typeof window === 'undefined') return null;
  if (window.mammoth) return window.mammoth;
  if (mammothPromise) return mammothPromise;
  mammothPromise = new Promise((resolve) => {
    const s = document.createElement('script');
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js';
    s.async = true;
    s.onload = () => resolve(window.mammoth || null);
    s.onerror = () => resolve(null);
    document.head.appendChild(s);
  });
  return mammothPromise;
}

import { saveMultipleImages, saveImageToStore } from './imageStore';

// ─── Global image store ───────────────────────────────────────────────────────
let _images = {};
export function getExtractedImages() { return _images; }

// ─────────────────────────────────────────────────────────────────────────────
// MAIN EXTRACTOR
// Returns { text: string, images: { [key]: dataUrl } }
// ─────────────────────────────────────────────────────────────────────────────
export async function extractFromFile(file) {
  _images = {};
  const name = file.name.toLowerCase();

  // ── Plain text / CSV ────────────────────────────────────────────────────────
  if (name.endsWith('.csv') || name.endsWith('.txt') || name.endsWith('.tsv') || file.type.includes('text/')) {
    const text = await file.text();
    return { text, images: {} };
  }

  // ── Word DOCX / DOC ─────────────────────────────────────────────────────────
  if (name.endsWith('.docx') || name.endsWith('.doc')) {
    const buf = await file.arrayBuffer();
    let imgIdx = 0;

    try {
      const mammoth = await getMammoth();
      if (mammoth) {
        // Use convertToHtml with image handler → images become __IMG__key__ placeholders
        const htmlResult = await mammoth.convertToHtml(
          { arrayBuffer: buf },
          {
            convertImage: mammoth.images.imgElement((img) =>
              img.read('base64').then((b64) => {
                const key = `docx_img_${++imgIdx}`;
                _images[key] = `data:${img.contentType};base64,${b64}`;
                return { src: `__IMG__${key}__` };
              })
            )
          }
        );

        if (htmlResult && htmlResult.value && htmlResult.value.trim().length > 0) {
          const text = htmlToStructuredText(htmlResult.value);
          saveMultipleImages(_images);
          return { text, images: { ..._images } };
        }

        // Fallback: raw text (no images)
        const raw = await mammoth.extractRawText({ arrayBuffer: buf });
        if (raw && raw.value && raw.value.trim().length > 0) {
          return { text: raw.value, images: {} };
        }
      }
    } catch (e) {
      console.warn('Mammoth error:', e);
    }

    // XML stream fallback
    try {
      const u8 = new Uint8Array(buf);
      const str = new TextDecoder('utf-8').decode(u8);
      const matches = str.match(/<w:t[^>]*>([^<]+)<\/w:t>/g);
      if (matches && matches.length > 0) {
        const t = matches.map(m => m.replace(/<[^>]+>/g, '')).join(' ');
        if (t.trim().length > 20) return { text: t, images: {} };
      }
    } catch (e) {}

    throw new Error('Cannot parse this Word file. Please save as .docx or paste the text directly.');
  }

  // ── PDF ─────────────────────────────────────────────────────────────────────
  if (name.endsWith('.pdf')) {
    const buf = await file.arrayBuffer();
    try {
      const pdfjs = await getPdfJs();
      if (pdfjs && pdfjs.getDocument) {
        const pdf = await pdfjs.getDocument({ data: buf }).promise;
        let fullText = '';

        for (let p = 1; p <= pdf.numPages; p++) {
          const page = await pdf.getPage(p);
          const content = await page.getTextContent();

          // Group text items by Y coordinate → preserve line structure
          const lineMap = {};
          for (const item of content.items) {
            const y = Math.round(item.transform[5]);
            if (!lineMap[y]) lineMap[y] = [];
            lineMap[y].push(item.str);
          }
          const sortedYs = Object.keys(lineMap).map(Number).sort((a, b) => b - a);
          const pageLines = sortedYs.map(y => lineMap[y].join(' ').trim()).filter(l => l.length > 0);
          fullText += pageLines.join('\n') + '\n\n';

          // Check for images on this page
          try {
            const ops = await page.getOperatorList();
            const hasImg = ops.fnArray.some(fn =>
              fn === (pdfjs.OPS?.paintJpegXObject) ||
              fn === (pdfjs.OPS?.paintImageXObject) ||
              fn === (pdfjs.OPS?.paintInlineImageXObject) ||
              fn === 82 || fn === 83 || fn === 84 || fn === 92
            );
            if (hasImg) {
              const vp = page.getViewport({ scale: 1.5 });
              const canvas = document.createElement('canvas');
              canvas.width = vp.width;
              canvas.height = vp.height;
              await page.render({ canvasContext: canvas.getContext('2d'), viewport: vp }).promise;
              const key = `pdf_page_${p}`;
              _images[key] = canvas.toDataURL('image/png');
              fullText += `\n__IMG__${key}__\n`;
            }
          } catch (re) {
            console.warn('PDF page render error:', re);
          }
        }

        if (fullText.trim().length > 10) return { text: fullText, images: { ..._images } };
      }
    } catch (e) {
      console.warn('PDF.js error:', e);
    }

    // Stream fallback
    try {
      const u8 = new Uint8Array(buf);
      const raw = new TextDecoder('latin1').decode(u8);
      const m = raw.match(/\((.*?)\)\s*Tj/g);
      if (m && m.length > 0) {
        const t = m.map(x => x.replace(/^\(/, '').replace(/\)\s*Tj$/, '')).join(' ');
        if (t.trim().length > 30) return { text: t, images: {} };
      }
    } catch (e) {}

    throw new Error('Cannot extract text from PDF. If scanned, please paste text manually.');
  }

  throw new Error(`Unsupported file: ${file.name}`);
}

/** Legacy wrapper */
export async function extractTextFromFile(file) {
  const { text } = await extractFromFile(file);
  return text;
}

// ─────────────────────────────────────────────────────────────────────────────
// HTML → STRUCTURED PLAIN TEXT
// Crucially: adds "1. " numbering back to <ol><li> items (Word strips them)
// ─────────────────────────────────────────────────────────────────────────────
function htmlToStructuredText(html) {
  let out = '';
  let inOl = false;
  let liCount = 0;
  let lastIdx = 0;

  // Sequential token processor — preserves order
  const TAG_RE = /<\/?(?:ol|ul|li|p|div|br|tr|th|td|h[1-6]|img|table|figure)[^>]*\/?>/gi;
  let m;

  while ((m = TAG_RE.exec(html)) !== null) {
    // Text between last tag and this tag
    out += decodeHtmlEntities(stripInlineTags(html.slice(lastIdx, m.index)));
    lastIdx = m.index + m[0].length;

    const full = m[0];
    const tag = full.match(/<\/?([a-zA-Z0-9]+)/)?.[1]?.toLowerCase() || '';
    const isClose = full.startsWith('</');

    if (tag === 'ol' && !isClose)  { inOl = true; liCount = 0; out += '\n'; }
    else if (tag === 'ol' && isClose) { inOl = false; out += '\n'; }
    else if (tag === 'ul' && !isClose) { inOl = false; out += '\n'; }
    else if (tag === 'ul' && isClose) { out += '\n'; }
    else if (tag === 'li' && !isClose) {
      out += '\n';
      if (inOl) { liCount++; out += `${liCount}. `; }
      else { out += '• '; }
    }
    else if (tag === 'li' && isClose) { out += '\n'; }
    else if ((tag === 'p' || tag === 'div' || tag === 'tr' || tag === 'th' || tag === 'td') && isClose) { out += '\n'; }
    else if (tag === 'br') { out += '\n'; }
    else if (/^h[1-6]$/.test(tag) && isClose) { out += '\n'; }
    else if (tag === 'img') {
      // Capture our image placeholder
      const srcM = full.match(/src="(__IMG__[^"]+)"/i);
      if (srcM) { out += `\n${srcM[1]}\n`; }
    }
    // table / figure → newline
    else if ((tag === 'table' || tag === 'figure') && isClose) { out += '\n'; }
  }

  // Remaining text after last tag
  out += decodeHtmlEntities(stripInlineTags(html.slice(lastIdx)));

  // Collapse 3+ newlines to 2
  out = out.replace(/\n{3,}/g, '\n\n');
  return out.trim();
}

function stripInlineTags(str) {
  // Remove inline tags (span, strong, em, a, etc.) but keep text
  return str.replace(/<[^>]+>/g, '');
}

function decodeHtmlEntities(str) {
  return str
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(n))
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCharCode(parseInt(h, 16)));
}

// ─────────────────────────────────────────────────────────────────────────────
// PUBLIC PARSE ENTRY POINT
// ─────────────────────────────────────────────────────────────────────────────
export function parseQuestionsFromText(text, images = {}) {
  if (!text || typeof text !== 'string') return [];
  const t = text.trim();
  const allImgs = { ...getExtractedImages(), ...(images || {}) };

  // CSV with standard headers
  if (t.includes(',') && (t.toLowerCase().includes('question_text') || t.toLowerCase().includes('option_a'))) {
    return parseCsv(t, allImgs);
  }

  return parseExamText(t, allImgs);
}

// ─────────────────────────────────────────────────────────────────────────────
// EXAM TEXT PARSER
// ─────────────────────────────────────────────────────────────────────────────
function parseExamText(raw, images = {}) {
  let text = raw
    .replace(/\r\n/g, '\n').replace(/\r/g, '\n')
    .replace(/[\u2018\u2019]/g, "'").replace(/[\u201C\u201D]/g, '"')
    .replace(/[ \t]+/g, ' ')
    .replace(/^ /gm, '')
    .replace(/\n{3,}/g, '\n\n');

  // Fix: when <li><p>text</p></li> puts the number on its own line,
  // merge "1.\nIf a pen costs" → "1. If a pen costs"
  text = text.replace(/(\n|^)(\d{1,3}[.)]) *\n+(?![a-dA-D][.)\s])/gm, '$1$2 ');

  const blocks = splitIntoQuestionBlocks(text);

  // Fallback: if numbered detection found ≤1 block, try option-based splitting
  const finalBlocks = blocks.length <= 1 ? splitByOptions(text) : blocks;
  if (finalBlocks.length === 0) return [];

  return finalBlocks
    .map((block, i) => parseBlock(block, i, images))
    .filter(q => q && (q.option_a || q.option_b || q.option_c || q.option_d));
}

// ─── Split by numbered question markers ──────────────────────────────────────
function splitIntoQuestionBlocks(text) {
  const lines = text.split('\n');
  const blocks = [];
  let current = [];

  const isQStart = (line) => {
    const t = line.trim();
    if (!t) return false;
    return (
      /^\d{1,3}[.)]\s+\S/.test(t) ||
      /^Q(?:uestion)?\s*\.?\s*\d{1,3}\s*[.:\)]/i.test(t) ||
      /^\(\d{1,3}\)\s+\S/.test(t) ||
      /^\[\s*Q?\d{1,3}\s*\]\s+\S/.test(t)
    );
  };

  const stripPrefix = (line) =>
    line.trim().replace(
      /^(?:\d{1,3}[.)]\s+|Q(?:uestion)?\s*\.?\s*\d{1,3}\s*[.:\)]\s*|\(\d{1,3}\)\s+|\[\s*Q?\d{1,3}\s*\]\s+)/i,
      ''
    );

  let foundFirst = false;
  for (const line of lines) {
    if (isQStart(line)) {
      foundFirst = true;
      if (current.length > 0) {
        const b = current.join('\n').trim();
        if (b.length > 3) blocks.push(b);
      }
      const stripped = stripPrefix(line);
      current = stripped ? [stripped] : [];
    } else if (foundFirst) {
      current.push(line);
    }
  }
  if (current.length > 0) {
    const b = current.join('\n').trim();
    if (b.length > 3) blocks.push(b);
  }
  return blocks;
}

// ─── Fallback: split by option-pattern boundaries ────────────────────────────
function splitByOptions(text) {
  const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  const blocks = [];
  let current = [];
  let seenOpts = false;

  const isOption  = l => /^[a-dA-D]\s*[.)\s]/.test(l);
  const isAnswer  = l => /^(?:Ans(?:wer)?|Correct|Key)\s*[:=\-–]/i.test(l);
  const isImg     = l => /^['"]?__IMG__/.test(l);
  const isHeader  = l => /^(?:Section|Part|Chapter|Grade|Class|Subject|Instructions?)/i.test(l);

  for (const line of lines) {
    if (isHeader(line) && !seenOpts) continue; // skip doc headers before any question

    if (isOption(line) || isAnswer(line)) {
      seenOpts = true;
      current.push(line);
    } else if (isImg(line)) {
      // Keep image in question or options without forcing seenOpts
      current.push(line);
    } else {
      // Non-option text: if we were already in options, this is a NEW question
      if (seenOpts) {
        const b = current.join('\n').trim();
        if (b.length > 3) blocks.push(b);
        current = [line];   // start new block with this question text
        seenOpts = false;
      } else {
        current.push(line);
      }
    }
  }
  if (current.length > 0) {
    const b = current.join('\n').trim();
    if (b.length > 3) blocks.push(b);
  }
  return blocks;
}

// ─── Parse one question block ─────────────────────────────────────────────────
function parseBlock(blockText, idx, images = {}) {
  if (!blockText || blockText.trim().length < 3) return null;

  const lines = blockText.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  if (lines.length === 0) return null;

  // Option pattern: "(A)", "A)", "A.", "A:", "[A]", lowercase same, also 1-4
  const OPT_RE = /^[\(\[]?\s*([A-Da-d1-4])\s*[\)\]\.\:]\s*(.*)$/;

  const questionLines = [];
  const imageKeys = [];       // __IMG__ keys found in this block
  const optionMap = {};       // { A:'', B:'', C:'', D:'' }
  const answerLines = [];
  const explanationLines = [];
  let seenOptions = false;
  let inExplanation = false;

  for (const line of lines) {
    // ── Page markers (PDF artifacts) ─────────────────────────────
    if (/^---\s*Page\s*\d+\s*---$/.test(line)) continue;

    // ── Image placeholder ─────────────────────────────────────────
    const imgMatches = line.match(/['"]?__IMG__(\S+?)__['"]?/g);
    if (imgMatches) {
      imgMatches.forEach(m => {
        const k = m.replace(/['"]?__IMG__/, '').replace(/__['"]?/, '');
        if (k && !imageKeys.includes(k)) imageKeys.push(k);
      });
      // If line only contains the image placeholder, don't pollute questionLines
      if (/^['"]?__IMG__\S+?__['"]?$/.test(line)) {
        continue;
      }
    }

    // ── Answer indicator ──────────────────────────────────────────
    if (/^(?:Ans(?:wer)?|Correct(?:\s+Option)?|Key)\s*[:=\-–]/i.test(line)) {
      answerLines.push(line);
      inExplanation = false;
      continue;
    }

    // ── Explanation ───────────────────────────────────────────────
    if (/^(?:Exp(?:lanation)?|Reason|Hint|Sol(?:ution)?)\s*[:=\-–]/i.test(line)) {
      inExplanation = true;
      explanationLines.push(line);
      continue;
    }
    if (inExplanation) { explanationLines.push(line); continue; }

    // ── Option line ───────────────────────────────────────────────
    const optM = OPT_RE.exec(line);
    if (optM) {
      let key = optM[1].toUpperCase();
      if (key === '1') key = 'A';
      if (key === '2') key = 'B';
      if (key === '3') key = 'C';
      if (key === '4') key = 'D';
      const val = (optM[2] || '').trim();
      if (['A', 'B', 'C', 'D'].includes(key)) {
        optionMap[key] = optionMap[key] ? optionMap[key] + ' ' + val : val;
        seenOptions = true;
        continue;
      }
    }

    // ── Inline multi-option: "A) text  B) text  C) text  D) text" ─
    const inlineCount = (line.match(/\b[A-Da-d]\s*[\).]/g) || []).length;
    if (inlineCount >= 2) {
      const inlineRe = /\b([A-Da-d])\s*[\).]\s*([^A-Da-d\n]+?)(?=\s+[A-Da-d]\s*[\).]\s|$)/g;
      let im;
      let foundInline = false;
      while ((im = inlineRe.exec(line)) !== null) {
        let key = im[1].toUpperCase();
        if (key === '1') key = 'A';
        if (key === '2') key = 'B';
        if (key === '3') key = 'C';
        if (key === '4') key = 'D';
        const val = im[2].trim();
        if (['A', 'B', 'C', 'D'].includes(key) && val) {
          optionMap[key] = val;
          foundInline = true;
        }
      }
      if (foundInline) { seenOptions = true; continue; }
    }

    // ── Section/header line — skip ────────────────────────────────
    if (/^(?:section|part|chapter)\s+/i.test(line) && line.length < 80) continue;

    // ── Regular question text ─────────────────────────────────────
    if (!seenOptions) {
      questionLines.push(line);
    }
  }

  // Resolve option images: if an option value has __IMG__key__ or is an image placeholder
  ['A', 'B', 'C', 'D'].forEach(opt => {
    let optVal = optionMap[opt] || '';
    const optImgMatch = optVal.match(/['"]?__IMG__(\S+?)__['"]?/);
    if (optImgMatch) {
      const k = optImgMatch[1];
      const src = (images && images[k]) || (getExtractedImages()[k]);
      if (src) {
        optVal = optVal.replace(optImgMatch[0], src).trim();
      }
    }
    optionMap[opt] = optVal;
  });

  // Build question text
  let questionText = questionLines.join('\n').trim();
  // Strip raw __IMG__ tokens from questionText to avoid showing raw text
  let cleanedQuestionText = questionText.replace(/['"]?__IMG__\S+?__['"]?/g, '').trim();

  // Primary image
  const primaryImgKey = imageKeys[0] || '';
  const primaryImgSrc = (images && primaryImgKey && images[primaryImgKey]) || (getExtractedImages()[primaryImgKey]) || '';

  if (!cleanedQuestionText && primaryImgSrc) {
    cleanedQuestionText = `Look at the given diagram and choose the correct option:`;
  }

  if (cleanedQuestionText.length < 2 && !primaryImgSrc) return null;

  // Detect correct answer
  let correctOption = 'A';
  const ansText = [...answerLines, blockText].join(' ');
  const ansM = ansText.match(/(?:Ans(?:wer)?|Correct(?:\s+Option)?|Key)\s*[:=\-–]?\s*[\(\[]?\s*([A-D1-4])\s*[\)\]\.]?/i);
  if (ansM) {
    let opt = ansM[1].toUpperCase();
    if (opt === '1') opt = 'A';
    if (opt === '2') opt = 'B';
    if (opt === '3') opt = 'C';
    if (opt === '4') opt = 'D';
    if (['A', 'B', 'C', 'D'].includes(opt)) correctOption = opt;
  }

  // Explanation
  const explanation = explanationLines
    .join(' ')
    .replace(/^(?:Exp(?:lanation)?|Reason|Hint|Sol(?:ution)?)\s*[:=\-–]\s*/i, '')
    .trim();

  const qId = Date.now() + idx * 1000 + Math.floor(Math.random() * 999);
  const qTextFinal = cleanedQuestionText || questionText;

  if (primaryImgSrc) {
    try {
      saveImageToStore(String(qId), primaryImgSrc);
      const norm = (qTextFinal || '').replace(/^(\d+[\.\)\s]+)/, '').replace(/\s+/g, ' ').trim().toLowerCase();
      if (norm) saveImageToStore(norm, primaryImgSrc);
    } catch (_) {}
  }

  return {
    id: qId,
    q: qTextFinal,
    question_text: qTextFinal,
    option_a: optionMap['A'] || '',
    option_b: optionMap['B'] || '',
    option_c: optionMap['C'] || '',
    option_d: optionMap['D'] || '',
    correct_option: correctOption,
    explanation,
    difficulty: detectDifficulty(qTextFinal),
    marks: 1.0,
    negative_marks: 0.25,
    status: 'active',
    question_image: primaryImgSrc,
    image_url: primaryImgSrc,
    diagram: primaryImgSrc,
    diagrams: imageKeys.map(k => (images && images[k]) || getExtractedImages()[k]).filter(Boolean),
    image: primaryImgSrc,
    figure: primaryImgSrc,
    question_image_keys: imageKeys,
    _imgStore: images || {}
  };
}

// ─── CSV parser ───────────────────────────────────────────────────────────────
function parseCsv(csv) {
  const lines = csv.split(/\r?\n/).filter(l => l.trim().length > 0);
  if (lines.length <= 1) return [];
  const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/^["']|["']$/g, ''));
  const qs = [];

  for (let i = 1; i < lines.length; i++) {
    const parts = csvLine(lines[i]);
    if (parts.length < 4) continue;

    const gi = (fn) => headers.findIndex(fn);
    const qIdx  = gi(h => h.includes('question'));
    const aIdx  = gi(h => h === 'option_a' || h === 'option a' || h === 'a');
    const bIdx  = gi(h => h === 'option_b' || h === 'option b' || h === 'b');
    const cIdx  = gi(h => h === 'option_c' || h === 'option c' || h === 'c');
    const dIdx  = gi(h => h === 'option_d' || h === 'option d' || h === 'd');
    const ansIdx = gi(h => h.includes('correct') || h.includes('answer'));
    const expIdx = gi(h => h.includes('explanation') || h.includes('solution'));

    const qText = parts[qIdx >= 0 ? qIdx : 0] || '';
    if (!qText.trim()) continue;

    let ans = (parts[ansIdx >= 0 ? ansIdx : 5] || 'A').toUpperCase().trim();
    if (ans === '1') ans = 'A';
    if (ans === '2') ans = 'B';
    if (ans === '3') ans = 'C';
    if (ans === '4') ans = 'D';

    qs.push({
      id: Date.now() + i,
      question_text: qText,
      option_a: parts[aIdx >= 0 ? aIdx : 1] || '',
      option_b: parts[bIdx >= 0 ? bIdx : 2] || '',
      option_c: parts[cIdx >= 0 ? cIdx : 3] || '',
      option_d: parts[dIdx >= 0 ? dIdx : 4] || '',
      correct_option: ['A', 'B', 'C', 'D'].includes(ans) ? ans : 'A',
      explanation: parts[expIdx >= 0 ? expIdx : 6] || '',
      difficulty: 'medium', marks: 1.0, negative_marks: 0.25, status: 'active',
      question_image_keys: []
    });
  }
  return qs;
}

function csvLine(line) {
  const p = []; let cur = ''; let inQ = false;
  for (const c of line) {
    if (c === '"') { inQ = !inQ; }
    else if (c === ',' && !inQ) { p.push(cur.trim().replace(/^["']|["']$/g, '')); cur = ''; }
    else { cur += c; }
  }
  p.push(cur.trim().replace(/^["']|["']$/g, ''));
  return p;
}

function detectDifficulty(text) {
  const l = text.toLowerCase();
  if (l.includes('calculate') || l.includes('prove') || l.includes('evaluate') || l.includes('ratio')) return 'hard';
  if (l.includes('what is') || l.includes('identify') || l.includes('name the') || l.includes('which')) return 'easy';
  return 'medium';
}

export default { extractTextFromFile, extractFromFile, parseQuestionsFromText, getExtractedImages };
