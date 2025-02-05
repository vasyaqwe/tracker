import { ServerFnError } from "@/error"
import { routeTree } from "@/routeTree.gen"
import { Button, buttonVariants } from "@/ui/components/button"
import { toast } from "@/ui/components/toast"
import { QueryClient } from "@tanstack/react-query"
import {
   ErrorComponent,
   type ErrorComponentProps,
   Link,
   createRouter as createTanStackRouter,
   rootRouteId,
   useMatch,
   useRouter,
} from "@tanstack/react-router"
import { routerWithQueryClient } from "@tanstack/react-router-with-query"
import superjson from "superjson"
import { z } from "zod"

export function createRouter() {
   const queryClient = new QueryClient({
      defaultOptions: {
         dehydrate: {
            serializeData: superjson.serialize,
         },
         hydrate: {
            deserializeData: superjson.deserialize,
         },
         queries: {
            retry(failureCount) {
               // 2 max
               return failureCount < 1
            },
            // 5 min
            staleTime: 300 * 1000,
         },
         mutations: {
            onError: (error) => {
               try {
                  const parsedError: unknown = JSON.parse(error.message)

                  const errorSchema = z.object({
                     body: ServerFnError.schema,
                  })
                  const result = errorSchema.safeParse(parsedError)

                  if (!result.success || !result.data.body.message) {
                     return toast.error("An unknown error occurred")
                  }

                  if (result.data.body.message)
                     return toast.error(result.data.body.message)
               } catch (_e) {
                  return toast.error("An unknown error occurred")
               }
            },
         },
      },
   })
   return routerWithQueryClient(
      createTanStackRouter({
         routeTree,
         context: { queryClient },
         defaultPreload: "intent",
         defaultPendingMs: 200,
         defaultPendingMinMs: 300,
         defaultPreloadStaleTime: 0,
         transformer: superjson,
         defaultErrorComponent: CatchBoundary,
         defaultNotFoundComponent: NotFound,
      }),
      queryClient,
   )
}

function NotFound() {
   return (
      <div className="flex w-full flex-col items-center justify-center pt-24 text-center md:pt-42">
         <h1 className="mb-1 font-semibold text-xl">Not found</h1>
         <p className="mb-5 text-lg leading-snug opacity-70">
            This page does not exist — <br /> it may have been moved or deleted.
         </p>
         <Link
            to={"/"}
            className={buttonVariants()}
         >
            Back home
         </Link>
      </div>
   )
}

function CatchBoundary({ error }: ErrorComponentProps) {
   const router = useRouter()
   const _isRoot = useMatch({
      strict: false,
      select: (state) => state.id === rootRouteId,
   })

   return (
      <div className="flex w-full flex-col justify-center pt-16 text-center md:pt-28">
         <h1 className="mb-2 font-semibold text-xl">
            Oh, no! Something went wrong.
         </h1>
         <p className="mb-5 text-lg leading-snug opacity-70">
            A technical error has occurred. <br /> Please try again, or reload
            the page.
         </p>
         <div className="flex items-center justify-center gap-2.5">
            <Button
               intent={"outline"}
               onPress={() => {
                  router.invalidate()
               }}
            >
               Try Again
            </Button>
         </div>
         {import.meta.env.DEV && (
            <div className="mt-12">
               <ErrorComponent error={error} />{" "}
            </div>
         )}
      </div>
   )
}

declare module "@tanstack/react-router" {
   interface Register {
      router: ReturnType<typeof createRouter>
   }
}
