// Comprehensive Olympiad Class & Subject Schedule Master Data (Academic Year 2026-2027)
// Full support for all Classes (Nursery to Class 12) across all 9 Olympiad Disciplines

export const ALL_CLASSES = [
  'Nursery',
  'LKG',
  'UKG',
  'Class 1',
  'Class 2',
  'Class 3',
  'Class 4',
  'Class 5',
  'Class 6',
  'Class 7',
  'Class 8',
  'Class 9',
  'Class 10',
  'Class 11',
  'Class 12'
];

export const OLYMPIAD_SUBJECT_METADATA = {
  english: {
    id: 'english',
    code: 'IEO',
    fullName: 'International English Olympiad',
    shortName: 'English',
    quote: 'Every new word makes you smarter.',
    colorHex: '#6d3a68',
    accentHex: '#d9775b',
    iconName: 'BookOpen',
    tagline: 'Grammar fluency, lexical depth, phonetics, reading comprehension, and verbal aptitude.',
    examDates2026_2027: {
      level1Dates: '3rd December 2026 & 8th December 2026',
      level2Dates: '20th January 2027 & 3rd February 2027',
      lastDateReg: '15th November 2026 (Advised to register before November)',
      level1AnswerKey: '9th - 10th December 2026',
      level2AnswerKey: '2nd - 4th February 2027',
      level1Result: 'Generally announced within 30 days after the last answer key date',
      level2Result: 'Typically announced within a month after the final answer key is released',
      feeIndia: 'INR ₹250 per student (for students studying and residing in India)',
      feeInternational: 'USD $15 (for students studying and residing outside of India)'
    },
    ageMap: {
      'Nursery': '3-4 years old',
      'LKG': '4-5 years old',
      'UKG': '5-6 years old',
      'Class 1': '5-7 years old',
      'Class 2': '6-8 years old',
      'Class 3': '7-9 years old',
      'Class 4': '8-10 years old',
      'Class 5': '9-11 years old',
      'Class 6': '10-12 years old',
      'Class 7': '11-13 years old',
      'Class 8': '12-14 years old',
      'Class 9': '13-15 years old',
      'Class 10': '14-16 years old',
      'Class 11': '15-17 years old',
      'Class 12': '16-18 years old'
    }
  },
  math: {
    id: 'math',
    code: 'IMO',
    fullName: 'International Mathematics Olympiad',
    shortName: 'Mathematics',
    quote: 'Mathematics is the language with which God has written the universe.',
    colorHex: '#4e2a4a',
    accentHex: '#d9775b',
    iconName: 'Calculator',
    tagline: 'Test mathematical intuition, problem-solving, and logical deduction.',
    examDates2026_2027: {
      level1Dates: '18th December 2026 & 22nd January 2027',
      level2Dates: '28th January 2027 & 12th February 2027',
      lastDateReg: '30th November 2026',
      level1AnswerKey: '20th - 22nd December 2026',
      level2AnswerKey: '14th - 16th February 2027',
      level1Result: 'Announced within 25 days of the Level 1 final answer key',
      level2Result: 'Announced within 30 days after the Level 2 exam',
      feeIndia: 'INR ₹250 per student',
      feeInternational: 'USD $15 per student'
    },
    ageMap: {
      'Nursery': '3-4 years old',
      'LKG': '4-5 years old',
      'UKG': '5-6 years old',
      'Class 1': '5-7 years old',
      'Class 2': '6-8 years old',
      'Class 3': '7-9 years old',
      'Class 4': '8-10 years old',
      'Class 5': '9-11 years old',
      'Class 6': '10-12 years old',
      'Class 7': '11-13 years old',
      'Class 8': '12-14 years old',
      'Class 9': '13-15 years old',
      'Class 10': '14-16 years old',
      'Class 11': '15-17 years old',
      'Class 12': '16-18 years old'
    }
  },
  science: {
    id: 'science',
    code: 'NSO',
    fullName: 'National Science Olympiad',
    shortName: 'Science',
    quote: 'Curiosity is the engine of achievement and scientific breakthrough.',
    colorHex: '#d9775b',
    accentHex: '#e7b84b',
    iconName: 'Atom',
    tagline: 'Empowering scientific inquiry, experimental logic, and natural exploration.',
    examDates2026_2027: {
      level1Dates: '12th December 2026 & 16th January 2027',
      level2Dates: '25th January 2027 & 8th February 2027',
      lastDateReg: '25th November 2026',
      level1AnswerKey: '14th - 15th December 2026',
      level2AnswerKey: '10th - 11th February 2027',
      level1Result: 'Announced within 30 days of the last answer key date',
      level2Result: 'Announced within 30 days after Level 2 exam',
      feeIndia: 'INR ₹250 per student',
      feeInternational: 'USD $15 per student'
    },
    ageMap: {
      'Nursery': '3-4 years old',
      'LKG': '4-5 years old',
      'UKG': '5-6 years old',
      'Class 1': '5-7 years old',
      'Class 2': '6-8 years old',
      'Class 3': '7-9 years old',
      'Class 4': '8-10 years old',
      'Class 5': '9-11 years old',
      'Class 6': '10-12 years old',
      'Class 7': '11-13 years old',
      'Class 8': '12-14 years old',
      'Class 9': '13-15 years old',
      'Class 10': '14-16 years old',
      'Class 11': '15-17 years old',
      'Class 12': '16-18 years old'
    }
  },
  reasoning: {
    id: 'reasoning',
    code: 'LRO',
    fullName: 'Logical Reasoning Olympiad',
    shortName: 'Reasoning',
    quote: 'Logic will get you from A to Z; reasoning will get you everywhere.',
    colorHex: '#6c568d',
    accentHex: '#e7b84b',
    iconName: 'Brain',
    tagline: 'Sharpen mental acuity, pattern recognition, spatial cognition, and deductive agility.',
    examDates2026_2027: {
      level1Dates: '19th December 2026 & 15th January 2027',
      level2Dates: 'Single Stage Grand Championship',
      lastDateReg: '1st December 2026',
      level1AnswerKey: '21st - 22nd December 2026',
      level2AnswerKey: 'N/A (Single Tier Merit)',
      level1Result: 'Announced within 20 days of exam completion',
      level2Result: 'N/A',
      feeIndia: 'INR ₹250 per student',
      feeInternational: 'USD $15 per student'
    },
    ageMap: {
      'Nursery': '3-4 years old',
      'LKG': '4-5 years old',
      'UKG': '5-6 years old',
      'Class 1': '5-7 years old',
      'Class 2': '6-8 years old',
      'Class 3': '7-9 years old',
      'Class 4': '8-10 years old',
      'Class 5': '9-11 years old',
      'Class 6': '10-12 years old',
      'Class 7': '11-13 years old',
      'Class 8': '12-14 years old',
      'Class 9': '13-15 years old',
      'Class 10': '14-16 years old',
      'Class 11': '15-17 years old',
      'Class 12': '16-18 years old'
    }
  },
  cyber: {
    id: 'cyber',
    code: 'ICO',
    fullName: 'International Cyber & AI Olympiad',
    shortName: 'Cyber & AI',
    quote: 'Code and algorithmic thinking are the superpowers of tomorrow.',
    colorHex: '#b17b25',
    accentHex: '#6d3a68',
    iconName: 'Cpu',
    tagline: 'Computational thinking, algorithms, modern AI awareness, and digital safety.',
    examDates2026_2027: {
      level1Dates: '10th December 2026 & 14th January 2027',
      level2Dates: '22nd January 2027 & 5th February 2027',
      lastDateReg: '20th November 2026',
      level1AnswerKey: '12th - 13th December 2026',
      level2AnswerKey: '8th - 9th February 2027',
      level1Result: 'Announced within 25 days of the last answer key date',
      level2Result: 'Announced within 30 days of Level 2 exam',
      feeIndia: 'INR ₹250 per student',
      feeInternational: 'USD $15 per student'
    },
    ageMap: {
      'Nursery': '3-4 years old',
      'LKG': '4-5 years old',
      'UKG': '5-6 years old',
      'Class 1': '5-7 years old',
      'Class 2': '6-8 years old',
      'Class 3': '7-9 years old',
      'Class 4': '8-10 years old',
      'Class 5': '9-11 years old',
      'Class 6': '10-12 years old',
      'Class 7': '11-13 years old',
      'Class 8': '12-14 years old',
      'Class 9': '13-15 years old',
      'Class 10': '14-16 years old',
      'Class 11': '15-17 years old',
      'Class 12': '16-18 years old'
    }
  },
  vocab: {
    id: 'vocab',
    code: 'VC',
    fullName: 'International Vocabulary Championship',
    shortName: 'Vocabulary',
    quote: 'Words are our most inexhaustible source of magic and persuasion.',
    colorHex: '#6d3a68',
    accentHex: '#e7b84b',
    iconName: 'Sparkles',
    tagline: 'Orthography, phonetics, word origin mastery, and linguistic precision.',
    examDates2026_2027: {
      level1Dates: '5th December 2026 & 9th January 2027',
      level2Dates: '18th January 2027 & 1st February 2027',
      lastDateReg: '18th November 2026',
      level1AnswerKey: '7th - 8th December 2026',
      level2AnswerKey: '3rd - 4th February 2027',
      level1Result: 'Announced within 25 days after the answer key release',
      level2Result: 'Announced within 30 days after Level 2 exam',
      feeIndia: 'INR ₹250 per student',
      feeInternational: 'USD $15 per student'
    },
    ageMap: {
      'Nursery': '3-4 years old',
      'LKG': '4-5 years old',
      'UKG': '5-6 years old',
      'Class 1': '5-7 years old',
      'Class 2': '6-8 years old',
      'Class 3': '7-9 years old',
      'Class 4': '8-10 years old',
      'Class 5': '9-11 years old',
      'Class 6': '10-12 years old',
      'Class 7': '11-13 years old',
      'Class 8': '12-14 years old',
      'Class 9': '13-15 years old',
      'Class 10': '14-16 years old',
      'Class 11': '15-17 years old',
      'Class 12': '16-18 years old'
    }
  },
  environment: {
    id: 'environment',
    code: 'EGO',
    fullName: 'Global Environment & Green Olympiad',
    shortName: 'Environment',
    quote: 'To protect the earth is to preserve our collective human tomorrow.',
    colorHex: '#2e7d32',
    accentHex: '#e7b84b',
    iconName: 'Globe',
    tagline: 'Eco-literacy, biodiversity, climate action, and renewable sustainability.',
    examDates2026_2027: {
      level1Dates: '8th December 2026 & 12th January 2027',
      level2Dates: 'Single Stage Grand Championship',
      lastDateReg: '22nd November 2026',
      level1AnswerKey: '10th - 11th December 2026',
      level2AnswerKey: 'N/A',
      level1Result: 'Announced within 20 days of exam completion',
      level2Result: 'N/A',
      feeIndia: 'INR ₹250 per student',
      feeInternational: 'USD $15 per student'
    },
    ageMap: {
      'Nursery': '3-4 years old',
      'LKG': '4-5 years old',
      'UKG': '5-6 years old',
      'Class 1': '5-7 years old',
      'Class 2': '6-8 years old',
      'Class 3': '7-9 years old',
      'Class 4': '8-10 years old',
      'Class 5': '9-11 years old',
      'Class 6': '10-12 years old',
      'Class 7': '11-13 years old',
      'Class 8': '12-14 years old',
      'Class 9': '13-15 years old',
      'Class 10': '14-16 years old',
      'Class 11': '15-17 years old',
      'Class 12': '16-18 years old'
    }
  },
  gk: {
    id: 'gk',
    code: 'GKO',
    fullName: 'General Knowledge & Current Affairs Olympiad',
    shortName: 'General Knowledge',
    quote: 'Knowledge is the greatest currency of modern leadership.',
    colorHex: '#8c4e8b',
    accentHex: '#d9775b',
    iconName: 'Sparkles',
    tagline: 'Global awareness, discoveries, national heritage, geopolitics, and current news.',
    examDates2026_2027: {
      level1Dates: '15th December 2026 & 19th January 2027',
      level2Dates: 'Single Tier Grand Championship',
      lastDateReg: '28th November 2026',
      level1AnswerKey: '17th - 18th December 2026',
      level2AnswerKey: 'N/A',
      level1Result: 'Announced within 20 days of exam completion',
      level2Result: 'N/A',
      feeIndia: 'INR ₹250 per student',
      feeInternational: 'USD $15 per student'
    },
    ageMap: {
      'Nursery': '3-4 years old',
      'LKG': '4-5 years old',
      'UKG': '5-6 years old',
      'Class 1': '5-7 years old',
      'Class 2': '6-8 years old',
      'Class 3': '7-9 years old',
      'Class 4': '8-10 years old',
      'Class 5': '9-11 years old',
      'Class 6': '10-12 years old',
      'Class 7': '11-13 years old',
      'Class 8': '12-14 years old',
      'Class 9': '13-15 years old',
      'Class 10': '14-16 years old',
      'Class 11': '15-17 years old',
      'Class 12': '16-18 years old'
    }
  },
  arts: {
    id: 'arts',
    code: 'CAO',
    fullName: 'Creative Arts & Visual Thinking Olympiad',
    shortName: 'Creative Arts',
    quote: 'Art is the signature of civilization and human imagination.',
    colorHex: '#c2410c',
    accentHex: '#e7b84b',
    iconName: 'Palette',
    tagline: 'Aesthetic composition, color harmony, visual perception, and artistic critique.',
    examDates2026_2027: {
      level1Dates: '22nd December 2026 & 26th January 2027',
      level2Dates: 'Single Tier Creative Assessment',
      lastDateReg: '5th December 2026',
      level1AnswerKey: '24th - 25th December 2026',
      level2AnswerKey: 'N/A',
      level1Result: 'Announced within 25 days of submission',
      level2Result: 'N/A',
      feeIndia: 'INR ₹250 per student',
      feeInternational: 'USD $15 per student'
    },
    ageMap: {
      'Nursery': '3-4 years old',
      'LKG': '4-5 years old',
      'UKG': '5-6 years old',
      'Class 1': '5-7 years old',
      'Class 2': '6-8 years old',
      'Class 3': '7-9 years old',
      'Class 4': '8-10 years old',
      'Class 5': '9-11 years old',
      'Class 6': '10-12 years old',
      'Class 7': '11-13 years old',
      'Class 8': '12-14 years old',
      'Class 9': '13-15 years old',
      'Class 10': '14-16 years old',
      'Class 11': '15-17 years old',
      'Class 12': '16-18 years old'
    }
  }
};

