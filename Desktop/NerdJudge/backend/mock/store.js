/**
 * In-memory demo store when USE_IN_MEMORY=true (no MongoDB, no JWT).
 * Passwords are stored in plain text for local UI preview only.
 */
const crypto = require('crypto');

const USE = () => process.env.USE_IN_MEMORY === 'true';

const usersByEmail = new Map();
const usersById = new Map();
let problems = [];
let submissions = [];

function newId() {
  return crypto.randomBytes(12).toString('hex');
}

function seed() {
  usersByEmail.clear();
  usersById.clear();
  problems = [];
  submissions = [];

  const demo = {
    _id: 'aaaaaaaaaaaaaaaaaaaaaaa1',
    firstName: 'Alice',
    lastName: 'Demo',
    email: 'demo@nerdjudge.local',
    password: 'demo123',
  };
  const bob = {
    _id: 'aaaaaaaaaaaaaaaaaaaaaaa2',
    firstName: 'Bob',
    lastName: 'Builder',
    email: 'bob@nerdjudge.local',
    password: 'bob123',
  };
  usersByEmail.set(demo.email, demo);
  usersByEmail.set(bob.email, bob);
  usersById.set(demo._id, demo);
  usersById.set(bob._id, bob);

  problems = [
    {
      _id: 'bbbbbbbbbbbbbbbbbbbbbb01',
      title: 'A + B',
      description:
        'Read two integers from stdin and print their sum. This is a minimal example for the code runner.',
      difficulty: 'easy',
      tags: ['math', 'io'],
      testCases: [
        { input: '1 2', output: '3' },
        { input: '10 20', output: '30' },
      ],
    },
    {
      _id: 'bbbbbbbbbbbbbbbbbbbbbb02',
      title: 'Hello Name',
      description: 'Read a single word from stdin and print Hello followed by that word on one line.',
      difficulty: 'easy',
      tags: ['strings'],
      testCases: [{ input: 'NerdJudge', output: 'Hello NerdJudge' }],
    },
    {
      _id: 'bbbbbbbbbbbbbbbbbbbbbb03',
      title: 'Count vowels',
      description: 'Read a lowercase word and print the number of vowels (a,e,i,o,u) it contains.',
      difficulty: 'medium',
      tags: ['strings'],
      testCases: [
        { input: 'abcde', output: '2' },
        { input: 'rhythm', output: '0' },
      ],
    },
  ];

  const t = Date.now();
  submissions.push(
    {
      _id: 'ccccccccccccccccccccccc1',
      userId: demo._id,
      problemId: problems[0]._id,
      filePath: 'uploads/mock-demo.cpp',
      submittedAt: new Date(t - 86400000),
    },
    {
      _id: 'ccccccccccccccccccccccc2',
      userId: demo._id,
      problemId: problems[1]._id,
      filePath: 'uploads/mock-demo2.cpp',
      submittedAt: new Date(t - 3600000),
    },
    {
      _id: 'ccccccccccccccccccccccc3',
      userId: bob._id,
      problemId: problems[0]._id,
      filePath: 'uploads/mock-bob.cpp',
      submittedAt: new Date(t - 7200000),
    }
  );
}

function login(req, res) {
  const { email, password } = req.body;
  const u = usersByEmail.get((email || '').trim().toLowerCase());
  if (!u) {
    return res.status(404).json({ message: 'User does not exist', register: true });
  }
  if (u.password !== password) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }
  const token = `mock-${u._id}`;
  return res.status(200).json({ token, userId: u._id });
}

function register(req, res) {
  const { firstName, lastName, email, password } = req.body;
  const key = (email || '').trim().toLowerCase();
  if (usersByEmail.has(key)) {
    return res.status(400).json({ message: 'User already exists' });
  }
  const u = {
    _id: newId(),
    firstName,
    lastName,
    email: key,
    password,
  };
  usersByEmail.set(key, u);
  usersById.set(u._id, u);
  const token = `mock-${u._id}`;
  return res.status(200).json({ token, userId: u._id });
}

function getUserById(id) {
  return usersById.get(id) || null;
}

function toPublicUser(u) {
  if (!u) return null;
  return { _id: u._id, firstName: u.firstName, lastName: u.lastName, email: u.email };
}

function listAllUsersPublic() {
  return [...usersById.values()].map((u) => toPublicUser(u));
}

function getProblemsList(query) {
  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(query.limit, 10) || 10));
  const sortBy = query.sortBy || 'title';
  const sortOrder = query.sortOrder === 'desc' ? -1 : 1;
  const { difficulty, tags } = query;

  let list = [...problems];
  if (difficulty) {
    const d = String(difficulty).toLowerCase();
    list = list.filter((p) => String(p.difficulty).toLowerCase().includes(d));
  }
  if (tags) {
    const tagList = String(tags)
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);
    if (tagList.length) {
      list = list.filter((p) => tagList.some((t) => (p.tags || []).includes(t)));
    }
  }
  list.sort((a, b) => {
    const av = a[sortBy];
    const bv = b[sortBy];
    if (av < bv) return -1 * sortOrder;
    if (av > bv) return 1 * sortOrder;
    return 0;
  });
  const total = list.length;
  const slice = list.slice((page - 1) * limit, page * limit);
  return {
    problems: slice,
    totalPages: Math.max(1, Math.ceil(total / limit)),
    currentPage: page,
  };
}

function getProblemById(id) {
  return problems.find((p) => p._id === id) || null;
}

function createProblem(body) {
  const { title, description, difficulty, testCases, tags } = body;
  const p = {
    _id: newId(),
    title,
    description,
    difficulty,
    tags: Array.isArray(tags) ? tags.filter(Boolean) : [],
    testCases: Array.isArray(testCases) ? testCases : [],
  };
  problems.push(p);
  return p;
}

function addSubmission(row) {
  submissions.push(row);
}

/** Counts as a solved problem for leaderboard (demo: code-only accepts do not persist a file). */
function recordSolvedProblem(userId, problemId) {
  const exists = submissions.some((s) => s.userId === userId && s.problemId === problemId);
  if (exists) return;
  addSubmission({
    _id: newId(),
    userId,
    problemId,
    filePath: 'virtual/accepted-code',
    submittedAt: new Date(),
  });
}

function listSubmissionsForUser(userId) {
  return submissions.filter((s) => s.userId === userId);
}

function getSubmissionById(id) {
  return submissions.find((s) => s._id === id) || null;
}

function recalcLeaderboardPayload() {
  const solved = new Map();
  for (const s of submissions) {
    if (!solved.has(s.userId)) solved.set(s.userId, new Set());
    solved.get(s.userId).add(s.problemId);
  }
  const rows = [];
  for (const [userId, set] of solved) {
    const u = usersById.get(userId);
    if (!u) continue;
    rows.push({
      _id: u._id,
      firstName: u.firstName,
      lastName: u.lastName,
      problemsSolved: set.size,
    });
  }
  rows.sort((a, b) => b.problemsSolved - a.problemsSolved);
  return rows.slice(0, 10);
}

function mockFileContent() {
  return '#include <iostream>\nusing namespace std;\nint main() { cout << 42; return 0; }\n';
}

module.exports = {
  USE,
  seed,
  newId,
  login,
  register,
  getUserById,
  toPublicUser,
  listAllUsersPublic,
  getProblemsList,
  getProblemById,
  createProblem,
  addSubmission,
  recordSolvedProblem,
  listSubmissionsForUser,
  getSubmissionById,
  recalcLeaderboardPayload,
  mockFileContent,
};
