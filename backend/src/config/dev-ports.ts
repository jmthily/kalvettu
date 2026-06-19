/** Local dev ports — keep in sync with src/lib/config/dev-ports.ts */
export const LOCAL_DEV_PORTS = {
  web: 3020,
  api: 3021,
} as const;

export const LOCAL_DEV_SITE_URL = `http://localhost:${LOCAL_DEV_PORTS.web}`;
export const LOCAL_DEV_API_URL = `http://localhost:${LOCAL_DEV_PORTS.api}/api`;
