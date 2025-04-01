import tap from "@/assets/sound/tap.wav"
import { useAuth } from "@/auth/hooks"
import { millisToMinutes } from "@/date"
import { useBlocker } from "@/interactions/use-blocker"
import { useLocalStorage } from "@/interactions/use-local-storage"
import { useSound } from "@/interactions/use-sound"
import { insertSummary } from "@/summary/functions"
import { useInsertSummary } from "@/summary/hooks/use-insert-summary"
import { summaryListQuery } from "@/summary/queries"
import { calculateAmountEarned } from "@/summary/utils"
import { TimerRenderer } from "@/timer"
import { isTimerRunningAtom } from "@/timer/store"
import { Button } from "@/ui/components/button"
import { useIsClient } from "@/ui/hooks/use-is-client"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useServerFn } from "@tanstack/start"
import { useAtom } from "jotai"
import * as React from "react"
import { useHotkeys } from "react-hotkeys-hook"
import { useTimer } from "react-use-precision-timer"
import { toast } from "sonner"
import { match } from "ts-pattern"

export function Stopwatch() {
   const queryClient = useQueryClient()
   const { projectId, project } = useAuth()

   const [startTime, setStartTime] = useLocalStorage<string | null>(
      `${projectId}_start_time`,
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

   const { insertSummaryToQueryData } = useInsertSummary()
   const insertFn = useServerFn(insertSummary)
   const insert = useMutation({
      mutationFn: insertFn,
      onMutate: async (input) => {
         setStartTime(null)
         timer.stop()
         play()

         await queryClient.cancelQueries(summaryListQuery({ projectId }))

         const data = queryClient.getQueryData(
            summaryListQuery({ projectId }).queryKey,
         )

         insertSummaryToQueryData({
            input: {
               ...input.data,
               id: crypto.randomUUID(),
               createdAt: Date.now(),
            },
         })

         return { data }
      },
      onError: (_err, _data, context) => {
         queryClient.setQueryData(
            summaryListQuery({ projectId }).queryKey,
            context?.data,
         )
         toast.error("Failed to create summary")
      },
      onSettled: () => {
         setIsTimerRunning(false)
         queryClient.invalidateQueries(summaryListQuery({ projectId }))
      },
   })

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
            insert.mutate({
               data: {
                  amountEarned: calculateAmountEarned(
                     elapsedMs,
                     project.rate,
                  ).toFixed(2),
                  projectId,
                  durationMinutes,
               },
            })
         })
   }

   useHotkeys("c", () => (isTimerRunning ? stop() : start()))

   const { isClient } = useIsClient()
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
