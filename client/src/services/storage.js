/**
 * storage.js
 * Helper functions for interacting with localStorage
 */

const getFromStorage = (key, defaultValue) => {
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.warn(`Error reading localStorage key "${key}":`, error);
    return defaultValue;
  }
};

const saveToStorage = (key, value) => {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn(`Error setting localStorage key "${key}":`, error);
  }
};

export const getPlayer = () => getFromStorage('lifequest_player', {
  name: "Player",
  level: 1,
  xp: 0,
  totalXp: 0,
  coins: 0,
  streak: 0,
  longestStreak: 0,
  lastActiveDate: new Date().toISOString().split('T')[0],
  title: "Beginner",
  unlockedTitles: ["Beginner"],
  achievements: [
    {
      id: "quest_master",
      name: "Quest Master",
      description: "Complete 50 quests",
      icon: "🏆",
      unlocked: false
    },
    {
      id: "streak_hero",
      name: "Streak Hero",
      description: "Maintain a 7‑day login streak",
      icon: "🔥",
      unlocked: false
    },
    {
      id: "skill_pro",
      name: "Skill Pro",
      description: "Reach level 5 in any skill",
      icon: "💡",
      unlocked: false
    },
    {
      id: "coin_collector",
      name: "Coin Collector",
      description: "Accumulate 500 coins",
      icon: "💰",
      unlocked: false
    }
  ],
  skills: []
});

export const savePlayer = (player) => saveToStorage('lifequest_player', player);

// Unlock achievement helper
export const unlockAchievement = (id) => {
  const player = getPlayer();
  const updated = player.achievements.map(a =>
    a.id === id ? { ...a, unlocked: true } : a
  );
  savePlayer({ ...player, achievements: updated });
  return updated.find(a => a.id === id);
};