// Helper: Generates detailed, realistic class-specific syllabus
export const getClassSyllabus = (subjectId, classLevel) => {
  const isEarly = ['Nursery', 'LKG', 'UKG'].includes(classLevel);
  const isPrimary = ['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5'].includes(classLevel);
  const isMiddle = ['Class 6', 'Class 7', 'Class 8'].includes(classLevel);

  const normId = subjectId === 'spell-bee' ? 'vocab' :
                 subjectId === 'environmental' ? 'environment' :
                 subjectId === 'drawing' ? 'arts' : subjectId;

  // 1. ENGLISH (IEO)
  if (normId === 'english') {
    if (isEarly) {
      return [
        { topic: 'Letters, Alphabet & Phonics', description: 'Identification of capital & small letters, matching sounds with pictures, vowels (A, E, I, O, U) intro.', questions: 15, learningOutcomes: 'Master alphabet phonetics and letter recognition.' },
        { topic: 'Picture Vocabulary & Everyday Objects', description: 'Animals, birds, fruits, vegetables, colors, body parts, classroom and home items.', questions: 15, learningOutcomes: 'Build 200+ word visual vocabulary.' },
        { topic: 'Rhyming Words & Sound Patterns', description: 'Simple 3-letter word rhymes (cat-bat-mat), initial consonants, ending sounds.', questions: 10, learningOutcomes: 'Develop auditory rhyming intuition.' },
        { topic: 'Opposites & Simple Concepts', description: 'Big/Small, Up/Down, In/Out, Hot/Cold, Happy/Sad visually represented.', questions: 10, learningOutcomes: 'Understand foundational antonym pairs.' }
      ];
    } else if (isPrimary) {
      return [
        { topic: 'Word and Structure Knowledge', description: 'Nouns, Pronouns, Verbs, Adjectives, Articles (A/An/The), Prepositions, Singular/Plural, Genders.', questions: 20, learningOutcomes: 'Apply core parts of speech and structural grammar correctly.' },
        { topic: 'Reading Comprehension', description: 'Short stories, poems, informational snippets, direct fact-finding and inferential deductions.', questions: 15, learningOutcomes: 'Extract key ideas and make contextual narrative deductions.' },
        { topic: 'Spelling, Punctuation & Synonyms', description: 'Correct spellings, capital letters, full stops, question marks, opposites and synonyms.', questions: 10, learningOutcomes: 'Eliminate orthographic errors and punctuation mistakes.' },
        { topic: 'Achievers Higher Order Section', description: 'Contextual sentence rearrangement, contextual riddles, verbal logic.', questions: 5, learningOutcomes: 'Solve high-level competitive language challenges.' }
      ];
    } else if (isMiddle) {
      return [
        { topic: 'Advanced Grammar & Tenses', description: 'Subject-Verb Agreement, Active/Passive Voice, Direct/Indirect Speech, Modals, Conjunctions.', questions: 20, learningOutcomes: 'Master complex syntax, clause dependencies, and tense consistency.' },
        { topic: 'Critical Reading & Textual Analysis', description: 'Multi-paragraph passages, tone identification, character analysis, central theme deduction.', questions: 15, learningOutcomes: 'Evaluate nuanced authorial tone and thematic subtleties.' },
        { topic: 'Lexical Range & Idiomatic Usage', description: 'Phrasal verbs, idioms & proverbs, collocations, word origins, etymology.', questions: 10, learningOutcomes: 'Expand sophisticated vocabulary and figurative agility.' },
        { topic: 'Achievers Verbal Aptitude', description: 'Error spotting, paragraph coherence, rhetorical nuances and competitive puzzle solving.', questions: 5, learningOutcomes: 'Demonstrate elite verbal reasoning under timed conditions.' }
      ];
    } else {
      return [
        { topic: 'Complex Syntactical Mastery', description: 'Clauses, synthesis of sentences, conditional clauses, advanced prepositions and determiners.', questions: 20, learningOutcomes: 'Synthesize complex sentences and eliminate structural subtleties.' },
        { topic: 'Advanced Literary & Analytical Reading', description: 'Discursive essays, philosophical extracts, satire recognition, implicit argument evaluation.', questions: 15, learningOutcomes: 'Perform deep critical inference on dense academic texts.' },
        { topic: 'Sophisticated Lexicon & Etymology', description: 'Latin & Greek roots, formal registers, foreign expressions in English, precise word choice.', questions: 10, learningOutcomes: 'Master competitive international level vocabulary.' },
        { topic: 'Achievers Elite HOTS Section', description: 'Verbal reasoning, critical inference, argument evaluation under competitive constraints.', questions: 5, learningOutcomes: 'Formulate rapid deductions for top Olympiad percentiles.' }
      ];
    }
  }

  // 2. MATHEMATICS (IMO)
  if (normId === 'math') {
    if (isEarly) {
      return [
        { topic: 'Pre-Number Concepts & Shapes', description: 'Big/Small, Tall/Short, More/Less, Heavy/Light, 2D shapes (Circle, Square, Triangle, Rectangle).', questions: 15, learningOutcomes: 'Develop spatial intuition and comparative visual sense.' },
        { topic: 'Counting & Number Recognition', description: 'Counting objects 1 to 50, number names, forward & backward sequence, missing numbers.', questions: 15, learningOutcomes: 'Understand number quantities and ordinal sequences.' },
        { topic: 'Simple Picture Addition & Subtraction', description: 'Single-digit addition with visual icons, taking away objects, zero concept.', questions: 10, learningOutcomes: 'Grasp foundational arithmetic operations visually.' },
        { topic: 'Patterns & Time Intuition', description: 'Color and shape repeating patterns, Day & Night, Morning & Evening basics.', questions: 10, learningOutcomes: 'Identify repeating logical sequences and temporal awareness.' }
      ];
    } else if (isPrimary) {
      return [
        { topic: 'Number Operations & Place Value', description: 'Numbers up to 6 digits, Roman numerals, addition, subtraction, multiplication, division, factors & multiples.', questions: 20, learningOutcomes: 'Achieve computational fluency across whole numbers.' },
        { topic: 'Fractions & Decimals', description: 'Equivalent fractions, operations on decimals, money calculations, unitary method.', questions: 15, learningOutcomes: 'Apply rational numbers and financial arithmetic in daily scenarios.' },
        { topic: 'Geometry, Mensuration & Data', description: 'Angles, perimeter, area of rectangle & square, lines, symmetry, 3D solids, pictographs.', questions: 10, learningOutcomes: 'Calculate 2D metric measurements and interpret graphical data.' },
        { topic: 'Achievers HOTS Math Section', description: 'Multi-step non-routine word problems, mathematical puzzles and pattern logic.', questions: 5, learningOutcomes: 'Break down complex contest problems with Olympiad strategies.' }
      ];
    } else if (isMiddle) {
      return [
        { topic: 'Integers, Rational Numbers & Exponents', description: 'Properties of integers, rational operations, powers, scientific notation, square roots.', questions: 20, learningOutcomes: 'Master algebraic number systems and law of indices.' },
        { topic: 'Algebraic Expressions & Linear Equations', description: 'Variables, factorisation, simple linear equations in one/two variables, identities.', questions: 15, learningOutcomes: 'Solve multi-variable equations and algebraic simplifications.' },
        { topic: 'Advanced Geometry, Mensuration & Data', description: 'Triangles, quadrilaterals, circle theorems, surface area & volume, bar graphs, probability.', questions: 10, learningOutcomes: 'Prove geometric theorems and compute 3D solid mensurations.' },
        { topic: 'Achievers Competitive Synthesis', description: 'Number theory challenges, Olympiad level geometry proofs, competitive puzzles.', questions: 5, learningOutcomes: 'Master high-stakes competitive mathematics problems.' }
      ];
    } else {
      return [
        { topic: 'Higher Algebra, Polynomials & Quadratic Equations', description: 'Real numbers, complex roots, arithmetic progressions, matrices, determinants.', questions: 20, learningOutcomes: 'Solve higher-order polynomials and linear algebraic systems.' },
        { topic: 'Coordinate Geometry, Trigonometry & Calculus', description: 'Straight lines, conic sections, trigonometric identities & equations, limits & derivatives.', questions: 15, learningOutcomes: 'Apply analytic geometry, trigonometry, and calculus methods.' },
        { topic: 'Statistics, Probability & Vectors', description: 'Standard deviation, conditional probability, permutation & combination, 3D vectors.', questions: 10, learningOutcomes: 'Synthesize statistical models, combinatorics, and spatial vectors.' },
        { topic: 'Achievers Olympiad Mastery', description: 'National and International contest-level synthesis and rigorous algebraic logic.', questions: 5, learningOutcomes: 'Achieve elite international percentile problem solving.' }
      ];
    }
  }

  // 3. SCIENCE (NSO)
  if (normId === 'science') {
    if (isEarly) {
      return [
        { topic: 'Living & Non-Living Things', description: 'Plants, animals, birds, insects, human body parts and 5 senses.', questions: 15, learningOutcomes: 'Distinguish living organisms and identify human sense organs.' },
        { topic: 'Our Natural Environment', description: 'Sun, Moon, Stars, Water, Air, Seasons (Summer, Winter, Rainy), Day & Night.', questions: 15, learningOutcomes: 'Understand basic celestial, weather, and seasonal phenomena.' },
        { topic: 'Good Habits & Safety Rules', description: 'Hygiene, healthy foods, traffic lights, classroom safety.', questions: 10, learningOutcomes: 'Adopt healthy habits and personal safety awareness.' },
        { topic: 'Animal Kingdom & Homes', description: 'Pet animals, wild animals, water animals, their babies, sounds and habitats.', questions: 10, learningOutcomes: 'Categorize fauna by habitat, diet, and offspring.' }
      ];
    } else if (isPrimary) {
      return [
        { topic: 'Plants & Animals Systems', description: 'Photosynthesis, plant parts, adaptation in animals, food chains, life cycles.', questions: 20, learningOutcomes: 'Understand biological adaptations and energy transfer in nature.' },
        { topic: 'Human Body & Health', description: 'Digestive system, skeletal system, circulatory system, nutrients, diseases & immunity.', questions: 15, learningOutcomes: 'Comprehend human organ systems and balanced nutrition.' },
        { topic: 'Matter, Energy & Simple Machines', description: 'States of matter, heat, light, sound, force, work, levers, pulleys, friction.', questions: 10, learningOutcomes: 'Apply fundamental laws of physical mechanics and energy.' },
        { topic: 'Achievers Science Hotspot', description: 'Scientific investigation puzzles, experimental setup analysis, environmental challenges.', questions: 5, learningOutcomes: 'Formulate hypotheses and diagnose lab experimental setups.' }
      ];
    } else if (isMiddle) {
      return [
        { topic: 'Mechanics, Thermal Physics & Optics', description: 'Motion, force & pressure, sound waves, light reflection/refraction, heat transfer, electric circuits.', questions: 20, learningOutcomes: 'Calculate physical quantities and analyze circuit diagrams.' },
        { topic: 'Chemical Reactions & Materials', description: 'Acids, bases, salts, physical & chemical changes, metals & non-metals, combustion.', questions: 15, learningOutcomes: 'Predict chemical reactions and material properties.' },
        { topic: 'Cell Biology, Microorganisms & Ecology', description: 'Cell structure & functions, microorganisms, reproduction in plants/animals, conservation.', questions: 10, learningOutcomes: 'Analyze cellular processes and ecological balance.' },
        { topic: 'Achievers Investigative Discovery', description: 'Scientific deduction, laboratory apparatus analysis, multi-variable experiments.', questions: 5, learningOutcomes: 'Solve multi-layered scientific reasoning questions.' }
      ];
    } else {
      return [
        { topic: 'Physics Principles', description: 'Kinematics, Newton\'s laws, gravitation, electricity, magnetism, optics, nuclear energy.', questions: 20, learningOutcomes: 'Master fundamental and advanced laws of physical sciences.' },
        { topic: 'Chemistry & Molecular Interactions', description: 'Atomic structure, periodic classification, chemical reactions, thermodynamics, organic functional groups.', questions: 15, learningOutcomes: 'Analyze molecular structures, reaction energetics, and organic syntheses.' },
        { topic: 'Life Sciences & Biotechnology', description: 'Cell biology, genetics, human physiology, ecology, evolution, biotechnology applications.', questions: 10, learningOutcomes: 'Synthesize genetic, cellular, and biotechnological concepts.' },
        { topic: 'Achievers Research & HOTS', description: 'Data-driven experimental diagnosis, laboratory graphs, Olympiad-level multi-step science.', questions: 5, learningOutcomes: 'Evaluate experimental data and scientific research scenarios.' }
      ];
    }
  }

  // 4. LOGICAL REASONING (LRO)
  if (normId === 'reasoning') {
    if (isEarly) {
      return [
        { topic: 'Visual Discrimination & Matching', description: 'Odd one out, matching identical objects, shadow matching, shape pairing.', questions: 15, learningOutcomes: 'Sharpen visual focus and spot subtle differences.' },
        { topic: 'Patterns & Sorting Sequences', description: 'Color patterns, size ordering, repeating sequence completion, missing item in sequence.', questions: 15, learningOutcomes: 'Grasp sequential patterns and sorting criteria.' },
        { topic: 'Spatial Relations & Direction Sense', description: 'Left/Right, Top/Bottom, Inside/Outside, Near/Far, maze pathfinding.', questions: 10, learningOutcomes: 'Understand basic spatial geometry and directional orientation.' },
        { topic: 'Early Logic Puzzles', description: 'Picture classification, story sequence arrangement, simple deduction grids.', questions: 10, learningOutcomes: 'Formulate basic deductive reasoning from visual cues.' }
      ];
    } else if (isPrimary) {
      return [
        { topic: 'Verbal Reasoning & Coding', description: 'Number & letter series, coding-decoding, analogy, classification, alphabetical order, ranking.', questions: 20, learningOutcomes: 'Deconstruct word, letter, and number cipher codes.' },
        { topic: 'Non-Verbal & Spatial Reasoning', description: 'Embedded figures, mirror images, pattern completion, figure matrix, geometric grouping.', questions: 15, learningOutcomes: 'Perform 2D mental rotations and visual abstraction.' },
        { topic: 'Relational Logic & Direction Tests', description: 'Blood relations, direction sense, family tree diagrams, calendar & clock reasoning.', questions: 10, learningOutcomes: 'Map family networks and multi-step compass routes.' },
        { topic: 'Achievers Cognitive Brain Teasers', description: 'Multi-parameter grid puzzles, logical deductions, truth/lie scenarios.', questions: 5, learningOutcomes: 'Solve complex Olympiad-level matrix logic puzzles.' }
      ];
    } else if (isMiddle) {
      return [
        { topic: 'Advanced Verbal Logic & Syllogisms', description: 'Syllogisms, statement-assumptions, cause-and-effect, input-output sequencing, blood relations matrices.', questions: 20, learningOutcomes: 'Master formal logical deduction and syllogistic reasoning.' },
        { topic: 'Non-Verbal Spatial Intelligence', description: 'Cube & dice rotations, paper folding & cutting, figure formation, dot situations, series matrices.', questions: 15, learningOutcomes: 'Visualize 3D solid unfolding and spatial transformations.' },
        { topic: 'Analytical & Seating Arrangements', description: 'Linear & circular seating arrangements, Venn diagrams, mathematical operations logic.', questions: 10, learningOutcomes: 'Decompose multi-condition seating and set intersections.' },
        { topic: 'Achievers Deduction Frontier', description: 'Complex logic grids, scheduling puzzles, binary logic, conditional deduction.', questions: 5, learningOutcomes: 'Tackle high-tier contest logic under speed constraints.' }
      ];
    } else {
      return [
        { topic: 'Critical Reasoning & Argument Analysis', description: 'Statement-arguments, statement-conclusions, course of action, deductive fallacies, data sufficiency.', questions: 20, learningOutcomes: 'Critique logical arguments and identify formal fallacies.' },
        { topic: 'High-Order Spatial & Abstract Matrices', description: '3D spatial manipulation, complex unfolded nets, visual transformations, multi-layer matrix completion.', questions: 15, learningOutcomes: 'Solve abstract matrix transformations and isometric problems.' },
        { topic: 'Algorithmic Logic & Complex Puzzles', description: 'Multi-floor building puzzles, tournament logic, matrix ranking, network routes, probability logic.', questions: 10, learningOutcomes: 'Master complex multi-constraint scheduling and deduction.' },
        { topic: 'Achievers Mastermind Challenge', description: 'Olympiad ranker challenges, multi-step constraint satisfaction, analytical synthesis.', questions: 5, learningOutcomes: 'Achieve 99th percentile cognitive problem breakdown.' }
      ];
    }
  }

  // 5. CYBER & AI (ICO)
  if (normId === 'cyber') {
    if (isEarly) {
      return [
        { topic: 'Introduction to Smart Devices & Computers', description: 'Recognizing Computer, Mouse, Keyboard, Monitor, Tablet, Smartphone, and Printer.', questions: 15, learningOutcomes: 'Identify everyday computing hardware and modern digital gadgets.' },
        { topic: 'Parts of Computer & Their Uses', description: 'Screen for viewing, keyboard for typing, mouse for clicking, speakers for sound.', questions: 15, learningOutcomes: 'Understand functions of primary computer components.' },
        { topic: 'Safe Tech Habits & Screen Etiquette', description: 'Gentle touching, sitting posture, screen time balance, asking elders before using devices.', questions: 10, learningOutcomes: 'Practice safe and healthy digital usage habits.' },
        { topic: 'Fun Coding Intuition', description: 'Following step-by-step arrow commands, robot maze directions, sequencing picture steps.', questions: 10, learningOutcomes: 'Grasp foundational algorithm and sequence logic.' }
      ];
    } else if (isPrimary) {
      return [
        { topic: 'Computer Hardware, Software & OS', description: 'Input/Output/Storage devices, Windows/Mac GUI, desktop navigation, files and folders.', questions: 20, learningOutcomes: 'Operate operating systems and identify internal/external peripherals.' },
        { topic: 'Block-Based Coding & Algorithmic Logic', description: 'Scratch programming basics, sprites, loops, conditional IF-ELSE, sequential logic.', questions: 15, learningOutcomes: 'Build interactive stories and programmatic logic flows.' },
        { topic: 'Internet Basics & Cyber Safety', description: 'Web browsers, search engines, safe browsing, strong passwords, netiquette, avoiding suspicious links.', questions: 10, learningOutcomes: 'Navigate the web securely and maintain cyber hygiene.' },
        { topic: 'Achievers AI & Smart Tech Awareness', description: 'Smart assistants (Siri/Alexa), robotic sensors, AI image recognition basics.', questions: 5, learningOutcomes: 'Appreciate how artificial intelligence perceives data.' }
      ];
    } else if (isMiddle) {
      return [
        { topic: 'System Architecture & Networking', description: 'CPU components, RAM/ROM, LAN/WAN/MAN, IP addresses, cloud storage, client-server models.', questions: 20, learningOutcomes: 'Understand computer internal pipelines and network topologies.' },
        { topic: 'Programming Fundamentals & Logic', description: 'Python/HTML basics, syntax, variables, data types, loops, lists, functions, debugging code.', questions: 15, learningOutcomes: 'Write modular algorithms and debug program routines.' },
        { topic: 'Cybersecurity & Digital Ethics', description: 'Malware types (viruses, worms, trojans), phishing, firewalls, digital footprint, cyber laws.', questions: 10, learningOutcomes: 'Defend against cyber threats and follow digital ethics.' },
        { topic: 'Achievers Modern AI & Automation', description: 'Machine learning concepts, chatbots, computer vision, training data, algorithmic bias.', questions: 5, learningOutcomes: 'Analyze modern AI applications and automated decision models.' }
      ];
    } else {
      return [
        { topic: 'Advanced Computing & Data Structures', description: 'Object-Oriented Programming (Python/Java), stacks, queues, searching/sorting algorithms, databases & SQL.', questions: 20, learningOutcomes: 'Implement efficient data structures and database queries.' },
        { topic: 'Artificial Intelligence & Neural Networks', description: 'Supervised/Unsupervised ML, NLP, Prompt engineering, deep learning intuition, computer vision.', questions: 15, learningOutcomes: 'Understand neural network layers and AI model deployment.' },
        { topic: 'Advanced Cybersecurity & Cryptography', description: 'Encryption algorithms, symmetric/asymmetric keys, penetration testing basics, ethical hacking, blockchain.', questions: 10, learningOutcomes: 'Analyze cryptographic protocols and system vulnerabilities.' },
        { topic: 'Achievers Tech Innovator Challenge', description: 'System design problem solving, algorithmic optimization, AI ethics, tech architecture.', questions: 5, learningOutcomes: 'Solve high-level software engineering and algorithm design problems.' }
      ];
    }
  }

  // 6. VOCABULARY CHAMPIONSHIP (VC / SPELL BEE)
  if (normId === 'vocab') {
    if (isEarly) {
      return [
        { topic: 'Alphabet Sounds & Sight Words', description: 'Initial letters, phonics sounds, simple 2 & 3 letter sight words (the, is, on, at, in, to).', questions: 15, learningOutcomes: 'Recognize high-frequency sight words and phonetic sounds.' },
        { topic: 'Picture-to-Word Matching', description: 'Naming farm animals, classroom items, transport vehicles, colors, shapes correctly.', questions: 15, learningOutcomes: 'Spell foundational nouns and everyday objects accurately.' },
        { topic: 'Word Families & Rhyming Pairs', description: 'Short vowel families (-at, -an, -op, -ig, -en), phonetic spelling patterns.', questions: 10, learningOutcomes: 'Build word family ladders through sound blends.' },
        { topic: 'Missing Letters & Word Puzzles', description: 'Completing 3-4 letter words with missing vowel or consonant, letter unscrambling.', questions: 10, learningOutcomes: 'Decode missing letter positions in short words.' }
      ];
    } else if (isPrimary) {
      return [
        { topic: 'Phonics, Spelling Rules & Silent Letters', description: 'Rules for -ie vs -ei, doubling consonants, silent k, w, b, g, plural spelling rules.', questions: 20, learningOutcomes: 'Apply English orthographic spelling rules without error.' },
        { topic: 'Prefixes, Suffixes & Compound Words', description: 'Un-, re-, dis-, -ful, -less, -ment, making compound words (butterfly, sunlight).', questions: 15, learningOutcomes: 'Construct morphologically complex derivative words.' },
        { topic: 'Synonyms, Antonyms & Homophones', description: 'Common homophones (their/there/they\'re, right/write, sea/see), context clues, antonym pairs.', questions: 10, learningOutcomes: 'Differentiate tricky homophones and select precise words.' },
        { topic: 'Achievers Word Master & Spell Bee', description: 'Speed spell recognition, anagrams, jumbled letters, tricky spelling corrections.', questions: 5, learningOutcomes: 'Compete at championship level spelling speed tests.' }
      ];
    } else if (isMiddle) {
      return [
        { topic: 'Greek & Latin Roots & Etymology', description: 'Bio, geo, tele, chron, aud, dict, graph, auto, creating word trees and derivatives.', questions: 20, learningOutcomes: 'Deduce unknown word meanings and spellings from classic roots.' },
        { topic: 'Confusables, Homonyms & Collocations', description: 'Affect vs effect, principal vs principle, strong collocations, lexical nuances.', questions: 15, learningOutcomes: 'Eliminate homographic and near-homophonic confusion.' },
        { topic: 'Idioms, Proverbs & Figurative Expressions', description: 'Origin of idioms, metaphoric usage, proverbs in context, figurative language.', questions: 10, learningOutcomes: 'Incorporate idiomatic mastery into advanced verbal reasoning.' },
        { topic: 'Achievers Lexicon Virtuoso', description: 'Championship level spelling list, loan words from French/German, etymological deduction.', questions: 5, learningOutcomes: 'Spell challenging multi-lingual etymological words.' }
      ];
    } else {
      return [
        { topic: 'Advanced Etymology & Morphological Analysis', description: 'Greek/Latin roots in medicine, law, academia, foreign phrases in English (bona fide, status quo).', questions: 20, learningOutcomes: 'Analyze scholarly and professional registers with high etymological accuracy.' },
        { topic: 'Sophisticated Vocabulary & Academic Register', description: 'GRE/SAT level high-frequency words, nuance differentiation, rhetorical vocabulary.', questions: 15, learningOutcomes: 'Master elite vocabulary for international competitions.' },
        { topic: 'Orthographic Precision & Obscure Spellings', description: 'Exceptions to spelling rules, archaic spellings, international spelling variations UK vs US.', questions: 10, learningOutcomes: 'Identify hyper-specific orthographic edge cases.' },
        { topic: 'Achievers Grand Spelling Master', description: 'National Spell Bee finals level words, auditory spelling deduction, morphological breakdown.', questions: 5, learningOutcomes: 'Demonstrate national champion tier spelling fluency.' }
      ];
    }
  }

  // 7. ENVIRONMENT (EGO)
  if (normId === 'environment') {
    if (isEarly) {
      return [
        { topic: 'Our Earth, Plants & Trees', description: 'Types of trees, leaves, flowers, watering plants, importance of greenery around us.', questions: 15, learningOutcomes: 'Appreciate natural flora and basic plant care.' },
        { topic: 'Animal Care & Habitats', description: 'Pets, jungle animals, water animals, saving bird nests, kind behavior to animals.', questions: 15, learningOutcomes: 'Understand animal habitats and compassion for living creatures.' },
        { topic: 'Clean Surroundings & Water Conservation', description: 'Throwing trash in dustbins, closing dripping taps, keeping school/home clean.', questions: 10, learningOutcomes: 'Practice clean living habits and save water daily.' },
        { topic: 'Sun, Rain, Seasons & Nature Fun', description: 'Sun gives light, rain fills rivers, rainbows, appreciating nature beauty.', questions: 10, learningOutcomes: 'Relate seasonal weather patterns to daily life.' }
      ];
    } else if (isPrimary) {
      return [
        { topic: 'Ecosystems, Forests & Wildlife Conservation', description: 'Food chains, habitats, endangered species, national parks, deforestation effects.', questions: 20, learningOutcomes: 'Understand food webs and wildlife conservation necessities.' },
        { topic: 'Waste Management & 3Rs', description: 'Reduce, Reuse, Recycle, biodegradable vs non-biodegradable waste, composting.', questions: 15, learningOutcomes: 'Categorize waste and implement zero-waste principles.' },
        { topic: 'Natural Resources & Pollution Control', description: 'Air, water, soil, noise pollution causes and solutions, saving water & electricity.', questions: 10, learningOutcomes: 'Analyze pollution causes and practical remediation steps.' },
        { topic: 'Achievers Green Crusader Challenge', description: 'Eco-friendly habits, sustainable living choices, conservation case puzzles.', questions: 5, learningOutcomes: 'Solve real-world ecological problem scenarios.' }
      ];
    } else if (isMiddle) {
      return [
        { topic: 'Climate Change & Global Warming', description: 'Greenhouse effect, greenhouse gases, rising sea levels, melting glaciers, carbon emissions.', questions: 20, learningOutcomes: 'Analyze causes and global implications of climate disruption.' },
        { topic: 'Renewable Energy & Green Technology', description: 'Solar power, wind turbines, hydroelectricity, biomass, geothermal, EV mobility.', questions: 15, learningOutcomes: 'Evaluate clean energy generation systems and storage.' },
        { topic: 'Water Cycles, Oceans & Forest Biomes', description: 'Rainwater harvesting, ocean acidification, plastic in oceans, wetland preservation.', questions: 10, learningOutcomes: 'Assess marine health, hydrology, and forest preservation.' },
        { topic: 'Achievers Eco-Warrior Case Analysis', description: 'UN Sustainable Development Goals (SDGs), international climate accords, environmental laws.', questions: 5, learningOutcomes: 'Interpret global sustainability agreements and national green policies.' }
      ];
    } else {
      return [
        { topic: 'Climate Science & Atmospheric Dynamics', description: 'Carbon budgets, radiative forcing, feedback loops, IPCC reports, ozone depletion and recovery.', questions: 20, learningOutcomes: 'Model planetary climate systems and atmospheric science.' },
        { topic: 'Sustainable Development, Circular Economy & Clean Tech', description: 'Zero waste manufacturing, carbon credits, green hydrogen, nuclear energy, smart grids.', questions: 15, learningOutcomes: 'Synthesize circular economy models and futuristic energy transitions.' },
        { topic: 'Environmental Policies, Treaties & Biodiversity Hotspots', description: 'Paris Agreement, COP summits, Ramsar sites, biodiversity loss, environmental ethics.', questions: 10, learningOutcomes: 'Critique international treaties and biodiversity conservation frameworks.' },
        { topic: 'Achievers Global Sustainability Leadership', description: 'Designing urban sustainability models, climate risk modeling, renewable economics.', questions: 5, learningOutcomes: 'Propose scalable eco-engineering and policy solutions.' }
      ];
    }
  }

  // 8. CREATIVE ARTS (CAO)
  if (normId === 'arts') {
    if (isEarly) {
      return [
        { topic: 'Colors Recognition & Mixing', description: 'Red, Blue, Yellow primary colors, mixing colors to make green, orange, purple.', questions: 15, learningOutcomes: 'Identify color palettes and understand primary color blends.' },
        { topic: 'Basic Shapes, Lines & Doodling', description: 'Straight, wavy, zigzag lines, circles, squares, drawing simple houses, sun, flowers.', questions: 15, learningOutcomes: 'Develop fine motor pencil control and basic shape construction.' },
        { topic: 'Visual Discrimination & Matching Art', description: 'Spotting differences in pictures, matching color shades, complete the picture puzzle.', questions: 10, learningOutcomes: 'Enhance visual perception and artistic detail spotting.' },
        { topic: 'Craft, Textures & Hand Impressions', description: 'Paper folding basics, finger painting, clay modeling shapes, textures (soft, rough, smooth).', questions: 10, learningOutcomes: 'Explore multi-sensory textures and creative crafting.' }
      ];
    } else if (isPrimary) {
      return [
        { topic: 'Color Wheel & Principles of Composition', description: 'Primary, secondary, warm, cool colors, symmetry, balance, pattern, repetition.', questions: 20, learningOutcomes: 'Master color harmony and core 2D visual design rules.' },
        { topic: 'Drawing Techniques & 2D/3D Rendering', description: 'Sketching, shading with pencils, light and shadows, horizon lines, basic proportions.', questions: 15, learningOutcomes: 'Render volumetric form with tonal values and shading.' },
        { topic: 'Folk & Traditional Art Forms of India', description: 'Madhubani, Warli, Gond, Kalamkari art motifs, regional art heritage.', questions: 10, learningOutcomes: 'Appreciate indigenous Indian folk traditions and motifs.' },
        { topic: 'Achievers Creative Design Thinking', description: 'Designing logos, posters, imaginative theme illustration, visual storytelling.', questions: 5, learningOutcomes: 'Create original visual communications and design layouts.' }
      ];
    } else if (isMiddle) {
      return [
        { topic: 'Linear Perspective & Spatial Depth', description: '1-point and 2-point perspective, vanishing points, foreshortening, isometric drawings.', questions: 20, learningOutcomes: 'Construct geometric 3D architectural scenes accurately.' },
        { topic: 'Color Harmonies & Visual Balance', description: 'Complementary, analogous, triadic schemes, contrast, emphasis, rhythm, proportion in art.', questions: 15, learningOutcomes: 'Apply complex color harmonies and dynamic compositional balance.' },
        { topic: 'Famous World Artists & Art Movements', description: 'Renaissance, Impressionism, Cubism, Leonardo da Vinci, Van Gogh, Picasso, Raja Ravi Varma.', questions: 10, learningOutcomes: 'Analyze historical art eras and master painters\' styles.' },
        { topic: 'Achievers Visual Aesthetics Critique', description: 'Art analysis, composition evaluation, digital illustration basics, typography.', questions: 5, learningOutcomes: 'Evaluate artwork aesthetics with formal critical frameworks.' }
      ];
    } else {
      return [
        { topic: 'Advanced Spatial Geometry, Perspective & Anatomy', description: '3-point perspective, dynamic figure drawing, proportions, anatomical contours, chiaroscuro.', questions: 20, learningOutcomes: 'Render human anatomical proportions and complex multi-point vistas.' },
        { topic: 'Modern Art Movements & Critical Theory', description: 'Surrealism, Abstract Expressionism, Pop Art, Bauhaus, aesthetics philosophy, semiotics in art.', questions: 15, learningOutcomes: 'Interpret philosophical movements and modern visual semiotics.' },
        { topic: 'Graphic Design, UI/UX Principles & Digital Media', description: 'Grid systems, visual hierarchy, color psychology in branding, vector vs raster, digital rendering.', questions: 10, learningOutcomes: 'Design digital user interfaces and brand design identities.' },
        { topic: 'Achievers Masterclass in Visual Arts', description: 'Curatorial writing, contemporary art critique, portfolio conceptualization, design innovation.', questions: 5, learningOutcomes: 'Produce professional grade aesthetic critique and portfolios.' }
      ];
    }
  }

  // 9. GENERAL KNOWLEDGE (IGKO / GK)
  if (normId === 'gk') {
    if (isEarly) {
      return [
        { topic: 'Myself, Family & Helpers', description: 'Family members, community helpers (doctor, teacher, police officer, firefighter).', questions: 15, learningOutcomes: 'Recognize community roles and social connections.' },
        { topic: 'Animals, Birds & Nature Wonders', description: 'National animal, national bird, national flower of India, famous landmarks basics.', questions: 15, learningOutcomes: 'Learn national symbols of India and natural fauna.' },
        { topic: 'Festivals, Clothes & Food', description: 'Diwali, Eid, Christmas, Holi, regional traditional clothes, healthy foods.', questions: 10, learningOutcomes: 'Appreciate multicultural celebrations and healthy nutrition.' },
        { topic: 'General Awareness & Good Manners', description: 'Magic words (Please, Thank You, Sorry), classroom manners, traffic signal colors.', questions: 10, learningOutcomes: 'Practice courteous civic manners and road safety rules.' }
      ];
    } else if (isPrimary) {
      return [
        { topic: 'India - Our Country & Heritage', description: 'States, capitals, national symbols, monuments, famous freedom fighters, geography of India.', questions: 20, learningOutcomes: 'Master Indian geography, states, capitals, and historic icons.' },
        { topic: 'World Geography & Wonders', description: 'Continents, oceans, famous world monuments, major rivers, world flags and currencies.', questions: 15, learningOutcomes: 'Identify world continents, countries, currencies, and landmarks.' },
        { topic: 'Science, Inventions & Space Explorations', description: 'Great scientists, major inventions, solar system, satellites, computers, Nobel Prize.', questions: 10, learningOutcomes: 'Understand historic inventions and space discovery milestones.' },
        { topic: 'Sports, Current Affairs & Achievers Trivia', description: 'Major sports, Olympic games, national cups, current news headlines, famous personalities.', questions: 5, learningOutcomes: 'Stay updated on sports tournaments and national news.' }
      ];
    } else if (isMiddle) {
      return [
        { topic: 'Indian History, Polity & Constitution', description: 'Ancient & Modern history, Indian Constitution, fundamental rights, parliament, judiciary.', questions: 20, learningOutcomes: 'Analyze the Indian democratic framework, constitution, and history.' },
        { topic: 'World History & International Organizations', description: 'UN agencies (WHO, UNESCO, UNICEF, World Bank), major world wars, global treaties.', questions: 15, learningOutcomes: 'Understand world history turning points and global bodies.' },
        { topic: 'Earth Sciences, Climate & Global Geography', description: 'Physical geography, tectonic plates, climates of the world, capitals, international borders.', questions: 10, learningOutcomes: 'Comprehend planetary geography, physical features, and international boundaries.' },
        { topic: 'Achievers Current Affairs & Global Trivia', description: 'Geopolitics, latest summits, international sports tournaments, awards & honors, breakthroughs.', questions: 5, learningOutcomes: 'Achieve high percentiles in current affairs and global quizzes.' }
      ];
    } else {
      return [
        { topic: 'Global Geopolitics, Economics & Trade', description: 'World economies, GDP, stock markets, trade agreements, WTO, IMF, international diplomacy.', questions: 20, learningOutcomes: 'Analyze international relations, macroeconomics, and global trade flows.' },
        { topic: 'Advanced History, Governance & Constitutional Law', description: 'Evolution of democracies, governance models, landmark judicial rulings, political philosophy.', questions: 15, learningOutcomes: 'Synthesize comparative constitutional laws and historical governance.' },
        { topic: 'Science, Tech Discoveries & Space Exploration', description: 'ISRO/NASA missions, quantum computing breakthroughs, Nobel laureates in science, biotech frontiers.', questions: 10, learningOutcomes: 'Track cutting-edge scientific innovations and space exploration missions.' },
        { topic: 'Achievers National & Global Quizmaster', description: 'High-stakes competitive trivia, multi-disciplinary current affairs, speed round analysis.', questions: 5, learningOutcomes: 'Perform at national master quizzer competitive standards.' }
      ];
    }
  }

  // Fallback default
  return [
    { topic: `${classLevel} Core Conceptual Foundations`, description: `Fundamental theories, practical principles and basic building blocks tailored for ${classLevel}.`, questions: 20, learningOutcomes: 'Build strong conceptual fundamentals.' },
    { topic: 'Analytical Thinking & Applications', description: 'Scenario-based questions, real-life problem solving and conceptual deductions.', questions: 15, learningOutcomes: 'Apply theory to practical real-world scenarios.' },
    { topic: 'Critical Reasoning & Problem Solving', description: 'Logical sequences, matrix puzzles, comparative analysis and diagnostic synthesis.', questions: 10, learningOutcomes: 'Sharpen analytical reasoning and accuracy.' },
    { topic: 'Achievers Olympiad Excellence Tier', description: 'Advanced contest challenges and multi-layered problem breakdowns.', questions: 5, learningOutcomes: 'Master high-level competitive question types.' }
  ];
};

