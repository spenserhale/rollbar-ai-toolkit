import { writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import type { OpenAPISpec, Operation, PathItem, Parameter, Schema } from "../types.js";

const HTTP_METHODS = ["get", "post", "put", "patch", "delete", "head", "options", "trace"];

interface EndpointInfo {
  path: string;
  method: string;
  operation: Operation;
  operationId: string;
  tag: string;
}

export async function generateMarkdownDocs(spec: OpenAPISpec, outDir: string): Promise<void> {
  // Build a map of endpoints grouped by tag
  const endpointsByTag = new Map<string, EndpointInfo[]>();
  const allEndpoints: EndpointInfo[] = [];

  for (const [path, pathItem] of Object.entries(spec.paths)) {
    for (const method of HTTP_METHODS) {
      const operation = (pathItem as Record<string, unknown>)[method] as Operation | undefined;

      if (!operation) continue;

      const operationId = operation.operationId || `${method}_${path.replace(/[{}/]/g, "_")}`;
      const tags = operation.tags || ["Other"];
      const tag = tags[0];

      const endpoint: EndpointInfo = {
        path,
        method: method.toUpperCase(),
        operation,
        operationId,
        tag,
      };

      allEndpoints.push(endpoint);

      if (!endpointsByTag.has(tag)) {
        endpointsByTag.set(tag, []);
      }
      endpointsByTag.get(tag)!.push(endpoint);
    }
  }

  // Generate index
  await generateIndex(spec, outDir, endpointsByTag);

  // Generate individual endpoint docs
  for (const endpoint of allEndpoints) {
    const tagDir = endpoint.tag
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
    const fileName = endpoint.operationId
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, "")
      .replace(/_/g, "-");
    const filePath = join(outDir, tagDir, `${fileName}.md`);

    mkdirSync(dirname(filePath), { recursive: true });

    const content = generateEndpointMarkdown(
      endpoint.path,
      endpoint.method,
      endpoint.operation,
      spec.components?.schemas || {},
    );

    writeFileSync(filePath, content);
    console.log(`✓ Wrote ${filePath}`);
  }

  console.log(`\n✓ Generated ${allEndpoints.length} endpoint documents`);
}

async function generateIndex(
  spec: OpenAPISpec,
  outDir: string,
  endpointsByTag: Map<string, EndpointInfo[]>,
): Promise<void> {
  let markdown = `# Rollbar API Reference

Generated from official OpenAPI 3.0.1 specification.

**Base URL:** ${spec.servers?.[0]?.url || "https://api.rollbar.com/api/1"}

**Source:** [https://docs.rollbar.com/reference](https://docs.rollbar.com/reference)

---

## Endpoints by Resource

`;

  // Sort tags by name
  const sortedTags = Array.from(endpointsByTag.keys()).sort();

  for (const tag of sortedTags) {
    const endpoints = endpointsByTag.get(tag)!;
    markdown += `\n### ${tag}\n\n`;

    // Sort endpoints by method, then path
    endpoints.sort((a, b) => {
      const methodOrder = { GET: 0, POST: 1, PUT: 2, PATCH: 3, DELETE: 4 };
      const aOrder = (methodOrder as Record<string, number>)[a.method] ?? 999;
      const bOrder = (methodOrder as Record<string, number>)[b.method] ?? 999;
      return aOrder !== bOrder ? aOrder - bOrder : a.path.localeCompare(b.path);
    });

    markdown += "| Method | Operation | Path |\n";
    markdown += "|--------|-----------|------|\n";

    for (const endpoint of endpoints) {
      const tagDir = endpoint.tag
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");
      const fileName = endpoint.operationId
        .toLowerCase()
        .replace(/[^a-z0-9_-]/g, "")
        .replace(/_/g, "-");
      const href = `./${tagDir}/${fileName}.md`;
      const summary = endpoint.operation.summary || endpoint.operationId;
      const badge = `\`${endpoint.method}\``;

      markdown += `| ${badge} | [${summary}](${href}) | \`${endpoint.path}\` |\n`;
    }
  }

  const indexPath = join(outDir, "README.md");
  mkdirSync(outDir, { recursive: true });
  writeFileSync(indexPath, markdown);
  console.log(`✓ Wrote ${indexPath}`);
}

