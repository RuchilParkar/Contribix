import { z } from "zod";

export const env = z
  .object({
    DATABASE_URL: z.string().optional(),
    GITHUB_TOKEN: z.string().optional(),
    OPENAI_API_KEY: z.string().optional(),
  })
  .parse(process.env);
