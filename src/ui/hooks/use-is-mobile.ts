import { useSyncExternalStore } from "react"

const QUERY = "(width < 48rem)"

const subscribe = (onChange: () => void) => {
   const mql = window.matchMedia(QUERY)
   mql.addEventListener("change", onChange)
   return () => mql.removeEventListener("change", onChange)
}

export function useIsMobile() {
   return useSyncExternalStore(
      subscribe,
      () => window.matchMedia(QUERY).matches,
      () => false,
   )
}
