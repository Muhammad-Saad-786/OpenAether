// src/lib/providers/provider-manager.js
import { OpenRouterProvider } from './openrouter-provider';
import { supabase } from '@/lib/supabase/client';

class ProviderManager {
  constructor() {
    this.providers = new Map();
  }

  async initializeProviders(userId) {
    const { data: apiKeys, error } = await supabase
      .from('api_keys')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true);

    if (error) throw error;

    this.providers.clear();

    if (!apiKeys || apiKeys.length === 0) {
      console.warn('⚠️ No API keys found');
      return;
    }

    apiKeys.forEach((key) => {
      if (key.provider === 'openrouter') {
        this.providers.set('openrouter', new OpenRouterProvider(key.api_key_encrypted));
      }
    });

    console.log('✅ Providers initialized:', this.getAvailableProviders());
  }

  getAvailableProviders() {
    return Array.from(this.providers.keys());
  }

  async smartChat(messages, options = {}) {
    const provider = this.providers.get('openrouter');

    if (!provider) {
      throw new Error('OpenRouter API key not configured. Please add your key in Settings.');
    }

    try {
      console.log('🔄 Using OpenRouter...');

      const response = await provider.chat(messages, options);

      console.log('✅ OpenRouter succeeded');

      return {
        ...response,
        provider: 'openrouter',
      };
    } catch (error) {
      console.error('❌ OpenRouter failed:', error.message);

      if (error.status === 429 || error.message.includes('429')) {
        throw new Error('Rate limited. Please wait a moment and try again.');
      }

      throw new Error(`OpenRouter error: ${error.message}`);
    }
  }

  async chat(providerName, messages, options = {}) {
    const provider = this.providers.get(providerName);
    if (!provider) throw new Error(`Provider ${providerName} not configured`);
    return provider.chat(messages, options);
  }
}

export const providerManager = new ProviderManager();
