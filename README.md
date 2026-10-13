# Football Prediction Platform (Premier Predictor)
### *Manager Decision Support System (Premier League 2017–18 to 2023–24)*

A production-quality decision-support platform designed specifically for **football managers and recruitment directors**. The platform enables managers to configure their team strategy and squad constraints, evaluate compatibility against a rich player database, run side-by-side tactical radar comparisons, and predict match and season outcomes through Monte Carlo simulations.

---

## 🚀 Quick Start

### 1. Requirements
- Node.js `v18+` (v20+ or v24+ recommended)
- npm `v9+`

### 2. Setup & Installation
```bash
# Clone or navigate to the workspace
cd football_analysis_dashboard

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit **[http://localhost:3000](http://localhost:3000)** in your browser.

### 3. Production Build
```bash
npm run build
npm start
```

---

## 🏟️ Color Theme & Visual Atmosphere

Preserved strictly from [`football-dashboard.html`](file:///c:/Users/ajayt/football_analysis_dashboard/football-dashboard.html):
- **Stadium Night Navy:** `--bg: #071022`
- **Elevated Glassmorphic Panels:** `--panel: #0e1b36`, `--panel2: #13244a`
- **Subtle Structural Borders:** `--line: #233559`
- **Pitch Green Accent:** `--g: #19c37d` (buttons, active tabs, perfect fit badges)
- **Field Turf Dark Tone:** `--g2: #0f8f5c`
- **Scoreboard Contrast Gold:** `--gold: #f6c744`
- **Relegation / Risk Rose:** `--red: #ef5b5b`
- **Dynamic Club Accent:** `--club: #e4202c` (Arsenal red, Man City sky blue `#6cabdd`, Liverpool crimson `#c8102e`, etc.)
- **Typography:** Scoreboard headline typography via `Barlow Condensed`, accessible body text via `DM Sans`.

---

## 🧭 Routes & Core Workflows

| Route | View | Description |
| :--- | :--- | :--- |
| **`/`** | **Strategy Brief Builder** | **The Manager's Brief**: Interactive tactics board pitch with draggable/selectable formations (4-3-3, 4-2-3-1, 3-5-2, 4-4-2), style sliders (pressing intensity, defensive block, build-up, tempo, width, possession vs transition), squad weakness chips, and recruitment constraints (budget, max age, experience, homegrown). |
| **`/results`** | **Scouting Shortlist** | Ranked player cards with fit score out of 100, verdict badges (`PERFECT FIT` ≥90, `STRONG FIT` 80–89, `GOOD FIT` 65–79, `RISKY` <65), filter toggles, shortlist bookmarks, and print-ready PDF export. |
| **`/compare`** | **Player Detail & Compare** | Side-by-side comparison of 2–3 candidates, interactive Recharts radar chart comparing player vector vs team strategy, attribute bars, key strengths, main concerns, and an **"Impact on Team" simulation** (+4.2 expected season points, +8.5% title probability). |
| **`/club`** | **Club Dashboard** | Club identity hero, 20-club selector, predicted starting XI on full tactical SVG pitch, and squad roster table. Includes one-click action to pre-fill the manager brief from the club's style. |
| **`/match`** | **Match Predictor** | Home/Away team and manager selectors with swap button, multi-segment win/draw/loss probability bar in club brand colors, and "What Drives It" tactical driver bars. |
| **`/season`** | **Season Predictor** | 38-game Monte Carlo simulation (800 iterations), projecting title odds %, top-4 finish %, relegation odds %, and full 20-club table with the selected club row highlighted. |
| **`/transfer`** | **Transfer Suitability** | 1-on-1 player-to-manager tactical fit gauge and bridge into the full team strategy brief. |

---

## 🧩 Reusable Components Inventory

All components are located in [`/src/components/`](file:///c:/Users/ajayt/football_analysis_dashboard/src/components/):
- `<FormationBoard />`: Formation pills and pitch node selectors.
- `<Pitch />`: Scaled SVG football pitch with lawn stripes and interactive player nodes.
- `<StyleSliders />`: Dual-tone tactical sliders and defensive block segmented selector.
- `<PlayerCard />`: Scouting card with radial `FitRing`, verdict badge, strengths, and compare controls.
- `<FitRing />`: Smooth SVG circular progress ring with animated count-up and status color coding.
- `<RadarCompare />`: Multi-dimensional Recharts radar overlay comparing candidate vs target vector.
- `<VerdictBadge />`: Accessible status badge for compatibility tier.
- `<ProbabilityBar />`: Dynamic segmented flex odds bar with club colors and percentage labels.
- `<StandingsTable />`: Responsive table for 20 clubs with custom highlighting and metrics.
- `<StatBar />`: Micro-animated comparative attribute bar with target benchmark marker.
- `<ClubCrest />`: Initial-based circular crest placeholder with URL override capability.
- `<SideNav />` & `<MobileBottomNav />`: Adaptive responsive navigation shell.

---

## 🔌 Backend Integration Guide (FastAPI + ML Models)

The data layer in [`/src/lib/api.ts`](file:///c:/Users/ajayt/football_analysis_dashboard/src/lib/api.ts) automatically switches between local ML mock logic and live backend endpoints:

### Environment Configuration
Create a `.env.local` file:
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

### Endpoints to Implement in FastAPI:

1. **`POST /players/match`**
   - **Request Body:** `TeamBrief` (`club`, `formation`, `style`, `needs`, `constraints`)
   - **Expected Response:** `PlayerMatch[]` (array of players with `fitScore`, `verdict`, `attributeFit`, `strengths`, `concerns`, `xiImpact`)
   - **Model:** XGBoost/LightGBM similarity scoring on player feature vectors against manager weights.

2. **`POST /predict/match`**
   - **Request Body:** `{ homeTeam, awayTeam, homeManager, awayManager }`
   - **Expected Response:** `{ home_win, draw, away_win, drivers: [{ name, value, favours }] }`
   - **Model:** Binary/multiclass classification model (XGBoost/CatBoost) predicting matchday probabilities with SHAP values for driver decomposition.

3. **`POST /predict/season`**
   - **Request Body:** `{ focusClub, manager }`
   - **Expected Response:** `{ focusClub, projectedRank, projectedPoints, titleOdds, top4Odds, relegationOdds, standings: [...] }`
   - **Model:** 800+ iteration Monte Carlo fixture simulation.
