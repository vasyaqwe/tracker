import { createFileRoute, Navigate, Outlet } from "@tanstack/react-router"
import { Authenticated, Unauthenticated } from "convex/react"
import { useQuery } from "convex-helpers/react/cache"
import * as React from "react"
import { hasOneTimeToken } from "@/auth/client"
import { UserContext } from "@/auth/hooks"
import { api } from "@/convex/_generated/api"
import { PageSpinner } from "@/ui/components/spinner"

export const Route = createFileRoute("/_authed")({
   component: RouteComponent,
})

function RouteComponent() {
   const [isVerifying, setIsVerifying] = React.useState(hasOneTimeToken)

   React.useEffect(() => {
      const timeout = setTimeout(() => setIsVerifying(false), 10_000)
      return () => clearTimeout(timeout)
   }, [])

   return (
      <>
         <Authenticated>
            <AuthedOutlet />
         </Authenticated>
         <Unauthenticated>
            {isVerifying ? null : <Navigate to="/login" />}
         </Unauthenticated>
      </>
   )
}

function AuthedOutlet() {
   const user = useQuery(api.user.me)

   if (user === undefined) return <PageSpinner />
   if (user === null)
      return (
         <Navigate
            to="/login"
            replace
         />
      )

   return (
      <UserContext value={user}>
         <Outlet />
      </UserContext>
   )
}
