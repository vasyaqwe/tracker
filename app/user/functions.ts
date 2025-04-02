import { authMiddleware } from "@/auth/middleware"
import { user } from "@/user/schema"
import { createServerFn } from "@tanstack/start"
import { zodValidator } from "@tanstack/zod-adapter"
import { eq } from "drizzle-orm"
import { createSelectSchema } from "drizzle-zod"
import { z } from "zod"

export const userMe = createServerFn({ method: "GET" })
   .middleware([authMiddleware])
   .handler(async ({ context }) => {
      return context.user
   })

export const updateUser = createServerFn({ method: "POST" })
   .middleware([authMiddleware])
   .validator(
      zodValidator(
         createSelectSchema(user, {
            name: z.string().min(1).max(32),
         }).partial(),
      ),
   )
   .handler(async ({ context, data }) => {
      await context.db
         .update(user)
         .set(data)
         .where(eq(user.id, context.user.id))
   })
