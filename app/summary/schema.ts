import { createTable, lifecycleDates, tableId } from "@/db/utils"
import { project } from "@/project/schema"
import { index, integer, numeric, text } from "drizzle-orm/sqlite-core"
import { createInsertSchema } from "drizzle-zod"

export const summary = createTable(
   "summary",
   {
      id: tableId("summary"),
      projectId: text()
         .references(() => project.id, { onDelete: "cascade" })
         .notNull(),
      amountEarned: numeric().notNull(),
      durationMinutes: integer().notNull(),
      ...lifecycleDates,
   },
   (table) => {
      return {
         summaryProjectIdIdx: index("summary_project_id_idx").on(
            table.projectId,
         ),
      }
   },
)

export const insertSummaryParams = createInsertSchema(summary).omit({
   id: true,
   createdAt: true,
   updatedAt: true,
})
