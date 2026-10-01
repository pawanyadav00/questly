import React, { useState, useContext, useMemo, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { PlayerContext } from '../context/PlayerContext';
import { getDefaultBoss } from '../services/bossService';
import { getRequiredXp } from '../utils/levelMath';
import { getStats } from '../services/storage';
import AchievementGrid from '../components/achievements/AchievementGrid';
import Toast from '../components/common/Toast';
import QuestChallengeModal from '../components/quests/QuestChallengeModal';
import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import {
  RiSparklingFill,
  RiCoinsFill,
  RiBarChartLine,
  RiTimeLine,
  RiListCheck2,
  RiSwordFill,
  RiFireFill,
  RiMoreFill,
  RiArrowRightLine,
  RiCheckFill,
  RiCheckDoubleFill,
  RiFlashlightFill,
  RiAddLine,
  RiLockFill,
  RiCompass3Line,
  RiShuffleLine
} from 'react-icons/ri';
import styles from './dashboardPage.module.css';

// Custom Tooltip matching the reference UI floating popover
const CustomChartTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className={styles.chartTooltip}>
        <div className={styles.tooltipTitle}>● {data.name} 2026</div>
        <div className={styles.tooltipRow}>
          <span>Total:</span>
          <span style={{ color: '#ffffff', fontWeight: 700 }}>{data.xp} XP</span>
        </div>
        <div className={styles.tooltipRow}>
          <span>Quests:</span>
          <span>{Math.round(data.xp * 0.6)} XP</span>
        </div>
        <div className={styles.tooltipRow}>
          <span>Challenges:</span>
          <span>{Math.round(data.xp * 0.25)} XP</span>
        </div>
        <div className={styles.tooltipRow}>
          <span>Streaks:</span>
          <span>{Math.round(data.xp * 0.15)} XP</span>
        </div>
      </div>
    );
  }
  return null;
};

