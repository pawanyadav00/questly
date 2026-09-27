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

const PRESETS = [
  {
    name: "DSA & LeetCode",
    title: "Data Structures & Algorithms",
    syllabus: `Unit 1: Time & Space Complexity, Big-O Notation
Unit 2: Arrays, Two Pointers, and Sliding Window
Unit 3: Linked Lists & Fast/Slow Pointers
Unit 4: Stacks, Queues & Monotonic Queues
Unit 5: Binary Trees, BST & DFS/BFS Traversals
Unit 6: Dynamic Programming & Memoization
Unit 7: Graph Algorithms (Dijkstra, Topological Sort)`,
    problems: `Problem 1: Given an array of integers nums, analyze the worst-case runtime of QuickSort vs MergeSort.
Problem 2: LeetCode 167 - Two Sum II (Input Array Is Sorted) using two pointers in O(1) space.
Problem 3: LeetCode 141 - Linked List Cycle detection using Floyd's Tortoise and Hare algorithm.
Problem 4: LeetCode 739 - Daily Temperatures using a Monotonic Decreasing Stack.
Problem 5: LeetCode 226 - Invert Binary Tree & LeetCode 102 - Binary Tree Level Order Traversal (BFS).
Problem 6: LeetCode 322 - Coin Change using Bottom-Up Tabulation Dynamic Programming.
Problem 7: LeetCode 207 - Course Schedule using Kahn's Topological Sort Algorithm.`
  },
  {
    name: "Full-Stack Web Dev",
    title: "Full-Stack Web Development",
    syllabus: `Module 1: Advanced Modern JavaScript & Async/Await
Module 2: React 18 Architecture, Hooks & Context API
Module 3: Custom Hooks & Component Design Patterns
Module 4: Node.js, Express & REST API Architecture
Module 5: Database Modeling & SQL/NoSQL Schema Design
Module 6: Authentication, JWT & Security Best Practices
Module 7: Full-Stack Capstone Project Deployment`,
    problems: `Drill 1: Implement an async retry wrapper function that retries a failed Promise up to N times with exponential backoff.
Drill 2: Build a reusable useLocalStorage hook that synchronizes state with window.localStorage.
Drill 3: Build an authenticated Express middleware that verifies Bearer JWT tokens and attaches user payload to req.user.
Drill 4: Design a relational schema for an e-commerce order system with 1-to-many and many-to-many relationships.
Drill 5: Configure CORS, rate limiting with express-rate-limit, and sanitize SQL/NoSQL injection vectors.`
  },
  {
    name: "Python Mastery",
    title: "Python Mastery & Concurrency",
    syllabus: `Chapter 1: Pythonic Idioms, List Comprehensions & Generators
Chapter 2: Object-Oriented Python, Dunder Methods & Inheritance
Chapter 3: Functional Programming & Decorators
Chapter 4: File I/O, Serialization & Working with JSON/APIs
Chapter 5: Multithreading, Multiprocessing & Asyncio
Chapter 6: Building a Real-World CLI Tool or Web Scraper`,
    problems: `Exercise 1: Create a memory-efficient generator function that streams and filters a large log file line by line.
Exercise 2: Write a class Matrix that implements __add__, __mul__, and __repr__ dunder methods for matrix arithmetic.
Exercise 3: Write a @timer decorator that logs execution time and caches return values with LRU cache logic.
Exercise 4: Use asyncio or aiohttp to fetch 20 URLs concurrently with a semaphore limit of 5 workers.`
  },
  {
    name: "System Design & Scale",
    title: "System Design & Distributed Architectures",
    syllabus: `Topic 1: Client-Server Architecture, DNS, and Load Balancing
Topic 2: Caching Strategies (Redis, Memcached, Write-Through/Back)
Topic 3: Database Sharding, Replication & CAP Theorem
Topic 4: Message Queues & Event-Driven Architecture (Kafka, RabbitMQ)
Topic 5: API Rate Limiting & Token Bucket Algorithms
Topic 6: Designing a Distributed URL Shortener (TinyURL)`,
    problems: `Task 1: Design a Token Bucket rate limiter algorithm in memory with capacity B and refill rate R tokens/sec.
Task 2: Compare Cache-Aside vs Write-Through caching patterns under high write-throughput conditions.
Task 3: Calculate storage, read/write QPS, and bandwidth requirements for 100 Million daily active URL redirects.`
  }
];

