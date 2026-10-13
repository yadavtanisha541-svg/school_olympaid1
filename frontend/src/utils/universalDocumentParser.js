// OlympiadHub - Universal Document & Question Parser v3.0
// Fixes: Each question parsed separately, options A/B/C/D always extracted correctly,
// diagrams embedded inside correct question, no question merging

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
      try { if (window.pdfjsLib) window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js'; } catch(e){}
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

// ─── Image cache ──────────────────────────────────────────────────────────────
let _images = {};
export function getExtractedImages() { return _images; }

// ─── Main extractor ───────────────────────────────────────────────────────────
/**
 * Extract text + images from a file.
 * Returns { text: string, images: {key: dataUrl} }
 */
export async function extractFromFile(file) {
  _images = {};
  const name = file.name.toLowerCase();

  // ── Plain text / CSV / TSV ─────────────────────────────────────────────────
  if (name.endsWith('.csv') || name.endsWith('.txt') || name.endsWith('.tsv') || file.type.includes('text/')) {
    const text = await file.text();
    return { text, images: {} };
  }

  // ── Word (.docx / .doc) ────────────────────────────────────────────────────
  if (name.endsWith('.docx') || name.endsWith('.doc')) {
    const buf = await file.arrayBuffer();
    let imgIdx = 0;

    try {
      const mammoth = await getMammoth();
      if (mammoth) {
        // convertToHtml extracts inline images as base64
        const result = await mammoth.convertToHtml(
          { arrayBuffer: buf },
          {
            convertImage: mammoth.images.imgElement((img) =>
              img.read('base64').then((b64) => {
                const key = `docx_img_${++imgIdx}`;
                const dataUrl = `data:${img.contentType};base64,${b64}`;
                _images[key] = dataUrl;
                // placeholder that text parser will embed into question text
                return { src: `__IMG__${key}__` };
              })
            )
          }
        );

        if (result && result.value && result.value.trim().length > 0) {
          // HTML → structured lines
          const text = htmlToLines(result.value);
          return { text, images: { ..._images } };
        }

        // fallback: raw text
        const raw = await mammoth.extractRawText({ arrayBuffer: buf });
        if (raw && raw.value && raw.value.trim().length > 0) {
          return { text: raw.value, images: {} };
        }
      }
    } catch (e) {
      console.warn('Mammoth failed:', e);
    }

    // XML fallback
    try {
      const u8 = new Uint8Array(buf);
      const str = new TextDecoder('utf-8').decode(u8);
      const matches = str.match(/<w:t[^>]*>([^<]+)<\/w:t>/g);
      if (matches && matches.length > 0) {
        const t = matches.map(m => m.replace(/<[^>]+>/g, '')).join(' ');
        if (t.trim().length > 20) return { text: t, images: {} };
      }
    } catch (e) {}

    throw new Error('Cannot parse this Word file. Please save as .docx or paste text directly.');
  }

  // ── PDF (.pdf) ─────────────────────────────────────────────────────────────
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

          // group items into lines by Y coordinate
          const lineMap = {};
          for (const item of content.items) {
            const y = Math.round(item.transform[5]);
            if (!lineMap[y]) lineMap[y] = [];
            lineMap[y].push(item.str);
          }
          const ys = Object.keys(lineMap).map(Number).sort((a, b) => b - a); // top to bottom
          const pageLines = ys.map(y => lineMap[y].join(' ').trim()).filter(l => l.length > 0);
          fullText += pageLines.join('\n') + '\n\n';

          // check for images
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
              const ctx = canvas.getContext('2d');
              await page.render({ canvasContext: ctx, viewport: vp }).promise;
              const key = `pdf_page_${p}`;
              _images[key] = canvas.toDataURL('image/png');
              fullText += `\n__IMG__${key}__\n`;
            }
          } catch (re) { console.warn('PDF render err page', p, re); }
        }

        if (fullText.trim().length > 10) return { text: fullText, images: { ..._images } };
      }
    } catch (e) {
      console.warn('PDF.js failed:', e);
    }

    // stream fallback
    try {
      const u8 = new Uint8Array(buf);
      const s = new TextDecoder('latin1').decode(u8);
      const m = s.match(/\((.*?)\)\s*Tj/g);
      if (m && m.length > 0) {
        const t = m.map(x => x.replace(/^\(/, '').replace(/\)\s*Tj$/, '')).join(' ');
        if (t.trim().length > 30) return { text: t, images: {} };
      }
    } catch (e) {}

    throw new Error('Cannot extract text from this PDF. If scanned, please paste text directly.');
  }

  throw new Error(`Unsupported file: ${file.name}. Use .docx, .pdf, or .csv`);
}

