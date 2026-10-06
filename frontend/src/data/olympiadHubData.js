// OlympiadHub - Master Public Catalog & System Data
// 6 Core Disciplines: Mathematics, Science, Digital Literacy, English, General Knowledge, Hindi

export const OLYMPIAD_CATEGORIES = [
  {
    id: 'math',
    name: 'International Mathematics Olympiad',
    shortName: 'Mathematics',
    code: 'IMO-2026',
    icon: 'Calculator',
    badgeColor: 'plum',
    colorHex: '#ec4899',
    bgLight: '#fdf2f8',
    borderLight: '#fbcfe8',
    accentColor: '#8b5cf6',
    tagline: 'Test mathematical intuition, problem-solving, and logical deduction.',
    description: 'The premier national and international mathematical contest designed to challenge analytical thinking, spatial reasoning, and numerical precision across all student tiers.',
    eligibleClasses: 'Classes 1 to 12',
    classesList: ['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'],
    durationMinutes: 60,
    totalQuestions: 50,
    totalMarks: 60,
    levels: 2,
    difficulty: 'Advanced / Competitive',
    fee: 250,
    examDates: ['18 Dec 2026', '08 Jan 2027', '22 Jan 2027'],
    syllabus: [
      {
        topic: 'Number Sense & Operations',
        description: 'Large numbers, prime factorization, integers, LCM & HCF concepts.',
        learningOutcomes: 'Master fast computation, divisibility rules, and mental approximations.',
        questionsCount: 120
      },
      {
        topic: 'Fractions, Decimals & Percentages',
        description: 'Operations on rational numbers, conversion, proportions, and real-life unitary method.',
        learningOutcomes: 'Develop precision in quantitative comparisons and financial arithmetic.',
        questionsCount: 95
      },
      {
        topic: 'Geometry & Mensuration',
        description: '2D & 3D shapes, perimeter, area, volume, coordinate concepts, angles & symmetry.',
        learningOutcomes: 'Build spatial intuition, geometric proofs, and spatial transformation mastery.',
        questionsCount: 110
      },
      {
        topic: 'Algebraic Expressions & Equations',
        description: 'Variables, linear equations, polynomials, algebraic identities, exponents.',
        learningOutcomes: 'Synthesize abstract symbolic logic into concrete problem formulas.',
        questionsCount: 85
      },
      {
        topic: 'Higher Order Achievers Section',
        description: 'Complex multi-step puzzles, non-routine competitive challenges, and contest-level synthesis.',
        learningOutcomes: 'Develop Olympiad ranker problem breakdown strategies.',
        questionsCount: 60
      }
    ],
    pattern: {
      sections: [
        { name: 'Section 1: Mathematical Reasoning', questions: 20, marksPerQ: 1, negative: 0.25, desc: 'Logical and conceptual foundation questions' },
        { name: 'Section 2: Everyday Mathematics', questions: 20, marksPerQ: 1, negative: 0.25, desc: 'Application-based quantitative scenarios' },
        { name: 'Section 3: Achievers / Advanced', questions: 10, marksPerQ: 2, negative: 0.50, desc: 'High-order thinking synthesis (HOTS)' }
      ]
    }
  },
  {
    id: 'science',
    name: 'International Science Olympiad',
    shortName: 'Science',
    code: 'ISO-2026',
    icon: 'Atom',
    badgeColor: 'purple',
    colorHex: '#8b5cf6',
    bgLight: '#f5f3ff',
    borderLight: '#ddd6fe',
    accentColor: '#3b82f6',
    tagline: 'Empowering scientific inquiry, experimental logic, and natural exploration.',
    description: 'A comprehensive science assessment evaluating physics, chemistry, biology, and scientific methodology for budding researchers and innovators.',
    eligibleClasses: 'Classes 1 to 12',
    classesList: ['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'],
    durationMinutes: 60,
    totalQuestions: 50,
    totalMarks: 60,
    levels: 2,
    difficulty: 'Conceptual & Investigative',
    fee: 250,
    examDates: ['12 Dec 2026', '16 Jan 2027', '30 Jan 2027'],
    syllabus: [
      {
        topic: 'Physical Sciences & Mechanics',
        description: 'Motion, forces, energy, light, sound, magnetism, electricity, and simple machines.',
        learningOutcomes: 'Understand Newtonian principles and observational experiments.',
        questionsCount: 105
      },
      {
        topic: 'Chemical Substances & Transformations',
        description: 'Matter states, elements, mixtures, chemical bonding, acids & bases, environmental reactions.',
        learningOutcomes: 'Master chemical equations and reaction identification.',
        questionsCount: 90
      },
      {
        topic: 'Life Sciences & Ecology',
        description: 'Cell structure, human body systems, genetics, ecosystems, biodiversity, and health.',
        learningOutcomes: 'Connect biological anatomy with environmental sustainability.',
        questionsCount: 115
      },
      {
        topic: 'Achievers Investigative Section',
        description: 'Laboratory case analysis, hypothesis testing, and multi-disciplinary science challenges.',
        learningOutcomes: 'Cultivate scientific temperament and analytical diagnosis.',
        questionsCount: 50
      }
    ],
    pattern: {
      sections: [
        { name: 'Section 1: Scientific Reasoning', questions: 20, marksPerQ: 1, negative: 0.25, desc: 'Experimental concepts & theories' },
        { name: 'Section 2: Practical Science', questions: 20, marksPerQ: 1, negative: 0.25, desc: 'Real-world application problems' },
        { name: 'Section 3: Achievers Hotspot', questions: 10, marksPerQ: 2, negative: 0.50, desc: 'High-level discovery and synthesis' }
      ]
    }
  },
  {
    id: 'digital-literacy',
    name: 'International Digital Literacy Olympiad',
    shortName: 'Digital Literacy',
    code: 'IDLO-2026',
    icon: 'Cpu',
    badgeColor: 'blue',
    colorHex: '#3b82f6',
    bgLight: '#eff6ff',
    borderLight: '#bfdbfe',
    accentColor: '#8b5cf6',
    tagline: 'Computational thinking, cyber safety, AI fundamentals, and digital empowerment.',
    description: 'Empowering future technologists with computer science concepts, programming fundamentals, cybersecurity best practices, and practical Artificial Intelligence literacy.',
    eligibleClasses: 'Classes 1 to 12',
    classesList: ['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'],
    durationMinutes: 60,
    totalQuestions: 50,
    totalMarks: 60,
    levels: 2,
    difficulty: 'Computational & Futuristic',
    fee: 250,
    examDates: ['10 Dec 2026', '14 Jan 2027', '28 Jan 2027'],
    syllabus: [
      {
        topic: 'Computer Hardware & Networking',
        description: 'CPU architecture, memory hierarchies, peripherals, networking protocols, cloud principles.',
        learningOutcomes: 'Understand system internals and internet infrastructure.',
        questionsCount: 85
      },
      {
        topic: 'Algorithms & Computational Logic',
        description: 'Flowcharts, pseudo-code, loops, conditional branching, data structures (Arrays, Stacks).',
        learningOutcomes: 'Develop programmatic thinking and optimization mindset.',
        questionsCount: 110
      },
      {
        topic: 'Cybersecurity & Ethical Computing',
        description: 'Malware defense, encryption basics, phishing prevention, digital footprints, netiquette.',
        learningOutcomes: 'Operate safely and responsibly in modern digital environments.',
        questionsCount: 75
      },
      {
        topic: 'AI Literacy & Emerging Tech',
        description: 'Machine learning fundamentals, neural networks intuition, robotics, prompt logic.',
        learningOutcomes: 'Appreciate how modern AI systems process signals and patterns.',
        questionsCount: 60
      }
    ],
    pattern: {
      sections: [
        { name: 'Section 1: Computer Fundamentals', questions: 20, marksPerQ: 1, negative: 0.25, desc: 'Hardware, software & OS basics' },
        { name: 'Section 2: Algorithmic Thinking', questions: 20, marksPerQ: 1, negative: 0.25, desc: 'Logic, loops and structured steps' },
        { name: 'Section 3: Achievers Cyber Frontier', questions: 10, marksPerQ: 2, negative: 0.50, desc: 'Modern AI and complex logic' }
      ]
    }
  },
  {
    id: 'english',
    name: 'International English Olympiad',
    shortName: 'English',
    code: 'IEO-2026',
    icon: 'BookOpen',
    badgeColor: 'cyan',
    colorHex: '#06b6d4',
    bgLight: '#ecfeff',
    borderLight: '#a5f3fc',
    accentColor: '#ec4899',
    tagline: 'Mastering grammar, vocabulary, reading comprehension, and articulate expression.',
    description: 'An international benchmark assessment for English language proficiency, assessing lexical depth, syntax mastery, contextual inference, and verbal nuance.',
    eligibleClasses: 'Classes 1 to 12',
    classesList: ['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'],
    durationMinutes: 60,
    totalQuestions: 50,
    totalMarks: 60,
    levels: 2,
    difficulty: 'Proficiency & Expressive',
    fee: 250,
    examDates: ['05 Dec 2026', '09 Jan 2027', '23 Jan 2027'],
    syllabus: [
      {
        topic: 'Grammar Mechanics & Syntax',
        description: 'Tenses, subject-verb agreement, voice, narration, prepositions, conjunctions, clause structures.',
        learningOutcomes: 'Eliminate structural errors and grasp advanced grammatical rules.',
        questionsCount: 130
      },
      {
        topic: 'Lexical Depth & Vocabulary',
        description: 'Synonyms, antonyms, idioms, phrasal verbs, collocations, etymology, word nuances.',
        learningOutcomes: 'Expand active lexicon and semantic accuracy.',
        questionsCount: 140
      },
      {
        topic: 'Reading Comprehension & Critical Inference',
        description: 'Literary extracts, informational passages, tone analysis, figurative language.',
        learningOutcomes: 'Develop rapid reading, key idea extraction, and contextual deduction.',
        questionsCount: 95
      },
      {
        topic: 'Achievers Verbal Aptitude',
        description: 'Para-jumbles, critical reasoning, error spotting, advanced stylistic analysis.',
        learningOutcomes: 'Achieve top-tier verbal fluency under timed pressure.',
        questionsCount: 55
      }
    ],
    pattern: {
      sections: [
        { name: 'Section 1: Word and Structure Knowledge', questions: 25, marksPerQ: 1, negative: 0.25, desc: 'Grammar and lexical questions' },
        { name: 'Section 2: Reading & Comprehension', questions: 15, marksPerQ: 1, negative: 0.25, desc: 'Passage evaluation and deductions' },
        { name: 'Section 3: Achievers Expression', questions: 10, marksPerQ: 2, negative: 0.50, desc: 'Advanced verbal puzzle synthesis' }
      ]
    }
  },
  {
    id: 'gk',
    name: 'International General Knowledge Olympiad',
    shortName: 'General Knowledge',
    code: 'IGKO-2026',
    icon: 'Globe',
    badgeColor: 'amber',
    colorHex: '#f59e0b',
    bgLight: '#fffbeb',
    borderLight: '#fde68a',
    accentColor: '#ec4899',
    tagline: 'Global awareness, discoveries, national heritage, geopolitics, and current news.',
    description: 'A global benchmarking assessment evaluating general awareness, world geography, history, modern science, sports, civics, and international current affairs.',
    eligibleClasses: 'Classes 1 to 12',
    classesList: ['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'],
    durationMinutes: 50,
    totalQuestions: 50,
    totalMarks: 50,
    levels: 2,
    difficulty: 'General & Current Awareness',
    fee: 250,
    examDates: ['15 Dec 2026', '19 Jan 2027', '02 Feb 2027'],
    syllabus: [
      {
        topic: 'Our World & Environment',
        description: 'Continents, oceans, world capitals, landmarks, monuments, flora & fauna, planetary geography.',
        learningOutcomes: 'Master world physical and geopolitical geography.',
        questionsCount: 110
      },
      {
        topic: 'Science, Space & Discoveries',
        description: 'Inventions, space exploration, human body, famous scientists, digital milestones.',
        learningOutcomes: 'Understand pivotal scientific and technological milestones.',
        questionsCount: 95
      },
      {
        topic: 'India & World Heritage',
        description: 'Freedom movement, Indian constitution, folk art forms, festivals, international organizations (UN, WHO).',
        learningOutcomes: 'Deepen cultural pride and civic understanding.',
        questionsCount: 100
      },
      {
        topic: 'Sports, Literature & Current Events',
        description: 'Olympics, world championships, authors, famous books, current year awards and major news events.',
        learningOutcomes: 'Stay updated with dynamic global happenings.',
        questionsCount: 85
      }
    ],
    pattern: {
      sections: [
        { name: 'Section 1: General Awareness', questions: 25, marksPerQ: 1, negative: 0.20, desc: 'World, science and heritage' },
        { name: 'Section 2: Current Affairs', questions: 15, marksPerQ: 1, negative: 0.20, desc: 'Dynamic news and sports' },
        { name: 'Section 3: Achievers Hotspot', questions: 10, marksPerQ: 1, negative: 0.20, desc: 'Complex multi-disciplinary GK' }
      ]
    }
  },
  {
    id: 'hindi',
    name: 'International Hindi Olympiad',
    shortName: 'Hindi',
    code: 'IHO-2026',
    icon: 'Languages',
    badgeColor: 'emerald',
    colorHex: '#10b981',
    bgLight: '#ecfdf5',
    borderLight: '#a7f3d0',
    accentColor: '#3b82f6',
    tagline: 'हिंदी व्याकरण, शब्द सामर्थ्य, भाषा ज्ञान एवं अपठित बोध में निपुणता।',
    description: 'हिंदी भाषा के प्रति अनुराग, शुद्ध वर्तनी, व्याकरणिक नियमों की समझ, समृद्ध शब्दकोश तथा पठित-अपठित गद्यांश बोध का अंतर्राष्ट्रीय स्तर पर मूल्यांकन।',
    eligibleClasses: 'Classes 1 to 12',
    classesList: ['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'],
    durationMinutes: 50,
    totalQuestions: 50,
    totalMarks: 50,
    levels: 2,
    difficulty: 'Linguistic & Grammar Proficiency',
    fee: 250,
    examDates: ['20 Dec 2026', '12 Jan 2027', '26 Jan 2027'],
    syllabus: [
      {
        topic: 'वर्ण विचार एवं वर्तनी शुद्धि',
        description: 'स्वर, व्यंजन, मात्राएँ, संयुक्त व्यंजन, अनुस्वार, अनुनासिक तथा शुद्ध वर्तनी नियम।',
        learningOutcomes: 'शुद्ध उच्चारण एवं त्रुटिहीन वर्तनी लेखन में दक्षता।',
        questionsCount: 110
      },
      {
        topic: 'व्याकरण बोध (संज्ञा, सर्वनाम, क्रिया, विशेषण)',
        description: 'लिंग, वचन, कारक, काल, वाच्य, संधि, समास तथा पद परिचय की विस्तृत समझ।',
        learningOutcomes: 'व्याकरण के आधारभूत नियमों का व्यावहारिक अनुप्रयोग।',
        questionsCount: 130
      },
      {
        topic: 'शब्द भंडार एवं मुहावरे',
        description: 'पर्यायवाची, विलोम, अनेकार्थी शब्द, वाक्यांश के लिए एक शब्द, मुहावरे और लोकोक्तियाँ।',
        learningOutcomes: 'समृद्ध शब्द संपदा एवं प्रभावी अभिव्यक्ति क्षमता।',
        questionsCount: 120
      },
      {
        topic: 'अपठित गद्यांश एवं उच्च स्तरीय चिंतन (HOTS)',
        description: 'भाव ग्रहण, काव्यांश विश्लेषण, केंद्रीय विचार निरूपण एवं अचीवर्स सेक्शन।',
        learningOutcomes: 'तीव्र पठन बोध एवं आलोचनात्मक साहित्यिक समझ।',
        questionsCount: 60
      }
    ],
    pattern: {
      sections: [
        { name: 'खण्ड 1: भाषा एवं व्याकरण ज्ञान', questions: 25, marksPerQ: 1, negative: 0.20, desc: 'वर्ण, शब्द एवं व्याकरणिक संरचना' },
        { name: 'खण्ड 2: अपठित बोध एवं साहित्य', questions: 15, marksPerQ: 1, negative: 0.20, desc: 'गद्यांश, पद्यांश एवं भाव बोध' },
        { name: 'खण्ड 3: अचीवर्स सेक्शन (HOTS)', questions: 10, marksPerQ: 1, negative: 0.20, desc: 'उच्च स्तरीय भाषा चिंतन एवं मुहावरे' }
      ]
    }
  }
];

