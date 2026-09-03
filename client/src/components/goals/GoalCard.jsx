import { useNavigate } from 'react-router-dom';
import Card from '../common/Card';
import Badge from '../common/Badge';
import ProgressBar from '../common/ProgressBar';
import styles from './goalCard.module.css';

const GoalCard = ({ goal }) => {
  const navigate = useNavigate();

  // Temporary mock logic for progress until quests are fully wired
  const totalQuests = goal.quests?.length || 0;
  const completedQuests = goal.quests?.filter(q => q.status === 'completed').length || 0;
  const progress = totalQuests === 0 ? 0 : Math.round((completedQuests / totalQuests) * 100);

  return (
    <Card className={styles.card} onClick={() => navigate(`/goals/${goal.id}`)}>
      <div className={styles.header}>
        <div>
          <h3 className={styles.title}>{goal.title}</h3>
          <p className={styles.description}>{goal.description}</p>
        </div>
      </div>
      
      <div className={styles.meta}>
        <Badge variant={goal.difficulty}>{goal.difficulty}</Badge>
        {goal.category && <Badge variant="neutral">{goal.category}</Badge>}
      </div>

      <div className={styles.footer}>
        <div className={styles.progressSection}>
          <ProgressBar 
            progress={progress} 
            label="Progress" 
            valueText={`${progress}%`}
            variant="xp"
            size="small"
          />
        </div>
      </div>
    </Card>
  );
};

export default GoalCard;
