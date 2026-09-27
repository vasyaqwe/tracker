import { defineTable } from "convex/server"
import { v } from "convex/values"

const project = v.object({
   name: v.string(),
   hourlyRate: v.number(),
   ownerId: v.id("user"),
   timerStartedAt: v.optional(v.number()),
})

export const projectTable = defineTable(project).index("ownerId", ["ownerId"])
