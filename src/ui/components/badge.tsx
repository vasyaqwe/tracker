import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "cva"
import { cn } from "@/ui/utils"

const _BADGE_DEFAULT_TAG = "button" satisfies React.ElementType

const badge = cva({
   base: [
      "inline-flex items-center justify-center whitespace-nowrap rounded-full",
   ],
   variants: {
      variant: {
         default: "bg-surface-3 text-surface-11",
         secondary: "bg-white border",
         success: "bg-green-3 text-green-11",
         warning: "bg-amber-3 text-amber-11",
         destructive: "bg-red-3 text-red-11",
      },
      size: {
         xs: "h-6 px-1.5 gap-1 text-xs [&_svg:not([class*='size-'])]:size-3",
         sm: "h-6.5 px-2 gap-1.5 text-[0.7825rem] [&_svg:not([class*='size-'])]:size-3.5",
         md: "h-7 px-2.5 gap-1.5 text-sm [&_svg:not([class*='size-'])]:size-4",
         lg: "h-8 px-2.5 gap-1.5 text-sm [&_svg:not([class*='size-'])]:size-4",
      },
      kind: {
         default: "",
         icon: "px-0! aspect-square w-auto justify-center",
         "with-icon": "",
      },
   },
   defaultVariants: {
      variant: "default",
      size: "md",
      kind: "default",
   },
   compoundVariants: [
      {
         size: "xs",
         kind: "with-icon",
         className:
            "gap-1.5 [&>:is(svg,[data-slot=stack]):first-child]:-ml-0.5 [&>:is(svg,[data-slot=stack]):last-child]:-mr-0.75",
      },
      {
         size: "sm",
         kind: "with-icon",
         className:
            "gap-1.75 [&>:is(svg,[data-slot=stack]):first-child]:-ml-0.5 [&>:is(svg,[data-slot=stack]):last-child]:-mr-0.75",
      },
      {
         size: "md",
         kind: "with-icon",
         className:
            "gap-2 [&>:is(svg,[data-slot=stack]):first-child]:-ml-0.5 [&>:is(svg,[data-slot=stack]):last-child]:-mr-0.75",
      },
      {
         size: "lg",
         kind: "with-icon",
         className:
            "gap-2 [&>:is(svg,[data-slot=stack]):first-child]:-ml-0.75 [&>:is(svg,[data-slot=stack]):last-child]:-mr-0.5",
      },
   ],
})

interface Props
   extends useRender.ComponentProps<typeof _BADGE_DEFAULT_TAG>,
      VariantProps<typeof badge> {}

export function Badge({
   render,
   className,
   kind,
   variant,
   size,
   ...props
}: Props) {
   const defaultProps: useRender.ElementProps<typeof _BADGE_DEFAULT_TAG> = {
      className: cn(badge({ variant, size, kind, className })),
      ["data-slot" as string]: "badge",
   }

   return useRender({
      defaultTagName: _BADGE_DEFAULT_TAG,
      render,
      props: mergeProps<typeof _BADGE_DEFAULT_TAG>(defaultProps, props),
   })
}
