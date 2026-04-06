# SkillsCraft Hub — Marketplace

Browse and discover AI agent skills organized by category.

## Categories

| Directory | Description |
|-----------|-------------|
| `skill/`  | General-purpose agent skills with scripts, references, and assets |
| `prompt/` | Prompt templates for common agent tasks |
| `agent/`  | Agent configuration and orchestration skills |
| `mcp/`    | MCP (Model Context Protocol) server skills |

## Installing a Skill

```bash
skill install <skill-name>
```

## Submitting a Skill

See [CONTRIBUTING.md](../CONTRIBUTING.md) for submission guidelines.

## Validating Skills

```bash
node scripts/validate-skills.mjs
```

All skills in this marketplace are validated on every push via CI.
