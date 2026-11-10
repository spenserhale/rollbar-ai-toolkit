# MCP server (`@rollbar-toolkit/mcp`)

## Purpose

Use this guide when changing `packages/mcp/` — adding tools, modifying argument schemas, or working with the FastMCP stdio server.

## Policy

- **One file registers everything.** All tool definitions live in `packages/mcp/src/tools/resources.ts`, exported as `registerResourceTools(server)`. `index.ts` only constructs `new FastMCP({...})` and calls `server.start({ transportType: "stdio" })`. Do not add a parallel registration entrypoint.
- **MCP tools call the SDK directly.** Construct a `RollbarClient` from `await loadConfig()` on every tool invocation, so key rotations apply without restarting the host. Never inline HTTP calls.
- **Argument schemas use Zod.** FastMCP accepts Zod schemas for `parameters`. Reuse SDK schemas where possible (`ListItemsParamsSchema`, etc.) so the MCP tool surface stays in sync with the SDK API.
- **Return stringified JSON.** Tool handlers return `JSON.stringify(result, null, 2)`. FastMCP wraps the response into the MCP `content` shape. Do not return raw objects or pretty-print differently.
- **Let errors propagate.** Typed SDK errors (`RollbarError`, `RollbarAuthError`, `RollbarNotFoundError`) become MCP-visible errors via FastMCP's serialization. Do not swallow them.
- **Naming:** snake_case tool names (`list_items`, `get_item_by_counter`) to match MCP convention, even though SDK methods are camelCase.

## Implementation notes

- **Inspecting tools:** `npx fastmcp inspect packages/mcp/src/index.ts` lists registered tools and their schemas — useful sanity check after adding a tool.
- **stdio transport only:** This server runs in stdio mode for direct client embedding (Claude Desktop, Cursor, etc.). Do not add HTTP/SSE transports without explicit need.
- **Bundle externals:** When compiling, `sury`, `@valibot/to-json-schema`, and `effect` are marked `--external` (see root `package.json` `build:mcp` script). If you add a dep that breaks the bundle, check whether it needs to be added to that list.
- **Source imports use `.js` extensions** for sibling `.ts` files, same as SDK and CLI.

## Related docs

- `docs/sdk.md` — Tools are thin wrappers around SDK methods
- `docs/cli.md` — The CLI mirrors most MCP tools as commands
- `.agents/skills/add-api-operation/SKILL.md` — End-to-end workflow

## Credential setup

Recommend [OS keychain setup](guides/configuration.md#mcp-setup), with no MCP host `env` block. The server reads credentials but must expose no tool that writes or deletes secrets. Project `.env` discovery depends on host cwd; the keychain does not. Tests must disable native lookup with `ROLLBAR_KEYCHAIN=0`.
