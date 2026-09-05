// src/lib/providers/gemini-provider.js
import { GoogleGenerativeAI } from '@google/generative-ai';
import { BaseProvider } from './base-provider';

export class GeminiProvider extends BaseProvider {
  constructor(apiKey) {
    super(apiKey);
    this.client = new GoogleGenerativeAI(apiKey);
  }

  async chat(messages, options = {}) {
    try {
      // Get model name - ensure it has correct prefix
      let modelName = options.model || 'gemini-1.5-flash';

      // If model name doesn't start with 'gemini-', add it
      if (!modelName.startsWith('gemini-')) {
        modelName = 'gemini-' + modelName;
      }

      console.log(`🔵 Gemini using model: ${modelName}`);

      const model = this.client.getGenerativeModel({ model: modelName });

      const lastUserMessage = messages.filter((m) => m.role === 'user').pop();
      const prompt = lastUserMessage?.content || '';

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      return {
        content: text,
        model: modelName,
        usage: null,
      };
    } catch (error) {
      console.error('❌ Gemini API Error:', error.message);
      throw error;
    }
  }
}
