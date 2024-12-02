import { database } from "@/db"
import { ServerFnError } from "@/error"
import { auth } from "@/user/auth"
import { createMiddleware } from "@tanstack/start"

export const baseMiddleware = createMiddleware().server(async ({ next }) => {
   return next({
      context: {
         db: database(),
         auth: await auth(),
      },
   })
})

export const authMiddleware = createMiddleware()
   .middleware([baseMiddleware])
   .server(({ next, context }) => {
      if (!context?.auth.session || !context.auth.user) {
         throw new ServerFnError({ code: "UNAUTHORIZED" })
      }
      return next({
         context: {
            session: context.auth.session,
            user: context.auth.user,
         },
      })
   })

export const projectOwnerMiddleware = createMiddleware()
   .middleware([baseMiddleware])
   .server(({ next, context, data: _data }) => {
      const data = _data as unknown as Record<string, unknown>

      if (!("projectId" in data))
         throw new ServerFnError({ code: "BAD_REQUEST" })

      if (!context?.auth.session || !context.auth.user) {
         throw new ServerFnError({ code: "UNAUTHORIZED" })
      }

      const ownsProject = context.auth.session?.ownedProjects.some(
         (project) => project.id === data.projectId,
      )

      if (!ownsProject) throw new ServerFnError({ code: "FORBIDDEN" })

      return next({
         context: {
            session: context.auth.session,
            user: context.auth.user,
         },
      })
   })
