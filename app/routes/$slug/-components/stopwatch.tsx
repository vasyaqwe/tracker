import { useBlocker } from "@/interactions/use-blocker"
import { useLocalStorage } from "@/interactions/use-local-storage"
import * as summary from "@/summary/functions"
import { useInsertSummary } from "@/summary/hooks/use-insert-issue"
import { summaryListQuery } from "@/summary/queries"
import { TimerRenderer } from "@/timer"
import { Button } from "@/ui/components/button"
import { Icons } from "@/ui/components/icons"
import { Kbd } from "@/ui/components/kbd"
import { useIsClient } from "@/ui/hooks/use-is-client"
import { useAuth } from "@/user/hooks"
import { calculateAmountEarned, millisToMinutes } from "@/utils/format"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useServerFn } from "@tanstack/start"
import { useEffect, useState } from "react"
import { useHotkeys } from "react-hotkeys-hook"
import { useTimer } from "react-use-precision-timer"

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

   useEffect(() => {
      if (startTime) {
         timer.start(Date.now() - +startTime)
      }
   }, [])

   const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
   useBlocker(hasUnsavedChanges)

   const { insertSummaryToQueryData } = useInsertSummary()
   const insertFn = useServerFn(summary.insert)
   const insert = useMutation({
      mutationFn: insertFn,
      onMutate: async (input) => {
         await queryClient.cancelQueries(summaryListQuery({ projectId }))

         const data = queryClient.getQueryData(
            summaryListQuery({ projectId }).queryKey,
         )

         insertSummaryToQueryData({ input })

         return { data }
      },
      onSuccess: () => {
         setStartTime(null)
         timer.stop()
         setHasUnsavedChanges(false)
         queryClient.invalidateQueries(summaryListQuery({ projectId }))
      },
   })
   const start = () => {
      timer.start()
      setHasUnsavedChanges(true)
   }

   const stop = () => {
      const elapsedMs = timer.getElapsedRunningTime()

      const durationMinutes = millisToMinutes(elapsedMs)

      if (durationMinutes === 0) {
         setStartTime(null)
         setHasUnsavedChanges(false)
         return timer.stop()
      }

      insert.mutate({
         amountEarned: calculateAmountEarned(elapsedMs, project.rate).toFixed(
            2,
         ),
         projectId,
         durationMinutes,
      })
   }

   useHotkeys("c", () => (timer.isRunning() ? stop() : start()))

   const { isClient } = useIsClient()
   if (!isClient) return null

   return (
      <div className="-translate-x-1/2 fixed bottom-5 left-1/2 flex w-[163px] animate-slide-up items-center rounded-full bg-popover text-popover-foreground">
         {timer.isRunning() ? (
            <div className="flex h-11 w-full items-center pr-1.5 pl-5">
               <TimerRenderer
                  timer={timer}
                  className="mx-auto text-lg"
               />
               <Button
                  className={"ml-auto rounded-full"}
                  intent={"destructive"}
                  size={"icon"}
                  aria-label="Stop session"
                  onPress={stop}
               >
                  <Icons.xMark className="size-5" />
               </Button>
            </div>
         ) : (
            <button
               className="h-11 px-5"
               onClick={start}
            >
               <span>
                  Start session <Kbd className="ml-1">C</Kbd>
               </span>
            </button>
         )}
      </div>
   )
}
