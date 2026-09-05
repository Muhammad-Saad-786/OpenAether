// src/lib/providers/groq-provider.js
import Groq from 'groq-sdk';
import { BaseProvider } from './base-provider';

export class GroqProvider extends BaseProvider {
  constructor(apiKey) {
    super(apiKey);
    this.client = new Groq({
      apiKey: apiKey,
      dangerouslyAllowBrowser: true,
    });
    // Exact free models from Groq dashboard
    this.freeModels = [
      'openai/gpt-oss-20b',
      'openai/gpt-oss-120b',
      'groq/compound',
      'groq/compound-mini',
      'qwen/qwen3.6-27b',
      'qwen/qwen3.8-27b',
      'allam-2-7b',
    ];
  }

  async chat(messages, options = {}) {
    try {
      // Use exact model ID
      const modelName = options.model || 'openai/gpt-oss-20b';

      console.log(`🔵 Groq using model: ${modelName}`);

      const response = await this.client.chat.completions.create({
        messages: messages.map((m) => ({ role: m.role, content: m.content })),
        model: modelName,
        max_tokens: options.maxTokens || 1000,
        temperature: options.temperature || 0.7,
      });

      return {
        content: response.choices[0].message.content,
        model: response.model,
        usage: response.usage,
      };
    } catch (error) {
      console.error('❌ Groq API Error:', error.message);
      throw error;
    }
  }
}
