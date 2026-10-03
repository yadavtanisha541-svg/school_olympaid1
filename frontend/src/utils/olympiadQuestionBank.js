// High-Quality Olympiad Question Bank & Intelligent Generator
// Generates accurate, syllabus-aligned MCQs for Class 1 to 12 across all 6 Olympiad Subjects

const QUESTION_POOL = {
  math: {
    junior: [ // Class 1 - 4
      {
        q: "What is the largest 3-digit even number?",
        options: ["999", "998", "990", "988"],
        correct: 1,
        explanation: "999 is the largest 3-digit number, but it is odd. The largest 3-digit even number is 998.",
        chapter: "Number Sense and Numeration"
      },
      {
        q: "Rohan has 45 marbles. He gave 18 to his sister and bought 12 more. How many marbles does he have now?",
        options: ["39", "27", "41", "35"],
        correct: 0,
        explanation: "45 - 18 = 27; 27 + 12 = 39 marbles.",
        chapter: "Computation Operations (Add, Sub, Mul, Div)"
      },
      {
        q: "How many vertices does a cube have?",
        options: ["6", "8", "12", "4"],
        correct: 1,
        explanation: "A cube has 6 faces, 12 edges, and 8 vertices (corners).",
        chapter: "Geometry and Spatial Understanding"
      },
      {
        q: "Which fraction is equivalent to 1/2?",
        options: ["2/6", "3/8", "4/8", "5/12"],
        correct: 2,
        explanation: "4/8 simplifies to 1/2 by dividing numerator and denominator by 4.",
        chapter: "Fractions and Decimals"
      },
      {
        q: "The perimeter of a square garden is 48 meters. What is the length of each side?",
        options: ["12 meters", "14 meters", "16 meters", "24 meters"],
        correct: 0,
        explanation: "Perimeter of square = 4 × side. Side = 48 / 4 = 12 meters.",
        chapter: "Perimeter, Area and Volume"
      },
      {
        q: "If 1 box contains 24 crayons, how many crayons are there in 6 such boxes?",
        options: ["120", "144", "136", "148"],
        correct: 1,
        explanation: "24 × 6 = 144 crayons.",
        chapter: "Computation Operations (Add, Sub, Mul, Div)"
      },
      {
        q: "What time is 45 minutes after 3:30 PM?",
        options: ["4:00 PM", "4:15 PM", "4:30 PM", "4:45 PM"],
        correct: 1,
        explanation: "3:30 PM + 30 mins = 4:00 PM; + 15 mins = 4:15 PM.",
        chapter: "Everyday Mathematics Word Problems"
      },
      {
        q: "How many centimeters are there in 3.5 meters?",
        options: ["35 cm", "350 cm", "3500 cm", "0.35 cm"],
        correct: 1,
        explanation: "1 meter = 100 cm. 3.5 × 100 = 350 cm.",
        chapter: "Everyday Mathematics Word Problems"
      }
    ],
    middle: [ // Class 5 - 8
      {
        q: "If 3x + 7 = 28, find the value of 2x - 5.",
        options: ["7", "9", "11", "14"],
        correct: 1,
        explanation: "3x = 28 - 7 = 21 => x = 7. Then 2(7) - 5 = 14 - 5 = 9.",
        chapter: "Algebraic Expressions and Equations"
      },
      {
        q: "The ratio of boys to girls in a class of 45 students is 3:2. How many girls are there in the class?",
        options: ["18", "27", "15", "20"],
        correct: 0,
        explanation: "Total parts = 3 + 2 = 5. Value of 1 part = 45 / 5 = 9. Girls = 2 × 9 = 18.",
        chapter: "Ratio, Proportion and Unitary Method"
      },
      {
        q: "Find the HCF of 72 and 120.",
        options: ["12", "18", "24", "36"],
        correct: 2,
        explanation: "72 = 2³ × 3²; 120 = 2³ × 3 × 5. HCF = 2³ × 3 = 24.",
        chapter: "Number Sense and Numeration"
      },
      {
        q: "A train running at 72 km/h crosses a 200m platform in 20 seconds. What is the length of the train?",
        options: ["150 m", "200 m", "250 m", "300 m"],
        correct: 1,
        explanation: "Speed = 72 × (5/18) = 20 m/s. Total distance = 20 m/s × 20 s = 400 m. Train length = 400 - 200 = 200 m.",
        chapter: "Everyday Mathematics Word Problems"
      },
      {
        q: "The sum of interior angles of a regular hexagon is:",
        options: ["540°", "720°", "360°", "900°"],
        correct: 1,
        explanation: "Sum of interior angles = (n - 2) × 180° = (6 - 2) × 180° = 4 × 180° = 720°.",
        chapter: "Geometry and Spatial Understanding"
      },
      {
        q: "What is 35% of 480 plus 25% of 320?",
        options: ["228", "248", "252", "260"],
        correct: 1,
        explanation: "35% of 480 = 168. 25% of 320 = 80. 168 + 80 = 248.",
        chapter: "Fractions and Decimals"
      },
      {
        q: "If a shopkeeper gives 20% discount on a marked price of ₹1500, what is the selling price?",
        options: ["₹1100", "₹1200", "₹1250", "₹1300"],
        correct: 1,
        explanation: "Discount = 20% of 1500 = ₹300. Selling Price = 1500 - 300 = ₹1200.",
        chapter: "Achievers Section (HOTS Questions)"
      },
      {
        q: "The mean of five numbers is 28. If one number is excluded, their mean becomes 25. What is the excluded number?",
        options: ["35", "40", "38", "42"],
        correct: 1,
        explanation: "Sum of 5 numbers = 5 × 28 = 140. Sum of 4 numbers = 4 × 25 = 100. Excluded number = 140 - 100 = 40.",
        chapter: "Data Handling and Graphical Representation"
      }
    ],
    senior: [ // Class 9 - 12
      {
        q: "If α and β are the roots of the equation x² - 7x + 12 = 0, find the value of (α² + β²).",
        options: ["25", "37", "49", "24"],
        correct: 0,
        explanation: "α + β = 7, αβ = 12. α² + β² = (α + β)² - 2αβ = 49 - 24 = 25.",
        chapter: "Algebraic Expressions and Equations"
      },
      {
        q: "The coordinates of the centroid of a triangle whose vertices are (2,4), (4,6) and (6,2) are:",
        options: ["(4, 4)", "(3, 3)", "(4, 3)", "(3, 4)"],
        correct: 0,
        explanation: "Centroid G = ((2+4+6)/3, (4+6+2)/3) = (12/3, 12/3) = (4, 4).",
        chapter: "Geometry and Spatial Understanding"
      },
      {
        q: "If sin θ + cos θ = √2 cos θ, then what is (cos θ - sin θ)?",
        options: ["√2 sin θ", "2 sin θ", "√2 cos θ", "1/√2 sin θ"],
        correct: 0,
        explanation: "sin θ = (√2 - 1)cos θ. Multiply both sides by (√2 + 1) to get (√2 + 1)sin θ = cos θ => cos θ - sin θ = √2 sin θ.",
        chapter: "Achievers Section (HOTS Questions)"
      },
      {
        q: "Find the sum of all two-digit numbers divisible by 7.",
        options: ["728", "735", "742", "720"],
        correct: 0,
        explanation: "AP: 14, 21, ..., 98. n = ((98 - 14)/7) + 1 = 13. Sum = (13/2) × (14 + 98) = 13 × 56 = 728.",
        chapter: "Number Sense and Numeration"
      },
      {
        q: "In how many different ways can the letters of the word 'OLYMPIAD' be arranged?",
        options: ["40320", "20160", "5040", "10080"],
        correct: 0,
        explanation: "'OLYMPIAD' has 8 distinct letters. Number of permutations = 8! = 40,320.",
        chapter: "Achievers Section (HOTS Questions)"
      }
    ]
  },

  science: {
    junior: [ // Class 1 - 4
      {
        q: "Which part of the plant absorbs water and minerals from the soil?",
        options: ["Leaves", "Stem", "Roots", "Flowers"],
        correct: 2,
        explanation: "Roots absorb water and essential minerals from the soil and anchor the plant firmly.",
        chapter: "Plants and Animal Kingdom"
      },
      {
        q: "Which gas do humans inhale during respiration?",
        options: ["Carbon dioxide", "Oxygen", "Nitrogen", "Hydrogen"],
        correct: 1,
        explanation: "Humans inhale oxygen from the air which is used to produce energy in our body cells.",
        chapter: "Human Body Systems and Nutrition"
      },
      {
        q: "What state of matter is water vapor?",
        options: ["Solid", "Liquid", "Gas", "Plasma"],
        correct: 2,
        explanation: "Water vapor is the gaseous state of water.",
        chapter: "Matter, Materials and States of Matter"
      },
      {
        q: "Which of the following is an example of a simple machine?",
        options: ["Pulley", "Computer", "Television", "Refrigerator"],
        correct: 0,
        explanation: "A pulley is a simple machine made of a wheel and rope used to lift heavy loads.",
        chapter: "Force, Work, Energy and Simple Machines"
      },
      {
        q: "The closest star to the planet Earth is:",
        options: ["Proxima Centauri", "The Sun", "Sirius", "Polaris"],
        correct: 1,
        explanation: "The Sun is the star at the center of our Solar System and is closest to Earth.",
        chapter: "Earth, Universe and Space Sciences"
      }
    ],
    middle: [ // Class 5 - 8
      {
        q: "Which organelle is known as the 'Powerhouse of the Cell'?",
        options: ["Ribosome", "Nucleus", "Mitochondria", "Golgi Body"],
        correct: 2,
        explanation: "Mitochondria generate most of the chemical energy needed to power the cell (ATP).",
        chapter: "Plants and Animal Kingdom"
      },
      {
        q: "What is the chemical formula for Rust?",
        options: ["Fe₂O₃·xH₂O", "FeSO₄", "FeO", "FeCl₃"],
        correct: 0,
        explanation: "Rust is hydrated iron(III) oxide with the formula Fe₂O₃·xH₂O.",
        chapter: "Matter, Materials and States of Matter"
      },
      {
        q: "An electric current produces which of the following effects?",
        options: ["Heating effect only", "Magnetic effect only", "Both Heating and Magnetic effects", "None of these"],
        correct: 2,
        explanation: "Electric current exhibits heating (Joule heating), magnetic (electromagnetism), and chemical effects.",
        chapter: "Electricity, Circuits and Magnetism"
      },
      {
        q: "Which vitamin helps in blood clotting?",
        options: ["Vitamin A", "Vitamin C", "Vitamin D", "Vitamin K"],
        correct: 3,
        explanation: "Vitamin K is essential for the synthesis of prothrombin, which is required for blood clotting.",
        chapter: "Human Body Systems and Nutrition"
      },
      {
        q: "Which atmospheric layer protects Earth from harmful ultraviolet (UV) solar radiation?",
        options: ["Troposphere", "Stratosphere (Ozone Layer)", "Mesosphere", "Thermosphere"],
        correct: 1,
        explanation: "The Ozone layer located in the Stratosphere absorbs harmful UV rays from the Sun.",
        chapter: "Air, Water and Our Environment"
      }
    ],
    senior: [ // Class 9 - 12
      {
        q: "According to Newton's Second Law of Motion, Force equals:",
        options: ["Mass × Velocity", "Mass × Acceleration", "Work / Time", "Mass × Displacement"],
        correct: 1,
        explanation: "Newton's Second Law states that F = m × a (Force = mass × acceleration).",
        chapter: "Force, Work, Energy and Simple Machines"
      },
      {
        q: "What is the SI unit of electric potential difference (Voltage)?",
        options: ["Ampere", "Ohm", "Volt", "Joule"],
        correct: 2,
        explanation: "The SI unit of electric potential difference is the Volt (V).",
        chapter: "Electricity, Circuits and Magnetism"
      },
      {
        q: "Which of the following elements has the highest electronegativity?",
        options: ["Chlorine", "Oxygen", "Fluorine", "Nitrogen"],
        correct: 2,
        explanation: "Fluorine (F) has the highest electronegativity of 3.98 on the Pauling scale.",
        chapter: "Matter, Materials and States of Matter"
      }
    ]
  },

  english: {
    junior: [
      {
        q: "Choose the correct plural form of 'Child':",
        options: ["Childs", "Children", "Childrens", "Childes"],
        correct: 1,
        explanation: "The irregular plural form of 'child' is 'children'.",
        chapter: "Nouns, Pronouns and Determiners"
      },
      {
        q: "Identify the adjective in the sentence: 'The clever fox jumped over the fence.'",
        options: ["fox", "jumped", "clever", "fence"],
        correct: 2,
        explanation: "'Clever' describes the noun 'fox', hence it is an adjective.",
        chapter: "Adjectives, Adverbs and Prepositions"
      },
      {
        q: "Choose the correct opposite (Antonym) of 'Ancient':",
        options: ["Old", "Modern", "Historic", "Past"],
        correct: 1,
        explanation: "'Modern' means new/recent, which is the antonym of 'Ancient'.",
        chapter: "Vocabulary, Synonyms and Antonyms"
      }
    ],
    middle: [
      {
        q: "Fill in the blank: 'Neither Rohit nor his friends _____ present at the ceremony.'",
        options: ["was", "were", "is", "has been"],
        correct: 1,
        explanation: "When subjects are joined by 'neither...nor', the verb agrees with the closer subject ('friends' -> 'were').",
        chapter: "Verbs, Tenses and Modal Auxiliaries"
      },
      {
        q: "What is the meaning of the idiom 'A blessing in disguise'?",
        options: ["An unfortunate event", "A good thing that seemed bad at first", "A hidden danger", "A secret gift"],
        correct: 1,
        explanation: "'A blessing in disguise' refers to something good that wasn't recognized at first.",
        chapter: "Idioms, Proverbs and Phrasal Verbs"
      },
      {
        q: "Change to Passive Voice: 'The chef prepared a delicious dinner.'",
        options: ["A delicious dinner was prepared by the chef.", "A delicious dinner is prepared by the chef.", "A delicious dinner had prepared the chef.", "The chef was preparing dinner."],
        correct: 0,
        explanation: "Simple past active ('prepared') becomes 'was prepared' in passive voice.",
        chapter: "Active and Passive Voice"
      }
    ],
    senior: [
      {
        q: "Identify the figure of speech: 'The wind whispered through the dark forest.'",
        options: ["Metaphor", "Personification", "Simile", "Hyperbole"],
        correct: 1,
        explanation: "Giving human qualities ('whispered') to non-human things ('wind') is Personification.",
        chapter: "Spoken and Written Expression"
      },
      {
        q: "Choose the word closest in meaning to 'METICULOUS':",
        options: ["Careless", "Thorough & Precise", "Aggressive", "Generous"],
        correct: 1,
        explanation: "'Meticulous' means showing great attention to detail; very careful and precise.",
        chapter: "Vocabulary, Synonyms and Antonyms"
      }
    ]
  },

  cyber: {
    junior: [
      {
        q: "Which device is used to enter text and commands into a computer?",
        options: ["Monitor", "Keyboard", "Printer", "Speaker"],
        correct: 1,
        explanation: "The keyboard is an primary input device used for typing letters, numbers, and commands.",
        chapter: "Hardware, Memory and Storage Devices"
      },
      {
        q: "What does CPU stand for?",
        options: ["Central Processing Unit", "Central Power Unit", "Computer Personal Unit", "Control Program Unit"],
        correct: 0,
        explanation: "CPU stands for Central Processing Unit, known as the brain of the computer.",
        chapter: "Computers and Information Technology Basics"
      }
    ],
    middle: [
      {
        q: "Which shortcut key is used to save a document in MS Word?",
        options: ["Ctrl + C", "Ctrl + V", "Ctrl + S", "Ctrl + Z"],
        correct: 2,
        explanation: "Ctrl + S is the universal keyboard shortcut to save files.",
        chapter: "MS Office (Word, PowerPoint, Excel)"
      },
      {
        q: "What type of malware disguises itself as legitimate software to trick users?",
        options: ["Trojan Horse", "Spyware", "Adware", "Worm"],
        correct: 0,
        explanation: "A Trojan horse misleads users of its true intent by masquerading as a harmless application.",
        chapter: "Internet, Networking & Cyber Security"
      },
      {
        q: "In an algorithm flowchart, what does a diamond-shaped symbol represent?",
        options: ["Start/End", "Process / Calculation", "Decision / Condition", "Input/Output"],
        correct: 2,
        explanation: "In flowcharts, diamond shapes are used for decision-making and conditional branching.",
        chapter: "Algorithms and Flowcharts"
      }
    ],
    senior: [
      {
        q: "Which protocol is used for secure communication over the Internet by encrypting data?",
        options: ["HTTP", "HTTPS", "FTP", "SMTP"],
        correct: 1,
        explanation: "HTTPS (Hypertext Transfer Protocol Secure) uses SSL/TLS encryption for safe communication.",
        chapter: "Internet, Networking & Cyber Security"
      },
      {
        q: "What does 'LLM' stand for in Modern Artificial Intelligence?",
        options: ["Large Language Model", "Logical Learning Module", "Low Level Machine", "Linear Logic Matrix"],
        correct: 0,
        explanation: "LLM stands for Large Language Model (e.g., Gemini, GPT).",
        chapter: "Latest IT Developments & AI"
      }
    ]
  },

  gk: {
    junior: [
      {
        q: "Which is the national animal of India?",
        options: ["Lion", "Royal Bengal Tiger", "Elephant", "Leopard"],
        correct: 1,
        explanation: "The Royal Bengal Tiger (Panthera tigris) is the National Animal of India.",
        chapter: "India: States, Capitals & Culture"
      },
      {
        q: "Which planet is known as the 'Red Planet'?",
        options: ["Venus", "Mars", "Jupiter", "Saturn"],
        correct: 1,
        explanation: "Mars appears reddish due to the high presence of iron oxide (rust) on its surface.",
        chapter: "Science and Technology Discoveries"
      }
    ],
    middle: [
      {
        q: "Who is known as the 'Father of the Indian Constitution'?",
        options: ["Mahatma Gandhi", "Dr. B. R. Ambedkar", "Jawaharlal Nehru", "Sardar Vallabhbhai Patel"],
        correct: 1,
        explanation: "Dr. Bhimrao Ramji Ambedkar served as the chairman of the Drafting Committee of the Constitution.",
        chapter: "India: States, Capitals & Culture"
      },
      {
        q: "Where are the headquarters of the United Nations (UN) located?",
        options: ["Geneva, Switzerland", "New York City, USA", "Paris, France", "London, UK"],
        correct: 1,
        explanation: "The UN Headquarters is located in New York City, USA.",
        chapter: "World Geography & Landmarks"
      },
      {
        q: "Which country hosted the 2024 Summer Olympic Games?",
        options: ["Tokyo, Japan", "Paris, France", "Los Angeles, USA", "London, UK"],
        correct: 1,
        explanation: "The 2024 Summer Olympics (XXXIII Olympiad) were held in Paris, France.",
        chapter: "Sports, Games & Awards"
      }
    ],
    senior: [
      {
        q: "Who was the first Indian scientist to win the Nobel Prize in Physics in 1930?",
        options: ["Homi J. Bhabha", "Sir C. V. Raman", "Satyendra Nath Bose", "APJ Abdul Kalam"],
        correct: 1,
        explanation: "Sir Chandrasekhara Venkata Raman won the Nobel Prize in 1930 for the discovery of the Raman Effect.",
        chapter: "Science and Technology Discoveries"
      }
    ]
  },

  reasoning: {
    junior: [
      {
        q: "Find the next number in the pattern: 4, 8, 12, 16, 20, ?",
        options: ["22", "24", "26", "28"],
        correct: 1,
        explanation: "The pattern adds +4 at each step: 20 + 4 = 24.",
        chapter: "Series Completion and Missing Character"
      },
      {
        q: "If CAT is coded as 3120 (C=3, A=1, T=20), what is the code for DOG?",
        options: ["4157", "4147", "4158", "3157"],
        correct: 0,
        explanation: "D=4, O=15, G=7. Combined code is 4157.",
        chapter: "Coding - Decoding & Direction Sense"
      }
    ],
    middle: [
      {
        q: "Pointing to a photograph of a man, Rahul said, 'He is the son of the only son of my grandfather.' How is Rahul related to the man?",
        options: ["Father", "Brother or Himself", "Cousin", "Uncle"],
        correct: 1,
        explanation: "'Only son of my grandfather' = Rahul's father. 'Son of my father' = Rahul or Rahul's brother.",
        chapter: "Blood Relations"
      },
      {
        q: "A clock shows 3:00. What is the angle between the hour hand and the minute hand?",
        options: ["60°", "90°", "120°", "45°"],
        correct: 1,
        explanation: "At 3:00, the minute hand points to 12 and the hour hand to 3. The angle is 3 × 30° = 90°.",
        chapter: "Clock and Calendar"
      },
      {
        q: "If '+' means '×', '-' means '÷', '×' means '+', and '÷' means '-', then solve: 12 + 4 ÷ 8 - 2 × 5",
        options: ["49", "45", "52", "47"],
        correct: 0,
        explanation: "Replace signs: 12 × 4 - 8 ÷ 2 + 5 = 48 - 4 + 5 = 49.",
        chapter: "Mathematical Operations"
      },
      {
        q: "Find the odd one out: 27, 64, 125, 144, 216",
        options: ["64", "125", "144", "216"],
        correct: 2,
        explanation: "27=3³, 64=4³, 125=5³, 216=6³ are perfect cubes. 144 is 12² (a square, not a cube).",
        chapter: "Analogy and Classification"
      }
    ],
    senior: [
      {
        q: "In a certain code, 'ORANGE' is written as 'PUBOHF'. How will 'BANANA' be written in that code?",
        options: ["CBOBOB", "CBPOBP", "CBPBPB", "CBONBO"],
        correct: 0,
        explanation: "Each letter is shifted by +1: B->C, A->B, N->O, A->B, N->O, A->B => CBOBOB.",
        chapter: "Coding - Decoding & Direction Sense"
      },
      {
        q: "If today is Tuesday, what day of the week will it be after 65 days?",
        options: ["Thursday", "Friday", "Wednesday", "Saturday"],
        correct: 0,
        explanation: "65 mod 7 = 2 odd days. Tuesday + 2 days = Thursday.",
        chapter: "Clock and Calendar"
      }
    ]
  }
};

