// vite.config.ts
import { defineConfig } from "file:///home/project/node_modules/vite/dist/node/index.js";
import react from "file:///home/project/node_modules/@vitejs/plugin-react-swc/index.mjs";
import path from "path";
import { componentTagger } from "file:///home/project/node_modules/lovable-tagger/dist/index.js";

// vite-console-strip-plugin.ts
function stripConsolePlugin() {
  return {
    name: "strip-console",
    transform(code, id) {
      if (!/\.(js|ts|jsx|tsx)$/.test(id)) {
        return null;
      }
      if (id.includes("node_modules")) {
        return null;
      }
      if (id.includes("logger.ts")) {
        return null;
      }
      const consoleTypes = ["log", "info", "debug", "trace"];
      let modifiedCode = code;
      consoleTypes.forEach((type) => {
        const regex = new RegExp(`console\\.${type}\\s*\\(`, "g");
        modifiedCode = modifiedCode.replace(regex, `(()=>{})(`);
      });
      return {
        code: modifiedCode,
        map: null
        // We're not generating source maps for this transformation
      };
    }
  };
}

// vite.config.ts
var __vite_injected_original_dirname = "/home/project";
var vite_config_default = defineConfig(({ mode }) => ({
  define: {
    "self.BUILD_TIMESTAMP": JSON.stringify(Date.now().toString())
  },
  server: {
    host: "::",
    port: 8080
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    mode === "production" && stripConsolePlugin()
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "./src")
    }
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
          vendor: ["react", "react-dom", "react-router-dom"]
        }
      }
    },
    // Enhanced console log removal for production
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ["console.log", "console.info", "console.debug", "console.trace"],
        passes: 2
      },
      format: {
        comments: false
      }
    }
  }
}));
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiLCAidml0ZS1jb25zb2xlLXN0cmlwLXBsdWdpbi50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9ob21lL3Byb2plY3RcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9ob21lL3Byb2plY3Qvdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL2hvbWUvcHJvamVjdC92aXRlLmNvbmZpZy50c1wiO2ltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gXCJ2aXRlXCI7XG5pbXBvcnQgcmVhY3QgZnJvbSBcIkB2aXRlanMvcGx1Z2luLXJlYWN0LXN3Y1wiO1xuaW1wb3J0IHBhdGggZnJvbSBcInBhdGhcIjtcbmltcG9ydCB7IGNvbXBvbmVudFRhZ2dlciB9IGZyb20gXCJsb3ZhYmxlLXRhZ2dlclwiO1xuaW1wb3J0IHN0cmlwQ29uc29sZVBsdWdpbiBmcm9tIFwiLi92aXRlLWNvbnNvbGUtc3RyaXAtcGx1Z2luLnRzXCI7XG5cbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoKHsgbW9kZSB9KSA9PiAoe1xuICBkZWZpbmU6IHtcbiAgICAnc2VsZi5CVUlMRF9USU1FU1RBTVAnOiBKU09OLnN0cmluZ2lmeShEYXRlLm5vdygpLnRvU3RyaW5nKCkpXG4gIH0sXG4gIHNlcnZlcjoge1xuICAgIGhvc3Q6IFwiOjpcIixcbiAgICBwb3J0OiA4MDgwLFxuICB9LFxuICBwbHVnaW5zOiBbXG4gICAgcmVhY3QoKSwgXG4gICAgbW9kZSA9PT0gXCJkZXZlbG9wbWVudFwiICYmIGNvbXBvbmVudFRhZ2dlcigpLFxuICAgIG1vZGUgPT09IFwicHJvZHVjdGlvblwiICYmIHN0cmlwQ29uc29sZVBsdWdpbigpXG4gIF0uZmlsdGVyKEJvb2xlYW4pLFxuICByZXNvbHZlOiB7XG4gICAgYWxpYXM6IHtcbiAgICAgIFwiQFwiOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcIi4vc3JjXCIpLFxuICAgIH0sXG4gIH0sXG4gIGJ1aWxkOiB7XG4gICAgLy8gRW5zdXJlIHByb3BlciBNSU1FIHR5cGVzIGFyZSBzZXQgYnkgVmVyY2VsXG4gICAgYXNzZXRzSW5saW5lTGltaXQ6IDAsXG4gICAgLy8gR2VuZXJhdGUgc291cmNlIG1hcHMgZm9yIHByb2R1Y3Rpb24gYnVpbGRcbiAgICBzb3VyY2VtYXA6IHRydWUsXG4gICAgLy8gT3V0cHV0IGRpcmVjdG9yeSBmb3IgcHJvZHVjdGlvbiBidWlsZFxuICAgIG91dERpcjogXCJkaXN0XCIsXG4gICAgLy8gRW5zdXJlIHByb3BlciBDaHVuayBOYW1pbmdcbiAgICByb2xsdXBPcHRpb25zOiB7XG4gICAgICBvdXRwdXQ6IHtcbiAgICAgICAgbWFudWFsQ2h1bmtzOiB7XG4gICAgICAgICAgdmVuZG9yOiBbXCJyZWFjdFwiLCBcInJlYWN0LWRvbVwiLCBcInJlYWN0LXJvdXRlci1kb21cIl0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0sXG4gICAgLy8gRW5oYW5jZWQgY29uc29sZSBsb2cgcmVtb3ZhbCBmb3IgcHJvZHVjdGlvblxuICAgIG1pbmlmeTogJ3RlcnNlcicsXG4gICAgdGVyc2VyT3B0aW9uczoge1xuICAgICAgY29tcHJlc3M6IHtcbiAgICAgICAgZHJvcF9jb25zb2xlOiB0cnVlLFxuICAgICAgICBkcm9wX2RlYnVnZ2VyOiB0cnVlLFxuICAgICAgICBwdXJlX2Z1bmNzOiBbJ2NvbnNvbGUubG9nJywgJ2NvbnNvbGUuaW5mbycsICdjb25zb2xlLmRlYnVnJywgJ2NvbnNvbGUudHJhY2UnXSxcbiAgICAgICAgcGFzc2VzOiAyLFxuICAgICAgfSxcbiAgICAgIGZvcm1hdDoge1xuICAgICAgICBjb21tZW50czogZmFsc2UsXG4gICAgICB9LFxuICAgIH0sXG4gIH0sXG59KSk7XG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9ob21lL3Byb2plY3RcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9ob21lL3Byb2plY3Qvdml0ZS1jb25zb2xlLXN0cmlwLXBsdWdpbi50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vaG9tZS9wcm9qZWN0L3ZpdGUtY29uc29sZS1zdHJpcC1wbHVnaW4udHNcIjsvKipcbiAqIEN1c3RvbSBWaXRlIHBsdWdpbiB0byBzdHJpcCBjb25zb2xlLiogY2FsbHMgZnJvbSBwcm9kdWN0aW9uIGJ1aWxkc1xuICogVGhpcyBlbnN1cmVzIGFsbCBjb25zb2xlIGxvZ3MgYXJlIHJlbW92ZWQgcmVnYXJkbGVzcyBvZiB3aGVyZSB0aGV5IGFwcGVhclxuICovXG5pbXBvcnQgdHlwZSB7IFBsdWdpbiB9IGZyb20gJ3ZpdGUnO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBzdHJpcENvbnNvbGVQbHVnaW4oKTogUGx1Z2luIHtcbiAgcmV0dXJuIHtcbiAgICBuYW1lOiAnc3RyaXAtY29uc29sZScsXG4gICAgdHJhbnNmb3JtKGNvZGU6IHN0cmluZywgaWQ6IHN0cmluZykge1xuICAgICAgLy8gT25seSBwcm9jZXNzIEpTL1RTIGZpbGVzXG4gICAgICBpZiAoIS9cXC4oanN8dHN8anN4fHRzeCkkLy50ZXN0KGlkKSkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH1cblxuICAgICAgLy8gU2tpcCBub2RlX21vZHVsZXNcbiAgICAgIGlmIChpZC5pbmNsdWRlcygnbm9kZV9tb2R1bGVzJykpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG5cbiAgICAgIC8vIFNraXAgb3VyIGxvZ2dlciB1dGlsaXR5IChpdCBhbHJlYWR5IGhhbmRsZXMgcHJvZHVjdGlvbiBtb2RlKVxuICAgICAgaWYgKGlkLmluY2x1ZGVzKCdsb2dnZXIudHMnKSkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH1cblxuICAgICAgLy8gUmVwbGFjZSBkaXJlY3QgY29uc29sZS4qIGNhbGxzIHdpdGggZW1wdHkgZnVuY3Rpb25zXG4gICAgICAvLyBUaGlzIGlzIG1vcmUgdGhvcm91Z2ggdGhhbiB0ZXJzZXIncyBkcm9wX2NvbnNvbGUgd2hpY2ggY2FuIG1pc3Mgc29tZSBjYXNlc1xuICAgICAgY29uc3QgY29uc29sZVR5cGVzID0gWydsb2cnLCAnaW5mbycsICdkZWJ1ZycsICd0cmFjZSddO1xuICAgICAgXG4gICAgICBsZXQgbW9kaWZpZWRDb2RlID0gY29kZTtcbiAgICAgIFxuICAgICAgY29uc29sZVR5cGVzLmZvckVhY2godHlwZSA9PiB7XG4gICAgICAgIC8vIE1hdGNoIGNvbnNvbGUubG9nL2luZm8vZGVidWcvdHJhY2UgY2FsbHMsIGNhcmVmdWwgdG8gbm90IHJlcGxhY2Ugd2l0aGluIHN0cmluZ3NcbiAgICAgICAgY29uc3QgcmVnZXggPSBuZXcgUmVnRXhwKGBjb25zb2xlXFxcXC4ke3R5cGV9XFxcXHMqXFxcXChgLCAnZycpO1xuICAgICAgICBtb2RpZmllZENvZGUgPSBtb2RpZmllZENvZGUucmVwbGFjZShyZWdleCwgYCgoKT0+e30pKGApO1xuICAgICAgfSk7XG5cbiAgICAgIHJldHVybiB7XG4gICAgICAgIGNvZGU6IG1vZGlmaWVkQ29kZSxcbiAgICAgICAgbWFwOiBudWxsIC8vIFdlJ3JlIG5vdCBnZW5lcmF0aW5nIHNvdXJjZSBtYXBzIGZvciB0aGlzIHRyYW5zZm9ybWF0aW9uXG4gICAgICB9O1xuICAgIH1cbiAgfTtcbn1cbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBeU4sU0FBUyxvQkFBb0I7QUFDdFAsT0FBTyxXQUFXO0FBQ2xCLE9BQU8sVUFBVTtBQUNqQixTQUFTLHVCQUF1Qjs7O0FDR2pCLFNBQVIscUJBQThDO0FBQ25ELFNBQU87QUFBQSxJQUNMLE1BQU07QUFBQSxJQUNOLFVBQVUsTUFBYyxJQUFZO0FBRWxDLFVBQUksQ0FBQyxxQkFBcUIsS0FBSyxFQUFFLEdBQUc7QUFDbEMsZUFBTztBQUFBLE1BQ1Q7QUFHQSxVQUFJLEdBQUcsU0FBUyxjQUFjLEdBQUc7QUFDL0IsZUFBTztBQUFBLE1BQ1Q7QUFHQSxVQUFJLEdBQUcsU0FBUyxXQUFXLEdBQUc7QUFDNUIsZUFBTztBQUFBLE1BQ1Q7QUFJQSxZQUFNLGVBQWUsQ0FBQyxPQUFPLFFBQVEsU0FBUyxPQUFPO0FBRXJELFVBQUksZUFBZTtBQUVuQixtQkFBYSxRQUFRLFVBQVE7QUFFM0IsY0FBTSxRQUFRLElBQUksT0FBTyxhQUFhLElBQUksV0FBVyxHQUFHO0FBQ3hELHVCQUFlLGFBQWEsUUFBUSxPQUFPLFdBQVc7QUFBQSxNQUN4RCxDQUFDO0FBRUQsYUFBTztBQUFBLFFBQ0wsTUFBTTtBQUFBLFFBQ04sS0FBSztBQUFBO0FBQUEsTUFDUDtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQ0Y7OztBRDNDQSxJQUFNLG1DQUFtQztBQU96QyxJQUFPLHNCQUFRLGFBQWEsQ0FBQyxFQUFFLEtBQUssT0FBTztBQUFBLEVBQ3pDLFFBQVE7QUFBQSxJQUNOLHdCQUF3QixLQUFLLFVBQVUsS0FBSyxJQUFJLEVBQUUsU0FBUyxDQUFDO0FBQUEsRUFDOUQ7QUFBQSxFQUNBLFFBQVE7QUFBQSxJQUNOLE1BQU07QUFBQSxJQUNOLE1BQU07QUFBQSxFQUNSO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUCxNQUFNO0FBQUEsSUFDTixTQUFTLGlCQUFpQixnQkFBZ0I7QUFBQSxJQUMxQyxTQUFTLGdCQUFnQixtQkFBbUI7QUFBQSxFQUM5QyxFQUFFLE9BQU8sT0FBTztBQUFBLEVBQ2hCLFNBQVM7QUFBQSxJQUNQLE9BQU87QUFBQSxNQUNMLEtBQUssS0FBSyxRQUFRLGtDQUFXLE9BQU87QUFBQSxJQUN0QztBQUFBLEVBQ0Y7QUFBQSxFQUNBLE9BQU87QUFBQTtBQUFBLElBRUwsbUJBQW1CO0FBQUE7QUFBQSxJQUVuQixXQUFXO0FBQUE7QUFBQSxJQUVYLFFBQVE7QUFBQTtBQUFBLElBRVIsZUFBZTtBQUFBLE1BQ2IsUUFBUTtBQUFBLFFBQ04sY0FBYztBQUFBLFVBQ1osUUFBUSxDQUFDLFNBQVMsYUFBYSxrQkFBa0I7QUFBQSxRQUNuRDtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUE7QUFBQSxJQUVBLFFBQVE7QUFBQSxJQUNSLGVBQWU7QUFBQSxNQUNiLFVBQVU7QUFBQSxRQUNSLGNBQWM7QUFBQSxRQUNkLGVBQWU7QUFBQSxRQUNmLFlBQVksQ0FBQyxlQUFlLGdCQUFnQixpQkFBaUIsZUFBZTtBQUFBLFFBQzVFLFFBQVE7QUFBQSxNQUNWO0FBQUEsTUFDQSxRQUFRO0FBQUEsUUFDTixVQUFVO0FBQUEsTUFDWjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQ0YsRUFBRTsiLAogICJuYW1lcyI6IFtdCn0K
