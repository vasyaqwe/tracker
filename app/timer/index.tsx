import { cn } from "@/ui/utils"
import { useAuth } from "@/user/hooks"
import { type HTMLAttributes, useEffect, useState } from "react"
import { Subs } from "react-sub-unsub"
import type { Timer } from "react-use-precision-timer"

const RENDER_INTERVAL = 1000

export function TimerRenderer({
   timer,
   className,
   ...props
}: {
   timer: Timer
} & HTMLAttributes<HTMLSpanElement>) {
   const [, setRenderTime] = useState(Date.now())
   const { projectId } = useAuth()

   useEffect(() => {
      return () => {
         localStorage.setItem(
            `${projectId}_start_time`,
            timer.getElapsedRunningTime().toString(),
         )
      }
   }, [timer.getElapsedRunningTime()])

   useEffect(() => {
      const subs = new Subs()
      subs.setInterval(
         () => setRenderTime(new Date().getTime()),
         RENDER_INTERVAL,
      )
      return subs.createCleanup()
   }, [RENDER_INTERVAL])

   const formatTime = (time: number) => {
      const seconds = Math.floor((time / 1000) % 60)
      const minutes = Math.floor((time / 1000 / 60) % 60)
      const hours = Math.floor((time / 1000 / 60 / 60) % 24)

      return `${hours < 10 ? `0${hours}` : hours}:${
         minutes < 10 ? `0${minutes}` : minutes
      }:${seconds < 10 ? `0${seconds}` : seconds}`
   }

   return (
      <span
         className={cn("inline-block font-mono", className)}
         {...props}
      >
         {formatTime(timer.getElapsedRunningTime())}
      </span>
   )
}
