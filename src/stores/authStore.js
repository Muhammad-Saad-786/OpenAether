// src/stores/authStore.js
import { create } from 'zustand';
import { supabase } from '@/lib/supabase/client';

export const useAuthStore = create((set) => ({
  user: null,
  session: null,
  loading: true,

  initialize: async () => {
    if (!supabase) {
      set({ loading: false });
      return;
    }

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      set({
        session,
        user: session?.user ?? null,
        loading: false,
      });

      supabase.auth.onAuthStateChange((_event, session) => {
        set({ session, user: session?.user ?? null });
      });
    } catch (error) {
      console.error('Error initializing auth:', error);
      set({ loading: false });
    }
  },

  login: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    set({ session: data.session, user: data.user });
    return data;
  },

  register: async (email, password, username) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username },
      },
    });
    if (error) throw error;
    return data;
  },

  logout: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    set({ session: null, user: null });
  },

  // src/stores/authStore.js - Update updateProfile

  updateProfile: async (updates) => {
    const user = useAuthStore.getState().user;
    if (!user) throw new Error('User not authenticated');

    try {
      // 1. Update Supabase auth user metadata
      const { data: authData, error: authError } = await supabase.auth.updateUser({
        data: {
          username: updates.username,
          full_name: updates.full_name || user.user_metadata?.full_name,
          avatar_url: updates.avatar_url || user.user_metadata?.avatar_url,
        },
      });

      if (authError) throw authError;

      // 2. Update profiles table
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .update({
          username: updates.username,
          full_name: updates.full_name || user.user_metadata?.full_name,
          avatar_url: updates.avatar_url || user.user_metadata?.avatar_url,
          updated_at: new Date(),
        })
        .eq('id', user.id)
        .select()
        .single();

      if (profileError) throw profileError;

      // 3. Update local state
      set((state) => ({
        user: {
          ...state.user,
          user_metadata: {
            ...state.user.user_metadata,
            username: updates.username,
            full_name: updates.full_name || state.user.user_metadata?.full_name,
            avatar_url: updates.avatar_url || state.user.user_metadata?.avatar_url,
          },
        },
      }));

      return profileData;
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  },
}));
