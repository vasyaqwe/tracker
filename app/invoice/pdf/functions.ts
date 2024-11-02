import { InvoicePdf } from "@/invoice/pdf"
import { generateInvoiceNumber } from "@/invoice/utils"
import { protectedProcedure } from "@/lib/trpc"
import { renderToStream } from "@react-pdf/renderer"
import { createServerFn } from "@tanstack/start"
import { z } from "zod"

export const generate = createServerFn(
   "GET",
   protectedProcedure
      .input(
         z.object({
            name: z.string().min(1),
            email: z.string(),
            amount: z.number(),
            selectedItems: z.array(
               z.object({ price: z.number(), description: z.string() }),
            ),
         }),
      )
      .query(async ({ ctx, input }) => {
         const invoiceNumber = generateInvoiceNumber()
         const stream = await renderToStream(
            await InvoicePdf({
               amount: input.amount,
               dueDate: new Date().getTime(),
               invoiceNumber,
               issueDate: new Date().getTime(),
               lineItems: input.selectedItems.map((item) => ({
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
                              text: ctx.user.name,
                           },
                        ],
                     },
                     {
                        type: "paragraph",
                        content: [
                           {
                              type: "text",
                              text: ctx.user.email,
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
                              text: input.name,
                           },
                        ],
                     },
                     {
                        type: "paragraph",
                        content: [
                           {
                              type: "text",
                              text: input.email,
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
      }),
)
