# Research Report: Premium Account Studio Features & Customization Specs

> **DOCUMENT CONTROL**:
> - **Category**: User Accounts & Customization Specs Research Report
> - **Location**: `docs/research/account_studio_features_report.md`
> - **Status**: Immutable Baseline Document
> - **Author**: Antigravity AI (Google DeepMind Team)

---

## 1. Feature Specifications

To make the **Account Studio** a premium control center, we design a secondary sub-tab navigation layout with 4 functional areas:

### Tab 1: Profile Preferences (`profile`)
- **Public Profile Name & Bio**: Customize display names and creator taglines for the Community Galleries.
- **Visual Avatar Picker**: Upload custom SVG/image avatars or generate random geometric avatars based on active palette colors.
- **Local Settings Override**: Select default dashboard start view, localized date-time formats, and interface animations speed.

### Tab 2: Security & Device Registry (`security`)
- **Live Session Registry**: Lists current active login sessions (device, IP address tracker, location, and login timestamp).
- **Session Revocation**: A button to "Revoke Session" (deletes the refresh token from Supabase Auth to force logout on that specific device).
- **Password Rotator**: Change password with validation feedback.

### Tab 3: Cloud Synchronization & Archiver (`backup`)
- **Automatic Cloud Backup**: Toggle auto-save (when on, any new asset is immediately synced to the cloud, eliminating manual backups).
- **Offline Merge Inspector**: Visual lists comparing offline local storage count vs. cloud database count.
- **Bulk Vault Exporter**: Downloads a structured `.json` bundle containing all user assets (palettes, patterns, custom icons).

### Tab 4: Developer Console (`developer`)
- **Personal Access Tokens (PAT)**: Create API keys with custom expiration dates to read saved palettes/patterns via API queries.
- **Developer API Endpoint**: Enable a private endpoint URL (`https://defxhgoqjfwlflpximes.supabase.co/rest/v1/...`) to fetch raw JSON swatches directly.
