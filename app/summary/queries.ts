import { summaryList } from "@/summary/functions"
import { queryOptions } from "@tanstack/react-query"

export const summaryListQuery = ({ projectId }: { projectId: string }) =>
   queryOptions({
      queryKey: ["summaryList", projectId],
      queryFn: () => summaryList({ data: { projectId } }),
   })
