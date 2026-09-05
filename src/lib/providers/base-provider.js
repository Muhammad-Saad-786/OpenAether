export class BaseProvider {
  constructor(apiKey) {
    this.apiKey = apiKey;
  }

  async chat(messages, options = {}) {
    throw new Error('Method not implemented');
  }

  async listModels() {
    throw new Error('Method not implemented');
  }
}
