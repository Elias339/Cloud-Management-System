import React, { createContext, useEffect, useState } from 'react';
import api from './api';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(sessionStorage.getItem('userInfo')) || null; }
    catch { return null; }
  });

  const login = (userInfo) => {
    sessionStorage.setItem('userInfo', JSON.stringify(userInfo));
    setUser(userInfo);
  };
 
  const logout = async () => {
    try {
      if (user?.token) { 
        await api.post('/logout', {}, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
      }
    } catch (err) {
      console.error("Logout API error:", err);
    } finally { 
      sessionStorage.removeItem('userInfo');
      setUser(null);
    }
  };

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'userInfo') {
        try { setUser(JSON.parse(e.newValue)); }
        catch { setUser(null); }
      }
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
