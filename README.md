# TDC Matchmaker Dashboard

An internal CRM tool for matchmakers at **The Date Crew (TDC)**. Built as a mid-size full-stack internship assignment. The tool helps matchmakers view client profiles, run a scoring algorithm to find compatible matches from a pool of 100+ profiles, and send personalised AI-generated match introductions.

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
10. [Deployment](#10-deployment)
11. [Sample Login Credentials](#11-sample-login-credentials)
12. [Known Limitations & Future Improvements](#12-known-limitations--future-improvements)
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

### Inspiration

UI/UX patterns borrowed from:
- **Shaadi.com** — biodata field structure and grouping
- **BharatMatrimony** — sidebar + client list layout
- **Jeevansathi** — minimal, trust-first login screen

---

## 2. Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | React 18 (Vite) | Fast setup, component-based, easy to explain |
| Styling | Tailwind CSS | Utility-first, no separate CSS files, readable inline |
| Routing | React Router v6 | Simple 5-route setup, one file |
| Data | Static JSON files | No DB needed for MVP, imported directly |
| State | React useState + localStorage | Auth state in React, notes/status persist via localStorage |
| AI | Claude API (Anthropic) | One API call returns 5 personalised match intros as JSON |
| Hosting | Vercel | Free tier, auto-deploys from GitHub |

> **No backend server.** All data is static JSON. The Claude API is called directly from the frontend. This is a documented limitation — see section 12.

---

## 3. Folder Structure

```
tdc-matchmaker/
├── public/
│   └── favicon.ico
├── src/
│   ├── pages/
│   │   ├── Login.jsx           # Screen 1: Login form
│   │   ├── Dashboard.jsx       # Screen 2: Client list + stats
│   │   ├── ClientDetail.jsx    # Screen 3: Full biodata + notes
│   │   └── Matches.jsx         # Screen 4: Match results + AI intros
│   ├── components/
│   │   ├── Sidebar.jsx         # Left nav (matchmaker name + links)
│   │   ├── ClientCard.jsx      # Row/card in the dashboard list
│   │   ├── MatchCard.jsx       # Individual match result card
│   │   ├── Modal.jsx           # Send match modal (Screen 5)
│   │   └── StatusBadge.jsx     # Coloured status chip component
│   ├── data/
│   │   ├── clients.json        # 15 client profiles (matchmaker's own clients)
│   │   └── pool.json           # 100 dummy profiles (matching pool)
│   ├── logic/
│   │   └── matchScore.js       # Scoring algorithm — core logic
│   ├── api/
│   │   └── claudeIntro.js      # Claude API call for AI match intros
│   ├── App.jsx                 # Route definitions
│   └── main.jsx                # Entry point
├── .env                        # API key (never commit this)
├── .env.example                # Template for env vars
├── .gitignore
├── index.html
├── tailwind.config.js
├── vite.config.js
└── package.json
```

---

## 4. Getting Started

### Prerequisites

Make sure you have the following installed:

- **Node.js** v18 or above — check with `node -v`
- **npm** v9 or above — check with `npm -v`
- A free **Anthropic API key** — get one at https://console.anthropic.com

### Step 1 — Clone or create the project

```bash
# If you're starting fresh with Vite
npm create vite@latest tdc-matchmaker -- --template react
cd tdc-matchmaker
```

### Step 2 — Install dependencies

```bash
npm install
npm install react-router-dom
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### Step 3 — Configure Tailwind

In `tailwind.config.js`, update the content array:

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

In `src/index.css`, replace everything with:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### Step 4 — Add environment variables

Create a `.env` file in the project root:

```
VITE_ANTHROPIC_API_KEY=your_api_key_here
```

> **Important:** In Vite, all environment variables exposed to the frontend must start with `VITE_`. Access it in code as `import.meta.env.VITE_ANTHROPIC_API_KEY`.

### Step 5 — Create the folder structure

Manually create the folders as shown in section 3, or run:

```bash
mkdir -p src/pages src/components src/data src/logic src/api
```

### Step 6 — Run the development server

```bash
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## 5. Environment Variables

| Variable | Description | Required |
|---|---|---|
| `VITE_ANTHROPIC_API_KEY` | Your Anthropic API key for Claude | Yes |

Create a `.env.example` file (safe to commit) with:

```
VITE_ANTHROPIC_API_KEY=your_key_here
```

Add `.env` to your `.gitignore` so the real key is never pushed to GitHub:

```
# .gitignore
.env
node_modules/
dist/
```

---

## 6. App Screens & Flow

```
[1] Login Page  (/login)
        |
        | correct credentials
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
    Toast: "Match intro sent!" → client status updates to "Intro Sent"
```

### Screen 1 — Login

- Centered card with TDC branding
- Username + password inputs
- On submit: checks hardcoded credentials, sets `isLoggedIn: true` in React state, saves to `localStorage` so refresh doesn't log out
- Protected routes — if not logged in, all routes redirect to `/login`

### Screen 2 — Dashboard

- Left sidebar: matchmaker name, navigation links, logout button
- Top bar: search input (filters by client name or city), status filter dropdown
- Stats row: 4 metric cards — Total Clients, Searching, Intros Sent, Matched
- Client table: Name | Age | City | Marital Status | Status badge
- Clicking any row navigates to `/client/:id`

### Screen 3 — Client Detail

- Header: avatar (initials circle), full name, age, city, current status
- Editable status dropdown (Searching / Intro Sent / Matched / On Hold) — change saves to localStorage
- Biodata grid: 2-column layout, fields grouped into 4 sections:
  - **Personal** — DOB, gender, height, religion, caste, mother tongue, diet
  - **Education & Career** — degree, college, company, designation, income
  - **Preferences** — wants kids, open to relocate, open to pets, family type
  - **Family** — siblings, languages known
- Notes textarea — matchmaker types freetext notes, auto-saved to localStorage on change
- "Find Matches →" button at bottom right

### Screen 4 — Match Results

- Back button + heading "Matches for [Client Name]"
- Loading skeleton while Claude API call is in progress
- Top 5 match cards (see MatchCard component)
- Each card shows:
  - Score badge: 🔥 High Potential (85–100) · ✅ Good Match (65–84) · 🤝 Possible (45–64)
  - Name, Age, City, Designation
  - 3 matching reason pills (e.g. "Same religion", "Open to relocate", "Compatible on kids")
  - AI-generated 2-line intro in italic
  - "Send Match" button

### Screen 5 — Send Match Modal

- Triggered by "Send Match" button on any match card
- Shows a mock email preview:
  - **To:** client's email address
  - **Subject:** "We found a great match for you — [Match Name]"
  - **Body:** Match's key details + AI intro paragraph
- Editable textarea so matchmaker can tweak before sending
- "Confirm Send" → closes modal → shows success toast → updates client status to "Intro Sent"

---

## 7. Data Schema

Both `clients.json` and `pool.json` use the same profile object shape. The only difference is that client profiles also have `status` and `notes` fields.

```json
{
  "id": "c001",
  "gender": "male",
  "firstName": "Arjun",
  "lastName": "Mehta",
  "dob": "1995-03-14",
  "age": 29,
  "city": "Mumbai",
  "country": "India",
  "height": 175,
  "email": "arjun.mehta@example.com",
  "phone": "+91 98765 43210",
  "religion": "Hindu",
  "caste": "Brahmin",
  "maritalStatus": "Never Married",
  "motherTongue": "Hindi",
  "languages": ["Hindi", "English", "Marathi"],
  "diet": "Vegetarian",
  "income": 22,
  "company": "Infosys",
  "designation": "Senior Software Engineer",
  "education": "B.Tech Computer Science",
  "college": "IIT Bombay",
  "siblings": 1,
  "familyType": "Nuclear",
  "wantKids": "Yes",
  "openToRelocate": "Maybe",
  "openToPets": "Yes",

  "status": "Searching",
  "notes": ""
}
```

### Field reference

| Field | Type | Values / Notes |
|---|---|---|
| `id` | string | Unique. Use `"c001"` for clients, `"p001"` for pool |
| `gender` | string | `"male"` or `"female"` |
| `age` | number | Used directly in scoring |
| `height` | number | In centimetres |
| `income` | number | Annual in LPA (lakhs per annum) |
| `religion` | string | Hindu / Muslim / Christian / Sikh / Jain / Buddhist |
| `caste` | string | Brahmin / Kshatriya / Kayastha / Agarwal / etc. |
| `maritalStatus` | string | Never Married / Divorced / Widowed |
| `familyType` | string | Joint / Nuclear / Open |
| `wantKids` | string | Yes / No / Maybe |
| `openToRelocate` | string | Yes / No / Maybe |
| `openToPets` | string | Yes / No / Maybe |
| `diet` | string | Vegetarian / Non-Vegetarian / Eggetarian |
| `status` | string | Client only — Searching / Intro Sent / Matched / On Hold |
| `notes` | string | Client only — matchmaker's freetext notes |

---

## 8. Matching Algorithm

The core logic lives in `src/logic/matchScore.js`. It exports one function:

```js
getTopMatches(clientProfile, pool, limit = 5)
```

This function:
1. Filters the pool to the opposite gender
2. Scores each pool profile against the client out of 100
3. Sorts by score descending
4. Returns the top `limit` matches with score, label, and matching reasons

### Scoring weights

#### For male clients (matching with female profiles)

| Criterion | Max Points | Logic |
|---|---|---|
| Religion match | 15 | Same = 15, different religion = 0 |
| Caste match | 10 | Same = 10, same religion diff caste = 5, open = 10 |
| Age gap | 15 | Woman 1–5 yrs younger = 15, 6–10 = 8, same age = 5, older = 0 |
| Income (woman ≤ man) | 15 | Woman earns less = 15, same = 10, earns more = 5 |
| Kids preference | 15 | Both same = 15, one "Maybe" + other "Yes/No" = 8, opposite = 0 |
| City / relocation | 10 | Same city = 10, woman open to relocate = 7, man open = 5, neither = 0 |
| Education tier | 10 | Same tier or woman 1 below = 10, 2 below = 5 |
| Family type | 10 | Same = 10, one "Open" = 7, opposite = 0 |

#### For female clients (matching with male profiles)

| Criterion | Max Points | Logic |
|---|---|---|
| Income (man ≥ woman) | 25 | Man earns same or more = 25, less = 10 |
| Religion match | 15 | Same religion = 15 |
| Caste match | 10 | Same = 10, same religion diff caste = 5 |
| Relocation / career support | 15 | Man open to relocate = 15, Maybe = 8, No = 0 |
| Family type | 15 | Woman prefers nuclear + man nuclear/open = 15, joint = 0 |
| Kids preference | 10 | Both aligned = 10, one Maybe = 5 |
| Education tier | 10 | Same tier or man 1 above = 10 |

### Score labels

| Score | Label | Badge |
|---|---|---|
| 85 – 100 | High Potential Match | 🔥 |
| 65 – 84 | Good Match | ✅ |
| 45 – 64 | Possible Match | 🤝 |
| Below 45 | Not shown | — |

### Matching reasons (auto-generated)

The function also builds an array of human-readable reason strings for each match, e.g.:

```js
reasons: ["Same religion", "Compatible on kids", "Open to relocate"]
```

These are shown as pills on the match card — no AI needed for this part.

---

## 9. AI Integration

The AI feature lives in `src/api/claudeIntro.js`.

### What it does

After the scoring algorithm returns the top 5 matches, a single API call is made to Claude. It sends both the client profile and all 5 match profiles, and asks Claude to return a JSON array of 5 personalised intro strings — one per match.

### The prompt

```
You are a professional matrimonial matchmaker writing personalised introductions.

Given the client profile and 5 potential matches below, write a 2-sentence introduction for each match explaining why they are a good fit. Focus on shared values, compatibility, and genuine connection — not just demographics.

Return ONLY a valid JSON array of 5 strings. No extra text, no markdown.

Client: [client profile as JSON]
Matches: [array of 5 match profiles as JSON]
```

### The API call

```js
const response = await fetch("https://api.anthropic.com/v1/messages", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "x-api-key": import.meta.env.VITE_ANTHROPIC_API_KEY,
    "anthropic-version": "2023-06-01",
    "anthropic-dangerous-direct-browser-access": "true"
  },
  body: JSON.stringify({
    model: "claude-sonnet-4-6",
    max_tokens: 1000,
    messages: [{ role: "user", content: prompt }]
  })
});
```

> **Note:** The `anthropic-dangerous-direct-browser-access: true` header is required when calling the Anthropic API directly from a browser. In production, this call should go through a backend server or serverless function.

### Parsing the response

```js
const data = await response.json();
const text = data.content[0].text;
const intros = JSON.parse(text); // array of 5 strings
```

### Loading state

While the API call is in progress, each match card shows a skeleton placeholder where the intro text will appear. Once resolved, the intros are rendered in italic below the match details.

---

## 10. Deployment

### Deploy to Vercel

1. Push your project to a GitHub repository
2. Go to https://vercel.com and sign in with GitHub
3. Click "Add New Project" → select your repo
4. In the Environment Variables section, add:
   - Key: `VITE_ANTHROPIC_API_KEY`
   - Value: your actual API key
5. Click Deploy

Vercel auto-detects Vite and sets the build command to `vite build` and output directory to `dist`.

Every time you push to `main`, Vercel re-deploys automatically.

### Build locally

```bash
npm run build       # Creates /dist folder
npm run preview     # Preview the production build locally
```

---

## 11. Sample Login Credentials

```
Username: matchmaker
Password: tdc2024
```

These are hardcoded in the Login component for demo purposes. In a real application, this would be replaced with proper authentication (JWT, OAuth, etc.).

---

## 12. Known Limitations & Future Improvements

| Limitation | Why it exists | Production fix |
|---|---|---|
| API key exposed on frontend | No backend in MVP | Move Claude call to a serverless function (Vercel Function or Express route) |
| Data is static JSON | No DB in MVP | Replace with Supabase / Firebase / PostgreSQL |
| Auth is hardcoded | No backend | Add proper JWT auth or NextAuth.js |
| No real email sending | Mock only | Integrate SendGrid or Nodemailer |
| localStorage for state | No DB | Sync to backend DB on every change |
| 100 dummy profiles | Generated data | Real profiles from admin panel |

---

## 13. Write-up for Submission

> Copy-paste this into your submission email.

### Tech choices

I built the TDC Matchmaker Dashboard as a React + Vite single-page application styled with Tailwind CSS. I chose this stack because it is fast to set up, easy to reason about, and simple to explain — which matters for an MVP where the matching logic and AI integration are the core deliverables. Routing is handled by React Router v6. All data lives in static JSON files, and client state (notes, status changes) is persisted via localStorage. The application is deployed on Vercel with zero configuration.

### Matching logic

The core of the project is a scoring function in `src/logic/matchScore.js` that takes a client profile and scores every profile in the opposite-gender pool out of 100. The weights are different for male and female clients, reflecting actual preferences observed in Indian matrimonial data. For male clients, the top weights are religion/caste compatibility, age gap, and income relative to the match. For female clients, the top weights are the man's financial stability, his openness to relocation (supporting her career), and family type preference. The top 5 scores above 45 are returned with a label (High Potential / Good Match / Possible) and an auto-generated list of matching reasons shown as pills on the card.

### How AI is used

Once the top 5 matches are calculated algorithmically, a single API call is made to Claude (Anthropic's model). I send both the client profile and all 5 match profiles in a structured prompt and ask Claude to return a JSON array of 5 personalised 2-sentence introductions explaining why each match is a good fit. These intros appear on each match card in italic and can be copied directly into the match email. The AI adds a layer of personalisation that the scoring algorithm alone cannot provide — it connects the human story behind the numbers.

### Assumptions made

- The matchmaker manages a fixed set of clients; new client onboarding is out of scope for this MVP.
- The matching pool is a static set of 100 dummy profiles generated to represent realistic Indian profiles across cities, professions, religions, and income ranges.
- Match emails are mocked — the "Confirm Send" action updates the client status in UI but does not send a real email.
- The API key is stored in an environment variable on the frontend for demo purposes. In production, this would be moved to a serverless backend function.
