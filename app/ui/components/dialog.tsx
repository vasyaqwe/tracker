import { Icons } from "@/ui/components/icons"
import { useUIStore } from "@/ui/store"
import { cn } from "@/ui/utils"
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

function Dialog({ role, className, ...props }: DialogProps) {
   return (
      <DialogPrimitive
         {...props}
         role={role ?? "dialog"}
         className={cn([
            "relative flex max-h-[inherit] flex-col overflow-hidden outline-none",
            className,
         ])}
      />
   )
}

function Trigger(props: ButtonPrimitiveProps) {
   return (
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
}

function Header({
   className,
   ...props
}: React.ComponentProps<"div"> & {
   title?: string
   description?: string
}) {
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
         ref={headerRef}
         className={cn("relative flex flex-col py-3", className)}
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

function Title({ className, ...props }: HeadingProps) {
   return (
      <Heading
         className={cn(
            "flex flex-1 items-center font-medium text-lg",
            className,
         )}
         {...props}
      />
   )
}

function Description({ className, ...props }: React.ComponentProps<"div">) {
   return (
      <div
         className={cn("mt-0.5 block text-foreground/70 text-sm", className)}
         {...props}
      />
   )
}

function Body({ className, ...props }: React.ComponentProps<"div">) {
   return (
      <div
         className={cn([
            "flex flex-1 flex-col gap-2 overflow-auto px-4",
            "max-h-[calc(var(--visual-viewport-height)-var(--visual-viewport-vertical-padding)-var(--dialog-header-height,0px)-var(--dialog-footer-height,0px))]",
            className,
         ])}
         {...props}
      />
   )
}

function Footer({ className, ...props }: React.ComponentProps<"div">) {
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
         className={cn("mt-auto flex justify-between gap-2 py-4", className)}
         {...props}
      />
   )
}

function Close({ className, ...props }: ButtonProps) {
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

function CloseIndicator({ className, ...props }: CloseButtonIndicatorProps) {
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
            "absolute top-2 right-2 z-50 grid size-8 place-content-center rounded-[9px] ring-offset-1 transition-colors duration-100 md:size-7 hover:bg-border/60 focus:outline-none focus-visible:ring-1 focus-visible:ring-primary",
            className,
         )}
      >
         <Icons.xMark className="size-5 md:size-4" />
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
