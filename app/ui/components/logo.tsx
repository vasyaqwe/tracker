import icon from "@/assets/icon.png"
import { cn } from "@/ui/utils"

export function Logo({ className, ...props }: React.ComponentProps<"img">) {
   return (
      <img
         src={icon}
         className={cn(
            "drop-shadow-[0px_1px_8px_rgba(24,24,24,.1)]",
            className,
         )}
         {...props}
         alt="Tracker"
      />
   )
}
