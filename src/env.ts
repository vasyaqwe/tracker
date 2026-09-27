export const assertEnv = (name: keyof ConvexEnv) => {
   const value = process.env[name]
   if (!value) throw new Error(`Missing environment variable \`${name}\``)
   return value
}

export type ConvexEnv = {
   BASE_URL: string
   CONVEX_SITE_URL: string
   GOOGLE_CLIENT_ID: string
   GOOGLE_CLIENT_SECRET: string
}
