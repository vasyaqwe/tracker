import { createEnv } from "@t3-oss/env-core"
import { z } from "zod"
import { getCloudflareProxyEnv, isInCloudflareCI } from "./lib/cloudflare"

const PUBLIC_ENV_PREFIX = "VITE_" as const

const createEnvSchema = <Shape extends z.ZodRawShape>(
   type: "Public" | "Private",
   shape: Shape,
) => {
   for (const key in shape) {
      if (type === "Public" && !key.startsWith(PUBLIC_ENV_PREFIX)) {
         throw new Error(
            `Public environment variables must start with "${PUBLIC_ENV_PREFIX}", got "${key}"`,
         )
      }

      if (type === "Private" && key.startsWith(PUBLIC_ENV_PREFIX)) {
         throw new Error(
            `Private environment variables must not start with "${PUBLIC_ENV_PREFIX}", got "${key}"`,
         )
      }
   }

   return z.object(shape)
}

// https://developers.cloudflare.com/workers/configuration/environment-variables/

// Private environment variables should be defined in the `.dev.vars` file or cloudflare dashboard
const privateSchema = createEnvSchema("Private", {
   DATABASE_URL: z.string().min(1),
   DATABASE_AUTH_TOKEN: z.string().min(1),
   GITHUB_CLIENT_ID: z.string().min(1),
   GITHUB_CLIENT_SECRET: z.string().min(1),
   GOOGLE_CLIENT_ID: z.string().min(1),
   GOOGLE_CLIENT_SECRET: z.string().min(1),
})

const publicEnv = createEnv({
   server: {},
   clientPrefix: PUBLIC_ENV_PREFIX,
   client: {
      VITE_BASE_URL: z.string().min(1),
   },
   runtimeEnv: {
      VITE_BASE_URL:
         process.env.NODE_ENV === "development"
            ? "http://localhost:3000"
            : "https://trackerhq.vercel.app",
   },
   emptyStringAsUndefined: true,
})

const envSchema = z.object({
   ...privateSchema.shape,
})

// you should only call this function in app.config.ts
const parseEnv = async () => {
   let result: ReturnType<typeof envSchema.safeParse>

   if (isInCloudflareCI()) {
      result = envSchema.safeParse(process.env)
   } else {
      result = envSchema.safeParse(await getCloudflareProxyEnv())
   }

   if (result.error) {
      console.log(result.error.message)

      throw new Error("Invalid environment variables")
   }

   const total = Object.keys(result.data).length

   console.log(`Environment variables parsed successfully (${total} variables)`)
}

type ViteBuiltInEnv = {
   MODE: "development" | "production" | "test"
   DEV: boolean
   SSR: boolean
   PROD: boolean
   BASE_URL: string
}

type Env = z.infer<typeof envSchema>
type PrivateEnv = z.infer<typeof privateSchema>

declare global {
   interface ImportMetaEnv extends ViteBuiltInEnv {}

   interface ImportMeta {
      readonly env: ImportMetaEnv
   }
}

export { parseEnv, PUBLIC_ENV_PREFIX, publicEnv }
export type { Env, PrivateEnv }
