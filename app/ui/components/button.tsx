import { cr } from "@/ui/primitive"
import { type VariantProps, cva } from "class-variance-authority"
import * as React from "react"
import {
   Button as ButtonPrimitive,
   type ButtonProps as ButtonPrimitiveProps,
} from "react-aria-components"

const buttonVariants = cva(
   [
      "inline-flex items-center justify-center gap-1.5 whitespace-nowrap outline-none",
      "[--btn-icon:var(--color-icon)]",
      "[&>[data-slot=icon]]:size-4 [&>[data-slot=icon]]:shrink-0 [&>[data-slot=icon]]:text-[--btn-icon]",
   ],
   {
      variants: {
         intent: {
            primary: ["bg-primary text-primary-foreground hover:bg-primary/90"],
         },
         appearance: {
            solid: ["border-transparent"],
         },
         size: {
            md: "h-9 rounded-[11px] px-2 text-base",
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
         appearance: "solid",
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
         appearance,
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
                  appearance,
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