function generateEndpointMarkdown(
  path: string,
  method: string,
  operation: Operation,
  schemas: Record<string, Schema>,
): string {
  const summary = operation.summary || operation.operationId || "Operation";
  const description = operation.description || "";

  let markdown = `# ${method} ${path}\n\n${summary}\n\n`;

  if (description) {
    markdown += `${description}\n\n`;
  }

  // Authentication / Security
  if (operation.security && operation.security.length > 0) {
    markdown += "## Authentication\n\n";
    markdown += "This endpoint requires authentication with:\n";
    for (const sec of operation.security) {
      for (const key of Object.keys(sec)) {
        markdown += `- ${key}\n`;
      }
    }
    markdown += "\n";
  }

  // Parameters
  const pathParams = (operation.parameters || []).filter((p) => p.in === "path");
  const queryParams = (operation.parameters || []).filter((p) => p.in === "query");
  const headerParams = (operation.parameters || []).filter((p) => p.in === "header");

  if (pathParams.length > 0 || queryParams.length > 0 || headerParams.length > 0) {
    markdown += "## Parameters\n\n";

    if (pathParams.length > 0) {
      markdown += "### Path Parameters\n\n";
      markdown += generateParameterTable(pathParams);
      markdown += "\n";
    }

    if (queryParams.length > 0) {
      markdown += "### Query Parameters\n\n";
      markdown += generateParameterTable(queryParams);
      markdown += "\n";
    }

    if (headerParams.length > 0) {
      markdown += "### Header Parameters\n\n";
      markdown += generateParameterTable(headerParams);
      markdown += "\n";
    }
  }

  // Request Body
  if (operation.requestBody) {
    markdown += "## Request Body\n\n";
    if (operation.requestBody.description) {
      markdown += `${operation.requestBody.description}\n\n`;
    }

    if (operation.requestBody.content) {
      for (const [contentType, media] of Object.entries(operation.requestBody.content)) {
        if (media.schema) {
          markdown += `**Content-Type:** \`${contentType}\`\n\n`;
          markdown += generateSchemaMarkdown(media.schema, schemas, 1);
          markdown += "\n";
        }
      }
    }
  }

  // Responses
  if (operation.responses) {
    markdown += "## Responses\n\n";

    for (const [statusCode, response] of Object.entries(operation.responses)) {
      markdown += `### ${statusCode} — ${response.description}\n\n`;

      if (response.content) {
        for (const [contentType, media] of Object.entries(response.content)) {
          if (media.schema) {
            markdown += `**Content-Type:** \`${contentType}\`\n\n`;
            markdown += generateSchemaMarkdown(media.schema, schemas, 1);
            markdown += "\n";
          }
        }
      }
    }
  }

  return markdown;
}

function generateParameterTable(params: Parameter[]): string {
  const rows: string[] = [
    "| Name | Type | Required | Description |",
    "|------|------|----------|-------------|",
  ];

  for (const param of params) {
    const name = param.name;
    const type = param.schema?.type || "unknown";
    const required = param.required ? "Yes" : "No";
    const description = param.description || "-";

    rows.push(`| \`${name}\` | \`${type}\` | ${required} | ${description} |`);
  }

  return rows.join("\n");
}

function generateSchemaMarkdown(
  schema: Schema,
  allSchemas: Record<string, Schema>,
  depth: number = 0,
): string {
  if (schema.$ref) {
    const refName = schema.$ref.split("/").pop();
    const resolved = allSchemas[refName!];
    if (resolved && resolved !== schema) {
      return generateSchemaMarkdown(resolved, allSchemas, depth);
    }
    return `\`${refName}\``;
  }

  let markdown = "";

  if (schema.type === "object" && schema.properties) {
    const indent = "  ".repeat(depth);
    markdown += "```json\n";
    markdown += generateSchemaExample(schema, allSchemas, depth);
    markdown += "\n```\n";
  } else if (schema.type === "array" && schema.items) {
    markdown += `Array of ${schema.items.type || "items"}\n`;
  } else if (schema.description) {
    markdown += `${schema.description}\n`;
  } else if (schema.type) {
    markdown += `Type: \`${schema.type}\`\n`;
  }

  return markdown;
}

function generateSchemaExample(
  schema: Schema,
  allSchemas: Record<string, Schema>,
  depth: number = 0,
): string {
  const indent = "  ".repeat(depth);
  const nextIndent = "  ".repeat(depth + 1);

  if (schema.$ref) {
    const refName = schema.$ref.split("/").pop();
    const resolved = allSchemas[refName!];
    if (resolved && resolved !== schema) {
      return generateSchemaExample(resolved, allSchemas, depth);
    }
    return `"${refName}": {}`;
  }

  if (schema.type === "object" && schema.properties) {
    const props = Object.entries(schema.properties)
      .map(([key, prop]) => {
        const propMarkdown = generateSchemaExample(prop, allSchemas, depth + 1);
        return `${nextIndent}"${key}": ${propMarkdown}`;
      })
      .join(",\n");

    return `{\n${props}\n${indent}}`;
  }

  if (schema.type === "array" && schema.items) {
    const itemMarkdown = generateSchemaExample(schema.items, allSchemas, depth + 1);
    return `[${itemMarkdown}]`;
  }

  if (schema.type === "string") return `"string"`;
  if (schema.type === "number") return `0`;
  if (schema.type === "integer") return `0`;
  if (schema.type === "boolean") return `true`;

  return `null`;
}
