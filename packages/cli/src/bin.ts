#!/usr/bin/env bun
import { run } from "@stricli/core";
import { app } from "./app.js";
import { buildContext } from "./context.js";

// Exit code taxonomy lives in app.ts `determineExitCode` for runtime errors.
// Stricli also uses negative codes (-4 InvalidArgument, -5 UnknownCommand, -3 ContextLoadError)
// for parse/routing/context failures that bypass determineExitCode — remap them to our
// documented taxonomy after the fact so the surface is consistent.
//
//   0  success (also dry-run success)
//   1  generic API / network error
//   2  validation / usage error (bad enum, unknown command, mutually-exclusive flags)
//   3  config error (missing token, bad env)
//   4  not found
//   5  auth error (invalid token)
//   6  rate limited

await run(app, process.argv.slice(2), buildContext(process));

// Node coerces negative exit codes via `((n % 256) + 256) % 256`, so Stricli's
// -4 / -5 / -3 / -2 / -1 surface as 252 / 251 / 253 / 254 / 255.
switch (process.exitCode) {
  case 252: // InvalidArgument (parse-time validation)
  case 251: // UnknownCommand
    process.exitCode = 2;
    break;
  case 253: // ContextLoadError
    process.exitCode = 3;
    break;
  case 254: // CommandModuleLoadError (programming error in this CLI)
  case 255: // CommandRunError when determineExitCode wasn't applied
    process.exitCode = 1;
    break;
}
