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
   type Modal,
   PopoverContext,
   Popover as PopoverPrimitive,
   useSlottedContext,
} from "react-aria-components"
import { Dialog } from "./dialog"

function Popover({ children, ...props }: DialogTriggerProps) {
   return <DialogTrigger {...props}>{children}</DialogTrigger>
}

function Title({ ...props }: React.ComponentProps<typeof Dialog.Title>) {
   return <Dialog.Title {...props} />
}

function Header({ className, ...props }: React.ComponentProps<"div">) {
   return (
      <Dialog.Header
         className={cn("p-0 sm:pt-0", className)}
         {...props}
      />
   )
}

function Footer({ className, ...props }: React.ComponentProps<"div">) {
   return (
      <Dialog.Footer
         className={cn("pt-3", className)}
         {...props}
      />
   )
}

function Body({ className, ...props }: React.ComponentProps<"div">) {
   return (
      <Dialog.Body
         className={cn("p-0", className)}
         {...props}
      />
   )
}

const popoverContentVariants = cva(
   "w-48 rounded-xl bg-popover bg-clip-padding shadow-lg",
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

type PopoverProps = Omit<React.ComponentProps<typeof Modal>, "children"> &
   Omit<PopoverPrimitiveProps, "children"> &
   Omit<ModalOverlayProps, "className"> & {
      children: React.ReactNode
      showArrow?: boolean
      style?: React.CSSProperties
      respectScreen?: boolean
      "aria-label"?: DialogProps["aria-label"]
      "aria-labelledby"?: DialogProps["aria-labelledby"]
   }

function Content({
   children,
   showArrow = true,
   className,
   ...props
}: PopoverProps) {
   const popoverContext = useSlottedContext(PopoverContext)
   const isSubmenuTrigger = popoverContext?.trigger === "SubmenuTrigger"
   const offset = showArrow ? 12 : 8

   const effectiveOffset = isSubmenuTrigger ? offset - 5 : offset

   return (
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

function Picker({ children, className, ...props }: PopoverProps) {
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

export { Popover, popoverContentVariants }
