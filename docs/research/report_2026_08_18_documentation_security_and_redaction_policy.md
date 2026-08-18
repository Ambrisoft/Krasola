# Documentation Security Classification & Sensitive Information Redaction Policy

## 1. Executive Summary
Public and developer documentation must balance complete technical clarity with uncompromising system security. Following standards established by industry leaders (Stripe, AWS, Supabase, GitHub), all documentation must undergo strict **Information Disclosure Filtering** to guarantee that zero secrets, private credentials, or personally identifiable information (PII) are ever exposed.

---

## 2. Information Classification Matrix

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      Information Security Classification                    │
├───────────────────────┬────────────────────────────┬────────────────────────┤
│  🟢 PUBLIC / ALLOWED  │   🟡 MASKED / SANITIZED    │  🔴 STRICTLY REDACTED  │
│  • Architectural DDLs │  • <YOUR_API_KEY>          │  • Service Role Keys   │
│  • Public Algorithms  │  • Environment Variables   │  • Raw Passwords / DSN │
│  • WCAG Formulas      │  • Generic Domains         │  • User PII / Emails   │
│  • Hotkeys & UI Specs │  • Sample UUIDs            │  • JWT Secret Signers  │
└───────────────────────┴────────────────────────────┴────────────────────────┤
```

### Level 1: Public & Educational Assets (🟢 Safe to Display)
* **Architectural & Schema DDLs:** Table names, column definitions, data types, indexes, and foreign keys (`public.profiles`, `public.platform_palettes`, `public.user_notifications`).
* **Mathematical Formulas & Algorithms:** WCAG 2.1 relative luminance calculation ($L = 0.2126R + 0.7152G + 0.0722B$), contrast ratio equations, Bézier curve geometry, and Canvas WebP compression routines.
* **Row Level Security (RLS) Policies:** Declarative PostgreSQL access control logic (`(SELECT auth.uid()) = user_id`).
* **Client Configurations:** Public frontend endpoints, Supabase project URL structures, and public publishable anonymous keys (`anon_key`).
* **PWA & Build Configurations:** Service Worker caching keys (`krasola-pwa-v1.1.0`), SemVer rules, and keyboard shortcut mappings.

---

### Level 2: Masked & Sanitized Assets (🟡 Masked with Standard Notations)
* **Environment Variable References:** Using `import.meta.env.VITE_SUPABASE_URL` or `process.env.RESEND_API_KEY` rather than real strings.
* **Secrets Placeholders:** Masking credentials using standard syntax: `<YOUR_RESEND_API_KEY>`, `re_************************`, `sbp_****************`.
* **Sample User Identities:** Using generic developer identities (`alex@ambrisoft.com`, `user@example.com`, `00000000-0000-0000-0000-000000000000`).

---

### Level 3: Strictly Redacted & Hidden Secrets (🔴 NEVER Displayed)
* **Service Role Secret Keys:** Supabase `service_role` secrets that bypass Row Level Security.
* **Production SMTP Credentials:** Real API keys or password strings for email dispatch.
* **Raw Database Connection Strings:** Direct PostgreSQL URI strings containing administrative passwords (`postgres://postgres:[PASSWORD]@...`).
* **Private User PII:** Real production user email addresses, IP logs, or personal account metadata.
* **Cryptographic Signing Secrets:** `JWT_SECRET` keys used to sign access tokens.

---

## 3. Automated Validation & Verification in Krasola
1. **Build-Time Scanning:** CI/CD and pre-commit checks to ensure no hardcoded tokens matching `re_[a-zA-Z0-9]{24,}` or `eyJ[a-zA-Z0-9_-]{20,}` exist in documentation content.
2. **Data-Layer Redaction:** Redaction is enforced at the data store layer (`docsContent.js`) rather than via CSS overlays to ensure raw inspection remains 100% secure.
