import { oauthAccount } from "@/auth/schema"
import { table, tableId, timestamps } from "@/database/utils"
import { relations } from "drizzle-orm"
import { text, uniqueIndex } from "drizzle-orm/sqlite-core"
import { createSelectSchema } from "drizzle-zod"
import { z } from "zod"

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

export const userRelations = relations(user, ({ many }) => ({
   oauthAccount: many(oauthAccount),
}))

export const updateUserParams = createSelectSchema(user, {
   name: z.string().min(1).max(32),
}).partial()
