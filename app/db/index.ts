import { drizzle } from "drizzle-orm/libsql"
import { getEvent } from "vinxi/http"
import * as schema from "./schema"

export const database = () => {
   const env = getEvent().context.cloudflare.env

   return drizzle({
      connection: import.meta.env.DEV
         ? { url: "file:db.sqlite" }
         : {
              url: env.DATABASE_URL,
              authToken: env.DATABASE_AUTH_TOKEN,
           },
      casing: "snake_case",
      schema,
   })
}

export type Database = ReturnType<typeof database>
