/**
 * OlympiadHub - Database Engine & Relational Schema
 * Manages local persistence, schema migrations, and pre-seeded rich educational data.
 */

const DB_KEY = 'OLYMPIADHUB_STORAGE_V1';

const INITIAL_DB = {
  classes: [
    { id: 'nursery', name: 'Nursery', ageGroup: '3-4 Years', stage: 'Early Years' },
    { id: 'kg', name: 'Kindergarten (KG)', ageGroup: '4-5 Years', stage: 'Early Years' },
    { id: '1', name: 'Class 1', ageGroup: '5-6 Years', stage: 'Primary' },
    { id: '2', name: 'Class 2', ageGroup: '6-7 Years', stage: 'Primary' },
    { id: '3', name: 'Class 3', ageGroup: '7-8 Years', stage: 'Primary' },
    { id: '4', name: 'Class 4', ageGroup: '8-9 Years', stage: 'Primary' },
    { id: '5', name: 'Class 5', ageGroup: '9-10 Years', stage: 'Primary' },
    { id: '6', name: 'Class 6', ageGroup: '10-11 Years', stage: 'Middle' },
    { id: '7', name: 'Class 7', ageGroup: '11-12 Years', stage: 'Middle' },
    { id: '8', name: 'Class 8', ageGroup: '12-13 Years', stage: 'Middle' },
    { id: '9', name: 'Class 9', ageGroup: '13-14 Years', stage: 'Secondary' },
    { id: '10', name: 'Class 10', ageGroup: '14-15 Years', stage: 'Secondary' }
  ],

  subjects: [
    { id: 'math', name: 'Mathematics', code: 'MATH', icon: 'calculator', color: '#1E3A8A' },
    { id: 'science', name: 'Science', code: 'SCI', icon: 'atom', color: '#0D9488' },
    { id: 'english', name: 'English Language', code: 'ENG', icon: 'book-open', color: '#4F46E5' },
    { id: 'cyber', name: 'Computer & Cyber', code: 'CYBER', icon: 'cpu', color: '#0891B2' },
    { id: 'reasoning', name: 'Logical Reasoning', code: 'REAS', icon: 'brain', color: '#D97706' },
    { id: 'gk', name: 'General Knowledge', code: 'GK', icon: 'globe', color: '#059669' }
  ],

  olympiads: [
    {
      id: 'imo-2026',
      code: 'IMO',
      name: 'International Mathematics Olympiad',
      tagline: 'Empowering Mathematical Thinkers and Problem Solvers',
      subject: 'math',
      eligibleClasses: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
      fee: 250,
      examDate: '2026-11-15',
      durationMinutes: 60,
      totalQuestions: 35,
      totalMarks: 100,
      passingMarks: 40,
      isRegistrationOpen: true,
      badge: 'Flagship Event',
      markingScheme: '+2 or +3 for correct answers, -0.5 for wrong answers in Achievers Section',
      overview: 'The International Mathematics Olympiad tests mathematical reasoning, logical aptitude, and problem-solving abilities through real-world and challenging abstract mathematics.',
      syllabusSummary: 'Number Sense, Computation, Fractions, Geometry, Measurement, Data Handling, Everyday Math & High-Order Thinking (HOT) Achievers Section.'
    },
    {
      id: 'nso-2026',
      code: 'NSO',
      name: 'National Science Olympiad',
      tagline: 'Inspiring Scientific Curiosity, Experimentation & Discovery',
      subject: 'science',
      eligibleClasses: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
      fee: 250,
      examDate: '2026-11-28',
      durationMinutes: 60,
      totalQuestions: 35,
      totalMarks: 100,
      passingMarks: 40,
      isRegistrationOpen: true,
      badge: 'STEM Certified',
      markingScheme: '+2 or +3 for correct answers, no negative marking for basic section',
      overview: 'Evaluates fundamental scientific concepts, empirical reasoning, scientific enquiry, and environmental & physical sciences.',
      syllabusSummary: 'Living & Non-Living, Human Body, Plants & Animals, Force, Motion, Energy, Light & Sound, Matter, Universe & Space Science.'
    },
    {
      id: 'ieo-2026',
      code: 'IEO',
      name: 'International English Olympiad',
      tagline: 'Mastering Grammar, Vocabulary, Syntax & Reading Comprehension',
      subject: 'english',
      eligibleClasses: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
      fee: 220,
      examDate: '2026-12-05',
      durationMinutes: 60,
      totalQuestions: 35,
      totalMarks: 100,
      passingMarks: 40,
      isRegistrationOpen: true,
      badge: 'Language Excellence',
      markingScheme: '+2 for grammar & reading, +3 for Higher Order Thinking',
      overview: 'Tests vocabulary acquisition, syntax, idiomatic mastery, reading comprehension, and spoken/written English acumen.',
      syllabusSummary: 'Word Power, Parts of Speech, Tenses, Active/Passive Voice, Direct/Indirect, Synonyms & Antonyms, Reading Comprehension, Spoken Expression.'
    },
    {
      id: 'nco-2026',
      code: 'NCO',
      name: 'National Cyber & AI Olympiad',
      tagline: 'Fostering Next-Gen Computational Thinkers & Digital Creators',
      subject: 'cyber',
      eligibleClasses: ['3', '4', '5', '6', '7', '8', '9', '10'],
      fee: 250,
      examDate: '2026-12-18',
      durationMinutes: 60,
      totalQuestions: 35,
      totalMarks: 100,
      passingMarks: 40,
      isRegistrationOpen: true,
      badge: 'Tech & AI Focused',
      markingScheme: '+2 for standard, +3 for Coding/Algorithm section',
      overview: 'Covers fundamentals of computing, operating systems, algorithm design, scratch programming, python basics, networking, and emerging AI concepts.',
      syllabusSummary: 'Hardware & Software, MS Office/Workspace, Algorithms & Flowcharts, Programming Logic, Internet & Cybersecurity, Artificial Intelligence Basics.'
    },
    {
      id: 'lrao-2026',
      code: 'LRAO',
      name: 'Logical Reasoning & Aptitude Olympiad',
      tagline: 'Sharpening Deductive Logic, Pattern Recognition & Critical Thinking',
      subject: 'reasoning',
      eligibleClasses: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
      fee: 200,
      examDate: '2027-01-10',
      durationMinutes: 45,
      totalQuestions: 30,
      totalMarks: 90,
      passingMarks: 36,
      isRegistrationOpen: true,
      badge: 'Cognitive Skills',
      markingScheme: '+3 marks per question, -0.5 for wrong answers',
      overview: 'Designed to benchmark a child’s natural cognitive reasoning, analytical deduction, spatial reasoning, and pattern synthesis.',
      syllabusSummary: 'Pattern Completion, Analogy, Classification, Coding-Decoding, Blood Relations, Direction Sense, Venn Diagrams, Cube & Dice.'
    },
    {
      id: 'gko-2026',
      code: 'GKO',
      name: 'Global Knowledge & Current Affairs Olympiad',
      tagline: 'Expanding World Awareness, Heritage, Inventions & Global Perspectives',
      subject: 'gk',
      eligibleClasses: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
      fee: 200,
      examDate: '2027-01-24',
      durationMinutes: 45,
      totalQuestions: 30,
      totalMarks: 90,
      passingMarks: 36,
      isRegistrationOpen: true,
      badge: 'General Awareness',
      markingScheme: '+3 marks per question, no negative marking',
      overview: 'Covers Indian and World Geography, History, Current Affairs, Science & Tech Innovations, Sports, Arts, Literature, and Global Institutions.',
      syllabusSummary: 'World Heritage, Flora & Fauna, Discoveries, Global Leaders, Sports Trivia, Space Explorations, Current Global Events.'
    },
    {
      id: 'jsto-2026',
      code: 'JSTO',
      name: 'Junior Scholars Talent Olympiad',
      tagline: 'Early Foundational Cognitive & Curiosity Benchmark for Pre-Schoolers',
      subject: 'math',
      eligibleClasses: ['nursery', 'kg'],
      fee: 180,
      examDate: '2027-02-08',
      durationMinutes: 30,
      totalQuestions: 20,
      totalMarks: 60,
      passingMarks: 24,
      isRegistrationOpen: true,
      badge: 'Early Childhood',
      markingScheme: '+3 marks per question, friendly audio visual cues',
      overview: 'A gentle, pictorial, and engaging Olympiad for Nursery and KG children to foster early pattern recognition, shape sorting, and number sense.',
      syllabusSummary: 'Visual Shapes, Colors & Sizes, Counting 1-20, Basic Animal/Plant Recognition, Sequence Matching, Rhyme Concept Logic.'
    }
  ],

  topics: [
    // Class 5 Math
    { id: 'math-5-num', class: '5', subject: 'math', title: 'Numbers & Large Numeration', desc: 'Place value, 7-8 digit operations, Indian and International systems, Roman numerals.', weight: 18 },
    { id: 'math-5-frac', class: '5', subject: 'math', title: 'Fractions & Decimals', desc: 'Equivalent fractions, arithmetic on mixed fractions, decimal conversions, word problems.', weight: 22 },
    { id: 'math-5-geom', class: '5', subject: 'math', title: 'Geometry & Angles', desc: 'Lines, angles (acute, obtuse, reflex), perimeter, area of rectangles and composite figures.', weight: 20 },
    { id: 'math-5-data', class: '5', subject: 'math', title: 'Data Handling & Graphs', desc: 'Bar graphs, pictographs, pie charts, interpreting statistical averages.', weight: 15 },
    { id: 'math-5-reas', class: '5', subject: 'math', title: 'Logical Reasoning & HOTS', desc: 'Number sequences, magic squares, geometric patterns, balance scale puzzles.', weight: 25 },
    
    // Class 5 Science
    { id: 'sci-5-plant', class: '5', subject: 'science', title: 'Plant Reproduction & Seed Dispersal', desc: 'Parts of flower, pollination, germination conditions, agriculture.', weight: 20 },
    { id: 'sci-5-human', class: '5', subject: 'science', title: 'Human Body Systems & Health', desc: 'Circulatory, nervous, skeletal systems, deficiency diseases and balanced diet.', weight: 25 },
    { id: 'sci-5-matter', class: '5', subject: 'science', title: 'Matter & Materials', desc: 'Solids, liquids, gases, solubility, separation of mixtures.', weight: 20 },
    { id: 'sci-5-force', class: '5', subject: 'science', title: 'Force, Work & Simple Machines', desc: 'Gravity, friction, levers, pulleys, inclined planes.', weight: 20 },
    { id: 'sci-5-env', class: '5', subject: 'science', title: 'Environment & Natural Resources', desc: 'Pollution, conservation, greenhouse effect, rock cycles.', weight: 15 }
  ],

  questions: [
    // Mathematics Class 5 / 6 Questions
    {
      id: 'q-m5-01',
      examCode: 'IMO',
      subject: 'math',
      class: '5',
      topic: 'math-5-frac',
      topicName: 'Fractions & Decimals',
      difficulty: 'Medium',
      type: 'mcq',
      question: 'A baker has 12 1/2 kg of flour. He uses 3 3/4 kg to bake sourdough bread and 4 1/2 kg to bake chocolate cakes. How much flour is left in the container?',
      options: [
        { id: 'A', text: '4 1/4 kg' },
        { id: 'B', text: '4 3/4 kg' },
        { id: 'C', text: '5 1/4 kg' },
        { id: 'D', text: '3 3/4 kg' }
      ],
      correctAnswer: 'A',
      explanation: 'Total flour used = 3 3/4 + 4 1/2 = 15/4 + 9/2 = 15/4 + 18/4 = 33/4 = 8 1/4 kg. Remaining flour = 12 1/2 - 8 1/4 = 25/2 - 33/4 = 50/4 - 33/4 = 17/4 = 4 1/4 kg.',
      marks: 3,
      negativeMarks: 0.5
    },
    {
      id: 'q-m5-02',
      examCode: 'IMO',
      subject: 'math',
      class: '5',
      topic: 'math-5-num',
      topicName: 'Numbers & Large Numeration',
      difficulty: 'Easy',
      type: 'mcq',
      question: 'What is the value of 25 × 4 + 350 ÷ 7 - 15?',
      options: [
        { id: 'A', text: '125' },
        { id: 'B', text: '135' },
        { id: 'C', text: '145' },
        { id: 'D', text: '115' }
      ],
      correctAnswer: 'B',
      explanation: 'Following BODMAS rule: 25 × 4 = 100, 350 ÷ 7 = 50. Equation becomes 100 + 50 - 15 = 150 - 15 = 135.',
      marks: 2,
      negativeMarks: 0
    },
    {
      id: 'q-m5-03',
      examCode: 'IMO',
      subject: 'math',
      class: '5',
      topic: 'math-5-geom',
      topicName: 'Geometry & Angles',
      difficulty: 'Hard',
      type: 'mcq',
      question: 'A rectangular garden has a length of 28 meters and a perimeter of 88 meters. If grass tiles cost $4.50 per square meter, what is the total cost of turfed grass for the entire garden?',
      options: [
        { id: 'A', text: '$1,764.00' },
        { id: 'B', text: '$1,980.00' },
        { id: 'C', text: '$2,150.00' },
        { id: 'D', text: '$1,848.00' }
      ],
      correctAnswer: 'A',
      explanation: 'Perimeter = 2 × (Length + Width) => 88 = 2 × (28 + Width) => 28 + Width = 44 => Width = 16 m. Area = 28 × 16 = 448 sq.m. Total cost = 448 × 4.50 = $1,764.00.',
      marks: 4,
      negativeMarks: 1
    },
    {
      id: 'q-m5-04',
      examCode: 'IMO',
      subject: 'math',
      class: '5',
      topic: 'math-5-reas',
      topicName: 'Logical Reasoning & HOTS',
      difficulty: 'Hard',
      type: 'mcq',
      question: 'Look at the sequence: 4, 9, 19, 39, 79, ? . What is the next number in this pattern?',
      options: [
        { id: 'A', text: '158' },
        { id: 'B', text: '159' },
        { id: 'C', text: '169' },
        { id: 'D', text: '149' }
      ],
      correctAnswer: 'B',
      explanation: 'The rule is (Previous Number × 2) + 1. Specifically: 4×2+1=9; 9×2+1=19; 19×2+1=39; 39×2+1=79; 79×2+1=159.',
      marks: 4,
      negativeMarks: 1
    },
    {
      id: 'q-m5-05',
      examCode: 'IMO',
      subject: 'math',
      class: '5',
      topic: 'math-5-data',
      topicName: 'Data Handling & Graphs',
      difficulty: 'Medium',
      type: 'mcq',
      question: 'In a five-day Olympiad camp, Aarav scored 84, 92, 78, 96, and 90 in mock tests. What is his average score across the 5 days?',
      options: [
        { id: 'A', text: '86' },
        { id: 'B', text: '88' },
        { id: 'C', text: '90' },
        { id: 'D', text: '87.5' }
      ],
      correctAnswer: 'B',
      explanation: 'Average = (84 + 92 + 78 + 96 + 90) ÷ 5 = 440 ÷ 5 = 88.',
      marks: 3,
      negativeMarks: 0.5
    },

    // Science Class 5 / 6 Questions
    {
      id: 'q-s5-01',
      examCode: 'NSO',
      subject: 'science',
      class: '5',
      topic: 'sci-5-plant',
      topicName: 'Plant Reproduction & Seed Dispersal',
      difficulty: 'Easy',
      type: 'mcq',
      question: 'Which of the following seeds is primarily dispersed by the mechanism of explosive bursting (splitting open when dry)?',
      options: [
        { id: 'A', text: 'Dandelion' },
        { id: 'B', text: 'Coconut' },
        { id: 'C', text: 'Balsam / Pea Pod' },
        { id: 'D', text: 'Cocklebur' }
      ],
      correctAnswer: 'C',
      explanation: 'Balsam, pea pods, and castor fruits dry up and burst open suddenly with explosive action to scatter their seeds away from the parent plant.',
      marks: 2,
      negativeMarks: 0
    },
    {
      id: 'q-s5-02',
      examCode: 'NSO',
      subject: 'science',
      class: '5',
      topic: 'sci-5-human',
      topicName: 'Human Body Systems & Health',
      difficulty: 'Medium',
      type: 'mcq',
      question: 'Which component of human blood is primarily responsible for forming clots to stop bleeding during injury?',
      options: [
        { id: 'A', text: 'Red Blood Cells (Erythrocytes)' },
        { id: 'B', text: 'White Blood Cells (Leukocytes)' },
        { id: 'C', text: 'Platelets (Thrombocytes)' },
        { id: 'D', text: 'Blood Plasma' }
      ],
      correctAnswer: 'C',
      explanation: 'Platelets adhere to damaged blood vessel walls and release coagulation factors to create a fibrin mesh that stops bleeding.',
      marks: 3,
      negativeMarks: 0.5
    },
    {
      id: 'q-s5-03',
      examCode: 'NSO',
      subject: 'science',
      class: '5',
      topic: 'sci-5-force',
      topicName: 'Force, Work & Simple Machines',
      difficulty: 'Hard',
      type: 'mcq',
      question: 'A nutcracker and a wheelbarrow are examples of which class of lever?',
      options: [
        { id: 'A', text: 'Class 1 Lever (Fulcrum in middle)' },
        { id: 'B', text: 'Class 2 Lever (Load in middle)' },
        { id: 'C', text: 'Class 3 Lever (Effort in middle)' },
        { id: 'D', text: 'Compound Wedge' }
      ],
      correctAnswer: 'B',
      explanation: 'In Class 2 levers, the Load is situated between the Fulcrum and the Effort. Both nutcrackers and wheelbarrows place the load in the center.',
      marks: 4,
      negativeMarks: 1
    },

    // English Language Questions
    {
      id: 'q-e5-01',
      examCode: 'IEO',
      subject: 'english',
      class: '5',
      topic: 'eng-grammar',
      topicName: 'Grammar & Syntax',
      difficulty: 'Medium',
      type: 'mcq',
      question: 'Choose the sentence with the correct subject-verb agreement:',
      options: [
        { id: 'A', text: 'Neither the teacher nor the students was ready for the test.' },
        { id: 'B', text: 'Neither the teacher nor the students were ready for the test.' },
        { id: 'C', text: 'Each of the participants have received their trophy.' },
        { id: 'D', text: 'The jury have reached its unanimous verdict yesterday.' }
      ],
      correctAnswer: 'B',
      explanation: 'When subjects are connected by "neither... nor", the verb agrees with the closer subject ("the students", plural => "were").',
      marks: 3,
      negativeMarks: 0.5
    },
    {
      id: 'q-e5-02',
      examCode: 'IEO',
      subject: 'english',
      class: '5',
      topic: 'eng-vocab',
      topicName: 'Vocabulary & Idioms',
      difficulty: 'Hard',
      type: 'mcq',
      question: 'What is the most accurate synonym for the word "METICULOUS"?',
      options: [
        { id: 'A', text: 'Careless and hasty' },
        { id: 'B', text: 'Extremely precise and thorough' },
        { id: 'C', text: 'Overly ambitious' },
        { id: 'D', text: 'Reluctant to speak' }
      ],
      correctAnswer: 'B',
      explanation: '"Meticulous" means showing great attention to detail; very careful and precise.',
      marks: 3,
      negativeMarks: 0.5
    },

    // Cyber & Computer Questions
    {
      id: 'q-c5-01',
      examCode: 'NCO',
      subject: 'cyber',
      class: '5',
      topic: 'cyber-logic',
      topicName: 'Computational Logic & Algorithms',
      difficulty: 'Easy',
      type: 'mcq',
      question: 'In flowchart diagrams, which geometric shape represents a "Decision / Condition" check?',
      options: [
        { id: 'A', text: 'Rectangle' },
        { id: 'B', text: 'Oval / Rounded Capsule' },
        { id: 'C', text: 'Diamond (Rhombus)' },
        { id: 'D', text: 'Parallelogram' }
      ],
      correctAnswer: 'C',
      explanation: 'A Diamond shape in flowcharts represents a conditional branch/decision (e.g. Yes/No, True/False).',
      marks: 2,
      negativeMarks: 0
    },
    {
      id: 'q-c5-02',
      examCode: 'NCO',
      subject: 'cyber',
      class: '5',
      topic: 'cyber-security',
      topicName: 'Cybersecurity & Digital Literacy',
      difficulty: 'Medium',
      type: 'mcq',
      question: 'What does the "S" in "HTTPS" stand for in a website web address?',
      options: [
        { id: 'A', text: 'Speed' },
        { id: 'B', text: 'Secure' },
        { id: 'C', text: 'Server' },
        { id: 'D', text: 'Software' }
      ],
      correctAnswer: 'B',
      explanation: 'HTTPS stands for HyperText Transfer Protocol Secure, indicating data transmission is encrypted using TLS/SSL.',
      marks: 2,
      negativeMarks: 0
    },

    // Logical Reasoning Questions
    {
      id: 'q-r5-01',
      examCode: 'LRAO',
      subject: 'reasoning',
      class: '5',
      topic: 'reas-coding',
      topicName: 'Coding-Decoding',
      difficulty: 'Medium',
      type: 'mcq',
      question: 'If in a certain code language, "BRAIN" is coded as "CSBJO", how will "LOGIC" be written in that same code?',
      options: [
        { id: 'A', text: 'MPHKD' },
        { id: 'B', text: 'NPHJD' },
        { id: 'C', text: 'MPHJD' },
        { id: 'D', text: 'MQHKD' }
      ],
      correctAnswer: 'C',
      explanation: 'Each letter is shifted forward by +1 in the alphabet: L(+1)=M, O(+1)=P, G(+1)=H, I(+1)=J, C(+1)=D => "MPHJD".',
      marks: 3,
      negativeMarks: 0.5
    },
    {
      id: 'q-r5-02',
      examCode: 'LRAO',
      subject: 'reasoning',
      class: '5',
      topic: 'reas-blood',
      topicName: 'Blood Relations & Deduction',
      difficulty: 'Hard',
      type: 'mcq',
      question: 'Pointing to a photograph of a boy, Suresh said, "He is the only son of my mother\'s only daughter." How is Suresh related to that boy?',
      options: [
        { id: 'A', text: 'Father' },
        { id: 'B', text: 'Maternal Uncle' },
        { id: 'C', text: 'Brother' },
        { id: 'D', text: 'Grandfather' }
      ],
      correctAnswer: 'B',
      explanation: 'Mother\'s only daughter = Suresh\'s sister. The boy is the sister\'s son => Suresh is his Maternal Uncle.',
      marks: 4,
      negativeMarks: 1
    },

    // Junior Nursery/KG Question
    {
      id: 'q-jkg-01',
      examCode: 'JSTO',
      subject: 'math',
      class: 'kg',
      topic: 'early-math',
      topicName: 'Shapes & Quantities',
      difficulty: 'Easy',
      type: 'mcq',
      question: 'Which shape has exactly 3 straight sides and 3 corners?',
      options: [
        { id: 'A', text: 'Circle ⭕' },
        { id: 'B', text: 'Triangle 🔺' },
        { id: 'C', text: 'Square 🟦' },
        { id: 'D', text: 'Star ⭐' }
      ],
      correctAnswer: 'B',
      explanation: 'A triangle is a closed geometric shape made with exactly 3 straight lines and 3 vertices (corners).',
      marks: 3,
      negativeMarks: 0
    }
  ],

  sample_papers: [
    {
      id: 'sp-imo-5-2025',
      paperName: 'IMO 2025 Official Sample Question Paper',
      olympiadCode: 'IMO',
      subject: 'math',
      class: '5',
      year: 2025,
      difficulty: 'Standard Olympiad',
      durationMinutes: 60,
      totalQuestions: 35,
      totalMarks: 100,
      downloadCount: 14250,
      paperUrl: '#',
      hasSolutionKey: true
    },
    {
      id: 'sp-nso-5-2025',
      paperName: 'NSO 2025 Model Benchmark Examination Paper',
      olympiadCode: 'NSO',
      subject: 'science',
      class: '5',
      year: 2025,
      difficulty: 'Advanced',
      durationMinutes: 60,
      totalQuestions: 35,
      totalMarks: 100,
      downloadCount: 11890,
      paperUrl: '#',
      hasSolutionKey: true
    },
    {
      id: 'sp-ieo-5-2025',
      paperName: 'IEO 2025 Master Sample Paper & Answer Explanations',
      olympiadCode: 'IEO',
      subject: 'english',
      class: '5',
      year: 2025,
      difficulty: 'Standard',
      durationMinutes: 60,
      totalQuestions: 35,
      totalMarks: 100,
      downloadCount: 8940,
      paperUrl: '#',
      hasSolutionKey: true
    },
    {
      id: 'sp-imo-8-2025',
      paperName: 'IMO Class 8 National Mathematics Sample Paper',
      olympiadCode: 'IMO',
      subject: 'math',
      class: '8',
      year: 2025,
      difficulty: 'Advanced',
      durationMinutes: 60,
      totalQuestions: 40,
      totalMarks: 100,
      downloadCount: 16400,
      paperUrl: '#',
      hasSolutionKey: true
    },
    {
      id: 'sp-nco-6-2025',
      paperName: 'NCO Class 6 Cyber & Logic Practice Test Paper',
      olympiadCode: 'NCO',
      subject: 'cyber',
      class: '6',
      year: 2025,
      difficulty: 'Standard',
      durationMinutes: 60,
      totalQuestions: 35,
      totalMarks: 100,
      downloadCount: 7810,
      paperUrl: '#',
      hasSolutionKey: true
    }
  ],

  previous_papers: [
    {
      id: 'py-imo-5-2024',
      paperName: 'IMO 2024 Final Championship Paper (Set A)',
      olympiadCode: 'IMO',
      subject: 'math',
      class: '5',
      year: 2024,
      durationMinutes: 60,
      totalQuestions: 35,
      totalMarks: 100,
      averageScoreRecorded: '74.2%',
      hasVerifiedKey: true
    },
    {
      id: 'py-nso-5-2024',
      paperName: 'NSO 2024 Level-1 National Question Paper',
      olympiadCode: 'NSO',
      subject: 'science',
      class: '5',
      year: 2024,
      durationMinutes: 60,
      totalQuestions: 35,
      totalMarks: 100,
      averageScoreRecorded: '69.8%',
      hasVerifiedKey: true
    },
    {
      id: 'py-imo-5-2023',
      paperName: 'IMO 2023 Annual Olympiad Question Paper',
      olympiadCode: 'IMO',
      subject: 'math',
      class: '5',
      year: 2023,
      durationMinutes: 60,
      totalQuestions: 35,
      totalMarks: 100,
      averageScoreRecorded: '71.5%',
      hasVerifiedKey: true
    }
  ],

  users: [
    {
      id: 'u-student-01',
      role: 'student',
      name: 'Advik Sharma',
      email: 'advik.sharma@example.com',
      studentId: 'OH-2026-9042',
      class: '5',
      school: 'St. Xavier International Academy',
      city: 'Mumbai',
      state: 'Maharashtra',
      country: 'India',
      parentName: 'Vikram Sharma',
      parentEmail: 'vikram.parent@example.com',
      parentPhone: '+91 98200 45120',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
    },
    {
      id: 'u-parent-01',
      role: 'parent',
      name: 'Vikram Sharma',
      email: 'vikram.parent@example.com',
      phone: '+91 98200 45120',
      children: ['OH-2026-9042'],
      city: 'Mumbai',
      state: 'Maharashtra'
    },
    {
      id: 'u-school-01',
      role: 'school',
      name: 'Cambridge International High',
      code: 'SCH-MUM-402',
      coordinatorName: 'Dr. Meenakshi Rao',
      email: 'olympiad@cambridgehigh.edu',
      phone: '+91 22 2847 9000',
      city: 'Mumbai',
      state: 'Maharashtra',
      totalRegisteredStudents: 480,
      nationalRank: 12
    },
    {
      id: 'u-admin-01',
      role: 'admin',
      name: 'Executive Academic Director',
      email: 'admin@olympiadhub.org',
      accessLevel: 'SuperAdmin'
    }
  ],

  registrations: [
    {
      id: 'REG-55421',
      orderId: 'ORD-98231',
      studentId: 'OH-2026-9042',
      studentName: 'Advik Sharma',
      olympiadId: 'imo-2026',
      olympiadName: 'International Mathematics Olympiad',
      class: '5',
      subject: 'math',
      amount: 250,
      paymentMethod: 'UPI / Razorpay Verified',
      paymentStatus: 'Paid',
      registeredAt: '2026-09-12 14:20:00',
      examStatus: 'Scheduled'
    },
    {
      id: 'REG-55422',
      orderId: 'ORD-98232',
      studentId: 'OH-2026-9042',
      studentName: 'Advik Sharma',
      olympiadId: 'nso-2026',
      olympiadName: 'National Science Olympiad',
      class: '5',
      subject: 'science',
      amount: 250,
      paymentMethod: 'Credit Card',
      paymentStatus: 'Paid',
      registeredAt: '2026-09-15 10:15:00',
      examStatus: 'Scheduled'
    }
  ],

  rankings: [
    { rank: 1, name: 'Aarav Patel', school: 'Delhi Public School', city: 'New Delhi', class: '5', score: 98, percentage: 98, percentile: 99.9, nationalRank: 1, stateRank: 1, cityRank: 1 },
    { rank: 2, name: 'Ananya Deshmukh', school: 'National Public School', city: 'Bangalore', class: '5', score: 96, percentage: 96, percentile: 99.6, nationalRank: 2, stateRank: 1, cityRank: 1 },
    { rank: 3, name: 'Advik Sharma', school: 'St. Xavier Academy', city: 'Mumbai', class: '5', score: 94, percentage: 94, percentile: 99.2, nationalRank: 3, stateRank: 1, cityRank: 1 },
    { rank: 4, name: 'Rohan Mehra', school: 'The Cathedral School', city: 'Mumbai', class: '5', score: 92, percentage: 92, percentile: 98.5, nationalRank: 4, stateRank: 2, cityRank: 2 },
    { rank: 5, name: 'Pooja Sundaram', school: 'Chettinad Vidyashram', city: 'Chennai', class: '5', score: 90, percentage: 90, percentile: 97.9, nationalRank: 5, stateRank: 1, cityRank: 1 },
    { rank: 6, name: 'Kabir Singhania', school: 'Modern School Barakhamba', city: 'New Delhi', class: '5', score: 88, percentage: 88, percentile: 96.8, nationalRank: 6, stateRank: 2, cityRank: 2 },
    { rank: 7, name: 'Sanya Gupta', school: 'Heritage Xperiential', city: 'Gurugram', class: '5', score: 86, percentage: 86, percentile: 95.4, nationalRank: 7, stateRank: 1, cityRank: 1 },
    { rank: 8, name: 'Ishan Verma', school: 'La Martiniere Boys', city: 'Kolkata', class: '5', score: 85, percentage: 85, percentile: 94.7, nationalRank: 8, stateRank: 1, cityRank: 1 }
  ],

  certificates: [
    {
      id: 'CERT-IMO-2026-9042',
      certificateNumber: 'OLY-IMO-2026-8812',
      studentName: 'Advik Sharma',
      studentId: 'OH-2026-9042',
      olympiadName: 'International Mathematics Olympiad (IMO)',
      class: 'Class 5',
      score: '94 / 100',
      percentage: '94%',
      rank: 'National Rank 3 (Gold Scholar Medalist)',
      awardTier: 'Gold Award of Excellence',
      year: '2026',
      issueDate: 'October 15, 2026',
      verificationHash: 'SHA256-8e9a224fbc09d1',
      signatory: 'Prof. Alistair Vance, Chairman Olympiad Council'
    }
  ],

  notifications: [
    { id: 'notif-1', title: 'Registration Confirmed', message: 'Your seat for IMO 2026 is confirmed. Student ID: OH-2026-9042.', type: 'success', time: '10 mins ago', isRead: false },
    { id: 'notif-2', title: 'New Mock Test Available', message: 'Class 5 Advanced Mathematics Mock Test #4 is now live.', type: 'info', time: '2 hours ago', isRead: false },
    { id: 'notif-3', title: 'Certificate Issued', message: 'Your Certificate of Achievement for Previous Championship is ready for download.', type: 'achievement', time: '1 day ago', isRead: true }
  ],

  stats: {
    studentsParticipated: 265400,
    olympiadsConducted: 52,
    practiceQuestions: 145000,
    schoolsConnected: 1940
  },

  settings: {
    platformName: 'OlympiadHub',
    academicYear: '2026-2027',
    examWatermarkEnabled: true,
    tabSwitchWarningLimit: 3,
    certificateAutoIssue: true,
    currencySymbol: '$',
    supportEmail: 'support@olympiadhub.org',
    helpline: '+1 (800) 458-OLYMPIAD'
  }
};

