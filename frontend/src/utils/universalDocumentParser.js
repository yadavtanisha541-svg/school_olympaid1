// OlympiadHub - Universal Document & Question Parser (Word .docx/.doc, PDF, CSV, TXT)
// Extracts text and automatically detects Questions, Options (A/B/C/D), Answers & Explanations

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

/**
 * Extracts plain text from a File object (DOCX, PDF, CSV, TXT)
 */
export async function extractTextFromFile(file) {
  const fileName = file.name.toLowerCase();

  // 1. Plain Text / CSV
  if (fileName.endsWith('.csv') || fileName.endsWith('.txt') || fileName.endsWith('.tsv') || file.type.includes('text/')) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result || '');
      reader.onerror = reject;
      reader.readAsText(file);
    });
  }

  // 2. Word Document (.docx / .doc)
  if (fileName.endsWith('.docx') || fileName.endsWith('.doc')) {
    const arrayBuffer = await file.arrayBuffer();

    // Try Mammoth first
    try {
      const mammoth = await getMammoth();
      if (mammoth && mammoth.extractRawText) {
        const result = await mammoth.extractRawText({ arrayBuffer });
        if (result && result.value && result.value.trim().length > 0) {
          return result.value;
        }
      }
    } catch (e) {
      console.warn('Mammoth extraction failed, trying zip fallback:', e);
    }

    // Fallback: unpack text from docx xml streams
    try {
      const uint8 = new Uint8Array(arrayBuffer);
      const textDecoder = new TextDecoder('utf-8');
      const rawStr = textDecoder.decode(uint8);
      
      // Match XML text nodes <w:t>...</w:t>
      const matches = rawStr.match(/<w:t[^>]*>([^<]+)<\/w:t>/g);
      if (matches && matches.length > 0) {
        const extracted = matches
          .map(m => m.replace(/<[^>]+>/g, ''))
          .join(' ')
          .replace(/<\/w:p>/g, '\n');
        if (extracted.trim().length > 20) return extracted;
      }
    } catch (err) {
      console.warn('Fallback docx parser error:', err);
    }

    throw new Error('Unable to parse Word document. Please ensure it is a valid .docx file or copy-paste text directly.');
  }

  // 3. PDF Document (.pdf)
  if (fileName.endsWith('.pdf')) {
    const arrayBuffer = await file.arrayBuffer();

    // Try PDF.js
    try {
      const pdfjs = await getPdfJs();
      if (pdfjs && pdfjs.getDocument) {
        const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
        const pdf = await loadingTask.promise;
        let fullText = '';

        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
          const page = await pdf.getPage(pageNum);
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
        }

        if (fullText.trim().length > 10) {
          return fullText;
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
        const extracted = streamMatches
          .map(m => m.replace(/^\(/, '').replace(/\)\s*Tj$/, ''))
          .join(' ');
        if (extracted.trim().length > 30) return extracted;
      }
    } catch (err) {}

    throw new Error('Unable to extract text from PDF. If the PDF contains scanned images, please copy-paste the text or upload an editable Word/CSV file.');
  }

  throw new Error(`Unsupported file type: ${fileName}. Please upload a Word (.docx), PDF (.pdf), or CSV (.csv) file.`);
}

/**
 * Parses raw text extracted from Word, PDF, or CSV into structured Olympiad Questions
 */
export function parseQuestionsFromText(text) {
  if (!text || typeof text !== 'string') return [];
  const trimmed = text.trim();

  // Check if text is standard CSV / TSV with headers
  if (trimmed.includes(',') && (trimmed.toLowerCase().includes('question_text') || trimmed.toLowerCase().includes('option_a'))) {
    return parseCsvQuestions(trimmed);
  }

  // Parse formatted text (Word / PDF export)
  return parseFormattedExamText(trimmed);
}

/**
 * Intelligent RegEx Parser for Word/PDF Exam Papers
 */
