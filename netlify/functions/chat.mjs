// Netlify Function: POST /api/chat
// Gemini AI Streaming via SSE — proxied through Netlify Function
// Note: Netlify Functions do not support true SSE streaming; we buffer and return complete response.

const OFFICIAL_PORTALS = [
  { domain: 'cbse.gov.in', name: 'Central Board of Secondary Education (CBSE)', authority: 'CBSE' },
  { domain: 'cbseacademic.nic.in', name: 'CBSE Academic & Curriculum Portal', authority: 'CBSE' },
  { domain: 'ncert.nic.in', name: 'NCERT', authority: 'NCERT' },
  { domain: 'nta.ac.in', name: 'National Testing Agency (NTA)', authority: 'NTA' },
  { domain: 'jeemain.nta.nic.in', name: 'JEE (Main) Official Portal', authority: 'NTA' },
  { domain: 'neet.nta.nic.in', name: 'NEET (UG) Official Portal', authority: 'NTA' },
  { domain: 'cuet.nta.nic.in', name: 'CUET (UG) Official Portal', authority: 'NTA' },
  { domain: 'upsc.gov.in', name: 'UPSC', authority: 'UPSC' },
  { domain: 'ssc.gov.in', name: 'SSC', authority: 'SSC' },
  { domain: 'swayam.gov.in', name: 'SWAYAM / NPTEL', authority: 'Govt of India' }
];

function isOfficialDomain(url) {
  try {
    const host = new URL(url).hostname.toLowerCase();
    return host.endsWith('.gov.in') || host.endsWith('.nic.in') || host.endsWith('.ac.in') ||
      OFFICIAL_PORTALS.some(p => host.includes(p.domain));
  } catch { return false; }
}

function getPortalName(url) {
  try {
    const host = new URL(url).hostname.toLowerCase();
    const found = OFFICIAL_PORTALS.find(p => host.includes(p.domain));
    if (found) return found.name;
    if (host.endsWith('.gov.in') || host.endsWith('.nic.in')) return 'Government of India Official Portal';
    return host;
  } catch { return 'Official Source'; }
}

async function executeWebSearch({ query, exam, officialOnly }) {
  const searchQuery = `${query} ${exam && exam !== 'All Exams' ? exam : ''}`.trim();
  const results = [];
  const gApiKey = process.env.SEARCH_API_KEY;
  const gCx = process.env.SEARCH_ENGINE_CX;

  if (gApiKey && gCx) {
    try {
      const resp = await fetch(`https://www.googleapis.com/customsearch/v1?key=${encodeURIComponent(gApiKey)}&cx=${encodeURIComponent(gCx)}&q=${encodeURIComponent(searchQuery)}`);
      if (resp.ok) {
        const data = await resp.json();
        for (const item of (data.items || [])) {
          const isOff = isOfficialDomain(item.link);
          if (officialOnly && !isOff) continue;
          results.push({ title: item.title, url: item.link, snippet: item.snippet, sourceName: getPortalName(item.link), domain: new URL(item.link).hostname, isOfficial: isOff, date: new Date().toISOString().slice(0, 10) });
        }
      }
    } catch {}
  }

  const qLower = query.toLowerCase();
  for (const portal of OFFICIAL_PORTALS) {
    if (qLower.includes(portal.authority.toLowerCase()) || (qLower.includes('jee') && portal.domain.includes('jee')) || (qLower.includes('neet') && portal.domain.includes('neet'))) {
      const portalUrl = `https://${portal.domain}`;
      if (!results.some(r => r.url === portalUrl)) {
        results.unshift({ title: `${portal.name} — Official Portal`, url: portalUrl, snippet: `Official portal for ${portal.authority}.`, sourceName: portal.name, domain: portal.domain, isOfficial: true, date: new Date().toISOString().slice(0, 10) });
      }
    }
  }

  results.sort((a, b) => (b.isOfficial ? 1 : 0) - (a.isOfficial ? 1 : 0));
  return results.slice(0, 8);
}

