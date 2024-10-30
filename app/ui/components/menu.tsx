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

interface MenuContextProps {
   respectScreen: boolean
}

const MenuContext = React.createContext<MenuContextProps>({
   respectScreen: true,
})

interface MenuProps extends MenuTriggerPrimitiveProps {
   respectScreen?: boolean
}

const Menu = ({ respectScreen = true, ...props }: MenuProps) => {
   return (
      <MenuContext.Provider value={{ respectScreen }}>
         <MenuTriggerPrimitive {...props}>
            {props.children}
         </MenuTriggerPrimitive>
      </MenuContext.Provider>
   )
}

const SubMenu = ({ delay = 0, ...props }) => (
   <SubmenuTriggerPrimitive
      {...props}
      delay={delay}
   >
      {props.children}
   </SubmenuTriggerPrimitive>
)

interface MenuTriggerProps extends ButtonProps {
   className?: string
}

const Trigger = ({ className, ...props }: MenuTriggerProps) => (
   <Button
      className={cn("", className)}
      {...props}
   >
      {(values) => (
         <>
            {typeof props.children === "function"
               ? props.children(values)
               : props.children}
         </>
      )}
   </Button>
)

interface MenuContentProps<T>
   extends Omit<PopoverProps, "children" | "style">,
      MenuPrimitiveProps<T> {
   className?: string
   popoverClassName?: string
   showArrow?: boolean
   respectScreen?: boolean
}

const Content = <T extends object>({
   className,
   showArrow = false,
   popoverClassName,
   ...props
}: MenuContentProps<T>) => {
   const { respectScreen } = React.useContext(MenuContext)
   return (
      <Popover.Content
         respectScreen={respectScreen}
         showArrow={showArrow}
         className={cn(
            "z-50 min-w-40 bg-popover p-0 text-popover-foreground shadow-lg outline-none",
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

const Item = ({
   className,
   isDanger = false,
   children,
   ...props
}: MenuItemProps) => {
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

export interface MenuHeaderProps extends React.ComponentProps<typeof Header> {
   separator?: boolean
}

const MenuHeader = ({
   className,
   separator = false,
   ...props
}: MenuHeaderProps) => (
   <Header
      className={cn(
         "p-2 text-popover-foreground/70 text-sm",
         separator && "-mx-1 border-b border-b-black px-3 pb-[0.625rem]",
         className,
      )}
      {...props}
   />
)

const MenuSeparator = ({ className, ...props }: SeparatorProps) => (
   <Separator
      className={cn("-mx-1 ms my-1 h-px bg-black", className)}
      {...props}
   />
)

const Checkbox = ({
   className,
   children,
   ...props
}: MenuItemProps & { isSelected?: boolean }) => (
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
