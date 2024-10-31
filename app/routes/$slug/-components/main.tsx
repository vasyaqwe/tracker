import { cn } from "@/ui/utils"
import type { ComponentProps } from "react"

export function Main({
   className,
   children,
   asMain = false,
   ...props
}: ComponentProps<"div"> & { asMain?: boolean }) {
   const Comp = asMain ? "main" : "div"

   return (
      <Comp
         className={cn(
            "relative flex min-h-[var(--sidebar-height)] flex-1 flex-col md:pb-20",
            className,
         )}
         {...props}
      >
         {children}
      </Comp>
   )
}
