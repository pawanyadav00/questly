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
  skills: [
    { id: "coding", name: "Coding", icon: "💻", level: 1, xp: 0 },
    { id: "knowledge", name: "Knowledge", icon: "📚", level: 1, xp: 0 },
    { id: "problem_solving", name: "Problem Solving", icon: "🧠", level: 1, xp: 0 },
    { id: "focus", name: "Focus", icon: "🎯", level: 1, xp: 0 },
    { id: "creativity", name: "Creativity", icon: "🎨", level: 1, xp: 0 }
  ]
});

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
