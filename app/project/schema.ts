import { createTable, lifecycleDates, tableId } from "@/db/utils"
import { user } from "@/user/schema"
import { index, integer, text } from "drizzle-orm/sqlite-core"
import { createInsertSchema, createSelectSchema } from "drizzle-zod"
import { z } from "zod"

export const project = createTable(
   "project",
   {
      id: tableId("project"),
      name: text().notNull(),
      slug: text().notNull(),
      rate: integer().notNull(),
      ownerId: text()
         .references(() => user.id, { onDelete: "cascade" })
         .notNull(),
      ...lifecycleDates,
   },
   (table) => {
      return {
         projectSlugIdx: index("project_slug_idx").on(table.slug),
         projectOwnerIdIdx: index("project_owner_id_idx").on(table.ownerId),
      }
   },
)

export const insertProjectParams = createInsertSchema(project, {
   name: z.string().min(1).max(32),
   rate: z.number().min(1).max(1000),
}).omit({
   id: true,
   createdAt: true,
   updatedAt: true,
   ownerId: true,
})

export const updateProjectParams = createSelectSchema(project, {
   name: z.string().min(1).max(32),
   rate: z.number().min(1).max(1000),
})
   .omit({
      slug: true,
   })
   .partial()
   .extend({
      id: z.string(),
   })
