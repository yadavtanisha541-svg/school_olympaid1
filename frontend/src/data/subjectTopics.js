// Master Source of Truth for Olympiad Subject Topics / Chapters
// Synced between Student Panel (Test Generator Pro, Mock Tests, Practice) and Super Admin Panel

export const CHAPTERS_BY_SUBJECT = {
  math: [
    'Number Sense and Numeration',
    'Computation Operations (Add, Sub, Mul, Div)',
    'Fractions and Decimals',
    'Geometry and Spatial Understanding',
    'Perimeter, Area and Volume',
    'Data Handling and Graphical Representation',
    'Algebraic Expressions and Equations',
    'Ratio, Proportion and Unitary Method',
    'Everyday Mathematics Word Problems',
    'Achievers Section (HOTS Questions)'
  ],
  science: [
    'Plants and Animal Kingdom',
    'Human Body Systems and Nutrition',
    'Matter, Materials and States of Matter',
    'Force, Work, Energy and Simple Machines',
    'Light, Shadows and Reflections',
    'Electricity, Circuits and Magnetism',
    'Air, Water and Our Environment',
    'Natural Resources and Conservation',
    'Earth, Universe and Space Sciences',
    'Scientific Inquiry & HOTS'
  ],
  digital: [
    'Fundamentals of Computer & OS',
    'Hardware, Storage & Memory Devices',
    'Software & Application Tools',
    'Internet, Networking & Cyber Safety',
    'MS Office Tools (Word, Excel, PowerPoint)',
    'Algorithms, Flowcharts & AI Basics',
    'Achievers Section (Advanced Computing)'
  ],
  english: [
    'Nouns, Pronouns and Determiners',
    'Verbs, Tenses and Modal Auxiliaries',
    'Adjectives, Adverbs and Prepositions',
    'Conjunctions and Sentence Structure',
    'Active and Passive Voice',
    'Direct and Indirect Speech',
    'Vocabulary, Synonyms and Antonyms',
    'Idioms, Proverbs and Phrasal Verbs',
    'Reading Comprehension Passages',
    'Spoken and Written Expression'
  ],
  gk: [
    'Our Body and Health',
    'Plants, Animals & Environment',
    'India: States, Capitals & Culture',
    'World Geography & Landmarks',
    'Science and Technology Discoveries',
    'Current National & International Affairs',
    'Sports, Games & Awards',
    'Life Skills & Quantitative Aptitude'
  ],
  hindi: [
    'वर्ण विचार एवं वर्तनी शुद्धि',
    'शब्द विचार (संज्ञा, सर्वनाम, विशेषण)',
    'क्रिया, काल एवं कारक',
    'संधि, समास, उपसर्ग एवं प्रत्यय',
    'पर्यायवाची एवं विलोम शब्द',
    'मुहावरे, लोकोक्तियाँ एवं वाक्य शुद्धि',
    'अपठित गद्यांश एवं भाषा बोध'
  ],
  reasoning: [
    'Patterns & Series Completion',
    'Analogy & Classification',
    'Coding & Decoding',
    'Blood Relations & Direction Sense',
    'Logical Venn Diagrams',
    'Alphabet & Number Test',
    'Mirror & Water Images',
    'Embedded Figures & Paper Folding'
  ]
};

// Aliases
CHAPTERS_BY_SUBJECT.cyber = CHAPTERS_BY_SUBJECT.digital;
CHAPTERS_BY_SUBJECT['digital-literacy'] = CHAPTERS_BY_SUBJECT.digital;
CHAPTERS_BY_SUBJECT.mathematics = CHAPTERS_BY_SUBJECT.math;
CHAPTERS_BY_SUBJECT.general_knowledge = CHAPTERS_BY_SUBJECT.gk;

/**
 * Normalizes any subject code or name (e.g. 'IMO', 'math', 'IGKO', 'gk', 'ISO', 'science', etc.)
 * and returns the exact array of topics.
 */
export const getTopicsForSubject = (subjectKey = '') => {
  if (!subjectKey) return [];
  const clean = String(subjectKey).toLowerCase().trim();

  if (clean.includes('math') || clean === 'imo') return CHAPTERS_BY_SUBJECT.math;
  if (clean.includes('sci') || clean === 'iso') return CHAPTERS_BY_SUBJECT.science;
  if (clean.includes('digit') || clean.includes('cyber') || clean.includes('comp') || clean === 'idlo' || clean === 'icso') return CHAPTERS_BY_SUBJECT.digital;
  if (clean.includes('eng') || clean === 'ieo') return CHAPTERS_BY_SUBJECT.english;
  if (clean.includes('gk') || clean.includes('general') || clean === 'igko') return CHAPTERS_BY_SUBJECT.gk;
  if (clean.includes('hin') || clean === 'iho') return CHAPTERS_BY_SUBJECT.hindi;
  if (clean.includes('reason') || clean === 'isso') return CHAPTERS_BY_SUBJECT.reasoning;

  return CHAPTERS_BY_SUBJECT[clean] || [];
};

export const SUBJECTS_TOPIC_METADATA = [
  { id: 'math', code: 'IMO', name: 'IMO (Mathematics)', color: '#d97706', topics: CHAPTERS_BY_SUBJECT.math },
  { id: 'science', code: 'ISO', name: 'ISO (Science)', color: '#059669', topics: CHAPTERS_BY_SUBJECT.science },
  { id: 'digital', code: 'IDLO', name: 'IDLO (Digital Literacy)', color: '#0284c7', topics: CHAPTERS_BY_SUBJECT.digital },
  { id: 'english', code: 'IEO', name: 'IEO (English)', color: '#ea580c', topics: CHAPTERS_BY_SUBJECT.english },
  { id: 'gk', code: 'IGKO', name: 'IGKO (General Knowledge)', color: '#e7b84b', topics: CHAPTERS_BY_SUBJECT.gk },
  { id: 'hindi', code: 'IHO', name: 'IHO (Hindi)', color: '#dc2626', topics: CHAPTERS_BY_SUBJECT.hindi },
  { id: 'reasoning', code: 'ISSO', name: 'ISSO (Reasoning)', color: '#b97fa8', topics: CHAPTERS_BY_SUBJECT.reasoning }
];
