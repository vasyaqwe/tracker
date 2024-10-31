import "@/styles/app.css"
import appCss from "@/styles/app.css?url"
import { Toaster } from "@/ui/components/toast"
import { cn } from "@/ui/utils"
import type { QueryClient } from "@tanstack/react-query"
import {
   Outlet,
   ScrollRestoration,
   createRootRouteWithContext,
} from "@tanstack/react-router"
import { Body, Head, Html, Meta, Scripts } from "@tanstack/start"
import { lazy } from "react"

const _TanStackRouterDevtools = import.meta.env.PROD
   ? () => null
   : lazy(() =>
        import("@tanstack/router-devtools").then((res) => ({
           default: res.TanStackRouterDevtools,
           // For Embedded Mode
           // default: res.TanStackRouterDevtoolsPanel
        })),
     )

export const Route = createRootRouteWithContext<{
   queryClient: QueryClient
}>()({
   meta: () => {
      const title = "Tracker"
      const description = "A tiny time tracker."

      return [
         {
            charSet: "utf-8",
         },
         {
            name: "viewport",
            content:
               "viewport-fit=cover, width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0",
         },
         { name: "theme-color", content: "#fff" },
         { title },
         {
            name: "description",
            content: description,
         },
         { name: "twitter:title", content: title },
         { name: "twitter:description", content: description },
         { name: "twitter:creator", content: "@vasyaqwee" },
         { name: "twitter:site", content: "@vasyaqwee" },
         { name: "og:type", content: "website" },
         { name: "og:title", content: title },
         { name: "og:description", content: description },
         // { name: "og:image", content: "https://trackerhq.vercel.app/og.png" },
         { name: "twitter:card", content: "summary_large_image" },
         { name: "twitter:creator", content: "@vasyaqwee" },
         { name: "twitter:site", content: "@vasyaqwee" },
      ]
   },
   links: () => [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico" },
      // { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
      // { rel: "manifest", href: "/site.webmanifest" },
      {
         rel: "preload",
         href: "/font/geist.woff2",
         as: "font",
         type: "font/woff2",
         crossOrigin: "anonymous",
      },
      {
         rel: "preload",
         href: "/font/geist_mono.woff2",
         as: "font",
         type: "font/woff2",
         crossOrigin: "anonymous",
      },
   ],
   component: RootComponent,
})

function RootComponent() {
   return (
      <RootDocument>
         <Outlet />
      </RootDocument>
   )
}

function RootDocument({ children }: { children: React.ReactNode }) {
   return (
      <Html>
         <Head>
            <Meta />
         </Head>
         <Body suppressHydrationWarning>
            <div
               className={cn(
                  "bg-background text-foreground antialiased selection:bg-primary selection:text-background",
               )}
            >
               {children}
               <Toaster />
            </div>
            <ScrollRestoration />
            {/* <ReactQueryDevtools buttonPosition="bottom-left" /> */}
            {/* <TanStackRouterDevtools position="bottom-right" /> */}
            <Scripts />
         </Body>
      </Html>
   )
}
