// RecallMate Central Reactive Store
// Storage key: recallmate:data:v1 (100% backward compatible with original app)

import { generateSeedData } from "../data/initialTopics.js";

const STORAGE_KEY = "recallmate:data:v1";

const DEFAULT_PROFILE = {
  name: "Alex Sharma",
  avatar: "🎓",
  classLevel: "Class 10",
  board: "cbse",
  targetExam: "jee-main",
  studyStreak: 7,
  points: 1450,
  dailyTargetHours: 3.5
};

const DEFAULT_AI_SETTINGS = {
  geminiApiKey: "",
  searchApiKey: "",
  searchEngineCx: "",
  preferredResponseMode: "detailed"
};

function loadInitialState(storageKey = STORAGE_KEY) {
  try {
    const raw = storageKey ? localStorage.getItem(storageKey) : null;
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.topics)) {
        // Ensure all new schema fields exist
        if (!parsed.userProfile) parsed.userProfile = { ...DEFAULT_PROFILE };
        if (!Array.isArray(parsed.notes)) parsed.notes = [];
        if (!Array.isArray(parsed.mockTestHistory)) parsed.mockTestHistory = [];
        if (!Array.isArray(parsed.savedResources)) parsed.savedResources = [];
        if (!parsed.aiSettings) parsed.aiSettings = { ...DEFAULT_AI_SETTINGS };
        if (!parsed.studyPlan) parsed.studyPlan = null;
        return parsed;
      }
    }
  } catch (err) {
    console.error("Error loading localStorage data:", err);
  }

  // Generate fresh seed data
  const seed = generateSeedData();
  const sampleNote = {
    id: `note_${Date.now().toString(36)}_sample`,
    title: "Faraday's Laws & Motional EMF Notes",
    fileName: "electromagnetic_induction_notes.pdf",
    fileType: "pdf",
    classLevel: "Class 12",
    subject: "Physics",
    chapter: "Electromagnetic Induction",
    examCategory: "jee-main",
    contentText: "Faraday's First Law: Whenever magnetic flux linked with a closed circuit changes, an electromotive force (EMF) is induced. Faraday's Second Law: The magnitude of induced EMF is directly proportional to the rate of change of magnetic flux (ε = -dΦ/dt). Lenz's Law: The polarity of the induced EMF is such that it produces a current whose magnetic field opposes the change in magnetic flux that produced it (Energy Conservation). Motional EMF for a rod of length L moving with velocity v perpendicular to magnetic field B: ε = B·v·L. Self-inductance of a solenoid: L = μ₀ · N² · A / l. Energy stored in an inductor: U = ½ · L · I².",
    wordCount: 114,
    uploadedAt: new Date().toISOString(),
    aiOutputs: {
      summary: "Comprehensive reference notes on Faraday's law of induction, Lenz's law, and motional EMF equations for competitive exams.",
      keyPoints: [
        "Induced EMF ε = -N (dΦ/dt)",
        "Negative sign represents Lenz's Law enforcing energy conservation",
        "Motional EMF across moving conductor is B·v·L",
        "Energy density in magnetic field is B² / (2μ₀)"
      ],
      definitions: [
        { term: "Magnetic Flux", definition: "The surface integral of the normal component of magnetic field flux density B passing through an area A: Φ = B·A·cos(θ)." },
        { term: "Self-Induction", definition: "The phenomenon where an induced EMF is produced in a coil due to change of electric current through the coil itself." }
      ],
      formulas: [
        { name: "Induced EMF", formula: "ε = -dΦ / dt" },
        { name: "Motional EMF", formula: "ε = B · v · L" },
        { name: "Inductor Energy", formula: "U = ½ · L · I²" }
      ],
      flashcards: [
        { front: "What does Lenz's Law conserve?", back: "Conservation of Energy. The mechanical work done to oppose the induced field converts into electrical energy." },
        { front: "What is the formula for motional EMF?", back: "ε = B · v · L (where B, v, and L are mutually perpendicular)." },
        { front: "What is the self-inductance of a solenoid of length l, turns N, and area A?", back: "L = μ₀ · N² · A / l." }
      ],
      mcqs: [
        {
          question: "A copper rod of length L rotates at angular velocity ω in a perpendicular magnetic field B about one end. The induced EMF between its ends is:",
          options: ["BωL²", "½ BωL²", "2 BωL²", "¼ BωL²"],
          correctIndex: 1,
          explanation: "Integrating motional EMF dε = B·v·dr = B(ωr)dr from 0 to L gives ε = ½ BωL²."
        }
      ]
    }
  };

  return {
    ...seed,
    userProfile: { ...DEFAULT_PROFILE },
    notes: [sampleNote],
    mockTestHistory: [],
    savedResources: ["res_nta_mock_abhyas", "res_jee_main_pyq_2024"],
    aiSettings: { ...DEFAULT_AI_SETTINGS },
    studyPlan: null
  };
}

