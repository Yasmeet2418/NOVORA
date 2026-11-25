// NOVORA — Core Learning and Exam Preparation Platform
// "Learn. Practice. Rise."

import { store } from "./services/store.js";
import { parseUploadedFile } from "./services/fileParser.js";
import { askStudyAssistant, solveAcademicDoubt, processUploadedNotes, RESPONSE_MODES } from "./services/aiService.js";
import { searchEducationalResources } from "./services/searchService.js";
import { BOARDS, CLASS_LEVELS, CURRICULUM_DATA } from "./data/curriculumData.js";
import { EXAMS_REGISTRY, EXAM_CATEGORIES } from "./data/examData.js";
import { RADAR_EXAMS } from "./data/radarData.js";
import { PYQ_INTELLIGENCE_DATA } from "./data/pyqData.js";
import { VERIFIED_RESOURCES, RESOURCE_TYPES } from "./data/resourcesData.js";
import { REALISTIC_MOCK_BANKS } from "./data/mockTestData.js";
import { createJeeMainMockForm } from "./data/jeeMainPracticeBank.js";
import {
  getAuthSession,
  loadUserData,
  loadUserProfile,
  saveUserData,
  saveUserProfile,
  signInWithPassword,
  signOut,
  signUpWithPassword
} from "./services/supabaseService.js";

// Global App State
let currentRoute = window.location.hash.slice(1) || "/";
let activeMockTest = null;
let mockTimerInterval = null;
let searchDebounce = null;
let authSession = null;
let authReady = false;
let cloudReady = false;
let authMode = "signin";
let authLoading = false;
let cloudRetrying = false;
let authMessage = "";
let cloudSyncError = "";
let cloudSyncTimer = null;
let assistantConversation = [];
let assistantLoading = false;

// Initialize App
window.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initRouter();
  initGlobalEvents();
  store.subscribe((state) => {
    if (authSession && authReady && cloudReady) scheduleCloudSync(state);
    // Re-render when state changes if not actively taking a timed test
    if (authReady && !activeMockTest) {
      renderApp();
    }
  });
  initializeAuthentication();
});

async function initializeAuthentication() {
  try {
    const session = await getAuthSession();
    if (session) {
      await connectAuthenticatedSession(session);
      return;
    }
  } catch (error) {
    console.error("Could not restore the Supabase session:", error);
    authMessage = `Could not connect to your account: ${getAuthenticationErrorMessage(error)}`;
    authSession = null;
    cloudReady = false;
  }
  authReady = true;
  renderApp();
}

async function connectAuthenticatedSession(session) {
  authSession = session;
  authReady = false;
  cloudReady = false;

  try {
    const cloudState = await loadUserData(session);
    const cloudProfile = await loadUserProfile(session);
    store.switchAccount(session.user.id, cloudState, session.user);
    const profileChanged = applyCloudProfile(cloudProfile);
    if (!cloudProfile) await saveUserProfile(session, store.get().userProfile);
    cloudReady = true;
    cloudSyncError = "";
    renderApp();
    if (!cloudState || !cloudProfile || profileChanged) scheduleCloudSync(store.get());
    return true;
  } catch (error) {
    console.error("Could not load account data:", error);
    authReady = true;
    if (!error.message.startsWith("Could not reach Supabase (")) {
      authSession = null;
      cloudSyncError = "";
      authMessage = getAuthenticationErrorMessage(error);
      renderApp();
      return false;
    }

    cloudSyncError = `Your account is signed in, but cloud data could not be loaded. ${error.message}`;
    renderApp();
    return false;
  }
}

function scheduleCloudSync(state) {
  if (!cloudReady) return;
  if (cloudSyncTimer) clearTimeout(cloudSyncTimer);
  cloudSyncTimer = setTimeout(async () => {
    try {
      const currentSession = await getAuthSession();
      if (!currentSession || currentSession.user.id !== authSession?.user.id) return;
      authSession = currentSession;
      const cloudData = JSON.parse(JSON.stringify(state));
      if (cloudData.aiSettings) {
        cloudData.aiSettings.geminiApiKey = "";
        cloudData.aiSettings.searchApiKey = "";
        cloudData.aiSettings.searchEngineCx = "";
      }
      await saveUserData(currentSession, cloudData);
      await saveUserProfile(currentSession, state.userProfile || {});
      cloudSyncError = "";
      const status = document.getElementById("cloud-sync-status");
      if (status) status.textContent = "Your account data is synced.";
    } catch (error) {
      console.error("Could not sync account data:", error);
      cloudSyncError = `Cloud sync failed: ${error.message}`;
      const status = document.getElementById("cloud-sync-status");
      if (status) status.textContent = cloudSyncError;
    }
  }, 700);
}

function applyCloudProfile(profileRow) {
  if (!profileRow) return false;
  const current = store.get().userProfile || {};
  const savedHours = Number(profileRow.daily_target_hours);
  const profile = {
    name: profileRow.full_name || current.name || "Student",
    classLevel: profileRow.class_level || current.classLevel || "Class 10",
    targetExam: profileRow.target_exam || current.targetExam || "jee-main",
    dailyTargetHours: Number.isFinite(savedHours) && savedHours > 0
      ? savedHours
      : current.dailyTargetHours || 3.5
  };
  const changed = Object.keys(profile).some(key => current[key] !== profile[key]);
  if (changed) store.updateProfile(profile);
  return changed;
}

function getAuthenticationErrorMessage(error) {
  const message = error?.message || "Could not authenticate. Please try again.";
  if (message.toLowerCase().includes("profiles")) {
    return `Profile storage is not set up yet. Run supabase/schema.sql in the Supabase SQL Editor, then try again. Details: ${message}`;
  }
  return message;
}

function renderAuthenticationView() {
  if (!authReady) {
    return `<main class="auth-loading">Connecting to NOVORA...</main>`;
  }

  const isSignUp = authMode === "signup";
  const escapedMessage = escapeHtml(authMessage);
  return `
    <main class="auth-page">
      <div class="auth-shell">
        <section class="auth-story" aria-label="About NOVORA">
          <a class="auth-brand" href="#/" aria-label="NOVORA home">
            <span class="auth-brand-mark" aria-hidden="true">N</span>
            <span>NOVORA</span>
          </a>
          <div class="auth-story-content">
            <span class="auth-eyebrow">YOUR PERSONAL LEARNING COPILOT</span>
            <h1>Understand more.<br>Stress less.</h1>
            <p class="auth-story-description">A calmer way to learn, practise, and prepare. Get step-by-step help from your AI study partner and keep your progress in one place.</p>
            <div class="auth-feature-list">
              <div><span class="auth-feature-icon" aria-hidden="true">✦</span><span>Ask study questions and get clear, guided explanations</span></div>
              <div><span class="auth-feature-icon" aria-hidden="true">✓</span><span>Practise with mock tests built around your goals</span></div>
              <div><span class="auth-feature-icon" aria-hidden="true">↗</span><span>Pick up where you left off on any device</span></div>
            </div>
            <div class="auth-demo-card" aria-label="Example AI tutor conversation">
              <div class="auth-demo-heading"><span class="auth-demo-avatar">✦</span><span>MEET YOUR STUDY PARTNER</span></div>
              <div class="auth-demo-question">Can you explain a tough topic in simple steps?</div>
              <div class="auth-demo-answer"><span class="auth-demo-sparkle" aria-hidden="true">✦</span><span>Absolutely. I’ll break it down, show the reasoning, and help you check your understanding.</span></div>
            </div>
          </div>
          <p class="auth-story-footer">Built for curious minds and ambitious goals.</p>
        </section>

        <section class="auth-panel" aria-labelledby="auth-title">
          <div class="auth-panel-mobile-brand" aria-hidden="true"><span class="auth-brand-mark">N</span><span>NOVORA</span></div>
          <div class="auth-panel-intro">
            <span class="auth-panel-eyebrow">${isSignUp ? "START YOUR JOURNEY" : "WELCOME BACK"}</span>
            <h2 id="auth-title">${isSignUp ? "Create your account" : "Sign in to NOVORA"}</h2>
            <p>${isSignUp ? "Save your learning progress and make a plan that fits you." : "Your study space is ready when you are."}</p>
          </div>
          ${authMessage ? `<div class="auth-alert" role="alert">${escapedMessage}</div>` : ""}
          <form class="auth-form" onsubmit="window.RecallMateApp.submitAuthentication(event)">
          ${isSignUp ? `
            <div class="auth-field">
              <label for="auth-name">Your name</label>
              <input class="auth-input" id="auth-name" name="name" autocomplete="name" required maxlength="80" placeholder="How should we address you?">
            </div>
          ` : ""}
            <div class="auth-field">
              <label for="auth-email">Email address</label>
              <input class="auth-input" id="auth-email" name="email" type="email" autocomplete="email" required placeholder="you@example.com">
            </div>
            <div class="auth-field">
              <label for="auth-password">Password</label>
              <input class="auth-input" id="auth-password" name="password" type="password" autocomplete="${isSignUp ? "new-password" : "current-password"}" minlength="${isSignUp ? "8" : "1"}" required placeholder="${isSignUp ? "At least 8 characters" : "Enter your password"}">
            </div>
            <button type="submit" class="btn btn-primary auth-submit" ${authLoading ? "disabled" : ""}>${authLoading ? "Please wait..." : (isSignUp ? "Create my account" : "Sign in")}<span aria-hidden="true">→</span></button>
          </form>
          <p class="auth-switch">
            ${isSignUp ? "Already have an account?" : "New to NOVORA?"}
            <button type="button" class="auth-toggle-btn" onclick="window.RecallMateApp.setAuthenticationMode('${isSignUp ? "signin" : "signup"}')">${isSignUp ? "Sign in" : "Create a free account"}</button>
          </p>
          <p class="auth-privacy-note">Your account keeps your learning progress private and synced.</p>
        </section>
      </div>
    </main>
  `;
}

function renderCloudConnectionView() {
  return `
    <main class="auth-page">
      <div class="auth-shell">
        <section class="auth-story" aria-label="About NOVORA">
          <a class="auth-brand" href="#/" aria-label="NOVORA home">
            <span class="auth-brand-mark" aria-hidden="true">N</span>
            <span>NOVORA</span>
          </a>
          <div class="auth-story-content">
            <span class="auth-eyebrow">YOUR PERSONAL LEARNING COPILOT</span>
            <h1>Understand more.<br>Stress less.</h1>
            <p class="auth-story-description">Your account is signed in. NOVORA is waiting for a connection to load your private learning data.</p>
          </div>
        </section>
        <section class="auth-panel" aria-labelledby="cloud-connection-title">
          <div class="auth-panel-mobile-brand" aria-hidden="true"><span class="auth-brand-mark">N</span><span>NOVORA</span></div>
          <div class="auth-panel-intro">
            <span class="auth-panel-eyebrow">ACCOUNT SIGNED IN</span>
            <h2 id="cloud-connection-title">Cloud data unavailable</h2>
            <p>Your account is signed in, but your learning data has not loaded. No cloud data will be overwritten while this connection is unavailable.</p>
          </div>
          <div class="auth-alert" role="alert">${escapeHtml(cloudSyncError)}</div>
          <button type="button" class="btn btn-primary auth-submit" onclick="window.RecallMateApp.retryCloudConnection()" ${cloudRetrying ? "disabled" : ""}>
            ${cloudRetrying ? "Retrying..." : "Retry connection"}
          </button>
          <button type="button" class="btn btn-secondary auth-submit" onclick="window.RecallMateApp.logout()">Log out</button>
        </section>
      </div>
    </main>
  `;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[char]);
}

function renderNavigationMenu(currentPath, state) {
  const groups = [
    {
      title: "Learn",
      items: [
        ["📊", "Dashboard", "/", currentPath === "/"],
        ["🤖", "AI Study Assistant", "/assistant", currentPath === "/assistant"],
        ["🏫", "Classes 6–12", "/classes", currentPath.startsWith("/classes")],
        ["📁", `Smart Notes (${state.notes.length})`, "/notes", currentPath.startsWith("/notes") || currentPath === "/add"]
      ]
    },
    {
      title: "Prepare",
      items: [
        ["🎯", "Exam Hub", "/exams", currentPath.startsWith("/exams")],
        ["⏱️", "Mock Tests", "/mock-test", currentPath === "/mock-test"],
        ["📡", "Priority Radar", "/radar", currentPath === "/radar"],
        ["🔄", "PYQ Intelligence", "/pyq-intelligence", currentPath === "/pyq-intelligence"]
      ]
    },
    {
      title: "Tools",
      items: [
        ["❓", "AI Doubt Solver", "/doubts", currentPath === "/doubts"],
        ["📅", "Study Planner", "/planner", currentPath === "/planner"],
        ["🛟", `Stuckpoint Recovery (${state.recoveries.filter(item => item.status === "struggling").length})`, "/recovery", currentPath === "/recovery"],
        ["🌐", "External Resources", "/resources", currentPath === "/resources"],
        ["📈", "Performance & Retention", "/analytics", ["/analytics", "/progress", "/memory"].includes(currentPath)],
        ["⚙️", "Settings", "/settings", currentPath === "/settings"]
      ]
    }
  ];

  return `
    <details class="nav-dropdown" id="primary-menu">
      <summary class="nav-menu-trigger" aria-label="Open navigation menu">
        <span aria-hidden="true">☰</span><span>Menu</span><span class="nav-menu-chevron" aria-hidden="true">▾</span>
      </summary>
      <div class="nav-menu-panel">
        ${groups.map(group => `
          <div class="nav-menu-group">
            <div class="nav-menu-heading">${group.title}</div>
            ${group.items.map(([icon, label, href, active]) => `
              <a class="nav-menu-link ${active ? "active" : ""}" href="#${href}" onclick="this.closest('details').removeAttribute('open')">
                <span aria-hidden="true">${icon}</span><span>${label}</span>
              </a>
            `).join("")}
          </div>
        `).join("")}
      </div>
    </details>
  `;
}

function initTheme() {
  const savedTheme = localStorage.getItem("recallmate:theme") || "light";
  document.documentElement.setAttribute("data-theme", savedTheme);
}

function toggleTheme() {
  const current = document.documentElement.getAttribute("data-theme") || "light";
  const next = current === "light" ? "dark" : "light";
  document.documentElement.setAttribute("data-theme", next);
  localStorage.setItem("recallmate:theme", next);
  renderApp();
}

