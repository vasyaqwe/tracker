import { ConvexError } from "convex/values"
import { zid } from "convex-helpers/server/zod4"
import { z } from "zod"
import { mutation } from "@/functions"
import { getOwnedProject } from "@/project/utils"

export const start = mutation({
   args: { projectId: zid("project") },
   handler: async (ctx, args) => {
      const project = await getOwnedProject(ctx, args.projectId)
      if (project.timerStartedAt) return

      return ctx.db.patch(args.projectId, { timerStartedAt: Date.now() })
   },
})

export const stop = mutation({
   args: {
      projectId: zid("project"),
      day: z.iso.date(),
   },
   handler: async (ctx, args) => {
      const project = await getOwnedProject(ctx, args.projectId)
      if (!project.timerStartedAt) throw new ConvexError("Timer is not running")

      await ctx.db.patch(args.projectId, { timerStartedAt: undefined })

      const durationSeconds = Math.floor(
         (Date.now() - project.timerStartedAt) / 1000,
      )
      if (durationSeconds === 0) return

      const amountEarned = Math.round(
         (durationSeconds / 3600) * project.hourlyRate,
      )
      const summary = await ctx.db
         .query("summary")
         .withIndex("projectId_day", (q) =>
            q.eq("projectId", args.projectId).eq("day", args.day),
         )
         .unique()
      if (!summary)
         return ctx.db.insert("summary", {
            projectId: args.projectId,
            day: args.day,
            durationSeconds,
            amountEarned,
         })

      return ctx.db.patch(summary._id, {
         durationSeconds: summary.durationSeconds + durationSeconds,
         amountEarned: summary.amountEarned + amountEarned,
      })
   },
})
