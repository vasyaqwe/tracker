import type { FunctionReturnType } from "convex/server"
import * as React from "react"
import type { api } from "@/convex/_generated/api"
import invariant from "@/invariant"

export type AuthUser = NonNullable<FunctionReturnType<typeof api.user.me>>

export const UserContext = React.createContext<AuthUser | null>(null)

export function useAuth() {
   const user = React.useContext(UserContext)
   invariant(user, "useAuth must be used inside the /_authed layout")

   return { user }
}