export const TRUST_STATS = [
  { label: 'Active Students Enrolled', value: '45,000+', count: 45000, suffix: '+', icon: 'Users' },
  { label: 'Partner Schools Globally', value: '1,200+', count: 1200, suffix: '+', icon: 'Building' },
  { label: 'Olympiad Categories', value: '6 Premier Disciplines', count: 6, suffix: '', icon: 'BookOpen' },
  { label: 'Participating Countries', value: '30+ Nations', count: 30, suffix: '+', icon: 'Globe' }
];

export const AWARDS_STRUCTURE = [
  {
    tier: 'International Gold Medal & Cash Grant',
    rank: 'Rank 1 Globally',
    reward: 'Pure Gold Plated Medal + ₹50,000 Academic Scholarship + Trophy + Merit Certificate',
    colorHex: '#e7b84b',
    bg: '#faf4e0',
    border: '#f5e7bf'
  },
  {
    tier: 'International Silver Medal & Grant',
    rank: 'Rank 2 Globally',
    reward: 'Sterling Silver Plated Medal + ₹25,000 Academic Scholarship + Merit Certificate',
    colorHex: '#a868a7',
    bg: '#f4ebf4',
    border: '#edd6ed'
  },
  {
    tier: 'International Bronze Medal & Grant',
    rank: 'Rank 3 Globally',
    reward: 'Bronze Medal of Excellence + ₹15,000 Scholarship + Merit Certificate',
    colorHex: '#d9775b',
    bg: '#fdf6f4',
    border: '#f7d7cc'
  },
  {
    tier: 'Zonal & National Excellence Awards',
    rank: 'Top 10 in State / Zone',
    reward: 'Zonal Gold / Silver / Bronze Medals + Merit Certificate + Free Level 2 Entry',
    colorHex: '#6d3a68',
    bg: '#faf5fa',
    border: '#edd6ed'
  },
  {
    tier: 'Digital Certificate of Merit',
    rank: 'Score ≥ 60%',
    reward: 'Blockchain Verified Digital Certificate of Merit with National Percentile Score',
    colorHex: '#594774',
    bg: '#f3f0fb',
    border: '#e8e2f7'
  },
  {
    tier: 'Certificate of Participation',
    rank: 'All Contestants',
    reward: 'Official Digital Participation Certificate with detailed Topic Strengths Analysis',
    colorHex: '#713729',
    bg: '#fff9f2',
    border: '#faf3e8'
  }
];

