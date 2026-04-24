import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button, TextField, Container, Box, Typography } from '@mui/material';
import { useAuth } from '../components/AuthContext';
import { API_BASE_URL } from '../api';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const normalizedEmail = email.trim().toLowerCase();

    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: normalizedEmail, password }),
      });

      let data;
      try {
        data = await response.json();
      } catch {
        setError('Invalid response from server. Is the API running?');
        return;
      }

      if (response.ok) {
        login(data);
        navigate('/');
        return;
      }

      if (data.register) {
        setError(
          'No account exists for this email. Create one below, or use demo login if the server is in demo mode (demo@nerdjudge.local / demo123).'
        );
        return;
      }

      setError(data.message || 'Login failed');
    } catch (err) {
      console.error('Login error:', err);
      setError('Cannot reach server. Check that the backend is running and VITE_API_BASE_URL is correct.');
    }
  };

  return (
    <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
      <Box sx={{ width: '100%', maxWidth: '400px', padding: 4, border: '1px solid #ddd', borderRadius: '8px' }}>
        <Typography variant="h5" gutterBottom>
          Login
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            type="email"
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            fullWidth
            margin="normal"
          />
          <TextField
            type="password"
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            fullWidth
            margin="normal"
          />
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
            Login
          </Button>
          {error && (
            <Typography color="error" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}
          <Button component={Link} to="/register" fullWidth sx={{ mt: 2 }}>
            Go to Register
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default Login;
