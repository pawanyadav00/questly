import React, { createContext, useState, useEffect, useMemo } from 'react';
import {
  getPlayer,
  savePlayer,
  unlockAchievement,
  getGoals,
  saveGoals,
  getActiveGoalId,
  saveActiveGoalId
} from '../services/storage';
import { getRequiredXp } from '../utils/levelMath';

export const PlayerContext = createContext();

export const PlayerProvider = ({ children }) => {
  const [player, setPlayer] = useState(getPlayer());
  const [goals, setGoals] = useState(getGoals());
  const [activeGoalId, setActiveGoalId] = useState(getActiveGoalId());

  // Compute active goal object
  const activeGoal = useMemo(() => {
    if (!goals || goals.length === 0) return null;
    return goals.find(g => g.id === activeGoalId) || goals[0];
  }, [goals, activeGoalId]);

  // Persist goals whenever they change
  useEffect(() => {
    saveGoals(goals);
  }, [goals]);

  // Daily streak check on mount
  useEffect(() => {
    checkDaily();
  }, []);

  const switchActiveGoal = (goalId) => {
    setActiveGoalId(goalId);
    saveActiveGoalId(goalId);
  };

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

  const [levelUpInfo, setLevelUpInfo] = useState(null);

  const LEVEL_TITLES = {
    2: "Apprentice",
    3: "Adventurer",
    5: "Skill Pro",
    10: "Master",
    15: "Grandmaster",
    20: "Legendary Hero"
  };

  const addXp = amount => {
    setPlayer(prevPlayer => {
      let newXp = prevPlayer.xp + amount;
      let newTotal = prevPlayer.totalXp + amount;
      let newLevel = prevPlayer.level;
      let xpRequired = getRequiredXp(newLevel);
      let leveledUp = false;
      let newlyUnlockedTitle = null;
      let updatedTitles = [...(prevPlayer.unlockedTitles || ["Beginner"])];

      while (newXp >= xpRequired) {
        newXp -= xpRequired;
        newLevel++;
        xpRequired = getRequiredXp(newLevel);
        leveledUp = true;

        if (LEVEL_TITLES[newLevel] && !updatedTitles.includes(LEVEL_TITLES[newLevel])) {
          updatedTitles.push(LEVEL_TITLES[newLevel]);
          newlyUnlockedTitle = LEVEL_TITLES[newLevel];
        }
      }

      if (leveledUp) {
        const bonusCoins = (newLevel - prevPlayer.level) * 50;
        setLevelUpInfo({
          level: newLevel,
          coinsEarned: bonusCoins,
          unlockedTitle: newlyUnlockedTitle
        });
        return {
          ...prevPlayer,
          xp: newXp,
          totalXp: newTotal,
          level: newLevel,
          coins: prevPlayer.coins + bonusCoins,
          unlockedTitles: updatedTitles
        };
      }

      return { ...prevPlayer, xp: newXp, totalXp: newTotal, level: newLevel };
    });
  };

  const addCoins = amount => {
    setPlayer(prev => ({ ...prev, coins: prev.coins + amount }));
  };

  const completeQuest = (questId, xpReward, coinReward, skillId, targetGoalId) => {
    // 1. Global rewards
    if (xpReward) addXp(xpReward);
    if (coinReward) addCoins(coinReward);

    // 2. Goal / Syllabus specific environment update
    setGoals(prevGoals => {
      const updatedGoals = prevGoals.map(goal => {
        const containsQuest = (goal.quests || []).some(q => q.id === questId);
        if (!containsQuest && goal.id !== targetGoalId) return goal;

        // Update quest status and unlock next
        const updatedQuests = (goal.quests || []).map(q => {
          if (q.id === questId) return { ...q, status: 'completed' };
          if (q.prerequisiteId === questId && q.status === 'locked') {
            return { ...q, status: 'available' };
          }
          return q;
        });

        // Update goal syllabus XP, level, coins
        let goalXp = (goal.xp || 0) + (xpReward || 0);
        let goalLevel = goal.level || 1;
        let goalReqXp = getRequiredXp(goalLevel);
        while (goalXp >= goalReqXp) {
          goalXp -= goalReqXp;
          goalLevel++;
          goalReqXp = getRequiredXp(goalLevel);
        }
        let goalCoins = (goal.coins || 0) + (coinReward || 0);

        return {
          ...goal,
          xp: goalXp,
          level: goalLevel,
          coins: goalCoins,
          quests: updatedQuests
        };
      });

      saveGoals(updatedGoals);
      return updatedGoals;
    });

    // 3. Also update player skills if in global list
    if (skillId && xpReward) {
      setPlayer(prev => {
        const oldSkill = (prev.skills || []).find(s => s.id === skillId);
        if (!oldSkill) return prev;
        const updated = prev.skills.map(skill => {
          if (skill.id === skillId) {
            let nXp = skill.xp + xpReward;
            let nLvl = skill.level;
            let req = getRequiredXp(nLvl);
            while (nXp >= req) {
              nXp -= req;
              nLvl++;
              req = getRequiredXp(nLvl);
            }
            return { ...skill, xp: nXp, level: nLvl };
          }
          return skill;
        });
        return { ...prev, skills: updated };
      });
    }
  };

  // State for recent unlocked achievement to trigger UI notifications
  const [recentAchievement, setRecentAchievement] = useState(null);
  const [recentSkill, setRecentSkill] = useState(null);

  const unlockAchievementAndNotify = (id) => {
    const achievement = unlockAchievement(id);
    setPlayer(prev => ({
      ...prev,
      achievements: prev.achievements.map(a => a.id === id ? { ...a, unlocked: true } : a)
    }));
    setRecentAchievement(achievement);
    return achievement;
  };

  const updatePlayerName = (newName) => {
    setPlayer(prev => ({ ...prev, name: newName }));
  };

  const updatePlayerTitle = (newTitle) => {
    setPlayer(prev => ({ ...prev, title: newTitle }));
  };

  const addGoal = (newGoal) => {
    setGoals(prev => [...prev, newGoal]);
    switchActiveGoal(newGoal.id);
  };

  const updateGoal = (updatedGoal) => {
    setGoals(prev => prev.map(g => g.id === updatedGoal.id ? updatedGoal : g));
  };

  const deleteGoal = (goalId) => {
    const stringId = String(goalId);
    const remaining = goals.filter(g => String(g.id) !== stringId);
    saveGoals(remaining);
    setGoals(remaining);

    if (String(activeGoalId) === stringId) {
      const nextActive = remaining.length > 0 ? remaining[0].id : null;
      saveActiveGoalId(nextActive);
      setActiveGoalId(nextActive);
    }
  };

  const resetAllData = () => {
    localStorage.removeItem('lifequest_goals');
    localStorage.removeItem('lifequest_active_goal_id');
    localStorage.removeItem('lifequest_quests');
    localStorage.removeItem('lifequest_stats');
    const freshPlayer = {
      name: "Adventurer",
      level: 1,
      xp: 0,
      totalXp: 0,
      coins: 0,
      streak: 0,
      longestStreak: 0,
      lastActiveDate: new Date().toISOString().split('T')[0],
      title: "Beginner",
      unlockedTitles: ["Beginner"],
      achievements: [],
      skills: []
    };
    savePlayer(freshPlayer);
    saveGoals([]);
    saveActiveGoalId(null);
    setGoals([]);
    setActiveGoalId(null);
    setPlayer(freshPlayer);
  };

  return (
    <PlayerContext.Provider
      value={{
        player,
        goals,
        setGoals,
        activeGoalId,
        activeGoal,
        switchActiveGoal,
        addGoal,
        updateGoal,
        deleteGoal,
        resetAllData,
        addXp,
        addCoins,
        completeQuest,
        unlockAchievement: unlockAchievementAndNotify,
        recentAchievement,
        clearRecentAchievement: () => setRecentAchievement(null),
        recentSkill,
        clearRecentSkill: () => setRecentSkill(null),
        levelUpInfo,
        clearLevelUp: () => setLevelUpInfo(null),
        updatePlayerName,
        updatePlayerTitle,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};
