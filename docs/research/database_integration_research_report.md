# Research Report: Decoupled Assets Schema & Client-Side Rate Throttling

> **DOCUMENT CONTROL**:
> - **Category**: Technology & Algorithmic Research Report
> - **Location**: `docs/research/database_integration_research_report.md`
> - **Status**: Immutable Baseline Document
> - **Author**: Antigravity AI (Google DeepMind Team)

---

## 1. Relational Database Schema Design (Supabase PostgreSQL)

We design a decoupled PostgreSQL schema to separate platform-curated presets from community-contributed assets.

### 1. Palette Lab Tables
```sql
-- Platform Presets (Read-only for public)
CREATE TABLE platform_palettes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(50) NOT NULL,
  colors JSONB NOT NULL, -- Array of hex codes
  mode VARCHAR(30) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Community / User Palettes
CREATE TABLE community_palettes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  username VARCHAR(80) NOT NULL, -- Credit display name
  name VARCHAR(50) NOT NULL,
  colors JSONB NOT NULL,
  mode VARCHAR(30) NOT NULL,
  likes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
```

### 2. Pattern Studio Tables
```sql
-- Platform Presets (Read-only for public)
CREATE TABLE platform_patterns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key VARCHAR(30) UNIQUE NOT NULL,
  name VARCHAR(50) NOT NULL,
  category VARCHAR(30) NOT NULL,
  default_bg VARCHAR(7) NOT NULL,
  default_color1 VARCHAR(7) NOT NULL,
  default_color2 VARCHAR(7) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Community / User Patterns
CREATE TABLE community_patterns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  username VARCHAR(80) NOT NULL,
  name VARCHAR(50) NOT NULL,
  pattern_type VARCHAR(30) NOT NULL,
  width INTEGER NOT NULL,
  height INTEGER NOT NULL,
  scale NUMERIC NOT NULL,
  stroke INTEGER NOT NULL,
  angle INTEGER NOT NULL,
  bg VARCHAR(7) NOT NULL,
  color1 VARCHAR(7) NOT NULL,
  color2 VARCHAR(7) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
```

---

## 2. Double-Tab Library System Interface (Core vs. Community)

- **Palette Lab (Explore Hub)**:
  - **Tab 1: DesignDeck Presets**: Fetched from `platform_palettes`. Renders standard palette cards.
  - **Tab 2: Community Creations**: Fetched from `community_palettes`. Shows the palette name, color swatches, likes, and creator credits (`Created by: username`).
- **Pattern Studio (Templates Gallery)**:
  - **Tab 1: DesignDeck Presets**: Fetched from `platform_patterns`. Renders default geometrical templates.
  - **Tab 2: Community Creations**: Fetched from `community_patterns`. Shows template cards styled dynamically, with creator credits.

---

## 3. Client-Side Sliding-Window Rate Limiting Algorithm

To protect client-side API requests (such as Unsplash search) from hourly key exhaustion without forcing user login, we implement a client-side **Sliding-Window Rate Limiter** stored in `localStorage`:

```javascript
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
```
