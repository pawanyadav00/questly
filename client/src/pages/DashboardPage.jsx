import { useContext } from 'react';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import { PlayerContext } from '../context/PlayerContext';
import { getStats } from '../services/storage';
import { getRequiredXp } from '../utils/levelMath';
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
      </div>
    </div>
  );
};

export default DashboardPage;
