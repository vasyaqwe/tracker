import { cr } from "@/ui/utils"
import { type VariantProps, cva } from "class-variance-authority"
import * as React from "react"
import {
   Button as ButtonPrimitive,
   type ButtonProps as ButtonPrimitiveProps,
} from "react-aria-components"

const buttonVariants = cva(
   [
      "inline-flex items-center justify-center gap-1.5 whitespace-nowrap outline-none",
   ],
   {
      variants: {
         intent: {
            primary: ["bg-primary text-primary-foreground hover:bg-primary/90"],
            creative: [
               "bg-popover-elevated text-background hover:bg-emerald-400/20 hover:text-emerald-400",
            ],
            ghost: ["bg-transparent hover:bg-border/60"],
            destructive: [
               "bg-popover-elevated text-background hover:bg-red-500/20 hover:text-red-500",
            ],
         },
         size: {
            sm: "h-8 rounded-[11px] px-3 text-base",
            md: "h-9 rounded-[11px] px-3 text-base",
            icon: "size-8 rounded-[11px]",
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
   (
      {
         className,
         intent,
         size,
         isDisabled,
         isPending,
         isFocusVisible,
         ...props
      },
      ref,
   ) => {
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
