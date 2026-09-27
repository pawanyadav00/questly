import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlayerContext } from '../../context/PlayerContext';
import Card from '../common/Card';
import Badge from '../common/Badge';
import Button from '../common/Button';
import ProgressBar from '../common/ProgressBar';
import QuestChallengeModal from '../quests/QuestChallengeModal';
import AISyllabusModal from '../goals/AISyllabusModal';
import { getRequiredXp } from '../../utils/levelMath';
import {
  RiSparklingFill,
  RiSwordFill,
  RiLockFill,
  RiCheckFill,
  RiFireFill,
  RiCoinsFill,
  RiArrowRightLine
} from 'react-icons/ri';
import styles from './skillTreePage.module.css';

const SkillTreePage = () => {
  const navigate = useNavigate();
  const {
    player,
    goals,
    setGoals,
    activeGoal,
    switchActiveGoal,
    completeQuest
  } = useContext(PlayerContext);

  const [selectedSkillId, setSelectedSkillId] = useState(null);
  const [activeChallengeQuest, setActiveChallengeQuest] = useState(null);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  const currentGoal = activeGoal || (goals && goals.length > 0 ? goals[0] : null);
  const skills = (currentGoal?.skills && currentGoal.skills.length > 0)
    ? currentGoal.skills
    : player.skills;

  const quests = currentGoal?.quests || [];
  const selectedSkill = skills.find(s => s.id === selectedSkillId) || skills[0] || null;
  const questsForSelectedSkill = quests.filter(q => q.skillId === (selectedSkill?.id));

  // Compute total skills mastery
  const totalSkillLevels = skills.reduce((sum, s) => sum + (s.level || 1), 0);
  const avgLevel = skills.length > 0 ? (totalSkillLevels / skills.length).toFixed(1) : 1;

  const handleQuestCompleted = (questId) => {
    const q = quests.find(item => item.id === questId);
    if (q && currentGoal) {
      completeQuest(questId, q.xpReward, q.coinReward, q.skillId, currentGoal.id);
    }
  };

  return (
    <div className={`container ${styles.container}`}>
      {/* Header & Syllabus Switcher */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Syllabus Skill Tree</h1>
          <p className={styles.subtitle}>
            Dynamic competencies and mastery paths tailored to your active curriculum
          </p>
        </div>
        <div className={styles.headerActions}>
          <div className={styles.envSelectWrap}>
            <span className={styles.envIcon}>📚</span>
            <select
              className={styles.envSelect}
              value={currentGoal?.id || ''}
              onChange={(e) => switchActiveGoal(e.target.value)}
            >
              {goals.map(g => (
                <option key={g.id} value={g.id}>
                  {g.title} ({g.difficulty || 'medium'})
                </option>
              ))}
            </select>
          </div>
          <Button
            variant="primary"
            onClick={() => setIsAiModalOpen(true)}
            style={{
              background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
              fontWeight: 700
            }}
          >
            <RiSparklingFill /> ⚡ Forge with AI
          </Button>
        </div>
      </div>

      {skills.length === 0 ? (
        <Card style={{ textAlign: 'center', padding: '3.5rem 1.5rem', marginTop: '1.5rem' }}>
          <span style={{ fontSize: '3.5rem', display: 'block', marginBottom: '1rem' }}>🌳</span>
          <h2 style={{ marginBottom: '0.5rem', color: 'var(--text-primary)' }}>No Active Syllabus</h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '520px', margin: '0 auto 1.5rem', lineHeight: 1.6 }}>
            When you upload or paste your syllabus and problem sets, AI automatically synthesizes domain-specific skill trees with interactive challenges!
          </p>
          <Button
            variant="primary"
            onClick={() => setIsAiModalOpen(true)}
            style={{
              background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
              fontWeight: 700
            }}
          >
            <RiSparklingFill /> ⚡ Forge Syllabus &amp; Skill Tree
          </Button>
        </Card>
      ) : (
        <>
          {/* Curriculum Mastery Summary Banner */}
          <div className={styles.summaryCard}>
        <div className={styles.summaryItem}>
          <span className={styles.summaryLabel}>Active Curriculum</span>
          <span className={styles.summaryValue}>{currentGoal?.title || 'Personal Study'}</span>
        </div>
        <div className={styles.summaryDivider} />
        <div className={styles.summaryItem}>
          <span className={styles.summaryLabel}>Curriculum Level</span>
          <span className={styles.summaryValue}>Lvl {currentGoal?.level || 1}</span>
        </div>
        <div className={styles.summaryDivider} />
        <div className={styles.summaryItem}>
          <span className={styles.summaryLabel}>Average Skill Rank</span>
          <span className={styles.summaryValue}>Lvl {avgLevel}</span>
        </div>
        <div className={styles.summaryDivider} />
        <div className={styles.summaryItem}>
          <span className={styles.summaryLabel}>Core Competencies</span>
          <span className={styles.summaryValue}>{skills.length} Branches</span>
        </div>
      </div>

      {/* Main Two-Column Skill Tree Layout */}
      <div className={styles.treeLayout}>
        {/* Left Column: Skill Nodes */}
        <div className={styles.skillsCol}>
          <h2 className={styles.colTitle}>Curriculum Skill Branches</h2>
          <div className={styles.nodesList}>
            {skills.map((skill, index) => {
              const reqXp = getRequiredXp(skill.level || 1);
              const progress = reqXp > 0 ? Math.round(((skill.xp || 0) / reqXp) * 100) : 0;
              const isSelected = (selectedSkill?.id === skill.id) || (index === 0 && !selectedSkillId);

              return (
                <div
                  key={skill.id}
                  className={`${styles.skillNode} ${isSelected ? styles.skillNodeActive : ''}`}
                  onClick={() => setSelectedSkillId(skill.id)}
                >
                  <div className={styles.nodeLeft}>
                    <div className={styles.nodeIconWrap}>
                      <span className={styles.nodeIcon}>{skill.icon || '💡'}</span>
                      <span className={styles.nodeLvlBadge}>Lvl {skill.level || 1}</span>
                    </div>
                  </div>

                  <div className={styles.nodeContent}>
                    <div className={styles.nodeTop}>
                      <h3 className={styles.nodeName}>{skill.name}</h3>
                      <Badge variant="neutral">Tier {Math.min(skill.level || 1, 5)}</Badge>
                    </div>

                    <div className={styles.nodeProgressWrap}>
                      <div className={styles.nodeProgressMeta}>
                        <span>{skill.xp || 0} / {reqXp} XP</span>
                        <span>{progress}%</span>
                      </div>
                      <div className={styles.nodeProgressBar}>
                        <div
                          className={styles.nodeProgressFill}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Drills & Quests for Selected Skill */}
        <div className={styles.detailsCol}>
          {selectedSkill ? (
            <Card className={styles.detailsCard}>
              <div className={styles.detailsHeader}>
                <div className={styles.detailsIconWrap}>
                  {selectedSkill.icon || '💡'}
                </div>
                <div>
                  <div className={styles.detailsBadgeRow}>
                    <Badge variant="primary">Lvl {selectedSkill.level || 1}</Badge>
                    <span className={styles.branchTag}>Curriculum Competency</span>
                  </div>
                  <h2 className={styles.detailsTitle}>{selectedSkill.name}</h2>
                </div>
              </div>

              <div className={styles.detailsProgressSection}>
                <div className={styles.detailsProgressHeader}>
                  <span>Proficiency Growth</span>
                  <span>{selectedSkill.xp || 0} / {getRequiredXp(selectedSkill.level || 1)} XP</span>
                </div>
                <ProgressBar
                  progress={Math.round(((selectedSkill.xp || 0) / getRequiredXp(selectedSkill.level || 1)) * 100)}
                  variant="xp"
                  size="medium"
                />
              </div>

              {/* Associated Quests & Drills */}
              <div className={styles.skillQuestsSection}>
                <h3 className={styles.skillQuestsTitle}>
                  Training Quests for {selectedSkill.name} ({questsForSelectedSkill.length})
                </h3>

                {questsForSelectedSkill.length === 0 ? (
                  <div className={styles.emptyDrills}>
                    <p>No quests explicitly tagged with this skill branch.</p>
                    <Button variant="ghost" size="small" onClick={() => navigate('/quests')}>
                      View All Quests
                    </Button>
                  </div>
                ) : (
                  <div className={styles.skillQuestsList}>
                    {questsForSelectedSkill.map(quest => {
                      const isLocked = quest.status === 'locked';
                      const isCompleted = quest.status === 'completed';

                      return (
                        <div
                          key={quest.id}
                          className={`${styles.miniQuestCard} ${isLocked ? styles.questLocked : ''} ${isCompleted ? styles.questCompleted : ''}`}
                        >
                          <div className={styles.miniQuestHeader}>
                            <div className={styles.miniQuestTitleArea}>
                              {isCompleted && <RiCheckFill className={styles.completedIcon} />}
                              {isLocked && <RiLockFill className={styles.lockedIcon} />}
                              <span className={styles.miniQuestTitle}>{quest.title}</span>
                            </div>
                            <Badge variant={quest.difficulty}>{quest.difficulty}</Badge>
                          </div>

                          <p className={styles.miniQuestDesc}>{quest.description}</p>

                          <div className={styles.miniQuestFooter}>
                            <div className={styles.miniRewards}>
                              <span><RiFireFill className={styles.fireIcon} /> +{quest.xpReward} XP</span>
                              <span><RiCoinsFill className={styles.coinIcon} /> +{quest.coinReward} Coins</span>
                            </div>

                            {!isLocked && (
                              <Button
                                variant={isCompleted ? "ghost" : "primary"}
                                size="small"
                                onClick={() => setActiveChallengeQuest(quest)}
                                style={!isCompleted ? {
                                  background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                                  fontWeight: 700
                                } : undefined}
                              >
                                {isCompleted ? 'Review Drill' : '⚔️ Solve Drill'}
                              </Button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </Card>
          ) : (
            <Card className={styles.emptyDetails}>
              <p>Select a skill node to view training challenges.</p>
            </Card>
          )}
        </div>
      </div>
    </>
  )}

      {/* Quest Challenge Modal */}
      <QuestChallengeModal
        isOpen={!!activeChallengeQuest}
        onClose={() => setActiveChallengeQuest(null)}
        quest={activeChallengeQuest}
        onCompleteQuest={(questId) => {
          handleQuestCompleted(questId);
          setActiveChallengeQuest(null);
        }}
      />

      {/* AI Syllabus Generator Modal */}
      <AISyllabusModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        onCampaignDeployed={(newGoal) => {
          const updatedGoals = [...goals, newGoal];
          setGoals(updatedGoals);
          switchActiveGoal(newGoal.id);
        }}
      />
    </div>
  );
};

export default SkillTreePage;
