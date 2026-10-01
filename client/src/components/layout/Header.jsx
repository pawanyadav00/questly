import { useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PlayerContext } from '../../context/PlayerContext';
import {
  RiSearchLine,
  RiCompass3Line,
  RiMenuLine,
  RiSparklingFill
} from 'react-icons/ri';
import styles from './header.module.css';

const PAGE_TITLES = {
  '/': { title: 'Dashboard', subtitle: 'Syllabus mastery, quest progress & RPG analytics.' },
  '/dashboard': { title: 'Dashboard', subtitle: 'Syllabus mastery, quest progress & RPG analytics.' },
  '/goals': { title: 'Learning Syllabi', subtitle: 'Manage active curricula, chapters and course milestones.' },
  '/quests': { title: 'Quest Log', subtitle: 'Conquer challenges, practice coding, and gain knowledge.' },
  '/stats': { title: 'Analytics & Mastery', subtitle: 'XP trajectory, study velocity, and skill proficiency.' },
  '/profile': { title: 'Hero Profile', subtitle: 'Adventurer credentials, achievements, and gear.' },
  '/settings': { title: 'Settings', subtitle: 'Preferences, account details, and AI services.' }
};

const Header = ({ onOpenMobileMenu }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { player, goals, activeGoalId, switchActiveGoal, setIsAiModalOpen } = useContext(PlayerContext);

  const currentPath = location.pathname;
  const pageMeta = PAGE_TITLES[currentPath] || {
    title: 'Questly',
    subtitle: 'Gamified learning sanctuary.'
  };

  return (
    <header className={styles.header}>
      {/* Left: Mobile Hamburger & Page Title */}
      <div className={styles.titleArea}>
        <button
          type="button"
          className={styles.hamburgerBtn}
          onClick={onOpenMobileMenu}
          aria-label="Open navigation menu"
        >
          <RiMenuLine />
        </button>

        <div className={styles.titleTextWrap}>
          <h1 className={styles.pageTitle}>{pageMeta.title}</h1>
          <p className={styles.pageSubtitle}>{pageMeta.subtitle}</p>
        </div>
      </div>

      {/* Right Controls & Search */}
      <div className={styles.controlsArea}>
        {/* Global Search Bar (Desktop only) */}
        <div className={styles.searchBar} onClick={() => navigate('/quests')}>
          <RiSearchLine className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search quests, skills..."
            className={styles.searchInput}
            readOnly
          />
          <kbd className={styles.shortcutKbd}>⌘K</kbd>
        </div>

        {/* Syllabus / Curriculum Switcher */}
        {goals && goals.length > 0 && (
          <div className={styles.syllabusSelectorWrap}>
            <RiCompass3Line className={styles.selectorIcon} />
            <select
              value={activeGoalId || ''}
              onChange={(e) => switchActiveGoal(e.target.value)}
              className={styles.syllabusSelect}
              title="Select active syllabus"
            >
              {goals.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.title.length > 18 ? `${g.title.slice(0, 18)}...` : g.title}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Quick AI Forge Pill */}
        <button
          type="button"
          className={styles.forgePillBtn}
          onClick={() => setIsAiModalOpen(true)}
          title="Forge new AI curriculum"
        >
          <RiSparklingFill />
          <span className={styles.forgeBtnText}>AI Forge</span>
        </button>

        {/* User Badge / Profile Snippet */}
        <div className={styles.profileBadge} onClick={() => navigate('/profile')}>
          <div className={styles.avatarWrap}>
            <span className={styles.avatarInitial}>
              {player?.name ? player.name.charAt(0).toUpperCase() : 'A'}
            </span>
            <span className={styles.onlineDot} />
          </div>
          <div className={styles.profileMeta}>
            <span className={styles.profileName}>{player?.name || 'Adventurer'}</span>
            <span className={styles.levelTag}>Lv {player?.level || 1}</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
