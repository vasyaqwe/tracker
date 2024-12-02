import * as summary from "@/summary/functions"
import { summaryListQuery } from "@/summary/queries"
import { useAuth } from "@/user/hooks"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useServerFn } from "@tanstack/start"
import { toast } from "sonner"

export function useDeleteSummaries({
   onMutate,
   onError,
}: { onMutate?: () => void; onError?: () => void } = {}) {
   const queryClient = useQueryClient()
   const { projectId } = useAuth()

   const deleteSummariesFromQueryData = ({ ids }: { ids: string[] }) => {
      queryClient.setQueryData(
         summaryListQuery({ projectId }).queryKey,
         (oldData) => oldData?.filter((summary) => !ids.includes(summary.id)),
      )
   }

   const deleteFn = useServerFn(summary.deleteFn)
   const deleteSummaries = useMutation({
      mutationFn: deleteFn,
      onMutate: async ({ data: { ids } }) => {
         onMutate?.()

         await queryClient.cancelQueries(summaryListQuery({ projectId }))

         const data = queryClient.getQueryData(
            summaryListQuery({ projectId }).queryKey,
         )

         deleteSummariesFromQueryData({ ids })

         return { data }
      },
      onError: (_err, _data, context) => {
         onError?.()

         queryClient.setQueryData(
            summaryListQuery({ projectId }).queryKey,
            context?.data,
         )
         toast.error("Failed to delete summaries")
      },
      onSettled: (_, _error, _data) => {
         queryClient.invalidateQueries(summaryListQuery({ projectId }))
      },
   })

   return {
      deleteSummaries,
      deleteSummariesFromQueryData,
   }
}
