// OlympiadHub - Universal Document & Question Parser (Word .docx/.doc, PDF, CSV, TXT)
// v2.0 - Full options extraction, diagram/image support, accurate multi-format parsing

// Dynamic CDN Loader for Mammoth (.docx) and PDF.js (.pdf) with resilient fallbacks
let pdfjsPromise = null;
export async function getPdfJs() {
  if (typeof window === 'undefined') return null;
  if (window.pdfjsLib) return window.pdfjsLib;
  if (pdfjsPromise) return pdfjsPromise;

  pdfjsPromise = new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
    script.async = true;
    script.onload = () => {
      try {
        if (window.pdfjsLib) {
          window.pdfjsLib.GlobalWorkerOptions.workerSrc =
            'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
        }
      } catch (e) {}
      resolve(window.pdfjsLib || null);
    };
    script.onerror = () => resolve(null);
    document.head.appendChild(script);
  });

  return pdfjsPromise;
}

let mammothPromise = null;
export async function getMammoth() {
  if (typeof window === 'undefined') return null;
  if (window.mammoth) return window.mammoth;
  if (mammothPromise) return mammothPromise;

  mammothPromise = new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js';
    script.async = true;
    script.onload = () => resolve(window.mammoth || null);
    script.onerror = () => resolve(null);
    document.head.appendChild(script);
  });

  return mammothPromise;
}

// ─────────────────────────────────────────────────────────────────
// IMAGE EXTRACTION RESULT CACHE  { filename → dataUrl }
// ─────────────────────────────────────────────────────────────────
let _extractedImages = {};

export function getExtractedImages() {
  return _extractedImages;
}

/**
 * Extracts text AND images from a File object (DOCX, PDF, CSV, TXT)
 * Returns: { text: string, images: Record<string, string /* dataURL *\/> }
 */