class Store {
  constructor() {
    this.storageKey = STORAGE_KEY;
    this.state = loadInitialState();
    this.listeners = new Set();
  }

  get() {
    return this.state;
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.state));
    } catch (err) {
      console.warn("Could not save to localStorage:", err);
    }
    this.listeners.forEach(fn => fn(this.state));
  }

  update(updater) {
    this.state = typeof updater === "function" ? updater(this.state) : { ...this.state, ...updater };
    this.notify();
  }

  switchAccount(userId, cloudState, user) {
    const accountStorageKey = `${STORAGE_KEY}:user:${userId}`;
    const localRaw = localStorage.getItem(accountStorageKey);
    const localState = loadInitialState(accountStorageKey);
    let state = cloudState && Array.isArray(cloudState.topics) ? cloudState : localState;

    if (cloudState && localRaw) {
      try {
        const localAccountState = JSON.parse(localRaw);
        const localSettings = localAccountState.aiSettings || {};
        state = {
          ...state,
          aiSettings: {
            ...state.aiSettings,
            geminiApiKey: localSettings.geminiApiKey || "",
            searchApiKey: localSettings.searchApiKey || "",
            searchEngineCx: localSettings.searchEngineCx || ""
          }
        };
      } catch (error) {
        console.warn("Could not restore local AI settings for this account:", error);
      }
    }

    if (!cloudState && !localRaw && user?.user_metadata?.full_name) {
      state.userProfile = { ...state.userProfile, name: user.user_metadata.full_name };
    }
    this.storageKey = accountStorageKey;
    this.state = state;
    this.notify();
  }

  // --- Profile & Preferences ---
  updateProfile(profileData) {
    this.update(s => ({
      ...s,
      userProfile: { ...s.userProfile, ...profileData }
    }));
  }

  setGoal(classLevel, targetExam) {
    this.update(s => ({
      ...s,
      userProfile: {
        ...s.userProfile,
        classLevel: classLevel || s.userProfile.classLevel,
        targetExam: targetExam || s.userProfile.targetExam
      }
    }));
  }

  // --- Topic Operations (Original + Upgraded) ---
  addTopic(topic) {
    const id = `topic_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
    const now = new Date().toISOString();
    const newTopic = {
      ...topic,
      id,
      createdAt: now,
      keypoints: topic.keypoints || null,
      aiGeneratedAt: topic.aiGeneratedAt || null
    };

    // Auto-generate spaced revisions: [1, 3, 7, 14, 30 days]
    const intervals = [1, 3, 7, 14, 30];
    const newRevisions = intervals.map(day => {
      const dueDate = new Date(newTopic.dateStudied || now);
      dueDate.setDate(dueDate.getDate() + day);
      return {
        id: `rev_${id}_${day}`,
        topicId: id,
        dayOffset: day,
        dueDate: dueDate.toISOString().slice(0, 10),
        status: "pending",
        completedAt: null
      };
    });

    this.update(s => ({
      ...s,
      topics: [newTopic, ...s.topics],
      revisions: [...s.revisions, ...newRevisions]
    }));

    return newTopic;
  }

  updateTopic(id, updates) {
    this.update(s => ({
      ...s,
      topics: s.topics.map(t => (t.id === id ? { ...t, ...updates } : t))
    }));
  }

  deleteTopic(id) {
    this.update(s => ({
      ...s,
      topics: s.topics.filter(t => t.id !== id),
      revisions: s.revisions.filter(r => r.topicId !== id),
      recoveries: s.recoveries.filter(rec => rec.topicId !== id),
      quizResults: s.quizResults.filter(q => q.topicId !== id)
    }));
  }

  saveKeypoints(topicId, keypoints, aiGeneratedAt = new Date().toISOString()) {
    this.update(s => ({
      ...s,
      topics: s.topics.map(t => (t.id === topicId ? { ...t, keypoints, aiGeneratedAt } : t))
    }));
  }

  // --- Revisions & Spaced Repetition ---
  completeRevision(revisionId) {
    const now = new Date().toISOString().slice(0, 10);
    this.update(s => ({
      ...s,
      revisions: s.revisions.map(r =>
        r.id === revisionId
          ? { ...r, status: "completed", completedAt: now }
          : r
      ),
      userProfile: {
        ...s.userProfile,
        points: (s.userProfile.points || 0) + 25
      }
    }));
  }

  // --- Stuckpoint Recovery ---
  saveRecovery(topicId, concept, status = "struggling", explanation = "") {
    const now = new Date().toISOString();
    this.update(s => {
      const existing = s.recoveries.find(r => r.topicId === topicId && r.concept === concept);
      if (existing) {
        return {
          ...s,
          recoveries: s.recoveries.map(r =>
            r.id === existing.id
              ? { ...r, status, recoveryExplanation: explanation || r.recoveryExplanation, updatedAt: now }
              : r
          )
        };
      }
      return {
        ...s,
        recoveries: [
          ...s.recoveries,
          {
            id: `rec_${Date.now().toString(36)}`,
            topicId,
            concept,
            status,
            quizCorrect: status === "understood",
            recoveryExplanation: explanation,
            updatedAt: now
          }
        ]
      };
    });
  }

  // --- Smart Notes Management ---
  addNote(noteData) {
    const id = `note_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
    const newNote = {
      ...noteData,
      id,
      uploadedAt: new Date().toISOString()
    };
    this.update(s => ({
      ...s,
      notes: [newNote, ...s.notes]
    }));
    return newNote;
  }

  updateNote(id, updates) {
    this.update(s => ({
      ...s,
      notes: s.notes.map(n => (n.id === id ? { ...n, ...updates } : n))
    }));
  }

  deleteNote(id) {
    this.update(s => ({
      ...s,
      notes: s.notes.filter(n => n.id !== id)
    }));
  }

  // --- Quizzes & Mock Tests ---
  saveQuizResult(result) {
    const id = `quiz_${Date.now().toString(36)}`;
    const newResult = {
      ...result,
      id,
      takenAt: new Date().toISOString()
    };
    this.update(s => ({
      ...s,
      quizResults: [newResult, ...s.quizResults],
      userProfile: {
        ...s.userProfile,
        points: (s.userProfile.points || 0) + (result.score * 10)
      }
    }));
  }

  saveMockTestResult(mockResult) {
    const id = `mock_${Date.now().toString(36)}`;
    const entry = {
      ...mockResult,
      id,
      completedAt: new Date().toISOString()
    };
    this.update(s => ({
      ...s,
      mockTestHistory: [entry, ...s.mockTestHistory],
      userProfile: {
        ...s.userProfile,
        points: (s.userProfile.points || 0) + 100
      }
    }));
    return entry;
  }

  // --- Study Planner ---
  saveStudyPlan(plan) {
    this.update(s => ({
      ...s,
      studyPlan: plan
    }));
  }

  togglePlanTask(dayIndex, taskIndex) {
    this.update(s => {
      if (!s.studyPlan || !s.studyPlan.schedule) return s;
      const schedule = JSON.parse(JSON.stringify(s.studyPlan.schedule));
      if (schedule[dayIndex] && schedule[dayIndex].tasks[taskIndex]) {
        schedule[dayIndex].tasks[taskIndex].completed = !schedule[dayIndex].tasks[taskIndex].completed;
      }
      return {
        ...s,
        studyPlan: {
          ...s.studyPlan,
          schedule
        }
      };
    });
  }

  // --- External Resources Bookmarking ---
  toggleBookmarkResource(resourceId) {
    this.update(s => {
      const exists = s.savedResources.includes(resourceId);
      return {
        ...s,
        savedResources: exists
          ? s.savedResources.filter(id => id !== resourceId)
          : [...s.savedResources, resourceId]
      };
    });
  }

  // --- Settings & Data Backup ---
  updateAiSettings(settings) {
    this.update(s => ({
      ...s,
      aiSettings: { ...s.aiSettings, ...settings }
    }));
  }

  resetDemoData() {
    const fresh = generateSeedData();
    this.update(s => ({
      ...fresh,
      userProfile: { ...s.userProfile },
      notes: [...s.notes],
      mockTestHistory: [],
      savedResources: ["res_nta_mock_abhyas", "res_jee_main_pyq_2024"],
      aiSettings: { ...s.aiSettings },
      studyPlan: null
    }));
  }

  clearAllData() {
    this.update({
      topics: [],
      revisions: [],
      recoveries: [],
      quizResults: [],
      userProfile: { ...DEFAULT_PROFILE },
      notes: [],
      mockTestHistory: [],
      savedResources: [],
      aiSettings: { ...DEFAULT_AI_SETTINGS },
      studyPlan: null,
      seeded: false
    });
  }

  exportBackupJson() {
    const dataStr = JSON.stringify(this.state, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `recallmate-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  importBackupJson(jsonString) {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed && Array.isArray(parsed.topics)) {
        this.update(parsed);
        return { success: true };
      }
      return { success: false, error: "Invalid backup format: missing topics array." };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }
}

export const store = new Store();
