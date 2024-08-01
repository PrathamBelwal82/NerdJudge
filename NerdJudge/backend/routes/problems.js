const express = require('express');
const { getProblems, getProblemById, createProblem } = require('../controllers/problemController');

const router = express.Router();

router.get('/', getProblems);
router.get('/:id', getProblemById);
router.post('/add', createProblem);

module.exports = router;
