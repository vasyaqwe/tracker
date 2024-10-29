import { projectBySlugQuery } from "@/project/queries"
import { userMeQuery } from "@/user/queries"
import { useSuspenseQuery } from "@tanstack/react-query"
import { getRouteApi } from "@tanstack/react-router"

const LayoutRoute = getRouteApi("/$slug/_layout")

export function useAuth() {
   const params = LayoutRoute.useParams()
   const session = useSuspenseQuery(userMeQuery())
   const project = useSuspenseQuery(projectBySlugQuery({ slug: params.slug }))

   if (!project.data || !session?.data?.session || !session.data.user)
      throw new Error("Project not found")

   return {
      user: session.data.user,
      project: project.data,
      projectId: project?.data.id,
   }
}
