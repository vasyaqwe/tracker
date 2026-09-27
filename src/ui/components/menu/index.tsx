import { Menu as MenuPrimitive } from "@base-ui/react/menu"
import {
   ArrowDownIcon,
   ArrowRight01Icon,
   Tick02Icon,
} from "@hugeicons/core-free-icons"
import type { VariantProps } from "cva"
import { Icon } from "@/ui/components/icon"
import { menuItem } from "@/ui/components/menu/style"
import { popup } from "@/ui/popup"
import { cn } from "@/ui/utils"

const Root = MenuPrimitive.Root
const SubmenuRoot = MenuPrimitive.SubmenuRoot
const Trigger = MenuPrimitive.Trigger
const Group = MenuPrimitive.Group
const RadioGroup = MenuPrimitive.RadioGroup
const Portal = MenuPrimitive.Portal
const Backdrop = MenuPrimitive.Backdrop
const Positioner = MenuPrimitive.Positioner

function GroupLabel({
   className,
   children,
   ...props
}: React.ComponentProps<typeof MenuPrimitive.GroupLabel>) {
   return (
      <MenuPrimitive.GroupLabel
         className={cn(popup.groupLabel, className)}
         {...props}
      >
         {children}
      </MenuPrimitive.GroupLabel>
   )
}

function TriggerIcon({
   className,
   ...props
}: Omit<React.ComponentProps<typeof Icon>, "icon">) {
   return (
      <Icon
         className={cn("-ml-0.5 shrink-0", className)}
         {...props}
         icon={ArrowDownIcon}
      />
   )
}

interface Props
   extends React.ComponentProps<typeof MenuPrimitive.Item>,
      VariantProps<typeof menuItem> {}

function Item({ className, variant, children, ...props }: Props) {
   return (
      <MenuPrimitive.Item
         className={cn(menuItem({ variant, className }))}
         {...props}
      >
         {children}
      </MenuPrimitive.Item>
   )
}

function CheckboxItem({
   className,
   children,
   ...props
}: React.ComponentProps<typeof MenuPrimitive.CheckboxItem>) {
   return (
      <MenuPrimitive.CheckboxItem
         className={cn(menuItem({ variant: "checkbox" }), className)}
         {...props}
      >
         {children}
         <MenuPrimitive.CheckboxItemIndicator className={"ml-auto"}>
            <Icon
               icon={Tick02Icon}
               className={"size-5!"}
            />
         </MenuPrimitive.CheckboxItemIndicator>
      </MenuPrimitive.CheckboxItem>
   )
}

function RadioItem({
   className,
   children,
   ...props
}: React.ComponentProps<typeof MenuPrimitive.RadioItem>) {
   return (
      <MenuPrimitive.RadioItem
         className={cn(menuItem({ variant: "checkbox" }), className)}
         {...props}
      >
         {children}
         <MenuPrimitive.RadioItemIndicator className={"ml-auto"}>
            <Icon
               icon={Tick02Icon}
               className={"size-5!"}
            />
         </MenuPrimitive.RadioItemIndicator>
      </MenuPrimitive.RadioItem>
   )
}

function Popup({
   className,
   children,
   sideOffset = 4,
   ...props
}: React.ComponentProps<typeof MenuPrimitive.Positioner>) {
   return (
      <Portal>
         <Backdrop />
         <Positioner
            sideOffset={sideOffset}
            {...props}
         >
            <MenuPrimitive.Popup
               className={cn(
                  popup.base,
                  popup.transition,
                  "min-w-42 p-(--popup-padding) text-base",
                  className,
               )}
            >
               {children}
            </MenuPrimitive.Popup>
         </Positioner>
      </Portal>
   )
}

function SubmenuTrigger({
   className,
   children,
   ...props
}: React.ComponentProps<typeof MenuPrimitive.SubmenuTrigger>) {
   return (
      <MenuPrimitive.SubmenuTrigger
         className={cn(menuItem({ variant: "default", className }))}
         {...props}
      >
         {children}
         <Icon
            icon={ArrowRight01Icon}
            className="-mr-1.5 ml-auto size-4! shrink-0"
         />
      </MenuPrimitive.SubmenuTrigger>
   )
}

function Separator({
   className,
   ...props
}: React.ComponentProps<typeof MenuPrimitive.Separator>) {
   return (
      <MenuPrimitive.Separator
         className={cn(popup.separator, className)}
         {...props}
      />
   )
}

export const Menu = {
   Root,
   GroupLabel,
   TriggerIcon,
   Item,
   CheckboxItem,
   RadioItem,
   Popup,
   SubmenuTrigger,
   Separator,
   SubmenuRoot,
   Trigger,
   Group,
   RadioGroup,
}
