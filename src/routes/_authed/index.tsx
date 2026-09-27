import { createFileRoute, Navigate } from "@tanstack/react-router"
import { useQuery } from "convex-helpers/react/cache"
import { api } from "@/convex/_generated/api"
import { PageSpinner } from "@/ui/components/spinner"

export const Route = createFileRoute("/_authed/")({
   component: RouteComponent,
})

function RouteComponent() {
   const projects = useQuery(api.project.list)

   if (projects === undefined) return <PageSpinner />

   const project = projects[0]
   if (!project)
      return (
         <Navigate
            to="/new"
            replace
         />
      )

   return (
      <Navigate
         to="/$projectId"
         params={{ projectId: project._id }}
         replace
      />
   )
}
