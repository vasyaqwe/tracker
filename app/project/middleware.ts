import { authMiddleware } from "@/auth/middleware"
import { ServerFnError } from "@/error"
import { createMiddleware } from "@tanstack/start"

export const projectOwnerMiddleware = createMiddleware()
   .middleware([authMiddleware])
   .server(({ next, context, data: _data }) => {
      const data = _data as unknown as Record<string, unknown>
      if (!("projectId" in data))
         throw new ServerFnError({ code: "BAD_REQUEST" })

      const ownsProject = context.session.ownedProjects.some(
         (project) => project.id === data.projectId,
      )

      if (!ownsProject) throw new ServerFnError({ code: "FORBIDDEN" })

      return next()
   })
