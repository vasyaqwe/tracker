export const calculateAmountEarned = (
   durationMs: number,
   hourlyRate: number,
) => {
   const hours = durationMs / 3600000
   return hours * hourlyRate
}

export const remainingTimeUntil = (expiresAt: Date) => {
   const currentTime = Date.now()
   const remainingTime = expiresAt.getTime() - currentTime
   return formatRemainingTime(remainingTime)
}

export const formatRemainingTime = (milliseconds: number) => {
   const totalSeconds = Math.floor(milliseconds / 1000)
   const days = Math.floor(totalSeconds / (3600 * 24))
   const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600)
   const minutes = Math.floor((totalSeconds % 3600) / 60)

   if (days > 0) return `${days} day${days > 1 ? "s" : ""}`
   if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""}`
   if (minutes > 0) return `${minutes} minute${minutes > 1 ? "s" : ""}`

   return "less than a minute"
}
