// RecallMate AI — Real Educational Platform Server
// Zero external npm dependencies — Runs natively with Node.js ES Modules (Node 18+)
// Features:
// 1. Static SPA web server with MIME types
// 2. Real Gemini LLM API Streaming (Server-Sent Events) with Multimodal Image Support
// 3. Real-Time Web Search & Official Examination Directory Grounding
// 4. Multi-turn conversation context, academic depth tuning, and Hindi/English support

import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;
const ROOT_DIR = __dirname;

// Simple .env Loader (Zero external dependencies)
function loadEnv() {
  const envPath = path.join(ROOT_DIR, '.env');
  if (fs.existsSync(envPath)) {
    try {
      const content = fs.readFileSync(envPath, 'utf8');
      const lines = content.split(/\r?\n/);
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;
        const eqIdx = trimmed.indexOf('=');
        if (eqIdx !== -1) {
          const key = trimmed.slice(0, eqIdx).trim();
          let val = trimmed.slice(eqIdx + 1).trim();
          if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
            val = val.slice(1, -1);
          }
          if (!process.env[key]) {
            process.env[key] = val;
          }
        }
      }
    } catch (e) {
      console.warn('Could not read .env file:', e.message);
    }
  }
}
loadEnv();

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.pdf': 'application/pdf',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2'
};

// Official Education & Examination Domains Directory
const OFFICIAL_PORTALS = [
  { domain: 'cbse.gov.in', name: 'Central Board of Secondary Education (CBSE)', authority: 'CBSE' },
  { domain: 'cbseacademic.nic.in', name: 'CBSE Academic & Curriculum Portal', authority: 'CBSE' },
  { domain: 'ncert.nic.in', name: 'National Council of Educational Research and Training (NCERT)', authority: 'NCERT' },
  { domain: 'nta.ac.in', name: 'National Testing Agency (NTA)', authority: 'NTA' },
  { domain: 'jeemain.nta.nic.in', name: 'JEE (Main) Official Portal', authority: 'NTA' },
  { domain: 'neet.nta.nic.in', name: 'NEET (UG) Official Portal', authority: 'NTA' },
  { domain: 'cuet.nta.nic.in', name: 'CUET (UG) Official Portal', authority: 'NTA' },
  { domain: 'upsc.gov.in', name: 'Union Public Service Commission (UPSC)', authority: 'UPSC' },
  { domain: 'ssc.gov.in', name: 'Staff Selection Commission (SSC)', authority: 'SSC' },
  { domain: 'mahacet.org', name: 'Maharashtra State Common Entrance Test Cell', authority: 'MHT-CET' },
  { domain: 'kea.kar.nic.in', name: 'Karnataka Examinations Authority (KCET)', authority: 'KCET' },
  { domain: 'wbjeeb.nic.in', name: 'West Bengal Joint Entrance Examinations Board', authority: 'WBJEE' },
  { domain: 'swayam.gov.in', name: 'SWAYAM / NPTEL (Ministry of Education)', authority: 'Govt of India' }
];

function isOfficialDomain(url) {
  try {
    const host = new URL(url).hostname.toLowerCase();
    return (
      host.endsWith('.gov.in') ||
      host.endsWith('.nic.in') ||
      host.endsWith('.ac.in') ||
      OFFICIAL_PORTALS.some(p => host.includes(p.domain))
    );
  } catch {
    return false;
  }
}

function getPortalName(url) {
  try {
    const host = new URL(url).hostname.toLowerCase();
    const found = OFFICIAL_PORTALS.find(p => host.includes(p.domain));
    if (found) return found.name;
    if (host.endsWith('.gov.in') || host.endsWith('.nic.in')) return 'Government of India Official Portal';
    return host;
  } catch {
    return 'Official Source';
  }
}

// Read body helper
function readRequestBody(req, maxBytes = 15 * 1024 * 1024) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let received = 0;
    req.on('data', chunk => {
      received += chunk.length;
      if (received > maxBytes) {
        req.destroy();
        reject(new Error('Payload too large'));
        return;
      }
      chunks.push(chunk);
    });
    req.on('end', () => {
      const buffer = Buffer.concat(chunks);
      resolve(buffer.toString('utf8'));
    });
    req.on('error', err => reject(err));
  });
}

