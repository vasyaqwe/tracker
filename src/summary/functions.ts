import { ConvexError } from "convex/values"
import { zid } from "convex-helpers/server/zod4"
import { z } from "zod"
import { mutation, query } from "@/functions"
import { getOwnedProject } from "@/project/utils"

export const list = query({
   args: { projectId: zid("project") },
   handler: async (ctx, args) => {
      await getOwnedProject(ctx, args.projectId)

      return ctx.db
         .query("summary")
         .withIndex("projectId_day", (q) => q.eq("projectId", args.projectId))
         .order("desc")
         .collect()
   },
})

export const remove = mutation({
   args: {
      projectId: zid("project"),
      summaryIds: z.array(zid("summary")).min(1),
   },
   handler: async (ctx, args) => {
      await getOwnedProject(ctx, args.projectId)

      for (const summaryId of args.summaryIds) {
         const summary = await ctx.db.get(summaryId)
         if (summary?.projectId !== args.projectId)
            throw new ConvexError("Summary not found")
         await ctx.db.delete(summaryId)
      }
   },
})
