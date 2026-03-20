# Collective Memory — Interactive Concept

A working WhatsApp prototype demonstrating shared AI memory for couples, friends, families, and co-founders. Built with React + Vite, deployed on Vercel.

## Deploy to Vercel (Free)

### 1. Push to GitHub

```bash
cd shared-ai-deploy
git init
git add .
git commit -m "Shared AI prototype"
gh repo create shared-ai-prototype --public --source=. --push
```

Or create a repo manually at github.com/new and push to it.

### 2. Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **"Add New Project"**
3. Import your `shared-ai-prototype` repo
4. Vercel will auto-detect Vite — leave defaults
5. **Before deploying**, add your environment variable:
   - Go to **Settings → Environment Variables**
   - Add: `ANTHROPIC_API_KEY` = your Anthropic API key
6. Click **Deploy**

### 3. Done

Your prototype is live at `https://your-project.vercel.app`

## Architecture

```
├── api/
│   └── chat.js          # Vercel serverless function (API proxy)
├── src/
│   ├── App.jsx          # Main prototype component
│   └── main.jsx         # React entry
├── index.html           # HTML shell
├── vercel.json          # Vercel config
└── vite.config.js       # Vite config
```

## Security

- **API key is server-side only** — stored as a Vercel environment variable, never exposed to the browser
- **Rate limiting** — 10 requests/minute per IP in the serverless function
- **Input caps** — 500 char message limit, 12 message history window
- **Session limit** — 50 API calls per browser session
- **Model locked** — server enforces `claude-sonnet-4-20250514` regardless of client input
- **Output capped** — `max_tokens: 1000` enforced server-side

## Cost Estimate

On Vercel's free Hobby plan:
- Serverless function invocations: 100K/month free
- Bandwidth: 100GB/month free
- Anthropic API: ~$0.30–0.40 per visitor session (50 msg cap)
- 1,000 visitors ≈ $300–400 in API costs
