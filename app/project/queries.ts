import { queryOptions } from "@tanstack/react-query"
import * as project from "./functions"

export const projectBySlugQuery = ({ slug }: { slug: string }) =>
   queryOptions({
      queryKey: ["project_by_slug", slug],
      queryFn: () => project.bySlug({ data: { slug } }),
      staleTime: Infinity,
   })

export const projectListQuery = () =>
   queryOptions({
      queryKey: ["project_list"],
      queryFn: () => project.list(),
   })
