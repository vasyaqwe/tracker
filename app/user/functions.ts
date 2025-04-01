import { authMiddleware } from "@/auth/middleware"
import { updateUserParams, user } from "@/user/schema"
import { createServerFn } from "@tanstack/start"
import { zodValidator } from "@tanstack/zod-adapter"
import { eq } from "drizzle-orm"

export const userMe = createServerFn({ method: "GET" })
   .middleware([authMiddleware])
   .handler(async ({ context }) => {
      return context.user
   })

export const updateUser = createServerFn({ method: "POST" })
   .middleware([authMiddleware])
   .validator(zodValidator(updateUserParams))
   .handler(async ({ context, data }) => {
      await context.db
         .update(user)
         .set(data)
         .where(eq(user.id, context.user.id))
   })
