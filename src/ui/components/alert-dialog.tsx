import { AlertDialog as AlertDialogPrimitive } from "@base-ui/react/alert-dialog"
import type { VariantProps } from "cva"
import { Button } from "@/ui/components/button"
import { dialogPopup } from "@/ui/components/dialog/style"
import { cn } from "@/ui/utils"

const Root = AlertDialogPrimitive.Root
const Trigger = AlertDialogPrimitive.Trigger
const Close = AlertDialogPrimitive.Close
const Portal = AlertDialogPrimitive.Portal
const Backdrop = AlertDialogPrimitive.Backdrop

interface Props
   extends React.ComponentProps<typeof AlertDialogPrimitive.Popup>,
      VariantProps<typeof dialogPopup> {}

function Popup({ className, children, size = "sm", variant, ...props }: Props) {
   return (
      <Portal>
         <Backdrop className="fixed inset-0 bg-black/25 transition-all duration-200 data-ending-style:opacity-0 data-starting-style:opacity-0 data-ending-style:duration-200" />
         <AlertDialogPrimitive.Popup
            className={cn(
               dialogPopup({ size, variant, className }),
               "p-4 pt-3",
            )}
            {...props}
         >
            {children}
         </AlertDialogPrimitive.Popup>
      </Portal>
   )
}

function Title({
   className,
   ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Title>) {
   return (
      <AlertDialogPrimitive.Title
         className={cn("font-medium text-base tracking-[-3%]", className)}
         {...props}
      />
   )
}

function Description({
   className,
   ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Description>) {
   return (
      <AlertDialogPrimitive.Description
         className={cn("mt-1.5 text-muted text-sm", className)}
         {...props}
      />
   )
}

function Footer({ className, ...props }: React.ComponentProps<"div">) {
   return (
      <div
         className={cn("mt-5 flex justify-end gap-2", className)}
         {...props}
      />
   )
}

function Cancel(props: React.ComponentProps<typeof Button>) {
   return (
      <Close
         render={
            <Button
               variant={"secondary"}
               {...props}
            />
         }
      >
         {props.children ?? "Cancel"}
      </Close>
   )
}

function Action(props: React.ComponentProps<typeof Button>) {
   return (
      <Close
         render={
            <Button
               variant={"destructive"}
               {...props}
            />
         }
      >
         {props.children ?? "Delete"}
      </Close>
   )
}

export const AlertDialog = {
   Root,
   Trigger,
   Close,
   Popup,
   Title,
   Description,
   Footer,
   Cancel,
   Action,
}
