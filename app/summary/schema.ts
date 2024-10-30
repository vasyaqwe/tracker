import { createTable, lifecycleDates, tableId } from "@/db/utils"
import { project } from "@/project/schema"
import { integer, numeric, text } from "drizzle-orm/sqlite-core"
import { createInsertSchema } from "drizzle-zod"

export const summary = createTable(
   "summary",
   {
      id: tableId("summary"),
      projectId: text()
         .notNull()
         .references(() => project.id),
      amountEarned: numeric().notNull(),
      durationMinutes: integer().notNull(),
      ...lifecycleDates,
   },
   () => {
      return {
         //
      }
   },
)

export const insertSummaryParams = createInsertSchema(summary).omit({
   id: true,
   createdAt: true,
   updatedAt: true,
})
