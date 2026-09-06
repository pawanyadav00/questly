import React from 'react';
import styles from './achievementBadge.module.css';

/**
 * AchievementBadge component displays a single achievement.
 * Props:
 *   achievement: { id, name, description, icon, unlocked }
 *   isNew: boolean - if true, apply a pulse animation to highlight recent unlock
 */
const AchievementBadge = ({ achievement, isNew }) => {
  const { name, description, icon, unlocked } = achievement;
  return (
    <div className={`${styles.badge} ${unlocked ? styles.unlocked : styles.locked} ${isNew ? styles.new : ''}`}>
      <div className={styles.icon}>{icon}</div>
      <div className={styles.info}>
        <div className={styles.title}>{name}</div>
        <div className={styles.desc}>{description}</div>
      </div>
    </div>
  );
};

export default AchievementBadge;
