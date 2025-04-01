import { useAuth } from "@/auth/hooks"
import type { summaryList } from "@/summary/functions"
import { summaryListQuery } from "@/summary/queries"
import { useQueryClient } from "@tanstack/react-query"
import { match } from "ts-pattern"

export function useInsertSummary() {
   const queryClient = useQueryClient()
   const { projectId } = useAuth()

   const insertSummaryToQueryData = ({
      input,
   }: {
      input: Awaited<ReturnType<typeof summaryList>>[number]
   }) => {
      queryClient.setQueryData(
         summaryListQuery({ projectId }).queryKey,
         (oldData) =>
            match(oldData)
               .with(undefined, (data) => data)
               .otherwise((data) => {
                  // check if there's a summary for today
                  const today = new Date()
                  const todaySummaryIndex = data.findIndex(
                     (summary) =>
                        new Date(summary.createdAt).setHours(0, 0, 0, 0) ===
                        today.setHours(0, 0, 0, 0),
                  )

                  if (todaySummaryIndex !== -1) {
                     const newData = [...data]
                     const oldSummary = newData[todaySummaryIndex]

                     if (!oldSummary) return data

                     newData[todaySummaryIndex] = {
                        ...oldSummary,
                        amountEarned: (
                           +oldSummary.amountEarned + +input.amountEarned
                        ).toString(),
                        durationMinutes:
                           oldSummary.durationMinutes + input.durationMinutes,
                     }
                     return newData
                  }
                  return [input, ...data]
               }),
      )
   }

   return {
      insertSummaryToQueryData,
   }
}
