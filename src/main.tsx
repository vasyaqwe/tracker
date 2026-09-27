import "@/ui/styles.css"
import { ConvexBetterAuthProvider } from "@convex-dev/better-auth/react"
import { createRouter, RouterProvider } from "@tanstack/react-router"
import { ConvexReactClient } from "convex/react"
import { ConvexQueryCacheProvider } from "convex-helpers/react/cache"
import * as React from "react"
import ReactDOM from "react-dom/client"
import { authClient } from "@/auth/client"
import { ToastProvider } from "@/ui/components/toast"
import { routeTree } from "./routeTree.gen"

const router = createRouter({
   routeTree,
   scrollRestoration: true,
   defaultPreload: "render",
   defaultPreloadStaleTime: 0,
   defaultPreloadGcTime: 0,
})

declare module "@tanstack/react-router" {
   interface Register {
      router: typeof router
   }
}

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL, {
   expectAuth: true,
})

ReactDOM.createRoot(document.getElementById("app")!).render(
   <React.StrictMode>
      <ConvexBetterAuthProvider
         client={convex}
         authClient={authClient}
      >
         <ConvexQueryCacheProvider
            expiration={300_000}
            maxIdleEntries={30}
         >
            <ToastProvider>
               <RouterProvider router={router} />
            </ToastProvider>
         </ConvexQueryCacheProvider>
      </ConvexBetterAuthProvider>
   </React.StrictMode>,
)