function initRouter() {
  window.addEventListener("hashchange", () => {
    currentRoute = window.location.hash.slice(1) || "/";
    renderApp();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

function initGlobalEvents() {
  // Global Shortcut: Cmd/Ctrl + K to open search
  window.addEventListener("keydown", (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "k") {
      e.preventDefault();
      openSearchModal();
    }
    if (e.key === "Escape") {
      closeModals();
    }
    if (e.key === "Enter" && !e.shiftKey && e.target?.id === "study-query-input") {
      e.preventDefault();
      e.target.closest("form")?.requestSubmit();
    }
  });
}

// Main Render Function
export function renderApp() {
  const root = document.getElementById("root");
  if (!root) return;
  if (!authReady) {
    root.innerHTML = renderAuthenticationView();
    return;
  }
  if (!authSession) {
    root.innerHTML = renderAuthenticationView();
    return;
  }
  if (!cloudReady) {
    root.innerHTML = renderCloudConnectionView();
    return;
  }

  const state = store.get();
  const profile = state.userProfile || {};
  const currentPath = currentRoute.split("?")[0];

  root.innerHTML = `
    <div class="app-container">
      <!-- Main Wrapper -->
      <div class="main-wrapper">
        <!-- Top Navigation Bar -->
        <header class="topbar">
          <div class="topbar-left">
            <a href="#/" class="header-brand" aria-label="NOVORA home">
              <span class="header-brand-mark" aria-hidden="true">N</span>
              <span class="header-brand-name">NOVORA</span>
            </a>
            <button class="global-search-btn" onclick="window.RecallMateApp.openSearchModal()">
              <span aria-hidden="true">🔍</span>
              <span class="search-label">Search topics, PYQs, syllabi...</span>
              <kbd class="search-kbd">Ctrl K</kbd>
            </button>
          </div>

          <div class="topbar-right">
            ${renderNavigationMenu(currentPath, state)}
            <!-- Goal Switcher Pill -->
            <button class="goal-switcher-btn" onclick="window.RecallMateApp.openGoalSwitcher()">
              <span>🎯 ${profile.classLevel} • ${profile.targetExam ? profile.targetExam.replace("-", " ").toUpperCase() : "General"}</span>
              <span style="font-size: 0.7rem;">▼</span>
            </button>

            <!-- Dark / Light Theme Toggle -->
            <button class="icon-btn" title="Toggle Dark/Light Mode" onclick="window.RecallMateApp.toggleTheme()">
              ${document.documentElement.getAttribute("data-theme") === "dark" ? "☀️" : "🌙"}
            </button>

            <!-- Notifications Button -->
            <button class="icon-btn" title="Notifications" onclick="window.RecallMateApp.openNotificationsModal()">
              🔔
              ${getRevisionsDueToday().length > 0 ? `<span class="notif-badge-dot"></span>` : ""}
            </button>

            <!-- User Profile Pill -->
            <div class="user-profile-pill" onclick="window.RecallMateApp.openProfileModal()">
              <div class="user-avatar-circle">${profile.avatar || "🎓"}</div>
              <span style="font-size: 0.825rem; font-weight: 600;">🔥 ${profile.studyStreak || 1}d</span>
            </div>
            <button class="btn btn-secondary btn-sm" onclick="window.RecallMateApp.logout()">Log out</button>
          </div>
        </header>

        <!-- Route Content Container -->
        <main class="content-container">
          <div id="cloud-sync-status" role="status" style="margin-bottom:12px;font-size:.8rem;color:var(--text-muted);">${cloudSyncError || "Your account data syncs automatically."}</div>
          ${renderCurrentRoute(currentPath, state)}
        </main>
      </div>
    </div>

    <!-- Modals Container -->
    <div id="modal-container"></div>
  `;
}

// Router Dispatcher
function renderCurrentRoute(path, state) {
  if (path === "/" || path === "") {
    return renderDashboardView(state);
  } else if (path === "/assistant") {
    return renderAssistantView(state);
  } else if (path.startsWith("/classes")) {
    return renderClassesView(path, state);
  } else if (path.startsWith("/notes") || path === "/add") {
    return renderNotesView(path, state);
  } else if (path.startsWith("/exams")) {
    return renderExamsView(path, state);
  } else if (path === "/mock-test") {
    return renderMockTestView(state);
  } else if (path === "/radar") {
    return renderRadarView(state);
  } else if (path === "/pyq-intelligence") {
    return renderPyqIntelligenceView(state);
  } else if (path === "/doubts") {
    return renderDoubtsView(state);
  } else if (path === "/planner") {
    return renderPlannerView(state);
  } else if (path === "/recovery") {
    return renderRecoveryView(state);
  } else if (path === "/resources") {
    return renderResourcesView(state);
  } else if (path === "/analytics" || path === "/progress" || path === "/memory") {
    return renderAnalyticsView(state);
  } else if (path === "/settings") {
    return renderSettingsView(state);
  } else {
    return `<div class="card" style="text-align: center; padding: 48px;">
      <h2>404 - Page Not Found</h2>
      <p style="margin-top: 8px; color: var(--text-secondary);">The page you requested does not exist.</p>
      <a href="#/" class="btn btn-primary" style="margin-top: 16px;">Return to Dashboard</a>
    </div>`;
  }
}

// --- 1. Complete Dashboard View ---
function renderDashboardView(state) {
  const profile = state.userProfile || {};
  const revisionsDue = getRevisionsDueToday();
  const topics = state.topics || [];
  const completedTopics = topics.filter(t => t.understanding === "solid").length;
  const strugglingCount = state.recoveries.filter(r => r.status === "struggling").length;
  const recentNotes = state.notes.slice(0, 3);

  // Calculate overall quiz accuracy
  let totalScore = 0;
  let totalMax = 0;
  state.quizResults.forEach(q => {
    totalScore += q.score || 0;
    totalMax += q.total || 0;
  });
  const accuracyPct = totalMax > 0 ? Math.round((totalScore / totalMax) * 100) : 84;

  return `
    <div class="page-header" style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 16px;">
      <div>
        <h1 class="page-title">Welcome back, ${escapeHtml(profile.name || "Student")}! 👋</h1>
        <p class="page-subtitle">Target: <strong>${profile.classLevel}</strong> &bull; Goal: <strong>${profile.targetExam ? profile.targetExam.toUpperCase() : "Board Exams"}</strong></p>
      </div>
      <div style="display: flex; gap: 10px;">
        <a href="#/assistant" class="btn btn-primary">⚡ Ask AI Assistant</a>
        <a href="#/mock-test" class="btn btn-outline">⏱️ Take Mock Test</a>
      </div>
    </div>

    <!-- Metrics Row -->
    <div class="metrics-grid">
      <div class="card metric-card">
        <div class="metric-icon-box" style="background: rgba(19, 134, 95, 0.15); color: var(--lavender-500);">⏳</div>
        <div>
          <div class="metric-val">2.8 / ${profile.dailyTargetHours || 3.5}h</div>
          <div class="metric-label">Daily Study Progress</div>
        </div>
      </div>
      <div class="card metric-card">
        <div class="metric-icon-box" style="background: rgba(16, 185, 129, 0.15); color: var(--accent-emerald);">📚</div>
        <div>
          <div class="metric-val">${topics.length}</div>
          <div class="metric-label">Topics Tracked (${completedTopics} Mastered)</div>
        </div>
      </div>
      <div class="card metric-card">
        <div class="metric-icon-box" style="background: rgba(245, 158, 11, 0.15); color: var(--accent-amber);">🔔</div>
        <div>
          <div class="metric-val">${revisionsDue.length} Due</div>
          <div class="metric-label">Revisions Due Today</div>
        </div>
      </div>
      <div class="card metric-card">
        <div class="metric-icon-box" style="background: rgba(2, 132, 199, 0.15); color: var(--accent-cyan);">🎯</div>
        <div>
          <div class="metric-val">${accuracyPct}%</div>
          <div class="metric-label">Quiz & Mock Accuracy</div>
        </div>
      </div>
    </div>

    <!-- AI Study Recommendation Section -->
    <div class="card" style="margin-bottom: 24px; background: linear-gradient(135deg, rgba(19, 134, 95, 0.1) 0%, rgba(20, 125, 145, 0.05) 100%); border-color: var(--lavender-200);">
      <div style="display: flex; align-items: flex-start; gap: 16px;">
        <span style="font-size: 2rem;">💡</span>
        <div style="flex: 1;">
          <h3 style="font-size: 1.05rem; font-weight: 700; color: var(--lavender-600);">Personalized AI Study Recommendation</h3>
          <p style="margin-top: 6px; font-size: 0.9rem; line-height: 1.5; color: var(--text-primary);">
            Based on your recent struggles in <strong>Electromagnetic Induction</strong> and historical ${profile.targetExam ? profile.targetExam.toUpperCase() : "JEE"} weightage patterns, you have an estimated 2.7 questions expected from this chapter. We recommend reviewing motional EMF and practicing 5 PYQs today.
          </p>
          <div style="margin-top: 12px; display: flex; gap: 10px; flex-wrap: wrap;">
            <a href="#/recovery" class="btn btn-primary btn-sm">🛟 Open Stuckpoint Recovery (${strugglingCount} issues)</a>
            <a href="#/radar" class="btn btn-secondary btn-sm">📡 View High-Weightage Chapters</a>
          </div>
        </div>
      </div>
    </div>

    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 24px; margin-bottom: 24px;">
      <!-- Revisions Due Today Card -->
      <div class="card">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
          <h3 style="font-size: 1.05rem; font-weight: 700;">🔔 Revisions Due Today</h3>
          <a href="#/planner" style="font-size: 0.8rem; color: var(--lavender-600); text-decoration: none; font-weight: 600;">Planner &rarr;</a>
        </div>
        ${revisionsDue.length === 0 ? `
          <div style="text-align: center; padding: 24px; color: var(--text-muted); font-size: 0.875rem;">
            🎉 All caught up! No spaced repetitions pending for today.
          </div>
        ` : `
          <div style="display: flex; flex-direction: column; gap: 10px;">
            ${revisionsDue.slice(0, 4).map(rev => {
              const topic = topics.find(t => t.id === rev.topicId);
              return `
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px; background: var(--bg-surface-subtle); border-radius: 10px;">
                  <div>
                    <div style="font-weight: 600; font-size: 0.9rem;">${topic ? topic.name : "Study Topic"}</div>
                    <div style="font-size: 0.75rem; color: var(--text-muted);">${topic ? topic.subject : "Subject"} &bull; Day ${rev.dayOffset} Spaced Review</div>
                  </div>
                  <button class="btn btn-primary btn-sm" onclick="window.RecallMateApp.completeRevisionItem('${rev.id}')">✓ Mark Done</button>
                </div>
              `;
            }).join("")}
          </div>
        `}
      </div>

      <!-- Upcoming Examination Calendar -->
      <div class="card">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
          <h3 style="font-size: 1.05rem; font-weight: 700;">📅 Upcoming Examination Dates</h3>
          <span style="font-size: 0.75rem; color: var(--text-muted);">Official Schedules</span>
        </div>
        <div style="display: flex; flex-direction: column; gap: 10px;">
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 12px; background: var(--bg-surface-subtle); border-radius: 8px;">
            <div>
              <div style="font-weight: 600; font-size: 0.875rem;">JEE Main 2026 (Session 1)</div>
              <div style="font-size: 0.75rem; color: var(--text-muted);">NTA Computer Based Test</div>
            </div>
            <span class="nav-item-badge badge-purple">Jan 22–31</span>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 12px; background: var(--bg-surface-subtle); border-radius: 8px;">
            <div>
              <div style="font-weight: 600; font-size: 0.875rem;">NEET UG 2026</div>
              <div style="font-size: 0.75rem; color: var(--text-muted);">Pen & Paper Medical Entrance</div>
            </div>
            <span class="nav-item-badge badge-amber">May 3, 2026</span>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 12px; background: var(--bg-surface-subtle); border-radius: 8px;">
            <div>
              <div style="font-weight: 600; font-size: 0.875rem;">NDA & NA I 2026</div>
              <div style="font-size: 0.75rem; color: var(--text-muted);">UPSC Defence Entrance</div>
            </div>
            <span class="nav-item-badge badge-purple">Apr 19, 2026</span>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 12px; background: var(--bg-surface-subtle); border-radius: 8px;">
            <div>
              <div style="font-weight: 600; font-size: 0.875rem;">CBSE Board Class 10/12</div>
              <div style="font-size: 0.75rem; color: var(--text-muted);">Theory Board Examinations</div>
            </div>
            <span class="nav-item-badge badge-amber">Feb 15–Apr 4</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Recently Uploaded Notes Section -->
    <div class="card">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
        <h3 style="font-size: 1.05rem; font-weight: 700;">📁 Recently Processed Notes</h3>
        <a href="#/notes" class="btn btn-secondary btn-sm">+ Upload Notes</a>
      </div>
      ${recentNotes.length === 0 ? `
        <div style="text-align: center; padding: 24px; color: var(--text-muted); font-size: 0.875rem;">
          No notes uploaded yet. Upload a PDF, DOCX, TXT or photo of your notes to generate summaries & quizzes.
        </div>
      ` : `
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 14px;">
          ${recentNotes.map(n => `
            <div style="padding: 14px; background: var(--bg-surface-subtle); border-radius: 10px; border: 1px solid var(--border-subtle);">
              <div style="font-weight: 600; font-size: 0.9rem; margin-bottom: 4px;">${n.title}</div>
              <div style="font-size: 0.75rem; color: var(--text-muted); margin-bottom: 10px;">${n.subject || "General"} &bull; ${n.wordCount || 100} words</div>
              <a href="#/notes" class="btn btn-outline btn-sm" style="width: 100%;">View Flashcards & MCQs</a>
            </div>
          `).join("")}
        </div>
      `}
    </div>
  `;
}

// --- 2. AI Study Assistant – Ask Anything View ---
function renderAssistantTranscript() {
  if (assistantConversation.length === 0) {
    return `
      <div class="assistant-welcome">
        <div class="assistant-welcome-mark" aria-hidden="true">✦</div>
        <h3>What are you learning today?</h3>
        <p>Ask a question, share what you’re stuck on, or try one of the suggested prompts. Follow up naturally to go deeper.</p>
      </div>
    `;
  }

  return assistantConversation.map(message => {
    const isUser = message.sender === "user";
    const sources = (message.sources || []).map(source => {
      try {
        const url = new URL(source.url);
        if (url.protocol !== "https:" && url.protocol !== "http:") return "";
        return `<a href="${escapeHtml(url.href)}" target="_blank" rel="noopener noreferrer">${escapeHtml(source.title || source.sourceName || url.hostname)} ↗</a>`;
      } catch {
        return "";
      }
    }).join("");

    return `
      <article class="chat-message ${isUser ? "chat-message-user" : "chat-message-assistant"}">
        <div class="chat-message-avatar" aria-hidden="true">${isUser ? "You" : "N"}</div>
        <div class="chat-message-body">
          <div class="chat-message-label">${isUser ? "You" : "NOVORA"}${message.pending ? " · thinking" : ""}</div>
          ${message.text
            ? `<div class="chat-bubble ${message.error ? "chat-bubble-error" : ""}">${escapeHtml(message.text)}</div>`
            : `<div class="chat-bubble chat-bubble-pending"><span class="chat-thinking-dots" aria-hidden="true"><i></i><i></i><i></i></span><span>Working through your question…</span></div>`
          }
          ${sources ? `<div class="chat-sources"><span>Sources</span>${sources}</div>` : ""}
        </div>
      </article>
    `;
  }).join("");
}

function renderAssistantView(state) {
  const profile = state.userProfile || {};

  return `
    <div class="page-header assistant-page-header">
      <div>
        <span class="assistant-page-eyebrow">YOUR PERSONAL AI TUTOR</span>
        <h1 class="page-title">Ask NOVORA</h1>
        <p class="page-subtitle">Clear, step-by-step study help for ${escapeHtml(profile.classLevel || "your class")} and ${escapeHtml(profile.targetExam ? profile.targetExam.toUpperCase() : "your goals")}.</p>
      </div>
      <button type="button" class="btn btn-secondary assistant-new-chat" onclick="window.RecallMateApp.clearAssistantConversation()" ${assistantLoading ? "disabled" : ""}>＋ New chat</button>
    </div>

    <div class="assistant-layout">
      <aside class="assistant-rail">
        <section class="card assistant-rail-card">
          <div class="assistant-rail-brand">
            <span class="assistant-rail-mark" aria-hidden="true">✦</span>
            <div><h2>Study with NOVORA</h2><p>Ask follow-up questions anytime.</p></div>
          </div>
          <div class="assistant-context-pill"><span aria-hidden="true">◎</span> ${escapeHtml(profile.classLevel || "Student")} · ${escapeHtml(profile.targetExam ? profile.targetExam.toUpperCase() : "General")}</div>
        </section>

        <section class="card assistant-rail-card">
          <h3 class="assistant-rail-title">Try a question</h3>
          <div class="assistant-prompt-list">
            <button type="button" class="assistant-prompt" onclick="window.RecallMateApp.askQuickTopic('Explain the quadratic formula and show how to use it with an example.')"><span>📐</span><span>Explain the quadratic formula</span><span aria-hidden="true">→</span></button>
            <button type="button" class="assistant-prompt" onclick="window.RecallMateApp.askQuickTopic('Explain Faraday’s law and Lenz’s law with a simple example.')"><span>⚡</span><span>Make sense of Faraday’s law</span><span aria-hidden="true">→</span></button>
            <button type="button" class="assistant-prompt" onclick="window.RecallMateApp.askQuickTopic('Explain photosynthesis step by step and where the oxygen comes from.')"><span>🌿</span><span>How does photosynthesis work?</span><span aria-hidden="true">→</span></button>
          </div>
        </section>

        <details class="card assistant-settings" open>
          <summary>Response settings</summary>
          <label for="assistant-depth">Answer level</label>
          <select id="assistant-depth">
            <option value="beginner">Simple foundations</option>
            <option value="intermediate" selected>School level</option>
            <option value="board">Board exam</option>
            <option value="competitive">Competitive exam</option>
          </select>
          <label for="assistant-language">Answer language</label>
          <select id="assistant-language">
            <option value="en">English</option>
            <option value="hinglish">Hinglish</option>
            <option value="hi">Hindi</option>
          </select>
          <label>Answer style</label>
          <div id="mode-selector" class="assistant-mode-list">
            ${RESPONSE_MODES.map((mode, index) => `
              <button
                type="button"
                class="btn btn-sm ${index === 1 ? "btn-primary" : "btn-secondary"}"
                onclick="window.RecallMateApp.selectResponseMode('${mode.id}', this)"
                data-mode="${mode.id}"
              >${escapeHtml(mode.name)}</button>
            `).join("")}
          </div>
        </details>
      </aside>

      <section class="assistant-chat">
        <header class="assistant-chat-header">
          <div class="assistant-chat-avatar" aria-hidden="true">✦</div>
          <div><h2>Study chat</h2><p>Ask anything. Your follow-ups stay in context.</p></div>
        </header>
        <div id="assistant-output-container" class="assistant-transcript" role="log" aria-live="polite" aria-relevant="additions text">
          ${renderAssistantTranscript()}
        </div>
        <form class="assistant-composer" onsubmit="window.RecallMateApp.submitStudyQuestion(event)">
          <label class="sr-only" for="study-query-input">Your question</label>
          <textarea id="study-query-input" rows="2" maxlength="4000" placeholder="Ask NOVORA anything you’re studying…" required ${assistantLoading ? "disabled" : ""}></textarea>
          <div class="assistant-composer-footer">
            <span>Enter to send · Shift + Enter for a new line</span>
            <button type="submit" class="btn btn-primary" ${assistantLoading ? "disabled" : ""}><span>${assistantLoading ? "Thinking..." : "Send"}</span><span aria-hidden="true">↑</span></button>
          </div>
        </form>
        <p class="assistant-disclaimer">AI can make mistakes. Double-check important facts and exam instructions.</p>
      </section>
    </div>
  `;
}

// --- 3. Classes 6–12 Learning View ---
function renderClassesView(path, state) {
  const parts = path.split("/").filter(Boolean);
  const selectedClass = parts[1] || "class-10";
  const classData = CURRICULUM_DATA[selectedClass] || CURRICULUM_DATA["class-10"];

  return `
    <div class="page-header">
      <h1 class="page-title">Class-Wise Curriculum & Practice</h1>
      <p class="page-subtitle">Chapter-wise key points, definitions, formula sheets, practice questions, and MCQ quizzes.</p>
    </div>

    <!-- Class Selector Tabs -->
    <div style="display: flex; gap: 8px; overflow-x: auto; padding-bottom: 12px; margin-bottom: 20px;">
      ${CLASS_LEVELS.map(c => `
        <a
          href="#/classes/${c.id}"
          class="btn btn-sm ${c.id === selectedClass ? "btn-primary" : "btn-secondary"}"
          style="white-space: nowrap;"
        >
          ${c.label}
        </a>
      `).join("")}
    </div>

    <!-- Curriculum Subjects & Chapters -->
    <div style="display: grid; gap: 24px;">
      ${classData.subjects.map(subj => `
        <div class="card">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; border-bottom: 1px solid var(--border-subtle); padding-bottom: 12px;">
            <div style="display: flex; align-items: center; gap: 10px;">
              <span style="font-size: 1.5rem;">📖</span>
              <div>
                <h2 style="font-size: 1.25rem; font-weight: 700;">${subj.name}</h2>
                <span style="font-size: 0.75rem; color: var(--text-muted);">${subj.chapters.length} Chapters Available</span>
              </div>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 16px;">
            ${subj.chapters.map(ch => `
              <div style="border: 1px solid var(--border-subtle); border-radius: 12px; padding: 16px; background: var(--bg-surface-subtle);">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
                  <span class="nav-item-badge badge-purple">Chapter ${ch.number}</span>
                  <span style="font-size: 0.75rem; color: var(--text-muted);">${ch.mcqQuiz.length} Quizzes</span>
                </div>
                <h3 style="font-size: 1rem; font-weight: 700; margin-bottom: 8px;">${ch.title}</h3>
                <p style="font-size: 0.8rem; color: var(--text-secondary); line-height: 1.4; margin-bottom: 12px;">${ch.summary}</p>

                <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                  <button class="btn btn-secondary btn-sm" onclick="window.RecallMateApp.viewChapterModal('${selectedClass}', '${subj.id}', '${ch.id}')">View Notes & Formulas</button>
                  <button class="btn btn-primary btn-sm" onclick="window.RecallMateApp.startChapterQuiz('${selectedClass}', '${subj.id}', '${ch.id}')">Take MCQ Quiz</button>
                </div>
              </div>
            `).join("")}
          </div>
        </div>
      `).join("")}
    </div>
  `;
}

// --- 4. Smart Notes & File Upload System ---
function renderNotesView(path, state) {
  const notes = state.notes || [];

  return `
    <div class="page-header" style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 16px;">
      <div>
        <h1 class="page-title">Smart Notes & Document AI</h1>
        <p class="page-subtitle">Upload PDFs, DOCX, text notes, or photos of your handwritten notes to generate 10 structured revision outputs.</p>
      </div>
      <button class="btn btn-primary" onclick="window.RecallMateApp.openAddNoteModal()">+ Add or Upload Note</button>
    </div>

    <!-- Notes List -->
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 20px;">
      ${notes.map(note => `
        <div class="card card-hover">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px;">
            <span class="nav-item-badge badge-purple">${note.subject || "General"}</span>
            <span style="font-size: 0.75rem; color: var(--text-muted);">${new Date(note.uploadedAt).toLocaleDateString()}</span>
          </div>
          <h3 style="font-size: 1.05rem; font-weight: 700; margin-bottom: 6px;">${note.title}</h3>
          <p style="font-size: 0.825rem; color: var(--text-secondary); margin-bottom: 14px; line-height: 1.4;">
            ${note.contentText.slice(0, 140)}...
          </p>

          <div style="display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 14px;">
            <span style="font-size: 0.72rem; padding: 2px 8px; background: var(--bg-surface-subtle); border-radius: 4px;">🗂️ ${note.fileType ? note.fileType.toUpperCase() : "TXT"}</span>
            <span style="font-size: 0.72rem; padding: 2px 8px; background: var(--bg-surface-subtle); border-radius: 4px;">📝 ${note.wordCount || 100} words</span>
            ${note.aiOutputs ? `<span style="font-size: 0.72rem; padding: 2px 8px; background: rgba(19, 134, 95, 0.15); color: var(--lavender-500); border-radius: 4px;">✨ 10 AI Outputs Ready</span>` : ""}
          </div>

          <div style="display: flex; gap: 8px;">
            <button class="btn btn-primary btn-sm" style="flex: 1;" onclick="window.RecallMateApp.openNoteDetailModal('${note.id}')">Explore AI Outputs</button>
            <button class="btn btn-secondary btn-sm" onclick="window.RecallMateApp.deleteNoteItem('${note.id}')">🗑️</button>
          </div>
        </div>
      `).join("")}
    </div>
  `;
}

// --- 5. Competitive Examination Center ---
function renderExamsView(path, state) {
  const parts = path.split("/").filter(Boolean);
  const selectedExamId = parts[1] || state.userProfile.targetExam || "jee-main";
  const exam = EXAMS_REGISTRY[selectedExamId] || EXAMS_REGISTRY["jee-main"];

  return `
    <div class="page-header" style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 16px;">
      <div>
        <h1 class="page-title">${exam.name} — Competitive Exam Center</h1>
        <p class="page-subtitle">${exam.fullName} &bull; Conducting Body: <strong>${exam.conductingBody}</strong></p>
      </div>
      <div style="display: flex; gap: 10px;">
        <button class="btn btn-primary" onclick="window.RecallMateApp.startExamMockTest('${exam.id}')">⏱️ Start ${exam.name} Mock Test</button>
        <a href="${exam.officialWebsite}" target="_blank" rel="noopener noreferrer" class="btn btn-outline">Official Portal ↗</a>
      </div>
    </div>

    <!-- Exam Switcher Bar -->
    <div style="display: flex; gap: 8px; overflow-x: auto; padding-bottom: 12px; margin-bottom: 24px;">
      ${Object.values(EXAMS_REGISTRY).map(e => `
        <a
          href="#/exams/${e.id}"
          class="btn btn-sm ${e.id === selectedExamId ? "btn-primary" : "btn-secondary"}"
          style="white-space: nowrap;"
        >
          ${e.name}
        </a>
      `).join("")}
    </div>

    <!-- Exam Blueprint & Marking Scheme -->
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 16px; margin-bottom: 24px;">
      <div class="card metric-card">
        <div class="metric-icon-box" style="background: rgba(19, 134, 95, 0.15); color: var(--lavender-500);">⏱️</div>
        <div>
          <div class="metric-val">${exam.durationMinutes} mins</div>
          <div class="metric-label">Official Test Duration</div>
        </div>
      </div>
      <div class="card metric-card">
        <div class="metric-icon-box" style="background: rgba(16, 185, 129, 0.15); color: var(--accent-emerald);">🎯</div>
        <div>
          <div class="metric-val">${exam.totalMarks} Marks</div>
          <div class="metric-label">Maximum Scoring</div>
        </div>
      </div>
      <div class="card metric-card">
        <div class="metric-icon-box" style="background: rgba(2, 132, 199, 0.15); color: var(--accent-cyan);">📝</div>
        <div>
          <div class="metric-val">${exam.totalQuestions} Questions</div>
          <div class="metric-label">Attempt ${exam.attemptQuestions}</div>
        </div>
      </div>
      <div class="card metric-card">
        <div class="metric-icon-box" style="background: rgba(245, 158, 11, 0.15); color: var(--accent-amber);">⚖️</div>
        <div>
          <div class="metric-val" style="font-size: 1.1rem; line-height: 1.3;">${exam.markingScheme.description.slice(0, 32)}...</div>
          <div class="metric-label">Marking & Negative Pattern</div>
        </div>
      </div>
    </div>

    <!-- Subject Breakdown & Official Chapters -->
    <h2 style="font-size: 1.25rem; font-weight: 700; margin-bottom: 16px;">Syllabus & Weightage Breakdown</h2>
    <div style="display: grid; gap: 20px; margin-bottom: 32px;">
      ${exam.subjects.map(subj => `
        <div class="card">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; border-bottom: 1px solid var(--border-subtle); padding-bottom: 10px;">
            <h3 style="font-size: 1.1rem; font-weight: 700;">${subj.name}</h3>
            <span style="font-size: 0.8rem; color: var(--text-muted);">${subj.questionCount} Questions (${subj.marks} Marks)</span>
          </div>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 12px;">
            ${subj.chapters.map(ch => `
              <div style="padding: 12px; background: var(--bg-surface-subtle); border-radius: 8px; border: 1px solid var(--border-subtle);">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                  <span style="font-size: 0.85rem; font-weight: 600;">${ch.name}</span>
                  ${ch.highYield ? `<span class="nav-item-badge badge-amber">High Yield</span>` : ""}
                </div>
                <div style="font-size: 0.75rem; color: var(--text-muted);">
                  Weightage: <strong>${ch.weightage}</strong> &bull; Avg ~${ch.avgQuestions} Qs/Shift
                </div>
              </div>
            `).join("")}
          </div>
        </div>
      `).join("")}
    </div>
  `;
}

// --- 6. AI Mock Test Generator & Simulator (NTA CBT & UPSC Pattern) ---
function renderMockTestView(state) {
  if (activeMockTest) {
    return renderActiveMockTestSimulator();
  }

  const profile = state.userProfile || {};
  const history = state.mockTestHistory || [];

  return `
    <div class="page-header" style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 16px;">
      <div>
        <h1 class="page-title">Realistic Examination Mock Test Center</h1>
        <p class="page-subtitle">Authentic National Testing Agency (NTA CBT) & UPSC Examination Simulation with official 3-Hour durations, section navigation, negative marking, and on-screen numeric keypads.</p>
      </div>
      <span class="nav-item-badge badge-amber" style="padding: 6px 14px; font-size: 0.8rem;">Official NTA CBT & UPSC Engine</span>
    </div>

    <!-- Official Pattern Banner -->
    <div class="card" style="margin-bottom: 24px; background: linear-gradient(135deg, rgba(19, 134, 95, 0.1) 0%, rgba(20, 125, 145, 0.05) 100%); border-left: 4px solid var(--lavender-500);">
      <div style="font-size: 0.875rem; line-height: 1.6; color: var(--text-primary);">
        <strong>🏛️ Official Pattern Simulation:</strong> Replicates the exact layout of the <strong>National Testing Agency (NTA) Computer-Based Test</strong> and <strong>UPSC Prelims</strong> portal. Features Section A (MCQs) and Section B (Numerical questions with virtual keypad), live countdown timer, and the official 5-state question palette.
      </div>
    </div>

    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 24px; margin-bottom: 32px;">
      <!-- Generator Configuration Form -->
      <div class="card">
        <h3 style="font-size: 1.15rem; font-weight: 700; margin-bottom: 16px;">Configure Your Mock Test</h3>
        <form onsubmit="window.RecallMateApp.generateAndStartTest(event)">
          <div style="margin-bottom: 16px;">
            <label style="font-size: 0.8rem; font-weight: 600; display: block; margin-bottom: 6px;">SELECT EXAMINATION</label>
            <select id="mock-exam-select" onchange="window.RecallMateApp.updateMockDurationOptions(this.value)" style="width: 100%; padding: 11px; border-radius: 8px; border: 1px solid var(--border-subtle); background: var(--bg-surface); color: var(--text-primary); font-size: 0.9rem; font-weight: 500;">
              <option value="jee-main" ${profile.targetExam === "jee-main" ? "selected" : ""}>JEE (Main) 2026 - Computer Based Test (NTA 3 Hours / 300 Marks)</option>
              <option value="neet-ug" ${profile.targetExam === "neet-ug" ? "selected" : ""}>NEET (UG) 2026 - National Eligibility Entrance (NTA 3 Hours 20 Mins / 720 Marks)</option>
              <option value="upsc-cse" ${profile.targetExam === "upsc-cse" ? "selected" : ""}>UPSC Civil Services (Prelims) - General Studies Paper 1 (UPSC 2 Hours / 200 Marks)</option>
              <option value="nda" ${profile.targetExam === "nda" ? "selected" : ""}>NDA & NA Examination 2026 - Paper 1 & GAT (UPSC 2.5 Hours / 900 Marks)</option>
              <option value="cuet-ug" ${profile.targetExam === "cuet-ug" ? "selected" : ""}>CUET (UG) 2026 - Domain Entrance (NTA 45-60 Mins / 200 Marks)</option>
            </select>
          </div>

          <div id="jee-mock-form-group" style="margin-bottom: 16px; ${profile.targetExam && profile.targetExam !== "jee-main" ? "display: none;" : ""}">
            <label for="jee-mock-form-select" style="font-size: 0.8rem; font-weight: 600; display: block; margin-bottom: 6px;">JEE MAIN PRACTICE FORM</label>
            <select id="jee-mock-form-select" style="width: 100%; padding: 11px; border-radius: 8px; border: 1px solid var(--border-subtle); background: var(--bg-surface); color: var(--text-primary); font-size: 0.9rem;">
              ${Array.from({ length: 10 }, (_, index) => `<option value="${index + 1}">Practice Form ${String(index + 1).padStart(2, "0")} of 10</option>`).join("")}
            </select>
            <small style="display: block; margin-top: 5px; color: var(--text-muted);">Each full form has 75 questions: 20 MCQs and 5 numerical questions per subject. Forms use the same original question bank with question and option order varied.</small>
          </div>

          <div style="margin-bottom: 16px;">
            <label style="font-size: 0.8rem; font-weight: 600; display: block; margin-bottom: 6px;">EXAMINATION DURATION</label>
            <select id="mock-timer-select" style="width: 100%; padding: 11px; border-radius: 8px; border: 1px solid var(--border-subtle); background: var(--bg-surface); color: var(--text-primary); font-size: 0.9rem; font-weight: 500;">
              <option value="180" selected>Official Full-Length (3 Hours / 180 Minutes) ⭐ Recommended</option>
              <option value="200">Official NEET Full-Length (3 Hours 20 Minutes / 200 Minutes)</option>
              <option value="120">Official UPSC Full-Length (2 Hours / 120 Minutes)</option>
              <option value="90">Half-Length Mock (1.5 Hours / 90 Minutes)</option>
              <option value="60">1-Hour Speed Practice (60 Minutes)</option>
              <option value="30">30-Minute Sprint (30 Minutes)</option>
            </select>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 20px;">
            <div>
              <label style="font-size: 0.8rem; font-weight: 600; display: block; margin-bottom: 6px;">TEST SCOPE</label>
              <select id="mock-scope-select" style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid var(--border-subtle); background: var(--bg-surface); color: var(--text-primary); font-size: 0.85rem;">
                <option value="full" selected>Complete Multi-Subject Paper</option>
                <option value="speed">Rapid Drill (10 Questions)</option>
              </select>
            </div>
            <div>
              <label style="font-size: 0.8rem; font-weight: 600; display: block; margin-bottom: 6px;">DIFFICULTY</label>
              <select id="mock-difficulty-select" style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid var(--border-subtle); background: var(--bg-surface); color: var(--text-primary); font-size: 0.85rem;">
                <option value="moderate" selected>Official Shift Standard</option>
                <option value="advanced">Advanced (High Rigor)</option>
                <option value="easy">Foundational (Conceptual)</option>
              </select>
            </div>
          </div>

          <button type="submit" class="btn btn-primary" style="width: 100%; padding: 14px; font-size: 1rem;">
            <span>Launch Official CBT Simulator</span>
            <span>⏱️</span>
          </button>
        </form>
      </div>

      <!-- Past Mock Tests History & Performance -->
      <div class="card">
        <h3 style="font-size: 1.15rem; font-weight: 700; margin-bottom: 16px;">Test Attempt History</h3>
        ${history.length === 0 ? `
          <div style="text-align: center; padding: 40px 20px; color: var(--text-muted); font-size: 0.875rem;">
            <div style="font-size: 2.5rem; margin-bottom: 10px;">📋</div>
            <strong style="color: var(--text-primary);">No Full Mock Tests Attempted Yet</strong>
            <p style="margin-top: 6px;">Launch a realistic 3-hour examination to test your pacing, accuracy, and negative marking penalty resilience.</p>
          </div>
        ` : `
          <div style="display: flex; flex-direction: column; gap: 12px; max-height: 380px; overflow-y: auto;">
            ${history.map(h => `
              <div style="padding: 14px; background: var(--bg-surface-subtle); border-radius: 10px; border: 1px solid var(--border-subtle);">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                  <span style="font-weight: 700; font-size: 0.95rem;">${h.examName}</span>
                  <span class="nav-item-badge badge-purple">${h.score} / ${h.totalMarks} Marks</span>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 0.775rem; color: var(--text-muted);">
                  <span>Accuracy: <strong>${h.accuracy}%</strong> &bull; ${Math.round(h.timeSpentSeconds / 60)} mins</span>
                  <span>${new Date(h.completedAt).toLocaleDateString()}</span>
                </div>
              </div>
            `).join("")}
          </div>
        `}
      </div>
    </div>
  `;
}

// Active Mock Test Simulator (Exact NTA Computer Based Test Interface)
function renderActiveMockTestSimulator() {
  const test = activeMockTest;
  const currentSection = test.sections[test.currentSectionIndex];
  const allCurrentQuestions = [...(currentSection.secA || []), ...(currentSection.secB || [])];
  const currentQ = allCurrentQuestions[test.currentQuestionIndex] || allCurrentQuestions[0];
  const currentQId = currentQ ? currentQ.id : "";
  const currentAnswer = test.answers[currentQId];
  const currentStatus = test.status[currentQId] || "not_visited";

  // Section-wide statistics
  let countAnswered = 0;
  let countNotAnswered = 0;
  let countReview = 0;
  let countAnsweredReview = 0;
  let countNotVisited = 0;

  allCurrentQuestions.forEach(q => {
    const st = test.status[q.id] || "not_visited";
    if (st === "answered") countAnswered++;
    else if (st === "not_answered") countNotAnswered++;
    else if (st === "review") countReview++;
    else if (st === "answered_review") countAnsweredReview++;
    else countNotVisited++;
  });

  return `
    <div class="nta-cbt-container">
      <!-- NTA Top Bar -->
      <div class="nta-top-bar">
        <div>
          <div class="nta-exam-title">${test.examName}</div>
          <div class="nta-candidate-meta">
            <span>Candidate: <strong>${escapeHtml(test.candidateName)}</strong></span>
            <span>Roll No: <strong>${test.candidateRoll}</strong></span>
            <span>System: <strong>C042</strong></span>
          </div>
        </div>

        <div style="display: flex; align-items: center; gap: 16px;">
          <div class="nta-timer-badge ${test.secondsRemaining < 600 ? "nta-timer-pulse" : ""}" id="mock-timer-display">
            <span>⏳</span>
            <span>Time Left: ${formatTimer(test.secondsRemaining)}</span>
          </div>
          <button class="btn btn-primary btn-sm" onclick="window.RecallMateApp.promptSubmitExamModal()" style="font-weight: 700; background: var(--accent-cyan);">Submit Examination</button>
        </div>
      </div>

      <!-- NTA Section Navigation Tabs -->
      <div class="nta-sections-bar">
        <span style="font-size: 0.75rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">SECTIONS:</span>
        ${test.sections.map((sec, sIdx) => {
          const secQuestions = [...(sec.secA || []), ...(sec.secB || [])];
          const secAnsCount = secQuestions.filter(q => test.status[q.id] === "answered" || test.status[q.id] === "answered_review").length;
          const isActive = sIdx === test.currentSectionIndex;

          return `
            <button
              class="nta-section-tab ${isActive ? "active" : ""}"
              onclick="window.RecallMateApp.switchMockSection(${sIdx})"
            >
              <span>${sec.name}</span>
              <span style="font-size: 0.75rem; opacity: 0.9;">(${secAnsCount}/${secQuestions.length})</span>
            </button>
          `;
        }).join("")}
      </div>

      <!-- Marking & Question Type Sub-Bar -->
      <div class="nta-marking-subbar">
        <div>
          <strong>${currentQ.section || "Section A (MCQ)"}</strong> &bull; Question Type: <strong>${currentQ.type === "numerical" ? "Numerical Value" : "Single Correct MCQ"}</strong>
        </div>
        <div>
          Marks for correct answer: <strong style="color: #16A34A;">+4.00</strong> | Negative marks: <strong style="color: #DC2626;">-1.00</strong>
        </div>
      </div>

      <!-- Main Two-Column Body -->
      <div class="nta-body-grid">
        <!-- Question Pane -->
        <div class="nta-question-pane">
          <div>
            <div class="nta-question-header">
              <span class="nta-qnum-title">Question No. ${test.currentQuestionIndex + 1}</span>
              <span class="nav-item-badge badge-purple">${currentQ.chapter || currentQ.subject}</span>
            </div>

            <!-- Question Text -->
            <div class="nta-qtext-body">
              ${currentQ.question.replace(/\n/g, "<br>")}
            </div>

            <!-- Response Options (MCQ or Numerical) -->
            ${currentQ.type === "numerical" ? `
              <div class="nta-keypad-box">
                <label style="font-size: 0.75rem; font-weight: 700; color: var(--text-muted); display: block; margin-bottom: 6px;">ENTER NUMERICAL VALUE / DECIMAL:</label>
                <input
                  type="text"
                  id="nta-num-input"
                  class="nta-num-input-screen"
                  value="${currentAnswer !== undefined ? currentAnswer : ""}"
                  readonly
                  placeholder="0.00"
                />
                <div class="nta-keypad-grid">
                  ${[7, 8, 9, 4, 5, 6, 1, 2, 3].map(n => `
                    <button type="button" class="nta-key-btn" onclick="window.RecallMateApp.inputNumericalKey('${n}')">${n}</button>
                  `).join("")}
                  <button type="button" class="nta-key-btn" onclick="window.RecallMateApp.inputNumericalKey('0')">0</button>
                  <button type="button" class="nta-key-btn" onclick="window.RecallMateApp.inputNumericalKey('.')">.</button>
                  <button type="button" class="nta-key-btn" onclick="window.RecallMateApp.inputNumericalKey('-')">-</button>
                  <button type="button" class="nta-key-btn nta-key-action" style="grid-column: span 2;" onclick="window.RecallMateApp.inputNumericalKey('BACKSPACE')">⌫ Backspace</button>
                  <button type="button" class="nta-key-btn nta-key-action" onclick="window.RecallMateApp.inputNumericalKey('CLEAR')">Clear</button>
                </div>
              </div>
            ` : `
              <div class="nta-options-group">
                ${(currentQ.options || []).map((opt, oIdx) => {
                  const isSelected = currentAnswer === oIdx;
                  return `
                    <div
                      class="nta-option-item ${isSelected ? "selected" : ""}"
                      onclick="window.RecallMateApp.selectMockOption(${oIdx})"
                    >
                      <div class="nta-radio-circle">${oIdx + 1}</div>
                      <div style="font-size: 0.95rem; line-height: 1.4;">${opt}</div>
                    </div>
                  `;
                }).join("")}
              </div>
            `}
          </div>

          <!-- Bottom Official Action Buttons -->
          <div class="nta-bottom-actions">
            <div style="display: flex; gap: 8px; flex-wrap: wrap;">
              <button class="btn btn-sm btn-nta-save-next" onclick="window.RecallMateApp.saveAndNext()">Save & Next</button>
              <button class="btn btn-sm btn-nta-save-review" onclick="window.RecallMateApp.saveAndMarkReview()">Save & Mark for Review</button>
              <button class="btn btn-sm btn-secondary" onclick="window.RecallMateApp.clearMockAnswer()">Clear Response</button>
              <button class="btn btn-sm btn-nta-review-next" onclick="window.RecallMateApp.markReviewAndNext()">Mark for Review & Next</button>
            </div>

            <div style="display: flex; gap: 6px;">
              <button class="btn btn-secondary btn-sm" onclick="window.RecallMateApp.jumpToMockQuestion(${test.currentQuestionIndex - 1})" ${test.currentQuestionIndex === 0 ? "disabled" : ""}>&larr; Back</button>
              <button class="btn btn-secondary btn-sm" onclick="window.RecallMateApp.jumpToMockQuestion(${test.currentQuestionIndex + 1})" ${test.currentQuestionIndex === allCurrentQuestions.length - 1 ? "disabled" : ""}>Next &rarr;</button>
            </div>
          </div>
        </div>

        <!-- Palette Pane (Right Sidebar) -->
        <div class="nta-palette-pane">
          <div>
            <!-- Official NTA 5-State Status Legend -->
            <div class="nta-legend-grid">
              <div class="nta-legend-item">
                <span class="nta-badge-icon nta-state-answered">${countAnswered}</span>
                <span>Answered</span>
              </div>
              <div class="nta-legend-item">
                <span class="nta-badge-icon nta-state-not-answered">${countNotAnswered}</span>
                <span>Not Answered</span>
              </div>
              <div class="nta-legend-item">
                <span class="nta-badge-icon nta-state-not-visited">${countNotVisited}</span>
                <span>Not Visited</span>
              </div>
              <div class="nta-legend-item">
                <span class="nta-badge-icon nta-state-review">${countReview}</span>
                <span>Marked for Review</span>
              </div>
              <div class="nta-legend-item" style="grid-column: span 2;">
                <span class="nta-badge-icon nta-state-answered-review" style="width: 24px; height: 24px;">${countAnsweredReview}</span>
                <span>Answered & Marked for Review (Evaluated)</span>
              </div>
            </div>

            <!-- Question Palette Grid -->
            <div style="margin-bottom: 8px; font-size: 0.825rem; font-weight: 700;">
              SECTION: ${currentSection.name.toUpperCase()}
            </div>
            <div class="nta-palette-buttons-box">
              <div class="nta-palette-qgrid">
                ${allCurrentQuestions.map((q, idx) => {
                  const st = test.status[q.id] || "not_visited";
                  const isCurrent = idx === test.currentQuestionIndex;
                  let badgeClass = "nta-state-not-visited";
                  if (st === "answered") badgeClass = "nta-state-answered";
                  else if (st === "not_answered") badgeClass = "nta-state-not-answered";
                  else if (st === "review") badgeClass = "nta-state-review";
                  else if (st === "answered_review") badgeClass = "nta-state-answered-review";

                  return `
                    <button
                      class="nta-qbtn ${badgeClass} ${isCurrent ? "current" : ""}"
                      onclick="window.RecallMateApp.jumpToMockQuestion(${idx})"
                    >
                      ${idx + 1}
                    </button>
                  `;
                }).join("")}
              </div>
            </div>
          </div>

          <button class="btn btn-primary" onclick="window.RecallMateApp.promptSubmitExamModal()" style="width: 100%; padding: 12px; font-weight: 700; background: var(--accent-cyan);">
            Submit Examination
          </button>
        </div>
      </div>
    </div>
  `;
}

// --- 7. Exam Priority Radar View ---
function renderRadarView(state) {
  const profile = state.userProfile || {};
  const radarKey = profile.targetExam === "neet-ug" ? "neet-ug" : (profile.targetExam === "nda" ? "nda" : "jee-main");
  const radar = RADAR_EXAMS[radarKey] || RADAR_EXAMS["jee-main"];

  return `
    <div class="page-header">
      <h1 class="page-title">Exam Priority Radar & High-Weightage Chapters</h1>
      <p class="page-subtitle">Empirical analysis based on ${radar.papersAnalyzedCount} official question papers (${radar.analysisPeriod}).</p>
    </div>

    <!-- Methodology & Disclaimer Card -->
    <div class="card" style="margin-bottom: 24px; background: var(--bg-surface-subtle); border-left: 4px solid var(--accent-amber);">
      <div style="font-size: 0.85rem; line-height: 1.5; color: var(--text-secondary);">
        <strong>Transparent Methodology:</strong> ${radar.disclaimer} Frequency is determined as (Total questions across analyzed shifts / Total shifts). This highlights historical priority to optimize revision return on investment.
      </div>
    </div>

    <!-- Tiers Display -->
    <div style="display: flex; flex-direction: column; gap: 24px;">
      ${radar.priorityTiers.map(tier => `
        <div class="card">
          <h2 style="font-size: 1.15rem; font-weight: 700; margin-bottom: 4px;">${tier.tier}</h2>
          <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 16px;">${tier.description}</p>

          <div style="display: grid; gap: 14px;">
            ${tier.chapters.map(ch => `
              <div style="border: 1px solid var(--border-subtle); border-radius: 10px; padding: 16px; background: var(--bg-surface-subtle);">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 8px; margin-bottom: 8px;">
                  <div>
                    <span class="nav-item-badge badge-purple">${ch.subject}</span>
                    <h3 style="font-size: 1.05rem; font-weight: 700; margin-top: 4px;">${ch.chapter}</h3>
                  </div>
                  <div style="text-align: right;">
                    <div style="font-weight: 700; font-size: 1.1rem; color: var(--lavender-600);">${ch.avgQuestionsPerShift} Qs / Shift</div>
                    <div style="font-size: 0.72rem; color: var(--text-muted);">${ch.historicalFrequency}</div>
                  </div>
                </div>

                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 12px; margin-top: 12px; font-size: 0.825rem;">
                  <div>
                    <strong style="color: var(--accent-rose);">Where Students Struggle:</strong>
                    <div style="color: var(--text-secondary); margin-top: 2px;">${ch.commonStruggles}</div>
                  </div>
                  <div>
                    <strong style="color: var(--accent-cyan);">High-Yield Concepts:</strong>
                    <div style="color: var(--text-secondary); margin-top: 2px;">${ch.conceptualFocus}</div>
                  </div>
                </div>

                <div style="margin-top: 12px; padding-top: 10px; border-top: 1px solid var(--border-subtle); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
                  <span style="font-size: 0.75rem; color: var(--text-muted);">Recommended Practice: <em>${ch.samplePractice}</em></span>
                  <a href="#/assistant" class="btn btn-outline btn-sm" onclick="window.RecallMateApp.askQuickTopic('Explain high-yield concept in ${ch.chapter}: ${ch.conceptualFocus}')">Ask AI Tutor</a>
                </div>
              </div>
            `).join("")}
          </div>
        </div>
      `).join("")}
    </div>
  `;
}

// --- 8. Repeated Questions & PYQ Intelligence View ---
function renderPyqIntelligenceView(state) {
  return `
    <div class="page-header">
      <h1 class="page-title">PYQ Intelligence Engine</h1>
      <p class="page-subtitle">Recurring conceptual twins, verified historical shift appearances, shortcuts, and common pitfalls.</p>
    </div>

    <div style="display: flex; flex-direction: column; gap: 24px;">
      ${PYQ_INTELLIGENCE_DATA.map(item => `
        <div class="card">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 10px; margin-bottom: 12px;">
            <div>
              <span class="nav-item-badge badge-purple">${item.exam} &bull; ${item.subject}</span>
              <h2 style="font-size: 1.15rem; font-weight: 700; margin-top: 4px;">${item.coreConcept}</h2>
            </div>
            <span class="nav-item-badge badge-amber">${item.recurrenceType}</span>
          </div>

          <!-- Appearance Years Timeline -->
          <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 16px;">
            ${item.appearanceYears.map(app => `
              <span style="font-size: 0.75rem; padding: 4px 10px; background: var(--bg-surface-subtle); border-radius: 999px; border: 1px solid var(--border-subtle); font-weight: 500;">
                📅 <strong>${app.year}</strong>: ${app.shift}
              </span>
            `).join("")}
          </div>

          <!-- Question Box -->
          <div style="padding: 16px; background: var(--bg-surface-subtle); border-radius: 10px; margin-bottom: 16px; font-size: 0.95rem; font-weight: 500; line-height: 1.5;">
            ${item.originalQuestion}
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 8px; margin-top: 12px;">
              ${item.options.map((opt, i) => `
                <div style="padding: 8px 12px; background: var(--bg-surface); border-radius: 6px; font-size: 0.85rem; border: 1px solid var(--border-subtle); ${i === item.correctIndex ? "border-color: var(--accent-emerald); font-weight: 600;" : ""}">
                  ${String.fromCharCode(65 + i)}. ${opt} ${i === item.correctIndex ? "✓ (Correct)" : ""}
                </div>
              `).join("")}
            </div>
          </div>

          <!-- Solution & Shortcuts Accordion -->
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 14px; margin-bottom: 16px;">
            <div style="padding: 12px; background: rgba(16, 185, 129, 0.08); border-radius: 8px; border: 1px solid rgba(16, 185, 129, 0.2);">
              <strong style="color: var(--accent-emerald); font-size: 0.85rem;">⚡ Speed Shortcut:</strong>
              <p style="font-size: 0.8rem; margin-top: 4px; line-height: 1.4; color: var(--text-primary);">${item.shortcutMethod}</p>
            </div>
            <div style="padding: 12px; background: rgba(225, 29, 72, 0.08); border-radius: 8px; border: 1px solid rgba(225, 29, 72, 0.2);">
              <strong style="color: var(--accent-rose); font-size: 0.85rem;">⚠️ Common Trap to Avoid:</strong>
              <p style="font-size: 0.8rem; margin-top: 4px; line-height: 1.4; color: var(--text-primary);">${item.commonTrap}</p>
            </div>
          </div>

          <!-- Practice Similar Question Modal Button -->
          <div style="display: flex; justify-content: flex-end;">
            <button class="btn btn-primary btn-sm" onclick="window.RecallMateApp.openSimilarQuestionModal('${item.id}')">Practice Conceptual Twin Question &rarr;</button>
          </div>
        </div>
      `).join("")}
    </div>
  `;
}

// --- 9. External Educational Resources Library View ---
function renderResourcesView(state) {
  const saved = state.savedResources || [];

  return `
    <div class="page-header" style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 16px;">
      <div>
        <h1 class="page-title">External Educational Resources Library</h1>
        <p class="page-subtitle">Discover free official mock tests, PYQ archives, and syllabi from government authorities and educational portals.</p>
      </div>
      <button class="btn btn-outline" onclick="window.RecallMateApp.openSearchModal()">🔍 Live Google Educational Search</button>
    </div>

    <!-- Filter Bar -->
    <div class="card" style="margin-bottom: 20px; padding: 14px 20px;">
      <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center;">
        <input
          type="text"
          id="res-filter-query"
          placeholder="Filter resources by name, exam, or keyword..."
          style="flex: 1; min-width: 200px; padding: 8px 12px; border-radius: 8px; border: 1px solid var(--border-subtle); background: var(--bg-surface); color: var(--text-primary); font-size: 0.875rem;"
          oninput="window.RecallMateApp.filterResourcesList()"
        />
        <select id="res-filter-type" style="padding: 8px 12px; border-radius: 8px; border: 1px solid var(--border-subtle); background: var(--bg-surface); color: var(--text-primary); font-size: 0.875rem;" onchange="window.RecallMateApp.filterResourcesList()">
          ${RESOURCE_TYPES.map(t => `<option value="${t}">${t}</option>`).join("")}
        </select>
      </div>
    </div>

    <!-- Resources Grid -->
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 16px;" id="resources-grid-container">
      ${VERIFIED_RESOURCES.map(res => `
        <div class="card card-hover" style="display: flex; flex-direction: column; justify-content: space-between;">
          <div>
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
              <span class="nav-item-badge badge-purple">${res.resourceType}</span>
              ${res.isOfficial ? `<span class="nav-item-badge badge-amber">Official</span>` : ""}
            </div>
            <h3 style="font-size: 1rem; font-weight: 700; margin-bottom: 6px;">${res.name}</h3>
            <p style="font-size: 0.8rem; color: var(--text-secondary); line-height: 1.4; margin-bottom: 12px;">${res.description}</p>
          </div>

          <div>
            <div style="font-size: 0.72rem; color: var(--text-muted); margin-bottom: 12px;">
              Source: <strong>${res.sourceWebsite}</strong> &bull; Verified Free: <strong>${res.verifiedFree ? "Yes" : "Check Portal"}</strong>
            </div>
            <div style="display: flex; gap: 8px;">
              <a href="${res.directUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm" style="flex: 1;">Open Original Resource ↗</a>
              <button class="btn btn-secondary btn-sm" onclick="window.RecallMateApp.toggleBookmark('${res.id}')">
                ${saved.includes(res.id) ? "★ Saved" : "☆ Save"}
              </button>
            </div>
          </div>
        </div>
      `).join("")}
    </div>
  `;
}

// --- 10. AI Personalized Study Planner View ---
function renderPlannerView(state) {
  const profile = state.userProfile || {};
  const plan = state.studyPlan;

  return `
    <div class="page-header" style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 16px;">
      <div>
        <h1 class="page-title">Personalized AI Study Timetable</h1>
        <p class="page-subtitle">Dynamically adjusts according to your weak topics, exam countdown, and daily available study hours.</p>
      </div>
      <button class="btn btn-primary" onclick="window.RecallMateApp.generateNewStudyPlan()">⚡ Generate AI Schedule</button>
    </div>

    ${!plan ? `
      <div class="card" style="text-align: center; padding: 48px;">
        <div style="font-size: 2.5rem; margin-bottom: 12px;">📅</div>
        <h3 style="font-size: 1.2rem; font-weight: 700;">No Active Schedule Yet</h3>
        <p style="font-size: 0.9rem; color: var(--text-muted); margin: 8px 0 20px 0;">Click below to generate a tailored 7-day schedule with spaced revision blocks and mock test milestones.</p>
        <button class="btn btn-primary" onclick="window.RecallMateApp.generateNewStudyPlan()">Create My Study Plan</button>
      </div>
    ` : `
      <div style="display: grid; gap: 20px;">
        <div class="card" style="background: var(--bg-surface-subtle);">
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;">
            <div>
              <h2 style="font-size: 1.15rem; font-weight: 700;">Target Goal: ${plan.goal}</h2>
              <div style="font-size: 0.8rem; color: var(--text-muted);">Daily Study Commitment: ${plan.dailyHours} hours &bull; Weak Areas Prioritized: ${plan.weakFocus}</div>
            </div>
            <button class="btn btn-secondary btn-sm" onclick="window.RecallMateApp.generateNewStudyPlan()">Regenerate Schedule</button>
          </div>
        </div>

        <!-- 7-Day Agenda Grid -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px;">
          ${plan.schedule.map((day, dIdx) => `
            <div class="card">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; border-bottom: 1px solid var(--border-subtle); padding-bottom: 8px;">
                <h3 style="font-size: 1rem; font-weight: 700;">${day.dayName}</h3>
                <span class="nav-item-badge badge-purple">${day.focusSubject}</span>
              </div>
              <div style="display: flex; flex-direction: column; gap: 8px;">
                ${day.tasks.map((task, tIdx) => `
                  <label style="display: flex; align-items: flex-start; gap: 8px; font-size: 0.85rem; cursor: pointer; padding: 6px; border-radius: 6px; background: var(--bg-surface-subtle);">
                    <input
                      type="checkbox"
                      ${task.completed ? "checked" : ""}
                      style="margin-top: 3px;"
                      onchange="window.RecallMateApp.togglePlanTask(${dIdx}, ${tIdx})"
                    />
                    <span style="${task.completed ? "text-decoration: line-through; opacity: 0.6;" : ""}">${task.text}</span>
                  </label>
                `).join("")}
              </div>
            </div>
          `).join("")}
        </div>
      </div>
    `}
  `;
}

// --- 11. AI Doubt Solver View ---
function renderDoubtsView(state) {
  return `
    <div class="page-header">
      <h1 class="page-title">AI Doubt Solver with Diagnostics</h1>
      <p class="page-subtitle">Type your question or upload an image/diagram. Receive step-by-step reasoning, shortcuts, and why incorrect options fail.</p>
    </div>

    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 24px;">
      <!-- Query Card -->
      <div class="card">
        <h3 style="font-size: 1.05rem; font-weight: 700; margin-bottom: 14px;">Submit Your Academic Doubt</h3>
        <form onsubmit="window.RecallMateApp.submitAcademicDoubt(event)">
          <div style="margin-bottom: 12px;">
            <label style="font-size: 0.75rem; font-weight: 600; color: var(--text-muted); display: block; margin-bottom: 6px;">SUBJECT</label>
            <select id="doubt-subject" style="width: 100%; padding: 8px 10px; border-radius: 8px; border: 1px solid var(--border-subtle); background: var(--bg-surface); color: var(--text-primary); font-size: 0.875rem;">
              <option value="Physics">Physics</option>
              <option value="Chemistry">Chemistry</option>
              <option value="Mathematics">Mathematics</option>
              <option value="Biology">Biology</option>
              <option value="General Studies">General Studies & Aptitude</option>
            </select>
          </div>

          <div style="margin-bottom: 12px;">
            <label style="font-size: 0.75rem; font-weight: 600; color: var(--text-muted); display: block; margin-bottom: 6px;">QUESTION TEXT OR OPTIONS</label>
            <textarea
              id="doubt-text"
              rows="4"
              placeholder="Type your question or paste options A, B, C, D..."
              style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid var(--border-subtle); background: var(--bg-surface); color: var(--text-primary); font-size: 0.875rem; font-family: inherit; resize: none;"
              required
            ></textarea>
          </div>

          <div style="margin-bottom: 16px;">
            <label style="font-size: 0.75rem; font-weight: 600; color: var(--text-muted); display: block; margin-bottom: 6px;">UPLOAD QUESTION PHOTO / DIAGRAM (OPTIONAL)</label>
            <input type="file" id="doubt-file" accept="image/*,.pdf" style="font-size: 0.8rem;" onchange="window.RecallMateApp.previewDoubtImage(this)" />
            <div id="doubt-image-preview" style="margin-top: 8px;"></div>
          </div>

          <button type="submit" class="btn btn-primary" style="width: 100%;">Solve Step-by-Step ⚡</button>
        </form>
      </div>

      <!-- Solution Output Card -->
      <div class="card" id="doubt-solution-container">
        <div style="text-align: center; padding: 48px; color: var(--text-muted);">
          <div style="font-size: 2.5rem; margin-bottom: 12px;">❓</div>
          <h3 style="font-size: 1.1rem; font-weight: 600; color: var(--text-primary);">Awaiting Your Doubt</h3>
          <p style="font-size: 0.85rem; margin-top: 6px;">Submit a textbook question or problem statement on the left to see full mathematical steps, formula reasoning, and option breakdown.</p>
        </div>
      </div>
    </div>
  `;
}

// --- 12. Stuckpoint Recovery View ---
function renderRecoveryView(state) {
  const recoveries = state.recoveries || [];
  const struggling = recoveries.filter(r => r.status === "struggling");
  const understood = recoveries.filter(r => r.status === "understood");

  return `
    <div class="page-header" style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 16px;">
      <div>
        <h1 class="page-title">Stuckpoint Recovery Center</h1>
        <p class="page-subtitle">Review concepts you flagged as difficult or missed during quizzes until they are solidly understood.</p>
      </div>
      <button class="btn btn-primary" onclick="window.RecallMateApp.openAddRecoveryModal()">+ Log New Stuckpoint</button>
    </div>

    <!-- Active Stuckpoints -->
    <h2 style="font-size: 1.15rem; font-weight: 700; margin-bottom: 14px;">Needs Work (${struggling.length})</h2>
    ${struggling.length === 0 ? `
      <div class="card" style="text-align: center; padding: 24px; color: var(--text-muted); margin-bottom: 24px;">
        🎉 No active concepts needing recovery right now!
      </div>
    ` : `
      <div style="display: grid; gap: 14px; margin-bottom: 28px;">
        ${struggling.map(rec => {
          const topic = state.topics.find(t => t.id === rec.topicId);
          return `
            <div class="card" style="border-left: 4px solid var(--accent-rose);">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 6px;">
                <div>
                  <span class="nav-item-badge badge-purple">${topic ? topic.name : "Study Topic"}</span>
                  <h3 style="font-size: 1.05rem; font-weight: 700; margin-top: 4px;">${rec.concept}</h3>
                </div>
                <button class="btn btn-primary btn-sm" onclick="window.RecallMateApp.markRecoveryResolved('${rec.id}')">✓ Mark Understood</button>
              </div>
              <p style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.4; margin-top: 8px;">
                ${rec.recoveryExplanation || "Targeted micro-explanation prepared to resolve conceptual block."}
              </p>
              <div style="margin-top: 10px; display: flex; gap: 8px;">
                <button class="btn btn-outline btn-sm" onclick="window.RecallMateApp.askQuickTopic('Explain clearly: ' + '${rec.concept}')">Explain with Analogy</button>
              </div>
            </div>
          `;
        }).join("")}
      </div>
    `}

    <!-- Mastered Concepts -->
    <h2 style="font-size: 1.15rem; font-weight: 700; margin-bottom: 14px;">Resolved & Mastered (${understood.length})</h2>
    <div style="display: grid; gap: 10px;">
      ${understood.map(rec => {
        const topic = state.topics.find(t => t.id === rec.topicId);
        return `
          <div class="card" style="padding: 14px; display: flex; justify-content: space-between; align-items: center; background: var(--bg-surface-subtle);">
            <div>
              <span style="font-size: 0.8rem; font-weight: 600; color: var(--accent-emerald);">✓ Understood</span>
              <div style="font-size: 0.9rem; font-weight: 600; margin-top: 2px;">${rec.concept} (${topic ? topic.name : "Topic"})</div>
            </div>
            <span style="font-size: 0.75rem; color: var(--text-muted);">${new Date(rec.updatedAt).toLocaleDateString()}</span>
          </div>
        `;
      }).join("")}
    </div>
  `;
}

// --- 13. Performance & Retention Analytics View ---
function renderAnalyticsView(state) {
  const topics = state.topics || [];
  const completedRevs = state.revisions.filter(r => r.status === "completed").length;
  const totalRevs = state.revisions.length;
  const revPct = totalRevs > 0 ? Math.round((completedRevs / totalRevs) * 100) : 100;

  let totalScore = 0;
  let totalMax = 0;
  state.quizResults.forEach(q => {
    totalScore += q.score || 0;
    totalMax += q.total || 0;
  });
  const quizPct = totalMax > 0 ? Math.round((totalScore / totalMax) * 100) : 85;

  return `
    <div class="page-header">
      <h1 class="page-title">Performance Analytics & Retention</h1>
      <p class="page-subtitle">Track your Ebbinghaus memory retention score, mock test scores, and chapter accuracy.</p>
    </div>

    <!-- Analytics Metrics -->
    <div class="metrics-grid">
      <div class="card metric-card">
        <div class="metric-icon-box" style="background: rgba(19, 134, 95, 0.15); color: var(--lavender-500);">🧠</div>
        <div>
          <div class="metric-val">88%</div>
          <div class="metric-label">Memory Retention Health</div>
        </div>
      </div>
      <div class="card metric-card">
        <div class="metric-icon-box" style="background: rgba(16, 185, 129, 0.15); color: var(--accent-emerald);">📈</div>
        <div>
          <div class="metric-val">${quizPct}%</div>
          <div class="metric-label">Average Quiz Score</div>
        </div>
      </div>
      <div class="card metric-card">
        <div class="metric-icon-box" style="background: rgba(2, 132, 199, 0.15); color: var(--accent-cyan);">🔄</div>
        <div>
          <div class="metric-val">${revPct}%</div>
          <div class="metric-label">Spaced Revision Adherence</div>
        </div>
      </div>
      <div class="card metric-card">
        <div class="metric-icon-box" style="background: rgba(245, 158, 11, 0.15); color: var(--accent-amber);">⚡</div>
        <div>
          <div class="metric-val">${state.mockTestHistory.length}</div>
          <div class="metric-label">Full Mock Tests Taken</div>
        </div>
      </div>
    </div>

    <!-- Forgetting Curve Visualizer -->
    <div class="card" style="margin-bottom: 24px;">
      <h3 style="font-size: 1.1rem; font-weight: 700; margin-bottom: 8px;">Ebbinghaus Forgetting Curve & Spaced Recovery</h3>
      <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 20px;">
        Without active revision, 75% of new academic material is forgotten within 48 hours. NOVORA automatically schedules spaced reviews at Day 1, 3, 7, 14, and 30 to lock memory into permanent long-term storage.
      </p>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 12px; text-align: center;">
        <div style="padding: 16px; background: var(--bg-surface-subtle); border-radius: 10px;">
          <div style="font-size: 0.75rem; color: var(--text-muted);">Day 1 Review</div>
          <div style="font-size: 1.3rem; font-weight: 700; color: var(--accent-rose); margin: 4px 0;">90% Lock</div>
          <div style="font-size: 0.7rem; color: var(--text-secondary);">Arrests initial rapid decay</div>
        </div>
        <div style="padding: 16px; background: var(--bg-surface-subtle); border-radius: 10px;">
          <div style="font-size: 0.75rem; color: var(--text-muted);">Day 3 Review</div>
          <div style="font-size: 1.3rem; font-weight: 700; color: var(--accent-amber); margin: 4px 0;">80% Lock</div>
          <div style="font-size: 0.7rem; color: var(--text-secondary);">Strengthens neural pathways</div>
        </div>
        <div style="padding: 16px; background: var(--bg-surface-subtle); border-radius: 10px;">
          <div style="font-size: 0.75rem; color: var(--text-muted);">Day 7 Review</div>
          <div style="font-size: 1.3rem; font-weight: 700; color: var(--accent-cyan); margin: 4px 0;">85% Lock</div>
          <div style="font-size: 0.7rem; color: var(--text-secondary);">Consolidates problem patterns</div>
        </div>
        <div style="padding: 16px; background: var(--bg-surface-subtle); border-radius: 10px;">
          <div style="font-size: 0.75rem; color: var(--text-muted);">Day 14 Review</div>
          <div style="font-size: 1.3rem; font-weight: 700; color: var(--accent-emerald); margin: 4px 0;">95% Lock</div>
          <div style="font-size: 0.7rem; color: var(--text-secondary);">Long-term memory transfer</div>
        </div>
      </div>
    </div>
  `;
}

// --- 14. Settings View ---
function renderSettingsView(state) {
  const profile = state.userProfile || {};
  const aiSettings = state.aiSettings || {};

  return `
    <div class="page-header">
      <h1 class="page-title">Platform Settings & Data Storage</h1>
      <p class="page-subtitle">Configure API keys, manage your local demo data, export backups, or customize study goals.</p>
    </div>

    <div style="display: grid; gap: 24px;">
      <!-- API Configurations -->
      <div class="card">
        <h3 style="font-size: 1.1rem; font-weight: 700; margin-bottom: 6px;">AI & Search Provider Integrations</h3>
        <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 16px;">
          Add a Gemini key for open-ended AI answers and Google Search credentials for live references. A small built-in reference still covers a few common study topics offline.
        </p>

        <form onsubmit="window.RecallMateApp.saveApiSettings(event)">
          <div style="margin-bottom: 14px;">
            <label for="settings-gemini-key" style="font-size: 0.8rem; font-weight: 600; display: block; margin-bottom: 6px;">PERSONAL GOOGLE GEMINI API KEY</label>
            <input
              type="password"
              id="settings-gemini-key"
              value="${escapeHtml(aiSettings.geminiApiKey || "")}"
              placeholder="Enter your Gemini API key"
              style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid var(--border-subtle); background: var(--bg-surface); color: var(--text-primary); font-size: 0.875rem;"
            />
            <span style="font-size: 0.72rem; color: var(--text-muted); margin-top: 4px; display: block;">Saved in this browser, not synced to Supabase; sent to NOVORA and Google Gemini only when you ask a question.</span>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 18px;">
            <div>
              <label style="font-size: 0.8rem; font-weight: 600; display: block; margin-bottom: 6px;">GOOGLE SEARCH API KEY (OPTIONAL)</label>
              <input
                type="password"
                id="settings-search-key"
                value="${aiSettings.searchApiKey || ""}"
                placeholder="Google Cloud API Key"
                style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid var(--border-subtle); background: var(--bg-surface); color: var(--text-primary); font-size: 0.875rem;"
              />
            </div>
            <div>
              <label style="font-size: 0.8rem; font-weight: 600; display: block; margin-bottom: 6px;">SEARCH ENGINE ID (CX) (OPTIONAL)</label>
              <input
                type="text"
                id="settings-search-cx"
                value="${aiSettings.searchEngineCx || ""}"
                placeholder="e.g. 0123456789:abcdef"
                style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid var(--border-subtle); background: var(--bg-surface); color: var(--text-primary); font-size: 0.875rem;"
              />
            </div>
          </div>

          <button type="submit" class="btn btn-primary">Save API Configuration</button>
        </form>
      </div>

      <!-- Backup & Data Controls -->
      <div class="card">
        <h3 style="font-size: 1.1rem; font-weight: 700; margin-bottom: 6px;">Data Management & Backups</h3>
        <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 16px;">
          Currently storing <strong>${state.topics.length} topics</strong>, <strong>${state.notes.length} notes</strong>, <strong>${state.recoveries.length} recovery records</strong>, and <strong>${state.quizResults.length} quiz scores</strong> in local storage (<code style="background: var(--bg-surface-subtle); padding: 2px 6px; border-radius: 4px;">recallmate:data:v1</code>).
        </p>

        <div style="display: flex; gap: 10px; flex-wrap: wrap;">
          <button class="btn btn-primary" onclick="store.exportBackupJson()">📥 Export Full JSON Backup</button>
          <label class="btn btn-secondary" style="cursor: pointer;">
            📤 Import JSON Backup
            <input type="file" accept=".json" style="display: none;" onchange="window.RecallMateApp.importBackupFile(this)" />
          </label>
          <button class="btn btn-secondary" onclick="store.resetDemoData()">🔄 Reset to Sample Data</button>
          <button class="btn btn-secondary" style="color: var(--accent-rose);" onclick="window.RecallMateApp.confirmClearData()">🗑️ Clear All Data</button>
        </div>
      </div>
    </div>
  `;
}

// Helpers
function getRevisionsDueToday() {
  const today = new Date().toISOString().slice(0, 10);
  return store.get().revisions.filter(r => r.status === "pending" && r.dueDate <= today);
}

function formatTimer(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

// --- Global Interactive App Methods (window.RecallMateApp) ---
window.RecallMateApp = {
  toggleTheme,

  setAuthenticationMode(mode) {
    authMode = mode === "signup" ? "signup" : "signin";
    authMessage = "";
    renderApp();
  },

  async submitAuthentication(event) {
    event.preventDefault();
    if (authLoading) return;
    const form = event.currentTarget;
    const email = form.elements.email.value.trim();
    const password = form.elements.password.value;
    const name = form.elements.name ? form.elements.name.value.trim() : "";
    const submitButton = form.querySelector('button[type="submit"]');

    authLoading = true;
    authMessage = "";
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = authMode === "signup" ? "Creating account..." : "Signing in...";
    }

    try {
      let session;
      if (authMode === "signup") {
        const result = await signUpWithPassword(email, password, name);
        session = result?.access_token ? result : null;
        if (!session) {
          const identities = result?.user?.identities;
          if (Array.isArray(identities) && identities.length === 0) {
            throw new Error("An account with this email already exists. Sign in instead.");
          }
          authMessage = "Supabase still requires email confirmation. To enable instant sign-in, turn off Confirm email in Authentication → Sign In / Providers → Email. Existing unconfirmed accounts may need to be confirmed in Authentication → Users before signing in.";
          return;
        }
      } else {
        session = await signInWithPassword(email, password);
      }

      await connectAuthenticatedSession(session);
    } catch (error) {
      console.error("Authentication failed:", error);
      authMessage = getAuthenticationErrorMessage(error);
      renderApp();
    } finally {
      authLoading = false;
      if (!authSession) renderApp();
    }
  },

  async logout() {
    const session = authSession;
    authSession = null;
    cloudReady = false;
    assistantConversation = [];
    assistantLoading = false;
    if (cloudSyncTimer) {
      clearTimeout(cloudSyncTimer);
      cloudSyncTimer = null;
    }
    try {
      await signOut(session);
    } catch (error) {
      console.error("Supabase sign-out request failed:", error);
      authMessage = `Signed out on this device, but the server sign-out request failed: ${error.message}`;
    } finally {
      authReady = true;
      renderApp();
    }
  },

  async retryCloudConnection() {
    if (!authSession || cloudRetrying) return;
    cloudRetrying = true;
    cloudSyncError = "Retrying the Supabase data connection...";
    renderApp();
    try {
      const session = await getAuthSession();
      if (!session) {
        authSession = null;
        cloudReady = false;
        authMessage = "Your account session expired. Please sign in again.";
        return;
      }
      await connectAuthenticatedSession(session);
    } catch (error) {
      console.error("Could not retry the account data connection:", error);
      cloudSyncError = `Could not load cloud data. ${error.message || String(error)}`;
    } finally {
      cloudRetrying = false;
      renderApp();
    }
  },

  // Assistant interactions
  selectResponseMode(modeId, btn) {
    const parent = document.getElementById("mode-selector");
    if (parent) {
      parent.querySelectorAll("button").forEach(b => {
        b.className = "btn btn-sm btn-secondary";
      });
      btn.className = "btn btn-sm btn-primary";
    }
    btn.setAttribute("data-active-mode", modeId);
  },

  askQuickTopic(query) {
    window.location.hash = "#/assistant";
    setTimeout(() => {
      const input = document.getElementById("study-query-input");
      if (!input) return;
      input.value = query;
      input.closest("form")?.requestSubmit();
    }, 0);
  },

  clearAssistantConversation() {
    if (assistantLoading) return;
    assistantConversation = [];
    const container = document.getElementById("assistant-output-container");
    if (container) container.innerHTML = renderAssistantTranscript();
  },

  async submitStudyQuestion(e) {
    e.preventDefault();
    if (assistantLoading) return;
    const input = document.getElementById("study-query-input");
    if (!input) return;
    const depthSelect = document.getElementById("assistant-depth");
    const languageSelect = document.getElementById("assistant-language");
    const activeBtn = document.querySelector("#mode-selector button.btn-primary");
    const mode = activeBtn ? activeBtn.getAttribute("data-mode") : "detailed";
    const query = input.value.trim();
    if (!query) return;

    const profile = store.get().userProfile;
    const conversationHistory = assistantConversation.slice(-6);
    const userMessage = { sender: "user", text: query };
    const assistantMessage = { sender: "assistant", text: "", pending: true };
    assistantConversation.push(userMessage, assistantMessage);
    assistantConversation = assistantConversation.slice(-40);
    assistantLoading = true;
    input.value = "";
    input.disabled = true;
    const submitButton = input.closest("form")?.querySelector('button[type="submit"]');
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.innerHTML = "<span>Thinking...</span><span aria-hidden=\"true\">…</span>";
    }
    const container = document.getElementById("assistant-output-container");
    if (container) container.innerHTML = renderAssistantTranscript();

    try {
      const response = await askStudyAssistant({
        query,
        classLevel: profile.classLevel || "General",
        targetExam: profile.targetExam,
        depth: depthSelect ? depthSelect.value : "intermediate",
        mode,
        language: languageSelect ? languageSelect.value : "en",
        conversationHistory,
        onChunk: text => {
          assistantMessage.text = text;
          assistantMessage.pending = !text;
          const transcript = document.getElementById("assistant-output-container");
          if (transcript) {
            transcript.innerHTML = renderAssistantTranscript();
            transcript.scrollTop = transcript.scrollHeight;
          }
        }
      });
      assistantMessage.text = response.content || "I couldn't generate a response. Please try asking in a different way.";
      assistantMessage.sources = response.sources || [];
    } catch (err) {
      console.error("Could not generate an AI study answer:", err);
      assistantMessage.error = true;
      if (err.code === "NO_API_KEY") {
        assistantMessage.text = `${err.message}\n\nAdd a Gemini key in Settings → AI & Search Provider Integrations, or ask the site administrator to configure the hosted AI service.`;
      } else if (err.code === "GEMINI_API_ERROR" && /api key not valid|invalid api key/i.test(err.message || "")) {
        assistantMessage.text = "The hosted Gemini API key is invalid. Add a valid personal key in Settings → AI & Search Provider Integrations, or ask the site administrator to update the GEMINI_API_KEY in Netlify. No answer was generated.";
      } else {
        assistantMessage.text = `I couldn't get a reliable answer right now. ${err.message || "Please try again in a moment."}`;
      }
    } finally {
      assistantMessage.pending = false;
      assistantLoading = false;
      const transcript = document.getElementById("assistant-output-container");
      if (transcript) {
        transcript.innerHTML = renderAssistantTranscript();
        transcript.scrollTop = transcript.scrollHeight;
      }
      const nextInput = document.getElementById("study-query-input");
      if (nextInput) {
        nextInput.disabled = false;
        const nextSubmitButton = nextInput.closest("form")?.querySelector('button[type="submit"]');
        if (nextSubmitButton) {
          nextSubmitButton.disabled = false;
          nextSubmitButton.innerHTML = "<span>Send</span><span aria-hidden=\"true\">↑</span>";
        }
        nextInput.focus();
      }
    }
  },

  // Mock Test Interactions (Official NTA CBT & UPSC Engine)
  updateMockDurationOptions(examId) {
    const timerSelect = document.getElementById("mock-timer-select");
    const jeeFormGroup = document.getElementById("jee-mock-form-group");
    if (jeeFormGroup) jeeFormGroup.style.display = examId === "jee-main" ? "block" : "none";
    if (!timerSelect) return;
    if (examId === "jee-main") {
      timerSelect.value = "180";
    } else if (examId === "neet-ug") {
      timerSelect.value = "200";
    } else if (examId === "upsc-cse") {
      timerSelect.value = "120";
    } else if (examId === "nda") {
      timerSelect.value = "150";
    } else if (examId === "cuet-ug") {
      timerSelect.value = "60";
    }
  },

  generateAndStartTest(e) {
    if (e) e.preventDefault();
    const examSelect = document.getElementById("mock-exam-select")?.value || "jee-main";
    const formNumber = parseInt(document.getElementById("jee-mock-form-select")?.value || "1", 10);
    const durationMins = parseInt(document.getElementById("mock-timer-select")?.value || "180", 10);
    const scope = document.getElementById("mock-scope-select")?.value || "full";
    const bank = REALISTIC_MOCK_BANKS[examSelect] || REALISTIC_MOCK_BANKS["jee-main"];
    const profile = store.get().userProfile || {};

    // Clone sections and questions so each attempt is fresh
    let sections = examSelect === "jee-main"
      ? createJeeMainMockForm(formNumber)
      : JSON.parse(JSON.stringify(bank.sections));

    if (scope === "speed") {
      // Speed drill: take top 2 questions from each section
      sections.forEach(sec => {
        sec.secA = (sec.secA || []).slice(0, 2);
        sec.secB = (sec.secB || []).slice(0, 1);
      });
    }

    // Build question lookup and initial status
    const initialStatus = {};
    sections.forEach((sec, sIdx) => {
      const allQ = [...(sec.secA || []), ...(sec.secB || [])];
      allQ.forEach((q, qIdx) => {
        // First question of first section is immediately marked as visited (not_answered)
        initialStatus[q.id] = (sIdx === 0 && qIdx === 0) ? "not_answered" : "not_visited";
      });
    });

    activeMockTest = {
      examId: examSelect,
      examName: examSelect === "jee-main"
        ? `JEE (Main) 2026 - Practice Form ${String(formNumber).padStart(2, "0")} of 10`
        : bank.examName,
      conductingBody: bank.conductingBody,
      officialDurationMinutes: bank.officialDurationMinutes,
      sections,
      currentSectionIndex: 0,
      currentQuestionIndex: 0,
      answers: {},
      status: initialStatus,
      secondsRemaining: durationMins * 60,
      totalDuration: durationMins * 60,
      candidateRoll: "2603100" + Math.floor(1000 + Math.random() * 9000),
      candidateName: profile.name || "Alex Sharma"
    };

    if (mockTimerInterval) clearInterval(mockTimerInterval);
    mockTimerInterval = setInterval(() => {
      if (!activeMockTest) return;
      activeMockTest.secondsRemaining--;
      const display = document.getElementById("mock-timer-display");
      if (display) {
        display.innerHTML = `<span>⏳</span><span>Time Left: ${formatTimer(activeMockTest.secondsRemaining)}</span>`;
        if (activeMockTest.secondsRemaining < 600) {
          display.classList.add("nta-timer-pulse");
        }
      }
      if (activeMockTest.secondsRemaining <= 0) {
        clearInterval(mockTimerInterval);
        alert("Official Examination Time is Up! Automatically submitting your responses.");
        window.RecallMateApp.finalizeMockTest();
      }
    }, 1000);

    renderApp();
  },

  switchMockSection(sectionIndex) {
    if (!activeMockTest) return;
    if (sectionIndex >= 0 && sectionIndex < activeMockTest.sections.length) {
      activeMockTest.currentSectionIndex = sectionIndex;
      activeMockTest.currentQuestionIndex = 0;
      const curSec = activeMockTest.sections[sectionIndex];
      const firstQ = (curSec.secA && curSec.secA[0]) || (curSec.secB && curSec.secB[0]);
      if (firstQ && activeMockTest.status[firstQ.id] === "not_visited") {
        activeMockTest.status[firstQ.id] = "not_answered";
      }
      renderApp();
    }
  },

  selectMockOption(optionIndex) {
    if (!activeMockTest) return;
    const curSec = activeMockTest.sections[activeMockTest.currentSectionIndex];
    const allQ = [...(curSec.secA || []), ...(curSec.secB || [])];
    const q = allQ[activeMockTest.currentQuestionIndex];
    if (!q) return;

    activeMockTest.answers[q.id] = optionIndex;
    renderApp();
  },

  inputNumericalKey(key) {
    if (!activeMockTest) return;
    const curSec = activeMockTest.sections[activeMockTest.currentSectionIndex];
    const allQ = [...(curSec.secA || []), ...(curSec.secB || [])];
    const q = allQ[activeMockTest.currentQuestionIndex];
    if (!q) return;

    let val = activeMockTest.answers[q.id] !== undefined ? String(activeMockTest.answers[q.id]) : "";

    if (key === "CLEAR") {
      val = "";
    } else if (key === "BACKSPACE") {
      val = val.slice(0, -1);
    } else if (key === ".") {
      if (!val.includes(".")) val += ".";
    } else if (key === "-") {
      if (val === "") val = "-";
    } else if (/^[0-9]$/.test(key)) {
      if (val.length < 8) val += key;
    }

    activeMockTest.answers[q.id] = val;
    const inputEl = document.getElementById("nta-num-input");
    if (inputEl) inputEl.value = val;
  },

  saveAndNext() {
    if (!activeMockTest) return;
    const curSec = activeMockTest.sections[activeMockTest.currentSectionIndex];
    const allQ = [...(curSec.secA || []), ...(curSec.secB || [])];
    const q = allQ[activeMockTest.currentQuestionIndex];
    if (!q) return;

    const hasAns = activeMockTest.answers[q.id] !== undefined && activeMockTest.answers[q.id] !== "";
    activeMockTest.status[q.id] = hasAns ? "answered" : "not_answered";

    // Advance to next question or section
    if (activeMockTest.currentQuestionIndex < allQ.length - 1) {
      activeMockTest.currentQuestionIndex++;
      const nextQ = allQ[activeMockTest.currentQuestionIndex];
      if (activeMockTest.status[nextQ.id] === "not_visited") {
        activeMockTest.status[nextQ.id] = "not_answered";
      }
    } else if (activeMockTest.currentSectionIndex < activeMockTest.sections.length - 1) {
      activeMockTest.currentSectionIndex++;
      activeMockTest.currentQuestionIndex = 0;
      const nextSec = activeMockTest.sections[activeMockTest.currentSectionIndex];
      const nextQ = (nextSec.secA && nextSec.secA[0]) || (nextSec.secB && nextSec.secB[0]);
      if (nextQ && activeMockTest.status[nextQ.id] === "not_visited") {
        activeMockTest.status[nextQ.id] = "not_answered";
      }
    }
    renderApp();
  },

  saveAndMarkReview() {
    if (!activeMockTest) return;
    const curSec = activeMockTest.sections[activeMockTest.currentSectionIndex];
    const allQ = [...(curSec.secA || []), ...(curSec.secB || [])];
    const q = allQ[activeMockTest.currentQuestionIndex];
    if (!q) return;

    const hasAns = activeMockTest.answers[q.id] !== undefined && activeMockTest.answers[q.id] !== "";
    // Answered & Marked for review is considered for evaluation
    activeMockTest.status[q.id] = hasAns ? "answered_review" : "review";

    if (activeMockTest.currentQuestionIndex < allQ.length - 1) {
      activeMockTest.currentQuestionIndex++;
      const nextQ = allQ[activeMockTest.currentQuestionIndex];
      if (activeMockTest.status[nextQ.id] === "not_visited") {
        activeMockTest.status[nextQ.id] = "not_answered";
      }
    }
    renderApp();
  },

  markReviewAndNext() {
    if (!activeMockTest) return;
    const curSec = activeMockTest.sections[activeMockTest.currentSectionIndex];
    const allQ = [...(curSec.secA || []), ...(curSec.secB || [])];
    const q = allQ[activeMockTest.currentQuestionIndex];
    if (!q) return;

    activeMockTest.status[q.id] = "review";

    if (activeMockTest.currentQuestionIndex < allQ.length - 1) {
      activeMockTest.currentQuestionIndex++;
      const nextQ = allQ[activeMockTest.currentQuestionIndex];
      if (activeMockTest.status[nextQ.id] === "not_visited") {
        activeMockTest.status[nextQ.id] = "not_answered";
      }
    }
    renderApp();
  },

  clearMockAnswer() {
    if (!activeMockTest) return;
    const curSec = activeMockTest.sections[activeMockTest.currentSectionIndex];
    const allQ = [...(curSec.secA || []), ...(curSec.secB || [])];
    const q = allQ[activeMockTest.currentQuestionIndex];
    if (!q) return;

    delete activeMockTest.answers[q.id];
    activeMockTest.status[q.id] = "not_answered";
    renderApp();
  },

  jumpToMockQuestion(qIndex) {
    if (!activeMockTest) return;
    const curSec = activeMockTest.sections[activeMockTest.currentSectionIndex];
    const allQ = [...(curSec.secA || []), ...(curSec.secB || [])];
    if (qIndex >= 0 && qIndex < allQ.length) {
      const curQ = allQ[activeMockTest.currentQuestionIndex];
      if (curQ && activeMockTest.status[curQ.id] === "not_visited" && activeMockTest.answers[curQ.id] === undefined) {
        activeMockTest.status[curQ.id] = "not_answered";
      }

      activeMockTest.currentQuestionIndex = qIndex;
      const targetQ = allQ[qIndex];
      if (targetQ && activeMockTest.status[targetQ.id] === "not_visited") {
        activeMockTest.status[targetQ.id] = "not_answered";
      }
      renderApp();
    }
  },

  promptSubmitExamModal() {
    if (!activeMockTest) return;
    const test = activeMockTest;
    const modalContainer = document.getElementById("modal-container");

    // Calculate section summary statistics for official dialog
    const summaryRows = test.sections.map(sec => {
      const questions = [...(sec.secA || []), ...(sec.secB || [])];
      let answered = 0;
      let notAnswered = 0;
      let review = 0;
      let answeredReview = 0;
      let notVisited = 0;

      questions.forEach(q => {
        const st = test.status[q.id] || "not_visited";
        if (st === "answered") answered++;
        else if (st === "not_answered") notAnswered++;
        else if (st === "review") review++;
        else if (st === "answered_review") answeredReview++;
        else notVisited++;
      });

      return {
        name: sec.name,
        total: questions.length,
        answered,
        notAnswered,
        review,
        answeredReview,
        notVisited
      };
    });

    modalContainer.innerHTML = `
      <div class="modal-overlay" onclick="if(event.target === this) window.RecallMateApp.closeModals()">
        <div class="modal-content" style="max-width: 800px;">
          <div style="border-bottom: 2px solid var(--lavender-500); padding-bottom: 12px; margin-bottom: 16px;">
            <h3 style="font-size: 1.25rem; font-weight: 700;">Examination Summary: ${test.examName}</h3>
            <span style="font-size: 0.8rem; color: var(--text-muted);">Please review your response statistics across all sections before final submission.</span>
          </div>

          <div style="overflow-x: auto; margin-bottom: 20px;">
            <table style="width: 100%; border-collapse: collapse; font-size: 0.85rem; text-align: center;">
              <thead>
                <tr style="background: var(--bg-surface-subtle); border-bottom: 2px solid var(--border-subtle);">
                  <th style="padding: 10px; text-align: left;">Section Name</th>
                  <th style="padding: 10px;">Total Qs</th>
                  <th style="padding: 10px; color: #16A34A;">Answered</th>
                  <th style="padding: 10px; color: #DC2626;">Not Answered</th>
                  <th style="padding: 10px; color: var(--lavender-600);">Marked for Review</th>
                  <th style="padding: 10px; color: #2563EB;">Answered & Marked (Evaluated)</th>
                  <th style="padding: 10px; color: #64748B;">Not Visited</th>
                </tr>
              </thead>
              <tbody>
                ${summaryRows.map(row => `
                  <tr style="border-bottom: 1px solid var(--border-subtle);">
                    <td style="padding: 10px; text-align: left; font-weight: 600;">${row.name}</td>
                    <td style="padding: 10px; font-weight: 600;">${row.total}</td>
                    <td style="padding: 10px; color: #16A34A; font-weight: 700;">${row.answered}</td>
                    <td style="padding: 10px; color: #DC2626;">${row.notAnswered}</td>
                    <td style="padding: 10px; color: var(--lavender-600);">${row.review}</td>
                    <td style="padding: 10px; color: #2563EB; font-weight: 600;">${row.answeredReview}</td>
                    <td style="padding: 10px; color: #64748B;">${row.notVisited}</td>
                  </tr>
                `).join("")}
              </tbody>
            </table>
          </div>

          <div style="background: rgba(225, 29, 72, 0.08); border-left: 4px solid var(--accent-rose); padding: 12px 16px; border-radius: 6px; font-size: 0.825rem; color: var(--text-primary); margin-bottom: 20px;">
            <strong>⚠️ Final Submission Confirmation:</strong> Are you sure you want to submit your examination? Once submitted, you cannot change any answers or resume this test session.
          </div>

          <div style="display: flex; justify-content: flex-end; gap: 12px;">
            <button class="btn btn-secondary" onclick="window.RecallMateApp.closeModals()">No, Return to Examination</button>
            <button class="btn btn-primary" onclick="window.RecallMateApp.finalizeMockTest()" style="background: #16A34A;">Yes, Final Submit & View Scorecard</button>
          </div>
        </div>
      </div>
    `;
  },

  finalizeMockTest() {
    if (!activeMockTest) return;
    if (mockTimerInterval) clearInterval(mockTimerInterval);

    const test = activeMockTest;
    const isUpsc = test.examId === "upsc-cse";
    const correctMarks = isUpsc ? 2.0 : 4.0;
    const negativePenalty = isUpsc ? 0.66 : 1.0;

    let totalCorrect = 0;
    let totalIncorrect = 0;
    let totalUnattempted = 0;
    const missedConcepts = [];
    const sectionReports = [];
    const allQuestionsFlat = [];

    test.sections.forEach(sec => {
      const questions = [...(sec.secA || []), ...(sec.secB || [])];
      let secCorrect = 0;
      let secIncorrect = 0;
      let secUnattempted = 0;

      questions.forEach(q => {
        allQuestionsFlat.push(q);
        const ans = test.answers[q.id];
        const status = test.status[q.id] || "not_visited";
        const isAnswered = ans !== undefined && ans !== "";

        if (!isAnswered) {
          secUnattempted++;
          totalUnattempted++;
          q.candidateStatus = "unattempted";
        } else {
          let isCorrect = false;
          if (q.type === "numerical") {
            const numAns = parseFloat(ans);
            const correctNum = parseFloat(q.correctValue);
            isCorrect = Math.abs(numAns - correctNum) <= (q.tolerance || 0.1);
          } else {
            isCorrect = ans === q.correctIndex;
          }

          if (isCorrect) {
            secCorrect++;
            totalCorrect++;
            q.candidateStatus = "correct";
          } else {
            secIncorrect++;
            totalIncorrect++;
            q.candidateStatus = "incorrect";
            missedConcepts.push(q.chapter || q.subject);
          }
        }
        q.candidateAnswer = ans;
      });

      const secNetMarks = (secCorrect * correctMarks) - (secIncorrect * negativePenalty);
      sectionReports.push({
        sectionName: sec.name,
        total: questions.length,
        correct: secCorrect,
        incorrect: secIncorrect,
        unattempted: secUnattempted,
        netMarks: Math.round(secNetMarks * 100) / 100,
        accuracy: (secCorrect + secIncorrect) > 0 ? Math.round((secCorrect / (secCorrect + secIncorrect)) * 100) : 0
      });
    });

    const netScore = Math.max(0, Math.round(((totalCorrect * correctMarks) - (totalIncorrect * negativePenalty)) * 100) / 100);
    const maxMarks = allQuestionsFlat.length * correctMarks;
    const totalAttempted = totalCorrect + totalIncorrect;
    const overallAccuracy = totalAttempted > 0 ? Math.round((totalCorrect / totalAttempted) * 100) : 0;

    // Realistic NTA Percentile Estimator:
    const rawRatio = maxMarks > 0 ? (netScore / maxMarks) : 0;
    const estimatedPercentile = Math.min(99.98, Math.max(50.0, Math.round((55 + rawRatio * 44.8) * 100) / 100));

    const result = {
      examId: test.examId,
      examName: test.examName,
      conductingBody: test.conductingBody,
      score: netScore,
      totalMarks: maxMarks,
      percentile: estimatedPercentile,
      correctCount: totalCorrect,
      incorrectCount: totalIncorrect,
      unattemptedCount: totalUnattempted,
      accuracy: overallAccuracy,
      timeSpentSeconds: test.totalDuration - test.secondsRemaining,
      sectionReports,
      missedConcepts: Array.from(new Set(missedConcepts)),
      allQuestions: allQuestionsFlat
    };

    store.saveMockTestResult(result);
    activeMockTest = null;
    renderApp();
    window.RecallMateApp.openMockResultModal(result, allQuestionsFlat);
  },

  // Modals & Navigation
  openSearchModal() {
    const modalContainer = document.getElementById("modal-container");
    if (!modalContainer) return;

    modalContainer.innerHTML = `
      <div class="modal-overlay" onclick="if(event.target === this) window.RecallMateApp.closeModals()">
        <div class="modal-content" style="max-width: 650px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
            <h3 style="font-size: 1.1rem; font-weight: 700;">Global Educational Search</h3>
            <button class="btn btn-secondary btn-sm" onclick="window.RecallMateApp.closeModals()">✕</button>
          </div>
          <input
            type="text"
            id="global-search-input"
            placeholder="Type topic, chapter, formula, or exam name..."
            style="width: 100%; padding: 12px 14px; border-radius: 10px; border: 1px solid var(--border-subtle); background: var(--bg-surface); color: var(--text-primary); font-size: 1rem; margin-bottom: 16px;"
            oninput="window.RecallMateApp.handleGlobalSearch(this.value)"
            autofocus
          />
          <div id="search-modal-results" style="max-height: 400px; overflow-y: auto; display: flex; flex-direction: column; gap: 8px;">
            <div style="text-align: center; color: var(--text-muted); padding: 24px;">Search across school curricula, competitive exams, official resources, and PYQs.</div>
          </div>
        </div>
      </div>
    `;
    setTimeout(() => {
      const inp = document.getElementById("global-search-input");
      if (inp) inp.focus();
    }, 50);
  },

  async handleGlobalSearch(query) {
    const container = document.getElementById("search-modal-results");
    if (!container) return;
    if (!query.trim()) {
      container.innerHTML = `<div style="text-align: center; color: var(--text-muted); padding: 24px;">Type to search...</div>`;
      return;
    }

    const { results } = await searchEducationalResources({ query });
    const localTopics = store.get().topics.filter(t => t.name.toLowerCase().includes(query.toLowerCase()) || t.subject.toLowerCase().includes(query.toLowerCase()));

    let html = "";
    if (localTopics.length > 0) {
      html += `<div style="font-size: 0.75rem; font-weight: 700; color: var(--text-muted); margin-top: 8px;">YOUR SAVED TOPICS</div>`;
      localTopics.forEach(t => {
        html += `
          <a href="#/recovery" onclick="window.RecallMateApp.closeModals()" style="padding: 10px; background: var(--bg-surface-subtle); border-radius: 8px; text-decoration: none; color: inherit; display: block;">
            <strong>${t.name}</strong> <span style="font-size: 0.75rem; color: var(--text-muted);">&bull; ${t.subject}</span>
          </a>
        `;
      });
    }

    if (results.length > 0) {
      html += `<div style="font-size: 0.75rem; font-weight: 700; color: var(--text-muted); margin-top: 8px;">OFFICIAL & EXTERNAL RESOURCES</div>`;
      results.slice(0, 6).forEach(res => {
        html += `
          <a href="${res.directUrl}" target="_blank" rel="noopener noreferrer" style="padding: 10px; background: var(--bg-surface-subtle); border-radius: 8px; text-decoration: none; color: inherit; display: block;">
            <div style="font-weight: 600; font-size: 0.9rem;">${res.name} ↗</div>
            <div style="font-size: 0.75rem; color: var(--text-muted);">${res.examination} &bull; ${res.resourceType} &bull; ${res.sourceWebsite}</div>
          </a>
        `;
      });
    }

    container.innerHTML = html || `<div style="text-align: center; color: var(--text-muted); padding: 24px;">No matching results found.</div>`;
  },

  openGoalSwitcher() {
    const modalContainer = document.getElementById("modal-container");
    const profile = store.get().userProfile;

    modalContainer.innerHTML = `
      <div class="modal-overlay" onclick="if(event.target === this) window.RecallMateApp.closeModals()">
        <div class="modal-content">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
            <h3 style="font-size: 1.1rem; font-weight: 700;">Personalize Class & Examination Goal</h3>
            <button class="btn btn-secondary btn-sm" onclick="window.RecallMateApp.closeModals()">✕</button>
          </div>
          <form onsubmit="window.RecallMateApp.saveGoalSwitcher(event)">
            <div style="margin-bottom: 14px;">
              <label style="font-size: 0.8rem; font-weight: 600; display: block; margin-bottom: 6px;">SELECT YOUR CURRENT CLASS</label>
              <select id="switcher-class" style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid var(--border-subtle); background: var(--bg-surface); color: var(--text-primary);">
                ${CLASS_LEVELS.map(c => `
                  <option value="${c.label}" ${profile.classLevel === c.label ? "selected" : ""}>${c.label} (${c.stage})</option>
                `).join("")}
              </select>
            </div>

            <div style="margin-bottom: 18px;">
              <label style="font-size: 0.8rem; font-weight: 600; display: block; margin-bottom: 6px;">TARGET COMPETITIVE EXAMINATION</label>
              <select id="switcher-exam" style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid var(--border-subtle); background: var(--bg-surface); color: var(--text-primary);">
                <option value="none">School Board Focus (CBSE / ICSE / State)</option>
                ${Object.values(EXAMS_REGISTRY).map(e => `
                  <option value="${e.id}" ${profile.targetExam === e.id ? "selected" : ""}>${e.name} (${e.category.toUpperCase()})</option>
                `).join("")}
              </select>
            </div>

            <button type="submit" class="btn btn-primary" style="width: 100%;">Update Active Learning Goal</button>
          </form>
        </div>
      </div>
    `;
  },

  saveGoalSwitcher(e) {
    e.preventDefault();
    const classLevel = document.getElementById("switcher-class").value;
    const targetExam = document.getElementById("switcher-exam").value;
    store.setGoal(classLevel, targetExam);
    window.RecallMateApp.closeModals();
  },

  openProfileModal() {
    const modalContainer = document.getElementById("modal-container");
    const profile = store.get().userProfile;

    modalContainer.innerHTML = `
      <div class="modal-overlay" onclick="if(event.target === this) window.RecallMateApp.closeModals()">
        <div class="modal-content">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
            <h3 style="font-size: 1.1rem; font-weight: 700;">Student Profile & Study Commitment</h3>
            <button class="btn btn-secondary btn-sm" onclick="window.RecallMateApp.closeModals()">✕</button>
          </div>
          <form onsubmit="window.RecallMateApp.saveProfileForm(event)">
            <div style="margin-bottom: 12px;">
              <label style="font-size: 0.8rem; font-weight: 600; display: block; margin-bottom: 6px;">STUDENT NAME</label>
              <input type="text" id="prof-name" value="${escapeHtml(profile.name || "Student")}" style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid var(--border-subtle); background: var(--bg-surface); color: var(--text-primary);" required />
            </div>
            <div style="margin-bottom: 16px;">
              <label style="font-size: 0.8rem; font-weight: 600; display: block; margin-bottom: 6px;">DAILY STUDY TARGET (HOURS)</label>
              <input type="number" step="0.5" id="prof-hours" value="${profile.dailyTargetHours || 3.5}" min="1" max="14" style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid var(--border-subtle); background: var(--bg-surface); color: var(--text-primary);" required />
            </div>
            <button type="submit" class="btn btn-primary" style="width: 100%;">Save Profile</button>
          </form>
        </div>
      </div>
    `;
  },

  saveProfileForm(e) {
    e.preventDefault();
    const name = document.getElementById("prof-name").value.trim();
    const hours = parseFloat(document.getElementById("prof-hours").value);
    store.updateProfile({ name, dailyTargetHours: hours });
    window.RecallMateApp.closeModals();
  },

  openNotificationsModal() {
    const revisions = getRevisionsDueToday();
    const modalContainer = document.getElementById("modal-container");

    modalContainer.innerHTML = `
      <div class="modal-overlay" onclick="if(event.target === this) window.RecallMateApp.closeModals()">
        <div class="modal-content">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
            <h3 style="font-size: 1.1rem; font-weight: 700;">Notifications & Deadlines</h3>
            <button class="btn btn-secondary btn-sm" onclick="window.RecallMateApp.closeModals()">✕</button>
          </div>
          ${revisions.length === 0 ? `
            <div style="text-align: center; padding: 24px; color: var(--text-muted);">No urgent revision tasks pending today. Great work!</div>
          ` : `
            <div style="display: flex; flex-direction: column; gap: 10px;">
              ${revisions.map(r => `
                <div style="padding: 10px; background: var(--bg-surface-subtle); border-radius: 8px; display: flex; justify-content: space-between; align-items: center;">
                  <div>
                    <div style="font-weight: 600; font-size: 0.875rem;">Spaced Revision Due: Day ${r.dayOffset}</div>
                    <div style="font-size: 0.75rem; color: var(--text-muted);">Due date: ${r.dueDate}</div>
                  </div>
                  <button class="btn btn-primary btn-sm" onclick="window.RecallMateApp.completeRevisionItem('${r.id}'); window.RecallMateApp.closeModals();">Review Now</button>
                </div>
              `).join("")}
            </div>
          `}
        </div>
      </div>
    `;
  },

  // Note Upload & Add Modal
  openAddNoteModal() {
    const modalContainer = document.getElementById("modal-container");
    const profile = store.get().userProfile;

    modalContainer.innerHTML = `
      <div class="modal-overlay" onclick="if(event.target === this) window.RecallMateApp.closeModals()">
        <div class="modal-content" style="max-width: 650px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
            <h3 style="font-size: 1.15rem; font-weight: 700;">Upload Study Material or Enter Note</h3>
            <button class="btn btn-secondary btn-sm" onclick="window.RecallMateApp.closeModals()">✕</button>
          </div>
          <form onsubmit="window.RecallMateApp.submitNoteForm(event)">
            <div style="margin-bottom: 12px;">
              <label style="font-size: 0.8rem; font-weight: 600; display: block; margin-bottom: 6px;">NOTE TITLE</label>
              <input type="text" id="note-title" placeholder="e.g. Thermodynamics Chapter Summary" style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid var(--border-subtle); background: var(--bg-surface); color: var(--text-primary);" required />
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px;">
              <div>
                <label style="font-size: 0.8rem; font-weight: 600; display: block; margin-bottom: 6px;">SUBJECT</label>
                <input type="text" id="note-subject" placeholder="Physics, Chemistry, Maths, History..." style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid var(--border-subtle); background: var(--bg-surface); color: var(--text-primary);" required />
              </div>
              <div>
                <label style="font-size: 0.8rem; font-weight: 600; display: block; margin-bottom: 6px;">CLASS LEVEL</label>
                <select id="note-class" style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid var(--border-subtle); background: var(--bg-surface); color: var(--text-primary);">
                  ${CLASS_LEVELS.map(c => `<option value="${c.label}" ${c.label === profile.classLevel ? "selected" : ""}>${c.label}</option>`).join("")}
                </select>
              </div>
            </div>

            <div style="margin-bottom: 14px;">
              <label style="font-size: 0.8rem; font-weight: 600; display: block; margin-bottom: 6px;">UPLOAD FILE (PDF, DOCX, TXT, OR NOTE IMAGE)</label>
              <input type="file" id="note-file-input" accept=".pdf,.docx,.txt,.md,.png,.jpg,.jpeg" style="font-size: 0.85rem;" onchange="window.RecallMateApp.handleFileSelected(this)" />
              <div id="file-status-info" style="font-size: 0.75rem; color: var(--accent-emerald); margin-top: 4px;"></div>
            </div>

            <div style="margin-bottom: 18px;">
              <label style="font-size: 0.8rem; font-weight: 600; display: block; margin-bottom: 6px;">NOTE CONTENT / EXTRACTED TEXT</label>
              <textarea id="note-text-content" rows="5" placeholder="Or type/paste your revision notes directly here..." style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid var(--border-subtle); background: var(--bg-surface); color: var(--text-primary); font-family: inherit; resize: vertical;" required></textarea>
            </div>

            <button type="submit" class="btn btn-primary" style="width: 100%; padding: 12px;" id="save-note-btn">Save & Generate 10 AI Outputs ✨</button>
          </form>
        </div>
      </div>
    `;
  },

  async handleFileSelected(input) {
    const file = input.files?.[0];
    if (!file) return;

    const status = document.getElementById("file-status-info");
    const textarea = document.getElementById("note-text-content");
    const title = document.getElementById("note-title");

    status.innerText = "Extracting text from " + file.name + "...";
    try {
      const parsed = await parseUploadedFile(file);
      textarea.value = parsed.text;
      if (!title.value) {
        title.value = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
      }
      status.innerText = `✓ Successfully extracted ${parsed.wordCount} words from ${file.name}.`;
    } catch (err) {
      status.innerText = "Error extracting file: " + err.message;
      status.style.color = "var(--accent-rose)";
    }
  },

  async submitNoteForm(e) {
    e.preventDefault();
    const title = document.getElementById("note-title").value.trim();
    const subject = document.getElementById("note-subject").value.trim();
    const classLevel = document.getElementById("note-class").value;
    const content = document.getElementById("note-text-content").value.trim();
    const saveBtn = document.getElementById("save-note-btn");
    if (!content) return;

    saveBtn.innerText = "Generating 10 AI Outputs...";
    saveBtn.disabled = true;

    try {
      const aiOutputs = await processUploadedNotes({
        noteTitle: title,
        noteContent: content,
        subject,
        classLevel,
        targetExam: store.get().userProfile.targetExam
      });

      const note = store.addNote({
        title,
        subject,
        classLevel,
        contentText: content,
        wordCount: content.split(/\s+/).filter(Boolean).length,
        fileName: title.toLowerCase().replace(/\s+/g, "_") + ".txt",
        fileType: "text",
        aiOutputs
      });

      window.RecallMateApp.closeModals();
      window.location.hash = "#/notes";
      window.RecallMateApp.openNoteDetailModal(note.id);
    } catch (err) {
      alert("Error processing notes: " + err.message);
      saveBtn.innerText = "Save & Generate 10 AI Outputs ✨";
      saveBtn.disabled = false;
    }
  },

  openNoteDetailModal(noteId) {
    const note = store.get().notes.find(n => n.id === noteId);
    if (!note) return;
    const ai = note.aiOutputs || {};
    const modalContainer = document.getElementById("modal-container");

    modalContainer.innerHTML = `
      <div class="modal-overlay" onclick="if(event.target === this) window.RecallMateApp.closeModals()">
        <div class="modal-content" style="max-width: 800px;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px; border-bottom: 1px solid var(--border-subtle); padding-bottom: 12px;">
            <div>
              <span class="nav-item-badge badge-purple">${note.subject} &bull; ${note.classLevel}</span>
              <h2 style="font-size: 1.25rem; font-weight: 700; margin-top: 4px;">${note.title}</h2>
            </div>
            <button class="btn btn-secondary btn-sm" onclick="window.RecallMateApp.closeModals()">✕</button>
          </div>

          <!-- Tabs for 10 Outputs -->
          <div style="display: flex; gap: 8px; overflow-x: auto; padding-bottom: 10px; margin-bottom: 16px;">
            <button class="btn btn-sm btn-primary" onclick="window.RecallMateApp.switchNoteTab('summary', this)">Summary</button>
            <button class="btn btn-sm btn-secondary" onclick="window.RecallMateApp.switchNoteTab('flashcards', this)">Flashcards (${ai.flashcards ? ai.flashcards.length : 0})</button>
            <button class="btn btn-sm btn-secondary" onclick="window.RecallMateApp.switchNoteTab('mcqs', this)">MCQ Quiz (${ai.mcqs ? ai.mcqs.length : 0})</button>
            <button class="btn btn-sm btn-secondary" onclick="window.RecallMateApp.switchNoteTab('formulas', this)">Formulas & Defs</button>
            <button class="btn btn-sm btn-secondary" onclick="window.RecallMateApp.switchNoteTab('questions', this)">Q&A</button>
          </div>

          <!-- Tab Contents -->
          <div id="note-tab-content" style="max-height: 480px; overflow-y: auto;">
            <!-- Summary Tab -->
            <div id="tab-summary">
              <h4 style="font-size: 1rem; font-weight: 700; margin-bottom: 8px;">Executive Summary</h4>
              <p style="font-size: 0.9rem; line-height: 1.6; color: var(--text-primary); margin-bottom: 16px;">${ai.summary || "Summary generated from note."}</p>

              <h4 style="font-size: 1rem; font-weight: 700; margin-bottom: 8px;">Key High-Yield Points</h4>
              <ul style="padding-left: 20px; font-size: 0.875rem; line-height: 1.6; margin-bottom: 16px;">
                ${(ai.keyPoints || []).map(p => `<li>${p}</li>`).join("")}
              </ul>
            </div>

            <!-- Flashcards Tab -->
            <div id="tab-flashcards" style="display: none;">
              <p style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 12px;">Click any card to flip and test your recall:</p>
              <div style="display: grid; gap: 14px;">
                ${(ai.flashcards || []).map((fc, i) => `
                  <div class="flashcard-scene" onclick="this.querySelector('.flashcard-inner').classList.toggle('is-flipped')">
                    <div class="flashcard-inner">
                      <div class="flashcard-face flashcard-front">
                        <span style="font-size: 0.72rem; color: var(--lavender-500); font-weight: 700; margin-bottom: 8px;">CARD ${i + 1} &bull; FRONT (CLICK TO FLIP)</span>
                        <div style="font-size: 1rem; font-weight: 600;">${fc.front}</div>
                      </div>
                      <div class="flashcard-face flashcard-back">
                        <span style="font-size: 0.72rem; color: var(--accent-emerald); font-weight: 700; margin-bottom: 8px;">RECALL ANSWER</span>
                        <div style="font-size: 0.95rem;">${fc.back}</div>
                      </div>
                    </div>
                  </div>
                `).join("")}
              </div>
            </div>

            <!-- MCQs Tab -->
            <div id="tab-mcqs" style="display: none;">
              ${(ai.mcqs || []).map((q, qIdx) => `
                <div style="padding: 14px; background: var(--bg-surface-subtle); border-radius: 10px; margin-bottom: 14px; border: 1px solid var(--border-subtle);">
                  <div style="font-weight: 600; font-size: 0.95rem; margin-bottom: 10px;">${qIdx + 1}. ${q.question}</div>
                  <div style="display: flex; flex-direction: column; gap: 6px;">
                    ${q.options.map((opt, oIdx) => `
                      <button
                        class="btn btn-secondary btn-sm"
                        style="justify-content: flex-start; text-align: left;"
                        onclick="this.style.background = ${oIdx === q.correctIndex} ? 'rgba(16, 185, 129, 0.2)' : 'rgba(225, 29, 72, 0.2)'; alert('${oIdx === q.correctIndex ? "Correct!" : "Incorrect."} ' + '${q.explanation}')"
                      >
                        ${String.fromCharCode(65 + oIdx)}. ${opt}
                      </button>
                    `).join("")}
                  </div>
                </div>
              `).join("")}
            </div>

            <!-- Formulas & Defs Tab -->
            <div id="tab-formulas" style="display: none;">
              <h4 style="font-size: 0.95rem; font-weight: 700; margin-bottom: 8px;">Formulas</h4>
              ${(ai.formulas || []).map(f => `
                <div style="padding: 10px; background: var(--bg-surface-subtle); border-radius: 8px; margin-bottom: 8px;">
                  <strong>${f.name}:</strong> <code>${f.formula}</code>
                </div>
              `).join("")}

              <h4 style="font-size: 0.95rem; font-weight: 700; margin: 16px 0 8px 0;">Definitions</h4>
              ${(ai.definitions || []).map(d => `
                <div style="padding: 10px; background: var(--bg-surface-subtle); border-radius: 8px; margin-bottom: 8px;">
                  <strong>${d.term}:</strong> ${d.definition}
                </div>
              `).join("")}
            </div>

            <!-- Q&A Tab -->
            <div id="tab-questions" style="display: none;">
              <h4 style="font-size: 0.95rem; font-weight: 700; margin-bottom: 8px;">Short & Long Answer Practice</h4>
              ${(ai.shortQuestions || []).map(sq => `
                <div style="padding: 12px; background: var(--bg-surface-subtle); border-radius: 8px; margin-bottom: 10px;">
                  <strong style="color: var(--lavender-600);">Q: ${sq.q}</strong>
                  <div style="margin-top: 6px; font-size: 0.85rem; color: var(--text-secondary);">Model Answer: ${sq.modelAnswer}</div>
                </div>
              `).join("")}
            </div>
          </div>
        </div>
      </div>
    `;
  },

  switchNoteTab(tabName, btn) {
    const parent = btn.parentElement;
    parent.querySelectorAll("button").forEach(b => b.className = "btn btn-sm btn-secondary");
    btn.className = "btn btn-sm btn-primary";

    ["summary", "flashcards", "mcqs", "formulas", "questions"].forEach(t => {
      const el = document.getElementById("tab-" + t);
      if (el) el.style.display = t === tabName ? "block" : "none";
    });
  },

  deleteNoteItem(noteId) {
    if (confirm("Are you sure you want to delete this note?")) {
      store.deleteNote(noteId);
      renderApp();
    }
  },

  completeRevisionItem(revId) {
    store.completeRevision(revId);
    renderApp();
  },

  markRecoveryResolved(recId) {
    store.update(s => ({
      ...s,
      recoveries: s.recoveries.map(r => r.id === recId ? { ...r, status: "understood", quizCorrect: true, updatedAt: new Date().toISOString() } : r)
    }));
    renderApp();
  },

  openAddRecoveryModal() {
    const modalContainer = document.getElementById("modal-container");
    const topics = store.get().topics;

    modalContainer.innerHTML = `
      <div class="modal-overlay" onclick="if(event.target === this) window.RecallMateApp.closeModals()">
        <div class="modal-content">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
            <h3 style="font-size: 1.1rem; font-weight: 700;">Log Conceptual Stuckpoint</h3>
            <button class="btn btn-secondary btn-sm" onclick="window.RecallMateApp.closeModals()">✕</button>
          </div>
          <form onsubmit="window.RecallMateApp.submitRecoveryForm(event)">
            <div style="margin-bottom: 12px;">
              <label style="font-size: 0.8rem; font-weight: 600; display: block; margin-bottom: 6px;">SELECT TOPIC</label>
              <select id="rec-topic-select" style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid var(--border-subtle); background: var(--bg-surface); color: var(--text-primary);">
                ${topics.map(t => `<option value="${t.id}">${t.name} (${t.subject})</option>`).join("")}
              </select>
            </div>
            <div style="margin-bottom: 16px;">
              <label style="font-size: 0.8rem; font-weight: 600; display: block; margin-bottom: 6px;">WHAT EXACTLY DID YOU STRUGGLE WITH?</label>
              <textarea id="rec-concept-text" rows="3" placeholder="e.g. Differentiating when to apply Lenz's law vs motional EMF..." style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid var(--border-subtle); background: var(--bg-surface); color: var(--text-primary); font-family: inherit; resize: none;" required></textarea>
            </div>
            <button type="submit" class="btn btn-primary" style="width: 100%;">Create Stuckpoint Record</button>
          </form>
        </div>
      </div>
    `;
  },

  submitRecoveryForm(e) {
    e.preventDefault();
    const topicId = document.getElementById("rec-topic-select").value;
    const concept = document.getElementById("rec-concept-text").value.trim();
    if (!concept) return;

    store.saveRecovery(topicId, concept, "struggling", "Review this concept carefully. Focus on basic boundary definitions and practice 3 related numerical problems.");
    window.RecallMateApp.closeModals();
    window.location.hash = "#/recovery";
  },

  generateNewStudyPlan() {
    const profile = store.get().userProfile;
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const subjects = profile.targetExam === "neet-ug"
      ? ["Physics", "Chemistry", "Botany", "Zoology"]
      : ["Physics", "Chemistry", "Mathematics"];

    const schedule = days.map((dayName, idx) => {
      const subj = subjects[idx % subjects.length];
      return {
        dayName,
        focusSubject: subj,
        tasks: [
          { text: `Review high-weightage chapter theory in ${subj} (60m)`, completed: false },
          { text: `Solve 10 past examination PYQs with timer (45m)`, completed: false },
          { text: `Complete today's spaced repetition cards in NOVORA (20m)`, completed: false },
          { text: `Log any difficult questions into Stuckpoint Recovery`, completed: false }
        ]
      };
    });

    store.saveStudyPlan({
      goal: `${profile.classLevel} &bull; ${profile.targetExam ? profile.targetExam.toUpperCase() : "Board Examinations"}`,
      dailyHours: profile.dailyTargetHours || 3.5,
      weakFocus: "Electromagnetism & Calculus Mechanics",
      schedule
    });
    renderApp();
  },

  togglePlanTask(dIdx, tIdx) {
    store.togglePlanTask(dIdx, tIdx);
    renderApp();
  },

  async submitAcademicDoubt(e) {
    e.preventDefault();
    const subject = document.getElementById("doubt-subject").value;
    const text = document.getElementById("doubt-text").value.trim();
    const container = document.getElementById("doubt-solution-container");
    if (!text) return;

    container.innerHTML = `<div style="text-align: center; padding: 32px;"><div style="font-size: 2rem; animation: spin 1s linear infinite; display: inline-block;">⚡</div><p style="margin-top: 8px;">Solving doubt and analyzing options...</p></div>`;

    const solution = await solveAcademicDoubt({
      questionText: text,
      subject,
      targetExam: store.get().userProfile.targetExam
    });

    container.innerHTML = `
      <div style="border-left: 4px solid var(--accent-emerald);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
          <span class="nav-item-badge badge-purple">${solution.subject}</span>
          <span style="font-size: 0.75rem; color: var(--accent-emerald); font-weight: 600;">✓ Verified Solution</span>
        </div>
        <h4 style="font-size: 1rem; font-weight: 700; margin-bottom: 8px;">Step-by-Step Derivation</h4>
        <ol style="padding-left: 20px; font-size: 0.875rem; line-height: 1.6; margin-bottom: 16px;">
          ${solution.stepByStepSolution.map(s => `<li>${s}</li>`).join("")}
        </ol>

        <h4 style="font-size: 0.95rem; font-weight: 700; margin-bottom: 6px; color: var(--accent-emerald);">Why Correct Option Works:</h4>
        <p style="font-size: 0.85rem; line-height: 1.5; margin-bottom: 14px;">${solution.correctAnswerReasoning}</p>

        <h4 style="font-size: 0.95rem; font-weight: 700; margin-bottom: 6px; color: var(--accent-rose);">Diagnostic: Why Other Options Fail</h4>
        <div style="display: flex; flex-direction: column; gap: 6px; margin-bottom: 14px;">
          ${solution.wrongOptionsAnalysis.map(w => `
            <div style="font-size: 0.8rem; padding: 6px 10px; background: var(--bg-surface-subtle); border-radius: 6px;">
              <strong>${w.option}:</strong> ${w.reason}
            </div>
          `).join("")}
        </div>

        <div style="padding: 10px; background: rgba(19, 134, 95, 0.1); border-radius: 8px; font-size: 0.8rem;">
          <strong>⚡ Shortcut:</strong> ${solution.shortcutMethod}
        </div>
      </div>
    `;
  },

  previewDoubtImage(input) {
    const file = input.files?.[0];
    const preview = document.getElementById("doubt-image-preview");
    if (file && preview) {
      const reader = new FileReader();
      reader.onload = () => {
        preview.innerHTML = `<img src="${reader.result}" style="max-height: 120px; border-radius: 8px; border: 1px solid var(--border-subtle);" />`;
      };
      reader.readAsDataURL(file);
    }
  },

  openMockResultModal(result, questions) {
    const modalContainer = document.getElementById("modal-container");
    const isUpsc = result.examId === "upsc-cse";
    const penaltyPerWrong = isUpsc ? 0.66 : 1.0;
    const penaltyTotal = Math.round(result.incorrectCount * penaltyPerWrong * 100) / 100;

    modalContainer.innerHTML = `
      <div class="modal-overlay" onclick="if(event.target === this) window.RecallMateApp.closeModals()">
        <div class="modal-content" style="max-width: 900px; max-height: 92vh; overflow-y: auto;">
          <!-- Scorecard Header -->
          <div style="border-bottom: 2px solid var(--lavender-500); padding-bottom: 14px; margin-bottom: 18px; display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 12px;">
            <div>
              <span class="nav-item-badge badge-purple">${result.conductingBody || "NTA"} Official Examination Scorecard</span>
              <h2 style="font-size: 1.35rem; font-weight: 700; margin-top: 4px;">${result.examName}</h2>
              <span style="font-size: 0.775rem; color: var(--text-muted);">Evaluation completed with official marking rules & negative penalty deduction.</span>
            </div>
            <button class="btn btn-secondary btn-sm" onclick="window.RecallMateApp.closeModals()">✕</button>
          </div>

          <!-- 4-Card Performance Metrics -->
          <div class="metrics-grid" style="margin-bottom: 20px;">
            <div style="padding: 14px; background: var(--bg-surface-subtle); border-radius: 10px; text-align: center; border: 1px solid var(--border-subtle);">
              <div style="font-size: 1.5rem; font-weight: 800; color: var(--lavender-500);">${result.score} / ${result.totalMarks}</div>
              <div style="font-size: 0.75rem; font-weight: 600; color: var(--text-muted); margin-top: 2px;">Net Score (Marks)</div>
            </div>
            <div style="padding: 14px; background: var(--bg-surface-subtle); border-radius: 10px; text-align: center; border: 1px solid var(--border-subtle);">
              <div style="font-size: 1.5rem; font-weight: 800; color: #2563EB;">${result.percentile} %ile</div>
              <div style="font-size: 0.75rem; font-weight: 600; color: var(--text-muted); margin-top: 2px;">Estimated NTA Percentile</div>
            </div>
            <div style="padding: 14px; background: var(--bg-surface-subtle); border-radius: 10px; text-align: center; border: 1px solid var(--border-subtle);">
              <div style="font-size: 1.5rem; font-weight: 800; color: #16A34A;">${result.accuracy}%</div>
              <div style="font-size: 0.75rem; font-weight: 600; color: var(--text-muted); margin-top: 2px;">Accuracy Rate</div>
            </div>
            <div style="padding: 14px; background: var(--bg-surface-subtle); border-radius: 10px; text-align: center; border: 1px solid var(--border-subtle);">
              <div style="font-size: 1.5rem; font-weight: 800; color: #DC2626;">-${penaltyTotal}</div>
              <div style="font-size: 0.75rem; font-weight: 600; color: var(--text-muted); margin-top: 2px;">Negative Marking Penalty</div>
            </div>
          </div>

          <!-- Section Breakdown Table -->
          ${result.sectionReports && result.sectionReports.length > 0 ? `
            <div style="margin-bottom: 24px;">
              <h4 style="font-size: 0.95rem; font-weight: 700; margin-bottom: 8px;">Subject-Wise Performance Breakdown</h4>
              <div style="overflow-x: auto; border: 1px solid var(--border-subtle); border-radius: 8px;">
                <table style="width: 100%; border-collapse: collapse; font-size: 0.825rem; text-align: center;">
                  <thead>
                    <tr style="background: var(--bg-surface-subtle); border-bottom: 1px solid var(--border-subtle);">
                      <th style="padding: 8px 12px; text-align: left;">Subject</th>
                      <th style="padding: 8px;">Total Qs</th>
                      <th style="padding: 8px; color: #16A34A;">Correct</th>
                      <th style="padding: 8px; color: #DC2626;">Incorrect</th>
                      <th style="padding: 8px;">Unattempted</th>
                      <th style="padding: 8px;">Net Marks</th>
                      <th style="padding: 8px;">Accuracy</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${result.sectionReports.map(sec => `
                      <tr style="border-bottom: 1px solid var(--border-subtle);">
                        <td style="padding: 8px 12px; text-align: left; font-weight: 600;">${sec.sectionName}</td>
                        <td style="padding: 8px;">${sec.total}</td>
                        <td style="padding: 8px; color: #16A34A; font-weight: 700;">${sec.correct}</td>
                        <td style="padding: 8px; color: #DC2626; font-weight: 700;">${sec.incorrect}</td>
                        <td style="padding: 8px; color: var(--text-muted);">${sec.unattempted}</td>
                        <td style="padding: 8px; font-weight: 700; color: var(--lavender-500);">${sec.netMarks}</td>
                        <td style="padding: 8px; font-weight: 600;">${sec.accuracy}%</td>
                      </tr>
                    `).join("")}
                  </tbody>
                </table>
              </div>
            </div>
          ` : ""}

          <!-- Missed Concepts / Weakness Diagnostics -->
          ${result.missedConcepts && result.missedConcepts.length > 0 ? `
            <div style="padding: 14px 18px; background: rgba(225, 29, 72, 0.08); border-left: 4px solid var(--accent-rose); border-radius: 8px; margin-bottom: 24px;">
              <strong style="color: var(--accent-rose); font-size: 0.85rem;">Weak Concepts Identified from Incorrect Responses:</strong>
              <div style="margin-top: 6px; font-size: 0.8rem; line-height: 1.5; color: var(--text-primary);">
                ${result.missedConcepts.map(c => `• <strong>${c}</strong> &mdash; <button class="btn btn-outline btn-sm" style="padding: 2px 8px; font-size: 0.7rem; margin-left: 6px;" onclick="window.RecallMateApp.addMissedConceptToRecovery('${c}')">Add to Stuckpoint Recovery 🛟</button>`).join("<br>")}
              </div>
            </div>
          ` : ""}

          <!-- Question-by-Question Solution Review Section -->
          <div style="border-top: 1px solid var(--border-subtle); padding-top: 18px; margin-bottom: 18px;">
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px; margin-bottom: 14px;">
              <h3 style="font-size: 1.05rem; font-weight: 700;">Detailed Question & Solution Review</h3>
              <!-- Review Filter Tabs -->
              <div style="display: flex; gap: 6px; flex-wrap: wrap;" id="review-filter-btns">
                <button class="btn btn-sm btn-primary" onclick="window.RecallMateApp.filterReviewTab('all', this)">All (${questions.length})</button>
                <button class="btn btn-sm btn-secondary" onclick="window.RecallMateApp.filterReviewTab('incorrect', this)">Incorrect (${result.incorrectCount})</button>
                <button class="btn btn-sm btn-secondary" onclick="window.RecallMateApp.filterReviewTab('unattempted', this)">Unattempted (${result.unattemptedCount})</button>
                <button class="btn btn-sm btn-secondary" onclick="window.RecallMateApp.filterReviewTab('correct', this)">Correct (${result.correctCount})</button>
              </div>
            </div>

            <!-- List of Questions with Solutions -->
            <div style="display: flex; flex-direction: column; gap: 14px;" id="review-questions-list">
              ${questions.map((q, idx) => {
                const status = q.candidateStatus || "unattempted";
                let badgeClass = "badge-purple";
                let badgeText = "Unattempted (0 Marks)";
                if (status === "correct") {
                  badgeClass = "badge-purple";
                  badgeText = `✓ Correct (+${isUpsc ? "2.0" : "4.0"} Marks)`;
                } else if (status === "incorrect") {
                  badgeClass = "badge-amber";
                  badgeText = `✗ Incorrect (-${isUpsc ? "0.66" : "1.0"} Marks)`;
                }

                return `
                  <div class="review-question-card" data-status="${status}" style="border: 1px solid var(--border-subtle); border-radius: 10px; padding: 16px; background: var(--bg-surface-subtle);">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                      <span style="font-weight: 700; font-size: 0.9rem;">Q${idx + 1}. ${q.subject} &bull; ${q.chapter || "General"}</span>
                      <span class="nav-item-badge ${status === "correct" ? "badge-purple" : (status === "incorrect" ? "badge-amber" : "badge-purple")}" style="${status === "correct" ? "background: rgba(16, 185, 129, 0.2); color: #059669;" : (status === "incorrect" ? "background: rgba(225, 29, 72, 0.2); color: #E11D48;" : "")}">
                        ${badgeText}
                      </span>
                    </div>

                    <div style="font-size: 0.925rem; line-height: 1.5; color: var(--text-primary); margin-bottom: 12px;">
                      ${q.question.replace(/\n/g, "<br>")}
                    </div>

                    ${q.type === "numerical" ? `
                      <div style="display: flex; gap: 14px; font-size: 0.85rem; margin-bottom: 12px; padding: 8px 12px; background: var(--bg-surface); border-radius: 6px;">
                        <div>Your Input: <strong>${q.candidateAnswer !== undefined ? q.candidateAnswer : "None"}</strong></div>
                        <div>Official Answer: <strong style="color: #16A34A;">${q.correctValue}</strong></div>
                      </div>
                    ` : `
                      <div style="display: flex; flex-direction: column; gap: 6px; margin-bottom: 12px;">
                        ${(q.options || []).map((opt, oIdx) => {
                          const isCand = q.candidateAnswer === oIdx;
                          const isCorr = q.correctIndex === oIdx;
                          let optStyle = "background: var(--bg-surface); border: 1px solid var(--border-subtle);";
                          if (isCorr) optStyle = "background: rgba(16, 185, 129, 0.15); border: 1.5px solid #16A34A; font-weight: 600;";
                          else if (isCand && !isCorr) optStyle = "background: rgba(225, 29, 72, 0.15); border: 1.5px solid #DC2626;";

                          return `
                            <div style="padding: 8px 12px; border-radius: 6px; font-size: 0.85rem; display: flex; justify-content: space-between; align-items: center; ${optStyle}">
                              <span><strong>(${oIdx + 1})</strong> ${opt}</span>
                              ${isCorr ? `<span style="color: #16A34A; font-weight: 700;">✓ Correct Key</span>` : ""}
                              ${isCand && !isCorr ? `<span style="color: #DC2626; font-weight: 700;">✗ Your Response</span>` : ""}
                            </div>
                          `;
                        }).join("")}
                      </div>
                    `}

                    <!-- Step-by-Step Derivation & Explanation -->
                    <div style="padding: 12px; background: var(--bg-surface); border-radius: 8px; font-size: 0.825rem; line-height: 1.5; border-left: 3px solid var(--lavender-500);">
                      <strong style="color: var(--lavender-500);">Official Step-by-Step Explanation:</strong>
                      <div style="margin-top: 4px; white-space: pre-wrap; color: var(--text-secondary);">${q.explanation}</div>
                    </div>
                  </div>
                `;
              }).join("")}
            </div>
          </div>

          <!-- Bottom Close Action -->
          <div style="display: flex; justify-content: flex-end; gap: 12px; border-top: 1px solid var(--border-subtle); padding-top: 14px;">
            <button class="btn btn-primary" onclick="window.RecallMateApp.closeModals()">Done & Return to Dashboard</button>
          </div>
        </div>
      </div>
    `;
  },

  filterReviewTab(filterType, btn) {
    const parent = document.getElementById("review-filter-btns");
    if (parent) {
      parent.querySelectorAll("button").forEach(b => b.className = "btn btn-sm btn-secondary");
      btn.className = "btn btn-sm btn-primary";
    }

    const cards = document.querySelectorAll(".review-question-card");
    cards.forEach(card => {
      const st = card.getAttribute("data-status");
      if (filterType === "all") {
        card.style.display = "block";
      } else if (filterType === st) {
        card.style.display = "block";
      } else {
        card.style.display = "none";
      }
    });
  },

  addMissedConceptToRecovery(conceptName) {
    const topic = store.get().topics[0] || {};
    store.saveRecovery(topic.id || "topic_general", conceptName, "struggling", `Missed during ${conceptName} examination simulation. Review fundamental principles and practice 5 PYQs.`);
    alert(`Added "${conceptName}" to your Stuckpoint Recovery list!`);
  },

  openSimilarQuestionModal(pyqId) {
    const item = PYQ_INTELLIGENCE_DATA.find(p => p.id === pyqId);
    if (!item) return;
    const sim = item.similarPracticeQuestion;
    const modalContainer = document.getElementById("modal-container");

    modalContainer.innerHTML = `
      <div class="modal-overlay" onclick="if(event.target === this) window.RecallMateApp.closeModals()">
        <div class="modal-content">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
            <h3 style="font-size: 1.1rem; font-weight: 700;">Conceptual Twin Practice</h3>
            <button class="btn btn-secondary btn-sm" onclick="window.RecallMateApp.closeModals()">✕</button>
          </div>
          <div style="font-size: 0.95rem; font-weight: 600; line-height: 1.5; margin-bottom: 16px;">
            ${sim.question}
          </div>
          <div style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 16px;">
            ${sim.options.map((opt, oIdx) => `
              <button
                class="btn btn-secondary"
                style="justify-content: flex-start; text-align: left;"
                onclick="this.style.background = ${oIdx === sim.correctIndex} ? 'rgba(16, 185, 129, 0.2)' : 'rgba(225, 29, 72, 0.2)'; alert('${oIdx === sim.correctIndex ? "Correct!" : "Incorrect."} ' + '${sim.explanation}')"
              >
                ${String.fromCharCode(65 + oIdx)}. ${opt}
              </button>
            `).join("")}
          </div>
        </div>
      </div>
    `;
  },

  toggleBookmark(resId) {
    store.toggleBookmarkResource(resId);
    renderApp();
  },

  saveApiSettings(e) {
    e.preventDefault();
    const geminiApiKey = document.getElementById("settings-gemini-key").value.trim();
    const searchApiKey = document.getElementById("settings-search-key").value.trim();
    const searchEngineCx = document.getElementById("settings-search-cx").value.trim();
    store.updateAiSettings({ geminiApiKey, searchApiKey, searchEngineCx });
    alert("Configuration successfully saved to local storage!");
    renderApp();
  },

  importBackupFile(input) {
    const file = input.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const res = store.importBackupJson(reader.result);
      if (res.success) {
        alert("Backup imported successfully!");
        renderApp();
      } else {
        alert("Error importing backup: " + res.error);
      }
    };
    reader.readAsText(file);
  },

  viewChapterModal(classId, subjectId, chapterId) {
    const classData = CURRICULUM_DATA[classId] || CURRICULUM_DATA["class-10"];
    const subject = classData.subjects.find(s => s.id === subjectId);
    if (!subject) return;
    const chapter = subject.chapters.find(c => c.id === chapterId);
    if (!chapter) return;

    const modalContainer = document.getElementById("modal-container");
    modalContainer.innerHTML = `
      <div class="modal-overlay" onclick="if(event.target === this) window.RecallMateApp.closeModals()">
        <div class="modal-content" style="max-width: 750px;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px; border-bottom: 1px solid var(--border-subtle); padding-bottom: 12px;">
            <div>
              <span class="nav-item-badge badge-purple">${subject.name} &bull; Chapter ${chapter.number}</span>
              <h2 style="font-size: 1.25rem; font-weight: 700; margin-top: 4px;">${chapter.title}</h2>
            </div>
            <button class="btn btn-secondary btn-sm" onclick="window.RecallMateApp.closeModals()">✕</button>
          </div>

          <div style="max-height: 480px; overflow-y: auto; padding-right: 6px;">
            <div style="padding: 12px; background: var(--bg-surface-subtle); border-radius: 8px; margin-bottom: 16px; font-size: 0.875rem; line-height: 1.5;">
              ${chapter.summary}
            </div>

            <h4 style="font-size: 1rem; font-weight: 700; margin-bottom: 8px;">Key Theoretical Points</h4>
            <ul style="padding-left: 20px; font-size: 0.85rem; line-height: 1.6; margin-bottom: 16px;">
              ${chapter.keyPoints.map(p => `<li>${p}</li>`).join("")}
            </ul>

            ${chapter.formulaSheet && chapter.formulaSheet.length > 0 ? `
              <h4 style="font-size: 1rem; font-weight: 700; margin-bottom: 8px;">Important Formulas</h4>
              <div style="display: flex; flex-direction: column; gap: 6px; margin-bottom: 16px;">
                ${chapter.formulaSheet.map(f => `
                  <div style="padding: 8px 12px; background: var(--bg-surface-subtle); border-radius: 6px; font-size: 0.85rem;">
                    <strong>${f.name}:</strong> <code>${f.formula}</code>
                  </div>
                `).join("")}
              </div>
            ` : ""}

            ${chapter.definitions && chapter.definitions.length > 0 ? `
              <h4 style="font-size: 1rem; font-weight: 700; margin-bottom: 8px;">Definitions</h4>
              <div style="display: flex; flex-direction: column; gap: 6px; margin-bottom: 16px;">
                ${chapter.definitions.map(d => `
                  <div style="padding: 8px 12px; background: var(--bg-surface-subtle); border-radius: 6px; font-size: 0.85rem;">
                    <strong>${d.term}:</strong> ${d.definition}
                  </div>
                `).join("")}
              </div>
            ` : ""}

            <h4 style="font-size: 1rem; font-weight: 700; margin-bottom: 8px;">Short Answer Practice</h4>
            ${(chapter.practiceQuestions?.shortAnswer || []).map(sq => `
              <div style="padding: 10px; background: var(--bg-surface-subtle); border-radius: 6px; margin-bottom: 8px; font-size: 0.85rem;">
                <strong style="color: var(--lavender-600);">Q: ${sq.q}</strong>
                <p style="margin-top: 4px; color: var(--text-secondary);">${sq.modelAnswer}</p>
              </div>
            `).join("")}
          </div>

          <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-subtle); padding-top: 14px; margin-top: 16px;">
            <button class="btn btn-secondary btn-sm" onclick="window.RecallMateApp.addChapterToPlanner('${chapter.title}', '${subject.name}', '${classId}')">📅 Add to Revision Planner</button>
            <button class="btn btn-primary btn-sm" onclick="window.RecallMateApp.closeModals(); window.RecallMateApp.startChapterQuiz('${classId}', '${subjectId}', '${chapterId}')">Take Chapter Quiz (${chapter.mcqQuiz.length} Qs) &rarr;</button>
          </div>
        </div>
      </div>
    `;
  },

  addChapterToPlanner(title, subject, classLevel) {
    store.addTopic({
      name: title,
      subject,
      classLevel,
      dateStudied: new Date().toISOString().slice(0, 10),
      notes: `Studied key points and formulas for ${title}.`,
      understanding: "okay",
      struggledWith: ""
    });
    alert(`Added "${title}" to your topics and scheduled spaced repetition revisions!`);
    window.RecallMateApp.closeModals();
  },

  startChapterQuiz(classId, subjectId, chapterId) {
    const classData = CURRICULUM_DATA[classId] || CURRICULUM_DATA["class-10"];
    const subject = classData.subjects.find(s => s.id === subjectId);
    if (!subject) return;
    const chapter = subject.chapters.find(c => c.id === chapterId);
    if (!chapter) return;

    activeMockTest = {
      examId: classId,
      examName: `${chapter.title} Quiz`,
      questions: chapter.mcqQuiz,
      currentIndex: 0,
      answers: {},
      secondsRemaining: chapter.mcqQuiz.length * 90,
      totalDuration: chapter.mcqQuiz.length * 90
    };

    if (mockTimerInterval) clearInterval(mockTimerInterval);
    mockTimerInterval = setInterval(() => {
      if (!activeMockTest) return;
      activeMockTest.secondsRemaining--;
      const display = document.getElementById("mock-timer-display");
      if (display) display.innerText = "⏱️ " + formatTimer(activeMockTest.secondsRemaining);
      if (activeMockTest.secondsRemaining <= 0) {
        clearInterval(mockTimerInterval);
        alert("Time is up! Submitting chapter quiz.");
        window.RecallMateApp.finalizeMockTest();
      }
    }, 1000);

    window.location.hash = "#/mock-test";
    renderApp();
  },

  startExamMockTest(examId) {
    window.location.hash = "#/mock-test";
    setTimeout(() => {
      const select = document.getElementById("mock-exam-select");
      if (select) {
        select.value = examId;
        window.RecallMateApp.updateMockDurationOptions(examId);
        const form = select.closest("form");
        if (form) form.dispatchEvent(new Event("submit", { cancelable: true }));
      }
    }, 60);
  },

  filterResourcesList() {
    const qInp = document.getElementById("res-filter-query");
    const tInp = document.getElementById("res-filter-type");
    const grid = document.getElementById("resources-grid-container");
    if (!grid) return;

    const query = qInp ? qInp.value.toLowerCase().trim() : "";
    const type = tInp ? tInp.value : "All Types";
    const saved = store.get().savedResources || [];

    const filtered = VERIFIED_RESOURCES.filter(res => {
      const matchQ = !query ||
        res.name.toLowerCase().includes(query) ||
        res.examination.toLowerCase().includes(query) ||
        res.subject.toLowerCase().includes(query) ||
        res.description.toLowerCase().includes(query);

      const matchT = type === "All Types" || res.resourceType === type;
      return matchQ && matchT;
    });

    if (filtered.length === 0) {
      grid.innerHTML = `<div style="grid-column: 1 / -1; text-align: center; padding: 48px; color: var(--text-muted);">No resources found matching your filter criteria.</div>`;
      return;
    }

    grid.innerHTML = filtered.map(res => `
      <div class="card card-hover" style="display: flex; flex-direction: column; justify-content: space-between;">
        <div>
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
            <span class="nav-item-badge badge-purple">${res.resourceType}</span>
            ${res.isOfficial ? `<span class="nav-item-badge badge-amber">Official</span>` : ""}
          </div>
          <h3 style="font-size: 1rem; font-weight: 700; margin-bottom: 6px;">${res.name}</h3>
          <p style="font-size: 0.8rem; color: var(--text-secondary); line-height: 1.4; margin-bottom: 12px;">${res.description}</p>
        </div>

        <div>
          <div style="font-size: 0.72rem; color: var(--text-muted); margin-bottom: 12px;">
            Source: <strong>${res.sourceWebsite}</strong> &bull; Verified Free: <strong>${res.verifiedFree ? "Yes" : "Check Portal"}</strong>
          </div>
          <div style="display: flex; gap: 8px;">
            <a href="${res.directUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm" style="flex: 1;">Open Original Resource ↗</a>
            <button class="btn btn-secondary btn-sm" onclick="window.RecallMateApp.toggleBookmark('${res.id}')">
              ${saved.includes(res.id) ? "★ Saved" : "☆ Save"}
            </button>
          </div>
        </div>
      </div>
    `).join("");
  },

  confirmClearData() {
    if (confirm("Are you sure? This will delete all your local notes, revisions, and quiz records permanently.")) {
      store.clearAllData();
      renderApp();
    }
  },

  closeModals() {
    const modalContainer = document.getElementById("modal-container");
    if (modalContainer) modalContainer.innerHTML = "";
  }
};
