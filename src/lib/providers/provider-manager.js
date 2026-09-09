// src/lib/providers/provider-manager.js
import { OpenRouterProvider } from './openrouter-provider';
import { GroqProvider } from './groq-provider';
import { supabase } from '@/lib/supabase/client';

const RESPONSE_SYSTEM_PROMPT = `You are OpenAether, a precise and practical assistant.
Internally classify the user's intent, plan the content, choose the response type, format it, and validate it before finishing. Do not reveal this internal process.
Response rules:
- Code requests: provide one complete, runnable code block with the language specified, followed by only essential explanation.
- Comparisons: use a compact Markdown table with a header and separator row.
- Explanations: use short paragraphs and headings only when useful.
- Tutorials or procedures: use numbered steps in the order they should be performed.
- Mixed requests: explain the key idea first, then include complete code blocks.
- Keep Markdown valid: close every code fence, keep lists and tables well spaced, and never put source code in a table.
- Do not emit thinking, pseudo-pipeline labels, repeated content, or a response fragment. Answer the user directly.`;

function prepareMessages(messages) {
  return [
    { role: 'system', content: RESPONSE_SYSTEM_PROMPT },
    ...messages.map((message) => ({ role: message.role, content: message.content })),
  ];
}

export function formatResponse(content) {
  const formatted = String(content || '')
    .replace(/\r\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
  const fenceCount = (formatted.match(/```/g) || []).length;

  return fenceCount % 2 === 0 ? formatted : `${formatted}\n\n\`\`\``;
}

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

        const response = await this.chat(providerName, prepareMessages(messages), options);

        console.log(`✅ ${providerName} succeeded`);
        return {
          ...response,
          content: formatResponse(response.content),
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

  async streamChat(messages, options = {}, onChunk) {
    const preparedMessages = prepareMessages(messages);
    const preferredProvider = options.provider || null;
    const priorityOrder = ['openrouter', 'groq'];
    const available = this.getAvailableProviders().sort(
      (a, b) => priorityOrder.indexOf(a) - priorityOrder.indexOf(b),
    );
    const providerChain = [...new Set([preferredProvider, ...available].filter(Boolean))];
    const errors = [];

    for (const providerName of providerChain) {
      if (!this.providers.has(providerName)) continue;

      try {
        const response = await this.providers
          .get(providerName)
          .streamChat(preparedMessages, options, onChunk);
        return { ...response, provider: providerName };
      } catch (error) {
        console.warn(`❌ ${providerName} streaming: ${error.message}`);
        errors.push({ provider: providerName, error: error.message });
      }
    }

    throw new Error(`All providers failed: ${errors.map((error) => error.provider).join(', ')}`);
  }
}

export const providerManager = new ProviderManager();
