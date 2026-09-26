import React, { useContext, useState } from 'react';
import { PlayerContext } from '../context/PlayerContext';
import styles from './profilePage.module.css';

const ProfilePage = () => {
  const { player, updatePlayerTitle } = useContext(PlayerContext);
  const [selectedTitle, setSelectedTitle] = useState(player.title);

  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    setSelectedTitle(newTitle);
    updatePlayerTitle(newTitle);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Profile</h1>
      <div className={styles.infoSection}>
        <p><strong>Name:</strong> {player.name}</p>
        <p><strong>Level:</strong> {player.level}</p>
        <p><strong>XP:</strong> {player.xp} / {player.totalXp}</p>
        <p><strong>Coins:</strong> {player.coins}</p>
        <p><strong>Streak:</strong> {player.streak} (Longest: {player.longestStreak})</p>
        <p><strong>Current Title:</strong> {player.title}</p>
      </div>

      <div className={styles.titleSection}>
        <label htmlFor="titleSelect">Select Title:</label>
        <select
          id="titleSelect"
          value={selectedTitle}
          onChange={handleTitleChange}
          className={styles.select}
        >
          {player.unlockedTitles.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default ProfilePage;
