import * as React from "react"

export function useDelayedValue<T>(value: T, delayTime: number): T {
   const [delayedValue, setDelayedValue] = React.useState<T>(value)

   React.useEffect(() => {
      let timeoutId: NodeJS.Timeout

      // Only delay if the new value is 0 and previous value was non-zero
      if (value === 0 && delayedValue !== 0) {
         timeoutId = setTimeout(() => {
            setDelayedValue(value)
         }, delayTime)
      } else {
         // Immediately update for all other cases
         setDelayedValue(value)
      }

      return () => clearTimeout(timeoutId)
   }, [value, delayTime, delayedValue])

   return delayedValue
}
