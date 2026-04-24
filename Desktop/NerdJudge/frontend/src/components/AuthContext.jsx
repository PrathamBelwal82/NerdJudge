import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

function deriveUserIdFromToken(token) {
  if (typeof token !== 'string') return null;
  if (token.startsWith('mock-')) {
    return token.slice(5);
  }
  try {
    const decoded = jwtDecode(token);
    return decoded.id || decoded.sub || null;
  } catch {
    return null;
  }
}

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const rawToken = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');

    if (rawToken && userId) {
      try {
        const token = JSON.parse(rawToken);
        setUser({ loggedIn: true, token, userId });
      } catch (error) {
        console.error('Error parsing token from localStorage:', error);
      }
    }
  }, []);

  /**
   * Accepts either (token, userId) or { token, userId } from /login and /register.
   * Supports JWT and demo tokens (mock-…).
   */
  const login = (tokenOrPayload, userIdMaybe) => {
    let token;
    let userId = userIdMaybe;

    if (tokenOrPayload && typeof tokenOrPayload === 'object' && 'token' in tokenOrPayload) {
      token = tokenOrPayload.token;
      userId = tokenOrPayload.userId ?? userId;
    } else {
      token = tokenOrPayload;
    }

    if (typeof token !== 'string') {
      console.error('Expected token to be a string but received:', tokenOrPayload);
      return;
    }

    if (!userId) {
      userId = deriveUserIdFromToken(token);
    }

    if (!userId) {
      console.error('Could not derive userId from token');
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
