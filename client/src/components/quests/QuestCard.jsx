import Card from '../common/Card';
import Badge from '../common/Badge';
import Button from '../common/Button';
import {
  RiLock2Fill,
  RiCheckDoubleFill,
  RiEdit2Line,
  RiDeleteBinLine,
  RiPlayFill,
  RiSwordFill,
  RiQuestionAnswerLine
} from 'react-icons/ri';
import styles from './questCard.module.css';

const QuestCard = ({ quest, onEdit, onDelete, onComplete, onOpenChallenge }) => {
  const isLocked = quest.status === 'locked';
  const isCompleted = quest.status === 'completed';
  const hasChallenges = quest.challenges && quest.challenges.length > 0;

  const cardClasses = [
    styles.card,
    isLocked ? styles.locked : '',
    isCompleted ? styles.completed : ''
  ].filter(Boolean).join(' ');

  const handleStartChallenge = () => {
    if (onOpenChallenge) {
      onOpenChallenge(quest);
    } else if (onComplete) {
      onComplete(quest.id);
    }
  };

  return (
    <Card className={cardClasses}>
      <div className={styles.header}>
        <div style={{ flex: 1 }}>
          <div className={styles.titleArea}>
            {isLocked && <RiLock2Fill className={`${styles.statusIcon} ${styles.lockedIcon}`} />}
            {isCompleted && <RiCheckDoubleFill className={`${styles.statusIcon} ${styles.completedIcon}`} />}
            <h4 className={styles.title}>{quest.title}</h4>
          </div>
          <p className={styles.description}>{quest.description}</p>
        </div>
        
        {!isLocked && (
          <div className={styles.actions}>
            {!isCompleted && (
              <>
                {onEdit && (
                  <Button variant="ghost" size="small" iconOnly onClick={() => onEdit(quest)} title="Edit Quest">
                    <RiEdit2Line />
                  </Button>
                )}
                {onComplete && !hasChallenges && (
                  <Button variant="ghost" size="small" iconOnly onClick={() => onComplete(quest.id)} title="Quick Complete">
                    <RiPlayFill />
                  </Button>
                )}
              </>
            )}
            {onDelete && (
              <Button variant="ghost" size="small" iconOnly onClick={() => onDelete(quest.id)} className={styles.deleteBtn} title="Delete Quest">
                <RiDeleteBinLine />
              </Button>
            )}
          </div>
        )}
      </div>

      <div className={styles.meta}>
        <Badge variant="neutral">{quest.type}</Badge>
        <Badge variant={quest.difficulty}>{quest.difficulty}</Badge>
        {hasChallenges && (
          <Badge variant="primary" style={{ background: 'rgba(99, 102, 241, 0.15)', borderColor: '#6366f1', color: '#a5b4fc' }}>
            {quest.challenges.length} Drills
          </Badge>
        )}
      </div>

      <div className={styles.bottomRow}>
        <div className={styles.rewards}>
          <span className={styles.xp}>+{quest.xpReward} XP</span>
          <span className={styles.coins}>+{quest.coinReward} Coins</span>
        </div>

        {!isLocked && (
          <div className={styles.challengeActionArea}>
            {!isCompleted ? (
              <Button
                variant="primary"
                size="small"
                onClick={handleStartChallenge}
                className={styles.challengeBtn}
                style={{
                  background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                  fontWeight: 700,
                  boxShadow: '0 4px 12px rgba(99, 102, 241, 0.35)'
                }}
              >
                <RiSwordFill /> Solve Challenge
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="small"
                onClick={handleStartChallenge}
                className={styles.reviewBtn}
              >
                <RiQuestionAnswerLine /> Review Drills
              </Button>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};

export default QuestCard;
