import tap from "@/assets/sound/tap.wav"
import { useAuth } from "@/auth/hooks"
import { millisToMinutes } from "@/date"
import { useBlocker } from "@/interactions/use-blocker"
import { useLocalStorage } from "@/interactions/use-local-storage"
import { useSound } from "@/interactions/use-sound"
import { useInsertSummary } from "@/summary/hooks/use-insert-summary"
import { calculateAmountEarned } from "@/summary/utils"
import { TimerRenderer } from "@/timer"
import { isTimerRunningAtom } from "@/timer/store"
import { Button } from "@/ui/components/button"
import { useIsClient } from "@/ui/hooks/use-is-client"
import { useAtom } from "jotai"
import * as React from "react"
import { useHotkeys } from "react-hotkeys-hook"
import { useTimer } from "react-use-precision-timer"
import { match } from "ts-pattern"

export function Stopwatch() {
   const auth = useAuth()

   const [startTime, setStartTime] = useLocalStorage<string | null>(
      `${auth.project.id}_start_time`,
      null,
   )

   const timer = useTimer({
      delay: 0,
   })

   const [isTimerRunning, setIsTimerRunning] = useAtom(isTimerRunningAtom)
   useBlocker(isTimerRunning)

   React.useEffect(() => {
      if (startTime) {
         timer.start(Date.now() - +startTime)
         setIsTimerRunning(true)
      }
   }, [])

   const [play] = useSound(tap)

   const insertSummary = useInsertSummary()

   const start = () => {
      timer.start()
      setIsTimerRunning(true)
      play()
   }

   const stop = () => {
      const elapsedMs = timer.getElapsedRunningTime()
      const durationMinutes = millisToMinutes(elapsedMs)

      match(durationMinutes)
         .with(0, () => {
            setStartTime(null)
            setIsTimerRunning(false)
            timer.stop()
         })
         .otherwise(() => {
            setStartTime(null)
            timer.stop()
            play()
            setIsTimerRunning(false)
            insertSummary.mutate({
               data: {
                  amountEarned: calculateAmountEarned(
                     elapsedMs,
                     auth.project.rate,
                  ).toFixed(2),
                  projectId: auth.project.id,
                  durationMinutes,
               },
            })
         })
   }

   useHotkeys("c", () => (isTimerRunning ? stop() : start()))

   const isClient = useIsClient()
   if (!isClient) return null

   return (
      <div className="-translate-x-1/2 fixed bottom-5 left-1/2 flex animate-slide-up items-center rounded-full bg-popover py-[5px] pr-[5px] pl-5 text-popover-foreground">
         {isTimerRunning ? (
            <>
               <TimerRenderer
                  timer={timer}
                  className="mr-4 text-xl"
               />
               <Button
                  className={"h-[34px] min-w-[60px] rounded-full"}
                  intent={"destructive-secondary"}
                  aria-label="Stop session"
                  onPress={stop}
               >
                  Stop
               </Button>
            </>
         ) : (
            <>
               <TimerRenderer
                  timer={timer}
                  className="mr-4 text-xl"
               />
               <Button
                  className={"h-[34px] min-w-[60px] rounded-full"}
                  intent={"creative"}
                  aria-label="Start session"
                  onPress={start}
               >
                  Start
               </Button>
            </>
         )}
      </div>
   )
}
