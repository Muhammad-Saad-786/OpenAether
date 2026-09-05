// src/lib/test-providers.js
import { GroqProvider } from './providers/groq-provider';
import { GeminiProvider } from './providers/gemini-provider';
import { OpenRouterProvider } from './providers/openrouter-provider';

export async function testProvider(providerName, apiKey) {
  console.log(`🧪 Testing ${providerName}...`);

  const testMessage = [{ role: 'user', content: 'Say "Hello" only' }];

  try {
    let provider;
    switch (providerName) {
      case 'groq':
        provider = new GroqProvider(apiKey);
        break;
      case 'gemini':
        provider = new GeminiProvider(apiKey);
        break;
      case 'openrouter':
        provider = new OpenRouterProvider(apiKey);
        break;
      default:
        throw new Error('Unknown provider');
    }

    const response = await provider.chat(testMessage);
    console.log(`✅ ${providerName} works! Response:`, response.content);
    return { success: true, response };
  } catch (error) {
    console.error(`❌ ${providerName} failed:`, error);
    return { success: false, error };
  }
}
