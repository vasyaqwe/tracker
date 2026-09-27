import { Field as FieldPrimitive } from "@base-ui/react/field"
import type { VariantProps } from "cva"
import { input } from "@/ui/components/input/style"
import { useIsMobile } from "@/ui/hooks/use-is-mobile"
import { cn } from "@/ui/utils"

function Root({
   className,
   children,
   ...props
}: React.ComponentProps<typeof FieldPrimitive.Root>) {
   return (
      <FieldPrimitive.Root
         className={cn("relative w-full", className)}
         {...props}
      >
         {children}
      </FieldPrimitive.Root>
   )
}

function ErrorComponent({ className, ...props }: React.ComponentProps<"div">) {
   return (
      <FieldPrimitive.Error
         className={cn("mt-1 pl-1 text-red-9 text-xs", className)}
         {...props}
      />
   )
}

function Label({
   className,
   ...props
}: React.ComponentProps<typeof FieldPrimitive.Label>) {
   return (
      <FieldPrimitive.Label
         className={cn("mb-1 inline-block text-sm", className)}
         {...props}
      />
   )
}

type FieldControlProps = Omit<
   React.ComponentProps<typeof FieldPrimitive.Control>,
   "size"
> &
   VariantProps<typeof input>

const ControlUnstyled = FieldPrimitive.Control

function Control({
   className,
   variant,
   size,
   autoFocus,
   ...props
}: FieldControlProps) {
   const isMobile = useIsMobile()

   return (
      <FieldPrimitive.Control
         autoFocus={autoFocus && !isMobile}
         className={cn(
            input({
               variant,
               size,
               className,
            }),
         )}
         {...props}
      />
   )
}

function Description({
   className,
   ...props
}: React.ComponentProps<typeof FieldPrimitive.Description>) {
   return (
      <FieldPrimitive.Description
         className={cn("mt-1 text-muted/80 text-sm", className)}
         {...props}
      />
   )
}

function Group({ className, ...props }: React.ComponentProps<"div">) {
   return (
      <div
         className={cn("grid gap-5", className)}
         {...props}
      />
   )
}

function Tip({ className, ...props }: React.ComponentProps<"div">) {
   return (
      <span
         data-tip
         className={cn(
            "absolute inset-y-0 right-3 my-auto h-fit text-muted/80 text-sm group-has-[input[data-invalid]]:text-red-11/75",
            className,
         )}
         {...props}
      />
   )
}

export const Field = {
   Root,
   Label,
   Control,
   ControlUnstyled,
   Description,
   Group,
   Error: ErrorComponent,
   Tip,
}

export type { FieldControlProps }
