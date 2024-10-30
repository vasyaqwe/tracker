import { useUIStore } from "@/ui/store"
import { cn, cr } from "@/ui/utils"
import { cva } from "class-variance-authority"
import type * as React from "react"
import type {
   DialogTriggerProps,
   ModalOverlayProps,
   PopoverProps as PopoverPrimitiveProps,
} from "react-aria-components"
import {
   type DialogProps,
   DialogTrigger,
   Modal,
   ModalOverlay,
   PopoverContext,
   Popover as PopoverPrimitive,
   useSlottedContext,
} from "react-aria-components"
import { twJoin } from "tailwind-merge"
import { Dialog } from "./dialog"

const Popover = ({ children, ...props }: DialogTriggerProps) => {
   return <DialogTrigger {...props}>{children}</DialogTrigger>
}

const Title = ({
   level = 2,
   className,
   ...props
}: React.ComponentProps<typeof Dialog.Title>) => (
   <Dialog.Title
      className={cn("sm:leading-none", level === 2 && "sm:text-lg", className)}
      {...props}
   />
)

const Header = ({
   className,
   ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
   <Dialog.Header
      className={cn("p-0 sm:pt-0", className)}
      {...props}
   />
)

const Footer = ({
   className,
   ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
   <Dialog.Footer
      className={cn("pt-4 pb-0 sm:pb-0", className)}
      {...props}
   />
)

const Body = ({
   className,
   ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
   <Dialog.Body
      className={cn("p-0", className)}
      {...props}
   />
)

const popoverContentVariants = cva(
   "min-w-40 max-w-xs rounded-xl bg-popover bg-clip-padding shadow-sm sm:max-w-3xl",
   {
      variants: {
         isMenu: {
            true: {
               true: "p-0",
            },
         },
         isEntering: {
            true: [
               "fade-in data-[placement=left]:slide-in-from-right-1 data-[placement=right]:slide-in-from-left-1 data-[placement=top]:slide-in-from-bottom-1 data-[placement=bottom]:slide-in-from-top-1 animate-in duration-100 ease-out",
            ],
         },
         isExiting: {
            true: "fade-out data-[placement=left]:slide-out-to-right-1 data-[placement=right]:slide-out-to-left-1 data-[placement=top]:slide-out-to-bottom-1 data-[placement=bottom]:slide-out-to-top-1 animate-out duration-100 ease-in",
         },
      },
   },
)

const drawerStyles = cva(
   "fixed top-auto bottom-0 z-50 max-h-full w-full max-w-2xl border border-b-transparent bg-overlay outline-none",
   {
      variants: {
         isMenu: {
            true: "rounded-t-xl p-0 [&_[role=dialog]]:px-0",
            false: "rounded-t-3xl py-4",
         },
         isEntering: {
            true: [
               "[transition:transform_0.5s_cubic-bezier(0.32,_0.72,_0,_1)] [will-change:transform]",
               "fade-in-0 slide-in-from-bottom-56 animate-in duration-200",
               "[transition:translate3d(0,_100%,_0)]",
               "sm:slide-in-from-bottom-auto sm:slide-in-from-top-[20%]",
            ],
         },
         isExiting: {
            true: "slide-out-to-bottom-56 animate-out duration-200 ease-in",
         },
      },
   },
)

interface PopoverProps
   extends Omit<React.ComponentProps<typeof Modal>, "children">,
      Omit<PopoverPrimitiveProps, "children" | "className">,
      Omit<ModalOverlayProps, "className"> {
   children: React.ReactNode
   showArrow?: boolean
   style?: React.CSSProperties
   respectScreen?: boolean
   "aria-label"?: DialogProps["aria-label"]
   "aria-labelledby"?: DialogProps["aria-labelledby"]
   className?: string | ((values: { defaultClassName?: string }) => string)
}

const Content = ({
   respectScreen = true,
   children,
   showArrow = true,
   className,
   ...props
}: PopoverProps) => {
   const isMobile = useUIStore().isMobile
   const popoverContext = useSlottedContext(PopoverContext)
   const isMenuTrigger = popoverContext?.trigger === "MenuTrigger"
   const isSubmenuTrigger = popoverContext?.trigger === "SubmenuTrigger"
   const isMenu = isMenuTrigger || isSubmenuTrigger
   const offset = showArrow ? 12 : 8
   const effectiveOffset = isSubmenuTrigger ? offset - 5 : offset
   return isMobile && respectScreen ? (
      <ModalOverlay
         className={twJoin(
            "fixed top-0 left-0 isolate z-50 h-[--visual-viewport-height] w-full [--visual-viewport-vertical-padding:16px]",
            isSubmenuTrigger ? "" : "",
         )}
         {...props}
         isDismissable
      >
         <Modal
            className={cr(className, (className, renderProps) =>
               drawerStyles({ ...renderProps, isMenu, className }),
            )}
         >
            <Dialog
               aria-label={isMenu ? "Menu" : props["aria-label"]}
               className="touch-none focus:outline-none"
            >
               {children}
            </Dialog>
         </Modal>
      </ModalOverlay>
   ) : (
      <PopoverPrimitive
         offset={effectiveOffset}
         {...props}
         className={cr(className, (className, renderProps) =>
            popoverContentVariants({
               ...renderProps,
               className,
            }),
         )}
      >
         {/* {showArrow && (
            <OverlayArrow className="group">
               <svg
                  width={12}
                  height={12}
                  viewBox="0 0 12 12"
                  className="group-data-[placement=left]:-rotate-90 block fill-overlay stroke-border group-data-[placement=bottom]:rotate-180 group-data-[placement=right]:rotate-90 forced-colors:fill-[Canvas] forced-colors:stroke-[ButtonBorder]"
               >
                  <path d="M0 0 L6 6 L12 0" />
               </svg>
            </OverlayArrow>
         )} */}
         {children}
      </PopoverPrimitive>
   )
}

const Picker = ({ children, className, ...props }: PopoverProps) => {
   return (
      <PopoverPrimitive
         {...props}
         className={cr(
            className as PopoverPrimitiveProps["className"],
            (className, renderProps) =>
               popoverContentVariants({
                  ...renderProps,
                  className: cn(
                     "max-h-72 min-w-[--trigger-width] overflow-y-auto p-0",
                     className,
                  ),
               }),
         )}
      >
         {children}
      </PopoverPrimitive>
   )
}

Popover.Primitive = PopoverPrimitive
Popover.Trigger = Dialog.Trigger
Popover.Close = Dialog.Close
Popover.Content = Content
Popover.Description = Dialog.Description
Popover.Body = Body
Popover.Footer = Footer
Popover.Header = Header
Popover.Picker = Picker
Popover.Title = Title

export { Popover, drawerStyles, popoverContentVariants }
