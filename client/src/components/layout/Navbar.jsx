import { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { PlayerContext } from '../../context/PlayerContext';
import { RiSwordFill, RiMoonFill, RiSunFill, RiVipCrownFill, RiCoinsLine, RiUserFill, RiSettings3Fill, RiBarChartFill } from 'react-icons/ri';
import styles from './navbar.module.css';

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const { player } = useContext(PlayerContext);

  return (
    <nav className={styles.navbar}>
      <NavLink to="/" className={styles.logo}>
        <RiSwordFill className={styles.logoIcon} />
        LifeQuest
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
        <NavLink 
          to="/daily" 
          className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link}
        >
          Daily
        </NavLink>
      </div>

      <div className={styles.actions}>
        <div className={styles.playerStats}>
          <span className={styles.statBadge}>
            <RiVipCrownFill className={styles.statIcon} /> Lvl {player.level}
          </span>
          <span className={styles.statBadge}>
            <RiCoinsLine className={styles.statIcon} /> {player.coins}
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