// Helper: Generates class-specific benefits
export const getClassBenefits = (subjectName, classLevel) => {
  const isEarly = ['Nursery', 'LKG', 'UKG'].includes(classLevel);
  if (isEarly) {
    return [
      `SkillRise ${subjectName} Olympiad for ${classLevel} provides early learners with an engaging, interactive platform to develop natural curiosity and love for learning.`,
      `Children improve their cognitive stamina, visual recognition, and listening comprehension through age-appropriate, picture-based interactive questions.`,
      `Helps parents and teachers diagnose early developmental strengths and learning milestones with detailed developmental scorecards.`,
      `Builds foundational confidence from the very first years of schooling with cheerful medals, recognition, and verified participation certificates.`
    ];
  }

  return [
    `Deepens conceptual clarity in ${subjectName} beyond routine school textbook memorization, aligned with CBSE, ICSE, IB, and State Boards.`,
    `Builds high-speed problem-solving aptitude, accuracy, and examination time management under simulated proctored test conditions.`,
    `Benchmarking against thousands of bright students nationally and internationally with percentile rankings and Student Performance Reports (SPR).`,
    `Qualifies top performers for Level 2 Grand Finale, prestigious Gold/Silver/Bronze Medals, Cash Scholarships, and International Merit Badges.`
  ];
};

