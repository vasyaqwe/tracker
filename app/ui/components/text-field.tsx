import type * as React from "react"

import {
   FieldGroup,
   type FieldProps,
   Input,
   Label,
} from "@/ui/components/field"
import { cn } from "@/ui/utils"
import type { TextInputDOMProps } from "@react-types/shared"
import {
   TextField as TextFieldPrimitive,
   type TextFieldProps as TextFieldPrimitiveProps,
} from "react-aria-components"

type BaseTextFieldProps = TextFieldPrimitiveProps &
   FieldProps & {
      prefix?: React.ReactNode
      suffix?: React.ReactNode
      isPending?: boolean
      className?: string
   }

type RevealableTextFieldProps = BaseTextFieldProps & {
   isRevealable: true
   type: "password"
}

type NonRevealableTextFieldProps = BaseTextFieldProps & {
   isRevealable?: never
   type?: Exclude<TextInputDOMProps["type"], "password">
}

type TextFieldProps = RevealableTextFieldProps | NonRevealableTextFieldProps

function TextField({
   placeholder,
   label,
   description,
   errorMessage,
   prefix,
   suffix,
   isPending,
   className,
   isRevealable,
   type,
   ...props
}: TextFieldProps) {
   return (
      <TextFieldPrimitive
         type={"text"}
         {...props}
         className={cn(className)}
      >
         {label && <Label>{label}</Label>}
         <FieldGroup
            data-loading={isPending ? "true" : undefined}
            className={cn({ className })}
         >
            {prefix ? <span data-slot="prefix">{prefix}</span> : null}
            <Input placeholder={placeholder} />
            {suffix ? <span data-slot="suffix">{suffix}</span> : null}
         </FieldGroup>
         {/* <FieldError>{errorMessage}</FieldError> */}
      </TextFieldPrimitive>
   )
}

export { TextField, TextFieldPrimitive, type TextFieldProps }
