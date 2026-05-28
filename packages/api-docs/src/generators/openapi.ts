import { writeFileSync } from "fs";
import { join } from "path";
import { stringify } from "yaml";
import type { OpenAPISpec } from "../types.js";

export async function generateOpenAPIFiles(spec: OpenAPISpec, outDir: string): Promise<void> {
  // Write JSON
  const jsonPath = join(outDir, "openapi.json");
  writeFileSync(jsonPath, JSON.stringify(spec, null, 2));
  console.log(`✓ Wrote ${jsonPath}`);

  // Write YAML
  const yamlPath = join(outDir, "openapi.yaml");
  writeFileSync(yamlPath, stringify(spec, { lineWidth: 0 }));
  console.log(`✓ Wrote ${yamlPath}`);
}