// Helper: Generate interactive challenges for local fallback
function generateChallengesForTopic(topic, skill, idx, userProblems = []) {
  const cleanTopic = topic.replace(/^(unit|module|chapter|week|topic)\s*\d+[:.-]?\s*/i, '');
  const challenges = [];

  // 1. Concept Quiz Check
  challenges.push({
    id: `chal_${idx + 1}_quiz`,
    type: 'quiz',
    title: `${cleanTopic} Concept Check`,
    prompt: `When mastering "${cleanTopic}", what is the primary architectural principle or invariant to maintain?`,
    options: [
      `Enforce clear boundaries, validate preconditions, and handle edge cases systematically.`,
      `Skip base-case checks and rely entirely on external catch handlers.`,
      `Always prioritize memory allocation over time complexity unconditionally.`,
      `Inline all subroutines into one monolithic file to eliminate call overhead.`
    ],
    correctAnswer: 0,
    explanation: `Proactive boundary checking, input validation, and clean modularity are foundational when mastering ${cleanTopic}.`
  });

  // 2. Practical / Coding Problem
  const hasUserProblem = userProblems.length > 0;
  const userProblem = hasUserProblem ? userProblems[idx % userProblems.length] : null;

  if (hasUserProblem && userProblem) {
    challenges.push({
      id: `chal_${idx + 1}_drill`,
      type: skill === 'coding' ? 'coding' : 'exercise',
      title: `${cleanTopic} Challenge Problem`,
      prompt: typeof userProblem === 'string' ? userProblem : (userProblem.prompt || `Solve the challenge for ${cleanTopic}`),
      starterCode: skill === 'coding'
        ? `/**\n * Challenge: ${cleanTopic}\n * Implement the function below:\n */\nfunction solve(input) {\n  // Write your implementation here\n  return null;\n}`
        : `Exercise Plan for ${cleanTopic}:\n1. Objective:\n2. Core Steps:\n3. Validation:`,
      hints: [
        `Break the problem into small testable units before writing the complete implementation.`,
        `Consider time vs. space complexity and check for null/empty boundary inputs.`
      ],
      solution: `// Verified solution approach for ${cleanTopic}\n// Ensure all test conditions pass and invariants hold.`,
      explanation: `Careful breakdown of edge cases and invariants leads to the optimal solution.`
    });
  } else {
    challenges.push({
      id: `chal_${idx + 1}_drill`,
      type: skill === 'coding' ? 'coding' : 'exercise',
      title: `${cleanTopic} Implementation Drill`,
      prompt: skill === 'coding'
        ? `Implement a clean, robust algorithm or component for "${cleanTopic}". Write test assertions for at least 2 edge cases.`
        : `Formulate a concrete real-world problem and solve it using principles of "${cleanTopic}".`,
      starterCode: skill === 'coding'
        ? `/**\n * Problem: ${cleanTopic} Practice Drill\n * Return true if valid, false otherwise.\n */\nfunction execute(data) {\n  // Implement your logic here\n  return true;\n}`
        : `Checklist for ${cleanTopic}:\n- [ ] Define the objective\n- [ ] Formulate approach\n- [ ] Document solution and key trade-offs`,
      hints: [
        `Start by identifying input constraints and target return types.`,
        `Trace an example manually with pencil/paper before finalizing logic.`
      ],
      solution: `// Implementation for ${cleanTopic}\n// Test with empty array, single element, and large scale datasets.`,
      explanation: `Mastery comes from deliberately testing boundary conditions and algorithmic efficiency.`
    });
  }

  return challenges;
}

