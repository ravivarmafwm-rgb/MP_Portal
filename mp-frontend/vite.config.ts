// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, nitro (build-only using cloudflare as a default target),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  vite: {
    server: { port: 8080 },
    build: {
      // Configure for SPA build (single index.html)
      rollupOptions: {
        input: {
          main: './index.html',
        },
      },
    },
  },
  tanstackStart: {
    // Configure for client-side only rendering (SPA mode)
    ssr: false,
  },
});
