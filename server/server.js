const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const FALLBACK_QUESTIONS = [
  {
    category: "Science: Computers",
    type: "multiple",
    difficulty: "medium",
    question: "In web development, what does CSS stand for?",
    correct_answer: "Cascading Style Sheets",
    incorrect_answers: ["Computer Style System", "Creative Styling Syntax", "Central Sheet Solution"]
  },
  {
    category: "Science: Computers",
    type: "multiple",
    difficulty: "easy",
    question: "What does HTML stand for?",
    correct_answer: "HyperText Markup Language",
    incorrect_answers: ["HighText Machine Language", "Hyperlink Textual Markup Leveler", "Home Tool Markup Language"]
  },
  {
    category: "Mythology & Lore",
    type: "multiple",
    difficulty: "medium",
    question: "In Norse mythology, what is the name of Thor's hammer?",
    correct_answer: "Mjölnir",
    incorrect_answers: ["Gungnir", "Gram", "Tyrfing"]
  },
  {
    category: "General Knowledge",
    type: "multiple",
    difficulty: "easy",
    question: "Which planet in our solar system is known as the Red Planet?",
    correct_answer: "Mars",
    incorrect_answers: ["Venus", "Jupiter", "Saturn"]
  },
  {
    category: "Video Games",
    type: "multiple",
    difficulty: "easy",
    question: "In The Legend of Zelda series, who is the green-clad protagonist?",
    correct_answer: "Link",
    incorrect_answers: ["Zelda", "Ganon", "Epona"]
  },
  {
    category: "Science & Nature",
    type: "multiple",
    difficulty: "medium",
    question: "What is the powerhouse organelle of the eukaryotic cell?",
    correct_answer: "Mitochondria",
    incorrect_answers: ["Ribosome", "Endoplasmic Reticulum", "Golgi Apparatus"]
  }
];

// Proxy endpoint for Open Trivia DB with resilient fallback
app.get('/api/trivia', async (req, res) => {
  try {
    const response = await axios.get('https://opentdb.com/api.php?amount=1', { timeout: 3500 });
    if (response.data && response.data.results && response.data.results.length > 0) {
      return res.json(response.data);
    }
    throw new Error('Empty response from external trivia API');
  } catch (error) {
    console.warn('External trivia API unavailable, serving curated question:', error.message);
    const randomIndex = Math.floor(Math.random() * FALLBACK_QUESTIONS.length);
    res.json({
      response_code: 0,
      results: [FALLBACK_QUESTIONS[randomIndex]],
      source: 'curated_fallback'
    });
  }
});

