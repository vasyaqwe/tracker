import { Icons } from "@/ui/components/icons"
import { useUIStore } from "@/ui/store"
import { cn } from "@/ui/utils"
import { cva } from "class-variance-authority"
import * as React from "react"
import type {
   ButtonProps as ButtonPrimitiveProps,
   ButtonProps,
   DialogProps,
   HeadingProps,
} from "react-aria-components"
import {
   Button,
   Button as ButtonPrimitive,
   Dialog as DialogPrimitive,
   Heading,
   OverlayTriggerStateContext,
} from "react-aria-components"

const Dialog = ({ role, className, ...props }: DialogProps) => {
   return (
      <DialogPrimitive
         {...props}
         role={role ?? "dialog"}
         className={cn([
            "dlc relative flex max-h-[inherit] flex-col overflow-hidden outline-none [scrollbar-width:thin] [&::-webkit-scrollbar]:size-0.5",
            "sm:[&:has([data-slot=dialog-body])_[data-slot=dialog-footer]]:px-4 sm:[&:has([data-slot=dialog-body])_[data-slot=dialog-header]]:px-4 sm:[&:not(:has([data-slot=dialog-body]))]:px-4",
            "[&:has([data-slot=dialog-body])_[data-slot=dialog-footer]]:px-4 [&:has([data-slot=dialog-body])_[data-slot=dialog-header]]:px-4 [&:not(:has([data-slot=dialog-body]))]:px-4",
            className,
         ])}
      />
   )
}

const Trigger = (props: ButtonPrimitiveProps) => (
   <ButtonPrimitive {...props}>
      {(values) => (
         <>
            {typeof props.children === "function"
               ? props.children(values)
               : props.children}
         </>
      )}
   </ButtonPrimitive>
)

type DialogHeaderProps = React.HTMLAttributes<HTMLDivElement> & {
   title?: string
   description?: string
}

const Header = ({ className, ...props }: DialogHeaderProps) => {
   const headerRef = React.useRef<HTMLHeadingElement>(null)

   React.useEffect(() => {
      const header = headerRef.current
      if (!header) {
         return
      }

      const observer = new ResizeObserver((entries) => {
         for (const entry of entries) {
            header.parentElement?.style.setProperty(
               "--dialog-header-height",
               `${entry.target.clientHeight}px`,
            )
         }
      })

      observer.observe(header)
      return () => observer.unobserve(header)
   }, [])

   return (
      <div
         data-slot="dialog-header"
         ref={headerRef}
         className={cn("relative flex flex-col pt-3 pb-4", className)}
      >
         {props.title && <Title>{props.title}</Title>}
         {props.description && <Description>{props.description}</Description>}
         {!props.title && typeof props.children === "string" ? (
            <Title {...props} />
         ) : (
            props.children
         )}
      </div>
   )
}

const titleVariants = cva("flex flex-1 items-center", {
   variants: {
      level: {
         1: "font-medium text-lg sm:text-lg",
         2: "font-medium text-lg",
         3: "font-medium text-base",
         4: "font-medium text-base",
      },
   },
})

type TitleProps = Omit<HeadingProps, "level"> & {
   level?: 1 | 2 | 3 | 4
}

const Title = ({ level = 2, className, ...props }: TitleProps) => (
   <Heading
      slot="title"
      level={level}
      className={titleVariants({ level, className })}
      {...props}
   />
)

const Description = ({
   className,
   ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
   <div
      className={cn(
         "mt-0.5 block text-foreground/70 text-sm sm:mt-1",
         className,
      )}
      {...props}
   />
)

const Body = ({
   className,
   ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
   <div
      data-slot="dialog-body"
      className={cn([
         "flex flex-1 flex-col gap-2 overflow-auto px-4",
         "max-h-[calc(var(--visual-viewport-height)-var(--visual-viewport-vertical-padding)-var(--dialog-header-height,0px)-var(--dialog-footer-height,0px))]",
         className,
      ])}
      {...props}
   />
)

const Footer = ({
   className,
   ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
   const footerRef = React.useRef<HTMLDivElement>(null)

   React.useEffect(() => {
      const footer = footerRef.current

      if (!footer) {
         return
      }

      const observer = new ResizeObserver((entries) => {
         for (const entry of entries) {
            footer.parentElement?.style.setProperty(
               "--dialog-footer-height",
               `${entry.target.clientHeight}px`,
            )
         }
      })

      observer.observe(footer)
      return () => {
         observer.unobserve(footer)
      }
   }, [])

   return (
      <div
         ref={footerRef}
         data-slot="dialog-footer"
         className={cn("mt-auto flex justify-between gap-2 py-4", className)}
         {...props}
      />
   )
}

const Close = ({ className, ...props }: ButtonProps) => {
   const state = React.useContext(OverlayTriggerStateContext)
   return (
      <Button
         className={className}
         onPress={() => state.close()}
         {...props}
      />
   )
}

type CloseButtonIndicatorProps = {
   className?: string
   close: () => void
   isDismissable?: boolean | undefined
}

const CloseIndicator = ({ className, ...props }: CloseButtonIndicatorProps) => {
   const isMobile = useUIStore().isMobile
   const buttonRef = React.useRef<HTMLButtonElement>(null)

   React.useEffect(() => {
      if (isMobile && buttonRef.current) {
         buttonRef.current.focus()
      }
   }, [isMobile])
   return props.isDismissable ? (
      <ButtonPrimitive
         ref={buttonRef}
         {...(isMobile ? { autoFocus: true } : {})}
         aria-label="Close"
         onPress={props.close}
         className={cn(
            "close absolute top-1 right-1 z-50 grid size-8 place-content-center rounded-xl sm:top-2 sm:right-2 sm:size-7 sm:rounded-md focus:bg-secondary hover:bg-secondary focus:outline-none focus-visible:ring-1 focus-visible:ring-primary",
            className,
         )}
      >
         <Icons.xMark className="size-4" />
      </ButtonPrimitive>
   ) : null
}

Dialog.Trigger = Trigger
Dialog.Header = Header
Dialog.Title = Title
Dialog.Description = Description
Dialog.Body = Body
Dialog.Footer = Footer
Dialog.Close = Close
Dialog.CloseIndicator = CloseIndicator

export { Dialog }
