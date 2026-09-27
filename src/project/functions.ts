import { getManyFrom } from "convex-helpers/server/relationships"
import { zid } from "convex-helpers/server/zod4"
import { z } from "zod"
import { mutation, query } from "@/functions"
import { getOwnedProject, hourlyRate, projectName } from "@/project/utils"
import { getUser, safeGetUser } from "@/user/utils"

export const list = query({
   args: {},
   handler: async (ctx) => {
      const user = await safeGetUser(ctx)
      if (!user) return []

      return getManyFrom(ctx.db, "project", "ownerId", user._id)
   },
})

export const byId = query({
   args: { projectId: z.string() },
   handler: async (ctx, args) => {
      const user = await safeGetUser(ctx)
      if (!user) return null

      const projectId = ctx.db.normalizeId("project", args.projectId)
      if (!projectId) return null

      const project = await ctx.db.get(projectId)
      if (!project || project.ownerId !== user._id) return null

      return project
   },
})

export const create = mutation({
   args: { name: projectName, hourlyRate },
   handler: async (ctx, args) => {
      const user = await getUser(ctx)

      return ctx.db.insert("project", { ...args, ownerId: user._id })
   },
})

export const update = mutation({
   args: { projectId: zid("project"), name: projectName, hourlyRate },
   handler: async (ctx, { projectId, ...args }) => {
      await getOwnedProject(ctx, projectId)

      return ctx.db.patch(projectId, args)
   },
})

export const remove = mutation({
   args: { projectId: zid("project") },
   handler: async (ctx, args) => {
      await getOwnedProject(ctx, args.projectId)

      const summaries = await ctx.db
         .query("summary")
         .withIndex("projectId_day", (q) => q.eq("projectId", args.projectId))
         .collect()
      for (const summary of summaries) await ctx.db.delete(summary._id)

      return ctx.db.delete(args.projectId)
   },
})
