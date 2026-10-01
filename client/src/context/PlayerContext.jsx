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
import { getRequiredXp, addXpAndCalculateLevel } from '../utils/levelMath';

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

  const addXp = (amount) => {
    setPlayer((prev) => {
      const { xp: newXp, level: newLevel, levelsGained } = addXpAndCalculateLevel(prev.xp, prev.level, amount);
      const newTotal = (prev.totalXp || 0) + amount;

      if (levelsGained > 0) {
        const updatedTitles = [...(prev.unlockedTitles || ["Beginner"])];
        let newlyUnlockedTitle = null;

        for (let lvl = prev.level + 1; lvl <= newLevel; lvl++) {
          if (LEVEL_TITLES[lvl] && !updatedTitles.includes(LEVEL_TITLES[lvl])) {
            updatedTitles.push(LEVEL_TITLES[lvl]);
            newlyUnlockedTitle = LEVEL_TITLES[lvl];
          }
        }

        const bonusCoins = levelsGained * 50;
        setLevelUpInfo({
          level: newLevel,
          coinsEarned: bonusCoins,
          unlockedTitle: newlyUnlockedTitle
        });

        return {
          ...prev,
          xp: newXp,
          totalXp: newTotal,
          level: newLevel,
          coins: (prev.coins || 0) + bonusCoins,
          unlockedTitles: updatedTitles
        };
      }

      return { ...prev, xp: newXp, totalXp: newTotal, level: newLevel };
    });
  };

  const addCoins = (amount) => {
    setPlayer((prev) => ({ ...prev, coins: (prev.coins || 0) + amount }));
  };

  const completeQuest = (questId, xpReward, coinReward, skillId, targetGoalId) => {
    if (xpReward) addXp(xpReward);
    if (coinReward) addCoins(coinReward);

    setGoals((prevGoals) => {
      const updatedGoals = prevGoals.map((goal) => {
        const containsQuest = (goal.quests || []).some((q) => q.id === questId);
        if (!containsQuest && goal.id !== targetGoalId) return goal;

        const updatedQuests = (goal.quests || []).map((q) => {
          if (q.id === questId) return { ...q, status: 'completed' };
          if (q.prerequisiteId === questId && q.status === 'locked') {
            return { ...q, status: 'available' };
          }
          return q;
        });

        const { xp: goalXp, level: goalLevel } = addXpAndCalculateLevel(goal.xp, goal.level, xpReward || 0);

        return {
          ...goal,
          xp: goalXp,
          level: goalLevel,
          coins: (goal.coins || 0) + (coinReward || 0),
          quests: updatedQuests
        };
      });

      saveGoals(updatedGoals);
      return updatedGoals;
    });

    if (skillId && xpReward) {
      setPlayer((prev) => {
        if (!prev.skills?.some((s) => s.id === skillId)) return prev;
        const updated = prev.skills.map((s) =>
          s.id === skillId
            ? { ...s, ...addXpAndCalculateLevel(s.xp, s.level, xpReward) }
            : s
        );
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

  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isRollModalOpen, setIsRollModalOpen] = useState(false);

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
        isAiModalOpen,
        setIsAiModalOpen,
        isRollModalOpen,
        setIsRollModalOpen,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};