/** Legacy wrapper — returns only text */
export async function extractTextFromFile(file) {
  const { text } = await extractFromFile(file);
  return text;
}

// ─── HTML → plain-text lines ──────────────────────────────────────────────────
function htmlToLines(html) {
  // Replace block-ending tags with newlines
  let s = html
    .replace(/<\/p>/gi, '\n')
    .replace(/<\/li>/gi, '\n')
    .replace(/<\/tr>/gi, '\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/h[1-6]>/gi, '\n');

  // Keep img src placeholders that mammoth embedded (__IMG__key__)
  // Replace <img src="__IMG__key__" ...> with the placeholder text
  s = s.replace(/<img[^>]+src="(__IMG__[^"]+)"[^>]*>/gi, '\n$1\n');

  // Strip remaining HTML tags
  s = s.replace(/<[^>]+>/g, '');

  // Decode entities
  s = s.replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"');

  // Collapse multiple blank lines
  s = s.replace(/\n{3,}/g, '\n\n');
  return s.trim();
}

// ─── Public parse entry point ─────────────────────────────────────────────────
export function parseQuestionsFromText(text) {
  if (!text || typeof text !== 'string') return [];
  const t = text.trim();

  // CSV with headers
  if (t.includes(',') && (t.toLowerCase().includes('question_text') || t.toLowerCase().includes('option_a'))) {
    return parseCsv(t);
  }

  return parseExamText(t);
}

// ─── Main exam text parser ────────────────────────────────────────────────────
function parseExamText(raw) {
  // Normalise
  const text = raw
    .replace(/\r\n/g, '\n').replace(/\r/g, '\n')
    .replace(/[\u2018\u2019]/g, "'").replace(/[\u201C\u201D]/g, '"')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n /g, '\n')
    .replace(/\n{3,}/g, '\n\n');

  // Split into question blocks
  const blocks = splitIntoQuestionBlocks(text);
  if (blocks.length === 0) return [];

  return blocks
    .map((block, i) => parseBlock(block, i))
    .filter(Boolean);
}

// ─── Split text into question blocks ─────────────────────────────────────────
/**
 * Splits text into separate question blocks.
 * A question block starts when a line begins with a question number pattern.
 * Examples: "1.", "Q1.", "Q1)", "Q.1", "Question 1:", "(1)", "[1]", "1)"
 */
function splitIntoQuestionBlocks(text) {
  const lines = text.split('\n');
  const blocks = [];
  let current = [];

  // Strict question-start detector: must be at line start, number 1-999
  const isQuestionStart = (line) => {
    const t = line.trim();
    return (
      /^Q(?:uestion)?\s*\.?\s*\d{1,3}\s*[.:\)\-]/i.test(t) ||   // Q1. Q1) Question 1: Q.1.
      /^\d{1,3}\s*[.)]\s+\S/.test(t) ||                           // 1. text  or  1) text
      /^\(\s*\d{1,3}\s*\)\s+\S/.test(t) ||                        // (1) text
      /^\[\s*Q?\s*\d{1,3}\s*\]\s+\S/.test(t)                     // [Q1] text  [1] text
    );
  };

  for (const line of lines) {
    if (isQuestionStart(line)) {
      // Save previous block
      if (current.length > 0) {
        const b = current.join('\n').trim();
        if (b.length > 5) blocks.push(b);
      }
      // Strip the question-number prefix from the first line
      const stripped = line.trim().replace(/^(?:Q(?:uestion)?\s*\.?\s*\d{1,3}\s*[.:\)\-]\s*|\d{1,3}\s*[.)]\s+|\(\s*\d{1,3}\s*\)\s+|\[\s*Q?\s*\d{1,3}\s*\]\s+)/i, '');
      current = [stripped];
    } else {
      current.push(line);
    }
  }
  // Last block
  if (current.length > 0) {
    const b = current.join('\n').trim();
    if (b.length > 5) blocks.push(b);
  }

  return blocks;
}

