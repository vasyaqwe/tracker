export const LOCALE = "en-US"

export const toMinor = (amount: number) => Math.round(amount * 100)

export const fromMinor = (amount: number) => amount / 100

export const formatMoney = (amount: number) =>
   new Intl.NumberFormat(LOCALE, {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 2,
   }).format(fromMinor(amount))
