import { createTable, lifecycleDates, tableId } from "@/db/utils"
import { type InferSelectModel, relations } from "drizzle-orm"
import {
   index,
   integer,
   primaryKey,
   text,
   uniqueIndex,
} from "drizzle-orm/sqlite-core"
import { createSelectSchema } from "drizzle-zod"
import { z } from "zod"

export const user = createTable(
   "user",
   {
      id: tableId("user"),
      email: text().notNull().unique(),
      name: text().notNull().default("No name"),
      avatarUrl: text(),
      ...lifecycleDates,
   },
   (table) => {
      return {
         userEmailIdx: uniqueIndex("user_email_idx").on(table.email),
      }
   },
)

export const oauthProviders = ["github", "google"] as const

export const oauthAccount = createTable(
   "oauth_account",
   {
      userId: text()
         .references(() => user.id, { onDelete: "cascade" })
         .notNull(),
      providerId: text({
         enum: oauthProviders,
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

export const userRelations = relations(user, ({ many }) => ({
   oauthAccount: many(oauthAccount),
}))

export const oauthAccountRelations = relations(oauthAccount, ({ one }) => ({
   user: one(user, {
      fields: [oauthAccount.userId],
      references: [user.id],
   }),
}))

export const emailVerificationCode = createTable(
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

export const session = createTable("session", {
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

export const updateUserParams = createSelectSchema(user, {
   name: z.string().min(1).max(32),
}).partial()

export type User = InferSelectModel<typeof user>
export type Session = InferSelectModel<typeof session>
export type OauthProvider = (typeof oauthProviders)[number]
