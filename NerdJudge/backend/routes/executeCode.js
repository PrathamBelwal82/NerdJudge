const express = require('express');
const router = express.Router();
const { generateFile } = require('./generateFile');
const { executeCpp } = require('./executeCpp');
const { generateInputFile }=require('./generateInputFile');

router.post("/run", async (req, res) => {

  const { language = 'cpp', code, input } = req.body;
  if (code === undefined) {
      return res.status(404).json({ success: false, error: "Empty code!" });
  }
  try {
      const filePath = await generateFile(language, code);
      const inputPath = await generateInputFile(input);
      const output = await executeCpp(language,filePath, inputPath);
      res.json({ filePath, inputPath, output });
  } catch (error) {
      res.status(500).json({ error: error });
  }
});

module.exports = router;
