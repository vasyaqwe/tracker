import { projectBySlugQuery, projectListQuery } from "@/project/queries"
import { Stopwatch } from "@/routes/$slug/-components/stopwatch"
import { Logo } from "@/ui/components/logo"
import { MOBILE_BREAKPOINT } from "@/ui/constants"
import { isMobileAtom } from "@/ui/store"
import { userMeQuery } from "@/user/queries"
import {
   Outlet,
   createFileRoute,
   notFound,
   redirect,
} from "@tanstack/react-router"
import { createServerFn } from "@tanstack/start"
import { useSetAtom } from "jotai"
import * as React from "react"
import { getRequestHeader } from "vinxi/http"
import { Navigation } from "./-components/navigation"

export const getDevice = createServerFn({ method: "GET" }).handler(() => {
   const userAgent = getRequestHeader("user-agent") ?? ""
   return /mobile/i.test(userAgent) ? "mobile" : "desktop"
})

export const Route = createFileRoute("/$slug/_layout")({
   component: Component,
   beforeLoad: async ({ context, params }) => {
      const [user, project, device] = await Promise.all([
         context.queryClient.ensureQueryData(userMeQuery()).catch(() => {
            throw redirect({ to: "/login" })
         }),
         context.queryClient
            .ensureQueryData(projectBySlugQuery({ slug: params.slug }))
            .catch(() => {
               throw redirect({ to: "/login" })
            }),
         getDevice(),
      ])
      if (!user) throw redirect({ to: "/login" })
      if (!project) throw notFound()

      return {
         projectId: project.id,
         device,
      }
   },
   loader: ({ context }) => {
      context.queryClient.prefetchQuery(projectListQuery())
   },
   pendingComponent: () => (
      <main className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 w-full">
         <Logo className="mx-auto size-9 animate-fade-in opacity-0 [--animation-delay:100ms]" />
         <h1 className="mt-4 animate-fade-in text-center text-foreground/75 opacity-0 duration-500 [--animation-delay:600ms]">
            Workspace is loading...
         </h1>
      </main>
   ),
})

function Component() {
   const setIsMobile = useSetAtom(isMobileAtom)

   React.useEffect(() => {
      if (typeof window === "undefined") return

      const checkDevice = (event: MediaQueryList | MediaQueryListEvent) => {
         setIsMobile(event.matches)
      }

      const mediaQueryList = window.matchMedia(
         `(max-width: ${MOBILE_BREAKPOINT}px)`,
      )
      checkDevice(mediaQueryList)

      mediaQueryList.addEventListener("change", checkDevice)

      return () => {
         mediaQueryList.removeEventListener("change", checkDevice)
      }
   }, [])

   return (
      <div className="mx-auto max-w-4xl items-start gap-9 px-4 pt-4 [--sidebar-height:340px] md:flex md:pt-32 max-md:pb-8">
         <Navigation />
         <main
            className={
               "relative flex min-h-[var(--sidebar-height)] flex-1 flex-col md:pb-20"
            }
         >
            <Outlet />
         </main>
         <Stopwatch />
      </div>
   )
}
