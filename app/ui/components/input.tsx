import { cn } from "@/ui/utils"
import * as React from "react"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
   ({ className, ...props }, ref) => {
      return (
         <input
            ref={ref}
            className={cn(
               `block h-10 w-full appearance-none rounded-full border border-border bg-secondary px-3 text-[0.95rem] outline-2 outline-transparent transition-all focus:border-primary/90 has-[+button[data-clearinput]:active]:border-primary focus:bg-muted/60 placeholder:text-foreground/40 focus:outline-primary/30 has-[+button[data-clearinput]:active]:outline-primary/30`,
               className,
            )}
            {...props}
         />
      )
   },
)

export { Input }
