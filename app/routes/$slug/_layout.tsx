import { projectBySlugQuery, projectListQuery } from "@/project/queries"
import { Stopwatch } from "@/routes/$slug/-components/stopwatch"
import { Logo } from "@/ui/components/logo"
import { MOBILE_BREAKPOINT } from "@/ui/constants"
import { useUIStore } from "@/ui/store"
import { userMeQuery } from "@/user/queries"
import {
   Outlet,
   createFileRoute,
   notFound,
   redirect,
} from "@tanstack/react-router"
import { createServerFn } from "@tanstack/start"
import { useEffect } from "react"
import { getRequestHeader } from "vinxi/http"
import { Navigation } from "./-components/navigation"

export const getDevice = createServerFn("GET", () => {
   const userAgent = getRequestHeader("user-agent") ?? ""
   return /mobile/i.test(userAgent) ? "mobile" : "desktop"
})

export const Route = createFileRoute("/$slug/_layout")({
   component: Component,
   beforeLoad: async ({ context, params }) => {
      const session = await context.queryClient
         .ensureQueryData(userMeQuery())
         .catch(() => {
            throw redirect({ to: "/login" })
         })
      if (!session?.session || !session.user) throw redirect({ to: "/login" })

      const project = await context.queryClient.ensureQueryData(
         projectBySlugQuery({ slug: params.slug }),
      )
      if (!project) throw notFound()

      context.queryClient.prefetchQuery(projectListQuery())

      const device = await getDevice()

      return {
         projectId: project.id,
         device,
      }
   },
   pendingComponent: () => (
      <div className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 w-full">
         <Logo className="mx-auto size-9 animate-fade-in opacity-0 [--animation-delay:100ms]" />
         <h1 className="mt-4 animate-fade-in text-center text-foreground/75 opacity-0 duration-500 [--animation-delay:600ms]">
            Workspace is loading...
         </h1>
      </div>
   ),
})

function Component() {
   useEffect(() => {
      if (typeof window === "undefined") return

      const checkDevice = (event: MediaQueryList | MediaQueryListEvent) => {
         useUIStore.setState({ isMobile: event.matches })
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
      <div className="mx-auto max-w-4xl items-start gap-9 px-4 pt-4 [--sidebar-height:342px] md:flex md:pt-32 max-md:pb-8">
         <Navigation />
         <Outlet />
         <Stopwatch />
      </div>
   )
}
