import { ConvexError } from "convex/values"
import { toastManager } from "@/ui/components/toast"

const FALLBACK = "Something went wrong"

export const errorMessage = (error: unknown) => {
   if (!(error instanceof ConvexError)) return FALLBACK
   if (typeof error.data === "string") return error.data

   const issues = (error.data as { ZodError?: { message?: string }[] }).ZodError

   return issues?.[0]?.message ?? FALLBACK
}

export const toastError = (error: unknown) =>
   toastManager.add({ type: "error", title: errorMessage(error) })
