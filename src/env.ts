export const assertEnv = (name: keyof ConvexEnv) => {
   const value = process.env[name]
   if (!value) throw new Error(`Missing environment variable \`${name}\``)
   return value
}

export const clientEnv = {
   development: {
      CONVEX_CLOUD_URL: "https://dynamic-wildcat-248.eu-west-1.convex.cloud",
      CONVEX_SITE_URL: "https://dynamic-wildcat-248.eu-west-1.convex.site",
   },
   production: {
      CONVEX_CLOUD_URL: "https://dynamic-crow-263.eu-west-1.convex.cloud",
      CONVEX_SITE_URL: "https://dynamic-crow-263.eu-west-1.convex.site",
   },
} as const

export const env = clientEnv[process.env.NODE_ENV as keyof typeof clientEnv]

export type ConvexEnv = {
   BASE_URL: string
   CONVEX_SITE_URL: string
   GOOGLE_CLIENT_ID: string
   GOOGLE_CLIENT_SECRET: string
}
