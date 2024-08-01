import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-c';
import 'prismjs/themes/prism.css';
import { useAuth } from './AuthContext';
import './ProblemDetail.css'; // Import your custom CSS file

function ProblemDetail() {
  const [problem, setProblem] = useState({});
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [codeContent, setCodeContent] = useState('');
  const [inputContent, setInputContent] = useState('');
  const [output, setOutput] = useState('');
  const [language, setLanguage] = useState('cpp'); // Default language
  const fileInputRef = useRef();
  const { id } = useParams();
  const { user } = useAuth();

  useEffect(() => {
    const fetchProblemDetails = async () => {
      try {
        const response = await axios.get(`https://backend.nerdjudge.me/problems/${id}`);
        setProblem(response.data);
      } catch (error) {
        console.error('Error fetching problem details:', error);
      }
    };

    fetchProblemDetails();
  }, [id]);

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    const reader = new FileReader();
    reader.onload = (e) => {
      setCodeContent(e.target.result);
    };
    reader.readAsText(selectedFile);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('userId', user.id);
    formData.append('problemId', id);
    formData.append('code', codeContent);
    formData.append('input', inputContent);
    formData.append('language', language);

    if (file) {
      formData.append('file', file);
    }

    try {
      const response = await axios.post('https://backend.nerdjudge.me/submissions/submit', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${user.token}`
        },
        withCredentials: true,
      });

      setMessage(response.data.message);
      setOutput(response.data.output);

      // Display verdict based on the response
      if (response.data.verdict) {
        setMessage(response.data.verdict);
      }
    } catch (error) {
      console.error('Error submitting:', error);
      setMessage('Failed to submit');
    }
  };

  const handleRun = async () => {
    const payload = {
      language,
      code: codeContent,
      input: inputContent,
    };

    try {
      const { data } = await axios.post('https://backend.nerdjudge.me/execute/run', payload);
      setOutput(data.output);
    } catch (error) {
      console.log('Error executing code:', error.response);
    }
  };

  const getLanguageHighlight = () => {
    switch (language) {
      case 'cpp':
        return languages.c;
      case 'c':
        return languages.c;
      case 'java':
        return languages.java;
      case 'python':
        return languages.python;
      default:
        return languages.js;
    }
  };

  return (
    <div className="problem-detail-container">
      <h1 className="problem-title">{problem.title}</h1>
      <div className="problem-description">
        <p>{problem.description}</p>
      </div>

      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="language">Language:</label>
            <select id="language" value={language} onChange={(e) => setLanguage(e.target.value)}>
              <option value="cpp">C++</option>
              <option value="c">C</option>
              <option value="java">Java</option>
              <option value="python">Python</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="file">Upload File:</label>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} />
          </div>

          <button type="submit" className="submit-button">Submit</button>

          {message && <p className="message">{message}</p>}
          {output && (
            <div className="output-container">
              <h3>Test Case Results</h3>
              <pre>{output}</pre>
            </div>
          )}
        </form>
      </div>

      <div className="editor-container">
        <h3>Code Editor</h3>
        <Editor
          value={codeContent}
          onValueChange={(code) => setCodeContent(code)}
          highlight={(code) => highlight(code, getLanguageHighlight())}
          padding={10}
          style={{
            fontFamily: '"Fira Code", "Fira Mono", monospace',
            fontSize: 14,
            border: '1px solid #ddd',
            borderRadius: 4,
            backgroundColor: '#f5f5f5',
            minHeight: '200px',
          }}
        />
      </div>

      <div className="editor-container">
        <h3>Input</h3>
        <Editor
          value={inputContent}
          onValueChange={(input) => setInputContent(input)}
          highlight={(input) => highlight(input, getLanguageHighlight())}
          padding={10}
          style={{
            fontFamily: '"Fira Code", "Fira Mono", monospace',
            fontSize: 14,
            border: '1px solid #ddd',
            borderRadius: 4,
            backgroundColor: '#f5f5f5',
            minHeight: '100px',
          }}
        />
      </div>

      <button onClick={handleRun} className="run-button">Run Code</button>
    </div>
  );
}

export default ProblemDetail;