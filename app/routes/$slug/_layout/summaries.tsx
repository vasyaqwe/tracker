import { Main } from "@/routes/$slug/-components/main"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/$slug/_layout/summaries")({
   component: Component,
   loader: async () => {},
   meta: () => [{ title: "Summaries" }],
   // pendingComponent: PendingComponent,
})

function Component() {
   // const { slug } = useParams({ from: "/$slug/_layout" })

   return (
      <Main>
         <main className="overflow-y-auto p-4">{/*  */}</main>
      </Main>
   )
}
