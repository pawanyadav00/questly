/**
 * storage.js
 * Helper functions for interacting with localStorage
 */

const getFromStorage = (key, defaultValue) => {
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.warn(`Error reading localStorage key "${key}":`, error);
    return defaultValue;
  }
};

const saveToStorage = (key, value) => {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn(`Error setting localStorage key "${key}":`, error);
  }
};

export const getPlayer = () => getFromStorage('lifequest_player', {
  name: "Player",
  level: 1,
  xp: 0,
  totalXp: 0,
  coins: 0,
  streak: 0,
  longestStreak: 0,
  lastActiveDate: new Date().toISOString().split('T')[0],
  title: "Beginner",
  unlockedTitles: ["Beginner"],
  achievements: [
    {
      id: "quest_master",
      name: "Quest Master",
      description: "Complete 50 quests",
      icon: "🏆",
      unlocked: false
    },
    {
      id: "streak_hero",
      name: "Streak Hero",
      description: "Maintain a 7‑day login streak",
      icon: "🔥",
      unlocked: false
    },
    {
      id: "skill_pro",
      name: "Skill Pro",
      description: "Reach level 5 in any skill",
      icon: "💡",
      unlocked: false
    },
    {
      id: "coin_collector",
      name: "Coin Collector",
      description: "Accumulate 500 coins",
      icon: "💰",
      unlocked: false
    }
  ],
  skills: [
    { id: "coding", name: "Coding", icon: "💻", level: 1, xp: 0 },
    { id: "knowledge", name: "Knowledge", icon: "📚", level: 1, xp: 0 },
    { id: "problem_solving", name: "Problem Solving", icon: "🧠", level: 1, xp: 0 },
    { id: "focus", name: "Focus", icon: "🎯", level: 1, xp: 0 },
    { id: "creativity", name: "Creativity", icon: "🎨", level: 1, xp: 0 }
  ]
});

// Unlock achievement helper
export const unlockAchievement = (id) => {
  const player = getPlayer();
  const updated = player.achievements.map(a =>
    a.id === id ? { ...a, unlocked: true } : a
  );
  savePlayer({ ...player, achievements: updated });
  return updated.find(a => a.id === id);
};

export const savePlayer = (player) => saveToStorage('lifequest_player', player);

export const getGoals = () => getFromStorage('lifequest_goals', []);
export const saveGoals = (goals) => saveToStorage('lifequest_goals', goals);

export const getQuests = () => getFromStorage('lifequest_quests', []);
export const saveQuests = (quests) => saveToStorage('lifequest_quests', quests);

export const getStats = () => getFromStorage('lifequest_stats', {
  dailyXp: {},
  dailyQuests: {},
  totalQuestsCompleted: 0,
  totalBossDefeated: 0
});
export const saveStats = (stats) => saveToStorage('lifequest_stats', stats);
