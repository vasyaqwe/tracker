import { Icons } from "@/ui/components/icons"
import { cn, cr } from "@/ui/utils"
import type { VariantProps } from "class-variance-authority"
import * as React from "react"
import type {
   ButtonProps,
   MenuItemProps as MenuItemPrimitiveProps,
   MenuProps as MenuPrimitiveProps,
   MenuTriggerProps as MenuTriggerPrimitiveProps,
   PopoverProps,
   SeparatorProps,
} from "react-aria-components"
import {
   Button,
   Header,
   MenuItem,
   Menu as MenuPrimitive,
   MenuTrigger as MenuTriggerPrimitive,
   Separator,
   SubmenuTrigger as SubmenuTriggerPrimitive,
} from "react-aria-components"
import {
   DropdownItemDetails,
   DropdownSection,
   dropdownItemVariants,
} from "./dropdown"
import { Popover } from "./popover"

const MenuContext = React.createContext<{
   respectScreen: boolean
}>({
   respectScreen: true,
})

function Menu({
   respectScreen = true,
   ...props
}: MenuTriggerPrimitiveProps & {
   respectScreen?: boolean
}) {
   return (
      <MenuContext.Provider value={{ respectScreen }}>
         <MenuTriggerPrimitive {...props}>
            {props.children}
         </MenuTriggerPrimitive>
      </MenuContext.Provider>
   )
}

function SubMenu({ delay = 0, ...props }) {
   return (
      <SubmenuTriggerPrimitive
         {...props}
         delay={delay}
      >
         {props.children}
      </SubmenuTriggerPrimitive>
   )
}

function Trigger({ ...props }: ButtonProps) {
   return (
      <Button {...props}>
         {(values) => (
            <>
               {typeof props.children === "function"
                  ? props.children(values)
                  : props.children}
            </>
         )}
      </Button>
   )
}

type MenuContentProps<T> = Omit<PopoverProps, "children" | "style"> &
   MenuPrimitiveProps<T> & {
      className?: string
      popoverClassName?: string
      showArrow?: boolean
      respectScreen?: boolean
   }

function Content<T extends object>({
   className,
   showArrow = false,
   popoverClassName,
   ...props
}: MenuContentProps<T>) {
   const { respectScreen } = React.useContext(MenuContext)
   return (
      <Popover.Content
         respectScreen={respectScreen}
         showArrow={showArrow}
         className={cn(
            "z-50 min-w-40 bg-popover p-0 text-popover-foreground shadow-lg outline-hidden",
            [
               showArrow &&
                  "placement-left:mt-[-0.38rem] placement-right:mt-[-0.38rem]",
               popoverClassName,
            ],
         )}
         {...props}
      >
         <MenuPrimitive
            className={cn(
               "max-h-[calc(var(--visual-viewport-height)-10rem)] overflow-auto rounded-xl p-1 outline outline-0 [clip-path:inset(0_0_0_0_round_calc(var(--radius)-2px))] sm:max-h-[inherit]",
               className,
            )}
            {...props}
         />
      </Popover.Content>
   )
}

type MenuItemProps = Omit<MenuItemPrimitiveProps, "isDanger"> &
   VariantProps<typeof dropdownItemVariants> & {
      isDanger?: boolean
   }

function Item({
   className,
   isDanger = false,
   children,
   ...props
}: MenuItemProps) {
   const textValue =
      props.textValue || (typeof children === "string" ? children : undefined)
   return (
      <MenuItem
         textValue={textValue}
         className={cr(className, (className, renderProps) =>
            dropdownItemVariants({
               ...renderProps,
               className,
            }),
         )}
         data-danger={isDanger ? "true" : undefined}
         {...props}
      >
         {(values) => (
            <>
               {typeof children === "function" ? children(values) : children}
               {/* {values.hasSubmenu && <IconChevronLgRight className="gpfw ml-auto size-3.5" />} */}
            </>
         )}
      </MenuItem>
   )
}

function MenuHeader({
   className,
   separator = false,
   ...props
}: React.ComponentProps<typeof Header> & {
   separator?: boolean
}) {
   return (
      <Header
         className={cn(
            "p-2 pt-1 text-popover-foreground/70 text-sm",
            separator && "-mx-1 border-b border-b-black px-3 pb-[0.625rem]",
            className,
         )}
         {...props}
      />
   )
}

function MenuSeparator({ className, ...props }: SeparatorProps) {
   return (
      <Separator
         className={cn("-mx-1 ms my-1 h-px bg-black", className)}
         {...props}
      />
   )
}

function Checkbox({
   className,
   children,
   ...props
}: MenuItemProps & { isSelected?: boolean }) {
   return (
      <Item
         className={cn("relative pr-8", className)}
         {...props}
      >
         {(values) => (
            <>
               {typeof children === "function" ? children(values) : children}
               {values.isSelected && (
                  <span className="absolute right-2 flex size-4 shrink-0 animate-in items-center justify-center">
                     <Icons.check />
                  </span>
               )}
            </>
         )}
      </Item>
   )
}

Menu.Primitive = MenuPrimitive
Menu.Content = Content
Menu.Header = MenuHeader
Menu.Item = Item
Menu.Content = Content
Menu.Checkbox = Checkbox
Menu.Section = DropdownSection
Menu.Separator = MenuSeparator
Menu.Trigger = Trigger
Menu.ItemDetails = DropdownItemDetails
Menu.Submenu = SubMenu

export { Menu, type MenuContentProps }
