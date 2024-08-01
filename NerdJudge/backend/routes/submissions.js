const express = require('express');
const router = express.Router();
const multer = require('multer');
const Submission = require('../models/Submissions');
const Problem = require('../models/Problems');
const verifyToken = require('../middleware/authMiddleware');
const path = require('path');
const { generateFile } = require('./generateFile');
const { executeCpp } = require('./executeCpp');
const { generateInputFile } = require('./generateInputFile');
const fs = require('fs');
const Leaderboard = require('../models/Leaderboard');

const updateLeaderboard = async (userId) => {
  try {
    const userSubmissions = await Submission.find({ userId }).distinct('problemId');
    const problemsSolved = userSubmissions.length;

    const existingUser = await Leaderboard.findOne({ userId });

    if (existingUser) {
      existingUser.problemsSolved = problemsSolved;
      await existingUser.save();
    } else {
      const newEntry = new Leaderboard({
        userId,
        problemsSolved,
      });
      await newEntry.save();
    }

    // Sort leaderboard and keep top 10
    const topUsers = await Leaderboard.find().sort({ problemsSolved: -1 }).limit(10);
    await Leaderboard.deleteMany({}); // Clear previous leaderboard entries
    await Leaderboard.insertMany(topUsers); // Insert updated leaderboard

  } catch (error) {
    console.error('Error updating leaderboard:', error);
  }
};


// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage: storage });

router.post('/submit', verifyToken, upload.single('file'), async (req, res) => {
  try {
    const { problemId, code, input, language } = req.body;
    const userId = req.user.id;
    let filePath;

    if (req.file) {
      filePath = req.file.path;
      const submission = new Submission({
        userId,
        problemId,
        filePath,
      });
      await submission.save();
    }

    if (code) {
      const problem = await Problem.findById(problemId);
      if (!problem) {
        return res.status(404).json({ message: 'Problem not found' });
      }

      const testCases = problem.testCases || [];
      const codeFilePath = await generateFile(language, code);
      
      const verdict = await Promise.all(testCases.map(async ({ input: testInput, output: expectedOutput }) => {
        const testInputFilePath = await generateInputFile(testInput);
        const testOutput = await executeCpp(language, codeFilePath, testInputFilePath);
        return testOutput.trim() === expectedOutput.trim();
      }));

      const allPassed = verdict.every(v => v);

      if (allPassed) {
        // Update the leaderboard
        await updateLeaderboard(userId);

        return res.json({
          verdict: 'All test cases passed',
          message: 'Submission successful',
        });
      } else {
        return res.json({
          verdict: 'Some test cases failed',
          message: 'Submission successful but not added to leaderboard',
        });
      }
    }

    return res.status(400).json({ message: 'No code provided' });

  } catch (error) {
    console.error('Error submitting:', error);
    if (!res.headersSent) {
      res.status(500).json({ message: 'Failed to submit', error: error.message });
    }
  }
});




router.get('/usersubmissions', verifyToken, async (req, res) => {
  try {
    const submissions = await Submission.find({ userId: req.user.id });
    res.status(200).json(submissions);
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/file/:id', async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.id);
    if (!submission) {
      console.error(`Submission with ID ${req.params.id} not found.`);
      return res.status(404).json({ message: 'Submission not found' });
    }

    const filePath = path.resolve(__dirname, '..', submission.filePath);
    if (!fs.existsSync(filePath)) {
      console.error(`File not found at path: ${filePath}`);
      return res.status(404).json({ message: 'File not found' });
    }

    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        console.error(`Error reading file at path ${filePath}: ${err.message}`);
        return res.status(500).json({ message: 'Error reading file' });
      }
      res.json({ content: data });
    });
  } catch (error) {
    console.error(`Error fetching file content: ${error.message}`);
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;
