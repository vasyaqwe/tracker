import { Icons } from "@/ui/components/icons"
import { useUIStore } from "@/ui/store"
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
   const isMobile = useUIStore().isMobile

   return (
      <NumberFieldPrimitive
         {...props}
         className={ctr(className, "group flex flex-col")}
      >
         <Label>{label}</Label>
         <FieldGroup
            className={
               "flex h-9 w-full overflow-hidden rounded-[11px] border border-border bg-background text-base outline-2 outline-transparent transition-all data-[disabled=true]:border-foreground/10 focus-within:border-primary/90 data-[disabled=true]:bg-border/40 focus-within:bg-muted/60 md:pl-3 data-[disabled=true]:text-foreground/70 focus-within:outline-primary/30"
            }
         >
            {(renderProps) => (
               <>
                  <div
                     aria-hidden={!isMobile}
                     className={fieldBorderVariants({
                        ...renderProps,
                        className:
                           "grid h-9 place-content-center border-border border-e md:hidden",
                     })}
                  >
                     <StepperButton
                        className={"h-9"}
                        slot="decrement"
                     />
                  </div>
                  <Input
                     className="!outline-none !border-none !bg-transparent p-0 tabular-nums max-md:pl-2"
                     placeholder={placeholder}
                  />
                  <div
                     className={fieldBorderVariants({
                        ...renderProps,
                        className:
                           "grid h-9 place-content-center border-border border-s",
                     })}
                  >
                     <StepperButton
                        aria-hidden={!isMobile}
                        slot="increment"
                        className={"h-9 md:hidden"}
                     />
                     <div className="flex h-full flex-col max-md:hidden">
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
            <Icons.chevronUp className="size-5 md:size-4" />
         ) : (
            <Icons.chevronDown className="size-5 md:size-4" />
         )
      ) : slot === "increment" ? (
         <Icons.plus className="size-5 md:size-4" />
      ) : (
         <Icons.minus className="size-5 md:size-4" />
      )
   return (
      <Button
         className={cn(
            "!px-2 md:!px-1.5 data-[disabled=true]:!bg-border/40 h-6 cursor-default bg-background text-foreground/70 transition-colors data-[disabled=true]:cursor-not-allowed hover:bg-elevated",
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
