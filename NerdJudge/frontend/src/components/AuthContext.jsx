import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    
    if (token && userId) {
      try {
        setUser({ loggedIn: true, token: JSON.parse(token), userId });
      } catch (error) {
        console.error('Error parsing token from localStorage:', error);
      }
    }
  }, []);

  const login = (token, userId) => {
    if (typeof token !== 'string') {
      console.error('Expected token to be a string but received:', token);
      return;
    }
    
    localStorage.setItem('token', JSON.stringify(token));
    localStorage.setItem('userId', userId);
    setUser({ loggedIn: true, token, userId });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;