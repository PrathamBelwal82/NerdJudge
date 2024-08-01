import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Problems from './components/Problems';
import ProblemDetail from './components/ProblemDetail';
import Submissions from './components/Submissions';
import Login from './components/Login';
import Register from './components/Register';
import PrivateRoute from './components/PrivateRoute';
import ProblemAdd from './components/ProblemAdd';
import UserSubmissions from './components/UserSubmissions';
import SubmissionDetail from './components/SubmissionDetail';
function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/problems" element={<Problems />} />
      <Route path="/problems/add" element={<ProblemAdd />} />
      <Route path="/problems/:id" element={<ProblemDetail />} />
      <Route path="/submissions" element={<Submissions />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/submissions/usersubmissions" element={<UserSubmissions />} />
      <Route path="/submission/:id" element={<SubmissionDetail />} />
    </Routes>
  );
}

export default App;
