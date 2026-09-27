import { cva, type VariantProps } from "cva"
import type { Dotm3x3_15 } from "@/ui/components/dotmatrix/dotm-3x3-15"
import { DotmCircular2 } from "@/ui/components/dotmatrix/dotm-circular-2"
import { cn } from "@/ui/utils"

const spinner = cva({
   base: ["block animate-spin opacity-90 text-current"],
   variants: {
      size: {
         xs: "size-3",
         sm: "size-3.25",
         md: "size-3.5",
         lg: "size-3.75",
         xl: "size-4",
         "2xl": "size-4.25",
      },
      kind: {
         default: "relative",
         inset: "inset-0 absolute m-auto -translate-y-6",
         overlay: "inset-0 absolute m-auto",
      },
   },
   defaultVariants: {
      size: "md",
      kind: "default",
   },
   compoundVariants: [
      {
         kind: "inset",
         className: "size-5",
      },
   ],
})

interface Props
   extends React.ComponentProps<"svg">,
      VariantProps<typeof spinner> {}

export function Spinner({ className, size, kind, ...props }: Props) {
   return (
      <svg
         viewBox="0 0 16 16"
         fill="none"
         xmlns="http://www.w3.org/2000/svg"
         data-slot="spinner"
         className={spinner({ size, kind, className })}
         {...props}
      >
         <circle
            cx="8"
            cy="8"
            r="7"
            stroke="currentColor"
            strokeOpacity="0.25"
            strokeWidth="1.75"
         />
         <circle
            cx="8"
            cy="8"
            r="7"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeDasharray="45"
            strokeDashoffset="30"
         />
      </svg>
   )
}

export function PageSpinner({
   className,
   ...props
}: React.ComponentProps<typeof Dotm3x3_15>) {
   return (
      <DotmCircular2
         size={28}
         dotSize={3.5}
         className={cn("absolute inset-0 m-auto", className)}
         {...props}
      />
   )
}
