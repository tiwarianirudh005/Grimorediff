# Technical Steering

## Stack
- Use Node.js for the local project scanner (`scanner/scan.js`) and clean frontend HTML/CSS/JavaScript in `web/` so it runs reliably without heavy server or database setup.
- Keep commands simple to run in the terminal and document them clearly in `README.md`.

## Testing
- Include deterministic unit checks and property-based tests (using `fast-check`) for JSON parsing, file scanning, and health score calculation.