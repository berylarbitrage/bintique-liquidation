import { defineConfig } from "vitest/config";
import path from "node:path";

// Integration tests that require a running Supabase (local: `supabase start`).
export default defineConfig({
  oxc: { jsx: { runtime: "automatic" } },
  resolve: { alias: { "@": path.resolve(import.meta.dirname, ".") } },
  test: { include: ["tests/rls/**/*.test.ts"], environment: "node", testTimeout: 30000 },
});
