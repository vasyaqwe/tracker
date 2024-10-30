import { protectedProcedure } from "@/lib/trpc"
import { RESERVED_SLUGS } from "@/project/constants"
import { insertProjectParams, project } from "@/project/schema"
import { createServerFn } from "@tanstack/start"
import { TRPCError } from "@trpc/server"
import { and, eq } from "drizzle-orm"
import { z } from "zod"

export const list = createServerFn(
   "GET",
   protectedProcedure.query(async ({ ctx }) => {
      return await ctx.db.query.project.findMany({
         where: eq(project.ownerId, ctx.user.id),
         columns: {
            id: true,
            slug: true,
            name: true,
         },
      })
   }),
)

export const bySlug = createServerFn(
   "GET",
   protectedProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ ctx, input }) => {
         const foundProject = await ctx.db.query.project.findFirst({
            where: and(
               eq(project.slug, input.slug),
               eq(project.ownerId, ctx.user.id),
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
      }),
)

export const insert = createServerFn(
   "POST",
   protectedProcedure
      .input(insertProjectParams)
      .mutation(async ({ ctx, input }) => {
         if (RESERVED_SLUGS.includes(input.name.trim().toLowerCase()))
            throw new TRPCError({ code: "CONFLICT" })

         const existingProject = await ctx.db.query.project.findFirst({
            where: and(
               eq(project.slug, input.slug),
               eq(project.ownerId, ctx.user.id),
            ),
         })

         if (existingProject) throw new TRPCError({ code: "CONFLICT" })

         const createdProject = await ctx.db.transaction(async (tx) => {
            const createdProject = await tx
               .insert(project)
               .values({
                  name: input.name,
                  slug: input.slug,
                  rate: input.rate,
                  ownerId: ctx.user.id,
               })
               .returning({
                  id: project.id,
               })
               .get()

            if (!createdProject) throw new Error("Error")
            return createdProject
         })

         return createdProject.id
      }),
)

export const deleteFn = createServerFn(
   "POST",
   protectedProcedure
      .input(z.object({ slug: z.string() }))
      .mutation(async ({ ctx, input }) => {
         return await ctx.db.transaction(async (tx) => {
            await tx
               .delete(project)
               .where(
                  and(
                     eq(project.id, input.slug),
                     eq(project.ownerId, ctx.user.id),
                  ),
               )
         })
      }),
)
