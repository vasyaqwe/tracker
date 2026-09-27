import { ConvexError } from "convex/values"
import { getOneFrom } from "convex-helpers/server/relationships"
import { authComponent } from "@/auth"
import type { MutationCtx, QueryCtx } from "@/convex/_generated/server"

export const safeGetUser = async (ctx: QueryCtx | MutationCtx) => {
   const authUser = await authComponent.safeGetAuthUser(ctx)
   if (!authUser) return
   const user = await getOneFrom(
      ctx.db,
      "user",
      "betterAuthUserId",
      authUser._id,
   )
   if (!user) return

   return { ...authUser, ...user }
}

export const getUser = async (ctx: QueryCtx | MutationCtx) => {
   const user = await safeGetUser(ctx)
   if (!user) throw new ConvexError("User not found")

   return user
}
