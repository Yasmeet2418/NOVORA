// Netlify Function: GET /api/status
export const handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({
      status: 'ok',
      platform: 'RecallMate AI Platform',
      version: '2.2.0',
      tagline: 'Learn smarter. Revise better. Crack your goals.',
      hasGeminiApiKey: Boolean(process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY),
      hasSearchApiKey: Boolean(process.env.SEARCH_API_KEY && process.env.SEARCH_ENGINE_CX),
      officialSourcesActive: 13
    })
  };
};
