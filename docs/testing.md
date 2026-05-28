# Testing

## Purpose

Use this guide when writing or modifying tests in `packages/*/tests/`, or when reasoning about what should be covered.

## Policy

- **SDK is the test target.** The vast majority of testable behavior lives in `packages/sdk/`. CLI and MCP are thin wrappers — a good SDK test covers the API surface they expose. Today only `packages/sdk/tests/client.test.ts` exists; add new SDK tests next to it.
- **Test schemas at the boundary.** Whenever you add a Zod schema in `packages/sdk/src/types.ts`, add at least one parsing test that proves the schema accepts a representative real response and rejects an obviously invalid one.
- **Test error mapping.** When you add a client method, include a test that asserts the right typed error is thrown for 401 / 404 / `err: nonzero` envelope responses. The HTTP-to-typed-error mapping is project-critical.
- **Use Vitest.** `vp test` runs Vitest under VitePlus. Use `describe` / `it` / `expect`. Mock `fetch` via `vi.stubGlobal("fetch", ...)` or `vi.spyOn(globalThis, "fetch")` — there is no in-memory transport layer to swap.
- **Do not test against the real Rollbar API.** Tests must run offline. If you need fixtures, capture a real response once and check it into the test file inline.

## Implementation notes

- **Runner:** Vitest is wired through `vite.config.ts` at the repo root and consumed by `vp test`. There is no per-package vitest config — keep things simple.
- **Where new tests go:** `packages/sdk/tests/<area>.test.ts`. For CLI handler-level tests, create `packages/cli/tests/` only if the handler has logic worth testing independent of the SDK (most don't — keep coverage at the SDK layer).
- **Type checking is separate.** `vp check` runs lint + format + tsc-style checks across the workspace. A passing `vp test` does not imply types are clean.

## Related docs

- `docs/sdk.md` — Most test surface area lives here
