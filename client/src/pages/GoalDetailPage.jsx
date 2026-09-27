import { useState, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { PlayerContext } from '../context/PlayerContext';
import { getRequiredXp } from '../utils/levelMath';
import { RiArrowLeftLine, RiAddLine, RiSwordFill, RiSparklingFill, RiCoinsFill, RiFireFill, RiDeleteBinLine } from 'react-icons/ri';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import ProgressBar from '../components/common/ProgressBar';
import Modal from '../components/common/Modal';
import QuestCard from '../components/quests/QuestCard';
import QuestForm from '../components/quests/QuestForm';
import QuestChallengeModal from '../components/quests/QuestChallengeModal';
import styles from './goalDetailPage.module.css';

const GoalDetailPage = () => {
  const { goalId } = useParams();
  const navigate = useNavigate();
  const {
    goals,
    updateGoal,
    deleteGoal,
    activeGoalId,
    switchActiveGoal,
    completeQuest
  } = useContext(PlayerContext);
  
  const [isQuestModalOpen, setIsQuestModalOpen] = useState(false);
  const [editingQuest, setEditingQuest] = useState(null);
  const [activeChallengeQuest, setActiveChallengeQuest] = useState(null);

  const goal = goals.find(g => g.id === goalId) || null;

  const handleSaveQuest = (questData) => {
    if (!goal) return;
    const isEditing = (goal.quests || []).some(q => q.id === questData.id);
    let newQuests;

    if (isEditing) {
      newQuests = (goal.quests || []).map(q => q.id === questData.id ? questData : q);
    } else {
      newQuests = [...(goal.quests || []), questData];
    }
    
    updateGoal({ ...goal, quests: newQuests });
    setIsQuestModalOpen(false);
    setEditingQuest(null);
  };

  const handleDeleteQuest = (questId) => {
    if (!goal) return;
    const newQuests = (goal.quests || []).filter(q => q.id !== questId);
    const cleanedQuests = newQuests.map(q => {
      if (q.prerequisiteId === questId) {
        return { ...q, prerequisiteId: '', status: 'available' };
      }
      return q;
    });
    
    updateGoal({ ...goal, quests: cleanedQuests });
  };

  const handleCompleteQuest = (questId) => {
    if (!goal) return;
    const completedQuest = (goal.quests || []).find(q => q.id === questId);
    if (!completedQuest) return;

    completeQuest(questId, completedQuest.xpReward, completedQuest.coinReward, completedQuest.skillId, goal.id);
  };

  const openEditModal = (quest) => {
    setEditingQuest(quest);
    setIsQuestModalOpen(true);
  };

  const openCreateModal = () => {
    setEditingQuest(null);
    setIsQuestModalOpen(true);
  };

  if (!goal) {
    return (
      <div className={`container ${styles.page}`}>
        <p>Curriculum not found. <Link to="/goals">Return to Goals</Link></p>
      </div>
    );
  }

  const quests = goal.quests || [];
  const totalQuests = quests.length;
  const completedQuests = quests.filter(q => q.status === 'completed').length;
  const progress = totalQuests === 0 ? 0 : Math.round((completedQuests / totalQuests) * 100);

  const isActive = activeGoalId === goal.id;
  const goalLevel = goal.level || 1;
  const goalXp = goal.xp || 0;
  const goalReqXp = getRequiredXp(goalLevel);
  const goalCoins = goal.coins || 0;
  const goalStreak = goal.streak || 1;

  const bossRemainingHp = goal.boss ? Math.max(goal.boss.maxHp - completedQuests, 0) : 0;
  const bossProgress = goal.boss ? Math.round(((goal.boss.maxHp - bossRemainingHp) / goal.boss.maxHp) * 100) : 0;

  return (
    <div className={`container ${styles.page}`}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <Link to="/goals" className={styles.backLink}>
          <RiArrowLeftLine /> Back to Goals
        </Link>
        <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
          {isActive ? (
            <Badge variant="epic" style={{ padding: '6px 14px', fontSize: '0.85rem' }}>
              🌟 Current Active Learning Environment
            </Badge>
          ) : (
            <Button
              variant="primary"
              size="small"
              onClick={() => switchActiveGoal(goal.id)}
              style={{
                background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                fontWeight: 700
              }}
            >
              ⚡ Set as Active Environment
            </Button>
          )}
          <Button
            variant="ghost"
            size="small"
            onClick={() => {
              if (window.confirm(`Are you sure you want to delete preset "${goal.title}"? This cannot be undone.`)) {
                deleteGoal(goal.id);
                navigate('/goals');
              }
            }}
            style={{ color: '#ef4444' }}
            title="Delete this preset"
          >
            <RiDeleteBinLine /> Delete Preset
          </Button>
        </div>
      </div>
      
      <div className={styles.header}>
        <div className={styles.titleArea}>
          <h1 className={styles.title}>{goal.title}</h1>
          <p className={styles.description}>{goal.description}</p>
          <div className={styles.meta} style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
            <Badge variant="primary">Lvl {goalLevel}</Badge>
            <Badge variant={goal.difficulty}>{goal.difficulty}</Badge>
            {goal.category && <Badge variant="neutral">{goal.category}</Badge>}
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <RiCoinsFill style={{ color: '#eab308' }} /> {goalCoins} Coins
            </span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <RiFireFill style={{ color: '#f97316' }} /> {goalStreak} Day Streak
            </span>
          </div>
        </div>
      </div>


      <div className={styles.progressSection}>
        <div className={styles.progressStats}>
          <span>Syllabus Quest Progress</span>
          <span>{completedQuests} / {totalQuests} Quests ({progress}%)</span>
        </div>
        <ProgressBar progress={progress} variant="xp" size="large" />
      </div>

      {/* Campaign Boss Milestone Card */}
      {goal.boss && (
        <div className={styles.bossCard}>
          <div className={styles.bossCardIcon}><RiSwordFill /></div>
          <div className={styles.bossCardContent}>
            <div className={styles.bossCardTop}>
              <Badge variant={bossRemainingHp === 0 ? "healthy" : "epic"}>
                {bossRemainingHp === 0 ? "Campaign Boss Vanquished 🏆" : "Campaign Boss Battle ⚔️"}
              </Badge>
              <span className={styles.bossHpNum}>{bossRemainingHp} / {goal.boss.maxHp} HP</span>
            </div>
            <h3 className={styles.bossCardName}>{goal.boss.name}</h3>
            <p className={styles.bossCardDesc}>{goal.boss.description}</p>
            <ProgressBar
              progress={bossProgress}
              variant={bossRemainingHp <= 2 ? "danger" : "xp"}
              size="medium"
            />
          </div>
        </div>
      )}

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
              onOpenChallenge={(q) => setActiveChallengeQuest(q)}
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

      {/* Interactive Quest Challenge & Problem Runner Modal */}
      <QuestChallengeModal
        isOpen={!!activeChallengeQuest}
        onClose={() => setActiveChallengeQuest(null)}
        quest={activeChallengeQuest}
        onCompleteQuest={(questId) => {
          handleCompleteQuest(questId);
          setActiveChallengeQuest(null);
        }}
      />
    </div>
  );
};

export default GoalDetailPage;
