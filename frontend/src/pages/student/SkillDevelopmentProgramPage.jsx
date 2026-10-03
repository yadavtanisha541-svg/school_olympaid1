import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import {
  Brain,
  Calculator,
  Rocket,
  BookOpen,
  Globe,
  Laptop,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  Check,
  Layers,
  Award,
  Zap,
  Star,
  FileText,
  ShoppingCart,
  Info
} from 'lucide-react';

const SKILL_PROGRAMS_DATA = {
  rsdp: {
    code: 'RSDP',
    id: 'prog_rsdp',
    name: 'Reasoning Skill Development Program',
    shortTitle: 'RSDP (Reasoning)',
    quote: 'Children must be taught how to think, not what to think.',
    accentColor: '#7c3aed',
    badgeColor: 'bg-purple-600',
    icon: Brain,
    price: 649,
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
    eligibility: '1st Graders to 10th Graders',
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
    stages: [
      { id: 1, title: 'Visual & Pattern Recognition', status: 'In Progress (75%)', statusColor: 'text-emerald-600 bg-emerald-50', desc: 'Includes 10 interactive modules, 4 diagnostic speed drills, and 1 milestone badge assessment.', xp: '120 XP • 2 Badges' },
      { id: 2, title: 'Deductive & Inductive Logic', status: 'Unlocked', statusColor: 'text-emerald-600 bg-emerald-50', desc: 'Includes 10 interactive modules, 4 diagnostic speed drills, and 1 milestone badge assessment.', xp: '120 XP • 2 Badges' },
      { id: 3, title: 'Coding, Ciphers & Matrices', status: 'Upcoming', statusColor: 'text-slate-500 bg-slate-100', desc: 'Includes 10 interactive modules, 4 diagnostic speed drills, and 1 milestone badge assessment.', xp: '120 XP • 2 Badges' },
      { id: 4, title: 'Analytical & Critical Thinking', status: 'Upcoming', statusColor: 'text-slate-500 bg-slate-100', desc: 'Includes 10 interactive modules, 4 diagnostic speed drills, and 1 milestone badge assessment.', xp: '120 XP • 2 Badges' }
    ]
  },
  msdp: {
    code: 'MSDP',
    id: 'prog_msdp',
    name: 'Maths Skill Development Program',
    shortTitle: 'MSDP (Mathematics)',
    quote: 'Mathematics is not about numbers, equations, computations, or algorithms: it is about understanding.',
    accentColor: '#2563eb',
    badgeColor: 'bg-blue-600',
    icon: Calculator,
    price: 649,
    introParagraphs: [
      "Mathematics is the universal language of logic and scientific discovery. The Maths Skill Development Program (MSDP) is crafted to build rock-solid foundational fluency in numerical reasoning, mental arithmetic, geometry, and higher-order algebra.",
      "Rather than rote memorization of formulas, MSDP trains students to visualize mathematical concepts, recognize deep numerical patterns, and apply fast mental heuristics to tackle tough IMO and school Olympiad problems with total confidence.",
      "Accelerate problem solving speed, eliminate calculation mistakes, and discover the true joy of mathematical mastery."
    ],
    whyReasons: [
      "Targeted for International Mathematics Olympiad (IMO) and school mathematics excellence.",
      "Covers Speed Math shortcuts, Mental Arithmetic, Vedic Math heuristics, and Word Problem deconstruction.",
      "Comprehensive diagnostic assessments after every concept milestone.",
      "Step-by-step video solutions and structured hints for every tricky problem.",
      "Multi-grade progressive curriculum from Class 1 to Class 10.",
      "Downloadable print-friendly worksheets and revision cheat sheets.",
      "Unmatched value at an accessible price point of just Rs. 649."
    ],
    eligibility: '1st Graders to 10th Graders',
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
      { classNum: 10, text: 'Real Numbers, Polynomials, Pair of Linear Equations in Two Variables, Quadratic Equations, Arithmetic Progressions, Triangles, Coordinate Geometry, Introduction to Trigonometry, Some Applications of Trigonometry, Circles, Constructions, Areas Related to Circles, Surface Areas and Volumes, Statistics, Probability.' }
    ],
    stages: [
      { id: 1, title: 'Foundational Number Logic & Sense', status: 'In Progress (80%)', statusColor: 'text-emerald-600 bg-emerald-50', desc: 'Includes 10 interactive modules, 4 diagnostic speed drills, and 1 milestone badge assessment.', xp: '120 XP • 2 Badges' },
      { id: 2, title: 'Speed Arithmetic & Mental Math', status: 'Unlocked', statusColor: 'text-emerald-600 bg-emerald-50', desc: 'Includes 10 interactive modules, 4 diagnostic speed drills, and 1 milestone badge assessment.', xp: '120 XP • 2 Badges' },
      { id: 3, title: 'Spatial Geometry & Spatial Logic', status: 'Upcoming', statusColor: 'text-slate-500 bg-slate-100', desc: 'Includes 10 interactive modules, 4 diagnostic speed drills, and 1 milestone badge assessment.', xp: '120 XP • 2 Badges' },
      { id: 4, title: 'Advanced Algebraic Problem Solving', status: 'Upcoming', statusColor: 'text-slate-500 bg-slate-100', desc: 'Includes 10 interactive modules, 4 diagnostic speed drills, and 1 milestone badge assessment.', xp: '120 XP • 2 Badges' }
    ]
  },
  ssdp: {
    code: 'SSDP',
    id: 'prog_ssdp',
    name: 'Science Skill Development Program',
    shortTitle: 'SSDP (Science)',
    quote: 'Somewhere, something incredible is waiting to be known.',
    accentColor: '#059669',
    badgeColor: 'bg-emerald-600',
    icon: Rocket,
    price: 649,
    introParagraphs: [
      "Science is not just a collection of facts, but a method of inquiry and curiosity about how our universe works. The Science Skill Development Program (SSDP) inspires young minds to observe, hypothesize, experiment, and conclude logically.",
      "Designed specifically for National Science Olympiad (NSO/ISO) aspirants, SSDP bridges textbook science with real-world application, scientific inquiry, and environmental awareness.",
      "Explore the wonders of biology, chemistry, physics, and ecology with interactive diagnostic kits and concept notes."
    ],
    whyReasons: [
      "Rigorous alignment with National Science Olympiad (NSO/ISO) syllabus.",
      "Hands-on scientific inquiry with conceptual diagrams and animated experiment explanations.",
      "Diagnostic test after every 6th topic with personalized weak area feedback.",
      "Achievers HOTS scientific reasoning questions.",
      "Multi-grade curriculum covering Grade 1 through Grade 10.",
      "Interactive quizzes and pen-and-paper worksheet sets."
    ],
    eligibility: '1st Graders to 10th Graders',
    skillsCovered: [
      { classNum: 1, text: 'Living & Non-Living Things, Plants & Animals Around Us, Human Body & Senses, Good Habits & Safety, Weather & Seasons' },
      { classNum: 2, text: 'Plant Kingdom & Uses, Animal Life & Habitats, Air, Water & Weather, Rocks & Minerals, Our Environment' },
      { classNum: 3, text: 'Food & Nutrition, Birds & Beaks/Claws, Matter & Materials, Force, Work & Energy, Earth & Universe' },
      { classNum: 4, text: 'Human Organ Systems, Plant Adaptations, Animal Adaptations, Light, Sound & Force, Natural Resources' },
      { classNum: 5, text: 'Human Skeletal & Nervous System, Force, Machines & Energy, Environment & Pollution, States of Matter, Space Exploration' },
      { classNum: 6, text: 'Food & Components, Sorting Materials, Separation of Substances, Living Organisms & Surroundings, Motion & Measurement, Electricity & Circuits' },
      { classNum: 7, text: 'Nutrition in Plants & Animals, Heat & Temperature, Acids, Bases & Salts, Physical & Chemical Changes, Motion & Time, Electric Current & Effects' },
      { classNum: 8, text: 'Crop Production, Microorganisms, Synthetic Fibres & Plastics, Coal & Petroleum, Combustion & Flame, Conservation of Plants & Animals, Force & Pressure, Light' },
      { classNum: 9, text: 'Matter in Our Surroundings, Is Matter Around Us Pure, Atoms and Molecules, Structure of the Atom, Cell - The Fundamental Unit of Life, Tissues, Motion, Force and Laws of Motion, Gravitation, Work and Energy, Sound, Improvement in Food Resources.' },
      { classNum: 10, text: 'Chemical Reactions and Equations, Acids, Bases and Salts, Metals and Non-metals, Carbon and its Compounds, Life Processes, Control and Coordination, How do Organisms Reproduce?, Heredity and Evolution, Light - Reflection and Refraction, Human Eye and Colourful World, Electricity, Magnetic Effects of Electric Current, Our Environment.' }
    ],
    stages: [
      { id: 1, title: 'Observational Science & Nature', status: 'In Progress (70%)', statusColor: 'text-emerald-600 bg-emerald-50', desc: 'Includes 10 interactive modules, 4 diagnostic speed drills, and 1 milestone badge assessment.', xp: '120 XP • 2 Badges' },
      { id: 2, title: 'Experimental Methodology & Logic', status: 'Unlocked', statusColor: 'text-emerald-600 bg-emerald-50', desc: 'Includes 10 interactive modules, 4 diagnostic speed drills, and 1 milestone badge assessment.', xp: '120 XP • 2 Badges' },
      { id: 3, title: 'Physical Systems, Forces & Matter', status: 'Upcoming', statusColor: 'text-slate-500 bg-slate-100', desc: 'Includes 10 interactive modules, 4 diagnostic speed drills, and 1 milestone badge assessment.', xp: '120 XP • 2 Badges' },
      { id: 4, title: 'Environmental Ecology & Life Sciences', status: 'Upcoming', statusColor: 'text-slate-500 bg-slate-100', desc: 'Includes 10 interactive modules, 4 diagnostic speed drills, and 1 milestone badge assessment.', xp: '120 XP • 2 Badges' }
    ]
  },
  esdp: {
    code: 'ESDP',
    id: 'prog_esdp',
    name: 'English Skill Development Program',
    shortTitle: 'ESDP (English)',
    quote: 'Words have the power to both destroy and heal. When words are true and kind, they can change the world.',
    accentColor: '#d9775b',
    badgeColor: 'bg-orange-600',
    icon: BookOpen,
    price: 649,
    introParagraphs: [
      "Language mastery is the cornerstone of effective communication, critical reading, and creative expression. The English Skill Development Program (ESDP) builds deep grammatical accuracy, lexical richness, and comprehension confidence.",
      "Structured for the International English Olympiad (IEO), ESDP helps students master nuanced vocabulary, idioms, syntax, tenses, and spoken-written expression with clarity and poise.",
      "Transform your reading speed, sharpen analytical comprehension, and develop impeccable communication skills."
    ],
    whyReasons: [
      "Designed specifically for International English Olympiad (IEO) and academic English mastery.",
      "Comprehensive focus on Grammar, Vocabulary, Reading Comprehension, and Spoken-Written Expression.",
      "Daily vocabulary booster drills, idioms, and contextual usage flashcards.",
      "Interactive Achievers verbal reasoning sets.",
      "Structured for Grade 1 through Grade 10."
    ],
    eligibility: '1st Graders to 10th Graders',
    skillsCovered: [
      { classNum: 1, text: 'Nouns, Pronouns, Verbs, Articles, Prepositions, Word Meanings, Rhyming Words, Picture Comprehension' },
      { classNum: 2, text: 'Plural Forms, Adjectives, Adverbs, Conjunctions, Synonyms & Antonyms, Sentence Formation, Short Story Comprehension' },
      { classNum: 3, text: 'Tenses (Present, Past, Future), Punctuation, Compound Words, Idiomatic Phrases, Reading Passage Analysis' },
      { classNum: 4, text: 'Subject-Verb Agreement, Direct-Indirect Speech Basics, Homophones, Cloze Tests, Analytical Comprehension' },
      { classNum: 5, text: 'Modals, Active & Passive Voice Basics, Phrasal Verbs, Prefix & Suffix, Formal & Informal Expressions' },
      { classNum: 6, text: 'Clause Analysis, Advanced Tenses, Question Tags, Sentence Transformation, Idioms & Proverbs' },
      { classNum: 7, text: 'Reported Speech, Conditional Sentences, Integrated Grammar, Critical Comprehension & Vocabulary Inferences' },
      { classNum: 8, text: 'Determiners, Conjunctions & Connectors, Advanced Synthesis of Sentences, Literary Vocabulary & Expressions' },
      { classNum: 9, text: 'Tenses, Modals, Subject - verb concord, Reported speech, Determiners, Clauses, Formal letter writing, Analytical paragraph, Reading comprehension, Advanced vocabulary and collocations.' },
      { classNum: 10, text: 'Tenses, Modals, Subject - verb concord, Reported speech (Commands and requests, Statements, Questions), Determiners, Creative writing skills, Literature comprehension, Achievers verbal reasoning.' }
    ],
    stages: [
      { id: 1, title: 'Phonics, Orthography & Parts of Speech', status: 'In Progress (85%)', statusColor: 'text-emerald-600 bg-emerald-50', desc: 'Includes 10 interactive modules, 4 diagnostic speed drills, and 1 milestone badge assessment.', xp: '120 XP • 2 Badges' },
      { id: 2, title: 'Syntax, Tenses & Grammatical Fluency', status: 'Unlocked', statusColor: 'text-emerald-600 bg-emerald-50', desc: 'Includes 10 interactive modules, 4 diagnostic speed drills, and 1 milestone badge assessment.', xp: '120 XP • 2 Badges' },
      { id: 3, title: 'Lexical Depth, Idioms & Vocabulary', status: 'Upcoming', statusColor: 'text-slate-500 bg-slate-100', desc: 'Includes 10 interactive modules, 4 diagnostic speed drills, and 1 milestone badge assessment.', xp: '120 XP • 2 Badges' },
      { id: 4, title: 'Critical Reading, Inferences & Comprehension', status: 'Upcoming', statusColor: 'text-slate-500 bg-slate-100', desc: 'Includes 10 interactive modules, 4 diagnostic speed drills, and 1 milestone badge assessment.', xp: '120 XP • 2 Badges' }
    ]
  },
  gksdp: {
    code: 'GKSDP',
    id: 'prog_gksdp',
    name: 'General Knowledge Skill Development Program',
    shortTitle: 'GK-SDP (General Knowledge)',
    quote: 'An investment in knowledge pays the best interest.',
    accentColor: '#e7b84b',
    badgeColor: 'bg-amber-500',
    icon: Globe,
    price: 649,
    introParagraphs: [
      "A broad worldview and deep general knowledge distinguish future leaders from the crowd. The General Knowledge Skill Development Program (GK-SDP) expands awareness across geography, world history, scientific breakthroughs, governance, arts, and global current affairs.",
      "Tailored for the International General Knowledge Olympiad (IGKO), this program cultivates curiosity about India and the world, life skills, digital citizenship, and global culture.",
      "Develop rapid memory recall, stay updated with national and global happenings, and master general awareness."
    ],
    whyReasons: [
      "Complete coverage of International General Knowledge Olympiad (IGKO) syllabus.",
      "Monthly updated current affairs capsule, national awards, and global summits.",
      "Interactive flash quizzes on world geography, historical monuments, and scientific discoveries.",
      "Life skills, moral values, and financial literacy basics.",
      "Multi-grade structured learning for Class 1 to Class 10."
    ],
    eligibility: '1st Graders to 10th Graders',
    skillsCovered: [
      { classNum: 1, text: 'Our Body & Senses, Animals & Habitats, Famous Personalities, Festivals of India, Road Safety & Etiquette' },
      { classNum: 2, text: 'Flora & Fauna, Incredible India, World Monuments, Inventions & Inventors, Good Manners & Values' },
      { classNum: 3, text: 'Indian States & Capitals, Solar System, Sports & Trophies, Science in Daily Life, Life Skills & First Aid' },
      { classNum: 4, text: 'Continents & Oceans, World Wonders, Environmental Conservation, Indian Constitution Basics, Current Affairs' },
      { classNum: 5, text: 'World Heritage Sites, Space Exploration & NASA/ISRO, Currency & Flags of Nations, National Awards, Leadership' },
      { classNum: 6, text: 'Indian Freedom Movement, United Nations & Global Bodies, Global Geography, Renewable Energy, Digital Literacy' },
      { classNum: 7, text: 'World History Milestones, Global Economy & Trade, Scientific Breakthroughs, Indian Judiciary & Parliament, Eco-Sustainability' },
      { classNum: 8, text: 'Geopolitics, Nobel Laureates, Cybersecurity & AI Awareness, Literature & Cinema, Critical Current Affairs' },
      { classNum: 9, text: 'Plants and Animals, India and the World, Science and Technology, Earth and Its Environment, Universe, Language and Literature, Entertainment, Sports, World Events, Current Affairs, Life Skills, Quantitative Aptitude and Reasoning.' },
      { classNum: 10, text: 'Our Environment, India and the World, Science and Technology, Language and Literature, Entertainment, Sports, World Personalities, Awards and Honors, International Organizations, Current Affairs, Life Skills, Quantitative Aptitude and Logical Reasoning.' }
    ],
    stages: [
      { id: 1, title: 'Global Geography, Heritage & India', status: 'In Progress (90%)', statusColor: 'text-emerald-600 bg-emerald-50', desc: 'Includes 10 interactive modules, 4 diagnostic speed drills, and 1 milestone badge assessment.', xp: '120 XP • 2 Badges' },
      { id: 2, title: 'Scientific Inventions & Breakthroughs', status: 'Unlocked', statusColor: 'text-emerald-600 bg-emerald-50', desc: 'Includes 10 interactive modules, 4 diagnostic speed drills, and 1 milestone badge assessment.', xp: '120 XP • 2 Badges' },
      { id: 3, title: 'Current Affairs & Global Leaders', status: 'Upcoming', statusColor: 'text-slate-500 bg-slate-100', desc: 'Includes 10 interactive modules, 4 diagnostic speed drills, and 1 milestone badge assessment.', xp: '120 XP • 2 Badges' },
      { id: 4, title: 'Sports, National Awards & Life Skills', status: 'Upcoming', statusColor: 'text-slate-500 bg-slate-100', desc: 'Includes 10 interactive modules, 4 diagnostic speed drills, and 1 milestone badge assessment.', xp: '120 XP • 2 Badges' }
    ]
  },
  csdp: {
    code: 'CSDP',
    id: 'prog_csdp',
    name: 'Cyber & AI Skill Development Program',
    shortTitle: 'CSDP (Cyber & AI)',
    quote: 'The future belongs to those who understand algorithms, data, and human curiosity.',
    accentColor: '#0284c7',
    badgeColor: 'bg-sky-600',
    icon: Laptop,
    price: 649,
    introParagraphs: [
      "In a technology-driven world, digital literacy, algorithmic problem solving, and Artificial Intelligence understanding are essential 21st-century superpowers. The Cyber & AI Skill Development Program (CSDP) equips young students with hands-on computational thinking.",
      "Designed for the International Cyber Olympiad (ICSO), CSDP covers hardware architecture, operating system mechanics, flowchart logic, cyber security hygiene, and beginner-to-advanced AI concepts.",
      "Prepare your child for the future of tech, software engineering, and smart algorithms with structured interactive lessons."
    ],
    whyReasons: [
      "Aligned with International Cyber Olympiad (ICSO) and modern computer science standards.",
      "Covers Algorithms, Flowcharts, Scratch / Python foundations, and Cyber Safety rules.",
      "Artificial Intelligence & Machine Learning basics explained through everyday real-life examples.",
      "Diagnostic practice tests and interactive coding puzzle sets.",
      "Multi-grade curriculum for Class 1 to Class 10."
    ],
    eligibility: '1st Graders to 10th Graders',
    skillsCovered: [
      { classNum: 1, text: 'Introduction to Computers, Parts of Computer, Mouse & Keyboard Basics, Uses of Computers, Do’s & Don’ts' },
      { classNum: 2, text: 'Input & Output Devices, Starting & Shutting Down Computer, MS Paint Basics, Storage Devices' },
      { classNum: 3, text: 'Operating System Basics (Windows), Keyboard Shortcuts, Introduction to MS Word, Tux Paint, Internet Safety' },
      { classNum: 4, text: 'Computer Memory (RAM/ROM), MS Word Formatting, Introduction to Multimedia, Evolution of Computers' },
      { classNum: 5, text: 'MS PowerPoint Presentations, Algorithms & Flowcharts, Internet & Web Browsers, Computer Viruses & Antivirus' },
      { classNum: 6, text: 'Hardware & Peripherals, File Management, MS Excel Basics, Introduction to Coding Logic, Cyber Ethics' },
      { classNum: 7, text: 'HTML & Web Page Basics, Number Systems (Binary/Decimal), MS Excel Formulas, Networking & Cloud Tools' },
      { classNum: 8, text: 'Database Management Basics, Python Programming Foundations, Cyber Security & Cryptography Basics' },
      { classNum: 9, text: 'Computer System Overview, Data Representation, Algorithms and Flowcharts, Python Programming, Cyber Security, Ethics in Information Technology, Artificial Intelligence Basics.' },
      { classNum: 10, text: 'Computer Networks, Internet Technologies, HTML/CSS Web Development, Python Programming and Data Structures, Cyber Law and Intellectual Property, AI & Robotics Fundamentals, HOTS Computational Thinking.' }
    ],
    stages: [
      { id: 1, title: 'Computational Logic & Computer Architecture', status: 'In Progress (80%)', statusColor: 'text-emerald-600 bg-emerald-50', desc: 'Includes 10 interactive modules, 4 diagnostic speed drills, and 1 milestone badge assessment.', xp: '120 XP • 2 Badges' },
      { id: 2, title: 'Algorithms, Flowcharts & Pseudo-code', status: 'Unlocked', statusColor: 'text-emerald-600 bg-emerald-50', desc: 'Includes 10 interactive modules, 4 diagnostic speed drills, and 1 milestone badge assessment.', xp: '120 XP • 2 Badges' },
      { id: 3, title: 'Networking, Cloud Tools & Cyber Hygiene', status: 'Upcoming', statusColor: 'text-slate-500 bg-slate-100', desc: 'Includes 10 interactive modules, 4 diagnostic speed drills, and 1 milestone badge assessment.', xp: '120 XP • 2 Badges' },
      { id: 4, title: 'Artificial Intelligence & Robotics Basics', status: 'Upcoming', statusColor: 'text-slate-500 bg-slate-100', desc: 'Includes 10 interactive modules, 4 diagnostic speed drills, and 1 milestone badge assessment.', xp: '120 XP • 2 Badges' }
    ]
  }
};

