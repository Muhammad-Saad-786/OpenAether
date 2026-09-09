// src/lib/providers/openrouter-provider.js
import OpenAI from 'openai';
import { BaseProvider } from './base-provider';

export class OpenRouterProvider extends BaseProvider {
  constructor(apiKey) {
    super(apiKey);
    this.client = new OpenAI({
      baseURL: 'https://openrouter.ai/api/v1',
      apiKey: apiKey,
      dangerouslyAllowBrowser: true,
      defaultHeaders: {
        'HTTP-Referer': window.location.origin || 'http://localhost:5173',
        'X-Title': 'OpenAether',
      },
    });

    // Updated model rotation with new models
    this.modelRotation = [
      'openai/gpt-4o-mini',
      'google/gemma-4-26b-a4b-it:free',
      'google/gemma-4-31b-it:free',
      'minimax/minimax-m3:free',
      'nvidia/nemotron-3.5-lightning:free',
      'cohere/north-mini-code:free',
      'liquid/lfm-2.5-2.6b:free',
      'z-ai/glm-5.2:free',
    ];

    this.currentModelIndex = 0;
    this.failedModels = new Set();
  }

  getNextWorkingModel() {
    // Get models that haven't failed recently
    const workingModels = this.modelRotation.filter((model) => !this.failedModels.has(model));

    if (workingModels.length === 0) {
      // Reset failed models if all have failed
      this.failedModels.clear();
      return this.modelRotation[0];
    }

    const model = workingModels[this.currentModelIndex % workingModels.length];
    this.currentModelIndex++;
    return model;
  }

  async chat(messages, options = {}) {
    let lastError;

    // Try requested model first, then rotate through others
    const modelsToTry = [
      options.model,
      ...this.modelRotation.filter((m) => m !== options.model),
    ].filter(Boolean);

    for (const modelName of modelsToTry) {
      try {
        console.log(`🔵 OpenRouter trying: ${modelName}`);

        const response = await this.client.chat.completions.create({
          messages: messages.map((m) => ({ role: m.role, content: m.content })),
          model: modelName,
          max_tokens: options.maxTokens || 1000,
          temperature: options.temperature || 0.7,
        });

        console.log(`✅ OpenRouter succeeded with: ${modelName}`);

        // Remove from failed models if it was there
        this.failedModels.delete(modelName);

        return {
          content: response.choices[0].message.content,
          model: response.model,
          usage: response.usage,
        };
      } catch (error) {
        console.warn(`⚠️ ${modelName}: ${error.message}`);
        lastError = error;

        // Mark model as failed
        this.failedModels.add(modelName);

        // If rate limited, wait before trying next
        if (error.status === 429) {
          const waitTime = 3000; // 3 seconds
          console.log(`⏳ Rate limited, waiting ${waitTime / 1000}s...`);
          await new Promise((resolve) => setTimeout(resolve, waitTime));
        }

        continue;
      }
    }

    throw lastError || new Error('All OpenRouter models failed');
  }

  async streamChat(messages, options = {}, onChunk) {
    let lastError;
    const modelsToTry = [
      options.model,
      ...this.modelRotation.filter((m) => m !== options.model),
    ].filter(Boolean);

    for (const modelName of modelsToTry) {
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
        console.warn(`⚠️ OpenRouter stream ${modelName}: ${error.message}`);
        lastError = error;
        this.failedModels.add(modelName);
      }
    }

    throw lastError || new Error('All OpenRouter streaming models failed');
  }
}
