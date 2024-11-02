import { env } from "@/env"
import { RESERVED_SLUGS } from "@/project/constants"
import { projectListQuery } from "@/project/queries"
import { Button } from "@/ui/components/button"
import { Loading } from "@/ui/components/loading"
import { Logo } from "@/ui/components/logo"
import { NumberField } from "@/ui/components/number-field"
import { TextField } from "@/ui/components/text-field"
import { cn } from "@/ui/utils"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "@tanstack/react-router"
import { useServerFn } from "@tanstack/start"
import type { TRPCError } from "@trpc/server"
import { useState } from "react"
import { toast } from "sonner"
import { match } from "ts-pattern"
import * as project from "../functions"

const makeSlug = (name: string) =>
   name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")

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
   const queryClient = useQueryClient()

   const insertFn = useServerFn(project.insert)
   const insert = useMutation({
      mutationFn: insertFn,
      onSuccess: () => {
         queryClient.invalidateQueries(projectListQuery())
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
                  <Logo className="size-9" />

                  <h1 className="font-medium text-2xl">Welcome to Tracker,</h1>
               </div>
            ) : (
               <Logo className="size-9" />
            )}
            <h2 className={cn("my-4 text-foreground/90 text-xl")}>
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
               className="flex w-full flex-col"
            >
               <TextField
                  label="Name"
                  autoComplete="off"
                  autoFocus
                  name="name"
                  id="name"
                  value={name}
                  onChange={(value) => setName(value)}
                  placeholder="Enter a name"
                  isRequired
                  maxLength={32}
               />
               <p className="mt-1.5 mb-3 break-all text-foreground/75">
                  <u>
                     {env.VITE_BASE_URL}/{makeSlug(name)}
                  </u>
               </p>
               <NumberField
                  label="Hourly rate"
                  minValue={1}
                  maxValue={1000}
                  name="rate"
                  id="rate"
                  placeholder="$"
                  isRequired
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
