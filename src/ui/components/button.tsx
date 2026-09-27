import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "cva"
import { Spinner } from "@/ui/components/spinner"
import { focus } from "@/ui/focus"
import { cn } from "@/ui/utils"

const button = cva({
   base: [
      "touch-hitbox inline-flex cursor-pointer items-center justify-center whitespace-nowrap rounded-full",
      "relative disabled:cursor-default disabled:opacity-75 transition [&_svg]:shrink-0",
      "data-indicated:before:block before:hidden before:absolute before:size-2 before:outline before:outline-white before:shadow-xs before:bg-primary-9 before:top-0 before:right-0 before:rounded-full",
      "data-pending:[-webkit-text-fill-color:transparent]",
      "data-pending:[&>*:not([data-slot=spinner])]:opacity-0",
      focus.base,
   ],
   variants: {
      variant: {
         primary: [
            "border border-primary-12 bg-primary-12 text-white hover:bg-primary-12/95",
            "shadow-xs shadow-primary-9/30",
            "inset-shadow-[0_1px_--theme(--color-white/15%)]",
         ],
         secondary: [
            "bg-white bg-clip-padding hover:bg-surface-2 data-popup-open:bg-surface-2 shadow-elevated",
         ],
         tertiary: [
            "bg-surface-3 hover:bg-surface-4 data-popup-open:bg-surface-4 text-foreground/90",
         ],
         ghost: "hover:bg-surface-3 aria-[current=page]:bg-surface-4 data-popup-open:bg-surface-4",
         "ghost-2":
            "hover:bg-surface-3 text-muted hover:text-foreground aria-[current=page]:text-foreground aria-[current=page]:bg-surface-4 data-popup-open:text-foreground data-popup-open:bg-surface-4",
         destructive: [
            "bg-destructive text-white hover:bg-destructive/90 border border-red-11",
            "shadow-xs shadow-destructive/30",
            "inset-shadow-[0_1px_--theme(--color-white/20%)]",
         ],
         success: [
            "bg-success text-white hover:bg-success/90 border border-green-11",
            "shadow-xs shadow-success/30",
            "inset-shadow-[0_1px_--theme(--color-white/20%)]",
         ],
         "sidebar-item":
            "flex group/sidebar-link w-full justify-start [&>svg]:size-4 whitespace-nowrap [&>svg]:shrink-0 grow items-center gap-1.5! h-7.5! px-2! hover:bg-surface-3 active:bg-surface-4 not-data-inactive:aria-[current=page]:bg-surface-4 rounded-[0.6rem] text-foreground/75 hover:text-foreground aria-[current=page]:text-foreground text-[0.8325rem]! font-[450]",
      },
      size: {
         xs: "h-6 px-2 text-xs [&_svg:not([class*='size-'])]:size-3.75",
         sm: "h-6.5 px-2.5 text-[0.825rem] [&_svg:not([class*='size-'])]:size-4",
         md: "h-7 px-2.5 [&_svg:not([class*='size-'])]:size-4 text-[0.825rem] md:text-xs",
         lg: "h-8 px-3 text-[0.825rem] [&_svg:not([class*='size-'])]:size-4.25",
         xl: "h-9 px-3 text-sm [&_svg:not([class*='size-'])]:size-5",
      },
      kind: {
         default: "",
         icon: "px-0! aspect-square w-auto justify-center",
         "with-icon": "",
      },
   },
   defaultVariants: {
      variant: "primary",
      size: "md",
      kind: "default",
   },
   compoundVariants: [
      {
         size: "md",
         kind: "icon",
         className: '[&_svg:not([class*="size-"])]:size-4.5',
      },
      {
         size: "xs",
         kind: "with-icon",
         className:
            "gap-1 [&>svg:first-child]:-ml-0.75 [&>svg:last-child:not([data-slot=spinner])]:-mr-0.75",
      },
      {
         size: "sm",
         kind: "with-icon",
         className:
            "gap-2 [&_svg:first-child]:-ml-0.5 [&_svg:last-child:not([data-slot=spinner])]:-mr-0.75",
      },
      {
         size: "md",
         kind: "with-icon",
         className:
            "gap-2 [&_svg:first-child]:-ml-0.5 [&_svg:last-child:not([data-slot=spinner])]:-mr-0.75",
      },
      {
         size: "lg",
         kind: "with-icon",
         className:
            "gap-2 [&_svg:first-child]:-ml-0.75 [&_svg:last-child:not([data-slot=spinner])]:-mr-0.5",
      },
      {
         size: "xl",
         kind: "with-icon",
         className: "gap-2",
      },
   ],
})

interface Props
   extends React.ComponentProps<"button">,
      VariantProps<typeof button> {
   pending?: boolean | undefined
   nativeButton?: ButtonPrimitive.Props["nativeButton"]
   render?: ButtonPrimitive.Props["render"]
   indicated?: boolean
}

export function Button({
   variant,
   children,
   size,
   kind,
   pending,
   disabled,
   className,
   indicated = false,
   ...props
}: Props) {
   return (
      <ButtonPrimitive
         data-slot="button"
         data-pending={pending ? "" : undefined}
         disabled={disabled ?? !!pending}
         className={cn(button({ variant, size, kind, className }))}
         data-indicated={indicated ? "" : undefined}
         {...props}
      >
         {children}
         {pending ? (
            <Spinner
               kind="overlay"
               size={size}
            />
         ) : null}
      </ButtonPrimitive>
   )
}
