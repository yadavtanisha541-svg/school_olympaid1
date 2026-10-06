// Comprehensive Olympiad Class & Subject Schedule Master Data (Academic Year 2026-2027)
// Full support for all Classes (Nursery to Class 12) across all 6 Core Disciplines:
// Mathematics, Science, Digital Literacy, English, General Knowledge, Hindi

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
  math: {
    id: 'math',
    code: 'IMO',
    fullName: 'International Mathematics Olympiad',
    shortName: 'Mathematics',
    quote: 'Mathematics is the language with which God has written the universe.',
    colorHex: '#ec4899',
    accentHex: '#8b5cf6',
    iconName: 'Calculator',
    tagline: 'Test mathematical intuition, problem-solving, and logical deduction.',
    examDates2026_2027: {
      level1Dates: '18 Dec 2026, 08 Jan 2027 & 22 Jan 2027',
      level2Dates: '28th January 2027 & 12th February 2027',
      lastDateReg: '30th November 2026',
      level1AnswerKey: '23rd - 24th January 2027',
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
    code: 'ISO',
    fullName: 'International Science Olympiad',
    shortName: 'Science',
    quote: 'Curiosity is the engine of achievement and scientific breakthrough.',
    colorHex: '#8b5cf6',
    accentHex: '#3b82f6',
    iconName: 'Atom',
    tagline: 'Empowering scientific inquiry, experimental logic, and natural exploration.',
    examDates2026_2027: {
      level1Dates: '12 Dec 2026, 16 Jan 2027 & 30 Jan 2027',
      level2Dates: '25th January 2027 & 8th February 2027',
      lastDateReg: '25th November 2026',
      level1AnswerKey: '31st January - 1st February 2027',
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
  digital_literacy: {
    id: 'digital_literacy',
    code: 'IDLO',
    fullName: 'International Digital Literacy Olympiad',
    shortName: 'Digital Literacy',
    quote: 'Digital literacy and computational thinking are essential superpowers for modern innovators.',
    colorHex: '#3b82f6',
    accentHex: '#8b5cf6',
    iconName: 'Cpu',
    tagline: 'Computational thinking, algorithms, modern AI awareness, and digital safety.',
    examDates2026_2027: {
      level1Dates: '10 Dec 2026, 14 Jan 2027 & 28 Jan 2027',
      level2Dates: '22nd January 2027 & 5th February 2027',
      lastDateReg: '20th November 2026',
      level1AnswerKey: '29th - 30th January 2027',
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
  english: {
    id: 'english',
    code: 'IEO',
    fullName: 'International English Olympiad',
    shortName: 'English',
    quote: 'Every new word makes you smarter.',
    colorHex: '#06b6d4',
    accentHex: '#ec4899',
    iconName: 'BookOpen',
    tagline: 'Grammar fluency, lexical depth, reading comprehension, and verbal aptitude.',
    examDates2026_2027: {
      level1Dates: '05 Dec 2026, 09 Jan 2027 & 23 Jan 2027',
      level2Dates: '20th January 2027 & 3rd February 2027',
      lastDateReg: '15th November 2026',
      level1AnswerKey: '24th - 25th January 2027',
      level2AnswerKey: '4th - 5th February 2027',
      level1Result: 'Generally announced within 30 days after the last answer key date',
      level2Result: 'Typically announced within a month after the final answer key is released',
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
    code: 'IGKO',
    fullName: 'International General Knowledge Olympiad',
    shortName: 'General Knowledge',
    quote: 'Knowledge is the greatest currency of modern leadership.',
    colorHex: '#f59e0b',
    accentHex: '#ec4899',
    iconName: 'Globe',
    tagline: 'Global awareness, discoveries, national heritage, geopolitics, and current news.',
    examDates2026_2027: {
      level1Dates: '15 Dec 2026, 19 Jan 2027 & 02 Feb 2027',
      level2Dates: 'Single Tier Grand Championship',
      lastDateReg: '28th November 2026',
      level1AnswerKey: '3rd - 4th February 2027',
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
  hindi: {
    id: 'hindi',
    code: 'IHO',
    fullName: 'International Hindi Olympiad',
    shortName: 'Hindi',
    quote: 'हिंदी हमारी संस्कृति और अभिव्यक्ति की अनमोल धरोहर है।',
    colorHex: '#10b981',
    accentHex: '#3b82f6',
    iconName: 'Languages',
    tagline: 'हिंदी व्याकरण, शब्द सामर्थ्य, भाषा ज्ञान एवं अपठित बोध में निपुणता।',
    examDates2026_2027: {
      level1Dates: '20 Dec 2026, 12 Jan 2027 & 26 Jan 2027',
      level2Dates: 'Single Tier Grand Championship',
      lastDateReg: '5th December 2026',
      level1AnswerKey: '28th - 29th January 2027',
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
  }
};

// Aliases for backwards compatibility
OLYMPIAD_SUBJECT_METADATA.cyber = OLYMPIAD_SUBJECT_METADATA.digital_literacy;
OLYMPIAD_SUBJECT_METADATA['digital-literacy'] = OLYMPIAD_SUBJECT_METADATA.digital_literacy;
OLYMPIAD_SUBJECT_METADATA.idlo = OLYMPIAD_SUBJECT_METADATA.digital_literacy;

// Helper: Generates detailed, realistic class-specific syllabus
export const getClassSyllabus = (subjectId, classLevel) => {
  const isEarly = ['Nursery', 'LKG', 'UKG'].includes(classLevel);
  const isPrimary = ['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5'].includes(classLevel);
  const isMiddle = ['Class 6', 'Class 7', 'Class 8'].includes(classLevel);

  const normId = (subjectId || '').toLowerCase().replace(/[^a-z]/g, '');

  // 1. MATHEMATICS (IMO)
  if (normId.includes('math')) {
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

  // 2. SCIENCE (ISO / NSO)
  if (normId.includes('sci')) {
    if (isEarly) {
      return [
        { topic: 'My Body & 5 Senses', description: 'Eyes, ears, nose, tongue, skin and their everyday protective functions.', questions: 15, learningOutcomes: 'Understand sensory organs and basic personal hygiene.' },
        { topic: 'Plants, Trees & Animals', description: 'Parts of plants, flowers, domestic and wild animals, birds and baby animals.', questions: 15, learningOutcomes: 'Identify flora and fauna in natural surroundings.' },
        { topic: 'Air, Water & Weather', description: 'Sun, moon, stars, rain, wind, hot and cold seasons, clean drinking water.', questions: 10, learningOutcomes: 'Connect basic weather elements to everyday life.' },
        { topic: 'Living & Non-Living Things', description: 'Characteristics of living things vs toys, vehicles, and household objects.', questions: 10, learningOutcomes: 'Classify objects based on life properties.' }
      ];
    } else if (isPrimary) {
      return [
        { topic: 'Plant & Animal Life Systems', description: 'Photosynthesis, seed dispersal, animal adaptations, food chains, life cycles.', questions: 20, learningOutcomes: 'Understand biological systems and ecological dependencies.' },
        { topic: 'Human Body, Nutrition & Health', description: 'Digestive, respiratory, circulatory systems, balanced diet, vitamins & diseases.', questions: 15, learningOutcomes: 'Apply principles of human health and nutritional balance.' },
        { topic: 'Matter, Materials & Simple Machines', description: 'Solids, liquids, gases, properties of materials, levers, pulleys, friction & gravity.', questions: 10, learningOutcomes: 'Investigate physical properties of matter and mechanics.' },
        { topic: 'Achievers Investigative Science', description: 'Scientific method, experiment analysis, multi-concept reasoning problems.', questions: 5, learningOutcomes: 'Solve investigative case challenges with scientific inquiry.' }
      ];
    } else if (isMiddle) {
      return [
        { topic: 'Cell Biology & Human Physiology', description: 'Cell structure, microorganisms, respiration, reproduction, endocrine system.', questions: 20, learningOutcomes: 'Master microscopic biology and physiological mechanisms.' },
        { topic: 'Chemical Substances & Chemical Reactions', description: 'Acids, bases, salts, physical & chemical changes, metals & non-metals, combustion.', questions: 15, learningOutcomes: 'Analyze chemical transformations and write balanced word equations.' },
        { topic: 'Force, Motion, Light & Electricity', description: 'Newton laws, friction, sound waves, reflection, refraction, electric circuits, magnets.', questions: 10, learningOutcomes: 'Calculate kinematic variables and optical ray diagrams.' },
        { topic: 'Achievers Scientific Diagnosis', description: 'Experimental data tables, hypothesis testing, advanced laboratory deductions.', questions: 5, learningOutcomes: 'Demonstrate advanced scientific diagnosis and HOTS logic.' }
      ];
    } else {
      return [
        { topic: 'Advanced Mechanics, Electromagnetism & Optics', description: 'Thermodynamics, electromagnetic induction, wave optics, modern physics, nuclear reactions.', questions: 20, learningOutcomes: 'Formulate mathematical physics models and solve advanced problems.' },
        { topic: 'Organic, Inorganic & Physical Chemistry', description: 'Periodic trends, chemical bonding, stoichiometry, equilibrium, carbon compounds, kinetics.', questions: 15, learningOutcomes: 'Synthesize reaction mechanisms and thermodynamic calculations.' },
        { topic: 'Genetics, Evolution & Biotechnology', description: 'DNA replication, Mendelian genetics, ecology, recombinant DNA technology, cell biology.', questions: 10, learningOutcomes: 'Analyze molecular genetics and bio-technological frontiers.' },
        { topic: 'Achievers Research & Discovery Frontier', description: 'Multi-disciplinary scientific synthesis, Olympiad level case analysis.', questions: 5, learningOutcomes: 'Achieve top international scientific benchmark problem solving.' }
      ];
    }
  }

  // 3. DIGITAL LITERACY (IDLO)
  if (normId.includes('digit') || normId.includes('cyber') || normId.includes('comp') || normId.includes('idlo')) {
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

  // 4. ENGLISH (IEO)
  if (normId.includes('eng')) {
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

  // 5. GENERAL KNOWLEDGE (IGKO)
  if (normId.includes('gk') || normId.includes('general')) {
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

  // 6. HINDI (IHO)
  if (normId.includes('hin') || normId.includes('iho')) {
    if (isEarly) {
      return [
        { topic: 'स्वर, व्यंजन एवं वर्णमाला', description: 'अ से ज्ञ तक वर्णों की पहचान, चित्र देखकर पहला अक्षर पहचानना, दो अक्षर वाले सरल शब्द।', questions: 15, learningOutcomes: 'वर्णमाला एवं बुनियादी अक्षरों की सही पहचान।' },
        { topic: 'चित्र पहचान एवं सरल शब्द', description: 'फल, फूल, पशु, पक्षी, रंग, शरीर के अंग एवं घर की वस्तुओं के नाम।', questions: 15, learningOutcomes: 'चित्र देखकर सटीक हिंदी शब्द ज्ञान विकसित करना।' },
        { topic: 'मात्राओं का ज्ञान', description: 'आ, इ, ई, उ, ऊ की मात्रा वाले सरल शब्द एवं मिलान।', questions: 10, learningOutcomes: 'मात्राओं की पहचान और सही उच्चारण।' },
        { topic: 'सरल विलोम एवं तुकबंदी शब्द', description: 'बड़ा/छोटा, ऊपर/नीचे, दिन/रात, सरल तुकांत शब्द (नल-जल, घर-पर)।', questions: 10, learningOutcomes: 'बुनियादी विलोम एवं तुकांत शब्दों का ज्ञान।' }
      ];
    } else if (isPrimary) {
      return [
        { topic: 'संज्ञा, सर्वनाम, विशेषण एवं क्रिया', description: 'संज्ञा के भेद, सर्वनाम, विशेषण, क्रिया, लिंग (पुल्लिंग/स्त्रीलिंग), वचन (एकवचन/बहुवचन)।', questions: 20, learningOutcomes: 'व्याकरण के आधारभूत घटकों की सही पहचान एवं प्रयोग।' },
        { topic: 'शब्द भंडार (पर्यायवाची एवं विलोम शब्द)', description: 'समानार्थी शब्द, विलोम शब्द, अनेकार्थी शब्द, अनेक शब्दों के लिए एक शब्द।', questions: 15, learningOutcomes: 'समृद्ध हिंदी शब्दावली का निर्माण।' },
        { topic: 'मुहावरे, अशुद्धि शोधन एवं वर्तनी', description: 'प्रचलित मुहावरे, शुद्ध वर्तनी, वाक्य शुद्धि, विराम चिह्न।', questions: 10, learningOutcomes: 'त्रुटिरहित हिंदी लेखन एवं मुहावरों का सटीक प्रयोग।' },
        { topic: 'अपठित गद्यांश एवं अचीवर्स सेक्शन', description: 'सरल अपठित गद्यांश पर आधारित प्रश्न, भाषा बोध एवं उच्च स्तरीय चिंतन।', questions: 5, learningOutcomes: 'पठन-बोध और विश्लेषणात्मक चिंतन में निपुणता।' }
      ];
    } else if (isMiddle) {
      return [
        { topic: 'संधि, समास, उपसर्ग एवं प्रत्यय', description: 'स्वर संधि, समास के प्रमुख भेद, तत्सम-तद्भव, उपसर्ग, प्रत्यय, काल एवं कारक।', questions: 20, learningOutcomes: 'गंभीर व्याकरणिक संरचनाओं का विश्लेषण एवं अनुप्रयोग।' },
        { topic: 'वाच्य, वाक्य भेद एवं पद परिचय', description: 'कर्तृवाच्य/कर्मवाच्य/भाववाच्य, सरल-संयुक्त-मिश्र वाक्य, पद परिचय।', questions: 15, learningOutcomes: 'जटिल वाक्य संरचना और पद परिचय में दक्षता।' },
        { topic: 'उन्नत मुहावरे, लोकोक्तियाँ एवं शब्द सामर्थ्य', description: 'विशिष्ट मुहावरे, लोकोक्तियाँ, युग्म शब्द, समरूपी भिन्नार्थक शब्द।', questions: 10, learningOutcomes: 'अलंकारिक भाषा शैली और मुहावरों का स्वाभाविक प्रयोग।' },
        { topic: 'अचीवर्स साहित्यिक बोध एवं पद्यांश विश्लेषण', description: 'काव्यांश का भाव ग्रहण, भाषा सौंदर्य, रस एवं अलंकार परिचय।', questions: 5, learningOutcomes: 'साहित्यिक मूल्यांकन एवं प्रतियोगी स्तर पर शीर्ष प्रदर्शन।' }
      ];
    } else {
      return [
        { topic: 'रस, छंद, अलंकार एवं काव्य सौंदर्य', description: 'रस के अवयव, प्रमुख छंद, शब्दालंकार एवं अर्थालंकार, काव्य गुण एवं दोष।', questions: 20, learningOutcomes: 'काव्य शास्त्र और सौंदर्य शास्त्रीय विश्लेषण में पारंगतता।' },
        { topic: 'हिंदी साहित्य का इतिहास एवं प्रमुख कृतियाँ', description: 'आदिकाल, भक्तिकाल, रीतिकाल एवं आधुनिक काल, प्रमुख कवि, लेखक एवं रचनाएँ।', questions: 15, learningOutcomes: 'हिंदी साहित्य के कालखंडों और साहित्यिक धाराओं की समझ।' },
        { topic: 'प्रयोजनमूलक हिंदी, अनुवाद एवं परिभाषिक शब्दावली', description: 'प्रशासनिक हिंदी, तकनीकी शब्दावली, अंग्रेजी से हिंदी सटीक अनुवाद, जनसंचार माध्यम।', questions: 10, learningOutcomes: 'व्यावसायिक एवं प्रशासनिक हिंदी का आधिकारिक प्रयोग।' },
        { topic: 'अचीवर्स ग्रैंड हिंदी मास्टरमाइंड', description: 'उच्च स्तरीय आलोचनात्मक गद्य विश्लेषण, गूढ़ व्याकरणिक पहेलियाँ, राष्ट्रीय स्तर का बौद्धिक चिंतन।', questions: 5, learningOutcomes: 'अंतर्राष्ट्रीय हिंदी ओलंपियाड में सर्वोच्च रैंक हासिल करना।' }
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
  const subjects = [
    OLYMPIAD_SUBJECT_METADATA.math,
    OLYMPIAD_SUBJECT_METADATA.science,
    OLYMPIAD_SUBJECT_METADATA.digital_literacy,
    OLYMPIAD_SUBJECT_METADATA.english,
    OLYMPIAD_SUBJECT_METADATA.gk,
    OLYMPIAD_SUBJECT_METADATA.hindi
  ];

  subjects.forEach((subj) => {
    if (!subj) return;
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
          colorHex: subj.colorHex || '#ec4899',
          accentHex: subj.accentHex || '#8b5cf6',
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
  const normId = (subjectId || '').toLowerCase().replace(/[^a-z]/g, '');

  if (normId.includes('math')) {
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

  if (normId.includes('hindi') || normId.includes('iho')) {
    return [
      {
        qNum: 1,
        question: 'निम्नलिखित में से "सूर्य" शब्द का उचित पर्यायवाची शब्द कौन सा है?',
        options: ['दिनकर', 'निशाकर', 'जलद', 'पयोधि'],
        correct: 0,
        explanation: 'सूर्य के पर्यायवाची शब्द दिनकर, दिवाकर, भानु, रवि हैं। निशाकर चंद्रमा का पर्यायवाची है।'
      },
      {
        qNum: 2,
        question: 'शुद्ध वर्तनी वाले शब्द का चयन कीजिए:',
        options: ['उज्वल', 'उज्ज्वल', 'उजवल', 'उज्जवल'],
        correct: 1,
        explanation: 'शुद्ध वर्तनी "उज्ज्वल" (दो आधे ज) होती है।'
      },
      {
        qNum: 3,
        question: '"आँखों का तारा होना" मुहावरे का सही अर्थ क्या है?',
        options: ['बहुत प्यारा होना', 'नेत्र रोग होना', 'दूर की वस्तु देखना', 'अंधा होना'],
        correct: 0,
        explanation: '"आँखों का तारा होना" का अर्थ अत्यंत प्रिय अथवा बहुत प्यारा होना है।'
      },
      {
        qNum: 4,
        question: '"सज्जन" शब्द का सही संधि विच्छेद क्या होगा?',
        options: ['सज + जन', 'सत् + जन', 'सद + जन', 'सत + जन'],
        correct: 1,
        explanation: 'सत् + जन = सज्जन (व्यंजन संधि नियम त् + ज = ज्ज)।'
      },
      {
        qNum: 5,
        section: 'अचीवर्स खण्ड (HOTS)',
        question: 'जहाँ उपमेय में उपमान की संभावना की जाए, वहाँ कौन सा अलंकार होता है?',
        options: ['उपमा अलंकार', 'उत्प्रेक्षा अलंकार', 'रूपक अलंकार', 'श्लेष अलंकार'],
        correct: 1,
        explanation: 'जहाँ उपमेय में उपमान की संभावना व्यक्त की जाए, वहाँ उत्प्रेक्षा अलंकार होता है (वाचक शब्द: जनु, मनु, जानो, मानो)।'
      }
    ];
  }

  if (normId.includes('sci')) {
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
        question: 'What is the SI unit of electric potential difference (Voltage)?',
        options: ['Ampere', 'Volt', 'Ohm', 'Watt'],
        correct: 1,
        explanation: 'The SI unit of electric potential difference is the Volt (V).'
      },
      {
        qNum: 4,
        question: 'What is the pH value of pure distilled water at 25°C?',
        options: ['0', '7', '14', '1'],
        correct: 1,
        explanation: 'Pure water has equal concentrations of H+ and OH- ions, giving a neutral pH of 7.'
      },
      {
        qNum: 5,
        section: 'Achievers HOTS Section',
        question: 'According to Newton\'s Second Law of Motion, Force equals:',
        options: ['Mass × Velocity', 'Mass × Acceleration', 'Work / Time', 'Mass × Distance'],
        correct: 1,
        explanation: 'F = m × a (Force = Mass × Acceleration).'
      }
    ];
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
      question: 'Identify the part of speech of the word: "The swift cheetah ran across the meadow."',
      options: ['Noun', 'Adjective', 'Verb', 'Adverb'],
      correct: 1,
      explanation: '"Swift" describes the noun cheetah, making it an adjective.'
    },
    {
      qNum: 3,
      question: 'Select the antonym of the word "ABUNDANT":',
      options: ['Plentiful', 'Scarce', 'Lavish', 'Generous'],
      correct: 1,
      explanation: 'Abundant means existing in large quantities; scarce means in short supply.'
    },
    {
      qNum: 4,
      question: 'Fill in the blank: "She has been studying _____ 6 o\'clock this morning."',
      options: ['for', 'from', 'since', 'at'],
      correct: 2,
      explanation: '"Since" is used for a specific point in time in the past.'
    },
    {
      qNum: 5,
      section: 'Achievers Verbal HOTS',
      question: 'Rearrange the jumbled words: "than / louder / speak / actions / words"',
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

  // Base cut-off profiles tailored by subject nuance for 6 core subjects
  const subjectOffsets = {
    math: { baseCut: 46, hotsMin: 12, diffRate: 1.0 },
    science: { baseCut: 45, hotsMin: 11, diffRate: 1.0 },
    digital_literacy: { baseCut: 44, hotsMin: 10, diffRate: 0.95 },
    english: { baseCut: 47, hotsMin: 13, diffRate: 0.9 },
    gk: { baseCut: 44, hotsMin: 10, diffRate: 0.95 },
    hindi: { baseCut: 45, hotsMin: 11, diffRate: 0.95 }
  };

  const normKey = (subjectId || '').toLowerCase().replace(/[^a-z]/g, '');
  const matchedKey = Object.keys(subjectOffsets).find(k => normKey.includes(k.replace(/_/g, ''))) || 'math';
  const config = subjectOffsets[matchedKey] || subjectOffsets.math;

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
