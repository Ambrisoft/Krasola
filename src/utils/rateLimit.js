// Sliding-Window Rate Limiting Helper stored in localStorage to prevent API quota exhaustion

import { recordUserActivity } from './telemetryTracker';

export function checkRateLimit(apiKeyName, maxRequests = 50, windowMs = 3600000) {
  const now = Date.now();
  const storageKey = `rate_limit_${apiKeyName}`;
  const history = JSON.parse(localStorage.getItem(storageKey) || '[]');
  
  // Filter out requests older than the sliding window
  const activeRequests = history.filter(timestamp => now - timestamp < windowMs);
  
  if (activeRequests.length >= maxRequests) {
    const retryAfter = Math.ceil((windowMs - (now - activeRequests[0])) / 1000);
    recordUserActivity({
      category: 'search',
      title: 'Stock Search Rate Limited',
      description: `Hourly allowance reached (0 / ${maxRequests} remaining). Reset in ${Math.ceil(retryAfter / 60)}m.`,
      status: 'warning'
    });
    return {
      allowed: false,
      remaining: 0,
      maxRequests,
      retryAfter
    };
  }
  
  activeRequests.push(now);
  localStorage.setItem(storageKey, JSON.stringify(activeRequests));
  
  const remaining = maxRequests - activeRequests.length;
  
  return {
    allowed: true,
    remaining,
    maxRequests,
    retryAfter: 0
  };
}

// Inspect current rate limit status without consuming allowance
export function getRateLimitStatus(apiKeyName = 'unsplash_search', maxRequests = 50, windowMs = 3600000) {
  const now = Date.now();
  const storageKey = `rate_limit_${apiKeyName}`;
  const history = JSON.parse(localStorage.getItem(storageKey) || '[]');
  
  const activeRequests = history.filter(timestamp => now - timestamp < windowMs);
  const remaining = Math.max(0, maxRequests - activeRequests.length);
  const oldestTimestamp = activeRequests[0] || now;
  const resetSeconds = Math.max(0, Math.ceil((windowMs - (now - oldestTimestamp)) / 1000));

  return {
    used: activeRequests.length,
    remaining,
    maxRequests,
    resetSeconds,
    resetMinutes: Math.ceil(resetSeconds / 60)
  };
}