export async function extractFromFile(file) {
  _extractedImages = {};
  const fileName = file.name.toLowerCase();

  // 1. Plain Text / CSV
  if (fileName.endsWith('.csv') || fileName.endsWith('.txt') || fileName.endsWith('.tsv') || file.type.includes('text/')) {
    const text = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result || '');
      reader.onerror = reject;
      reader.readAsText(file);
    });
    return { text, images: {} };
  }

  // 2. Word Document (.docx / .doc) — extract HTML (preserves images)
  if (fileName.endsWith('.docx') || fileName.endsWith('.doc')) {
    const arrayBuffer = await file.arrayBuffer();

    try {
      const mammoth = await getMammoth();
      if (mammoth) {
        // convertToHtml embeds images as base64 data-URIs inside <img> tags
        const htmlResult = await mammoth.convertToHtml(
          { arrayBuffer },
          {
            convertImage: mammoth.images.imgElement((image) => {
              return image.read('base64').then((base64) => {
                const dataUrl = `data:${image.contentType};base64,${base64}`;
                const key = `img_${Object.keys(_extractedImages).length + 1}`;
                _extractedImages[key] = dataUrl;
                // Return img src referencing our key so text parser can find it
                return { src: `__IMG__${key}__` };
              });
            })
          }
        );

        if (htmlResult && htmlResult.value && htmlResult.value.trim().length > 0) {
          // Convert HTML to plain text while preserving image placeholders and line breaks
          const rawHtml = htmlResult.value;
          // Insert newlines at block-level tags
          const withBreaks = rawHtml
            .replace(/<\/p>/gi, '\n')
            .replace(/<br\s*\/?>/gi, '\n')
            .replace(/<\/li>/gi, '\n')
            .replace(/<\/tr>/gi, '\n')
            .replace(/<\/h[1-6]>/gi, '\n');
          // Strip remaining HTML tags EXCEPT our image placeholders
          const text = withBreaks.replace(/<(?!__IMG__)[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
          return { text, images: _extractedImages };
        }

        // Fallback: raw text only
        const rawResult = await mammoth.extractRawText({ arrayBuffer });
        if (rawResult && rawResult.value && rawResult.value.trim().length > 0) {
          return { text: rawResult.value, images: {} };
        }
      }
    } catch (e) {
      console.warn('Mammoth extraction failed:', e);
    }

    // XML fallback for docx
    try {
      const uint8 = new Uint8Array(arrayBuffer);
      const textDecoder = new TextDecoder('utf-8');
      const rawStr = textDecoder.decode(uint8);
      const matches = rawStr.match(/<w:t[^>]*>([^<]+)<\/w:t>/g);
      if (matches && matches.length > 0) {
        const extracted = matches.map(m => m.replace(/<[^>]+>/g, '')).join(' ').replace(/<\/w:p>/g, '\n');
        if (extracted.trim().length > 20) return { text: extracted, images: {} };
      }
    } catch (err) {
      console.warn('Fallback docx parser error:', err);
    }

    throw new Error('Unable to parse Word document. Please ensure it is a valid .docx file or copy-paste text directly.');
  }

  // 3. PDF Document (.pdf) — text + page images via canvas
  if (fileName.endsWith('.pdf')) {
    const arrayBuffer = await file.arrayBuffer();

    try {
      const pdfjs = await getPdfJs();
      if (pdfjs && pdfjs.getDocument) {
        const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
        const pdf = await loadingTask.promise;
        let fullText = '';
        const pdfImages = {};

        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
          const page = await pdf.getPage(pageNum);

          // Extract text
          const textContent = await page.getTextContent();
          let lastY;
          let pageText = '';
          for (const item of textContent.items) {
            if (lastY !== undefined && Math.abs(item.transform[5] - lastY) > 5) {
              pageText += '\n';
            }
            pageText += item.str + ' ';
            lastY = item.transform[5];
          }
          fullText += `\n--- Page ${pageNum} ---\n` + pageText + '\n';

          // Render page to canvas → capture as image if it has non-trivial graphics
          try {
            const viewport = page.getViewport({ scale: 1.5 });
            const canvas = document.createElement('canvas');
            canvas.width = viewport.width;
            canvas.height = viewport.height;
            const ctx = canvas.getContext('2d');
            await page.render({ canvasContext: ctx, viewport }).promise;

            // Only store the page image if the page contains images/operators beyond simple text
            const ops = await page.getOperatorList();
            const hasImages = ops.fnArray.some(fn => fn === pdfjs.OPS?.paintJpegXObject || fn === pdfjs.OPS?.paintImageXObject || fn === pdfjs.OPS?.paintInlineImageXObject || fn === 82 || fn === 83 || fn === 84 || fn === 92);

            if (hasImages) {
              const dataUrl = canvas.toDataURL('image/png');
              const key = `pdf_page_${pageNum}`;
              pdfImages[key] = dataUrl;
              _extractedImages[key] = dataUrl;
              fullText += `\n__IMG__${key}__\n`;
            }
          } catch (renderErr) {
            console.warn('PDF page render error:', renderErr);
          }
        }

        if (fullText.trim().length > 10) {
          return { text: fullText, images: { ..._extractedImages, ...pdfImages } };
        }
      }
    } catch (e) {
      console.warn('PDF.js extraction failed, trying stream fallback:', e);
    }

    // Fallback PDF stream regex
    try {
      const uint8 = new Uint8Array(arrayBuffer);
      const rawStr = new TextDecoder('latin1').decode(uint8);
      const streamMatches = rawStr.match(/\((.*?)\)\s*Tj/g);
      if (streamMatches && streamMatches.length > 0) {
        const extracted = streamMatches.map(m => m.replace(/^\(/, '').replace(/\)\s*Tj$/, '')).join(' ');
        if (extracted.trim().length > 30) return { text: extracted, images: {} };
      }
    } catch (err) {}

    throw new Error('Unable to extract text from PDF. If it contains scanned images, please copy-paste text or upload a Word/CSV file.');
  }

  throw new Error(`Unsupported file type: ${fileName}. Please upload a Word (.docx), PDF (.pdf), or CSV (.csv) file.`);
}

