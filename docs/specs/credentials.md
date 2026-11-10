# Credential resolution and management

The SDK provides synchronous `resolveConfig()` and asynchronous `loadConfig()`. CLI commands and MCP calls use the latter. Environment and nearest `.env` credentials override OS keychain entries; keychain entries override saved user configuration. Explicit per-call overrides retain priority. Each resolved credential records its source, and resolved configuration reports keychain status `ok`, `disabled`, or `unavailable` without revealing values in diagnostics.

Bun.secrets stores only primary credential names under service `rollbar-toolkit`. Reads run in parallel and request only missing keys. Native lookup is optional, disabled by `ROLLBAR_KEYCHAIN=0|false|no|off` or `secretStore: null`, and unavailable stores do not invalidate other sources. Node SDK consumers skip native lookup.

CLI auth set accepts hidden terminal input or explicit stdin only; list is redacted; delete requires `--yes`; mutations support dry runs. Migration copies active file credentials without editing their source files, ignores process-environment keys, and skips existing keychain values unless overwritten. MCP reads per call and exposes no secret mutations.

Tests use fake stores and disable native lookup in spawned processes.