export const SAMPLE_PAPERS_CATALOG = [
  { id: 'sp-1', year: '2026', title: 'Official Sample Paper 2026', olympiad: 'Mathematics', class: 'Class 5', questions: 50, duration: '60 mins', difficulty: 'Official Model', pdfSize: '2.4 MB' },
  { id: 'sp-2', year: '2026', title: 'Official Sample Paper 2026', olympiad: 'Science', class: 'Class 5', questions: 50, duration: '60 mins', difficulty: 'Official Model', pdfSize: '2.8 MB' },
  { id: 'sp-3', year: '2026', title: 'Official Sample Paper 2026', olympiad: 'English', class: 'Class 4', questions: 50, duration: '60 mins', difficulty: 'Official Model', pdfSize: '1.9 MB' },
  { id: 'sp-4', year: '2026', title: 'Official Sample Paper 2026', olympiad: 'Digital Literacy', class: 'Class 6', questions: 50, duration: '60 mins', difficulty: 'Official Model', pdfSize: '2.7 MB' },
  { id: 'sp-5', year: '2026', title: 'Official Sample Paper 2026', olympiad: 'General Knowledge', class: 'Class 5', questions: 50, duration: '50 mins', difficulty: 'Official Model', pdfSize: '2.1 MB' },
  { id: 'sp-6', year: '2026', title: 'Official Sample Paper 2026', olympiad: 'Hindi', class: 'Class 5', questions: 50, duration: '50 mins', difficulty: 'Official Model', pdfSize: '2.0 MB' },
  { id: 'sp-7', year: '2025', title: 'Previous Year Paper 2025', olympiad: 'Mathematics', class: 'Class 6', questions: 50, duration: '60 mins', difficulty: 'Past Actual', pdfSize: '3.1 MB' },
  { id: 'sp-8', year: '2025', title: 'Previous Year Paper 2025', olympiad: 'Science', class: 'Class 7', questions: 50, duration: '60 mins', difficulty: 'Past Actual', pdfSize: '2.9 MB' },
  { id: 'sp-9', year: '2025', title: 'Previous Year Paper 2025', olympiad: 'Hindi', class: 'Class 6', questions: 50, duration: '50 mins', difficulty: 'Past Actual', pdfSize: '2.3 MB' }
];

