import { cr } from "@/ui/utils"
import { type VariantProps, cva } from "class-variance-authority"
import type * as React from "react"
import type {
   DialogTriggerProps,
   ModalOverlayProps as ModalOverlayPrimitiveProps,
} from "react-aria-components"
import {
   type DialogProps,
   DialogTrigger as DialogTriggerPrimitive,
   ModalOverlay as ModalOverlayPrimitive,
   Modal as ModalPrimitive,
} from "react-aria-components"
import { Dialog } from "./dialog"

const modalOverlayVariants = cva(
   [
      "fixed top-0 left-0 isolate z-50 size-full",
      "flex items-end bg-foreground/30 text-center sm:block",
      "[--visual-viewport-vertical-padding:16px] sm:[--visual-viewport-vertical-padding:32px]",
   ],
   {
      variants: {
         isEntering: {
            true: "fade-in animate-in ease-out",
         },
         isExiting: {
            true: "fade-out animate-out duration-200 ease-in",
         },
      },
   },
)
const modalContentVariants = cva(
   [
      "max-h-full w-[90%] overflow-hidden rounded-[15px] bg-background text-left align-middle shadow-lg md:w-full",
      "-translate-x-1/2 -translate-y-1/2 fixed top-1/2 left-[50vw]",
   ],
   {
      variants: {
         isEntering: {
            true: ["zoom-in-[103%] animate-in duration-200 ease-in"],
         },
         isExiting: {
            true: ["zoom-out-[97%] animate-out duration-200 ease-in"],
         },
         size: {
            xs: "sm:max-w-xs",
            sm: "sm:max-w-sm",
            md: "sm:max-w-md",
            lg: "sm:max-w-lg",
            xl: "sm:max-w-xl",
            "2xl": "sm:max-w-2xl",
            "3xl": "sm:max-w-3xl",
            "4xl": "sm:max-w-4xl",
            "5xl": "sm:max-w-5xl",
         },
      },
      defaultVariants: {
         size: "md",
      },
   },
)

function Modal({ children, ...props }: DialogTriggerProps) {
   return <DialogTriggerPrimitive {...props}>{children}</DialogTriggerPrimitive>
}

type ModalContentProps = Omit<React.ComponentProps<typeof Modal>, "children"> &
   ModalOverlayPrimitiveProps &
   VariantProps<typeof modalContentVariants> & {
      "aria-label"?: DialogProps["aria-label"]
      "aria-labelledby"?: DialogProps["aria-labelledby"]
      role?: DialogProps["role"]
      closeButton?: boolean
      classNames?: {
         overlay?: ModalOverlayPrimitiveProps["className"]
         content?: ModalOverlayPrimitiveProps["className"]
      }
   }

function ModalContent({
   classNames,
   isDismissable = true,
   children,
   size,
   role,
   closeButton = true,
   ...props
}: ModalContentProps) {
   const _isDismissable = role === "alertdialog" ? false : isDismissable
   return (
      <ModalOverlayPrimitive
         isDismissable={_isDismissable}
         className={cr(classNames?.overlay, (className, renderProps) => {
            return modalOverlayVariants({
               ...renderProps,
               className,
            })
         })}
         {...props}
      >
         <ModalPrimitive
            className={cr(classNames?.content, (className, renderProps) =>
               modalContentVariants({
                  ...renderProps,
                  size,
                  className,
               }),
            )}
            {...props}
         >
            {(values) => (
               <Dialog role={role}>
                  {typeof children === "function" ? children(values) : children}
                  {closeButton && (
                     <Dialog.CloseIndicator
                        close={values.state.close}
                        isDismissable={_isDismissable}
                     />
                  )}
               </Dialog>
            )}
         </ModalPrimitive>
      </ModalOverlayPrimitive>
   )
}

Modal.Trigger = Dialog.Trigger
Modal.Header = Dialog.Header
Modal.Title = Dialog.Title
Modal.Description = Dialog.Description
Modal.Footer = Dialog.Footer
Modal.Body = Dialog.Body
Modal.Close = Dialog.Close
Modal.Content = ModalContent

export { Modal, modalOverlayVariants, modalContentVariants }
