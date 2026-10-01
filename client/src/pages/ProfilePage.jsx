import { useContext, useState } from 'react';
import { PlayerContext } from '../context/PlayerContext';
import ProgressBar from '../components/common/ProgressBar';
import { getRequiredXp } from '../utils/levelMath';
import {
  RiUser3Line,
  RiShieldFlashFill,
  RiCoinsFill,
  RiFireFill,
  RiTrophyFill,
  RiSparklingFill,
  RiCheckLine,
} from 'react-icons/ri';
import styles from './profilePage.module.css';

const ProfilePage = () => {
  const { player, updatePlayerTitle } = useContext(PlayerContext);
  const [selectedTitle, setSelectedTitle] = useState(player?.title || 'Beginner');

  const unlockedTitles = player?.unlockedTitles?.length
    ? player.unlockedTitles
    : [player?.title || 'Beginner'];

  const handleTitleChange = (newTitle) => {
    setSelectedTitle(newTitle);
    if (updatePlayerTitle) {
      updatePlayerTitle(newTitle);
    }
  };

  const level = player?.level || 1;
  const xp = player?.xp || 0;
  const xpNeeded = getRequiredXp(level);
  const xpPercent = Math.min(100, Math.round((xp / xpNeeded) * 100));

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Player Profile</h1>
        <p className={styles.subtitle}>View your adventure progression and equip earned titles</p>
      </header>

      {/* Hero Character Card */}
      <div className={styles.heroCard}>
        <div className={styles.heroRow}>
          <div className={styles.avatar}>
            <RiUser3Line />
          </div>
          <div className={styles.heroInfo}>
            <div className={styles.nameRow}>
              <span className={styles.playerName}>{player?.name || 'Adventurer'}</span>
              <span className={styles.titleBadge}>
                <RiSparklingFill style={{ marginRight: '4px' }} />
                {player?.title || 'Beginner'}
              </span>
            </div>
            <div className={styles.heroSub}>Level {level} Explorer</div>

            <div className={styles.xpContainer}>
              <ProgressBar
                progress={xpPercent}
                variant="xp"
                label="XP Progress"
                valueText={`${xp} / ${xpNeeded} XP (${xpPercent}%)`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: 'rgba(168, 85, 247, 0.15)', color: '#a855f7' }}>
            <RiShieldFlashFill />
          </div>
          <div className={styles.statDetails}>
            <span className={styles.statLabel}>Current Level</span>
            <span className={styles.statVal}>Lvl {level}</span>
            <span className={styles.statSub}>{Math.max(0, xpNeeded - xp)} XP to Level {level + 1}</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: 'rgba(251, 191, 36, 0.15)', color: '#fbbf24' }}>
            <RiCoinsFill />
          </div>
          <div className={styles.statDetails}>
            <span className={styles.statLabel}>Gold Coins</span>
            <span className={styles.statVal}>{player?.coins ?? 0}</span>
            <span className={styles.statSub}>Earned from quests</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: 'rgba(249, 115, 22, 0.15)', color: '#f97316' }}>
            <RiFireFill />
          </div>
          <div className={styles.statDetails}>
            <span className={styles.statLabel}>Active Streak</span>
            <span className={styles.statVal}>{player?.streak ?? 0} {player?.streak === 1 ? 'Day' : 'Days'}</span>
            <span className={styles.statSub}>Best: {player?.longestStreak ?? 0} days</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#6366f1' }}>
            <RiTrophyFill />
          </div>
          <div className={styles.statDetails}>
            <span className={styles.statLabel}>Lifetime XP</span>
            <span className={styles.statVal}>{player?.totalXp ?? xp}</span>
            <span className={styles.statSub}>Total adventure XP</span>
          </div>
        </div>
      </div>

      {/* Title Selection Card */}
      <div className={styles.sectionCard}>
        <h2 className={styles.sectionTitle}>Equip Title</h2>
        <p className={styles.sectionSubtitle}>
          Choose which honorific to display on your dashboard and public hero banner.
        </p>

        <div className={styles.titleSelectorRow}>
          <label htmlFor="titleSelect" className={styles.selectLabel}>
            Selected Title:
          </label>
          <select
            id="titleSelect"
            value={selectedTitle}
            onChange={(e) => handleTitleChange(e.target.value)}
            className={styles.select}
          >
            {unlockedTitles.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.titlesList}>
          {unlockedTitles.map((t) => {
            const isEquipped = (player?.title === t);
            return (
              <button
                key={t}
                type="button"
                className={`${styles.titlePill} ${isEquipped ? styles.titlePillActive : ''}`}
                onClick={() => handleTitleChange(t)}
              >
                {isEquipped && <RiCheckLine style={{ marginRight: '4px' }} />}
                {t}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

