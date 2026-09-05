// src/contexts/AuthContext.jsx
import { createContext, useContext, useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const { user, session, loading, initialize } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  const value = {
    user,
    session,
    loading,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
