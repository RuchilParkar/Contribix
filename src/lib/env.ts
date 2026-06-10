import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().optional(),
  GITHUB_TOKEN: z.string().optional(),
  OPENAI_API_KEY: z.string().optional(),
});

const getProcessEnv = () => {
  if (typeof process !== 'undefined' && process.env) {
    return process.env;
  }
  return {};
};

export const env = envSchema.parse(getProcessEnv());
