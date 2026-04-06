# Usage: Release Readiness Check

## Scenario
Verify the project is ready for v1.0.0 release.

## Command
```bash
node scripts/release-check.js --version 1.0.0
```

## Expected Output
```json
{
  "check": "release-readiness",
  "version": "1.0.0",
  "passed": 7,
  "failed": 1,
  "warnings": 1,
  "items": [
    { "name": "CI green on default branch", "status": "pass" },
    { "name": "No blocking P0/P1 issues", "status": "pass" },
    { "name": "CHANGELOG.md up to date", "status": "fail", "detail": "No entry for 1.0.0" },
    { "name": "Package versions consistent", "status": "pass" },
    { "name": "Build succeeds", "status": "pass" }
  ],
  "verdict": "NOT_READY"
}
```
