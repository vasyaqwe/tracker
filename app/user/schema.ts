import { table, tableId, timestamps } from "@/database/utils"
import { text, uniqueIndex } from "drizzle-orm/sqlite-core"

export const user = table(
   "user",
   {
      id: tableId("user"),
      email: text().notNull(),
      name: text().notNull().default("No name"),
      avatarUrl: text(),
      ...timestamps,
   },
   (table) => {
      return {
         userEmailIdx: uniqueIndex("user_email_idx").on(table.email),
      }
   },
)
