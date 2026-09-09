export class BaseProvider {
  constructor(apiKey) {
    this.apiKey = apiKey;
  }

  async chat(messages, options = {}) {
    throw new Error('Method not implemented');
  }

  async streamChat(messages, options = {}, onChunk) {
    throw new Error('Streaming is not implemented for this provider');
  }

  async listModels() {
    throw new Error('Method not implemented');
  }
}
