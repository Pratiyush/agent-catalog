# MCP Server Spec

MCP.json format for Model Context Protocol server configurations.

## Format

```json
{
  "name": "<kebab-case-name>",
  "description": "One-line description",
  "command": "node",
  "args": ["server.js"],
  "env": {
    "API_KEY": "${API_KEY}"
  },
  "transport": "stdio | http",
  "license": "MIT"
}
```

## Fields

| Field | Required | Description |
|-------|----------|-------------|
| name | yes | kebab-case identifier |
| description | yes | One-line summary |
| command | yes | Executable command |
| args | yes | Array of command arguments |
| env | no | Environment variables (use ${VAR} for substitution) |
| transport | yes | "stdio" or "http" |
| license | no | SPDX identifier |
