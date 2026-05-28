/**
 * OpenAPI 3.0.1 type definitions for the Rollbar API spec
 */

export interface Schema {
  type?: string;
  title?: string;
  description?: string;
  properties?: Record<string, Schema>;
  items?: Schema;
  $ref?: string;
  required?: string[];
  example?: unknown;
  default?: unknown;
  enum?: unknown[];
  format?: string;
  pattern?: string;
  minimum?: number;
  maximum?: number;
  minLength?: number;
  maxLength?: number;
  nullable?: boolean;
  [key: string]: unknown;
}

export interface Parameter {
  name: string;
  in: "path" | "query" | "header" | "cookie";
  description?: string;
  required?: boolean;
  deprecated?: boolean;
  schema?: Schema;
  style?: string;
  explode?: boolean;
  [key: string]: unknown;
}

export interface RequestBody {
  description?: string;
  content?: Record<string, MediaType>;
  required?: boolean;
}

export interface MediaType {
  schema?: Schema;
  examples?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface Response {
  description: string;
  content?: Record<string, MediaType>;
  headers?: Record<string, Header>;
  [key: string]: unknown;
}

export interface Header {
  description?: string;
  schema?: Schema;
  [key: string]: unknown;
}

export interface SecurityScheme {
  type: string;
  description?: string;
  name?: string;
  in?: string;
  scheme?: string;
  bearerFormat?: string;
  flows?: unknown;
  openIdConnectUrl?: string;
  [key: string]: unknown;
}

export interface Components {
  schemas?: Record<string, Schema>;
  responses?: Record<string, Response>;
  parameters?: Record<string, Parameter>;
  examples?: Record<string, unknown>;
  requestBodies?: Record<string, RequestBody>;
  headers?: Record<string, Header>;
  securitySchemes?: Record<string, SecurityScheme>;
  links?: Record<string, unknown>;
  callbacks?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface Operation {
  tags?: string[];
  summary?: string;
  description?: string;
  externalDocs?: { url: string; description?: string };
  operationId?: string;
  parameters?: Parameter[];
  requestBody?: RequestBody;
  responses: Record<string, Response>;
  deprecated?: boolean;
  security?: Record<string, string[]>[];
  servers?: Server[];
  [key: string]: unknown;
}

export interface PathItem {
  $ref?: string;
  summary?: string;
  description?: string;
  servers?: Server[];
  parameters?: Parameter[];
  get?: Operation;
  put?: Operation;
  post?: Operation;
  delete?: Operation;
  options?: Operation;
  head?: Operation;
  patch?: Operation;
  trace?: Operation;
  [key: string]: unknown;
}

export interface Server {
  url: string;
  description?: string;
  variables?: Record<string, ServerVariable>;
}

export interface ServerVariable {
  enum?: string[];
  default: string;
  description?: string;
}

export interface Tag {
  name: string;
  description?: string;
  externalDocs?: { url: string; description?: string };
}

export interface Info {
  title: string;
  description?: string;
  termsOfService?: string;
  contact?: { name?: string; url?: string; email?: string };
  license?: { name: string; url?: string };
  version: string;
}

export interface OpenAPISpec {
  openapi: string;
  info: Info;
  servers?: Server[];
  paths: Record<string, PathItem>;
  components?: Components;
  security?: Record<string, string[]>[];
  tags?: Tag[];
  externalDocs?: { url: string; description?: string };
  [key: string]: unknown;
}
