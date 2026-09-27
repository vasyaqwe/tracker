import { NumberField as NumberFieldPrimitive } from "@base-ui/react/number-field"
import type { VariantProps } from "cva"
import { LOCALE } from "@/number"
import { input } from "@/ui/components/input/style"
import { useIsMobile } from "@/ui/hooks/use-is-mobile"
import { cn } from "@/ui/utils"

interface Props
   extends Omit<React.ComponentProps<typeof NumberFieldPrimitive.Root>, "size">,
      VariantProps<typeof input> {
   placeholder?: string | undefined
   inputClassName?: string | undefined
   currency?: string | undefined
}

export function NumberField({
   locale = LOCALE,
   currency,
   format = {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
      ...(currency && {
         style: "currency",
         currency,
         currencyDisplay: "narrowSymbol",
      }),
   },
   placeholder,
   autoFocus,
   className,
   inputClassName,
   variant,
   size,
   "aria-label": ariaLabel,
   ...props
}: Props) {
   const isMobile = useIsMobile()

   return (
      <NumberFieldPrimitive.Root
         locale={locale}
         format={format}
         inputMode="numeric"
         className={cn("w-full", className)}
         {...props}
      >
         <NumberFieldPrimitive.Group>
            <NumberFieldPrimitive.Input
               autoFocus={autoFocus && !isMobile}
               placeholder={placeholder}
               aria-label={ariaLabel}
               className={cn(input({ variant, size }), inputClassName)}
            />
         </NumberFieldPrimitive.Group>
      </NumberFieldPrimitive.Root>
   )
}
