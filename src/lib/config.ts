// Type-safe environment configuration
interface Config {
  supabase: {
    url: string;
    anonKey: string;
  };
  api: {
    url?: string;
  };
  features: {
    debug: boolean;
  };
}

class ConfigurationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ConfigurationError';
  }
}

function getEnvVar(key: string, required: boolean = true): string {
  const value = import.meta.env[key];
  
  if (required && !value) {
    throw new ConfigurationError(
      `Missing required environment variable: ${key}. Please check your .env file.`
    );
  }
  
  return value || '';
}

function createConfig(): Config {
  return {
    supabase: {
      url: getEnvVar('VITE_SUPABASE_URL'),
      anonKey: getEnvVar('VITE_SUPABASE_ANON_KEY'),
    },
    api: {
      url: getEnvVar('VITE_API_URL', false),
    },
    features: {
      debug: getEnvVar('VITE_ENABLE_DEBUG', false) === 'true',
    },
  };
}

// Create and validate config on startup
export const config = createConfig();

// Validate Supabase configuration
if (!config.supabase.url.startsWith('https://')) {
  throw new ConfigurationError('Supabase URL must use HTTPS protocol');
}

if (config.supabase.anonKey.length < 30) {
  throw new ConfigurationError('Invalid Supabase anon key');
}