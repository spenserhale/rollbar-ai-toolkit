import { defineConfig } from "vite-plus";

export default defineConfig({
  test: {
    // Vitest configuration
    globals: true,
    exclude: ["ref/**", "references/**", "**/node_modules/**"],
  },
  lint: {
    // Oxlint configuration
  },
  fmt: {
    // Oxfmt configuration
  },
});
