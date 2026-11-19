// RecallMate AI — Educational Resource Search & Discovery Service
// Dual Engine:
// 1. Live Backend /api/search (DuckDuckGo + Google Custom Search + Official Portals)
// 2. Authoritative Verified Educational Directory (NTA, CBSE, NCERT, UPSC, SSC, Swayam)
// Respects copyright & official terms: direct outbound links, official source attribution, no paywall bypass.

import { VERIFIED_RESOURCES } from "../data/resourcesData.js";
import { store } from "./store.js";

export async function searchEducationalResources({
  query = "",
  exam = "All Exams",
  subject = "All Subjects",
  resourceType = "All Types",
  officialOnly = false,
  freeOnly = false
}) {
  const settings = store.get().aiSettings || {};
  let liveResults = [];
  let isLiveSearch = false;

  // 1. Query the backend /api/search endpoint
  if (query.trim()) {
    try {
      const resp = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, exam, officialOnly })
      });
      if (resp.ok) {
        const data = await resp.json();
        if (data.results && Array.isArray(data.results)) {
          liveResults = data.results.map((item, idx) => ({
            id: `live_${Date.now()}_${idx}`,
            name: item.title,
            examination: exam !== "All Exams" ? exam : "Competitive / Academic",
            subject: subject !== "All Subjects" ? subject : "Curriculum",
            year: "Official Current",
            resourceType: detectResourceType(item.title, item.snippet),
            sourceWebsite: item.sourceName || item.domain,
            isOfficial: Boolean(item.isOfficial),
            verifiedFree: true,
            lastCheckedDate: item.date || new Date().toISOString().slice(0, 10),
            directUrl: item.url,
            description: item.snippet
          }));
          if (liveResults.length > 0) {
            isLiveSearch = true;
          }
        }
      }
    } catch (e) {
      console.warn("Backend /api/search unavailable, falling back to client engine:", e.message);
    }
  }

  // 2. Client Google Custom Search if API keys provided in settings
  const apiKey = settings.searchApiKey ? settings.searchApiKey.trim() : "";
  const cx = settings.searchEngineCx ? settings.searchEngineCx.trim() : "";
  if (!isLiveSearch && apiKey && cx && query.trim()) {
    try {
      liveResults = await executeClientGoogleCustomSearch({ apiKey, cx, query, exam, subject });
      isLiveSearch = true;
    } catch (err) {
      console.warn("Google Custom Search API error, falling back to directory:", err);
    }
  }

  // 3. Query and filter the authoritative verified educational directory
  const localFiltered = VERIFIED_RESOURCES.filter(item => {
    // Search query match
    if (query.trim()) {
      const q = query.toLowerCase();
      const match =
        item.name.toLowerCase().includes(q) ||
        item.examination.toLowerCase().includes(q) ||
        item.subject.toLowerCase().includes(q) ||
        item.resourceType.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q);
      if (!match) return false;
    }

    // Exam filter
    if (exam !== "All Exams" && !item.examination.toLowerCase().includes(exam.toLowerCase())) {
      return false;
    }

    // Subject filter
    if (subject !== "All Subjects" && !item.subject.toLowerCase().includes(subject.toLowerCase())) {
      return false;
    }

    // Resource type filter
    if (resourceType !== "All Types" && item.resourceType !== resourceType) {
      return false;
    }

    // Official only
    if (officialOnly && !item.isOfficial) {
      return false;
    }

    // Free only
    if (freeOnly && !item.verifiedFree) {
      return false;
    }

    return true;
  });

  // Combine live results and local verified directory, avoiding duplicate URLs
  const combined = [...liveResults];
  for (const item of localFiltered) {
    if (!combined.some(r => r.directUrl === item.directUrl)) {
      combined.push(item);
    }
  }

  // Prioritize official verified items
  combined.sort((a, b) => (b.isOfficial ? 1 : 0) - (a.isOfficial ? 1 : 0));

  return {
    results: combined,
    totalCount: combined.length,
    isLiveSearch,
    hasApiKey: Boolean(apiKey && cx)
  };
}

async function executeClientGoogleCustomSearch({ apiKey, cx, query, exam, subject }) {
  const searchQuery = `${query} ${exam !== "All Exams" ? exam : ""} official free mock test question paper`;
  const url = `https://www.googleapis.com/customsearch/v1?key=${encodeURIComponent(apiKey)}&cx=${encodeURIComponent(cx)}&q=${encodeURIComponent(searchQuery)}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Google Search API responded with status ${response.status}`);
  }

  const data = await response.json();
  const items = data.items || [];

  return items.map((item, idx) => ({
    id: `gsearch_${Date.now()}_${idx}`,
    name: item.title,
    examination: exam !== "All Exams" ? exam : "Competitive / Academic",
    subject: subject !== "All Subjects" ? subject : "General Studies",
    year: "Current / Official",
    resourceType: detectResourceType(item.title, item.snippet),
    sourceWebsite: item.displayLink || new URL(item.link).hostname,
    isOfficial: isOfficialDomain(item.link),
    verifiedFree: true,
    lastCheckedDate: new Date().toISOString().slice(0, 10),
    directUrl: item.link,
    description: item.snippet
  }));
}

function detectResourceType(title, snippet) {
  const text = (title + " " + snippet).toLowerCase();
  if (text.includes("mock") || text.includes("practice test")) return "Official Mock Test";
  if (text.includes("pyq") || text.includes("previous year") || text.includes("question paper")) return "Previous-Year Question Paper";
  if (text.includes("syllabus") || text.includes("curriculum")) return "Official Syllabus";
  if (text.includes("sample paper") || text.includes("sqp")) return "Sample Question Paper";
  if (text.includes("answer key")) return "Official Answer Key";
  return "Public Question Bank";
}

function isOfficialDomain(url) {
  try {
    const host = new URL(url).hostname.toLowerCase();
    return (
      host.endsWith(".gov.in") ||
      host.endsWith(".nic.in") ||
      host.endsWith(".ac.in") ||
      host.includes("nta.ac.in") ||
      host.includes("cbse") ||
      host.includes("ncert") ||
      host.includes("upsc") ||
      host.includes("ssc")
    );
  } catch {
    return false;
  }
}
