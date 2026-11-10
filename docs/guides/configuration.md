# Configuration

CLI and MCP use the SDK's asynchronous `loadConfig()`. Credential precedence is:

1. Explicit per-call overrides, where supported.
2. Process environment.
3. Nearest `.env`, walking up from the current working directory.
4. OS keychain.
5. User configuration (`~/.rollbar/config.json`) and existing saved profiles.
6. Defaults.

Set `ROLLBAR_CONFIG_FILE` to select a different user config path. User config fields use SDK names such as `projectToken`, `accountToken`, `baseUrl`, and `projectId`; keep secrets in the keychain instead.

The resolver only asks the keychain for credential keys not already supplied by environment or `.env`. Non-secret options such as `ROLLBAR_BASE_URL` and `ROLLBAR_PROJECT_ID` never enter the keychain. Set `ROLLBAR_KEYCHAIN=0` (also `false`, `no`, or `off`) in process environment or `.env` to disable lookup. SDK callers can pass `secretStore: null`.

## OS keychain setup

Bun 1.3+ provides `Bun.secrets`, backed by macOS Keychain Services, Linux libsecret, and Windows Credential Manager. Entries use service `rollbar-toolkit` and account names `ROLLBAR_PROJECT_TOKEN` and `ROLLBAR_ACCOUNT_TOKEN`. View or remove macOS entries in Keychain Access.app.

Interactive commands prompt on stderr without echoing typed or pasted values:

```bash
rollbar auth set project
rollbar auth set account
rollbar auth set rollbar  # prompts for both tokens
```

Scripts and agents must explicitly request stdin. One value is accepted per invocation; the two-key `rollbar` resource requires `--key`:

```bash
pbpaste | rollbar auth set project --stdin
op read 'op://Private/Rollbar/account-token' | rollbar auth set account --stdin
op read 'op://Private/Rollbar/project-token' | rollbar auth set rollbar --key ROLLBAR_PROJECT_TOKEN --stdin
```

Secret values are never accepted as command arguments or flag values. Without a TTY or `--stdin`, `auth set` exits 2. Empty input is rejected. Use `--dry-run` to validate without writing.

| Command                                                  | Behavior                                                                                                                         |
| -------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `auth set <resource> [--key NAME] [--stdin] [--dry-run]` | Store selected credentials; `shadowed_by` identifies overriding environment or `.env` values.                                    |
| `auth list`                                              | List every key's `set`, `missing`, or `unknown` state and active source, never values; supports structured, CSV and text output. |
| `auth delete <resource> [--key NAME] --yes [--dry-run]`  | Delete entries; requires explicit confirmation.                                                                                  |
| `auth migrate [--dry-run] [--overwrite]`                 | Copy active `.env` or user-config credentials; skip existing entries unless overwritten.                                         |
| `config show --json`                                     | Redacted configuration, winning credential sources and `keychain.status`.                                                        |

Resources are `project`, `account`, or `rollbar` (both). Entry names exactly match environment variable names.

## Migrate plaintext credentials

```bash
rollbar auth migrate --dry-run
rollbar auth migrate
# Remove copied credentials from the reported clean_up files yourself.
rollbar auth list
```

Migration does not edit files. Process-environment credentials, including `op run` and CI values, are ignored. Existing keychain entries are skipped unless `--overwrite` is supplied. A `.env` value keeps overriding the keychain until you remove it. User-config credentials are plaintext; use that file primarily for non-secret defaults.

## MCP setup

Store keys with `auth set`, then configure the host without secrets:

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

The server reloads credentials on each tool call, so rotations need no restart. It exposes no secret write or delete tools. A GUI host usually does not inherit terminal exports; keychain lookup does not depend on cwd. A project `.env` is discovered only when the host's cwd is inside that project. An MCP `env` block remains supported but stores literal credentials in plaintext. Headless deployments can inject environment values with CI or an `op run` wrapper instead.

## Caveats and diagnostics

- macOS can display a “wants to use your confidential information” dialog when a different binary reads an entry, including after a Bun upgrade, from a compiled binary, or through a GUI MCP host. Choose **Always Allow** for the trusted binary.
- Linux requires a running Secret Service daemon such as GNOME Keyring or KWallet. Headless machines and CI often lack one. Unavailable or locked stores report `keychain.status: unavailable`; explicit credentials still work.
- Lookup requires Bun; Node SDK consumers quietly skip native access.
- The keychain protects keys at rest, not against code already running as your user after access is granted.

Use `auth list` for per-key state and source, and `config show --json` for redacted resolution diagnostics. Disabled lookup reports `keychain.status: disabled`; successful lookup reports `ok`.
