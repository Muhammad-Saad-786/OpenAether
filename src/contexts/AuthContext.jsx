// src/contexts/AuthContext.jsx
import { createContext, useContext, useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { useChatStore } from '@/stores/chatStore';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const { user, session, profile, loading, initialize } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (!user) return;

    const preloadUserData = async () => {
      await Promise.all([
        useAuthStore.getState().loadProfile(user.id),
        useChatStore.getState().preloadAllData(),
      ]);
    };

    preloadUserData();
  }, [user]);

  const value = {
    user,
    profile,
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
