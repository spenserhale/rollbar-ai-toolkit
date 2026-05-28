// CLI-layer validation errors. bin.ts maps these to exit code 2 (usage/validation).

export class ValidationError extends Error {
  override readonly name = "ValidationError";
}

// Throw when a flag/positional rejects a value against a known set. The message
// enumerates the valid options and echoes the offending value so an agent can
// self-correct in a single retry without consulting --help.
export class EnumValueError extends ValidationError {
  constructor(flag: string, value: unknown, allowed: readonly string[]) {
    super(`${flag} must be one of: ${allowed.join(", ")} (got: ${JSON.stringify(value)})`);
  }
}
