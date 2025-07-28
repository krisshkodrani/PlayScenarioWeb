
/**
 * Configuration utility for PlayScenarioAI
 * Handles environment-specific settings
 */

export const config = {
  // API configuration
  api: {
    baseUrl: import.meta.env.MODE === 'development' 
      ? '/api'  // Use proxy in development
      : import.meta.env.VITE_API_BASE_URL || 'https://your-production-api.com/api'
  },
  
  // Environment detection
  isDevelopment: import.meta.env.MODE === 'development',
  isProduction: import.meta.env.MODE === 'production',
} as const;

export default config;