export const DEFAULT_INITIAL_CAMPAIGN = {
  id: "goal_dsa_mastery",
  title: "Data Structures & Algorithms",
  description: "Master algorithmic patterns, space-time complexity, and core data structures through interactive coding challenges.",
  category: "Computer Science",
  difficulty: "medium",
  deadline: new Date(Date.now() + 28 * 86400000).toISOString().split('T')[0],
  level: 1,
  xp: 0,
  coins: 0,
  streak: 1,
  lastActiveDate: new Date().toISOString().split('T')[0],
  skills: [
    { id: "arrays_pointers", name: "Arrays & Sliding Window", icon: "🔍", level: 1, xp: 0 },
    { id: "linked_lists", name: "Linked Lists & Pointers", icon: "🔗", level: 1, xp: 0 },
    { id: "stacks_queues", name: "Stacks & Queues", icon: "🥞", level: 1, xp: 0 },
    { id: "trees_graphs", name: "Trees & Graph Traversals", icon: "🌳", level: 1, xp: 0 },
    { id: "dynamic_prog", name: "Dynamic Programming", icon: "⚡", level: 1, xp: 0 }
  ],
  quests: [
    {
      id: "quest_dsa_1",
      goalId: "goal_dsa_mastery",
      title: "Arrays, Two Pointers & Sliding Window",
      description: "Conquer sorted array pointer traversal and contiguous subarray bounds.",
      type: "practice",
      difficulty: "easy",
      xpReward: 60,
      coinReward: 25,
      skillId: "arrays_pointers",
      prerequisiteId: "",
      status: "available",
      challenges: [
        {
          id: "chal_dsa_1_1",
          type: "quiz",
          title: "Two Pointers Invariant",
          prompt: "In a sorted array, why does moving the right pointer inward decrease the sum?",
          options: [
            "Because elements are in non-decreasing order, so array[right - 1] <= array[right].",
            "Because array indices become negative.",
            "Because the array is reversed automatically.",
            "Because sliding window always resets to zero."
          ],
          correctAnswer: 0,
          explanation: "In a sorted array, moving the right pointer leftward picks an element less than or equal to the current, decreasing the sum monotonically."
        },
        {
          id: "chal_dsa_1_2",
          type: "coding",
          title: "Two Sum II (Sorted Array)",
          prompt: "Given a 1-indexed sorted array of integers nums and a target, find two numbers that add up to target with O(1) space.",
          starterCode: "function twoSum(numbers, target) {\n  let left = 0, right = numbers.length - 1;\n  while (left < right) {\n    const sum = numbers[left] + numbers[right];\n    if (sum === target) return [left + 1, right + 1];\n    if (sum < target) left++;\n    else right--;\n  }\n  return [];\n}",
          hints: [
            "Initialize left pointer at start (0) and right pointer at end (n-1).",
            "If current sum < target, advance left. If current sum > target, decrement right."
          ],
          solution: "function twoSum(numbers, target) {\n  let left = 0, right = numbers.length - 1;\n  while (left < right) {\n    const sum = numbers[left] + numbers[right];\n    if (sum === target) return [left + 1, right + 1];\n    if (sum < target) left++;\n    else right--;\n  }\n  return [];\n}",
          explanation: "Two pointers converge in O(N) time and O(1) auxiliary space by exploiting the sorted property."
        }
      ]
    },
    {
      id: "quest_dsa_2",
      goalId: "goal_dsa_mastery",
      title: "Linked Lists & Fast/Slow Pointers",
      description: "Detect cycles and find list midpoints using Floyd's Tortoise and Hare algorithm.",
      type: "practice",
      difficulty: "medium",
      xpReward: 80,
      coinReward: 35,
      skillId: "linked_lists",
      prerequisiteId: "quest_dsa_1",
      status: "locked",
      challenges: [
        {
          id: "chal_dsa_2_1",
          type: "quiz",
          title: "Cycle Detection Complexity",
          prompt: "What is the space complexity of detecting a cycle in a linked list using Floyd's Tortoise and Hare algorithm?",
          options: [
            "O(1) extra space",
            "O(N) extra space",
            "O(log N) extra space",
            "O(N^2) extra space"
          ],
          correctAnswer: 0,
          explanation: "Floyd's algorithm only maintains two pointer references (slow and fast), requiring O(1) memory."
        },
        {
          id: "chal_dsa_2_2",
          type: "coding",
          title: "Detect Linked List Cycle",
          prompt: "Implement hasCycle(head) using slow and fast pointers. Return true if there is a cycle, false otherwise.",
          starterCode: "function hasCycle(head) {\n  let slow = head, fast = head;\n  while (fast && fast.next) {\n    slow = slow.next;\n    fast = fast.next.next;\n    if (slow === fast) return true;\n  }\n  return false;\n}",
          hints: [
            "Slow pointer advances 1 step, fast advances 2 steps.",
            "If fast reaches null, there is no cycle."
          ],
          solution: "function hasCycle(head) {\n  let slow = head, fast = head;\n  while (fast && fast.next) {\n    slow = slow.next;\n    fast = fast.next.next;\n    if (slow === fast) return true;\n  }\n  return false;\n}",
          explanation: "If a loop exists, the relative speed difference of 1 node/step guarantees the fast pointer will lap and meet the slow pointer."
        }
      ]
    },
    {
      id: "quest_dsa_3",
      goalId: "goal_dsa_mastery",
      title: "Binary Trees & Traversals (DFS/BFS)",
      description: "Master tree node recursion, level-order queues, and subtree invariants.",
      type: "practice",
      difficulty: "medium",
      xpReward: 100,
      coinReward: 40,
      skillId: "trees_graphs",
      prerequisiteId: "quest_dsa_2",
      status: "locked",
      challenges: [
        {
          id: "chal_dsa_3_1",
          type: "quiz",
          title: "Level Order Traversal",
          prompt: "Which data structure is standard for implementing level-order BFS traversal in a binary tree?",
          options: [
            "FIFO Queue",
            "LIFO Stack",
            "Min-Heap",
            "Hash Table"
          ],
          correctAnswer: 0,
          explanation: "A FIFO Queue ensures nodes on the current level are processed before child nodes on the next level."
        },
        {
          id: "chal_dsa_3_2",
          type: "coding",
          title: "Invert Binary Tree",
          prompt: "Given root of a binary tree, invert the tree recursively and return its root.",
          starterCode: "function invertTree(root) {\n  if (!root) return null;\n  const temp = root.left;\n  root.left = invertTree(root.right);\n  root.right = invertTree(temp);\n  return root;\n}",
          hints: [
            "Base case: if node is null, return null.",
            "Recursively invert left and right child subtrees, then swap them."
          ],
          solution: "function invertTree(root) {\n  if (!root) return null;\n  const temp = root.left;\n  root.left = invertTree(root.right);\n  root.right = invertTree(temp);\n  return root;\n}",
          explanation: "Inverts subtrees bottom-up or top-down in O(N) time visiting each node exactly once."
        }
      ]
    },
    {
      id: "quest_dsa_4",
      goalId: "goal_dsa_mastery",
      title: "Dynamic Programming & Tabulation",
      description: "Break complex optimization problems into overlapping subproblems with optimal substructure.",
      type: "challenge",
      difficulty: "epic",
      xpReward: 140,
      coinReward: 60,
      skillId: "dynamic_prog",
      prerequisiteId: "quest_dsa_3",
      status: "locked",
      challenges: [
        {
          id: "chal_dsa_4_1",
          type: "quiz",
          title: "Optimal Substructure",
          prompt: "What two properties must a problem have to be solvable using Dynamic Programming?",
          options: [
            "Overlapping Subproblems and Optimal Substructure.",
            "Greedy Choice Property and Divide and Conquer.",
            "Monotonic Ordering and Random Access.",
            "Asymptotic Linearity and Continuous Convergence."
          ],
          correctAnswer: 0,
          explanation: "Dynamic programming caches the answers to overlapping subproblems where the optimal solution to the problem contains optimal solutions to subproblems."
        },
        {
          id: "chal_dsa_4_2",
          type: "coding",
          title: "Coin Change (Bottom-Up)",
          prompt: "Given coins array and total amount, return the fewest number of coins needed to make up that amount, or -1 if impossible.",
          starterCode: "function coinChange(coins, amount) {\n  const dp = new Array(amount + 1).fill(Infinity);\n  dp[0] = 0;\n  for (let i = 1; i <= amount; i++) {\n    for (const c of coins) {\n      if (i - c >= 0) dp[i] = Math.min(dp[i], dp[i - c] + 1);\n    }\n  }\n  return dp[amount] === Infinity ? -1 : dp[amount];\n}",
          hints: [
            "Initialize dp array of size amount + 1 with Infinity, dp[0] = 0.",
            "For each coin c and value i from 1 to amount, dp[i] = min(dp[i], dp[i - c] + 1)."
          ],
          solution: "function coinChange(coins, amount) {\n  const dp = new Array(amount + 1).fill(Infinity);\n  dp[0] = 0;\n  for (let i = 1; i <= amount; i++) {\n    for (const c of coins) {\n      if (i - c >= 0) dp[i] = Math.min(dp[i], dp[i - c] + 1);\n    }\n  }\n  return dp[amount] === Infinity ? -1 : dp[amount];\n}",
          explanation: "Solves the unbounded knapsack / coin change in O(amount * len(coins)) time using 1D tabulation."
        }
      ]
    }
  ],
  boss: {
    name: "The Recursion Colossus",
    description: "The ultimate milestone boss of the DSA curriculum. Solve all quests and interactive drills to strike down the Colossus!",
    maxHp: 4
  }
};

