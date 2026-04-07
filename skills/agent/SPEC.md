# Agent Spec

AGENT.md format for pre-configured AI agent definitions.

## Format

```yaml
---
name: <kebab-case-name>
description: One-line description
model: claude-opus-4-6 | claude-sonnet-4-6 | gpt-4 | etc
skills: [skill-name-1, skill-name-2]
prompts: [prompt-name-1]
mcp_servers: [mcp-name-1]
license: MIT
---

# Agent Description

System prompt and behavior definition for this agent.
```

## Frontmatter

| Field | Required | Description |
|-------|----------|-------------|
| name | yes | kebab-case identifier |
| description | yes | One-line summary |
| model | yes | LLM model to use |
| skills | no | Array of skill names from skills/skill/ |
| prompts | no | Array of prompt names from skills/prompt/ |
| mcp_servers | no | Array of MCP server names |
| license | no | SPDX identifier |
