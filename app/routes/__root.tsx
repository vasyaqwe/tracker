import "@/ui/styles.css"
import ogImage from "@/assets/og.png"
import { publicEnv } from "@/env"
import { Toaster } from "@/ui/components/toast"
import toastStyles from "@/ui/components/toast/styles.css?url"
import styles from "@/ui/styles.css?url"
import { cn } from "@/ui/utils"
import type { QueryClient } from "@tanstack/react-query"
import {
   Outlet,
   ScrollRestoration,
   createRootRouteWithContext,
} from "@tanstack/react-router"
import { Meta, Scripts } from "@tanstack/start"
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
   head: () => {
      const title = "Tracker"
      const description = "A tiny time tracker."

      return {
         meta: [
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
            {
               name: "og:image",
               content: `${publicEnv.VITE_BASE_URL}${ogImage}`,
            },
            { name: "twitter:card", content: "summary_large_image" },
            { name: "twitter:creator", content: "@vasyaqwee" },
            { name: "twitter:site", content: "@vasyaqwee" },
         ],
         links: [
            { rel: "stylesheet", href: styles },
            { rel: "stylesheet", href: toastStyles },
            { rel: "icon", href: "/favicon.ico" },
            // { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
            // { rel: "manifest", href: "/site.webmanifest" },
            {
               rel: "preload",
               href: "/font/satoshi.woff2",
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
      }
   },
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
      <html lang="en">
         <head>
            <Meta />
         </head>
         <body>
            <div
               className={cn(
                  "bg-background font-medium text-base text-foreground antialiased selection:bg-primary selection:text-background",
               )}
            >
               {children}
            </div>
            {/* <ReactQueryDevtools buttonPosition="bottom-left" /> */}
            {/* <TanStackRouterDevtools position="bottom-right" /> */}
            <ScrollRestoration />
            <Scripts />
            <Toaster />
         </body>
      </html>
   )
}