class DBEngine {
  constructor() {
    this.storageKey = DB_KEY;
    this.data = this.loadData();
  }

  loadData() {
    try {
      const raw = localStorage.getItem(this.storageKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        // Ensure required arrays exist if upgraded
        return Object.assign({}, INITIAL_DB, parsed);
      }
    } catch (e) {
      console.warn('Could not read from localStorage, using initial mock data.', e);
    }
    this.saveData(INITIAL_DB);
    return JSON.parse(JSON.stringify(INITIAL_DB));
  }

  saveData(data) {
    this.data = data || this.data;
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.data));
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }
  }

  resetToDefault() {
    this.data = JSON.parse(JSON.stringify(INITIAL_DB));
    this.saveData(this.data);
    return this.data;
  }

  // Getters
  getClasses() { return this.data.classes; }
  getSubjects() { return this.data.subjects; }
  getOlympiads() { return this.data.olympiads; }
  getOlympiadById(id) { return this.data.olympiads.find(o => o.id === id || o.code === id); }
  getTopicsByClassAndSubject(cls, subj) {
    return this.data.topics.filter(t => (cls ? t.class === String(cls) : true) && (subj ? t.subject === subj : true));
  }
  
  getQuestions(filter = {}) {
    return this.data.questions.filter(q => {
      if (filter.subject && q.subject !== filter.subject) return false;
      if (filter.class && q.class !== String(filter.class)) return false;
      if (filter.examCode && q.examCode !== filter.examCode) return false;
      if (filter.difficulty && q.difficulty !== filter.difficulty) return false;
      if (filter.search) {
        const s = filter.search.toLowerCase();
        return q.question.toLowerCase().includes(s) || (q.topicName && q.topicName.toLowerCase().includes(s));
      }
      return true;
    });
  }

  addQuestion(questionObj) {
    questionObj.id = 'q-' + Date.now();
    this.data.questions.unshift(questionObj);
    this.saveData();
    return questionObj;
  }

  updateQuestion(id, updatedFields) {
    const idx = this.data.questions.findIndex(q => q.id === id);
    if (idx !== -1) {
      this.data.questions[idx] = Object.assign({}, this.data.questions[idx], updatedFields);
      this.saveData();
      return this.data.questions[idx];
    }
    return null;
  }

  deleteQuestion(id) {
    this.data.questions = this.data.questions.filter(q => q.id !== id);
    this.saveData();
  }

  getSamplePapers(filter = {}) {
    return this.data.sample_papers.filter(p => {
      if (filter.class && p.class !== String(filter.class)) return false;
      if (filter.subject && p.subject !== filter.subject) return false;
      if (filter.year && p.year !== Number(filter.year)) return false;
      return true;
    });
  }

  getPreviousPapers(filter = {}) {
    return this.data.previous_papers.filter(p => {
      if (filter.class && p.class !== String(filter.class)) return false;
      if (filter.subject && p.subject !== filter.subject) return false;
      if (filter.year && p.year !== Number(filter.year)) return false;
      return true;
    });
  }

  getLeaderboard(filter = {}) {
    let list = [...this.data.rankings];
    if (filter.class) {
      list = list.filter(r => r.class === String(filter.class));
    }
    return list;
  }

  addRegistration(reg) {
    this.data.registrations.unshift(reg);
    this.saveData();
    return reg;
  }

  addCertificate(cert) {
    this.data.certificates.unshift(cert);
    this.saveData();
    return cert;
  }

  getCertificates(studentId) {
    if (!studentId) return this.data.certificates;
    return this.data.certificates.filter(c => c.studentId === studentId);
  }

  getStats() { return this.data.stats; }
  getSettings() { return this.data.settings; }
  updateSettings(newSettings) {
    this.data.settings = Object.assign({}, this.data.settings, newSettings);
    this.saveData();
    return this.data.settings;
  }
}

// Global Singleton Instance
window.OlympiadDB = new DBEngine();
