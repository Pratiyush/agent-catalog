# Adding Skills to Agent Catalog

## Quick start

```bash
# Add a local skill
./scripts/add-skill.sh ./path/to/my-skill

# Add from GitHub
./scripts/add-skill.sh https://github.com/owner/repo

# Add a prompt
./scripts/add-skill.sh ./my-prompt --category prompt

# Dry run (preview without changes)
./scripts/add-skill.sh ./my-skill --dry-run

# Auto-fix issues and generate .skillignore
./scripts/add-skill.sh ./my-skill --auto-fix --add-skillignore
```

## Options

| Flag | Description |
|------|-------------|
| `--name <name>` | Override skill name |
| `--category <cat>` | Category: skill, prompt, agent, mcp |
| `--license <license>` | Set license in frontmatter |
| `--auto-fix` | Auto-fix common issues |
| `--add-skillignore` | Generate default .skillignore |
| `--add-gitignore` | Add skill to .gitignore |
| `--dry-run` | Preview without changes |
| `--validate-only` | Only validate, don't copy |
| `--force` | Overwrite existing skill |

## Manual process

If you prefer to add skills manually, see [CONTRIBUTING.md](CONTRIBUTING.md).
