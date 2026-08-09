# Project Rules for DesignDeck (Multi Utility Workspace)

## Report Maintenance & Preservation Rule
- **Protected Primary Report**: The file [codebase_analysis_report.md](file:///a:/Multi%20Utility/docs/analysis/codebase_analysis_report.md) in the `docs/analysis/` folder is designated as the **main and latest platforms researched report**.
- **Global Immutability Directive for `/docs`**: Under no circumstances should ANY existing report file inside the `docs/` directory or any of its subfolders (`analysis/`, `research/`, `investigation/`, `audit/`, etc.) be touched, edited, modified, overwritten, or deleted. All created reports are strictly immutable write-once documents.
- **Categorized Subfolders & New Reports Directive**: If any new analysis, research, investigation, or audit reports are requested in the future, ALWAYS create a brand-new file (e.g., `docs/<category>/report_YYYY_MM_DD.md` or `docs/<category>/<topic>_report.md`) saved under the appropriate `/docs` subfolder:
  - `docs/analysis/` — For codebase analysis, UI/UX audits, and performance analysis reports.
  - `docs/research/` — For tech stack evaluations, architecture plans, and technology research documents.
  - `docs/investigation/` — For bug investigations, diagnostic tracebacks, and troubleshooting reports.
  - `docs/audit/` — For code quality, security, and accessibility compliance audit reports.
