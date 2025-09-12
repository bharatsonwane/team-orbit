import { z } from "zod";
import { logger } from "../utils/logger";

const envVariableSchema = z.object({
  /* app */
  VITE_APP_NAME: z.string().min(1, "VITE_APP_NAME is mandatory"),
  VITE_APP_VERSION: z.string().min(1, "VITE_APP_VERSION is mandatory"),
  VITE_APP_ENV: z.enum(["development", "production", "test"]),

  /* api */
  VITE_API_BASE_URL: z.string().url({ message: "VITE_API_BASE_URL must be a valid URL" }),
  VITE_API_TIMEOUT: z.number().int().positive().optional().default(10000),

  /* auth */
  VITE_JWT_STORAGE_KEY: z.string().min(1, "VITE_JWT_STORAGE_KEY is mandatory"),
  VITE_TOKEN_EXPIRY_BUFFER: z.number().int().positive().optional().default(300000), // 5 minutes

  /* features */
  VITE_ENABLE_DEV_TOOLS: z.boolean().optional().default(false),
  VITE_ENABLE_ANALYTICS: z.boolean().optional().default(false),
  VITE_ENABLE_ERROR_REPORTING: z.boolean().optional().default(false),

  /* external services */
  VITE_GOOGLE_ANALYTICS_ID: z.string().optional(),
});

// Type inference from the schema
type EnvVariable = z.infer<typeof envVariableSchema>;

const getEnvVariable = (): EnvVariable => {
  try {
    const environmentVariable: EnvVariable = {
      VITE_APP_NAME: import.meta.env.VITE_APP_NAME! || "Lokvani",
      VITE_APP_VERSION: import.meta.env.VITE_APP_VERSION! || "1.0.0",
      VITE_APP_ENV: import.meta.env.VITE_APP_ENV as EnvVariable["VITE_APP_ENV"] || "development",
      VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL! || "http://localhost:5000",
      VITE_API_TIMEOUT: Number(import.meta.env.VITE_API_TIMEOUT) || 10000,
      VITE_JWT_STORAGE_KEY: import.meta.env.VITE_JWT_STORAGE_KEY! || "auth_token",
      VITE_TOKEN_EXPIRY_BUFFER: Number(import.meta.env.VITE_TOKEN_EXPIRY_BUFFER) || 300000,
      VITE_ENABLE_DEV_TOOLS: import.meta.env.VITE_ENABLE_DEV_TOOLS === "true",
      VITE_ENABLE_ANALYTICS: import.meta.env.VITE_ENABLE_ANALYTICS === "true",
      VITE_ENABLE_ERROR_REPORTING: import.meta.env.VITE_ENABLE_ERROR_REPORTING === "true",
      VITE_GOOGLE_ANALYTICS_ID: import.meta.env.VITE_GOOGLE_ANALYTICS_ID || "",
    };

    envVariableSchema.parse(environmentVariable);
    return environmentVariable;
  } catch (error) {
    logger.error(error);
    throw new Error("Environment variable validation failed");
  }
};

export const envVariable = getEnvVariable();
export type { EnvVariable };
