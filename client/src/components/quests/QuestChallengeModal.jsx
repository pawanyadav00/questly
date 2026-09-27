import React, { useState } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Badge from '../common/Badge';
import {
  RiSwordFill,
  RiCheckFill,
  RiCloseFill,
  RiLightbulbFlashLine,
  RiEyeLine,
  RiCodeSSlashLine,
  RiQuestionLine,
  RiFireFill,
  RiCoinsFill,
  RiArrowRightLine,
  RiArrowLeftLine,
  RiTrophyFill,
  RiSparklingFill
} from 'react-icons/ri';
import styles from './questChallengeModal.module.css';

const QuestChallengeModal = ({ isOpen, onClose, quest, onCompleteQuest }) => {
  if (!quest) return null;

  const challenges = quest.challenges && quest.challenges.length > 0
    ? quest.challenges
    : [
        {
          id: `${quest.id}_chal_1`,
          type: 'quiz',
          title: `${quest.title} Core Check`,
          prompt: `What is the primary prerequisite or invariant when working with ${quest.title}?`,
          options: [
            'Proactive boundary validation, modular structure, and handling edge cases first.',
            'Skipping test cases until final deployment.',
            'Using maximum memory allocation without profiling.',
            'Inlining all routines into one monolithic file.'
          ],
          correctAnswer: 0,
          explanation: `Systematic decomposition and testing edge cases ensure mastery of ${quest.title}.`
        },
        {
          id: `${quest.id}_chal_2`,
          type: 'exercise',
          title: `${quest.title} Practical Drill`,
          prompt: `Implement or summarize the core concepts of "${quest.title}". Ensure edge cases and boundary conditions are handled.`,
          starterCode: `/**\n * Challenge Drill: ${quest.title}\n * Implement the function or summarize your solution below:\n */\nfunction solve(input) {\n  // Write your implementation here\n  return true;\n}`,
          hints: [
            'Break down the problem into small verifiable units before writing the complete solution.',
            'Consider the time vs. space complexity and check for null/empty boundary inputs.'
          ],
          solution: `// Verified solution approach for ${quest.title}\n// All edge cases and requirements satisfied.`,
          explanation: `Careful breakdown of edge cases and algorithmic invariants leads to the optimal solution.`
        }
      ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({}); // { [challengeId]: selectedOptionIndex }
  const [userCode, setUserCode] = useState({}); // { [challengeId]: string }
  const [revealedHints, setRevealedHints] = useState({}); // { [challengeId]: countOfHints }
  const [revealedSolutions, setRevealedSolutions] = useState({}); // { [challengeId]: boolean }
  const [solvedChallenges, setSolvedChallenges] = useState({}); // { [challengeId]: boolean }
  const [isCompletedScreen, setIsCompletedScreen] = useState(false);

  const currentChallenge = challenges[currentIndex];
  const totalChallenges = challenges.length;
  const isLastChallenge = currentIndex === totalChallenges - 1;
  const solvedCount = Object.keys(solvedChallenges).filter(k => solvedChallenges[k]).length;
  const progressPercent = Math.round((solvedCount / totalChallenges) * 100);

  const handleSelectQuizOption = (optionIndex) => {
    if (selectedAnswers[currentChallenge.id] !== undefined) return; // already answered
    setSelectedAnswers(prev => ({ ...prev, [currentChallenge.id]: optionIndex }));
    
    // If correct answer, mark as solved
    if (optionIndex === currentChallenge.correctAnswer) {
      setSolvedChallenges(prev => ({ ...prev, [currentChallenge.id]: true }));
    }
  };

  const handleRevealNextHint = () => {
    const currentHints = revealedHints[currentChallenge.id] || 0;
    const maxHints = currentChallenge.hints ? currentChallenge.hints.length : 0;
    if (currentHints < maxHints) {
      setRevealedHints(prev => ({ ...prev, [currentChallenge.id]: currentHints + 1 }));
    }
  };

  const handleToggleSolution = () => {
    setRevealedSolutions(prev => ({
      ...prev,
      [currentChallenge.id]: !prev[currentChallenge.id]
    }));
  };

  const handleMarkSolved = () => {
    setSolvedChallenges(prev => ({ ...prev, [currentChallenge.id]: true }));
  };

  const handleNext = () => {
    if (isLastChallenge) {
      // Check if all are solved
      const allSolved = challenges.every(c => solvedChallenges[c.id]);
      if (allSolved || solvedCount >= 1) {
        setIsCompletedScreen(true);
      }
    } else {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleFinishQuest = () => {
    if (onCompleteQuest) {
      onCompleteQuest(quest.id);
    }
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="760px">
      <div className={styles.modalContent}>
        {!isCompletedScreen ? (
          <>
            {/* Header */}
            <div className={styles.header}>
              <div className={styles.headerTop}>
                <div className={styles.questTitleArea}>
                  <div className={styles.badgeRow}>
                    <Badge variant={quest.difficulty}>{quest.difficulty}</Badge>
                    <span className={styles.rewardsPreview}>
                      <RiFireFill className={styles.fireIcon} /> +{quest.xpReward} XP
                      <RiCoinsFill className={styles.coinIcon} /> +{quest.coinReward} Coins
                    </span>
                  </div>
                  <h2 className={styles.questTitle}>{quest.title}</h2>
                </div>
              </div>

              {/* Problem Stepper Tabs */}
              <div className={styles.stepperWrap}>
                <div className={styles.stepTabs}>
                  {challenges.map((c, idx) => {
                    const isSolved = solvedChallenges[c.id];
                    const isActive = idx === currentIndex;
                    return (
                      <button
                        key={c.id || idx}
                        type="button"
                        className={`${styles.stepTab} ${isActive ? styles.stepTabActive : ''} ${isSolved ? styles.stepTabSolved : ''}`}
                        onClick={() => setCurrentIndex(idx)}
                      >
                        {isSolved ? (
                          <RiCheckFill className={styles.solvedCheck} />
                        ) : c.type === 'quiz' ? (
                          <RiQuestionLine />
                        ) : (
                          <RiCodeSSlashLine />
                        )}
                        <span>Problem {idx + 1}</span>
                      </button>
                    );
                  })}
                </div>
                <div className={styles.overallProgressBar}>
                  <div
                    className={styles.overallProgressFill}
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Active Challenge Body */}
            <div className={styles.body}>
              <div className={styles.challengeInfo}>
                <div className={styles.challengeHeaderRow}>
                  <h3 className={styles.challengeTitle}>
                    {currentChallenge.type === 'quiz' ? '🧠 Concept Check' : '💻 Practice Drill'}: {currentChallenge.title}
                  </h3>
                  {solvedChallenges[currentChallenge.id] && (
                    <span className={styles.solvedBadge}>
                      <RiCheckFill /> Solved
                    </span>
                  )}
                </div>
                <p className={styles.challengePrompt}>{currentChallenge.prompt}</p>
              </div>

              {/* Challenge Type: QUIZ */}
              {currentChallenge.type === 'quiz' && (
                <div className={styles.quizArea}>
                  <div className={styles.optionsGrid}>
                    {(currentChallenge.options || []).map((opt, optIdx) => {
                      const isSelected = selectedAnswers[currentChallenge.id] === optIdx;
                      const hasAnswered = selectedAnswers[currentChallenge.id] !== undefined;
                      const isCorrect = optIdx === currentChallenge.correctAnswer;

                      let optClass = styles.optionCard;
                      if (hasAnswered) {
                        if (isCorrect) optClass += ` ${styles.optionCorrect}`;
                        else if (isSelected) optClass += ` ${styles.optionWrong}`;
                        else optClass += ` ${styles.optionDisabled}`;
                      }

                      return (
                        <button
                          key={optIdx}
                          type="button"
                          className={optClass}
                          onClick={() => handleSelectQuizOption(optIdx)}
                          disabled={hasAnswered}
                        >
                          <span className={styles.optLetter}>
                            {String.fromCharCode(65 + optIdx)}
                          </span>
                          <span className={styles.optText}>{opt}</span>
                          {hasAnswered && isCorrect && <RiCheckFill className={styles.resultIconCorrect} />}
                          {hasAnswered && isSelected && !isCorrect && <RiCloseFill className={styles.resultIconWrong} />}
                        </button>
                      );
                    })}
                  </div>

                  {selectedAnswers[currentChallenge.id] !== undefined && (
                    <div className={`${styles.feedbackBox} ${selectedAnswers[currentChallenge.id] === currentChallenge.correctAnswer ? styles.feedbackCorrect : styles.feedbackWrong}`}>
                      <h4>
                        {selectedAnswers[currentChallenge.id] === currentChallenge.correctAnswer
                          ? '🎉 Correct! Concept Mastered.'
                          : '💡 Not quite, review the insight below:'}
                      </h4>
                      <p>{currentChallenge.explanation}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Challenge Type: CODING / EXERCISE */}
              {currentChallenge.type !== 'quiz' && (
                <div className={styles.codeArea}>
                  <div className={styles.editorWrap}>
                    <div className={styles.editorToolbar}>
                      <span className={styles.editorLang}>
                        Interactive Problem Workspace
                      </span>
                      <div className={styles.editorActions}>
                        {currentChallenge.hints && currentChallenge.hints.length > 0 && (
                          <button
                            type="button"
                            className={styles.toolBtn}
                            onClick={handleRevealNextHint}
                          >
                            <RiLightbulbFlashLine /> Hint ({(revealedHints[currentChallenge.id] || 0)}/{currentChallenge.hints.length})
                          </button>
                        )}
                        <button
                          type="button"
                          className={styles.toolBtn}
                          onClick={handleToggleSolution}
                        >
                          <RiEyeLine /> {revealedSolutions[currentChallenge.id] ? 'Hide Solution' : 'Solution'}
                        </button>
                      </div>
                    </div>
                    <textarea
                      className={styles.codeTextarea}
                      rows={6}
                      value={userCode[currentChallenge.id] !== undefined ? userCode[currentChallenge.id] : (currentChallenge.starterCode || '')}
                      onChange={(e) => setUserCode({ ...userCode, [currentChallenge.id]: e.target.value })}
                      placeholder="Write your solution, implementation, or notes here..."
                    />
                  </div>

                  {/* Revealed Hints */}
                  {(revealedHints[currentChallenge.id] || 0) > 0 && (
                    <div className={styles.hintsBox}>
                      <h4 className={styles.hintsTitle}><RiLightbulbFlashLine /> Progressive Hints:</h4>
                      <ul>
                        {currentChallenge.hints.slice(0, revealedHints[currentChallenge.id]).map((hint, hIdx) => (
                          <li key={hIdx}><strong>Hint {hIdx + 1}:</strong> {hint}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Revealed Solution */}
                  {revealedSolutions[currentChallenge.id] && (
                    <div className={styles.solutionBox}>
                      <div className={styles.solutionHeader}>
                        <h4>✨ Reference Solution &amp; Insight:</h4>
                      </div>
                      <pre className={styles.solutionPre}>
                        <code>{currentChallenge.solution}</code>
                      </pre>
                      {currentChallenge.explanation && (
                        <p className={styles.solutionExplanation}>
                          <strong>Explanation:</strong> {currentChallenge.explanation}
                        </p>
                      )}
                    </div>
                  )}

                  {!solvedChallenges[currentChallenge.id] && (
                    <div className={styles.markSolvedRow}>
                      <Button variant="primary" onClick={handleMarkSolved} className={styles.markSolvedBtn}>
                        <RiCheckFill /> I Have Solved This Drill
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer Navigation */}
            <div className={styles.footer}>
              <Button
                variant="ghost"
                onClick={handlePrev}
                disabled={currentIndex === 0}
              >
                <RiArrowLeftLine /> Previous
              </Button>
              <div className={styles.footerRight}>
                <Button variant="ghost" onClick={onClose}>
                  Save &amp; Exit
                </Button>
                <Button
                  variant="primary"
                  onClick={handleNext}
                  disabled={!solvedChallenges[currentChallenge.id]}
                  style={{
                    background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                    fontWeight: 700
                  }}
                >
                  {isLastChallenge ? (
                    <>
                      Complete Quest <RiSparklingFill />
                    </>
                  ) : (
                    <>
                      Next Problem <RiArrowRightLine />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </>
        ) : (
          /* Triumph Fanfare Victory Screen */
          <div className={styles.victoryScreen}>
            <div className={styles.trophyIconWrap}>
              <RiTrophyFill className={styles.trophyIcon} />
            </div>
            <h2 className={styles.victoryTitle}>Quest Conquered!</h2>
            <p className={styles.victorySubtitle}>
              You crushed every challenge in <strong>{quest.title}</strong>!
            </p>

            <div className={styles.rewardsCard}>
              <div className={styles.rewardStat}>
                <span className={styles.rewardValue}>+{quest.xpReward}</span>
                <span className={styles.rewardLabel}><RiFireFill /> Experience XP</span>
              </div>
              <div className={styles.rewardDivider} />
              <div className={styles.rewardStat}>
                <span className={styles.rewardValue}>+{quest.coinReward}</span>
                <span className={styles.rewardLabel}><RiCoinsFill /> Gold Coins</span>
              </div>
            </div>

            <p className={styles.unlockNotice}>
              ⚔️ Next sequential quest in your campaign is now <strong>UNLOCKED</strong>!
            </p>

            <Button
              variant="primary"
              onClick={handleFinishQuest}
              className={styles.claimBtn}
              style={{
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                fontSize: '1.1rem',
                padding: '0.85rem 2rem',
                fontWeight: 700,
                boxShadow: '0 8px 24px rgba(16, 185, 129, 0.4)'
              }}
            >
              🚀 Claim Rewards &amp; Continue Campaign
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default QuestChallengeModal;
