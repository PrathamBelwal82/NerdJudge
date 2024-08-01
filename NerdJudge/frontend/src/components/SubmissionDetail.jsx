import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Container, Typography, Paper } from '@mui/material';

const SubmissionDetail = () => {
  const { id } = useParams(); // Get the submission ID from the URL
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFileContent = async () => {
      try {
        const response = await axios.get(`https://backend.nerdjudge.me/submissions/file/${id}`);
        setContent(response.data.content);
      } catch (error) {
        console.error('Error fetching file content:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFileContent();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Submission Detail
      </Typography>
      <Paper sx={{ padding: 2, backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
        <Typography variant="h6">File Content:</Typography>
        <pre>{content}</pre>
      </Paper>
    </Container>
  );
};

export default SubmissionDetail;
