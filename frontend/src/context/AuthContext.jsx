import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token      = localStorage.getItem('trustora_token') || localStorage.getItem('hostboost_token');
    const storedUser = localStorage.getItem('trustora_user')  || localStorage.getItem('hostboost_user');
    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
        api.get('/auth/me')
          .then((res) => {
            setUser(res.data.user);
            localStorage.setItem('trustora_user', JSON.stringify(res.data.user));
          })
          .catch(() => logout())
          .finally(() => setLoading(false));
      } catch (e) {
        logout();
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const { token, user: userData } = res.data;
    localStorage.setItem('trustora_token', token);
    localStorage.setItem('trustora_user', JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const register = async (userData) => {
    const res = await api.post('/auth/register', userData);
    const { token, user: newUser } = res.data;
    localStorage.setItem('trustora_token', token);
    localStorage.setItem('trustora_user', JSON.stringify(newUser));
    setUser(newUser);
    return newUser;
  };

  const logout = () => {
    localStorage.removeItem('trustora_token');
    localStorage.removeItem('trustora_user');
    localStorage.removeItem('hostboost_token');
    localStorage.removeItem('hostboost_user');
    setUser(null);
  };

  // Demo logins for Trustora
  const demoLogin      = async () => login('host@trustora.ai',  'password123');
  const demoGuestLogin = async () => login('guest@trustora.ai', 'password123');

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, demoLogin, demoGuestLogin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
