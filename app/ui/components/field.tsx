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

const fieldGroupPrefixVariants = cva([
   "flex items-center group-invalid:border-danger group-disabled:bg-secondary group-disabled:opacity-50 group-invalid:focus-within:ring-danger/20",
   "has-[[data-slot=prefix]]:-mx-0.5 has-[[data-slot=suffix]]:-mx-0.5",
   "[&_button]:h-8 [&_button]:after:rounded-[calc(theme(borderRadius.md)-1px)] [&_button]:before:rounded-[calc(theme(borderRadius.md)-1px)] [&_button]:rounded-md dark:[&_button]:after:rounded-md [&_button]:px-2.5",
   "[&>[role=progressbar]]:mr-2.5 [&>[data-slot=prefix]>button]:ml-[-7px] [&>[data-slot=prefix]]:ml-2.5 [&>[data-slot=prefix]]:text-muted-fg",
   "[&>[data-slot=suffix]>button]:mr-[-7px] [&>[data-slot=suffix]]:mr-2.5 [&>[data-slot=suffix]]:text-muted-fg",
])

const fieldGroupVariants = cva({
   base: ["group flex h-10 items-center"],
   variants: {
      isDisabled: {
         true: "bg-secondary opacity-50",
      },
      isInvalid: {
         false: "",
         true: "",
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
               "block h-9 w-full appearance-none rounded-[11px] border border-border bg-secondary px-3 text-base outline-2 outline-transparent transition-all focus:border-primary/90 placeholder:text-foreground/40 focus:outline-primary/30",
            )}
         />
      )
   },
)

const Label = ({ className, ...props }: LabelProps) => {
   return (
      <LabelPrimitive
         {...props}
         className={cn(
            "w-fit cursor-default font-medium text-secondary-fg text-sm",
            className,
         )}
      />
   )
}

export {
   fieldBorderVariants,
   FieldGroup,
   fieldGroupPrefixVariants,
   fieldGroupVariants,
   Input,
   InputPrimitive,
   type FieldProps,
   FieldError,
   Label,
}
