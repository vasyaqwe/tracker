import type { FunctionReturnType } from "convex/server"
import * as React from "react"
import type { api } from "@/convex/_generated/api"
import invariant from "@/invariant"

export type Project = NonNullable<FunctionReturnType<typeof api.project.byId>>

export const ProjectContext = React.createContext<Project | null>(null)

export function useProject() {
   const project = React.use(ProjectContext)
   invariant(project, "useProject must be used inside the /$projectId layout")

   return project
}
