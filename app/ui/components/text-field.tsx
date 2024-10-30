import type * as React from "react"

import {
   FieldError,
   FieldGroup,
   type FieldProps,
   Input,
   fieldGroupPrefixStyles,
} from "@/ui/components/field"
import { cn } from "@/ui/utils"
import type { TextInputDOMProps } from "@react-types/shared"
import {
   TextField as TextFieldPrimitive,
   type TextFieldProps as TextFieldPrimitiveProps,
} from "react-aria-components"

type InputType = Exclude<TextInputDOMProps["type"], "password">

interface BaseTextFieldProps extends TextFieldPrimitiveProps, FieldProps {
   prefix?: React.ReactNode
   suffix?: React.ReactNode
   isPending?: boolean
   className?: string
}

interface RevealableTextFieldProps extends BaseTextFieldProps {
   isRevealable: true
   type: "password"
}

interface NonRevealableTextFieldProps extends BaseTextFieldProps {
   isRevealable?: never
   type?: InputType
}

type TextFieldProps = RevealableTextFieldProps | NonRevealableTextFieldProps

const TextField = ({
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
}: TextFieldProps) => {
   return (
      <TextFieldPrimitive
         type={"text"}
         {...props}
         className={cn(className)}
      >
         <FieldGroup
            data-loading={isPending ? "true" : undefined}
            className={fieldGroupPrefixStyles({ className })}
         >
            {prefix ? (
               <span
                  data-slot="prefix"
                  className="atrs x2e2"
               >
                  {prefix}
               </span>
            ) : null}
            <Input placeholder={placeholder} />
            {suffix ? (
               <span
                  data-slot="suffix"
                  className="atrs x2e2"
               >
                  {suffix}
               </span>
            ) : null}
         </FieldGroup>
         <FieldError>{errorMessage}</FieldError>
      </TextFieldPrimitive>
   )
}

export { TextField, TextFieldPrimitive, type TextFieldProps }
