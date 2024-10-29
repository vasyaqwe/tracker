import { projectListQuery } from "@/project/queries"
import { createFileRoute, redirect } from "@tanstack/react-router"
import { P, match } from "ts-pattern"

export const Route = createFileRoute("/")({
   component: Component,
   beforeLoad: async ({ context }) => {
      const projects = await context.queryClient.ensureQueryData(
         projectListQuery(),
      )

      match(projects?.[0]?.slug).with(P.not(undefined), (slug) => {
         throw redirect({ to: "/$slug", params: { slug } })
      })
   },
})

function Component() {
   return null
}
