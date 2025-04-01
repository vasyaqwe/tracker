import { databaseClient } from "@/database"
import { createMiddleware } from "@tanstack/start"

export const baseMiddleware = createMiddleware().server(async ({ next }) => {
   return next({
      context: {
         db: databaseClient(),
      },
   })
})
