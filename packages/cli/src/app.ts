import { buildApplication, buildRouteMap } from "@stricli/core";
import { itemsRoutes } from "./commands/items/commands.js";
import { occurrencesRoutes } from "./commands/occurrences/commands.js";
import { projectsRoutes } from "./commands/projects/commands.js";
import { deploysRoutes } from "./commands/deploys/commands.js";
import { environmentsRoutes } from "./commands/environments/commands.js";
import { usersRoutes } from "./commands/users/commands.js";

const routes = buildRouteMap({
  routes: {
    items: itemsRoutes,
    occurrences: occurrencesRoutes,
    projects: projectsRoutes,
    deploys: deploysRoutes,
    environments: environmentsRoutes,
    users: usersRoutes,
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