export const WORKBOOKS_CATALOG = [
  { id: 'wb-1', title: 'Olympiad Champion Math Workbook', subject: 'Mathematics', class: 'Class 5', pages: 180, rating: 4.9, reviews: 340, desc: 'Over 800+ categorized questions, chapter tests, past exam papers, and detailed solution rationales.', badge: 'Bestseller' },
  { id: 'wb-2', title: 'Science Explorer Olympiad Masterguide', subject: 'Science', class: 'Class 5', pages: 210, rating: 4.8, reviews: 290, desc: 'Illustrated scientific concepts, experiment breakdowns, HOTS questions, and model test papers.', badge: 'Top Rated' },
  { id: 'wb-3', title: 'Digital Literacy & Cyber Skills Workbook', subject: 'Digital Literacy', class: 'Class 6', pages: 175, rating: 4.9, reviews: 260, desc: 'Practical computer logic, algorithms, AI foundations, and cyber safety drills.', badge: 'New Edition' },
  { id: 'wb-4', title: 'Word Mastery & Grammar Workbook', subject: 'English', class: 'Class 4', pages: 160, rating: 4.9, reviews: 210, desc: 'Complete coverage of grammar mechanics, 1,200 vocabulary roots, reading passages, and mock tests.', badge: 'Recommended' },
  { id: 'wb-5', title: 'General Knowledge & Current Affairs Master', subject: 'General Knowledge', class: 'Class 5', pages: 150, rating: 4.8, reviews: 185, desc: 'Global facts, Indian heritage, space discoveries, and current affairs quizzes.', badge: 'Popular' },
  { id: 'wb-6', title: 'हिंदी भाषा एवं व्याकरण अभ्यास पुस्तिका', subject: 'Hindi', class: 'Class 5', pages: 165, rating: 4.9, reviews: 220, desc: 'सम्पूर्ण व्याकरण, शब्द भंडार, मुहावरे, अपठित गद्यांश एवं अभ्यास प्रश्न पत्र।', badge: 'Bestseller' }
];

