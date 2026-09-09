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

    // Groq free models (enabled)
    this.modelRotation = [
      'openai/gpt-oss-20b',
      'groq/compound',
      'groq/compound-mini',
      'qwen/qwen3.6-27b',
      'openai/gpt-oss-120b',
      'allam-2-7b',
    ];

    this.failedModels = new Set();
    this.currentModelIndex = 0;
  }

  async chat(messages, options = {}) {
    let lastError;

    const modelsToTry = [
      options.model,
      ...this.modelRotation.filter((m) => m !== options.model),
    ].filter(Boolean);

    for (const modelName of modelsToTry) {
      if (this.failedModels.has(modelName)) continue;

      try {
        console.log(`🔵 Groq trying: ${modelName}`);

        const response = await this.client.chat.completions.create({
          messages: messages.map((m) => ({ role: m.role, content: m.content })),
          model: modelName,
          max_tokens: options.maxTokens || 4000,
          temperature: options.temperature || 0.5,
          stream: options.stream || false,
        });

        console.log(`✅ Groq succeeded with: ${modelName}`);
        this.failedModels.delete(modelName);

        return {
          content: response.choices[0].message.content,
          model: response.model,
          usage: response.usage,
        };
      } catch (error) {
        console.warn(`⚠️ Groq ${modelName}: ${error.message}`);
        lastError = error;
        this.failedModels.add(modelName);
        continue;
      }
    }

    throw lastError || new Error('All Groq models failed');
  }

  async streamChat(messages, options = {}, onChunk) {
    let lastError;
    const modelsToTry = [
      options.model,
      ...this.modelRotation.filter((m) => m !== options.model),
    ].filter(Boolean);

    for (const modelName of modelsToTry) {
      if (this.failedModels.has(modelName)) continue;

      try {
        const stream = await this.client.chat.completions.create({
          messages: messages.map((m) => ({ role: m.role, content: m.content })),
          model: modelName,
          max_tokens: options.maxTokens || 4000,
          temperature: options.temperature ?? 0.5,
          stream: true,
        });

        let fullResponse = '';
        let finishReason = null;
        for await (const chunk of stream) {
          const content = chunk.choices?.[0]?.delta?.content || '';
          finishReason = chunk.choices?.[0]?.finish_reason || finishReason;
          if (content) {
            fullResponse += content;
            onChunk?.(fullResponse);
          }
        }

        this.failedModels.delete(modelName);
        return { content: fullResponse, model: modelName, finishReason, usage: null };
      } catch (error) {
        console.warn(`⚠️ Groq stream ${modelName}: ${error.message}`);
        lastError = error;
        this.failedModels.add(modelName);
      }
    }

    throw lastError || new Error('All Groq streaming models failed');
  }
}
