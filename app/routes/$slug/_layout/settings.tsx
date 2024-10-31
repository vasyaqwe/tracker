import * as projectFns from "@/project/functions"
import { projectBySlugQuery, projectListQuery } from "@/project/queries"
import { Main } from "@/routes/$slug/-components/main"
import { Button, buttonVariants } from "@/ui/components/button"
import { Icons } from "@/ui/components/icons"
import { Input } from "@/ui/components/input"
import { Label } from "@/ui/components/label"
import { Loading } from "@/ui/components/loading"
import { Modal } from "@/ui/components/modal"
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

   return (
      <Main>
         <main>
            <div className="rounded-[15px] border border-border/40 bg-elevated p-4">
               <form
                  onSubmit={(e) => {
                     e.preventDefault()

                     const formData = Object.fromEntries(
                        new FormData(e.target as HTMLFormElement).entries(),
                     ) as {
                        name: string
                     }

                     if (!formData.name || formData.name.trim().length < 1)
                        return toast.error("Name is required")

                     if (formData.name === user.name)
                        return toast.success("Saved")

                     updateProject.mutate({
                        name: formData.name,
                        id: project.id,
                     })
                  }}
               >
                  <Label htmlFor="name">Name</Label>
                  <Input
                     defaultValue={project.name}
                     name="name"
                     id="name"
                     className="max-w-[300px]"
                     placeholder="Your name"
                     maxLength={32}
                     required
                  />
                  <Button
                     type="submit"
                     isDisabled={updateProject.isPending}
                     className="mt-3"
                  >
                     Save
                  </Button>
               </form>
            </div>

            <div className="mt-3 rounded-[15px] border border-border/40 bg-elevated p-4">
               <div className="flex items-center gap-3">
                  <div className="grid size-10 shrink-0 place-content-center rounded-full border border-destructive/10 bg-destructive/15">
                     <Icons.trash className="size-5 text-destructive" />
                  </div>
                  <div>
                     <p>Delete project</p>
                     <p className="text-foreground/75 text-sm">
                        This is permanent. Project will be fully deleted.
                     </p>
                  </div>
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
                  <Modal.Content
                     size={"md"}
                     role="alertdialog"
                  >
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
                           <Label htmlFor="confirmation">
                              To confirm, enter <strong>{project.name}</strong>{" "}
                              below
                           </Label>
                           <Input
                              autoComplete="off"
                              autoFocus={!isMobile}
                              id="confirmation"
                              name="confirmation"
                              placeholder={project.name}
                              value={confirmDeletion}
                              onChange={(e) =>
                                 setConfirmDeletion(e.target.value)
                              }
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
            </div>
         </main>
      </Main>
   )
}
