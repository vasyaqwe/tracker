import { b58 } from "@/db/utils"

export const generateInvoiceNumber = () => {
   const date = new Date()
   const year = date.getFullYear().toString().slice(-2)
   const month = (date.getMonth() + 1).toString().padStart(2, "0")
   const day = date.getDate().toString().padStart(2, "0")
   const random = b58
      .encode(crypto.getRandomValues(new Uint8Array(3)))
      .toUpperCase()

   return `${year}${month}${day}-${random}`
}
