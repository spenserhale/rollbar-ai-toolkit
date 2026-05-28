import { buildApplication, buildRouteMap } from "@stricli/core";
import { itemsRoutes } from "./commands/items/commands.js";
import { itemDetailsRoutes } from "./commands/item-details/commands.js";
import { topItemDetailsCommand } from "./commands/top-item-details/commands.js";
import { occurrencesRoutes } from "./commands/occurrences/commands.js";
import { projectsRoutes } from "./commands/projects/commands.js";
import { deploysRoutes } from "./commands/deploys/commands.js";
import { environmentsRoutes } from "./commands/environments/commands.js";
import { usersRoutes } from "./commands/users/commands.js";
import { agentContextCommand } from "./commands/agent-context/commands.js";

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
    "agent-context": agentContextCommand,
  },
  docs: {
    brief: "Rollbar CLI — manage items, deploys, projects, and more",
  },
});

export const app = buildApplication(routes, {
  name: "rollbar",
  versionInfo: {
    currentVersion: "0.1.0",
  },
});
