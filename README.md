# Rollbar Toolkit

SDK, CLI, and MCP server for the [Rollbar](https://rollbar.com) API.

## Quick Start

### Install the CLI

```sh
curl -fsSL https://raw.githubusercontent.com/spenserhale/rollbar-ai-toolkit/main/scripts/install.sh | sh
```

The installer verifies the release checksum and installs `rollbar` to
`$HOME/.local/bin`.

### Download a binary

Grab the latest release for your platform from the [Releases](../../releases) page. No runtime required.

```bash
# macOS (Apple Silicon)
curl -L -o rollbar https://github.com/spenserhale/rollbar-ai-toolkit/releases/latest/download/rollbar-darwin-arm64
chmod +x rollbar
./rollbar --help
```

Once installed, the standalone binary can update itself:

```bash
rollbar upgrade            # download & install the latest release (verifies sha256)
rollbar upgrade --check    # report whether a newer version is available
rollbar upgrade --version 0.3.0   # install a specific version
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

Store credentials once in the OS keychain. Both CLI and MCP find them automatically:

```bash
rollbar auth set project   # hidden prompt for ROLLBAR_PROJECT_TOKEN
rollbar auth set account   # hidden prompt for ROLLBAR_ACCOUNT_TOKEN
rollbar auth list
rollbar config show --json # redacted values and credential sources
```

Find tokens under **Settings > Project Access Tokens** and **Settings > Account Access Tokens** in Rollbar. Resolution order is process environment > nearest `.env` > OS keychain > user configuration > defaults. Explicit CLI overrides retain priority.

For scripts, use `pbpaste | rollbar auth set project --stdin` or `op read 'op://Private/Rollbar/project-token' | rollbar auth set project --stdin`. `rollbar auth migrate --dry-run` previews moving existing plaintext credentials. See [configuration](docs/guides/configuration.md) and [security](docs/guides/security.md).

## CLI

```
rollbar items list                          # List error items
rollbar items list --status active          # Filter by status
rollbar items list --level critical         # Filter by level
rollbar items list --environment production # Filter by environment
rollbar items get 12345                     # Get item metadata by ID
rollbar items get-by-counter 42            # Get item metadata by project counter (#42 in UI)
rollbar items top                           # Top 10 items by occurrence count (metadata only)
rollbar items top --window 1d --limit 5    # Top 5 items in the last day

# item-details — item PLUS its latest occurrence and full stack trace
rollbar item-details get 12345              # Item + latest occurrence + stack trace
rollbar item-details get-by-counter 42      # Same, by project counter
rollbar item-details top                    # Top 10 items, each with its latest occurrence
rollbar item-details get 12345 --include-vars   # Also include stack-frame locals (may contain secrets)

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

# RQL (Rollbar Query Language) — async; a LIMIT is auto-appended (default 100)
rollbar rql query "SELECT item.counter, count(*) AS n FROM item_occurrence GROUP BY item.counter"   # run any query
rollbar rql query "... " --enrich             # hydrate item.counter/item.id rows to full item-details
rollbar rql by-url example.com                # top 5 items hitting a domain, each with its occurrence
rollbar rql by-url example.com --limit 10 --window 7d
rollbar rql affected-users 12345             # distinct affected users (id/username/email) for an item
rollbar rql affected-users 12345 --window 30d --limit 100

# Low-level async job control
rollbar rql jobs create "SELECT * FROM item_occurrence LIMIT 10" --wait   # submit, poll, return rows
rollbar rql jobs list                        # List recent RQL jobs
rollbar rql jobs get 12345                   # Check status of an RQL job
rollbar rql jobs results 12345               # Fetch rows from a completed RQL job
rollbar rql jobs cancel 12345 --force        # Cancel an in-flight RQL job
```

Every command accepts `--token` to override the default token for that request.

## MCP Server

The MCP server lets AI assistants (Claude Desktop, Cursor, etc.) query your Rollbar data.

### Recommended setup: OS keychain

After `rollbar auth set project` and `rollbar auth set account`, add this to your MCP host configuration. No `env` block is needed:

```json
{
  "mcpServers": {
    "rollbar": {
      "command": "bun",
      "args": ["--no-env-file", "run", "/abs/path/rollbar-ai-toolkit/packages/mcp/src/index.ts"]
    }
  }
}
```

For a compiled server, use `"command": "/abs/path/rollbar-mcp"` and omit `args`. Credentials reload on each tool call, so rotations apply without restarting the host. MCP exposes no tools that store or delete secrets. Headless hosts can continue using environment variables or an `op run` wrapper; see [configuration](docs/guides/configuration.md).

### Available Tools

| Tool                    | Description                                                   |
| ----------------------- | ------------------------------------------------------------- |
| `list_items`            | List items with optional filters (status, level, environment) |
| `get_item`              | Get item by internal ID                                       |
| `get_item_by_counter`   | Get item by project counter number                            |
| `list_occurrences`      | List occurrences, optionally filtered by item ID              |
| `get_occurrence`        | Get a single occurrence                                       |
| `list_projects`         | List all projects                                             |
| `get_project`           | Get project by ID                                             |
| `list_deploys`          | List deploys with optional filters                            |
| `get_deploy`            | Get deploy by ID                                              |
| `list_environments`     | List environments                                             |
| `list_top_items`        | Top N items by occurrence count in a time window (no enrich)  |
| `list_users`            | List all users                                                |
| `get_user`              | Get user by ID                                                |
| `get_item_detailed`     | Get an item plus its latest occurrence and stack trace        |
| `list_top_item_details` | Top-N items, each with its latest occurrence and stack trace  |
| `create_rql_job`        | Submit an RQL query; returns a queued job (always LIMIT it)   |
| `list_rql_jobs`         | List RQL jobs                                                 |
| `get_rql_job`           | Check status of an RQL job                                    |
| `get_rql_job_results`   | Fetch rows of a completed RQL job                             |
| `cancel_rql_job`        | Cancel an in-flight RQL job                                   |
| `rql_query`             | Run an arbitrary RQL query end-to-end; optional item enrich   |
| `rql_by_url`            | Top-N items hitting a URL/domain, enriched to item-details    |
| `rql_affected_users`    | Distinct affected users for an item (contact list)            |

## SDK configuration

```ts
import { RollbarClient, loadConfig } from "@rollbar-toolkit/sdk";

const client = new RollbarClient(await loadConfig());
```

`loadConfig()` adds async keychain lookup and reports `credentialSources` and `keychain.status`. `resolveConfig()` remains synchronous; injected `SecretStore` implementations support isolated tests. Node SDK consumers skip Bun-only native lookup.

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
