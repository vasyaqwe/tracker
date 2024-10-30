import { type ClassValue, clsx } from "clsx"
import { composeRenderProps } from "react-aria-components"
import { twMerge } from "tailwind-merge"

const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs))

function composeTailwindRenderProps<T>(
   className: string | ((v: T) => string) | undefined,
   tw: string | Array<string | undefined>,
): string | ((v: T) => string) {
   return composeRenderProps(className, (className) => twMerge(tw, className))
}

export {
   cn,
   composeTailwindRenderProps,
   composeTailwindRenderProps as ctr,
   composeRenderProps as cr,
}
