import { cva } from "cva"

export const menuItem = cva({
   base: [
      "flex h-8 cursor-pointer whitespace-nowrap select-none items-center gap-2 rounded-[calc(var(--popup-radius)-var(--popup-padding)+0.1rem)] px-2.25 text-sm transition-colors focus-visible:outline-hidden data-highlighted:bg-surface-3 data-popup-open:bg-surface-3 data-highlighted:outline-none data-highlighted:outline-hidden [&_svg]:size-4",
   ],
   variants: {
      variant: {
         default:
            "text-foreground/90 data-highlighted:text-foreground [&>svg:not([class*='text-'])]:text-foreground/80 data-highlighted:[&>svg:not([class*='text-'])]:text-foreground",
         checkbox:
            "text-foreground/90 data-highlighted:text-foreground flex min-w-[calc(var(--anchor-width)+1.25rem)] items-center gap-2",
         destructive:
            "text-foreground/90 data-highlighted:bg-red-9 data-highlighted:text-white [&>svg]:text-foreground/80 data-highlighted:[&>svg]:text-white",
      },
   },
   defaultVariants: {
      variant: "default",
   },
})
