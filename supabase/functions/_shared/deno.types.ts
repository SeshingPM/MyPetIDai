/**
 * TypeScript declarations for Deno runtime APIs
 * This file provides type definitions for the Deno namespace used in Supabase Edge Functions
 */

// Define the Deno namespace to fix TypeScript errors
declare namespace Deno {
  export interface Env {
    get(key: string): string | undefined;
    set(key: string, value: string): void;
    toObject(): Record<string, string>;
  }

  export const env: Env;
  
  export interface ConnInfo {
    localAddr: Addr;
    remoteAddr: Addr;
  }
  
  export interface Addr {
    hostname: string;
    port: number;
    transport: 'tcp' | 'udp';
  }
  
  export interface ServeInit {
    port?: number;
    hostname?: string;
    handler?: (request: Request, connInfo: ConnInfo) => Response | Promise<Response>;
    onError?: (error: unknown) => Response | Promise<Response>;
  }
  
  export function serve(handler: (request: Request, connInfo: ConnInfo) => Response | Promise<Response>, options?: ServeInit): void;
}
