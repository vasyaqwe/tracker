import * as React from "react"

type PlayOptions = {
   id?: string
   playbackRate?: number
   forceSoundEnabled?: boolean
}

type HookOptions = {
   volume?: number
   playbackRate?: number
   soundEnabled?: boolean
   interrupt?: boolean
   onload?: () => void
}

export function useSound(
   src: string | string[],
   {
      volume = 1,
      playbackRate = 1,
      soundEnabled = true,
      interrupt = false,
      onload,
   }: HookOptions = {},
) {
   const audioRef = React.useRef<HTMLAudioElement | null>(null)
   const [duration, setDuration] = React.useState<number | null>(null)

   React.useEffect(() => {
      const audio = new Audio(Array.isArray(src) ? src[0] : src)
      audio.volume = volume
      audio.playbackRate = playbackRate

      audio.addEventListener("loadedmetadata", () => {
         setDuration(audio.duration * 1000)
         onload?.()
      })

      audioRef.current = audio

      return () => {
         audio.pause()
         audio.src = ""
      }
   }, [JSON.stringify(src), volume, playbackRate])

   const play = React.useCallback(
      (options?: PlayOptions) => {
         if (
            !audioRef.current ||
            (!soundEnabled && !options?.forceSoundEnabled)
         ) {
            return
         }

         if (interrupt) {
            audioRef.current.currentTime = 0
         }

         if (options?.playbackRate) {
            audioRef.current.playbackRate = options.playbackRate
         }

         audioRef.current.play()
      },
      [soundEnabled, interrupt],
   )

   const stop = React.useCallback(() => {
      if (!audioRef.current) return
      audioRef.current.pause()
      audioRef.current.currentTime = 0
   }, [])

   const pause = React.useCallback(() => {
      audioRef.current?.pause()
   }, [])

   return [
      play,
      {
         sound: audioRef.current,
         stop,
         pause,
         duration,
      },
   ] as const
}
