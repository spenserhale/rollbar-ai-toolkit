import { ArgumentScannerError, buildApplication, buildRouteMap, text_en } from "@stricli/core";
import { RollbarAuthError, RollbarError, RollbarNotFoundError } from "@rollbar-toolkit/sdk";
import { itemsRoutes } from "./commands/items/commands.js";
import { itemDetailsRoutes } from "./commands/item-details/commands.js";
import { topItemDetailsCommand } from "./commands/top-item-details/commands.js";
import { occurrencesRoutes } from "./commands/occurrences/commands.js";
import { projectsRoutes } from "./commands/projects/commands.js";
import { deploysRoutes } from "./commands/deploys/commands.js";
import { environmentsRoutes } from "./commands/environments/commands.js";
import { usersRoutes } from "./commands/users/commands.js";
import { rqlJobsRoutes } from "./commands/rql-jobs/commands.js";
import { agentContextCommand } from "./commands/agent-context/commands.js";
import { profileRoutes } from "./commands/profile/commands.js";
import { feedbackRoutes } from "./commands/feedback/commands.js";
import { ValidationError } from "./validation.js";

const rqlRoutes = buildRouteMap({
  routes: { jobs: rqlJobsRoutes },
  docs: { brief: "Rollbar Query Language (RQL) — submit and read async queries" },
});

const routes = buildRouteMap({
  routes: {
    items: itemsRoutes,
    "item-details": itemDetailsRoutes,
    "top-item-details": topItemDetailsCommand,
    occurrences: occurrencesRoutes,
    projects: projectsRoutes,
    deploys: deploysRoutes,
    environments: environmentsRoutes,
    users: usersRoutes,
    rql: rqlRoutes,
    profile: profileRoutes,
    feedback: feedbackRoutes,
    "agent-context": agentContextCommand,
  },
  docs: {
    brief: "Rollbar CLI — manage items, deploys, projects, and more",
  },
});

// Replace Stricli's stack-trace-laden default with a single `error: <message>` line
// so agents reading stderr get the signal they need without parsing noise.
const errorMessage = (exc: unknown): string =>
  `error: ${exc instanceof Error ? exc.message : String(exc)}`;

const text = {
  ...text_en,
  exceptionWhileRunningCommand: errorMessage,
  exceptionWhileLoadingCommandContext: errorMessage,
  exceptionWhileLoadingCommandFunction: errorMessage,
};

export const app = buildApplication(routes, {
  name: "rollbar",
  versionInfo: {
    currentVersion: "0.2.0",
  },
  scanner: {
    // Accept --project-id (kebab) AND --projectId (camel) on input; render kebab in --help.
    // Lets us declare flags in camelCase (TS-ergonomic) while presenting the agent-native kebab form.
    caseStyle: "allow-kebab-for-camel",
  },
  localization: {
    defaultLocale: "en",
    loadText: () => text,
  },
  // Exit code taxonomy is the contract documented in agent-context.
  determineExitCode: (exc) => {
    if (exc instanceof ValidationError) return 2;
    if (exc instanceof ArgumentScannerError) return 2;
    if (exc instanceof RollbarAuthError) return 5;
    if (exc instanceof RollbarNotFoundError) return 4;
    if (exc instanceof RollbarError) return exc.statusCode === 429 ? 6 : 1;
    return 1;
  },
});