export const FAQS_LIST = [
  {
    category: 'Registration',
    q: 'Who is eligible to participate in OlympiadHub exams?',
    a: 'Students from Nursery to Class 12 enrolled in any recognized school board (CBSE, ICSE, IB, Cambridge, State Boards) worldwide are eligible to register independently as individual students or via their partner schools.'
  },
  {
    category: 'Registration',
    q: 'Can a student register for multiple Olympiad disciplines in the same year?',
    a: 'Yes! Students can participate in all 6 core subjects: Mathematics, Science, Digital Literacy, English, General Knowledge, and Hindi. Exam slots are staggered to prevent timing clashes.'
  },
  {
    category: 'Exams & Mode',
    q: 'How are the examinations conducted?',
    a: 'All exams are conducted online through our proprietary, secure, distraction-free Olympiad examination portal. Students can attempt the tests from their laptops, desktops, or tablets at home or from computer labs in partner schools.'
  },
  {
    category: 'Exams & Mode',
    q: 'What are the technical requirements to take the test?',
    a: 'A desktop, laptop, or tablet with a modern web browser (Google Chrome, Firefox, Microsoft Edge, or Safari) and a stable internet connection (minimum 1 Mbps). A webcam check is used for online proctoring verification.'
  },
  {
    category: 'Slot Booking',
    q: 'How does exam slot booking work?',
    a: 'Upon registration, students can choose their preferred date and convenient time slot (e.g. 10:00 AM, 02:00 PM, or 04:00 PM) from the available schedule. Slots can be modified up to 48 hours prior to the test.'
  },
  {
    category: 'Results & Certificates',
    q: 'When are the results and scorecards published?',
    a: 'Preliminary scorecards and detailed question-by-question evaluations are generated immediately or within 7 days of the exam window closing. International and Zonal rank lists are released alongside digital verifiable certificates.'
  },
  {
    category: 'Results & Certificates',
    q: 'How can universities, parents, and schools verify OlympiadHub certificates?',
    a: 'Every issued certificate carries a unique Certificate ID and cryptographic verification code. Anyone can verify authenticity instantly on our public Certificate Verification page by entering the certificate number.'
  },
  {
    category: 'For Schools',
    q: 'How can a school register as an institutional examination center?',
    a: 'Schools can register via our dedicated "For Schools" portal. School coordinators receive an institutional dashboard with bulk student onboarding, customized fee concessions, exam monitoring, and school-wide performance analytics.'
  }
];