/**
 * Legacy wrapper — returns plain text only (for backward compat)
 */
export async function extractTextFromFile(file) {
  const { text } = await extractFromFile(file);
  return text;
}

/**
 * Parses raw text extracted from Word, PDF, or CSV into structured Olympiad Questions
 */
export function parseQuestionsFromText(text) {
  if (!text || typeof text !== 'string') return [];
  const trimmed = text.trim();

  // CSV / TSV with headers
  if (trimmed.includes(',') && (trimmed.toLowerCase().includes('question_text') || trimmed.toLowerCase().includes('option_a'))) {
    return parseCsvQuestions(trimmed);
  }

  return parseFormattedExamText(trimmed);
}

// ─────────────────────────────────────────────────────────────────
// CORE TEXT PARSER  (handles all standard Olympiad paper formats)
// ─────────────────────────────────────────────────────────────────
function parseFormattedExamText(rawText) {
  // Normalize
  const clean = rawText
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\t\f]/g, ' ')
    .replace(/[ \t]+\n/g, '\n')            // trailing spaces before newline
    .replace(/\n{3,}/g, '\n\n');           // collapse multiple blank lines

  const questions = [];

  // ── Split into Question Blocks ──────────────────────────────────
  // Matches: "1.", "Q1.", "Q.1", "Question 1:", "(1)", "[Q1]"  at line start
  const qHeaderRe = /(?:^|\n)\s*(?:(?:Q(?:uestion)?\s*\.?\s*(\d+)\s*[\.\:\)\-])|(?:(\d+)\s*[\.\:\)]\s+)|(?:\((\d+)\)\s+)|(?:\[Q(\d+)\]\s*))/i;

  const split = splitByPattern(clean, qHeaderRe);

  split.forEach((block, idx) => {
    const q = parseOneBlock(block, idx);
    if (q) questions.push(q);
  });

  return questions;
}

/**
 * Splits text into blocks separated by question headers (regex with groups)
 */
function splitByPattern(text, re) {
  const blocks = [];
  const lines = text.split('\n');
  let current = [];

  for (const line of lines) {
    if (re.test(line)) {
      if (current.length > 0) {
        blocks.push(current.join('\n').trim());
      }
      // Start new block — strip the question header prefix
      const stripped = line.replace(/^\s*(?:(?:Q(?:uestion)?\s*\.?\s*\d+\s*[\.\:\)\-])|(?:\d+\s*[\.\:\)]\s+)|(?:\(\d+\)\s+)|(?:\[Q\d+\]\s*))/, '').trim();
      current = stripped ? [stripped] : [];
    } else {
      current.push(line);
    }
  }
  if (current.length > 0) {
    blocks.push(current.join('\n').trim());
  }
  return blocks.filter(b => b.length > 5);
}

/**
 * Parse a single question block into a structured question object.
 * Handles multiple option formats:
 *   (A)  A)  A.  A:  [A]  a)  (a)
 *   (1)  1)  1.   etc.
 */
