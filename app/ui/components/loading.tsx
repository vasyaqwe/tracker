import { cn } from "@/ui/utils"
import { type VariantProps, cva } from "class-variance-authority"
import type * as React from "react"

const loadingVariants = cva("relative block opacity-75", {
   variants: {
      size: {
         sm: "size-[22px]",
         md: "size-[26px]",
         lg: "size-7",
      },
   },
   defaultVariants: {
      size: "md",
   },
})

export function Loading({
   className,
   size,
   ...props
}: React.HTMLAttributes<HTMLOrSVGElement> &
   VariantProps<typeof loadingVariants>) {
   return (
      <svg
         className={cn(
            loadingVariants({ size, className }),
            "animate-spin",
            className,
         )}
         viewBox="0 0 24 24"
         fill="none"
         xmlns="http://www.w3.org/2000/svg"
         {...props}
      >
         <path
            d="M12 4.75V6.25"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
         />
         <path
            d="M17.1475 6.8525L16.0625 7.9375"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
         />
         <path
            d="M19.25 12H17.75"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
         />
         <path
            d="M17.1475 17.1475L16.0625 16.0625"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
         />
         <path
            d="M12 17.75V19.25"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
         />
         <path
            d="M6.8525 17.1475L7.9375 16.0625"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
         />
         <path
            d="M4.75 12H6.25"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
         />
         <path
            d="M6.8525 6.8525L7.9375 7.9375"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
         />
      </svg>
   )
}
