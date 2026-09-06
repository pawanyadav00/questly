import { useContext } from 'react';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import { PlayerContext } from '../context/PlayerContext';
import { getStats } from '../services/storage';
import { getRequiredXp } from '../utils/levelMath';
import AchievementGrid from '../components/achievements/AchievementGrid';
import Toast from '../components/common/Toast';
import styles from './dashboardPage.module.css';

const DashboardPage = () => {
  const { player } = useContext(PlayerContext);
  const stats = getStats();
  const xpRequired = getRequiredXp(player.level);

  return (
    <div className={`container ${styles.page}`}>
      <h1 className={styles.title}>Welcome, {player.name}!</h1>
      <div className={styles.statsGrid}>
        <Card className={styles.statCard}>
          <h3>Level</h3>
          <Badge variant="primary">{player.level}</Badge>
        </Card>
        <Card className={styles.statCard}>
          <h3>XP</h3>
          <p>{player.xp} / {xpRequired}</p>
        </Card>
        <Card className={styles.statCard}>
          <h3>Coins</h3>
          <p>{player.coins}</p>
        </Card>
        <Card className={styles.statCard}>
          <h3>Daily Quest XP</h3>
          <p>{stats.dailyXp && Object.keys(stats.dailyXp).length > 0 ? Object.values(stats.dailyXp).reduce((a,b)=>a+b,0) : 0}</p>
        </Card>
        <Card className={styles.statCard}>
          <h3>Streak 🔥</h3>
          <p>{player.streak} days</p>
        </Card>
      </div>
      {/* Toast notification for newly unlocked achievement */}
      <Toast />
      {/* Achievements grid */}
      <AchievementGrid />

      <div className={styles.skillsSection}>
        <h2 className={styles.sectionTitle}>Skills Progression</h2>
        <div className={styles.skillsGrid}>
          {player.skills && player.skills.map(skill => {
            const skillReqXp = getRequiredXp(skill.level);
            const progress = skillReqXp > 0 ? Math.round((skill.xp / skillReqXp) * 100) : 0;
            return (
              <Card key={skill.id} className={styles.skillCard}>
                <div className={styles.skillHeader}>
                  <span className={styles.skillIcon}>{skill.icon}</span>
                  <div className={styles.skillTitleArea}>
                    <h4 className={styles.skillName}>{skill.name}</h4>
                    <span className={styles.skillLevel}>Lvl {skill.level}</span>
                  </div>
                </div>
                <div className={styles.skillProgress}>
                  <div className={styles.skillProgressText}>
                    <span>{skill.xp} / {skillReqXp} XP</span>
                  </div>
                  <div className={styles.progressBarWrapper}>
                    <div className={styles.progressBarFill} style={{ width: `${progress}%` }}></div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
