import { HugeiconsIcon } from "@hugeicons/react"
import { cn } from "@/ui/utils"

export function Icon({
   strokeWidth = 1.75,
   className,
   ...props
}: React.ComponentProps<typeof HugeiconsIcon>) {
   return (
      <HugeiconsIcon
         className={cn("shrink-0", className)}
         strokeWidth={strokeWidth}
         {...props}
      />
   )
}

export const FILLED_ICON =
   "fill-current [&>path+path]:origin-center [&>path+path]:scale-125 [&>path+path]:stroke-background [&>path+path]:stroke-[2] [&>path+path]:[transform-box:fill-box]"
