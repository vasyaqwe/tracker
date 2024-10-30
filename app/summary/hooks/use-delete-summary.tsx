import * as summary from "@/summary/functions"
import { summaryListQuery } from "@/summary/queries"
import { useAuth } from "@/user/hooks"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useServerFn } from "@tanstack/start"
import { toast } from "sonner"

export function useDeleteSummary() {
   const queryClient = useQueryClient()
   const { projectId } = useAuth()

   const deleteSummaryFromQueryData = ({
      summaryId,
   }: { summaryId: string }) => {
      queryClient.setQueryData(
         summaryListQuery({ projectId }).queryKey,
         (oldData) => oldData?.filter((summary) => summary.id !== summaryId),
      )
   }

   const deleteFn = useServerFn(summary.deleteFn)
   const deleteSummary = useMutation({
      mutationFn: deleteFn,
      onMutate: async ({ id: summaryId }) => {
         await queryClient.cancelQueries(summaryListQuery({ projectId }))

         const data = queryClient.getQueryData(
            summaryListQuery({ projectId }).queryKey,
         )

         deleteSummaryFromQueryData({ summaryId })

         return { data }
      },
      onError: (_err, _data, context) => {
         queryClient.setQueryData(
            summaryListQuery({ projectId }).queryKey,
            context?.data,
         )
         toast.error("Failed to delete summary")
      },
      onSettled: (_, _error, _data) => {
         queryClient.invalidateQueries(summaryListQuery({ projectId }))
      },
   })

   return {
      deleteSummary,
      deleteSummaryFromQueryData,
   }
}