const DOMAIN_PRESET_SKILLS = [
  {
    keys: ['dsa', 'algorithm', 'data structure'],
    skills: [
      { id: "arrays_pointers", name: "Arrays & Sliding Window", icon: "🔍", level: 1, xp: 0 },
      { id: "linked_lists", name: "Linked Lists & Pointers", icon: "🔗", level: 1, xp: 0 },
      { id: "stacks_queues", name: "Stacks & Queues", icon: "🥞", level: 1, xp: 0 },
      { id: "trees_graphs", name: "Trees & Graph Traversals", icon: "🌳", level: 1, xp: 0 },
      { id: "dynamic_prog", name: "Dynamic Programming", icon: "⚡", level: 1, xp: 0 }
    ]
  },
  {
    keys: ['web', 'fullstack', 'full-stack', 'react'],
    skills: [
      { id: "frontend_ui", name: "Modern React & State Architecture", icon: "⚛️", level: 1, xp: 0 },
      { id: "backend_apis", name: "Node.js REST & Async Services", icon: "🔌", level: 1, xp: 0 },
      { id: "database_sql", name: "Database Modeling & Indexes", icon: "🗄️", level: 1, xp: 0 },
      { id: "security_auth", name: "Authentication & Web Security", icon: "🛡️", level: 1, xp: 0 },
      { id: "devops_cloud", name: "Deployment & CI/CD Pipelines", icon: "☁️", level: 1, xp: 0 }
    ]
  },
  {
    keys: ['python'],
    skills: [
      { id: "py_core", name: "Core Python & Data Types", icon: "🐍", level: 1, xp: 0 },
      { id: "py_functional", name: "Comprehensions & Generators", icon: "⚡", level: 1, xp: 0 },
      { id: "py_oop", name: "OOP & Magic Dunder Methods", icon: "🏗️", level: 1, xp: 0 },
      { id: "py_async", name: "Asyncio & Concurrency", icon: "🔄", level: 1, xp: 0 },
      { id: "py_testing", name: "Pytest & Profiling", icon: "🧪", level: 1, xp: 0 }
    ]
  },
  {
    keys: ['system', 'design', 'scale'],
    skills: [
      { id: "sys_lb", name: "Load Balancing & Reverse Proxies", icon: "⚖️", level: 1, xp: 0 },
      { id: "sys_cache", name: "Distributed Caching (Redis/Memcached)", icon: "🚀", level: 1, xp: 0 },
      { id: "sys_db", name: "Database Sharding & Replication", icon: "🗄️", level: 1, xp: 0 },
      { id: "sys_queues", name: "Async Message Queues (Kafka/RabbitMQ)", icon: "📬", level: 1, xp: 0 },
      { id: "sys_rate", name: "Rate Limiting & Resiliency", icon: "🛡️", level: 1, xp: 0 }
    ]
  }
];

