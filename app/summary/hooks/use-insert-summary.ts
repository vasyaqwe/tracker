import { useAuth } from "@/auth/hooks"
import { insertSummary, type summaryList } from "@/summary/functions"
import { summaryListQuery } from "@/summary/queries"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useServerFn } from "@tanstack/start"
import { toast } from "sonner"
import { match } from "ts-pattern"

export function useInsertSummary() {
   const queryClient = useQueryClient()
   const auth = useAuth()

   const mutateQueryData = ({
      input,
   }: {
      input: Awaited<ReturnType<typeof summaryList>>[number]
   }) => {
      queryClient.setQueryData(
         summaryListQuery({ projectId: auth.project.id }).queryKey,
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

   const insertFn = useServerFn(insertSummary)
   const mutation = useMutation({
      mutationFn: insertFn,
      onMutate: async (input) => {
         await queryClient.cancelQueries(
            summaryListQuery({ projectId: auth.project.id }),
         )

         const data = queryClient.getQueryData(
            summaryListQuery({ projectId: auth.project.id }).queryKey,
         )

         mutateQueryData({
            input: {
               ...input.data,
               id: crypto.randomUUID(),
               createdAt: Date.now(),
            },
         })

         return { data }
      },
      onError: (_err, _data, context) => {
         queryClient.setQueryData(
            summaryListQuery({ projectId: auth.project.id }).queryKey,
            context?.data,
         )
         toast.error("Failed to create summary")
      },
      onSettled: () => {
         queryClient.invalidateQueries(
            summaryListQuery({ projectId: auth.project.id }),
         )
      },
   })

   return {
      mutateQueryData,
      ...mutation,
   }
}
