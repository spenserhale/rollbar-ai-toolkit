# OS keychain credential storage

Use Bun.secrets with service rollbar-toolkit and environment variable entry names. Process environment and nearest .env override keychain; keychain overrides saved plaintext configuration. Node consumers skip native lookup. Keychain failure remains observable but does not prevent explicit credentials from working. No secret mutations are exposed through MCP. Tests inject stores and disable native lookup.

Alternatives keytar, native optional dependencies and shell credential commands were rejected by the user. Migration copies values and reports cleanup paths without editing files.
