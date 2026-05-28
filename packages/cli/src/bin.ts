#!/usr/bin/env bun
import { run } from "@stricli/core";
import { app } from "./app.js";
import { buildContext } from "./context.js";
import { RollbarAuthError, RollbarNotFoundError, RollbarError } from "@rollbar-toolkit/sdk";

// Exit code taxonomy:
//   0  success
//   1  generic API / network error
//   2  validation / usage error
//   3  config error (missing token, bad env)
//   4  not found
//   5  auth error (invalid token)
//   6  rate limited

try {
  await run(app, process.argv.slice(2), buildContext(process));
} catch (err) {
  if (err instanceof RollbarAuthError) {
    process.stderr.write(`error: ${err.message}\n`);
    process.exit(5);
  }
  if (err instanceof RollbarNotFoundError) {
    process.stderr.write(`error: ${err.message}\n`);
    process.exit(4);
  }
  if (err instanceof RollbarError) {
    if (err.statusCode === 429) {
      process.stderr.write(`error: rate limited — ${err.message}\n`);
      process.exit(6);
    }
    process.stderr.write(`error: ${err.message}\n`);
    process.exit(1);
  }
  process.stderr.write(`error: ${err instanceof Error ? err.message : String(err)}\n`);
  process.exit(1);
}
