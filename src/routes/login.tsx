import { createFileRoute, Navigate } from "@tanstack/react-router"
import { Authenticated, Unauthenticated } from "convex/react"
import { SignInButton } from "@/auth/components/sign-in-button"
import { Logo } from "@/ui/components/logo"

export const Route = createFileRoute("/login")({
   component: RouteComponent,
})

function RouteComponent() {
   return (
      <main className="isolate grid h-svh w-full place-items-center px-4">
         <Authenticated>
            <Navigate
               to="/"
               replace
            />
         </Authenticated>
         <Unauthenticated>
            <div className="-mt-8 flex w-full max-w-65 flex-col">
               <Logo className="mx-auto mb-4 size-9" />
               <SignInButton className="mt-3 w-full">
                  Log in with Google
               </SignInButton>
            </div>
         </Unauthenticated>
      </main>
   )
}