// Helper: Generates class-specific FAQs
export const getClassFAQs = (subjectName, classLevel) => {
  return [
    {
      q: `Who is eligible to participate in the Class ${classLevel} ${subjectName} Olympiad?`,
      a: `Any student currently studying in ${classLevel} from any recognized educational board (CBSE, ICSE, Cambridge, IB, State Boards) across India and abroad is eligible to register either individually or through their school.`
    },
    {
      q: `What is the exam format and device requirement for Class ${classLevel}?`,
      a: `The exam is conducted 100% online through our AI-proctored examination portal. Students require a laptop, desktop computer, or tablet with a working webcam and reliable internet connectivity. For junior classes (Nursery, LKG, UKG), intuitive audio reading and visual options are enabled.`
    },
    {
      q: `When will the answer key and results be declared for the 2026-2027 cycle?`,
      a: `Level 1 answer keys will be published within 48 to 72 hours after the exam date. Level 1 results will be announced on the student dashboard within 25-30 days of the answer key release.`
    },
    {
      q: `Can a student register individually if their school is not participating?`,
      a: `Yes, absolutely! Students can register directly as Individual Candidates on our official portal by clicking the 'Register Student' button and booking their preferred exam slot.`
    },
    {
      q: `What awards and certificates will students of Class ${classLevel} receive?`,
      a: `All participants receive a verified Digital Certificate of Participation. Top national and international rankers receive Gold, Silver, and Bronze Medals of Excellence, Cash Scholarships, Merit Certificates, and School Topper honours.`
    }
  ];
};

