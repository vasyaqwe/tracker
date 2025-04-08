import { useAuth } from "@/auth/hooks"
import { deleteSummary } from "@/summary/functions"
import { summaryListQuery } from "@/summary/queries"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useServerFn } from "@tanstack/start"
import { toast } from "sonner"

export function useDeleteSummaries({
   onMutate,
   onError,
}: { onMutate?: () => void; onError?: () => void } = {}) {
   const queryClient = useQueryClient()
   const auth = useAuth()

   const mutateQueryData = ({ ids }: { ids: string[] }) => {
      queryClient.setQueryData(
         summaryListQuery({ projectId: auth.project.id }).queryKey,
         (oldData) => oldData?.filter((summary) => !ids.includes(summary.id)),
      )
   }

   const deleteFn = useServerFn(deleteSummary)
   const mutation = useMutation({
      mutationFn: deleteFn,
      onMutate: async ({ data: { ids } }) => {
         onMutate?.()

         await queryClient.cancelQueries(
            summaryListQuery({ projectId: auth.project.id }),
         )

         const data = queryClient.getQueryData(
            summaryListQuery({ projectId: auth.project.id }).queryKey,
         )

         mutateQueryData({ ids })

         return { data }
      },
      onError: (_err, _data, context) => {
         onError?.()

         queryClient.setQueryData(
            summaryListQuery({ projectId: auth.project.id }).queryKey,
            context?.data,
         )
         toast.error("Failed to delete summaries")
      },
      onSettled: (_, _error, _data) => {
         queryClient.invalidateQueries(
            summaryListQuery({ projectId: auth.project.id }),
         )
      },
   })

   return {
      ...mutation,
      mutateQueryData,
   }
}
