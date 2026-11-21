# Requirements (EARS Format)

1. WHEN `scanner/scan.js` runs on a target folder, THE SYSTEM SHALL safely read `package.json` (handling missing or malformed JSON without crashing) and report dependency counts and risk flags.
2. WHEN `scanner/scan.js` inspects project files, THE SYSTEM SHALL detect files with zero import/reference matches and mark them as "Dormant Spirits".
3. WHEN a scan finishes, THE SYSTEM SHALL produce a structured JSON report (`report.json`) that `web/` loads to render filterable items and a health score.
4. FOR ALL valid scan inputs, THE HEALTH SCORE AND ITEM COUNTS SHALL be deterministic, non-negative, and consistent with the reported items[cite: 5].