// Client-side fallback generator if backend is restarting or offline
function generateLocalCampaign(syllabusText, problemSetText = '', targetWeeks = 4, preferredDifficulty = 'medium', explicitTitle = '') {
  const lines = syllabusText
    .split(/\r?\n/)
    .map(l => l.trim())
    .filter(l => l.length > 0);

  let courseTitle = explicitTitle && explicitTitle.trim() ? explicitTitle.trim() : "Custom Learning Campaign";
  if (!explicitTitle || !explicitTitle.trim()) {
    if (lines.length > 0) {
      const firstLine = lines[0].replace(/^[#*-]\s*/, '').replace(/^(course|syllabus|module|subject|unit|chapter):\s*/i, '');
      if (firstLine.length < 60) {
        courseTitle = firstLine.replace(/^[:.-]\s*/, '');
      }
    }
  }

  let userProblems = [];
  if (problemSetText && problemSetText.trim()) {
    userProblems = problemSetText
      .split(/\r?\n/)
      .map(l => l.trim())
      .filter(l => l.length > 5 && !l.startsWith('#'));
  }

  let rawTopics = [];
  const topicRegex = /^(\d+[\.\)]|module\s*\d+|unit\s*\d+|chapter\s*\d+|week\s*\d+|topic\s*\d+|[-*•])\s*(.+)/i;

  for (const line of lines) {
    const match = line.match(topicRegex);
    if (match && match[2]) {
      const topicName = match[2].trim().replace(/^[:.-]\s*/, '');
      if (topicName.length > 3 && topicName.length < 80) {
        rawTopics.push(topicName);
      }
    }
  }

  if (rawTopics.length < 3) {
    rawTopics = lines.slice(1).filter(l => l.length > 10 && l.length < 90).slice(0, 8);
  }
  if (rawTopics.length === 0) {
    rawTopics = [
      "Core Foundations & Setup",
      "Key Principles & Theory",
      "Practical Hands-On Drills",
      "Advanced Techniques & Edge Cases",
      "Capstone Project & Review"
    ];
  }

  const deadline = new Date();
  deadline.setDate(deadline.getDate() + (parseInt(targetWeeks) || 4) * 7);
  // Helper to extract domain-specific skills according to the syllabus
  function extractSkillsFromSyllabus(title, topics) {
    const iconMap = {
      code: '💻', algo: '🧠', tree: '🌳', graph: '🕸️', dp: '⚡', dynamic: '⚡',
      array: '🔍', string: '📜', stack: '🥞', queue: '📬', list: '🔗', react: '⚛️',
      node: '🚀', api: '🔌', db: '🗄️', data: '📊', sql: '🗄️', auth: '🔐', security: '🛡️',
      python: '🐍', oop: '🧱', design: '🎨', ui: '🎨', test: '🧪', math: '📐',
      physic: '⚛️', system: '⚙️', cache: '⚡', network: '🌐', dev: '💻', model: '🤖',
      stat: '📈', sort: '🔀', recur: '🔄'
    };

    const extracted = [];
    const used = new Set();

    topics.forEach((t, idx) => {
      const clean = t
        .replace(/^(unit|module|chapter|week|topic)\s*\d+[:.-]?\s*/i, '')
        .split(/[,&:-]/)[0]
        .trim();

      if (clean.length > 2 && !used.has(clean.toLowerCase()) && extracted.length < 5) {
        used.add(clean.toLowerCase());
        const lower = clean.toLowerCase();
        let icon = '💡';
        for (const [key, ic] of Object.entries(iconMap)) {
          if (lower.includes(key)) {
            icon = ic;
            break;
          }
        }
        extracted.push({
          id: `skill_${idx}_${clean.toLowerCase().replace(/[^a-z0-9]/g, '_').slice(0, 15)}`,
          name: clean,
          icon,
          level: 1,
          xp: 0
        });
      }
    });

    if (extracted.length === 0) {
      extracted.push(
        { id: "core_foundations", name: "Core Foundations", icon: "🏛️", level: 1, xp: 0 },
        { id: "applied_methods", name: "Applied Methods", icon: "🧠", level: 1, xp: 0 },
        { id: "domain_mastery", name: "Domain Mastery", icon: "⚔️", level: 1, xp: 0 }
      );
    }
    return extracted;
  }

  const skills = extractSkillsFromSyllabus(courseTitle, rawTopics);
  const timestamp = Date.now();
  const quests = rawTopics.map((topic, idx) => {
    const questId = `quest_${timestamp}_${idx + 1}`;
    const prevId = idx === 0 ? "" : `quest_${timestamp}_${idx}`;
    const assignedSkill = skills[idx % skills.length];
    const questDifficulty = idx === 0 ? 'easy' : (idx === rawTopics.length - 1 ? 'epic' : 'medium');
    const challenges = generateChallengesForTopic(topic, assignedSkill.id, idx, userProblems);

    return {
      id: questId,
      title: topic,
      description: `Deep-dive and conquer ${topic}. Review materials, solve attached challenges, and earn skill XP.`,
      type: idx % 3 === 0 ? 'learn' : (idx % 3 === 1 ? 'practice' : 'challenge'),
      difficulty: questDifficulty,
      xpReward: 50 + (idx * 25),
      coinReward: 20 + (idx * 15),
      skillId: assignedSkill.id,
      skillName: assignedSkill.name,
      prerequisiteId: prevId,
      status: idx === 0 ? 'available' : 'locked',
      challenges
    };
  });

  return {
    goal: {
      title: courseTitle,
      description: `Automated RPG campaign generated from syllabus and problem sets. Complete sequenced quests and challenges to master ${courseTitle}.`,
      category: 'Skill Mastery',
      difficulty: preferredDifficulty || 'medium',
      deadline: deadlineStr,
      level: 1,
      xp: 0,
      coins: 0,
      streak: 1,
      skills: skills
    },
    skills,
    quests,
    boss: {
      name: `Guardian of ${courseTitle.split(' ').slice(0, 3).join(' ')}`,
      description: `The ultimate milestone boss. Solve all quests and interactive challenges to vanquish this adversary!`,
      maxHp: Math.max(quests.length, 5)
    }
  };
}

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
      const res = await fetch('/api/ai/generate-campaign', {
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
