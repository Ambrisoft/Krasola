# Research Report: Production-Ready User Authentication Architecture

> **DOCUMENT CONTROL**:
> - **Category**: User Auth & Client Security Research Report
> - **Location**: `docs/research/user_auth_integration_research_report.md`
> - **Status**: Immutable Baseline Document
> - **Author**: Antigravity AI (Google DeepMind Team)

---

## 1. Authentication Framework & OAuth Providers

To make **Krasola** production-ready, we implement **Supabase Auth** as our primary provider:
- **Email & Password**: Standard authentication flow for users who prefer custom credentials.
- **Third-Party OAuth (Google & GitHub)**: Recommended social sign-ins to reduce friction.
- **Session Management**: JWT session tokens stored in standard local storage (auto-refreshed by the Supabase SDK).

---

## 2. Platform Navigation Integration

We integrate an **Account Studio** tab directly into the sidebar navigation:
- **Tab Key**: `account`
- **Icon**: `User` (from `lucide-react`)
- **Integration Points**:
  - **Logged-out State**: Displays cards for Sign In (email/password/Google/GitHub) and Sign Up (with password rules).
  - **Logged-in State**: Displays user details (avatar, email), sync status of assets, and a Sign Out button.

---

## 3. Account Synchronization Flow

When a user logs in:
1. **Local Asset Merge**: Krasola scans existing guest assets saved in `localStorage`.
2. **Vault Migration**: Prompts the user: *"Would you like to sync your offline saved assets to your Krasola cloud account?"*
3. **Cloud Sync**: Invokes database inserts to push offline swatches and pattern coordinates to the user's Supabase account.
