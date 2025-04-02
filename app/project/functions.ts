import { authMiddleware } from "@/auth/middleware"
import { session } from "@/auth/schema"
import { ServerFnError } from "@/error"
import { RESERVED_SLUGS } from "@/project/constants"
import { project } from "@/project/schema"
import { createServerFn } from "@tanstack/start"
import { zodValidator } from "@tanstack/zod-adapter"
import { and, eq } from "drizzle-orm"
import { createInsertSchema, createSelectSchema } from "drizzle-zod"
import { z } from "zod"

export const projectList = createServerFn({ method: "GET" })
   .middleware([authMiddleware])
   .handler(async ({ context }) => {
      return await context.db.query.project.findMany({
         where: {
            ownerId: context.user.id,
         },
         columns: {
            id: true,
            slug: true,
            name: true,
         },
         orderBy: { createdAt: "desc" },
      })
   })

export const projectOne = createServerFn({ method: "GET" })
   .middleware([authMiddleware])
   .validator(zodValidator(z.object({ slug: z.string() })))
   .handler(async ({ context, data }) => {
      const foundProject = await context.db.query.project.findFirst({
         where: {
            slug: data.slug,
            ownerId: context.user.id,
         },
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

export const insertProject = createServerFn({ method: "POST" })
   .middleware([authMiddleware])
   .validator(
      zodValidator(
         createInsertSchema(project, {
            name: z.string().min(1).max(32),
            rate: z.number().min(1).max(1000),
         }).omit({
            id: true,
            createdAt: true,
            updatedAt: true,
            ownerId: true,
         }),
      ),
   )
   .handler(async ({ context, data }) => {
      if (RESERVED_SLUGS.includes(data.name.trim().toLowerCase()))
         throw new ServerFnError({
            code: "CONFLICT",
            message: "Project name is not available",
         })

      const existingProject = await context.db.query.project.findFirst({
         where: {
            slug: data.slug,
            ownerId: context.user.id,
         },
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

export const updateProject = createServerFn({ method: "POST" })
   .middleware([authMiddleware])
   .validator(
      zodValidator(
         createSelectSchema(project, {
            name: z.string().min(1).max(32),
            rate: z.number().min(1).max(1000),
         })
            .omit({
               slug: true,
            })
            .partial()
            .extend({
               id: z.string(),
            }),
      ),
   )
   .handler(async ({ context, data }) => {
      await context.db
         .update(project)
         .set(data)
         .where(
            and(eq(project.id, data.id), eq(project.ownerId, context.user.id)),
         )
   })

export const deleteProject = createServerFn({ method: "POST" })
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
