import * as projectFns from "@/project/functions"
import { projectBySlugQuery, projectListQuery } from "@/project/queries"
import { Main } from "@/routes/$slug/-components/main"
import { useTimerStore } from "@/timer/store"
import { Button, buttonVariants } from "@/ui/components/button"
import { Card } from "@/ui/components/card"
import { Loading } from "@/ui/components/loading"
import { Modal } from "@/ui/components/modal"
import { NumberField } from "@/ui/components/number-field"
import { TextField } from "@/ui/components/text-field"
import { useUIStore } from "@/ui/store"
import { cn } from "@/ui/utils"
import { useAuth } from "@/user/hooks"
import {
   useMutation,
   useQueryClient,
   useSuspenseQuery,
} from "@tanstack/react-query"
import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router"
import { useServerFn } from "@tanstack/start"
import { useState } from "react"
import { toast } from "sonner"
import { match } from "ts-pattern"

export const Route = createFileRoute("/$slug/_layout/settings")({
   component: Component,
   meta: () => [{ title: "Settings" }],
})

function Component() {
   const queryClient = useQueryClient()
   const { slug } = useParams({ from: "/$slug/_layout" })
   const { user, project } = useAuth()
   const isMobile = useUIStore().isMobile
   const navigate = useNavigate()

   const updateFn = useServerFn(projectFns.update)
   const updateProject = useMutation({
      mutationFn: updateFn,
      onSettled: () => {
         queryClient.invalidateQueries(projectListQuery())
         queryClient.invalidateQueries(projectBySlugQuery({ slug }))
      },
      onSuccess: () => {
         toast.success("Saved")
      },
   })

   const projects = useSuspenseQuery(projectListQuery())
   const [confirmDeletion, setConfirmDeletion] = useState("")
   const deleteFn = useServerFn(projectFns.deleteFn)
   const deleteProject = useMutation({
      mutationFn: deleteFn,
      onSuccess: () => {
         queryClient.invalidateQueries(projectListQuery())
         toast.success("Project deleted")
         const existingProjects = projects.data?.filter(
            (m) => m.id !== project.id,
         )

         match(existingProjects?.[0]?.slug)
            .with(undefined, () =>
               navigate({
                  to: "/new",
               }),
            )
            .otherwise((slug) =>
               navigate({
                  to: "/$slug",
                  params: { slug },
               }),
            )
      },
   })

   const isRunning = useTimerStore().isRunning

   return (
      <Main>
         <main>
            <Card className="p-4 pt-3">
               <form
                  onSubmit={(e) => {
                     e.preventDefault()

                     const formData = Object.fromEntries(
                        new FormData(e.target as HTMLFormElement).entries(),
                     ) as {
                        name: string
                        rate: string
                     }

                     if (formData.name === user.name)
                        return toast.success("Saved")

                     updateProject.mutate({
                        id: project.id,
                        name: formData.name,
                        rate: +formData.rate,
                     })
                  }}
               >
                  <TextField
                     className="mb-3 max-w-[300px]"
                     label="Name"
                     defaultValue={project.name}
                     name="name"
                     id="name"
                     placeholder="Project name"
                     maxLength={32}
                     isRequired
                  />
                  <NumberField
                     className="max-w-[300px]"
                     label="Hourly rate"
                     isDisabled={isRunning}
                     minValue={1}
                     maxValue={1000}
                     name="rate"
                     id="rate"
                     placeholder="$"
                     isRequired
                     defaultValue={project.rate}
                  />
                  <Button
                     type="submit"
                     isDisabled={updateProject.isPending}
                     className="mt-3"
                  >
                     Save
                  </Button>
               </form>
            </Card>
            <Card className="mt-3 p-4">
               <div>
                  <p>Delete project</p>
                  <p className="mt-1 text-foreground/75 text-sm">
                     This is permanent. Project will be fully deleted.
                  </p>
               </div>
               <Modal>
                  <Modal.Trigger
                     className={cn(
                        buttonVariants({
                           intent: "destructive",
                        }),
                        "mt-3 max-lg:w-full",
                     )}
                  >
                     Delete project
                  </Modal.Trigger>
                  <Modal.Content role="alertdialog">
                     <Modal.Header>
                        <Modal.Title>Delete this project?</Modal.Title>
                        <Modal.Description>
                           This action cannot be undone. Your project and all of
                           its data will be fully deleted.
                        </Modal.Description>
                     </Modal.Header>
                     <div>
                        <form
                           onSubmit={(e) => {
                              e.preventDefault()
                              deleteProject.mutate({
                                 id: project.id,
                              })
                           }}
                           id={"delete_project"}
                        >
                           <TextField
                              label="To confirm, enter project name below"
                              autoComplete="off"
                              autoFocus={!isMobile}
                              id="confirmation"
                              name="confirmation"
                              placeholder={project.name}
                              value={confirmDeletion}
                              onChange={(value) => setConfirmDeletion(value)}
                           />
                        </form>
                     </div>
                     <Modal.Footer>
                        <Modal.Close
                           className={cn(
                              buttonVariants({ intent: "outline" }),
                              "ml-auto",
                           )}
                        >
                           Cancel
                        </Modal.Close>
                        <Button
                           form={"delete_project"}
                           type="submit"
                           isDisabled={
                              confirmDeletion.trim() !== project.name ||
                              deleteProject.isPending ||
                              deleteProject.isSuccess
                           }
                           intent={"destructive"}
                        >
                           {deleteProject.isPending ||
                           deleteProject.isSuccess ? (
                              <>
                                 <Loading />
                                 Deleting..
                              </>
                           ) : (
                              "Delete forever"
                           )}
                        </Button>
                     </Modal.Footer>
                  </Modal.Content>
               </Modal>
            </Card>
         </main>
      </Main>
   )
}
