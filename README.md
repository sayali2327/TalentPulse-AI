# TalentPulse AI - Next-Generation Talent Intelligence & Candidate Ranking Platform

> *"We don't just identify the best candidate today—we predict the best hire for tomorrow."*

TalentPulse AI is an AI-powered Recruiter Copilot that solves the limitations of traditional ATS platforms. Instead of relying solely on keyword matching and fixed years of experience, it uses semantic understanding, multi-signal evaluations, and future-potential prediction to discover high-potential talent.

---

## Core Innovations

### 1. Learning Velocity Score (10%)
Traditional ATS platforms look at static skills. TalentPulse AI tracks **skill evolution** over the candidate's professional timeline, mapping when tools and libraries were acquired. Continual learning and recent adoptions are highly weighted:
$$\text{Learning Velocity} = \text{Unique Years in Timeline} \times 10 + \text{Recent Tech Adoptions (2025-2026)} \times 10 + \text{Baseline} (40)$$

### 2. Potential-to-Hire Score (10%)
Predicts the candidate's growth trajectory and future value tomorrow compared to today:
$$\text{Potential-to-Hire} = (0.4 \times \text{Learning Velocity}) + (0.3 \times \text{Career Growth}) + (0.3 \times \text{Skill Freshness})$$

### 3. Candidate Digital Twin
Generates a recruiter-friendly, memorable archetype (e.g. *Emerging Technical Leader*, *Deep Domain Specialist*) listing concise key strengths, weaknesses/growth areas, and a concrete career forecast (e.g., *Ready to transition to Tech Lead in 12 months*).

### 4. Interactive What-If Simulator
A real-time sliding sandbox allowing recruiters to dynamically shift criteria weights, override required must-have skills, or filter by years of experience and seniority. The candidate rankings slide and re-order instantly with visual indicators showing rank movements (Up/Down).

---

## Tech Stack

* **Frontend**: Next.js 14 App Router, TypeScript, Tailwind CSS v4, Recharts, Lucide Icons
* **Backend**: FastAPI (Python), SQLite (SQLAlchemy), Qdrant Client (In-memory serverless mode)
* **ML/NLP**: PDF text extraction (`pypdf`), semantic similarity and keyword mapping, LLM API gateway (OpenAI GPT-4o / Gemini 1.5 Flash compatible, with an offline heuristic fallback)

---

## Project Structure

```text
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── database.py       # SQLite connection & SQLAlchemy setup
│   │   ├── models.py         # Relational database models
│   │   ├── main.py           # FastAPI endpoints & CORS
│   │   └── services/
│   │       ├── __init__.py
│   │       ├── parser.py     # PDF text extractor & resume/JD parser
│   │       └── ai_engine.py  # Multi-signal scoring & Digital Twin generator
│   ├── tests/
│   │   └── test_scoring.py   # Python test suite for evaluations
│   └── requirements.txt      # Python dependencies
├── src/
│   └── app/
│       ├── page.tsx          # Main React dashboard & What-If simulator
│       ├── layout.tsx        # Next.js layout & Outfit/Inter fonts
│       └── globals.css       # Deep-space glassmorphism styles
├── package.json
└── tsconfig.json
```

---

## Getting Started

### 1. Start the FastAPI Backend
Ensure you have Python installed, then set up the virtual environment and install packages:

```bash
# Navigate to the backend directory
cd backend

# Create a virtual environment
python -m venv venv

# Activate venv (Windows)
.\venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start the server (runs on port 8000)
uvicorn app.main:app --reload
```

*Note: You can add `OPENAI_API_KEY` or `GEMINI_API_KEY` to your environment variables to enable full LLM parsing. If omitted, the backend automatically runs in offline heuristic mode.*

---

### 2. Start the Next.js Frontend
From the root workspace folder, install node modules and start the dev server:

```bash
# Install NPM dependencies
npm install

# Start the dev server (runs on port 3000)
npm run dev
```

*Note: The frontend has a dual-mode client API wrapper. If the FastAPI backend is offline, the interface will automatically switch to a **Local AI Engine** using rich simulated mock states, ensuring the dashboard is 100% interactive and functional out-of-the-box!*

---

## Running Backend Tests
To verify the multi-signal mathematical formulas:

```bash
cd backend
.\venv\Scripts\python .\tests\test_scoring.py
```

---

## Deploying (Vercel frontend + Render backend)

Follow these quick steps to deploy the app using Vercel (frontend) and Render (backend).

### 1) Deploy Frontend to Vercel
1. Go to https://vercel.com and sign in with GitHub.
2. Click "New Project" and select the `sayali2327/TalentPulse-AI` repository.
3. Vercel will auto-detect Next.js — click Deploy.
4. After deploy, go to Project Settings → Environment Variables and add:
	- `NEXT_PUBLIC_API_URL` = `https://<your-render-backend-url>`

### 2) Deploy Backend to Render
1. Go to https://render.com and sign in with GitHub.
2. Create a new **Web Service** and connect the `sayali2327/TalentPulse-AI` repo.
3. Use branch `master` (or your chosen branch).
4. Set runtime to `Python 3.11`.
5. Set the **Build Command** to:

```bash
pip install -r backend/requirements.txt
```

6. Set the **Start Command** to:

```bash
cd backend && uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

7. (Optional) Add environment variables on Render, e.g. `DATABASE_URL`, `OPENAI_API_KEY`, `GITHUB_TOKEN`.
8. Deploy and wait for the service URL (e.g., `https://talentpulse-backend.onrender.com`).

9. Update `NEXT_PUBLIC_API_URL` in Vercel with the Render backend URL and redeploy the frontend.

### Notes & Troubleshooting
- A sample `render.yaml` and `backend/Procfile` were added to this repository to simplify Render setup.
- If you need OAuth credentials for LinkedIn or GitHub, add them as secure environment variables on Render.
- For production, consider using a managed DB instead of the default SQLite file.

