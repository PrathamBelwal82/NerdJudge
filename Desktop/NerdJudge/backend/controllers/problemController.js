const Problem = require('../models/Problems');
const mockStore = require('../mock/store');

exports.getProblems = async (req, res) => {
  if (mockStore.USE()) {
    try {
      const out = mockStore.getProblemsList(req.query);
      return res.status(200).json(out);
    } catch (error) {
      console.error('Error fetching problems:', error);
      return res.status(500).send('Internal Server Error');
    }
  }

  try {
    const { page = 1, limit = 10, sortBy = 'title', sortOrder = 'asc', difficulty, tags } = req.query;

    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    const query = {};
    if (difficulty) {
      query.difficulty = { $regex: difficulty, $options: 'i' };
    }
    if (tags) {
      query.tags = { $in: tags.split(',') };
    }

    const totalProblems = await Problem.countDocuments(query);

    const problems = await Problem.find(query)
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber)
      .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 });

    res.status(200).json({
      problems,
      totalPages: Math.ceil(totalProblems / limitNumber),
      currentPage: pageNumber,
    });
  } catch (error) {
    console.error('Error fetching problems:', error);
    res.status(500).send('Internal Server Error');
  }
};

exports.getProblemById = async (req, res) => {
  if (mockStore.USE()) {
    try {
      const problem = mockStore.getProblemById(req.params.id);
      if (!problem) {
        return res.status(404).send('Problem not found');
      }
      return res.status(200).json(problem);
    } catch (error) {
      console.error(error);
      return res.status(500).send('Internal Server Error');
    }
  }

  try {
    const { id } = req.params;
    const problem = await Problem.findById(id);
    if (!problem) {
      return res.status(404).send('Problem not found');
    }
    res.status(200).json(problem);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

exports.createProblem = async (req, res) => {
  if (mockStore.USE()) {
    try {
      const { title, description, difficulty, testCases } = req.body;

      if (!title || !description || !difficulty) {
        return res.status(400).json({ message: 'Title, description, and difficulty are required' });
      }

      const newProblem = mockStore.createProblem({
        title,
        description,
        difficulty,
        testCases: testCases || [],
        tags: req.body.tags,
      });
      return res.status(201).json(newProblem);
    } catch (error) {
      console.error('Error adding problem:', error);
      return res.status(500).json({ message: 'Failed to add problem', error: error.message });
    }
  }

  try {
    const { title, description, difficulty, testCases } = req.body;

    if (!title || !description || !difficulty) {
      return res.status(400).json({ message: 'Title, description, and difficulty are required' });
    }

    const newProblem = new Problem({
      title,
      description,
      difficulty,
      testCases: testCases || [],
      tags: req.body.tags || [],
    });

    await newProblem.save();
    res.status(201).json(newProblem);
  } catch (error) {
    console.error('Error adding problem:', error);
    res.status(500).json({ message: 'Failed to add problem', error: error.message });
  }
};
