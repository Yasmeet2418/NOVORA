// Initial seed data preserved from the original RecallMate AI app
// Maintains 100% compatibility with original localStorage schema: recallmate:data:v1

export const SEED_KEYPOINTS_PHOTOSYNTHESIS = [
  { id: "kp_seed_0", text: "Photosynthesis converts light energy, water and carbon dioxide into glucose and oxygen.", type: "summary" },
  { id: "kp_seed_1", text: "Definition: photosynthesis — the process by which green plants use sunlight to synthesise nutrients from carbon dioxide and water.", type: "definition" },
  { id: "kp_seed_2", text: "It happens mainly in the chloroplasts, which contain the green pigment chlorophyll.", type: "point" },
  { id: "kp_seed_3", text: "Light-dependent reactions occur in the thylakoid membranes and split water to release oxygen, ATP and NADPH.", type: "point" },
  { id: "kp_seed_4", text: "The light-independent reactions (Calvin cycle) use ATP and NADPH to fix carbon dioxide into glucose.", type: "point" },
  { id: "kp_seed_5", text: "Recall question: In which part of the chloroplast do the light-dependent reactions take place?", type: "question", answer: "The thylakoid membranes." },
  { id: "kp_seed_6", text: "Recall question: What are the three products of the light-dependent reactions?", type: "question", answer: "Oxygen, ATP and NADPH." }
];

export const INITIAL_TOPICS_RAW = [
  {
    name: "Photosynthesis",
    subject: "Biology",
    classLevel: "Class 10",
    examGoal: "NEET UG",
    dateOffset: -2,
    notes: "Covered the overall equation, leaf structure, and the two stages of photosynthesis. Drew and labelled a chloroplast diagram.",
    understanding: "okay",
    struggledWith: "Light-dependent reactions — I do not understand how light is turned into ATP and where the oxygen actually comes from.",
    keypoints: SEED_KEYPOINTS_PHOTOSYNTHESIS,
    aiGeneratedAt: null
  },
  {
    name: "French Revolution — Causes",
    subject: "History",
    classLevel: "Class 9",
    examGoal: "CBSE Board",
    dateOffset: -9,
    notes: "Studied the three estates, financial crisis, and Enlightenment ideas. Timeline from 1774 to 1789.",
    understanding: "solid",
    struggledWith: "",
    keypoints: [
      { id: "kp_fr_0", text: "The French Revolution began in 1789 driven by bankruptcy, social inequality (Estates system), and Enlightenment philosophy.", type: "summary" },
      { id: "kp_fr_1", text: "Definition: Third Estate — 98% of the population comprising peasants, workers, and bourgeoisie who paid all the taxes.", type: "definition" },
      { id: "kp_fr_2", text: "The storming of the Bastille on 14 July 1789 marked the collapse of absolute royal authority.", type: "point" }
    ],
    aiGeneratedAt: null
  },
  {
    name: "Quadratic Equations",
    subject: "Mathematics",
    classLevel: "Class 10",
    examGoal: "JEE Main",
    dateOffset: -1,
    notes: "Practised factoring and the quadratic formula. Still mixing up signs when b is negative.",
    understanding: "shaky",
    struggledWith: "The discriminant — how does b² − 4ac tell me how many answers there are?",
    keypoints: [
      { id: "kp_qe_0", text: "Standard form is ax² + bx + c = 0 where a ≠ 0.", type: "summary" },
      { id: "kp_qe_1", text: "Discriminant D = b² - 4ac determines root nature: D > 0 (2 distinct real), D = 0 (equal real), D < 0 (complex conjugate).", type: "definition" },
      { id: "kp_qe_2", text: "Quadratic formula: x = (-b ± √(b² - 4ac)) / (2a).", type: "formula" }
    ],
    aiGeneratedAt: null
  },
  {
    name: "Passé Composé vs Imparfait",
    subject: "English",
    classLevel: "Class 10",
    examGoal: "CBSE Board",
    dateOffset: -4,
    notes: "French grammar: when to use each past tense. Did 20 practice sentences.",
    understanding: "okay",
    struggledWith: "",
    keypoints: null,
    aiGeneratedAt: null
  },
  {
    name: "Electromagnetic Induction & Faraday's Law",
    subject: "Physics",
    classLevel: "Class 12",
    examGoal: "JEE Main",
    dateOffset: -3,
    notes: "Studied magnetic flux Φ = B·A·cos(θ) and Lenz's law. Direction of induced current opposes change in flux.",
    understanding: "okay",
    struggledWith: "Calculating induced emf in rotating coils when magnetic field is inhomogeneous.",
    keypoints: [
      { id: "kp_emi_0", text: "Faraday's Law of Induction states that induced emf ε = -dΦB/dt.", type: "summary" },
      { id: "kp_emi_1", text: "Lenz's Law ensures conservation of energy; the negative sign in ε = -N(dΦ/dt) represents the opposing magnetic field.", type: "definition" },
      { id: "kp_emi_2", text: "Motional EMF for a conductor of length L moving with velocity v in field B is ε = B·v·L.", type: "formula" }
    ],
    aiGeneratedAt: null
  }
];

