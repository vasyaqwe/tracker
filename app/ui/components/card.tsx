import { cn } from "@/ui/utils"
import type React from "react"

export function Card({ className, ...props }: React.ComponentProps<"div">) {
   return (
      <div
         className={cn(
            "rounded-[15px] border border-border/40 bg-elevated",
            className,
         )}
         {...props}
      />
   )
}
