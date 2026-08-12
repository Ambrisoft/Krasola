// Sliding-Window Rate Limiting Helper stored in localStorage to prevent API quota exhaustion

export function checkRateLimit(apiKeyName, maxRequests = 10, windowMs = 60000) {
  const now = Date.now();
  const storageKey = `rate_limit_${apiKeyName}`;
  const history = JSON.parse(localStorage.getItem(storageKey) || '[]');
  
  // Filter out requests older than the sliding window
  const activeRequests = history.filter(timestamp => now - timestamp < windowMs);
  
  if (activeRequests.length >= maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      retryAfter: Math.ceil((windowMs - (now - activeRequests[0])) / 1000)
    };
  }
  
  activeRequests.push(now);
  localStorage.setItem(storageKey, JSON.stringify(activeRequests));
  
  return {
    allowed: true,
    remaining: maxRequests - activeRequests.length,
    retryAfter: 0
  };
}
