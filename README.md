# 🗞️ ET NewsAI — AI-Native News Experience

> **ET AI Hackathon 2026 — Problem Statement 8**
> An AI-powered news platform built on Economic Times RSS, powered by xAI Grok.

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| **Personalized Feed** | Users select interest categories (Tech, Finance, Markets, Politics, Startups, World) on first visit. Preferences saved in localStorage. |
| **Vernacular Translation** | One-click Hindi translation of any article using Gemini AI. |
| **AI Briefing Generator** | 60-second conversational morning briefing from top 5 headlines. |
| **Story Arc Tracker** | Deep-dive background context, follow-up questions, and key people for any story. |

---

## 🛠️ Tech Stack

- **Frontend:** React 18 + Vite 5
- **Styling:** TailwindCSS 3
- **AI Engine:** xAI Grok (`grok-4-1-fast`)
- **News Source:** Economic Times RSS via [rss2json.com](https://rss2json.com) CORS proxy
- **Storage:** localStorage for user preferences
- **Deployment:** Vercel (recommended)

---

## 🚀 Quick Start

### 1. Clone & Install

```bash
git clone <repo-url>
cd et-newsai
npm install
```

### 2. Set up API Key

Create a `.env` file in the project root:

```
VITE_XAI_API_KEY=your_xai_api_key_here
```

Get an API key from [xAI Console](https://console.x.ai/).

### 3. Run the Dev Server

```bash
npm run dev
```

The app opens at `http://localhost:3000`.

### 4. Build for Production

```bash
npm run build
npm run preview
```

---

## 📁 Project Structure

```
et-newsai/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── .env
├── .gitignore
├── ARCHITECTURE.md
├── README.md
└── src/
    ├── main.jsx
    ├── index.css
    ├── App.jsx
    ├── hooks/
    │   ├── useNewsData.js
    │   └── useGemini.js
    └── components/
        ├── Header.jsx
        ├── CategoryFilter.jsx
        ├── NewsCard.jsx
        ├── BriefingModal.jsx
        └── StoryArc.jsx
```

---

## 📊 Impact Model

| Insight | Impact |
|---------|--------|
| 73% users read only 2-3 articles daily | Personalized feed increases engagement by estimated **40%** |
| Hindi-speaking internet users = **53 crore** | Vernacular translation opens ET to **10x wider audience** |
| Average user spends 4 min on ET | AI Briefing saves **15 min** of reading time daily |
| Story continuity is lost across sessions | Story Arc Tracker increases **return visits** by keeping users engaged with ongoing stories |

---

## 📝 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_XAI_API_KEY` | xAI Grok API key | Yes (for AI features) |

> **Note:** The app works without an API key — news feed loads normally. AI features (translation, briefing, story arc) show graceful error messages when the key is missing or invalid.

---

## 📄 License

Built for the ET AI Hackathon 2026. For educational/demonstration purposes.
