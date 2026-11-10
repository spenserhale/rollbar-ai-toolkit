# SDK (`@rollbar-toolkit/sdk`)

## Purpose

Use this guide when changing `packages/sdk/` — adding API operations, modifying the HTTP client, touching config resolution, or adjusting typed errors. The SDK is the foundation: CLI and MCP are thin wrappers, so a change here propagates.

## Policy

- **Zod first.** Every request param shape and response shape lives as a Zod schema in `packages/sdk/src/types.ts`. Derive TS types via `z.infer<typeof Schema>`. Do not hand-write parallel TS interfaces.
- **One client method per operation.** `RollbarClient` exposes one method per Rollbar API operation. Method names mirror the API: `listItems`, `getItem`, `getItemByCounter`, etc.
- **Pick the right scope helper.** Project-scoped operations (items, occurrences, deploys, environments) must use `this.projectRequest()`; account-scoped operations (projects, users) must use `this.accountRequest()`. They read different tokens.
- **Unwrap the envelope.** Rollbar returns `{ err, result, message? }`. The shared `request<T>()` helper in `client.ts` already unwraps to `result` and throws on `err !== 0` — do not re-implement.
- **Throw typed errors only.** Use `RollbarError`, `RollbarAuthError`, `RollbarNotFoundError` from `errors.ts`. CLI catches and exits; MCP lets FastMCP serialize. Never throw raw `Error`.
- **Export from the public index.** Add new types and the new client method's relevant types to `packages/sdk/src/index.ts`. CLI and MCP must never deep-import from internal SDK paths.
- **Source imports use `.js` extensions.** Even though source is `.ts`, imports inside the SDK use `./foo.js` — this is the project-wide ESM convention and tooling depends on it.

## Implementation notes

- **Config resolution:** Keep `resolveConfig()` synchronous for compatibility. `loadConfig()` adds async Bun.secrets lookup and provenance: process environment > nearest `.env` > keychain > saved user configuration > defaults. Explicit overrides retain priority. Keychain service is `rollbar-toolkit`; entries are `ROLLBAR_PROJECT_TOKEN` and `ROLLBAR_ACCOUNT_TOKEN`. Read only missing credentials, in parallel. `ROLLBAR_KEYCHAIN=0|false|no|off` or `secretStore: null` disables lookup. Unavailable stores are reported without preventing other sources from working. Node consumers skip native lookup. See [configuration](guides/configuration.md).
- **Secret store boundary:** Export the injected `SecretStore`, Bun adapter and read helpers through the public index. Configuration includes credential source metadata and keychain availability. Native errors use the typed configuration error; redacted diagnostics never expose token values.
- **Token override:** The CLI can override the default token per-request via `--token`. Plumbing is in `packages/cli/src/context.ts`, not the SDK — the SDK just accepts whatever token is in the config passed to the constructor.
- **Auth header:** All requests carry `X-Rollbar-Access-Token: <token>`. The shared `request()` private method is the only place that sets it; do not add it elsewhere.
- **404 vs other errors:** `request()` maps HTTP 401 to `RollbarAuthError`, 404 to `RollbarNotFoundError("resource", path)`, and everything else to `RollbarError` with the response's `message` if `ErrorResponseSchema` validates against the body. Preserve this hierarchy when adding new error paths.
- **The `err: 0` check:** Even when HTTP is 200, Rollbar can return `{ err: <nonzero>, message: "..." }`. The shared helper handles this. New methods that bypass `request()` (there shouldn't be any) would need to replicate it.

## Related docs

- `docs/cli.md` — How CLI commands consume the SDK
- `docs/mcp.md` — How MCP tools consume the SDK
- `docs/testing.md` — Vitest conventions; SDK is the most-tested layer
- `.agents/skills/add-api-operation/SKILL.md` — Step-by-step workflow that starts in the SDK
