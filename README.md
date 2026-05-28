# Rollbar Toolkit

SDK, CLI, and MCP server for the [Rollbar](https://rollbar.com) API.

## Quick Start

### Download a binary

Grab the latest release for your platform from the [Releases](../../releases) page. No runtime required.

```bash
# macOS (Apple Silicon)
curl -L -o rollbar https://github.com/spenserhale/rollbar-ai-toolkit/releases/latest/download/rollbar-darwin-arm64
chmod +x rollbar
./rollbar --help
```

### Or run with Bun

```bash
# Install Bun if you don't have it: https://bun.sh
bun install
bun run build

# Run the CLI (103 KB)
bun dist/rollbar-cli.js --help

# Run the MCP server
bun dist/rollbar-mcp.js
```

## Configuration

Set your Rollbar API tokens as environment variables:

```bash
export ROLLBAR_PROJECT_TOKEN="your-project-token"   # items, occurrences, deploys, environments
export ROLLBAR_ACCOUNT_TOKEN="your-account-token"    # projects, users
```

You can find these in Rollbar under **Settings > Project Access Tokens** and **Settings > Account Access Tokens**.

## CLI

```
rollbar items list                          # List error items
rollbar items list --status active          # Filter by status
rollbar items list --level critical         # Filter by level
rollbar items list --environment production # Filter by environment
rollbar items get 12345                     # Get item by ID
rollbar items get-by-counter 42            # Get item by project counter (#42 in UI)
rollbar occurrences list --itemId 12345    # List occurrences for an item
rollbar occurrences get abc-123            # Get a single occurrence
rollbar projects list                       # List all projects
rollbar projects get 67890                  # Get project details
rollbar deploys list                        # List deploys
rollbar deploys list --environment staging  # Filter deploys by env
rollbar deploys get 111                     # Get deploy details
rollbar environments list                   # List environments
rollbar users list                          # List users
rollbar users get 99                        # Get user details

# RQL (Rollbar Query Language) — async; tip: always include LIMIT 10 / LIMIT 100
rollbar rql jobs create "SELECT * FROM item_occurrence LIMIT 10"           # submit, returns job id
rollbar rql jobs create "SELECT * FROM item_occurrence LIMIT 10" --wait    # submit, poll, return rows
rollbar rql jobs list                        # List recent RQL jobs
rollbar rql jobs get 12345                   # Check status of an RQL job
rollbar rql jobs results 12345               # Fetch rows from a completed RQL job
rollbar rql jobs cancel 12345 --force        # Cancel an in-flight RQL job
```

Every command accepts `--token` to override the default token for that request.

## MCP Server

The MCP server lets AI assistants (Claude Desktop, Cursor, etc.) query your Rollbar data.

### Setup with Claude Desktop

Add to `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "rollbar": {
      "command": "/path/to/rollbar-mcp",
      "env": {
        "ROLLBAR_PROJECT_TOKEN": "your-project-token",
        "ROLLBAR_ACCOUNT_TOKEN": "your-account-token"
      }
    }
  }
}
```

Or if using Bun instead of the compiled binary:

```json
{
  "mcpServers": {
    "rollbar": {
      "command": "bun",
      "args": ["run", "/path/to/dist/rollbar-mcp.js"],
      "env": {
        "ROLLBAR_PROJECT_TOKEN": "your-project-token",
        "ROLLBAR_ACCOUNT_TOKEN": "your-account-token"
      }
    }
  }
}
```

### Available Tools

| Tool                  | Description                                                   |
| --------------------- | ------------------------------------------------------------- |
| `list_items`          | List items with optional filters (status, level, environment) |
| `get_item`            | Get item by internal ID                                       |
| `get_item_by_counter` | Get item by project counter number                            |
| `list_occurrences`    | List occurrences, optionally filtered by item ID              |
| `get_occurrence`      | Get a single occurrence                                       |
| `list_projects`       | List all projects                                             |
| `get_project`         | Get project by ID                                             |
| `list_deploys`        | List deploys with optional filters                            |
| `get_deploy`          | Get deploy by ID                                              |
| `list_environments`   | List environments                                             |
| `list_users`          | List all users                                                |
| `get_user`            | Get user by ID                                                |
| `create_rql_job`      | Submit an RQL query; returns a queued job (always LIMIT it)   |
| `list_rql_jobs`       | List RQL jobs                                                 |
| `get_rql_job`         | Check status of an RQL job                                    |
| `get_rql_job_results` | Fetch rows of a completed RQL job                             |
| `cancel_rql_job`      | Cancel an in-flight RQL job                                   |

## Architecture

```
packages/sdk/    Core SDK: types, API client, config
    ^       ^
    |       |
packages/cli/   packages/mcp/
  (Stricli)       (FastMCP)
```

Both the CLI and MCP server are thin wrappers over the SDK. All API logic lives in the SDK package.

## Development

```bash
bun install              # Install dependencies
vp test                  # Run tests
vp check                 # Lint + format + type check

# Dev mode
vp dev --filter @rollbar-toolkit/cli -- items list
vp dev --filter @rollbar-toolkit/mcp

# Bundle (single JS files, requires Bun to run)
bun run build

# Compile (standalone executables, no runtime needed)
bun run compile

# Inspect MCP tools
npx fastmcp inspect packages/mcp/src/index.ts
```

## Adding a New API Operation

1. Add types to `packages/sdk/src/types.ts`
2. Add client method to `packages/sdk/src/client.ts`
3. Export from `packages/sdk/src/index.ts`
4. Add CLI command in `packages/cli/src/commands/<resource>/`
5. Add MCP tool in `packages/mcp/src/tools/resources.ts`

## License

MIT