// CORS headers helper
function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-gemini-key');
}

// -------------------------------------------------------------
// Real-Time Web Search Integration
// -------------------------------------------------------------
async function executeWebSearch({ query, exam, officialOnly }) {
  const searchQuery = `${query} ${exam && exam !== 'All Exams' ? exam : ''}`.trim();
  const results = [];

  // 1. Google Custom Search API if configured
  const gApiKey = process.env.SEARCH_API_KEY;
  const gCx = process.env.SEARCH_ENGINE_CX;

  if (gApiKey && gCx) {
    try {
      const searchUrl = `https://www.googleapis.com/customsearch/v1?key=${encodeURIComponent(gApiKey)}&cx=${encodeURIComponent(gCx)}&q=${encodeURIComponent(searchQuery)}`;
      const resp = await fetch(searchUrl);
      if (resp.ok) {
        const data = await resp.json();
        if (data.items && Array.isArray(data.items)) {
          for (const item of data.items) {
            const isOff = isOfficialDomain(item.link);
            if (officialOnly && !isOff) continue;
            results.push({
              title: item.title,
              url: item.link,
              snippet: item.snippet,
              sourceName: getPortalName(item.link),
              domain: new URL(item.link).hostname,
              isOfficial: isOff,
              date: new Date().toISOString().slice(0, 10)
            });
          }
        }
      }
    } catch (e) {
      console.warn('Google Custom Search query error:', e.message);
    }
  }

  // 2. Real-Time Web Query via DuckDuckGo HTML API (No API key needed)
  if (results.length < 5) {
    try {
      const ddgUrl = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(searchQuery + ' official site')}`;
      const ddgResp = await fetch(ddgUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
        }
      });
      if (ddgResp.ok) {
        const html = await ddgResp.text();
        // Extract result blocks
        const linkRegex = /<a[^>]+class="result__url"[^>]+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi;
        const snippetRegex = /<a[^>]+class="result__snippet"[^>]*>([\s\S]*?)<\/a>/gi;
        const titleRegex = /<h2[^>]+class="result__title"[^>]*>[\s\S]*?<a[^>]+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi;

        const titles = [];
        let tMatch;
        while ((tMatch = titleRegex.exec(html)) !== null && titles.length < 10) {
          let rawUrl = tMatch[1];
          // Duckduckgo wraps URL in /l/?uddg=...
          if (rawUrl.includes('uddg=')) {
            try {
              const urlObj = new URL(rawUrl, 'https://duckduckgo.com');
              rawUrl = decodeURIComponent(urlObj.searchParams.get('uddg') || rawUrl);
            } catch {}
          }
          const cleanTitle = tMatch[2].replace(/<[^>]+>/g, '').trim();
          titles.push({ url: rawUrl, title: cleanTitle });
        }

        const snippets = [];
        let sMatch;
        while ((sMatch = snippetRegex.exec(html)) !== null && snippets.length < 10) {
          snippets.push(sMatch[1].replace(/<[^>]+>/g, '').trim());
        }

        for (let i = 0; i < titles.length; i++) {
          const itemUrl = titles[i].url;
          if (!itemUrl || !itemUrl.startsWith('http')) continue;
          const isOff = isOfficialDomain(itemUrl);
          if (officialOnly && !isOff) continue;

          // Deduplicate
          if (!results.some(r => r.url === itemUrl)) {
            results.push({
              title: titles[i].title,
              url: itemUrl,
              snippet: snippets[i] || 'Official resource and examination documentation.',
              sourceName: getPortalName(itemUrl),
              domain: new URL(itemUrl).hostname,
              isOfficial: isOff,
              date: new Date().toISOString().slice(0, 10)
            });
          }
        }
      }
    } catch (e) {
      console.warn('DuckDuckGo search query error:', e.message);
    }
  }

  // 3. Guaranteed Curated Official Portals matching query
  const qLower = query.toLowerCase();
  for (const portal of OFFICIAL_PORTALS) {
    if (
      qLower.includes(portal.authority.toLowerCase()) ||
      qLower.includes(portal.domain.split('.')[0]) ||
      (qLower.includes('cbse') && portal.authority === 'CBSE') ||
      (qLower.includes('nta') && portal.authority === 'NTA') ||
      (qLower.includes('jee') && portal.domain.includes('jee')) ||
      (qLower.includes('neet') && portal.domain.includes('neet')) ||
      (qLower.includes('upsc') && portal.authority === 'UPSC')
    ) {
      const portalUrl = `https://${portal.domain}`;
      if (!results.some(r => r.url === portalUrl)) {
        results.unshift({
          title: `${portal.name} — Official Examination Portal`,
          url: portalUrl,
          snippet: `Authoritative government portal for syllabus, dates, public notices, and official previous-year papers for ${portal.authority}.`,
          sourceName: portal.name,
          domain: portal.domain,
          isOfficial: true,
          date: new Date().toISOString().slice(0, 10)
        });
      }
    }
  }

  // Sort: official domains first
  results.sort((a, b) => (b.isOfficial ? 1 : 0) - (a.isOfficial ? 1 : 0));
  return results.slice(0, 8);
}

