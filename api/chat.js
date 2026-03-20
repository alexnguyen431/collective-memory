// /api/chat.js — Vercel Serverless Function
// Proxies requests to Anthropic API, keeping the key server-side

const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 6;
const ALLOWED_ORIGINS = ['https://collective-memory.vercel.app', 'http://localhost:5173', 'http://localhost:3000'];
const ipRequests = new Map();

function rateLimit(ip) {
  const now = Date.now();
  const windowData = ipRequests.get(ip) || [];
  const recent = windowData.filter(t => now - t < RATE_LIMIT_WINDOW);
  if (recent.length >= MAX_REQUESTS_PER_WINDOW) return false;
  recent.push(now);
  ipRequests.set(ip, recent);
  // Cleanup old entries periodically
  if (ipRequests.size > 5000) {
    for (const [key, times] of ipRequests.entries()) {
      if (times.every(t => now - t > RATE_LIMIT_WINDOW)) ipRequests.delete(key);
    }
  }
  return true;
}

export default async function handler(req, res) {
  // CORS — restrict to known origins
  const origin = req.headers.origin || '';
  if (ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  // Rate limit by IP
  const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.socket?.remoteAddress || 'unknown';
  if (!rateLimit(ip)) {
    return res.status(429).json({ error: 'Too many requests. Try again in a minute.' });
  }

  // Validate API key is configured
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  try {
    const body = req.body;

    // Reject oversized payloads
    if (JSON.stringify(body).length > 50000) {
      return res.status(413).json({ error: 'Request too large' });
    }

    // Security: enforce limits regardless of what client sends
    const sanitized = {
      model: 'claude-sonnet-4-20250514', // Lock model
      max_tokens: 1000, // Lock max output
      system: typeof body.system === 'string' ? body.system.slice(0, 4000) : '', // Cap system prompt
      messages: Array.isArray(body.messages)
        ? body.messages.slice(-12).map(m => ({ // Max 12 messages
            role: m.role === 'assistant' ? 'assistant' : 'user',
            content: typeof m.content === 'string' ? m.content.slice(0, 2000) : '', // Cap per message
          }))
        : [],
    };

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(sanitized),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data.error?.message || 'API error' });
    }

    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error' });
  }
}
