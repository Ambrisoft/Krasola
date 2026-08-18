# Brand Email Templates & Custom SMTP Architecture Guide

## Overview
This document outlines the professional brand email design system, HTML template specifications, and custom SMTP provider setup for **Krasola** (Ambrisoft).

---

## 1. Visual Design Principles & Email Client Compatibility

Email clients (such as Gmail, Apple Mail, Outlook, and Yahoo) utilize diverse rendering engines (Webkit, Blink, Microsoft Word rendering engine). To guarantee **100% visual consistency**, the templates incorporate:

1. **Table-Based Fluid Hybrid Layout**: Multi-layer nested tables with maximum width constraint (`max-width: 560px`) ensuring perfect rendering on 4K monitors down to mobile screens.
2. **Brand Visual Identity**:
   - **Krasola Squircle Icon**: Modern gradient box (`linear-gradient(135deg, #6366f1 0%, #0284c7 100%)`) with drop shadow.
   - **Dark Mode Aesthetic**: Deep slate surface (`#111827`) encased in a subtle border (`#1f293d`) over a dark canvas (`#0b0f19`).
   - **Glow & Gradient Accents**: Top accent band matching Krasola's signature color spectrums.
3. **CTA Button Architecture**: Bulletproof inline anchor buttons with rounded corners, gradient backgrounds, and contrasting white typography.
4. **Security Information Matrix**: Dedicated contrast cards explaining link expiration, security notices, and safety guidelines.
5. **Fallback URLs**: Direct plaintext clickable links for environments where HTML buttons are blocked by corporate firewalls.

---

## 2. Template Inventory & GoTrue Variables

| Template File | Supabase Event | Purpose | Primary Variable |
|---|---|---|---|
| [`confirm-signup.html`](file:///a:/Multi%20Utility/supabase/email-templates/confirm-signup.html) | Confirm signup | New user email verification | `{{ .ConfirmationURL }}` |
| [`magic-link.html`](file:///a:/Multi%20Utility/supabase/email-templates/magic-link.html) | Magic Link | Passwordless 1-click login | `{{ .ConfirmationURL }}` |
| [`reset-password.html`](file:///a:/Multi%20Utility/supabase/email-templates/reset-password.html) | Reset Password | Secure password recovery | `{{ .ConfirmationURL }}` |
| [`change-email.html`](file:///a:/Multi%20Utility/supabase/email-templates/change-email.html) | Change Email Address | Re-verify updated email address | `{{ .ConfirmationURL }}` |
| [`invite-user.html`](file:///a:/Multi%20Utility/supabase/email-templates/invite-user.html) | Invite user | Workspace collaboration invite | `{{ .ConfirmationURL }}` |

---

## 3. Custom SMTP Configuration Recommendations

In Supabase Dashboard (**Authentication ➔ Emails ➔ SMTP Settings**):

### Recommended SMTP Providers:
1. **Resend** (Recommended for developers & modern apps):
   - Host: `smtp.resend.com`
   - Port: `465` (SSL) or `587` (TLS)
   - User: `resend`
   - Password: `re_...` (Your Resend API Key)
   - Sender Email: `noreply@yourcustomdomain.com`
2. **Brevo (formerly Sendinblue)** (300 free emails/day):
   - Host: `smtp-relay.brevo.com`
   - Port: `587`
3. **SendGrid / Postmark / Mailgun**:
   - Industry-standard deliverability and analytics.

---

## 4. Verification Checklist
- [x] Tested responsive widths on 320px, 480px, and 768px.
- [x] Inlined all CSS properties for email client compatibility.
- [x] Included Microsoft Outlook conditional comments (`[if mso]`).
- [x] All Supabase GoTrue template variables verified (`{{ .ConfirmationURL }}`).
