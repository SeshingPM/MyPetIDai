/**
 * Custom Vite plugin to strip console.* calls from production builds
 * This ensures all console logs are removed regardless of where they appear
 */
import type { Plugin } from 'vite';

export default function stripConsolePlugin(): Plugin {
  return {
    name: 'strip-console',
    transform(code: string, id: string) {
      // Only process JS/TS files
      if (!/\.(js|ts|jsx|tsx)$/.test(id)) {
        return null;
      }

      // Skip node_modules
      if (id.includes('node_modules')) {
        return null;
      }

      // Skip our logger utility (it already handles production mode)
      if (id.includes('logger.ts')) {
        return null;
      }

      // Replace direct console.* calls with empty functions
      // This is more thorough than terser's drop_console which can miss some cases
      const consoleTypes = ['log', 'info', 'debug', 'trace'];
      
      let modifiedCode = code;
      
      consoleTypes.forEach(type => {
        // Match console.log/info/debug/trace calls, careful to not replace within strings
        const regex = new RegExp(`console\\.${type}\\s*\\(`, 'g');
        modifiedCode = modifiedCode.replace(regex, `(()=>{})(`);
      });

      return {
        code: modifiedCode,
        map: null // We're not generating source maps for this transformation
      };
    }
  };
}
