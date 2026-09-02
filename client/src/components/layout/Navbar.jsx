import { NavLink } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { RiSwordFill, RiMoonFill, RiSunFill } from 'react-icons/ri';
import styles from './navbar.module.css';

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();

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
      </div>

      <div className={styles.actions}>
        {/* Placeholder for future XP Bar */}
        <button className={styles.themeToggle} onClick={toggleTheme}>
          {theme === 'dark' ? <RiSunFill /> : <RiMoonFill />}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
