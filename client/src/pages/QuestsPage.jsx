import React, { useState, useEffect, useContext, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { getGoals, saveGoals } from '../services/storage';
import { PlayerContext } from '../context/PlayerContext';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import QuestCard from '../components/quests/QuestCard';
import RollQuestModal from '../components/quests/RollQuestModal';
import Modal from '../components/common/Modal';
import QuestForm from '../components/quests/QuestForm';
import QuestChallengeModal from '../components/quests/QuestChallengeModal';
import { RiSearchLine, RiShuffleLine, RiAddLine, RiCheckDoubleLine, RiLockLine, RiSparklingLine } from 'react-icons/ri';
import styles from './questsPage.module.css';

const QuestsPage = () => {
  const navigate = useNavigate();
  const {
    goals,
    updateGoal,
    activeGoalId,
    activeGoal,
    switchActiveGoal,
    completeQuest
  } = useContext(PlayerContext);

  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedGoalId, setSelectedGoalId] = useState(activeGoalId || 'all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isRollModalOpen, setIsRollModalOpen] = useState(false);
  const [editingQuest, setEditingQuest] = useState(null);
  const [editingGoalId, setEditingGoalId] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [activeChallengeQuest, setActiveChallengeQuest] = useState(null);

  // Sync selected goal with active goal whenever activeGoalId switches
  useEffect(() => {
    if (activeGoalId) {
      setSelectedGoalId(activeGoalId);
    }
  }, [activeGoalId]);

  // Flatten all quests with metadata
  const allQuests = useMemo(() => {
    const list = [];
    goals.forEach(goal => {
      (goal.quests || []).forEach(q => {
        list.push({
          ...q,
          goalId: goal.id,
          goalTitle: goal.title,
          goalCategory: goal.category
        });
      });
    });
    return list;
  }, [goals]);

  // Filtered quests
  const filteredQuests = useMemo(() => {
    return allQuests.filter(q => {
      // Filter by syllabus goal
      if (selectedGoalId !== 'all' && q.goalId !== selectedGoalId) return false;

      // Filter status
      if (activeFilter === 'available' && q.status !== 'available') return false;
      if (activeFilter === 'completed' && q.status !== 'completed') return false;
      if (activeFilter === 'locked' && q.status !== 'locked') return false;

      // Filter query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = q.title?.toLowerCase().includes(query);
        const matchesDesc = q.description?.toLowerCase().includes(query);
        const matchesGoal = q.goalTitle?.toLowerCase().includes(query);
        if (!matchesTitle && !matchesDesc && !matchesGoal) return false;
      }
      return true;
    });
  }, [allQuests, selectedGoalId, activeFilter, searchQuery]);

  const handleCompleteQuest = (questId) => {
    const targetQuest = allQuests.find(q => q.id === questId);
    if (!targetQuest) return;

    completeQuest(questId, targetQuest.xpReward, targetQuest.coinReward, targetQuest.skillId, targetQuest.goalId);
  };

  const handleDeleteQuest = (questId) => {
    const targetQuest = allQuests.find(q => q.id === questId);
    if (!targetQuest) return;

    const parentGoal = goals.find(g => g.id === targetQuest.goalId);
    if (!parentGoal) return;

    const remainingQuests = (parentGoal.quests || []).filter(q => q.id !== questId);
    const cleaned = remainingQuests.map(q => {
      if (q.prerequisiteId === questId) {
        return { ...q, prerequisiteId: '', status: 'available' };
      }
      return q;
    });

    updateGoal({ ...parentGoal, quests: cleaned });
  };

  const handleEditQuest = (quest) => {
    setEditingQuest(quest);
    setEditingGoalId(quest.goalId);
    setIsEditModalOpen(true);
  };

  const handleSaveQuest = (questData) => {
    const parentGoal = goals.find(g => g.id === editingGoalId);
    if (!parentGoal) return;

    const quests = parentGoal.quests || [];
    const updated = quests.map(q => q.id === questData.id ? questData : q);
    updateGoal({ ...parentGoal, quests: updated });
    setIsEditModalOpen(false);
    setEditingQuest(null);
  };

  const totalCompleted = allQuests.filter(q => q.status === 'completed').length;
  const totalAvailable = allQuests.filter(q => q.status === 'available').length;

  return (
    <div className={`container ${styles.page}`}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Quest Archive</h1>
          <p className={styles.subtitle}>
            Explore and conquer quests across all your goals ({allQuests.length} total)
          </p>
        </div>
        <div className={styles.topActions}>
          <Button
            variant="primary"
            onClick={() => setIsRollModalOpen(true)}
            disabled={totalAvailable === 0}
            className={styles.rollBtn}
          >
            <RiShuffleLine /> Roll Random Quest
          </Button>
          <Button variant="ghost" onClick={() => navigate('/goals')}>
            <RiAddLine /> Manage Goals
          </Button>
        </div>
      </div>

      {/* Syllabus Filter Selector */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
          Learning Environment:
        </span>
        <select
          style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-default)',
            color: 'var(--text-primary)',
            padding: '6px 12px',
            borderRadius: '8px',
            fontSize: '0.85rem',
            fontWeight: 600
          }}
          value={selectedGoalId}
          onChange={(e) => setSelectedGoalId(e.target.value)}
        >
          <option value="all">🌐 All Syllabi ({allQuests.length} Quests)</option>
          {goals.map(g => (
            <option key={g.id} value={g.id}>
              📚 {g.title} ({g.quests?.length || 0} Quests)
            </option>
          ))}
        </select>
      </div>

      <div className={styles.controlsRow}>
        <div className={styles.filterTabs}>
          <button
            className={`${styles.tabBtn} ${activeFilter === 'all' ? styles.activeTab : ''}`}
            onClick={() => setActiveFilter('all')}
          >
            All ({allQuests.length})
          </button>
          <button
            className={`${styles.tabBtn} ${activeFilter === 'available' ? styles.activeTab : ''}`}
            onClick={() => setActiveFilter('available')}
          >
            Available ({totalAvailable})
          </button>
          <button
            className={`${styles.tabBtn} ${activeFilter === 'completed' ? styles.activeTab : ''}`}
            onClick={() => setActiveFilter('completed')}
          >
            Completed ({totalCompleted})
          </button>
          <button
            className={`${styles.tabBtn} ${activeFilter === 'locked' ? styles.activeTab : ''}`}
            onClick={() => setActiveFilter('locked')}
          >
            Locked ({allQuests.filter(q => q.status === 'locked').length})
          </button>
        </div>

        <div className={styles.searchBox}>
          <RiSearchLine className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search quests or goals..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>
      </div>

      {filteredQuests.length === 0 ? (
        <Card className={styles.emptyCard}>
          <div className={styles.emptyIcon}>⚔️</div>
          <h3>No Quests Found</h3>
          <p className={styles.emptyText}>
            {searchQuery
              ? `No quests matching "${searchQuery}".`
              : activeFilter !== 'all'
              ? `No quests with status "${activeFilter}".`
              : "You haven't added any quests to your goals yet!"}
          </p>
          <Button variant="primary" onClick={() => navigate('/goals')} style={{ marginTop: '1rem' }}>
            Go to Goals
          </Button>
        </Card>
      ) : (
        <div className={styles.questsGrid}>
          {filteredQuests.map(quest => (
            <div key={quest.id} className={styles.questWrapper}>
              <div className={styles.parentGoalHeader}>
                <span className={styles.parentGoalName}>
                  Goal: <strong onClick={() => navigate(`/goals/${quest.goalId}`)} className={styles.goalLink}>{quest.goalTitle}</strong>
                </span>
                {quest.goalCategory && (
                  <Badge variant="neutral">{quest.goalCategory}</Badge>
                )}
              </div>
              <QuestCard
                quest={quest}
                onEdit={handleEditQuest}
                onDelete={handleDeleteQuest}
                onComplete={handleCompleteQuest}
                onOpenChallenge={(q) => setActiveChallengeQuest(q)}
              />
            </div>
          ))}
        </div>
      )}

      {/* Roll Quest Modal */}
      <RollQuestModal
        isOpen={isRollModalOpen}
        onClose={() => setIsRollModalOpen(false)}
        quests={allQuests}
        onCompleteQuest={(goalId, questId) => handleCompleteQuest(questId)}
        onNavigateToGoal={(goalId) => navigate(`/goals/${goalId}`)}
      />

      {/* Edit Quest Modal */}
      {isEditModalOpen && (
        <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
          <QuestForm
            goalId={editingGoalId}
            initialData={editingQuest}
            availableQuests={allQuests.filter(q => q.goalId === editingGoalId)}
            onSubmit={handleSaveQuest}
            onCancel={() => setIsEditModalOpen(false)}
          />
        </Modal>
      )}

      {/* Interactive Quest Challenge Modal */}
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

export default QuestsPage;
