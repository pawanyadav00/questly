import { useState, useEffect } from 'react';
import { getGoals, saveGoals } from '../services/storage';
import GoalCard from '../components/goals/GoalCard';
import GoalForm from '../components/goals/GoalForm';
import Modal from '../components/common/Modal';
import Button from '../components/common/Button';
import { RiAddLine } from 'react-icons/ri';
import styles from './goalsPage.module.css';

const GoalsPage = () => {
  const [goals, setGoals] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setGoals(getGoals());
  }, []);

  const handleSaveGoal = (goal) => {
    const isEditing = goals.some(g => g.id === goal.id);
    let updatedGoals;
    
    if (isEditing) {
      updatedGoals = goals.map(g => g.id === goal.id ? goal : g);
    } else {
      updatedGoals = [...goals, goal];
    }
    
    setGoals(updatedGoals);
    saveGoals(updatedGoals);
    setIsModalOpen(false);
  };

  return (
    <div className={`container ${styles.page}`}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Your Goals</h1>
          <p className={styles.subtitle}>Choose your quest lines.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <RiAddLine /> New Goal
        </Button>
      </div>

      {goals.length === 0 ? (
        <div className={styles.emptyState}>
          <p>You haven't set any goals yet.</p>
          <Button variant="ghost" onClick={() => setIsModalOpen(true)} style={{ marginTop: '1rem' }}>
            Create your first goal
          </Button>
        </div>
      ) : (
        <div className={styles.grid}>
          {goals.map(goal => (
            <GoalCard key={goal.id} goal={goal} />
          ))}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <GoalForm onSubmit={handleSaveGoal} onCancel={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  );
};

export default GoalsPage;
