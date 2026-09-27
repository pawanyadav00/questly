# ⚔️ LifeQuest — Gamified Productivity Web App

> *"Turn your goals into quests. Complete them. Level up."*

LifeQuest transforms everyday productivity and habit tracking into an immersive RPG adventure. Say goodbye to mundane to-do lists—break your massive life goals into sequenced quest chains, earn XP and gold coins, allocate skill points across dynamic skill trees, conquer daily trivia challenges, and defeat world bosses.

---

## 🌟 Key Features

- **🛡️ RPG Progression & Player Identity**:
  - Earn XP and Gold Coins upon quest completion.
  - Automatic level-up threshold scaling with celebratory level-up animations.
  - Unlock and equip custom RPG titles (e.g., *Novice Adventurer*, *Skill Pro*, *Quest Master*).
  - Track consecutive active streaks with fire streak tracking.

- **📜 Goal Campaigns & Quest Dependency Chains**:
  - Organize ambitions into structured Goals with difficulty tiers (*Easy*, *Medium*, *Hard*, *Epic*).
  - Build sequenced quest chains with prerequisites—dependent quests stay locked until prerequisites are cleared.
  - Real-time **Goal Health indicators** (*Healthy*, *At Risk*, *Falling Behind*, *Overdue*) with intelligent deadline warnings.

- **🎲 Roll a Random Quest**:
  - Decision fatigue? Hit "Roll Random Quest" to let the animated fortune selector pick your next actionable quest.

- **🗡️ World Boss Battles**:
  - Face off against *The Grand Overlord*.
  - Every completed quest inflicts direct HP damage to the boss with animated boss health bars.

- **🌳 Interactive Skill Trees**:
  - Level up 5 distinct core disciplines: **Coding**, **Problem Solving**, **Knowledge**, **Focus**, and **Creativity**.
  - Visual skill progression nodes with dedicated XP bars.

- **🎯 Daily Trivia Challenge**:
  - Daily intellectual challenges powered by an Express API proxy with bulletproof fallbacks.
  - Interactive multiple-choice selection awarding bonus **+50 XP** and **+20 Coins** with daily completion persistence.

- **📊 Comprehensive Analytics & Statistics**:
  - Visualized analytics powered by **Recharts**:
    - Daily XP gained over time.
    - Weekly quest completion cadence.
    - Skill distribution radar & breakdown.

- **🎨 Modern Dark/Light Theme**:
  - Sleek glassmorphism RPG design, micro-animations, accessible color tokens, and responsive mobile-to-desktop layouts.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, Vite |
| **Routing** | React Router v6 |
| **State Management** | React Context (`PlayerContext`, `ThemeContext`) |
| **Data Visualization**| Recharts |
| **Icons & Design** | React Icons, Vanilla CSS Modules |
| **Persistence** | Browser `localStorage` (Zero-config single-user mode) |
| **Backend Proxy** | Node.js, Express, Axios (CORS & Trivia API proxy) |

---

## 📁 Project Structure

```text
quest/
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/         # Card, Button, Badge, ProgressBar, Modal, Toast
│   │   │   ├── layout/         # Navbar with live player stats
│   │   │   ├── goals/          # GoalCard, GoalForm
│   │   │   ├── quests/         # QuestCard, QuestForm, RollQuestModal
│   │   │   ├── skills/         # SkillTreePage, SkillNode
│   │   │   ├── trivia/         # DailyChallenge interactive quiz widget
│   │   │   └── achievements/   # AchievementGrid, AchievementCard
│   │   ├── context/            # PlayerContext, ThemeContext
│   │   ├── pages/              # Dashboard, Goals, Quests, Stats, Profile, Daily, Settings, Landing
│   │   ├── services/           # storage.js, xpService.js, bossService.js
│   │   ├── utils/              # levelMath.js
│   │   └── styles/             # index.css (tokens, resets, themes)
│   └── package.json
├── server/
│   ├── server.js               # Express proxy with curated fallbacks
│   └── package.json
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### 1. Start the Server (Trivia Proxy)
```bash
cd server
npm install
npm run dev
```
*The proxy server will run on `http://localhost:5000`.*

### 2. Start the Client (React + Vite)
In a separate terminal:
```bash
cd client
npm install
npm run dev
```
*Open your browser and navigate to `http://localhost:5173`.*

---

## 🎮 How to Play

1. **Visit the Landing Page** at `/welcome` or jump directly to the **Dashboard** at `/dashboard`.
2. **Create Your First Goal** in the **Goals** tab (e.g., *"Master Full Stack Web Development"*).
3. **Add Quests** with prerequisites to build your campaign chain.
4. **Complete Quests** to earn XP, level up, unlock skills, and deal damage to the World Boss.
5. **Take the Daily Trivia Challenge** each day in the **Daily** tab to claim bonus loot.
6. **Check Your Stats** in the **Stats** tab to track your productivity growth over time!

---

## 📄 License
This project is open-source and created as a gamified personal development showcase.