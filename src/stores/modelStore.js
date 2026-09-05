// src/stores/modelStore.js
import { create } from 'zustand';
import { supabase } from '@/lib/supabase/client';
import { useAuthStore } from './authStore';

export const useModelStore = create((set, get) => ({
  models: [],
  loading: false,
  selectedModels: [],
  comparisonResults: [],

  // Fetch available models from OpenRouter
  fetchOpenRouterModels: async () => {
    set({ loading: true });
    try {
      const user = useAuthStore.getState().user;
      if (!user) throw new Error('User not authenticated');

      // Get API key from Supabase
      const { data: apiKeyData, error: keyError } = await supabase
        .from('api_keys')
        .select('api_key_encrypted')
        .eq('user_id', user.id)
        .eq('provider', 'openrouter')
        .eq('is_active', true)
        .single();

      if (keyError) throw keyError;

      // Fetch models from OpenRouter
      const response = await fetch('https://openrouter.ai/api/v1/models', {
        headers: {
          Authorization: `Bearer ${apiKeyData.api_key_encrypted}`,
        },
      });

      const data = await response.json();

      // Filter free models
      const freeModels = data.data.filter((model) => model.pricing?.prompt === '0');

      set({ models: freeModels, loading: false });
      return freeModels;
    } catch (error) {
      console.error('Error fetching models:', error);
      set({ loading: false });
      throw error;
    }
  },

  // Test a specific model
  testModel: async (modelId) => {
    try {
      const user = useAuthStore.getState().user;
      const { data: apiKeyData } = await supabase
        .from('api_keys')
        .select('api_key_encrypted')
        .eq('user_id', user.id)
        .eq('provider', 'openrouter')
        .eq('is_active', true)
        .single();

      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKeyData.api_key_encrypted}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: modelId,
          messages: [{ role: 'user', content: 'Say "OK" only' }],
          max_tokens: 10,
        }),
      });

      const data = await response.json();

      if (data.error) {
        return { success: false, error: data.error.message };
      }

      return {
        success: true,
        response: data.choices[0].message.content,
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Compare multiple models
  compareModels: async (modelIds, prompt) => {
    set({ loading: true });
    try {
      const user = useAuthStore.getState().user;
      const { data: apiKeyData } = await supabase
        .from('api_keys')
        .select('api_key_encrypted')
        .eq('user_id', user.id)
        .eq('provider', 'openrouter')
        .eq('is_active', true)
        .single();

      const results = [];

      for (const modelId of modelIds) {
        try {
          const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${apiKeyData.api_key_encrypted}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model: modelId,
              messages: [{ role: 'user', content: prompt }],
              max_tokens: 200,
            }),
          });

          const data = await response.json();

          if (data.error) {
            results.push({ model: modelId, error: data.error.message, success: false });
          } else {
            results.push({
              model: modelId,
              response: data.choices[0].message.content,
              success: true,
              usage: data.usage,
            });
          }
        } catch (error) {
          results.push({ model: modelId, error: error.message, success: false });
        }

        // Small delay to avoid rate limits
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }

      set({ comparisonResults: results, loading: false });
      return results;
    } catch (error) {
      console.error('Comparison error:', error);
      set({ loading: false });
      throw error;
    }
  },
}));
