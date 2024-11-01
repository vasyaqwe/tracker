import { Icons } from "@/ui/components/icons"
import { cn, ctr } from "@/ui/utils"
import {
   Button,
   type ButtonProps,
   NumberField as NumberFieldPrimitive,
   type NumberFieldProps as NumberFieldPrimitiveProps,
   type ValidationResult,
} from "react-aria-components"
import { FieldGroup, Input, Label, fieldBorderVariants } from "./field"

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
         <FieldGroup
            className={
               "flex h-9 w-full overflow-hidden rounded-[10px] border border-border bg-background pl-3 text-base outline-2 outline-transparent transition-all disabled:border-foreground/10 focus-within:border-primary/90 disabled:bg-border/40 focus-within:bg-muted/60 disabled:text-foreground/70 focus-within:outline-primary/30"
            }
         >
            {(renderProps) => (
               <>
                  <Input
                     className="!outline-none !border-none bg-transparent p-0 tabular-nums"
                     placeholder={placeholder}
                  />
                  <div
                     className={fieldBorderVariants({
                        ...renderProps,
                        className:
                           "grid h-9 place-content-center border-border border-s",
                     })}
                  >
                     <div className="flex h-full flex-col">
                        <StepperButton
                           slot="increment"
                           emblemType="default"
                           className="h-4 px-1"
                        />
                        <div
                           className={fieldBorderVariants({
                              ...renderProps,
                              className: "border-border border-b",
                           })}
                        />
                        <StepperButton
                           slot="decrement"
                           emblemType="default"
                           className="h-4 px-1"
                        />
                     </div>
                  </div>
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

const StepperButton = ({
   slot,
   className,
   emblemType = "default",
   ...props
}: StepperButtonProps) => {
   const icon =
      emblemType === "chevron" ? (
         slot === "increment" ? (
            <Icons.chevronUp className="size-4" />
         ) : (
            <Icons.chevronDown className="size-4" />
         )
      ) : slot === "increment" ? (
         <Icons.plus className="size-4" />
      ) : (
         <Icons.minus className="size-4" />
      )
   return (
      <Button
         className={cn(
            "!px-2 h-6 cursor-default text-foreground/70 transition-colors hover:bg-elevated",
            className,
         )}
         slot={slot}
         {...props}
      >
         {icon}
      </Button>
   )
}

export { NumberField, type NumberFieldProps }
