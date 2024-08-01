const fs = require('fs');
const path = require('path');


const generateInputFile = async (input) => {
    const inputFileName = `input-${Date.now()}.txt`;  // Unique name to avoid collisions
    const inputFilePath = path.join(__dirname, 'inputs', inputFileName);

    try {
        fs.writeFileSync(inputFilePath, input, 'utf8');
        console.log(`Generated input file at: ${inputFilePath}`);
        return inputFilePath;
    } catch (error) {
        console.error(`Error generating input file: ${error.message}`);
        throw error;
    }
};

module.exports = { generateInputFile };
