import React, { useContext, useState } from 'react';
import { PlayerContext } from '../context/PlayerContext';
import { useTheme } from '../context/ThemeContext';
import styles from './settingsPage.module.css';

const SettingsPage = () => {
  const { player, updatePlayerName } = useContext(PlayerContext);
  const { theme, toggleTheme } = useTheme();
  
  const [nameInput, setNameInput] = useState(player.name);
  const [saveMessage, setSaveMessage] = useState('');

  const handleSaveName = (e) => {
    e.preventDefault();
    if (nameInput.trim().length > 0) {
      updatePlayerName(nameInput.trim());
      setSaveMessage('Name updated successfully!');
      setTimeout(() => setSaveMessage(''), 3000);
    }
  };

  const handleResetData = () => {
    if (window.confirm("Are you sure you want to reset all your progress? This cannot be undone.")) {
      localStorage.clear();
      window.location.href = "/";
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Settings</h1>
      
      <div className={styles.section}>
        <h2>Profile</h2>
        <form onSubmit={handleSaveName} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="playerName">Display Name</label>
            <input 
              type="text" 
              id="playerName"
              value={nameInput} 
              onChange={(e) => setNameInput(e.target.value)}
              className={styles.input}
            />
          </div>
          <button type="submit" className={styles.saveBtn}>Save</button>
          {saveMessage && <span className={styles.successMsg}>{saveMessage}</span>}
        </form>
      </div>

      <div className={styles.section}>
        <h2>Appearance</h2>
        <div className={styles.preferenceRow}>
          <span>Theme</span>
          <button className={styles.toggleBtn} onClick={toggleTheme}>
            {theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          </button>
        </div>
      </div>

      <div className={styles.section}>
        <h2>Danger Zone</h2>
        <div className={styles.preferenceRow}>
          <span>Reset all progress and data</span>
          <button className={styles.dangerBtn} onClick={handleResetData}>
            Reset Data
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
