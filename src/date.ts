import { LOCALE } from "@/number"

export const today = () => new Date().toLocaleDateString("en-CA")

const parseDay = (day: string) => {
   const [year = 0, month = 1, date = 1] = day.split("-").map(Number)
   return new Date(year, month - 1, date)
}

export const formatDay = (day: string) => {
   const yesterday = new Date()
   yesterday.setDate(yesterday.getDate() - 1)

   if (day === today()) return "Today"
   if (day === yesterday.toLocaleDateString("en-CA")) return "Yesterday"

   const date = parseDay(day)
   return date.toLocaleDateString(LOCALE, {
      month: "short",
      day: "numeric",
      year:
         date.getFullYear() === new Date().getFullYear()
            ? undefined
            : "numeric",
   })
}

export const formatDuration = (seconds: number) => {
   const hours = Math.floor(seconds / 3600)
   const minutes = Math.floor((seconds % 3600) / 60)
   if (hours === 0 && minutes === 0) return `${seconds}s`
   if (hours === 0) return `${minutes}m`
   if (minutes === 0) return `${hours}h`

   return `${hours}h ${minutes}m`
}

export const formatElapsed = (ms: number) => {
   const seconds = Math.floor(ms / 1000)
   const pad = (value: number) => value.toString().padStart(2, "0")

   return `${pad(Math.floor(seconds / 3600))}:${pad(Math.floor((seconds % 3600) / 60))}:${pad(seconds % 60)}`
}
