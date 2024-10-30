import logo from "@/assets/icon.png"
import { env } from "@/env"
import { RESERVED_SLUGS } from "@/project/constants"
import { Button } from "@/ui/components/button"
import { Input } from "@/ui/components/input"
import { Label } from "@/ui/components/label"
import { Loading } from "@/ui/components/loading"
import { cn } from "@/ui/utils"
import { useMutation } from "@tanstack/react-query"
import { useNavigate } from "@tanstack/react-router"
import { useServerFn } from "@tanstack/start"
import type { TRPCError } from "@trpc/server"
import { useState } from "react"
import { toast } from "sonner"
import { match } from "ts-pattern"
import * as project from "../functions"

const makeSlug = (name: string) => name.toLowerCase().replaceAll(" ", "-")

const parseError = (error: Error) => {
   try {
      const parsedError = JSON.parse(error.message) as {
         body: TRPCError
      }

      return parsedError
   } catch (jsonError) {
      console.error("Failed to parse error message as JSON:", jsonError)
   }
}

export function CreateProject({
   isFirstProject = true,
}: { isFirstProject?: boolean }) {
   const [name, setName] = useState("")
   const navigate = useNavigate()
   // const queryClient = useQueryClient()

   const insertFn = useServerFn(project.insert)
   const insert = useMutation({
      mutationFn: insertFn,
      onSuccess: () => {
         // queryClient.invalidateQueries(projectMembershipsQuery())
         navigate({ to: `/${makeSlug(name)}` })
      },
      onError: (error) => {
         match(parseError(error))
            .with({ body: { code: "CONFLICT" } }, () =>
               toast.error("Project name is not available"),
            )
            .otherwise(() => toast.error("An unknown error occurred"))
      },
   })

   return (
      <main className="grid h-svh w-full place-items-center">
         <div className="-mt-8 mx-auto w-full max-w-[23rem] px-4">
            {isFirstProject ? (
               <div className="flex items-center gap-2.5">
                  <img
                     src={logo}
                     className="size-9"
                     alt="Tracker"
                  />
                  <h1 className="font-semibold text-2xl">
                     Welcome to Tracker,
                  </h1>
               </div>
            ) : (
               <img
                  src={logo}
                  className="size-9"
                  alt="Tracker"
               />
            )}
            <h2
               className={cn(
                  "my-4 font-semibold text-foreground/90",
                  "text-2xl",
               )}
            >
               Create {isFirstProject ? "your first" : "a new"} project
            </h2>
            <form
               onSubmit={(e) => {
                  e.preventDefault()

                  const formData = Object.fromEntries(
                     new FormData(e.target as HTMLFormElement),
                  ) as {
                     rate: string
                  }

                  match(RESERVED_SLUGS.includes(name.trim().toLowerCase()))
                     .with(true, () => toast.error("This name is reserved"))
                     .otherwise(() =>
                        insert.mutate({
                           name,
                           slug: makeSlug(name),
                           rate: +formData.rate,
                        }),
                     )
               }}
               className="w-full"
            >
               <Label htmlFor="name">Name</Label>
               <Input
                  autoComplete="off"
                  autoFocus
                  name="name"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter a name"
                  required
                  maxLength={32}
               />
               <p className="mt-2 break-all text-foreground/75">
                  <u>
                     {env.VITE_BASE_URL}/{makeSlug(name)}
                  </u>
               </p>
               <Label
                  htmlFor="rate"
                  className="mt-3"
               >
                  Hourly rate
               </Label>
               <Input
                  autoComplete="off"
                  name="rate"
                  id="rate"
                  placeholder="Enter a number"
                  required
               />
               <Button
                  type="submit"
                  className="mt-5 w-full"
                  isDisabled={insert.isPending || insert.isSuccess}
               >
                  {insert.isPending || insert.isSuccess ? (
                     <Loading />
                  ) : (
                     "Create"
                  )}
               </Button>
            </form>
         </div>
      </main>
   )
}
