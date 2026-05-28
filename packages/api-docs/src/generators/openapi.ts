import { writeFileSync } from "fs";
import { join } from "path";
import { stringify } from "yaml";
import type { OpenAPISpec } from "../types.js";

// Rollbar's published spec embeds example Slack webhook URLs that match GitHub's
// secret-scanning regex (T<digits>/B<digits>/<24 alphanumeric>). They're zero/X
// placeholders, not real secrets, but push protection blocks them anyway.
// Scrub on write so regenerating the spec doesn't reintroduce the block.
const SLACK_WEBHOOK_PLACEHOLDER_RE =
  /https:\/\/hooks\.slack\.com\/services\/T[0-9A-Z]+\/B[0-9A-Z]+\/[0-9A-Za-z]+/g;
const SLACK_WEBHOOK_REPLACEMENT = "https://hooks.slack.com/services/EXAMPLE";

function scrub(content: string): string {
  return content.replace(SLACK_WEBHOOK_PLACEHOLDER_RE, SLACK_WEBHOOK_REPLACEMENT);
}

export async function generateOpenAPIFiles(spec: OpenAPISpec, outDir: string): Promise<void> {
  const jsonPath = join(outDir, "openapi.json");
  writeFileSync(jsonPath, scrub(JSON.stringify(spec, null, 2)));
  console.log(`✓ Wrote ${jsonPath}`);

  const yamlPath = join(outDir, "openapi.yaml");
  writeFileSync(yamlPath, scrub(stringify(spec, { lineWidth: 0 })));
  console.log(`✓ Wrote ${yamlPath}`);
}
