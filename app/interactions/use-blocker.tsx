import * as React from "react"

export function useBlocker(shouldShow: boolean) {
   React.useEffect(() => {
      const handleBeforeUnload = (event: BeforeUnloadEvent) => {
         if (shouldShow) {
            event.preventDefault()
            // biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
            return (event.returnValue = true)
         }
      }

      window.addEventListener("beforeunload", handleBeforeUnload)

      return () => {
         window.removeEventListener("beforeunload", handleBeforeUnload)
      }
   }, [shouldShow])
}
