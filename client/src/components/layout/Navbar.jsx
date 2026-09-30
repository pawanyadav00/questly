import { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { PlayerContext } from '../../context/PlayerContext';
import { RiSwordFill, RiMoonFill, RiSunFill, RiVipCrownFill, RiCoinsLine, RiUserFill, RiSettings3Fill, RiBarChartFill } from 'react-icons/ri';
import styles from './navbar.module.css';

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const { player, activeGoal, goals, switchActiveGoal } = useContext(PlayerContext);

  const activeLevel = activeGoal?.level || 1;
  const activeCoins = activeGoal?.coins || 0;

  return (
    <nav className={styles.navbar}>
      <NavLink to="/" className={styles.logo}>
        <RiSwordFill className={styles.logoIcon} />
        Questly
      </NavLink>

      <div className={styles.navLinks}>
        <NavLink 
          to="/dashboard" 
          className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link}
        >
          Dashboard
        </NavLink>
        <NavLink 
          to="/goals" 
          className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link}
        >
          Goals
        </NavLink>
        <NavLink 
          to="/quests" 
          className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link}
        >
          Quests
        </NavLink>
        <NavLink 
          to="/stats" 
          className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link}
        >
          Stats
        </NavLink>
      </div>

      <div className={styles.actions}>
        {goals && goals.length > 0 && (
          <div className={styles.envPill} title="Active Learning Environment">
            <span className={styles.envIcon}>📚</span>
            <select
              className={styles.envSelect}
              value={activeGoal?.id || ''}
              onChange={(e) => switchActiveGoal(e.target.value)}
            >
              {goals.map(g => (
                <option key={g.id} value={g.id}>
                  {g.title.length > 18 ? g.title.slice(0, 16) + '...' : g.title}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className={styles.playerStats}>
          <span className={styles.statBadge} title={`Active Syllabus Level: Lvl ${activeLevel}`}>
            <RiVipCrownFill className={styles.statIcon} /> Lvl {activeLevel}
          </span>
          <span className={styles.statBadge} title={`Active Syllabus Coins: ${activeCoins}`}>
            <RiCoinsLine className={styles.statIcon} /> {activeCoins}
          </span>
        </div>
        <NavLink to="/profile" className={styles.iconLink}>
          <RiUserFill />
        </NavLink>
        <NavLink to="/settings" className={styles.iconLink}>
          <RiSettings3Fill />
        </NavLink>
        <button className={styles.themeToggle} onClick={toggleTheme}>
          {theme === 'dark' ? <RiSunFill /> : <RiMoonFill />}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
