import React from 'react';
import styles from './skillTreePage.module.css';

/**
 * Container for the skill tree page – basic responsive grid layout.
 */
const SkillTreePage = () => (
  <div className={styles.container}>
    <h1 className={styles.title}>Skill Tree</h1>
    {/* The SkillTreePage component itself only provides the outer layout.
        The actual skill nodes are rendered inside DashboardPage where we already
        map over player.skills. If you want a dedicated page you can move that
        mapping here later. */}
  </div>
);

export default SkillTreePage;