export const BLOG_POSTS = [
  {
    id: 'blog-1',
    title: 'How Olympiad Preparation Builds Lifelong Scientific & Analytical Rigor',
    category: 'Parent Guide',
    author: 'Dr. Ramesh Verma',
    readTime: '5 min read',
    date: 'Sep 24, 2026',
    snippet: 'Beyond competitive ranks, Olympiad training wires young brains for systematic hypothesis testing, algorithmic thinking, and calm confidence under pressure.',
    tags: ['Olympiad Tips', 'Parenting', 'STEM']
  },
  {
    id: 'blog-2',
    title: 'Top 7 Mental Math Shortcuts Every Young Competitor Should Master',
    category: 'Mathematics',
    author: 'Sunita Mehra',
    readTime: '6 min read',
    date: 'Sep 18, 2026',
    snippet: 'Discover Vedic and modern mathematical base techniques that allow Class 3-8 students to multiply multi-digit numbers in seconds without scrap paper.',
    tags: ['Math Shortcuts', 'Speed', 'Calculations']
  },
  {
    id: 'blog-3',
    title: 'Demystifying AI & Digital Literacy for School Students',
    category: 'Digital Literacy',
    author: 'Ananya Deshmukh',
    readTime: '4 min read',
    date: 'Sep 10, 2026',
    snippet: 'How early exposure to computational logic, digital safety, and AI concepts prepares young learners for an AI-native world.',
    tags: ['Artificial Intelligence', 'Digital Literacy', 'Future Skills']
  }
];