export const normalizeGoal = (goal) => {
  if (!goal) return goal;
  const normalized = { ...goal };
  if (typeof normalized.level !== 'number') normalized.level = 1;
  if (typeof normalized.xp !== 'number') normalized.xp = 0;
  if (typeof normalized.coins !== 'number') normalized.coins = 0;
  if (typeof normalized.streak !== 'number') normalized.streak = 1;

  // Ensure skills exist according to the syllabus topics/domain
  if (!Array.isArray(normalized.skills) || normalized.skills.length === 0) {
    const titleLower = (normalized.title || '').toLowerCase();
    const matched = DOMAIN_PRESET_SKILLS.find(d => d.keys.some(k => titleLower.includes(k)));

    if (matched) {
      normalized.skills = matched.skills;
    } else {
      const extracted = [];
      const questList = normalized.quests || [];
      questList.forEach((q, idx) => {
        if (q.title && extracted.length < 5) {
          const shortName = q.title.split(/[:,-]/)[0].trim().slice(0, 24);
          if (!extracted.some(s => s.name === shortName)) {
            extracted.push({
              id: `skill_${idx}_${Date.now()}`,
              name: shortName,
              icon: ['🎯', '💡', '⚡', '🧠', '🔬'][idx % 5],
              level: 1,
              xp: 0
            });
          }
        }
      });
      normalized.skills = extracted.length > 0 ? extracted : [
        { id: "core_foundations", name: `${normalized.title} Foundations`, icon: "📘", level: 1, xp: 0 },
        { id: "practical_application", name: "Problem Solving & Drills", icon: "⚡", level: 1, xp: 0 },
        { id: "advanced_mastery", name: "Advanced Projects & Mastery", icon: "🏆", level: 1, xp: 0 }
      ];
    }
  }

  // Ensure quests are linked to one of the syllabus skills
  if (Array.isArray(normalized.quests) && normalized.skills.length > 0) {
    normalized.quests = normalized.quests.map((q, idx) => {
      if (!q.skillId || !normalized.skills.some(s => s.id === q.skillId)) {
        const assigned = normalized.skills[idx % normalized.skills.length];
        return { ...q, skillId: assigned.id, skillName: assigned.name };
      }
      return q;
    });
  }

  return normalized;
};

export const getGoals = () => {
  const goals = getFromStorage('lifequest_goals', []);
  if (Array.isArray(goals) && goals.length > 0) {
    return goals.map(normalizeGoal);
  }
  return [];
};

export const saveGoals = (goals) => saveToStorage('lifequest_goals', goals);

export const getActiveGoalId = () => {
  const activeId = getFromStorage('lifequest_active_goal_id', null);
  const goals = getGoals();
  if (activeId && goals.some(g => g.id === activeId)) return activeId;
  return goals.length > 0 ? goals[0].id : null;
};

export const saveActiveGoalId = (id) => saveToStorage('lifequest_active_goal_id', id);

export const getQuests = () => getFromStorage('lifequest_quests', []);
export const saveQuests = (quests) => saveToStorage('lifequest_quests', quests);

export const getStats = () => getFromStorage('lifequest_stats', {
  dailyXp: {},
  dailyQuests: {},
  totalQuestsCompleted: 0,
  totalBossDefeated: 0
});
export const saveStats = (stats) => saveToStorage('lifequest_stats', stats);
