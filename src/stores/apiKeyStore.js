// src/stores/apiKeyStore.js
import { create } from 'zustand';
import { supabase } from '@/lib/supabase/client';
import { useAuthStore } from './authStore';

export const useApiKeyStore = create((set, get) => ({
  apiKeys: [],
  loading: false,

  loadApiKeys: async () => {
    const user = useAuthStore.getState().user;
    if (!user) return;

    set({ loading: true });
    try {
      const { data, error } = await supabase.from('api_keys').select('*').eq('user_id', user.id);

      if (error) throw error;
      set({ apiKeys: data || [] });
    } catch (error) {
      console.error('Error loading API keys:', error);
    } finally {
      set({ loading: false });
    }
  },

  saveApiKey: async (provider, apiKey) => {
    const user = useAuthStore.getState().user;
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('api_keys')
      .upsert({
        user_id: user.id,
        provider,
        api_key_encrypted: apiKey, // In production, encrypt this
        key_hash: apiKey, // In production, hash this
        is_active: true,
      })
      .select()
      .single();

    if (error) throw error;

    set((state) => ({
      apiKeys: [...state.apiKeys.filter((k) => k.provider !== provider), data],
    }));

    return data;
  },

  deleteApiKey: async (provider) => {
    const user = useAuthStore.getState().user;
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('api_keys')
      .delete()
      .eq('user_id', user.id)
      .eq('provider', provider);

    if (error) throw error;

    set((state) => ({
      apiKeys: state.apiKeys.filter((k) => k.provider !== provider),
    }));
  },

  updateApiKeyStatus: async (provider, isActive) => {
    const user = useAuthStore.getState().user;
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('api_keys')
      .update({ is_active: isActive })
      .eq('user_id', user.id)
      .eq('provider', provider)
      .select()
      .single();

    if (error) throw error;

    set((state) => ({
      apiKeys: state.apiKeys.map((k) => (k.provider === provider ? data : k)),
    }));
  },
}));
