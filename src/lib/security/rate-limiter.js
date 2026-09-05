// src/lib/security/rate-limiter.js
export class RateLimiter {
  constructor() {
    this.limits = new Map();
    this.windowMs = 60000; // 1 minute window
  }

  async checkLimit(userId, action) {
    const key = `${userId}:${action}`;
    const now = Date.now();

    const userLimits = this.limits.get(key) || [];
    const recentRequests = userLimits.filter((timestamp) => now - timestamp < this.windowMs);

    const limit = this.getLimitForAction(action);

    if (recentRequests.length >= limit) {
      throw new Error('Rate limit exceeded. Please try again later.');
    }

    recentRequests.push(now);
    this.limits.set(key, recentRequests);

    return {
      remaining: limit - recentRequests.length,
      resetAt: new Date(now + this.windowMs),
    };
  }

  getLimitForAction(action) {
    const limits = {
      chat: 30,
      model_list: 10,
      api_key_save: 5,
      profile_update: 10,
    };

    return limits[action] || 20;
  }
}
