import { defineTable } from "convex/server"
import { v } from "convex/values"

const user = v.object({
   betterAuthUserId: v.optional(v.string()),
   email: v.string(),
   name: v.string(),
   image: v.optional(v.string()),
})

export const userTable = defineTable(user)
   .index("betterAuthUserId", ["betterAuthUserId"])
   .index("email", ["email"])
