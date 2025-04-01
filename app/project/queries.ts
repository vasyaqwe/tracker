import { projectList, projectOne } from "@/project/functions"
import { queryOptions } from "@tanstack/react-query"

export const projectOneQuery = ({ slug }: { slug: string }) =>
   queryOptions({
      queryKey: ["projectOne", slug],
      queryFn: () => projectOne({ data: { slug } }),
      staleTime: Infinity,
   })

export const projectListQuery = () =>
   queryOptions({
      queryKey: ["projectList"],
      queryFn: () => projectList(),
   })
