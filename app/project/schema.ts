import { createTable, lifecycleDates, tableId } from "@/db/utils"
import { user } from "@/user/schema"
import { integer, text, uniqueIndex } from "drizzle-orm/sqlite-core"
import { createInsertSchema } from "drizzle-zod"
import { z } from "zod"

export const project = createTable(
   "project",
   {
      id: tableId("project"),
      name: text().notNull(),
      slug: text().notNull(),
      rate: integer().notNull(),
      ownerId: text()
         .notNull()
         .references(() => user.id),
      ...lifecycleDates,
   },
   (table) => {
      return {
         projectSlugIdx: uniqueIndex("project_slug_idx").on(table.slug),
      }
   },
)

export const insertProjectParams = createInsertSchema(project, {
   name: z.string().min(1).max(32),
}).omit({
   id: true,
   createdAt: true,
   updatedAt: true,
   ownerId: true,
})
