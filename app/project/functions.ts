import { ServerFnError } from "@/error"
import { RESERVED_SLUGS } from "@/project/constants"
import {
   insertProjectParams,
   project,
   updateProjectParams,
} from "@/project/schema"
import { authMiddleware } from "@/user/middleware"
import { session } from "@/user/schema"
import { createServerFn } from "@tanstack/start"
import { zodValidator } from "@tanstack/zod-adapter"
import { and, desc, eq } from "drizzle-orm"
import { z } from "zod"

export const list = createServerFn({ method: "GET" })
   .middleware([authMiddleware])
   .handler(async ({ context }) => {
      return await context.db.query.project.findMany({
         where: eq(project.ownerId, context.user.id),
         columns: {
            id: true,
            slug: true,
            name: true,
         },
         orderBy: (data) => desc(data.createdAt),
      })
   })

export const bySlug = createServerFn({ method: "GET" })
   .middleware([authMiddleware])
   .validator(zodValidator(z.object({ slug: z.string() })))
   .handler(async ({ context, data }) => {
      const foundProject = await context.db.query.project.findFirst({
         where: and(
            eq(project.slug, data.slug),
            eq(project.ownerId, context.user.id),
         ),
         columns: {
            id: true,
            slug: true,
            name: true,
            rate: true,
         },
      })

      if (!foundProject) return null

      return foundProject
   })

export const insert = createServerFn({ method: "POST" })
   .middleware([authMiddleware])
   .validator(zodValidator(insertProjectParams))
   .handler(async ({ context, data }) => {
      if (RESERVED_SLUGS.includes(data.name.trim().toLowerCase()))
         throw new ServerFnError({
            code: "CONFLICT",
            message: "Project name is not available",
         })

      const existingProject = await context.db.query.project.findFirst({
         where: and(
            eq(project.slug, data.slug),
            eq(project.ownerId, context.user.id),
         ),
      })

      if (existingProject)
         throw new ServerFnError({
            code: "CONFLICT",
            message: "Project name is not available",
         })

      const createdProject = await context.db.transaction(async (tx) => {
         const createdProject = await tx
            .insert(project)
            .values({
               name: data.name,
               slug: data.slug,
               rate: data.rate,
               ownerId: context.user.id,
            })
            .returning({
               id: project.id,
            })
            .get()

         if (!createdProject)
            throw new ServerFnError({ code: "INTERNAL_SERVER_ERROR" })

         await tx
            .update(session)
            .set({
               ownedProjects: [
                  ...context.session.ownedProjects,
                  {
                     id: createdProject.id,
                  },
               ],
            })
            .where(eq(session.userId, context.user.id))

         return createdProject
      })

      return createdProject.id
   })

export const update = createServerFn({ method: "POST" })
   .middleware([authMiddleware])
   .validator(zodValidator(updateProjectParams))
   .handler(async ({ context, data }) => {
      await context.db
         .update(project)
         .set(data)
         .where(
            and(eq(project.id, data.id), eq(project.ownerId, context.user.id)),
         )
   })

export const deleteFn = createServerFn({ method: "POST" })
   .middleware([authMiddleware])
   .validator(zodValidator(z.object({ id: z.string() })))
   .handler(async ({ context, data }) => {
      return await context.db.transaction(async (tx) => {
         await tx
            .delete(project)
            .where(
               and(
                  eq(project.id, data.id),
                  eq(project.ownerId, context.user.id),
               ),
            )

         await tx
            .update(session)
            .set({
               ownedProjects: context.session.ownedProjects.filter(
                  (project) => project.id !== data.id,
               ),
            })
            .where(eq(session.userId, context.user.id))
      })
   })