export function getIsoDate(offsetDays = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().slice(0, 10);
}

export function generateSeedData() {
  const now = new Date().toISOString();
  const topics = INITIAL_TOPICS_RAW.map((item, index) => {
    const id = `topic_${Date.now().toString(36)}_${index}_${Math.random().toString(36).slice(2, 6)}`;
    const dateStudied = getIsoDate(item.dateOffset);
    return {
      id,
      name: item.name,
      subject: item.subject,
      classLevel: item.classLevel || "Class 10",
      examGoal: item.examGoal || "JEE Main",
      dateStudied,
      notes: item.notes,
      understanding: item.understanding,
      struggledWith: item.struggledWith,
      keypoints: item.keypoints,
      aiGeneratedAt: item.aiGeneratedAt,
      createdAt: now
    };
  });

  const revisions = [];
  const intervals = [1, 3, 7, 14, 30];
  const today = getIsoDate(0);

  topics.forEach(t => {
    intervals.forEach(day => {
      const studDate = new Date(t.dateStudied);
      studDate.setDate(studDate.getDate() + day);
      const dueDate = studDate.toISOString().slice(0, 10);
      const isPast = dueDate < today;
      const isToday = dueDate === today;

      revisions.push({
        id: `rev_${t.id}_${day}`,
        topicId: t.id,
        dayOffset: day,
        dueDate,
        status: isPast ? (t.understanding === "solid" ? "completed" : "missed") : (isToday ? "pending" : "pending"),
        completedAt: isPast && t.understanding === "solid" ? dueDate : null
      });
    });
  });

  const quadraticTopic = topics.find(t => t.name.includes("Quadratic")) || topics[2];
  const photosynthesisTopic = topics.find(t => t.name.includes("Photosynthesis")) || topics[0];

  const recoveries = [
    {
      id: `rec_${Date.now().toString(36)}_1`,
      topicId: quadraticTopic.id,
      concept: quadraticTopic.struggledWith || "The discriminant — how does b² − 4ac determine the nature of roots?",
      status: "understood",
      quizCorrect: true,
      updatedAt: now,
      recoveryExplanation: "The discriminant D = b² - 4ac is inside the square root in x = (-b ± √D) / 2a. If D > 0, you add and subtract a real positive number, giving 2 distinct roots. If D = 0, adding or subtracting 0 gives 1 repeated root (-b/2a). If D < 0, the square root produces imaginary numbers, so there are 0 real roots."
    },
    {
      id: `rec_${Date.now().toString(36)}_2`,
      topicId: photosynthesisTopic.id,
      concept: photosynthesisTopic.struggledWith || "Light-dependent reactions & ATP generation",
      status: "struggling",
      quizCorrect: false,
      updatedAt: now,
      recoveryExplanation: "Photolysis splits H₂O: 2H₂O → 4H⁺ + 4e⁻ + O₂. The released electrons move through photosystems II and I, pumping protons into the thylakoid lumen. This proton gradient drives ATP synthase to generate ATP via photophosphorylation."
    }
  ];

  const quizResults = [
    {
      id: `quiz_${Date.now().toString(36)}_1`,
      topicId: quadraticTopic.id,
      testName: "Quadratic Equations Diagnostic",
      takenAt: getIsoDate(-1),
      score: 3,
      total: 4,
      timeSpentSeconds: 180,
      accuracy: 75,
      missedConcepts: ["Discriminant condition when roots are imaginary"]
    },
    {
      id: `quiz_${Date.now().toString(36)}_2`,
      topicId: photosynthesisTopic.id,
      testName: "Photosynthesis Recall Test",
      takenAt: getIsoDate(-2),
      score: 4,
      total: 5,
      timeSpentSeconds: 210,
      accuracy: 80,
      missedConcepts: ["Calvin cycle CO2 acceptor (RuBP)"]
    }
  ];

  return {
    topics,
    revisions,
    recoveries,
    quizResults,
    seeded: true
  };
}
