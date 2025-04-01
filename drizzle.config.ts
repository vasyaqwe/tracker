import type { Config } from "drizzle-kit"

export default {
   schema: "./app/database/schema.ts",
   out: "./app/database/migrations",
   dialect: "turso",
   casing: "snake_case",
   dbCredentials: {
      // biome-ignore lint/style/noNonNullAssertion: <explanation>
      url: process.env.DATABASE_URL!,
      // biome-ignore lint/style/noNonNullAssertion: <explanation>
      authToken: process.env.DATABASE_AUTH_TOKEN!,
   },
   verbose: true,
} satisfies Config
