import { queryOptions } from "@tanstack/react-query"
import * as summary from "./functions"

export const summaryListQuery = ({ projectId }: { projectId: string }) =>
   queryOptions({
      queryKey: ["summary_list", projectId],
      queryFn: () => summary.list({ projectId }),
   })
