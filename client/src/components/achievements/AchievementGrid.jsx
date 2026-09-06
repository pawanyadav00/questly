import React, { useContext, useEffect } from 'react';
import { PlayerContext } from '../../context/PlayerContext';
import AchievementBadge from './AchievementBadge';
import styles from './achievementGrid.module.css';

/**
 * Grid to display all achievements.
 */
const AchievementGrid = () => {
  const { player, recentAchievement, clearRecentAchievement } = useContext(PlayerContext);

  // Clear recent achievement after a short delay to allow toast to show
  useEffect(() => {
    if (recentAchievement) {
      const timer = setTimeout(() => {
        clearRecentAchievement();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [recentAchievement, clearRecentAchievement]);

  return (
    <div className={styles.grid}>
      {player.achievements.map((ach) => (
        <AchievementBadge
          key={ach.id}
          achievement={ach}
          isNew={recentAchievement && recentAchievement.id === ach.id}
        />
      ))}
    </div>
  );
};

export default AchievementGrid;
