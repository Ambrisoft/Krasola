# Investigation Report: Database Storage Architecture & Integration Platforms

> **DOCUMENT CONTROL**:
> - **Category**: Database & Backend Investigation Report
> - **Location**: `docs/investigation/database_integration_investigation_report.md`
> - **Status**: Immutable Baseline Document
> - **Author**: Antigravity AI (Google DeepMind Team)

---

## 1. Objective & Current Architecture Limitations

Currently, **DesignDeck** stores all saved assets (palettes, patterns, customized icons) in browser `localStorage`.
- **Limitation**: Clearing browser cache deletes all user work. Users cannot sync their saved assets across multiple devices.
- **Limitation**: Explore Hub palettes and Templates Gallery patterns are hardcoded in the local source code.
- **Objective**: Move platform assets and user-saved assets to a centralized cloud database, while keeping them strictly separated.

---

## 2. Platform Evaluation: Cloudflare D1/R2 vs. Supabase

We evaluated two modern serverless backend architectures for this task:

### Option A: Supabase (Recommended)
- **Auth**: Built-in OAuth and Email/Password flows. Row Level Security (RLS) policies manage write/read scopes natively.
- **Database**: Full cloud PostgreSQL. RLS policies ensure users can only modify their own rows while community assets are globally read-only.
- **API**: Automatic REST API generation through PostgREST. Requires zero custom middleware coding.
- **Integration**: Access keys can be queried via Supabase CLI.

### Option B: Cloudflare Workers + D1 + R2
- **Auth**: Requires manual integration with third-party auth providers (Auth0, Clerk, or Firebase Auth).
- **Database (D1)**: Serverless SQLite. Good for simple SQL querying but lacks built-in RLS and user scope constraints.
- **Storage (R2)**: Best for bulk raw media files (e.g. image uploads), but overkill for metadata swatches and vector coordinates.
- **Wrangler CLI**: Requires setting up a secondary workers project.

---

## 3. Rate-Limiting & API Security Investigation

To secure the Unsplash image search and photo retrieval endpoints:
1. **Access Key Leakage**: Directly invoking `api.unsplash.com` client-side exposes our application key. We must proxy these calls.
2. **Proxy Gateway**: Deploy a serverless Supabase Edge Function to serve as a secure API Proxy. The Edge Function injects the Unsplash key before forwarding the request.
3. **Client-Side Throttling**: Renders a client-side token-bucket controller in the image search bar to alert the user of quota limits.
