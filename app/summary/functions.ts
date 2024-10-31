import { protectedProcedure } from "@/lib/trpc"
import { insertSummaryParams, summary } from "@/summary/schema"
import { createServerFn } from "@tanstack/start"
import { and, eq, gte, lt, sql } from "drizzle-orm"
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
               amountEarned: true,
               durationMinutes: true,
               createdAt: true,
            },
         })
      }),
)

export const insert = createServerFn(
   "POST",
   protectedProcedure
      .input(insertSummaryParams)
      .mutation(async ({ ctx, input }) => {
         const existingSummary = await ctx.db
            .select({ id: summary.id })
            .from(summary)
            .where(
               and(
                  eq(summary.projectId, input.projectId),
                  gte(
                     summary.createdAt,
                     new Date(new Date().setUTCHours(0, 0, 0, 0)).getTime(),
                  ),
                  lt(
                     summary.createdAt,
                     new Date(
                        new Date().setUTCHours(23, 59, 59, 999),
                     ).getTime(),
                  ),
               ),
            )
            .get()

         if (existingSummary)
            return await ctx.db
               .update(summary)
               .set({
                  amountEarned: sql`${summary.amountEarned} + ${input.amountEarned}`,
                  durationMinutes: sql`${summary.durationMinutes} + ${input.durationMinutes}`,
               })
               .where(eq(summary.id, existingSummary.id))

         return await ctx.db.insert(summary).values({
            projectId: input.projectId,
            amountEarned: input.amountEarned,
            durationMinutes: input.durationMinutes,
         })
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
