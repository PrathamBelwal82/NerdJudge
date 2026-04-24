const express = require('express');
const path = require('path');
const { DBConnection } = require('./database/db');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');

dotenv.config();

const app = express();

const USE_IN_MEMORY = process.env.USE_IN_MEMORY === 'true';

const corsOrigins = process.env.CLIENT_ORIGINS
  ? process.env.CLIENT_ORIGINS.split(',').map((o) => o.trim()).filter(Boolean)
  : ['http://localhost:5173', 'http://127.0.0.1:5173', 'https://www.nerdjudge.me'];

app.use(
  cors({
    origin: corsOrigins,
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.use(express.urlencoded({ extended: true }));

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

const authRoutes = require('./routes/auth.js');
const problemRoutes = require('./routes/problems.js');
const submissionRoutes = require('./routes/submissions.js');
const userRoutes = require('./routes/users.js');
const executeCodeRouter = require('./routes/executeCode');
const leaderboardRoutes = require('./routes/LeaderBoard');
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/', authRoutes);
app.use('/problems', problemRoutes);
app.use('/submissions', submissionRoutes);
app.use('/users', userRoutes);
app.use('/execute', executeCodeRouter);
app.use('/leaderboard', leaderboardRoutes);

const PORT = process.env.PORT || 8000;

async function start() {
  if (USE_IN_MEMORY) {
    const mockStore = require('./mock/store');
    mockStore.seed();
    console.log('USE_IN_MEMORY: demo mode — no MongoDB; passwords plain text; token prefix mock-');
  } else {
    await DBConnection();
  }
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

start().catch((err) => {
  console.error('Server failed to start:', err.message);
  if (!USE_IN_MEMORY) {
    console.error(
      'Check Atlas: Network Access (IP allowlist), database user/password, and MONGODB_URI in backend/.env'
    );
  }
  process.exit(1);
});
