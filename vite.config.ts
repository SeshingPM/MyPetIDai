import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import stripConsolePlugin from "./vite-console-strip-plugin.ts";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  define: {
    'self.BUILD_TIMESTAMP': JSON.stringify(Date.now().toString())
  },
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(), 
    mode === "development" && componentTagger(),
    mode === "production" && stripConsolePlugin()
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Ensure proper MIME types are set by Vercel
    assetsInlineLimit: 0,
    // Generate source maps for production build
    sourcemap: true,
    // Output directory for production build
    outDir: "dist",
    // Ensure proper Chunk Naming
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom", "react-router-dom"],
        },
      },
    },
    // Enhanced console log removal for production
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug', 'console.trace'],
        passes: 2,
      },
      format: {
        comments: false,
      },
    },
  },
}));
