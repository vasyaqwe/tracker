import type * as summary from "@/summary/functions"
import { summaryListQuery } from "@/summary/queries"
import { useAuth } from "@/user/hooks"
import { useQueryClient } from "@tanstack/react-query"
import { match } from "ts-pattern"

export function useInsertSummary() {
   const queryClient = useQueryClient()
   const { projectId } = useAuth()

   const insertSummaryToQueryData = ({
      input,
   }: {
      input: Omit<Awaited<ReturnType<typeof summary.list>>[number], "id">
   }) => {
      queryClient.setQueryData(
         summaryListQuery({ projectId }).queryKey,
         (oldData) =>
            match(oldData)
               .with(undefined, (data) => data)
               .otherwise((data) => [
                  {
                     ...input,
                     id: crypto.randomUUID(),
                     createdAt: Date.now(),
                     updatedAt: Date.now(),
                  },
                  ...data,
               ]),
      )
   }

   return {
      insertSummaryToQueryData,
   }
}
