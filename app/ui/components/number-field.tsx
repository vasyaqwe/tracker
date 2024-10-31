import { Icons } from "@/ui/components/icons"
import { cn, ctr } from "@/ui/utils"
import {
   Button,
   type ButtonProps,
   NumberField as NumberFieldPrimitive,
   type NumberFieldProps as NumberFieldPrimitiveProps,
   type ValidationResult,
} from "react-aria-components"
import { FieldGroup, Input, Label } from "./field"

type NumberFieldProps = NumberFieldPrimitiveProps & {
   label?: string
   description?: string
   placeholder?: string
   errorMessage?: string | ((validation: ValidationResult) => string)
}

const NumberField = ({
   label,
   placeholder,
   description,
   className,
   errorMessage,
   ...props
}: NumberFieldProps) => {
   return (
      <NumberFieldPrimitive
         {...props}
         className={ctr(className, "group flex flex-col gap-1")}
      >
         <Label>{label}</Label>
         <FieldGroup>
            {(_renderProps) => (
               <>
                  <Input
                     className="tabular-nums"
                     placeholder={placeholder}
                  />
                  {/* <div
                     className={fieldBorderVariants({
                        ...renderProps,
                        className: "grid h-10 place-content-center border-s",
                     })}
                  >
                     <div className="flex h-full flex-col">
                        <StepperButton
                           slot="increment"
                           emblemType="default"
                           className="h-5 px-1"
                        />
                        <div
                           className={fieldBorderVariants({
                              ...renderProps,
                              className: "border-b",
                           })}
                        />
                        <StepperButton
                           slot="decrement"
                           emblemType="default"
                           className="h-5 px-1"
                        />
                     </div>
                  </div> */}
               </>
            )}
         </FieldGroup>
         {/* {description && <Description>{description}</Description>} */}
         {/* <FieldError>{errorMessage}</FieldError> */}
      </NumberFieldPrimitive>
   )
}

type StepperButtonProps = ButtonProps & {
   slot: "increment" | "decrement"
   emblemType?: "chevron" | "default"
   className?: string
}

const _StepperButton = ({
   slot,
   className,
   emblemType = "default",
   ...props
}: StepperButtonProps) => {
   const icon =
      emblemType === "chevron" ? (
         slot === "increment" ? (
            <Icons.chevronUp className="size-5" />
         ) : (
            <Icons.chevronDown className="size-5" />
         )
      ) : slot === "increment" ? (
         <Icons.plus />
      ) : (
         <Icons.minus />
      )
   return (
      <Button
         className={cn("h-10 cursor-default px-2", className)}
         slot={slot}
         {...props}
      >
         {icon}
      </Button>
   )
}

export { NumberField, type NumberFieldProps }
