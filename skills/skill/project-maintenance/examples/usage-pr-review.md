# Usage: PR Review Checklist

## Scenario
Review PR #42 against the project checklist before merging.

## Command
```bash
node scripts/pr-checklist.js --pr 42
```

## Expected Output
```json
{
  "check": "pr-checklist",
  "target": "#42",
  "passed": 10,
  "failed": 1,
  "warnings": 1,
  "items": [
    { "name": "Title follows conventional commits", "status": "pass" },
    { "name": "Description has Summary section", "status": "pass" },
    { "name": "CI checks green", "status": "fail", "detail": "1 check pending" },
    { "name": "Has labels", "status": "pass" },
    { "name": "Reviewers assigned", "status": "warning", "detail": "No reviewers" }
  ],
  "verdict": "NEEDS_WORK"
}
```

## When to use
- Before merging any PR
- During code review to ensure completeness
- As a CI check for PR quality gates
