# @rollbar-toolkit/mcp

MCP server for Rollbar, built with [FastMCP](https://github.com/punkpeye/fastmcp).

## Tools

| Tool | Description |
|------|-------------|
| `list_items` | List items (error groups) with optional filters: status, level, environment, limit, page |
| `get_item` | Get an item by its internal Rollbar item ID |
| `get_item_by_counter` | Get an item by its project-scoped counter number (as shown in the Rollbar UI) |
| `list_occurrences` | List occurrences (individual error instances), optionally filtered by item ID |
| `get_occurrence` | Get a single occurrence by its occurrence ID |
| `list_projects` | List all projects in the account |
| `get_project` | Get a project by its project ID |
| `list_deploys` | List deploys with optional filters: projectId, environment, limit, page |
| `get_deploy` | Get a deploy by its deploy ID |
| `list_environments` | List environments, optionally scoped to a specific project |
| `list_users` | List all users in the account |
| `get_user` | Get a user by their user ID |

## Setup with Claude Desktop

Add this to your Claude Desktop config (`~/Library/Application Support/Claude/claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "rollbar-toolkit": {
      "command": "bun",
      "args": ["run", "/Users/spenser/Code/Toolkits/rollbar-toolkit/packages/mcp/src/index.ts"],
      "env": {
        "ROLLBAR_PROJECT_TOKEN": "your-project-token-here",
        "ROLLBAR_ACCOUNT_TOKEN": "your-account-token-here"
      }
    }
  }
}
```

- **`ROLLBAR_PROJECT_TOKEN`** — required for item, occurrence, deploy, and environment tools.
- **`ROLLBAR_ACCOUNT_TOKEN`** — required for project and user tools.

## Development

```bash
# Run in stdio mode
vp dev --filter @rollbar-toolkit/mcp

# Inspect with FastMCP inspector
npx fastmcp inspect src/index.ts
```
