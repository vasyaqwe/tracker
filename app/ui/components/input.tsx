import { Icons } from "@/ui/components/icons"
import { cn } from "@/ui/utils"
import { cva } from "class-variance-authority"
import { type ComponentProps, forwardRef } from "react"

const inputVariants = cva(
   `block h-10 w-full rounded-full transition-all text-[0.95rem] border border-border focus:border-primary/90
    px-3 bg-secondary focus:bg-muted/60 placeholder:text-foreground/40 outline-2 outline-transparent focus:outline-primary/30
    has-[+button[data-clearinput]:active]:border-primary
    has-[+button[data-clearinput]:active]:outline-primary/30 appearance-none`,
)
const Input = forwardRef<HTMLInputElement, ComponentProps<"input">>(
   ({ className, ...props }, ref) => {
      return (
         <input
            ref={ref}
            className={cn(inputVariants(), className)}
            {...props}
         />
      )
   },
)

export { Input, inputVariants }
