import { cr, ctr } from "@/ui/utils"
import { cva } from "class-variance-authority"
import * as React from "react"
import type {
   FieldErrorProps,
   GroupProps,
   InputProps,
   TextFieldProps as TextFieldPrimitiveProps,
   ValidationResult,
} from "react-aria-components"
import {
   FieldError as FieldErrorPrimitive,
   Group,
   Input as InputPrimitive,
} from "react-aria-components"

interface FieldProps {
   label?: string
   placeholder?: string
   description?: string
   errorMessage?: string | ((validation: ValidationResult) => string)
   "aria-label"?: TextFieldPrimitiveProps["aria-label"]
   "aria-labelledby"?: TextFieldPrimitiveProps["aria-labelledby"]
}

const fieldBorderStyles = cva(
   "forced-colors:border-[Highlight] group-focus-within:border-ring/85",
   {
      variants: {
         isInvalid: {
            true: "border-danger/70 forced-colors:border-[Mark] group-focus-within:border-danger/70",
         },
      },
   },
)

const fieldGroupPrefixStyles = cva([
   "flex items-center group-invalid:border-danger group-disabled:bg-secondary group-disabled:opacity-50 group-invalid:focus-within:ring-danger/20",
   "has-[[data-slot=prefix]]:-mx-0.5 has-[[data-slot=suffix]]:-mx-0.5",
   "[&_button]:h-8 [&_button]:after:rounded-[calc(theme(borderRadius.md)-1px)] [&_button]:before:rounded-[calc(theme(borderRadius.md)-1px)] [&_button]:rounded-md dark:[&_button]:after:rounded-md [&_button]:px-2.5",
   "[&>[role=progressbar]]:mr-2.5 [&>[data-slot=prefix]>button]:ml-[-7px] [&>[data-slot=prefix]]:ml-2.5 [&>[data-slot=prefix]]:text-muted-fg",
   "[&>[data-slot=suffix]>button]:mr-[-7px] [&>[data-slot=suffix]]:mr-2.5 [&>[data-slot=suffix]]:text-muted-fg",
])

const fieldGroupStyles = cva({
   base: [
      "group flex h-10 items-center overflow-hidden rounded-lg border border-input bg-bg transition [&>[data-slot=icon]]:shrink-0 forced-colors:bg-[Field]",
   ],
   variants: {
      isDisabled: {
         true: "bg-secondary opacity-50",
      },
      isInvalid: {
         false: "focus-within:border-ring/85 focus-within:ring-4 focus-within:ring-ring/20",
         true: "border-danger focus-within:border-danger focus-within:ring-4 focus-within:ring-danger/20",
      },
   },
})

const FieldError = ({ className, ...props }: FieldErrorProps) => {
   return (
      <FieldErrorPrimitive
         {...props}
         className={ctr(className, "text-danger text-sm")}
      />
   )
}

const FieldGroup = ({ className, ...props }: GroupProps) => {
   return (
      <Group
         {...props}
         className={cr(className, (className, renderProps) =>
            fieldGroupStyles({ ...renderProps, className }),
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
               "block h-9 w-full appearance-none rounded-[11px] border border-border bg-secondary px-3 text-base outline-2 outline-transparent transition-all focus:border-primary/90 placeholder:text-foreground/40 focus:outline-primary/30",
            )}
         />
      )
   },
)
Input.displayName = "Input"

export {
   fieldBorderStyles,
   FieldGroup,
   fieldGroupPrefixStyles,
   fieldGroupStyles,
   Input,
   InputPrimitive,
   type FieldProps,
   FieldError,
}
