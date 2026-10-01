export const getRequiredXp = (level) => (level || 1) * 100;

export const calculateLevelProgress = (xp = 0, level = 1) => {
  // Sum of arithmetic series: 100 * (1 + 2 + ... + (level - 1)) = 50 * (level - 1) * level
  const currentLevelXpStart = level > 1 ? 50 * (level - 1) * level : 0;
  const xpInCurrentLevel = xp - currentLevelXpStart;
  const xpRequiredForNextLevel = getRequiredXp(level);
  const progressPercentage = Math.min(100, Math.max(0, (xpInCurrentLevel / xpRequiredForNextLevel) * 100));

  return { progressPercentage, xpInCurrentLevel, xpRequiredForNextLevel };
};

export const addXpAndCalculateLevel = (currentXp = 0, currentLevel = 1, addedXp = 0) => {
  let xp = currentXp + addedXp;
  let level = currentLevel;
  let req = getRequiredXp(level);
  let levelsGained = 0;

  while (xp >= req) {
    xp -= req;
    level++;
    levelsGained++;
    req = getRequiredXp(level);
  }

  return { xp, level, levelsGained };
};