/**
 * Intelligent Question Generator
 * Returns a list of formatted MCQs for the chosen Olympiad configuration.
 */
export function generateIntelligentOlympiadTest({
  subject = 'math',
  grade = 'Class 6',
  level = 'Level 1',
  difficulty = 'Foundation',
  questionCount = 10,
  selectedChapters = []
}) {
  const cleanSubject = (subject || 'math').toLowerCase();
  const subPool = QUESTION_POOL[cleanSubject] || QUESTION_POOL['math'];

  // Determine age/class group
  const gradeNumMatch = (grade || 'Class 6').match(/\d+/);
  const gradeNum = gradeNumMatch ? parseInt(gradeNumMatch[0], 10) : 6;

  let sourcePool = [];
  if (gradeNum <= 4) {
    sourcePool = [...(subPool.junior || []), ...(subPool.middle || [])];
  } else if (gradeNum <= 8) {
    sourcePool = [...(subPool.middle || []), ...(subPool.junior || []), ...(subPool.senior || [])];
  } else {
    sourcePool = [...(subPool.senior || []), ...(subPool.middle || [])];
  }

  if (sourcePool.length === 0) {
    sourcePool = [...(subPool.middle || []), ...(subPool.junior || [])];
  }

  // Filter by selected chapters if any
  let candidatePool = sourcePool;
  if (Array.isArray(selectedChapters) && selectedChapters.length > 0) {
    const chapterFiltered = sourcePool.filter(q => selectedChapters.includes(q.chapter));
    if (chapterFiltered.length >= 3) {
      candidatePool = chapterFiltered;
    }
  }

  // Shuffle candidate pool
  const shuffled = [...candidatePool].sort(() => 0.5 - Math.random());

  // Generate requested number of questions with variety
  const resultQuestions = [];
  const targetCount = Math.max(5, parseInt(questionCount, 10) || 10);

  for (let i = 0; i < targetCount; i++) {
    const baseQ = shuffled[i % shuffled.length];
    
    // Create unique ID and structured question object
    resultQuestions.push({
      id: i + 1,
      q: baseQ.q,
      options: [...baseQ.options],
      correct: baseQ.correct,
      explanation: baseQ.explanation || `Correct answer is option ${String.fromCharCode(65 + baseQ.correct)}.`,
      chapter: baseQ.chapter || 'General Olympiad',
      marks: 1
    });
  }

  return resultQuestions;
}
