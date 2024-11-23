import type { Config } from "@libsql/client"
import { drizzle } from "drizzle-orm/libsql"
import { getEvent } from "vinxi/http"
import * as schema from "./schema"

export const database = () => {
   const env = getEvent().context.cloudflare.env

   const options = {
      local: { url: "file:db.sqlite" },
      remote: {
         url: env.DATABASE_URL,
         authToken: env.DATABASE_AUTH_TOKEN,
      },
   } satisfies Record<typeof env.DATABASE_CONNECTION_TYPE, Config>

   return drizzle({
      connection: options[env.DATABASE_CONNECTION_TYPE],
      casing: "snake_case",
      schema,
   })
}

export type Database = ReturnType<typeof database>
