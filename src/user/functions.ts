import { query } from "@/functions"
import { safeGetUser } from "@/user/utils"

export const me = query({
   args: {},
   handler: async (ctx) => (await safeGetUser(ctx)) ?? null,
})
