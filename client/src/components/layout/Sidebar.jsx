import { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { PlayerContext } from '../../context/PlayerContext';
import {
  RiSwordFill,
  RiDashboard3Line,
  RiCompass3Line,
  RiSwordLine,
  RiBarChartLine,
  RiSparklingFill,
  RiShuffleLine,
  RiUser3Line,
  RiSettings3Line,
  RiLogoutBoxRLine,
  RiCloseLine
} from 'react-icons/ri';
import styles from './sidebar.module.css';

const Sidebar = ({ isMobileOpen, onCloseMobile }) => {
  const navigate = useNavigate();
  const { setIsAiModalOpen, setIsRollModalOpen, resetAllData } = useContext(PlayerContext);

  const handleLinkClick = () => {
    if (onCloseMobile) onCloseMobile();
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset all progress? This clears syllabi, quests, and stats.")) {
      resetAllData();
      if (onCloseMobile) onCloseMobile();
      navigate('/');
    }
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div
          className={styles.backdrop}
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      <aside className={`${styles.sidebar} ${isMobileOpen ? styles.sidebarMobileOpen : ''}`}>
        {/* Brand Logo & Mobile Close Button */}
        <div className={styles.brandRow}>
          <NavLink to="/dashboard" className={styles.brand} onClick={handleLinkClick}>
            <div className={styles.brandIconWrap}>
              <RiSwordFill className={styles.brandIcon} />
            </div>
            <span className={styles.brandName}>Questly</span>
          </NavLink>

          {/* Close button on mobile */}
          <button
            type="button"
            className={styles.mobileCloseBtn}
            onClick={onCloseMobile}
            aria-label="Close menu"
          >
            <RiCloseLine />
          </button>
        </div>

        {/* Navigation Sections */}
        <div className={styles.navSections}>
          {/* Main Menu */}
          <div className={styles.section}>
            <span className={styles.sectionLabel}>MAIN MENU</span>
            <NavLink
              to="/dashboard"
              onClick={handleLinkClick}
              className={({ isActive }) => (isActive ? `${styles.navItem} ${styles.navItemActive}` : styles.navItem)}
            >
              <RiDashboard3Line className={styles.itemIcon} />
              <span>Dashboard</span>
            </NavLink>

            <NavLink
              to="/goals"
              onClick={handleLinkClick}
              className={({ isActive }) => (isActive ? `${styles.navItem} ${styles.navItemActive}` : styles.navItem)}
            >
              <RiCompass3Line className={styles.itemIcon} />
              <span>Goals</span>
            </NavLink>

            <NavLink
              to="/quests"
              onClick={handleLinkClick}
              className={({ isActive }) => (isActive ? `${styles.navItem} ${styles.navItemActive}` : styles.navItem)}
            >
              <RiSwordLine className={styles.itemIcon} />
              <span>Quests</span>
            </NavLink>

            <NavLink
              to="/stats"
              onClick={handleLinkClick}
              className={({ isActive }) => (isActive ? `${styles.navItem} ${styles.navItemActive}` : styles.navItem)}
            >
              <RiBarChartLine className={styles.itemIcon} />
              <span>Analytics</span>
            </NavLink>
          </div>

          {/* AI Features */}
          <div className={styles.section}>
            <span className={styles.sectionLabel}>AI FEATURES</span>
            <button
              type="button"
              className={styles.actionItem}
              onClick={() => {
                handleLinkClick();
                setIsAiModalOpen(true);
              }}
            >
              <RiSparklingFill className={styles.itemIcon} style={{ color: '#a855f7' }} />
              <span>AI Forge</span>
            </button>

            <button
              type="button"
              className={styles.actionItem}
              onClick={() => {
                handleLinkClick();
                setIsRollModalOpen(true);
              }}
            >
              <RiShuffleLine className={styles.itemIcon} style={{ color: '#6366f1' }} />
              <span>Roll Quest</span>
            </button>
          </div>

          {/* Account / Settings */}
          <div className={styles.section}>
            <span className={styles.sectionLabel}>ACCOUNT</span>
            <NavLink
              to="/profile"
              onClick={handleLinkClick}
              className={({ isActive }) => (isActive ? `${styles.navItem} ${styles.navItemActive}` : styles.navItem)}
            >
              <RiUser3Line className={styles.itemIcon} />
              <span>Profile</span>
            </NavLink>

            <NavLink
              to="/settings"
              onClick={handleLinkClick}
              className={({ isActive }) => (isActive ? `${styles.navItem} ${styles.navItemActive}` : styles.navItem)}
            >
              <RiSettings3Line className={styles.itemIcon} />
              <span>Settings</span>
            </NavLink>
          </div>
        </div>

        {/* Footer / Reset Action */}
        <div className={styles.sidebarFooter}>
          <button type="button" className={styles.signOutBtn} onClick={handleReset}>
            <RiLogoutBoxRLine className={styles.signOutIcon} />
            <span>Reset Data</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
