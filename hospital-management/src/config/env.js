/**
 * Safe access to Vite environment variables.
 * Only variables prefixed with VITE_ are exposed to the client.
 *
 * Usage:
 *   import { ENV } from '../config/env';
 *   ENV.API_URL  // same as import.meta.env.VITE_API_URL
 */
export const ENV = {
  /** Render backend URL (production). Empty in dev → uses Vite proxy. */
  API_URL: import.meta.env.VITE_API_URL ?? '',

  /** Local backend target for Vite dev-server proxy */
  DEV_API_URL: import.meta.env.VITE_DEV_API_URL ?? '',

  IS_DEV: import.meta.env.DEV,
  IS_PROD: import.meta.env.PROD,
  MODE: import.meta.env.MODE
};