const ALL_CLASSES = [
  'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5',
  'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10'
];

export const SkillDevelopmentProgramPage = ({
  initialProgram = 'rsdp',
  onNavigateTab
}) => {
  const { user } = useAuth();
  const { addToCart, openCart } = useCart();

  // Load custom skill programs from Super Admin
  const allPrograms = (() => {
    try {
      const saved = localStorage.getItem('olympiadhub_custom_skill_programs_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        const iconMap = {
          reasoning: Brain,
          math: Calculator,
          science: Rocket,
          english: BookOpen,
          gk: Globe,
          cyber: Laptop
        };
        const mapped = {};
        Object.keys(parsed).forEach(k => {
          const item = parsed[k];
          mapped[k] = {
            ...item,
            icon: iconMap[item.subjectKey] || Brain
          };
        });
        return { ...SKILL_PROGRAMS_DATA, ...mapped };
      }
    } catch (e) {}
    return SKILL_PROGRAMS_DATA;
  })();

  // Parse active program key (handles 'prog_rsdp' or 'rsdp')
  const cleanKey = initialProgram.replace('prog_', '').toLowerCase();
  const [activeProgKey, setActiveProgKey] = useState(
    allPrograms[cleanKey] ? cleanKey : 'rsdp'
  );

  const [activeTab, setActiveTab] = useState('about'); // 'about' | 'lessons' | 'pricing'
  const [selectedClass, setSelectedClass] = useState(user?.class || 'Class 6');
  const [addedNotice, setAddedNotice] = useState(false);

  const prog = allPrograms[activeProgKey] || allPrograms.rsdp || SKILL_PROGRAMS_DATA.rsdp;
  const Icon = prog.icon || Brain;

  const handleEnrollNow = () => {
    addToCart({
      id: `skill_${prog.code.toLowerCase()}_${selectedClass.toLowerCase().replace(/\s+/g, '_')}`,
      name: `${prog.name} - ${selectedClass}`,
      title: `${prog.name} (${selectedClass})`,
      subject: prog.shortTitle,
      type: 'Skill Development Program',
      category: 'Skill Development',
      price: prog.price,
      originalPrice: 999,
      grade: selectedClass,
      quantity: 1
    });

    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 3000);
    openCart();
  };

  return (
    <div className="space-y-6 font-sans pb-16 animate-in fade-in duration-200">
      {/* Toast Notification when added to Cart */}
      {addedNotice && (
        <div className="fixed bottom-6 right-6 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 z-50 animate-in slide-in-from-bottom-5">
          <div className="w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center text-slate-950 font-black text-xs">
            ✓
          </div>
          <div>
            <p className="text-xs font-black">{prog.name} Added!</p>
            <p className="text-[10px] text-slate-400">{selectedClass} • ₹{prog.price}</p>
          </div>
          <button
            type="button"
            onClick={openCart}
            className="px-3 py-1 bg-[#f5b82e] hover:bg-[#e2a823] text-slate-950 font-black rounded-xl text-xs transition-all cursor-pointer shadow-xs active:scale-95 ml-2"
          >
            View Cart 🛒
          </button>
        </div>
      )}

      {/* Top Breadcrumb Header Bar */}
      <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex items-center justify-between flex-wrap gap-2 text-xs font-bold text-slate-400">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => onNavigateTab && onNavigateTab('overview')}
              className="hover:text-[#2563eb] uppercase text-[11px] font-black cursor-pointer"
            >
              HOME
            </button>
            <span>&gt;</span>
            <span className="text-[#2563eb] uppercase text-[11px] font-black">
              SKILL DEVELOPMENT PROGRAMS
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-500 font-bold hidden sm:inline">Active Grade:</span>
            <span className="px-2.5 py-0.5 rounded-lg bg-blue-50 text-blue-800 border border-blue-200 text-xs font-black">
              {selectedClass}
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. MAIN 2-COLUMN LAYOUT (Matches media_1790937837626.png)                  */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: Sidebar with Navigation & Purple Get Started Box (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Top Yellow Tabs (About / Lessons / Pricing) */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
            <button
              type="button"
              onClick={() => setActiveTab('about')}
              className={`w-full text-left px-5 py-3 text-xs font-black transition-colors cursor-pointer flex items-center justify-between border-b border-slate-100 ${
                activeTab === 'about'
                  ? 'bg-[#f5b82e] text-slate-950'
                  : 'bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span>About this Course</span>
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('lessons')}
              className={`w-full text-left px-5 py-3 text-xs font-black transition-colors cursor-pointer flex items-center justify-between border-b border-slate-100 ${
                activeTab === 'lessons'
                  ? 'bg-[#f5b82e] text-slate-950'
                  : 'bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span>Lessons &amp; Stages</span>
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('pricing')}
              className={`w-full text-left px-5 py-3 text-xs font-black transition-colors cursor-pointer flex items-center justify-between ${
                activeTab === 'pricing'
                  ? 'bg-[#f5b82e] text-slate-950'
                  : 'bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span>Pricing &amp; Validity</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Purple "Get Started!" Action Box (Exact match from screenshot) */}
          <div className="bg-[#6b21a8] text-white rounded-3xl p-6 sm:p-7 shadow-lg space-y-4 relative overflow-hidden">
            {/* Subtle light background glow */}
            <div className="absolute -top-8 -right-8 w-28 h-28 bg-white/10 rounded-full blur-xl pointer-events-none" />

            <div className="space-y-1 relative z-10 text-center">
              <h3 className="text-xl font-black text-white tracking-tight">
                Get Started!
              </h3>
              <p className="text-xs text-purple-200 font-medium">
                Select your class to start your program.
              </p>
            </div>

            {/* Class Dropdown */}
            <div className="space-y-1 relative z-10">
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-white text-slate-900 text-xs font-black focus:outline-none focus:ring-2 focus:ring-[#f5b82e] cursor-pointer shadow-xs"
              >
                {ALL_CLASSES.map((cls) => (
                  <option key={cls} value={cls}>
                    {cls}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Row */}
            <div className="text-center pt-2 relative z-10">
              <span className="text-base sm:text-lg font-black text-white">
                Price: Rs. {prog.price}/-
              </span>
              <p className="text-[10px] text-purple-200 mt-0.5">
                Inclusive of all 24 interactive tests &amp; challenger rounds
              </p>
            </div>

            {/* Start Now / Buy Button */}
            <div className="pt-2 relative z-10 space-y-2">
              <button
                type="button"
                onClick={handleEnrollNow}
                className="w-full py-2.5 bg-[#84cc16] hover:bg-[#65a30d] text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Zap className="w-4 h-4 fill-slate-950" />
                <span>Start Now</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('lessons')}
                className="w-full py-2 bg-white/20 hover:bg-white/30 text-white font-bold rounded-xl text-xs transition-all cursor-pointer text-center"
              >
                View Lessons Breakdown →
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Rich Subject Information or Stage Breakdown (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* VIEW A: ABOUT THIS COURSE & SYLLABUS (Default View) */}
          {activeTab === 'about' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xs space-y-6">
              {/* Header Title */}
              <div className="space-y-1 pb-4 border-b border-slate-100">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  {prog.name} -
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 italic font-medium">
                  {prog.quote}
                </p>
              </div>

              {/* Introductory Paragraphs */}
              <div className="space-y-3 text-xs sm:text-[13px] text-slate-700 leading-relaxed">
                {prog.introParagraphs.map((para, pIdx) => (
                  <p key={pIdx}>{para}</p>
                ))}
              </div>

              {/* Why "[Subject] Skill Development Program"? */}
              <div className="space-y-3 pt-2">
                <h3 className="text-sm sm:text-base font-black text-slate-900">
                  Why &ldquo;{prog.name}&rdquo;?
                </h3>
                <ul className="space-y-2 text-xs sm:text-[13px] text-slate-700">
                  {prog.whyReasons.map((reason, rIdx) => (
                    <li key={rIdx} className="flex items-start gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-600 mt-1.5 shrink-0" />
                      <span>{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Eligibility */}
              <div className="space-y-1.5 pt-2">
                <h3 className="text-sm sm:text-base font-black text-slate-900">
                  Eligibility
                </h3>
                <p className="text-xs sm:text-[13px] text-slate-700">
                  {prog.eligibility}
                </p>
              </div>

              {/* Skills Covered (Class 1 to Class 10 Syllabus) */}
              <div className="space-y-3 pt-2">
                <h3 className="text-sm sm:text-base font-black text-slate-900">
                  Skills Covered
                </h3>
                <div className="space-y-2.5 text-xs text-slate-700">
                  {prog.skillsCovered.map((sk) => (
                    <div
                      key={sk.classNum}
                      className={`p-3 rounded-xl border transition-colors ${
                        selectedClass === `Class ${sk.classNum}`
                          ? 'bg-purple-50/70 border-purple-300 font-medium'
                          : 'bg-slate-50/50 border-slate-100'
                      }`}
                    >
                      <span className="font-black text-slate-900">
                        Class {sk.classNum} :{' '}
                      </span>
                      <span>{sk.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Lessons Structure */}
              <div className="space-y-1.5 pt-2">
                <h3 className="text-sm sm:text-base font-black text-slate-900">
                  Lessons
                </h3>
                <ul className="space-y-1 text-xs text-slate-700">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-600" />
                    <span>24 Interactive Tests / Downloadable Worksheets</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-600" />
                    <span>4 Assessment Tests of 30-minute duration</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-600" />
                    <span>2 Challenger Rounds</span>
                  </li>
                </ul>
              </div>

              {/* Price */}
              <div className="space-y-1.5 pt-2">
                <h3 className="text-sm sm:text-base font-black text-slate-900">
                  Price
                </h3>
                <p className="text-xs text-slate-700 font-bold">
                  Rs. {prog.price} + GST.
                </p>
              </div>

              {/* Valid Upto */}
              <div className="space-y-1.5 pt-2">
                <h3 className="text-sm sm:text-base font-black text-slate-900">
                  Valid Upto
                </h3>
                <p className="text-xs text-slate-700 font-semibold">
                  28th February 2027
                </p>
              </div>

              {/* Terms & Conditions */}
              <div className="space-y-1.5 pt-2 border-t border-slate-100">
                <h3 className="text-sm sm:text-base font-black text-slate-900">
                  Terms &amp; Conditions
                </h3>
                <p className="text-xs text-slate-500">
                  By registering for the {prog.code} Program you agree to the Terms &amp; Conditions listed on the portal.
                </p>
              </div>
            </div>
          )}

          {/* VIEW B: LESSONS & 4-STAGE INTERACTIVE PATHWAY (Matches media_1790937905045.png) */}
          {activeTab === 'lessons' && (
            <div className="space-y-6">
              {/* Top Banner (Structured Skill Development Curriculum) */}
              <div className="bg-[#4a1d47] text-white rounded-3xl p-6 sm:p-7 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-[10px] font-black uppercase tracking-wider">
                    <Info className="w-3.5 h-3.5 text-[#f5b82e]" />
                    <span>STRUCTURED SKILL DEVELOPMENT CURRICULUM</span>
                  </div>
                  <h2 className="text-lg sm:text-2xl font-black">
                    {prog.name} ({prog.code})
                  </h2>
                  <p className="text-xs text-pink-100 font-medium">
                    4-Stage Structured Pathway for {selectedClass} Mastery in {prog.shortTitle}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleEnrollNow}
                  className="px-5 py-2.5 rounded-xl text-xs font-black bg-[#f5b82e] text-slate-950 hover:bg-[#e2a823] transition-all shadow-md cursor-pointer shrink-0"
                >
                  Resume Program →
                </button>
              </div>

              {/* 4 Interactive Stage Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {prog.stages.map((stg) => (
                  <div
                    key={stg.id}
                    className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="px-3 py-1 rounded-full text-xs font-black bg-slate-100 text-slate-700">
                          Stage {stg.id}
                        </span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${stg.statusColor}`}>
                          {stg.status}
                        </span>
                      </div>

                      <h3 className="text-sm sm:text-base font-black text-slate-900">
                        {stg.title}
                      </h3>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        {stg.desc}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-400">
                        {stg.xp}
                      </span>
                      <button
                        type="button"
                        onClick={() => alert(`Starting Stage ${stg.id}: ${stg.title} for ${selectedClass}`)}
                        className="px-4 py-1.5 bg-[#4a1d47] hover:bg-[#381436] text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs active:scale-95"
                      >
                        Start Stage →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* VIEW C: PRICING & VALIDITY */}
          {activeTab === 'pricing' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xs space-y-5">
              <h2 className="text-lg font-black text-slate-900">
                Pricing &amp; Enrollment Terms for {prog.name}
              </h2>

              <div className="p-5 rounded-2xl bg-purple-50/60 border border-purple-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-black text-purple-900">
                    Full Program Pass ({selectedClass})
                  </h3>
                  <p className="text-xs text-purple-700 mt-0.5">
                    Includes 24 interactive tests, 4 assessment tests, and 2 challenger rounds.
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-2xl font-black text-purple-950">₹{prog.price}</div>
                  <span className="text-[10px] text-slate-500">+ GST (Valid till 28 Feb 2027)</span>
                </div>
              </div>

              <div className="space-y-2 text-xs text-slate-600">
                <p className="font-bold text-slate-900">What is included with your purchase:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>24 Digital Worksheets with Instant Evaluation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>4 Timed Assessment Drills</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>2 Master Challenger Review Rounds</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Official Scholar Certificate upon Completion</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleEnrollNow}
                  className="px-6 py-3 bg-[#f5b82e] hover:bg-[#e2a823] text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 cursor-pointer flex items-center gap-2"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Enroll in {prog.code} Now (₹{prog.price})</span>
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
