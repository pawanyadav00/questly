import React, { useContext, useEffect } from 'react';
import { PlayerContext } from '../../context/PlayerContext';
import styles from './toast.module.css';

/**
 * SkillToast shows a temporary notification when a skill levels up.
 */
const SkillToast = () => {
  const { recentSkill, clearRecentSkill } = useContext(PlayerContext);

  // Auto‑clear after a short delay
  useEffect(() => {
    if (recentSkill) {
      const timer = setTimeout(() => {
        clearRecentSkill();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [recentSkill, clearRecentSkill]);

  if (!recentSkill) return null;

  return (
    <div className={styles.toast}>
      {recentSkill.icon} You've leveled up <strong>{recentSkill.name}</strong> to level {recentSkill.level}!
    </div>
  );
};

export default SkillToast;
