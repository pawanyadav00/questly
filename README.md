# ⚔️ Questly — Gamified Syllabus & Curriculum RPG Learning Sanctuary

> *"Turn your academic syllabus, coding problem sets, and study roadmaps into an immersive RPG adventure. Complete challenges. Defeat milestone bosses. Level up your mastery."*

**Questly** is a personal RPG learning and productivity workspace designed to transform intense college courses, LeetCode roadmaps, and self-study syllabi into structured, gamified campaigns.

Instead of staring at overwhelming course outlines or static to-do lists, drop your syllabus into Questly: it automatically decomposes topics into sequential quest chains with interactive quizzes, coding drills, and milestone boss battles.

---

## 🌟 Key Features

### 🍱 1. Matte Black Bento-Grid Dashboard
Inspired by modern high-performance SaaS interfaces, Questly features a 6-card bento grid built with a deep obsidian matte black palette (`#050507`, `#0a0a0e`, `#0d0d12`, `#171720`):
1. **Total Syllabus Progression**: Real-time Level, XP progress, study velocity trend (`+14.2%`), quick chips (`Active Quests`, `Daily Streak 🔥`, `Rank Title`), and active objective action banner with direct `Continue Quest →` action.
2. **Adventurer Treasury**: Gold Coins balance, total XP points, and quick-action launchers for **AI Forge** and **Roll Quest**.
3. **Annual Study & XP History**: Custom Recharts pill bar chart tracking monthly study velocity, with glowing electric blue spotlighting on active periods and detailed tooltip breakdowns.
4. **Recent Activity Timeline**: Categorized chronological stream of solved challenges, daily streak bonuses, and chapter completions with earned reward tags (`+60 XP`, `+25 Coins`).
5. **Curriculum Quests Table**: High-density quest log detailing quest titles, topic domain, difficulty tiers (`Easy`, `Medium`, `Hard`), XP rewards, status badges, and direct `⚔️ Challenge` buttons.
6. **Milestone Boss Encounter**: Fiery dark nebula gradient card displaying the current chapter boss, lore, animated HP bar, and instant `Battle Boss →` trigger.

### 📱 2. Mobile-First Responsiveness & Navigation
- **Slide-Out Mobile Drawer**: On phones (`<= 768px`), tap the header hamburger menu to smoothly slide out the full navigation drawer with a blurred backdrop.
- **Mobile Bottom Navigation Bar**: Floating, thumb-friendly navigation bar on mobile screens with quick tabs:
  - 🏠 **Home** (Dashboard)
  - 🧭 **Goals** (Syllabus Manager)
  - ⚡ **AI Forge** (Raised glowing action button)
  - ⚔️ **Quests** (Quest Log)
  - 👤 **Profile** (Adventurer Credentials)
- **Safe Area Support**: Native iOS/Android home indicator clearance (`env(safe-area-inset-bottom)`).
- **Responsive Bento Cards**: All cards, mini stat chips, charts, and modal dialogs stack cleanly in single-column format on phone viewports (`360px–430px`) with zero clipping.

### ⚡ 3. AI Curriculum & Problem Set Forge
- **Instant Syllabus Ingestion**: Paste any topic list, syllabus text, or problem sets.
- **Automated RPG Questline Generation**: Automatically extracts structured quest chains with difficulty tiers (*Easy*, *Medium*, *Hard*), prerequisite dependencies, XP rewards, and coin bounties.
- **1-Click Built-in Presets**:
  - *Data Structures & Algorithms (LeetCode Roadmap)*
  - *Full-Stack Web Development (React, Node, DB)*
  - *Python Mastery & Core CS*
  - *System Design & Large-Scale Architecture*

### ⚔️ 4. Interactive Problem Solving & Challenge Workspace
- **Multi-Problem Drills**: Each quest contains progressive concept check quizzes and hands-on coding or exercise drills.
- **Sticky Pinned Navigation**: Viewport-friendly layout with sticky header progress and sticky bottom action buttons (`Previous`, `Save & Exit`, `Next Problem`, `Complete Quest`).
- **Hints & Reference Solutions**: Progressive hints and reference solutions available when needed.
- **Triumph Fanfare**: Celebratory victory screen detailing XP and Coin gains when all challenges are conquered.

