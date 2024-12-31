import { useIsomorphicLayoutEffect } from "@/interactions/use-isomorphic-layout-effect"
import * as React from "react"

export function useEventCallback<Args extends unknown[], R>(
   fn: (...args: Args) => R,
): (...args: Args) => R
export function useEventCallback<Args extends unknown[], R>(
   fn: ((...args: Args) => R) | undefined,
): ((...args: Args) => R) | undefined
export function useEventCallback<Args extends unknown[], R>(
   fn: ((...args: Args) => R) | undefined,
): ((...args: Args) => R) | undefined {
   const ref = React.useRef<typeof fn>(() => {
      throw new Error("Cannot call an event handler while rendering.")
   })

   useIsomorphicLayoutEffect(() => {
      ref.current = fn
   }, [fn])

   return React.useCallback(
      (...args: Args) => ref.current?.(...args),
      [ref],
   ) as (...args: Args) => R
}
