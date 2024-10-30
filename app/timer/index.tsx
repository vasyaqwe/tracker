import { cn } from "@/ui/utils"
import type { HTMLAttributes } from "react"

export function TimerRenderer({
   time,
   className,
   richColors = true,
   ...props
}: {
   time: number
   richColors?: boolean
} & HTMLAttributes<HTMLSpanElement>) {
   const formatTime = (time: number) => {
      const seconds = Math.floor(time % 60)
      const minutes = Math.floor((time / 60) % 60)
      const hours = Math.floor(time / 3600)

      if (hours === 0)
         return `${minutes < 10 ? `0${minutes}` : minutes}:${
            seconds < 10 ? `0${seconds}` : seconds
         }
      `

      return `${hours < 10 ? `0${hours}` : hours}:${
         minutes < 10 ? `0${minutes}` : minutes
      }:${seconds < 10 ? `0${seconds}` : seconds}`
   }

   return (
      <span
         className={cn(
            "inline-block font-mono",
            className,
            richColors
               ? time < 10
                  ? "from-destructive to-destructive/60"
                  : time < 20
                    ? "from-yellow-500 to-yellow-500/60"
                    : ""
               : "text-green-500",
         )}
         {...props}
      >
         {formatTime(time)}
      </span>
   )
}