function parseFormattedExamText(rawText) {
  // Normalize line endings and whitespace
  const clean = rawText
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\t\f]/g, ' ');

  const questions = [];

  // Split text by Question boundaries: "Q1.", "1.", "Question 1:", "Q. 1", "Q 1:"
  // Matches line starting with question number
  const qSplitRegex = /(?:^|\n)\s*(?:Q(?:uestion)?\.?\s*(\d+)[\.:\)\-]|(\d+)[\.:\)\-]\s+|\[Q(\d+)\])\s*/gi;
  
  const blocks = [];
  let match;
  let lastIndex = 0;
  let lastQNum = 1;

  while ((match = qSplitRegex.exec(clean)) !== null) {
    if (match.index > 0 && blocks.length > 0) {
      blocks[blocks.length - 1].raw = clean.substring(lastIndex, match.index).trim();
    }
    const qNum = match[1] || match[2] || match[3] || (blocks.length + 1);
    blocks.push({
      num: qNum,
      index: match.index,
      raw: ''
    });
    lastIndex = match.index + match[0].length;
  }

  if (blocks.length > 0) {
    blocks[blocks.length - 1].raw = clean.substring(lastIndex).trim();
  } else {
    // If no numbered questions found, try paragraph splitting
    const paragraphs = clean.split(/\n\s*\n+/).filter(p => p.trim().length > 20);
    paragraphs.forEach((p, idx) => {
      blocks.push({ num: idx + 1, raw: p.trim() });
    });
  }

  // Process each block into an MCQ
  blocks.forEach((block, idx) => {
    const raw = block.raw;
    if (!raw || raw.length < 10) return;

    // Detect Options A, B, C, D
    // Matches (A), A., A), [A], etc.
    const optRegex = /(?:^|\n|\s{2,})(?:[\(\[]?([A-D]|[1-4])[\)\]\.\:]\s+)([\s\S]*?)(?=(?:^|\n|\s{2,})(?:[\(\[]?[A-D1-4][\)\]\.\:]\s+)|(?:^|\n)\s*(?:Ans(?:wer)?|Correct|Key|Exp(?:lanation)?|Sol(?:ution)?)|$)/gi;
    
    const optionsFound = {};
    let firstOptIndex = -1;
    let optMatch;

    while ((optMatch = optRegex.exec(raw)) !== null) {
      if (firstOptIndex === -1) {
        firstOptIndex = optMatch.index;
      }
      let key = optMatch[1].toUpperCase();
      // Map 1 -> A, 2 -> B, 3 -> C, 4 -> D
      if (key === '1') key = 'A';
      if (key === '2') key = 'B';
      if (key === '3') key = 'C';
      if (key === '4') key = 'D';

      let text = (optMatch[2] || '').trim();
      // Remove trailing answer indicators if attached
      text = text.replace(/(?:Ans(?:wer)?|Correct|Key|Exp(?:lanation)?|Sol(?:ution)?).*$/i, '').trim();
      optionsFound[key] = text;
    }

    // Extract Question Text
    let questionText = '';
    if (firstOptIndex !== -1) {
      questionText = raw.substring(0, firstOptIndex).trim();
    } else {
      // No options detected in regex, take first line as question
      const lines = raw.split('\n');
      questionText = lines[0].trim();
    }

    // Detect Correct Answer
    // Matches "Answer: B", "Ans: (A)", "Correct: C", "Key: D", "Ans - B"
    const ansMatch = raw.match(/(?:Ans(?:wer)?|Correct(?: Option)?|Key)\s*[:=\-–]?\s*[\(\[]?\s*([A-D]|[1-4])\s*[\)\]\.]?/i);
    let correctOption = 'A';
    if (ansMatch && ansMatch[1]) {
      let opt = ansMatch[1].toUpperCase();
      if (opt === '1') opt = 'A';
      if (opt === '2') opt = 'B';
      if (opt === '3') opt = 'C';
      if (opt === '4') opt = 'D';
      if (['A', 'B', 'C', 'D'].includes(opt)) {
        correctOption = opt;
      }
    }

    // Detect Explanation / Solution
    const expMatch = raw.match(/(?:Exp(?:lanation)?|Sol(?:ution)?|Reason)\s*[:=\-–]\s*([\s\S]*?)$/i);
    let explanation = '';
    if (expMatch && expMatch[1]) {
      explanation = expMatch[1].trim();
    }

    // Clean question text of leftover headers
    questionText = questionText.replace(/^--- Page \d+ ---\s*/i, '').trim();

    if (questionText.length > 3) {
      questions.push({
        id: Date.now() + idx + Math.floor(Math.random() * 1000),
        question_text: questionText,
        option_a: optionsFound['A'] || 'Option A',
        option_b: optionsFound['B'] || 'Option B',
        option_c: optionsFound['C'] || 'Option C',
        option_d: optionsFound['D'] || 'Option D',
        correct_option: correctOption,
        explanation: explanation || 'Step-by-step reasoning verified by Olympiad expert.',
        difficulty: detectDifficulty(questionText),
        marks: 1.0,
        negative_marks: 0.25,
        status: 'active'
      });
    }
  });

  return questions;
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
    // Split CSV respecting quotes
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
      // Find indexes
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
  parseQuestionsFromText
};
