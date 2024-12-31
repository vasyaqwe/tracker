import * as React from "react"
import { useTimer } from "react-use-precision-timer"

export function useCountdownTimer({
   initialTime,
   autoStart = false,
   onTimeUp,
}: {
   initialTime: number // in seconds
   autoStart?: boolean
   onTimeUp?: () => void
}) {
   const [timeLeft, setTimeLeft] = React.useState(initialTime * 1000)
   const [isTimeUp, setIsTimeUp] = React.useState(false)
   const [isRunning, setIsRunning] = React.useState(autoStart)
   const timer = useTimer({ delay: 100 })

   const updateTimer = React.useCallback(() => {
      const newTime = initialTime * 1000 - timer.getElapsedRunningTime()
      setTimeLeft(newTime > 0 ? newTime : 0)
      const isTimeUp = newTime <= 0
      if (isTimeUp) {
         onTimeUp?.()
         setIsTimeUp(true)
         setIsRunning(false)
      }
   }, [initialTime, timer])

   React.useEffect(() => {
      let intervalId: ReturnType<typeof setInterval> | null = null

      if (isRunning) {
         timer.start()
         intervalId = setInterval(updateTimer, 100)
      } else if (intervalId) {
         timer.pause()
         clearInterval(intervalId)
      }

      return () => {
         timer.stop()
         if (intervalId) clearInterval(intervalId)
      }
   }, [isRunning, timer, updateTimer])

   const start = React.useCallback(() => {
      if (!isRunning) {
         setIsRunning(true)
      }
   }, [isRunning])

   const pause = React.useCallback(() => {
      if (isRunning) {
         setIsRunning(false)
      }
   }, [isRunning])

   const reset = React.useCallback(() => {
      timer.stop()
      setTimeLeft(initialTime * 1000)
      setIsRunning(autoStart)
      setIsTimeUp(false)
      if (autoStart) {
         timer.start()
      }
   }, [timer, initialTime, autoStart])

   return {
      timeLeft: Math.round(timeLeft / 1000),
      start,
      pause,
      reset,
      isTimeUp,
      isRunning,
   }
}
