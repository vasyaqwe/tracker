import { protectedProcedure } from "@/lib/trpc"
import { insertSummaryParams, summary } from "@/summary/schema"
import { createServerFn } from "@tanstack/start"
import { eq } from "drizzle-orm"
import { z } from "zod"

export const list = createServerFn(
   "GET",
   protectedProcedure
      .input(z.object({ projectId: z.string() }))
      .query(async ({ ctx, input }) => {
         return await ctx.db.query.summary.findMany({
            where: eq(summary.projectId, input.projectId),
            columns: {
               id: true,
            },
         })
      }),
)

export const insert = createServerFn(
   "POST",
   protectedProcedure
      .input(insertSummaryParams)
      .mutation(async ({ ctx, input }) => {
         const createdSummary = await ctx.db
            .insert(summary)
            .values({
               projectId: input.projectId,
               amountEarned: input.amountEarned,
               durationMinutes: input.durationMinutes,
            })
            .returning({
               id: summary.id,
            })
            .get()

         return createdSummary.id
      }),
)

export const deleteFn = createServerFn(
   "POST",
   protectedProcedure
      .input(z.object({ id: z.string() }))
      .mutation(async ({ ctx, input }) => {
         return await ctx.db.transaction(async (tx) => {
            await tx.delete(summary).where(eq(summary.id, input.id))
         })
      }),
)