export const handler = async (event) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-gemini-key'
  };

  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: corsHeaders, body: '' };
  if (event.httpMethod !== 'POST') return { statusCode: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' }, body: JSON.stringify({ error: 'Method not allowed' }) };

  let body = {};
  try { body = JSON.parse(event.body || '{}'); } catch {
    return { statusCode: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }, body: JSON.stringify({ error: 'Invalid JSON body' }) };
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

  const headerKey = event.headers['x-gemini-key'] || '';
  const activeApiKey = (clientApiKey || headerKey || process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || '').trim();

  if (!activeApiKey) {
    return {
      statusCode: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        error: 'NO_API_KEY',
        message: 'Gemini API key is not configured. Get a free API key at https://aistudio.google.com/app/apikey and enter it in Settings.',
        hint: 'NOVORA uses Google Gemini Flash for academic explanations.'
      })
    };
  }

  // Optional web search grounding
  let searchSources = [];
  let searchContext = '';
  if (searchWeb || /date|notification|schedule|admit|result|syllabus|cutoff|eligibility|latest|official/i.test(prompt)) {
    try {
      searchSources = await executeWebSearch({ query: prompt, exam: targetExam, officialOnly: false });
      if (searchSources.length > 0) {
        searchContext = `\n\n### VERIFIED REAL-TIME WEB SEARCH RESULTS:\n` +
          searchSources.map((s, i) => `[Source ${i + 1}]: "${s.title}" (${s.isOfficial ? 'OFFICIAL VERIFIED' : 'Third-Party'}) - Link: ${s.url}\nSummary: ${s.snippet}`).join('\n\n') +
          `\n\nProvide direct clickable markdown links [Source Title](URL) for all factual references.`;
      }
    } catch {}
  }

  const languageInstructions = {
    hi: 'Answer in clear, formal Hindi (हिन्दी) with standard technical terms in Devanagari.',
    hinglish: 'Answer in natural conversational Hinglish (Hindi + English blend).',
    en: 'Answer in fluent, precise academic English.'
  }[language] || 'Answer in fluent, precise academic English.';

  const depthInstructions = {
    beginner: 'Beginner Level: Use intuitive analogies, step-by-step simple explanations, zero jargon.',
    intermediate: 'School / Standard Board Level: Align with NCERT standards for Class 6–12.',
    board: 'Board Examination Level: Strict CBSE/Board marking scheme rigor with derivations.',
    competitive: 'Competitive Exam Level (JEE / NEET / NDA / UPSC): First-principles, shortcuts, edge cases.'
  }[depth] || 'Standard curriculum level.';

  const modeInstructions = {
    simple: 'Response Mode: Simple Explanation. Friendly, easy-to-grasp analogies.',
    detailed: 'Response Mode: Detailed Academic. Comprehensive textbook coverage.',
    exam: 'Response Mode: Exam-Oriented. High-yield marks, common traps, scoring tips.',
    revision: 'Response Mode: Quick Revision. Ultra-concise bullet points.',
    conceptual: 'Response Mode: Conceptual Understanding. First-principles derivations.',
    problem: 'Response Mode: Advanced Problem-Solving. Step-by-step numerical solution.'
  }[mode] || 'Detailed explanation.';

  const systemInstructionText = `You are NOVORA, an academic study assistant and competitive exam preparation tutor.
Target Audience: Student preparing for ${classLevel} and ${targetExam}.
${languageInstructions}
${depthInstructions}
${modeInstructions}

CORE RULES:
1. Answer the exact question first, then add only useful explanation. Keep follow-up answers conversational and use the prior chat for context.
2. Never invent facts, values, steps, sources, or syllabus policies. If uncertain or missing information, say so and state any assumptions.
3. For calculations, identify givens, show the formula and substitutions, include units, and check that the result is reasonable.
4. For concepts, explain cause and effect clearly; use an example or analogy only when it helps.
5. Use official syllabus guidance when relevant. Only cite sources included in verified search results; do not make up citations.
6. Use readable Markdown, and include a concise revision summary for full explanations or exam solutions.
${searchContext}`;

  const contents = [];
  if (Array.isArray(messages) && messages.length > 0) {
    for (const msg of messages.slice(-6)) {
      contents.push({ role: msg.role === 'user' ? 'user' : 'model', parts: [{ text: msg.content || '' }] });
    }
  }

  const currentParts = [{ text: prompt || 'Please explain this topic.' }];
  if (image && image.data) {
    const cleanBase64 = image.data.replace(/^data:image\/[a-zA-Z+]+;base64,/, '');
    currentParts.push({ inline_data: { mime_type: image.mimeType || 'image/jpeg', data: cleanBase64 } });
  }
  contents.push({ role: 'user', parts: currentParts });

  const geminiEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${activeApiKey}`;
  const payload = {
    contents,
    system_instruction: { parts: [{ text: systemInstructionText }] },
    generationConfig: { temperature: 0.3, maxOutputTokens: 2500, topP: 0.95 }
  };

  try {
    let upstreamResp;
    for (let attempt = 0; attempt < 3; attempt++) {
      upstreamResp = await fetch(geminiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (upstreamResp.status !== 503 || attempt === 2) break;
      await upstreamResp.body?.cancel();
      await new Promise(resolve => setTimeout(resolve, 500 * (attempt + 1)));
    }

    if (!upstreamResp.ok) {
      const errText = await upstreamResp.text();
      let parsedErr = errText;
      try { parsedErr = JSON.parse(errText).error?.message || errText; } catch {}
      return { statusCode: upstreamResp.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' }, body: JSON.stringify({ error: 'GEMINI_API_ERROR', message: parsedErr }) };
    }

    const data = await upstreamResp.json();
    const text = (data.candidates?.[0]?.content?.parts || [])
      .filter(part => part.text && !part.thought)
      .map(part => part.text)
      .join('');

    // Return as a streaming-compatible JSON response
    // Frontend will receive full text at once (Netlify doesn't support true SSE streaming)
    const responsePayload = { text, sources: searchSources };
    return {
      statusCode: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify(responsePayload)
    };
  } catch (err) {
    return { statusCode: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }, body: JSON.stringify({ error: 'UPSTREAM_FETCH_FAILED', message: err.message }) };
  }
};
