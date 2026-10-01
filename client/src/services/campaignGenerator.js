/**
 * campaignGenerator.js
 * Intelligent local syllabus & problem set parser when offline or without external AI
 */

export const PRESETS = [
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

const SKILL_ICONS = {
  code: '💻', algo: '🧠', tree: '🌳', graph: '🕸️', dp: '⚡', dynamic: '⚡',
  array: '🔍', string: '📜', stack: '🥞', queue: '📬', list: '🔗', react: '⚛️',
  node: '🚀', api: '🔌', db: '🗄️', data: '📊', sql: '🗄️', auth: '🔐', security: '🛡️',
  python: '🐍', oop: '🧱', design: '🎨', ui: '🎨', test: '🧪', math: '📐',
  physic: '⚛️', system: '⚙️', cache: '⚡', network: '🌐', dev: '💻', model: '🤖',
  stat: '📈', sort: '🔀', recur: '🔄'
};

export function extractSkillsFromSyllabus(title, topics) {
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
      const matchedKey = Object.keys(SKILL_ICONS).find(k => lower.includes(k));
      extracted.push({
        id: `skill_${idx}_${clean.toLowerCase().replace(/[^a-z0-9]/g, '_').slice(0, 15)}`,
        name: clean,
        icon: matchedKey ? SKILL_ICONS[matchedKey] : '💡',
        level: 1,
        xp: 0
      });
    }
  });

  return extracted.length > 0
    ? extracted
    : [
        { id: "core_foundations", name: "Core Foundations", icon: "🏛️", level: 1, xp: 0 },
        { id: "applied_methods", name: "Applied Methods", icon: "🧠", level: 1, xp: 0 },
        { id: "domain_mastery", name: "Domain Mastery", icon: "⚔️", level: 1, xp: 0 }
      ];
}

export function generateChallengesForTopic(topic, skill, idx, userProblems = []) {
  const cleanTopic = topic.replace(/^(unit|module|chapter|week|topic)\s*\d+[:.-]?\s*/i, '');
  const userProblem = userProblems.length > 0 ? userProblems[idx % userProblems.length] : null;

  return [
    {
      id: `chal_${idx + 1}_quiz`,
      type: 'quiz',
      title: `${cleanTopic} Concept Check`,
      prompt: `When mastering "${cleanTopic}", what is the primary architectural principle or invariant to maintain?`,
      options: [
        `Proactive boundary validation, modular structure, and handling edge cases first.`,
        `Skip all test cases and rely exclusively on external catch-all error handlers.`,
        `Allocate unrestricted memory to skip computations without measuring constraints.`,
        `Inline all helper procedures into a monolithic block to bypass function calls.`
      ],
      correctAnswer: 0,
      explanation: `Proactive boundary checking, input validation, and clean modularity are foundational when mastering ${cleanTopic}.`
    },
    {
      id: `chal_${idx + 1}_drill`,
      type: skill === 'coding' ? 'coding' : 'exercise',
      title: userProblem ? `${cleanTopic} Challenge Problem` : `${cleanTopic} Implementation Drill`,
      prompt: userProblem
        ? (typeof userProblem === 'string' ? userProblem : (userProblem.prompt || `Solve the problem for ${cleanTopic}`))
        : (skill === 'coding'
            ? `Implement a clean, robust algorithm or component for "${cleanTopic}". Write test assertions for at least 2 edge cases.`
            : `Formulate a concrete real-world problem and solve it using principles of "${cleanTopic}".`),
      starterCode: skill === 'coding'
        ? `/**\n * Challenge: ${cleanTopic}\n * Implement the function below:\n */\nfunction solve(input) {\n  // Write your solution here\n  return null;\n}`
        : `Checklist for ${cleanTopic}:\n- [ ] Define the objective\n- [ ] Formulate approach\n- [ ] Document solution and key trade-offs`,
      hints: [
        `Break the problem into small testable units before writing full implementation.`,
        `Consider time vs. space complexity and check for null/empty boundary inputs.`
      ],
      solution: `// Verified solution approach for ${cleanTopic}\n// Ensure all test conditions pass and invariants hold.`,
      explanation: `Careful breakdown of edge cases and algorithmic invariants leads to the optimal solution.`
    }
  ];
}

export function generateLocalCampaign(syllabusText, problemSetText = '', targetWeeks = 4, preferredDifficulty = 'medium', explicitTitle = '') {
  const lines = syllabusText
    .split(/\r?\n/)
    .map(l => l.trim())
    .filter(l => l.length > 0);

  let courseTitle = explicitTitle?.trim() || (lines.length > 0 ? lines[0].replace(/^[#*-]\s*/, '').replace(/^(course|syllabus|module|subject|unit|chapter):\s*/i, '').slice(0, 60).replace(/^[:.-]\s*/, '') : "Custom Learning Campaign");

  const userProblems = problemSetText?.trim()
    ? problemSetText.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 5 && !l.startsWith('#'))
    : [];

  const topicRegex = /^(\d+[\.\)]|module\s*\d+|unit\s*\d+|chapter\s*\d+|week\s*\d+|topic\s*\d+|[-*•])\s*(.+)/i;
  let rawTopics = [];

  for (const line of lines) {
    const match = line.match(topicRegex);
    if (match?.[2]) {
      const name = match[2].trim().replace(/^[:.-]\s*/, '');
      if (name.length > 3 && name.length < 80) rawTopics.push(name);
    }
  }

  if (rawTopics.length < 3) {
    rawTopics = lines.slice(1).filter(l => l.length > 10 && l.length < 90).slice(0, 8);
  }
  if (rawTopics.length === 0) {
    rawTopics = ["Core Foundations & Setup", "Key Principles & Theory", "Practical Hands-On Drills", "Advanced Techniques & Edge Cases", "Capstone Project & Review"];
  }

  const deadline = new Date();
  deadline.setDate(deadline.getDate() + (parseInt(targetWeeks) || 4) * 7);
  const deadlineStr = deadline.toISOString().split('T')[0];

  const skills = extractSkillsFromSyllabus(courseTitle, rawTopics);
  const timestamp = Date.now();

  const quests = rawTopics.map((topic, idx) => {
    const assignedSkill = skills[idx % skills.length];
    return {
      id: `quest_${timestamp}_${idx + 1}`,
      title: topic,
      description: `Deep-dive and conquer ${topic}. Review materials, solve attached problem challenges, and earn XP.`,
      type: idx % 3 === 0 ? 'learn' : (idx % 3 === 1 ? 'practice' : 'challenge'),
      difficulty: idx === 0 ? 'easy' : (idx === rawTopics.length - 1 ? 'epic' : 'medium'),
      xpReward: 50 + (idx * 25),
      coinReward: 20 + (idx * 15),
      skillId: assignedSkill.id,
      skillName: assignedSkill.name,
      prerequisiteId: idx === 0 ? "" : `quest_${timestamp}_${idx}`,
      status: idx === 0 ? 'available' : 'locked',
      challenges: generateChallengesForTopic(topic, assignedSkill.id, idx, userProblems)
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
      skills
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
