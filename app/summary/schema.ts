import { table, tableId, timestamps } from "@/database/utils"
import { project } from "@/project/schema"
import { index, integer, numeric, text } from "drizzle-orm/sqlite-core"

export const summary = table(
   "summary",
   {
      id: tableId("summary"),
      projectId: text()
         .references(() => project.id, { onDelete: "cascade" })
         .notNull(),
      amountEarned: numeric().notNull(),
      durationMinutes: integer().notNull(),
      ...timestamps,
   },
   (table) => {
      return {
         summaryProjectIdIdx: index("summary_project_id_idx").on(
            table.projectId,
         ),
      }
   },
)
