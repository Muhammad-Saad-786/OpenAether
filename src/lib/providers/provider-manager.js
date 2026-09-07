// src/lib/providers/provider-manager.js
import { OpenRouterProvider } from './openrouter-provider';
import { GroqProvider } from './groq-provider';
import { supabase } from '@/lib/supabase/client';

class ProviderManager {
  constructor() {
    this.providers = new Map();

    this.providerDefaultModels = {
      openrouter: 'openai/gpt-4o-mini',
      groq: 'openai/gpt-oss-20b',
    };
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
      this.registerProvider(key.provider, key.api_key_encrypted);
    });

    console.log('✅ Providers initialized:', this.getAvailableProviders());
  }

  registerProvider(providerName, apiKey) {
    switch (providerName) {
      case 'openrouter':
        this.providers.set('openrouter', new OpenRouterProvider(apiKey));
        break;
      case 'groq':
        this.providers.set('groq', new GroqProvider(apiKey));
        break;
    }
  }

  getAvailableProviders() {
    return Array.from(this.providers.keys());
  }

  async smartChat(messages, options = {}) {
    const preferredProvider = options.provider || null;

    // Priority: OpenRouter first (quality), then Groq (reliability)
    let providerChain = [];

    if (preferredProvider && this.providers.has(preferredProvider)) {
      providerChain.push(preferredProvider);
    }

    // Add all available providers with priority
    const priorityOrder = ['openrouter', 'groq'];
    const available = this.getAvailableProviders().sort(
      (a, b) => priorityOrder.indexOf(a) - priorityOrder.indexOf(b),
    );

    providerChain.push(...available);
    providerChain = [...new Set(providerChain)];

    const errors = [];

    for (const providerName of providerChain) {
      if (!this.providers.has(providerName)) continue;

      try {
        console.log(`🔄 Trying ${providerName}...`);

        const response = await this.chat(providerName, messages, options);

        console.log(`✅ ${providerName} succeeded`);
        return {
          ...response,
          provider: providerName,
        };
      } catch (error) {
        console.warn(`❌ ${providerName}: ${error.message}`);
        errors.push({ provider: providerName, error: error.message });
        continue;
      }
    }

    throw new Error(`All providers failed: ${errors.map((e) => e.provider).join(', ')}`);
  }

  async chat(providerName, messages, options = {}) {
    const provider = this.providers.get(providerName);
    if (!provider) throw new Error(`Provider ${providerName} not configured`);
    return provider.chat(messages, options);
  }
}

export const providerManager = new ProviderManager();
