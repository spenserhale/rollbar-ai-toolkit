#!/usr/bin/env bun

import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { mkdirSync } from "fs";
import type { OpenAPISpec } from "./types.js";
import { generateOpenAPIFiles } from "./generators/openapi.js";
import { generateMarkdownDocs } from "./generators/markdown.js";

const SPEC_URL = "https://docs.rollbar.com/openapi/62de9e1b6316c304034d006a";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const OUT_DIR = join(__dirname, "../docs");

async function main() {
  console.log(`📚 Fetching Rollbar OpenAPI spec from ${SPEC_URL}...`);

  const response = await fetch(SPEC_URL);
  if (!response.ok) {
    throw new Error(`Failed to fetch spec: ${response.status} ${response.statusText}`);
  }

  const spec = (await response.json()) as OpenAPISpec;

  console.log(`✓ Spec fetched (${spec.paths ? Object.keys(spec.paths).length : 0} paths)`);

  // Ensure output directory exists
  mkdirSync(OUT_DIR, { recursive: true });

  // Generate OpenAPI files
  console.log("\n📝 Generating OpenAPI spec files...");
  await generateOpenAPIFiles(spec, OUT_DIR);

  // Generate Markdown documentation
  console.log("\n📖 Generating Markdown documentation...");
  await generateMarkdownDocs(spec, OUT_DIR);

  console.log(`\n✅ Done! Documentation generated in ${OUT_DIR}`);
}

main().catch((error) => {
  console.error("❌ Error:", error);
  process.exit(1);
});
