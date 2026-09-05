import { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getGoals, saveGoals } from '../services/storage';
import { PlayerContext } from '../context/PlayerContext';
import { RiArrowLeftLine, RiAddLine } from 'react-icons/ri';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import ProgressBar from '../components/common/ProgressBar';
import Modal from '../components/common/Modal';
import QuestCard from '../components/quests/QuestCard';
import QuestForm from '../components/quests/QuestForm';
import styles from './goalDetailPage.module.css';

const GoalDetailPage = () => {
  const { goalId } = useParams();
  const navigate = useNavigate();
  const { completeQuest } = useContext(PlayerContext);
  
  const [goal, setGoal] = useState(null);
  const [isQuestModalOpen, setIsQuestModalOpen] = useState(false);
  const [editingQuest, setEditingQuest] = useState(null);

  useEffect(() => {
    const goals = getGoals();
    const foundGoal = goals.find(g => g.id === goalId);
    if (foundGoal) {
      // Ensure quests array exists
      if (!foundGoal.quests) foundGoal.quests = [];
      setGoal(foundGoal);
    } else {
      navigate('/goals');
    }
  }, [goalId, navigate]);

  const updateGoalInStorage = (updatedGoal) => {
    const goals = getGoals();
    const updatedGoals = goals.map(g => g.id === updatedGoal.id ? updatedGoal : g);
    saveGoals(updatedGoals);
    setGoal(updatedGoal);
  };

  const handleSaveQuest = (questData) => {
    const isEditing = goal.quests.some(q => q.id === questData.id);
    let newQuests;

    if (isEditing) {
      newQuests = goal.quests.map(q => q.id === questData.id ? questData : q);
    } else {
      newQuests = [...goal.quests, questData];
    }

    // Logic to unlock quests if their prerequisites are met (basic check)
    // For now, completion handles unlocking, but saving might change prerequisites
    
    updateGoalInStorage({ ...goal, quests: newQuests });
    setIsQuestModalOpen(false);
    setEditingQuest(null);
  };

  const handleDeleteQuest = (questId) => {
    const newQuests = goal.quests.filter(q => q.id !== questId);
    // Note: should also handle removing this quest as a prerequisite from others
    const cleanedQuests = newQuests.map(q => {
      if (q.prerequisiteId === questId) {
        return { ...q, prerequisiteId: '', status: 'available' };
      }
      return q;
    });
    
    updateGoalInStorage({ ...goal, quests: cleanedQuests });
  };

  const handleCompleteQuest = (questId) => {
    // Find the quest to get its rewards
    const completedQuest = goal.quests.find(q => q.id === questId);
    if (!completedQuest) return;

    // Call context to award XP and Coins (and skill XP if a skill is assigned)
    completeQuest(questId, completedQuest.xpReward, completedQuest.coinReward, completedQuest.skillId);

    const newQuests = goal.quests.map(q => {
      if (q.id === questId) return { ...q, status: 'completed' };
      // If this quest was a prerequisite for another locked quest, unlock it
      if (q.prerequisiteId === questId && q.status === 'locked') {
        return { ...q, status: 'available' };
      }
      return q;
    });

    updateGoalInStorage({ ...goal, quests: newQuests });
  };

  const openEditModal = (quest) => {
    setEditingQuest(quest);
    setIsQuestModalOpen(true);
  };

  const openCreateModal = () => {
    setEditingQuest(null);
    setIsQuestModalOpen(true);
  };

  if (!goal) return null;

  const totalQuests = goal.quests.length;
  const completedQuests = goal.quests.filter(q => q.status === 'completed').length;
  const progress = totalQuests === 0 ? 0 : Math.round((completedQuests / totalQuests) * 100);

  return (
    <div className={`container ${styles.page}`}>
      <Link to="/goals" className={styles.backLink}>
        <RiArrowLeftLine /> Back to Goals
      </Link>
      
      <div className={styles.header}>
        <div className={styles.titleArea}>
          <h1 className={styles.title}>{goal.title}</h1>
          <p className={styles.description}>{goal.description}</p>
          <div className={styles.meta}>
            <Badge variant={goal.difficulty}>{goal.difficulty}</Badge>
            {goal.category && <Badge variant="neutral">{goal.category}</Badge>}
          </div>
        </div>
      </div>

      <div className={styles.progressSection}>
        <div className={styles.progressStats}>
          <span>Goal Progress</span>
          <span>{completedQuests} / {totalQuests} Quests</span>
        </div>
        <ProgressBar progress={progress} variant="xp" size="large" />
      </div>

      <div className={styles.questSectionHeader}>
        <h2 className={styles.questTitle}>Quest Chain</h2>
        <Button onClick={openCreateModal}>
          <RiAddLine /> Add Quest
        </Button>
      </div>

      {goal.quests.length === 0 ? (
        <div className={styles.emptyState}>
          <p>No quests in this chain yet.</p>
          <Button variant="ghost" onClick={openCreateModal} style={{ marginTop: '1rem' }}>
            Add your first quest
          </Button>
        </div>
      ) : (
        <div className={styles.questList}>
          {goal.quests.map(quest => (
            <QuestCard 
              key={quest.id} 
              quest={quest} 
              onEdit={openEditModal}
              onDelete={handleDeleteQuest}
              onComplete={handleCompleteQuest}
            />
          ))}
        </div>
      )}

      <Modal isOpen={isQuestModalOpen} onClose={() => setIsQuestModalOpen(false)}>
        <QuestForm 
          goalId={goal.id}
          initialData={editingQuest}
          availableQuests={goal.quests}
          onSubmit={handleSaveQuest}
          onCancel={() => setIsQuestModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default GoalDetailPage;
