# Usage: Generate Changelog

## Scenario
Generate a changelog entry from the last tag to HEAD.

## Command
```bash
node scripts/generate-changelog.js --from v0.9.0 --to HEAD --format markdown
```

## Expected Output
```markdown
## [0.9.1] - 2026-04-06

### Added
- Skill marketplace directory structure (`54ff85c`)
- Build-time validation for all skills (`f470565`)

### Fixed
- Gallery card layout on mobile (`fb08d72`)
```

## GitHub Release Format
```bash
node scripts/generate-changelog.js --from v0.9.0 --to HEAD --format github
```
