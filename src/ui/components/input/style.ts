import { cva } from "cva"

export const input = cva({
   base: ["w-full rounded-full outline-hidden transition disabled:opacity-70"],
   variants: {
      variant: {
         default:
            "shadow-elevated border border-transparent bg-white placeholder:text-foreground/50 focus:border-primary-10 data-invalid:border-destructive data-invalid:focus:border-destructive data-invalid:placeholder:text-destructive/75",
         unset: "h-auto bg-transparent placeholder:text-foreground/50 rounded-none",
      },
      size: {
         sm: "h-6 px-2 [[data-slot=input-icon]+&]:pl-7 text-xs [[type=time]]:px-2",
         md: "h-7 px-2.5 text-sm [[type=time]]:px-2.5",
         lg: "h-8 px-3 text-sm [[type=time]]:px-3",
         xl: "h-9 px-4 text-sm [[type=time]]:px-3",
         "2xl": "h-10 px-5 text-base [[type=time]]:px-3",
      },
   },
   defaultVariants: {
      variant: "default",
      size: "md",
   },
   compoundVariants: [{ variant: "unset", className: "px-0" }],
})
