const Problem = require('../models/Problems');

exports.getProblems = async (req, res) => {
  try {
    // Extract query parameters
    const { page = 1, limit = 10, sortBy = 'title', sortOrder = 'asc', difficulty, tags } = req.query;

    // Convert page and limit to integers
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    // Build query object
    const query = {};
    if (difficulty) {
      query.difficulty = { $regex: difficulty, $options: 'i' }; // Case-insensitive match
    }
    if (tags) {
      query.tags = { $in: tags.split(',') }; // Split tags into array
    }

    // Get total count for pagination
    const totalProblems = await Problem.countDocuments(query);

    // Fetch problems with pagination, sorting, and filtering
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
    res.status(500).send("Internal Server Error");
  }
};


exports.getProblemById = async (req, res) => {
  try {
    const { id } = req.params;
    const problem = await Problem.findById(id);
    if (!problem) {
      return res.status(404).send("Problem not found");
    }
    res.status(200).json(problem);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

exports.createProblem = async (req, res) => {
  try {
    const { title, description, difficulty, testCases } = req.body;

    if (!title || !description || !difficulty) {
      return res.status(400).json({ message: 'Title, description, and difficulty are required' });
    }

    const newProblem = new Problem({
      title,
      description,
      difficulty,
      testCases: testCases || [], // Initialize as empty array if not provided
    });

    await newProblem.save();
    res.status(201).json(newProblem);
  } catch (error) {
    console.error('Error adding problem:', error);
    res.status(500).json({ message: 'Failed to add problem', error: error.message });
  }
};