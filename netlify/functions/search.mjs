// Netlify Function: POST /api/search
// Real-Time Web Search with Official Education Portal Directory

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
    } catch (e) { console.warn('Google Custom Search error:', e.message); }
  }

  if (results.length < 5) {
    try {
      const ddgUrl = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(searchQuery + ' official site')}`;
      const ddgResp = await fetch(ddgUrl, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
      });
      if (ddgResp.ok) {
        const html = await ddgResp.text();
        const titleRegex = /<h2[^>]+class="result__title"[^>]*>[\s\S]*?<a[^>]+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi;
        const snippetRegex = /<a[^>]+class="result__snippet"[^>]*>([\s\S]*?)<\/a>/gi;
        const titles = [];
        let tMatch;
        while ((tMatch = titleRegex.exec(html)) !== null && titles.length < 10) {
          let rawUrl = tMatch[1];
          if (rawUrl.includes('uddg=')) {
            try {
              const urlObj = new URL(rawUrl, 'https://duckduckgo.com');
              rawUrl = decodeURIComponent(urlObj.searchParams.get('uddg') || rawUrl);
            } catch {}
          }
          titles.push({ url: rawUrl, title: tMatch[2].replace(/<[^>]+>/g, '').trim() });
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
    } catch (e) { console.warn('DuckDuckGo search error:', e.message); }
  }

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

  results.sort((a, b) => (b.isOfficial ? 1 : 0) - (a.isOfficial ? 1 : 0));
  return results.slice(0, 8);
}

export const handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers, body: '' };
  if (event.httpMethod !== 'POST') return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };

  let body = {};
  try { body = JSON.parse(event.body || '{}'); } catch {}

  const query = body.query || '';
  const exam = body.exam || 'All Exams';
  const officialOnly = Boolean(body.officialOnly);

  if (!query.trim()) {
    return { statusCode: 200, headers, body: JSON.stringify({ query: '', results: [], totalCount: 0 }) };
  }

  try {
    const results = await executeWebSearch({ query, exam, officialOnly });
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ query, results, totalCount: results.length, searchedAt: new Date().toISOString() })
    };
  } catch (err) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'SEARCH_FAILED', message: err.message }) };
  }
};
