import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Button, Typography, Box, Paper, CircularProgress, Alert } from '@mui/material';
import { useAuth } from './AuthContext';

const Home = () => {
  const { user, logout } = useAuth();
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await axios.get('https://backend.nerdjudge.me/leaderboard');
        setLeaderboard(response.data);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
        setError('Failed to load leaderboard data.');
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  const handleSubmission = async () => {
    try {
      // Submit code here
      const response = await axios.post('https://backend.nerdjudge.me/submit', { /* submission data */ });
      if (response.data.verdict === 'All test cases passed') {
        // Fetch updated leaderboard after successful submission
        const updatedResponse = await axios.get('https://backend.nerdjudge.me/leaderboard');
        setLeaderboard(updatedResponse.data);
      }
    } catch (error) {
      console.error('Error during submission:', error);
      setError('Failed to submit the code.');
    }
  };

  return (
    <div style={{ minHeight: '100vh', padding: '0 20px' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            NerdJudge
          </Typography>
          {user ? (
            <div>
              <Button color="inherit" onClick={logout}>Logout</Button>
              <Button color="inherit" component={Link} to="/problems">Problems</Button>
              <Button color="inherit" component={Link} to="/submissions/usersubmissions">Submissions</Button>
              <Button color="inherit" component={Link} to="/problems/add">Add Problems</Button>
            </div>
          ) : (
            <div>
              <Button color="inherit" component={Link} to="/login">Login</Button>
              <Button color="inherit" component={Link} to="/register">Register</Button>
            </div>
          )}
        </Toolbar>
      </AppBar>
      {!user ? (
        <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 4, border: '1px solid #ddd', borderRadius: '8px' }}>
            <Typography variant="h5" gutterBottom>
              Welcome to NerdJudge
            </Typography>
            <Typography variant="body1" gutterBottom>
              Please choose an option below:
            </Typography>
            <Button variant="contained" color="primary" component={Link} to="/login" sx={{ mb: 2 }}>
              Login
            </Button>
            <Button variant="outlined" color="primary" component={Link} to="/register">
              Register
            </Button>
          </Box>
        </Container>
      ) : (
        <Container>
          <Typography variant="h4" component="h1" gutterBottom>
            Welcome to the NerdJudge
          </Typography>
          <Typography variant="body1" gutterBottom>
            This is the homepage of your online judge system. Here is the leaderboard:
          </Typography>
          {/* Leaderboard Section */}
          <Box sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h5" component="h2" gutterBottom>
              Leaderboard
            </Typography>
            <Paper elevation={3} sx={{ padding: 2, maxHeight: '400px', overflow: 'auto' }}>
              {loading ? (
                <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
                  <CircularProgress />
                </Container>
              ) : error ? (
                <Alert severity="error">{error}</Alert>
              ) : (
                <>
                  <Typography variant="h6" component="h3">
                    Top 10 Users
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', mt: 2 }}>
                    {leaderboard.map((user, index) => (
                      <Box key={user._id} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body1">{index + 1}. {user.firstName} {user.lastName}</Typography>
                        <Typography variant="body1">{user.problemsSolved} problems solved</Typography>
                      </Box>
                    ))}
                  </Box>
                </>
              )}
            </Paper>
          </Box>
        </Container>
      )}
    </div>
  );
};

export default Home;
