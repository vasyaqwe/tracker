import { useAuth } from "@/auth/hooks"
import { cn } from "@/ui/utils"
import * as React from "react"
import { Subs } from "react-sub-unsub"
import type { Timer } from "react-use-precision-timer"

const RENDER_INTERVAL = 1000

export function TimerRenderer({
   timer,
   className,
   ...props
}: {
   timer: Timer
} & React.ComponentProps<"span">) {
   const [, setRenderTime] = React.useState(Date.now())
   const auth = useAuth()

   React.useEffect(() => {
      return () => {
         const startTime = timer.getElapsedRunningTime().toString()
         localStorage.setItem(
            `${auth.project.id}_start_time`,
            startTime === "0" ? "null" : startTime,
         )
      }
   }, [timer.getElapsedRunningTime(), auth.project.id])

   React.useEffect(() => {
      const subs = new Subs()
      subs.setInterval(
         () => setRenderTime(new Date().getTime()),
         RENDER_INTERVAL,
      )
      return subs.createCleanup()
   }, [RENDER_INTERVAL])

   function formatTime(ms: number): string {
      const seconds = Math.floor(ms / 1000)
      const hours = Math.floor(seconds / 3600)
      const minutes = Math.floor((seconds % 3600) / 60)
      const remainingSeconds = seconds % 60

      const pad = (num: number): string => num.toString().padStart(2, "0")

      return `${pad(hours)}:${pad(minutes)}:${pad(remainingSeconds)}`
   }

   return (
      <span
         className={cn("inline-block font-mono tabular-nums", className)}
         {...props}
      >
         {formatTime(timer.getElapsedRunningTime())}
      </span>
   )
}
