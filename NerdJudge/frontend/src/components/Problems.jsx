// src/components/Problems.jsx

import React, { useEffect, useState } from 'react';
import { Container, Grid, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, MenuItem, Button, CircularProgress } from '@mui/material'; // Material-UI components
import { Pagination } from '@mui/material'; // For pagination
import axios from 'axios';

const Problems = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [difficulty, setDifficulty] = useState('');
  const [tags, setTags] = useState('');
  const [sortBy, setSortBy] = useState('title');
  const [sortOrder, setSortOrder] = useState('asc');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchProblems = async () => {
      setLoading(true);
      try {
        const response = await axios.get('https://backend.nerdjudge.me/problems', {
          params: {
            page,
            limit: 10,
            sortBy,
            sortOrder,
            difficulty,
            tags,
          },
        });
        setProblems(response.data.problems);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error('Error fetching problems:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProblems();
  }, [page, sortBy, sortOrder, difficulty, tags]);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={3}>
          <Typography variant="h6" gutterBottom>
            Filter and Sort
          </Typography>
          <TextField
            label="Difficulty"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            fullWidth
            select
            sx={{ mb: 2 }}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="easy">Easy</MenuItem>
            <MenuItem value="medium">Medium</MenuItem>
            <MenuItem value="hard">Hard</MenuItem>
          </TextField>
          <TextField
            label="Tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Sort By"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            fullWidth
            select
            sx={{ mb: 2 }}
          >
            <MenuItem value="title">Title</MenuItem>
            <MenuItem value="difficulty">Difficulty</MenuItem>
          </TextField>
          <TextField
            label="Sort Order"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            fullWidth
            select
            sx={{ mb: 2 }}
          >
            <MenuItem value="asc">Ascending</MenuItem>
            <MenuItem value="desc">Descending</MenuItem>
          </TextField>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setPage(1)}
          >
            Apply Filters
          </Button>
        </Grid>
        <Grid item xs={12} md={9}>
          {loading ? (
            <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
              <CircularProgress />
            </Container>
          ) : (
            <>
              <Typography variant="h4" gutterBottom>
                Problems
              </Typography>
              {problems.length > 0 ? (
                <TableContainer component={Paper} sx={{ borderRadius: '8px' }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Title</TableCell>
                        <TableCell>Description</TableCell>
                        <TableCell>Difficulty</TableCell>
                        <TableCell>Tags</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {problems.map(problem => (
                        <TableRow key={problem._id}>
                          <TableCell>
                            <a href={`/problems/${problem._id}`} style={{ textDecoration: 'none', color: '#1976d2' }}>
                              {problem.title}
                            </a>
                          </TableCell>
                          <TableCell>{problem.description}</TableCell>
                          <TableCell>{problem.difficulty}</TableCell>
                          <TableCell>{problem.tags.join(', ')}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Typography>No problems available.</Typography>
              )}
              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}
              />
            </>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default Problems;