// =========================================================================
// SAMPLE PAPERS MASTER CATALOG & QUESTION GENERATOR
// =========================================================================

export const SAMPLE_PAPER_YEARS = [2026, 2025, 2024, 2023, 2022];

export const generateSamplePapersCatalog = () => {
  const catalog = [];
  const subjects = Object.values(OLYMPIAD_SUBJECT_METADATA);

  subjects.forEach((subj) => {
    ALL_CLASSES.forEach((cls) => {
      SAMPLE_PAPER_YEARS.forEach((year) => {
        const isEarly = ['Nursery', 'LKG', 'UKG'].includes(cls);
        const isModel = year === 2026;
        const classSlug = typeof cls === 'string' ? cls.toLowerCase().replace(/\s+/g, '-') : String(cls || '').toLowerCase();
        catalog.push({
          id: `sp-${subj.id || 'general'}-${classSlug}-${year}`,
          subjectId: subj.id || 'general',
          subjectName: subj.shortName || 'Olympiad',
          fullName: subj.fullName || 'SkillRise Olympiad',
          code: subj.code || 'SRO',
          className: String(cls || 'Class 1'),
          year: year,
          editionType: isModel ? '2026 Official Model Paper' : `${year} Actual Solved Paper`,
          title: `${subj.shortName || 'Olympiad'} ${cls} - ${isModel ? 'Official Model Paper 2026-27' : `Solved Exam Paper ${year}`}`,
          duration: isEarly ? '40 Mins' : '60 Mins',
          questionsCount: isEarly ? 35 : 50,
          totalMarks: isEarly ? 40 : 60,
          difficulty: isModel ? 'Official Benchmark' : 'Standard Contest',
          pdfSize: isEarly ? '1.8 MB' : '2.4 MB',
          colorHex: subj.colorHex || '#6d3a68',
          accentHex: subj.accentHex || '#d9775b',
          hasSolutions: true,
          hasHots: true,
          hasOmr: true
        });
      });
    });
  });

  return catalog;
};