export const TESTIMONIALS = [
  {
    name: 'Pooja Sharma',
    role: 'Parent of Aarav (Class 5 Gold Ranker)',
    school: 'Delhi Public School, R.K. Puram',
    comment: 'OlympiadHub is remarkably well designed. The practice tests, detailed question explanations, and warm UI helped Aarav build genuine love for mathematics rather than test anxiety.',
    rating: 5,
    avatarChar: 'P'
  },
  {
    name: 'Sister Mary Joseph',
    role: 'Academic Coordinator',
    school: 'St. Xavier’s International Academy',
    comment: 'As a school coordinator with 400+ participating students, the School Dashboard made bulk uploads, schedule assignment, and comparative class analytics an absolute breeze.',
    rating: 5,
    avatarChar: 'S'
  },
  {
    name: 'Vikramaditya Rao',
    role: 'Student (Class 8 Science & Digital Literacy Medalist)',
    school: 'National Public School, Bengaluru',
    comment: 'The live test interface with auto-save and the instant scorecard breakdown showed me exactly which physics concepts I needed to revise. Truly international standard!',
    rating: 5,
    avatarChar: 'V'
  }
];

export const CUTOFF_DATA = [
  { olympiad: 'Mathematics Olympiad', class: 'Class 5', year: '2026', maxMarks: 60, level1Cutoff: 44.5, level2Cutoff: 52.0, top1Percentile: 56.5 },
  { olympiad: 'Science Olympiad', class: 'Class 5', year: '2026', maxMarks: 60, level1Cutoff: 42.0, level2Cutoff: 50.5, top1Percentile: 55.0 },
  { olympiad: 'Digital Literacy Olympiad', class: 'Class 6', year: '2026', maxMarks: 60, level1Cutoff: 43.0, level2Cutoff: 51.0, top1Percentile: 55.5 },
  { olympiad: 'English Olympiad', class: 'Class 5', year: '2026', maxMarks: 60, level1Cutoff: 46.0, level2Cutoff: 53.5, top1Percentile: 57.5 },
  { olympiad: 'General Knowledge Olympiad', class: 'Class 5', year: '2026', maxMarks: 50, level1Cutoff: 40.0, level2Cutoff: 46.0, top1Percentile: 48.5 },
  { olympiad: 'Hindi Olympiad', class: 'Class 5', year: '2026', maxMarks: 50, level1Cutoff: 41.5, level2Cutoff: 47.0, top1Percentile: 49.0 }
];

