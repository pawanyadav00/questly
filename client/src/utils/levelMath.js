export const getRequiredXp = (level) => {
  return level * 100;
};

export const calculateLevelProgress = (xp, level) => {
  const currentLevelXpStart = level === 1 ? 0 : Array.from({ length: level - 1 }, (_, i) => getRequiredXp(i + 1)).reduce((a, b) => a + b, 0);
  const nextLevelXpStart = currentLevelXpStart + getRequiredXp(level);
  
  const xpInCurrentLevel = xp - currentLevelXpStart;
  const xpRequiredForNextLevel = getRequiredXp(level);
  
  const progressPercentage = Math.min(100, Math.max(0, (xpInCurrentLevel / xpRequiredForNextLevel) * 100));
  
  return {
    progressPercentage,
    xpInCurrentLevel,
    xpRequiredForNextLevel
  };
};