function parseOneBlock(block, idx) {
  if (!block || block.length < 5) return null;

  const lines = block.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  if (lines.length === 0) return null;

  // Detect line-level option pattern
  // Matches at start of line: "(A)", "A)", "A.", "A:", "[A]", "a)", "(a)", "(1)", "1)", "1."
  const optLineRe = /^(?:[\(\[]?\s*([A-Da-d1-4])\s*[\)\]\.\:]\s+)(.+)$/;

  // Find option lines
  const optionLines = {}; // key→text  e.g. { A: '79', B: '80', C: '99', D: '81' }
  const questionLines = [];
  const explanationLines = [];
  const answerLines = [];
  let inExplanation = false;

  for (const line of lines) {
    // Check answer line
    if (/^(?:Ans(?:wer)?|Correct(?: Option)?|Key|Sol(?:ution)?)\s*[:=\-–]/i.test(line)) {
      answerLines.push(line);
      inExplanation = false;
      continue;
    }
    // Check explanation line
    if (/^(?:Exp(?:lanation)?|Reason|Hint|Sol(?:ution)?)\s*[:=\-–]/i.test(line)) {
      inExplanation = true;
      explanationLines.push(line);
      continue;
    }
    if (inExplanation) {
      explanationLines.push(line);
      continue;
    }

    // Check option line
    const optMatch = optLineRe.exec(line);
    if (optMatch) {
      let key = optMatch[1].toUpperCase();
      if (key === '1') key = 'A';
      if (key === '2') key = 'B';
      if (key === '3') key = 'C';
      if (key === '4') key = 'D';
      const val = optMatch[2].trim();
      // Only accept A B C D (not extra option letters)
      if (['A', 'B', 'C', 'D'].includes(key)) {
        optionLines[key] = val;
        continue;
      }
    }

    // ── Inline multi-option on same line ───────────────────────────
    // e.g. "A) 79  B) 80  C) 99  D) 81"
    const inlineRe = /\b([A-Da-d1-4])\s*[\)\]\.:]\s*([^A-Da-d\)\]\.:]+?)(?=\s+[A-Da-d1-4]\s*[\)\]\.:]\s|$)/g;
    let inlineMatch;
    let hasInline = false;
    const tmpLine = line;
    while ((inlineMatch = inlineRe.exec(tmpLine)) !== null) {
      let key = inlineMatch[1].toUpperCase();
      if (key === '1') key = 'A';
      if (key === '2') key = 'B';
      if (key === '3') key = 'C';
      if (key === '4') key = 'D';
      if (['A', 'B', 'C', 'D'].includes(key) && inlineMatch[2].trim().length > 0) {
        optionLines[key] = inlineMatch[2].trim();
        hasInline = true;
      }
    }
    if (hasInline) continue;

    // Otherwise it's a question text line or image placeholder
    questionLines.push(line);
  }

  // Build question text (preserve image placeholders)
  let questionText = questionLines.join(' ').trim();
  // Remove any trailing option-like suffixes that bled into the question (edge case)
  questionText = questionText
    .replace(/\s+(?:[A-D]\s*[\)\.\:]\s*[^\s]+\s*){2,}$/i, '')
    .trim();

  // Remove page markers
  questionText = questionText.replace(/^---\s*Page\s*\d+\s*---\s*/i, '').trim();

  if (questionText.length < 3) return null;

  // Parse correct answer
  let correctOption = 'A';
  const allAnsText = answerLines.join(' ');
  const ansMatch = allAnsText.match(/(?:Ans(?:wer)?|Correct(?: Option)?|Key)\s*[:=\-–]?\s*[\(\[]?\s*([A-D1-4])\s*[\)\]\.:]?/i);
  if (ansMatch && ansMatch[1]) {
    let opt = ansMatch[1].toUpperCase();
    if (opt === '1') opt = 'A';
    if (opt === '2') opt = 'B';
    if (opt === '3') opt = 'C';
    if (opt === '4') opt = 'D';
    if (['A', 'B', 'C', 'D'].includes(opt)) correctOption = opt;
  }

  // Also try detecting answer from question body
  if (correctOption === 'A' && answerLines.length === 0) {
    const bodyAns = block.match(/(?:Ans(?:wer)?|Correct(?: Option)?|Key)\s*[:=\-–]?\s*[\(\[]?\s*([A-D1-4])\s*[\)\]\.:]?/i);
    if (bodyAns && bodyAns[1]) {
      let opt = bodyAns[1].toUpperCase();
      if (opt === '1') opt = 'A';
      if (opt === '2') opt = 'B';
      if (opt === '3') opt = 'C';
      if (opt === '4') opt = 'D';
      if (['A', 'B', 'C', 'D'].includes(opt)) correctOption = opt;
    }
  }

  // Explanation
  let explanation = explanationLines
    .join(' ')
    .replace(/^(?:Exp(?:lanation)?|Reason|Hint|Sol(?:ution)?)\s*[:=\-–]\s*/i, '')
    .trim();

  // Detect image placeholders in question
  const imgMatches = [...(questionText.matchAll(/__IMG__([^_]+)__/g))];
  const questionImages = imgMatches.map(m => m[1]);

  return {
    id: Date.now() + idx + Math.floor(Math.random() * 10000),
    question_text: questionText,
    option_a: optionLines['A'] || 'Option A',
    option_b: optionLines['B'] || 'Option B',
    option_c: optionLines['C'] || 'Option C',
    option_d: optionLines['D'] || 'Option D',
    correct_option: correctOption,
    explanation: explanation || '',
    difficulty: detectDifficulty(questionText),
    marks: 1.0,
    negative_marks: 0.25,
    status: 'active',
    // Store extracted image keys for this question
    question_images: questionImages
  };
}