// -------------------------------------------------------------
// Real Gemini LLM API Handler (Streaming & Multimodal)
// -------------------------------------------------------------
async function handleChatRequest(req, res) {
  setCorsHeaders(res);

  let bodyText;
  try {
    bodyText = await readRequestBody(req);
  } catch (err) {
    res.writeHead(413, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Payload too large' }));
    return;
  }

  let body;
  try {
    body = JSON.parse(bodyText);
  } catch (err) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Invalid JSON body' }));
    return;
  }

  const {
    prompt = '',
    messages = [],
    image = null,
    depth = 'intermediate',
    mode = 'detailed',
    language = 'en',
    classLevel = 'Class 10',
    targetExam = 'General',
    searchWeb = false,
    apiKey: clientApiKey = ''
  } = body;

  const headerKey = req.headers['x-gemini-key'] || '';
  const activeApiKey = (clientApiKey || headerKey || process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || '').trim();

  // If no API key is provided, return structured configuration prompt with clear instructions
  if (!activeApiKey) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      error: 'NO_API_KEY',
      message: 'Gemini API key is not configured. Get a free API key at https://aistudio.google.com/app/apikey and enter it in Settings or set GEMINI_API_KEY in your .env file.',
      hint: 'RecallMate can use Google Gemini 1.5/2.0 Flash for zero-cost, lightning-fast academic explanations.'
    }));
    return;
  }

  // Optionally perform live web search to ground response
  let searchSources = [];
  let searchContext = '';
  if (searchWeb || /date|notification|schedule|admit|result|syllabus|cutoff|eligibility|latest|official/i.test(prompt)) {
    try {
      searchSources = await executeWebSearch({ query: prompt, exam: targetExam, officialOnly: false });
      if (searchSources.length > 0) {
        searchContext = `\n\n### VERIFIED REAL-TIME WEB SEARCH RESULTS (Use these official citations to answer):\n` +
          searchSources.map((s, i) => `[Source ${i + 1}]: "${s.title}" (${s.isOfficial ? 'OFFICIAL VERIFIED' : 'Third-Party'}) - Link: ${s.url}\nSummary: ${s.snippet}`).join('\n\n') +
          `\n\nProvide direct clickable markdown links [Source Title](URL) for all factual references.`;
      }
    } catch (e) {
      console.warn('Search context retrieval error:', e.message);
    }
  }

  // Build Comprehensive System Prompt
  const languageInstructions = {
    hi: 'Answer in clear, formal Hindi (हिन्दी) with standard technical terms in Devanagari along with English terms in parentheses where helpful.',
    hinglish: 'Answer in natural conversational Hinglish (a blend of Hindi and English commonly spoken by Indian students preparing for CBSE/JEE/NEET).',
    en: 'Answer in fluent, precise academic English.'
  }[language] || 'Answer in fluent, precise academic English.';

  const depthInstructions = {
    beginner: 'Beginner Level: Assume no prior knowledge. Use intuitive real-world analogies, step-by-step simple explanations, and zero confusing jargon.',
    intermediate: 'School / Standard Board Level: Align with NCERT standards for Class 6–12. Use accurate definitions, standard notation, and clear logical progression.',
    board: 'Board Examination Level: Strict CBSE/Board marking scheme rigor. Include formal definitions, step-by-step derivations, neat ASCII diagrams, and highlight common student board mistakes.',
    competitive: 'Competitive Exam Level (JEE / NEET / NDA / UPSC): Rigorous first-principles approach. Include mathematical shortcuts, edge cases, trap-detection, and high-yield scoring tricks.'
  }[depth] || 'Standard curriculum level.';

  const modeInstructions = {
    simple: 'Response Mode: Simple Explanation. Friendly, easy-to-grasp analogies.',
    detailed: 'Response Mode: Detailed Academic. Comprehensive textbook coverage with complete scientific context.',
    exam: 'Response Mode: Exam-Oriented. Focus on high-yield marks, common traps, and scoring tips.',
    revision: 'Response Mode: Quick Revision. Ultra-concise high-density bullet points.',
    conceptual: 'Response Mode: Conceptual Understanding. First-principles derivations and thought experiments.',
    problem: 'Response Mode: Advanced Problem-Solving. Step-by-step numerical solution with all calculation steps.'
  }[mode] || 'Detailed explanation.';

  const systemInstructionText = `You are RecallMate AI, a premier academic study assistant and competitive exam preparation tutor.
Target Audience: Student preparing for ${classLevel} and ${targetExam}.
${languageInstructions}
${depthInstructions}
${modeInstructions}

CORE RULES:
1. Ground answers strictly in verified academic facts, mathematics, and official syllabus guidelines (NCERT, CBSE, NTA, UPSC).
2. If you do not know the answer with certainty or if information is not available in official records, state so honestly. Never invent facts or syllabus policies.
3. Structure your response cleanly using GitHub-Flavored Markdown:
   - Clear topic heading
   - Step-by-step logical explanations
   - Real-life analogies or intuitive mental models
   - Formatted mathematical equations and formulas
   - ASCII or structured diagrams where applicable (circuits, ray paths, chemical mechanisms, flowcharts)
   - Common student traps & misconceptions to avoid in exams
   - End EVERY explanation with a designated "### 📝 Quick Revision Summary" section containing high-yield bullet points.
${searchContext}`;

  // Assemble Gemini Contents
  const contents = [];

  // Previous multi-turn conversation
  if (Array.isArray(messages) && messages.length > 0) {
    for (const msg of messages.slice(-6)) {
      const role = msg.role === 'user' ? 'user' : 'model';
      contents.push({
        role,
        parts: [{ text: msg.content || '' }]
      });
    }
  }

  // Current turn parts
  const currentParts = [];
  currentParts.push({ text: prompt || 'Please explain this topic.' });

  // Handle multimodal image
  if (image && image.data) {
    const cleanBase64 = image.data.replace(/^data:image\/[a-zA-Z+]+;base64,/, '');
    currentParts.push({
      inline_data: {
        mime_type: image.mimeType || 'image/jpeg',
        data: cleanBase64
      }
    });
  }

  contents.push({
    role: 'user',
    parts: currentParts
  });

  // Call Gemini API with Streaming
  // Use gemini-1.5-flash for speed and reliability, supports gemini-2.0-flash
  const geminiEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:streamGenerateContent?alt=sse&key=${activeApiKey}`;

  const payload = {
    contents,
    system_instruction: {
      parts: [{ text: systemInstructionText }]
    },
    generationConfig: {
      temperature: 0.3,
      maxOutputTokens: 2500,
      topP: 0.95
    }
  };

  try {
    const upstreamResp = await fetch(geminiEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!upstreamResp.ok) {
      const errText = await upstreamResp.text();
      let parsedErr = errText;
      try {
        const jsonErr = JSON.parse(errText);
        parsedErr = jsonErr.error?.message || errText;
      } catch {}

      res.writeHead(upstreamResp.status, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'GEMINI_API_ERROR', message: parsedErr }));
      return;
    }

    // Set SSE Streaming Headers
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*'
    });

    // Send sources header event if search sources are present
    if (searchSources.length > 0) {
      res.write(`data: ${JSON.stringify({ sources: searchSources })}\n\n`);
    }

    // Read upstream SSE stream
    const reader = upstreamResp.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop(); // keep last unfinished line

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || !trimmed.startsWith('data:')) continue;
        const jsonStr = trimmed.slice(5).trim();
        if (jsonStr === '[DONE]') continue;

        try {
          const chunkData = JSON.parse(jsonStr);
          const chunkText = chunkData.candidates?.[0]?.content?.parts?.[0]?.text;
          if (chunkText) {
            res.write(`data: ${JSON.stringify({ text: chunkText })}\n\n`);
          }
        } catch {
          // ignore non-json SSE lines
        }
      }
    }

    // Close SSE stream
    res.write('data: [DONE]\n\n');
    res.end();
  } catch (err) {
    console.error('Gemini stream error:', err);
    if (!res.headersSent) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'UPSTREAM_FETCH_FAILED', message: err.message }));
    } else {
      res.write(`data: ${JSON.stringify({ error: err.message })}\n\n`);
      res.end();
    }
  }
}

// -------------------------------------------------------------
// Real-Time Search API Handler
// -------------------------------------------------------------
async function handleSearchRequest(req, res) {
  setCorsHeaders(res);

  let bodyText;
  try {
    bodyText = await readRequestBody(req);
  } catch {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Could not read request body' }));
    return;
  }

  let body = {};
  try {
    body = JSON.parse(bodyText);
  } catch {}

  const query = body.query || '';
  const exam = body.exam || 'All Exams';
  const officialOnly = Boolean(body.officialOnly);

  if (!query.trim()) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ query: '', results: [], totalCount: 0 }));
    return;
  }

  try {
    const results = await executeWebSearch({ query, exam, officialOnly });
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      query,
      results,
      totalCount: results.length,
      searchedAt: new Date().toISOString()
    }));
  } catch (err) {
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'SEARCH_FAILED', message: err.message }));
  }
}

// -------------------------------------------------------------
// Main Server Request Router
// -------------------------------------------------------------
const server = http.createServer(async (req, res) => {
  // Handle CORS Preflight
  if (req.method === 'OPTIONS') {
    setCorsHeaders(res);
    res.writeHead(204);
    res.end();
    return;
  }

  let parsedUrl = req.url.split('?')[0];

  // API Endpoints
  if (parsedUrl === '/api/status' && req.method === 'GET') {
    setCorsHeaders(res);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'ok',
      platform: 'RecallMate AI Platform',
      version: '2.2.0',
      tagline: 'Learn smarter. Revise better. Crack your goals.',
      hasGeminiApiKey: Boolean(process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY),
      hasSearchApiKey: Boolean(process.env.SEARCH_API_KEY && process.env.SEARCH_ENGINE_CX),
      officialSourcesActive: OFFICIAL_PORTALS.length
    }));
    return;
  }

  if (parsedUrl === '/api/chat' && req.method === 'POST') {
    await handleChatRequest(req, res);
    return;
  }

  if (parsedUrl === '/api/search' && req.method === 'POST') {
    await handleSearchRequest(req, res);
    return;
  }

  // Static File Serving
  if (parsedUrl === '/' || parsedUrl === '') {
    parsedUrl = '/index.html';
  }

  const filePath = path.join(ROOT_DIR, decodeURIComponent(parsedUrl));

  if (!filePath.startsWith(ROOT_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('403 Forbidden');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      const indexPath = path.join(ROOT_DIR, 'index.html');
      fs.readFile(indexPath, (readErr, content) => {
        if (readErr) {
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.end('404 Not Found');
        } else {
          setCorsHeaders(res);
          res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
          res.end(content);
        }
      });
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(filePath, (readErr, content) => {
      if (readErr) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('500 Internal Server Error: ' + readErr.message);
      } else {
        setCorsHeaders(res);
        res.writeHead(200, {
          'Content-Type': contentType,
          'Cache-Control': 'no-cache'
        });
        res.end(content);
      }
    });
  });
});

server.listen(PORT, '127.0.0.1', () => {
  console.log('====================================================');
  console.log('  RecallMate AI Platform is Running!');
  console.log(`  Local URL: http://localhost:${PORT}`);
  console.log('  Tagline: "Learn smarter. Revise better. Crack your goals."');
  console.log('  Endpoints:');
  console.log('    • GET  /api/status');
  console.log('    • POST /api/chat   (Streaming SSE & Multimodal)');
  console.log('    • POST /api/search (Real-Time Official Portals)');
  console.log('====================================================');
});
