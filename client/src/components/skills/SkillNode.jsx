import React from 'react';
import styles from './skillNode.module.css';
import { getRequiredXp } from '../../utils/levelMath';

/**
 * SkillNode – displays a single skill with level, progress bar and icon.
 */
const SkillNode = ({ skill }) => {
  const requiredXp = getRequiredXp(skill.level);
  const progress = requiredXp > 0 ? Math.round((skill.xp / requiredXp) * 100) : 0;

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <span className={styles.icon}>{skill.icon}</span>
        <div className={styles.info}>
          <h3 className={styles.name}>{skill.name}</h3>
          <span className={styles.level}>Lvl {skill.level}</span>
        </div>
      </div>
      <div className={styles.progress}>
        <div className={styles.bar} style={{ width: `${progress}%` }} />
        <div className={styles.text}>
          {skill.xp} / {requiredXp} XP
        </div>
      </div>
    </div>
  );
};

export default SkillNode;
