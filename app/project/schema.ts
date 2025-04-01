import { table, tableId, timestamps } from "@/database/utils"
import { user } from "@/user/schema"
import { index, integer, text } from "drizzle-orm/sqlite-core"

export const project = table(
   "project",
   {
      id: tableId("project"),
      name: text().notNull(),
      slug: text().notNull(),
      rate: integer().notNull(),
      ownerId: text()
         .references(() => user.id, { onDelete: "cascade" })
         .notNull(),
      ...timestamps,
   },
   (table) => {
      return {
         projectSlugIdx: index("project_slug_idx").on(table.slug),
         projectOwnerIdIdx: index("project_owner_id_idx").on(table.ownerId),
      }
   },
)
