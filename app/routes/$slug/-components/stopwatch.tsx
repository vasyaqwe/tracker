import { useBlocker } from "@/interactions/use-blocker"
import { useLocalStorage } from "@/interactions/use-local-storage"
import { useSound } from "@/interactions/use-sound"
import * as summary from "@/summary/functions"
import { useInsertSummary } from "@/summary/hooks/use-insert-summary"
import { summaryListQuery } from "@/summary/queries"
import { TimerRenderer } from "@/timer"
import { useTimerStore } from "@/timer/store"
import { Button } from "@/ui/components/button"
import { useIsClient } from "@/ui/hooks/use-is-client"
import { useAuth } from "@/user/hooks"
import { calculateAmountEarned, millisToMinutes } from "@/utils/format"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useServerFn } from "@tanstack/start"
import { useEffect } from "react"
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

   const isRunning = useTimerStore().isRunning
   useBlocker(isRunning)

   useEffect(() => {
      if (startTime) {
         timer.start(Date.now() - +startTime)
         useTimerStore.setState({ isRunning: true })
      }
   }, [])

   const sound = useSound("/sound/tap.wav")

   const { insertSummaryToQueryData } = useInsertSummary()
   const insertFn = useServerFn(summary.insert)
   const insert = useMutation({
      mutationFn: insertFn,
      onMutate: async (input) => {
         setStartTime(null)
         timer.stop()
         sound.play()

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
         useTimerStore.setState({ isRunning: false })
         queryClient.invalidateQueries(summaryListQuery({ projectId }))
      },
   })

   const start = () => {
      timer.start()
      useTimerStore.setState({ isRunning: true })
      sound.play()
   }

   const stop = () => {
      const elapsedMs = timer.getElapsedRunningTime()
      const durationMinutes = millisToMinutes(elapsedMs)

      match(durationMinutes)
         .with(0, () => {
            setStartTime(null)
            useTimerStore.setState({ isRunning: false })
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

   useHotkeys("c", () => (timer.isRunning() ? stop() : start()))

   const { isClient } = useIsClient()
   if (!isClient) return null

   return (
      <div className="-translate-x-1/2 fixed bottom-5 left-1/2 flex h-[46px] w-[201px] animate-slide-up items-center items-center rounded-full bg-popover pr-1.5 pl-5 text-popover-foreground">
         {timer.isRunning() ? (
            <>
               <TimerRenderer
                  timer={timer}
                  className="mr-4 text-xl"
               />
               <Button
                  className={"min-w-[60px] rounded-full"}
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
                  className={"min-w-[60px] rounded-full"}
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
