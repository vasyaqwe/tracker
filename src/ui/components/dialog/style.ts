import { cva } from "cva"

export const dialogPopup = cva({
   base: "group shadow-xl transition-all flex flex-col rounded-2xl bg-white data-nested:border has-data-drag-active:border-primary-10 has-data-drag-active:bg-primary-2 has-data-drag-active:ring-2 has-data-drag-active:ring-primary-10 has-data-drag-active:shadow-primary/10 [&>form]:flex [&>form]:flex-col [&>form]:min-h-0",
   variants: {
      variant: {
         default: [
            "md:max-h-[80svh] max-h-[94svh] duration-200 data-ending-style:scale-98 data-starting-style:scale-98 data-ending-style:opacity-0 data-starting-style:opacity-0",
            "md:-mt-6 -translate-x-1/2 -translate-y-1/2 fixed top-1/2 left-1/2 max-w-[calc(100vw-2.5rem)] will-change-transform",
         ],
      },
      size: {
         xs: "w-76",
         sm: "w-100",
         md: "w-120",
         lg: "w-146",
         xl: "w-180 rounded-[1.25rem]",
         "2xl": "w-210",
         "3xl": "w-232",
         "4xl": "w-284",
         viewport:
            "md:mt-0 mt-0 h-svh max-h-svh md:max-h-svh w-full max-w-full rounded-none transition-none",
      },
   },
   defaultVariants: {
      variant: "default",
      size: "md",
   },
})
