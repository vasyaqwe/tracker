import { createFileRoute } from "@tanstack/react-router"
import { useMutation } from "convex/react"
import * as React from "react"
import { api } from "@/convex/_generated/api"
import { toastError } from "@/error"
import { fromMinor, toMinor } from "@/number"
import { useProject } from "@/project/hooks"
import { AlertDialog } from "@/ui/components/alert-dialog"
import { Button } from "@/ui/components/button"
import { Form } from "@/ui/components/form"
import { Field } from "@/ui/components/form/field"
import { NumberField } from "@/ui/components/number-field"
import { toastManager } from "@/ui/components/toast"

export const Route = createFileRoute("/_authed/$projectId/settings")({
   component: RouteComponent,
})

function RouteComponent() {
   const project = useProject()
   const update = useMutation(api.project.update)
   const remove = useMutation(api.project.remove)
   const [pending, setPending] = React.useState(false)

   return (
      <div>
         <div className="rounded-[15px] border bg-surface-1 p-4 pt-3">
            <Form
               className="flex max-w-75 flex-col gap-3"
               onFormSubmit={(values) => {
                  setPending(true)
                  update({
                     projectId: project._id,
                     name: values.name,
                     hourlyRate: toMinor(values.hourlyRate),
                  })
                     .then(() =>
                        toastManager.add({ type: "success", title: "Saved" }),
                     )
                     .catch(toastError)
                     .finally(() => setPending(false))
               }}
            >
               <Field.Root name="name">
                  <Field.Label>Name</Field.Label>
                  <Field.Control
                     required
                     autoComplete="off"
                     maxLength={32}
                     placeholder="Project name"
                     defaultValue={project.name}
                  />
                  <Field.Error />
               </Field.Root>
               <Field.Root name="hourlyRate">
                  <Field.Label>Hourly rate</Field.Label>
                  <NumberField
                     required
                     min={1}
                     max={1000}
                     currency="USD"
                     placeholder="$"
                     defaultValue={fromMinor(project.hourlyRate)}
                  />
                  <Field.Error />
               </Field.Root>
               <Button
                  type="submit"
                  className="w-fit"
                  disabled={pending}
               >
                  Save
               </Button>
            </Form>
         </div>
         <div className="mt-3 rounded-[15px] border bg-surface-1 p-4">
            <p>Delete project</p>
            <p className="mt-1 text-muted text-sm">
               This is permanent. Project will be fully deleted.
            </p>
            <AlertDialog.Root>
               <AlertDialog.Trigger
                  render={
                     <Button
                        variant="destructive"
                        className="mt-3 max-lg:w-full"
                     />
                  }
               >
                  Delete project
               </AlertDialog.Trigger>
               <AlertDialog.Popup>
                  <AlertDialog.Title>Delete this project?</AlertDialog.Title>
                  <AlertDialog.Description>
                     This action cannot be undone. Your project and all of its
                     data will be fully deleted.
                  </AlertDialog.Description>
                  <AlertDialog.Footer>
                     <AlertDialog.Cancel />
                     <AlertDialog.Action
                        onClick={() =>
                           remove({ projectId: project._id }).catch(toastError)
                        }
                     >
                        Delete forever
                     </AlertDialog.Action>
                  </AlertDialog.Footer>
               </AlertDialog.Popup>
            </AlertDialog.Root>
         </div>
      </div>
   )
}
