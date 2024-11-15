import { InvoicePdf } from "@/invoice/pdf"
import { generateInvoiceNumber } from "@/invoice/utils"
import { authMiddleware } from "@/utils/middleware"
import { renderToStream } from "@react-pdf/renderer"
import { createServerFn } from "@tanstack/start"
import { zodValidator } from "@tanstack/zod-adapter"
import { z } from "zod"

export const generate = createServerFn({ method: "GET" })
   .middleware([authMiddleware])
   .validator(
      zodValidator(
         z.object({
            name: z.string().min(1),
            email: z.string(),
            amount: z.number(),
            selectedItems: z.array(
               z.object({ price: z.number(), description: z.string() }),
            ),
         }),
      ),
   )
   .handler(async ({ context, data }) => {
      const invoiceNumber = generateInvoiceNumber()
      const stream = await renderToStream(
         await InvoicePdf({
            amount: data.amount,
            dueDate: new Date().getTime(),
            invoiceNumber,
            issueDate: new Date().getTime(),
            lineItems: data.selectedItems.map((item) => ({
               name: item.description,
               price: item.price,
               quantity: 1,
            })),
            fromDetails: {
               content: [
                  {
                     type: "paragraph",
                     content: [
                        {
                           type: "text",
                           text: context.user.name,
                        },
                     ],
                  },
                  {
                     type: "paragraph",
                     content: [
                        {
                           type: "text",
                           text: context.user.email,
                        },
                     ],
                  },
               ],
               type: "doc",
            },
            customerDetails: {
               content: [
                  {
                     type: "paragraph",
                     content: [
                        {
                           type: "text",
                           text: data.name,
                        },
                     ],
                  },
                  {
                     type: "paragraph",
                     content: [
                        {
                           type: "text",
                           text: data.email,
                        },
                     ],
                  },
               ],
               type: "doc",
            },

            size: "a4",
         }),
      )

      // @ts-expect-error ...
      const blob = await new Response(stream).blob()

      return new Response(blob, {
         headers: {
            "Content-Type": "application/pdf",
            "Cache-Control": "no-store, max-age=0",
            "Content-Disposition": `attachment; filename="invoice-${invoiceNumber}.pdf"`,
            "X-Invoice-Number": invoiceNumber, // Add invoice number as a custom header
         },
      })
   })
