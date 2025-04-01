import { projectOneQuery } from "@/project/queries"
import { userMeQuery } from "@/user/queries"
import { useSuspenseQuery } from "@tanstack/react-query"
import { getRouteApi } from "@tanstack/react-router"

const LayoutRoute = getRouteApi("/$slug/_layout")

export function useAuth() {
   const params = LayoutRoute.useParams()
   const user = useSuspenseQuery(userMeQuery())
   const project = useSuspenseQuery(projectOneQuery({ slug: params.slug }))

   if (!project.data) throw new Error("Project not found")

   return {
      user: user.data,
      project: project.data,
      projectId: project?.data.id,
   }
}