/**
 * Standard CSV Parser
 */
function parseCsvQuestions(csvText) {
  const lines = csvText.split(/\r?\n/).filter(l => l.trim().length > 0);
  if (lines.length <= 1) return [];

  const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/^["']|["']$/g, ''));
  const questions = [];

  for (let i = 1; i < lines.length; i++) {
    const parts = [];
    let cur = '';
    let inQuotes = false;
    for (let c of lines[i]) {
      if (c === '"') {
        inQuotes = !inQuotes;
      } else if (c === ',' && !inQuotes) {
        parts.push(cur.trim().replace(/^["']|["']$/g, '').replace(/""/g, '"'));
        cur = '';
      } else {
        cur += c;
      }
    }
    parts.push(cur.trim().replace(/^["']|["']$/g, '').replace(/""/g, '"'));

    if (parts.length >= 4) {
      const qIdx = headers.findIndex(h => h.includes('question'));
      const aIdx = headers.findIndex(h => h === 'option_a' || h === 'option a' || h === 'a');
      const bIdx = headers.findIndex(h => h === 'option_b' || h === 'option b' || h === 'b');
      const cIdx = headers.findIndex(h => h === 'option_c' || h === 'option c' || h === 'c');
      const dIdx = headers.findIndex(h => h === 'option_d' || h === 'option d' || h === 'd');
      const ansIdx = headers.findIndex(h => h.includes('correct') || h.includes('answer'));
      const expIdx = headers.findIndex(h => h.includes('explanation') || h.includes('solution'));

      const qText = parts[qIdx >= 0 ? qIdx : 0] || '';
      if (!qText.trim()) continue;

      let rawAns = (parts[ansIdx >= 0 ? ansIdx : 5] || 'A').toUpperCase().trim();
      if (rawAns === '1' || rawAns === '0') rawAns = 'A';
      if (rawAns === '2') rawAns = 'B';
      if (rawAns === '3') rawAns = 'C';
      if (rawAns === '4') rawAns = 'D';

      questions.push({
        id: Date.now() + i,
        question_text: qText,
        option_a: parts[aIdx >= 0 ? aIdx : 1] || 'Option A',
        option_b: parts[bIdx >= 0 ? bIdx : 2] || 'Option B',
        option_c: parts[cIdx >= 0 ? cIdx : 3] || 'Option C',
        option_d: parts[dIdx >= 0 ? dIdx : 4] || 'Option D',
        correct_option: ['A', 'B', 'C', 'D'].includes(rawAns) ? rawAns : 'A',
        explanation: parts[expIdx >= 0 ? expIdx : 6] || '',
        difficulty: 'medium',
        marks: 1.0,
        negative_marks: 0.25,
        status: 'active'
      });
    }
  }

  return questions;
}

function detectDifficulty(text) {
  const lower = text.toLowerCase();
  if (lower.includes('calculate') || lower.includes('prove') || lower.includes('evaluate') || lower.includes('complex') || lower.includes('ratio')) {
    return 'hard';
  }
  if (lower.includes('what is') || lower.includes('identify') || lower.includes('name the') || lower.includes('which of the following')) {
    return 'easy';
  }
  return 'medium';
}

export default {
  extractTextFromFile,
  extractFromFile,
  parseQuestionsFromText,
  getExtractedImages
};
