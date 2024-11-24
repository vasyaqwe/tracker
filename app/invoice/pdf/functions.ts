import { InvoicePdf } from "@/invoice/pdf"
import { generateInvoiceNumber } from "@/invoice/utils"
import { authMiddleware } from "@/utils/middleware"
import { renderToStream } from "@react-pdf/renderer"
import { createServerFn } from "@tanstack/start"
import { zodValidator } from "@tanstack/zod-adapter"
import { getEvent, setHeaders } from "vinxi/http"
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
      const buffer = Buffer.from(await new Response(stream).arrayBuffer())

      const base64Pdf = buffer.toString("base64")

      return handleResponse<{ base64Pdf: string; fileName: string }>(
         new Response(
            JSON.stringify({
               base64Pdf,
               fileName: `invoice-${invoiceNumber}.pdf`,
            }),
            {
               headers: {
                  "Content-Type": "application/json",
               },
            },
         ),
      )
   })

// temporary fix
async function handleResponse<ResponseBody = unknown>(
   response: Response,
): Promise<ResponseBody> {
   const event = getEvent()
   setHeaders(event, Object.fromEntries(response.headers))
   return response.json() as ResponseBody
}
