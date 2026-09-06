import React, { createContext, useState, useEffect } from 'react';
import { getPlayer, savePlayer, unlockAchievement } from '../services/storage';
import { getRequiredXp } from '../utils/levelMath';

export const PlayerContext = createContext();

export const PlayerProvider = ({ children }) => {
  const [player, setPlayer] = useState(getPlayer());

  // Daily streak check on mount
  useEffect(() => {
    checkDaily();
  }, []);

  // Persist player changes
  useEffect(() => {
    savePlayer(player);
  }, [player]);

  const checkDaily = () => {
    setPlayer(prev => {
      const today = new Date().toISOString().split('T')[0];
      const lastActive = prev.lastActiveDate;
      if (today === lastActive) return prev; // already logged today

      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      let newStreak = prev.streak;
      if (lastActive === yesterdayStr) {
        newStreak += 1;
      } else {
        newStreak = 1; // reset streak
      }
      const newLongest = Math.max(newStreak, prev.longestStreak);
      return { ...prev, streak: newStreak, longestStreak: newLongest, lastActiveDate: today };
    });
  };

  const addXp = amount => {
    setPlayer(prevPlayer => {
      let newXp = prevPlayer.xp + amount;
      let newTotal = prevPlayer.totalXp + amount;
      let newLevel = prevPlayer.level;
      let xpRequired = getRequiredXp(newLevel);
      while (newXp >= xpRequired) {
        newXp -= xpRequired;
        newLevel++;
        xpRequired = getRequiredXp(newLevel);
        // optional level‑up notification
        // alert(`Congratulations! You reached Level ${newLevel}!`);
      }
      return { ...prevPlayer, xp: newXp, totalXp: newTotal, level: newLevel };
    });
  };

  const addCoins = amount => {
    setPlayer(prev => ({ ...prev, coins: prev.coins + amount }));
  };

  const completeQuest = (questId, xpReward, coinReward, skillId) => {
    if (xpReward) addXp(xpReward);
    if (coinReward) addCoins(coinReward);
    if (skillId && xpReward) {
      setPlayer(prev => {
        const updatedSkills = prev.skills.map(skill => {
          if (skill.id === skillId) {
            let newXp = skill.xp + xpReward;
            let newLevel = skill.level;
            let reqXp = getRequiredXp(newLevel);
            while (newXp >= reqXp) {
              newXp -= reqXp;
              newLevel++;
              reqXp = getRequiredXp(newLevel);
            }
            return { ...skill, xp: newXp, level: newLevel };
          }
          return skill;
        });
        return { ...prev, skills: updatedSkills };
      });
    }
  };

  // State for recent unlocked achievement to trigger UI notifications
  const [recentAchievement, setRecentAchievement] = useState(null);

  const unlockAchievementAndNotify = (id) => {
    const achievement = unlockAchievement(id);
    // Update player state to reflect unlocked achievement
    setPlayer(prev => ({
      ...prev,
      achievements: prev.achievements.map(a => a.id === id ? { ...a, unlocked: true } : a)
    }));
    setRecentAchievement(achievement);
    return achievement;
  };

  // Expose functions via context, including the wrapper for unlocking achievements
  return (
    <PlayerContext.Provider
      value={{
        player,
        addXp,
        addCoins,
        completeQuest,
        unlockAchievement: unlockAchievementAndNotify,
        recentAchievement,
        clearRecentAchievement: () => setRecentAchievement(null),
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};
