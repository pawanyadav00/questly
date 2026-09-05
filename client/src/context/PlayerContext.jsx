import React, { createContext, useState, useEffect } from 'react';
import { getPlayer, savePlayer } from '../services/storage';
import { getRequiredXp } from '../utils/levelMath';

export const PlayerContext = createContext();

export const PlayerProvider = ({ children }) => {
  const [player, setPlayer] = useState(getPlayer());

  useEffect(() => {
    checkDaily();
  }, []);

  useEffect(() => {
    savePlayer(player);
  }, [player]);

  const checkDaily = () => {
    setPlayer(prev => {
      const today = new Date().toISOString().split('T')[0];
      const lastActive = prev.lastActiveDate;
      
      if (today === lastActive) return prev; // Already active today

      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      let newStreak = prev.streak;
      if (lastActive === yesterdayStr) {
        newStreak += 1;
      } else {
        newStreak = 1; // Reset streak if missed a day
      }

      const newLongestStreak = Math.max(newStreak, prev.longestStreak);

      return {
        ...prev,
        streak: newStreak,
        longestStreak: newLongestStreak,
        lastActiveDate: today
      };
    });
  };

  const addXp = (amount) => {
    setPlayer((prevPlayer) => {
      let newXp = prevPlayer.xp + amount;
      let newTotalXp = prevPlayer.totalXp + amount;
      let newLevel = prevPlayer.level;
      let xpRequired = getRequiredXp(newLevel);

      // Check for level up
      // Note: This logic assumes xp doesn't reset to 0, but rather keeps accumulating 
      // or we just accumulate until we reach required XP for current level.
      // Let's implement it where 'xp' is the total xp accumulated in the current level.
      // Actually, if we use total accumulated XP, getRequiredXp needs to be per level.
      
      // Simpler approach for this phase: 'xp' is total XP.
      // We calculate level based on total XP.
      // Let's just do: xp keeps going up. If xp >= required, we level up and subtract required.
      while (newXp >= xpRequired) {
        newXp -= xpRequired;
        newLevel++;
        xpRequired = getRequiredXp(newLevel);
        // We could trigger a level up notification here
        alert(`Congratulations! You reached Level ${newLevel}!`);
      }

      return {
        ...prevPlayer,
        xp: newXp,
        totalXp: newTotalXp,
        level: newLevel,
      };
    });
  };

  const addCoins = (amount) => {
    setPlayer((prev) => ({ ...prev, coins: prev.coins + amount }));
  };

  const completeQuest = (questId, xpReward, coinReward, skillId) => {
    if (xpReward) addXp(xpReward);
    if (coinReward) addCoins(coinReward);
    
    if (skillId && xpReward) {
      setPlayer((prev) => {
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

  return (
    <PlayerContext.Provider value={{ player, addXp, addCoins, completeQuest }}>
      {children}
    </PlayerContext.Provider>
  );
};
