import { cn } from "@/ui/utils"
import type * as React from "react"

export function Kbd({
   className,
   children,
   ...props
}: React.ComponentProps<"kbd">) {
   const isMac =
      typeof window === "undefined"
         ? true
         : navigator.platform.toUpperCase().indexOf("MAC") >= 0

   return (
      <kbd
         className={cn(
            `ml-auto inline-flex h-5 shrink-0 items-center gap-[3px] rounded-[6px] bg-popover-elevated px-[5px] py-px font-primary text-sm shadow-inner group-hover:border-muted group-hover:bg-background/75`,
            className,
         )}
         {...props}
      >
         {typeof children === "string" && children === "Ctrl" && isMac ? (
            <>
               <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="mt-px size-[15px]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
               >
                  <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
               </svg>
            </>
         ) : (
            children
         )}
      </kbd>
   )
}
