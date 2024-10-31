import { CreateProject } from "@/project/components/create-project"
import { projectListQuery } from "@/project/queries"
import { buttonVariants } from "@/ui/components/button"
import { Icons } from "@/ui/components/icons"
import { cn } from "@/ui/utils"
import { useSuspenseQuery } from "@tanstack/react-query"
import { Link, createFileRoute, redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/new")({
   component: Component,
   beforeLoad: async ({ context }) => {
      await context.queryClient
         .ensureQueryData(projectListQuery())
         .catch(() => {
            throw redirect({
               to: "/login",
            })
         })
   },
})

function Component() {
   const projects = useSuspenseQuery(projectListQuery())
   const hasProject = projects.data?.length > 0

   return (
      <>
         {hasProject && (
            <Link
               to="/"
               aria-label="Go back"
               className={cn(
                  buttonVariants({ intent: "ghost", size: "icon" }),
                  "absolute top-4 left-4 hover:bg-border/50",
               )}
               onClick={(e) => {
                  e.preventDefault()
                  window.history.back()
               }}
            >
               <Icons.arrowLeft />
            </Link>
         )}
         <CreateProject isFirstProject={!hasProject} />
      </>
   )
}
