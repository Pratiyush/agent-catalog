# Agent Catalog — Marketplace

Browse and discover AI agent skills organized by category.

## Categories

| Directory | Description | Spec |
|-----------|-------------|------|
| `skill/`  | General-purpose agent skills with scripts, references, and assets | See [spec repository](https://github.com/Pratiyush/agentic-skills-framework) |
| `prompt/` | Click-to-copy prompt templates for common agent tasks | [prompt/SPEC.md](./prompt/SPEC.md) |
| `agent/`  | Pre-configured agent definitions that bundle skills, prompts, and MCP servers | [agent/SPEC.md](./agent/SPEC.md) |
| `mcp/`    | Model Context Protocol server configurations | [mcp/SPEC.md](./mcp/SPEC.md) |

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
