import React, { useContext } from 'react';
import { PlayerContext } from '../../context/PlayerContext';
import styles from './toast.module.css';

/**
 * Toast component displays a temporary notification when an achievement is unlocked.
 */
const Toast = () => {
  const { recentAchievement } = useContext(PlayerContext);
  if (!recentAchievement) return null;
  return (
    <div className={styles.toast}>
      {recentAchievement.icon} You've earned the <strong>{recentAchievement.name}</strong> badge!
    </div>
  );
};

export default Toast;