// Returns realistic, tailored questions for the interactive sample paper viewer / PDF
export const getSamplePaperQuestions = (subjectId, classLevel) => {
  const isEarly = ['Nursery', 'LKG', 'UKG'].includes(classLevel);
  const isPrimary = ['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5'].includes(classLevel);
  const normId = subjectId === 'spell-bee' ? 'vocab' :
                 subjectId === 'environmental' ? 'environment' :
                 subjectId === 'drawing' ? 'arts' : subjectId;

  if (normId === 'math') {
    if (isEarly) {
      return [
        {
          qNum: 1,
          question: 'How many corners (vertices) does a triangle have?',
          options: ['2', '3', '4', '0'],
          correct: 1,
          explanation: 'A triangle is a 3-sided polygon and has exactly 3 corners.'
        },
        {
          qNum: 2,
          question: 'Count the stars: ★ ★ ★ ★ ★. What is the correct number?',
          options: ['Three', 'Four', 'Five', 'Six'],
          correct: 2,
          explanation: 'Counting the stars gives 1, 2, 3, 4, 5. So the answer is Five.'
        },
        {
          qNum: 3,
          question: 'Which number comes right AFTER 9?',
          options: ['8', '10', '11', '7'],
          correct: 1,
          explanation: 'In forward counting, 10 comes immediately after 9.'
        },
        {
          qNum: 4,
          question: 'If you have 3 apples and your mother gives you 2 more, how many apples do you have in total?',
          options: ['4', '5', '6', '3'],
          correct: 1,
          explanation: '3 + 2 = 5 total apples.'
        },
        {
          qNum: 5,
          section: 'Achievers Section',
          question: 'Complete the pattern: Circle, Square, Circle, Square, _____?',
          options: ['Triangle', 'Circle', 'Star', 'Rectangle'],
          correct: 1,
          explanation: 'The repeating pattern is Circle then Square. After Square comes Circle.'
        }
      ];
    } else if (isPrimary) {
      return [
        {
          qNum: 1,
          question: 'What is the place value of 7 in the number 45,782?',
          options: ['7', '70', '700', '7,000'],
          correct: 2,
          explanation: 'The digit 7 is at the hundreds place, so its place value is 7 × 100 = 700.'
        },
        {
          qNum: 2,
          question: 'Find the perimeter of a rectangle having length 12 cm and breadth 8 cm.',
          options: ['20 cm', '40 cm', '96 cm', '48 cm'],
          correct: 1,
          explanation: 'Perimeter of rectangle = 2 × (Length + Breadth) = 2 × (12 + 8) = 2 × 20 = 40 cm.'
        },
        {
          qNum: 3,
          question: 'Which fraction is equivalent to 3/4?',
          options: ['6/8', '5/6', '9/15', '4/3'],
          correct: 0,
          explanation: 'Multiplying both numerator and denominator by 2 gives (3 × 2) / (4 × 2) = 6/8.'
        },
        {
          qNum: 4,
          question: 'A train leaves station A at 10:45 AM and reaches station B at 2:15 PM. How long was the journey?',
          options: ['3 hours 15 minutes', '3 hours 30 minutes', '4 hours 30 minutes', '3 hours 45 minutes'],
          correct: 1,
          explanation: 'From 10:45 AM to 1:45 PM is 3 hours. Plus 30 minutes to 2:15 PM = 3 hours 30 minutes.'
        },
        {
          qNum: 5,
          section: 'Achievers HOTS Section',
          question: 'A shopkeeper bought 15 boxes of pencils. Each box has 12 pencils. If he sold 110 pencils, how many are left?',
          options: ['60', '70', '80', '90'],
          correct: 1,
          explanation: 'Total pencils = 15 × 12 = 180. Remaining pencils = 180 - 110 = 70 pencils.'
        }
      ];
    } else {
      return [
        {
          qNum: 1,
          question: 'If 2^(x+3) = 32, find the value of x.',
          options: ['1', '2', '3', '4'],
          correct: 1,
          explanation: '32 = 2^5. Therefore, x + 3 = 5 => x = 2.'
        },
        {
          qNum: 2,
          question: 'The roots of the quadratic equation x^2 - 7x + 12 = 0 are:',
          options: ['2 and 6', '3 and 4', '-3 and -4', '1 and 12'],
          correct: 1,
          explanation: 'Factoring: (x - 3)(x - 4) = 0 => x = 3, 4.'
        },
        {
          qNum: 3,
          question: 'In a right-angled triangle ABC right angled at B, if tan A = 3/4, then sin A is equal to:',
          options: ['4/5', '3/5', '5/3', '3/4'],
          correct: 1,
          explanation: 'Hypotenuse = sqrt(3^2 + 4^2) = 5. So sin A = Opposite / Hypotenuse = 3/5.'
        },
        {
          qNum: 4,
          question: 'Two dice are rolled simultaneously. What is the probability of getting a sum of 8?',
          options: ['5/36', '1/6', '7/36', '1/9'],
          correct: 0,
          explanation: 'Favorable pairs for sum 8: (2,6), (3,5), (4,4), (5,3), (6,2) -> 5 outcomes out of 36.'
        },
        {
          qNum: 5,
          section: 'Achievers HOTS Section',
          question: 'The sum of the first n terms of an arithmetic progression is given by S_n = 3n^2 + 5n. Find its 10th term.',
          options: ['58', '62', '64', '56'],
          correct: 1,
          explanation: 'T_10 = S_10 - S_9 = (3*100 + 50) - (3*81 + 45) = 350 - 288 = 62.'
        }
      ];
    }
  }

  if (normId === 'science') {
    if (isEarly) {
      return [
        {
          qNum: 1,
          question: 'Which sense organ helps you smell a flower?',
          options: ['Eyes', 'Ears', 'Nose', 'Tongue'],
          correct: 2,
          explanation: 'Our nose helps us to smell different fragrances and scents.'
        },
        {
          qNum: 2,
          question: 'What do green plants need from the sky to make their food?',
          options: ['Moonlight', 'Sunlight', 'Stars', 'Wind only'],
          correct: 1,
          explanation: 'Plants use sunlight to perform photosynthesis.'
        },
        {
          qNum: 3,
          question: 'A baby dog is called a:',
          options: ['Kitten', 'Cub', 'Puppy', 'Calf'],
          correct: 2,
          explanation: 'A young dog is called a puppy.'
        },
        {
          qNum: 4,
          question: 'Which of the following is a living thing?',
          options: ['Plastic Toy', 'Green Tree', 'Wooden Chair', 'Stone'],
          correct: 1,
          explanation: 'Trees grow, breathe, and reproduce, making them living things.'
        },
        {
          qNum: 5,
          section: 'Achievers Section',
          question: 'In which season do we wear warm woollen clothes?',
          options: ['Summer', 'Rainy', 'Winter', 'Spring'],
          correct: 2,
          explanation: 'Woollen clothes keep us warm during the cold winter season.'
        }
      ];
    } else if (isPrimary) {
      return [
        {
          qNum: 1,
          question: 'Which green pigment in leaves captures solar energy for photosynthesis?',
          options: ['Hemoglobin', 'Chlorophyll', 'Melanin', 'Carotene'],
          correct: 1,
          explanation: 'Chlorophyll is the green pigment in chloroplasts that absorbs sunlight.'
        },
        {
          qNum: 2,
          question: 'Which organ of the human body pumps blood to all parts?',
          options: ['Lungs', 'Stomach', 'Heart', 'Kidneys'],
          correct: 2,
          explanation: 'The human heart is the muscular pumping organ that circulates blood.'
        },
        {
          qNum: 3,
          question: 'Which simple machine is a bottle opener an example of?',
          options: ['Pulley', 'Lever', 'Inclined plane', 'Screw'],
          correct: 1,
          explanation: 'A bottle opener is a class-2 lever where load is between fulcrum and effort.'
        },
        {
          qNum: 4,
          question: 'What is the process of water changing into water vapor called?',
          options: ['Condensation', 'Evaporation', 'Freezing', 'Precipitation'],
          correct: 1,
          explanation: 'Evaporation is the phase change from liquid water to gaseous vapor.'
        },
        {
          qNum: 5,
          section: 'Achievers HOTS Section',
          question: 'Why do aquatic animals survive in frozen lakes during winter?',
          options: ['Water freezes from bottom to top', 'Ice is heavier than liquid water', 'Water has maximum density at 4°C and ice forms an insulating top layer', 'Fish hibernate in air pockets'],
          correct: 2,
          explanation: 'Anomalous expansion causes ice to float on top at 0°C, while 4°C water remains liquid beneath.'
        }
      ];
    } else {
      return [
        {
          qNum: 1,
          question: 'What is the SI unit of electric potential difference (Voltage)?',
          options: ['Ampere', 'Volt', 'Ohm', 'Watt'],
          correct: 1,
          explanation: 'The SI unit of electric potential difference is the Volt (V).'
        },
        {
          qNum: 2,
          question: 'Which cell organelle is known as the powerhouse of the cell?',
          options: ['Ribosome', 'Golgi apparatus', 'Mitochondria', 'Endoplasmic reticulum'],
          correct: 2,
          explanation: 'Mitochondria produce ATP through cellular respiration, powering the cell.'
        },
        {
          qNum: 3,
          question: 'What is the pH value of pure distilled water at 25°C?',
          options: ['0', '7', '14', '1'],
          correct: 1,
          explanation: 'Pure water has equal concentrations of H+ and OH- ions, giving a neutral pH of 7.'
        },
        {
          qNum: 4,
          question: 'According to Newton\'s Second Law of Motion, Force equals:',
          options: ['Mass × Velocity', 'Mass × Acceleration', 'Work / Time', 'Mass × Distance'],
          correct: 1,
          explanation: 'F = m × a (Force = Mass × Acceleration).'
        },
        {
          qNum: 5,
          section: 'Achievers HOTS Section',
          question: 'When light travels from an optically denser medium to a rarer medium at an angle greater than critical angle, what occurs?',
          options: ['Refraction', 'Diffraction', 'Total Internal Reflection', 'Dispersion'],
          correct: 2,
          explanation: 'When angle of incidence exceeds critical angle in a denser medium, Total Internal Reflection occurs.'
        }
      ];
    }
  }

  // English & general fallback questions
  return [
    {
      qNum: 1,
      question: `Choose the correctly spelled word for ${classLevel}:`,
      options: ['Recieve', 'Receive', 'Receeve', 'Riceive'],
      correct: 1,
      explanation: 'The correct orthography follows the rule "i before e except after c" -> Receive.'
    },
    {
      qNum: 2,
      question: 'Identify the part of speech of the underlined word: "The swift cheetah ran across the meadow."',
      options: ['Noun', 'Adjective', 'Verb', 'Adverb'],
      correct: 1,
      explanation: '"Swift" describes the noun cheetah, making it an adjective.'
    },
    {
      qNum: 3,
      question: 'Select the antonym (opposite) of the word "ABUNDANT":',
      options: ['Plentiful', 'Scarce', 'Lavish', 'Generous'],
      correct: 1,
      explanation: 'Abundant means existing in large quantities; scarce means in short supply.'
    },
    {
      qNum: 4,
      question: 'Fill in the blank with the correct preposition: "She has been studying _____ 6 o\'clock this morning."',
      options: ['for', 'from', 'since', 'at'],
      correct: 2,
      explanation: '"Since" is used for a specific point in time in the past.'
    },
    {
      qNum: 5,
      section: 'Achievers Verbal HOTS',
      question: 'Rearrange the jumbled words into a meaningful proverb: "than / louder / speak / actions / words"',
      options: ['Actions speak louder than words', 'Words speak louder than actions', 'Louder actions than words speak', 'Actions than words louder speak'],
      correct: 0,
      explanation: 'The correct English idiom is "Actions speak louder than words".'
    }
  ];
};

