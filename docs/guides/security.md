# Credential security

Use `rollbar auth set project` and `rollbar auth set account` for persistent credentials without plaintext files. Bun.secrets stores entries in the OS credential store under service `rollbar-toolkit`.

Auth commands accept values only through a hidden TTY prompt or explicit `--stdin`. Never put keys in argv: shell history and process listings can expose arguments. Prompt labels go to stderr; command results never include credential values. `auth list` and `config show` reveal state and source only.

Environment variables and project `.env` remain explicit overrides. `.env`, user config, saved profiles, and MCP host `env` blocks contain plaintext when populated with literal credentials. `auth migrate` copies eligible values and reports cleanup files; it never edits those files. Remove copied values yourself after verifying keychain access.

The MCP server only reads credentials. No MCP tool writes or deletes secrets. Recommended host configuration contains no `env` block.

Tests inject in-memory SecretStore implementations, and spawned CLI/MCP tests disable native lookup with `ROLLBAR_KEYCHAIN=0`. Automated tests must never access the real keychain.

Keychain encryption protects credentials at rest. It does not protect against malicious code running as the same user after access has been granted. On Linux, use a Secret Service daemon; on headless machines prefer environment injection or `op run`, with no plaintext fallback store.
