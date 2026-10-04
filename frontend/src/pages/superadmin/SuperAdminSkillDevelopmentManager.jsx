import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import {
  Brain,
  Calculator,
  Rocket,
  BookOpen,
  Globe,
  Laptop,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  Eye,
  RotateCcw,
  Sparkles,
  Layers,
  ArrowRight,
  ArrowLeft,
  Zap,
  DollarSign,
  Award,
  Clock,
  ShieldCheck,
  Check,
  X,
  FileText,
  Calendar,
  AlertCircle,
  Copy,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

const DEFAULT_PROGRAMS_INITIAL = {
  rsdp: {
    code: 'RSDP',
    id: 'prog_rsdp',
    name: 'Reasoning Skill Development Program',
    shortTitle: 'RSDP (Reasoning)',
    quote: 'Children must be taught how to think, not what to think.',
    accentColor: '#7c3aed',
    subjectKey: 'reasoning',
    badgeColor: 'bg-purple-600',
    price: 649,
    originalPrice: 999,
    validUpto: '28th February 2027',
    eligibility: '1st Graders to 10th Graders',
    introParagraphs: [
      "Reasoning is not just a subject, but it is a set of skills that allows us to think critically for solving problems in the best possible way and are essential to make accurate decisions at all stages of life. It serves as the foundation for Maths, Science, Computer Science, and many other disciplines. This Reasoning Skill Development Program has been structured to unlock the brain's full potential, including memory, logic, visual-shape memory etc.",
      "It teaches the brain to differentiate between fact and fiction, animate and inanimate objects, maths and complex equations. Improve focus & analytical thinking, learn to think out of the box and find creative solutions to problems faced with this wonderful Reasoning program.",
      "Stay curious, occupied, updated, and entertained with this program."
    ],
    whyReasons: [
      "Exclusively designed to practice Logical Reasoning, for IMO, NSO, ICSO and various competitive exams.",
      "Challenge yourself skill after skill as you master Problem solving, Critical thinking and Analytical skills.",
      "Assessment Tests - Interactive recap after every 6th test, where you take a quiz online and do a critical analysis of yourself.",
      "Challenger Rounds - Interactive recap and revision after completing all the tests. 1st graders to 10th graders will find our curriculum challenging yet enjoyable.",
      "Different course content for different classes. Super flexible.",
      "Attempt any time of the day any day or while on the move, anywhere and anytime.",
      "Download your worksheets and test yourself in pen & paper.",
      "Very affordable. You can enroll for our \"Reasoning Skill Development Program\" for as little as Rs. 649."
    ],
    skillsCovered: [
      { classNum: 1, text: 'Puzzles, Measuring Units, Geometrical Shapes, Odd One Out, Spatial Understanding, Grouping, Analogy, Ranking Test' },
      { classNum: 2, text: 'Puzzles, Measuring Units, Geometrical Shapes, Odd One Out, Analogy, Ranking Test, Grouping of Figures and Embedded Figures, Coding-Decoding' },
      { classNum: 3, text: 'Puzzles, Analogy and Classification, Alphabet Test, Coding-Decoding, Ranking Test, Grouping of Figures and Figure Matrix, Mirror Image, Geometrical Shapes, Embedded Figures, Possible Combinations, Clock and Calendar' },
      { classNum: 4, text: 'Puzzles, Alphabet Test, Coding-Decoding, Ranking Test, Mirror Images, Geometrical Shapes and Solids, Embedded Figures, Direction Sense Test, Possible Combinations, Analogy and Classification, Clock and Calendar' },
      { classNum: 5, text: 'Puzzles, Analogy and Classification, Geometrical Shapes, Mirror and Water Images, Direction Sense Test, Ranking Test, Alphabet Test and Logical Sequence of Words, Puzzle Test, Coding-Decoding, Clock and Calendar' },
      { classNum: 6, text: 'Series Completion and Inserting The Missing Character, Analogy and Classification, Coding-Decoding, Blood Relations, Direction Sense Test, Logical Venn Diagrams, Alpha-Numeric Sequence Puzzle, Number, Ranking and Time Sequence Test, Logical, Mathematical Operations, Analytical Reasoning, Mirror and Water Images, Embedded Figures, Figure Formation, Construction of Squares, Grouping of Identical Figures, Figure Matrix, Paper Folding and Paper Cutting, Cubes and Dice, Dot Situation, Clock and Calendar' },
      { classNum: 7, text: 'Series Completion and Inserting The Missing Character, Analogy and Classification, Coding-Decoding, Blood Relations, Direction Sense Test, Logical Venn Diagrams, Alpha-Numeric Sequence Puzzle, Number, Ranking and Time Sequence Test, Logical, Mathematical Operations, Analytical Reasoning, Mirror and Water Images, Embedded Figures, Figure Formation, Construction of Squares, Grouping of Identical Figures, Figure Matrix, Paper Folding and Paper Cutting, Cubes and Dice, Dot Situation, Clock and Calendar' },
      { classNum: 8, text: 'Series Completion and Inserting, Analogy and Classification, Coding-Decoding, Blood Relations, Direction Sense Test, Logical Venn Diagrams, Alpha-Numeric Sequence Puzzle, Mathematical Operations, Analytical Reasoning, Mirror and Water Images, Embedded Figures, Paper Folding and Paper Cutting, Cubes and Dice, Dot Situation, Clock and Calendar' },
      { classNum: 9, text: 'Verbal Reasoning— Series Completion, Analogy, Classification, Coding-Decoding, Blood Relations, Puzzle Test, Sequential Output Tracing, Direction Sense Test, Logical Venn Diagrams, Alphabet Test and Logical Sequence of Words, Alpha-Numeric Number Ranking and Time Sequence Test, Mathematical Operations, Inserting The Missing Character. Non-Verbal Reasoning— Series Non-Verbal, Analogy and Classification, Analytical Reasoning, Mirror and Water Images, Spotting Out of The Embedded Figure and Completion of Incomplete Pattern, Figure Matrix, Paper Folding and Paper Cutting, Grouping of Identical Figures, Cubes and Dice, Dot Situation, Construction of Square and Triangles, Figure Formation And Analysis.' },
      { classNum: 10, text: 'Verbal Reasoning— Series Completion, Analogy, Classification, Coding-Decoding, Blood Relations, Puzzle Test, Sequential Output Tracing, Direction Sense Test, Logical Venn Diagrams, Alphabet Test and Logical Sequence of Words, Alpha-Numeric Number Ranking and Time Sequence Test, Mathematical Operations, Inserting The Missing Character. Non-Verbal Reasoning— Series Non-Verbal, Analogy and Classification, Analytical Reasoning, Mirror and Water Images, Spotting Out of The Embedded Figure and Completion of Incomplete Pattern, Figure Matrix, Paper Folding and Paper Cutting, Grouping of Identical Figures, Cubes and Dice, Dot Situation, Construction of Square and Triangles, Figure Formation And Analysis.' }
    ],
    lessonsCountText: '25 Interactive Tests / Downloadable Worksheets',
    assessmentCountText: '4 Assessment Tests (1 after every 6th test)',
    challengerCountText: '2 Challenger Rounds',
    termsText: 'By registering for the Skill Development Program you agree to the Terms & Conditions listed on the portal.'
  },
  msdp: {
    code: 'MSDP',
    id: 'prog_msdp',
    name: 'Maths Skill Development Program',
    shortTitle: 'MSDP (Mathematics)',
    quote: 'Mathematics is not about numbers, equations, computations, or algorithms: it is about understanding.',
    accentColor: '#2563eb',
    subjectKey: 'math',
    badgeColor: 'bg-blue-600',
    price: 649,
    originalPrice: 999,
    validUpto: '28th February 2027',
    eligibility: '1st Graders to 10th Graders',
    introParagraphs: [
      "Mathematics is the universal language of logic and scientific discovery. The Maths Skill Development Program (MSDP) is crafted to build rock-solid foundational fluency in numerical reasoning, mental arithmetic, geometry, and higher-order algebra.",
      "Rather than rote memorization of formulas, MSDP trains students to visualize mathematical concepts, recognize deep numerical patterns, and apply fast mental heuristics to tackle tough IMO and school Olympiad problems with total confidence."
    ],
    whyReasons: [
      "Targeted for International Mathematics Olympiad (IMO) and school mathematics excellence.",
      "Covers Speed Math shortcuts, Mental Arithmetic, Vedic Math heuristics, and Word Problem deconstruction.",
      "Comprehensive diagnostic assessments after every concept milestone.",
      "Multi-grade progressive curriculum from Class 1 to Class 10."
    ],
    skillsCovered: [
      { classNum: 1, text: 'Number Sense up to 100, Basic Addition & Subtraction, Length & Weight Comparison, Shapes & Spatial Understanding, Time & Money Basics' },
      { classNum: 2, text: '3-Digit Numbers, Multiplication Tables, Division as Sharing, Even-Odd Patterns, Basic Fractions, 2D & 3D Shapes, Calendar Math' },
      { classNum: 3, text: '4-Digit Numbers, Roman Numerals, Multi-step Word Problems, Fraction Operations, Perimeter & Area Foundations, Bar Graphs' },
      { classNum: 4, text: 'Factors & Multiples (HCF/LCM), Decimals, Angles & Triangles, Unitary Method, Symmetry, Data Interpretation' },
      { classNum: 5, text: 'Large Numbers, Fraction & Decimal Arithmetic, Percentage Basics, Volume & Capacity, Coordinate Grids, HOTS Word Problems' },
      { classNum: 6, text: 'Integers, Algebra Basics, Ratio & Proportion, Practical Geometry, Mensuration (Area & Perimeter), Data Handling' },
      { classNum: 7, text: 'Fractions & Rational Numbers, Algebraic Expressions, Simple Linear Equations, Lines & Angles, Triangles & Properties, Comparing Quantities' },
      { classNum: 8, text: 'Rational Numbers, Linear Equations in One Variable, Understanding Quadrilaterals, Exponents & Powers, Factorisation, Mensuration' },
      { classNum: 9, text: 'Number Systems, Polynomials, Coordinate Geometry, Linear Equations in Two Variables, Euclidean Geometry, Triangles, Quadrilaterals, Circles, Heron’s Formula, Surface Areas & Volumes, Statistics & Probability.' },
      { classNum: 10, text: 'Real Numbers, Polynomials, Pair of Linear Equations in Two Variables, Quadratic Equations, Arithmetic Progressions, Triangles, Coordinate Geometry, Introduction to Trigonometry, Surface Areas and Volumes, Statistics, Probability.' }
    ],
    lessonsCountText: '30 Interactive Speed Drills & Worksheets',
    assessmentCountText: '5 Diagnostic Milestone Assessments',
    challengerCountText: '3 IMO Grand Challenger Rounds',
    termsText: 'By registering for the Skill Development Program you agree to the Terms & Conditions listed on the portal.'
  },
  ssdp: {
    code: 'SSDP',
    id: 'prog_ssdp',
    name: 'Science Skill Development Program',
    shortTitle: 'SSDP (Science)',
    quote: 'Somewhere, something incredible is waiting to be known.',
    accentColor: '#059669',
    subjectKey: 'science',
    badgeColor: 'bg-emerald-600',
    price: 649,
    originalPrice: 999,
    validUpto: '28th February 2027',
    eligibility: '1st Graders to 10th Graders',
    introParagraphs: [
      "Science is not just a collection of facts, but a method of inquiry and curiosity about how our universe works. The Science Skill Development Program (SSDP) inspires young minds to observe, hypothesize, experiment, and conclude logically.",
      "Designed specifically for National Science Olympiad (NSO/ISO) aspirants, SSDP bridges textbook science with real-world application, scientific inquiry, and environmental awareness."
    ],
    whyReasons: [
      "Rigorous alignment with National Science Olympiad (NSO/ISO) syllabus.",
      "Hands-on scientific inquiry with conceptual diagrams and animated experiment explanations.",
      "Diagnostic test after every 6th topic with personalized weak area feedback.",
      "Multi-grade curriculum covering Grade 1 through Grade 10."
    ],
    skillsCovered: [
      { classNum: 1, text: 'Living & Non-Living Things, Plants & Animals Around Us, Human Body & Senses, Good Habits & Safety, Weather & Seasons' },
      { classNum: 2, text: 'Plant Kingdom & Uses, Animal Life & Habitats, Air, Water & Weather, Rocks & Minerals, Our Environment' },
      { classNum: 3, text: 'Food & Nutrition, Birds & Beaks/Claws, Matter & Materials, Force, Work & Energy, Earth & Universe' },
      { classNum: 4, text: 'Human Organ Systems, Plant Adaptations, Animal Adaptations, Light, Sound & Force, Natural Resources' },
      { classNum: 5, text: 'Human Skeletal & Nervous System, Force, Machines & Energy, Environment & Pollution, States of Matter, Space Exploration' },
      { classNum: 6, text: 'Food & Components, Sorting Materials, Separation of Substances, Living Organisms & Surroundings, Motion & Measurement, Electricity & Circuits' },
      { classNum: 7, text: 'Nutrition in Plants & Animals, Heat & Temperature, Acids, Bases & Salts, Physical & Chemical Changes, Motion & Time, Electric Current & Effects' },
      { classNum: 8, text: 'Crop Production, Microorganisms, Synthetic Fibres & Plastics, Coal & Petroleum, Combustion & Flame, Conservation of Plants & Animals, Force & Pressure, Light' },
      { classNum: 9, text: 'Matter in Our Surroundings, Atoms and Molecules, Structure of the Atom, Cell - Unit of Life, Tissues, Motion, Force and Laws of Motion, Gravitation, Work and Energy, Sound.' },
      { classNum: 10, text: 'Chemical Reactions, Acids Bases and Salts, Metals and Non-metals, Carbon Compounds, Life Processes, Control and Coordination, Reproduction, Heredity, Light, Human Eye, Electricity, Magnetic Effects.' }
    ],
    lessonsCountText: '28 Interactive Diagnostic Labs & Practice Sets',
    assessmentCountText: '4 Science Concept Milestone Tests',
    challengerCountText: '2 NSO Grand Challenger Rounds',
    termsText: 'By registering for the Skill Development Program you agree to the Terms & Conditions listed on the portal.'
  },
  esdp: {
    code: 'ESDP',
    id: 'prog_esdp',
    name: 'English Skill Development Program',
    shortTitle: 'ESDP (English)',
    quote: 'Words have the power to both destroy and heal. When words are true and kind, they can change the world.',
    accentColor: '#d9775b',
    subjectKey: 'english',
    badgeColor: 'bg-orange-600',
    price: 649,
    originalPrice: 999,
    validUpto: '28th February 2027',
    eligibility: '1st Graders to 10th Graders',
    introParagraphs: [
      "Language mastery is the cornerstone of effective communication, critical reading, and creative expression. The English Skill Development Program (ESDP) builds deep grammatical accuracy, lexical richness, and comprehension confidence.",
      "Structured for the International English Olympiad (IEO), ESDP helps students master nuanced vocabulary, idioms, syntax, tenses, and spoken-written expression with clarity and poise."
    ],
    whyReasons: [
      "Designed specifically for International English Olympiad (IEO) and academic English mastery.",
      "Comprehensive focus on Grammar, Vocabulary, Reading Comprehension, and Spoken-Written Expression.",
      "Daily vocabulary booster drills, idioms, and contextual usage flashcards."
    ],
    skillsCovered: [
      { classNum: 1, text: 'Nouns, Pronouns, Verbs, Articles, Prepositions, Word Meanings, Rhyming Words, Picture Comprehension' },
      { classNum: 2, text: 'Plural Forms, Adjectives, Adverbs, Conjunctions, Synonyms & Antonyms, Sentence Formation, Short Story Comprehension' },
      { classNum: 3, text: 'Tenses (Present, Past, Future), Punctuation, Compound Words, Idiomatic Phrases, Reading Passage Analysis' },
      { classNum: 4, text: 'Subject-Verb Agreement, Direct-Indirect Speech Basics, Homophones, Cloze Tests, Analytical Comprehension' },
      { classNum: 5, text: 'Modals, Active & Passive Voice Basics, Phrasal Verbs, Prefix & Suffix, Formal & Informal Expressions' },
      { classNum: 6, text: 'Clause Analysis, Advanced Tenses, Question Tags, Sentence Transformation, Idioms & Proverbs' },
      { classNum: 7, text: 'Reported Speech, Conditional Sentences, Integrated Grammar, Critical Comprehension & Vocabulary Inferences' },
      { classNum: 8, text: 'Determiners, Conjunctions & Connectors, Advanced Synthesis of Sentences, Literary Vocabulary & Expressions' },
      { classNum: 9, text: 'Tenses, Modals, Subject - verb concord, Reported speech, Determiners, Clauses, Reading comprehension, Advanced vocabulary and collocations.' },
      { classNum: 10, text: 'Tenses, Modals, Subject - verb concord, Reported speech, Determiners, Creative writing skills, Literature comprehension, Achievers verbal reasoning.' }
    ],
    lessonsCountText: '25 Grammar & Vocabulary Worksheets',
    assessmentCountText: '4 Reading Comprehension Quizzes',
    challengerCountText: '2 IEO Grand Challenger Rounds',
    termsText: 'By registering for the Skill Development Program you agree to the Terms & Conditions listed on the portal.'
  },
  gksdp: {
    code: 'GKSDP',
    id: 'prog_gksdp',
    name: 'General Knowledge Skill Development Program',
    shortTitle: 'GK-SDP (General Knowledge)',
    quote: 'Knowledge is power. Information is liberating. Education is the premise of progress.',
    accentColor: '#e7b84b',
    subjectKey: 'gk',
    badgeColor: 'bg-amber-500',
    price: 649,
    originalPrice: 999,
    validUpto: '28th February 2027',
    eligibility: '1st Graders to 10th Graders',
    introParagraphs: [
      "Awareness of global events, scientific milestones, historical heritage, and geographical landscapes shapes well-rounded global citizens. The GK Skill Development Program is designed for IGKO aspirants.",
      "Covers world geography, international organizations, scientific inventions, sports, awards, and daily current affairs."
    ],
    whyReasons: [
      "Full coverage of International General Knowledge Olympiad (IGKO) syllabus.",
      "Monthly updated current affairs digests and trivia flashcards.",
      "Interactive multi-media quiz engine."
    ],
    skillsCovered: [
      { classNum: 1, text: 'Our Body, Plants and Animals, India and the World, Science and Technology, Environment, Sports, Everyday Math' },
      { classNum: 2, text: 'Plants & Animals, India Heritage, World Landmarks, Science & Tech, Sports & Entertainment, Life Skills' },
      { classNum: 3, text: 'Our Environment, Science & Tech, World Heritage, Indian History, Sports & Games, Language & Literature' },
      { classNum: 4, text: 'India and Neighboring Nations, World Capitals & Currencies, Scientific Inventions, Famous Personalities, Sports Cups' },
      { classNum: 5, text: 'Global Geography, International Organizations, Space Exploration, Indian Constitution Basics, Current Affairs' }
    ],
    lessonsCountText: '24 Topic-wise Current Affairs & Trivia Drills',
    assessmentCountText: '4 Milestone GK Assessments',
    challengerCountText: '2 IGKO Grand Challenger Rounds',
    termsText: 'By registering for the Skill Development Program you agree to the Terms & Conditions listed on the portal.'
  },
  csdp: {
    code: 'CSDP',
    id: 'prog_csdp',
    name: 'Cyber & AI Skill Development Program',
    shortTitle: 'CSDP (Cyber & AI)',
    quote: 'The computer was born to solve problems that did not exist before.',
    accentColor: '#0284c7',
    subjectKey: 'cyber',
    badgeColor: 'bg-cyan-600',
    price: 649,
    originalPrice: 999,
    validUpto: '28th February 2027',
    eligibility: '1st Graders to 10th Graders',
    introParagraphs: [
      "In the era of artificial intelligence and digital transformation, computational thinking, algorithms, cyber safety, and coding fundamentals are critical superpowers.",
      "The Cyber & AI Skill Development Program (CSDP) equips young learners with practical software knowledge, logic building, Python basics, and AI concepts aligned with ICSO."
    ],
    whyReasons: [
      "Aligned with International Cyber Olympiad (ICSO) and modern computer science.",
      "Hands-on coding logic, scratch algorithms, and AI fundamentals.",
      "Cyber safety, internet hygiene, and networking essentials."
    ],
    skillsCovered: [
      { classNum: 1, text: 'Introduction to Computers, Parts of Computer, Uses of Computer, Keys on Keyboard, Mouse Skills, MS Paint Basics' },
      { classNum: 2, text: 'Computer Hardware vs Software, Input/Output Devices, Notepad, MS Paint Advanced, Computer Manners' },
      { classNum: 3, text: 'Operating Systems (Windows), MS Word 2016 Basics, Introduction to Internet, Keyboard Shortcuts' },
      { classNum: 4, text: 'Memory & Storage, MS Word Advanced, MS PowerPoint Basics, Scratch Programming Fundamentals' },
      { classNum: 5, text: 'Evolution of Computers, MS Excel Basics, Internet & Multimedia, Algorithms & Flowcharts, Cyber Ethics' }
    ],
    lessonsCountText: '26 Hands-on Computational & Scratch Drills',
    assessmentCountText: '4 Cyber Diagnostic Assessments',
    challengerCountText: '2 ICSO Grand Challenger Rounds',
    termsText: 'By registering for the Skill Development Program you agree to the Terms & Conditions listed on the portal.'
  }
};

const SUBJECT_OPTIONS = [
  { key: 'reasoning', name: 'Logical Reasoning (RSDP)', icon: Brain, color: '#7c3aed' },
  { key: 'math', name: 'Mathematics (MSDP)', icon: Calculator, color: '#2563eb' },
  { key: 'science', name: 'Science (SSDP)', icon: Rocket, color: '#059669' },
  { key: 'english', name: 'English (ESDP)', icon: BookOpen, color: '#d9775b' },
  { key: 'gk', name: 'General Knowledge (GK-SDP)', icon: Globe, color: '#e7b84b' },
  { key: 'cyber', name: 'Cyber & AI (CSDP)', icon: Laptop, color: '#0284c7' }
];

export const SuperAdminSkillDevelopmentManager = ({ onNavigateTab }) => {
  const { user } = useAuth();
  const [programs, setPrograms] = useState(() => {
    try {
      const saved = localStorage.getItem('olympiadhub_custom_skill_programs_v1');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return DEFAULT_PROGRAMS_INITIAL;
  });

  const [toastMessage, setToastMessage] = useState(null);
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const saveProgramsToStorage = (updated) => {
    setPrograms(updated);
    localStorage.setItem('olympiadhub_custom_skill_programs_v1', JSON.stringify(updated));
  };

  // Studio / Modal State
  const [showEditorModal, setShowEditorModal] = useState(false);
  const [editingKey, setEditingKey] = useState(null); // null = new, string = key
  const [editorTab, setEditorTab] = useState('basic'); // 'basic' | 'intro' | 'skills' | 'lessons' | 'preview'

  // Form State
  const [formData, setFormData] = useState({
    code: 'NEW-SDP',
    name: 'New Skill Development Program',
    shortTitle: 'New Program',
    quote: 'Empowering future achievers with core computational & analytical skills.',
    accentColor: '#7c3aed',
    subjectKey: 'reasoning',
    price: 649,
    originalPrice: 999,
    validUpto: '28th February 2027',
    eligibility: '1st Graders to 10th Graders',
    introParagraphs: [
      "This structured skill development program is designed to build foundational mastery, problem-solving agility, and high-percentile Olympiad performance."
    ],
    whyReasons: [
      "Exclusively structured for Olympiad mastery and conceptual depth.",
      "Comprehensive diagnostic assessments after every concept milestone.",
      "Step-by-step video solutions and structured hints for every tricky problem.",
      "Multi-grade progressive curriculum from Class 1 to Class 10."
    ],
    skillsCovered: [
      { classNum: 1, text: 'Foundations, Pattern Recognition, Shapes, Basic Logic Drills' },
      { classNum: 2, text: 'Visual Comparisons, Grouping, Sequence Patterns, Speed Drills' },
      { classNum: 3, text: 'Multi-step Logic, Classification, Analogies, Puzzle Solving' },
      { classNum: 4, text: 'Advanced Matrices, Coding-Decoding, Symmetry, Analytical Thinking' },
      { classNum: 5, text: 'Complex Word Problems, Critical Inferences, Speed Arithmetic, HOTS' }
    ],
    lessonsCountText: '25 Interactive Tests & Downloadable Worksheets',
    assessmentCountText: '4 Milestone Assessment Tests',
    challengerCountText: '2 Grand Challenger Rounds',
    termsText: 'By registering for the Skill Development Program you agree to the Terms & Conditions listed on the portal.'
  });

  // Preview class selector
  const [previewClass, setPreviewClass] = useState('Class 1');

  const handleOpenNew = () => {
    setEditingKey(null);
    setFormData({
      code: 'NEW-SDP',
      name: 'Custom Olympiad Skill Development Program',
      shortTitle: 'Custom Skill Program',
      quote: 'Children must be taught how to think, not what to think.',
      accentColor: '#7c3aed',
      subjectKey: 'reasoning',
      price: 649,
      originalPrice: 999,
      validUpto: '28th February 2027',
      eligibility: '1st Graders to 10th Graders',
      introParagraphs: [
        "This program has been structured to unlock the learner's full potential with structured diagnostic problem solving and interactive skill drills."
      ],
      whyReasons: [
        "Exclusively designed to practice core competencies for Olympiads and school excellence.",
        "Diagnostic Assessments - Interactive recap after every milestone.",
        "Challenger Rounds - Interactive revision after completing all tests.",
        "Very affordable at just Rs. 649."
      ],
      skillsCovered: [
        { classNum: 1, text: 'Foundational Puzzles, Measuring Units, Geometrical Shapes, Odd One Out, Spatial Understanding' },
        { classNum: 2, text: 'Classification, Ranking Test, Grouping of Figures, Coding-Decoding' },
        { classNum: 3, text: 'Alphabet Test, Coding-Decoding, Mirror Image, Embedded Figures, Possible Combinations' },
        { classNum: 4, text: 'Direction Sense Test, Mirror & Water Images, Figure Matrix, Clock and Calendar' },
        { classNum: 5, text: 'Alphabet Test and Logical Sequence of Words, Puzzle Test, Cube & Dice' }
      ],
      lessonsCountText: '25 Interactive Tests / Downloadable Worksheets',
      assessmentCountText: '4 Assessment Tests (1 after every 6th test)',
      challengerCountText: '2 Challenger Rounds',
      termsText: 'By registering for the Skill Development Program you agree to the Terms & Conditions listed on the portal.'
    });
    setEditorTab('basic');
    setShowEditorModal(true);
  };

  const handleOpenEdit = (key) => {
    const cur = programs[key];
    if (!cur) return;
    setEditingKey(key);
    setFormData({
      code: cur.code || 'SDP',
      name: cur.name || 'Skill Development Program',
      shortTitle: cur.shortTitle || cur.name,
      quote: cur.quote || '',
      accentColor: cur.accentColor || '#7c3aed',
      subjectKey: cur.subjectKey || 'reasoning',
      price: cur.price || 649,
      originalPrice: cur.originalPrice || 999,
      validUpto: cur.validUpto || '28th February 2027',
      eligibility: cur.eligibility || '1st Graders to 10th Graders',
      introParagraphs: Array.isArray(cur.introParagraphs) ? [...cur.introParagraphs] : [cur.introParagraphs || ''],
      whyReasons: Array.isArray(cur.whyReasons) ? [...cur.whyReasons] : [],
      skillsCovered: Array.isArray(cur.skillsCovered) ? cur.skillsCovered.map(s => ({ ...s })) : [],
      lessonsCountText: cur.lessonsCountText || '25 Interactive Tests / Downloadable Worksheets',
      assessmentCountText: cur.assessmentCountText || '4 Assessment Tests',
      challengerCountText: cur.challengerCountText || '2 Challenger Rounds',
      termsText: cur.termsText || 'By registering for the Skill Development Program you agree to the Terms & Conditions listed on the portal.'
    });
    setEditorTab('basic');
    setShowEditorModal(true);
  };

  const handleSaveProgram = () => {
    if (!formData.name.trim() || !formData.code.trim()) {
      alert('Please fill in both Program Code and Program Name');
      return;
    }

    const progKey = editingKey || formData.code.toLowerCase().replace(/[^a-z0-9]/g, '');
    const updatedPrograms = {
      ...programs,
      [progKey]: {
        ...formData,
        id: `prog_${progKey}`,
        code: formData.code.toUpperCase(),
        badgeColor: formData.accentColor === '#7c3aed' ? 'bg-purple-600' : formData.accentColor === '#2563eb' ? 'bg-blue-600' : 'bg-emerald-600'
      }
    };

    saveProgramsToStorage(updatedPrograms);
    setShowEditorModal(false);
    showToast(`✓ Skill Development Program "${formData.name}" saved and published successfully!`);
  };

  const handleDeleteProgram = (key) => {
    const updated = { ...programs };
    delete updated[key];
    saveProgramsToStorage(updated);
    showToast('Program removed successfully.');
  };

  const handleResetDefaults = () => {
    saveProgramsToStorage(DEFAULT_PROGRAMS_INITIAL);
    showToast('Skill Development Programs reset to default.');
  };

  // Helper for Skills Covered list management
  const handleUpdateSkillClass = (idx, newText) => {
    const next = [...formData.skillsCovered];
    next[idx].text = newText;
    setFormData({ ...formData, skillsCovered: next });
  };

  const handleAddSkillClass = () => {
    const nextClassNum = formData.skillsCovered.length + 1;
    const next = [
      ...formData.skillsCovered,
      { classNum: nextClassNum, text: 'Custom curriculum topics and diagnostic speed drills for Class ' + nextClassNum }
    ];
    setFormData({ ...formData, skillsCovered: next });
  };

  const handleRemoveSkillClass = (idx) => {
    const next = formData.skillsCovered.filter((_, i) => i !== idx);
    setFormData({ ...formData, skillsCovered: next });
  };

  // Helper for Why Reasons
  const handleAddWhyReason = () => {
    setFormData({
      ...formData,
      whyReasons: [...formData.whyReasons, 'New feature or reason why this skill development program accelerates mastery.']
    });
  };

  const handleUpdateWhyReason = (idx, text) => {
    const next = [...formData.whyReasons];
    next[idx] = text;
    setFormData({ ...formData, whyReasons: next });
  };

  const handleRemoveWhyReason = (idx) => {
    const next = formData.whyReasons.filter((_, i) => i !== idx);
    setFormData({ ...formData, whyReasons: next });
  };

  // Helper for Intro Paragraphs
  const handleAddIntroParagraph = () => {
    setFormData({
      ...formData,
      introParagraphs: [...formData.introParagraphs, 'Add additional descriptive paragraph about this program...']
    });
  };

  const handleUpdateIntroParagraph = (idx, text) => {
    const next = [...formData.introParagraphs];
    next[idx] = text;
    setFormData({ ...formData, introParagraphs: next });
  };

  const handleRemoveIntroParagraph = (idx) => {
    const next = formData.introParagraphs.filter((_, i) => i !== idx);
    setFormData({ ...formData, introParagraphs: next });
  };

  const programKeys = Object.keys(programs);

  return (
    <div className="space-y-6 pb-20 font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#4e2a4a] text-white px-5 py-3 rounded-2xl shadow-xl border border-[#e7b84b]/40 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <CheckCircle2 className="w-5 h-5 text-[#e7b84b]" />
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {!showEditorModal ? (
        <>
          {/* 1. Header Banner */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-1">
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-12 h-12 rounded-xl bg-[#80497D]/10 text-[#80497D] flex items-center justify-center font-bold border border-[#ebd7eb] shrink-0 shadow-2xs">
                <Zap className="w-6 h-6 text-[#80497D]" />
              </div>
              <div className="min-w-0">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-[#422240] tracking-tight truncate">
                  Skill Development Curriculum &amp; Programs Manager
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5 truncate">
                  Create, customize, and author full-page Skill Development Programs (RSDP, MSDP, SSDP, ESDP, GK-SDP, CSDP) with class-wise skills.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={handleResetDefaults}
                className="px-4 py-2.5 rounded-xl bg-white hover:bg-[#faf6fa] text-slate-700 font-bold text-sm flex items-center gap-1.5 transition-all cursor-pointer border border-[#ebd7eb] shadow-2xs"
                title="Reset Defaults"
              >
                <RotateCcw className="w-4 h-4 text-[#80497D]" />
                <span>Reset Defaults</span>
              </button>
              <button
                type="button"
                onClick={handleOpenNew}
                className="px-5 py-2.5 rounded-xl bg-[#80497D] hover:bg-[#6b3a69] text-white font-bold text-sm flex items-center gap-2 transition-all shadow-md shadow-[#80497D]/20 active:scale-95 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Create New Program</span>
              </button>
            </div>
          </div>

      {/* 2. Top Analytics KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-[#edd6ed] p-4 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase">Live Programs</p>
            <h3 className="text-2xl font-black text-[#4e2a4a] mt-0.5">{programKeys.length}</h3>
            <span className="text-[10px] text-emerald-600 font-semibold">Active in Student Portal</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#faf5fa] text-[#6d3a68] flex items-center justify-center font-black">
            <Brain className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#edd6ed] p-4 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase">Grades Supported</p>
            <h3 className="text-2xl font-black text-slate-800 mt-0.5">Class 1 - 10</h3>
            <span className="text-[10px] text-[#6d3a68] font-semibold">Class-wise Curriculum</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-black">
            <Layers className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#edd6ed] p-4 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase">Standard Pricing</p>
            <h3 className="text-2xl font-black text-[#d9775b] mt-0.5">₹649</h3>
            <span className="text-[10px] text-slate-400 font-semibold">Full Session Access</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-black">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#edd6ed] p-4 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase">Interactive Stages</p>
            <h3 className="text-2xl font-black text-emerald-700 mt-0.5">4 Stages</h3>
            <span className="text-[10px] text-emerald-600 font-semibold">Diagnostic + Challenger</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black">
            <Award className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* 3. Programs Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {programKeys.map((key) => {
          const prog = programs[key];
          const subInfo = SUBJECT_OPTIONS.find(s => s.key === prog.subjectKey) || SUBJECT_OPTIONS[0];
          const Icon = subInfo.icon || Brain;

          return (
            <div
              key={key}
              className="bg-white rounded-3xl p-6 border-2 transition-all flex flex-col justify-between shadow-2xs hover:shadow-md"
              style={{ borderColor: prog.accentColor ? `${prog.accentColor}30` : '#edd6ed' }}
            >
              <div className="space-y-3">
                {/* Header Badge */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="px-3 py-1 rounded-xl text-white font-black text-xs uppercase shadow-2xs"
                      style={{ backgroundColor: prog.accentColor || '#7c3aed' }}
                    >
                      {prog.code}
                    </span>
                    <span className="text-xs font-bold text-slate-500">
                      {prog.validUpto || 'Session 2026-27'}
                    </span>
                  </div>
                  <span className="text-sm font-black text-slate-900 font-mono">
                    ₹{prog.price}
                  </span>
                </div>

                {/* Title & Quote */}
                <div>
                  <h3 className="text-base font-black text-slate-900 leading-snug flex items-center gap-2">
                    <Icon className="w-4 h-4 shrink-0" style={{ color: prog.accentColor }} />
                    <span>{prog.name}</span>
                  </h3>
                  <p className="text-xs text-slate-500 italic mt-1 line-clamp-2">
                    &ldquo;{prog.quote}&rdquo;
                  </p>
                </div>

                {/* Key Stats Pill */}
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/60 text-xs space-y-1">
                  <div className="flex justify-between text-slate-600">
                    <span className="font-medium">Classes Covered:</span>
                    <span className="font-bold text-slate-900">{prog.skillsCovered?.length || 10} Grades</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span className="font-medium">Eligibility:</span>
                    <span className="font-bold text-slate-900">{prog.eligibility || '1st to 10th'}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span className="font-medium">Lessons:</span>
                    <span className="font-bold text-slate-900 truncate max-w-[140px]">{prog.lessonsCountText}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => handleOpenEdit(key)}
                  className="flex-1 py-2 px-3 rounded-xl text-xs font-black text-white hover:opacity-90 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                  style={{ backgroundColor: prog.accentColor || '#6d3a68' }}
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit Curriculum &amp; Content</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDeleteProgram(key)}
                  className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 border border-slate-200 transition-colors cursor-pointer"
                  title="Delete Program"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
        </>
      ) : (
        /* 4. PROGRAM AUTHORING STUDIO & LIVE PREVIEW (FULL SCREEN DEDICATED PAGE) */
        <div className="space-y-6 pt-2 animate-in fade-in duration-150">
          {/* Page Header Bar (Seamless Background & Perfectly Balanced) */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
            <div className="flex items-center gap-4 min-w-0">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-xs shrink-0"
                style={{ backgroundColor: formData.accentColor || '#7c3aed' }}
              >
                {(() => {
                  const subOption = SUBJECT_OPTIONS.find((s) => s.key === formData.subjectKey) || SUBJECT_OPTIONS[0];
                  const IconComp = subOption?.icon || Brain;
                  return <IconComp className="w-7 h-7 text-white" />;
                })()}
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className="px-2.5 py-0.5 rounded-lg text-xs font-black uppercase text-white shadow-2xs"
                    style={{ backgroundColor: formData.accentColor || '#7c3aed' }}
                  >
                    {formData.code || 'PROGRAM'}
                  </span>
                  <span className="text-slate-300 font-bold text-xs">•</span>
                  <span className="text-xs text-slate-500 font-bold">
                    {editingKey ? 'Editing Existing Program' : 'New Program Authoring'}
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-[#422240] tracking-tight mt-0.5">
                  {editingKey ? formData.name : 'Create New Skill Development Program'}
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                  Author exact curriculum, class-wise skills covered, pricing, and live layout preview.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0 flex-wrap sm:flex-nowrap">
              <button
                type="button"
                onClick={() => setShowEditorModal(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition-all cursor-pointer flex items-center gap-2 text-sm font-bold shadow-xs active:scale-95"
              >
                <ArrowLeft className="w-4 h-4 text-slate-600" />
                <span>Back to Programs</span>
              </button>

              <button
                type="button"
                onClick={handleSaveProgram}
                className="px-6 py-2.5 rounded-xl text-sm font-black text-white bg-[#00b074] hover:bg-[#009260] transition-all shadow-md active:scale-95 cursor-pointer flex items-center gap-2"
              >
                <CheckCircle2 className="w-4.5 h-4.5" />
                <span>Save &amp; Publish Program Live</span>
              </button>
            </div>
          </div>

          {/* Studio Navigation Tabs */}
          <div className="flex items-center gap-2.5 border-b border-[#ebd7eb] pb-3 overflow-x-auto">
            {[
              { id: 'basic', label: '1. Basic Info & Pricing', icon: FileText },
              { id: 'intro', label: '2. Overview & Why Reasons', icon: Sparkles },
              { id: 'skills', label: `3. Class-wise Skills (${formData.skillsCovered.length} Grades)`, icon: Layers },
              { id: 'lessons', label: '4. Lessons & Structure', icon: Award },
              { id: 'preview', label: '👁️ Live Visual Preview (Exact Student View)', icon: Eye }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = editorTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setEditorTab(tab.id)}
                  className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2.5 cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-[#80497D] text-white shadow-md shadow-[#80497D]/20'
                      : 'bg-white text-slate-600 border border-[#ebd7eb] hover:bg-[#faf6fa] hover:text-[#80497D]'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#e7b84b]' : 'text-slate-400'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Full Screen Content Card */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
            {/* TAB 1: BASIC INFO & PRICING */}
            {editorTab === 'basic' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    <div>
                      <label className="text-sm font-bold text-slate-800 block mb-1.5">
                        Program Code (Short Acronym) *
                      </label>
                      <input
                        type="text"
                        value={formData.code}
                        onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                        placeholder="e.g. RSDP, MSDP, SSDP, AI-SDP"
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm font-black uppercase tracking-wide focus:ring-2 focus:ring-[#7c3aed]"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="text-sm font-bold text-slate-800 block mb-1.5">
                        Full Program Name *
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Reasoning Skill Development Program"
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm font-bold focus:ring-2 focus:ring-[#7c3aed]"
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <label className="text-sm font-bold text-slate-800 block mb-1.5">
                        Tagline / Inspirational Quote
                      </label>
                      <input
                        type="text"
                        value={formData.quote}
                        onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
                        placeholder="e.g. Children must be taught how to think, not what to think."
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm italic focus:ring-2 focus:ring-[#7c3aed]"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-bold text-slate-800 block mb-1.5">
                        Discipline / Subject
                      </label>
                      <select
                        value={formData.subjectKey}
                        onChange={(e) => {
                          const matched = SUBJECT_OPTIONS.find(s => s.key === e.target.value);
                          setFormData({
                            ...formData,
                            subjectKey: e.target.value,
                            accentColor: matched ? matched.color : formData.accentColor
                          });
                        }}
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm font-bold bg-white"
                      >
                        {SUBJECT_OPTIONS.map(opt => (
                          <option key={opt.key} value={opt.key}>{opt.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-sm font-bold text-slate-800 block mb-1.5">
                        Theme Color Accent
                      </label>
                      <div className="flex items-center gap-3">
                        <input
                          type="color"
                          value={formData.accentColor}
                          onChange={(e) => setFormData({ ...formData, accentColor: e.target.value })}
                          className="w-12 h-12 rounded-xl border border-slate-300 p-1 cursor-pointer"
                        />
                        <span className="text-sm font-mono font-bold text-slate-700">{formData.accentColor}</span>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-bold text-slate-800 block mb-1.5">
                        Eligibility Text
                      </label>
                      <input
                        type="text"
                        value={formData.eligibility}
                        onChange={(e) => setFormData({ ...formData, eligibility: e.target.value })}
                        placeholder="e.g. 1st Graders to 10th Graders"
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm font-bold"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-bold text-slate-800 block mb-1.5">
                        Selling Price (₹) *
                      </label>
                      <input
                        type="number"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })}
                        placeholder="649"
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 text-base font-black text-emerald-700"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-bold text-slate-800 block mb-1.5">
                        Original / Cross-out Price (₹)
                      </label>
                      <input
                        type="number"
                        value={formData.originalPrice}
                        onChange={(e) => setFormData({ ...formData, originalPrice: parseInt(e.target.value) || 0 })}
                        placeholder="999"
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 text-base font-bold text-slate-400"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-bold text-slate-800 block mb-1.5">
                        Validity Date Text
                      </label>
                      <input
                        type="text"
                        value={formData.validUpto}
                        onChange={(e) => setFormData({ ...formData, validUpto: e.target.value })}
                        placeholder="e.g. 28th February 2027"
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm font-bold"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: OVERVIEW & WHY REASONS */}
              {editorTab === 'intro' && (
                <div className="space-y-6">
                  {/* Intro Paragraphs */}
                  <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-black text-slate-900 uppercase">
                        Course Introduction Paragraphs ({formData.introParagraphs.length})
                      </h4>
                      <button
                        type="button"
                        onClick={handleAddIntroParagraph}
                        className="px-3.5 py-1.5 bg-[#6d3a68] text-white rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Paragraph</span>
                      </button>
                    </div>

                    {formData.introParagraphs.map((para, idx) => (
                      <div key={idx} className="flex items-start gap-2 bg-white p-3.5 rounded-xl border border-slate-200">
                        <span className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 font-bold text-sm flex items-center justify-center shrink-0 mt-1">
                          {idx + 1}
                        </span>
                        <textarea
                          rows={3}
                          value={para}
                          onChange={(e) => handleUpdateIntroParagraph(idx, e.target.value)}
                          className="flex-1 p-2.5 rounded-lg border border-slate-200 text-sm text-slate-800 focus:ring-1 focus:ring-[#7c3aed]"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveIntroParagraph(idx)}
                          className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 cursor-pointer"
                          title="Remove paragraph"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Why Reasons Bullet Points */}
                  <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-black text-slate-900 uppercase">
                        Why &quot;{formData.name}&quot; Key Value Points ({formData.whyReasons.length})
                      </h4>
                      <button
                        type="button"
                        onClick={handleAddWhyReason}
                        className="px-3.5 py-1.5 bg-[#6d3a68] text-white rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Bullet Point</span>
                      </button>
                    </div>

                    {formData.whyReasons.map((reason, idx) => (
                      <div key={idx} className="flex items-center gap-2 bg-white p-3 rounded-xl border border-slate-200">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#7c3aed] shrink-0 ml-1" />
                        <input
                          type="text"
                          value={reason}
                          onChange={(e) => handleUpdateWhyReason(idx, e.target.value)}
                          className="flex-1 px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-800"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveWhyReason(idx)}
                          className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 cursor-pointer"
                          title="Remove bullet point"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: CLASS-WISE SKILLS COVERED */}
              {editorTab === 'skills' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                    <div>
                      <h4 className="text-base font-black text-slate-900">
                        Class-wise Skills Covered Syllabus Manager
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-500">
                        For each class, define the exact topics, skills, and puzzles covered in this program.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddSkillClass}
                      className="px-4 py-2 bg-[#6d3a68] text-white rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Another Grade</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {formData.skillsCovered.map((s, idx) => (
                      <div key={idx} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="px-3.5 py-1 rounded-xl bg-purple-50 text-purple-900 font-black text-xs sm:text-sm border border-purple-200">
                            Class {s.classNum} Curriculum
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveSkillClass(idx)}
                            className="p-1 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 cursor-pointer"
                            title="Remove Grade"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <textarea
                          rows={2}
                          value={s.text}
                          onChange={(e) => handleUpdateSkillClass(idx, e.target.value)}
                          placeholder="e.g. Puzzles, Measuring Units, Geometrical Shapes, Odd One Out, Coding-Decoding..."
                          className="w-full p-3 rounded-xl border border-slate-200 text-sm text-slate-800 focus:ring-2 focus:ring-[#7c3aed]"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: LESSONS & STRUCTURE */}
              {editorTab === 'lessons' && (
                <div className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="text-sm font-bold text-slate-800 block mb-1.5">
                        Interactive Tests &amp; Worksheets Text
                      </label>
                      <input
                        type="text"
                        value={formData.lessonsCountText}
                        onChange={(e) => setFormData({ ...formData, lessonsCountText: e.target.value })}
                        placeholder="e.g. 25 Interactive Tests / Downloadable Worksheets"
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm font-bold"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-bold text-slate-800 block mb-1.5">
                        Assessment Tests Text
                      </label>
                      <input
                        type="text"
                        value={formData.assessmentCountText}
                        onChange={(e) => setFormData({ ...formData, assessmentCountText: e.target.value })}
                        placeholder="e.g. 4 Assessment Tests (1 after every 6th test)"
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm font-bold"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-bold text-slate-800 block mb-1.5">
                        Challenger Rounds Text
                      </label>
                      <input
                        type="text"
                        value={formData.challengerCountText}
                        onChange={(e) => setFormData({ ...formData, challengerCountText: e.target.value })}
                        placeholder="e.g. 2 Challenger Rounds"
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm font-bold"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-bold text-slate-800 block mb-1.5">
                        Terms &amp; Conditions Footer Text
                      </label>
                      <input
                        type="text"
                        value={formData.termsText}
                        onChange={(e) => setFormData({ ...formData, termsText: e.target.value })}
                        placeholder="Terms & Conditions agreement text"
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm font-bold"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: LIVE VISUAL PREVIEW (Exact Image Layout) */}
              {editorTab === 'preview' && (
                <div className="bg-[#f8f6fb] rounded-3xl p-6 sm:p-8 border border-[#edd6ed] space-y-6">
                  {/* Top Breadcrumb */}
                  <div className="bg-white px-4 py-2 rounded-xl border border-[#edd6ed] text-xs font-bold text-slate-600 flex items-center justify-between">
                    <span>HOME &gt; SKILL DEVELOPMENT PROGRAMS &gt; {formData.code}</span>
                    <span className="text-[11px] text-[#6d3a68] font-black">Active Grade: {previewClass}</span>
                  </div>

                  {/* 2-Column Student Layout (Matching Image media_1791004473639.png) */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    {/* LEFT 4 COLS: Navigation Tabs + Purple Get Started Box */}
                    <div className="lg:col-span-4 space-y-4">
                      {/* Course Tabs Box */}
                      <div className="bg-white rounded-2xl border border-[#edd6ed] overflow-hidden shadow-2xs">
                        <div className="p-3 bg-[#eab308] text-slate-950 font-black text-xs flex items-center justify-between">
                          <span>About the Course</span>
                          <span>&gt;</span>
                        </div>
                        <div className="p-3 text-slate-700 font-bold text-xs flex items-center justify-between border-t border-slate-100 hover:bg-[#faf5fa]">
                          <span>Lessons &amp; Stages</span>
                          <span>&gt;</span>
                        </div>
                        <div className="p-3 text-slate-700 font-bold text-xs flex items-center justify-between border-t border-slate-100 hover:bg-[#faf5fa]">
                          <span>Pricing &amp; Validity</span>
                          <span>&gt;</span>
                        </div>
                      </div>

                      {/* Purple Get Started Card */}
                      <div
                        className="rounded-3xl p-6 text-white text-center space-y-4 shadow-lg"
                        style={{ background: `linear-gradient(135deg, ${formData.accentColor} 0%, #4e2a4a 100%)` }}
                      >
                        <h3 className="text-xl font-black tracking-tight">Get Started!</h3>
                        <p className="text-xs text-pink-100 font-medium">Select your class to start your program.</p>

                        <div className="relative">
                          <select
                            value={previewClass}
                            onChange={(e) => setPreviewClass(e.target.value)}
                            className="w-full p-3 rounded-xl bg-white text-slate-900 font-bold text-xs shadow-xs cursor-pointer appearance-none text-center"
                          >
                            {CLASSES_LIST.map(cls => (
                              <option key={cls} value={cls}>{cls}</option>
                            ))}
                          </select>
                          <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-3.5 pointer-events-none" />
                        </div>

                        <div className="py-2">
                          <p className="text-xl font-black text-white">Price: Rs. {formData.price}/-</p>
                          <p className="text-[10px] text-pink-200">Inclusive of 25+ Interactive Tests &amp; Challenger rounds</p>
                        </div>

                        <button
                          type="button"
                          className="w-full py-3 rounded-2xl text-xs font-black uppercase tracking-wider bg-[#00b074] text-white hover:bg-[#009260] transition-all shadow-md cursor-pointer active:scale-95"
                        >
                          ⚡ START NOW
                        </button>

                        <p className="text-[11px] text-pink-200 font-bold underline cursor-pointer">
                          View Lessons Breakdown ↓
                        </p>
                      </div>
                    </div>

                    {/* RIGHT 8 COLS: Rich Course Content */}
                    <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border border-[#edd6ed] shadow-sm space-y-6">
                      {/* Program Header */}
                      <div className="border-b border-slate-100 pb-4">
                        <h1 className="text-xl sm:text-2xl font-black text-slate-900">
                          {formData.name} -
                        </h1>
                        <p className="text-xs sm:text-sm text-slate-500 italic mt-1 font-medium">
                          &ldquo;{formData.quote}&rdquo;
                        </p>
                      </div>

                      {/* Intro Paragraphs */}
                      <div className="space-y-2 text-xs sm:text-sm text-slate-700 leading-relaxed">
                        {formData.introParagraphs.map((p, idx) => (
                          <p key={idx}>{p}</p>
                        ))}
                      </div>

                      {/* Why Section */}
                      <div className="space-y-3 pt-2">
                        <h3 className="text-sm font-black text-slate-900">
                          Why &quot;{formData.name}&quot;?
                        </h3>
                        <ul className="space-y-2 text-xs text-slate-700 list-disc list-inside leading-relaxed">
                          {formData.whyReasons.map((r, idx) => (
                            <li key={idx}>{r}</li>
                          ))}
                        </ul>
                      </div>

                      {/* Eligibility */}
                      <div className="space-y-1 pt-2">
                        <h3 className="text-sm font-black text-slate-900">Eligibility</h3>
                        <p className="text-xs text-slate-600">{formData.eligibility}</p>
                      </div>

                      {/* Skills Covered (Class Boxes) */}
                      <div className="space-y-3 pt-2">
                        <h3 className="text-sm font-black text-slate-900">Skills Covered</h3>
                        <div className="space-y-2">
                          {formData.skillsCovered.map((s, idx) => (
                            <div key={idx} className="p-3 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-700 leading-relaxed">
                              <span className="font-bold text-slate-900">Class {s.classNum}: </span>
                              <span>{s.text}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Lessons Summary */}
                      <div className="space-y-2 pt-2 border-t border-slate-100">
                        <h3 className="text-sm font-black text-slate-900">Lessons</h3>
                        <ul className="text-xs text-slate-700 space-y-1 list-disc list-inside">
                          <li>{formData.lessonsCountText}</li>
                          <li>{formData.assessmentCountText}</li>
                          <li>{formData.challengerCountText}</li>
                        </ul>
                      </div>

                      {/* Price & Validity */}
                      <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-100 text-xs">
                        <div>
                          <h4 className="font-bold text-slate-900">Price</h4>
                          <p className="text-slate-600 mt-0.5">Rs. {formData.price} / GST</p>
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900">Valid Upto</h4>
                          <p className="text-slate-600 mt-0.5">{formData.validUpto}</p>
                        </div>
                      </div>

                      {/* Terms */}
                      <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500">
                        <p className="font-bold text-slate-700">Terms &amp; Conditions</p>
                        <p className="mt-0.5">{formData.termsText}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
          </div>

          {/* Bottom Save & Action Bar */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-2xs flex items-center justify-between">
            <button
              type="button"
              onClick={() => setShowEditorModal(false)}
              className="px-5 py-3 rounded-2xl text-sm font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer flex items-center gap-2"
            >
              <ArrowLeft className="w-4.5 h-4.5" />
              <span>Back to All Programs</span>
            </button>

            <button
              type="button"
              onClick={handleSaveProgram}
              className="px-7 py-3 rounded-2xl text-sm font-black text-white bg-[#00b074] hover:bg-[#009260] transition-all shadow-md active:scale-95 cursor-pointer flex items-center gap-2"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>Save &amp; Publish Program Live</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const CLASSES_LIST = [
  'Class 1',
  'Class 2',
  'Class 3',
  'Class 4',
  'Class 5',
  'Class 6',
  'Class 7',
  'Class 8',
  'Class 9',
  'Class 10'
];
