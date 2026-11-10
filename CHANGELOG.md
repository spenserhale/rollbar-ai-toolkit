# Changelog

## 0.3.0 — 2026-11-09

### Added

- OS credential storage through Bun.secrets with shared CLI, SDK and MCP configuration resolution.
- `auth set`, `auth list`, `auth delete` and `auth migrate`, including hidden prompts, explicit stdin input, dry runs and redacted credential provenance.
- Redacted `config show` diagnostics with keychain availability status.
- Configuration and security guides covering migration and MCP setup without plaintext credentials.

### Changed

- Credential precedence is process environment, nearest `.env`, keychain, saved user configuration, then defaults; explicit per-call overrides retain priority.
- MCP reloads credentials on every tool call, so key rotation applies without restarting the host.
