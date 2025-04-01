import { OAUTH_PROVIDERS } from "@/auth/constants"
import { table, tableId } from "@/database/utils"
import { user } from "@/user/schema"
import { relations } from "drizzle-orm"
import { index, integer, primaryKey, text } from "drizzle-orm/sqlite-core"
import { z } from "zod"

export const oauthAccount = table(
   "oauth_account",
   {
      userId: text()
         .references(() => user.id, { onDelete: "cascade" })
         .notNull(),
      providerId: text({
         enum: OAUTH_PROVIDERS,
      }).notNull(),
      providerUserId: text().notNull().unique(),
   },
   (table) => {
      return {
         pk: primaryKey({
            name: "oauth_account_provider_user_id_unique",
            columns: [table.providerId, table.providerUserId],
         }),
      }
   },
)

export const oauthAccountRelations = relations(oauthAccount, ({ one }) => ({
   user: one(user, {
      fields: [oauthAccount.userId],
      references: [user.id],
   }),
}))

export const emailVerificationCode = table(
   "email_verification_code",
   {
      id: tableId("verification_code"),
      expiresAt: integer().notNull(),
      code: text().notNull(),
      userId: text()
         .references(() => user.id, { onDelete: "cascade" })
         .notNull(),
      email: text().notNull().unique(),
   },
   (table) => {
      return {
         emailVerificationCodeUserIdIdx: index(
            "email_verification_code_user_id_idx",
         ).on(table.userId),
      }
   },
)

const ownedProjectsSchema = z.array(z.object({ id: z.string() }))

export const session = table("session", {
   id: text().primaryKey(),
   expiresAt: integer({
      mode: "timestamp",
   }).notNull(),
   userId: text()
      .references(() => user.id, { onDelete: "cascade" })
      .notNull(),
   ownedProjects: text({
      mode: "json",
   })
      .$type<z.infer<typeof ownedProjectsSchema>>()
      .notNull()
      .default([]),
})
