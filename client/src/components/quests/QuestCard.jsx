import Card from '../common/Card';
import Badge from '../common/Badge';
import Button from '../common/Button';
import { RiLock2Fill, RiCheckDoubleFill, RiEdit2Line, RiDeleteBinLine, RiPlayFill } from 'react-icons/ri';
import styles from './questCard.module.css';

const QuestCard = ({ quest, onEdit, onDelete, onComplete }) => {
  const isLocked = quest.status === 'locked';
  const isCompleted = quest.status === 'completed';

  const cardClasses = [
    styles.card,
    isLocked ? styles.locked : '',
    isCompleted ? styles.completed : ''
  ].filter(Boolean).join(' ');

  return (
    <Card className={cardClasses}>
      <div className={styles.header}>
        <div>
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
                <Button variant="ghost" size="small" iconOnly onClick={() => onEdit(quest)}>
                  <RiEdit2Line />
                </Button>
                <Button variant="ghost" size="small" iconOnly onClick={() => onComplete(quest.id)}>
                  <RiPlayFill />
                </Button>
              </>
            )}
            <Button variant="ghost" size="small" iconOnly onClick={() => onDelete(quest.id)} className={styles.deleteBtn}>
              <RiDeleteBinLine />
            </Button>
          </div>
        )}
      </div>

      <div className={styles.meta}>
        <Badge variant="neutral">{quest.type}</Badge>
        <Badge variant={quest.difficulty}>{quest.difficulty}</Badge>
      </div>

      <div className={styles.rewards}>
        <span className={styles.xp}>+{quest.xpReward} XP</span>
        <span className={styles.coins}>+{quest.coinReward} Coins</span>
      </div>
    </Card>
  );
};

export default QuestCard;
