function getEnvVariable(key) {
  const value = process.env[key];

  if (!value) {
    throw new Error(`❌ Missing environment variable: ${key}`);
  }

  return value;
}

// Server Constants
export const PORT = getEnvVariable('PORT');
export const CORS_ORIGIN = getEnvVariable('CORS_ORIGIN');

// Database Constants
export const DATABASE_URI = getEnvVariable('DATABASE_URI');
export const DATABASE_NAME = getEnvVariable('DATABASE_NAME');

// Clerk Constants
export const CLERK_WEBHOOK_SIGNING_SECRET = getEnvVariable(
  'CLERK_WEBHOOK_SIGNING_SECRET'
);

// OpenAI Constants
export const GEMINI_API_KEY = getEnvVariable('GEMINI_API_KEY');
