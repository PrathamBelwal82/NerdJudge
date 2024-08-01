// src/components/UserSubmissions.jsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const UserSubmissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchSubmissions = async () => {
      if (!user) {
        console.log('User is not logged in');
        return;
      }

      try {
        const response = await axios.get('https://backend.nerdjudge.me/submissions/usersubmissions', {
          headers: { Authorization: `Bearer ${user.token}` },
          withCredentials: true,
        });
        setSubmissions(response.data);
      } catch (error) {
        console.error('Error fetching submissions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, [user]);

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        User Submissions
      </Typography>
      {submissions.length > 0 ? (
        <TableContainer component={Paper} sx={{ borderRadius: '8px' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Submission ID</TableCell>
                <TableCell>Submission Time</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {submissions.map((submission) => (
                <TableRow key={submission._id}>
                  <TableCell>
                    <Link component={RouterLink} to={`/submission/${submission._id}`}>
                      {submission._id}
                    </Link>
                  </TableCell>
                  <TableCell>{new Date(submission.submittedAt).toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography>No submissions available.</Typography>
      )}
    </Container>
  );
};

export default UserSubmissions;

