import {
   type AuthFunctions,
   createClient,
   type GenericCtx,
} from "@convex-dev/better-auth"
import { convex, crossDomain } from "@convex-dev/better-auth/plugins"
import { betterAuth } from "better-auth/minimal"
import { components, internal } from "@/convex/_generated/api"
import type { DataModel } from "@/convex/_generated/dataModel"
import { assertEnv } from "@/env"
import authConfig from "../convex/auth.config"

const siteUrl = assertEnv("BASE_URL")

const authFunctions: AuthFunctions = internal.auth

export const authComponent = createClient<DataModel>(components.betterAuth, {
   authFunctions,
   triggers: {
      user: {
         onCreate: async (ctx, user) => {
            await ctx.db.insert("user", {
               betterAuthUserId: user._id,
               email: user.email,
               name: user.name,
               image: user.image ?? undefined,
            })
         },
         onUpdate: async (ctx, newUser) => {
            const user = await ctx.db
               .query("user")
               .withIndex("betterAuthUserId", (q) =>
                  q.eq("betterAuthUserId", newUser._id),
               )
               .first()
            if (!user) return

            await ctx.db.patch(user._id, {
               email: newUser.email,
               name: newUser.name,
               image: newUser.image ?? undefined,
            })
         },
         onDelete: async (ctx, authUser) => {
            const user = await ctx.db
               .query("user")
               .withIndex("betterAuthUserId", (q) =>
                  q.eq("betterAuthUserId", authUser._id),
               )
               .first()
            if (!user) return

            await ctx.db.delete(user._id)
         },
      },
   },
})

export const { onCreate, onUpdate, onDelete } = authComponent.triggersApi()

export const createAuth = (ctx: GenericCtx<DataModel>) => {
   return betterAuth({
      baseURL: assertEnv("CONVEX_SITE_URL"),
      trustedOrigins: [siteUrl],
      database: authComponent.adapter(ctx),
      plugins: [crossDomain({ siteUrl }), convex({ authConfig })],
      socialProviders: {
         google: {
            clientId: assertEnv("GOOGLE_CLIENT_ID"),
            clientSecret: assertEnv("GOOGLE_CLIENT_SECRET"),
            mapProfileToUser: (profile: {
               given_name?: string
               picture?: string
               email?: string
            }) => {
               return {
                  name:
                     profile.given_name ?? profile.email?.split("@")[0] ?? "",
                  image: profile.picture,
               }
            },
         },
      },
   })
}
