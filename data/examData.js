// Modular Competitive Examination Data Engine
// Supports JEE Main, JEE Advanced, NEET UG, NDA, CUET UG, UPSC Civil Services, SSC CGL
// Every exam maintains its distinct marking scheme, question distribution, duration, syllabus and patterns.

export const EXAM_CATEGORIES = [
  { id: "engineering", name: "Engineering Entrances", icon: "Cpu" },
  { id: "medical", name: "Medical Entrances", icon: "Activity" },
  { id: "defence", name: "Defence Services", icon: "Shield" },
  { id: "university", name: "University Entrance", icon: "GraduationCap" },
  { id: "civil-services", name: "Civil Services", icon: "Building2" },
  { id: "banking-govt", name: "Banking & Government", icon: "Landmark" }
];

export const EXAMS_REGISTRY = {
  "jee-main": {
    id: "jee-main",
    name: "JEE Main",
    category: "engineering",
    fullName: "Joint Entrance Examination (Main)",
    conductingBody: "National Testing Agency (NTA)",
    officialWebsite: "https://jeemain.nta.nic.in",
    durationMinutes: 180,
    totalMarks: 300,
    totalQuestions: 90,
    attemptQuestions: 75,
    markingScheme: {
      correct: 4,
      incorrect: -1,
      unattempted: 0,
      description: "+4 for correct, -1 for incorrect, 0 for unattempted (applies to both MCQs and Numerical questions)."
    },
    subjects: [
      {
        id: "physics",
        name: "Physics",
        questionCount: 30,
        attemptCount: 25,
        marks: 100,
        chapters: [
          { name: "Kinematics & Vectors", weightage: "6%", avgQuestions: 1.8, highYield: true },
          { name: "Laws of Motion & Friction", weightage: "5%", avgQuestions: 1.5, highYield: true },
          { name: "Work, Energy & Power", weightage: "5%", avgQuestions: 1.4, highYield: false },
          { name: "Rotational Motion", weightage: "8%", avgQuestions: 2.3, highYield: true },
          { name: "Gravitation", weightage: "4%", avgQuestions: 1.2, highYield: false },
          { name: "Thermodynamics & KTG", weightage: "9%", avgQuestions: 2.7, highYield: true },
          { name: "Electrostatics & Capacitance", weightage: "9%", avgQuestions: 2.6, highYield: true },
          { name: "Current Electricity", weightage: "8%", avgQuestions: 2.4, highYield: true },
          { name: "Magnetic Effects of Current & EMI", weightage: "9%", avgQuestions: 2.7, highYield: true },
          { name: "Optics (Ray & Wave)", weightage: "10%", avgQuestions: 3.0, highYield: true },
          { name: "Modern Physics & Semiconductors", weightage: "11%", avgQuestions: 3.3, highYield: true }
        ]
      },
      {
        id: "chemistry",
        name: "Chemistry",
        questionCount: 30,
        attemptCount: 25,
        marks: 100,
        chapters: [
          { name: "Some Basic Concepts of Chemistry (Mole Concept)", weightage: "5%", avgQuestions: 1.5, highYield: false },
          { name: "Atomic Structure", weightage: "6%", avgQuestions: 1.8, highYield: true },
          { name: "Chemical Thermodynamics", weightage: "8%", avgQuestions: 2.3, highYield: true },
          { name: "Chemical & Ionic Equilibrium", weightage: "8%", avgQuestions: 2.4, highYield: true },
          { name: "Periodic Table & Chemical Bonding", weightage: "10%", avgQuestions: 3.0, highYield: true },
          { name: "Coordination Compounds", weightage: "8%", avgQuestions: 2.4, highYield: true },
          { name: "d and f Block Elements", weightage: "6%", avgQuestions: 1.8, highYield: true },
          { name: "General Organic Chemistry (GOC)", weightage: "9%", avgQuestions: 2.7, highYield: true },
          { name: "Hydrocarbons", weightage: "6%", avgQuestions: 1.8, highYield: false },
          { name: "Aldehydes, Ketones & Carboxylic Acids", weightage: "9%", avgQuestions: 2.7, highYield: true },
          { name: "Biomolecules", weightage: "5%", avgQuestions: 1.5, highYield: true }
        ]
      },
      {
        id: "mathematics",
        name: "Mathematics",
        questionCount: 30,
        attemptCount: 25,
        marks: 100,
        chapters: [
          { name: "Matrices and Determinants", weightage: "8%", avgQuestions: 2.4, highYield: true },
          { name: "Quadratic Equations & Complex Numbers", weightage: "7%", avgQuestions: 2.0, highYield: true },
          { name: "Sequences and Series", weightage: "6%", avgQuestions: 1.8, highYield: true },
          { name: "Permutations, Combinations & Binomial Theorem", weightage: "8%", avgQuestions: 2.4, highYield: true },
          { name: "Limits, Continuity and Differentiability", weightage: "8%", avgQuestions: 2.5, highYield: true },
          { name: "Application of Derivatives", weightage: "7%", avgQuestions: 2.1, highYield: true },
          { name: "Definite & Indefinite Integrals", weightage: "9%", avgQuestions: 2.7, highYield: true },
          { name: "Differential Equations", weightage: "6%", avgQuestions: 1.8, highYield: true },
          { name: "Coordinate Geometry (Straight Lines & Circles)", weightage: "9%", avgQuestions: 2.6, highYield: true },
          { name: "Vectors and 3D Geometry", weightage: "11%", avgQuestions: 3.3, highYield: true },
          { name: "Probability & Statistics", weightage: "8%", avgQuestions: 2.3, highYield: true }
        ]
      }
    ],
    sampleMockQuestions: [
      {
        id: "jee_m_1",
        subject: "Physics",
        chapter: "Modern Physics & Semiconductors",
        question: "In a photoelectric experiment, when light of wavelength λ is incident, stopping potential is V. When light of wavelength 2λ is incident, stopping potential is V/4. What is the threshold wavelength λ₀?",
        options: ["3λ", "4λ", "2.5λ", "5λ"],
        correctIndex: 0,
        explanation: "By Einstein's equation: eV = hc/λ - hc/λ₀ and e(V/4) = hc/(2λ) - hc/λ₀. Multiplying second by 4: eV = 2hc/λ - 4hc/λ₀. Equating both: hc/λ - hc/λ₀ = 2hc/λ - 4hc/λ₀ => 3hc/λ₀ = hc/λ => λ₀ = 3λ."
      },
      {
        id: "jee_m_2",
        subject: "Mathematics",
        chapter: "Vectors and 3D Geometry",
        question: "The shortest distance between the skew lines r = (i + 2j + 3k) + λ(i - 3j + 2k) and r = (4i + 5j + 6k) + μ(2i + 3j + k) is:",
        options: ["3 / √19", "6 / √5", "3√3", "9 / √118"],
        correctIndex: 0,
        explanation: "Formula d = |(a₂ - a₁) · (b₁ × b₂)| / |b₁ × b₂|. Computing cross product b₁ × b₂ = (-9)i + 3j + 9k. (a₂ - a₁) = 3i + 3j + 3k. Dot product is 3(-9) + 3(3) + 3(9) = 9. |b₁ × b₂| = √(81 + 9 + 81) = √171 = 3√19. Distance = 9 / (3√19) = 3 / √19."
      },
      {
        id: "jee_m_3",
        subject: "Chemistry",
        chapter: "Coordination Compounds",
        question: "Which of the following complex ions is diamagnetic and has d²sp³ hybridization?",
        options: ["[CoF₆]³⁻", "[Fe(CN)₆]³⁻", "[Co(NH₃)₆]³⁺", "[Ni(CO)₄]"],
        correctIndex: 2,
        explanation: "Co³⁺ has 3d⁶ configuration. NH₃ is a strong field ligand causing pairing of electrons in 3d: all 6 electrons pair up into three t2g orbitals, leaving two vacant 3d orbitals for d²sp³ hybridization. With zero unpaired electrons, it is diamagnetic."
      }
    ]
  },
  "neet-ug": {
    id: "neet-ug",
    name: "NEET UG",
    category: "medical",
    fullName: "National Eligibility cum Entrance Test (Undergraduate)",
    conductingBody: "National Testing Agency (NTA)",
    officialWebsite: "https://neet.nta.nic.in",
    durationMinutes: 200,
    totalMarks: 720,
    totalQuestions: 200,
    attemptQuestions: 180,
    markingScheme: {
      correct: 4,
      incorrect: -1,
      unattempted: 0,
      description: "+4 for each correct response, -1 for each incorrect response, 0 for unattempted questions. Section A has 35 compulsory questions; Section B has 15 questions where any 10 must be attempted."
    },
    subjects: [
      {
        id: "physics",
        name: "Physics",
        questionCount: 50,
        attemptCount: 45,
        marks: 180,
        chapters: [
          { name: "Units and Measurements", weightage: "4%", avgQuestions: 1.8, highYield: false },
          { name: "Mechanics (Motion, Laws, Work, System of Particles)", weightage: "24%", avgQuestions: 10.8, highYield: true },
          { name: "Properties of Bulk Matter", weightage: "7%", avgQuestions: 3.2, highYield: false },
          { name: "Thermodynamics & Kinetic Theory", weightage: "9%", avgQuestions: 4.1, highYield: true },
          { name: "Electrostatics & Current Electricity", weightage: "18%", avgQuestions: 8.0, highYield: true },
          { name: "Magnetism, EMI & AC", weightage: "15%", avgQuestions: 6.8, highYield: true },
          { name: "Optics (Wave & Ray)", weightage: "11%", avgQuestions: 5.0, highYield: true },
          { name: "Modern Physics & Semiconductors", weightage: "12%", avgQuestions: 5.4, highYield: true }
        ]
      },
      {
        id: "chemistry",
        name: "Chemistry",
        questionCount: 50,
        attemptCount: 45,
        marks: 180,
        chapters: [
          { name: "Physical Chemistry (Mole, Thermodynamics, Equilibrium, Solutions, Kinetics)", weightage: "36%", avgQuestions: 16.2, highYield: true },
          { name: "Inorganic Chemistry (Bonding, p-block, Coordination, d & f block)", weightage: "32%", avgQuestions: 14.4, highYield: true },
          { name: "Organic Chemistry (GOC, Hydrocarbons, Carbonyls, Amines, Biomolecules)", weightage: "32%", avgQuestions: 14.4, highYield: true }
        ]
      },
      {
        id: "botany",
        name: "Botany",
        questionCount: 50,
        attemptCount: 45,
        marks: 180,
        chapters: [
          { name: "Plant Kingdom", weightage: "9%", avgQuestions: 4.0, highYield: true },
          { name: "Morphology & Anatomy of Flowering Plants", weightage: "15%", avgQuestions: 6.8, highYield: true },
          { name: "Cell Biology & Cell Division", weightage: "16%", avgQuestions: 7.2, highYield: true },
          { name: "Plant Physiology (Photosynthesis, Respiration)", weightage: "20%", avgQuestions: 9.0, highYield: true },
          { name: "Plant Reproduction", weightage: "16%", avgQuestions: 7.2, highYield: true },
          { name: "Genetics & Molecular Biology", weightage: "24%", avgQuestions: 10.8, highYield: true }
        ]
      },
      {
        id: "zoology",
        name: "Zoology",
        questionCount: 50,
        attemptCount: 45,
        marks: 180,
        chapters: [
          { name: "Animal Kingdom", weightage: "12%", avgQuestions: 5.4, highYield: true },
          { name: "Structural Organisation in Animals", weightage: "8%", avgQuestions: 3.6, highYield: false },
          { name: "Biomolecules", weightage: "10%", avgQuestions: 4.5, highYield: true },
          { name: "Human Physiology (Digestion, Circulation, Excretion, Nervous)", weightage: "35%", avgQuestions: 15.8, highYield: true },
          { name: "Human Reproduction & Reproductive Health", weightage: "15%", avgQuestions: 6.8, highYield: true },
          { name: "Evolution & Biotechnology", weightage: "20%", avgQuestions: 9.0, highYield: true }
        ]
      }
    ],
    sampleMockQuestions: [
      {
        id: "neet_1",
        subject: "Botany",
        chapter: "Genetics & Molecular Biology",
        question: "In DNA replication, the leading strand synthesizes continuously while the lagging strand synthesizes discontinuously because:",
        options: [
          "DNA polymerase can only polymerize deoxyribonucleotides in the 5' → 3' direction",
          "DNA ligase acts only in the 3' → 5' direction",
          "Replication fork moves bidirectionally",
          "RNA primers are required only on the leading strand"
        ],
        correctIndex: 0,
        explanation: "DNA-dependent DNA polymerase catalyses polymerisation strictly in 5' → 3' direction. Hence the template strand with polarity 3' → 5' is continuous, while the template with 5' → 3' polarity forms Okazaki fragments."
      },
      {
        id: "neet_2",
        subject: "Zoology",
        chapter: "Human Physiology",
        question: "A drop in blood pressure and blood volume triggers the release of which hormone from the Juxtaglomerular (JG) cells?",
        options: ["Aldosterone", "Atrial Natriuretic Factor (ANF)", "Renin", "Vasopressin"],
        correctIndex: 2,
        explanation: "JG cells release Renin in response to fall in GFR / blood pressure. Renin converts angiotensinogen into angiotensin I, activating the RAAS system."
      }
    ]
  },
  "nda": {
    id: "nda",
    name: "NDA & NA",
    category: "defence",
    fullName: "National Defence Academy & Naval Academy Examination",
    conductingBody: "Union Public Service Commission (UPSC)",
    officialWebsite: "https://upsc.gov.in",
    durationMinutes: 300,
    totalMarks: 900,
    totalQuestions: 270,
    attemptQuestions: 270,
    markingScheme: {
      correct: 0,
      incorrect: 0,
      unattempted: 0,
      description: "Paper 1 (Maths): 120 questions, 300 marks (+2.5 correct, -0.833 incorrect). Paper 2 (GAT): 150 questions, 600 marks (+4.0 correct, -1.333 incorrect)."
    },
    subjects: [
      {
        id: "maths",
        name: "Paper 1: Mathematics",
        questionCount: 120,
        attemptCount: 120,
        marks: 300,
        chapters: [
          { name: "Algebra & Matrices", weightage: "25%", avgQuestions: 30, highYield: true },
          { name: "Trigonometry", weightage: "18%", avgQuestions: 22, highYield: true },
          { name: "Analytical Geometry 2D & 3D", weightage: "17%", avgQuestions: 20, highYield: true },
          { name: "Differential & Integral Calculus", weightage: "25%", avgQuestions: 30, highYield: true },
          { name: "Vector Algebra", weightage: "8%", avgQuestions: 10, highYield: false },
          { name: "Statistics and Probability", weightage: "7%", avgQuestions: 8, highYield: true }
        ]
      },
      {
        id: "gat",
        name: "Paper 2: General Ability Test (GAT)",
        questionCount: 150,
        attemptCount: 150,
        marks: 600,
        chapters: [
          { name: "Part A: English (Grammar, Comprehension, Synonyms/Antonyms)", weightage: "33%", avgQuestions: 50, highYield: true },
          { name: "Part B: Physics", weightage: "16%", avgQuestions: 24, highYield: true },
          { name: "Part B: Chemistry", weightage: "10%", avgQuestions: 15, highYield: false },
          { name: "Part B: General Science", weightage: "7%", avgQuestions: 11, highYield: false },
          { name: "Part B: History & Indian Freedom Movement", weightage: "13%", avgQuestions: 20, highYield: true },
          { name: "Part B: Geography", weightage: "13%", avgQuestions: 20, highYield: true },
          { name: "Part B: Current Events & Defence Affairs", weightage: "8%", avgQuestions: 10, highYield: true }
        ]
      }
    ],
    sampleMockQuestions: [
      {
        id: "nda_1",
        subject: "Paper 1: Mathematics",
        chapter: "Trigonometry",
        question: "What is the value of sin 15° + cos 15°?",
        options: ["1 / √2", "√3 / √2", "√(3/2)", "√2"],
        correctIndex: 2,
        explanation: "sin 15° + cos 15° = √2 · (cos 15°·cos 45° + sin 15°·sin 45°) = √2 · cos(15° - 45°) = √2 · cos 30° = √2 · (√3 / 2) = √3 / √2 = √(3/2)."
      },
      {
        id: "nda_2",
        subject: "Paper 2: General Ability Test",
        chapter: "Part B: History & Indian Freedom Movement",
        question: "Who was the Viceroy of India when the Quit India Movement was launched in August 1942?",
        options: ["Lord Linlithgow", "Lord Wavell", "Lord Mountbatten", "Lord Irwin"],
        correctIndex: 0,
        explanation: "Lord Linlithgow served as Viceroy of India from 1936 to 1943 during the outbreak of the Second World War and the 1942 Quit India Movement."
      }
    ]
  },
  "cuet-ug": {
    id: "cuet-ug",
    name: "CUET UG",
    category: "university",
    fullName: "Common University Entrance Test (Undergraduate)",
    conductingBody: "National Testing Agency (NTA)",
    officialWebsite: "https://cuetug.ntaonline.in",
    durationMinutes: 45,
    totalMarks: 250,
    totalQuestions: 50,
    attemptQuestions: 40,
    markingScheme: {
      correct: 5,
      incorrect: -1,
      unattempted: 0,
      description: "+5 marks for each correct answer, -1 for each incorrect answer, 0 for unattempted. Candidates attempt 40 out of 50 questions in each domain test."
    },
    subjects: [
      { id: "lang", name: "Section IA: English Language", questionCount: 50, attemptCount: 40, marks: 200, chapters: [{ name: "Reading Comprehension", weightage: "40%", avgQuestions: 16, highYield: true }, { name: "Vocabulary & Idioms", weightage: "30%", avgQuestions: 12, highYield: true }, { name: "Grammar & Sentence Rearrangement", weightage: "30%", avgQuestions: 12, highYield: true }] },
      { id: "domain_maths", name: "Domain: Mathematics / Applied Maths", questionCount: 50, attemptCount: 40, marks: 200, chapters: [{ name: "Calculus", weightage: "35%", avgQuestions: 14, highYield: true }, { name: "Algebra & Matrices", weightage: "25%", avgQuestions: 10, highYield: true }, { name: "Probability", weightage: "20%", avgQuestions: 8, highYield: true }, { name: "Vectors & 3D", weightage: "20%", avgQuestions: 8, highYield: true }] },
      { id: "general_test", name: "Section III: General Test", questionCount: 60, attemptCount: 50, marks: 250, chapters: [{ name: "General Knowledge & Current Affairs", weightage: "30%", avgQuestions: 15, highYield: true }, { name: "Numerical Ability & Quantitative Reasoning", weightage: "40%", avgQuestions: 20, highYield: true }, { name: "Logical and Analytical Reasoning", weightage: "30%", avgQuestions: 15, highYield: true }] }
    ],
    sampleMockQuestions: [
      {
        id: "cuet_1",
        subject: "Section III: General Test",
        chapter: "Numerical Ability & Quantitative Reasoning",
        question: "If the selling price of 16 articles is equal to the cost price of 20 articles, what is the profit percentage?",
        options: ["20%", "25%", "30%", "15%"],
        correctIndex: 1,
        explanation: "16 SP = 20 CP => SP/CP = 20/16 = 5/4. Profit percentage = ((SP - CP) / CP) × 100 = ((5 - 4)/4) × 100 = 25%."
      }
    ]
  },
  "upsc-cse": {
    id: "upsc-cse",
    name: "UPSC Civil Services",
    category: "civil-services",
    fullName: "UPSC Civil Services Examination (IAS/IPS/IFS)",
    conductingBody: "Union Public Service Commission",
    officialWebsite: "https://upsc.gov.in",
    durationMinutes: 240,
    totalMarks: 400,
    totalQuestions: 180,
    attemptQuestions: 180,
    markingScheme: {
      correct: 2,
      incorrect: -0.66,
      unattempted: 0,
      description: "GS Paper 1: 100 questions, 200 marks (+2.0 correct, -0.66 incorrect). CSAT Paper 2: 80 questions, 200 marks (+2.5 correct, -0.83 incorrect, qualifying at 33%)."
    },
    subjects: [
      {
        id: "gs-1",
        name: "Prelims Paper 1: General Studies",
        questionCount: 100,
        attemptCount: 100,
        marks: 200,
        chapters: [
          { name: "Indian Polity and Governance", weightage: "18%", avgQuestions: 18, highYield: true },
          { name: "Indian Economy and Sustainable Development", weightage: "16%", avgQuestions: 16, highYield: true },
          { name: "Environment, Ecology and Biodiversity", weightage: "18%", avgQuestions: 18, highYield: true },
          { name: "Modern Indian History and Art & Culture", weightage: "15%", avgQuestions: 15, highYield: true },
          { name: "Geography (Physical, Indian, World)", weightage: "14%", avgQuestions: 14, highYield: true },
          { name: "Science and Technology", weightage: "12%", avgQuestions: 12, highYield: true },
          { name: "Current Events of National & International Importance", weightage: "7%", avgQuestions: 7, highYield: true }
        ]
      }
    ],
    sampleMockQuestions: [
      {
        id: "upsc_1",
        subject: "Prelims Paper 1: General Studies",
        chapter: "Indian Polity and Governance",
        question: "Which one of the following suggested that the Governor should be an eminent person from outside the State and should be a detached figure without intense political links?",
        options: [
          "First Administrative Reforms Commission (1966)",
          "Rajamannar Committee (1969)",
          "Sarkaria Commission (1983)",
          "National Commission to Review the Working of the Constitution (2000)"
        ],
        correctIndex: 2,
        explanation: "The Sarkaria Commission on Centre-State relations (1983) specifically recommended that the Governor should be an eminent person from outside the state, not intimately connected with local politics."
      }
    ]
  },
  "ssc-cgl": {
    id: "ssc-cgl",
    name: "SSC CGL",
    category: "banking-govt",
    fullName: "Staff Selection Commission Combined Graduate Level",
    conductingBody: "Staff Selection Commission (SSC)",
    officialWebsite: "https://ssc.gov.in",
    durationMinutes: 60,
    totalMarks: 200,
    totalQuestions: 100,
    attemptQuestions: 100,
    markingScheme: {
      correct: 2,
      incorrect: -0.5,
      unattempted: 0,
      description: "Tier 1: 100 questions in 60 minutes across 4 sections. +2 marks for correct answer, -0.50 marks negative for each wrong answer."
    },
    subjects: [
      { id: "reasoning", name: "General Intelligence and Reasoning", questionCount: 25, attemptCount: 25, marks: 50, chapters: [{ name: "Analogies & Classification", weightage: "24%", avgQuestions: 6, highYield: true }, { name: "Series & Coding-Decoding", weightage: "24%", avgQuestions: 6, highYield: true }, { name: "Non-Verbal Reasoning", weightage: "20%", avgQuestions: 5, highYield: false }, { name: "Syllogisms & Blood Relations", weightage: "16%", avgQuestions: 4, highYield: true }] },
      { id: "quant", name: "Quantitative Aptitude", questionCount: 25, attemptCount: 25, marks: 50, chapters: [{ name: "Arithmetic (Percentage, Ratio, Profit/Loss, Time & Work)", weightage: "48%", avgQuestions: 12, highYield: true }, { name: "Advanced Maths (Algebra, Trigonometry, Geometry, Mensuration)", weightage: "52%", avgQuestions: 13, highYield: true }] },
      { id: "english", name: "English Comprehension", questionCount: 25, attemptCount: 25, marks: 50, chapters: [{ name: "Error Spotting & Sentence Improvement", weightage: "32%", avgQuestions: 8, highYield: true }, { name: "Vocab: Synonyms, Antonyms, Idioms, One-word", weightage: "40%", avgQuestions: 10, highYield: true }, { name: "Cloze Test / Reading Comprehension", weightage: "28%", avgQuestions: 7, highYield: true }] },
      { id: "ga", name: "General Awareness", questionCount: 25, attemptCount: 25, marks: 50, chapters: [{ name: "Static GK (Polity, History, Geography, Science)", weightage: "70%", avgQuestions: 17, highYield: true }, { name: "Current Affairs", weightage: "30%", avgQuestions: 8, highYield: true }] }
    ],
    sampleMockQuestions: [
      {
        id: "ssc_1",
        subject: "Quantitative Aptitude",
        chapter: "Advanced Maths",
        question: "If x + 1/x = 3, then what is the value of x⁴ + 1/x⁴?",
        options: ["47", "49", "51", "45"],
        correctIndex: 0,
        explanation: "Squaring both sides: x² + 1/x² = 3² - 2 = 7. Squaring once more: x⁴ + 1/x⁴ = 7² - 2 = 49 - 2 = 47."
      }
    ]
  }
};
