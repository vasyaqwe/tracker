import { cr } from "@/ui/utils"
import { type VariantProps, cva } from "class-variance-authority"
import * as React from "react"
import {
   Button as ButtonPrimitive,
   type ButtonProps as ButtonPrimitiveProps,
} from "react-aria-components"

const buttonVariants = cva(
   [
      "inline-flex items-center justify-center gap-2 border font-medium outline-none transition-colors duration-100",
   ],
   {
      variants: {
         intent: {
            primary: [
               "border-transparent bg-primary text-primary-foreground hover:bg-primary/90",
            ],
            outline: [
               "border-border bg-elevated aria-expanded:bg-background hover:bg-background",
            ],
            creative: [
               "border-transparent bg-popover-elevated text-background hover:bg-emerald-400/20 hover:text-emerald-400",
            ],
            ghost: [
               "border-transparent bg-transparent aria-expanded:bg-border/60 hover:bg-border/60",
            ],
            destructive: [
               "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/90",
            ],
            "destructive-secondary": [
               "border-transparent bg-popover-elevated text-background hover:bg-red-400/20 hover:text-red-400",
            ],
         },
         size: {
            md: "h-8 rounded-[10px] px-3 text-sm",
            icon: "size-8 rounded-[10px] text-sm",
         },
         isDisabled: {
            false: "",
            true: "cursor-not-allowed opacity-70",
         },
         isPending: {
            true: "cursor-not-allowed",
         },
         isFocusVisible: {
            false: "",
            true: "ring-3 ring-primary ring-offset-1",
         },
      },
      defaultVariants: {
         intent: "primary",
         size: "md",
      },
   },
)

type ButtonProps = ButtonPrimitiveProps & VariantProps<typeof buttonVariants>

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
   ({ className, intent, size, ...props }, ref) => {
      return (
         <ButtonPrimitive
            ref={ref}
            {...props}
            className={cr(className, (className, renderProps) =>
               buttonVariants({
                  ...renderProps,
                  intent,
                  size,
                  className,
               }),
            )}
         >
            {(values) => (
               <>
                  {typeof props.children === "function"
                     ? props.children(values)
                     : props.children}
               </>
            )}
         </ButtonPrimitive>
      )
   },
)

export { Button, ButtonPrimitive, buttonVariants, type ButtonProps }
