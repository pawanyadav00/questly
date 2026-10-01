import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlayerContext } from '../context/PlayerContext';
import GoalCard from '../components/goals/GoalCard';
import GoalForm from '../components/goals/GoalForm';
import AISyllabusModal from '../components/goals/AISyllabusModal';
import Modal from '../components/common/Modal';
import Button from '../components/common/Button';
import { RiAddLine, RiSparklingFill } from 'react-icons/ri';
import styles from './goalsPage.module.css';

const GoalsPage = () => {
  const navigate = useNavigate();
  const {
    goals,
    addGoal,
    updateGoal,
    deleteGoal,
    activeGoalId,
    switchActiveGoal
  } = useContext(PlayerContext);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  const handleSaveGoal = (goal) => {
    (goals.some((g) => g.id === goal.id) ? updateGoal : addGoal)(goal);
    setIsModalOpen(false);
  };

  const handleCampaignDeployed = (newGoal) => {
    addGoal(newGoal);
    navigate(`/dashboard`);
  };

  return (
    <div className={`container ${styles.page}`}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Your Goals</h1>
          <p className={styles.subtitle}>Choose your quest lines or forge new campaigns with AI.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Button
            variant="primary"
            onClick={() => setIsAiModalOpen(true)}
            style={{
              background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
              fontWeight: 700,
              boxShadow: '0 4px 15px rgba(99, 102, 241, 0.35)'
            }}
          >
            <RiSparklingFill /> ⚡ Forge with AI
          </Button>
          <Button variant="ghost" onClick={() => setIsModalOpen(true)}>
            <RiAddLine /> Manual Goal
          </Button>
        </div>
      </div>

      {goals.length === 0 ? (
        <div className={styles.emptyState}>
          <p>You haven't set any goals yet.</p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', marginTop: '1rem', flexWrap: 'wrap' }}>
            <Button
              variant="primary"
              onClick={() => setIsAiModalOpen(true)}
              style={{
                background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                fontWeight: 700
              }}
            >
              <RiSparklingFill /> ⚡ Auto-Generate from Syllabus
            </Button>
            <Button variant="ghost" onClick={() => setIsModalOpen(true)}>
              Create Manually
            </Button>
          </div>
        </div>
      ) : (
        <div className={styles.grid}>
          {goals.map(goal => (
            <GoalCard
              key={goal.id}
              goal={goal}
              isActive={goal.id === activeGoalId}
              onSetActive={() => switchActiveGoal(goal.id)}
              onDelete={(id) => {
                if (window.confirm(`Are you sure you want to delete preset "${goal.title}"? This cannot be undone.`)) {
                  deleteGoal(id);
                }
              }}
            />
          ))}
        </div>
      )}

      {/* Manual Goal Form Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <GoalForm onSubmit={handleSaveGoal} onCancel={() => setIsModalOpen(false)} />
      </Modal>

      {/* AI Syllabus Generator Modal */}
      <AISyllabusModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        onCampaignDeployed={handleCampaignDeployed}
      />
    </div>
  );
};

export default GoalsPage;

