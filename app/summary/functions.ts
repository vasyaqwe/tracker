import { projectOwnerMiddleware } from "@/project/middleware"
import { insertSummaryParams, summary } from "@/summary/schema"
import { createServerFn } from "@tanstack/start"
import { zodValidator } from "@tanstack/zod-adapter"
import { and, desc, eq, gte, inArray, lt, sql } from "drizzle-orm"
import { z } from "zod"

export const list = createServerFn({ method: "GET" })
   .middleware([projectOwnerMiddleware])
   .validator(zodValidator(z.object({ projectId: z.string() })))
   .handler(async ({ context, data }) => {
      return await context.db.query.summary.findMany({
         where: eq(summary.projectId, data.projectId),
         columns: {
            id: true,
            amountEarned: true,
            durationMinutes: true,
            createdAt: true,
         },
         orderBy: (data) => desc(data.createdAt),
      })
   })

export const insert = createServerFn({ method: "POST" })
   .middleware([projectOwnerMiddleware])
   .validator(zodValidator(insertSummaryParams))
   .handler(async ({ context, data }) => {
      const existingSummary = await context.db
         .select({ id: summary.id })
         .from(summary)
         .where(
            and(
               eq(summary.projectId, data.projectId),
               gte(
                  summary.createdAt,
                  new Date(new Date().setUTCHours(0, 0, 0, 0)).getTime(),
               ),
               lt(
                  summary.createdAt,
                  new Date(new Date().setUTCHours(23, 59, 59, 999)).getTime(),
               ),
            ),
         )
         .get()

      if (existingSummary) {
         await context.db
            .update(summary)
            .set({
               amountEarned: sql`${summary.amountEarned} + ${data.amountEarned}`,
               durationMinutes: sql`${summary.durationMinutes} + ${data.durationMinutes}`,
            })
            .where(eq(summary.id, existingSummary.id))

         return
      }

      await context.db.insert(summary).values({
         projectId: data.projectId,
         amountEarned: data.amountEarned,
         durationMinutes: data.durationMinutes,
      })
   })

export const deleteFn = createServerFn({ method: "POST" })
   .middleware([projectOwnerMiddleware])
   .validator(
      zodValidator(
         z.object({ ids: z.array(z.string()), projectId: z.string() }),
      ),
   )
   .handler(async ({ context, data }) => {
      await context.db.delete(summary).where(inArray(summary.id, data.ids))
   })