// ─── Parse a single question block ───────────────────────────────────────────
function parseBlock(blockText, idx) {
  if (!blockText || blockText.trim().length < 5) return null;

  const lines = blockText.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  if (lines.length === 0) return null;

  // ── Option line detector ─────────────────────────────────────────
  // Matches: "(A) text", "A) text", "A. text", "A: text", "[A] text"
  // Also: "(1) text", "1) text" mapped to A/B/C/D
  const OPTION_RE = /^[\(\[]?\s*([A-Da-d1-4])\s*[\)\]\.\:]\s+(.+)$/;

  const questionLines = [];
  const optionLines = {}; // { A:'...', B:'...', C:'...', D:'...' }
  const explanationLines = [];
  const answerLines = [];
  let seenOptions = false;
  let inExplanation = false;

  for (const line of lines) {
    // ── Skip page markers ────────────────────────────────────────
    if (/^---\s*Page\s*\d+\s*---$/i.test(line)) continue;

    // ── Answer line ──────────────────────────────────────────────
    if (/^(?:Ans(?:wer)?|Correct(?:\s+Option)?|Key)\s*[:=\-–]/i.test(line)) {
      answerLines.push(line);
      inExplanation = false;
      continue;
    }

    // ── Explanation line ─────────────────────────────────────────
    if (/^(?:Exp(?:lanation)?|Reason|Hint|Sol(?:ution)?)\s*[:=\-–]/i.test(line)) {
      inExplanation = true;
      explanationLines.push(line);
      continue;
    }
    if (inExplanation) {
      explanationLines.push(line);
      continue;
    }

    // ── Image placeholder ────────────────────────────────────────
    if (/^__IMG__[^_]+__$/.test(line)) {
      questionLines.push(line);
      continue;
    }

    // ── Option line (single line) ────────────────────────────────
    const optM = OPTION_RE.exec(line);
    if (optM) {
      let key = optM[1].toUpperCase();
      if (key === '1') key = 'A';
      if (key === '2') key = 'B';
      if (key === '3') key = 'C';
      if (key === '4') key = 'D';
      if (['A', 'B', 'C', 'D'].includes(key)) {
        const val = optM[2].trim();
        optionLines[key] = (optionLines[key] ? optionLines[key] + ' ' : '') + val;
        seenOptions = true;
        continue;
      }
    }

    // ── Inline multi-option on ONE line ────────────────────────
    // e.g. "A) 12 kg  B) 9 kg  C) 15 kg  D) 8 kg"
    // Only try if line contains at least 2 option markers
    const inlineCount = (line.match(/\b[A-Da-d]\s*[\)\.]\s/g) || []).length;
    if (inlineCount >= 2) {
      const inlineRe = /\b([A-Da-d])\s*[\)\.]\s+([^A-Da-d\)\.]+?)(?=\s+[A-Da-d]\s*[\)\.]\s|$)/g;
      let m;
      let found = false;
      while ((m = inlineRe.exec(line)) !== null) {
        let key = m[1].toUpperCase();
        if (key === '1') key = 'A';
        if (key === '2') key = 'B';
        if (key === '3') key = 'C';
        if (key === '4') key = 'D';
        const val = m[2].trim();
        if (['A', 'B', 'C', 'D'].includes(key) && val) {
          optionLines[key] = val;
          found = true;
        }
      }
      if (found) {
        seenOptions = true;
        continue;
      }
    }

    // ── If we've already seen options, remaining text is extra ───
    // (don't add it to question text)
    if (!seenOptions) {
      questionLines.push(line);
    }
  }

  // Build question text
  const questionText = questionLines.join('\n').trim();
  if (questionText.length < 3) return null;

  // Detect correct option
  let correctOption = 'A';
  const ansText = [...answerLines, blockText].join(' ');
  const ansM = ansText.match(/(?:Ans(?:wer)?|Correct(?:\s+Option)?|Key)\s*[:=\-–]?\s*[\(\[]?\s*([A-D1-4])\s*[\)\]\.:]?/i);
  if (ansM) {
    let opt = ansM[1].toUpperCase();
    if (opt === '1') opt = 'A';
    if (opt === '2') opt = 'B';
    if (opt === '3') opt = 'C';
    if (opt === '4') opt = 'D';
    if (['A', 'B', 'C', 'D'].includes(opt)) correctOption = opt;
  }

  // Build explanation
  const explanation = explanationLines
    .join(' ')
    .replace(/^(?:Exp(?:lanation)?|Reason|Hint|Sol(?:ution)?)\s*[:=\-–]\s*/i, '')
    .trim();

  // Extract image placeholder keys from question text
  const imgRefs = [...(questionText.matchAll(/__IMG__([^_]+)__/g))].map(m => m[1]);

  return {
    id: Date.now() + idx * 100 + Math.floor(Math.random() * 100),
    question_text: questionText,
    option_a: optionLines['A'] || '',
    option_b: optionLines['B'] || '',
    option_c: optionLines['C'] || '',
    option_d: optionLines['D'] || '',
    correct_option: correctOption,
    explanation,
    difficulty: detectDifficulty(questionText),
    marks: 1.0,
    negative_marks: 0.25,
    status: 'active',
    question_image_keys: imgRefs   // keys into the global _images map
  };
}