### 🔄 5. Multi-Curriculum Switching
- Switch seamlessly between different learning environments (e.g., *DSA*, *Web Dev*, *Machine Learning*) using the global header selector.
- **Environment Isolation**: Each syllabus tracks its own independent:
  - **Level & XP Progress** (Level 1 $\rightarrow$ $\infty$)
  - **Gold Coins Balance**
  - **Active Streak 🔥**
  - **Sequential Quest Progress**
  - **Milestone Boss HP**

### 🗡️ 6. Curriculum Milestone Boss Battles
- Each syllabus awakens a dedicated Milestone Boss (e.g., *Guardian of Unit 1: Time & Complexity*, *The Monolith Golem*).
- Completing quests in the active syllabus inflicts direct HP damage to the boss with animated health bars.
- Defeating the boss represents true mastery of the curriculum.

### 🎲 7. Roll a Random Quest
- Facing decision fatigue? Use the animated "Roll a Quest" dice roller to pick your next actionable quest from your unlocked chains.

### 👑 8. Level Up Celebrations & Title Unlocks
- Ascend in levels as you earn XP using an optimized $O(1)$ arithmetic leveling formula.
- Claim Level-Up rewards, earn Gold Coins, and unlock prestigious adventurer titles (*Novice Adventurer*, *Code Slayer*, *Quest Master*).

### 📊 9. Visualized Analytics & Statistics
- Track your learning journey with **Recharts**:
  - Daily XP gained over time.
  - Weekly quest completion cadence.
  - Overall syllabus completion percentages.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend Framework** | React 19, Vite |
| **Routing** | React Router v7 |
| **State & Persistence** | React Context (`PlayerContext`), `localStorage` |
| **Data Visualization** | Recharts |
| **Icons & Design** | React Icons, Vanilla CSS Modules |
| **Design System** | Permanent Matte Black (`#050507`, `#0a0a0e`, `#0d0d12`, `#171720`) |
| **Backend API** | Node.js, Express (API & AI Proxy) |

---

## 📁 Project Structure

```text
quest/
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/         # Card, Button, Badge, ProgressBar, Modal, Toast, LevelUpModal
│   │   │   ├── layout/         # Sidebar, Header, MobileBottomNav
│   │   │   ├── goals/          # GoalCard, GoalForm, AISyllabusModal
│   │   │   ├── quests/         # QuestCard, QuestForm, QuestChallengeModal, RollQuestModal
│   │   │   └── achievements/   # AchievementGrid, AchievementCard
│   │   ├── context/            # PlayerContext (Environment state, XP, Level, Quests, Goals)
│   │   ├── pages/              # DashboardPage, GoalsPage, GoalDetailPage, QuestsPage, StatsPage, ProfilePage, SettingsPage
│   │   ├── services/           # storage.js, campaignGenerator.js, bossService.js
│   │   ├── utils/              # levelMath.js
│   │   └── styles/             # index.css (tokens, resets, layout), themes.css (matte black palette)
│   ├── package.json
│   └── vite.config.js
├── server/
│   ├── server.js               # Express API & syllabus proxy server
│   └── package.json
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- npm or yarn

### 1. Start the Backend Server
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
   - Inspect your 6-Card Bento Grid: Level, study velocity, active quests, and streak.
   - Jump straight into the **Next Quest Objective** with **Continue Quest →** or **⚔️ Challenge**.
   - Track active Milestone Boss health and roll random quests.
2. **Goals / Syllabi (`/goals`)**:
   - Manage your syllabus curricula or click **⚡ AI Forge** to generate a new custom curriculum.
   - Switch active environments with 1 click.
3. **Quests Hub (`/quests`)**:
   - Filter quests across all goals or by the active syllabus.
   - View prerequisite lock statuses and launch interactive challenge drills.
4. **Stats & Profile (`/stats`, `/profile`)**:
   - Inspect completion charts, XP growth, achievements, and equipped titles.

---

## 📄 License
This project is open-source and created as an AI-powered gamified learning workspace.