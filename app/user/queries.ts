import { userMe } from "@/user/functions"
import { queryOptions } from "@tanstack/react-query"

export const userMeQuery = () =>
   queryOptions({
      queryKey: ["userMe"],
      queryFn: () => userMe(),
      staleTime: Infinity,
      retry: false,
   })
