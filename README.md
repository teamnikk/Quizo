# 🧠 QuizAI — AI-Powered Document-to-Quiz Platform

Transform any document (PDF, DOCX, TXT, images) into a beautiful interactive quiz powered by Claude AI.

---

## ✨ Features

| Feature | Details |
|---|---|
| 📄 **File Support** | PDF, DOCX, DOC, TXT, MD, PNG, JPG, WEBP, GIF, CSV |
| 🧠 **AI Engine** | Claude Sonnet — extracts content + generates exam-quality MCQs |
| 💡 **Explanations** | Detailed AI-written explanations for every question |
| ⏱️ **Timer Mode** | 30s / 60s / 90s per question with visual countdown |
| 🌐 **Hindi + English** | One-click full interface and quiz language switch |
| 🌙 **Dark / Light Mode** | Smooth theme transitions |
| 🔖 **Bookmarks** | Bookmark questions during the quiz |
| 🔊 **Voice Reading** | Text-to-speech for questions and explanations |
| 📊 **Score Analytics** | Grade, accuracy, performance bars, full review |
| 🔄 **Shuffle** | Shuffle questions and/or answer options |
| 🎯 **Topic Focus** | Optionally focus on a specific topic within the document |
| 📱 **Responsive** | Fully mobile-friendly |

---

## 🚀 Deployment (GitHub Pages / Netlify / Vercel)

This is a **single HTML file** — no build step required.

### Option 1: GitHub Pages
```bash
git init
git add index.html README.md
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/quizai.git
git push -u origin main
# Enable Pages in Settings → Pages → main branch / root
```

### Option 2: Netlify Drop
1. Go to https://app.netlify.com/drop
2. Drag `index.html` into the browser
3. Live in seconds ✅

### Option 3: Vercel
```bash
npx vercel --prod
# Select the folder containing index.html
```

---

## 🔑 API Setup

The app calls the Anthropic API directly from the browser.

**Important:** The Anthropic API must allow browser requests from your domain.  
For production, you should proxy API calls through a backend to protect your key.

### Development (localhost)
The app works directly — Anthropic allows CORS from localhost for testing.

### Production — Backend Proxy (Recommended)

Create a simple proxy server to avoid exposing your API key:

#### Node.js / Express proxy:
```js
// server.js
const express = require('express');
const cors    = require('cors');
const app     = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));

app.post('/api/claude', async (req, res) => {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify(req.body),
  });
  const data = await response.json();
  res.json(data);
});

app.listen(3001);
```

Then in `index.html`, replace:
```js
// Change this line in callClaude():
const res = await fetch("https://api.anthropic.com/v1/messages", {
  headers: { "Content-Type": "application/json" },
```
To:
```js
const res = await fetch("/api/claude", {
  headers: { "Content-Type": "application/json" },
```

#### FastAPI proxy (Python):
```python
# main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import httpx, os

app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

@app.post("/api/claude")
async def proxy(body: dict):
    async with httpx.AsyncClient() as client:
        r = await client.post(
            "https://api.anthropic.com/v1/messages",
            headers={"x-api-key": os.environ["ANTHROPIC_API_KEY"],
                     "anthropic-version": "2023-06-01",
                     "content-type": "application/json"},
            json=body, timeout=120
        )
    return r.json()
```

---

## 📁 Project Structure

```
quizai/
├── index.html      # Complete single-file app (React + Babel CDN)
└── README.md       # This file
```

The entire app is self-contained in `index.html`.

---

## 🏗️ Architecture

```
Browser
  │
  ├── File Upload (drag & drop or click)
  │     └── extractText(file)
  │           ├── .txt/.md/.csv  → FileReader.text()
  │           ├── .docx/.doc     → XML parse → fallback to vision
  │           └── .pdf/.jpg/etc  → Claude Vision API (base64)
  │
  ├── AI Generation
  │     └── generateQuiz(text, settings)
  │           └── Claude Sonnet → JSON quiz (questions + explanations)
  │
  └── Quiz Engine
        ├── Timer (per-question countdown)
        ├── Answer tracking
        ├── Bookmark system (in-memory)
        ├── Voice TTS (Web Speech API)
        └── Score + analytics
```

---

## ⚙️ Configuration

All settings are in the UI. Key parameters:

| Setting | Options |
|---|---|
| Questions | 5, 8, 10, 12, 15, 20 |
| Difficulty | Mixed, Easy, Medium, Hard |
| Language | English, Hindi |
| Timer | None, 30s, 60s, 90s |
| Topic | Free text — focus the AI on one topic |
| Shuffle Q | Randomise question order |
| Shuffle Options | Randomise A/B/C/D order |
| Show After | Reveal answer after each question |

---

## 🔧 Customisation

To extend the app, the main sections in `index.html` are:

- **`T` object** — all UI strings for EN + HI translation
- **`generateQuiz()`** — the Claude prompt (adjust tone, format, question types)
- **`extractText()`** — file parsing logic
- **`DARK` / `LIGHT`** — theme color tokens
- **`App` component** — main React component with all phases

---

## 📄 License

MIT — free to use, modify, and deploy.

---

Made with ❤️ and Claude AI
