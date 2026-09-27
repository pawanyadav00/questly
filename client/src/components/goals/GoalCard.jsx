import { useNavigate } from 'react-router-dom';
import Card from '../common/Card';
import Badge from '../common/Badge';
import ProgressBar from '../common/ProgressBar';
import { RiCalendarEventLine, RiAlertLine, RiDeleteBinLine } from 'react-icons/ri';
import styles from './goalCard.module.css';

const GoalCard = ({ goal, isActive, onSetActive, onDelete }) => {
  const navigate = useNavigate();

  const totalQuests = goal.quests?.length || 0;
  const completedQuests = goal.quests?.filter(q => q.status === 'completed').length || 0;
  const progress = totalQuests === 0 ? 0 : Math.round((completedQuests / totalQuests) * 100);

  // Goal Health & Deadline Calculation
  let healthVariant = 'healthy';
  let healthLabel = 'Healthy';
  let deadlineText = null;
  let isUrgent = false;

  if (goal.deadline) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const deadlineDate = new Date(goal.deadline);
    deadlineDate.setHours(0, 0, 0, 0);
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (progress === 100) {
      healthVariant = 'healthy';
      healthLabel = 'Completed';
      deadlineText = 'Finished';
    } else if (diffDays < 0) {
      healthVariant = 'danger';
      healthLabel = 'Overdue';
      deadlineText = `${Math.abs(diffDays)}d overdue`;
      isUrgent = true;
    } else if (diffDays === 0) {
      healthVariant = 'danger';
      healthLabel = 'Due Today';
      deadlineText = 'Due today!';
      isUrgent = true;
    } else if (diffDays <= 3 && progress < 70) {
      healthVariant = 'warning';
      healthLabel = 'At Risk';
      deadlineText = `${diffDays}d left`;
      isUrgent = true;
    } else if (diffDays <= 7 && progress < 40) {
      healthVariant = 'warning';
      healthLabel = 'Falling Behind';
      deadlineText = `${diffDays}d left`;
    } else {
      healthVariant = 'healthy';
      healthLabel = 'Healthy';
      deadlineText = `${diffDays}d left`;
    }
  } else {
    if (progress === 100) {
      healthVariant = 'healthy';
      healthLabel = 'Completed';
    } else if (progress > 0) {
      healthVariant = 'healthy';
      healthLabel = 'In Progress';
    } else {
      healthVariant = 'warning';
      healthLabel = 'Not Started';
    }
  }

  return (
    <Card className={`${styles.card} ${isActive ? styles.activeCard : ''}`} onClick={() => navigate(`/goals/${goal.id}`)}>
      <div className={styles.header}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem', flexWrap: 'wrap' }}>
            <h3 className={styles.title}>{goal.title}</h3>
            {isActive && (
              <Badge variant="epic" style={{ fontSize: '0.65rem', padding: '2px 8px' }}>
                🌟 Active Environment
              </Badge>
            )}
          </div>
          <p className={styles.description}>{goal.description}</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.4rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <Badge variant={healthVariant}>{healthLabel}</Badge>
            {onDelete && (
              <button
                type="button"
                className={styles.deleteBtn}
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  onDelete(goal.id);
                }}
                title="Delete this preset"
              >
                <RiDeleteBinLine /> Delete
              </button>
            )}
          </div>
          {!isActive && onSetActive && (
            <button
              className={styles.activateBtn}
              onClick={(e) => {
                e.stopPropagation();
                onSetActive();
              }}
              title="Switch your active dashboard & skills environment to this syllabus"
            >
              ⚡ Set Active
            </button>
          )}
        </div>
      </div>
      
      <div className={styles.meta}>
        <Badge variant="primary">Lvl {goal.level || 1}</Badge>
        <span className={styles.metaStatTag}>💰 {goal.coins || 0} Coins</span>
        <span className={styles.metaStatTag}>📜 {totalQuests} Quests</span>
        <Badge variant={goal.difficulty}>{goal.difficulty}</Badge>
        {goal.category && <Badge variant="neutral">{goal.category}</Badge>}
        {deadlineText && (
          <span className={`${styles.deadlineTag} ${isUrgent ? styles.urgentDeadline : ''}`}>
            {isUrgent ? <RiAlertLine /> : <RiCalendarEventLine />}
            {deadlineText}
          </span>
        )}
      </div>

      <div className={styles.footer}>
        <div className={styles.progressSection}>
          <ProgressBar 
            progress={progress} 
            label="Progress" 
            valueText={`${completedQuests}/${totalQuests} (${progress}%)`}
            variant="xp"
            size="small"
          />
        </div>
      </div>
    </Card>
  );
};

export default GoalCard;

