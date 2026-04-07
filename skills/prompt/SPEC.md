# Prompt Spec

PROMPT.md format for click-to-copy AI agent prompts.

## Format

Each prompt is a directory with `PROMPT.md`:

```yaml
---
name: <kebab-case-name>
description: One-line description
category: coding | writing | analysis | review
tags: tag1 tag2 tag3
license: MIT
---

# Prompt Title

The actual prompt text that users copy and paste into their AI agent.

Use {{placeholders}} for variables.
```

## Frontmatter

| Field | Required | Description |
|-------|----------|-------------|
| name | yes | kebab-case identifier, 1-64 chars |
| description | yes | One-line summary, 1-200 chars |
| category | yes | One of: coding, writing, analysis, review |
| tags | no | Space-separated keywords |
| license | no | SPDX identifier |

## Example

See `skills/prompt/example/PROMPT.md`
