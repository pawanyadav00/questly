import React, { useContext } from 'react';
import Modal from './Modal';
import Button from './Button';
import { PlayerContext } from '../../context/PlayerContext';
import { RiVipCrownFill, RiCoinsFill, RiFireFill, RiAwardFill } from 'react-icons/ri';
import styles from './levelUpModal.module.css';

const LevelUpModal = () => {
  const { levelUpInfo, clearLevelUp } = useContext(PlayerContext);

  if (!levelUpInfo) return null;

  return (
    <Modal isOpen={Boolean(levelUpInfo)} onClose={clearLevelUp}>
      <div className={styles.modalContent}>
        <div className={styles.celebrationGlow}></div>
        <div className={styles.trophyIcon}>👑</div>
        
        <h2 className={styles.title}>LEVEL UP!</h2>
        <p className={styles.levelBadge}>Level {levelUpInfo.level}</p>

        <p className={styles.subtitle}>
          Your dedication has borne fruit! You have grown stronger and ascended to a new height of mastery.
        </p>

        <div className={styles.rewardsBox}>
          <h4 className={styles.rewardsHeader}>Level-Up Rewards</h4>
          <div className={styles.rewardsList}>
            <div className={styles.rewardItem}>
              <span className={styles.rewardIconCoins}><RiCoinsFill /></span>
              <span>+{levelUpInfo.coinsEarned || 50} Gold Coins</span>
            </div>
            {levelUpInfo.unlockedTitle && (
              <div className={styles.rewardItem}>
                <span className={styles.rewardIconTitle}><RiAwardFill /></span>
                <span>New Title Unlocked: <strong>{levelUpInfo.unlockedTitle}</strong></span>
              </div>
            )}
          </div>
        </div>

        <Button variant="primary" size="large" onClick={clearLevelUp} className={styles.claimBtn}>
          Claim Rewards &amp; Continue
        </Button>
      </div>
    </Modal>
  );
};

export default LevelUpModal;