export const PUBLIC_LEADERBOARD = [
  { rank: 1, name: 'Aarav Sharma', class: 'Class 10', school: 'DPS International', city: 'New Delhi', score: 60.0, accuracy: '100%', timeTaken: '34m 12s', medal: 'Gold Medalist' },
  { rank: 2, name: 'Meera Iyer', class: 'Class 10', school: 'National Public School', city: 'Bengaluru', score: 58.5, accuracy: '97.5%', timeTaken: '38m 45s', medal: 'Silver Medalist' },
  { rank: 3, name: 'Kabir Singhania', class: 'Class 10', school: 'The Cathedral School', city: 'Mumbai', score: 57.0, accuracy: '95.0%', timeTaken: '41m 20s', medal: 'Bronze Medalist' },
  { rank: 4, name: 'Ananya Verma', class: 'Class 10', school: 'Modern High School', city: 'Kolkata', score: 56.0, accuracy: '93.3%', timeTaken: '43m 10s', medal: 'Merit Distinction' },
  { rank: 5, name: 'Rohan Kulkarni', class: 'Class 10', school: 'Symbiosis International', city: 'Pune', score: 55.5, accuracy: '92.5%', timeTaken: '44m 05s', medal: 'Merit Distinction' },
  { rank: 6, name: 'Tanvi Reddy', class: 'Class 10', school: 'Hyderabad Public School', city: 'Hyderabad', score: 54.0, accuracy: '90.0%', timeTaken: '45m 30s', medal: 'Merit Distinction' },
  { rank: 7, name: 'Siddharth Nair', class: 'Class 10', school: 'Chinmaya Vidyalaya', city: 'Kochi', score: 53.5, accuracy: '89.1%', timeTaken: '47m 15s', medal: 'Merit Distinction' },
  { rank: 8, name: 'muskan', class: 'Class 1', school: 'OlympiadHub Global Online', city: 'Delhi', score: 52.0, accuracy: '86.7%', timeTaken: '48m 50s', medal: 'Honorable Mention' }
];