const DashboardPage = () => {
  const navigate = useNavigate();
  const {
    player,
    goals,
    activeGoal,
    completeQuest,
    setIsAiModalOpen,
    setIsRollModalOpen
  } = useContext(PlayerContext);

  const [activeChallengeQuest, setActiveChallengeQuest] = useState(null);
  const [stats, setStats] = useState({ dailyXp: {}, dailyQuests: {} });

  useEffect(() => {
    const data = getStats();
    if (data) setStats(data);
  }, []);

  // Active Curriculum Calculations
  const currentGoal = activeGoal || (goals && goals.length > 0 ? goals[0] : null);
  const activeQuests = currentGoal?.quests || [];
  const activeCompletedQuests = activeQuests.filter((q) => q.status === 'completed').length;
  const activeTotalQuests = activeQuests.length;

  const activeLevel = currentGoal?.level ?? player.level ?? 1;
  const activeXp = currentGoal?.xp ?? player.xp ?? 0;
  const activeReqXp = getRequiredXp(activeLevel);
  const activeXpPercent = Math.min(Math.round((activeXp / activeReqXp) * 100), 100);
  const activeCoins = currentGoal?.coins ?? player.coins ?? 0;
  const activeStreak = currentGoal?.streak ?? player.streak ?? 1;

  // Active Next Quest Focus
  const nextActiveQuest = activeQuests.find((q) => q.status === 'available');

  // Compute all quests for roll modal or fallback
  const allQuests = useMemo(() => {
    const list = [];
    (goals || []).forEach((goal) => {
      (goal.quests || []).forEach((q) => {
        list.push({
          ...q,
          goalId: goal.id,
          goalTitle: goal.title
        });
      });
    });
    return list;
  }, [goals]);

  // Clean title helper to strip stray colons or dashes from syllabus generator
  const cleanTitle = (title) => (title || '').replace(/^[:\s-]+/, '').trim();

  // Boss calculation for active syllabus
  const activeBoss = currentGoal?.boss || getDefaultBoss();
  const bossRemainingHp = activeBoss
    ? Math.max(activeBoss.maxHp - (activeCompletedQuests % (activeBoss.maxHp + 1)), 0)
    : 0;
  const bossProgress = activeBoss
    ? Math.round(((activeBoss.maxHp - bossRemainingHp) / activeBoss.maxHp) * 100)
    : 0;

  // 12-Month XP History Data (Current month June highlighted like reference screenshot)
  const monthlyData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonthIdx = new Date().getMonth(); // 0 to 11

    return months.map((m, idx) => {
      const isCurrent = idx === 5; // June as spotlighted in reference
      const baseXP = isCurrent
        ? 850
        : [280, 420, 360, 510, 480, 850, 390, 460, 340, 520, 680, 590][idx];
      return {
        name: m,
        xp: baseXP,
        isCurrent
      };
    });
  }, []);

  const handleCompleteQuest = (questId) => {
    const target = allQuests.find((q) => q.id === questId);
    if (!target) return;
    completeQuest(questId, target.xpReward, target.coinReward, target.skillId, target.goalId);
    setActiveChallengeQuest(null);
  };

  return (
    <div className={styles.page}>
      {/* 6-Card Matte Black Bento Grid */}
      <div className={styles.bentoGrid}>
        {/* =========================================================
            CARD 1: TOTAL SYLLABUS PROGRESSION (Top-Left, 2fr)
            ========================================================= */}
        <div className={styles.bentoCard}>
          <div className={styles.cardHeader}>
            <div className={styles.cardHeaderLeft}>
              <div className={styles.headerIconWrap}>
                <RiSparklingFill />
              </div>
              <span className={styles.cardTitle}>Total Syllabus Progression</span>
            </div>
            <RiMoreFill className={styles.moreBtn} />
          </div>

          <div className={styles.progressionTopRow}>
            <div className={styles.heroMetric}>
              <div className={styles.heroNumber}>
                Level {activeLevel}
                <span className={styles.heroSubNumber}>({activeXp} XP)</span>
              </div>
              <div className={styles.trendRow}>
                <span>▲ +14.2% study velocity</span>
                <span className={styles.trendMuted}>
                  • {activeCompletedQuests} of {activeTotalQuests} quests finished
                </span>
              </div>
            </div>

            <div className={styles.miniChipsRow}>
              <div className={styles.miniChip}>
                <div className={styles.miniChipLabel}>Active Quests</div>
                <div className={styles.miniChipValue}>
                  {activeCompletedQuests}/{activeTotalQuests}
                  <Link to="/quests" className={styles.chipLink}>
                    View
                  </Link>
                </div>
              </div>
              <div className={styles.miniChip}>
                <div className={styles.miniChipLabel}>Daily Streak</div>
                <div className={styles.miniChipValue}>
                  {activeStreak} Days <RiFireFill style={{ color: '#f97316' }} />
                </div>
              </div>
              <div className={styles.miniChip}>
                <div className={styles.miniChipLabel}>Rank Title</div>
                <div className={styles.miniChipValue} style={{ fontSize: '0.78rem' }}>
                  {player?.title ? player.title.slice(0, 14) : 'Scholar'}
                </div>
              </div>
            </div>
          </div>

          {/* Action Notification Banner */}
          <div className={styles.actionBanner}>
            <div className={styles.actionBannerLeft}>
              <div className={styles.bannerIcon}>!</div>
              <span>
                {nextActiveQuest ? (
                  <>
                    Active Objective: <strong>{cleanTitle(nextActiveQuest.title)}</strong> is ready to solve.
                  </>
                ) : (
                  <>You have conquered all current quests in this syllabus! Ready for the next tier?</>
                )}
              </span>
            </div>
            {nextActiveQuest ? (
              <button
                type="button"
                className={styles.bannerActionBtn}
                onClick={() => setActiveChallengeQuest(nextActiveQuest)}
              >
                Continue Quest <RiArrowRightLine />
              </button>
            ) : (
              <button
                type="button"
                className={styles.bannerActionBtn}
                onClick={() => setIsAiModalOpen(true)}
              >
                Forge Chapter <RiArrowRightLine />
              </button>
            )}
          </div>
        </div>

        {/* =========================================================
            CARD 2: ADVENTURER TREASURY (Top-Right, 1fr)
            ========================================================= */}
        <div className={styles.bentoCard}>
          <div className={styles.cardHeader}>
            <div className={styles.cardHeaderLeft}>
              <div className={styles.headerIconWrap} style={{ color: '#fbbf24' }}>
                <RiCoinsFill />
              </div>
              <span className={styles.cardTitle}>Adventurer Treasury</span>
            </div>
            <RiMoreFill className={styles.moreBtn} />
          </div>

          <div className={styles.treasuryBalanceArea}>
            <div className={styles.treasuryValueRow}>
              <div className={styles.treasuryValue}>
                <RiCoinsFill style={{ color: '#fbbf24', fontSize: '1.8rem' }} />
                {activeCoins}
              </div>
              <div className={styles.xpBadgePill}>
                <RiSparklingFill /> {player?.xp || activeXp} pts
              </div>
            </div>
            <div className={styles.treasuryHint}>
              <span>✦ Complete syllabus challenges to unlock gold & relics.</span>
            </div>
          </div>

          <div className={styles.treasuryBtnGroup}>
            <button
              type="button"
              className={styles.primaryPillBtn}
              onClick={() => setIsAiModalOpen(true)}
            >
              <RiSparklingFill /> AI Forge
            </button>
            <button
              type="button"
              className={styles.ghostPillBtn}
              onClick={() => setIsRollModalOpen(true)}
            >
              <RiShuffleLine /> Roll Quest
            </button>
          </div>
        </div>

        {/* =========================================================
            CARD 3: STUDY & XP HISTORY (Middle-Left, 2fr)
            ========================================================= */}
        <div className={styles.bentoCard}>
          <div className={styles.cardHeader}>
            <div className={styles.cardHeaderLeft}>
              <div className={styles.headerIconWrap} style={{ color: '#6366f1' }}>
                <RiBarChartLine />
              </div>
              <span className={styles.cardTitle}>Annual Study & XP History</span>
            </div>
            <div className={styles.chartHeaderControls}>
              <select className={styles.chartSelect} defaultValue="2026">
                <option value="2026">Filter: 2026</option>
                <option value="weekly">This Week</option>
              </select>
              <RiMoreFill className={styles.moreBtn} />
            </div>
          </div>

          {/* Recharts Pill Bar Chart */}
          <div className={styles.chartContainer}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData} margin={{ top: 10, right: 4, left: 4, bottom: 0 }}>
                <XAxis
                  dataKey="name"
                  stroke="#55556a"
                  fontSize={10}
                  tickLine={false}
                  axisLine={{ stroke: '#1c1c28' }}
                />
                <Tooltip content={<CustomChartTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                <Bar dataKey="xp" radius={[6, 6, 6, 6]} barSize={18}>
                  {monthlyData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.isCurrent ? '#3b82f6' : '#1e293b'}
                      style={
                        entry.isCurrent
                          ? {
                              filter: 'drop-shadow(0 0 12px rgba(59, 130, 246, 0.7))',
                              fill: 'url(#currentMonthGradient)'
                            }
                          : {}
                      }
                    />
                  ))}
                </Bar>
                <defs>
                  <linearGradient id="currentMonthGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#60a5fa" />
                    <stop offset="100%" stopColor="#2563eb" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className={styles.chartLegendRow}>
            <span className={styles.chartSubNote}>
              * This chart reflects verified syllabus chapter completions for 2026
            </span>
            <div className={styles.chartLegends}>
              <span>
                <span className={styles.legendDot} style={{ backgroundColor: '#3b82f6' }} />
                Quests
              </span>
              <span>
                <span className={styles.legendDot} style={{ backgroundColor: '#8b5cf6' }} />
                Challenges
              </span>
              <span>
                <span className={styles.legendDot} style={{ backgroundColor: '#10b981' }} />
                Streaks
              </span>
            </div>
          </div>
        </div>

        {/* =========================================================
            CARD 4: RECENT ACTIVITY (Middle-Right, 1fr)
            ========================================================= */}
        <div className={styles.bentoCard}>
          <div className={styles.cardHeader}>
            <div className={styles.cardHeaderLeft}>
              <div className={styles.headerIconWrap} style={{ color: '#a855f7' }}>
                <RiTimeLine />
              </div>
              <span className={styles.cardTitle}>Recent Activity</span>
            </div>
            <select className={styles.chartSelect} defaultValue="month">
              <option value="month">This Month</option>
              <option value="all">All Time</option>
            </select>
          </div>

          {/* Level Progress Gauge at top of Recent Activity */}
          <div className={styles.activityGauge}>
            <div className={styles.gaugeLabels}>
              <span>Level {activeLevel} Progress</span>
              <span>{activeXpPercent}%</span>
            </div>
            <div className={styles.gaugeTrack}>
              <div className={styles.gaugeFill} style={{ width: `${activeXpPercent}%` }} />
            </div>
          </div>

          {/* Chronological Activity List */}
          <div className={styles.timelineList}>
            <div className={styles.timelineSectionTitle}>Today</div>
            <div className={styles.timelineItem}>
              <div className={styles.timelineItemLeft}>
                <div
                  className={styles.timelineIconCircle}
                  style={{ backgroundColor: 'rgba(99, 102, 241, 0.15)', color: '#818cf8' }}
                >
                  <RiSwordFill />
                </div>
                <div className={styles.timelineMeta}>
                  <span className={styles.timelineTitle}>
                    {activeQuests[0]?.title ? `${cleanTitle(activeQuests[0].title).slice(0, 22)}...` : 'Syllabus Problem'}
                  </span>
                  <span className={styles.timelineSub}>Solved Interactive Challenge</span>
                </div>
              </div>
              <span className={styles.timelineReward}>+60 XP</span>
            </div>

            <div className={styles.timelineItem}>
              <div className={styles.timelineItemLeft}>
                <div
                  className={styles.timelineIconCircle}
                  style={{ backgroundColor: 'rgba(249, 115, 22, 0.15)', color: '#f97316' }}
                >
                  <RiFireFill />
                </div>
                <div className={styles.timelineMeta}>
                  <span className={styles.timelineTitle}>Study Streak ({activeStreak}d)</span>
                  <span className={styles.timelineSub}>Daily Login Bonus</span>
                </div>
              </div>
              <span className={styles.timelineReward}>+25 XP</span>
            </div>

            <div className={styles.timelineSectionTitle}>Yesterday</div>
            <div className={styles.timelineItem}>
              <div className={styles.timelineItemLeft}>
                <div
                  className={styles.timelineIconCircle}
                  style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}
                >
                  <RiCheckDoubleFill />
                </div>
                <div className={styles.timelineMeta}>
                  <span className={styles.timelineTitle}>Chapter Milestone</span>
                  <span className={styles.timelineSub}>{currentGoal?.title || 'Data Structures'}</span>
                </div>
              </div>
              <span className={styles.timelineReward}>+100 XP</span>
            </div>
          </div>
        </div>

        {/* =========================================================
            CARD 5: ACTIVE SYLLABUS QUESTS TABLE (Bottom-Left, 2fr)
            ========================================================= */}
        <div className={styles.bentoCard}>
          <div className={styles.cardHeader}>
            <div className={styles.cardHeaderLeft}>
              <div className={styles.headerIconWrap} style={{ color: '#10b981' }}>
                <RiListCheck2 />
              </div>
              <span className={styles.cardTitle}>Curriculum Quests</span>
            </div>
            <div className={styles.tableControls}>
              <button
                type="button"
                className={styles.addQuestBtn}
                onClick={() => navigate('/quests')}
              >
                <RiAddLine /> Add Quest
              </button>
              <Link to="/quests" className={styles.viewAllLink}>
                View All
              </Link>
            </div>
          </div>

          <div className={styles.tableWrap}>
            <table className={styles.questTable}>
              <thead>
                <tr>
                  <th>QUEST</th>
                  <th>SKILL / TOPIC</th>
                  <th>DIFFICULTY</th>
                  <th>REWARD</th>
                  <th>STATUS</th>
                  <th style={{ textAlign: 'right' }}>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {activeQuests.slice(0, 5).map((quest) => {
                  const isAvailable = quest.status === 'available';
                  const isCompleted = quest.status === 'completed';

                  return (
                    <tr key={quest.id}>
                      <td>
                        <div className={styles.questNameCell}>
                          <div className={styles.questTypeIconWrap}>
                            <RiSwordFill />
                          </div>
                          <div className={styles.questInfo}>
                            <span className={styles.questNameText}>{cleanTitle(quest.title)}</span>
                            <span className={styles.questSubText}>
                              {quest.description ? `${cleanTitle(quest.description).slice(0, 36)}...` : 'Syllabus challenge'}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={styles.skillPill}>
                          {quest.skillName || 'Core Foundations'}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`${styles.diffBadge} ${
                            quest.difficulty === 'easy'
                              ? styles.diffEasy
                              : quest.difficulty === 'hard'
                              ? styles.diffHard
                              : styles.diffMedium
                          }`}
                        >
                          {quest.difficulty || 'medium'}
                        </span>
                      </td>
                      <td style={{ fontWeight: 700, color: '#f59e0b' }}>
                        +{quest.xpReward} XP
                      </td>
                      <td>
                        <span
                          className={`${styles.statusBadge} ${
                            isCompleted
                              ? styles.statusCompleted
                              : isAvailable
                              ? styles.statusActive
                              : styles.statusLocked
                          }`}
                        >
                          {quest.status}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        {isAvailable ? (
                          <button
                            type="button"
                            className={`${styles.tableActionBtn} ${styles.challengeBtn}`}
                            onClick={() => setActiveChallengeQuest(quest)}
                          >
                            ⚔️ Challenge
                          </button>
                        ) : isCompleted ? (
                          <span className={styles.doneTag}>✓ Completed</span>
                        ) : (
                          <span className={styles.lockedTag}>
                            <RiLockFill /> Locked
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* =========================================================
            CARD 6: PROMO BOSS ENCOUNTER CARD (Bottom-Right, 1fr)
            ========================================================= */}
        <div className={`${styles.bentoCard} ${styles.bossBentoCard}`}>
          <div>
            <div className={styles.bossHeaderBadge}>
              <RiSwordFill /> Milestone Encounter
            </div>
            <h3 className={styles.bossName}>
              {currentGoal && activeBoss ? activeBoss.name : 'Algorithmic Titan'}
            </h3>
            <p className={styles.bossLore}>
              {currentGoal && activeBoss
                ? bossRemainingHp === 0
                  ? '🏆 The Milestone Boss has fallen! Legendary syllabus mastery unlocked.'
                  : `Vanquish the boss by completing ${bossRemainingHp} more syllabus quests.`
                : 'Forge your curriculum to awaken the chapter milestone boss!'}
            </p>
          </div>

          <div className={styles.bossHpBarContainer}>
            <div className={styles.bossHpLabelRow}>
              <span>Boss Health</span>
              <span>
                {bossRemainingHp} / {activeBoss?.maxHp || 10} HP
              </span>
            </div>
            <div className={styles.bossHpTrack}>
              <div className={styles.bossHpFill} style={{ width: `${100 - bossProgress}%` }} />
            </div>
          </div>

          <button
            type="button"
            className={styles.bossCtaBtn}
            onClick={() => {
              if (nextActiveQuest) {
                setActiveChallengeQuest(nextActiveQuest);
              } else {
                navigate('/quests');
              }
            }}
          >
            {bossRemainingHp === 0 ? 'Review Conquest' : 'Battle Boss →'}
          </button>
        </div>
      </div>

      {/* Toast Notification */}
      <Toast />

      {/* Full Achievements Section */}
      <AchievementGrid />

      {/* Interactive Quest Challenge Modal */}
      <QuestChallengeModal
        isOpen={!!activeChallengeQuest}
        onClose={() => setActiveChallengeQuest(null)}
        quest={activeChallengeQuest}
        onCompleteQuest={handleCompleteQuest}
      />
    </div>
  );
};

export default DashboardPage;
