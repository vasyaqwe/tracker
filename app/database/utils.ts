import { type ID_PREFIXES, createId } from "@/id"
import baseX from "base-x"
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core"
export const b58 = baseX(
   "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz",
)

export const tableId = (prefix: keyof typeof ID_PREFIXES) =>
   text("id")
      .primaryKey()
      .$defaultFn(() => createId(prefix))

export const table = sqliteTable

export const timestamps = {
   createdAt: integer()
      .$defaultFn(() => Date.now())
      .notNull(),
   updatedAt: integer()
      .notNull()
      .$defaultFn(() => Date.now())
      .$onUpdateFn(() => Date.now()),
}
