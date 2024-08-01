const Submission = require('../models/Submissions');

exports.addSubmission = async (req, res) => {
    const { userId, problemId } = req.body;
    const filePath = req.file.path;

    try {
        const submission = new Submission({ problemId, filePath });
        await submission.save();
        res.status(201).json({ message: 'Submission added successfully', submission });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getSubmissions = async (req, res) => {
    try {
        const submissions = await Submission.find().populate('userId problemId');
        res.status(200).json(submissions);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

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