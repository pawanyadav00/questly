# ⚔️ Questly — AI-Powered Syllabus & Curriculum RPG Learning Sanctuary

> *"Turn your syllabus and problem sets into an immersive RPG adventure. Complete challenges. Defeat milestone bosses. Level up your mastery."*

**Questly** is a personal RPG learning and productivity workspace designed to transform intense academic courses, coding roadmaps, and self-study syllabi into structured, gamified campaigns.

Instead of staring at overwhelming course outlines or static to-do lists, drop your syllabus into Questly: it automatically decomposes topics into sequential quest chains with interactive quizzes, coding drills, and milestone boss battles.

---

## 🌟 Key Features

### ⚡ 1. AI Curriculum & Problem Set Forge
- **Instant Syllabus Ingestion**: Paste any topic list, university curriculum, or interview prep roadmap.
- **Automated RPG Questline Generation**: Automatically extracts structured quest chains with difficulty tiers (*Easy*, *Medium*, *Hard*, *Epic*), prerequisite dependencies, XP, and coin rewards.
- **1-Click Built-in Presets**:
  - *Data Structures & Algorithms (LeetCode Roadmap)*
  - *Full-Stack Web Development (React, Node, DB)*
  - *Python Mastery & Core CS*
  - *System Design & Large-Scale Architecture*

### ⚔️ 2. Interactive Problem Solving & Challenge Workspace
- **Multi-Problem Drills**: Each quest contains progressive concept check quizzes and hands-on coding or exercise drills.
- **Sticky Pinned Navigation**: Smooth, viewport-friendly layout with sticky header progress and sticky bottom action buttons (`Previous`, `Save & Exit`, `Next Problem`, `Complete Quest`) so buttons are never pushed out of sight.
- **Hints & Reference Solutions**: Progressive hints and reference solutions available when needed.
- **Triumph Fanfare**: Celebratory victory screen detailing XP and Coin gains when all challenges are conquered.

### 🔄 3. Adaptive Learning Environments (Preset Switching)
- Switch seamlessly between different learning environments (e.g., *DSA*, *Web Dev*, *Machine Learning*).
- **Environment Isolation**: Each syllabus preset tracks its own independent:
  - **Level & XP Progress** (Level 1 $\rightarrow$ $\infty$)
  - **Gold Coins Balance**
  - **Active Streak 🔥**
  - **Sequential Quest Progress**
  - **Milestone Boss HP**
- Switch between presets without losing progress.

### 🗡️ 4. Curriculum Milestone Boss Battles
- Each syllabus environment awakens a dedicated Milestone Boss (e.g., *The Algorithm Overlord*, *The Monolith Golem*).
- Completing quests in the active syllabus inflicts direct HP damage to the boss with animated health bars.
- Defeating the boss represents true mastery of the curriculum.

### 🎲 5. Roll a Random Quest
- Facing decision fatigue? Use the animated "Roll a Quest" dice roller to pick your next actionable quest from your unlocked chains.

### 👑 6. Level Up Celebrations & Title Unlocks
- Ascend in levels as you earn XP.
- Claim Level-Up rewards, earn Gold Coins, and unlock prestigious adventurer titles (*Novice Adventurer*, *Code Slayer*, *Quest Master*).

### 📊 7. Visualized Analytics & Statistics
- Track your learning journey with **Recharts**:
  - Daily XP gained over time.
  - Weekly quest completion cadence.
  - Overall syllabus completion percentages.

### 🎨 8. Premium Dark RPG Design System
- Sleek glassmorphism aesthetic built with custom CSS tokens, modern typography, responsive cards, micro-animations, and zero clutter.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend Framework** | React 18, Vite |
| **Routing** | React Router v6 |
| **State & Persistence** | React Context (`PlayerContext`, `ThemeContext`), `localStorage` |
| **Data Visualization** | Recharts |
| **Icons & Design** | React Icons, Vanilla CSS Modules |
| **Backend API** | Node.js, Express (API Proxy) |

---

## 📁 Project Structure

```text
quest/
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/         # Card, Button, Badge, ProgressBar, Modal, Toast, LevelUpModal
│   │   │   ├── layout/         # Navbar with live player stats and active environment badge
│   │   │   ├── goals/          # GoalCard, GoalForm, AISyllabusModal
│   │   │   ├── quests/         # QuestCard, QuestForm, QuestChallengeModal, RollQuestModal
│   │   │   └── achievements/   # AchievementGrid, AchievementCard
│   │   ├── context/            # PlayerContext (Environment state, XP, Level, Quests, Goals)
│   │   ├── pages/              # DashboardPage, GoalsPage, GoalDetailPage, QuestsPage, StatsPage, ProfilePage, SettingsPage, LandingPage
│   │   ├── services/           # storage.js, xpService.js, bossService.js
│   │   ├── utils/              # levelMath.js
│   │   └── styles/             # index.css (tokens, resets, theme variables)
│   ├── package.json
│   └── vite.config.js
├── server/
│   ├── server.js               # Express API proxy server
│   └── package.json
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v16 or higher)
- npm or yarn

### 1. Start the Backend Proxy Server
```bash
cd server
npm install
npm run dev
```
*The server will start on `http://localhost:5000`.*

### 2. Start the Frontend Client
In a separate terminal:
```bash
cd client
npm install
npm run dev
```
*Open your browser and navigate to `http://localhost:5173`.*

---

## 🎮 How It Works

1. **Dashboard (`/dashboard`)**:
   - View your current active syllabus, level, XP progress, coin balance, and streak.
   - Jump straight into the **Next Quest Focus** with **⚔️ Solve Challenge**.
   - Track boss health for your active curriculum.
2. **Goals / Presets (`/goals`)**:
   - Manage your syllabus presets or click **⚡ Forge with AI** to generate a new curriculum.
   - Switch active environments with 1 click.
   - Delete or customize presets as needed.
3. **Quests Hub (`/quests`)**:
   - Filter quests across all goals or by the active syllabus.
   - View prerequisite lock statuses and launch challenges.
4. **Stats & Profile (`/stats`, `/profile`)**:
   - Inspect completion charts, XP growth, achievements, and equipped titles.

---

## 📄 License
This project is open-source and created as an AI-powered gamified learning workspace.