// ─── CSV parser ───────────────────────────────────────────────────────────────
function parseCsv(csv) {
  const lines = csv.split(/\r?\n/).filter(l => l.trim().length > 0);
  if (lines.length <= 1) return [];

  const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/^["']|["']$/g, ''));
  const questions = [];

  for (let i = 1; i < lines.length; i++) {
    const parts = csvSplitLine(lines[i]);
    if (parts.length < 4) continue;

    const qIdx  = headers.findIndex(h => h.includes('question'));
    const aIdx  = headers.findIndex(h => h === 'option_a' || h === 'option a' || h === 'a');
    const bIdx  = headers.findIndex(h => h === 'option_b' || h === 'option b' || h === 'b');
    const cIdx  = headers.findIndex(h => h === 'option_c' || h === 'option c' || h === 'c');
    const dIdx  = headers.findIndex(h => h === 'option_d' || h === 'option d' || h === 'd');
    const ansIdx = headers.findIndex(h => h.includes('correct') || h.includes('answer'));
    const expIdx = headers.findIndex(h => h.includes('explanation') || h.includes('solution'));

    const qText = parts[qIdx >= 0 ? qIdx : 0] || '';
    if (!qText.trim()) continue;

    let rawAns = (parts[ansIdx >= 0 ? ansIdx : 5] || 'A').toUpperCase().trim();
    if (rawAns === '1') rawAns = 'A';
    if (rawAns === '2') rawAns = 'B';
    if (rawAns === '3') rawAns = 'C';
    if (rawAns === '4') rawAns = 'D';

    questions.push({
      id: Date.now() + i,
      question_text: qText,
      option_a: parts[aIdx >= 0 ? aIdx : 1] || '',
      option_b: parts[bIdx >= 0 ? bIdx : 2] || '',
      option_c: parts[cIdx >= 0 ? cIdx : 3] || '',
      option_d: parts[dIdx >= 0 ? dIdx : 4] || '',
      correct_option: ['A', 'B', 'C', 'D'].includes(rawAns) ? rawAns : 'A',
      explanation: parts[expIdx >= 0 ? expIdx : 6] || '',
      difficulty: 'medium',
      marks: 1.0,
      negative_marks: 0.25,
      status: 'active',
      question_image_keys: []
    });
  }

  return questions;
}

function csvSplitLine(line) {
  const parts = [];
  let cur = '';
  let inQ = false;
  for (const c of line) {
    if (c === '"') { inQ = !inQ; }
    else if (c === ',' && !inQ) { parts.push(cur.trim().replace(/^["']|["']$/g, '')); cur = ''; }
    else { cur += c; }
  }
  parts.push(cur.trim().replace(/^["']|["']$/g, ''));
  return parts;
}

function detectDifficulty(text) {
  const l = text.toLowerCase();
  if (l.includes('calculate') || l.includes('prove') || l.includes('evaluate') || l.includes('ratio')) return 'hard';
  if (l.includes('what is') || l.includes('identify') || l.includes('name the') || l.includes('which')) return 'easy';
  return 'medium';
}

export default { extractTextFromFile, extractFromFile, parseQuestionsFromText, getExtractedImages };
