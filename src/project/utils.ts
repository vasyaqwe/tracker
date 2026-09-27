import { ConvexError } from "convex/values"
import { z } from "zod"
import type { Id } from "@/convex/_generated/dataModel"
import type { MutationCtx, QueryCtx } from "@/convex/_generated/server"
import { getUser } from "@/user/utils"

export const projectName = z
   .string()
   .trim()
   .min(1, "Name is required")
   .max(32, "Name is too long")

export const hourlyRate = z
   .number()
   .int()
   .positive("Rate must be positive")
   .max(100_000, "Rate is too high")

export const getOwnedProject = async (
   ctx: QueryCtx | MutationCtx,
   projectId: Id<"project">,
) => {
   const user = await getUser(ctx)
   const project = await ctx.db.get(projectId)
   if (!project || project.ownerId !== user._id)
      throw new ConvexError("Project not found")

   return project
}
