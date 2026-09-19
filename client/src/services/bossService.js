// bossService.js – simple boss quest handling

/**
 * Default boss data. Adjust `maxHp` to change difficulty.
 */
export const getDefaultBoss = () => ({
  id: 'final_boss',
  name: 'The Grand Overlord',
  description: 'Defeat the final boss by completing 5 quests.',
  maxHp: 5,
  currentHp: 5,
});

/**
 * Reduce boss HP by 1 (called when a quest contributing to the boss is completed).
 */
export const damageBoss = (boss) => {
  const newHp = Math.max(boss.currentHp - 1, 0);
  return { ...boss, currentHp: newHp };
};

/**
 * Check if boss is defeated.
 */
export const isBossDefeated = (boss) => boss.currentHp <= 0;
