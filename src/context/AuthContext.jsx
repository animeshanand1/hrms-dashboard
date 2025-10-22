/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem('authUser');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    try {
      if (user) localStorage.setItem('authUser', JSON.stringify(user));
      else localStorage.removeItem('authUser');
    } catch {
      /* ignore localStorage errors */
    }
  }, [user]);

  const login = (payload) => {
    setUser(payload);
  };

  const logout = () => {
    setUser(null);
  };

  const isAuthenticated = !!user;

  const hasRole = (allowed) => {
    if (!user) return false;
    if (!allowed) return true;
    if (Array.isArray(allowed)) return allowed.includes(user.role);
    return user.role === allowed;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
};
