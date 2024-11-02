import { cn, cr, ctr } from "@/ui/utils"
import { cva } from "class-variance-authority"
import * as React from "react"
import type {
   FieldErrorProps,
   GroupProps,
   InputProps,
   LabelProps,
   TextFieldProps as TextFieldPrimitiveProps,
   ValidationResult,
} from "react-aria-components"
import {
   FieldError as FieldErrorPrimitive,
   Group,
   Input as InputPrimitive,
   Label as LabelPrimitive,
} from "react-aria-components"

type FieldProps = {
   label?: string
   placeholder?: string
   description?: string
   errorMessage?: string | ((validation: ValidationResult) => string)
   "aria-label"?: TextFieldPrimitiveProps["aria-label"]
   "aria-labelledby"?: TextFieldPrimitiveProps["aria-labelledby"]
}

const fieldBorderVariants = cva("group-focus-within:border-ring/85", {
   variants: {
      isInvalid: {
         true: "",
      },
   },
})

const fieldGroupVariants = cva({
   base: ["group flex h-10 items-center"],
   variants: {
      isDisabled: {
         true: "opacity-50",
      },
      isInvalid: {
         false: "",
         true: "",
      },
   },
})

function FieldError({ className, ...props }: FieldErrorProps) {
   return (
      <FieldErrorPrimitive
         {...props}
         className={ctr(className, "mt-1 text-destructive text-sm")}
      />
   )
}

function FieldGroup({ className, ...props }: GroupProps) {
   return (
      <Group
         {...props}
         className={cr(className, (className, renderProps) =>
            fieldGroupVariants({ ...renderProps, className }),
         )}
      />
   )
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
   ({ className, ...props }, ref) => {
      return (
         <InputPrimitive
            ref={ref}
            {...props}
            className={ctr(
               className,
               "block h-9 w-full appearance-none rounded-[11px] border border-border bg-background px-3 text-base outline-2 outline-transparent transition-all disabled:border-foreground/10 focus:border-primary/90 disabled:bg-border/40 focus:bg-muted/60 disabled:text-foreground/70 placeholder:text-foreground/40 focus:outline-primary/30",
            )}
         />
      )
   },
)

function Label({ className, ...props }: LabelProps) {
   return (
      <LabelPrimitive
         {...props}
         className={cn(
            "mb-1 inline-block w-fit cursor-default text-foreground/70 text-sm peer-disabled:opacity-75",
            className,
         )}
      />
   )
}

export {
   fieldBorderVariants,
   FieldGroup,
   fieldGroupVariants,
   Input,
   InputPrimitive,
   type FieldProps,
   FieldError,
   Label,
}
