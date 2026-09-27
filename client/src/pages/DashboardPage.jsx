import { useState, useContext, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import ProgressBar from '../components/common/ProgressBar';
import { PlayerContext } from '../context/PlayerContext';
import { getStats, getGoals, saveGoals } from '../services/storage';
import { getDefaultBoss } from '../services/bossService';
import { getRequiredXp } from '../utils/levelMath';
import AchievementGrid from '../components/achievements/AchievementGrid';
import Toast from '../components/common/Toast';
import RollQuestModal from '../components/quests/RollQuestModal';
import AISyllabusModal from '../components/goals/AISyllabusModal';
import QuestChallengeModal from '../components/quests/QuestChallengeModal';
import { RiGamepadLine, RiFireFill, RiCoinsFill, RiShuffleLine, RiCheckLine, RiSwordFill, RiSparklingFill } from 'react-icons/ri';
import styles from './dashboardPage.module.css';

const DashboardPage = () => {
  const navigate = useNavigate();
  const {
    player,
    goals,
    setGoals,
    activeGoalId,
    activeGoal,
    switchActiveGoal,
    addGoal,
    completeQuest
  } = useContext(PlayerContext);

  const [isRollModalOpen, setIsRollModalOpen] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [activeChallengeQuest, setActiveChallengeQuest] = useState(null);

  // Active Syllabus Calculations: Everything adapts strictly to the syllabus
  const currentGoal = activeGoal || (goals && goals.length > 0 ? goals[0] : null);
  const activeQuests = currentGoal?.quests || [];
  const activeCompletedQuests = activeQuests.filter(q => q.status === 'completed').length;
  const activeTotalQuests = activeQuests.length;

  const activeLevel = currentGoal?.level ?? 1;
  const activeXp = currentGoal?.xp ?? 0;
  const activeReqXp = getRequiredXp(activeLevel);
  const activeXpPercent = Math.min(Math.round((activeXp / activeReqXp) * 100), 100);
  const activeCoins = currentGoal?.coins ?? 0;
  const activeStreak = currentGoal?.streak ?? 1;


  // Active Next Quest Focus
  const nextActiveQuest = activeQuests.find(q => q.status === 'available');

  // Compute all quests for roll modal
  const allQuests = useMemo(() => {
    const list = [];
    goals.forEach(goal => {
      (goal.quests || []).forEach(q => {
        list.push({
          ...q,
          goalId: goal.id,
          goalTitle: goal.title
        });
      });
    });
    return list;
  }, [goals]);

  // Boss calculation for active syllabus
  const activeBoss = currentGoal?.boss || getDefaultBoss();
  const bossRemainingHp = activeBoss ? Math.max(activeBoss.maxHp - (activeCompletedQuests % (activeBoss.maxHp + 1)), 0) : 0;
  const bossProgress = activeBoss ? Math.round(((activeBoss.maxHp - bossRemainingHp) / activeBoss.maxHp) * 100) : 0;

  const handleCompleteFromRoll = (goalId, questId) => {
    const targetQuest = allQuests.find(q => q.id === questId);
    if (!targetQuest) return;

    completeQuest(questId, targetQuest.xpReward, targetQuest.coinReward, targetQuest.skillId, goalId);
  };

  return (
    <div className={`container ${styles.page}`}>
      <div className={styles.headerRow}>
        <div>
          <h1 className={styles.title}>Welcome back, {player.name}!</h1>
          <p className={styles.playerTitleTag}>
            Title: <span>{player.title || 'Novice Adventurer'}</span>
          </p>
        </div>
        <div className={styles.headerActions}>
          <Button
            variant="primary"
            onClick={() => setIsAiModalOpen(true)}
            style={{
              background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
              fontWeight: 700,
              boxShadow: '0 4px 15px rgba(99, 102, 241, 0.35)'
            }}
          >
            <RiSparklingFill /> ⚡ AI Forge
          </Button>
          <Button
            variant="ghost"
            onClick={() => setIsRollModalOpen(true)}
          >
            <RiShuffleLine /> Roll a Quest
          </Button>
        </div>
      </div>

      {/* Stats Overview according to active syllabus */}
      <div className={styles.statsGrid}>
        <Card className={styles.statCard}>
          <h3>Level</h3>
          <Badge variant="primary">Lvl {activeLevel}</Badge>
          <span className={styles.statSub}>{currentGoal?.title ? `${currentGoal.title.slice(0, 22)}...` : 'No Active Syllabus'}</span>
        </Card>
        <Card className={styles.statCard}>
          <h3>XP Progress</h3>
          <p>{activeXp} / {activeReqXp} XP</p>
          <div className={styles.miniXpBar}>
            <div
              className={styles.miniXpFill}
              style={{ width: `${activeXpPercent}%` }}
            />
          </div>
        </Card>
        <Card className={styles.statCard}>
          <h3>Coins</h3>
          <p className={styles.coinValue}><RiCoinsFill className={styles.coinIcon} /> {activeCoins}</p>
        </Card>
        <Card className={styles.statCard}>
          <h3>Quests Done</h3>
          <p>{activeCompletedQuests} completed</p>
          <span className={styles.statSub}>{activeTotalQuests} total in syllabus</span>
        </Card>
        <Card className={styles.statCard}>
          <h3>Streak 🔥</h3>
          <p>{activeStreak} {activeStreak === 1 ? 'day' : 'days'}</p>
        </Card>
      </div>

      {/* Spotlight Row: Active Focus & Boss Battle */}
      <div className={styles.spotlightRow}>
        {/* Active Quest Focus Widget */}
        <Card className={styles.activeFocusWidget}>
          <div className={styles.widgetHeader}>
            <div className={styles.widgetIconWrap}>
              <RiGamepadLine />
            </div>
            <div>
              <div className={styles.badgeRow}>
                <Badge variant={!currentGoal ? 'neutral' : (nextActiveQuest ? 'healthy' : 'warning')}>
                  {!currentGoal ? 'No Syllabus Active' : (nextActiveQuest ? 'Ready in Current Syllabus' : 'All Quests Completed')}
                </Badge>
              </div>
              <h3 className={styles.widgetTitle}>Next Quest Focus</h3>
            </div>
          </div>
          {!currentGoal ? (
            <>
              <p className={styles.widgetDesc}>
                No active syllabus yet. Upload or paste your curriculum and problem set to automatically generate your quest chain!
              </p>
              <div className={styles.widgetFooter}>
                <Button
                  variant="primary"
                  size="small"
                  onClick={() => setIsAiModalOpen(true)}
                  style={{
                    background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                    fontWeight: 700
                  }}
                >
                  <RiSparklingFill /> ⚡ Forge Your Syllabus
                </Button>
              </div>
            </>
          ) : (nextActiveQuest || allQuests.find(q => q.status === 'available')) ? (
            (() => {
              const targetQ = nextActiveQuest || allQuests.find(q => q.status === 'available');
              return (
                <>
                  <p className={styles.widgetDesc}>
                    Current objective: <strong>{targetQ.title}</strong>
                    <br />
                    <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>
                      Curriculum: {targetQ.goalTitle || currentGoal?.title}
                    </span>
                  </p>
                  <div className={styles.widgetFooter}>
                    <div className={styles.rewardsPreview}>
                      <span className={styles.rewardXp}>
                        <RiFireFill /> +{targetQ.xpReward} XP
                      </span>
                      <span className={styles.rewardCoins}>
                        <RiCoinsFill /> +{targetQ.coinReward} Coins
                      </span>
                    </div>
                    <Button
                      variant="primary"
                      size="small"
                      onClick={() => setActiveChallengeQuest(targetQ)}
                      style={{
                        background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                        fontWeight: 700
                      }}
                    >
                      <RiSwordFill /> ⚔️ Solve Challenge
                    </Button>
                  </div>
                </>
              );
            })()
          ) : (
            <>
              <p className={styles.widgetDesc}>
                You have completed all current quests in this syllabus!
              </p>
              <div className={styles.widgetFooter}>
                <Button variant="primary" size="small" onClick={() => setIsAiModalOpen(true)}>
                  Forge Next Chapter
                </Button>
              </div>
            </>
          )}
        </Card>

        {/* Boss Battle Tracker for Active Syllabus */}
        <Card className={styles.bossWidget}>
          <div className={styles.widgetHeader}>
            <div className={`${styles.widgetIconWrap} ${styles.bossIconWrap}`}>
              <RiSwordFill />
            </div>
            <div>
              <Badge variant="epic">Campaign Boss</Badge>
              <h3 className={styles.widgetTitle}>{currentGoal && activeBoss ? activeBoss.name : 'Curriculum Boss'}</h3>
            </div>
          </div>
          <p className={styles.widgetDesc}>
            {currentGoal && activeBoss
              ? (bossRemainingHp === 0
                ? '🏆 The Milestone Boss is vanquished! Your syllabus mastery is supreme.'
                : `Complete ${bossRemainingHp} more quests in this syllabus to defeat the boss!`)
              : 'Upload or forge your syllabus to awaken the curriculum milestone boss!'}
          </p>
          {currentGoal && activeBoss && (
            <div className={styles.bossHpSection}>
              <div className={styles.hpLabelRow}>
                <span>Boss HP</span>
                <span>{bossRemainingHp} / {activeBoss.maxHp} HP</span>
              </div>
              <ProgressBar
                progress={bossProgress}
                variant={bossRemainingHp <= 1 ? 'danger' : 'xp'}
                size="medium"
              />
            </div>
          )}
        </Card>
      </div>

      {/* Toast notification for newly unlocked achievement */}
      <Toast />

      {/* Achievements grid */}
      <AchievementGrid />


      {/* Roll Quest Modal */}
      <RollQuestModal
        isOpen={isRollModalOpen}
        onClose={() => setIsRollModalOpen(false)}
        quests={allQuests}
        onCompleteQuest={handleCompleteFromRoll}
        onNavigateToGoal={(goalId) => navigate(`/goals/${goalId}`)}
      />

      {/* AI Syllabus Generator Modal */}
      <AISyllabusModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        onCampaignDeployed={(newGoal) => {
          addGoal(newGoal);
        }}
      />

      {/* Interactive Quest Challenge Modal */}
      <QuestChallengeModal
        isOpen={!!activeChallengeQuest}
        onClose={() => setActiveChallengeQuest(null)}
        quest={activeChallengeQuest}
        onCompleteQuest={(questId) => {
          const q = allQuests.find(item => item.id === questId);
          if (q) handleCompleteFromRoll(q.goalId, questId);
          setActiveChallengeQuest(null);
        }}
      />
    </div>
  );
};

export default DashboardPage;

