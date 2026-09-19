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
        const parsed = JSON.parse(storedUser);
        setUser(parsed);
        api.get('/auth/me')
          .then((res) => {
            if (res.data && res.data.user) {
              setUser(res.data.user);
              localStorage.setItem('trustora_user', JSON.stringify(res.data.user));
            }
          })
          .catch((err) => {
            if (err?.response?.status === 401) {
              logout();
            }
          })
          .finally(() => setLoading(false));
      } catch (e) {
        logout();
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password, role) => {
    const res = await api.post('/auth/login', { email, password, role });
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

  const googleLogin = async ({ email, name, role }) => {
    const res = await api.post('/auth/google-mock', { email, name, role });
    const { token, user: userData } = res.data;
    localStorage.setItem('trustora_token', token);
    localStorage.setItem('trustora_user', JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const logout = () => {
    localStorage.removeItem('trustora_token');
    localStorage.removeItem('trustora_user');
    localStorage.removeItem('hostboost_token');
    localStorage.removeItem('hostboost_user');
    setUser(null);
  };

  // Demo logins for Trustora
  const demoLogin      = async () => login('host@trustora.ai',  'password123', 'host');
  const demoGuestLogin = async () => login('guest@trustora.ai', 'password123', 'guest');

  return (
    <AuthContext.Provider value={{ user, loading, login, register, googleLogin, logout, demoLogin, demoGuestLogin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
