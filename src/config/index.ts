const config = {
  // Default to proxied API path in dev if env not provided
  baseUrl: import.meta.env.VITE_BASE_URL || "/api/v1",
};

export default config;
