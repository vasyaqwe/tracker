import { ArrowLeft02Icon } from "@hugeicons/core-free-icons"
import { createFileRoute, useNavigate, useRouter } from "@tanstack/react-router"
import { useMutation } from "convex/react"
import { useQuery } from "convex-helpers/react/cache"
import * as React from "react"
import { api } from "@/convex/_generated/api"
import { toastError } from "@/error"
import { toMinor } from "@/number"
import { Button } from "@/ui/components/button"
import { Form } from "@/ui/components/form"
import { Field } from "@/ui/components/form/field"
import { Icon } from "@/ui/components/icon"
import { Logo } from "@/ui/components/logo"
import { NumberField } from "@/ui/components/number-field"

export const Route = createFileRoute("/_authed/new")({
   component: RouteComponent,
})

function RouteComponent() {
   const navigate = useNavigate()
   const router = useRouter()
   const projects = useQuery(api.project.list)
   const create = useMutation(api.project.create)
   const [pending, setPending] = React.useState(false)

   if (projects === undefined) return null
   const isFirstProject = projects.length === 0

   return (
      <main className="grid h-svh w-full place-items-center">
         {isFirstProject ? null : (
            <Button
               size="lg"
               variant="ghost"
               kind="icon"
               aria-label="Go back"
               className="absolute top-4 left-4"
               onClick={() => router.history.back()}
            >
               <Icon icon={ArrowLeft02Icon} />
            </Button>
         )}
         <div className="mx-auto -mt-8 w-full max-w-xs px-4">
            {isFirstProject ? (
               <div className="flex items-center gap-2.5">
                  <Logo className="size-9" />
                  <h1 className="font-medium text-2xl">Welcome to Tracker,</h1>
               </div>
            ) : (
               <Logo className="size-9" />
            )}
            <h2 className="my-4 font-medium text-foreground/90 text-xl">
               Create {isFirstProject ? "your first" : "a new"} project
            </h2>
            <Form
               className="flex w-full flex-col gap-3"
               onFormSubmit={(values) => {
                  setPending(true)
                  create({
                     name: values.name,
                     hourlyRate: toMinor(values.hourlyRate),
                  })
                     .then((projectId) =>
                        navigate({ to: "/$projectId", params: { projectId } }),
                     )
                     .catch((error) => {
                        setPending(false)
                        toastError(error)
                     })
               }}
            >
               <Field.Root name="name">
                  <Field.Label>Name</Field.Label>
                  <Field.Control
                     size="lg"
                     required
                     autoFocus
                     autoComplete="off"
                     maxLength={32}
                     placeholder="Enter a name"
                  />
                  <Field.Error />
               </Field.Root>
               <Field.Root name="hourlyRate">
                  <Field.Label>Hourly rate</Field.Label>
                  <NumberField
                     size="lg"
                     required
                     min={1}
                     max={1000}
                     currency="USD"
                     placeholder="$"
                  />
                  <Field.Error />
               </Field.Root>
               <Button
                  size="lg"
                  type="submit"
                  className="mt-2 w-full"
                  disabled={pending}
               >
                  Create
               </Button>
            </Form>
         </div>
      </main>
   )
}
