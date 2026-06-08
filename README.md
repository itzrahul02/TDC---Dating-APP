# TDC Matchmaker Dashboard

An internal CRM tool for matchmakers at **The Date Crew (TDC)**. Built as a full-stack internship assignment. The tool helps matchmakers view client profiles, run a scoring algorithm to find compatible matches from a pool of 100+ profiles, and send personalised AI-generated match introductions.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Folder Structure](#3-folder-structure)
4. [Getting Started](#4-getting-started)
5. [Environment Variables](#5-environment-variables)
6. [App Screens & Flow](#6-app-screens--flow)
7. [Data Schema](#7-data-schema)
8. [Matching Algorithm](#8-matching-algorithm)
9. [AI Integration](#9-ai-integration)
10. [API Endpoints](#10-api-endpoints)
11. [Deployment](#11-deployment)
12. [Sample Login Credentials](#12-sample-login-credentials)
13. [Write-up for Submission](#13-write-up-for-submission)

---

## 1. Project Overview

### Problem

TDC matchmakers manage a growing list of clients across different stages of their matchmaking journey. Currently they do this manually — spreadsheets, WhatsApp notes, memory. There is no structured way to:

- View all client biodatas in one place
- Find compatible matches from a pool of profiles
- Track where each client is in the journey
- Send a personalised match introduction

### Solution

A clean internal web dashboard where a matchmaker logs in, sees all their clients, clicks into a profile, runs match scoring, reviews the top 5 ranked matches with AI-generated introductions, and sends a mock match email — all in one flow.

### Key Decisions

- **MongoDB** for persistent data storage (instead of localStorage)
- **Express.js backend** with JWT authentication
- **Backend AI provider integration** (Groq or Anthropic) for personalised match introductions
- **Custom scoring algorithm** with gender-specific weights based on Indian matrimonial patterns

---

## 2. Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Frontend | React 18 (Vite) | Fast setup, component-based, hot reload |
| Styling | Tailwind CSS | Utility-first, no separate CSS files |
| Routing | React Router v6 | Simple 5-route setup |
| HTTP Client | Axios | Interceptors for JWT, error handling |
| Backend | Express.js | Lightweight, fast REST API |
| Database | MongoDB + Mongoose | Schema-based, flexible documents, free Atlas tier |
| Auth | JWT + bcrypt | Stateless tokens, secure password hashing |
| AI | Groq or Anthropic (via backend route) | Personalised 2-sentence match intros |
| Notifications | react-hot-toast | Non-intrusive success/error toasts |

---

## 3. Folder Structure

```
TDC---Dating-APP/
├── public/
├── src/
│   ├── api/
│   │   ├── axios.js            # Axios instance with JWT interceptor
│   │   └── claudeIntro.js      # Claude AI integration
│   ├── components/
│   │   ├── Sidebar.jsx         # Left nav (name + links + logout)
│   │   ├── StatusBadge.jsx     # Coloured status chip
│   │   ├── MatchCard.jsx       # Individual match result card
│   │   └── Modal.jsx           # Send match email modal
│   ├── logic/
│   │   └── matchScore.js       # Scoring algorithm (100 pts)
│   ├── pages/
│   │   ├── Login.jsx           # Screen 1: Login
│   │   ├── Dashboard.jsx       # Screen 2: Client list + stats
│   │   ├── ClientDetail.jsx    # Screen 3: Full biodata + notes
│   │   └── Matches.jsx         # Screen 4: Match results + AI intros
│   ├── data/
│   │   └── clients.json        # Reference data (seeded into MongoDB)
│   ├── App.jsx                 # Routes + protected route wrapper
│   ├── main.jsx                # Entry point
│   └── index.css               # Tailwind directives
├── server/
│   ├── config/
│   │   └── db.js               # MongoDB connection
│   ├── middleware/
│   │   └── auth.js             # JWT verification middleware
│   ├── models/
│   │   ├── Profile.js          # Mongoose schema (clients + pool)
│   │   └── User.js             # User schema with bcrypt
│   ├── routes/
│   │   ├── auth.js             # POST /api/auth/login
│   │   └── profiles.js         # GET/PATCH clients, GET pool
│   ├── seed.js                 # Seeds DB with 15 clients + 100 pool
│   ├── index.js                # Express server entry
│   ├── .env.example
│   └── package.json
├── .env.example
├── .gitignore
├── index.html
├── tailwind.config.js
├── vite.config.js
└── package.json
```

---

## 4. Getting Started

### Prerequisites

- **Node.js** v18+
- **MongoDB** (local install or MongoDB Atlas free tier)
- **AI provider API key** (Groq or Anthropic) for intros

### Step 1 — Clone the project

```bash
git clone https://github.com/itzrahul02/TDC---Dating-APP.git
cd TDC---Dating-APP
```

### Step 2 — Install dependencies

```bash
# Frontend
npm install

# Backend
cd server
npm install
```

### Step 3 — Configure environment variables

```bash
# Root .env (frontend)
cp .env.example .env
# Edit: add your backend API URL

# Server .env
cd server
cp .env.example .env
# Edit: add MongoDB URI + AI provider credentials
```

### Step 4 — Seed the database

```bash
cd server
npm run seed
```

This creates:
- 1 matchmaker user (`matchmaker` / `tdc2024`)
- 15 client profiles
- 100 dummy pool profiles for matching

### Step 5 — Start the servers

```bash
# Terminal 1 — Backend (port 5000)
cd server
npm run dev

# Terminal 2 — Frontend (port 5173)
cd ..
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## 5. Environment Variables

### Frontend (`.env`)

| Variable | Description | Required |
|---|---|---|
| `VITE_API_URL` | Backend server URL (default: `http://localhost:8000`) | Yes |

### Backend (`server/.env`)

| Variable | Description | Required |
|---|---|---|
| `MONGODB_URI` | MongoDB connection string | Yes |
| `JWT_SECRET` | Secret key for signing JWT tokens | Yes |
| `PORT` | Server port (default: 8000) | No |
| `CLIENT_URLS` | Comma-separated frontend origins for CORS | Yes |
| `AI_PROVIDER` | `groq` or `anthropic` | Yes (if AI enabled) |
| `GROQ_API_KEY` | Groq API key (required when `AI_PROVIDER=groq`) | Conditional |
| `GROQ_MODEL` | Groq model name (for example `llama-3.1-8b-instant`) | No |
| `ANTHROPIC_API_KEY` | Anthropic API key (required when `AI_PROVIDER=anthropic`) | Conditional |
| `ANTHROPIC_MODEL` | Anthropic model name (for example `claude-3-5-sonnet-latest`) | No |

---

## 6. App Screens & Flow

```
[1] Login Page  (/login)
        |
        | JWT token issued
        ↓
[2] Dashboard  (/dashboard)
        |
        | click a client row
        ↓
[3] Client Detail  (/client/:id)
        |
        | click "Find Matches"
        ↓
[4] Match Results  (/client/:id/matches)
        |
        | click "Send Match"
        ↓
[5] Send Match Modal  (overlay on Screen 4)
        |
        | click "Confirm Send"
        ↓
    Toast: "Match intro sent!" → client status updates to "Intro Sent" in MongoDB
```

### Screen 1 — Login
- Centered card with TDC branding
- Username + password → POST `/api/auth/login`
- JWT token stored in localStorage, attached to all subsequent API requests via Axios interceptor
- Protected routes redirect to `/login` if no token

### Screen 2 — Dashboard
- Sidebar: matchmaker name, navigation, logout
- Stats row: Total Clients, Searching, Intros Sent, Matched (live from MongoDB)
- Search input (filters by name/city) + status filter dropdown
- Client table with clickable rows → navigates to `/client/:id`

### Screen 3 — Client Detail
- Avatar (initials), full name, age, city, status dropdown
- Biodata grid: Personal, Education & Career, Preferences, Family sections
- Notes textarea — saves to MongoDB on blur
- "Find Matches →" button

### Screen 4 — Match Results
- Runs matching algorithm (client vs. 100 pool profiles)
- Shows top 5 matches with score badges, reason pills, AI intros
- "Send Match" button opens email modal

### Screen 5 — Send Match Modal
- Mock email preview (To, Subject, Body)
- Editable textarea for matchmaker to customize
- "Confirm Send" → updates client status to "Intro Sent" in MongoDB

---

## 7. Data Schema

### Profile Model (MongoDB)

Both clients and pool profiles share one schema. The `isClient` boolean distinguishes them.

```javascript
{
  profileId: String,        // "c001" for clients, "p001" for pool
  gender: "male" | "female",
  firstName: String,
  lastName: String,
  dob: String,
  age: Number,
  city: String,
  country: String,
  height: Number,           // cm
  email: String,
  phone: String,
  religion: String,         // Hindu, Muslim, Sikh, Christian, Jain, Buddhist
  caste: String,
  maritalStatus: String,    // Never Married, Divorced, Widowed
  motherTongue: String,
  languages: [String],
  diet: String,             // Vegetarian, Non-Vegetarian, Eggetarian
  income: Number,           // LPA (lakhs per annum)
  company: String,
  designation: String,
  education: String,
  college: String,
  siblings: Number,
  familyType: String,       // Nuclear, Joint, Open
  wantKids: String,         // Yes, No, Maybe
  openToRelocate: String,   // Yes, No, Maybe
  openToPets: String,       // Yes, No, Maybe
  isClient: Boolean,        // true = matchmaker's client, false = pool
  status: String,           // Searching, Intro Sent, Matched, On Hold
  notes: String             // Matchmaker's freetext notes
}
```

### User Model (MongoDB)

```javascript
{
  username: String,         // unique
  password: String,         // bcrypt hashed (10 rounds)
  name: String              // Display name
}
```

---

## 8. Matching Algorithm

**File:** `src/logic/matchScore.js`

### How it works

```javascript
getTopMatches(clientProfile, pool, limit = 5)
```

1. **Filter** — Only opposite-gender profiles are considered
2. **Score** — Each candidate is scored out of 100 using weighted criteria
3. **Sort** — Descending by score
4. **Filter** — Only matches scoring 45+ are returned
5. **Limit** — Top 5 (configurable) are shown to the matchmaker

### Why gender-specific weights?

Based on actual patterns in Indian matrimonial data:
- **Male clients** prioritize religion/caste compatibility, age gap, and mutual kid preferences
- **Female clients** prioritize financial stability, career support (relocation flexibility), and family type compatibility

### Scoring Weights — Male Clients (matching with females)

| # | Criterion | Max Points | Logic |
|---|---|---|---|
| 1 | Religion match | 15 | Same = 15, different = 0 |
| 2 | Caste match | 10 | Same = 10, same religion but diff caste = 5 |
| 3 | Age gap | 15 | Woman 1–5 yrs younger = 15, 6–10 = 8, same = 5, older = 0 |
| 4 | Income relative | 15 | Woman earns less = 15, same = 10, more = 5 |
| 5 | Kids preference | 15 | Both same = 15, one "Maybe" = 8, opposite = 0 |
| 6 | City / relocation | 10 | Same city = 10, she relocates = 7, he relocates = 5 |
| 7 | Education tier | 10 | Same/higher tier = 10, 1 below = 5 |
| 8 | Family type | 10 | Same = 10, one "Open" = 7, opposite = 0 |
| | **Total** | **100** | |

### Scoring Weights — Female Clients (matching with males)

| # | Criterion | Max Points | Logic |
|---|---|---|---|
| 1 | Income (man ≥ woman) | 25 | Man earns same/more = 25, less = 10 |
| 2 | Religion match | 15 | Same = 15 |
| 3 | Caste match | 10 | Same = 10, same religion diff caste = 5 |
| 4 | Relocation support | 15 | Man open = 15, Maybe = 8, No = 0 |
| 5 | Family type | 15 | Compatible nuclear = 15, same = 15, open = 7 |
| 6 | Kids preference | 10 | Both aligned = 10, one Maybe = 5 |
| 7 | Education tier | 10 | Same/higher = 10, 1 below = 5 |
| | **Total** | **100** | |

### Education Tier Classification

```javascript
Tier 3 (highest): IIT, IIM, AIIMS, M.Tech, MBA
Tier 2 (mid):     B.Tech, B.E., CA, M.Sc
Tier 1 (base):    Everything else (BBA, B.Com, Diploma, etc.)
```

### Score Labels

| Score Range | Label | Badge |
|---|---|---|
| 85 – 100 | High Potential Match | 🔥 |
| 65 – 84 | Good Match | ✅ |
| 45 – 64 | Possible Match | 🤝 |
| Below 45 | Not shown | — |

### Auto-Generated Reasons

The algorithm also builds an array of human-readable reason strings:

```javascript
reasons: ["Same religion", "Compatible on kids", "Open to relocate"]
```

These are displayed as pills on each match card — purely algorithmic, no AI needed.

### Code Walkthrough

```javascript
// Education tier helper
function getEducationTier(education) {
  const upper = (education || '').toUpperCase();
  if (upper.includes('IIT') || upper.includes('IIM') || upper.includes('MBA')) return 3;
  if (upper.includes('B.TECH') || upper.includes('B.E.') || upper.includes('CA')) return 2;
  return 1;
}

// Main function
export function getTopMatches(client, pool, limit = 5) {
  const candidates = pool.filter(p => p.gender !== client.gender);
  
  const scored = candidates.map(match => {
    const { score, reasons } = client.gender === 'male'
      ? scoreMaleClient(client, match)
      : scoreFemaleClient(client, match);
    
    // Assign label based on score
    let label = '', badge = '';
    if (score >= 85) { label = 'High Potential Match'; badge = '🔥'; }
    else if (score >= 65) { label = 'Good Match'; badge = '✅'; }
    else if (score >= 45) { label = 'Possible Match'; badge = '🤝'; }
    
    return { ...match, score, reasons, label, badge };
  });

  return scored
    .filter(m => m.score >= 45)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}
```

---

## 9. AI Integration

**File:** `src/api/claudeIntro.js`

**Backend route:** `server/routes/ai.js` (`POST /api/ai/intros`)

### Purpose

After the scoring algorithm returns the top 5 matches, the frontend calls the backend AI route to generate **personalised 2-sentence introductions** for each match. The backend then calls the configured provider (Groq or Anthropic). This keeps provider API keys off the client.

### The Prompt Engineering

```
You are a professional matrimonial matchmaker writing personalised introductions.

Given the client profile and 5 potential matches below, write a 2-sentence
introduction for each match explaining why they are a good fit. Focus on
shared values, compatibility, and genuine connection — not just demographics.

Return ONLY a valid JSON array of 5 strings. No extra text, no markdown.

Client: {client profile JSON}
Matches: {array of 5 match profiles JSON}
```

**Why this prompt works:**
- **Role framing** — "professional matrimonial matchmaker" sets tone and expertise
- **Constraint** — "2-sentence" prevents verbosity
- **Focus directive** — "shared values, genuine connection" avoids repeating what the algorithm already shows (demographics)
- **Output format** — "ONLY a valid JSON array" ensures parseable response
- **No markdown** — prevents code fences that break JSON.parse()

### Frontend API Call

```javascript
const response = await api.post('/api/ai/intros', { client, matches });
const intros = response.data.intros;
```

### Backend Provider Call

The backend uses `AI_PROVIDER` to select a provider:
- `groq` -> calls Groq Chat Completions API
- `anthropic` -> calls Anthropic Messages API

Provider errors are returned as:

```json
{
  "message": "AI provider request failed",
  "details": "...provider specific error..."
}
```

### Response Format

```json
{
  "intros": [
    "Intro 1",
    "Intro 2"
  ]
}
```

### Error Handling Strategy

```javascript
try {
  const response = await api.post('/api/ai/intros', { client, matches });
  return response.data.intros;
} catch (error) {
  console.error('AI intro generation failed:', error);
  return matches.map(() => 
    "Introduction not available — AI service temporarily unavailable."
  );
}
```

**Why this approach:**
- Never blocks the UI — matches are shown immediately (from algorithm)
- Graceful degradation — if AI fails, user still sees scores/reasons
- Single fallback message — no confusing partial results

### UX During Loading

1. Match cards render **immediately** with scores and reason pills (from algorithm)
2. AI intro area shows a **skeleton pulse animation** (`animate-pulse`)
3. Once Claude responds (~2-3 seconds), intros **fade in** below each card in italic

### Flow Diagram

```
┌─────────────────────────────────────────────────┐
│ Client clicks "Find Matches"                      │
└─────────────────┬───────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────┐
│ Frontend fetches client + pool from MongoDB       │
│ GET /api/clients/:id + GET /api/pool              │
└─────────────────┬───────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────┐
│ matchScore.js runs locally in browser             │
│ Scores 100 profiles → returns top 5              │
│ Renders cards with scores + reasons immediately   │
└─────────────────┬───────────────────────────────┘
                  │
                  ▼ (async, non-blocking)
┌─────────────────────────────────────────────────┐
│ claudeIntro.js sends 1 call to /api/ai/intros     │
│ Backend calls Groq/Anthropic with server key      │
│ Skeleton animation shown during wait              │
└─────────────────┬───────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────┐
│ JSON.parse response → render intros in italic     │
│ If error → show fallback text                     │
└─────────────────────────────────────────────────┘
```

---

## 10. API Endpoints

### Authentication

| Method | Endpoint | Body | Response |
|---|---|---|---|
| POST | `/api/auth/login` | `{ username, password }` | `{ user: { username, name } }` + httpOnly `token` cookie |

### Profiles (all require auth cookie)

| Method | Endpoint | Query Params | Response |
|---|---|---|---|
| GET | `/api/clients` | `?search=&status=` | Array of client profiles |
| GET | `/api/clients/stats` | — | `{ total, searching, introSent, matched }` |
| GET | `/api/clients/:id` | — | Single client profile |
| PATCH | `/api/clients/:id` | Body: `{ status?, notes? }` | Updated client profile |
| GET | `/api/pool` | — | Array of 100 pool profiles |

### Security Measures

- Passwords hashed with **bcrypt** (10 salt rounds)
- JWT tokens **expire in 24 hours**
- All profile routes **protected by auth middleware**
- 401 response triggers **automatic logout + redirect** via Axios interceptor
- CORS restricted to **CLIENT_URL only**
- Input validated on backend — no raw user input in DB queries

---

## 11. Deployment

### Option A — Vercel (Frontend) + Railway/Render (Backend)

**Frontend (Vercel):**
1. Push to GitHub
2. Import in Vercel → set env vars (`VITE_API_URL`, `VITE_ANTHROPIC_API_KEY`)
3. Deploy

**Backend (Railway/Render):**
1. Create new service from `server/` directory
2. Set env vars (`MONGODB_URI`, `JWT_SECRET`, `CLIENT_URL`)
3. Start command: `node index.js`

### Option B — Local Development

```bash
# Terminal 1 — Backend
cd server && npm run dev

# Terminal 2 — Frontend
npm run dev
```

### MongoDB Atlas Setup (Free Tier)

1. Go to https://cloud.mongodb.com
2. Create free M0 cluster
3. Create database user with read/write permissions
4. Whitelist your IP (or `0.0.0.0/0` for dev)
5. Get connection string → paste in `server/.env` as `MONGODB_URI`

---

## 12. Sample Login Credentials

```
Username: matchmaker
Password: tdc2024
```

Created by the seed script (`npm run seed`). In production, replace with proper user management.

---

## 13. Write-up for Submission

### Tech Choices

I built the TDC Matchmaker Dashboard as a **React + Vite + Tailwind** frontend with an **Express + MongoDB** backend. The key architectural decision was using MongoDB instead of localStorage — this gives persistent, queryable data storage that survives across devices and sessions. Authentication uses JWT tokens with bcrypt-hashed passwords. The frontend communicates with the backend through an Axios instance with automatic token attachment and 401 handling.

### Matching Logic

The core of the project is a **weighted scoring function** in `src/logic/matchScore.js`. It takes a client profile and scores every opposite-gender profile in the pool out of 100. The weights are **gender-specific**, reflecting actual preferences observed in Indian matrimonial data:

- **Male clients**: top weights are religion/caste (25 pts combined), kids preference (15 pts), and age gap (15 pts)
- **Female clients**: top weight is financial stability (25 pts), followed by relocation flexibility (15 pts) and family type (15 pts)

The algorithm returns the top 5 matches scoring above 45, each with a label (🔥 High Potential / ✅ Good Match / 🤝 Possible) and auto-generated reason pills.

### How AI is Used

Once the top 5 matches are calculated algorithmically, a **single API call** is made to Claude. Both the client profile and all 5 match profiles are sent in a structured prompt asking for personalised 2-sentence introductions. The AI adds a layer of human storytelling — connecting shared values and genuine compatibility — that pure demographic scoring cannot provide. These intros appear in italic on each match card and are pre-populated in the "Send Match" email template.

### Database Design

A single `Profile` schema handles both clients (`isClient: true`) and pool profiles (`isClient: false`). This makes the matching query simple — filter by `isClient: false` and opposite gender. Client-specific fields (`status`, `notes`) are updated via PATCH endpoint and persisted in MongoDB, not browser storage.

### Security

- Passwords are **never stored in plaintext** — bcrypt with 10 salt rounds
- JWT tokens **expire in 24 hours**
- API routes are **protected by auth middleware** — no token = 401
- CORS is **restricted to the frontend origin**
- Axios interceptor **auto-redirects on 401** (expired/invalid token)

### Assumptions

- The matchmaker manages a fixed set of 15 clients; onboarding is out of scope for MVP
- The matching pool is 100 randomly generated (but realistic) Indian profiles
- Match emails are mocked — "Confirm Send" updates status but doesn't send real email
- The Claude API key is on the frontend for demo — in production, route through backend