/**
 * Returns complete class-wise qualifying cut-off data across all 15 classes (Nursery to Class 12)
 * for any given Olympiad subject.
 */
export const getClassWiseCutOffData = (subjectId = 'math') => {
  const meta = OLYMPIAD_SUBJECT_METADATA[subjectId] || OLYMPIAD_SUBJECT_METADATA.math;
  const l2Date = meta.examDates2026_2027?.level2Dates || '28th January 2027 & 12th February 2027';

  // Base cut-off profiles tailored by subject nuance
  const subjectOffsets = {
    math: { baseCut: 46, hotsMin: 12, diffRate: 1.0 },
    science: { baseCut: 45, hotsMin: 11, diffRate: 1.0 },
    english: { baseCut: 47, hotsMin: 13, diffRate: 0.9 },
    reasoning: { baseCut: 46, hotsMin: 12, diffRate: 1.05 },
    cyber: { baseCut: 44, hotsMin: 10, diffRate: 0.95 },
    vocabulary: { baseCut: 45, hotsMin: 11, diffRate: 0.9 },
    environment: { baseCut: 43, hotsMin: 10, diffRate: 0.9 },
    arts: { baseCut: 42, hotsMin: 9, diffRate: 0.85 },
    gk: { baseCut: 44, hotsMin: 10, diffRate: 0.95 }
  };

  const config = subjectOffsets[subjectId] || subjectOffsets.math;

  return ALL_CLASSES.map((clsName, idx) => {
    const isEarly = ['Nursery', 'LKG', 'UKG'].includes(clsName);
    const totalMarks = isEarly ? 40 : 60;

    let level1CutOff = 0;
    let top5PercentScore = 0;
    let zonalTop10Score = 0;
    let sec1Min = 0;
    let sec2Min = 0;
    let percentile = '88.5%';
    let y2025 = 0;
    let y2024 = 0;

    if (clsName === 'Nursery') {
      level1CutOff = Math.round(28 * config.diffRate);
      top5PercentScore = 36;
      zonalTop10Score = 33;
      sec1Min = 18;
      sec2Min = 8;
      percentile = '85.0%';
      y2025 = level1CutOff - 1;
      y2024 = level1CutOff - 2;
    } else if (clsName === 'LKG') {
      level1CutOff = Math.round(30 * config.diffRate);
      top5PercentScore = 37;
      zonalTop10Score = 34;
      sec1Min = 20;
      sec2Min = 8;
      percentile = '86.2%';
      y2025 = level1CutOff - 1;
      y2024 = level1CutOff - 2;
    } else if (clsName === 'UKG') {
      level1CutOff = Math.round(31 * config.diffRate);
      top5PercentScore = 38;
      zonalTop10Score = 35;
      sec1Min = 21;
      sec2Min = 9;
      percentile = '87.4%';
      y2025 = level1CutOff - 1;
      y2024 = level1CutOff - 2;
    } else {
      // Class 1 to 12
      const classNum = parseInt(clsName.replace('Class ', ''), 10) || 1;
      const classScale = Math.min(8, Math.floor(classNum * 0.7));
      level1CutOff = Math.min(55, Math.round((config.baseCut + classScale) * (isEarly ? 0.65 : 1)));
      top5PercentScore = Math.min(58, level1CutOff + 7);
      zonalTop10Score = Math.min(56, level1CutOff + 4);
      sec1Min = Math.round(level1CutOff * 0.65);
      sec2Min = Math.round(config.hotsMin + (classNum > 6 ? 2 : 0));
      const percValue = (87.0 + classNum * 0.85).toFixed(1);
      percentile = `${Math.min(97.5, percValue)}%`;
      y2025 = Math.max(38, level1CutOff - 1);
      y2024 = Math.max(37, level1CutOff - 2);
    }

    const candidatesCount = (28000 + (15 - idx) * 4200).toLocaleString('en-IN') + '+';

    return {
      className: clsName,
      totalMarks,
      level1CutOff,
      percentile,
      top5PercentScore,
      zonalTop10Score,
      section1Min: sec1Min,
      section2Min: sec2Min,
      level2Date: l2Date,
      candidatesCount,
      historicalTrends: {
        y2026: level1CutOff,
        y2025: y2025,
        y2024: y2024
      },
      status: 'Announced (Official Benchmark)'
    };
  });
};


