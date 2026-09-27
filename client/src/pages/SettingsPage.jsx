import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlayerContext } from '../context/PlayerContext';
import { useTheme } from '../context/ThemeContext';
import styles from './settingsPage.module.css';

const SettingsPage = () => {
  const navigate = useNavigate();
  const { player, updatePlayerName, resetAllData } = useContext(PlayerContext);
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
    if (window.confirm("Are you sure you want to reset all your progress? This will clear all syllabi, skills, quests, and stats.")) {
      resetAllData();
      navigate('/');
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
        <h2>AI Campaign Forge</h2>
        <div className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="geminiApiKey">Google Gemini API Key (Optional)</label>
            <input 
              type="password" 
              id="geminiApiKey"
              placeholder="Paste your Gemini API key (or leave empty for local NLP engine)"
              defaultValue={localStorage.getItem('gemini_api_key') || ''} 
              onChange={(e) => localStorage.setItem('gemini_api_key', e.target.value.trim())}
              className={styles.input}
            />
          </div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Zero config: If left empty, the intelligent built-in curriculum parser will generate your quest trees automatically!
          </span>
        </div>
      </div>

      <div className={styles.section} style={{ borderColor: 'rgba(239, 68, 68, 0.4)' }}>
        <h2 style={{ color: '#ef4444' }}>Danger Zone</h2>
        <div className={styles.preferenceRow}>
          <div>
            <span style={{ display: 'block', fontWeight: 600, color: 'var(--text-primary)' }}>
              Reset Workspace & Syllabi
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Clear all uploaded syllabi, quests, and reset level, coins, and XP to 0
            </span>
          </div>
          <button className={styles.dangerBtn} onClick={handleResetData} title="Clear all syllabus data and reset workspace">
            🗑️ Reset All Data
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
