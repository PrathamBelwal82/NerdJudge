import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../api';
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress } from '@mui/material';

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/leaderboard`);
        setLeaderboard(response.data);
      } catch (error) {
        console.error('Error fetching leaderboard:', error.response ? error.response.data : error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

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
        Leaderboard
      </Typography>
      {leaderboard.length > 0 ? (
        <TableContainer component={Paper} sx={{ borderRadius: '8px' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Rank</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Problems solved</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {leaderboard.map((row, index) => (
                <TableRow key={row._id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    {row.firstName} {row.lastName}
                  </TableCell>
                  <TableCell>{row.problemsSolved}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography>No leaderboard data available.</Typography>
      )}
    </Container>
  );
};

export default Leaderboard;
