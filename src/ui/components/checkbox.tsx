import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox"
import { Tick02Icon } from "@hugeicons/core-free-icons"
import { Icon } from "@/ui/components/icon"
import { cn } from "@/ui/utils"

export function Checkbox({
   className,
   ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
   return (
      <CheckboxPrimitive.Root
         className={cn(
            "flex size-4 shrink-0 cursor-pointer items-center justify-center rounded-[0.3rem] bg-white shadow-elevated data-checked:bg-foreground data-checked:text-white data-checked:shadow-none",
            className,
         )}
         {...props}
      >
         <CheckboxPrimitive.Indicator>
            <Icon
               icon={Tick02Icon}
               strokeWidth={2.5}
               className="size-3"
            />
         </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
   )
}
