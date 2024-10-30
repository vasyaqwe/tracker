import { Icons } from "@/ui/components/icons"
import { cn, cr, ctr } from "@/ui/utils"
import { cva } from "class-variance-authority"
import type * as React from "react"
import {
   CheckboxGroup as CheckboxGroupPrimitive,
   type CheckboxGroupProps as CheckboxGroupPrimitiveProps,
   Checkbox as CheckboxPrimitive,
   type CheckboxProps as CheckboxPrimitiveProps,
   type ValidationResult,
} from "react-aria-components"
import { Label } from "./field"

type CheckboxGroupProps = Omit<CheckboxGroupPrimitiveProps, "children"> & {
   label?: string
   children?: React.ReactNode
   description?: string
   errorMessage?: string | ((validation: ValidationResult) => string)
}

const CheckboxGroup = (props: CheckboxGroupProps) => {
   return (
      <CheckboxGroupPrimitive
         {...props}
         className={ctr(props.className, "flex flex-col gap-y-2")}
      >
         {props.children}
      </CheckboxGroupPrimitive>
   )
}

const checkboxVariants = cva(
   "group flex items-center gap-2 text-sm transition",
   {
      variants: {
         isDisabled: {
            false: "opacity-100",
            true: "opacity-50",
         },
      },
   },
)

const boxVariants = cva(
   "flex size-4 shrink-0 items-center justify-center rounded-[5px] border border-foreground/20 [&>[data-slot=icon]]:size-3",
   {
      variants: {
         isSelected: {
            false: "bg-elevated",
            true: ["border-primary/70 bg-primary text-primary-foreground", ""],
         },
         isFocused: {
            true: ["border-primary/70 ring-4 ring-primary/20", ""],
         },
         isInvalid: {
            true: "",
         },
      },
   },
)

type CheckboxProps = CheckboxPrimitiveProps & {
   description?: string
   label?: string
}

const Checkbox = ({ className, ...props }: CheckboxProps) => {
   return (
      <CheckboxPrimitive
         {...props}
         className={cr(className, (className, renderProps) =>
            checkboxVariants({ ...renderProps, className }),
         )}
      >
         {({ isSelected, isIndeterminate, ...renderProps }) => (
            <div
               className={cn(
                  "flex gap-x-2",
                  props.description ? "items-start" : "items-center",
               )}
            >
               <div
                  className={boxVariants({
                     ...renderProps,
                     isSelected: isSelected || isIndeterminate,
                     className: props.description ? "mt-1" : "mt-px",
                  })}
               >
                  {isIndeterminate ? (
                     <Icons.minus />
                  ) : isSelected ? (
                     <Icons.check />
                  ) : null}
               </div>

               <div className="flex flex-col gap-1">
                  <>
                     {props.label ? (
                        <Label>{props.label}</Label>
                     ) : (
                        props.children
                     )}
                  </>
               </div>
            </div>
         )}
      </CheckboxPrimitive>
   )
}

export { Checkbox, CheckboxGroup }
