import React, { useState } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Badge from '../common/Badge';
import {
  RiSparklingFill,
  RiMagicLine,
  RiFileUploadLine,
  RiCheckFill,
  RiArrowRightLine,
  RiSwordFill,
  RiFireFill,
  RiCoinsFill,
  RiLockFill,
  RiKeyLine,
  RiTimeLine,
  RiQuestionLine,
  RiCodeSSlashLine,
  RiFileTextLine,
  RiListCheck2,
  RiArrowDownSLine,
  RiArrowUpSLine
} from 'react-icons/ri';
import styles from './aiSyllabusModal.module.css';
import { PRESETS, generateLocalCampaign } from '../../services/campaignGenerator';

const AISyllabusModal = ({ isOpen, onClose, onCampaignDeployed }) => {
  const [activeTab, setActiveTab] = useState('syllabus'); // 'syllabus' | 'problems'
  const [curriculumTitle, setCurriculumTitle] = useState('');
  const [syllabusText, setSyllabusText] = useState('');
  const [problemSetText, setProblemSetText] = useState('');
  const [targetWeeks, setTargetWeeks] = useState(4);
  const [difficulty, setDifficulty] = useState('medium');
  const [apiKey, setApiKey] = useState(localStorage.getItem('gemini_api_key') || '');
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const [expandedQuestId, setExpandedQuestId] = useState(null);

  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [error, setError] = useState(null);
  const [generatedCampaign, setGeneratedCampaign] = useState(null);

  const handleSyllabusFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => setSyllabusText(event.target.result);
    reader.readAsText(file);
  };

  const handleProblemSetFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => setProblemSetText(event.target.result);
    reader.readAsText(file);
  };

  const handleApplyPreset = (preset) => {
    setCurriculumTitle(preset.title || preset.name);
    setSyllabusText(preset.syllabus);
    setProblemSetText(preset.problems || '');
  };

  const handleGenerate = async () => {
    if (!syllabusText.trim()) {
      setError('Please paste or upload your syllabus text first.');
      return;
    }

    setLoading(true);
    setError(null);
    setLoadingStep('Analyzing syllabus and problem sets...');

    if (apiKey) {
      localStorage.setItem('gemini_api_key', apiKey.trim());
    }

    const timer1 = setTimeout(() => setLoadingStep('Synthesizing sequenced quest chains & prerequisites...'), 1200);
    const timer2 = setTimeout(() => setLoadingStep('Generating interactive challenges & problem drills...'), 2400);

    try {
      const apiBase = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
      const res = await fetch(`${apiBase}/api/ai/generate-campaign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          curriculumTitle: curriculumTitle.trim() || undefined,
          syllabusText,
          problemSetText,
          targetWeeks,
          difficulty,
          apiKey: apiKey.trim() || undefined
        })
      });

      if (!res.ok) {
        throw new Error('Server returned error status');
      }

      const data = await res.json();
      if (data.campaign) {
        setGeneratedCampaign(data.campaign);
        return;
      }
      throw new Error('Received invalid campaign data.');
    } catch (err) {
      console.warn('Backend unavailable, running client-side campaign forge:', err.message);
      const fallbackCampaign = generateLocalCampaign(syllabusText, problemSetText, targetWeeks, difficulty, curriculumTitle.trim());
      setGeneratedCampaign(fallbackCampaign);
    } finally {
      clearTimeout(timer1);
      clearTimeout(timer2);
      setLoading(false);
    }
  };

  const handleDeploy = () => {
    if (!generatedCampaign) return;

    const newGoalId = `goal_${Date.now()}`;
    const newGoal = {
      ...generatedCampaign.goal,
      id: newGoalId,
      createdAt: new Date().toISOString(),
      quests: generatedCampaign.quests.map(q => ({ ...q, goalId: newGoalId })),
      boss: generatedCampaign.boss
    };

    onCampaignDeployed(newGoal, generatedCampaign.boss);
    onClose();
  };

  const toggleQuestExpand = (id) => {
    setExpandedQuestId(prev => (prev === id ? null : id));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="740px">
      <div className={styles.modalContainer}>
        {!generatedCampaign ? (
          <>
            {/* Header */}
            <div className={styles.header}>
              <div className={styles.iconBadge}><RiSparklingFill /></div>
              <div>
                <h2 className={styles.title}>AI Curriculum &amp; Problem Set Forge</h2>
                <p className={styles.subtitle}>
                  Drop your syllabus, topic list, or problem sets. AI will forge an automated RPG questline with interactive challenges!
                </p>
              </div>
            </div>

            {/* Quick Presets */}
            <div className={styles.presetsRow}>
              <span className={styles.presetsLabel}>1-Click Presets:</span>
              {PRESETS.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  className={styles.presetBtn}
                  onClick={() => handleApplyPreset(p)}
                >
                  {p.name}
                </button>
              ))}
            </div>

            {/* Curriculum Title Input */}
            <div style={{ marginBottom: '1rem' }}>
              <label className={styles.label} style={{ display: 'block', marginBottom: '0.35rem' }}>
                Curriculum / Course Title (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Data Structures & Algorithms, Machine Learning, Full-Stack Web Dev"
                value={curriculumTitle}
                onChange={(e) => setCurriculumTitle(e.target.value)}
                style={{
                  width: '100%',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-default)',
                  color: 'var(--text-primary)',
                  padding: '9px 12px',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  outline: 'none'
                }}
              />
            </div>

            {/* Ingestion Tabs */}
            <div className={styles.tabNav}>
              <button
                type="button"
                className={`${styles.tabBtn} ${activeTab === 'syllabus' ? styles.tabBtnActive : ''}`}
                onClick={() => setActiveTab('syllabus')}
              >
                <RiFileTextLine /> 1. Syllabus &amp; Topics <span className={styles.reqBadge}>Required</span>
              </button>
              <button
                type="button"
                className={`${styles.tabBtn} ${activeTab === 'problems' ? styles.tabBtnActive : ''}`}
                onClick={() => setActiveTab('problems')}
              >
                <RiListCheck2 /> 2. Problem Sets &amp; Drills {problemSetText.trim() && <span className={styles.optHasBadge}>✓ Attached</span>}
              </button>
            </div>

            {/* Tab 1: Syllabus Input */}
            {activeTab === 'syllabus' && (
              <div className={styles.inputArea}>
                <div className={styles.textareaHeader}>
                  <label className={styles.label}>Paste Syllabus, Units, or Chapters</label>
                  <label className={styles.uploadBtn}>
                    <RiFileUploadLine /> Import File
                    <input type="file" accept=".txt,.md,.json,.csv" onChange={handleSyllabusFileUpload} style={{ display: 'none' }} />
                  </label>
                </div>
                <textarea
                  className={styles.textarea}
                  rows={7}
                  placeholder="Example:
Unit 1: Two Pointers & Sliding Window
Unit 2: Linked Lists & Fast/Slow Pointers
Unit 3: Binary Trees & Tree Traversals
Unit 4: Dynamic Programming & Tabulation"
                  value={syllabusText}
                  onChange={(e) => setSyllabusText(e.target.value)}
                />
              </div>
            )}

            {/* Tab 2: Problem Set Input */}
            {activeTab === 'problems' && (
              <div className={styles.inputArea}>
                <div className={styles.textareaHeader}>
                  <label className={styles.label}>Paste Practice Problem Sets or Exercise List (Optional)</label>
                  <label className={styles.uploadBtn}>
                    <RiFileUploadLine /> Import File
                    <input type="file" accept=".txt,.md,.json,.csv" onChange={handleProblemSetFileUpload} style={{ display: 'none' }} />
                  </label>
                </div>
                <textarea
                  className={styles.textarea}
                  rows={7}
                  placeholder="Example:
Problem 1: LeetCode 167 - Two Sum II using two pointers with O(1) extra space.
Problem 2: LeetCode 141 - Linked List Cycle detection.
Problem 3: LeetCode 226 - Invert Binary Tree.
(If left blank, AI will auto-generate challenges tailored to each topic!)"
                  value={problemSetText}
                  onChange={(e) => setProblemSetText(e.target.value)}
                />
                <span className={styles.fieldHint}>
                  💡 Any problems pasted here will be mapped directly into the interactive challenges of the corresponding quests.
                </span>
              </div>
            )}

            {/* Configuration Options */}
            <div className={styles.configGrid}>
              <div className={styles.formGroup}>
                <label className={styles.label}><RiTimeLine /> Target Timeline</label>
                <select
                  className={styles.select}
                  value={targetWeeks}
                  onChange={(e) => setTargetWeeks(e.target.value)}
                >
                  <option value={2}>2 Weeks (Fast Track)</option>
                  <option value={4}>4 Weeks (Standard Sprint)</option>
                  <option value={8}>8 Weeks (Deep Immersion)</option>
                  <option value={12}>12 Weeks (Full Semester)</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Campaign Difficulty</label>
                <select
                  className={styles.select}
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                >
                  <option value="easy">Easy (Casual)</option>
                  <option value="medium">Medium (Balanced)</option>
                  <option value="hard">Hard (Demanding)</option>
                  <option value="epic">Epic (Mastery)</option>
                </select>
              </div>
            </div>

            {/* Optional Gemini API Key Section */}
            <div className={styles.apiKeySection}>
              <button
                type="button"
                className={styles.apiKeyToggle}
                onClick={() => setShowApiKeyInput(!showApiKeyInput)}
              >
                <RiKeyLine /> {showApiKeyInput ? 'Hide Gemini API Key' : 'Have a Google Gemini API Key? (Optional)'}
              </button>
              {showApiKeyInput && (
                <div className={styles.apiKeyInputWrap}>
                  <input
                    type="password"
                    placeholder="Paste Gemini API Key (leaves blank to use local NLP engine)"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className={styles.apiKeyInput}
                  />
                  <span className={styles.apiKeyHint}>
                    Zero setup required: If left blank, our intelligent built-in parser generates your campaign and challenges automatically.
                  </span>
                </div>
              )}
            </div>

            {error && <div className={styles.errorAlert}>{error}</div>}

            {/* Actions */}
            <div className={styles.footerActions}>
              <Button variant="ghost" onClick={onClose} disabled={loading}>
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleGenerate}
                disabled={loading || !syllabusText.trim()}
                className={styles.forgeBtn}
                style={{
                  background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                  fontWeight: 700,
                  boxShadow: '0 4px 16px rgba(99, 102, 241, 0.4)'
                }}
              >
                {loading ? (
                  <span className={styles.loadingSpinnerWrap}>
                    <span className={styles.spinner}></span> {loadingStep}
                  </span>
                ) : (
                  <>
                    <RiMagicLine /> ⚡ Forge RPG Campaign
                  </>
                )}
              </Button>
            </div>
          </>
        ) : (
          /* Campaign Preview Screen */
          <div className={styles.previewScreen}>
            <div className={styles.previewHeader}>
              <div className={styles.previewMeta}>
                <Badge variant={generatedCampaign.goal.difficulty}>{generatedCampaign.goal.difficulty}</Badge>
                <span className={styles.previewCategory}>{generatedCampaign.goal.category}</span>
                <span className={styles.previewDeadline}>Deadline: {generatedCampaign.goal.deadline}</span>
              </div>
              <h2 className={styles.previewTitle}>{generatedCampaign.goal.title}</h2>
              <p className={styles.previewDesc}>{generatedCampaign.goal.description}</p>
            </div>

            {/* Quests Chain Preview */}
            <div className={styles.chainTitleRow}>
              <h3 className={styles.chainTitle}>
                Generated Quest Chain ({generatedCampaign.quests.length} Quests)
              </h3>
              <span className={styles.chainSubtitle}>Click any quest to inspect challenges</span>
            </div>

            <div className={styles.questsList}>
              {generatedCampaign.quests.map((q, idx) => {
                const isExpanded = expandedQuestId === q.id;
                const challengeCount = q.challenges ? q.challenges.length : 0;

                return (
                  <div key={q.id} className={styles.questItem}>
                    <div className={styles.questItemMain} onClick={() => toggleQuestExpand(q.id)}>
                      <div className={styles.questIndex}>
                        {idx === 0 ? <RiCheckFill /> : <RiLockFill />}
                      </div>
                      <div className={styles.questInfo}>
                        <div className={styles.questItemTop}>
                          <span className={styles.questItemTitle}>{q.title}</span>
                          <span className={styles.questTypeBadge}>{q.type}</span>
                          <span className={styles.questSkillBadge}>{q.skillId.replace('_', ' ')}</span>
                          {challengeCount > 0 && (
                            <span className={styles.challengesCountBadge}>
                              ⚔️ {challengeCount} Challenges
                            </span>
                          )}
                        </div>
                        <p className={styles.questItemDesc}>{q.description}</p>
                        <div className={styles.questRewards}>
                          <span className={styles.rewardXp}><RiFireFill /> +{q.xpReward} XP</span>
                          <span className={styles.rewardCoins}><RiCoinsFill /> +{q.coinReward} Coins</span>
                        </div>
                      </div>
                      <div className={styles.expandChevron}>
                        {isExpanded ? <RiArrowUpSLine /> : <RiArrowDownSLine />}
                      </div>
                    </div>

                    {/* Expandable Challenges Drawer */}
                    {isExpanded && q.challenges && q.challenges.length > 0 && (
                      <div className={styles.challengesDrawer}>
                        <h4 className={styles.drawerTitle}>Attached Interactive Challenges:</h4>
                        <div className={styles.drawerList}>
                          {q.challenges.map((chal, cIdx) => (
                            <div key={chal.id || cIdx} className={styles.challengeMiniCard}>
                              <div className={styles.challengeMiniTop}>
                                <span className={styles.challengeMiniType}>
                                  {chal.type === 'quiz' ? <RiQuestionLine /> : <RiCodeSSlashLine />}
                                  {chal.type === 'quiz' ? 'Concept Check' : 'Practical Drill'}
                                </span>
                                <span className={styles.challengeMiniTitle}>{chal.title}</span>
                              </div>
                              <p className={styles.challengeMiniPrompt}>{chal.prompt}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Boss Preview */}
            {generatedCampaign.boss && (
              <div className={styles.bossPreviewBox}>
                <div className={styles.bossIcon}><RiSwordFill /></div>
                <div>
                  <h4 className={styles.bossName}>{generatedCampaign.boss.name}</h4>
                  <p className={styles.bossDesc}>{generatedCampaign.boss.description}</p>
                  <span className={styles.bossHpTag}>Milestone Boss: {generatedCampaign.boss.maxHp} HP</span>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className={styles.previewActions}>
              <Button variant="ghost" onClick={() => setGeneratedCampaign(null)}>
                Edit &amp; Re-forge
              </Button>
              <Button variant="primary" onClick={handleDeploy} className={styles.deployBtn}>
                🚀 Deploy to My Goals <RiArrowRightLine />
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default AISyllabusModal;
