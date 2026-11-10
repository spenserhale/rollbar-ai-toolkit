import { buildCommand, buildRouteMap } from "@stricli/core";
import { outputFlagDefs } from "../../output.js";
const show = buildCommand({
  loader: async () => (await import("./impl.js")).show,
  parameters: { flags: outputFlagDefs },
  docs: { brief: "Show resolved configuration with credentials redacted" },
});
export const configRoutes = buildRouteMap({
  routes: { show },
  docs: { brief: "Inspect configuration and credential sources" },
});
