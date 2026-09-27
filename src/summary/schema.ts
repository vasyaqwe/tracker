import { defineTable } from "convex/server"
import { v } from "convex/values"

const summary = v.object({
   projectId: v.id("project"),
   day: v.string(),
   durationSeconds: v.number(),
   amountEarned: v.number(),
})

export const summaryTable = defineTable(summary).index("projectId_day", [
   "projectId",
   "day",
])
