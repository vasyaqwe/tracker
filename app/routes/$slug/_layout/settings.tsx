import { Main } from "@/routes/$slug/-components/main"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/$slug/_layout/settings")({
   component: Component,
   loader: async () => {},
   meta: () => [{ title: "Settings" }],
   // pendingComponent: PendingComponent,
})

function Component() {
   // const { slug } = useParams({ from: "/$slug/_layout" })

   return (
      <Main>
         <main>
            <p>Coming soon</p>
         </main>
      </Main>
   )
}