// Helper: Generate rich interactive challenges for each quest topic
function generateChallengesForTopic(topic, skill, idx, userProblems = []) {
  const cleanTopic = topic.replace(/^(unit|module|chapter|week)\s*\d+[:.-]?\s*/i, '');
  const challenges = [];

  // 1. Concept Quiz Check
  challenges.push({
    id: `chal_${idx + 1}_quiz`,
    type: 'quiz',
    title: `${cleanTopic} Concept Check`,
    prompt: `When working with ${cleanTopic}, what is the most critical principle or invariant to keep in mind?`,
    options: [
      `Enforce modular boundaries, validate preconditions, and handle edge cases first.`,
      `Skip base-case checks and rely solely on external try-catch blocks.`,
      `Always maximize memory allocation to avoid recalculation, regardless of constraints.`,
      `Combine all logic into a single monolithic routine to minimize function overhead.`
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
      prompt: typeof userProblem === 'string' ? userProblem : (userProblem.prompt || `Solve the problem for ${cleanTopic}`),
      starterCode: skill === 'coding'
        ? `/**\n * Challenge: ${cleanTopic}\n * Implement the function below:\n */\nfunction solve(input) {\n  // Write your solution here\n  return null;\n}`
        : `Exercise Plan for ${cleanTopic}:\n1. Analysis:\n2. Core Steps:\n3. Validation:`,
      hints: [
        `Break the problem into small testable units before writing full implementation.`,
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

// Helper: Intelligent local syllabus & problem set parser when no API key or offline
function generateLocalCampaign(syllabusText, problemSetText = '', targetWeeks = 4, preferredDifficulty = 'medium', explicitTitle = '') {
  const lines = syllabusText
    .split(/\r?\n/)
    .map(l => l.trim())
    .filter(l => l.length > 0);

  // Extract possible course title
  let courseTitle = explicitTitle && explicitTitle.trim() ? explicitTitle.trim() : "Custom Learning Campaign";
  if (!explicitTitle || !explicitTitle.trim()) {
    if (lines.length > 0) {
      const firstLine = lines[0].replace(/^[#*-]\s*/, '').replace(/^(course|syllabus|module|subject|unit|chapter):\s*/i, '');
      if (firstLine.length < 60) {
        courseTitle = firstLine.replace(/^[:.-]\s*/, '');
      }
    }
  }

  // Extract user problem set items if provided
  let userProblems = [];
  if (problemSetText && problemSetText.trim()) {
    userProblems = problemSetText
      .split(/\r?\n/)
      .map(l => l.trim())
      .filter(l => l.length > 5 && !l.startsWith('#'));
  }

  // Extract topic items
  let rawTopics = [];
  const topicRegex = /^(\d+[\.\)]|module\s*\d+|unit\s*\d+|chapter\s*\d+|week\s*\d+|[-*•])\s*(.+)/i;

  for (const line of lines) {
    const match = line.match(topicRegex);
    if (match && match[2]) {
      const topicName = match[2].trim().replace(/^[:.-]\s*/, '');
      if (topicName.length > 3 && topicName.length < 80) {
        rawTopics.push(topicName);
      }
    }
  }

  // If regex didn't catch structured items, chunk by paragraphs/lines
  if (rawTopics.length < 3) {
    rawTopics = lines.slice(1).filter(l => l.length > 10 && l.length < 90).slice(0, 10);
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

  // Calculate deadline based on targetWeeks
  const deadline = new Date();
  deadline.setDate(deadline.getDate() + (parseInt(targetWeeks) || 4) * 7);
  const deadlineStr = deadline.toISOString().split('T')[0];
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
      description: `Deep-dive and conquer ${topic}. Review materials, solve attached problem challenges, and earn XP.`,
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

// AI Campaign Generator Endpoint
app.post('/api/ai/generate-campaign', async (req, res) => {
  const { syllabusText, problemSetText = '', targetWeeks = 4, difficulty = 'medium', curriculumTitle = '', apiKey } = req.body;

  if (!syllabusText || syllabusText.trim().length === 0) {
    return res.status(400).json({ error: 'Please provide syllabus text or topics' });
  }

  const activeKey = apiKey || process.env.GEMINI_API_KEY;

  if (activeKey) {
    try {
      const prompt = `You are an elite RPG quest designer and curriculum architect. Convert this syllabus and problem sets into a gamified, sequential RPG quest campaign for personal skill development.
${curriculumTitle ? `Course Title: "${curriculumTitle}"` : ''}
Rules:
1. Break into 4 to 8 sequential quests.
2. The first quest MUST have prerequisiteId: "".
3. Every subsequent quest MUST have prerequisiteId equal to the previous quest's id (forming a clean locked progression chain).
4. EXTRACT 3 to 6 core domain skills SPECIFIC TO THIS SYLLABUS (e.g. for DSA: Trees & Graphs, Dynamic Programming, Arrays & Pointers; for Web Dev: React Architecture, REST APIs, Database Modeling; for Physics: Kinematics, Dynamics, Energy). Assign each quest's skillId to one of these extracted skills!
5. Set types to one of: "learn", "build", "practice", "challenge".
6. Target deadline: ${targetWeeks} weeks from today (${new Date().toISOString().split('T')[0]}).
7. FOR EACH QUEST, generate an array of 2 interactive "challenges":
   - One "quiz" (multiple choice with title, prompt, 4 options array, correctAnswer index 0-3, and explanation)
   - One "coding" or "exercise" (with title, prompt, starterCode, 2 hints array, solution, and explanation). If problem sets are provided, incorporate them directly into these challenges!

Syllabus content:
"""
${syllabusText.slice(0, 5000)}
"""

Problem Set / Drills (if any):
"""
${(problemSetText || 'None provided; please generate tailored, realistic challenge problems for each quest topic.').slice(0, 3000)}
"""

Respond ONLY with a valid JSON object matching this schema:
{
  "goal": {
    "title": "${curriculumTitle || 'Short Epic Goal Title'}",
    "description": "Engaging description",
    "category": "e.g. Computer Science or Mathematics",
    "difficulty": "${difficulty}",
    "deadline": "YYYY-MM-DD",
    "level": 1,
    "xp": 0,
    "coins": 0,
    "streak": 1
  },
  "skills": [
    {
      "id": "skill_1",
      "name": "Skill Name From Syllabus",
      "icon": "relevant emoji icon (e.g. 🌳, ⚡, 🔍)",
      "level": 1,
      "xp": 0
    }
  ],
  "quests": [
    {
      "id": "q1",
      "title": "Quest Title",
      "description": "Clear actionable instructions",
      "type": "practice",
      "difficulty": "easy",
      "xpReward": 60,
      "coinReward": 25,
      "skillId": "skill_1",
      "prerequisiteId": "",
      "status": "available",
      "challenges": [
        {
          "id": "c1_1",
          "type": "quiz",
          "title": "Concept Check",
          "prompt": "Question text...",
          "options": ["A", "B", "C", "D"],
          "correctAnswer": 0,
          "explanation": "Why this is correct..."
        },
        {
          "id": "c1_2",
          "type": "coding",
          "title": "Practice Problem",
          "prompt": "Challenge prompt to solve...",
          "starterCode": "function solve() {\\n  // code\\n}",
          "hints": ["Hint 1", "Hint 2"],
          "solution": "function solve() {\\n  return true;\\n}",
          "explanation": "Detailed explanation..."
        }
      ]
    }
  ],
  "boss": {
    "name": "Boss Name (e.g. The Recursion Colossus)",
    "description": "Epic description of final challenge",
    "maxHp": 5
  }
}`;

      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${activeKey}`;
      const response = await axios.post(
        geminiUrl,
        {
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { response_mime_type: "application/json" }
        },
        { timeout: 14000 }
      );

      const candidateText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (candidateText) {
        const parsed = JSON.parse(candidateText);
        // Normalize IDs to prevent collisions
        const timestamp = Date.now();
        const idMap = {};
        parsed.quests.forEach((q, i) => {
          const newId = `quest_${timestamp}_${i + 1}`;
          idMap[q.id] = newId;
          q.id = newId;
        });
        parsed.quests.forEach((q, i) => {
          if (i === 0) {
            q.prerequisiteId = "";
            q.status = "available";
          } else {
            q.prerequisiteId = idMap[q.prerequisiteId] || `quest_${timestamp}_${i}`;
            q.status = "locked";
          }
          // Ensure challenges array exists
          if (!q.challenges || !Array.isArray(q.challenges)) {
            q.challenges = generateChallengesForTopic(q.title, q.skillId || 'coding', i);
          }
        });

        return res.json({
          success: true,
          source: 'gemini_ai',
          campaign: parsed
        });
      }
    } catch (err) {
      console.warn('Gemini API call failed or timed out, falling back to local NLP generator:', err.message);
    }
  }

  // Fallback to intelligent local NLP generation with problem set support
  const localCampaign = generateLocalCampaign(syllabusText, problemSetText, targetWeeks, difficulty, curriculumTitle);
  return res.json({
    success: true,
    source: 'local_nlp_forge',
    campaign: localCampaign
  });
});

app.listen(PORT, () => {
  console.log(`Minimal API Proxy Server running on port ${PORT}`);
});

