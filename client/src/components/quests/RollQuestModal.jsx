import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Badge from '../common/Badge';
import { RiShuffleLine, RiArrowRightLine, RiFireFill, RiCoinsFill } from 'react-icons/ri';
import styles from './rollQuestModal.module.css';

const RollQuestModal = ({ isOpen, onClose, quests = [], onCompleteQuest, onNavigateToGoal }) => {
  const [isRolling, setIsRolling] = useState(false);
  const [selectedQuest, setSelectedQuest] = useState(null);
  const [displayTitle, setDisplayTitle] = useState('');

  const rollableQuests = quests.filter(q => q.status === 'available');

  const startRoll = () => {
    if (rollableQuests.length === 0) return;
    setIsRolling(true);
    setSelectedQuest(null);

    let counter = 0;
    const maxRolls = 15;
    const interval = setInterval(() => {
      const randomIdx = Math.floor(Math.random() * rollableQuests.length);
      setDisplayTitle(rollableQuests[randomIdx].title);
      counter++;

      if (counter >= maxRolls) {
        clearInterval(interval);
        const finalChoice = rollableQuests[Math.floor(Math.random() * rollableQuests.length)];
        setSelectedQuest(finalChoice);
        setDisplayTitle(finalChoice.title);
        setIsRolling(false);
      }
    }, 80);
  };

  useEffect(() => {
    if (isOpen) {
      if (rollableQuests.length > 0) {
        startRoll();
      } else {
        setSelectedQuest(null);
        setDisplayTitle('');
      }
    }
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className={styles.modalContent}>
        <div className={styles.diceIcon}>🎲</div>
        <h2 className={styles.title}>Roll a Random Quest</h2>
        <p className={styles.subtitle}>
          Can't decide what to tackle next? Let fate choose your adventure!
        </p>

        {rollableQuests.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No available quests to roll right now.</p>
            <p className={styles.emptyHint}>Create new goals or unlock quests from your existing chains!</p>
          </div>
        ) : (
          <div className={styles.rollContainer}>
            <div className={`${styles.displayBox} ${isRolling ? styles.spinning : ''}`}>
              <div className={styles.questPreviewTitle}>
                {displayTitle || 'Rolling...'}
              </div>
            </div>

            {selectedQuest && !isRolling && (
              <div className={styles.chosenCard}>
                <div className={styles.chosenHeader}>
                  <Badge variant={selectedQuest.difficulty}>{selectedQuest.difficulty}</Badge>
                  <span className={styles.goalTag}>From: {selectedQuest.goalTitle}</span>
                </div>
                <h3 className={styles.chosenTitle}>{selectedQuest.title}</h3>
                <p className={styles.chosenDesc}>{selectedQuest.description}</p>
                <div className={styles.chosenRewards}>
                  <span className={styles.rewardXp}><RiFireFill /> +{selectedQuest.xpReward} XP</span>
                  <span className={styles.rewardCoins}><RiCoinsFill /> +{selectedQuest.coinReward} Coins</span>
                </div>

                <div className={styles.modalActions}>
                  <Button
                    variant="primary"
                    onClick={() => {
                      if (onCompleteQuest) onCompleteQuest(selectedQuest.goalId, selectedQuest.id);
                      onClose();
                    }}
                  >
                    Complete Quest
                  </Button>
                  {onNavigateToGoal && (
                    <Button
                      variant="ghost"
                      onClick={() => {
                        onNavigateToGoal(selectedQuest.goalId);
                        onClose();
                      }}
                    >
                      View Goal <RiArrowRightLine />
                    </Button>
                  )}
                  <Button variant="ghost" onClick={startRoll} disabled={isRolling}>
                    <RiShuffleLine /> Roll Again
                  </Button>
                </div>
              </div>
            )}

            {isRolling && (
              <p className={styles.rollingText}>Consulting the quest archives...</p>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
};

export default RollQuestModal;
