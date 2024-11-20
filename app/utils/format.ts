export const formatDateRelative = (
   date: Date | number,
   style?: Intl.RelativeTimeFormatStyle,
) => {
   // Allow dates or times to be passed
   const timeMs = typeof date === "number" ? date : date.getTime()

   // Get the amount of seconds between the given date and now
   const deltaSeconds = Math.round((Date.now() - timeMs) / 1000) // Changed this line

   if (Math.abs(deltaSeconds) < 60) return "just now"

   // Array representing one minute, hour, day, week, month, etc in seconds
   const cutoffs = [
      60,
      3600,
      86400,
      86400 * 7,
      86400 * 30,
      86400 * 365,
      Infinity,
   ]

   // Array equivalent to the above but in the string representation of the units
   const units: Intl.RelativeTimeFormatUnit[] = [
      "second",
      "minute",
      "hour",
      "day",
      "week",
      "month",
      "year",
   ]

   // Grab the ideal cutoff unit
   const unitIndex = cutoffs.findIndex(
      (cutoff) => cutoff > Math.abs(deltaSeconds),
   )

   // Get the divisor to divide from the seconds. E.g. if our unit is "day" our divisor
   // is one day in seconds, so we can divide our seconds by this to get the # of days
   const divisor = unitIndex ? cutoffs[unitIndex - 1] : 1
   const unit = units[unitIndex]

   if (!divisor || !unit) return ""

   // Intl.RelativeTimeFormat do its magic
   const rtf = new Intl.RelativeTimeFormat("en-US", { numeric: "auto", style })
   return rtf.format(-Math.floor(deltaSeconds / divisor), unit) // Added negative sign here
}

export const formatDateIntl = (
   date: Date | string | number,
   options: Intl.DateTimeFormatOptions = {},
) =>
   new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      ...options,
   }).format(new Date(date))

export const formatDate = (input: number) => {
   const date = new Date(input)

   const now = new Date()
   const yesterday = new Date(now)

   yesterday.setDate(now.getDate() - 1)

   const beforeYesterday = new Date(now)
   beforeYesterday.setDate(now.getDate() - 2)

   if (date.toDateString() === now.toDateString()) {
      return "Today"
   }
   if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday"
   }

   return formatDateIntl(input)
}

export const millisToMinutes = (millis: number) => {
   const minutes = Math.floor(millis / 60000)

   return minutes
}

export const formatTime = (
   minutes: number,
   opts: {
      short: boolean
   } = { short: true },
): string => {
   const remainingHours = Math.floor(minutes / 60)
   const remainingMinutes = minutes % 60

   const minutesDisplay = opts.short
      ? `${remainingMinutes}m`
      : `${remainingMinutes} minutes`
   const hoursDisplay = opts.short
      ? `${remainingHours}h`
      : `${remainingHours} hours${remainingMinutes === 0 ? "" : ","}`

   const minutesResult = remainingMinutes === 0 ? "" : minutesDisplay
   const hoursResult = remainingHours === 0 ? "" : hoursDisplay

   return `${hoursResult} ${minutesResult}`
}

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

export const formatNumber = (value: number) => {
   const formatter = new Intl.NumberFormat("en-US", {
      maximumFractionDigits: 1,
   })

   if (value >= 1_000_000) {
      return `${formatter.format(value / 1_000_000)}M`
   }
   if (value >= 1_000) {
      return `${formatter.format(value / 1_000)}K`
   }
   return formatter.format(value)
}

export const formatCurrency = (
   price: number,
   options: Intl.NumberFormatOptions = {},
) => {
   return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: options.currency ?? "USD",
      notation: options.notation ?? "compact",
      ...options,
   }).format(Number(price))
}
