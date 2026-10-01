import { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { PlayerContext } from '../../context/PlayerContext';
import {
  RiDashboard3Line,
  RiCompass3Line,
  RiSparklingFill,
  RiSwordLine,
  RiUser3Line
} from 'react-icons/ri';
import styles from './mobileBottomNav.module.css';

const MobileBottomNav = () => {
  const { setIsAiModalOpen } = useContext(PlayerContext);

  return (
    <nav className={styles.bottomNav} aria-label="Mobile Navigation">
      <NavLink
        to="/dashboard"
        className={({ isActive }) => (isActive ? `${styles.navItem} ${styles.navItemActive}` : styles.navItem)}
      >
        <RiDashboard3Line className={styles.navIcon} />
        <span className={styles.navLabel}>Home</span>
      </NavLink>

      <NavLink
        to="/goals"
        className={({ isActive }) => (isActive ? `${styles.navItem} ${styles.navItemActive}` : styles.navItem)}
      >
        <RiCompass3Line className={styles.navIcon} />
        <span className={styles.navLabel}>Goals</span>
      </NavLink>

      {/* Floating Center AI Forge Action */}
      <button
        type="button"
        className={styles.centerActionBtn}
        onClick={() => setIsAiModalOpen(true)}
        aria-label="Forge AI Curriculum"
        title="Forge AI Curriculum"
      >
        <div className={styles.centerIconGlow}>
          <RiSparklingFill className={styles.centerIcon} />
        </div>
      </button>

      <NavLink
        to="/quests"
        className={({ isActive }) => (isActive ? `${styles.navItem} ${styles.navItemActive}` : styles.navItem)}
      >
        <RiSwordLine className={styles.navIcon} />
        <span className={styles.navLabel}>Quests</span>
      </NavLink>

      <NavLink
        to="/profile"
        className={({ isActive }) => (isActive ? `${styles.navItem} ${styles.navItemActive}` : styles.navItem)}
      >
        <RiUser3Line className={styles.navIcon} />
        <span className={styles.navLabel}>Profile</span>
      </NavLink>
    </nav>
  );
};

export default MobileBottomNav;
