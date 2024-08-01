const fs = require('fs');
const path = require('path');
const { v4: uuid } = require('uuid');

const dirCodes = path.join(__dirname, 'codes');

if (!fs.existsSync(dirCodes)) {
    fs.mkdirSync(dirCodes, { recursive: true });
}

// Define language to file extension mappings
const languageExtensions = {
    cpp: 'cpp',
    java: 'java',
    python: 'py',
    c: 'c',
    // Add more languages and their extensions as needed
};

const generateFile = async (language, content) => {
    const extension = languageExtensions[language];
    if (!extension) {
        throw new Error(`Unsupported language: ${language}`);
    }
    const jobID = uuid();
    const filename = `${jobID}.${extension}`;
    const filePath = path.join(dirCodes, filename);
    await fs.writeFileSync(filePath, content);
    return filePath;
};

module.exports = {
    generateFile,
};
